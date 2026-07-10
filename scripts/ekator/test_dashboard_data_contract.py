#!/usr/bin/env python3
from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LIB = (ROOT / "src/lib/ekator-dashboard.ts").read_text()
COMPONENT = (ROOT / "src/components/campaign/EkatorCommandCenter.tsx").read_text()
PAGES = "\n".join(
    (ROOT / path).read_text()
    for path in ("src/app/ekator/page.tsx", "src/app/campaign/ekator/page.tsx")
)


class DashboardDataContractTests(unittest.TestCase):
    def test_channel_snapshots_are_loaded_from_live_client_state(self) -> None:
        self.assertIn("export type EkatorChannelSnapshot", LIB)
        self.assertIn("export async function getEkatorChannelSnapshot", LIB)
        self.assertIn("getEkatorChannelSnapshot(),", LIB)
        self.assertIn("channelSnapshot={channelSnapshot}", PAGES)

    def test_interactions_count_as_measured_when_views_are_unavailable(self) -> None:
        self.assertIn("hasMeasuredMetrics(asset)", COMPONENT)
        self.assertNotIn("const hasPerformance = asset.views !== null;", COMPONENT)

    def test_last_refreshed_is_explicit_and_includes_time(self) -> None:
        self.assertIn("Last refreshed", COMPONENT)
        self.assertIn("hour:", COMPONENT)
        self.assertIn("minute:", COMPONENT)

    def test_daily_velocity_includes_interaction_pacing(self) -> None:
        self.assertIn("Interaction velocity", COMPONENT)
        self.assertIn("interactions/day", COMPONENT)

    def test_follower_delta_is_not_a_static_placeholder(self) -> None:
        self.assertNotIn("const followerBaselines", COMPONENT)
        self.assertIn("channelSnapshot", COMPONENT)
        self.assertIn("Since baseline", COMPONENT)

    def test_insights_and_ranked_moves_use_current_measurements(self) -> None:
        self.assertIn("function buildInsights", COMPONENT)
        self.assertIn("function buildRecommendations", COMPONENT)
        self.assertIn("knownInteractions(asset)", COMPONENT)
        for stale_claim in (
            "stat: '94.2%'",
            "stat: '65.1K'",
            "stat: '11.8K / 0'",
            "stat: 'Priority 1'",
            "controlled 12-clip test",
        ):
            self.assertNotIn(stale_claim, COMPONENT)

    def test_measurement_layer_audiences_are_not_hard_coded(self) -> None:
        for stale_audience in ("5.28K subs", "65.1K followers", "11.8K followers"):
            self.assertNotIn(stale_audience, COMPONENT)
        self.assertIn("platformPostCount('tiktok'", COMPONENT)

    def test_channel_visuals_do_not_embed_snapshot_metrics(self) -> None:
        for stale_literal in ("maxValue: 65_074", "TikTok 0.", "ch.posts === '0 videos'"):
            self.assertNotIn(stale_literal, COMPONENT)
        self.assertIn("maxValue: maxAudience", COMPONENT)
        self.assertIn("ch.postCount / maxPosts", COMPONENT)

    def test_youtube_shadowbox_normalizes_all_supported_publication_urls(self) -> None:
        self.assertIn("function youtubeEmbedUrl", COMPONENT)
        self.assertIn("/^\\/(?:shorts|live|embed)\\/", COMPONENT)
        self.assertIn("url.searchParams.get('v')", COMPONENT)
        self.assertIn("hostname === 'youtu.be'", COMPONENT)


if __name__ == "__main__":
    unittest.main()
