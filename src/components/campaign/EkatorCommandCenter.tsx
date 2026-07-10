'use client';

import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Gauge } from '@/components/charts/gauge';
import { RingChart } from '@/components/charts/ring-chart';
import { Ring } from '@/components/charts/ring';
import { RingCenter } from '@/components/charts/ring-center';
import type {
  EkatorRegistrySnapshot,
  EkatorAssetSnapshot,
  EkatorAsset,
  EkatorChannelSnapshot,
  EkatorOwnedChannel,
} from '@/lib/ekator-dashboard';

/* ── DATA ─────────────────────────────────────────────────────────── */

const red = '#FD3737';
const line = '#2A2A2A';
const muted = '#A0A0AA';
const light = '#E4E4E9';
const white = '#FAFAFA';

type Channel = {
  name: string;
  handle: string;
  audience: number;
  postCount: number;
  posts: string;
  views: number | null;
  share: number;
  engagement: string;
  status: 'strong' | 'watch' | 'risk';
  role: string;
  insight: string;
  action: string;
};

type Insight = { label: string; stat: string; read: string; action: string; tone: 'strong' | 'watch' | 'risk' };
type Rec = { rank: number; title: string; why: string; move: string; owner: string; impact: 'High' | 'Medium' };
type MeasureLayer = { platform: string; audience: string; coverage: string; read: string; next: string; tone: 'strong' | 'watch' | 'risk' };
type DashboardMetrics = {
  hasMeasuredPerformance: boolean;
  ownedAudience: number;
  youtubeTotalViews: number;
  longformViews: number;
  teaserViews: number;
  shortsViews: number;
  shortsCount: number;
  videoCount: number;
  youtubeEngagement: number | null;
  teaserDetected: boolean;
  refreshedAt: string | null;
  readLabel: string;
};

function hasMeasuredMetrics(asset: EkatorAsset): boolean {
  return asset.views !== null || asset.likes !== null || asset.comments !== null || asset.shares !== null;
}

function formatRefreshedAt(value: string | null): string {
  if (!value) return 'Refresh pending';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'Refresh pending';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: 'America/Los_Angeles',
  }).format(date);
}

function deriveDashboardMetrics(snapshot: EkatorAssetSnapshot, channelSnapshot: EkatorChannelSnapshot): DashboardMetrics {
  const published = snapshot.assets.filter((asset) => asset.platform === 'youtube' && asset.views !== null);
  const ep1 = published.find((asset) => /ep\.?\s*1/i.test(asset.caption));
  const teaser = published.find((asset) => /teaser/i.test(asset.caption));
  const shorts = published.filter((asset) => asset.itemId !== ep1?.itemId && asset.itemId !== teaser?.itemId);
  const totalViews = published.reduce((sum, asset) => sum + (asset.views ?? 0), 0);
  const interactions = published.reduce(
    (sum, asset) => sum + (asset.likes ?? 0) + (asset.comments ?? 0) + (asset.shares ?? 0),
    0,
  );
  const latestCapture = [
    channelSnapshot.refreshedAt,
    ...snapshot.assets.map((asset) => asset.capturedAt),
  ]
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? null;

  return {
    hasMeasuredPerformance: published.length > 0,
    ownedAudience: channelSnapshot.channels.reduce((sum, channel) => sum + (channel.audience ?? 0), 0),
    youtubeTotalViews: totalViews,
    longformViews: ep1?.views ?? 0,
    teaserViews: teaser?.views ?? 0,
    shortsViews: shorts.reduce((sum, asset) => sum + (asset.views ?? 0), 0),
    shortsCount: shorts.length,
    videoCount: published.length,
    youtubeEngagement: totalViews > 0 ? (interactions / totalViews) * 100 : null,
    teaserDetected: Boolean(teaser),
    refreshedAt: latestCapture,
    readLabel: formatRefreshedAt(latestCapture),
  };
}

function buildChannels(metrics: DashboardMetrics, assets: EkatorAssetSnapshot, channelSnapshot: EkatorChannelSnapshot): Channel[] {
  const channelFor = (platform: EkatorOwnedChannel['platform']) => channelSnapshot.channels.find((channel) => channel.platform === platform);
  const platformAssets = (platform: EkatorOwnedChannel['platform']) => assets.assets.filter((asset) => asset.platform === platform);
  const audienceTotal = Math.max(1, metrics.ownedAudience);
  const makeShare = (audience: number) => (audience / audienceTotal) * 100;
  const ig = channelFor('instagram');
  const yt = channelFor('youtube');
  const tt = channelFor('tiktok');
  const igAssets = platformAssets('instagram');
  const ttAssets = platformAssets('tiktok');
  const instagramViewAssets = igAssets.filter((asset) => asset.views !== null);
  const instagramViews = instagramViewAssets.reduce((sum, asset) => sum + (asset.views ?? 0), 0);
  const instagramViewCount = instagramViewAssets.length;
  const igEngagementReads = igAssets.map((asset) => asset.engagementRate).filter((value): value is number => value !== null);
  const igEngagement = igEngagementReads.length > 0
    ? `${(igEngagementReads.reduce((sum, value) => sum + value, 0) / igEngagementReads.length).toFixed(1)}%`
    : '—';
  const ytEr = metrics.youtubeEngagement === null ? '—' : `${metrics.youtubeEngagement.toFixed(1)}%`;
  const ep1Share = metrics.youtubeTotalViews > 0
    ? (metrics.longformViews / metrics.youtubeTotalViews) * 100
    : 0;
  const instagramAudience = ig?.audience ?? 0;
  const youtubeAudience = yt?.audience ?? 0;
  const tiktokAudience = tt?.audience ?? 0;
  const instagramPostCount = ig?.postCount ?? igAssets.length;
  const youtubePostCount = yt?.postCount ?? metrics.videoCount;
  const tiktokPostCount = tt?.postCount ?? ttAssets.length;
  return [
    { name: 'Instagram', handle: `@${ig?.handle || 'idoltillidie'}`, audience: instagramAudience, postCount: instagramPostCount, posts: `${instagramPostCount} posts`, views: instagramViewCount > 0 ? instagramViews : null, share: makeShare(instagramAudience), engagement: igEngagement, status: 'strong', role: 'Top-of-funnel audience reservoir', insight: instagramViewCount > 0 ? `${instagramViewCount} verified Instagram Reels have ${compact(instagramViews)} measured views plus likes and comments.` : `${igAssets.length} verified Instagram posts have known interactions; Reel views are collecting.`, action: 'Use view and interaction velocity to identify the strongest hooks, then route the audience toward EP1.' },
    { name: 'YouTube', handle: `@${yt?.handle || 'Idoltillidie'}`, audience: youtubeAudience, postCount: youtubePostCount, posts: `${youtubePostCount} videos`, views: metrics.hasMeasuredPerformance ? metrics.youtubeTotalViews : null, share: makeShare(youtubeAudience), engagement: ytEr, status: 'watch', role: 'Documentary home + retargeting anchor', insight: metrics.hasMeasuredPerformance ? `EP1 holds ${ep1Share.toFixed(1)}% of measured YouTube views, showing discovery beyond the subscriber base.` : 'Published YouTube performance is temporarily unavailable.', action: 'Use YouTube as the story anchor, then carry the strongest beats outward through short-form cuts.' },
    { name: 'TikTok', handle: `@${tt?.handle || 'idoltillidie'}`, audience: tiktokAudience, postCount: tiktokPostCount, posts: `${tiktokPostCount} videos`, views: null, share: makeShare(tiktokAudience), engagement: '—', status: tiktokPostCount > 0 ? 'watch' : 'risk', role: 'Dormant owned distribution', insight: tiktokPostCount > 0 ? 'TikTok publishing is active and ready for post-level pacing reads.' : 'There is a meaningful follower base but no official TikTok content, leaving algorithmic inventory unused.', action: 'Post the first three EP1 cuts: Matthew leader arc, trainee pressure, and comedic dorm/rule clip.' },
  ];
}

function knownInteractions(asset: EkatorAsset): number {
  return (asset.likes ?? 0) + (asset.comments ?? 0) + (asset.shares ?? 0);
}

function platformPostCount(
  platform: EkatorOwnedChannel['platform'],
  assets: EkatorAssetSnapshot,
  channelSnapshot: EkatorChannelSnapshot,
): number {
  const channel = channelSnapshot.channels.find((candidate) => candidate.platform === platform);
  return channel?.postCount ?? assets.assets.filter((asset) => asset.platform === platform).length;
}

