'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import type { EkatorRegistrySnapshot } from '@/lib/ekator-dashboard';

type Tone = 'strong' | 'watch' | 'risk' | 'quiet' | 'offline';
type Channel = {
  name: string;
  handle: string;
  audience: number;
  posts: string;
  measuredViews: number | null;
  share: number;
  status: Tone;
  role: string;
  insight: string;
  action: string;
  source: string;
};
type VideoSignal = {
  title: string;
  platform: string;
  views: number;
  duration: string;
  published: string;
  type: 'Longform' | 'Teaser' | 'Short';
  transcript: 'Yes' | 'No';
  signal: string;
  action: string;
};
type Insight = {
  label: string;
  stat: string;
  read: string;
  action: string;
  tone: Tone;
};
type Recommendation = {
  rank: number;
  title: string;
  why: string;
  move: string;
  owner: string;
  impact: 'High' | 'Medium';
};
type Benchmark = {
  title: string;
  handle: string;
  platform: string;
  views: number;
  engagement: string;
  outlier: string;
  pattern: string;
};
type SourceHealth = {
  source: string;
  status: Tone;
  pulled: string;
  coverage: string;
  caveat: string;
};

const red = '#FD3737';
const youtubeTotalViews = 136_552;
const ownedAudience = 78_680;
const shortsViews = 7_309;

const channels: Channel[] = [
  {
    name: 'Instagram',
    handle: '@idoltillidie',
    audience: 62_900,
    posts: '8 posts',
    measuredViews: null,
    share: 79.9,
    status: 'strong',
    role: 'Top-of-funnel audience reservoir',
    insight: 'Instagram owns nearly 80% of the known official audience, but the current measurable conversion event is YouTube EP1.',
    action: 'Every IG post/story should ladder into one clear behavior: watch EP1, save a trainee clip, or follow YouTube.',
    source: 'Browser profile read; Tokscript Instagram endpoint returned a temporary 521.',
  },
  {
    name: 'YouTube',
    handle: '@Idoltillidie',
    audience: 5_280,
    posts: '9 videos',
    measuredViews: youtubeTotalViews,
    share: 6.7,
    status: 'watch',
    role: 'Documentary home + retargeting anchor',
    insight: 'EP1 is over-performing relative to subscriber base: 113.8K views on 5.28K subscribers implies discovery beyond owned subs.',
    action: 'Use YouTube as the source of truth for story beats, then force the short-form layer to carry those beats outward.',
    source: 'YouTube channel + RSS + Tokscript transcript job.',
  },
  {
    name: 'TikTok',
    handle: '@idoltillidie',
    audience: 10_500,
    posts: '0 videos',
    measuredViews: 0,
    share: 13.3,
    status: 'risk',
    role: 'Dormant owned distribution',
    insight: 'There is a meaningful follower base but no official TikTok content, so the campaign is leaving algorithmic inventory unused.',
    action: 'Post the first three EP1 cuts immediately: Matthew leader arc, trainee pressure, and comedic dorm/rule clip.',
    source: 'Tokscript TikTok profile pull.',
  },
];

