'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
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
  viewCount: number;
  share: number;
  interactionRate: string;
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
  episodeViews: number;
  episodeCount: number;
  otherYoutubeViews: number;
  otherYoutubeCount: number;
  videoCount: number;
  youtubeInteractionRate: number | null;
  refreshedAt: string | null;
  readLabel: string;
};

type AudienceTimelinePoint = {
  capturedAt: string;
  timestamp: number;
  total: number;
  instagram: number;
  youtube: number;
  tiktok: number;
};

type AudienceGrowth = {
  net: number | null;
  percent: number | null;
  baselineAt: string | null;
};

type InteractionSnapshot = {
  rate: number | null;
  views: number;
  interactions: number;
  measuredPosts: number;
  comments: number;
  byPlatform: Array<{
    platform: EkatorOwnedChannel['platform'];
    rate: number | null;
    measuredPosts: number;
  }>;
};

type MatchedCrossPlatformCut = {
  title: string;
  instagram: EkatorAsset;
  youtube: EkatorAsset;
  latestPostAt: number;
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

// Strict title matcher: only canonical full-episode anchors use this taxonomy.
function fullEpisodeNumberFromCaption(caption: string): number | null {
  const match = caption.match(/\b(?:EP\.?|Episode)\s*(\d+)\b/);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function publicationTime(asset: EkatorAsset): number {
  if (!asset.postDate) return 0;
  const value = new Date(asset.postDate).getTime();
  return Number.isFinite(value) ? value : 0;
}

function isPreviewCaption(caption: string): boolean {
  return /\b(?:preview|teaser)\b|선공개/i.test(caption);
}

function isFinalePreviewCaption(caption: string): boolean {
  return isPreviewCaption(caption) && /\bfinale\b|최종화/i.test(caption);
}

function firstCaptionLine(caption: string): string {
  return caption.split(/\r?\n/).map((line) => line.trim()).find(Boolean) ?? '';
}

function crossPlatformMatchKey(caption: string): string {
  return firstCaptionLine(caption)
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/[“”"'‘’!?.,|｜:：]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findActivePreview(assets: EkatorAsset[], newestFullEpisode?: EkatorAsset): EkatorAsset | undefined {
  const newestFullEpisodeAt = newestFullEpisode ? publicationTime(newestFullEpisode) : 0;
  return [...assets]
    .filter((asset) => (
      asset.platform === 'youtube'
      && isPreviewCaption(asset.caption)
      && fullEpisodeNumberFromCaption(asset.caption) === null
      && publicationTime(asset) > newestFullEpisodeAt
      && hasMeasuredMetrics(asset)
    ))
    .sort((a, b) => publicationTime(b) - publicationTime(a))[0];
}

function buildMatchedCrossPlatformCuts(assets: EkatorAsset[]): MatchedCrossPlatformCut[] {
  const instagramByCaption = new Map<string, EkatorAsset>();
  for (const asset of assets) {
    if (asset.platform !== 'instagram' || asset.views === null || asset.views <= 0) continue;
    const key = crossPlatformMatchKey(asset.caption);
    if (key && !instagramByCaption.has(key)) instagramByCaption.set(key, asset);
  }

  return assets
    .filter((asset) => asset.platform === 'youtube' && asset.views !== null && asset.views > 0)
    .flatMap((youtube): MatchedCrossPlatformCut[] => {
      const title = firstCaptionLine(youtube.caption);
      const instagram = instagramByCaption.get(crossPlatformMatchKey(youtube.caption));
      return instagram ? [{ title, instagram, youtube, latestPostAt: Math.max(publicationTime(instagram), publicationTime(youtube)) }] : [];
    })
    .sort((a, b) => b.latestPostAt - a.latestPostAt)
    .slice(0, 4);
}

function matchedCutStats(cut: MatchedCrossPlatformCut) {
  const combinedViews = (cut.instagram.views ?? 0) + (cut.youtube.views ?? 0);
  const combinedInteractions = knownInteractions(cut.instagram) + knownInteractions(cut.youtube);
  return {
    combinedViews,
    combinedInteractions,
    interactionRate: combinedViews > 0 ? (combinedInteractions / combinedViews) * 100 : null,
  };
}

function deriveDashboardMetrics(snapshot: EkatorAssetSnapshot, channelSnapshot: EkatorChannelSnapshot): DashboardMetrics {
  const published = snapshot.assets.filter((asset) => asset.platform === 'youtube' && asset.views !== null);
  const episodeAssets = published
    .map((asset) => ({ asset, episodeNumber: fullEpisodeNumberFromCaption(asset.caption) }))
    .filter((entry): entry is { asset: EkatorAsset; episodeNumber: number } => entry.episodeNumber !== null);
  const episodeIds = new Set(episodeAssets.map(({ asset }) => asset.itemId));
  const otherYoutubeAssets = published.filter((asset) => !episodeIds.has(asset.itemId));
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
    episodeViews: episodeAssets.reduce((sum, { asset }) => sum + (asset.views ?? 0), 0),
    episodeCount: episodeAssets.length,
    otherYoutubeViews: otherYoutubeAssets.reduce((sum, asset) => sum + (asset.views ?? 0), 0),
    otherYoutubeCount: otherYoutubeAssets.length,
    videoCount: published.length,
    youtubeInteractionRate: totalViews > 0 ? (interactions / totalViews) * 100 : null,
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
  const instagramInteractions = instagramViewAssets.reduce((sum, asset) => sum + knownInteractions(asset), 0);
  const instagramInteractionRate = instagramViews > 0
    ? `${((instagramInteractions / instagramViews) * 100).toFixed(1)}%`
    : '—';
  const youtubeInteractionRate = metrics.youtubeInteractionRate === null ? '—' : `${metrics.youtubeInteractionRate.toFixed(1)}%`;
  const episodeShare = metrics.youtubeTotalViews > 0
    ? (metrics.episodeViews / metrics.youtubeTotalViews) * 100
    : 0;
  const instagramAudience = ig?.audience ?? 0;
  const youtubeAudience = yt?.audience ?? 0;
  const tiktokAudience = tt?.audience ?? 0;
  const instagramPostCount = ig?.postCount ?? igAssets.length;
  const youtubePostCount = yt?.postCount ?? metrics.videoCount;
  const tiktokPostCount = tt?.postCount ?? ttAssets.length;
  return [
    { name: 'Instagram', handle: `@${ig?.handle || 'idoltillidie'}`, audience: instagramAudience, postCount: instagramPostCount, posts: `${instagramPostCount} posts`, views: instagramViewCount > 0 ? instagramViews : null, viewCount: instagramViewCount, share: makeShare(instagramAudience), interactionRate: instagramInteractionRate, status: 'strong', role: 'Top-of-funnel audience reservoir', insight: instagramViewCount > 0 ? `${instagramViewCount} verified Instagram Reels have ${compact(instagramViews)} measured views plus likes and comments.` : `${igAssets.length} verified Instagram posts have known interactions; Reel views are collecting.`, action: 'Use current view totals and interaction rates to identify the strongest hooks, then route the audience toward the newest episode.' },
    { name: 'YouTube', handle: `@${yt?.handle || 'Idoltillidie'}`, audience: youtubeAudience, postCount: youtubePostCount, posts: `${youtubePostCount} videos`, views: metrics.hasMeasuredPerformance ? metrics.youtubeTotalViews : null, viewCount: metrics.videoCount, share: makeShare(youtubeAudience), interactionRate: youtubeInteractionRate, status: 'watch', role: 'Documentary home + retargeting anchor', insight: metrics.episodeCount > 0 ? `${metrics.episodeCount} measured episodes hold ${episodeShare.toFixed(1)}% of YouTube views, showing episode-led discovery beyond the subscriber base.` : metrics.hasMeasuredPerformance ? 'Published view data is available, but no episode rows are identified.' : 'Published YouTube performance is temporarily unavailable.', action: metrics.episodeCount > 0 ? 'Use the newest episode as the story anchor, then carry the strongest beats outward through short-form cuts.' : 'Confirm episode titles before changing the long-form publishing plan.' },
    { name: 'TikTok', handle: `@${tt?.handle || 'idoltillidie'}`, audience: tiktokAudience, postCount: tiktokPostCount, posts: `${tiktokPostCount} videos`, views: null, viewCount: 0, share: makeShare(tiktokAudience), interactionRate: '—', status: tiktokPostCount > 0 ? 'watch' : 'risk', role: 'Dormant owned distribution', insight: tiktokPostCount > 0 ? 'TikTok publishing is active and ready for post-level pacing reads.' : 'There is a meaningful follower base but no official TikTok content, leaving algorithmic inventory unused.', action: 'Post three proven concepts first: the newest episode hook, a character reaction, and a lighter group moment.' },
  ];
}

function knownInteractions(asset: EkatorAsset): number {
  return (asset.likes ?? 0) + (asset.comments ?? 0) + (asset.shares ?? 0);
}

function interactionRate(asset: EkatorAsset): number | null {
  return asset.views !== null && asset.views > 0
    ? (knownInteractions(asset) / asset.views) * 100
    : null;
}

function platformPostCount(
  platform: EkatorOwnedChannel['platform'],
  assets: EkatorAssetSnapshot,
  channelSnapshot: EkatorChannelSnapshot,
): number {
  const channel = channelSnapshot.channels.find((candidate) => candidate.platform === platform);
  return channel?.postCount ?? assets.assets.filter((asset) => asset.platform === platform).length;
}

function buildAudienceTimeline(channelSnapshot: EkatorChannelSnapshot): AudienceTimelinePoint[] {
  const platforms: EkatorOwnedChannel['platform'][] = ['instagram', 'youtube', 'tiktok'];
  const historyByPlatform = new Map(platforms.map((platform) => {
    const channel = channelSnapshot.channels.find((candidate) => candidate.platform === platform);
    const points = [...(channel?.history ?? [])]
      .filter((point) => point.audience !== null && Number.isFinite(new Date(point.capturedAt).getTime()))
      .map((point) => ({ capturedAt: point.capturedAt, timestamp: new Date(point.capturedAt).getTime(), audience: point.audience as number }));
    if (channel?.capturedAt && channel.audience !== null) {
      const timestamp = new Date(channel.capturedAt).getTime();
      if (Number.isFinite(timestamp) && !points.some((point) => point.timestamp === timestamp)) {
        points.push({ capturedAt: channel.capturedAt, timestamp, audience: channel.audience });
      }
    }
    return [platform, points.sort((a, b) => a.timestamp - b.timestamp)] as const;
  }));
  const timestamps = Array.from(new Set(
    Array.from(historyByPlatform.values()).flatMap((points) => points.map((point) => point.timestamp)),
  )).sort((a, b) => a - b);
  const latestTimestamp = timestamps.at(-1);
  if (latestTimestamp === undefined) return [];
  const cutoff = latestTimestamp - (30 * 86_400_000);

  return timestamps
    .filter((timestamp) => timestamp >= cutoff)
    .map((timestamp) => {
      const values = Object.fromEntries(platforms.map((platform) => {
        const point = historyByPlatform.get(platform)?.filter((candidate) => candidate.timestamp <= timestamp).at(-1);
        return [platform, point?.audience ?? null];
      })) as Record<EkatorOwnedChannel['platform'], number | null>;
      if (platforms.some((platform) => values[platform] === null)) return null;
      const instagram = values.instagram as number;
      const youtube = values.youtube as number;
      const tiktok = values.tiktok as number;
      return {
        capturedAt: new Date(timestamp).toISOString(),
        timestamp,
        total: instagram + youtube + tiktok,
        instagram,
        youtube,
        tiktok,
      };
    })
    .filter((point): point is AudienceTimelinePoint => point !== null);
}

function deriveSevenDayAudienceGrowth(timeline: AudienceTimelinePoint[]): AudienceGrowth {
  const latest = timeline.at(-1);
  if (!latest) return { net: null, percent: null, baselineAt: null };
  const target = latest.timestamp - (7 * 86_400_000);
  const baseline = timeline.filter((point) => point.timestamp <= target).at(-1);
  if (!baseline || baseline.total <= 0) return { net: null, percent: null, baselineAt: null };
  const net = latest.total - baseline.total;
  return {
    net,
    percent: (net / baseline.total) * 100,
    baselineAt: baseline.capturedAt,
  };
}

function derivePortfolioInteraction(assets: EkatorAssetSnapshot): InteractionSnapshot {
  const platforms: EkatorOwnedChannel['platform'][] = ['instagram', 'youtube', 'tiktok'];
  const weightedFor = (platform?: EkatorOwnedChannel['platform']) => {
    const rows = assets.assets.filter((asset) => (
      (!platform || asset.platform === platform)
      && asset.views !== null
      && asset.views > 0
    ));
    const views = rows.reduce((sum, asset) => sum + (asset.views ?? 0), 0);
    const interactions = rows.reduce((sum, asset) => sum + knownInteractions(asset), 0);
    return {
      views,
      interactions,
      measuredPosts: rows.length,
      rate: views > 0 ? (interactions / views) * 100 : null,
    };
  };
  const portfolio = weightedFor();
  return {
    ...portfolio,
    comments: assets.assets.reduce((sum, asset) => sum + (asset.comments ?? 0), 0),
    byPlatform: platforms.map((platform) => ({ platform, ...weightedFor(platform) }))
      .map(({ platform, rate, measuredPosts }) => ({ platform, rate, measuredPosts })),
  };
}

function buildInsights(
  metrics: DashboardMetrics,
  assets: EkatorAssetSnapshot,
  channelSnapshot: EkatorChannelSnapshot,
): Insight[] {
  const concentration = metrics.youtubeTotalViews > 0 && metrics.episodeCount > 0
    ? (metrics.episodeViews / metrics.youtubeTotalViews) * 100
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
  const fullEpisodes = assets.assets
    .filter((asset) => asset.platform === 'youtube')
    .map((asset) => ({ asset, episodeNumber: fullEpisodeNumberFromCaption(asset.caption) }))
    .filter((entry): entry is { asset: EkatorAsset; episodeNumber: number } => entry.episodeNumber !== null)
    .sort((a, b) => a.episodeNumber - b.episodeNumber);
  const newestFullEpisode = fullEpisodes.at(-1);
  const newestEpisodeNumber = newestFullEpisode?.episodeNumber ?? null;
  const newestEpisodeAsset = newestFullEpisode?.asset;
  const newestEpisodeViews = newestEpisodeAsset?.views ?? 0;
  const newestEpisodeInteractions = newestEpisodeAsset ? knownInteractions(newestEpisodeAsset) : 0;
  const activePreview = findActivePreview(assets.assets, newestFullEpisode?.asset);
  const activePreviewRate = activePreview ? interactionRate(activePreview) : null;
  const activePreviewName = activePreview && isFinalePreviewCaption(activePreview.caption) ? 'Finale preview' : 'Latest preview';

  return [
    {
      label: 'Episode-led YouTube demand',
      stat: concentration === null ? '—' : `${concentration.toFixed(1)}%`,
      read: concentration === null
        ? 'Published YouTube performance is temporarily unavailable, so demand concentration cannot be calculated.'
        : `${metrics.episodeCount} measured episodes account for ${concentration.toFixed(1)}% of ${compact(metrics.youtubeTotalViews)} official YouTube views.`,
      action: concentration === null
        ? 'Restore the performance read before changing the publishing plan.'
        : 'Use the newest episode as the source for the next short-form sprint.',
      tone: 'watch',
    },
    {
      label: 'Instagram Reel demand',
      stat: instagramViews > 0 ? compact(instagramViews) : '—',
      read: instagramViews > 0
        ? `${instagramViewAssets.length} verified Reels generated ${compact(instagramViews)} views across an audience of ${compact(instagramAudience)} followers (${instagramShare?.toFixed(1) ?? '—'}% of owned audience). ${instagramMeasuredPosts} posts carry measured performance.`
        : 'Instagram Reel views are collecting; verified post interactions remain available.',
      action: 'Use view totals and interaction rate together to choose the next hooks and story beats.',
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
    activePreview
      ? {
          label: `${activePreviewName} signal`,
          stat: activePreview.views !== null ? compact(activePreview.views) : compact(knownInteractions(activePreview)),
          read: `The live ${activePreviewName.toLocaleLowerCase()} has ${activePreview.views === null ? 'no public view count and' : `${compact(activePreview.views)} current views and`} ${compact(knownInteractions(activePreview))} known interactions${activePreviewRate === null ? '' : ` (${activePreviewRate.toFixed(1)}% interaction rate)`} in the latest snapshot.`,
          action: 'Mirror the same hook across owned short-form channels and link each cut into the episode playlist.',
          tone: 'strong' as const,
        }
      : {
          label: newestEpisodeNumber === null ? 'Newest episode signal' : `Newest episode signal · EP ${newestEpisodeNumber}`,
          stat: newestEpisodeViews > 0 ? compact(newestEpisodeViews) : '—',
          read: newestEpisodeAsset
            ? `Episode ${newestEpisodeNumber} holds ${compact(newestEpisodeViews)} current YouTube views and ${compact(newestEpisodeInteractions)} known interactions. Companion short-form posts show which hooks to repeat.`
            : 'No canonical full-episode publication is currently identified for the newest episode.',
          action: newestEpisodeAsset
            ? 'Carry the strongest companion hook into Reels, Shorts, and TikTok, then link each cut back to the full episode.'
            : 'Confirm the newest episode title before changing the cross-platform sequence.',
          tone: 'strong' as const,
        },
  ];
}

function buildRecommendations(
  metrics: DashboardMetrics,
  assets: EkatorAssetSnapshot,
  channelSnapshot: EkatorChannelSnapshot,
): Rec[] {
  const youtubeEpisodes = assets.assets
    .filter((asset) => asset.platform === 'youtube')
    .map((asset) => ({ asset, episodeNumber: fullEpisodeNumberFromCaption(asset.caption) }))
    .filter((entry): entry is { asset: EkatorAsset; episodeNumber: number } => entry.episodeNumber !== null)
    .sort((a, b) => a.episodeNumber - b.episodeNumber);
  const firstEpisode = youtubeEpisodes[0];
  const newestEpisode = youtubeEpisodes.at(-1);
  const activePreview = findActivePreview(assets.assets, newestEpisode?.asset);
  const activePreviewRate = activePreview ? interactionRate(activePreview) : null;
  const activePreviewName = activePreview && isFinalePreviewCaption(activePreview.caption) ? 'finale preview' : 'latest preview';
  const matchedCuts = buildMatchedCrossPlatformCuts(assets.assets);
  const reachLeader = [...matchedCuts]
    .sort((a, b) => matchedCutStats(b).combinedViews - matchedCutStats(a).combinedViews)[0];
  const responseLeader = [...matchedCuts]
    .filter((cut) => cut.youtube.itemId !== reachLeader?.youtube.itemId)
    .sort((a, b) => (matchedCutStats(b).interactionRate ?? 0) - (matchedCutStats(a).interactionRate ?? 0))[0];
  const reachStats = reachLeader ? matchedCutStats(reachLeader) : null;
  const responseStats = responseLeader ? matchedCutStats(responseLeader) : null;
  const episodeShare = metrics.youtubeTotalViews > 0 ? (metrics.episodeViews / metrics.youtubeTotalViews) * 100 : null;
  const tiktok = channelSnapshot.channels.find((channel) => channel.platform === 'tiktok');
  const tiktokAudience = tiktok?.audience ?? 0;
  const tiktokPosts = platformPostCount('tiktok', assets, channelSnapshot);
  const moves: Omit<Rec, 'rank'>[] = [];

  moves.push(reachLeader && reachStats
    ? {
        title: 'Scale the strongest cross-platform hook now',
        why: `“${reachLeader.title}” holds ${compact(reachStats.combinedViews)} current views and ${compact(reachStats.combinedInteractions)} known interactions across Instagram and YouTube${reachStats.interactionRate === null ? '' : ` (${reachStats.interactionRate.toFixed(1)}% interaction rate)`}.`,
        move: 'Release a first-person stakes cut and a context-first member-reaction cut. Preserve the core identity statement in the opening frame.',
        owner: 'Creative strategy',
        impact: 'High',
      }
    : activePreview
      ? {
          title: isFinalePreviewCaption(activePreview.caption) ? 'Make the live finale preview the campaign anchor' : 'Make the latest preview the campaign anchor',
          why: `The live ${activePreviewName} has ${activePreview.views === null ? 'no public view count and' : `${compact(activePreview.views)} current views and`} ${compact(knownInteractions(activePreview))} known interactions${activePreviewRate === null ? '' : ` (${activePreviewRate.toFixed(1)}% interaction rate)`}.`,
          move: 'Extend the live preview across Reels, Shorts, and TikTok, then route each cut into the episode playlist.',
          owner: 'Content / clipping',
          impact: 'High',
        }
      : newestEpisode
        ? {
            title: `Turn Episode ${newestEpisode.episodeNumber} into a same-day short-form sequence`,
            why: `The newest full episode has ${compact(newestEpisode.asset.views ?? 0)} current views and ${compact(knownInteractions(newestEpisode.asset))} known interactions${interactionRate(newestEpisode.asset) === null ? '' : ` (${interactionRate(newestEpisode.asset)?.toFixed(1)}% interaction rate)`}.`,
            move: 'Release one suspense beat, one payoff or reaction beat, and one direct full-episode bridge across Reels, Shorts, and TikTok with the same episode identifier and opening-frame language.',
            owner: 'Content / clipping',
            impact: 'High',
          }
    : {
        title: 'Confirm the newest full episode before scaling output',
        why: metrics.hasMeasuredPerformance ? 'Current YouTube performance is available, but no full-episode title is identified.' : 'Current YouTube performance is unavailable.',
        move: 'Confirm the newest full-episode title, then build the next short-form sequence from its strongest story beats.',
        owner: 'Content',
        impact: 'High',
      });

  moves.push(reachLeader && reachStats && newestEpisode
    ? {
        title: `Bridge short-form momentum into Episode ${newestEpisode.episodeNumber}`,
        why: `“${reachLeader.title}” holds ${compact(reachStats.combinedViews)} current cross-platform views, while Episode ${newestEpisode.episodeNumber} holds ${compact(newestEpisode.asset.views ?? 0)} YouTube views. These are current cumulative totals, not proof of click-through.`,
        move: `Give both follow-up cuts a direct Episode ${newestEpisode.episodeNumber} destination through the caption, pinned comment, profile link, playlist, and end screen.`,
        owner: 'Owned social',
        impact: 'High',
      }
    : {
        title: 'Create the next cross-platform episode bridge',
        why: 'A current cross-platform hook and canonical newest episode are not both available.',
        move: 'Confirm the newest full episode and publish a matched Reel and Short before assigning the next bridge.',
        owner: 'Owned social',
        impact: 'High',
      });

  moves.push(responseLeader && responseStats
    ? {
          title: 'Turn the highest-response hook into a follow-up',
          why: `“${responseLeader.title}” holds ${compact(responseStats.combinedViews)} current views and ${compact(responseStats.combinedInteractions)} known interactions across its matched versions${responseStats.interactionRate === null ? '' : ` (${responseStats.interactionRate.toFixed(1)}% interaction rate)`}.`,
          move: 'Publish one audience-reaction montage and one context-first version for viewers unfamiliar with the series, both linking to the newest episode.',
          owner: 'Creative strategy',
          impact: 'High',
        }
    : {
        title: 'Create a second comparable cross-platform hook',
        why: 'Fewer than two matched Reel and Short pairs are currently available, so a separate response leader cannot be identified.',
        move: 'Publish one reaction-led beat with the same opening language on Instagram and YouTube, then compare view-weighted interaction rates.',
        owner: 'Owned social',
        impact: 'Medium',
      });

  moves.push(tiktokPosts === 0
    ? {
        title: 'Activate TikTok with the proven campaign cuts',
        why: tiktokAudience > 0
          ? `${compact(tiktokAudience)} followers and zero published posts are currently recorded.`
          : 'Zero published TikTok posts are currently recorded; the audience total is unavailable.',
        move: reachLeader && responseLeader
          ? `Publish “${reachLeader.title}” first, “${responseLeader.title}” second, and a lighter character or group beat third. Record first-hour, 24-hour, and 72-hour views and interactions separately.`
          : 'Publish the strongest current hook, a character reaction, and a lighter group moment, then record first-hour, 24-hour, and 72-hour views and interactions separately.',
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

  moves.push(firstEpisode && newestEpisode && firstEpisode.episodeNumber !== newestEpisode.episodeNumber
    ? {
        title: `Build an Episode ${firstEpisode.episodeNumber} to Episode ${newestEpisode.episodeNumber} binge path`,
        why: episodeShare === null
          ? 'The episode share of current YouTube views is unavailable.'
          : `${metrics.episodeCount} full episodes account for ${episodeShare.toFixed(1)}% of ${compact(metrics.youtubeTotalViews)} official YouTube views. Episode ${firstEpisode.episodeNumber} remains the entry point at ${compact(firstEpisode.asset.views ?? 0)}, while Episode ${newestEpisode.episodeNumber} holds ${compact(newestEpisode.asset.views ?? 0)}. These cumulative totals cover different live windows.`,
        move: 'Connect the series with playlist order, end screens, pinned comments, and short-form descriptions. Present the first episode as the start point and the newest episode as the catch-up point.',
        owner: 'YouTube',
        impact: 'High',
      }
    : {
        title: 'Create a clear first-to-latest episode path',
        why: 'The current publication set does not identify both a first and newest full episode.',
        move: 'Confirm episode numbering, then connect the series with a playlist, end screens, and pinned comments.',
        owner: 'YouTube',
        impact: 'High',
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
  { metric: 'Episode click-through', use: 'Whether paid clips create traffic to the anchor episode.' },
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

/** Manual refresh control */
function RefreshButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const refresh = async () => {
    if (state === 'loading') return;
    setState('loading');
    try {
      const response = await fetch('/api/ekator/refresh', { method: 'POST' });
      if (!response.ok) throw new Error('Refresh failed');
      window.location.reload();
    } catch {
      setState('error');
    }
  };
  return (
    <button type="button" onClick={refresh} disabled={state === 'loading'} className="min-h-11 rounded-lg border px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-[#FD3737] hover:text-white disabled:cursor-wait disabled:opacity-60" style={{ borderColor: red, color: state === 'error' ? '#D42D2D' : red }}>
      {state === 'loading' ? 'Refreshing…' : state === 'error' ? 'Retry refresh' : 'Refresh now'}
    </button>
  );
}

/** Evergreen hero — durable campaign-health signals */
function EvergreenKpiRail({ metrics, channels, growth, interaction }: { metrics: DashboardMetrics; channels: Channel[]; growth: AudienceGrowth; interaction: InteractionSnapshot }) {
  const measuredAttention = channels.reduce((sum, channel) => sum + (channel.views ?? 0), 0);
  const items = [
    { label: 'Owned Audience', value: metrics.ownedAudience > 0 ? compact(metrics.ownedAudience) : '—', sub: 'Instagram + YouTube + TikTok' },
    {
      label: '7-Day Growth',
      value: growth.percent === null ? '—' : `${growth.percent >= 0 ? '+' : ''}${growth.percent.toFixed(1)}%`,
      sub: growth.net === null ? 'Collecting 7-day baseline' : `${growth.net >= 0 ? '+' : ''}${compact(growth.net)} audience · 7 days`,
    },
    { label: 'Measured Interaction', value: interaction.rate === null ? '—' : `${interaction.rate.toFixed(1)}%`, sub: interaction.rate === null ? 'Awaiting view-backed posts' : `${compact(interaction.interactions)} interactions · ${interaction.measuredPosts} posts` },
    { label: 'Measured Attention', value: measuredAttention > 0 ? compact(measuredAttention) : '—', sub: measuredAttention > 0 ? 'Source-backed public views' : 'View coverage pending' },
  ];
  return (
    <div className="grid min-w-0 grid-cols-2 gap-px overflow-hidden rounded-lg bg-[#242424] lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 bg-[#0E0E0E] px-4 py-4 sm:px-5">
          <div className="text-[9px] uppercase tracking-[0.18em] text-[#A0A0AA]">{item.label}</div>
          <div className="mt-2 font-mono text-2xl font-black leading-none text-white sm:text-3xl">{item.value}</div>
          <div className="mt-2 min-h-7 text-[10px] leading-snug text-[#A0A0AA]">{item.sub}</div>
        </div>
      ))}
    </div>
  );
}

function AudienceMomentum({ timeline, channels, growth }: { timeline: AudienceTimelinePoint[]; channels: Channel[]; growth: AudienceGrowth }) {
  const width = 760;
  const height = 240;
  const padX = 28;
  const padTop = 28;
  const padBottom = 42;
  const latest = timeline.at(-1);
  const totals = timeline.map((point) => point.total);
  const minTotal = totals.length > 0 ? Math.min(...totals) : 0;
  const maxTotal = totals.length > 0 ? Math.max(...totals) : 0;
  const spread = Math.max(1, maxTotal - minTotal);
  const yMin = Math.max(0, minTotal - spread * 0.18);
  const yMax = maxTotal + spread * 0.18;
  const firstTimestamp = timeline[0]?.timestamp ?? 0;
  const lastTimestamp = latest?.timestamp ?? firstTimestamp + 1;
  const timeSpan = Math.max(1, lastTimestamp - firstTimestamp);
  const xFor = (timestamp: number) => padX + ((timestamp - firstTimestamp) / timeSpan) * (width - padX * 2);
  const yFor = (value: number) => padTop + (1 - ((value - yMin) / Math.max(1, yMax - yMin))) * (height - padTop - padBottom);
  const path = timeline.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xFor(point.timestamp).toFixed(1)} ${yFor(point.total).toFixed(1)}`).join(' ');
  const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(value));
  const rawAudienceTotal = channels.reduce((sum, channel) => sum + channel.audience, 0);
  const audienceDenominator = Math.max(1, rawAudienceTotal);
  const growthLabel = growth.percent === null ? 'Collecting 7-day baseline' : `${growth.percent >= 0 ? '+' : ''}${growth.percent.toFixed(1)}% over 7 days`;
  return (
    <section className="min-w-0 rounded-lg border bg-[#0E0E0E] p-4 sm:p-6" style={{ borderColor: line }} aria-labelledby="audience-momentum-title">
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-end sm:justify-between" style={{ borderColor: line }}>
        <div><div id="audience-momentum-title" className="text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>Audience Momentum</div><div className="mt-1 text-xs text-[#A0A0AA]">Combined owned audience · rolling 30-day window</div></div>
        <div className="sm:text-right"><div className="font-mono text-3xl font-black text-white">{latest ? compact(latest.total) : compact(rawAudienceTotal)}</div><div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#A0A0AA]">{growthLabel}</div></div>
      </div>
      {timeline.length >= 2 ? (
        <div className="mt-4 overflow-hidden rounded-md border bg-[#0A0A0A]" style={{ borderColor: '#202020' }}>
          <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" role="img" aria-label={`Combined audience trend from ${formatDate(timeline[0].capturedAt)} to ${formatDate(latest?.capturedAt ?? timeline[0].capturedAt)}`}>
            {[0.2, 0.5, 0.8].map((fraction) => { const y = padTop + fraction * (height - padTop - padBottom); return <line key={fraction} x1={padX} x2={width - padX} y1={y} y2={y} stroke="#202020" strokeWidth="1" />; })}
            <defs><linearGradient id="audience-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={red} stopOpacity="0.24" /><stop offset="100%" stopColor={red} stopOpacity="0" /></linearGradient></defs>
            <path d={`${path} L ${xFor(lastTimestamp).toFixed(1)} ${height - padBottom} L ${xFor(firstTimestamp).toFixed(1)} ${height - padBottom} Z`} fill="url(#audience-area)" />
            <path d={path} fill="none" stroke={red} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {timeline.map((point, index) => <circle key={point.capturedAt} cx={xFor(point.timestamp)} cy={yFor(point.total)} r={index === timeline.length - 1 ? 5 : 3} fill={index === timeline.length - 1 ? white : red} stroke="#0A0A0A" strokeWidth="2" />)}
            <text x={padX} y={height - 15} fill="#A0A0AA" fontSize="12" fontFamily="monospace">{formatDate(timeline[0].capturedAt)}</text><text x={width - padX} y={height - 15} fill="#A0A0AA" fontSize="12" fontFamily="monospace" textAnchor="end">{formatDate(latest?.capturedAt ?? timeline[0].capturedAt)}</text>
          </svg>
        </div>
      ) : (
        <div className="mt-4 flex min-h-72 items-center justify-center rounded-md border bg-[#0A0A0A] px-5 text-center" style={{ borderColor: '#202020' }}><div><div className="font-mono text-2xl font-black text-white">TREND COLLECTING</div><div className="mt-2 max-w-sm text-xs leading-relaxed text-[#A0A0AA]">Daily audience snapshots are connected. The trajectory appears after a second complete capture.</div></div></div>
      )}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {channels.map((channel) => { const share = (channel.audience / audienceDenominator) * 100; return <div key={channel.name} className="rounded-md border bg-[#111111] px-3 py-3" style={{ borderColor: '#202020' }}><div className="flex items-baseline justify-between gap-3"><span className="text-xs font-semibold text-white">{channel.name}</span><span className="font-mono text-xs font-bold text-white">{compact(channel.audience)}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#242424]"><div className="h-full rounded-full" style={{ width: `${Math.max(2, share)}%`, background: channel.status === 'risk' ? red : light }} /></div><div className="mt-1.5 font-mono text-[9px] text-[#A0A0AA]">{share.toFixed(1)}% of audience</div></div>; })}
      </div>
    </section>
  );
}

function InteractionHealth({ interaction }: { interaction: InteractionSnapshot }) {
  const maxRate = Math.max(1, ...interaction.byPlatform.map((entry) => entry.rate ?? 0));
  const labels: Record<EkatorOwnedChannel['platform'], string> = { instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok' };
  return (
    <section className="min-w-0 rounded-lg border bg-[#0E0E0E] p-4 sm:p-5" style={{ borderColor: line }} aria-labelledby="interaction-health-title">
      <div className="flex items-start justify-between gap-4 border-b pb-4" style={{ borderColor: line }}><div><div id="interaction-health-title" className="text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>Interaction Health</div><div className="mt-1 text-xs text-[#A0A0AA]">View-weighted portfolio interaction rate</div></div><div className="text-right"><div className="font-mono text-3xl font-black text-white">{interaction.rate === null ? '—' : `${interaction.rate.toFixed(1)}%`}</div><div className="font-mono text-[9px] uppercase tracking-wider text-[#A0A0AA]">{interaction.measuredPosts} view-backed posts</div></div></div>
      <div className="mt-4 space-y-4">{interaction.byPlatform.map((entry) => <div key={entry.platform}><div className="flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-[#E4E4E9]">{labels[entry.platform]}</span><span className="font-mono font-bold text-white">{entry.rate === null ? '—' : `${entry.rate.toFixed(1)}%`}</span></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#242424]"><div className="h-full rounded-full" style={{ width: entry.rate === null ? '0%' : `${Math.max(3, (entry.rate / maxRate) * 100)}%`, background: entry.platform === 'tiktok' ? red : light }} /></div><div className="mt-1 font-mono text-[9px] text-[#A0A0AA]">{entry.measuredPosts} view-backed {entry.measuredPosts === 1 ? 'post' : 'posts'}</div></div>)}</div>
      <p className="mt-4 border-t pt-3 text-[10px] leading-relaxed text-[#A0A0AA]" style={{ borderColor: line }}>Likes + comments + shares ÷ measured views. Posts without a public view count are excluded.</p>
    </section>
  );
}

function SentimentPulse({ interaction }: { interaction: InteractionSnapshot }) {
  return (
    <section className="min-w-0 rounded-lg border bg-[#0E0E0E] p-4 sm:p-5" style={{ borderColor: line }} aria-labelledby="sentiment-pulse-title">
      <div className="flex items-start justify-between gap-4"><div><div id="sentiment-pulse-title" className="text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>Sentiment Pulse</div><div className="mt-1 text-xs text-[#A0A0AA]">Audience quality signal</div></div><span className="rounded-sm border px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider" style={{ borderColor: red, color: red }}>Data gap</span></div>
      <div className="mt-5 font-mono text-2xl font-black text-white">Not yet measured</div>
      <p className="mt-2 text-xs leading-relaxed text-[#E4E4E9]">{compact(interaction.comments)} comments are counted, but comment text and polarity are not connected. No sentiment score is inferred from interaction totals.</p>
      <div className="mt-4 border-t pt-3" style={{ borderColor: line }}><div className="text-[9px] uppercase tracking-[0.16em] text-[#A0A0AA]">Required next layer</div><div className="mt-1 text-xs leading-relaxed text-white">Comment ingestion, language normalization, and positive / neutral / negative classification with sample coverage.</div></div>
    </section>
  );
}

function ExecutiveRead({ metrics, channels, recommendations }: { metrics: DashboardMetrics; channels: Channel[]; recommendations: Rec[] }) {
  const measuredChannels = channels.filter((channel) => channel.views !== null && channel.views > 0);
  const measuredViews = measuredChannels.reduce((sum, channel) => sum + (channel.views ?? 0), 0);
  const leader = [...measuredChannels].sort((a, b) => (b.views ?? 0) - (a.views ?? 0))[0];
  const leaderShare = leader && measuredViews > 0 ? ((leader.views ?? 0) / measuredViews) * 100 : null;
  const tiktok = channels.find((channel) => channel.name === 'TikTok');
  const tiktokDormant = (tiktok?.postCount ?? 0) === 0;
  const reads = [
    { label: 'Winning', value: leader && leaderShare !== null ? `${leader.name} carries ${leaderShare.toFixed(1)}% of measured public views.` : 'Measured attention is still collecting.', accent: light },
    { label: 'Risk', value: tiktokDormant ? (tiktok && tiktok.audience > 0 ? `${compact(tiktok.audience)} TikTok followers remain inactive with no official posts.` : 'TikTok publishing remains inactive with no official posts.') : 'No channel-level activation gap is currently flagged.', accent: red },
    { label: 'Next move', value: recommendations[0]?.move ?? (tiktokDormant ? 'Publish the first controlled TikTok cuts and establish a seven-day pacing baseline.' : metrics.hasMeasuredPerformance ? 'Repeat the strongest cross-platform hook inside a comparable measurement window.' : 'Restore post-level performance coverage before changing the content plan.'), accent: red },
  ];
  return (
    <section className="grid overflow-hidden rounded-lg border bg-[#0E0E0E] md:grid-cols-3" style={{ borderColor: line }} aria-label="Executive read">{reads.map((read, index) => <div key={read.label} className={`relative min-w-0 px-4 py-4 sm:px-5 ${index > 0 ? 'border-t md:border-l md:border-t-0' : ''}`} style={{ borderColor: line }}><div className="absolute left-0 top-0 h-full w-1" style={{ background: read.accent }} /><div className="text-[9px] uppercase tracking-[0.18em] text-[#A0A0AA]">{read.label}</div><p className="mt-2 text-sm font-semibold leading-snug text-white">{read.value}</p></div>)}</section>
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
    { label: 'Paid', value: 'NO VERIFIED DELIVERY' as const },
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

/* ── COMMAND CENTER (above the fold) ──────────────────────────────── */

function CommandCenter({ registry, assets, metrics, channels, audienceTimeline, growth, interaction, recommendations }: { registry: EkatorRegistrySnapshot; assets: EkatorAssetSnapshot; metrics: DashboardMetrics; channels: Channel[]; audienceTimeline: AudienceTimelinePoint[]; growth: AudienceGrowth; interaction: InteractionSnapshot; recommendations: Rec[] }) {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[1400px] px-4 pb-6 pt-8 sm:pt-12 md:px-6 lg:px-8 lg:pt-20">
      <div className="mb-4 flex min-w-0 flex-col items-start gap-4 border-b pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:pb-3" style={{ borderColor: line }}>
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#A0A0AA]"><span style={{ color: red }}>●</span> EKATOR Social Dashboard</div>
          <h1 className="mt-2 font-mono text-3xl font-black leading-[0.9] tracking-[-0.04em] text-white md:text-4xl"><span className="block sm:inline">EKATOR</span>{' '}<span className="mt-1 block sm:mt-0 sm:inline" style={{ color: red }}>COMMAND CENTER</span></h1>
        </div>
        <div className="flex w-full min-w-0 flex-wrap items-end justify-between gap-4 sm:w-auto sm:flex-nowrap sm:justify-start">
          <RefreshButton />
          <div className="text-right"><div className="text-[10px] uppercase tracking-[0.2em] text-[#A0A0AA]">Last refreshed</div><div className="font-mono text-xs text-[#E4E4E9]">{metrics.readLabel}</div></div>
        </div>
      </div>

      <div className="mb-3"><EvergreenKpiRail metrics={metrics} channels={channels} growth={growth} interaction={interaction} /></div>

      <div className="mb-3 grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(300px,0.8fr)]">
        <AudienceMomentum timeline={audienceTimeline} channels={channels} growth={growth} />
        <div className="grid min-w-0 gap-3">
          <InteractionHealth interaction={interaction} />
          <SentimentPulse interaction={interaction} />
        </div>
      </div>

      <div className="mb-3"><ExecutiveRead metrics={metrics} channels={channels} recommendations={recommendations} /></div>

      <div className="rounded-lg border" style={{ borderColor: line, background: '#0E0E0E' }}><StatusStrip registry={registry} assets={assets} /></div>
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
            <div className="text-[10px] uppercase tracking-wider text-[#A0A0AA]">Interaction rate</div>
            <div className="mt-1 font-mono text-xl font-bold text-white">{channel.interactionRate}</div>
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
            <div>Interaction rate</div>
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
                <div className="font-mono text-sm font-bold" style={{ color: statusColor(ch.status) }}>{ch.share.toFixed(1)}%</div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#161616]">
                  <div className="h-full rounded-full" style={{ width: `${ch.share}%`, background: statusColor(ch.status) }} />
                </div>
              </div>
              <div className="font-mono text-sm font-bold" style={{ color: ch.interactionRate === '—' ? muted : white }}>{ch.interactionRate}</div>
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
            <div className="text-[10px] uppercase tracking-wider text-[#A0A0AA]">Interaction rate</div>
            <div className="mt-0.5 font-mono text-lg font-bold" style={{ color: red }}>{interactionRate(asset) !== null ? `${interactionRate(asset)?.toFixed(1)}%` : '—'}</div>
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
  const [sort, setSort] = useState<'views-desc' | 'views-asc' | 'date-desc' | 'date-asc' | 'interaction-rate-desc'>('views-desc');
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
    { value: 'interaction-rate-desc', label: 'Interaction rate ↓' },
  ];

  const filtered = filter === 'All' ? allAssets : allAssets.filter(a => a.platform === filter);
  const maxViews = Math.max(1, ...filtered.map(a => a.views ?? 0));
  const sorted = [...filtered].sort((a, b) => {
    const av = a.views ?? 0;
    const bv = b.views ?? 0;
    const ae = interactionRate(a) ?? 0;
    const be = interactionRate(b) ?? 0;
    const ad = a.postDate ? new Date(a.postDate).getTime() : 0;
    const bd = b.postDate ? new Date(b.postDate).getTime() : 0;
    switch (sort) {
      case 'views-desc': return bv - av;
      case 'views-asc': return av - bv;
      case 'date-desc': return bd - ad;
      case 'date-asc': return ad - bd;
      case 'interaction-rate-desc': return be - ae;
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
              const rate = interactionRate(asset);
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
                        <div className="font-mono text-sm font-bold text-white">{rate !== null ? `${rate.toFixed(1)}%` : '—'}</div>
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
  const interactionVelocityFor = (asset: EkatorAsset) => Math.round(knownInteractions(asset) / ageDaysFor(asset));
  const episodeAssets = publishedAssets
    .filter((asset) => asset.platform === 'youtube' && fullEpisodeNumberFromCaption(asset.caption) !== null)
    .sort((a, b) => (fullEpisodeNumberFromCaption(a.caption) ?? 0) - (fullEpisodeNumberFromCaption(b.caption) ?? 0));
  const episodeIds = new Set(episodeAssets.map((asset) => asset.itemId));
  const velocityAssets = publishedAssets
    .filter((asset) => !episodeIds.has(asset.itemId))
    .map((asset) => ({ asset, velocity: velocityFor(asset) }))
    .sort((a, b) => b.velocity - a.velocity);
  const interactionVelocityAssets = assets.assets
    .filter((asset) => asset.postDate && knownInteractions(asset) > 0)
    .map((asset) => ({ asset, velocity: interactionVelocityFor(asset), total: knownInteractions(asset) }))
    .sort((a, b) => b.velocity - a.velocity)
    .slice(0, 12);
  const maxVelocity = Math.max(1, ...velocityAssets.map((entry) => entry.velocity));
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
          <div>Platform</div><div>Audience</div><div>Coverage</div><div>Current read / Next data</div>
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

      {/* Velocity */}
      <div>
        <div className="rounded-lg border p-5" style={{ borderColor: line, background: '#0E0E0E' }}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: red }}>Average view pace since publish</div>
              <div className="mt-1 text-[10px] text-[#A0A0AA]">Cumulative views divided by days since publication—not a recent-period velocity read. Hover or focus any bar for exact values.</div>
            </div>
            <div className="font-mono text-[11px] text-[#A0A0AA]">views/day since publish · {metrics.readLabel}</div>
          </div>
          {episodeAssets.length > 0 && (
            <div className="mb-5 rounded-md border px-4 py-3" style={{ background: '#140A0A', borderColor: '#3A1717' }}>
              <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: red }}>Episode anchors</div>
              <div className="mt-1 font-mono text-[10px] text-[#A0A0AA]">Separated from other YouTube publications for a comparable pacing read.</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {episodeAssets.map((asset) => (
                  <div key={asset.itemId} className="flex min-w-0 items-center justify-between gap-3 rounded border px-3 py-2" style={{ borderColor: '#3A1717' }}>
                    <div className="min-w-0"><div className="truncate text-xs font-semibold text-white">{asset.caption}</div><div className="font-mono text-[9px] text-[#A0A0AA]">{compact(asset.views ?? 0)} total</div></div>
                    <div className="shrink-0 font-mono text-lg font-black" style={{ color: red }}>{compact(velocityFor(asset))}/day avg</div>
                  </div>
                ))}
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
                  aria-label={`${asset.caption}: ${velocity.toLocaleString()} average views per day since publish, ${asset.views?.toLocaleString()} total views`}
                  aria-describedby={`velocity-tooltip-${index}`}
                >
                  <span
                    id={`velocity-tooltip-${index}`}
                    className={`pointer-events-none absolute top-2 z-20 hidden w-52 rounded-md border bg-[#0A0A0A] p-3 text-left shadow-2xl group-hover:block group-focus-visible:block ${index === 0 ? 'left-0' : index === velocityAssets.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}
                    style={{ borderColor: '#444' }}
                    role="tooltip"
                  >
                    <span className="block text-xs font-bold leading-snug text-white">{asset.caption}</span>
                    <span className="mt-2 block font-mono text-lg font-black" style={{ color: red }}>{velocity.toLocaleString()} views/day since publish</span>
                    <span className="mt-1 block font-mono text-[10px] text-[#A0A0AA]">{asset.views?.toLocaleString()} total · {asset.postDate}</span>
                  </span>
                  <span className="mb-2 block font-mono text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{compact(velocity)}/day avg</span>
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
                <span className="shrink-0 font-mono font-bold text-white">{compact(velocity)}/day avg</span>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t pt-5" style={{ borderColor: line }}>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: red }}>Average interaction pace since publish</div>
                <div className="mt-1 text-[10px] text-[#A0A0AA]">Known likes, comments, and shares divided by days since publication.</div>
              </div>
              <div className="font-mono text-[10px] text-[#A0A0AA]">interactions/day since publish</div>
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
                  <span className="font-mono text-xs font-black text-white">{compact(velocity)}/day avg</span>
                </a>
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-[#A0A0AA]">Reel views and interactions are connected. This age-normalized average keeps posts with unavailable views in the comparison without implying a recent-period delta.</p>
          </div>
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
            <span className="font-mono text-sm font-bold" style={{ color: '#D42D2D' }}>NO VERIFIED DELIVERY</span>
          </div>
          <div className="mb-4 rounded-md p-4" style={{ background: '#140A0A' }}>
            <p className="text-sm leading-relaxed text-white">No verified paid delivery is available. Spend, reach, efficiency, and conversion will appear here when delivery is confirmed.</p>
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
  const audienceTimeline = useMemo(() => buildAudienceTimeline(channelSnapshot), [channelSnapshot]);
  const audienceGrowth = useMemo(() => deriveSevenDayAudienceGrowth(audienceTimeline), [audienceTimeline]);
  const interaction = useMemo(() => derivePortfolioInteraction(assets), [assets]);
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
          <div className="flex min-w-0 flex-1 items-center justify-start gap-2 overflow-x-auto [scrollbar-width:none] lg:justify-center lg:gap-5 [&::-webkit-scrollbar]:hidden">
            {nav.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="flex min-h-11 min-w-11 shrink-0 items-center justify-center font-mono text-[10px] uppercase tracking-[0.12em] text-[#A0A0AA] transition-colors hover:text-[#FD3737] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FD3737] lg:tracking-[0.15em]">{label}</a>
            ))}
          </div>
          <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] xl:block" style={{ color: red }}>Living Dashboard</span>
        </div>
      </nav>

      {/* COMMAND CENTER — above the fold */}
      <header ref={heroRef} className="min-h-[100dvh] min-w-0 pt-14">
        <CommandCenter registry={registry} assets={assets} metrics={metrics} channels={channelData} audienceTimeline={audienceTimeline} growth={audienceGrowth} interaction={interaction} recommendations={recommendations} />
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
        <SectionHeader num="04" title="Measurement Layers" subtitle="Post-level performance, pacing, sentiment, and paid delivery." />
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
