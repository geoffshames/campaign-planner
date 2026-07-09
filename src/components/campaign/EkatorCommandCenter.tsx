'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';

type Tone = 'live' | 'ready' | 'blocked' | 'watch' | 'pending';

type PulseTile = {
  label: string;
  value: string;
  note: string;
  tone: Tone;
};

type Workstream = {
  name: string;
  budget: number;
  spent: number;
  objective: string;
  kpis: string;
  connectors: string[];
  cron: string[];
  status: Tone;
  latest: string;
};

type Member = {
  name: string;
  born: string;
  origin: string;
  position: string;
  hook: string;
  priority: 'Breakout' | 'Primary' | 'Secondary' | 'Sensitive';
};

type Episode = {
  ep: string;
  title: string;
  status: Tone;
  views: string;
  clips: string;
  action: string;
};

type Connector = {
  name: string;
  purpose: string;
  workstream: string;
  usedBy: string;
  status: Tone;
};

type CronJob = {
  name: string;
  schedule: string;
  does: string;
  reads: string;
  writes: string;
  status: Tone;
};

const red = '#FD3737';
const budgetTotal = 50000;

const pulseTiles: PulseTile[] = [
  { label: 'Latest EP views', value: '~109K', note: 'EP1 launch signal · YouTube', tone: 'live' },
  { label: 'Brain media', value: '16', note: 'EP1 + 15 street-eval clips analyzed', tone: 'live' },
  { label: 'Working budget', value: '$39K', note: 'media + discretionary', tone: 'ready' },
  { label: 'Paid access', value: 'Open', note: 'Meta / TikTok / Google auth needed', tone: 'blocked' },
  { label: 'Clipping line', value: '$10K', note: 'largest media lever; attribution first', tone: 'watch' },
  { label: 'Debut target', value: 'Q1 2027', note: 'pre-debut awareness runway', tone: 'ready' },
];

const workstreams: Workstream[] = [
  {
    name: 'Paid Social',
    budget: 15000,
    spent: 0,
    objective: 'Growth + engagement pre-launch; build lookalike and retargeting pools off doc viewers and clip engagers, US-first.',
    kpis: 'Audience growth, CPM/CPE, pool size, follower lift',
    connectors: ['Meta Ads', 'TikTok Ads'],
    cron: ['paid-pacing'],
    status: 'blocked',
    latest: 'Awaiting account auth before pacing can run.',
  },
  {
    name: 'Clipping',
    budget: 10000,
    spent: 0,
    objective: 'Push members out in short-form volume; the largest lever, fed by the creative brain’s per-member hooks.',
    kpis: 'Clips shipped, total views, cost/1K views, breakout rate',
    connectors: ['Clip tracker / PayPerClip', 'TwelveLabs', 'yt-dlp'],
    cron: ['episode-watch', 'clip-tracker', 'fanpage-monitor'],
    status: 'watch',
    latest: 'Tracking and source-hook attribution must be locked before scale.',
  },
  {
    name: 'Discretionary',
    budget: 6000,
    spent: 0,
    objective: 'React to what pops: boost a breakout clip, back a fan page, jump a trend, or add to a converting member.',
    kpis: 'Reallocated with intent, logged per use, lift on boosts',
    connectors: ['Manual', 'Viral radar'],
    cron: ['viral-radar'],
    status: 'ready',
    latest: '$6K unspent; use only when radar shows a clear lift thesis.',
  },
  {
    name: 'YouTube Ads',
    budget: 5000,
    spent: 0,
    objective: 'Views + retention on each episode; feed the official channel and subscribers, US-first.',
    kpis: 'Views, view rate, sub lift, cost/view',
    connectors: ['Google Ads', 'YouTube Data API'],
    cron: ['paid-pacing', 'youtube-pulse'],
    status: 'blocked',
    latest: 'YouTube API + Google Ads auth needed for live values.',
  },
  {
    name: 'SWRM',
    budget: 3000,
    spent: 0,
    objective: 'Real-user engagement on episodes, clips, and socials; warm the algorithm without bot-looking repetition.',
    kpis: 'Engagements, sentiment, lift on seeded posts',
    connectors: ['SWRM'],
    cron: ['swrm-sync'],
    status: 'blocked',
    latest: 'Connector and delivery format still need to be confirmed.',
  },
  {
    name: 'Crowd Control Ops',
    budget: 11000,
    spent: 0,
    objective: 'Strategy, oversight, reporting, automation layer, and operating coverage.',
    kpis: 'Cadence held, dashboard fresh, weekly rollup shipped',
    connectors: ['Hermes', 'Master Brain', 'Slack'],
    cron: ['weekly-rollup', 'vault-sync'],
    status: 'ready',
    latest: '$5K retainer + $6K fees tracked as ops, not media.',
  },
];