const videos: VideoSignal[] = [
  {
    title: '“다 같이 데뷔하거나 다 같이 무산되거나” / EP.1',
    platform: 'YouTube',
    views: 113_809,
    duration: '41:46',
    published: 'Jul 6',
    type: 'Longform',
    transcript: 'Yes',
    signal: 'Main demand engine. 83% of measured YouTube views are concentrated here.',
    action: 'Timestamp into 12 clip candidates; assign each clip to Matthew / Cai Jinxin / Oh Juni / group-conflict lanes.',
  },
  {
    title: '[Teaser] 데뷔할 수 있을 것 같아요?',
    platform: 'YouTube',
    views: 15_434,
    duration: '0:45',
    published: 'Jun 29',
    type: 'Teaser',
    transcript: 'No',
    signal: 'Trailer seeded the premise; EP1 is already 7.4× larger than teaser views.',
    action: 'Retire as primary asset; use only as low-friction retargeting or intro creative.',
  },
  {
    title: '서로를 이해 못 하는 이유',
    platform: 'YouTube',
    views: 2_234,
    duration: '1:32',
    published: 'Jul 6',
    type: 'Short',
    transcript: 'No',
    signal: 'Top short-form signal in the current YouTube set.',
    action: 'Re-cut with English opening text and mirror to TikTok + Reels within 24 hours.',
  },
  {
    title: '이런 숙소룰은 처음이죠?',
    platform: 'YouTube',
    views: 1_667,
    duration: '0:48',
    published: 'Jul 7',
    type: 'Short',
    transcript: 'No',
    signal: 'Dorm/rules slice has clearer casual-fandom texture than performance-only clips.',
    action: 'Package as “trainee life is stricter than you think” for non-Korean viewers.',
  },
  {
    title: '리더가 된 매튜의 서사',
    platform: 'YouTube',
    views: 1_018,
    duration: '1:03',
    published: 'Jul 7',
    type: 'Short',
    transcript: 'Yes',
    signal: 'Matthew leader narrative aligns with prior creative-brain priority.',
    action: 'Make this the first paid/SWRM test once social pixel + clip tracker are live.',
  },
  {
    title: '[미공개] 소파 부신 범인 공개',
    platform: 'YouTube',
    views: 988,
    duration: '1:50',
    published: 'Jul 8',
    type: 'Short',
    transcript: 'No',
    signal: 'Behind-the-scenes / “unreleased” packaging is useful but not yet breaking out.',
    action: 'Retitle into a curiosity hook before scaling.',
  },
  {
    title: '너무 무더운(?) 분위기였어요',
    platform: 'YouTube',
    views: 688,
    duration: '1:22',
    published: 'Jul 7',
    type: 'Short',
    transcript: 'No',
    signal: 'Low current traction; likely needs stronger upfront context.',
    action: 'Hold until a member-specific edit gives it a clearer protagonist.',
  },
  {
    title: '기다려주셔서 감사합니다',
    platform: 'YouTube',
    views: 399,
    duration: '1:06',
    published: 'Jul 8',
    type: 'Short',
    transcript: 'Yes',
    signal: 'Sentiment-first but small base response so far.',
    action: 'Use as comment/SWRM prompt, not primary paid creative.',
  },
  {
    title: '마치 로또 당첨 전 내 모습',
    platform: 'YouTube',
    views: 315,
    duration: '0:21',
    published: 'Jul 8',
    type: 'Short',
    transcript: 'No',
    signal: 'Lowest measured clip; no scale signal yet.',
    action: 'Archive unless Reels/TikTok proves the meme read is stronger off YouTube.',
  },
];

const insights: Insight[] = [
  {
    label: 'Demand is real, but concentrated',
    stat: '94.7%',
    read: 'EP1 + teaser account for almost all measured official YouTube views. The longform story is doing the work; the short-form layer is not yet distributing that demand.',
    action: 'Build a daily short ladder from EP1 instead of treating each clip as a one-off upload.',
    tone: 'watch',
  },
  {
    label: 'Instagram is the conversion gap',
    stat: '62.9K',
    read: 'Instagram is the largest owned channel by far, but the measurable viewing event lives on YouTube.',
    action: 'Create IG-native story posts that explicitly drive to “watch EP1” and measure link/click lift.',
    tone: 'strong',
  },
  {
    label: 'TikTok is unused owned leverage',
    stat: '10.5K / 0',
    read: 'The account has followers but no posts. That is the fastest fix in the system.',
    action: 'Launch TikTok with three narrative cuts before adding spend anywhere else.',
    tone: 'risk',
  },
  {
    label: 'Matthew remains the cleanest first protagonist',
    stat: 'Priority 1',
    read: 'Vault/Jockey notes and the first short-form test both point toward Matthew’s leader arc as the clearest hook for international audiences.',
    action: 'Make Matthew the first controlled variable: 3 edits, 3 hooks, 3 platforms, same 24-hour read window.',
    tone: 'strong',
  },
];