function buildInsights(
  metrics: DashboardMetrics,
  assets: EkatorAssetSnapshot,
  channelSnapshot: EkatorChannelSnapshot,
): Insight[] {
  const concentration = metrics.youtubeTotalViews > 0
    ? ((metrics.longformViews + metrics.teaserViews) / metrics.youtubeTotalViews) * 100
    : null;
  const instagram = channelSnapshot.channels.find((channel) => channel.platform === 'instagram');
  const instagramAudience = instagram?.audience ?? 0;
  const instagramShare = metrics.ownedAudience > 0 ? (instagramAudience / metrics.ownedAudience) * 100 : null;
  const instagramAssets = assets.assets.filter((asset) => asset.platform === 'instagram');
  const instagramMeasuredPosts = instagramAssets.filter(hasMeasuredMetrics).length;
  const instagramViewAssets = instagramAssets.filter((asset) => asset.views !== null);
  const instagramViews = instagramViewAssets.reduce((sum, asset) => sum + (asset.views ?? 0), 0);
  const tiktok = channelSnapshot.channels.find((channel) => channel.platform === 'tiktok');
  const tiktokAudience = tiktok?.audience ?? 0;
  const tiktokPosts = platformPostCount('tiktok', assets, channelSnapshot);
  const interactionLeader = assets.assets
    .map((asset) => ({ asset, interactions: knownInteractions(asset) }))
    .filter((entry) => entry.interactions > 0)
    .sort((a, b) => b.interactions - a.interactions)[0];

  return [
    {
      label: 'Measured YouTube demand concentration',
      stat: concentration === null ? '—' : `${concentration.toFixed(1)}%`,
      read: concentration === null
        ? 'Published YouTube performance is temporarily unavailable, so demand concentration cannot be calculated.'
        : `EP1 + teaser account for ${concentration.toFixed(1)}% of ${compact(metrics.youtubeTotalViews)} measured official YouTube views.`,
      action: concentration === null
        ? 'Restore the performance read before changing the publishing plan.'
        : 'Use the proven long-form story as the source for the next short-form sprint.',
      tone: 'watch',
    },
    {
      label: 'Instagram Reel demand',
      stat: instagramViews > 0 ? compact(instagramViews) : '—',
      read: instagramViews > 0
        ? `${instagramViewAssets.length} verified Reels generated ${compact(instagramViews)} views across an audience of ${compact(instagramAudience)} followers (${instagramShare?.toFixed(1) ?? '—'}% of owned audience). ${instagramMeasuredPosts} posts carry measured performance.`
        : 'Instagram Reel views are collecting; verified post interactions remain available.',
      action: 'Use view velocity and interaction rate together to choose the next hooks and story beats.',
      tone: 'strong',
    },
    {
      label: tiktokPosts > 0 ? 'TikTok pacing is now measurable' : 'TikTok distribution gap',
      stat: tiktokAudience > 0 ? `${compact(tiktokAudience)} / ${tiktokPosts}` : '—',
      read: tiktokAudience > 0
        ? `${compact(tiktokAudience)} followers and ${tiktokPosts} published ${tiktokPosts === 1 ? 'post' : 'posts'} are currently recorded.`
        : 'TikTok audience and publication data are temporarily unavailable.',
      action: tiktokPosts > 0
        ? 'Capture first-hour, 24-hour, and 72-hour pacing before increasing output.'
        : 'Publish the first controlled cuts and establish a post-level baseline.',
      tone: tiktokPosts > 0 ? 'watch' : 'risk',
    },
    {
      label: 'Current interaction leader',
      stat: interactionLeader ? compact(interactionLeader.interactions) : '—',
      read: interactionLeader
        ? `“${interactionLeader.asset.caption}” has ${compact(interactionLeader.interactions)} known interactions on ${interactionLeader.asset.platform}. This is an interaction signal, not a cross-platform view comparison.`
        : 'No post currently has a measured interaction total.',
      action: interactionLeader
        ? 'Use its hook and story beat as one controlled comparator in the next publishing batch.'
        : 'Restore post-level interaction collection before selecting a creative leader.',
      tone: 'strong',
    },
  ];
}

function buildRecommendations(
  metrics: DashboardMetrics,
  assets: EkatorAssetSnapshot,
  channelSnapshot: EkatorChannelSnapshot,
): Rec[] {
  const youtubeConcentration = metrics.youtubeTotalViews > 0
    ? (metrics.longformViews / metrics.youtubeTotalViews) * 100
    : null;
  const shortsShare = metrics.youtubeTotalViews > 0
    ? (metrics.shortsViews / metrics.youtubeTotalViews) * 100
    : null;
  const instagram = channelSnapshot.channels.find((channel) => channel.platform === 'instagram');
  const instagramAudience = instagram?.audience ?? 0;
  const instagramShare = metrics.ownedAudience > 0 ? (instagramAudience / metrics.ownedAudience) * 100 : null;
  const instagramViewAssets = assets.assets.filter((asset) => asset.platform === 'instagram' && asset.views !== null);
  const instagramViews = instagramViewAssets.reduce((sum, asset) => sum + (asset.views ?? 0), 0);
  const tiktok = channelSnapshot.channels.find((channel) => channel.platform === 'tiktok');
  const tiktokAudience = tiktok?.audience ?? 0;
  const tiktokPosts = platformPostCount('tiktok', assets, channelSnapshot);
  const interactionLeader = assets.assets
    .map((asset) => ({ asset, interactions: knownInteractions(asset) }))
    .filter((entry) => entry.interactions > 0)
    .sort((a, b) => b.interactions - a.interactions)[0];
  const moves: Omit<Rec, 'rank'>[] = [];

  moves.push(metrics.hasMeasuredPerformance && youtubeConcentration !== null && shortsShare !== null
    ? {
        title: 'Convert measured EP1 concentration into a controlled short-form sprint',
        why: `EP1 holds ${youtubeConcentration.toFixed(1)}% of measured YouTube views, while ${metrics.shortsCount} shorts hold ${shortsShare.toFixed(1)}%.`,
        move: 'Cut six distinct EP1 moments across character, stakes, and lighter group dynamics; publish with consistent hooks over the next 72 hours.',
        owner: 'Content / clipping',
        impact: 'High',
      }
    : {
        title: 'Restore the YouTube performance read before scaling output',
        why: 'Published YouTube performance is unavailable, so concentration and short-form share cannot be verified.',
        move: 'Repair the post-level performance feed and re-rank the queue from measured views and interactions.',
        owner: 'Measurement',
        impact: 'High',
      });

  moves.push(tiktokPosts === 0
    ? {
        title: 'Activate TikTok and establish the first pacing baseline',
        why: tiktokAudience > 0
          ? `${compact(tiktokAudience)} followers and zero published posts are currently recorded.`
          : 'Zero published TikTok posts are currently recorded; the audience total is unavailable.',
        move: 'Publish three distinct EP1-derived cuts, then record first-hour, 24-hour, and 72-hour views and interactions for each.',
        owner: 'Owned social',
        impact: 'High',
      }
    : {
        title: 'Use current TikTok posts to establish a pacing baseline',
        why: `${tiktokPosts} TikTok ${tiktokPosts === 1 ? 'post is' : 'posts are'} live for an audience of ${tiktokAudience > 0 ? compact(tiktokAudience) : '—'}.`,
        move: 'Compare first-hour, 24-hour, and 72-hour views and interactions before increasing posting volume.',
        owner: 'Owned social',
        impact: 'High',
      });

  moves.push({
    title: 'Turn the Instagram audience into a measurable EP1 path',
    why: instagramViews > 0
      ? `${instagramViewAssets.length} verified Reels generated ${compact(instagramViews)} measured views from an Instagram audience of ${compact(instagramAudience)} followers (${instagramShare?.toFixed(1) ?? '—'}% of owned audience).`
      : 'Instagram Reel views are collecting; use the verified interaction reads until view coverage arrives.',
    move: 'Use a pinned EP1 call-to-action and story-link sequence; capture first-party reach, taps, saves, shares, and link clicks.',
    owner: 'Owned social',
    impact: 'High',
  });

  moves.push(interactionLeader
    ? {
        title: 'Use the current interaction leader as a controlled comparator',
        why: `“${interactionLeader.asset.caption}” leads the current ledger with ${compact(interactionLeader.interactions)} known interactions on ${interactionLeader.asset.platform}.`,
        move: 'Repeat its hook or story beat in one new cut while holding format and publishing window consistent enough to compare the next read.',
        owner: 'Creative strategy',
        impact: 'Medium',
      }
    : {
        title: 'Restore interaction coverage before selecting a creative leader',
        why: 'No current asset has a known interaction total.',
        move: 'Collect likes, comments, and shares for the next published batch, then choose the repeatable hook from measured results.',
        owner: 'Measurement',
        impact: 'Medium',
      });

  moves.push({
    title: 'Maintain the measurement boundary until campaign delivery begins',
    why: 'No campaigns are live, so every current audience and post-performance read is an owned-channel signal.',
    move: 'Keep the delivery section marked Not live and add confirmed spend, reach, efficiency, and conversion data only after launch.',
    owner: 'Measurement',
    impact: 'Medium',
  });

  return moves.map((move, index) => ({ ...move, rank: index + 1 }));
}

const measurementLayers: MeasureLayer[] = [
  { platform: 'YouTube', audience: '—', coverage: 'Awaiting current read', read: 'Post-level views are the primary performance layer for official YouTube publications.', next: 'Add retention and average view duration by video.', tone: 'strong' },
  { platform: 'Instagram', audience: '—', coverage: 'Awaiting current read', read: 'Reel views, likes, and comments provide the public post-performance layer.', next: 'Add reach, saves, shares, and story-link clicks from first-party Insights.', tone: 'watch' },
  { platform: 'TikTok', audience: '—', coverage: 'Awaiting current read', read: 'Post-level pacing begins once official publications are recorded.', next: 'Capture first-hour, 24-hour, and 72-hour views, follows, comments, saves, and shares.', tone: 'risk' },
];

