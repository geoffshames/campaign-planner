#!/usr/bin/env python3
from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LIB = (ROOT / "src/lib/ekator-dashboard.ts").read_text()
COMPONENT = (ROOT / "src/components/campaign/EkatorCommandCenter.tsx").read_text()
GUARD = (ROOT / "scripts/ekator/guard_dashboard.py").read_text()
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

    def test_public_interaction_rate_uses_one_view_weighted_denominator(self) -> None:
        self.assertIn("function interactionRate", COMPONENT)
        self.assertIn("knownInteractions(asset) / asset.views", COMPONENT)
        self.assertIn("Interaction rate", COMPONENT)
        self.assertIn("View-weighted", COMPONENT)
        self.assertNotIn("asset.engagementRate", COMPONENT)
        self.assertNotIn("engagementRate:", LIB)

    def test_last_refreshed_is_explicit_and_includes_time(self) -> None:
        self.assertIn("Last refreshed", COMPONENT)
        self.assertIn("hour:", COMPONENT)
        self.assertIn("minute:", COMPONENT)

    def test_age_normalized_pacing_is_labeled_as_since_publish(self) -> None:
        self.assertIn("Average view pace since publish", COMPONENT)
        self.assertIn("views/day since publish", COMPONENT)
        self.assertIn("Average interaction pace since publish", COMPONENT)
        self.assertIn("interactions/day since publish", COMPONENT)
        self.assertNotIn("Daily Velocity", COMPONENT)
        self.assertNotIn("Interaction velocity", COMPONENT)

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
            "Measured Interaction",
            "Measured Attention",
            "Audience Momentum",
            "Interaction Health",
            "Sentiment Pulse",
            "Not yet measured",
            "Winning",
            "Risk",
            "Next move",
        ):
            self.assertIn(label, COMPONENT)
        self.assertIn("function buildAudienceTimeline", COMPONENT)
        self.assertIn("function deriveSevenDayAudienceGrowth", COMPONENT)
        self.assertIn("function derivePortfolioInteraction", COMPONENT)

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

    def test_route_guard_matches_the_evergreen_hero_contract(self) -> None:
        for current_anchor in (
            "Owned Audience",
            "7-Day Growth",
            "Measured Interaction",
            "Measured Attention",
            "Audience Momentum",
            "Interaction Health",
            "Sentiment Pulse",
            "Winning",
            "Risk",
            "Next move",
        ):
            self.assertIn(current_anchor, GUARD)
        for removed_anchor in (
            "72-Hour Queue",
            "Channel Pulse",
            "View Concentration",
            "EP1 Gravity",
            "Follower Delta",
            "Since baseline",
        ):
            self.assertNotIn(removed_anchor, GUARD)

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

    def test_weekly_moves_prioritize_current_cross_platform_hook_evidence(self) -> None:
        for current_move in (
            "Scale the strongest cross-platform hook now",
            "Bridge short-form momentum into Episode",
            "Turn the highest-response hook into a follow-up",
            "Activate TikTok with the proven campaign cuts",
            "Build an Episode",
        ):
            self.assertIn(current_move, COMPONENT)
        self.assertIn("function buildMatchedCrossPlatformCuts", COMPONENT)
        self.assertIn("function matchedCutStats", COMPONENT)
        self.assertIn("const reachLeader", COMPONENT)
        self.assertIn("const responseLeader", COMPONENT)
        self.assertIn("combinedViews", COMPONENT)
        self.assertIn("interactionRate", COMPONENT)
        self.assertIn("firstEpisode.episodeNumber !== newestEpisode.episodeNumber", COMPONENT)
        self.assertIn("These cumulative totals cover different live windows", COMPONENT)
        self.assertIn("A current cross-platform hook and canonical newest episode are not both available", COMPONENT)
        self.assertIn("Fewer than two matched Reel and Short pairs are currently available", COMPONENT)
        self.assertNotIn("No second matched Reel and Short pair is currently available", COMPONENT)
        self.assertNotIn("No matching Instagram preview is currently identified for the newest full episode", COMPONENT)
        self.assertNotIn("Only one current matched Reel and Short pair is available", COMPONENT)
        self.assertNotIn("Turn schedule-change attention into a viewing bridge", COMPONENT)

    def test_newest_episode_insight_uses_only_the_canonical_full_episode_metric(self) -> None:
        self.assertIn("Finale preview", COMPONENT)
        self.assertIn("publicationTime(asset) > newestFullEpisodeAt", COMPONENT)
        self.assertIn("fullEpisodeNumberFromCaption(asset.caption) === null", COMPONENT)
        self.assertIn("Newest episode signal", COMPONENT)
        self.assertIn("newestEpisodeAsset", COMPONENT)
        self.assertIn("newestEpisodeViews", COMPONENT)
        self.assertIn("newestEpisodeInteractions", COMPONENT)
        self.assertIn("Companion short-form posts show which hooks to repeat", COMPONENT)
        self.assertNotIn("newestEpisodeAssets", COMPONENT)
        self.assertNotIn("newestEpisodeViewBreakdown", COMPONENT)
        self.assertNotIn("Current interaction leader", COMPONENT)

    def test_public_copy_uses_words_instead_of_progression_arrows(self) -> None:
        self.assertNotIn("→", COMPONENT)

    def test_mobile_navigation_fits_the_primary_route_labels(self) -> None:
        self.assertIn("justify-start gap-2 overflow-x-auto", COMPONENT)
        self.assertIn("min-h-11 min-w-11", COMPONENT)

    def test_interaction_terminology_is_consistent_in_public_and_internal_contracts(self) -> None:
        for current_term in (
            "Measured Interaction",
            "Interaction Health",
            "InteractionSnapshot",
            "youtubeInteractionRate",
            "interaction-rate-desc",
        ):
            self.assertIn(current_term, COMPONENT)
        for stale_term in (
            "Measured Engagement",
            "Engagement Health",
            "EngagementSnapshot",
            "youtubeEngagement",
            "engagement-desc",
        ):
            self.assertNotIn(stale_term, COMPONENT)

    def test_youtube_taxonomy_separates_episodes_from_other_publications(self) -> None:
        self.assertIn("function fullEpisodeNumberFromCaption", COMPONENT)
        self.assertIn("const episodeAssets", COMPONENT)
        self.assertIn("other YouTube publications", COMPONENT)
        self.assertIn("Episode anchors", COMPONENT)
        for stale_taxonomy in (
            "const ep1 = published.find",
            "const shorts = published.filter",
            "shorts hold",
            "const ep1Asset",
        ):
            self.assertNotIn(stale_taxonomy, COMPONENT)

    def test_full_episode_anchors_exclude_localized_preview_markers(self) -> None:
        self.assertIn("function fullEpisodeNumberFromCaption", COMPONENT)
        self.assertIn("caption.match(/\\b(?:EP\\.?|Episode)\\s*(\\d+)\\b/)", COMPONENT)
        self.assertIn("fullEpisodeNumberFromCaption(asset.caption)", COMPONENT)
        self.assertIn("const newestEpisodeAsset = newestFullEpisode?.asset", COMPONENT)
        self.assertNotIn("function episodeNumberFromCaption", COMPONENT)
        self.assertNotIn("(\\d+)\\s*화", COMPONENT)

    def test_paid_copy_uses_the_verified_partial_coverage_state(self) -> None:
        self.assertIn("NO VERIFIED DELIVERY", COMPONENT)
        self.assertIn("NO VERIFIED DELIVERY", GUARD)
        self.assertIn("No verified paid delivery is available", COMPONENT)
        self.assertNotIn("NOT LIVE YET", COMPONENT)
        self.assertNotIn("UNVERIFIED", COMPONENT)
        for overconfident_claim in (
            "No campaigns are live",
            "No paid campaigns are live",
            "Paid media is not live yet",
            "Maintain the measurement boundary",
            "Keep the delivery section marked Not live",
        ):
            self.assertNotIn(overconfident_claim, COMPONENT)

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