const members: Member[] = [
  { name: 'Matthew', born: '2006', origin: 'Toronto · Chinese-Korean', position: 'Leader', hook: 'Rational leader; fan-service charm; the breakout. Twin, ENTJ, Fortnite champ.', priority: 'Breakout' },
  { name: 'Cai Jinxin', born: '2003', origin: 'Hong Kong / China', position: 'Vocal', hook: 'Redemption/origin; ex-Boys Planet; multilingual; the airport video that started the group.', priority: 'Breakout' },
  { name: 'Oh Juni', born: '2009', origin: 'Korea', position: 'All-rounder', hook: 'Gifted youngest; fear-of-failure confessional and emotional-story lane.', priority: 'Primary' },
  { name: 'Lukas', born: '2006', origin: 'Toronto · Chinese-Korean', position: 'All-rounder', hook: 'Matthew’s twin; business-school-to-idol contrast and confident interview beats.', priority: 'Secondary' },
  { name: 'Samuel', born: '2006', origin: 'Germany / Korea', position: 'Vocal', hook: 'Underdog grind; German model, three months of training, performance-first.', priority: 'Secondary' },
  { name: 'Sunbin', born: 'n/a', origin: 'Korea', position: 'Original member', hook: 'Departs EP2; handle as context only, not exploitative fallout framing.', priority: 'Sensitive' },
];

const episodes: Episode[] = [
  { ep: 'EP1', title: 'Origin / first attachment loop', status: 'live', views: '~109K', clips: 'TBD', action: 'Transcript + timestamp sheet, hook pass, first clipping queue.' },
  { ep: 'EP2', title: 'Sunbin departure / lineup pressure', status: 'watch', views: 'Pending', clips: 'TBD', action: 'Narrative-sensitive clipping; avoid exploitative framing.' },
  { ep: 'EP3', title: 'Training proof', status: 'pending', views: 'Upcoming', clips: 'TBD', action: 'Prepare performance-first member cuts.' },
  { ep: 'EP4', title: 'Conflict / growth', status: 'pending', views: 'Upcoming', clips: 'TBD', action: 'Pull emotional-story lanes for Oh Juni / Samuel.' },
  { ep: 'EP5', title: 'Street-stage build', status: 'pending', views: 'Upcoming', clips: 'TBD', action: 'Pre-load paid audiences for street-stage proof.' },
  { ep: 'EP6', title: 'Season 1 close', status: 'pending', views: 'Upcoming', clips: 'TBD', action: 'Turn finale into retargeting and Plus Chat conversion.' },
];

const connectors: Connector[] = [
  { name: 'Supabase', purpose: 'Registry, data layer, cc-media bucket', workstream: 'All', usedBy: 'Every cron', status: 'live' },
  { name: 'TwelveLabs Jockey', purpose: 'Creative brain: ingest + grounded clip-hook queries', workstream: 'Clipping', usedBy: 'episode-watch, fanpage-monitor, creative-brain-refresh', status: 'live' },
  { name: 'TokScript', purpose: 'Handle catalog + per-post engagement', workstream: 'Clipping, discretionary', usedBy: 'fanpage-monitor, viral-radar', status: 'ready' },
  { name: 'Sandcastles', purpose: 'Outlier surfacing + second-opinion teardown', workstream: 'Clipping, discretionary', usedBy: 'viral-radar, creative-brain-refresh', status: 'ready' },
  { name: 'yt-dlp', purpose: 'Resolve TikTok / IG / RED posts to files for ingest', workstream: 'Clipping', usedBy: 'fanpage-monitor, episode-watch', status: 'live' },
  { name: 'YouTube Data API', purpose: 'Channel + episode views, subs, retention', workstream: 'YouTube Ads', usedBy: 'youtube-pulse, episode-watch', status: 'blocked' },
  { name: 'Meta / TikTok / Google Ads', purpose: 'Paid spend + results', workstream: 'Paid Social, YouTube Ads', usedBy: 'paid-pacing', status: 'blocked' },
  { name: 'SWRM / Clip Tracker', purpose: 'Engagement delivery + clip output counts', workstream: 'SWRM, clipping', usedBy: 'swrm-sync, clip-tracker', status: 'blocked' },
  { name: 'Slack + Master Brain', purpose: 'Digest and knowledge write-back', workstream: 'Ops', usedBy: 'all crons, vault-sync', status: 'ready' },
];

