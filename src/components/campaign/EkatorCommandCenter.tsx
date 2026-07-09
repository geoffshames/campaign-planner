'use client';

import { useMemo, useRef, type ReactNode } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
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

type MeasurementLayer = {
  platform: string;
  audience: string;
  coverage: string;
  currentRead: string;
  nextData: string;
  tone: Tone;
};

type SentimentTheme = {
  theme: string;
  whatToTag: string;
  decisionUse: string;
  status: string;
};

type PaidReportingField = {
  metric: string;
  reportUse: string;
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
    signal: 'Matthew leader narrative is the cleanest member-led hook in the current short set.',
    action: 'Make this the first paid/SWRM test once clip tracking is clean.',
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
    read: 'The available short-form read points toward Matthew’s leader arc as the clearest hook for international audiences.',
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
    why: 'Instagram holds ~80% of the official audience. The strongest next read is whether that audience can move toward EP1, saves, and follow-through instead of staying passive.',
    move: 'Add pinned EP1 CTA, story link stack, and a recurring “choose the trainee” interactive sticker for each protagonist lane.',
    owner: 'Owned social',
    impact: 'High',
  },
  {
    rank: 4,
    title: 'Test member-pair dynamics before scaling performance-only cuts',
    why: 'The clearest clips are character-led. Relationship hooks make the show easier to understand for new viewers than formal trailer language.',
    move: 'Build a small batch around pairings and conflicts: Matthew/Cai, dorm rules, group stakes, and “can they debut together?” pressure.',
    owner: 'Creative strategy',
    impact: 'Medium',
  },
  {
    rank: 5,
    title: 'Close context gaps before the next clip wave',
    why: 'New viewers still need fast answers: who is onscreen, what the stakes are, where to watch, and why this moment matters.',
    move: 'Add one-line context to every next cut so casual viewers can understand the story without already knowing the show.',
    owner: 'Content clarity',
    impact: 'Medium',
  },
];


const measurementLayers: MeasurementLayer[] = [
  {
    platform: 'YouTube',
    audience: '5.28K subs',
    coverage: '9 videos with views',
    currentRead: 'Post-level views are live here; EP1 is the anchor and shorts are the distribution gap.',
    nextData: 'Add likes, comments, retention, average view duration, and subscriber delta by video.',
    tone: 'strong',
  },
  {
    platform: 'Instagram',
    audience: '62.9K followers',
    coverage: '8 posts counted',
    currentRead: 'Largest owned audience, but post-level engagement and story-click data are not in the read yet.',
    nextData: 'Capture views, likes, comments, saves, shares, story taps, link clicks, and follower delta per post.',
    tone: 'watch',
  },
  {
    platform: 'TikTok',
    audience: '10.5K followers',
    coverage: '0 official posts',
    currentRead: 'No post-level layer can exist until the first official clips go up.',
    nextData: 'Start with first-hour, 24-hour, and 72-hour views, profile visits, follows, comments, saves, and shares.',
    tone: 'risk',
  },
];

const sentimentThemes: SentimentTheme[] = [
  {
    theme: 'Matthew leadership arc',
    whatToTag: 'Leader, pressure, responsibility, sympathy, international-fan clarity.',
    decisionUse: 'Decides whether Matthew remains the first paid/social variable.',
    status: 'Ready to tag',
  },
  {
    theme: 'Group stakes',
    whatToTag: 'Together-or-fail framing, team tension, “can they debut?” reactions.',
    decisionUse: 'Decides if hooks should lead with the show premise instead of one member.',
    status: 'Ready to tag',
  },
  {
    theme: 'Dorm / rule comedy',
    whatToTag: 'Funny rules, daily-life moments, meme comments, low-context shareability.',
    decisionUse: 'Decides which casual-fandom clips can scale beyond existing viewers.',
    status: 'Ready to tag',
  },
  {
    theme: 'Confusion / context gaps',
    whatToTag: 'Questions about who, what show, voting, episode order, subtitles, where to watch.',
    decisionUse: 'Decides what on-screen text must be added before paid spend.',
    status: 'Needs comments',
  },
];