type Sentiment = { theme: string; tags: string; use: string; status: string };
const sentimentThemes: Sentiment[] = [
  { theme: 'Matthew leadership arc', tags: 'Leader, pressure, responsibility, sympathy, international-fan clarity.', use: 'Tests whether the leadership arc earns the first cross-platform creative repeat.', status: 'Ready to tag' },
  { theme: 'Group stakes', tags: 'Together-or-fail framing, team tension, "can they debut?" reactions.', use: 'Decides if hooks should lead with the show premise instead of one member.', status: 'Ready to tag' },
  { theme: 'Dorm / rule comedy', tags: 'Funny rules, daily-life moments, meme comments, low-context shareability.', use: 'Decides which casual-fandom clips can scale beyond existing viewers.', status: 'Ready to tag' },
  { theme: 'Confusion / context gaps', tags: 'Questions about who, what show, voting, episode order, subtitles, where to watch.', use: 'Decides what on-screen text must be added before wider distribution.', status: 'Needs comments' },
];

const paidFields = [
  { metric: 'Spend', use: 'Daily and cumulative spend by platform, campaign, audience, and creative.' },
  { metric: 'Reach / impressions', use: 'Paid delivery volume separated from owned-channel views.' },
  { metric: 'CPM / CPV', use: 'Efficiency read by platform and creative once delivery begins.' },
  { metric: 'Thumbstop / hold rate', use: 'Opening-frame performance by cut, tracked from paid delivery only.' },
  { metric: 'Completion rate', use: 'Whether the paid audience stays through the story, not just the hook.' },
  { metric: 'Follower conversion', use: 'New followers or subscribers generated per 1K paid views.' },
  { metric: 'EP1 click-through', use: 'Whether paid clips create traffic to the anchor episode.' },
  { metric: 'Creative winner / loser', use: 'Best and weakest paid cuts by platform, audience, and day.' },
];

const compact = (v: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: v >= 10_000 ? 1 : 0 }).format(v);

/* ── CUSTOM DASHBOARD ELEMENTS ────────────────────────────────────── */

function statusColor(s: string) {
  if (s === 'strong') return light;
  if (s === 'watch') return muted;
  if (s === 'risk') return red;
  return muted;
}
function statusLabel(s: string) {
  if (s === 'strong') return 'Strong';
  if (s === 'watch') return 'Watch';
  if (s === 'risk') return 'Fix now';
  return 'Quiet';
}

function useDialogFocus(onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'iframe',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusFirstControl = () => {
      const preferred = dialog?.querySelector<HTMLElement>('[data-dialog-close]');
      const first = dialog?.querySelector<HTMLElement>(focusableSelector);
      (preferred ?? first ?? dialog)?.focus();
    };

    const frame = window.requestAnimationFrame(focusFirstControl);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  return dialogRef;
}

/** EP1 Gravity — bklit notched arc gauge */
function Ep1GravityCard({ metrics }: { metrics: DashboardMetrics }) {
  if (!metrics.hasMeasuredPerformance) {
    return (
      <div className="flex min-h-[230px] flex-col items-center justify-center gap-2 text-center">
        <div className="font-mono text-4xl font-black text-white">—</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A0A0AA]">YouTube performance unavailable</div>
      </div>
    );
  }
  const ep1Pct = metrics.youtubeTotalViews > 0
    ? (metrics.longformViews / metrics.youtubeTotalViews) * 100
    : 0;
  return (
    <div className="flex h-full min-w-0 flex-col items-center justify-center gap-3">
      <div className="relative mx-auto w-full max-w-[220px]">
        <Gauge
          value={ep1Pct}
          totalNotches={40}
          spacing={25}
          activeFill={red}
          inactiveFill="#2A2A2A"
          inactiveFillOpacity={0.5}
          useGradient
          activeGradient={[red, '#B03030']}
          inactiveGradient={['#2A2A2A', '#1C1C1C']}
          className="w-full"
          minWidth={0}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="font-mono text-2xl font-black leading-none" style={{ color: red }}>{ep1Pct.toFixed(0)}%</div>
            <div className="mt-1 text-[9px] uppercase tracking-wider text-[#A0A0AA]">EP1 share</div>
          </div>
        </div>
      </div>
      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-2 border-t pt-2" style={{ borderColor: line }}>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: red }} />
          <span className="font-mono text-[10px] text-[#E4E4E9]">EP1 · {compact(metrics.longformViews)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: '#2A2A2A' }} />
          <span className="font-mono text-[10px] text-[#A0A0AA]">Rest · {compact(Math.max(0, metrics.youtubeTotalViews - metrics.longformViews))}</span>
        </div>
      </div>
      <div className="text-xs leading-relaxed text-[#A0A0AA]">
        One video carries the channel. Cut it into clips.
      </div>
    </div>
  );
}

/** View Concentration — bklit concentric ring chart */
function ViewConcentrationCard({ metrics }: { metrics: DashboardMetrics }) {
  if (!metrics.hasMeasuredPerformance) {
    return (
      <div className="flex min-h-[286px] flex-col items-center justify-center gap-2 text-center">
        <div className="font-mono text-4xl font-black text-white">—</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A0A0AA]">Format mix unavailable</div>
      </div>
    );
  }
  const total = Math.max(1, metrics.youtubeTotalViews);
  const segments = [
    { label: 'EP1 (longform)', value: metrics.longformViews, color: red, pct: (metrics.longformViews / total) * 100 },
    ...(metrics.teaserDetected
      ? [{ label: 'Teaser', value: metrics.teaserViews, color: '#B03030', pct: (metrics.teaserViews / total) * 100 }]
      : []),
    {
      label: `${metrics.teaserDetected ? 'Shorts' : 'Other published cuts'} (${metrics.shortsCount} clips)`,
      value: metrics.shortsViews,
      color: '#7A2A2A',
      pct: (metrics.shortsViews / total) * 100,
    },
  ];
  const ringData = segments.map(s => ({ label: s.label, value: s.value, maxValue: total, color: s.color }));
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <RingChart data={ringData} size={210} strokeWidth={11} ringGap={7} baseInnerRadius={46}>
        {ringData.map((item, index) => (
          <Ring key={item.label} index={index} />
        ))}
        <RingCenter
          defaultLabel="Total views"
          formatOptions={{ notation: 'compact', maximumFractionDigits: 1 }}
          valueClassName="font-mono text-xl font-black text-white"
          labelClassName="text-[9px] uppercase tracking-wider text-[#A0A0AA]"
        />
      </RingChart>
      <div className="w-full space-y-1.5 border-t pt-2" style={{ borderColor: line }}>
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: seg.color }} />
            <span className="flex-1 text-xs text-[#E4E4E9]">{seg.label}</span>
            <span className="font-mono text-xs font-bold text-white">{compact(seg.value)}</span>
            <span className="font-mono text-[10px] text-[#A0A0AA] w-10 text-right">{seg.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
      <div className="text-xs leading-relaxed" style={{ color: red }}>
        <span className="font-bold">Gap: </span>Short-form share is {((metrics.shortsViews / total) * 100).toFixed(1)}%. Use the measured format mix to prioritize the next cuts.
      </div>
    </div>
  );
}