const cronJobs: CronJob[] = [
  { name: 'episode-watch', schedule: 'Mon 5am PT', does: 'New episode → transcript + timestamp sheet → TwelveLabs hook pass → clip recommendations.', reads: 'Drive, YouTube, Jockey', writes: 'cc_episodes, cc_items, vault synthesis, Slack', status: 'ready' },
  { name: 'youtube-pulse', schedule: 'Daily 6am PT', does: 'Channel and per-episode views, subscribers, retention.', reads: 'YouTube API', writes: 'cc_episodes, dashboard', status: 'blocked' },
  { name: 'paid-pacing', schedule: 'Daily 6am PT', does: 'Meta + TikTok + Google spend vs plan; flag over/under pace.', reads: 'Meta, TikTok, Google Ads', writes: 'cc_spend_log, cc_campaign_budget, Slack', status: 'blocked' },
  { name: 'swrm-sync', schedule: 'Daily 6am PT', does: 'Engagement volume and sentiment.', reads: 'SWRM', writes: 'cc_engagement, dashboard', status: 'blocked' },
  { name: 'clip-tracker', schedule: 'Daily 7am PT', does: 'Clip output, views, cost/1K across platforms.', reads: 'Clip tracker / PayPerClip', writes: 'cc_clips, dashboard, Slack', status: 'blocked' },
  { name: 'fanpage-monitor', schedule: 'Daily 7am PT', does: 'Fan pages + official accounts → ingest top 5 EKATOR clips into brain, bind engagement.', reads: 'TokScript, yt-dlp, Supabase, Jockey', writes: 'cc_items, cc_performance, cc_monitored_handles, Slack', status: 'ready' },
  { name: 'viral-radar', schedule: 'Daily 8am PT', does: 'Breakout detection; surface discretionary boosts and trending member.', reads: 'TokScript, Sandcastles', writes: 'Slack, dashboard radar, cc_discretionary proposed', status: 'ready' },
  { name: 'creative-brain-refresh', schedule: 'Wed 9am PT', does: 'Re-query per-member hooks and competitor comparison.', reads: 'Jockey, Sandcastles', writes: 'cc_responses, dashboard brain panel', status: 'ready' },
  { name: 'milestone-watch', schedule: 'Mon 9am PT', does: 'Track Plus Chat, Season 2, street stages, debut beats.', reads: 'cc_milestones', writes: 'cc_milestones, Slack', status: 'ready' },
  { name: 'weekly-rollup', schedule: 'Fri 8am PT', does: 'Synthesize spend, views, clips, engagement, what popped, and next discretionary recommendation.', reads: 'All registry tables', writes: 'Slack, vault working note, dashboard snapshot', status: 'ready' },
  { name: 'vault-sync', schedule: 'Daily 10am PT', does: 'Push registry state and weekly findings into Master Brain.', reads: 'Supabase', writes: 'Master Brain EKATOR project + entity', status: 'ready' },
];

const milestones = [
  { date: 'Now', label: 'EP1 / EP2 live', detail: 'Begin episode-to-clip operating loop.' },
  { date: 'Aug', label: 'Plus Chat opens', detail: 'First owned-audience conversion layer.' },
  { date: 'Sep', label: 'Season 2 films LA + Toronto', detail: 'Western geography becomes story fuel.' },
  { date: 'Oct', label: 'Street stages', detail: 'Offline proof; capture crowd reaction into clip loops.' },
  { date: 'Nov–Dec', label: 'Debut promotion', detail: 'Turn awareness into committed fandom and retargeting pools.' },
  { date: 'Q1 2027', label: 'Debut target', detail: 'Warm global audience hands into music release.' },
];