const paidReportingFields: PaidReportingField[] = [
  { metric: 'Spend', reportUse: 'Daily and cumulative spend by platform, campaign, audience, and creative.' },
  { metric: 'Reach / impressions', reportUse: 'Paid delivery volume separated from owned-channel views.' },
  { metric: 'CPM / CPV', reportUse: 'Efficiency read by platform and creative once delivery begins.' },
  { metric: 'Thumbstop / hold rate', reportUse: 'Opening-frame performance by cut, tracked from paid delivery only.' },
  { metric: 'Completion rate', reportUse: 'Whether the paid audience stays through the story, not just the hook.' },
  { metric: 'Follower conversion', reportUse: 'New followers or subscribers generated per 1K paid views.' },
  { metric: 'EP1 click-through', reportUse: 'Whether paid clips create traffic to the anchor episode.' },
  { metric: 'Creative winner / loser', reportUse: 'Best and weakest paid cuts by platform, audience, and day.' },
];

const followerBaselines = [
  { platform: 'Instagram', baseline: '62.9K', afterEpisode: 'Track T+24h / T+72h / T+7d after each episode post.' },
  { platform: 'YouTube', baseline: '5.28K', afterEpisode: 'Track subscriber delta against EP1 and each short release.' },
  { platform: 'TikTok', baseline: '10.5K', afterEpisode: 'Start delta tracking the day the first official TikTok clip posts.' },
];

const currentReadDate = new Date('2026-07-08T12:00:00-07:00');
const monthIndex: Record<string, number> = { Jun: 5, Jul: 6 };

function daysSincePublished(published: string) {
  const [month, dayText] = published.split(' ');
  const day = Number.parseInt(dayText, 10);
  const monthNumber = monthIndex[month] ?? 6;
  const publishedDate = new Date(2026, monthNumber, day, 12, 0, 0);
  const diff = Math.round((currentReadDate.getTime() - publishedDate.getTime()) / 86_400_000);
  return Math.max(1, diff);
}

const compactNumber = (value: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: value >= 10_000 ? 1 : 0 }).format(value);

function toneColor(tone: Tone) {
  if (tone === 'strong') return '#E4E4E9';
  if (tone === 'watch') return red;
  if (tone === 'risk') return '#D42D2D';
  if (tone === 'quiet') return '#B8B8C0';
  return '#8A8A91';
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
    <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: tone, backgroundColor: `${tone}18`, border: `1px solid ${tone}35` }}>
      {children}
    </span>
  );
}

function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[1.35rem] border border-[#3A3A3A] bg-[#141414]/96 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] ${className}`}>
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
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8B8C0]">{label}</div>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: toneColor(tone) }} />
      </div>
      <div className="font-display text-3xl leading-none text-[#FAFAFA] md:text-4xl">{value}</div>
      <p className="mt-3 text-sm leading-snug text-[#B8B8C0]">{note}</p>
    </GlassCard>
  );
}

function Bar({ value, max, color = red }: { value: number; max: number; color?: string }) {
  const pct = Math.max(0, Math.min(100, max ? (value / max) * 100 : 0));
  return <div className="h-3 overflow-hidden rounded-full" style={{ background: `linear-gradient(90deg, ${color} 0%, ${color} ${pct}%, #262626 ${pct}%, #262626 100%)` }} />;
}

type ChartSegment = { label: string; value: number; color: string; note: string };

const chartPalette = ['#FD3737', '#D42D2D', '#E4E4E9'];