/** Priority timeline — numbered horizontal stepper */
function PriorityTimeline({ recommendations }: { recommendations: Rec[] }) {
  return (
    <div className="space-y-3">
      {recommendations.slice(0, 3).map(rec => (
        <div key={rec.rank} className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-bold" style={{ borderColor: red, color: red }}>
            {rec.rank}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold leading-tight text-white">{rec.title}</div>
            <div className="mt-1 text-xs leading-relaxed text-[#E4E4E9]">{rec.move}</div>
          </div>
          <div className="shrink-0 text-right">
            <span className="rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase" style={{ color: rec.impact === 'High' ? red : muted, border: `1px solid ${rec.impact === 'High' ? red : line}` }}>
              {rec.impact}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** KPI rail — inline strip of key numbers, no cards */
function KpiRail({ metrics, channels }: { metrics: DashboardMetrics; channels: Channel[] }) {
  const ep1Pct = metrics.youtubeTotalViews > 0
    ? (metrics.longformViews / metrics.youtubeTotalViews) * 100
    : 0;
  const tiktok = channels.find((channel) => channel.name === 'TikTok');
  const items = [
    { label: 'Audience', value: metrics.ownedAudience > 0 ? compact(metrics.ownedAudience) : '—', sub: 'IG+YT+TT', tone: 'normal' },
    { label: 'YT Views', value: metrics.hasMeasuredPerformance ? compact(metrics.youtubeTotalViews) : '—', sub: metrics.hasMeasuredPerformance ? `${metrics.videoCount} videos` : 'data pending', tone: 'normal' },
    { label: 'EP1 Gravity', value: metrics.hasMeasuredPerformance ? `${ep1Pct.toFixed(1)}%` : '—', sub: metrics.hasMeasuredPerformance ? 'of YT views' : 'data pending', tone: 'normal' },
    { label: 'Shorts', value: metrics.hasMeasuredPerformance ? compact(metrics.shortsViews) : '—', sub: metrics.hasMeasuredPerformance ? `${metrics.shortsCount} clips` : 'data pending', tone: 'risk' },
    { label: 'TikTok', value: tiktok?.posts.split(' ')[0] ?? '—', sub: tiktok ? `${compact(tiktok.audience)} waiting` : 'data pending', tone: 'risk' },
    { label: 'Paid', value: '—', sub: 'not live', tone: 'muted' },
  ];
  return (
    <div className="grid min-w-0 grid-cols-2 gap-px overflow-hidden rounded-lg bg-[#1A1A1A] sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 bg-[#0E0E0E] px-3 py-2.5">
          <div className="text-[9px] uppercase tracking-[0.15em] text-[#A0A0AA]">{item.label}</div>
          <div className="mt-0.5 font-mono text-xl font-bold leading-none" style={{ color: item.tone === 'risk' ? red : item.tone === 'muted' ? muted : white }}>{item.value}</div>
          <div className="mt-0.5 text-[9px] text-[#A0A0AA]">{item.sub}</div>
        </div>
      ))}
    </div>
  );
}

/** Status strip — single-line system status */
function StatusStrip({ registry, assets }: { registry: EkatorRegistrySnapshot; assets: EkatorAssetSnapshot }) {
  const live = registry.status === 'live';
  const nodes = registry.seedingNetworkCount + registry.snsViralCount + registry.officialHandleCount;
  const items = [
    { label: 'Published', value: assets.publishedCount },
    { label: 'Measured', value: assets.performanceCount },
    { label: 'Monitored', value: registry.monitoredHandlesCount },
    { label: 'Nodes', value: nodes },
    { label: 'Paid', value: 'OFF' as const },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-3 py-2 font-mono text-xs">
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${live ? 'bg-[#E4E4E9]' : 'bg-[#FD3737]'} animate-pulse`} />
        <span className="uppercase tracking-wider" style={{ color: live ? light : red }}>{live ? 'LIVE' : 'SYNC'}</span>
      </div>
      {items.map(item => (
        <div key={item.label} className="flex items-baseline gap-1">
          <span className="text-[#A0A0AA]">{item.label}</span>
          <span className="font-bold" style={{ color: item.label === 'Paid' ? '#D42D2D' : white }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

/** Channel matrix — bklit ring chart per channel */
function ChannelMatrix({ channels }: { channels: Channel[] }) {
  const maxAudience = Math.max(1, ...channels.map((channel) => channel.audience));
  const maxPosts = Math.max(1, ...channels.map((channel) => channel.postCount));
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {channels.map(ch => {
        const ringColor = ch.status === 'strong' ? '#E4E4E9' : statusColor(ch.status);
        const ringData = [{ label: ch.name, value: ch.audience, maxValue: maxAudience, color: ringColor }];
        return (
          <div key={ch.name} className="flex flex-col items-center gap-2 rounded-lg bg-[#141414] p-5 text-center">
            <RingChart data={ringData} size={104} strokeWidth={9} ringGap={0} baseInnerRadius={38}>
              <Ring index={0} animate showGlow={false} />
              <RingCenter
                defaultLabel=""
                formatOptions={{ notation: 'compact', maximumFractionDigits: 1 }}
                valueClassName="font-mono text-base font-bold text-white"
                labelClassName="hidden"
              />
            </RingChart>
            <div className="text-base font-bold text-white">{ch.name}</div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: statusColor(ch.status) }} />
              <span className="font-mono text-xs uppercase" style={{ color: statusColor(ch.status) }}>{statusLabel(ch.status)}</span>
            </div>
            <div className="w-full">
              <div className="h-1.5 overflow-hidden rounded-full bg-[#262626]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min(100, (ch.postCount / maxPosts) * 100)}%`, background: ringColor, opacity: 0.85 }}
                />
              </div>
              <div className="mt-1.5 font-mono text-[10px] text-[#A0A0AA]">{ch.posts}</div>
            </div>
            <div className="w-full border-t pt-2" style={{ borderColor: line }}>
              <div className="text-[9px] uppercase tracking-wider text-[#A0A0AA]">Engagement</div>
              <div className="mt-0.5 font-mono text-sm font-bold" style={{ color: ch.engagement === '—' ? '#8A8A94' : white }}>{ch.engagement}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Refresh button — triggers agent pipeline via API route */
function RefreshButton() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleRefresh = useCallback(async () => {
    setState('sending');
    try {
      const resp = await fetch('/api/ekator/refresh', { method: 'POST' });
      const data = await resp.json();
      if (data.ok) {
        setState('sent');
        setTimeout(() => setState('idle'), 4000);
      } else {
        setState('error');
        setTimeout(() => setState('idle'), 4000);
      }
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 4000);
    }
  }, []);

  const labels = {
    idle: 'Refresh Now',
    sending: 'Sending…',
    sent: 'Refresh queued ✓',
    error: 'Failed — try again',
  };

  const colors = {
    idle: red,
    sending: muted,
    sent: light,
    error: red,
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={state === 'sending'}
      className="flex min-h-11 items-center gap-2 rounded-md border px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all hover:bg-[#1A1A1A] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FD3737]"
      style={{ borderColor: colors[state], color: colors[state] }}
    >
      {state === 'sending' && (
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: muted, borderTopColor: 'transparent' }} />
      )}
      <span aria-live="polite">{labels[state]}</span>
    </button>
  );
}

/* ── COMMAND CENTER (above the fold) ──────────────────────────────── */

function CommandCenter({ registry, assets, metrics, channels, recommendations }: { registry: EkatorRegistrySnapshot; assets: EkatorAssetSnapshot; metrics: DashboardMetrics; channels: Channel[]; recommendations: Rec[] }) {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[1400px] px-4 pb-6 pt-8 sm:pt-12 md:px-6 lg:px-8 lg:pt-20">
      {/* Title bar */}
      <div className="mb-4 flex min-w-0 flex-col items-start gap-4 border-b pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:pb-3" style={{ borderColor: line }}>
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#A0A0AA]">
            <span style={{ color: red }}>●</span> EKATOR Social Dashboard
          </div>
          <h1 className="mt-2 font-mono text-3xl font-black leading-[0.9] tracking-[-0.04em] text-white md:text-4xl">
            <span className="block sm:inline">EKATOR</span>{' '}
            <span className="mt-1 block sm:mt-0 sm:inline" style={{ color: red }}>COMMAND CENTER</span>
          </h1>
        </div>
        <div className="flex w-full min-w-0 flex-wrap items-end justify-between gap-4 sm:w-auto sm:flex-nowrap sm:justify-start">
          <RefreshButton />
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#A0A0AA]">Last refreshed</div>
            <div className="font-mono text-xs text-[#E4E4E9]">{metrics.readLabel}</div>
          </div>
        </div>
      </div>

      {/* KPI Rail */}
      <div className="mb-3"><KpiRail metrics={metrics} channels={channels} /></div>

      {/* Main 3-column grid */}
      <div className="mb-3 grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* EP1 Gravity */}
        <div className="min-w-0 rounded-lg border p-4 sm:p-5" style={{ borderColor: line, background: '#0E0E0E' }}>
          <div className="mb-3 text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>EP1 Gravity</div>
          <Ep1GravityCard metrics={metrics} />
        </div>

        {/* View Concentration */}
        <div className="min-w-0 rounded-lg border p-4 sm:p-5" style={{ borderColor: line, background: '#0E0E0E' }}>
          <div className="mb-3 flex min-w-0 flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>View Concentration</div>
            <div className="font-mono text-xs text-[#A0A0AA]">where views are by format</div>
          </div>
          <ViewConcentrationCard metrics={metrics} />
        </div>

        {/* Priority queue */}
        <div className="min-w-0 rounded-lg border p-4" style={{ borderColor: line, background: '#0E0E0E' }}>
          <div className="mb-3 flex min-w-0 flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>72-Hour Queue</div>
            <div className="font-mono text-xs text-[#A0A0AA]">do these first</div>
          </div>
          <PriorityTimeline recommendations={recommendations} />
        </div>
      </div>

      {/* Channel matrix — 3 compact channel cards with rings */}
      <div className="mb-3 min-w-0 rounded-lg border p-4" style={{ borderColor: line, background: '#0E0E0E' }}>
        <div className="mb-3 flex min-w-0 flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>Channel Pulse</div>
          <div className="font-mono text-xs text-[#A0A0AA]">audience · status · activation</div>
        </div>
        <ChannelMatrix channels={channels} />
      </div>

      {/* Status strip */}
      <div className="rounded-lg border" style={{ borderColor: line, background: '#0E0E0E' }}>
        <StatusStrip registry={registry} assets={assets} />
      </div>
    </div>
  );
}

/* ── DETAIL SECTIONS (below the fold) ──────────────────────────────── */

function SectionHeader({ num, title, subtitle }: { num: string; title: string; subtitle: string }) {
  return (
    <div className="mx-auto mb-6 max-w-[1400px] px-4 md:px-6 lg:px-8">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: red }}>{num}</span>
        <h2 className="font-mono text-2xl font-black text-white md:text-3xl">{title}</h2>
      </div>
      <p className="mt-1 max-w-2xl text-xs leading-snug text-[#A0A0AA]">{subtitle}</p>
    </div>
  );
}

