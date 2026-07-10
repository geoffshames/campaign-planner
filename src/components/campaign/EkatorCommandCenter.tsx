'use client';

import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Gauge } from '@/components/charts/gauge';
import { RingChart } from '@/components/charts/ring-chart';
import { Ring } from '@/components/charts/ring';
import { RingCenter } from '@/components/charts/ring-center';
import type { EkatorRegistrySnapshot, EkatorAssetSnapshot, EkatorAsset } from '@/lib/ekator-dashboard';

/* ── DATA ─────────────────────────────────────────────────────────── */

const red = '#FD3737';
const line = '#2A2A2A';
const muted = '#A0A0AA';
const light = '#E4E4E9';
const white = '#FAFAFA';

const ownedAudience = 78_680;

type Channel = {
  name: string;
  handle: string;
  audience: number;
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
type DashboardMetrics = {
  hasMeasuredPerformance: boolean;
  youtubeTotalViews: number;
  longformViews: number;
  teaserViews: number;
  shortsViews: number;
  shortsCount: number;
  videoCount: number;
  youtubeEngagement: number | null;
  teaserDetected: boolean;
  readLabel: string;
};

function deriveDashboardMetrics(snapshot: EkatorAssetSnapshot): DashboardMetrics {
  const published = snapshot.assets.filter((asset) => asset.platform === 'youtube' && asset.views !== null);
  if (published.length === 0) {
    return {
      hasMeasuredPerformance: false,
      youtubeTotalViews: 0,
      longformViews: 0,
      teaserViews: 0,
      shortsViews: 0,
      shortsCount: 0,
      videoCount: 0,
      youtubeEngagement: null,
      teaserDetected: false,
      readLabel: 'Data pending',
    };
  }

  const ep1 = published.find((asset) => /ep\.?\s*1/i.test(asset.caption));
  const teaser = published.find((asset) => /teaser/i.test(asset.caption));
  const shorts = published.filter((asset) => asset.itemId !== ep1?.itemId && asset.itemId !== teaser?.itemId);
  const totalViews = published.reduce((sum, asset) => sum + (asset.views ?? 0), 0);
  const interactions = published.reduce(
    (sum, asset) => sum + (asset.likes ?? 0) + (asset.comments ?? 0) + (asset.shares ?? 0),
    0,
  );
  const latestCapture = published
    .map((asset) => asset.capturedAt)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);
  const readLabel = latestCapture
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'America/Los_Angeles',
      }).format(new Date(latestCapture))
    : 'Live snapshot';

  return {
    hasMeasuredPerformance: true,
    youtubeTotalViews: totalViews,
    longformViews: ep1?.views ?? 0,
    teaserViews: teaser?.views ?? 0,
    shortsViews: shorts.reduce((sum, asset) => sum + (asset.views ?? 0), 0),
    shortsCount: shorts.length,
    videoCount: published.length,
    youtubeEngagement: totalViews > 0 ? (interactions / totalViews) * 100 : null,
    teaserDetected: Boolean(teaser),
    readLabel,
  };
}