const recommendations: Recommendation[] = [
  {
    rank: 1,
    title: 'Turn EP1 into a controlled 12-clip test, not random snippets',
    why: 'The longform episode is the only proven demand source right now. Shorts are not yet carrying the story outward.',
    move: 'Cut 12 moments across four lanes: Matthew leader, Cai origin/redemption, Oh Juni pressure, group conflict/comedy. Publish with consistent English-first hooks.',
    owner: 'Content / clipping',
    impact: 'High',
  },
  {
    rank: 2,
    title: 'Activate TikTok immediately',
    why: '10.5K official followers and zero posts is a pure distribution leak.',
    move: 'Post the top three EP1 cuts today. Keep captions bilingual and make the first second explain the stakes: “They debut together or fail together.”',
    owner: 'Owned social',
    impact: 'High',
  },
  {
    rank: 3,
    title: 'Use Instagram as the fan reservoir, not a passive poster',
    why: 'Instagram holds ~80% of the official audience. The dashboard should judge IG by YouTube conversion and saves, not vanity follower count.',
    move: 'Add pinned EP1 CTA, story link stack, and a recurring “choose the trainee” interactive sticker for each protagonist lane.',
    owner: 'Owned social',
    impact: 'High',
  },
  {
    rank: 4,
    title: 'Benchmark against member-interaction formats, not generic K-pop trend volume',
    why: 'Sandcastles comps show giant upside for challenge/member-chat formats, but the relevant lesson is structure: group dynamics beat trailer language.',
    move: 'Test duo/group clips with explicit relationship hooks before scaling performance-only cuts.',
    owner: 'Creative strategy',
    impact: 'Medium',
  },
  {
    rank: 5,
    title: 'Do not scale paid until source attribution is live',
    why: 'The $50K budget can move fast, but the clip layer must prove which member/hook/platform is generating lift.',
    move: 'Gate discretionary boosts behind one rule: a clip must beat the current short median or create a meaningful follower/subscriber conversion signal.',
    owner: 'Paid / ops',
    impact: 'Medium',
  },
];

const benchmarks: Benchmark[] = [
  {
    title: 'Gnarly chan haiiiii',
    handle: '@katseyeworld',
    platform: 'TikTok',
    views: 57_800_000,
    engagement: '14%',
    outlier: '7.7×',
    pattern: 'Member/personality clip, not formal trailer language.',
  },
  {
    title: 'watch us go…',
    handle: '@katseyeworld',
    platform: 'TikTok',
    views: 41_600_000,
    engagement: '15%',
    outlier: '4.1×',
    pattern: 'Simple repeatable challenge with member pairing.',
  },
  {
    title: 'group chat lore unlocked',
    handle: '@instagram + @katseyeworld',
    platform: 'Instagram',
    views: 87_102_503,
    engagement: '1%',
    outlier: '1.8×',
    pattern: 'Behind-the-scenes intimacy packaged as friend-group access.',
  },
];

const baseSourceHealth: SourceHealth[] = [
  {
    source: 'Tokscript',
    status: 'strong',
    pulled: '9 official YouTube URLs; 4 transcripts available; TikTok profile fetched.',
    coverage: 'EP1 transcript, official YouTube metadata, official TikTok profile.',
    caveat: 'Instagram API call returned 521, so IG profile stats are browser-verified fallback.',
  },
  {
    source: 'Sandcastles',
    status: 'watch',
    pulled: 'K-pop/doc/comparable short-form benchmark search completed.',
    coverage: 'External format/outlier context, especially KATSEYE/member-interaction comps.',
    caveat: 'Official @idoltillidie is not indexed in Sandcastles yet; add it to watchlist for automated outlier tracking.',
  },
];

const compactNumber = (value: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: value >= 10_000 ? 1 : 0 }).format(value);

function compactDateTime(value?: string | null) {
  if (!value) return '—';
  return value.replace('T', ' ').replace(/\.\d+/, '').replace(/\+00:00$/, ' UTC').slice(0, 22);
}