/** Channel detail modal */
function ChannelModal({ channel, onClose }: { channel: Channel; onClose: () => void }) {
  const dialogRef = useDialogFocus(onClose);

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${channel.name} channel detail`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      style={{ animation: 'fadeIn 0.15s ease' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border p-6"
        style={{ borderColor: line, background: '#0E0E0E' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: statusColor(channel.status) }} />
              <span className="font-mono text-xs uppercase" style={{ color: statusColor(channel.status) }}>{statusLabel(channel.status)}</span>
            </div>
            <h3 className="mt-2 font-mono text-2xl font-black text-white">{channel.name}</h3>
            <div className="mt-1 font-mono text-xs text-[#A0A0AA]">{channel.handle}</div>
          </div>
          <button
            type="button"
            data-dialog-close
            aria-label="Close channel detail"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-md border text-lg text-[#A0A0AA] transition-colors hover:bg-[#1A1A1A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FD3737]"
            style={{ borderColor: line }}
          >
            ✕
          </button>
        </div>

        {/* Role */}
        <div className="mb-4 rounded-lg p-3" style={{ background: '#141414' }}>
          <div className="text-[10px] uppercase tracking-wider text-[#A0A0AA]">Role</div>
          <div className="mt-1 text-sm font-semibold text-white">{channel.role}</div>
        </div>

        {/* Stats grid */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg p-3" style={{ background: '#141414' }}>
            <div className="text-[10px] uppercase tracking-wider text-[#A0A0AA]">Audience</div>
            <div className="mt-1 font-mono text-xl font-bold text-white">{compact(channel.audience)}</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: '#141414' }}>
            <div className="text-[10px] uppercase tracking-wider text-[#A0A0AA]">Share</div>
            <div className="mt-1 font-mono text-xl font-bold" style={{ color: statusColor(channel.status) }}>{channel.share}%</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: '#141414' }}>
            <div className="text-[10px] uppercase tracking-wider text-[#A0A0AA]">Engagement</div>
            <div className="mt-1 font-mono text-xl font-bold text-white">{channel.engagement}</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: '#141414' }}>
            <div className="text-[10px] uppercase tracking-wider text-[#A0A0AA]">Views</div>
            <div className="mt-1 font-mono text-xl font-bold text-white">{channel.views === null ? '—' : compact(channel.views)}</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: '#141414' }}>
            <div className="text-[10px] uppercase tracking-wider text-[#A0A0AA]">Posts</div>
            <div className="mt-1 font-mono text-xl font-bold text-white">{channel.posts}</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: '#141414' }}>
            <div className="text-[10px] uppercase tracking-wider text-[#A0A0AA]">Status</div>
            <div className="mt-1 font-mono text-sm font-bold uppercase" style={{ color: statusColor(channel.status) }}>{statusLabel(channel.status)}</div>
          </div>
        </div>

        {/* Insight */}
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-wider" style={{ color: red }}>Read</div>
          <p className="mt-1.5 text-sm leading-relaxed text-[#E4E4E9]">{channel.insight}</p>
        </div>

        {/* Action */}
        <div className="rounded-lg border p-4" style={{ borderColor: `${red}40`, background: '#140A0A' }}>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: red }}>Action</div>
          <p className="mt-1.5 text-sm leading-relaxed text-white">{channel.action}</p>
        </div>
      </div>
    </div>
  );
}

/** Owned channels — table with View buttons that open modals */
function ChannelTable({ channels }: { channels: Channel[] }) {
  const [openChannel, setOpenChannel] = useState<Channel | null>(null);
  return (
    <>
      <div className="mx-auto min-w-0 max-w-[1400px] px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-full overflow-x-auto rounded-lg border" style={{ borderColor: line }}>
          <div className="grid min-w-[760px] grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_0.6fr] gap-2 bg-[#141414] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#A0A0AA]">
            <div>Channel</div>
            <div>Audience</div>
            <div>Share</div>
            <div>Engagement</div>
            <div>Views</div>
            <div>Detail</div>
          </div>
          {channels.map((ch, i) => (
            <div key={ch.name} className={`grid min-w-[760px] grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_0.6fr] items-center gap-2 px-4 py-4 ${i > 0 ? 'border-t' : ''}`} style={{ borderColor: line }}>
              <div>
                <div className="text-sm font-bold text-white">{ch.name}</div>
                <div className="font-mono text-[10px] text-[#A0A0AA]">{ch.handle}</div>
              </div>
              <div className="font-mono text-lg font-bold text-white">{compact(ch.audience)}</div>
              <div>
                <div className="font-mono text-sm font-bold" style={{ color: statusColor(ch.status) }}>{ch.share}%</div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#161616]">
                  <div className="h-full rounded-full" style={{ width: `${ch.share}%`, background: statusColor(ch.status) }} />
                </div>
              </div>
              <div className="font-mono text-sm font-bold" style={{ color: ch.engagement === '—' ? muted : white }}>{ch.engagement}</div>
              <div className="font-mono text-sm" style={{ color: ch.views === null || ch.views === 0 ? muted : white }}>{ch.views === null || ch.views === 0 ? '—' : compact(ch.views)}</div>
              <div>
                <button
                  type="button"
                  onClick={() => setOpenChannel(ch)}
                  className="min-h-11 rounded-md border px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-all hover:bg-[#1A1A1A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FD3737]"
                  style={{ borderColor: red, color: red }}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {openChannel && <ChannelModal channel={openChannel} onClose={() => setOpenChannel(null)} />}
    </>
  );
}

/** Asset shadowbox — embeds supported platform posts and links to the original. */
function youtubeEmbedUrl(sourceUrl: string | null): string | null {
  if (!sourceUrl) return null;

  try {
    const url = new URL(sourceUrl);
    const hostname = url.hostname.replace(/^www\./, '').toLowerCase();
    let videoId: string | null = null;

    if (hostname === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] ?? null;
    } else if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v');
      } else {
        videoId = url.pathname.match(/^\/(?:shorts|live|embed)\/([^/?#]+)/)?.[1] ?? null;
      }
    }

    return videoId && /^[A-Za-z0-9_-]+$/.test(videoId)
      ? `https://www.youtube.com/embed/${videoId}`
      : null;
  } catch {
    return null;
  }
}