function buildChannels(metrics: DashboardMetrics): Channel[] {
  const ytEr = metrics.youtubeEngagement === null ? '—' : `${metrics.youtubeEngagement.toFixed(1)}%`;
  const ep1Share = metrics.youtubeTotalViews > 0
    ? (metrics.longformViews / metrics.youtubeTotalViews) * 100
    : 0;
  return [
    { name: 'Instagram', handle: '@idoltillidie', audience: 65_074, posts: '10 posts', views: null, share: 79.2, engagement: '—', status: 'strong', role: 'Top-of-funnel audience reservoir', insight: 'Instagram owns nearly 80% of the known official audience, but post-level performance is not yet connected to this read.', action: 'Every IG post/story should ladder into one clear behavior: watch EP1, save a trainee clip, or follow YouTube.' },
    { name: 'YouTube', handle: '@Idoltillidie', audience: 5_280, posts: metrics.hasMeasuredPerformance ? `${metrics.videoCount} videos` : '—', views: metrics.hasMeasuredPerformance ? metrics.youtubeTotalViews : null, share: 6.4, engagement: ytEr, status: 'watch', role: 'Documentary home + retargeting anchor', insight: metrics.hasMeasuredPerformance ? `EP1 holds ${ep1Share.toFixed(1)}% of measured YouTube views, showing discovery far beyond the subscriber base.` : 'Published YouTube performance is temporarily unavailable.', action: 'Use YouTube as the source of truth for story beats, then force the short-form layer to carry those beats outward.' },
    { name: 'TikTok', handle: '@idoltillidie', audience: 11_800, posts: '0 videos', views: null, share: 14.4, engagement: '—', status: 'risk', role: 'Dormant owned distribution', insight: 'There is a meaningful follower base but no official TikTok content, so the campaign is leaving algorithmic inventory unused.', action: 'Post the first three EP1 cuts immediately: Matthew leader arc, trainee pressure, and comedic dorm/rule clip.' },
  ];
}

const insights: Insight[] = [
  { label: 'Demand is real, but concentrated', stat: '94.2%', read: 'EP1 + teaser account for almost all measured official YouTube views. The longform story is doing the work; the short-form layer is not yet distributing that demand.', action: 'Build a daily short ladder from EP1 instead of treating each clip as a one-off upload.', tone: 'watch' },
  { label: 'Instagram is the conversion gap', stat: '65.1K', read: 'Instagram is the largest owned channel by far, but the measurable viewing event lives on YouTube.', action: 'Create IG-native story posts that explicitly drive to "watch EP1" and measure link/click lift.', tone: 'strong' },
  { label: 'TikTok is unused owned leverage', stat: '11.8K / 0', read: 'The account has followers but no posts. That is the fastest fix in the system.', action: 'Launch TikTok with three narrative cuts before adding spend anywhere else.', tone: 'risk' },
  { label: 'Matthew remains the cleanest first protagonist', stat: 'Priority 1', read: 'The available short-form read points toward Matthew\'s leader arc as the clearest hook for international audiences.', action: 'Make Matthew the first controlled variable: 3 edits, 3 hooks, 3 platforms, same 24-hour read window.', tone: 'strong' },
];

type Rec = { rank: number; title: string; why: string; move: string; owner: string; impact: 'High' | 'Medium' };
const recommendations: Rec[] = [
  { rank: 1, title: 'Turn EP1 into a controlled 12-clip test, not random snippets', why: 'The longform episode is the only proven demand source right now. Shorts are not yet carrying the story outward.', move: 'Cut 12 moments across four lanes: Matthew leader, Cai origin/redemption, Oh Juni pressure, group conflict/comedy. Publish with consistent English-first hooks.', owner: 'Content / clipping', impact: 'High' },
  { rank: 2, title: 'Activate TikTok immediately', why: '11.8K official followers and zero posts is a pure distribution leak.', move: 'Post the top three EP1 cuts today. Keep captions bilingual and make the first second explain the stakes: "They debut together or fail together."', owner: 'Owned social', impact: 'High' },
  { rank: 3, title: 'Use Instagram as the fan reservoir, not a passive poster', why: 'Instagram holds ~80% of the official audience. The strongest next read is whether that audience can move toward EP1, saves, and follow-through instead of staying passive.', move: 'Add pinned EP1 CTA, story link stack, and a recurring "choose the trainee" interactive sticker for each protagonist lane.', owner: 'Owned social', impact: 'High' },
  { rank: 4, title: 'Test member-pair dynamics before scaling performance-only cuts', why: 'The clearest clips are character-led. Relationship hooks make the show easier to understand for new viewers than formal trailer language.', move: 'Build a small batch around pairings and conflicts: Matthew/Cai, dorm rules, group stakes, and "can they debut together?" pressure.', owner: 'Creative strategy', impact: 'Medium' },
  { rank: 5, title: 'Close context gaps before the next clip wave', why: 'New viewers still need fast answers: who is onscreen, what the stakes are, where to watch, and why this moment matters.', move: 'Add one-line context to every next cut so casual viewers can understand the story without already knowing the show.', owner: 'Content clarity', impact: 'Medium' },
];