const openItems = [
  'Which Brian entity signs and pays the $50K SOW.',
  'Connector auth for Meta, TikTok, Google Ads, SWRM, clip tracker, and YouTube API.',
  'Resolve five account-less IG reels from the SNS VIRAL tab and add posters to monitored handles.',
  'Prune duplicate Jockey items from the TwelveLabs dashboard when available.',
  'Confirm whether amplification starts now on EP1–EP2 or waits for a later beat; US-first vs adding SEA.',
];

const dashboardPlan = [
  'Deploy v1 as a bespoke Crowd Control command center — not a generic campaign-planner page.',
  'Seed the page with Master Spec static truth: budget, roster, documentary schedule, brain state, connectors, crons, and open decisions.',
  'Add the campaign-ops Supabase tables so every workstream writes into one client-scoped registry.',
  'Point the dashboard at a generated JSON / Supabase read layer once connector auths are available.',
  'Stand up Hermes cron jobs one by one, starting with episode-watch, fanpage-monitor, viral-radar, creative-brain-refresh, weekly-rollup, and vault-sync because those have the most available data today.',
];

function useInView(options: { threshold?: number; rootMargin?: string; once?: boolean } = {}) {
  const { threshold = 0.12, rootMargin = '-80px', once = true } = options;
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const stagger = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};

function toneColor(tone: Tone) {
  if (tone === 'live') return '#22C55E';
  if (tone === 'ready') return red;
  if (tone === 'blocked') return '#F59E0B';
  if (tone === 'watch') return '#E4E4E9';
  return '#71717A';
}

function toneLabel(tone: Tone) {
  if (tone === 'live') return 'Live';
  if (tone === 'ready') return 'Ready';
  if (tone === 'blocked') return 'Needs auth';
  if (tone === 'watch') return 'Watch';
  return 'Pending';
}

function money(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function Badge({ children, tone = red }: { children: ReactNode; tone?: string }) {
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: tone, backgroundColor: `${tone}18`, border: `1px solid ${tone}35` }}>
      {children}
    </span>
  );
}

function Status({ tone }: { tone: Tone }) {
  return <Badge tone={toneColor(tone)}>{toneLabel(tone)}</Badge>;
}

function GlassCard({ children, className = '', glow = false }: { children: ReactNode; className?: string; glow?: boolean }) {
  return (
    <motion.div variants={fadeUp} className={`relative overflow-hidden rounded-2xl border border-[#303030] bg-gradient-to-br from-[#1A1A1A]/92 to-[#111111]/74 ${glow ? 'shadow-2xl shadow-[#FD3737]/10 ring-1 ring-[#FD3737]/20' : ''} ${className}`}>
      {children}
    </motion.div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return <motion.div className="fixed left-0 right-0 top-0 z-[70] h-[3px] origin-left bg-[#FD3737]" style={{ scaleX }} />;
}

function Section({ id, number, title, subtitle, children }: { id: string; number: string; title: string; subtitle?: string; children: ReactNode }) {
  const { ref } = useInView();
  return (
    <section id={id} className="scroll-mt-20 px-6 py-16 md:px-10 md:py-24">
      <motion.div ref={ref} initial="visible" animate="visible" variants={stagger} className="mx-auto max-w-7xl">
        <motion.div variants={fadeUp} className="mb-9 md:mb-12">
          <span className="font-display text-xs uppercase tracking-[0.35em] text-[#FD3737]">{number}</span>
          <h2 className="font-display mt-3 max-w-5xl text-4xl leading-[0.95] tracking-tight text-[#FAFAFA] md:text-6xl">{title}</h2>
          {subtitle && <p className="mt-5 max-w-4xl text-base leading-relaxed text-[#E4E4E9] md:text-lg">{subtitle}</p>}
        </motion.div>
        {children}
      </motion.div>
    </section>
  );
}

function Bar({ value, max, color = red }: { value: number; max: number; color?: string }) {
  const pct = Math.max(0, Math.min(100, max ? (value / max) * 100 : 0));
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#262626]">
      <motion.div className="h-full rounded-full" style={{ backgroundColor: color }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} />
    </div>
  );
}