function AssetShadowbox({ asset, onClose }: { asset: EkatorAsset; onClose: () => void }) {
  const dialogRef = useDialogFocus(onClose);
  const embedUrl = youtubeEmbedUrl(asset.sourceUrl);

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Asset detail: ${asset.caption}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
      style={{ animation: 'fadeIn 0.15s ease' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-xl border"
        style={{ borderColor: line, background: '#0E0E0E' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4" style={{ borderColor: line }}>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase" style={{ color: red, border: `1px solid ${red}` }}>{asset.platform}</span>
              <span className="font-mono text-[10px] text-[#A0A0AA]">{asset.handle}</span>
            </div>
            <div className="mt-1.5 text-sm font-bold text-white">{asset.caption}</div>
          </div>
          <button
            type="button"
            data-dialog-close
            aria-label="Close asset detail"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border text-lg text-[#A0A0AA] transition-colors hover:bg-[#1A1A1A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FD3737]"
            style={{ borderColor: line }}
          >
            ✕
          </button>
        </div>

        {/* Video embed */}
        <div className="aspect-video w-full bg-black">
          {embedUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <iframe
              title={asset.caption}
              src={embedUrl}
              className="h-full w-full"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-sm text-[#A0A0AA]">
              No embed available
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-px bg-[#1A1A1A] sm:grid-cols-4">
          <div className="bg-[#0E0E0E] px-4 py-3">
            <div className="text-[10px] uppercase tracking-wider text-[#A0A0AA]">Views</div>
            <div className="mt-0.5 font-mono text-lg font-bold text-white">{asset.views !== null ? compact(asset.views) : '—'}</div>
          </div>
          <div className="bg-[#0E0E0E] px-4 py-3">
            <div className="text-[10px] uppercase tracking-wider text-[#A0A0AA]">Likes</div>
            <div className="mt-0.5 font-mono text-lg font-bold text-white">{asset.likes !== null ? compact(asset.likes) : '—'}</div>
          </div>
          <div className="bg-[#0E0E0E] px-4 py-3">
            <div className="text-[10px] uppercase tracking-wider text-[#A0A0AA]">Comments</div>
            <div className="mt-0.5 font-mono text-lg font-bold text-white">{asset.comments !== null ? compact(asset.comments) : '—'}</div>
          </div>
          <div className="bg-[#0E0E0E] px-4 py-3">
            <div className="text-[10px] uppercase tracking-wider text-[#A0A0AA]">Engagement</div>
            <div className="mt-0.5 font-mono text-lg font-bold" style={{ color: red }}>{asset.engagementRate !== null ? `${asset.engagementRate.toFixed(1)}%` : '—'}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-3 font-mono text-[10px] text-[#A0A0AA]" style={{ borderColor: line }}>
          {asset.sourceUrl ? (
            <a href={asset.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white" style={{ color: muted }}>
              Open original ↗
            </a>
          ) : 'No source URL'}
        </div>
      </div>
    </div>
  );
}

/** Asset board — dynamic, sortable, filterable, with shadowbox */
function AssetBoard({ assets }: { assets: EkatorAssetSnapshot }) {
  const [filter, setFilter] = useState<string>('All');
  const [sort, setSort] = useState<'views-desc' | 'views-asc' | 'date-desc' | 'date-asc' | 'engagement-desc'>('views-desc');
  const [selected, setSelected] = useState<EkatorAsset | null>(null);
  const selectedTriggerRef = useRef<HTMLButtonElement | null>(null);

  const closeShadowbox = () => {
    setSelected(null);
    window.requestAnimationFrame(() => selectedTriggerRef.current?.focus());
  };

  const allAssets = assets.assets;
  const platforms = ['All', ...Array.from(new Set(allAssets.map(a => a.platform)))];
  const sortOptions: { value: typeof sort; label: string }[] = [
    { value: 'views-desc', label: 'Views ↓' },
    { value: 'views-asc', label: 'Views ↑' },
    { value: 'date-desc', label: 'Date ↓' },
    { value: 'date-asc', label: 'Date ↑' },
    { value: 'engagement-desc', label: 'Engagement ↓' },
  ];

  const filtered = filter === 'All' ? allAssets : allAssets.filter(a => a.platform === filter);
  const maxViews = Math.max(1, ...filtered.map(a => a.views ?? 0));
  const sorted = [...filtered].sort((a, b) => {
    const av = a.views ?? 0;
    const bv = b.views ?? 0;
    const ae = a.engagementRate ?? 0;
    const be = b.engagementRate ?? 0;
    const ad = a.postDate ? new Date(a.postDate).getTime() : 0;
    const bd = b.postDate ? new Date(b.postDate).getTime() : 0;
    switch (sort) {
      case 'views-desc': return bv - av;
      case 'views-asc': return av - bv;
      case 'date-desc': return bd - ad;
      case 'date-asc': return ad - bd;
      case 'engagement-desc': return be - ae;
      default: return 0;
    }
  });

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        <div className="mb-3 grid gap-px overflow-hidden rounded-lg border bg-[#232323] sm:grid-cols-3" style={{ borderColor: line }}>
          <div className="bg-[#0E0E0E] px-4 py-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#A0A0AA]">Owned publications</div>
            <div className="mt-1 font-mono text-2xl font-black text-white">{assets.publishedCount}</div>
            <div className="text-[10px] text-[#A0A0AA]">verified platform post URLs</div>
          </div>
          <div className="bg-[#0E0E0E] px-4 py-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#A0A0AA]">Measured performance</div>
            <div className="mt-1 font-mono text-2xl font-black" style={{ color: red }}>{assets.performanceCount}</div>
            <div className="text-[10px] text-[#A0A0AA]">views + interactions connected</div>
          </div>
          <div className="bg-[#0E0E0E] px-4 py-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#A0A0AA]">Awaiting metrics</div>
            <div className="mt-1 font-mono text-2xl font-black text-white">{assets.awaitingMetricsCount}</div>
            <div className="text-[10px] text-[#A0A0AA]">published posts without a performance read</div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border" style={{ borderColor: line }}>
          {/* Filter + Sort controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3" style={{ borderColor: line, background: '#141414' }}>
            <div className="flex flex-wrap gap-1.5">
              {platforms.map(fb => (
                <button
                  key={fb}
                  onClick={() => setFilter(fb)}
                  aria-pressed={filter === fb}
                  className="min-h-11 rounded-md px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FD3737]"
                  style={{
                    background: filter === fb ? red : 'transparent',
                    color: filter === fb ? white : muted,
                    border: `1px solid ${filter === fb ? red : line}`,
                  }}
                >
                  {fb}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#A0A0AA]">Sort</span>
              <select
                aria-label="Sort asset performance"
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="min-h-11 rounded-md border bg-[#0E0E0E] px-3 py-2 font-mono text-[11px] text-white outline-none focus-visible:ring-2 focus-visible:ring-[#FD3737]"
                style={{ borderColor: line }}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Asset rows */}
          <div className="divide-y" style={{ borderColor: line }}>
            <div className="hidden grid-cols-[minmax(0,2.4fr)_1fr_1.1fr_0.8fr] gap-4 bg-[#101010] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#A0A0AA] md:grid">
              <div>Asset</div><div className="text-right">Views</div><div className="text-right">Interactions</div><div className="text-right">State</div>
            </div>
            {sorted.map(asset => {
              const views = asset.views;
              const engagement = asset.engagementRate;
              const hasPerformance = hasMeasuredMetrics(asset);
              return (
                <button
                  type="button"
                  key={asset.itemId}
                  onClick={(event) => {
                    selectedTriggerRef.current = event.currentTarget;
                    setSelected(asset);
                  }}
                  aria-label={`Inspect ${asset.caption}`}
                  className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-4 py-3 text-left transition-colors hover:bg-[#141414] focus-visible:bg-[#141414] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#FD3737] md:grid-cols-[minmax(0,2.4fr)_1fr_1.1fr_0.8fr]"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white">{asset.caption}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-[#A0A0AA]">
                      <span>{asset.platform}</span><span aria-hidden="true">·</span><span>{asset.handle}</span>{asset.postDate && <><span aria-hidden="true">·</span><span>{asset.postDate}</span></>}
                    </div>
                  </div>
                  <div className="text-right">
                    {views !== null ? (
                      <>
                        <div className="font-mono text-lg font-bold text-white">{compact(views)}</div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#202020]" aria-hidden="true">
                          <div className="h-full rounded-full" style={{ width: `${Math.max(2, (views / maxViews) * 100)}%`, background: red }} />
                        </div>
                      </>
                    ) : hasPerformance ? (
                      <div>
                        <div className="font-mono text-lg font-bold text-white">—</div>
                        <div className="font-mono text-[9px] uppercase tracking-wider text-[#A0A0AA]">not available</div>
                      </div>
                    ) : (
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[#A0A0AA]">Awaiting metrics</div>
                    )}
                  </div>
                  <div className="col-span-2 flex items-center justify-between border-t pt-2 md:col-span-1 md:block md:border-0 md:pt-0 md:text-right" style={{ borderColor: line }}>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#A0A0AA] md:hidden">Interactions</span>
                    {hasPerformance ? (
                      <div>
                        <div className="font-mono text-sm font-bold text-white">{engagement !== null ? `${engagement.toFixed(1)}%` : '—'}</div>
                        <div className="mt-0.5 font-mono text-[9px] text-[#A0A0AA]">{asset.likes !== null ? `${compact(asset.likes)} likes` : 'likes —'} · {asset.comments !== null ? `${compact(asset.comments)} comments` : 'comments —'}</div>
                      </div>
                    ) : (
                      <div className="font-mono text-[10px] text-[#A0A0AA]">Performance capture pending</div>
                    )}
                  </div>
                  <div className="hidden text-right md:block">
                    <span className="inline-flex rounded-sm px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider" style={{ color: light, border: `1px solid ${line}` }}>{hasPerformance ? 'Measured' : 'Awaiting metrics'}</span>
                  </div>
                </button>
              );
            })}
            {sorted.length === 0 && (
              <div className="px-4 py-12 text-center font-mono text-sm text-[#A0A0AA]">
                {allAssets.length === 0
                  ? assets.status === 'pending'
                    ? 'Published asset data is temporarily unavailable.'
                    : 'No verified owned-channel publications are available yet.'
                  : 'No assets match this filter.'}
              </div>
            )}
          </div>
          {allAssets.length > 0 && (
            <div className="border-t bg-[#101010] px-4 py-3 text-[10px] leading-relaxed text-[#A0A0AA]" style={{ borderColor: line }}>
              Only owned-channel publications with verified platform post URLs are shown. Raw source files stay excluded until they are actually published.
            </div>
          )}
        </div>
      </div>
      {selected && <AssetShadowbox asset={selected} onClose={closeShadowbox} />}
    </>
  );
}

/** Insights — custom bento with mini sparkline-style accents */
function InsightBoard({ insights }: { insights: Insight[] }) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {insights.map((ins, i) => (
          <div key={ins.label} className="relative overflow-hidden rounded-lg border bg-[#0E0E0E] p-4" style={{ borderColor: line }}>
            <div className="absolute left-0 top-0 h-full w-1" style={{ background: statusColor(ins.tone) }} />
            <div className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0AA]">{ins.label}</div>
            <div className="mt-2 font-mono text-3xl font-black" style={{ color: i === 3 ? red : white }}>{ins.stat}</div>
            <div className="mt-3 h-px w-full" aria-hidden="true" style={{ background: statusColor(ins.tone), opacity: 0.55 }} />
            <p className="mt-3 text-xs leading-relaxed text-[#E4E4E9]">{ins.read}</p>
            <div className="mt-3 border-t pt-2 text-xs leading-snug text-white" style={{ borderColor: line }}>
              <span className="font-bold" style={{ color: red }}>Do next: </span>{ins.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Measurement layers — custom table (enlarged) */
function MeasurementTable({ assets, metrics, channelSnapshot }: { assets: EkatorAssetSnapshot; metrics: DashboardMetrics; channelSnapshot: EkatorChannelSnapshot }) {
  const publishedAssets = assets.assets.filter((asset) => asset.views !== null && asset.postDate);
  const snapshotDate = metrics.refreshedAt ? new Date(metrics.refreshedAt) : new Date();
  const ageDaysFor = (asset: EkatorAsset) => {
    if (!asset.postDate) return 1;
    const publishedAt = new Date(asset.postDate.includes('T') ? asset.postDate : `${asset.postDate}T00:00:00-07:00`);
    const publishedAtMs = publishedAt.getTime();
    if (!Number.isFinite(publishedAtMs)) return 1;
    return Math.max(1, Math.ceil((snapshotDate.getTime() - publishedAtMs) / 86_400_000));
  };
  const velocityFor = (asset: EkatorAsset) => asset.views === null ? 0 : Math.round(asset.views / ageDaysFor(asset));
  const interactionTotal = (asset: EkatorAsset) => (asset.likes ?? 0) + (asset.comments ?? 0) + (asset.shares ?? 0);
  const interactionVelocityFor = (asset: EkatorAsset) => Math.round(interactionTotal(asset) / ageDaysFor(asset));
  const ep1Asset = publishedAssets.find((asset) => /ep\.?\s*1/i.test(asset.caption));
  const velocityAssets = publishedAssets
    .filter((asset) => asset.itemId !== ep1Asset?.itemId)
    .map((asset) => ({ asset, velocity: velocityFor(asset) }))
    .sort((a, b) => b.velocity - a.velocity);
  const interactionVelocityAssets = assets.assets
    .filter((asset) => asset.postDate && interactionTotal(asset) > 0)
    .map((asset) => ({ asset, velocity: interactionVelocityFor(asset), total: interactionTotal(asset) }))
    .sort((a, b) => b.velocity - a.velocity)
    .slice(0, 12);
  const maxVelocity = Math.max(1, ...velocityAssets.map((entry) => entry.velocity));
  const followerRows = channelSnapshot.channels.map((channel) => {
    const baseline = channel.history[0];
    const currentAudience = channel.audience ?? channel.history.at(-1)?.audience ?? null;
    const delta = baseline?.audience !== null && baseline?.audience !== undefined && currentAudience !== null
      ? currentAudience - baseline.audience
      : null;
    const deltaPercent = delta !== null && baseline?.audience
      ? (delta / baseline.audience) * 100
      : null;
    return { channel, baseline, currentAudience, delta, deltaPercent };
  });
  const liveLayers = measurementLayers.map((layer) => {
    if (layer.platform === 'YouTube') {
      return metrics.hasMeasuredPerformance
        ? { ...layer, audience: `${compact(channelSnapshot.channels.find((channel) => channel.platform === 'youtube')?.audience ?? 0)} subscribers`, coverage: `${metrics.videoCount} videos with views`, next: 'Add retention and average view duration by video.' }
        : { ...layer, coverage: 'Data unavailable', read: 'Published YouTube performance is temporarily unavailable.', next: 'Restore the performance feed, then add retention and average view duration by video.' };
    }
    if (layer.platform === 'Instagram') {
      const instagram = channelSnapshot.channels.find((channel) => channel.platform === 'instagram');
      const instagramAssets = assets.assets.filter((asset) => asset.platform === 'instagram' && hasMeasuredMetrics(asset));
      const instagramViewAssets = instagramAssets.filter((asset) => asset.views !== null);
      const instagramViews = instagramViewAssets.reduce((sum, asset) => sum + (asset.views ?? 0), 0);
      return { ...layer, audience: instagram?.audience ? `${compact(instagram.audience)} followers` : '—', coverage: `${instagramViewAssets.length} posts with views`, read: instagramViewAssets.length > 0 ? `${compact(instagramViews)} Reel views plus likes and comments are connected across verified posts.` : 'Reel views are collecting; likes and comments remain connected.', next: 'Add reach, saves, shares, and story-link clicks from first-party Insights.' };
    }
    if (layer.platform === 'TikTok') {
      const tiktok = channelSnapshot.channels.find((channel) => channel.platform === 'tiktok');
      const tiktokAssets = assets.assets.filter((asset) => asset.platform === 'tiktok');
      const tiktokPostCount = tiktok?.postCount ?? tiktokAssets.length;
      return {
        ...layer,
        audience: tiktok?.audience ? `${compact(tiktok.audience)} followers` : '—',
        coverage: `${tiktokPostCount} official ${tiktokPostCount === 1 ? 'post' : 'posts'}`,
        read: tiktokPostCount > 0
          ? 'Official TikTok publications are recorded; post-level pacing can now be measured.'
          : 'No official TikTok publications are currently recorded, so post-level pacing is unavailable.',
        next: 'Capture first-hour, 24-hour, and 72-hour views, follows, comments, saves, and shares.',
        tone: tiktokPostCount > 0 ? 'watch' : 'risk',
      };
    }
    return layer;
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8 space-y-5">
      {/* Post-level table */}
      <div className="overflow-hidden rounded-lg border" style={{ borderColor: line }}>
        <div className="hidden grid-cols-[1fr_1fr_1fr_2fr] gap-4 bg-[#141414] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[#A0A0AA] md:grid">
          <div>Platform</div><div>Audience</div><div>Coverage</div><div>Current read → Next data</div>
        </div>
        {liveLayers.map((layer, i) => (
          <div key={layer.platform} className={`grid grid-cols-1 gap-4 px-5 py-5 md:grid-cols-[1fr_1fr_1fr_2fr] ${i > 0 ? 'border-t' : ''}`} style={{ borderColor: line }}>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: statusColor(layer.tone) }} />
                <span className="text-base font-bold text-white">{layer.platform}</span>
              </div>
            </div>
            <div>
              <div className="mb-1 font-mono text-[9px] uppercase tracking-wider text-[#A0A0AA] md:hidden">Audience</div>
              <div className="font-mono text-sm text-[#E4E4E9]">{layer.audience}</div>
            </div>
            <div>
              <div className="mb-1 font-mono text-[9px] uppercase tracking-wider text-[#A0A0AA] md:hidden">Coverage</div>
              <div className="font-mono text-sm text-[#E4E4E9]">{layer.coverage}</div>
            </div>
            <div>
              <p className="text-sm leading-relaxed text-[#E4E4E9]">{layer.read}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white"><span className="font-bold" style={{ color: red }}>Add next: </span>{layer.next}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Velocity + Follower delta side by side */}
      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-lg border p-5" style={{ borderColor: line, background: '#0E0E0E' }}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: red }}>Daily Velocity</div>
              <div className="mt-1 text-[10px] text-[#A0A0AA]">Hover or focus any bar for the exact daily pace.</div>
            </div>
            <div className="font-mono text-[11px] text-[#A0A0AA]">views/day · {metrics.readLabel}</div>
          </div>
          {ep1Asset && (
            <div className="mb-5 flex items-center justify-between gap-4 rounded-md border px-4 py-3" style={{ background: '#140A0A', borderColor: '#3A1717' }}>
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-white">{ep1Asset.caption}</div>
                <div className="font-mono text-[10px] text-[#A0A0AA]">Anchor episode · separated from comparable cuts</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-mono text-2xl font-black" style={{ color: red }}>{compact(velocityFor(ep1Asset))}/d</div>
                <div className="font-mono text-[9px] text-[#A0A0AA]">{compact(ep1Asset.views ?? 0)} total</div>
              </div>
            </div>
          )}
          <div className="overflow-x-auto pb-2">
            <div className="grid min-w-[620px] items-end gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(1, velocityAssets.length)}, minmax(54px, 1fr))` }}>
              {velocityAssets.map(({ asset, velocity }, index) => (
                <button
                  type="button"
                  key={asset.itemId}
                  className="group relative flex h-52 min-w-0 flex-col justify-end rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FD3737]"
                  aria-label={`${asset.caption}: ${velocity.toLocaleString()} views per day, ${asset.views?.toLocaleString()} total views`}
                  aria-describedby={`velocity-tooltip-${index}`}
                >
                  <span
                    id={`velocity-tooltip-${index}`}
                    className={`pointer-events-none absolute top-2 z-20 hidden w-52 rounded-md border bg-[#0A0A0A] p-3 text-left shadow-2xl group-hover:block group-focus-visible:block ${index === 0 ? 'left-0' : index === velocityAssets.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}
                    style={{ borderColor: '#444' }}
                    role="tooltip"
                  >
                    <span className="block text-xs font-bold leading-snug text-white">{asset.caption}</span>
                    <span className="mt-2 block font-mono text-lg font-black" style={{ color: red }}>{velocity.toLocaleString()} views/day</span>
                    <span className="mt-1 block font-mono text-[10px] text-[#A0A0AA]">{asset.views?.toLocaleString()} total · {asset.postDate}</span>
                  </span>
                  <span className="mb-2 block font-mono text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{compact(velocity)}/d</span>
                  <span className="block w-full rounded-t-sm transition-all group-hover:brightness-125 group-focus-visible:brightness-125" style={{ height: `${Math.max(14, (velocity / maxVelocity) * 132)}px`, background: index === 0 ? red : '#B92B2B' }} aria-hidden="true" />
                  <span className="mt-2 block font-mono text-[10px] font-bold" style={{ color: red }}>#{index + 1}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {velocityAssets.map(({ asset, velocity }, index) => (
              <div key={asset.itemId} className="flex min-w-0 items-center gap-2 text-xs">
                <span className="w-6 shrink-0 font-mono font-bold" style={{ color: red }}>#{index + 1}</span>
                <span className="flex-1 truncate text-[#E4E4E9]">{asset.caption}</span>
                <span className="shrink-0 font-mono font-bold text-white">{compact(velocity)}/d</span>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t pt-5" style={{ borderColor: line }}>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: red }}>Interaction velocity</div>
                <div className="mt-1 text-[10px] text-[#A0A0AA]">Likes + comments + shares per day across verified owned posts.</div>
              </div>
              <div className="font-mono text-[10px] text-[#A0A0AA]">interactions/day</div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {interactionVelocityAssets.map(({ asset, velocity, total }, index) => (
                <a
                  key={asset.itemId}
                  href={asset.sourceUrl ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-md border px-3 py-2 transition-colors hover:bg-[#171717] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FD3737]"
                  style={{ borderColor: line }}
                >
                  <span className="font-mono text-[10px] font-black" style={{ color: red }}>#{index + 1}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold text-white">{asset.caption}</span>
                    <span className="font-mono text-[9px] uppercase text-[#A0A0AA]">{asset.platform} · {compact(total)} total</span>
                  </span>
                  <span className="font-mono text-xs font-black text-white">{compact(velocity)}/d</span>
                </a>
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-[#A0A0AA]">Reel views and interactions are connected. Interaction pace remains the cross-platform comparator for posts whose view metric is unavailable.</p>
          </div>
        </div>

        <div className="rounded-lg border p-5" style={{ borderColor: line, background: '#0E0E0E' }}>
          <div className="mb-4 text-[11px] uppercase tracking-[0.2em]" style={{ color: red }}>Follower Delta</div>
          <div className="space-y-3">
            {followerRows.map(({ channel, baseline, currentAudience, delta, deltaPercent }) => (
              <div key={channel.platform} className="border-b pb-3" style={{ borderColor: line }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold capitalize text-white">{channel.platform}</div>
                    <div className="font-mono text-[10px] text-[#A0A0AA]">
                      {baseline?.audience !== null && baseline?.audience !== undefined ? `baseline ${compact(baseline.audience)}` : 'baseline pending'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg font-black text-white">{currentAudience !== null ? compact(currentAudience) : '—'}</div>
                    <div className="font-mono text-[10px]" style={{ color: delta !== null && delta > 0 ? red : muted }}>
                      {delta === null ? 'delta pending' : `${delta >= 0 ? '+' : ''}${delta.toLocaleString()}${deltaPercent !== null ? ` · ${deltaPercent >= 0 ? '+' : ''}${deltaPercent.toFixed(1)}%` : ''}`}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-wider text-[#A0A0AA]">
                  <span>Since baseline</span>
                  <span>{baseline ? formatRefreshedAt(baseline.capturedAt) : 'collecting'}</span>
                </div>
              </div>
            ))}
            {followerRows.length === 0 && (
              <div className="font-mono text-xs text-[#A0A0AA]">Follower history is collecting.</div>
            )}
          </div>
          <p className="mt-3 text-xs leading-snug text-[#A0A0AA]">Daily snapshots now persist in the client channel history. 24h, 72h, and 7d windows become available as those checkpoints accumulate.</p>
        </div>
      </div>

      {/* Sentiment + Paid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border p-5" style={{ borderColor: line, background: '#0E0E0E' }}>
          <div className="mb-4 text-[11px] uppercase tracking-[0.2em]" style={{ color: red }}>Comment + Sentiment Themes</div>
          <div className="space-y-3">
            {sentimentThemes.map(theme => (
              <div key={theme.theme} className="flex items-start gap-3 border-b pb-3" style={{ borderColor: line }}>
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${theme.status === 'Needs comments' ? 'bg-[#FD3737]' : 'bg-[#E4E4E9]'}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-white">{theme.theme}</div>
                  <div className="mt-1 text-xs leading-relaxed text-[#E4E4E9]"><span className="font-bold" style={{ color: red }}>Tag: </span>{theme.tags}</div>
                  <div className="text-xs leading-relaxed text-[#A0A0AA]"><span className="font-bold text-white">Use: </span>{theme.use}</div>
                </div>
                <span className="shrink-0 rounded-sm px-2 py-1 font-mono text-[10px] uppercase" style={{ color: theme.status === 'Needs comments' ? '#D42D2D' : light, border: `1px solid ${theme.status === 'Needs comments' ? '#D42D2D' : line}` }}>{theme.status === 'Needs comments' ? 'Need' : 'Ready'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border p-5" style={{ borderColor: line, background: '#0E0E0E' }}>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: red }}>Paid Media</div>
            <span className="font-mono text-sm font-bold" style={{ color: '#D42D2D' }}>NOT LIVE</span>
          </div>
          <div className="mb-4 rounded-md p-4" style={{ background: '#140A0A' }}>
            <p className="text-sm leading-relaxed text-white">No paid campaigns are live yet. Once campaigns launch, this section will show confirmed delivery, efficiency, and conversion data.</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {paidFields.map(field => (
              <div key={field.metric} className="flex items-baseline gap-2 border-b py-2" style={{ borderColor: line }}>
                <span className="font-mono text-sm font-bold text-[#A0A0AA]">·</span>
                <div>
                  <span className="text-sm font-semibold text-white">{field.metric}</span>
                  <p className="mt-1 text-xs leading-relaxed text-[#E4E4E9]">{field.use}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Moves — custom ranked timeline */
function MovesTimeline({ recommendations }: { recommendations: Rec[] }) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-px" style={{ background: line }} />
        <div className="space-y-3">
          {recommendations.map(rec => (
            <div key={rec.rank} className="relative flex items-start gap-4 pl-0">
              <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-black" style={{ borderColor: red, color: red, background: '#0A0A0A' }}>
                {rec.rank}
              </div>
              <div className="flex-1 rounded-lg border bg-[#0E0E0E] p-4" style={{ borderColor: line }}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-white">{rec.title}</h3>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#A0A0AA]">{rec.owner}</span>
                    <span className="rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase" style={{ color: rec.impact === 'High' ? red : muted, border: `1px solid ${rec.impact === 'High' ? red : line}` }}>{rec.impact}</span>
                  </div>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: red }}>Why</div>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#E4E4E9]">{rec.why}</p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: red }}>Move</div>
                    <p className="mt-0.5 text-xs leading-relaxed text-white">{rec.move}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── MAIN COMPONENT ────────────────────────────────────────────────── */

export function EkatorCommandCenter({ registry, assets, channelSnapshot }: { registry: EkatorRegistrySnapshot; assets: EkatorAssetSnapshot; channelSnapshot: EkatorChannelSnapshot }) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const metrics = useMemo(() => deriveDashboardMetrics(assets, channelSnapshot), [assets, channelSnapshot]);
  const channelData = useMemo(() => buildChannels(metrics, assets, channelSnapshot), [metrics, assets, channelSnapshot]);
  const insights = useMemo(() => buildInsights(metrics, assets, channelSnapshot), [metrics, assets, channelSnapshot]);
  const recommendations = useMemo(() => buildRecommendations(metrics, assets, channelSnapshot), [metrics, assets, channelSnapshot]);
  const nav = useMemo(() => [
    ['channels', 'Channels'], ['assets', 'Assets'], ['insights', 'Insights'], ['data', 'Data'], ['moves', 'Moves'],
  ], []);

  return (
    <main className="min-h-[100dvh] w-full min-w-0 overflow-x-hidden bg-[#0A0A0A] text-[#FAFAFA]">
      {/* Scroll progress */}
      <motion.div className="fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left" style={{ scaleX, background: red }} />

      {/* Nav */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#2A2A2A] bg-[#0A0A0A]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4 md:px-6 lg:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control" className="h-4 max-w-[82px] shrink-0 object-contain opacity-90 sm:max-w-none" />
          <div className="flex min-w-0 flex-1 items-center justify-start gap-3 overflow-x-auto [scrollbar-width:none] lg:justify-center lg:gap-5 [&::-webkit-scrollbar]:hidden">
            {nav.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="flex min-h-11 shrink-0 items-center font-mono text-[10px] uppercase tracking-[0.12em] text-[#A0A0AA] transition-colors hover:text-[#FD3737] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FD3737] lg:tracking-[0.15em]">{label}</a>
            ))}
          </div>
          <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] xl:block" style={{ color: red }}>Living Dashboard</span>
        </div>
      </nav>

      {/* COMMAND CENTER — above the fold */}
      <header ref={heroRef} className="min-h-[100dvh] min-w-0 pt-14">
        <CommandCenter registry={registry} assets={assets} metrics={metrics} channels={channelData} recommendations={recommendations} />
      </header>

      {/* Divider */}
      <div className="mx-auto h-px max-w-[1400px]" style={{ background: line }} />

      {/* DETAIL SECTIONS — below the fold */}
      <section id="channels" className="scroll-mt-14 py-12 md:py-16">
        <SectionHeader num="01" title="Owned Channels" subtitle="Audience, output, views, and next action per surface." />
        <ChannelTable channels={channelData} />
      </section>

      <div className="mx-auto h-px max-w-[1400px]" style={{ background: line }} />

      <section id="assets" className="scroll-mt-14 py-12 md:py-16">
        <SectionHeader num="02" title="Asset Performance" subtitle="Where attention is concentrated and which assets to cut, mirror, or hold." />
        <AssetBoard assets={assets} />
      </section>

      <div className="mx-auto h-px max-w-[1400px]" style={{ background: line }} />

      <section id="insights" className="scroll-mt-14 py-12 md:py-16">
        <SectionHeader num="03" title="Actionable Insights" subtitle="Metric, meaning, and decision." />
        <InsightBoard insights={insights} />
      </section>

      <div className="mx-auto h-px max-w-[1400px]" style={{ background: line }} />

      <section id="data" className="scroll-mt-14 py-12 md:py-16">
        <SectionHeader num="04" title="Measurement Layers" subtitle="Post-level, pacing, sentiment, follower lift, and paid delivery." />
        <MeasurementTable assets={assets} metrics={metrics} channelSnapshot={channelSnapshot} />
      </section>

      <div className="mx-auto h-px max-w-[1400px]" style={{ background: line }} />

      <section id="moves" className="scroll-mt-14 py-12 md:py-16">
        <SectionHeader num="05" title="Ranked moves for the next 72 hours" subtitle="Prioritized operating queue." />
        <MovesTimeline recommendations={recommendations} />
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A2A2A] py-12">
        <div className="mx-auto max-w-[1400px] px-4 text-center md:px-6 lg:px-8">
          <div className="font-mono text-2xl font-black text-white">EKATOR <span style={{ color: red }}>×</span> Crowd Control</div>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-[#A0A0AA]">Owned-social intelligence dashboard for the Idol Till I Die campaign.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control" className="mx-auto mt-6 h-5 w-auto opacity-60" />
        </div>
      </footer>
    </main>
  );
}

export default EkatorCommandCenter;
