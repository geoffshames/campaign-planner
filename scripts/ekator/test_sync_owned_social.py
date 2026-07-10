#!/usr/bin/env python3
from __future__ import annotations

import unittest

from sync_owned_social import merge_channel_history, normalize_post, reuse_existing_item_ids


class NormalizePostTests(unittest.TestCase):
    def test_instagram_metrics_without_views_are_preserved_as_measured(self) -> None:
        post = normalize_post(
            {
                "platform": "instagram",
                "external_id": "3938216463586221600",
                "url": "https://www.instagram.com/p/DanWwIQpt7o/",
                "caption": "Team proof",
                "published_at": "2026-07-10T14:01:01Z",
                "views": None,
                "likes": 946,
                "comments": 24,
                "shares": None,
            },
            audience=65_074,
            captured_at="2026-07-10T18:00:00Z",
            client_id="client-1",
        )

        self.assertEqual(post["item"]["item_id"], "owned_instagram_DanWwIQpt7o")
        self.assertIsNone(post["performance"]["views"])
        self.assertEqual(post["performance"]["likes"], 946)
        self.assertEqual(post["performance"]["comments"], 24)
        self.assertAlmostEqual(post["performance"]["engagement_rate"], 1.4906, places=4)

    def test_raw_media_url_is_not_accepted_as_a_publication(self) -> None:
        with self.assertRaisesRegex(ValueError, "canonical owned post URL"):
            normalize_post(
                {
                    "platform": "instagram",
                    "external_id": "bad",
                    "url": "https://cdn.example.com/source.mp4",
                    "caption": "source only",
                    "published_at": "2026-07-10T14:01:01Z",
                },
                audience=65_074,
                captured_at="2026-07-10T18:00:00Z",
                client_id="client-1",
            )

    def test_existing_publication_url_reuses_the_current_item_id(self) -> None:
        normalized = normalize_post(
            {
                "platform": "youtube",
                "url": "https://www.youtube.com/watch?v=IgobR4D5pxM",
                "published_at": "2026-07-06",
                "views": 205897,
            },
            audience=7210,
            captured_at="2026-07-10T16:00:00Z",
            client_id="client-1",
        )
        reuse_existing_item_ids(
            [normalized],
            [{"item_id": "ksi_existing_ep1", "source_url": "https://youtu.be/IgobR4D5pxM"}],
        )
        self.assertEqual(normalized["item"]["item_id"], "ksi_existing_ep1")
        self.assertEqual(normalized["performance"]["item_id"], "ksi_existing_ep1")


class ChannelHistoryTests(unittest.TestCase):
    def test_history_preserves_prior_points_and_replaces_same_day_capture(self) -> None:
        existing = [
            {
                "platform": "instagram",
                "handle": "idoltillidie",
                "audience": 62_900,
                "post_count": 8,
                "captured_at": "2026-07-09T17:00:00Z",
                "history": [
                    {
                        "captured_at": "2026-07-09T17:00:00Z",
                        "audience": 62_900,
                        "post_count": 8,
                    }
                ],
            }
        ]
        incoming = [
            {
                "platform": "instagram",
                "handle": "idoltillidie",
                "audience": 65_074,
                "post_count": 10,
            }
        ]

        merged = merge_channel_history(existing, incoming, "2026-07-10T18:00:00Z")
        channel = merged[0]
        self.assertEqual(channel["audience"], 65_074)
        self.assertEqual(len(channel["history"]), 2)

        revised = merge_channel_history(merged, incoming, "2026-07-10T23:00:00Z")
        self.assertEqual(len(revised[0]["history"]), 2)
        self.assertEqual(revised[0]["history"][-1]["captured_at"], "2026-07-10T23:00:00Z")

    def test_history_accepts_a_verified_seed_baseline(self) -> None:
        incoming = [
            {
                "platform": "instagram",
                "handle": "idoltillidie",
                "audience": 65_074,
                "post_count": 10,
                "history": [
                    {
                        "captured_at": "2026-07-09T17:00:00Z",
                        "audience": 62_900,
                        "post_count": 8,
                    }
                ],
            }
        ]

        merged = merge_channel_history([], incoming, "2026-07-10T18:00:00Z")
        self.assertEqual([point["audience"] for point in merged[0]["history"]], [62_900, 65_074])


if __name__ == "__main__":
    unittest.main()