function BudgetDonut() {
  const media = workstreams.filter((w) => !w.name.includes('Ops'));
  const stops: string[] = [];
  let cursor = 0;
  const palette = [red, '#D42D2D', '#A1A1AA', '#71717A', '#4B5563'];
  media.forEach((line, index) => {
    const share = (line.budget / budgetTotal) * 100;
    const next = cursor + share;
    stops.push(`${palette[index % palette.length]} ${cursor}% ${next}%`);
    cursor = next;
  });
  stops.push(`#333333 ${cursor}% 100%`);

  return (
    <div className="grid gap-7 lg:grid-cols-[300px_1fr] lg:items-center">
      <div className="mx-auto">
        <div className="relative h-[280px] w-[280px] rounded-full shadow-2xl shadow-[#FD3737]/10" style={{ background: `conic-gradient(${stops.join(', ')})` }}>
          <div className="absolute inset-[17%] rounded-full border border-[#333333] bg-[#0F0F0F] shadow-inner shadow-black" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B8B8C0]">Total</div>
            <div className="font-display mt-2 text-5xl text-[#FAFAFA]">$50K</div>
            <div className="mt-1 text-xs text-[#B8B8C0]">campaign</div>
          </div>
        </div>
      </div>
      <div className="grid gap-3">
        {workstreams.map((line, index) => (
          <div key={line.name} className="rounded-xl border border-[#303030] bg-[#0C0C0C]/70 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: index < 5 ? palette[index] : '#333333' }} />
                <span className="font-semibold text-[#FAFAFA]">{line.name}</span>
              </div>
              <span className="font-display text-xl text-[#FD3737]">{money(line.budget)}</span>
            </div>
            <Bar value={line.spent} max={line.budget} color={toneColor(line.status)} />
            <div className="mt-2 flex justify-between text-xs text-[#B8B8C0]"><span>Spent {money(line.spent)}</span><span>Remaining {money(line.budget - line.spent)}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CountdownTile() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const target = new Date('2027-01-01T00:00:00-08:00').getTime();
      const now = Date.now();
      setDays(Math.max(0, Math.ceil((target - now) / 86_400_000)));
    };
    update();
    const timer = window.setInterval(update, 3_600_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <GlassCard className="p-5 md:p-6" glow>
      <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#B8B8C0]">Countdown to Q1 2027</div>
      <div className="font-display mt-3 text-4xl text-[#FD3737] md:text-5xl">{days ?? '—'} days</div>
      <p className="mt-2 text-sm leading-snug text-[#B8B8C0]">Date anchor: Jan 1, 2027. Update milestone once WONDER locks debut week.</p>
    </GlassCard>
  );
}

function PulseCard({ tile }: { tile: PulseTile }) {
  return (
    <GlassCard className="p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3"><div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B8B8C0]">{tile.label}</div><span className="h-2 w-2 rounded-full" style={{ backgroundColor: toneColor(tile.tone) }} /></div>
      <div className="font-display text-3xl leading-none text-[#FAFAFA] md:text-4xl">{tile.value}</div>
      <p className="mt-3 text-sm leading-snug text-[#B8B8C0]">{tile.note}</p>
    </GlassCard>
  );
}

function WorkstreamCard({ stream }: { stream: Workstream }) {
  return (
    <GlassCard className="p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl text-[#FAFAFA]">{stream.name}</h3>
          <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#B8B8C0]">{money(stream.budget)} allocated</div>
        </div>
        <Status tone={stream.status} />
      </div>
      <p className="text-sm leading-relaxed text-[#E4E4E9]">{stream.objective}</p>
      <div className="my-5"><Bar value={stream.spent} max={stream.budget} color={toneColor(stream.status)} /></div>
      <div className="grid gap-4 text-sm md:grid-cols-2">
        <div><div className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#B8B8C0]">KPIs</div><p className="leading-relaxed text-[#E4E4E9]">{stream.kpis}</p></div>
        <div><div className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#B8B8C0]">Latest</div><p className="leading-relaxed text-[#E4E4E9]">{stream.latest}</p></div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {stream.connectors.map((connector) => <Badge key={connector} tone="#E4E4E9">{connector}</Badge>)}
        {stream.cron.map((cron) => <Badge key={cron}>{cron}</Badge>)}
      </div>
    </GlassCard>
  );
}

export function EkatorCommandCenter() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const glowX = useSpring(mouseX, { stiffness: 55, damping: 22 });
  const glowY = useSpring(mouseY, { stiffness: 55, damping: 22 });

  const nav = useMemo(() => [
    ['pulse', 'Pulse'], ['budget', 'Budget'], ['workstreams', 'Workstreams'], ['brain', 'Brain'], ['crons', 'Crons'], ['plan', 'Plan'],
  ], []);

  useEffect(() => {
    const move = (event: MouseEvent) => { mouseX.set(event.clientX); mouseY.set(event.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0A0A0A] text-[#FAFAFA]">
      <ScrollProgress />
      <motion.div aria-hidden className="pointer-events-none fixed z-0 h-[480px] w-[480px] rounded-full bg-[#FD3737]/10 blur-[135px]" style={{ left: glowX, top: glowY, x: '-50%', y: '-50%' }} />

      <nav className="fixed left-0 right-0 top-[3px] z-50 border-b border-[#303030]/70 bg-[#0A0A0A]/78 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control" className="h-5 w-auto opacity-90" />
          <div className="hidden items-center gap-6 lg:flex">
            {nav.map(([id, label]) => <a key={id} href={`#${id}`} className="text-[11px] uppercase tracking-[0.22em] text-[#B8B8C0] transition-colors hover:text-[#FD3737]">{label}</a>)}
          </div>
          <Badge>Internal command center</Badge>
        </div>
      </nav>

      <header ref={heroRef} className="relative min-h-screen overflow-hidden pt-16">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ekator/hero.png" alt="" className="h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/62 to-[#0A0A0A]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/92 via-[#0A0A0A]/50 to-transparent" />
        </motion.div>
        <motion.div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-12 md:px-10 md:pb-16" style={{ opacity: heroOpacity }}>
          <div className="mb-5 flex flex-wrap gap-3">
            <Badge>EKATOR</Badge><Badge tone="#E4E4E9">WONDER / Brian Kim</Badge><Badge tone="#E4E4E9">Budget $50K</Badge><Badge tone="#E4E4E9">Debut Q1 2027</Badge>
          </div>
          <h1 className="font-display max-w-6xl text-6xl leading-[0.88] tracking-tight text-[#FAFAFA] md:text-8xl lg:text-9xl">EKATOR <span className="block text-[#FD3737]">COMMAND CENTER</span></h1>
          <p className="mt-7 max-w-4xl text-lg leading-relaxed text-[#E4E4E9] md:text-xl">Always-on operating system for the pre-debut campaign: watch episodes and fan pages, understand with the creative brain, produce clips, amplify with paid and SWRM, measure, react with discretionary spend, and report through dashboard + Slack.</p>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <CountdownTile />
            <PulseCard tile={{ label: 'Loop', value: 'Watch → React', note: 'Episodes + fan pages into brain, clips, spend, SWRM, reporting.', tone: 'live' }} />
            <PulseCard tile={{ label: 'Data layer', value: 'Registry', note: 'Supabase is the single source of truth for every job.', tone: 'live' }} />
            <PulseCard tile={{ label: 'Brain layer', value: 'Jockey', note: 'TwelveLabs store powers grounded clip-hook queries.', tone: 'live' }} />
          </div>
        </motion.div>
      </header>

      <Section id="pulse" number="01" title="Live campaign pulse" subtitle="Top-line readout for the operating system. Some tiles are live from built infrastructure; paid, SWRM, clip tracker, and YouTube Ads move from blocked to live once connector auth is provided.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pulseTiles.map((tile) => <PulseCard key={tile.label} tile={tile} />)}
        </div>
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="budget" number="02" title="Budget tracker" subtitle="The $50K campaign separates working budget from Crowd Control ops. Spent values are zero until connector auths are live; the bars are ready for Supabase-backed pacing.">
        <GlassCard className="p-6 md:p-8" glow>
          <BudgetDonut />
        </GlassCard>
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="workstreams" number="03" title="Workstream command board" subtitle="Every paid/creative workstream has an objective, budget, connector, cron, and latest operating flag.">
        <div className="grid gap-5 lg:grid-cols-2">
          {workstreams.map((stream) => <WorkstreamCard key={stream.name} stream={stream} />)}
        </div>
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="documentary" number="04" title="Documentary tracker" subtitle="Season 1 is the campaign engine. Every episode becomes a transcript, timestamp sheet, brain pass, clipping queue, paid/SWRM decision, and Slack digest.">
        <div className="grid gap-3">
          {episodes.map((episode) => (
            <GlassCard key={episode.ep} className="p-5">
              <div className="grid gap-4 md:grid-cols-[0.5fr_1.1fr_0.6fr_0.6fr_1.4fr_0.45fr] md:items-center">
                <div className="font-display text-2xl text-[#FD3737]">{episode.ep}</div>
                <div><div className="font-semibold text-[#FAFAFA]">{episode.title}</div><div className="text-xs text-[#B8B8C0]">Mondays · 7PM KST · ~40 min</div></div>
                <div className="text-sm text-[#E4E4E9]">Views: <span className="font-semibold text-[#FAFAFA]">{episode.views}</span></div>
                <div className="text-sm text-[#E4E4E9]">Clips: <span className="font-semibold text-[#FAFAFA]">{episode.clips}</span></div>
                <div className="text-sm leading-relaxed text-[#E4E4E9]">{episode.action}</div>
                <div className="md:text-right"><Status tone={episode.status} /></div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="roster" number="05" title="Roster + clip hooks" subtitle="Breakout order from the creative brain and Korean viral tracker: Matthew, Cai Jinxin, Oh Juni. The dashboard should keep clipping, paid, and SWRM aligned to that hierarchy unless live data says otherwise.">
        <div className="grid gap-4 lg:grid-cols-3">
          {members.map((member) => (
            <GlassCard key={member.name} className="p-6" glow={member.priority === 'Breakout'}>
              <div className="mb-5 flex items-start justify-between gap-4"><div><h3 className="font-display text-3xl text-[#FAFAFA]">{member.name}</h3><p className="mt-1 text-sm text-[#B8B8C0]">{member.born} · {member.origin}</p></div><Badge tone={member.priority === 'Breakout' ? red : member.priority === 'Sensitive' ? '#F59E0B' : '#E4E4E9'}>{member.priority}</Badge></div>
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B8B8C0]">{member.position}</div>
              <p className="mt-3 text-sm leading-relaxed text-[#E4E4E9]">{member.hook}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="brain" number="06" title="Creative brain + viral radar" subtitle="The brain says which member and which moment to cut; fan-page monitoring says what is already converting; the clip tracker measures whether the $10K clipping line is earning out.">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard className="p-7" glow>
            <div className="mb-5 flex flex-wrap items-center gap-3"><Badge>Built</Badge><Badge tone="#E4E4E9">EP1 + 15 clips</Badge><Badge tone="#E4E4E9">yt-dlp → cc-media → Jockey</Badge></div>
            <h3 className="font-display text-3xl text-[#FAFAFA]">Brain layer is the creative operating system.</h3>
            <p className="mt-4 text-sm leading-relaxed text-[#E4E4E9]">TwelveLabs Jockey stores the documentary and social clips, answers grounded clip-hook questions, and logs resumable analysis threads back to the registry. Competitors such as WAYF can be added to compare how documentary-led pre-debut groups convert story into fandom.</p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {['Per-member clip hooks', 'Fan-page ingest feed', 'Competitor comparison'].map((item) => <div key={item} className="rounded-xl border border-[#303030] bg-[#0C0C0C]/70 p-4 text-sm text-[#E4E4E9]">{item}</div>)}
            </div>
          </GlassCard>
          <GlassCard className="p-7">
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FD3737]">Radar priorities</div>
            <div className="mt-5 space-y-4">
              {[['Matthew', 'leader/twin/charm clips'], ['Cai Jinxin', 'redemption/origin clips'], ['Oh Juni', 'fear-of-failure confessional'], ['Fan pages', 'top 5 daily ingest'], ['Discretionary', '$6K boost only with evidence']].map(([label, detail]) => (
                <div key={label} className="flex items-start gap-4 border-t border-[#303030] pt-4 first:border-t-0 first:pt-0"><div className="font-display min-w-[112px] text-xl text-[#FD3737]">{label}</div><p className="text-sm leading-relaxed text-[#E4E4E9]">{detail}</p></div>
              ))}
            </div>
          </GlassCard>
        </div>
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="connectors" number="07" title="Connector readiness" subtitle="The dashboard is a thin read layer. These connectors decide which tiles are live and which stay in honest pending mode.">
        <div className="grid gap-3">
          {connectors.map((connector) => (
            <GlassCard key={connector.name} className="p-5">
              <div className="grid gap-4 md:grid-cols-[0.7fr_1.3fr_0.7fr_1.2fr_0.45fr] md:items-start">
                <div className="font-display text-xl text-[#FAFAFA]">{connector.name}</div>
                <div className="text-sm leading-relaxed text-[#E4E4E9]">{connector.purpose}</div>
                <div className="text-sm text-[#B8B8C0]">{connector.workstream}</div>
                <div className="text-sm leading-relaxed text-[#E4E4E9]">{connector.usedBy}</div>
                <div className="md:text-right"><Status tone={connector.status} /></div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="crons" number="08" title="Hermes cron map" subtitle="Every job reads/writes the registry and drops a Slack line. Guardrails: dedupe, top-N enrichment caps, graceful skip on connector failure, never fabricate metrics, never re-ingest a ready item.">
        <div className="grid gap-3">
          {cronJobs.map((job) => (
            <GlassCard key={job.name} className="p-5">
              <div className="grid gap-4 md:grid-cols-[0.65fr_0.55fr_1.4fr_0.85fr_1fr_0.45fr] md:items-start">
                <div className="font-display text-lg text-[#FAFAFA]">{job.name}</div>
                <div className="text-sm text-[#B8B8C0]">{job.schedule}</div>
                <div className="text-sm leading-relaxed text-[#E4E4E9]">{job.does}</div>
                <div className="text-xs leading-relaxed text-[#B8B8C0]"><span className="text-[#FD3737]">Reads:</span> {job.reads}</div>
                <div className="text-xs leading-relaxed text-[#B8B8C0]"><span className="text-[#FD3737]">Writes:</span> {job.writes}</div>
                <div className="md:text-right"><Status tone={job.status} /></div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#303030] to-transparent" />

      <Section id="plan" number="09" title="Deployment plan + open flags" subtitle="This is the rollout sequence from static v1 into a live Supabase/Hermes-backed command center.">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <GlassCard className="p-7" glow>
            <h3 className="font-display text-3xl text-[#FAFAFA]">Build sequence</h3>
            <ol className="mt-6 space-y-4">
              {dashboardPlan.map((step, index) => <li key={step} className="flex gap-4 text-sm leading-relaxed text-[#E4E4E9]"><span className="font-display text-2xl text-[#FD3737]">{String(index + 1).padStart(2, '0')}</span><span>{step}</span></li>)}
            </ol>
          </GlassCard>
          <GlassCard className="p-7">
            <h3 className="font-display text-3xl text-[#FAFAFA]">Milestone track</h3>
            <div className="mt-6 space-y-4">
              {milestones.map((beat) => <div key={beat.label} className="grid grid-cols-[92px_1fr] gap-4 border-t border-[#303030] pt-4 first:border-t-0 first:pt-0"><div className="font-display text-xl text-[#FD3737]">{beat.date}</div><div><div className="font-display text-lg text-[#FAFAFA]">{beat.label}</div><p className="mt-1 text-sm leading-relaxed text-[#B8B8C0]">{beat.detail}</p></div></div>)}
            </div>
          </GlassCard>
        </div>
        <GlassCard className="mt-6 p-7">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FD3737]">Open items / decisions</div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {openItems.map((item) => <div key={item} className="rounded-xl border border-[#303030] bg-[#0C0C0C]/70 p-4 text-sm leading-relaxed text-[#E4E4E9]">{item}</div>)}
          </div>
        </GlassCard>
      </Section>

      <footer className="relative px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl text-center">
          <div className="font-display text-3xl text-[#FAFAFA] md:text-5xl">EKATOR <span className="text-[#FD3737]">×</span> Crowd Control</div>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-[#B8B8C0]">Internal v1 command center built from the July 8, 2026 Master Spec: WONDER / Brian Kim, GRID documentary engine, Supabase registry, TwelveLabs brain, Hermes cron orchestration, and Crowd Control international amplification layer.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control" className="mx-auto mt-8 h-6 w-auto opacity-80" />
          <p className="mt-4 text-xs text-[#71717A]">Crowd Control · info@crowdcontroldigital.com</p>
        </div>
      </footer>
    </main>
  );
}

export default EkatorCommandCenter;
