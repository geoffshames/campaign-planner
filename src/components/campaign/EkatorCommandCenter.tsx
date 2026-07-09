'use client';

import { useMemo, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import type { EkatorRegistrySnapshot } from '@/lib/ekator-dashboard';

/* ── DATA ─────────────────────────────────────────────────────────── */

const red = '#FD3737';
const dim = '#1C1C1C';
const line = '#2A2A2A';
const muted = '#7A7A82';
const light = '#E4E4E9';
const white = '#FAFAFA';

const youtubeTotalViews = 136_552;
const ownedAudience = 78_680;
const shortsViews = 7_309;
const longformViews = 113_809;
const teaserViews = 15_434;

type Channel = {
  name: string;
  handle: string;
  audience: number;
  posts: string;
  views: number | null;
  share: number;
  status: 'strong' | 'watch' | 'risk';
  role: string;
  insight: string;
  action: string;
};

const channels: Channel[] = [
  { name: 'Instagram', handle: '@idoltillidie', audience: 62_900, posts: '8 posts', views: null, share: 79.9, status: 'strong', role: 'Top-of-funnel audience reservoir', insight: 'Instagram owns nearly 80% of the known official audience, but the current measurable conversion event is YouTube EP1.', action: 'Every IG post/story should ladder into one clear behavior: watch EP1, save a trainee clip, or follow YouTube.' },
  { name: 'YouTube', handle: '@Idoltillidie', audience: 5_280, posts: '9 videos', views: youtubeTotalViews, share: 6.7, status: 'watch', role: 'Documentary home + retargeting anchor', insight: 'EP1 is over-performing relative to subscriber base: 113.8K views on 5.28K subscribers implies discovery beyond owned subs.', action: 'Use YouTube as the source of truth for story beats, then force the short-form layer to carry those beats outward.' },
  { name: 'TikTok', handle: '@idoltillidie', audience: 10_500, posts: '0 videos', views: 0, share: 13.3, status: 'risk', role: 'Dormant owned distribution', insight: 'There is a meaningful follower base but no official TikTok content, so the campaign is leaving algorithmic inventory unused.', action: 'Post the first three EP1 cuts immediately: Matthew leader arc, trainee pressure, and comedic dorm/rule clip.' },
];

type Video = { title: string; views: number; duration: string; published: string; type: 'Longform' | 'Teaser' | 'Short'; transcript: boolean; signal: string; action: string };

const videos: Video[] = [
  { title: '"다 같이 데뷔하거나 다 같이 무산되거나" / EP.1', views: 113_809, duration: '41:46', published: 'Jul 6', type: 'Longform', transcript: true, signal: 'Main demand engine. 83% of measured YouTube views are concentrated here.', action: 'Timestamp into 12 clip candidates; assign each clip to Matthew / Cai Jinxin / Oh Juni / group-conflict lanes.' },
  { title: '[Teaser] 데뷔할 수 있을 것 같아요?', views: 15_434, duration: '0:45', published: 'Jun 29', type: 'Teaser', transcript: false, signal: 'Trailer seeded the premise; EP1 is already 7.4× larger than teaser views.', action: 'Retire as primary asset; use only as low-friction retargeting or intro creative.' },
  { title: '서로를 이해 못 하는 이유', views: 2_234, duration: '1:32', published: 'Jul 6', type: 'Short', transcript: false, signal: 'Top short-form signal in the current YouTube set.', action: 'Re-cut with English opening text and mirror to TikTok + Reels within 24 hours.' },
  { title: '이런 숙소룰은 처음이죠?', views: 1_667, duration: '0:48', published: 'Jul 7', type: 'Short', transcript: false, signal: 'Dorm/rules slice has clearer casual-fandom texture than performance-only clips.', action: 'Package as "trainee life is stricter than you think" for non-Korean viewers.' },
  { title: '리더가 된 매튜의 서사', views: 1_018, duration: '1:03', published: 'Jul 7', type: 'Short', transcript: true, signal: 'Matthew leader narrative is the cleanest member-led hook in the current short set.', action: 'Make this the first paid/SWRM test once clip tracking is clean.' },
  { title: '[미공개] 소파 부신 범인 공개', views: 988, duration: '1:50', published: 'Jul 8', type: 'Short', transcript: false, signal: 'Behind-the-scenes / "unreleased" packaging is useful but not yet breaking out.', action: 'Retitle into a curiosity hook before scaling.' },
  { title: '너무 무더운(?) 분위기였어요', views: 688, duration: '1:22', published: 'Jul 7', type: 'Short', transcript: false, signal: 'Low current traction; likely needs stronger upfront context.', action: 'Hold until a member-specific edit gives it a clearer protagonist.' },
  { title: '기다려주셔서 감사합니다', views: 399, duration: '1:06', published: 'Jul 8', type: 'Short', transcript: true, signal: 'Sentiment-first but small base response so far.', action: 'Use as comment/SWRM prompt, not primary paid creative.' },
  { title: '마치 로또 당첨 전 내 모습', views: 315, duration: '0:21', published: 'Jul 8', type: 'Short', transcript: false, signal: 'Lowest measured clip; no scale signal yet.', action: 'Archive unless Reels/TikTok proves the meme read is stronger off YouTube.' },
];

type Insight = { label: string; stat: string; read: string; action: string; tone: 'strong' | 'watch' | 'risk' };
const insights: Insight[] = [
  { label: 'Demand is real, but concentrated', stat: '94.7%', read: 'EP1 + teaser account for almost all measured official YouTube views. The longform story is doing the work; the short-form layer is not yet distributing that demand.', action: 'Build a daily short ladder from EP1 instead of treating each clip as a one-off upload.', tone: 'watch' },
  { label: 'Instagram is the conversion gap', stat: '62.9K', read: 'Instagram is the largest owned channel by far, but the measurable viewing event lives on YouTube.', action: 'Create IG-native story posts that explicitly drive to "watch EP1" and measure link/click lift.', tone: 'strong' },
  { label: 'TikTok is unused owned leverage', stat: '10.5K / 0', read: 'The account has followers but no posts. That is the fastest fix in the system.', action: 'Launch TikTok with three narrative cuts before adding spend anywhere else.', tone: 'risk' },
  { label: 'Matthew remains the cleanest first protagonist', stat: 'Priority 1', read: 'The available short-form read points toward Matthew\'s leader arc as the clearest hook for international audiences.', action: 'Make Matthew the first controlled variable: 3 edits, 3 hooks, 3 platforms, same 24-hour read window.', tone: 'strong' },
];

type Rec = { rank: number; title: string; why: string; move: string; owner: string; impact: 'High' | 'Medium' };
const recommendations: Rec[] = [
  { rank: 1, title: 'Turn EP1 into a controlled 12-clip test, not random snippets', why: 'The longform episode is the only proven demand source right now. Shorts are not yet carrying the story outward.', move: 'Cut 12 moments across four lanes: Matthew leader, Cai origin/redemption, Oh Juni pressure, group conflict/comedy. Publish with consistent English-first hooks.', owner: 'Content / clipping', impact: 'High' },
  { rank: 2, title: 'Activate TikTok immediately', why: '10.5K official followers and zero posts is a pure distribution leak.', move: 'Post the top three EP1 cuts today. Keep captions bilingual and make the first second explain the stakes: "They debut together or fail together."', owner: 'Owned social', impact: 'High' },
  { rank: 3, title: 'Use Instagram as the fan reservoir, not a passive poster', why: 'Instagram holds ~80% of the official audience. The strongest next read is whether that audience can move toward EP1, saves, and follow-through instead of staying passive.', move: 'Add pinned EP1 CTA, story link stack, and a recurring "choose the trainee" interactive sticker for each protagonist lane.', owner: 'Owned social', impact: 'High' },
  { rank: 4, title: 'Test member-pair dynamics before scaling performance-only cuts', why: 'The clearest clips are character-led. Relationship hooks make the show easier to understand for new viewers than formal trailer language.', move: 'Build a small batch around pairings and conflicts: Matthew/Cai, dorm rules, group stakes, and "can they debut together?" pressure.', owner: 'Creative strategy', impact: 'Medium' },
  { rank: 5, title: 'Close context gaps before the next clip wave', why: 'New viewers still need fast answers: who is onscreen, what the stakes are, where to watch, and why this moment matters.', move: 'Add one-line context to every next cut so casual viewers can understand the story without already knowing the show.', owner: 'Content clarity', impact: 'Medium' },
];

type MeasureLayer = { platform: string; audience: string; coverage: string; read: string; next: string; tone: 'strong' | 'watch' | 'risk' };
const measurementLayers: MeasureLayer[] = [
  { platform: 'YouTube', audience: '5.28K subs', coverage: '9 videos with views', read: 'Post-level views are live here; EP1 is the anchor and shorts are the distribution gap.', next: 'Add likes, comments, retention, average view duration, and subscriber delta by video.', tone: 'strong' },
  { platform: 'Instagram', audience: '62.9K followers', coverage: '8 posts counted', read: 'Largest owned audience, but post-level engagement and story-click data are not in the read yet.', next: 'Capture views, likes, comments, saves, shares, story taps, link clicks, and follower delta per post.', tone: 'watch' },
  { platform: 'TikTok', audience: '10.5K followers', coverage: '0 official posts', read: 'No post-level layer can exist until the first official clips go up.', next: 'Start with first-hour, 24-hour, and 72-hour views, profile visits, follows, comments, saves, and shares.', tone: 'risk' },
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
  { platform: 'Instagram', baseline: '62.9K' },
  { platform: 'YouTube', baseline: '5.28K' },
  { platform: 'TikTok', baseline: '10.5K' },
];

const monthIndex: Record<string, number> = { Jun: 5, Jul: 6 };
const currentReadDate = new Date('2026-07-08T12:00:00-07:00');
function daysSince(published: string) {
  const [m, d] = published.split(' ');
  const date = new Date(2026, monthIndex[m] ?? 6, Number.parseInt(d, 10), 12, 0, 0);
  return Math.max(1, Math.round((currentReadDate.getTime() - date.getTime()) / 86_400_000));
}

const compact = (v: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: v >= 10_000 ? 1 : 0 }).format(v);