type MeasureLayer = { platform: string; audience: string; coverage: string; read: string; next: string; tone: 'strong' | 'watch' | 'risk' };
const measurementLayers: MeasureLayer[] = [
  { platform: 'YouTube', audience: '5.28K subs', coverage: '10 videos with views', read: 'Post-level views are live here; EP1 is the anchor and shorts are the distribution gap.', next: 'Add likes, comments, retention, average view duration, and subscriber delta by video.', tone: 'strong' },
  { platform: 'Instagram', audience: '65.1K followers', coverage: '10 posts counted', read: 'Largest owned audience, but post-level engagement and story-click data are not in the read yet.', next: 'Capture views, likes, comments, saves, shares, story taps, link clicks, and follower delta per post.', tone: 'watch' },
  { platform: 'TikTok', audience: '11.8K followers', coverage: '0 official posts', read: 'No post-level layer can exist until the first official clips go up.', next: 'Start with first-hour, 24-hour, and 72-hour views, profile visits, follows, comments, saves, and shares.', tone: 'risk' },
];

type Sentiment = { theme: string; tags: string; use: string; status: string };
const sentimentThemes: Sentiment[] = [
  { theme: 'Matthew leadership arc', tags: 'Leader, pressure, responsibility, sympathy, international-fan clarity.', use: 'Decides whether Matthew remains the first paid/social variable.', status: 'Ready to tag' },
  { theme: 'Group stakes', tags: 'Together-or-fail framing, team tension, "can they debut?" reactions.', use: 'Decides if hooks should lead with the show premise instead of one member.', status: 'Ready to tag' },
  { theme: 'Dorm / rule comedy', tags: 'Funny rules, daily-life moments, meme comments, low-context shareability.', use: 'Decides which casual-fandom clips can scale beyond existing viewers.', status: 'Ready to tag' },
  { theme: 'Confusion / context gaps', tags: 'Questions about who, what show, voting, episode order, subtitles, where to watch.', use: 'Decides what on-screen text must be added before paid spend.', status: 'Needs comments' },
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

const followerBaselines = [
  { platform: 'Instagram', baseline: '65.1K' },
  { platform: 'YouTube', baseline: '5.28K' },
  { platform: 'TikTok', baseline: '11.8K' },
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
        <span className="font-bold">Gap: </span>TikTok 0. Shorts {((metrics.shortsViews / total) * 100).toFixed(1)}%. Story works — distribution doesn&apos;t.
      </div>
    </div>
  );
}