function supabaseSourceHealth(registry: EkatorRegistrySnapshot): SourceHealth {
  const live = registry.status === 'live';
  return {
    source: 'Supabase',
    status: live ? 'strong' : 'risk',
    pulled: live
      ? `Live registry read: ${registry.itemsCount} items, ${registry.monitoredHandlesCount} monitored handles, ${registry.responseCount} saved response.`
      : 'Registry target identified; using last verified fallback snapshot until runtime env is available.',
    coverage: `${registry.readyItemsCount} ready assets, ${registry.streetEvalItemsCount} street-eval cuts, ${registry.activeMonitoredHandlesCount} active monitored handles, ${registry.seedingNetworkCount} seeding-network nodes, ${registry.snsViralCount} SNS viral fan pages.`,
    caveat: live
      ? `Last registry ingest: ${compactDateTime(registry.lastIngest)}. Performance table is empty today, so channel/view metrics still come from Tokscript/YouTube snapshot.`
      : registry.error || 'Supabase read unavailable in this runtime; visible metrics use the MCP-pulled snapshot.',
  };
}

function toneColor(tone: Tone) {
  if (tone === 'strong') return '#22C55E';
  if (tone === 'watch') return red;
  if (tone === 'risk') return '#F59E0B';
  if (tone === 'quiet') return '#A1A1AA';
  return '#71717A';
}

function toneLabel(tone: Tone) {
  if (tone === 'strong') return 'Strong signal';
  if (tone === 'watch') return 'Watch closely';
  if (tone === 'risk') return 'Fix now';
  if (tone === 'quiet') return 'Quiet';
  return 'Offline';
}

function Badge({ children, tone = red }: { children: ReactNode; tone?: string }) {
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: tone, backgroundColor: `${tone}18`, border: `1px solid ${tone}35` }}>
      {children}
    </span>
  );
}

function GlassCard({ children, className = '', glow = false }: { children: ReactNode; className?: string; glow?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-[#303030] bg-gradient-to-br from-[#1A1A1A]/94 to-[#101010]/78 ${glow ? 'shadow-2xl shadow-[#FD3737]/10 ring-1 ring-[#FD3737]/20' : ''} ${className}`}>
      {children}
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return <motion.div className="fixed left-0 right-0 top-0 z-[70] h-[3px] origin-left bg-[#FD3737]" style={{ scaleX }} />;
}

function Section({ id, kicker, title, subtitle, children }: { id: string; kicker: string; title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 px-6 py-14 md:px-10 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 md:mb-12">
          <span className="font-display text-xs uppercase tracking-[0.35em] text-[#FD3737]">{kicker}</span>
          <h2 className="font-display mt-3 max-w-5xl text-4xl leading-[0.95] tracking-tight text-[#FAFAFA] md:text-6xl">{title}</h2>
          {subtitle && <p className="mt-5 max-w-4xl text-base leading-relaxed text-[#E4E4E9] md:text-lg">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function MetricTile({ label, value, note, tone = 'watch' }: { label: string; value: string; note: string; tone?: Tone }) {
  return (
    <GlassCard className="p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B8B8C0]">{label}</div>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: toneColor(tone) }} />
      </div>
      <div className="font-display text-3xl leading-none text-[#FAFAFA] md:text-4xl">{value}</div>
      <p className="mt-3 text-sm leading-snug text-[#B8B8C0]">{note}</p>
    </GlassCard>
  );
}

function Bar({ value, max, color = red }: { value: number; max: number; color?: string }) {
  const pct = Math.max(0, Math.min(100, max ? (value / max) * 100 : 0));
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#262626]">
      <motion.div className="h-full rounded-full" style={{ backgroundColor: color }} initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: 'easeOut' }} />
    </div>
  );
}