function DonutChart({ segments, center, sublabel }: { segments: ChartSegment[]; center: string; sublabel: string }) {
  let cursor = 0;
  const gradient = segments.map((segment) => {
    const start = cursor;
    cursor += segment.value;
    return `${segment.color} ${start}% ${cursor}%`;
  }).join(', ');

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center">
      <div className="relative mx-auto h-44 w-44 shrink-0 rounded-full" style={{ background: `conic-gradient(${gradient})` }}>
        <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full border border-[#3A3A3A] bg-[#141414] text-center">
          <div className="font-display text-3xl text-[#FAFAFA]">{center}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#B8B8C0]">{sublabel}</div>
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        {segments.map((segment) => (
          <div key={segment.label}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-semibold text-[#FAFAFA]"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />{segment.label}</span>
              <span className="font-display text-lg text-[#FAFAFA]">{segment.value.toFixed(segment.value % 1 ? 1 : 0)}%</span>
            </div>
            <p className="text-sm leading-snug text-[#E4E4E9]">{segment.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StackedBar({ segments }: { segments: ChartSegment[] }) {
  let cursor = 0;
  const stops = segments.map((segment) => {
    const start = cursor;
    cursor += segment.value;
    return `${segment.color} ${start}% ${cursor}%`;
  }).join(', ');
  const background = `linear-gradient(90deg, ${stops}, #262626 ${cursor}% 100%)`;
  return (
    <div>
      <div className="h-6 overflow-hidden rounded-full" style={{ background }} />
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {segments.map((segment) => (
          <div key={segment.label} className="rounded-xl border border-[#303030] bg-[#101010] p-3">
            <div className="text-sm font-semibold text-[#FAFAFA]">{segment.label}</div>
            <div className="font-display mt-1 text-2xl text-[#FD3737]">{segment.value.toFixed(1)}%</div>
            <p className="mt-1 text-sm leading-snug text-[#E4E4E9]">{segment.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisualSnapshot() {
  const audienceSegments = channels.map((channel, index) => ({
    label: channel.name,
    value: channel.share,
    color: chartPalette[index],
    note: channel.role,
  }));
  const viewSegments = [
    { label: 'EP1', value: (113_809 / youtubeTotalViews) * 100, color: red, note: 'Primary demand asset' },
    { label: 'Teaser', value: (15_434 / youtubeTotalViews) * 100, color: '#D42D2D', note: 'Setup asset now outpaced' },
    { label: 'Shorts', value: (shortsViews / youtubeTotalViews) * 100, color: '#E4E4E9', note: 'Distribution layer to fix' },
  ];
  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr_0.9fr]">
      <GlassCard className="p-6 md:p-7">
        <div className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#FD3737]">Audience mix</div>
        <DonutChart segments={audienceSegments} center={compactNumber(ownedAudience)} sublabel="known audience" />
      </GlassCard>
      <GlassCard className="p-6 md:p-7">
        <div className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#FD3737]">View mix</div>
        <StackedBar segments={viewSegments} />
      </GlassCard>
      <GlassCard className="p-6 md:p-7">
        <div className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#FD3737]">Channel activation</div>
        <div className="space-y-5">
          {channels.map((channel) => (
            <div key={channel.name}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-[#FAFAFA]">{channel.name}</div>
                  <div className="text-sm text-[#B8B8C0]">{channel.posts}</div>
                </div>
                <div className="font-display text-2xl text-[#FD3737]">{channel.share}%</div>
              </div>
              <Bar value={channel.share} max={100} color={channel.status === 'risk' ? '#D42D2D' : red} />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <GlassCard className="p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl text-[#FAFAFA]">{channel.name}</h3>
          <p className="mt-1 text-sm text-[#B8B8C0]">{channel.handle} · {channel.posts}</p>
        </div>
        <Badge tone={toneColor(channel.status)}>{toneLabel(channel.status)}</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8B8C0]">Audience</div>
          <div className="font-display mt-2 text-4xl text-[#FAFAFA]">{compactNumber(channel.audience)}</div>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8B8C0]">Known share</div>
          <div className="font-display mt-2 text-4xl text-[#FD3737]">{channel.share}%</div>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8B8C0]">Measured views</div>
          <div className="font-display mt-2 text-4xl text-[#FAFAFA]">{channel.measuredViews === null ? '—' : compactNumber(channel.measuredViews)}</div>
        </div>
      </div>
      <div className="mt-5">
        <Bar value={channel.audience} max={62_900} color={toneColor(channel.status)} />
      </div>
      <div className="mt-6 grid gap-4 text-sm leading-relaxed md:grid-cols-2">
        <div>
          <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8B8C0]">Read</div>
          <p className="text-[#E4E4E9]">{channel.insight}</p>
        </div>
        <div>
          <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FD3737]">Action</div>
          <p className="text-[#FAFAFA]">{channel.action}</p>
        </div>
      </div>
    </GlassCard>
  );
}

function VideoSignalBoard() {
  const max = Math.max(...videos.map((v) => v.views));
  const priority = videos.slice(0, 4);
  const secondary = videos.slice(4);
  return (
    <GlassCard className="p-5 md:p-7">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#FD3737]">View distribution</div>
              <h3 className="font-display mt-2 text-3xl leading-none text-[#FAFAFA]">EP1 carries the system</h3>
            </div>
            <div className="font-display text-4xl text-[#FD3737]">83%</div>
          </div>
          <div className="space-y-4">
            {videos.slice(0, 6).map((video) => (
              <div key={video.title} className="rounded-xl border border-[#303030] bg-[#101010] p-4">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold leading-snug text-[#FAFAFA]">{video.title}</div>
                    <div className="mt-1 text-sm text-[#B8B8C0]">{video.type} · {video.duration} · {video.published}</div>
                  </div>
                  <div className="font-display shrink-0 text-2xl text-[#FD3737]">{compactNumber(video.views)}</div>
                </div>
                <Bar value={video.views} max={max} color={video.type === 'Longform' ? red : '#D42D2D'} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#FD3737]">Priority clip cards</div>
          <div className="grid gap-4">
            {priority.map((video, index) => (
              <div key={video.title} className="rounded-xl border border-[#303030] bg-[#101010] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="font-display text-3xl text-[#FD3737]">0{index + 1}</span>
                  <Badge tone={video.transcript === 'Yes' ? red : '#E4E4E9'}>{video.transcript === 'Yes' ? 'Transcript' : video.type}</Badge>
                </div>
                <h4 className="font-display text-2xl leading-tight text-[#FAFAFA]">{video.type === 'Longform' ? 'Anchor episode' : video.type === 'Teaser' ? 'Retargeting asset' : 'Short-form test'}</h4>
                <p className="mt-3 text-sm leading-relaxed text-[#E4E4E9]">{video.signal}</p>
                <div className="mt-4 border-t border-[#303030] pt-4 text-sm leading-relaxed text-[#FAFAFA]"><span className="font-bold text-[#FD3737]">Move: </span>{video.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        {secondary.map((video) => (
          <div key={video.title} className="rounded-xl border border-[#303030] bg-[#101010] p-4">
            <div className="font-display text-2xl text-[#FD3737]">{compactNumber(video.views)}</div>
            <div className="mt-2 min-h-12 text-sm font-semibold leading-tight text-[#FAFAFA]">{video.title}</div>
            <div className="mt-3"><Bar value={video.views} max={shortsViews} color="#E4E4E9" /></div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}


function DataLayerPanel() {
  const maxVelocity = Math.max(...videos.map((video) => video.views / daysSincePublished(video.published)));
  return (
    <div className="space-y-5">
      <GlassCard className="p-5 md:p-7">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#FD3737]">Post-level by platform</div>
            <h3 className="font-display mt-2 text-3xl leading-none text-[#FAFAFA] md:text-4xl">Every surface gets a per-post read</h3>
          </div>
          <Badge tone="#E4E4E9">Confirmed baseline</Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {measurementLayers.map((layer) => (
            <div key={layer.platform} className="rounded-xl border border-[#303030] bg-[#101010] p-4">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="font-display text-3xl text-[#FAFAFA]">{layer.platform}</div>
                  <div className="mt-1 text-sm text-[#B8B8C0]">{layer.audience}</div>
                </div>
                <span className="mt-2 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: toneColor(layer.tone) }} />
              </div>
              <div className="mb-4 rounded-lg border border-[#303030] bg-[#141414] p-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8B8C0]">Coverage</div>
                <div className="mt-1 font-display text-2xl text-[#FD3737]">{layer.coverage}</div>
              </div>
              <p className="text-sm leading-relaxed text-[#E4E4E9]">{layer.currentRead}</p>
              <div className="mt-4 border-t border-[#303030] pt-4 text-sm leading-relaxed text-[#FAFAFA]"><span className="font-bold text-[#FD3737]">Add next: </span>{layer.nextData}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassCard className="p-5 md:p-7">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#FD3737]">Daily velocity curves</div>
              <h3 className="font-display mt-2 text-3xl leading-none text-[#FAFAFA]">Start with current views/day proxy</h3>
            </div>
            <div className="text-right text-xs uppercase tracking-[0.18em] text-[#B8B8C0]">Baseline Jul 8</div>
          </div>
          <div className="space-y-4">
            {videos.slice(0, 6).map((video) => {
              const days = daysSincePublished(video.published);
              const velocity = video.views / days;
              return (
                <div key={video.title} className="rounded-xl border border-[#303030] bg-[#101010] p-4">
                  <div className="mb-3 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                    <div>
                      <div className="font-semibold leading-tight text-[#FAFAFA]">{video.title}</div>
                      <div className="mt-1 text-sm text-[#B8B8C0]">{video.type} · {video.published} · {days}d live</div>
                    </div>
                    <div className="font-display text-2xl text-[#FD3737]">{compactNumber(Math.round(velocity))}/day</div>
                    <div className="text-right text-sm text-[#E4E4E9]">{compactNumber(video.views)} total</div>
                  </div>
                  <Bar value={velocity} max={maxVelocity} color={video.type === 'Longform' ? red : '#D42D2D'} />
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-[#B8B8C0]">This is a current pacing proxy. True curves need daily snapshots at the same time each day.</p>
        </GlassCard>

        <GlassCard className="p-5 md:p-7">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#FD3737]">Follower delta after episode</div>
          <h3 className="font-display mt-2 text-3xl leading-none text-[#FAFAFA]">Baselines are set; deltas come next</h3>
          <div className="mt-6 space-y-4">
            {followerBaselines.map((item) => (
              <div key={item.platform} className="rounded-xl border border-[#303030] bg-[#101010] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-[#FAFAFA]">{item.platform}</div>
                    <div className="mt-1 text-sm text-[#B8B8C0]">Baseline audience</div>
                  </div>
                  <div className="font-display text-3xl text-[#FD3737]">{item.baseline}</div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-[#E4E4E9]">
                  <div className="rounded-lg bg-[#262626] px-2 py-2">T+24h</div>
                  <div className="rounded-lg bg-[#262626] px-2 py-2">T+72h</div>
                  <div className="rounded-lg bg-[#262626] px-2 py-2">T+7d</div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#B8B8C0]">{item.afterEpisode}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <GlassCard className="p-5 md:p-7">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#FD3737]">Comment + sentiment themes</div>
          <h3 className="font-display mt-2 text-3xl leading-none text-[#FAFAFA]">Tag comments by creative decision</h3>
          <div className="mt-6 grid gap-3">
            {sentimentThemes.map((theme) => (
              <div key={theme.theme} className="rounded-xl border border-[#303030] bg-[#101010] p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="font-semibold text-[#FAFAFA]">{theme.theme}</div>
                  <Badge tone={theme.status === 'Needs comments' ? '#D42D2D' : '#E4E4E9'}>{theme.status}</Badge>
                </div>
                <p className="text-sm leading-relaxed text-[#E4E4E9]"><span className="font-bold text-[#FD3737]">Tag: </span>{theme.whatToTag}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#B8B8C0]"><span className="font-bold text-[#FAFAFA]">Use: </span>{theme.decisionUse}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 md:p-7">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#FD3737]">Paid media</div>
              <h3 className="font-display mt-2 text-3xl leading-none text-[#FAFAFA]">Ready once campaigns launch</h3>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8B8C0]">Current delivery</div>
              <div className="font-display mt-1 text-3xl text-[#FD3737]">Not live yet</div>
            </div>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-[#E4E4E9]">No paid campaigns are live yet. Once campaigns launch, this section will show confirmed delivery, efficiency, and conversion data.</p>

          <div className="mb-5 rounded-2xl border border-[#FD3737]/30 bg-[#FD3737]/8 p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FD3737]">Launch status</div>
            <p className="mt-2 text-sm leading-relaxed text-[#FAFAFA]">No spend, delivery, or conversion rows are available yet. This panel will update when paid campaigns begin.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {paidReportingFields.map((item) => (
              <div key={item.metric} className="rounded-xl border border-[#303030] bg-[#101010] p-4">
                <div className="font-display text-2xl leading-tight text-[#FAFAFA]">{item.metric}</div>
                <p className="mt-3 text-sm leading-relaxed text-[#E4E4E9]">{item.reportUse}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  return (
    <GlassCard className="p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8B8C0]">{insight.label}</div>
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

function RegistryPanel({ registry }: { registry: EkatorRegistrySnapshot }) {
  const live = registry.status === 'live';
  const trackedNodes = registry.seedingNetworkCount + registry.snsViralCount + registry.officialHandleCount;
  return (
    <GlassCard className="mt-5 p-6">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <Badge tone={live ? red : '#D42D2D'}>{live ? 'Current data' : 'Data updating'}</Badge>
        <span className="text-xs uppercase tracking-[0.22em] text-[#B8B8C0]">Campaign asset index</span>
      </div>
      <h3 className="font-display text-3xl text-[#FAFAFA] md:text-4xl">EKATOR asset and audience map</h3>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#E4E4E9]">
        Current inventory of owned assets, monitored social surfaces, and fan-network nodes shaping the campaign read.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricTile label="Indexed assets" value={String(registry.itemsCount)} note={`${registry.readyItemsCount} ready · ${registry.ownedItemsCount} owned`} tone={live ? 'strong' : 'risk'} />
        <MetricTile label="Street-eval cuts" value={String(registry.streetEvalItemsCount)} note="Short-form creative assets" tone="watch" />
        <MetricTile label="Monitored surfaces" value={String(registry.monitoredHandlesCount)} note={`${registry.activeMonitoredHandlesCount} active social surfaces`} tone={live ? 'strong' : 'risk'} />
        <MetricTile label="Fan / social nodes" value={String(trackedNodes)} note="Official + fan-network surfaces" tone="watch" />
        <MetricTile label="Analysis records" value={String(registry.responseCount)} note="Saved campaign reads" tone="strong" />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FD3737]">Recent assets</div>
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
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FD3737]">Monitored social surfaces</div>
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
  const nav = useMemo(() => [
    ['read', 'Read'], ['channels', 'Channels'], ['assets', 'Assets'], ['insights', 'Insights'], ['data', 'Data'], ['moves', 'Moves'],
  ], []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0A0A0A] text-[#FAFAFA]">
      <ScrollProgress />
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
            <Badge>EKATOR</Badge><Badge tone="#E4E4E9">Idol Till I Die</Badge><Badge tone="#E4E4E9">Owned social intelligence</Badge>
          </div>
          <h1 className="font-display max-w-6xl text-6xl leading-[0.88] tracking-tight text-[#FAFAFA] md:text-8xl lg:text-9xl">EKATOR <span className="block text-[#FD3737]">SOCIAL DASHBOARD</span></h1>
          <p className="mt-7 max-w-4xl text-lg leading-relaxed text-[#E4E4E9] md:text-xl">A living read on the owned “Idol Till I Die” channels: what is growing, what is underused, which assets are moving, and what Crowd Control should do next. The page shows signal, interpretation, and action.</p>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <MetricTile label="Known owned audience" value={compactNumber(ownedAudience)} note="IG + YouTube + TikTok official surfaces" tone="strong" />
            <MetricTile label="Measured YouTube views" value={compactNumber(youtubeTotalViews)} note="9 official videos measured" tone="watch" />
            <MetricTile label="EP1 gravity" value="83.3%" note="Share of measured YouTube views from EP1 alone" tone="watch" />
            <MetricTile label="TikTok content gap" value="0 posts" note="10.5K followers waiting on official clips" tone="risk" />
          </div>
        </motion.div>
      </header>

      <Section id="read" kicker="01 / executive read" title="The story is working; distribution is not yet caught up." subtitle="EP1 has already proven interest beyond the subscriber base. The immediate opportunity is not more planning — it is turning the longform story into a measured cross-platform clip system.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricTile label="EP1 views" value={compactNumber(113_809)} note="Transcript available" tone="strong" />
          <MetricTile label="EP1 vs teaser" value="7.4×" note="EP1 has already outpaced teaser views by a wide margin" tone="strong" />
          <MetricTile label="YouTube Shorts total" value={compactNumber(shortsViews)} note="Current official short-form YouTube layer" tone="risk" />
          <MetricTile label="Longform concentration" value="94.7%" note="EP1 + teaser share of measured YouTube views" tone="watch" />
        </div>
        <VisualSnapshot />
        <RegistryPanel registry={registry} />
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="channels" kicker="02 / owned channels" title="Owned-channel health" subtitle="Audience base, content output, measurable views, and the next action per official surface.">
        <div className="grid gap-5 lg:grid-cols-3">
          {channels.map((channel) => <ChannelCard key={channel.name} channel={channel} />)}
        </div>
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="assets" kicker="03 / asset performance" title="Official video signal board" subtitle="A visual read of where attention is concentrated and which assets should be cut, mirrored, or held.">
        <VideoSignalBoard />
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="insights" kicker="04 / interpretation" title="Actionable insights" subtitle="Metric, meaning, and decision — compressed into the current operating read.">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {insights.map((insight) => <InsightCard key={insight.label} insight={insight} />)}
        </div>
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="data" kicker="05 / measurement layers" title="The next reads for the dashboard" subtitle="Post-level performance, daily pacing, comment themes, follower lift, and future paid-media delivery — shown with confirmed baselines and clear open slots.">
        <DataLayerPanel />
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="moves" kicker="06 / recommended moves" title="Ranked moves for the next 72 hours" subtitle="A prioritized operating queue based on the strongest available signal.">
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <GlassCard key={rec.rank} className="p-5">
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

      <footer className="relative px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl text-center">
          <div className="font-display text-3xl text-[#FAFAFA] md:text-5xl">EKATOR <span className="text-[#FD3737]">×</span> Crowd Control</div>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-[#B8B8C0]">Owned-social intelligence dashboard for the Idol Till I Die campaign.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control" className="mx-auto mt-8 h-6 w-auto opacity-80" />
        </div>
      </footer>
    </main>
  );
}

export default EkatorCommandCenter;
