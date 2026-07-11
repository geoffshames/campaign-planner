#!/usr/bin/env python3
"""Guardrails for automated EKATOR dashboard updates.

Runs source and rendered-route scrubs so scheduled agents cannot publish
internal process language, speculative paid-test copy, or hidden implementation notes.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import urllib.request
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[2]
SOURCE_FILES = [
    ROOT / "src/components/campaign/EkatorCommandCenter.tsx",
    ROOT / "src/lib/ekator-dashboard.ts",
    ROOT / "src/app/ekator/page.tsx",
    ROOT / "src/app/campaign/ekator/page.tsx",
]

# These phrases should not appear in EKATOR public/source copy.
SOURCE_FORBIDDEN = [
    "Keep paid reporting separate",
    "Paid reporting",
    "paid reporting",
    "dashboard should",
    "should not blend",
    "blend paid",
    "owned performance",
    "modeled assumptions",
    "Reporting status",
    "reporting fields",
    "Paid media reporting",
    "Awaiting launch",
    "paid-test",
    "paid test",
    "Paid test",
    "test cells",
    "Test cells",
    "spend gate",
    "scale decision",
    "module becomes",
    "This module",
    "implementation note",
    "agent prompt",
    "what needs access",
    "Crowd Control Digital",
    "CCD",
    "Geoff",
]

# These may legitimately exist server-side, but must never leak into rendered HTML.
RENDERED_ONLY_FORBIDDEN = [
    "service role",
    "SUPABASE_",
    "VERCEL_TOKEN",
    "GITHUB_PAT",
    "cron job",
    "Agents launched",
]

# Minimal public-facing anchors expected on both routes.
REQUIRED = [
    "EKATOR Social Dashboard",
    "EKATOR COMMAND CENTER",
    "Owned Audience",
    "7-Day Growth",
    "Measured Engagement",
    "Measured Attention",
    "Audience Momentum",
    "Engagement Health",
    "Sentiment Pulse",
    "Winning",
    "Risk",
    "Next move",
    "Owned Channels",
    "Asset Performance",
    "Owned publications",
    "Measured performance",
    "Awaiting metrics",
    "Last refreshed",
    "verified platform post URLs",
    "views + interactions connected",
    "Actionable Insights",
    "Measurement Layers",
    "Hover or focus any bar",
    "views/day",
    "Interaction velocity",
    "interactions/day",
    "Ranked moves for the next 72 hours",
    "Paid Media",
    "NOT LIVE",
]

ROUTES = ["/ekator", "/campaign/ekator"]


def normalize_html(html: str) -> str:
    text = re.sub(r"<script[\s\S]*?</script>", " ", html, flags=re.I)
    text = re.sub(r"<style[\s\S]*?</style>", " ", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def scan_text(label: str, text: str, required: Iterable[str] | None = None, rendered: bool = False) -> list[dict[str, str]]:
    failures: list[dict[str, str]] = []
    lower = text.lower()
    forbidden = SOURCE_FORBIDDEN + (RENDERED_ONLY_FORBIDDEN if rendered else [])
    for phrase in forbidden:
        if phrase.lower() in lower:
            idx = lower.find(phrase.lower())
            around = text[max(0, idx - 120): idx + len(phrase) + 120]
            failures.append({"label": label, "type": "forbidden", "phrase": phrase, "context": around})
    for phrase in required or []:
        if phrase not in text:
            failures.append({"label": label, "type": "missing", "phrase": phrase, "context": ""})
    return failures


def run(cmd: list[str]) -> tuple[int, str]:
    proc = subprocess.run(cmd, cwd=ROOT, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    return proc.returncode, proc.stdout


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Cache-Control": "no-cache", "Pragma": "no-cache"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read().decode("utf-8", "ignore")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", help="Rendered site base URL to scrub, e.g. http://127.0.0.1:3043 or https://campaign.crowdcontroldigital.com")
    parser.add_argument("--build", action="store_true", help="Run npm lint + build before route checks")
    parser.add_argument("--json", action="store_true", help="Print machine-readable result")
    args = parser.parse_args()

    failures: list[dict[str, str]] = []
    checked: list[str] = []

    for path in SOURCE_FILES:
        if path.exists():
            checked.append(str(path.relative_to(ROOT)))
            # Source scan uses forbidden phrases only. Some public anchors may only exist in rendered output.
            failures.extend(scan_text(str(path.relative_to(ROOT)), path.read_text(errors="ignore")))
        else:
            failures.append({"label": str(path), "type": "missing_file", "phrase": str(path), "context": ""})

    build_output = ""
    if args.build:
        for cmd in (["npm", "run", "lint"], ["npm", "run", "build"]):
            code, out = run(list(cmd))
            build_output += f"\n$ {' '.join(cmd)}\n{out}"
            if code != 0:
                failures.append({"label": "build", "type": "command_failed", "phrase": " ".join(cmd), "context": out[-2000:]})
                break

    if args.base_url:
        base = args.base_url.rstrip("/")
        for route in ROUTES:
            url = base + route
            checked.append(url)
            try:
                html = fetch(url)
                text = normalize_html(html)
                failures.extend(scan_text(url, text, REQUIRED, rendered=True))
            except Exception as exc:  # noqa: BLE001
                failures.append({"label": url, "type": "fetch_failed", "phrase": str(exc), "context": ""})

    result = {
        "ok": not failures,
        "checked": checked,
        "failures": failures,
        "build_output_tail": build_output[-4000:],
    }
    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        if result["ok"]:
            print("EKATOR_GUARD_OK")
            for item in checked:
                print(f"checked: {item}")
        else:
            print("EKATOR_GUARD_FAILED")
            for failure in failures:
                print(f"[{failure['type']}] {failure['label']} :: {failure['phrase']}")
                if failure.get("context"):
                    print(f"  {failure['context']}")
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