function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <GlassCard className="p-6" glow={channel.status === 'risk'}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl text-[#FAFAFA]">{channel.name}</h3>
          <p className="mt-1 text-sm text-[#B8B8C0]">{channel.handle} · {channel.posts}</p>
        </div>
        <Badge tone={toneColor(channel.status)}>{toneLabel(channel.status)}</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B8B8C0]">Audience</div>
          <div className="font-display mt-2 text-4xl text-[#FAFAFA]">{compactNumber(channel.audience)}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B8B8C0]">Known share</div>
          <div className="font-display mt-2 text-4xl text-[#FD3737]">{channel.share}%</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B8B8C0]">Measured views</div>
          <div className="font-display mt-2 text-4xl text-[#FAFAFA]">{channel.measuredViews === null ? '—' : compactNumber(channel.measuredViews)}</div>
        </div>
      </div>
      <div className="mt-5">
        <Bar value={channel.audience} max={62_900} color={toneColor(channel.status)} />
      </div>
      <div className="mt-6 grid gap-4 text-sm leading-relaxed md:grid-cols-2">
        <div>
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#B8B8C0]">Read</div>
          <p className="text-[#E4E4E9]">{channel.insight}</p>
        </div>
        <div>
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#FD3737]">Action</div>
          <p className="text-[#FAFAFA]">{channel.action}</p>
        </div>
      </div>
      <p className="mt-5 border-t border-[#303030] pt-4 text-xs leading-relaxed text-[#71717A]">Source: {channel.source}</p>
    </GlassCard>
  );
}

function VideoTable() {
  const max = Math.max(...videos.map((v) => v.views));
  return (
    <GlassCard className="overflow-hidden">
      <div className="hidden grid-cols-[1.8fr_0.5fr_0.5fr_0.55fr_1.1fr_1.1fr] gap-4 border-b border-[#303030] bg-[#0C0C0C] px-5 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#B8B8C0] lg:grid">
        <div>Asset</div><div>Views</div><div>Type</div><div>Transcript</div><div>Signal</div><div>Next action</div>
      </div>
      {videos.map((video) => (
        <div key={video.title} className="grid gap-4 border-b border-[#303030] px-5 py-5 last:border-b-0 lg:grid-cols-[1.8fr_0.5fr_0.5fr_0.55fr_1.1fr_1.1fr] lg:items-start">
          <div>
            <div className="font-semibold leading-snug text-[#FAFAFA]">{video.title}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#B8B8C0]"><span>{video.platform}</span><span>·</span><span>{video.duration}</span><span>·</span><span>{video.published}</span></div>
          </div>
          <div>
            <div className="font-display text-2xl text-[#FD3737]">{compactNumber(video.views)}</div>
            <div className="mt-2 max-w-[120px]"><Bar value={video.views} max={max} color={video.type === 'Longform' ? red : '#A1A1AA'} /></div>
          </div>
          <div><Badge tone={video.type === 'Longform' ? red : '#E4E4E9'}>{video.type}</Badge></div>
          <div><Badge tone={video.transcript === 'Yes' ? '#22C55E' : '#71717A'}>{video.transcript}</Badge></div>
          <p className="text-sm leading-relaxed text-[#E4E4E9]">{video.signal}</p>
          <p className="text-sm leading-relaxed text-[#FAFAFA]">{video.action}</p>
        </div>
      ))}
    </GlassCard>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  return (
    <GlassCard className="p-6" glow={insight.tone === 'risk'}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B8B8C0]">{insight.label}</div>
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: toneColor(insight.tone) }} />
      </div>
      <div className="font-display text-5xl text-[#FD3737]">{insight.stat}</div>
      <p className="mt-5 text-sm leading-relaxed text-[#E4E4E9]">{insight.read}</p>
      <div className="mt-5 rounded-xl border border-[#FD3737]/25 bg-[#FD3737]/8 p-4 text-sm leading-relaxed text-[#FAFAFA]">
        <span className="font-bold text-[#FD3737]">Do next: </span>{insight.action}
      </div>
    </GlassCard>
  );
}

