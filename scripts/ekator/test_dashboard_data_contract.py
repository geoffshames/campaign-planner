#!/usr/bin/env python3
from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LIB = (ROOT / "src/lib/ekator-dashboard.ts").read_text()
COMPONENT = (ROOT / "src/components/campaign/EkatorCommandCenter.tsx").read_text()
HERO = COMPONENT.split("function CommandCenter", 1)[1].split("/* ── DETAIL SECTIONS", 1)[0]
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

    def test_instagram_reel_views_roll_up_across_the_dashboard(self) -> None:
        self.assertIn("const instagramViews", COMPONENT)
        self.assertIn("views: instagramViewCount > 0 ? instagramViews : null", COMPONENT)
        self.assertIn("posts with views", COMPONENT)
        for stale_claim in (
            "Public view counts are not available from this feed.",
            "Public post views are unavailable from this feed.",
            "Public view counts are unavailable from this feed.",
        ):
            self.assertNotIn(stale_claim, COMPONENT)

    def test_hero_prioritizes_evergreen_campaign_health(self) -> None:
        for label in (
            "Owned Audience",
            "7-Day Growth",
            "Measured Engagement",
            "Measured Attention",
            "Audience Momentum",
            "Engagement Health",
            "Sentiment Pulse",
            "Not yet measured",
            "Winning",
            "Risk",
            "Next move",
        ):
            self.assertIn(label, COMPONENT)
        self.assertIn("function buildAudienceTimeline", COMPONENT)
        self.assertIn("function deriveSevenDayAudienceGrowth", COMPONENT)
        self.assertIn("function derivePortfolioEngagement", COMPONENT)

    def test_asset_specific_diagnostics_are_outside_the_hero(self) -> None:
        for stale_hero in (
            "YouTube EP1 Gravity",
            "Attention Mix",
            "Channel Pulse",
            "72-Hour Queue",
        ):
            self.assertNotIn(stale_hero, HERO)

    def test_follower_delta_panel_is_removed(self) -> None:
        self.assertNotIn("Follower Delta", COMPONENT)
        self.assertNotIn("follower lift", COMPONENT)
        self.assertNotIn("Since baseline", COMPONENT)
        self.assertNotIn("const followerRows", COMPONENT)

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

    def test_audience_momentum_uses_channel_history(self) -> None:
        for stale_literal in ("maxValue: 65_074", "TikTok 0.", "ch.posts === '0 videos'"):
            self.assertNotIn(stale_literal, COMPONENT)
        self.assertIn("channel?.history", COMPONENT)
        self.assertIn("channel.audience", COMPONENT)
        self.assertIn("Collecting 7-day baseline", COMPONENT)

    def test_youtube_shadowbox_normalizes_all_supported_publication_urls(self) -> None:
        self.assertIn("function youtubeEmbedUrl", COMPONENT)
        self.assertIn("/^\\/(?:shorts|live|embed)\\/", COMPONENT)
        self.assertIn("url.searchParams.get('v')", COMPONENT)
        self.assertIn("hostname === 'youtu.be'", COMPONENT)


if __name__ == "__main__":
    unittest.main()