/** Priority timeline — numbered horizontal stepper */
function PriorityTimeline() {
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
function KpiRail({ metrics }: { metrics: DashboardMetrics }) {
  const ep1Pct = metrics.youtubeTotalViews > 0
    ? (metrics.longformViews / metrics.youtubeTotalViews) * 100
    : 0;
  const items = [
    { label: 'Audience', value: compact(ownedAudience), sub: 'IG+YT+TT', tone: 'normal' },
    { label: 'YT Views', value: metrics.hasMeasuredPerformance ? compact(metrics.youtubeTotalViews) : '—', sub: metrics.hasMeasuredPerformance ? `${metrics.videoCount} videos` : 'data pending', tone: 'normal' },
    { label: 'EP1 Gravity', value: metrics.hasMeasuredPerformance ? `${ep1Pct.toFixed(1)}%` : '—', sub: metrics.hasMeasuredPerformance ? 'of YT views' : 'data pending', tone: 'normal' },
    { label: 'Shorts', value: metrics.hasMeasuredPerformance ? compact(metrics.shortsViews) : '—', sub: metrics.hasMeasuredPerformance ? `${metrics.shortsCount} clips` : 'data pending', tone: 'risk' },
    { label: 'TikTok', value: '0', sub: '11.8K waiting', tone: 'risk' },
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
function ChannelMatrix({ channels, metrics }: { channels: Channel[]; metrics: DashboardMetrics }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {channels.map(ch => {
        const ringColor = ch.status === 'strong' ? '#E4E4E9' : statusColor(ch.status);
        const ringData = [{ label: ch.name, value: ch.audience, maxValue: 62_900, color: ringColor }];
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
                  style={{ width: ch.views ? `${Math.min(100, (ch.views / Math.max(1, metrics.youtubeTotalViews)) * 100)}%` : ch.posts === '0 videos' ? '0%' : '30%', background: ringColor, opacity: 0.85 }}
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

function CommandCenter({ registry, assets, metrics, channels }: { registry: EkatorRegistrySnapshot; assets: EkatorAssetSnapshot; metrics: DashboardMetrics; channels: Channel[] }) {
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
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#A0A0AA]">Idol Till I Die</div>
            <div className="font-mono text-xs text-[#E4E4E9]">{metrics.readLabel}</div>
          </div>
        </div>
      </div>

      {/* KPI Rail */}
      <div className="mb-3"><KpiRail metrics={metrics} /></div>

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
          <PriorityTimeline />
        </div>
      </div>

      {/* Channel matrix — 3 compact channel cards with rings */}
      <div className="mb-3 min-w-0 rounded-lg border p-4" style={{ borderColor: line, background: '#0E0E0E' }}>
        <div className="mb-3 flex min-w-0 flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>Channel Pulse</div>
          <div className="font-mono text-xs text-[#A0A0AA]">audience · status · activation</div>
        </div>
        <ChannelMatrix channels={channels} metrics={metrics} />
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
function AssetShadowbox({ asset, onClose }: { asset: EkatorAsset; onClose: () => void }) {
  const dialogRef = useDialogFocus(onClose);
  const isYouTube = asset.sourceUrl?.includes('youtu.be') || asset.sourceUrl?.includes('youtube.com');

  // Convert youtu.be/VIDEOID to embed URL
  const embedUrl = isYouTube && asset.sourceUrl
    ? asset.sourceUrl.replace('youtu.be/', 'youtube.com/embed/').replace('watch?v=', 'embed/')
    : null;

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
              const views = asset.views ?? 0;
              const engagement = asset.engagementRate;
              const hasPerformance = asset.views !== null;
              return (
                <button
                  type="button"
                  key={asset.itemId}
                  onClick={() => setSelected(asset)}
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
                    {hasPerformance ? (
                      <>
                        <div className="font-mono text-lg font-bold text-white">{compact(views)}</div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#202020]" aria-hidden="true">
                          <div className="h-full rounded-full" style={{ width: `${Math.max(2, (views / maxViews) * 100)}%`, background: red }} />
                        </div>
                      </>
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
      {selected && <AssetShadowbox asset={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

/** Insights — custom bento with mini sparkline-style accents */
function InsightBoard({ metrics }: { metrics: DashboardMetrics }) {
  const concentration = metrics.youtubeTotalViews > 0
    ? ((metrics.longformViews + metrics.teaserViews) / metrics.youtubeTotalViews) * 100
    : 0;
  const liveInsights = insights.map((ins, index) => index === 0
    ? metrics.hasMeasuredPerformance
      ? { ...ins, stat: `${concentration.toFixed(1)}%`, read: `EP1 + teaser account for ${concentration.toFixed(1)}% of measured official YouTube views. The longform story is doing the work; the short-form layer is still the distribution gap.` }
      : { ...ins, stat: '—', read: 'Published YouTube performance is temporarily unavailable, so concentration cannot be calculated.' }
    : ins);
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {liveInsights.map((ins, i) => (
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
function MeasurementTable({ assets, metrics }: { assets: EkatorAssetSnapshot; metrics: DashboardMetrics }) {
  const publishedAssets = assets.assets.filter(
    (asset) => asset.platform === 'youtube' && asset.views !== null && asset.postDate,
  );
  const captureAt = publishedAssets
    .map((asset) => asset.capturedAt)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);
  const snapshotDate = captureAt ? new Date(captureAt) : new Date();
  const velocityFor = (asset: EkatorAsset) => {
    if (!asset.postDate || asset.views === null) return 0;
    const publishedAt = new Date(asset.postDate.includes('T') ? asset.postDate : `${asset.postDate}T00:00:00-07:00`);
    const publishedAtMs = publishedAt.getTime();
    if (!Number.isFinite(publishedAtMs)) return 0;
    const ageDays = Math.max(1, Math.ceil((snapshotDate.getTime() - publishedAtMs) / 86_400_000));
    return Math.round(asset.views / ageDays);
  };
  const ep1Asset = publishedAssets.find((asset) => /ep\.?\s*1/i.test(asset.caption));
  const velocityAssets = publishedAssets
    .filter((asset) => asset.itemId !== ep1Asset?.itemId)
    .map((asset) => ({ asset, velocity: velocityFor(asset) }))
    .sort((a, b) => b.velocity - a.velocity);
  const maxVelocity = Math.max(1, ...velocityAssets.map((entry) => entry.velocity));
  const liveLayers = measurementLayers.map((layer) => layer.platform === 'YouTube'
    ? metrics.hasMeasuredPerformance
      ? { ...layer, coverage: `${metrics.videoCount} videos with views`, next: 'Add retention, average view duration, and subscriber delta by video.' }
      : { ...layer, coverage: 'Data unavailable', read: 'Published YouTube performance is temporarily unavailable.', next: 'Restore the performance feed, then add retention, average view duration, and subscriber delta by video.' }
    : layer);

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
        </div>

        <div className="rounded-lg border p-5" style={{ borderColor: line, background: '#0E0E0E' }}>
          <div className="mb-4 text-[11px] uppercase tracking-[0.2em]" style={{ color: red }}>Follower Delta</div>
          <div className="space-y-3">
            {followerBaselines.map(fb => (
              <div key={fb.platform} className="flex items-center justify-between gap-2 border-b pb-3" style={{ borderColor: line }}>
                <div>
                  <div className="text-sm font-semibold text-white">{fb.platform}</div>
                  <div className="font-mono text-xs text-[#A0A0AA]">baseline {fb.baseline}</div>
                </div>
                <div className="flex gap-1 font-mono text-[10px]">
                  <span className="rounded-sm bg-[#1A1A1A] px-2 py-1 text-[#A0A0AA]">T+24h</span>
                  <span className="rounded-sm bg-[#1A1A1A] px-2 py-1 text-[#A0A0AA]">T+72h</span>
                  <span className="rounded-sm bg-[#1A1A1A] px-2 py-1 text-[#A0A0AA]">T+7d</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-snug text-[#A0A0AA]">Deltas populate after each episode post.</p>
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
function MovesTimeline() {
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

export function EkatorCommandCenter({ registry, assets }: { registry: EkatorRegistrySnapshot; assets: EkatorAssetSnapshot }) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const metrics = useMemo(() => deriveDashboardMetrics(assets), [assets]);
  const channelData = useMemo(() => buildChannels(metrics), [metrics]);
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
        <CommandCenter registry={registry} assets={assets} metrics={metrics} channels={channelData} />
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
        <InsightBoard metrics={metrics} />
      </section>

      <div className="mx-auto h-px max-w-[1400px]" style={{ background: line }} />

      <section id="data" className="scroll-mt-14 py-12 md:py-16">
        <SectionHeader num="04" title="Measurement Layers" subtitle="Post-level, pacing, sentiment, follower lift, and paid delivery." />
        <MeasurementTable assets={assets} metrics={metrics} />
      </section>

      <div className="mx-auto h-px max-w-[1400px]" style={{ background: line }} />

      <section id="moves" className="scroll-mt-14 py-12 md:py-16">
        <SectionHeader num="05" title="Ranked moves for the next 72 hours" subtitle="Prioritized operating queue." />
        <MovesTimeline />
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