function SourceCard({ source }: { source: SourceHealth }) {
  return (
    <GlassCard className="p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="font-display text-2xl text-[#FAFAFA]">{source.source}</h3>
        <Badge tone={toneColor(source.status)}>{toneLabel(source.status)}</Badge>
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-[#E4E4E9]">
        <p><span className="font-bold text-[#FD3737]">Pulled: </span>{source.pulled}</p>
        <p><span className="font-bold text-[#FD3737]">Coverage: </span>{source.coverage}</p>
        <p className="text-[#B8B8C0]"><span className="font-bold text-[#E4E4E9]">Caveat: </span>{source.caveat}</p>
      </div>
    </GlassCard>
  );
}

function RegistryPanel({ registry }: { registry: EkatorRegistrySnapshot }) {
  const live = registry.status === 'live';
  const trackedNodes = registry.seedingNetworkCount + registry.snsViralCount + registry.officialHandleCount;
  return (
    <GlassCard className="mt-5 p-6" glow={live}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <Badge tone={live ? '#22C55E' : '#F59E0B'}>{live ? 'Supabase live' : 'Supabase fallback'}</Badge>
            <span className="text-xs uppercase tracking-[0.22em] text-[#B8B8C0]">Creative Control registry</span>
          </div>
          <h3 className="font-display text-3xl text-[#FAFAFA] md:text-4xl">{registry.clientName} registry is now part of the page read.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#E4E4E9]">
            Server-side registry snapshot from the EKATOR Supabase row. It does not expose credentials; it only renders counts, source freshness, and safe public asset/handle labels.
          </p>
        </div>
        <div className="rounded-2xl border border-[#303030] bg-[#0C0C0C]/70 p-4 text-sm text-[#B8B8C0] lg:min-w-[280px]">
          <div><span className="font-bold text-[#FAFAFA]">Last ingest:</span> {compactDateTime(registry.lastIngest)}</div>
          <div className="mt-2"><span className="font-bold text-[#FAFAFA]">Checked:</span> {compactDateTime(registry.lastChecked)}</div>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricTile label="Registry items" value={String(registry.itemsCount)} note={`${registry.readyItemsCount} ready · ${registry.ownedItemsCount} owned`} tone={live ? 'strong' : 'risk'} />
        <MetricTile label="Street-eval cuts" value={String(registry.streetEvalItemsCount)} note="Creative brain source inventory" tone="watch" />
        <MetricTile label="Tracked handles" value={String(registry.monitoredHandlesCount)} note={`${registry.activeMonitoredHandlesCount} active monitored nodes`} tone={live ? 'strong' : 'risk'} />
        <MetricTile label="Fan/social nodes" value={String(trackedNodes)} note="Seeding + SNS viral + official rows" tone="watch" />
        <MetricTile label="Saved analyses" value={String(registry.responseCount)} note="Creative Control responses available" tone="strong" />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#FD3737]">Recent registry assets</div>
          <div className="space-y-3">
            {registry.recentItems.slice(0, 4).map((item) => (
              <div key={`${item.caption}-${item.platform}-${item.handle}`} className="rounded-xl border border-[#303030] bg-[#111111] p-3">
                <div className="font-semibold text-[#FAFAFA]">{item.caption}</div>
                <div className="mt-1 text-xs text-[#B8B8C0]">{item.platform} · {item.handle} · {item.status}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#FD3737]">Tracked surfaces</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {registry.topHandles.slice(0, 6).map((handle) => (
              <div key={`${handle.displayName}-${handle.kind}`} className="rounded-xl border border-[#303030] bg-[#111111] p-3">
                <div className="font-semibold text-[#FAFAFA]">{handle.displayName}</div>
                <div className="mt-1 text-xs text-[#B8B8C0]">{handle.platforms} · {handle.kind}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export function EkatorCommandCenter({ registry }: { registry: EkatorRegistrySnapshot }) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const glowX = useSpring(mouseX, { stiffness: 55, damping: 22 });
  const glowY = useSpring(mouseY, { stiffness: 55, damping: 22 });
  const [lastUpdated, setLastUpdated] = useState('');

  const nav = useMemo(() => [
    ['read', 'Read'], ['channels', 'Channels'], ['assets', 'Assets'], ['insights', 'Insights'], ['moves', 'Moves'], ['sources', 'Sources'],
  ], []);
  const sourceHealth = useMemo(() => [...baseSourceHealth, supabaseSourceHealth(registry)], [registry]);

  useEffect(() => {
    setLastUpdated(new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()));
    const move = (event: MouseEvent) => { mouseX.set(event.clientX); mouseY.set(event.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0A0A0A] text-[#FAFAFA]">
      <ScrollProgress />
      <motion.div aria-hidden className="pointer-events-none fixed z-0 h-[480px] w-[480px] rounded-full bg-[#FD3737]/10 blur-[135px]" style={{ left: glowX, top: glowY, x: '-50%', y: '-50%' }} />

      <nav className="fixed left-0 right-0 top-[3px] z-50 border-b border-[#303030]/70 bg-[#0A0A0A]/82 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control" className="h-5 w-auto opacity-90" />
          <div className="hidden items-center gap-6 lg:flex">
            {nav.map(([id, label]) => <a key={id} href={`#${id}`} className="text-[11px] uppercase tracking-[0.22em] text-[#B8B8C0] transition-colors hover:text-[#FD3737]">{label}</a>)}
          </div>
          <Badge>Living dashboard</Badge>
        </div>
      </nav>

      <header ref={heroRef} className="relative min-h-screen overflow-hidden pt-16">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ekator/hero.png" alt="" className="h-full w-full object-cover opacity-64" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/68 to-[#0A0A0A]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/94 via-[#0A0A0A]/56 to-transparent" />
        </motion.div>
        <motion.div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-12 md:px-10 md:pb-16" style={{ opacity: heroOpacity }}>
          <div className="mb-5 flex flex-wrap gap-3">
            <Badge>EKATOR</Badge><Badge tone="#E4E4E9">Idol Till I Die</Badge><Badge tone="#E4E4E9">Owned social intelligence</Badge><Badge tone="#E4E4E9">MCP-pulled</Badge>
          </div>
          <h1 className="font-display max-w-6xl text-6xl leading-[0.88] tracking-tight text-[#FAFAFA] md:text-8xl lg:text-9xl">EKATOR <span className="block text-[#FD3737]">SOCIAL DASHBOARD</span></h1>
          <p className="mt-7 max-w-4xl text-lg leading-relaxed text-[#E4E4E9] md:text-xl">A living read on the owned “Idol Till I Die” channels: what is growing, what is underused, which assets are moving, and what Crowd Control should do next. The page shows signal, interpretation, and action.</p>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <MetricTile label="Known owned audience" value={compactNumber(ownedAudience)} note="IG + YouTube + TikTok official surfaces" tone="strong" />
            <MetricTile label="Measured YouTube views" value={compactNumber(youtubeTotalViews)} note="9 official videos pulled from YouTube/Tokscript" tone="watch" />
            <MetricTile label="EP1 gravity" value="83.3%" note="Share of measured YouTube views from EP1 alone" tone="watch" />
            <MetricTile label="TikTok content gap" value="0 posts" note="10.5K followers waiting on official clips" tone="risk" />
          </div>
          <p className="mt-5 text-xs text-[#71717A]">Last dashboard render: {lastUpdated || 'loading'} · data pull: Tokscript + Sandcastles + Supabase {registry.status === 'live' ? 'live registry' : 'fallback registry'} · no fabricated metrics.</p>
        </motion.div>
      </header>

      <Section id="read" kicker="01 / executive read" title="The story is working; distribution is not yet caught up." subtitle="EP1 has already proven interest beyond the subscriber base. The immediate opportunity is not more planning — it is turning the longform story into a measured cross-platform clip system.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricTile label="EP1 views" value={compactNumber(113_809)} note="Tokscript YouTube pull · transcript available" tone="strong" />
          <MetricTile label="EP1 vs teaser" value="7.4×" note="EP1 has already outpaced teaser views by a wide margin" tone="strong" />
          <MetricTile label="YouTube Shorts total" value={compactNumber(shortsViews)} note="Current official short-form YouTube layer" tone="risk" />
          <MetricTile label="Longform concentration" value="94.7%" note="EP1 + teaser share of measured YouTube views" tone="watch" />
        </div>
        <RegistryPanel registry={registry} />
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="channels" kicker="02 / owned channels" title="Owned-channel health" subtitle="This is the part that should refresh daily: audience base, content output, measurable views, and the next action per official surface.">
        <div className="grid gap-5 lg:grid-cols-3">
          {channels.map((channel) => <ChannelCard key={channel.name} channel={channel} />)}
        </div>
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="assets" kicker="03 / asset performance" title="Official video signal board" subtitle="Every row answers the operating question: what is the asset telling us, and what should the team do with it next?">
        <VideoTable />
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="insights" kicker="04 / interpretation" title="Actionable insights" subtitle="Dashboard logic: metric → meaning → decision. These are the current reads from the owned social pull and the Master Brain creative context.">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {insights.map((insight) => <InsightCard key={insight.label} insight={insight} />)}
        </div>
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="moves" kicker="05 / recommended moves" title="Ranked moves for the next 72 hours" subtitle="A prioritized operating queue based on the strongest available signal.">
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <GlassCard key={rec.rank} className="p-5" glow={rec.rank <= 2}>
              <div className="grid gap-4 lg:grid-cols-[0.2fr_1.1fr_1fr_1fr_0.4fr] lg:items-start">
                <div className="font-display text-4xl text-[#FD3737]">{rec.rank}</div>
                <div><h3 className="font-display text-2xl leading-tight text-[#FAFAFA]">{rec.title}</h3><p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#B8B8C0]">{rec.owner}</p></div>
                <p className="text-sm leading-relaxed text-[#E4E4E9]"><span className="font-bold text-[#FD3737]">Why: </span>{rec.why}</p>
                <p className="text-sm leading-relaxed text-[#FAFAFA]"><span className="font-bold text-[#FD3737]">Move: </span>{rec.move}</p>
                <div className="lg:text-right"><Badge tone={rec.impact === 'High' ? red : '#E4E4E9'}>{rec.impact}</Badge></div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="benchmarks" kicker="06 / external pattern watch" title="Sandcastles benchmark read" subtitle="Sandcastles did not have the official Idol Till I Die channel indexed yet, so the useful current role is comp-format detection: what kinds of K-pop/social structures are producing outsized short-form response.">
        <div className="grid gap-5 lg:grid-cols-3">
          {benchmarks.map((bench) => (
            <GlassCard key={bench.title} className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4"><div><h3 className="font-display text-2xl text-[#FAFAFA]">{bench.title}</h3><p className="mt-1 text-xs text-[#B8B8C0]">{bench.handle} · {bench.platform}</p></div><Badge>{bench.outlier}</Badge></div>
              <div className="grid grid-cols-2 gap-4">
                <div><div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B8B8C0]">Views</div><div className="font-display mt-2 text-4xl text-[#FD3737]">{compactNumber(bench.views)}</div></div>
                <div><div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B8B8C0]">Engagement</div><div className="font-display mt-2 text-4xl text-[#FAFAFA]">{bench.engagement}</div></div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-[#E4E4E9]"><span className="font-bold text-[#FD3737]">Pattern to steal: </span>{bench.pattern}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="sources" kicker="07 / data freshness" title="What is live, what is fallback, what needs access" subtitle="The page shows source confidence and gaps only where they affect decision quality.">
        <div className="grid gap-5 lg:grid-cols-3">
          {sourceHealth.map((source) => <SourceCard key={source.source} source={source} />)}
        </div>
        <GlassCard className="mt-6 p-7" glow>
          <h3 className="font-display text-3xl text-[#FAFAFA]">Next live-data upgrade</h3>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-[#E4E4E9]">
            {registry.status === 'live'
              ? 'Supabase is connected server-side. The next upgrade is to write the daily Tokscript/Sandcastles refresh into cc_performance so the channel and asset cards hydrate beyond the current MCP-pulled snapshot.'
              : 'Connect Supabase credentials in the deployment/runtime environment, add official @idoltillidie to Sandcastles watchlist, and schedule the Tokscript owned-channel pull into the registry. Once that is connected, these same cards can render fresh values instead of the current MCP-pulled snapshot.'}
          </p>
        </GlassCard>
      </Section>

      <footer className="relative px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl text-center">
          <div className="font-display text-3xl text-[#FAFAFA] md:text-5xl">EKATOR <span className="text-[#FD3737]">×</span> Crowd Control</div>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-[#B8B8C0]">Owned-social intelligence dashboard for the Idol Till I Die campaign. Built from Tokscript, Sandcastles, Supabase, YouTube, Instagram browser fallback, TikTok profile data, and Master Brain context.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control" className="mx-auto mt-8 h-6 w-auto opacity-80" />
        </div>
      </footer>
    </main>
  );
}

export default EkatorCommandCenter;