/* ── CUSTOM DASHBOARD ELEMENTS ────────────────────────────────────── */

function statusColor(s: string) {
  if (s === 'strong') return light;
  if (s === 'watch') return red;
  if (s === 'risk') return '#D42D2D';
  return muted;
}
function statusLabel(s: string) {
  if (s === 'strong') return 'Strong';
  if (s === 'watch') return 'Watch';
  if (s === 'risk') return 'Fix now';
  return 'Quiet';
}

/** Radial gauge — semicircle arc with value in center */
function RadialGauge({ value, max, label, sublabel, color = red }: { value: number; max: number; label: string; sublabel: string; color?: string }) {
  const pct = Math.max(0, Math.min(1, max ? value / max : 0));
  const degrees = 180 * pct;
  const r = 70;
  const cx = 90;
  const cy = 90;
  const circumference = Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 180 110" className="w-full max-w-[200px]">
        <path d={`M 20 90 A ${r} ${r} 0 0 1 160 90`} fill="none" stroke={dim} strokeWidth="10" strokeLinecap="round" />
        <path
          d={`M 20 90 A ${r} ${r} 0 0 1 160 90`}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="28" fontWeight="800" fill={white} fontFamily="monospace">{label}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="9" fill={muted} letterSpacing="2">{sublabel.toUpperCase()}</text>
      </svg>
      <div className="-mt-1 text-[10px] uppercase tracking-[0.2em]" style={{ color }}>{degrees.toFixed(0)}° of pull</div>
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
            <div className="mt-1 text-xs leading-relaxed text-light">{rec.move}</div>
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

/** Distribution gap — stacked horizontal bars showing where attention is vs where it isn't */
function DistributionGap() {
  const rows = [
    { label: 'Longform (EP1)', value: longformViews, color: red },
    { label: 'Teaser', value: teaserViews, color: '#B03030' },
    { label: 'Shorts', value: shortsViews, color: '#7A2A2A' },
    { label: 'TikTok', value: 0, color: dim },
  ];
  const max = longformViews;
  return (
    <div className="space-y-2">
      {rows.map(row => (
        <div key={row.label} className="flex items-center gap-3">
          <div className="w-24 shrink-0 text-xs font-semibold text-light">{row.label}</div>
          <div className="h-4 flex-1 overflow-hidden rounded-sm bg-[#161616]">
            <div className="h-full rounded-sm transition-all duration-700" style={{ width: `${Math.max(row.value > 0 ? 2 : 0, (row.value / max) * 100)}%`, background: row.color }} />
          </div>
          <div className="w-14 shrink-0 text-right font-mono text-sm" style={{ color: row.value > 0 ? white : muted }}>{row.value > 0 ? compact(row.value) : '—'}</div>
        </div>
      ))}
      <div className="pt-1 text-xs leading-relaxed" style={{ color: red }}>
        <span className="font-bold">Read: </span>Demand is real. Distribution is the bottleneck, not the story.
      </div>
    </div>
  );
}

/** KPI rail — inline strip of key numbers, no cards */
function KpiRail() {
  const items = [
    { label: 'Audience', value: compact(ownedAudience), sub: 'IG+YT+TT' },
    { label: 'YT Views', value: compact(youtubeTotalViews), sub: '9 videos' },
    { label: 'EP1 Gravity', value: '83.3%', sub: 'of YT views' },
    { label: 'Shorts', value: compact(shortsViews), sub: 'low' },
    { label: 'TikTok', value: '0', sub: '10.5K waiting' },
    { label: 'Paid', value: '—', sub: 'not live' },
  ];
  return (
    <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg bg-[#1A1A1A] sm:grid-cols-6">
      {items.map((item, i) => (
        <div key={item.label} className="bg-[#0E0E0E] px-3 py-2.5">
          <div className="text-[9px] uppercase tracking-[0.15em] text-muted">{item.label}</div>
          <div className="mt-0.5 font-mono text-xl font-bold leading-none" style={{ color: i === 2 ? red : i === 3 || i === 4 ? '#D42D2D' : white }}>{item.value}</div>
          <div className="mt-0.5 text-[9px] text-muted">{item.sub}</div>
        </div>
      ))}
    </div>
  );
}

/** Status strip — single-line system status */
function StatusStrip({ registry }: { registry: EkatorRegistrySnapshot }) {
  const live = registry.status === 'live';
  const nodes = registry.seedingNetworkCount + registry.snsViralCount + registry.officialHandleCount;
  const items = [
    { label: 'Assets', value: registry.itemsCount },
    { label: 'Street-eval', value: registry.streetEvalItemsCount },
    { label: 'Monitored', value: registry.monitoredHandlesCount },
    { label: 'Nodes', value: nodes },
    { label: 'Paid', value: 'OFF' as const },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-3 py-2 font-mono text-xs">
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${live ? 'bg-[#4ADE80]' : 'bg-[#D42D2D]'} animate-pulse`} />
        <span className="uppercase tracking-wider" style={{ color: live ? '#4ADE80' : '#D42D2D' }}>{live ? 'LIVE' : 'SYNC'}</span>
      </div>
      {items.map(item => (
        <div key={item.label} className="flex items-baseline gap-1">
          <span className="text-muted">{item.label}</span>
          <span className="font-bold" style={{ color: item.label === 'Paid' ? '#D42D2D' : white }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

/** Channel matrix — compact 3-column visual: audience ring + activation bar + status */
function ChannelMatrix() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {channels.map(ch => {
        const pct = (ch.audience / 62_900) * 100;
        const circ = 2 * Math.PI * 18;
        return (
          <div key={ch.name} className="flex flex-col items-center gap-2 rounded-lg bg-[#141414] p-3 text-center">
            {/* Audience ring */}
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 44 44" className="h-full w-full -rotate-90">
                <circle cx="22" cy="22" r="18" fill="none" stroke={dim} strokeWidth="3" />
                <circle
                  cx="22" cy="22" r="18" fill="none"
                  stroke={statusColor(ch.status) === light ? '#555' : statusColor(ch.status)}
                  strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={circ * (1 - pct / 100)}
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-sm font-bold text-white">{compact(ch.audience)}</span>
              </div>
            </div>
            {/* Channel name */}
            <div className="text-xs font-bold text-white">{ch.name}</div>
            {/* Status dot + label */}
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusColor(ch.status) }} />
              <span className="font-mono text-[10px] uppercase" style={{ color: statusColor(ch.status) }}>{statusLabel(ch.status)}</span>
            </div>
            {/* Activation bar — posts/videos */}
            <div className="w-full">
              <div className="h-1 overflow-hidden rounded-full bg-[#161616]">
                <div
                  className="h-full rounded-full"
                  style={{ width: ch.views ? `${Math.min(100, (ch.views / youtubeTotalViews) * 100)}%` : ch.posts === '0 videos' ? '0%' : '30%', background: statusColor(ch.status) === light ? '#555' : statusColor(ch.status), opacity: 0.7 }}
                />
              </div>
              <div className="mt-1 font-mono text-[9px] text-muted">{ch.posts}</div>
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
    sent: 'Agents launched ✓',
    error: 'Failed — try again',
  };

  const colors = {
    idle: red,
    sending: muted,
    sent: '#4ADE80',
    error: '#D42D2D',
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={state === 'sending'}
      className="flex items-center gap-2 rounded-md border px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all hover:bg-[#1A1A1A] disabled:opacity-50"
      style={{ borderColor: colors[state], color: colors[state] }}
    >
      {state === 'sending' && (
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: muted, borderTopColor: 'transparent' }} />
      )}
      {state === 'sent' && <span style={{ color: '#4ADE80' }}>✓</span>}
      {labels[state]}
    </button>
  );
}

/* ── COMMAND CENTER (above the fold) ──────────────────────────────── */

function CommandCenter({ registry }: { registry: EkatorRegistrySnapshot }) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-20 pb-6 md:px-6 lg:px-8">
      {/* Title bar */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b pb-3" style={{ borderColor: line }}>
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted">
            <span style={{ color: red }}>●</span> EKATOR Social Dashboard
          </div>
          <h1 className="mt-1 font-mono text-3xl font-black leading-none text-white md:text-4xl">EKATOR <span style={{ color: red }}>COMMAND CENTER</span></h1>
        </div>
        <div className="flex items-end gap-4">
          <RefreshButton />
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted">Idol Till I Die</div>
            <div className="font-mono text-xs text-light">Jul 8, 2026</div>
          </div>
        </div>
      </div>

      {/* KPI Rail */}
      <div className="mb-3"><KpiRail /></div>

      {/* Main 3-column grid */}
      <div className="mb-3 grid gap-3 lg:grid-cols-[0.8fr_1.2fr_1fr]">
        {/* Radial gauge */}
        <div className="rounded-lg border p-4" style={{ borderColor: line, background: '#0E0E0E' }}>
          <div className="mb-2 text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>EP1 Gravity</div>
          <RadialGauge value={83.3} max={100} label="83%" sublabel="of YT views" />
        </div>

        {/* Distribution gap */}
        <div className="rounded-lg border p-4" style={{ borderColor: line, background: '#0E0E0E' }}>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>Distribution Gap</div>
            <div className="font-mono text-xs text-muted">views by format</div>
          </div>
          <DistributionGap />
        </div>

        {/* Priority queue */}
        <div className="rounded-lg border p-4" style={{ borderColor: line, background: '#0E0E0E' }}>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>72-Hour Queue</div>
            <div className="font-mono text-xs text-muted">do these first</div>
          </div>
          <PriorityTimeline />
        </div>
      </div>

      {/* Channel matrix — 3 compact channel cards with rings */}
      <div className="mb-3 rounded-lg border p-4" style={{ borderColor: line, background: '#0E0E0E' }}>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>Channel Pulse</div>
          <div className="font-mono text-xs text-muted">audience · status · activation</div>
        </div>
        <ChannelMatrix />
      </div>

      {/* Status strip */}
      <div className="rounded-lg border" style={{ borderColor: line, background: '#0E0E0E' }}>
        <StatusStrip registry={registry} />
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
      <p className="mt-1 max-w-2xl text-xs leading-snug text-muted">{subtitle}</p>
    </div>
  );
}

/** Owned channels — custom table-like layout, not cards */
function ChannelTable() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg border border-[line]" style={{ borderColor: line }}>
        {/* Header row */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.5fr] gap-2 bg-[#141414] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
          <div>Channel</div>
          <div>Audience</div>
          <div>Share</div>
          <div>Views</div>
          <div>Action</div>
        </div>
        {channels.map((ch, i) => (
          <div key={ch.name} className={`grid grid-cols-[1fr_1fr_1fr_1fr_1.5fr] items-center gap-2 px-4 py-3 ${i > 0 ? 'border-t border-[line]' : ''}`} style={{ borderColor: line }}>
            <div>
              <div className="text-sm font-bold text-white">{ch.name}</div>
              <div className="font-mono text-[10px] text-muted">{ch.handle}</div>
            </div>
            <div className="font-mono text-lg font-bold text-white">{compact(ch.audience)}</div>
            <div>
              <div className="font-mono text-sm" style={{ color: statusColor(ch.status) }}>{ch.share}%</div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#161616]">
                <div className="h-full rounded-full" style={{ width: `${ch.share}%`, background: statusColor(ch.status) }} />
              </div>
            </div>
            <div className="font-mono text-sm" style={{ color: ch.views === null ? muted : white }}>{ch.views === null ? '—' : compact(ch.views)}</div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusColor(ch.status) }} />
                <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: statusColor(ch.status) }}>{statusLabel(ch.status)}</span>
              </div>
              <p className="text-xs leading-snug text-light">{ch.action.length > 60 ? ch.action.slice(0, 60) + '…' : ch.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Asset board — custom ranked list with inline bars */
function AssetBoard() {
  const max = Math.max(...videos.map(v => v.views));
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg border border-[line]" style={{ borderColor: line }}>
        {/* EP1 hero row */}
        <div className="border-b border-[line] bg-[#140A0A] px-4 py-4" style={{ borderColor: line }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase" style={{ color: red, border: `1px solid ${red}` }}>Anchor</span>
                <span className="font-mono text-[10px] text-muted">Longform · {videos[0].duration} · {videos[0].published}</span>
              </div>
              <div className="mt-1.5 text-sm font-bold text-white">{videos[0].title}</div>
              <p className="mt-1 text-xs leading-relaxed text-light">{videos[0].signal}</p>
            </div>
            <div className="text-right">
              <div className="font-mono text-3xl font-black" style={{ color: red }}>{compact(videos[0].views)}</div>
              <div className="font-mono text-[10px] text-muted">{((videos[0].views / youtubeTotalViews) * 100).toFixed(1)}% of all YT</div>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#161616]">
            <div className="h-full rounded-full" style={{ width: '83.3%', background: red }} />
          </div>
          <p className="mt-2 text-xs leading-snug text-light"><span className="font-bold" style={{ color: red }}>Move: </span>{videos[0].action}</p>
        </div>

        {/* Secondary videos — compact rows */}
        <div className="divide-y divide-[line]" style={{ borderColor: line }}>
          {videos.slice(1).map(v => {
            const vel = v.views / daysSince(v.published);
            return (
              <div key={v.title} className="grid grid-cols-[2.5fr_0.8fr_0.8fr_1fr] items-center gap-3 px-4 py-2.5">
                <div>
                  <div className="text-xs font-semibold leading-tight text-white">{v.title}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-muted">{v.type} · {v.duration} · {v.published} · {daysSince(v.published)}d live</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-bold text-white">{compact(v.views)}</div>
                  <div className="h-1 mt-0.5 overflow-hidden rounded-full bg-[#161616]">
                    <div className="h-full rounded-full" style={{ width: `${(v.views / max) * 100}%`, background: v.type === 'Teaser' ? '#B03030' : '#7A2A2A' }} />
                  </div>
                </div>
                <div className="text-right font-mono text-xs" style={{ color: muted }}>{compact(Math.round(vel))}/day</div>
                <div className="text-right text-[10px] leading-tight text-muted">{v.action.slice(0, 40)}{v.action.length > 40 ? '…' : ''}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Insights — custom bento with mini sparkline-style accents */
function InsightBoard() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {insights.map((ins, i) => (
          <div key={ins.label} className="relative overflow-hidden rounded-lg border border-[line] bg-[#0E0E0E] p-4" style={{ borderColor: line }}>
            <div className="absolute left-0 top-0 h-full w-1" style={{ background: statusColor(ins.tone) }} />
            <div className="text-[10px] uppercase tracking-[0.15em] text-muted">{ins.label}</div>
            <div className="mt-2 font-mono text-3xl font-black" style={{ color: i === 3 ? red : white }}>{ins.stat}</div>
            {/* Mini bar accent */}
            <div className="mt-3 flex gap-0.5">
              {[...Array(12)].map((_, j) => (
                <div key={j} className="h-4 flex-1 rounded-sm" style={{ background: j < (ins.tone === 'risk' ? 2 : ins.tone === 'watch' ? 6 : 10) ? statusColor(ins.tone) : dim, opacity: 0.6 }} />
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-light">{ins.read}</p>
            <div className="mt-3 border-t border-[line] pt-2 text-xs leading-snug text-white" style={{ borderColor: line }}>
              <span className="font-bold" style={{ color: red }}>Do next: </span>{ins.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Measurement layers — custom table */
function MeasurementTable() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8 space-y-4">
      {/* Post-level table */}
      <div className="overflow-hidden rounded-lg border border-[line]" style={{ borderColor: line }}>
        <div className="grid grid-cols-[1fr_1fr_1fr_2fr] gap-2 bg-[#141414] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
          <div>Platform</div><div>Audience</div><div>Coverage</div><div>Current read → Next data</div>
        </div>
        {measurementLayers.map((layer, i) => (
          <div key={layer.platform} className={`grid grid-cols-[1fr_1fr_1fr_2fr] gap-2 px-4 py-3 ${i > 0 ? 'border-t border-[line]' : ''}`} style={{ borderColor: line }}>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: statusColor(layer.tone) }} />
                <span className="text-sm font-bold text-white">{layer.platform}</span>
              </div>
            </div>
            <div className="font-mono text-sm text-light">{layer.audience}</div>
            <div className="font-mono text-sm text-light">{layer.coverage}</div>
            <div>
              <p className="text-xs leading-snug text-light">{layer.read}</p>
              <p className="mt-1 text-xs leading-snug text-white"><span className="font-bold" style={{ color: red }}>Add next: </span>{layer.next}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Velocity + Follower delta side by side */}
      <div className="grid gap-3 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-lg border border-[line] bg-[#0E0E0E] p-4" style={{ borderColor: line }}>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>Daily Velocity</div>
            <div className="font-mono text-[10px] text-muted">views/day · baseline Jul 8</div>
          </div>
          <div className="space-y-2">
            {videos.slice(0, 6).map(v => {
              const vel = v.views / daysSince(v.published);
              const maxVel = Math.max(...videos.map(vv => vv.views / daysSince(vv.published)));
              return (
                <div key={v.title} className="flex items-center gap-3">
                  <div className="w-32 shrink-0 truncate text-xs font-semibold text-white">{v.title.length > 28 ? v.title.slice(0, 28) + '…' : v.title}</div>
                  <div className="h-5 flex-1 overflow-hidden rounded-sm bg-[#161616]">
                    <div className="h-full rounded-sm" style={{ width: `${(vel / maxVel) * 100}%`, background: v.type === 'Longform' ? red : '#7A2A2A' }} />
                  </div>
                  <div className="w-16 shrink-0 text-right font-mono text-xs" style={{ color: white }}>{compact(Math.round(vel))}/d</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-[line] bg-[#0E0E0E] p-4" style={{ borderColor: line }}>
          <div className="mb-3 text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>Follower Delta</div>
          <div className="space-y-2">
            {followerBaselines.map(fb => (
              <div key={fb.platform} className="flex items-center justify-between gap-2 border-b border-[line] pb-2" style={{ borderColor: line }}>
                <div>
                  <div className="text-xs font-semibold text-white">{fb.platform}</div>
                  <div className="font-mono text-[10px] text-muted">baseline {fb.baseline}</div>
                </div>
                <div className="flex gap-1 font-mono text-[9px]">
                  <span className="rounded-sm bg-[#1A1A1A] px-1.5 py-0.5 text-muted">T+24h</span>
                  <span className="rounded-sm bg-[#1A1A1A] px-1.5 py-0.5 text-muted">T+72h</span>
                  <span className="rounded-sm bg-[#1A1A1A] px-1.5 py-0.5 text-muted">T+7d</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] leading-snug text-muted">Deltas populate after each episode post.</p>
        </div>
      </div>

      {/* Sentiment + Paid */}
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-[line] bg-[#0E0E0E] p-4" style={{ borderColor: line }}>
          <div className="mb-3 text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>Comment + Sentiment Themes</div>
          <div className="space-y-2">
            {sentimentThemes.map(theme => (
              <div key={theme.theme} className="flex items-start gap-3 border-b border-[line] pb-2" style={{ borderColor: line }}>
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${theme.status === 'Needs comments' ? 'bg-[#D42D2D]' : 'bg-[#4ADE80]'}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white">{theme.theme}</div>
                  <div className="mt-0.5 text-[11px] leading-snug text-light"><span className="font-bold" style={{ color: red }}>Tag: </span>{theme.tags}</div>
                  <div className="text-[11px] leading-snug text-muted"><span className="font-bold text-white">Use: </span>{theme.use}</div>
                </div>
                <span className="shrink-0 rounded-sm px-1.5 py-0.5 font-mono text-[9px] uppercase" style={{ color: theme.status === 'Needs comments' ? '#D42D2D' : light, border: `1px solid ${theme.status === 'Needs comments' ? '#D42D2D' : line}` }}>{theme.status === 'Needs comments' ? 'Need' : 'Ready'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[line] bg-[#0E0E0E] p-4" style={{ borderColor: line }}>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: red }}>Paid Media</div>
            <span className="font-mono text-xs font-bold" style={{ color: '#D42D2D' }}>NOT LIVE</span>
          </div>
          <div className="mb-3 rounded-md bg-[#140A0A] p-3">
            <p className="text-xs leading-relaxed text-white">No paid campaigns are live yet. Once campaigns launch, this section will show confirmed delivery, efficiency, and conversion data.</p>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {paidFields.map(field => (
              <div key={field.metric} className="flex items-baseline gap-2 border-b border-[line] py-1.5" style={{ borderColor: line }}>
                <span className="font-mono text-xs font-bold text-muted">·</span>
                <div>
                  <span className="text-xs font-semibold text-white">{field.metric}</span>
                  <p className="text-[10px] leading-tight text-light">{field.use.slice(0, 50)}{field.use.length > 50 ? '…' : ''}</p>
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
              <div className="flex-1 rounded-lg border border-[line] bg-[#0E0E0E] p-4" style={{ borderColor: line }}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-white">{rec.title}</h3>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{rec.owner}</span>
                    <span className="rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase" style={{ color: rec.impact === 'High' ? red : muted, border: `1px solid ${rec.impact === 'High' ? red : line}` }}>{rec.impact}</span>
                  </div>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: red }}>Why</div>
                    <p className="mt-0.5 text-xs leading-relaxed text-light">{rec.why}</p>
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

export function EkatorCommandCenter({ registry }: { registry: EkatorRegistrySnapshot }) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const nav = useMemo(() => [
    ['channels', 'Channels'], ['assets', 'Assets'], ['insights', 'Insights'], ['data', 'Data'], ['moves', 'Moves'],
  ], []);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA]">
      {/* Scroll progress */}
      <motion.div className="fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left" style={{ scaleX, background: red }} />

      {/* Nav */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#2A2A2A] bg-[#0A0A0A]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 md:px-6 lg:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control" className="h-4 w-auto opacity-90" />
          <div className="hidden items-center gap-5 lg:flex">
            {nav.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-[#FD3737]">{label}</a>
            ))}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: red }}>Living Dashboard</span>
        </div>
      </nav>

      {/* COMMAND CENTER — above the fold */}
      <header ref={heroRef} className="min-h-screen pt-14">
        <CommandCenter registry={registry} />
      </header>

      {/* Divider */}
      <div className="mx-auto h-px max-w-[1400px]" style={{ background: line }} />

      {/* DETAIL SECTIONS — below the fold */}
      <section id="channels" className="py-12 md:py-16">
        <SectionHeader num="01" title="Owned Channels" subtitle="Audience, output, views, and next action per surface." />
        <ChannelTable />
      </section>

      <div className="mx-auto h-px max-w-[1400px]" style={{ background: line }} />

      <section id="assets" className="py-12 md:py-16">
        <SectionHeader num="02" title="Asset Performance" subtitle="Where attention is concentrated and which assets to cut, mirror, or hold." />
        <AssetBoard />
      </section>

      <div className="mx-auto h-px max-w-[1400px]" style={{ background: line }} />

      <section id="insights" className="py-12 md:py-16">
        <SectionHeader num="03" title="Actionable Insights" subtitle="Metric, meaning, and decision." />
        <InsightBoard />
      </section>

      <div className="mx-auto h-px max-w-[1400px]" style={{ background: line }} />

      <section id="data" className="py-12 md:py-16">
        <SectionHeader num="04" title="Measurement Layers" subtitle="Post-level, pacing, sentiment, follower lift, and paid delivery." />
        <MeasurementTable />
      </section>

      <div className="mx-auto h-px max-w-[1400px]" style={{ background: line }} />

      <section id="moves" className="py-12 md:py-16">
        <SectionHeader num="05" title="Ranked moves for the next 72 hours" subtitle="Prioritized operating queue." />
        <MovesTimeline />
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A2A2A] py-12">
        <div className="mx-auto max-w-[1400px] px-4 text-center md:px-6 lg:px-8">
          <div className="font-mono text-2xl font-black text-white">EKATOR <span style={{ color: red }}>×</span> Crowd Control</div>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-muted">Owned-social intelligence dashboard for the Idol Till I Die campaign.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control" className="mx-auto mt-6 h-5 w-auto opacity-60" />
        </div>
      </footer>
    </main>
  );
}

export default EkatorCommandCenter;
