#!/usr/bin/env python3
"""Normalize and persist EKATOR owned-social snapshots.

The collector agent writes a source payload (channels + canonical owned posts), then
this script performs deterministic validation and Supabase upserts. Missing metrics
remain null; they are never coerced to zero.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple
from zoneinfo import ZoneInfo

PACIFIC = ZoneInfo("America/Los_Angeles")
CANONICAL_PATTERNS = {
    "youtube": re.compile(r"(?:youtube\.com/(?:watch\?v=|shorts/)|youtu\.be/)([A-Za-z0-9_-]{6,})", re.I),
    "instagram": re.compile(r"instagram\.com/(?:p|reel|tv)/([A-Za-z0-9_-]+)", re.I),
    "tiktok": re.compile(r"tiktok\.com/@[^/]+/video/(\d+)", re.I),
}


def _integer(value: Any) -> Optional[int]:
    if value is None or value == "":
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _iso(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        raise ValueError("captured_at must include a timezone")
    return parsed


def _pacific_day(value: str) -> str:
    return _iso(value).astimezone(PACIFIC).date().isoformat()


def canonical_external_id(platform: str, url: str) -> str:
    pattern = CANONICAL_PATTERNS.get(platform)
    match = pattern.search(url) if pattern else None
    if not match:
        raise ValueError(f"{platform or 'unknown'} post is missing a canonical owned post URL")
    return match.group(1)


def normalize_post(
    raw: Dict[str, Any],
    *,
    audience: Optional[int],
    captured_at: str,
    client_id: str,
) -> Dict[str, Dict[str, Any]]:
    platform = str(raw.get("platform") or "").strip().lower()
    url = str(raw.get("url") or "").strip()
    external_id = canonical_external_id(platform, url)
    item_id = str(raw.get("item_id") or f"owned_{platform}_{external_id}")
    published_at = str(raw.get("published_at") or "").strip()
    if not published_at:
        raise ValueError(f"{item_id} is missing published_at")

    views = _integer(raw.get("views"))
    if platform == "instagram" and views == 0:
        views = None
    likes = _integer(raw.get("likes"))
    comments = _integer(raw.get("comments"))
    shares = _integer(raw.get("shares"))
    known_interactions = sum(value or 0 for value in (likes, comments, shares))
    denominator = views
    engagement_rate = None
    if denominator and denominator > 0 and any(value is not None for value in (likes, comments, shares)):
        engagement_rate = round((known_interactions / denominator) * 100, 4)

    return {
        "item": {
            "item_id": item_id,
            "client_id": client_id,
            "platform": platform,
            "handle": str(raw.get("handle") or "idoltillidie"),
            "caption": str(raw.get("caption") or "Untitled owned post"),
            "post_date": published_at[:10],
            "source_url": url,
            "status": "published",
            "is_owned": True,
        },
        "performance": {
            "item_id": item_id,
            "captured_at": captured_at,
            "views": views,
            "likes": likes,
            "comments": comments,
            "shares": shares,
            "engagement_rate": engagement_rate,
            "paid": False,
        },
    }


def _publication_key(platform: str, url: str) -> Optional[str]:
    try:
        return f"{platform}:{canonical_external_id(platform, url)}"
    except ValueError:
        return None


def reuse_existing_item_ids(
    normalized: List[Dict[str, Dict[str, Any]]],
    existing_items: Iterable[Dict[str, Any]],
) -> int:
    """Reuse ledger IDs when the same canonical publication URL already exists."""
    existing_by_publication: Dict[str, str] = {}
    for row in existing_items:
        item_id = str(row.get("item_id") or "")
        if not item_id:
            continue
        urls = [row.get(key) for key in ("source_url", "post_url", "permalink", "url")]
        declared_platform = str(row.get("platform") or "").strip().lower()
        candidate_platforms = [declared_platform, *CANONICAL_PATTERNS.keys()]
        for value in urls:
            if not isinstance(value, str) or not value.strip():
                continue
            for platform in dict.fromkeys(candidate_platforms):
                key = _publication_key(platform, value.strip())
                if key:
                    existing_by_publication.setdefault(key, item_id)
                    break

    reused = 0
    for row in normalized:
        item = row["item"]
        performance = row["performance"]
        key = _publication_key(str(item.get("platform") or ""), str(item.get("source_url") or ""))
        existing_id = existing_by_publication.get(key or "")
        if existing_id and existing_id != item.get("item_id"):
            item["item_id"] = existing_id
            performance["item_id"] = existing_id
            reused += 1
    return reused


def merge_channel_history(
    existing: Iterable[Dict[str, Any]],
    incoming: Iterable[Dict[str, Any]],
    captured_at: str,
) -> List[Dict[str, Any]]:
    existing_by_platform = {
        str(channel.get("platform") or "").lower(): dict(channel)
        for channel in existing
        if channel.get("platform")
    }
    merged: List[Dict[str, Any]] = []
    incoming_platforms = set()
    current_day = _pacific_day(captured_at)

    for raw in incoming:
        platform = str(raw.get("platform") or "").strip().lower()
        if not platform:
            raise ValueError("channel snapshot is missing platform")
        incoming_platforms.add(platform)
        previous = existing_by_platform.get(platform, {})
        history: List[Dict[str, Any]] = []
        for candidate_history in (previous.get("history"), raw.get("history")):
            if isinstance(candidate_history, list):
                history.extend(dict(point) for point in candidate_history if isinstance(point, dict))
        history = [point for point in history if point.get("captured_at") and _pacific_day(str(point["captured_at"])) != current_day]
        point = {
            "captured_at": captured_at,
            "audience": _integer(raw.get("audience")),
            "post_count": _integer(raw.get("post_count")),
        }
        history.append(point)
        history.sort(key=lambda point_: str(point_.get("captured_at") or ""))
        history = history[-180:]
        merged.append(
            {
                "platform": platform,
                "handle": str(raw.get("handle") or previous.get("handle") or ""),
                "audience": point["audience"],
                "post_count": point["post_count"],
                "captured_at": captured_at,
                "history": history,
            }
        )

    for platform, channel in existing_by_platform.items():
        if platform not in incoming_platforms:
            merged.append(channel)
    return merged


class SupabaseRest:
    def __init__(self, base_url: str, service_key: str) -> None:
        self.base_url = base_url.rstrip("/")
        self.headers = {
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json",
        }

    def request(
        self,
        method: str,
        path: str,
        payload: Any = None,
        prefer: Optional[str] = None,
    ) -> Any:
        headers = dict(self.headers)
        if prefer:
            headers["Prefer"] = prefer
        data = json.dumps(payload).encode("utf-8") if payload is not None else None
        request = urllib.request.Request(self.base_url + path, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                body = response.read()
                return json.loads(body) if body else None
        except urllib.error.HTTPError as error:
            detail = error.read().decode("utf-8", "ignore")
            raise RuntimeError(f"Supabase {method} {path} failed ({error.code}): {detail}") from error


def load_env(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        os.environ.setdefault(key, value.strip().strip('"').strip("'"))


def resolve_supabase() -> Tuple[str, str]:
    base = os.getenv("SUPABASE_EKATOR_URL") or os.getenv("SUPABASE_SINCERITY_STUDIOS_URL")
    key = os.getenv("SUPABASE_EKATOR_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_SINCERITY_STUDIOS_SERVICE_ROLE_KEY")
    if not base or not key:
        raise RuntimeError("EKATOR Supabase URL/service role key are unavailable")
    return base, key


def sync(payload: Dict[str, Any], *, dry_run: bool = False) -> Dict[str, Any]:
    captured_at = str(payload.get("captured_at") or "")
    _iso(captured_at)
    channels = payload.get("channels") or []
    posts = payload.get("posts") or []
    if not isinstance(channels, list) or not isinstance(posts, list):
        raise ValueError("channels and posts must be arrays")

    base, key = resolve_supabase()
    api = SupabaseRest(base, key)
    clients = api.request("GET", "/rest/v1/cc_clients?select=client_id,own_handles&slug=eq.ekator&limit=1")
    if not clients:
        raise RuntimeError("EKATOR client row was not found")
    client = clients[0]
    client_id = str(client["client_id"])
    audience_by_platform = {
        str(channel.get("platform") or "").lower(): _integer(channel.get("audience"))
        for channel in channels
    }
    normalized = [
        normalize_post(
            post,
            audience=audience_by_platform.get(str(post.get("platform") or "").lower()),
            captured_at=captured_at,
            client_id=client_id,
        )
        for post in posts
    ]
    existing_items = api.request(
        "GET",
        f"/rest/v1/cc_items?select=*&client_id=eq.{urllib.parse.quote(client_id, safe='')}&limit=1000",
    ) or []
    reused_item_ids = reuse_existing_item_ids(normalized, existing_items)
    channel_state = merge_channel_history(client.get("own_handles") or [], channels, captured_at)
    summary = {
        "captured_at": captured_at,
        "client_id": client_id,
        "channels": len(channel_state),
        "publications": len(normalized),
        "reused_item_ids": reused_item_ids,
        "publications_by_platform": {
            platform: sum(1 for row in normalized if row["item"]["platform"] == platform)
            for platform in sorted({row["item"]["platform"] for row in normalized})
        },
        "dry_run": dry_run,
    }
    if dry_run:
        return summary

    items = [row["item"] for row in normalized]
    performance = [row["performance"] for row in normalized]
    if items:
        api.request(
            "POST",
            "/rest/v1/cc_items?on_conflict=item_id",
            items,
            "resolution=merge-duplicates,return=minimal",
        )
    if performance:
        api.request(
            "POST",
            "/rest/v1/cc_performance?on_conflict=item_id",
            performance,
            "resolution=merge-duplicates,return=minimal",
        )
    api.request(
        "PATCH",
        f"/rest/v1/cc_clients?client_id=eq.{urllib.parse.quote(client_id, safe='')}",
        {"own_handles": channel_state, "last_ingest": captured_at},
        "return=minimal",
    )
    return summary


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Collector JSON payload")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument(
        "--env-file",
        default=str(Path.home() / ".hermes/secrets/crowd-control-digital.env"),
    )
    args = parser.parse_args()
    load_env(Path(args.env_file))
    payload = json.loads(Path(args.input).read_text())
    result = sync(payload, dry_run=args.dry_run)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
