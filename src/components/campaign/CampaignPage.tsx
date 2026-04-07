'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Image from 'next/image';
import { CampaignData } from '@/lib/types/campaign';

/* ─── animation variants ─── */
const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

/* ─── section wrapper ─── */
function Section({
  id,
  number,
  title,
  subtitle,
  children,
  className = '',
  noPadding = false,
}: {
  id?: string;
  number: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={stagger}
      className={`${noPadding ? '' : 'py-24 md:py-32 px-6 md:px-10 lg:px-16'} max-w-[1400px] mx-auto ${className}`}
    >
      <motion.div variants={fadeUp} className="mb-14">
        <span className="font-display text-[#fd3737] text-xs tracking-[0.35em] uppercase font-bold">
          {number}
        </span>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight mt-3 text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[#a1a1aa] text-lg md:text-xl mt-4 max-w-3xl leading-relaxed font-light">
            {subtitle}
          </p>
        )}
      </motion.div>
      {children}
    </motion.section>
  );
}

/* ─── glass card ─── */
function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-[#1a1a1a]/90 to-[#141414]/70
        border border-[#333333]/50
        backdrop-blur-sm
        ${hover ? 'hover:border-[#fd3737]/30 hover:shadow-lg hover:shadow-[#fd3737]/5 hover:scale-[1.005] transition-all duration-500' : ''}
        ${glow ? 'shadow-lg shadow-[#fd3737]/5' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

/* ─── stat block ─── */
function StatBlock({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.25em] uppercase text-[#71717a] font-semibold mb-2">{label}</div>
      <div className="font-display text-4xl md:text-5xl text-white tracking-tight">{value}</div>
      {sub && <div className="text-[#71717a] text-sm mt-1 font-light">{sub}</div>}
    </div>
  );
}

/* ─── badge ─── */
function Badge({ children, color = '#fd3737' }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide uppercase"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {children}
    </span>
  );
}

/* ─── custom donut tooltip ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg px-4 py-2 shadow-xl">
      <p className="text-white text-sm font-semibold">{payload[0].name}</p>
      <p className="text-[#a1a1aa] text-xs">{payload[0].value}%</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export function CampaignPage({ campaign }: { campaign: CampaignData }) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(0);

  const platformData = campaign.social.map((s) => ({
    name: s.platform,
    value: s.followers,
    color: s.color,
  }));

  const channelAllocationData = [
    { name: 'Organic Social', value: 40, color: '#FD3737' },
    { name: 'Creator Seeding', value: 30, color: '#D42D2D' },
    { name: 'Paid Social', value: 25, color: '#A1A1AA' },
    { name: 'Experiential', value: 5, color: '#71717A' },
  ];

  const creatorTierData = [
    { name: 'Mega (5M+)', value: 10, color: '#FD3737' },
    { name: 'Macro (500K–5M)', value: 30, color: '#D42D2D' },
    { name: 'Micro (50K–500K)', value: 40, color: '#A1A1AA' },
    { name: 'Nano (<50K)', value: 20, color: '#71717A' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* ═══ NAVIGATION ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#333333]/30">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 h-16 flex items-center justify-between">
          <Image src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control Digital" width={140} height={28} className="opacity-90 hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-6">
            <span className="hidden md:block text-[11px] tracking-[0.2em] uppercase text-[#71717a] font-semibold">Campaign Planner</span>
            <div className="h-4 w-px bg-[#333333] hidden md:block" />
            <Badge color="#e040fb">{campaign.genre}</Badge>
          </div>
        </div>
      </nav>

      {/* ═══ 01 — HERO ═══ */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative min-h-screen flex items-end overflow-hidden pt-16"
      >
        {/* hero image */}
        <div className="absolute inset-0">
          <Image
            src={`/images/${campaign.slug || 'tyla-carwash'}/hero.png`}
            alt=""
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 to-transparent" />
        </div>

        {/* accent glow */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#fd3737]/8 rounded-full blur-[180px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 pb-20 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Badge color="#e040fb">{campaign.genre}</Badge>
              <Badge>{campaign.tier}</Badge>
              <Badge color="#a1a1aa">{campaign.releaseDate}</Badge>
            </div>

            <h1 className="font-display text-7xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-tighter text-white mb-4">
              {campaign.artist}
            </h1>
            <h2 className="font-display text-4xl md:text-5xl lg:text-7xl text-[#fd3737] tracking-tight leading-none mb-10">
              {campaign.song}
            </h2>

            <div className="flex flex-wrap items-center gap-8 text-sm">
              <div>
                <span className="text-[#71717a] text-[10px] tracking-[0.25em] uppercase block mb-1">Campaign Window</span>
                <span className="text-[#a1a1aa] font-light">{campaign.campaignWindow.start} — {campaign.campaignWindow.end}</span>
              </div>
              <div className="h-8 w-px bg-[#333333]" />
              <div>
                <span className="text-[#71717a] text-[10px] tracking-[0.25em] uppercase block mb-1">Release Date</span>
                <span className="text-[#a1a1aa] font-light">{campaign.releaseDate}</span>
              </div>
              <div className="h-8 w-px bg-[#333333]" />
              <div>
                <span className="text-[#71717a] text-[10px] tracking-[0.25em] uppercase block mb-1">Prepared By</span>
                <span className="text-[#a1a1aa] font-light">Crowd Control Digital</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#71717a]">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#71717a] to-transparent" />
        </motion.div>
      </motion.section>

      {/* ═══ 02 — ARTIST POSITION ═══ */}
      <Section number="02" title="Artist Position" subtitle="Current platform metrics and audience intelligence from Chartmetric.">
        {/* hero stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <GlassCard className="p-8">
            <StatBlock label="Spotify Monthly Listeners" value={`${campaign.chartmetrics.spotifyMonthlyListeners}M`} sub="-3.12M — stabilizing after growth" />
          </GlassCard>
          <GlassCard className="p-8">
            <StatBlock label="Popularity Score" value={`${campaign.chartmetrics.popularityScore}`} sub="Out of 100 — Superstar tier" />
          </GlassCard>
          <GlassCard className="p-8">
            <StatBlock label="Primary Audience" value={`${campaign.demographics.primaryAge}`} sub={`${campaign.demographics.primaryAgePercent}% of total listeners`} />
          </GlassCard>
          <GlassCard className="p-8">
            <StatBlock label="Gender Split" value={`${campaign.demographics.femalePercent}% F`} sub={`${campaign.demographics.malePercent}% Male`} />
          </GlassCard>
        </div>

        {/* platform + social grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
          {/* donut chart */}
          <GlassCard className="lg:col-span-2 p-8" hover={false}>
            <h3 className="font-display text-lg text-white mb-6">Platform Breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {platformData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-3">
              {platformData.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#a1a1aa]">{item.name}</span>
                  </span>
                  <span className="font-semibold text-white">{item.value}M</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* social cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {campaign.social.map((platform, i) => (
              <GlassCard key={i} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${platform.color}20` }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} />
                  </div>
                  <span className="text-[10px] tracking-wider uppercase font-semibold" style={{ color: platform.color }}>
                    +{platform.growthPercent}%
                  </span>
                </div>
                <div className="font-display text-2xl text-white mb-1">{platform.followers}M</div>
                <div className="text-[#71717a] text-xs">{platform.platform} followers</div>
                <div className="mt-3 pt-3 border-t border-[#333333]/50 text-xs text-[#a1a1aa]">
                  +{platform.monthlyGrowth}K/month growth
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* markets + demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-white mb-8">Top Markets</h3>
            <div className="space-y-5">
              {campaign.markets.map((market, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-[#a1a1aa] font-light">{market.country}</span>
                    <span className="text-white font-semibold">{market.percent}%</span>
                  </div>
                  <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(market.percent * 3, 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-[#fd3737] to-[#fd3737]/60"
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-white mb-8">Demographics</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#71717a] mb-3">Gender Split</div>
                <div className="flex items-end gap-4">
                  <div>
                    <div className="font-display text-3xl text-white">{campaign.demographics.femalePercent}%</div>
                    <div className="text-[#71717a] text-xs mt-1">Female</div>
                  </div>
                  <div className="h-12 w-px bg-[#333333]" />
                  <div>
                    <div className="font-display text-3xl text-[#a1a1aa]">{campaign.demographics.malePercent}%</div>
                    <div className="text-[#71717a] text-xs mt-1">Male</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#71717a] mb-3">Primary Age</div>
                <div className="font-display text-3xl text-white">{campaign.demographics.primaryAge}</div>
                <div className="text-[#71717a] text-xs mt-1">{campaign.demographics.primaryAgePercent}% of audience</div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#333333]/50">
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#71717a] mb-3">Ethnicity Breakdown</div>
              <div className="space-y-3">
                {campaign.demographics.ethnicity.map((eth, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-[#a1a1aa]">{eth.label}</span>
                    <span className="font-semibold text-white">{eth.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </Section>

      {/* ═══ 03 — GENRE LANDSCAPE ═══ */}
      <Section number="03" title="Genre Landscape" subtitle="What's working in Pop right now — tactics, trends, and recent wins.">
        {/* summary callout */}
        <GlassCard className="p-10 mb-12 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <p className="text-lg md:text-xl leading-relaxed text-[#a1a1aa] font-light">
            Pop in 2026 is experiencing a chart slump — new releases struggling against catalog. Winning campaigns are
            building narrative worlds, batching 20–30 short-form videos per song, and leading with IRL activations.
            Tyla&apos;s Afrobeats-Pop crossover and dance challenge DNA position her to cut through the noise.
          </p>
        </GlassCard>

        {/* tactics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {[
            { title: 'World-Building Narratives', desc: 'Create immersive visual/conceptual universes around releases — proven by Sabrina Carpenter, Charli XCX', icon: '◈' },
            { title: 'Video Batching (20–30 per song)', desc: 'Flood short-form platforms with variant content; volume drives algorithmic surface area', icon: '◈' },
            { title: 'Tiered Creator Seeding', desc: 'Mega → Macro → Micro → Nano cascade for organic reach amplification', icon: '◈' },
            { title: 'Dance Challenge Choreography', desc: 'Structured challenges that drive community participation and UGC velocity', icon: '◈' },
          ].map((tactic, i) => (
            <GlassCard key={i} className="p-8 group">
              <div className="flex items-start gap-4">
                <span className="text-[#fd3737] text-lg mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">{tactic.icon}</span>
                <div>
                  <h4 className="font-display text-lg text-white mb-2">{tactic.title}</h4>
                  <p className="text-[#a1a1aa] text-sm font-light leading-relaxed">{tactic.desc}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* current trends */}
        <GlassCard className="p-8" hover={false}>
          <h3 className="font-display text-lg text-white mb-6">Active Trends</h3>
          <div className="flex flex-wrap gap-3">
            {['Phone-shot aesthetic', 'Behind-the-scenes studio content', 'Fan reaction compilations', 'Lo-fi lyric teasers', 'Day-in-the-life vlogs', 'Challenge tutorials', 'Collab mashups'].map((trend, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-[#262626]/80 text-[#a1a1aa] text-sm font-light border border-[#333333]/50 hover:border-[#fd3737]/30 hover:text-white transition-all duration-300">
                {trend}
              </span>
            ))}
          </div>
        </GlassCard>
      </Section>

      {/* ═══ 04 — COMPETITIVE CALENDAR ═══ */}
      <Section number="04" title="Competitive Calendar" subtitle="Release landscape around May 29 — identifying threats and opportunities.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {[
            { artist: 'Billy Joel', release: 'Live Album Collection', threat: 'low' },
            { artist: 'Shinedown', release: 'New Rock Single', threat: 'low' },
            { artist: 'The Who', release: 'Legacy Live Album', threat: 'low' },
            { artist: 'Alana Springsteen', release: 'Country Single', threat: 'low' },
          ].map((item, i) => (
            <GlassCard key={i} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 items-start">
                  <div className="w-1 h-12 rounded-full bg-gradient-to-b from-[#fd3737]/60 to-transparent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-display text-lg text-white">{item.artist}</div>
                    <div className="text-[#71717a] text-sm font-light mt-1">{item.release}</div>
                  </div>
                </div>
                <Badge color="#A1A1AA">Low</Badge>
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-8 border-l-2 border-l-[#A1A1AA]" glow hover={false}>
          <div className="flex gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-[#A1A1AA]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[#A1A1AA] text-xl">✓</span>
            </div>
            <div>
              <h4 className="font-display text-xl text-white mb-2">Clear Lane</h4>
              <p className="text-[#a1a1aa] font-light leading-relaxed">
                May 29 presents a wide-open window for Tyla to dominate the news cycle. No major pop releases competing
                for streaming share, playlist placement, or social conversation.
              </p>
            </div>
          </div>
        </GlassCard>
      </Section>

      {/* ═══ 05 — CAMPAIGN OVERVIEW ═══ */}
      <Section number="05" title="Campaign Overview" subtitle="Strategic architecture and phased approach.">
        {/* thesis callout */}
        <GlassCard className="p-10 mb-14 relative overflow-hidden" glow hover={false}>
          <div className="absolute top-0 left-0 w-1 h-full bg-[#fd3737]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#fd3737]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#fd3737] font-semibold">Campaign Thesis</span>
            <p className="text-xl md:text-2xl text-white font-light leading-relaxed mt-4">
              {campaign.thesis}
            </p>
          </div>
        </GlassCard>

        {/* phase timeline */}
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#fd3737] via-[#333333] to-transparent" />

          <div className="space-y-6">
            {campaign.phases.map((phase, i) => (
              <GlassCard key={i} className="ml-14 md:ml-20 p-8">
                {/* timeline dot */}
                <div className="absolute -left-[calc(3.5rem+5px)] md:-left-[calc(5rem+5px)] top-8 w-3 h-3 rounded-full bg-[#fd3737] ring-4 ring-[#0a0a0a]" style={{ position: 'relative', left: 0, top: 0, display: 'none' }} />
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-5">
                  <div className="flex items-center gap-4">
                    <span className="font-display text-3xl text-[#fd3737]/30">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="font-display text-xl text-white">{phase.name}</h3>
                  </div>
                  <span className="text-[#71717a] text-sm font-light whitespace-nowrap">{phase.dateRange}</span>
                </div>
                <div className="space-y-2 ml-[3.25rem]">
                  {phase.objectives.map((obj, j) => (
                    <div key={j} className="flex gap-3 text-[#a1a1aa] text-sm font-light">
                      <span className="text-[#fd3737]/60 mt-0.5 flex-shrink-0">—</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ 06 — WEEK-BY-WEEK PLAYBOOK ═══ */}
      <div className="relative">
        {/* full-width accent band */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fd3737]/[0.03] to-transparent pointer-events-none" />

        <Section number="06" title="Week-by-Week Playbook" subtitle="Tactical breakdown of every week's campaign activities, creator actions, and success signals.">
          {/* strategy image */}
          <GlassCard className="mb-14 overflow-hidden" hover={false}>
            <div className="relative h-48 md:h-64">
              <Image
                src={`/images/${campaign.slug || 'tyla-carwash'}/strategy.png`}
                alt="Campaign Strategy"
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
              <div className="absolute inset-0 flex items-center px-10">
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#fd3737] font-semibold">Core Deliverable</span>
                  <h3 className="font-display text-3xl md:text-4xl text-white mt-2">Production Calendar</h3>
                  <p className="text-[#a1a1aa] text-sm font-light mt-2 max-w-lg">Every week mapped with specific actions, platforms, formats, and success signals.</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* weeks */}
          <div className="space-y-3">
            {campaign.weeklyPlaybook.map((week, idx) => (
              <motion.div key={idx} variants={fadeUp}>
                <div
                  className={`
                    rounded-2xl overflow-hidden transition-all duration-500
                    ${expandedWeek === idx
                      ? 'bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-[#fd3737]/20 shadow-lg shadow-[#fd3737]/5'
                      : 'bg-gradient-to-br from-[#1a1a1a]/60 to-[#141414]/40 border border-[#333333]/30 hover:border-[#333333]/60'
                    }
                  `}
                >
                  <button
                    onClick={() => setExpandedWeek(expandedWeek === idx ? null : idx)}
                    className="w-full p-6 md:p-8 text-left flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-5">
                      <span className={`font-display text-2xl md:text-3xl transition-colors duration-300 ${expandedWeek === idx ? 'text-[#fd3737]' : 'text-[#333333]'}`}>
                        {week.week.replace('Week ', 'W')}
                      </span>
                      <div>
                        <h3 className="font-display text-lg md:text-xl text-white mb-1">{week.title}</h3>
                        <p className="text-[#71717a] text-sm font-light">{week.objective}</p>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${expandedWeek === idx ? 'bg-[#fd3737]/10 text-[#fd3737] rotate-45' : 'bg-[#262626] text-[#71717a]'}`}>
                      <span className="text-lg leading-none">+</span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedWeek === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-8 space-y-8 border-t border-[#333333]/30 pt-6">
                          {/* actions */}
                          <div>
                            <h4 className="text-[10px] tracking-[0.25em] uppercase text-[#fd3737] font-semibold mb-4">Actions</h4>
                            <div className="space-y-3">
                              {week.actions.map((action, j) => (
                                <div key={j} className="flex gap-4 items-start">
                                  <div className="w-5 h-5 rounded-full bg-[#71717A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-[#71717A] text-[10px]">✓</span>
                                  </div>
                                  <span className="text-[#a1a1aa] text-sm font-light leading-relaxed">{action}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* creator actions */}
                          {week.creatorActions && week.creatorActions.length > 0 && (
                            <div>
                              <h4 className="text-[10px] tracking-[0.25em] uppercase text-[#D42D2D] font-semibold mb-4">Creator Actions</h4>
                              <div className="space-y-3">
                                {week.creatorActions.map((action, j) => (
                                  <div key={j} className="flex gap-4 items-start">
                                    <div className="w-5 h-5 rounded-full bg-[#D42D2D]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-[#D42D2D] text-[10px]">★</span>
                                    </div>
                                    <span className="text-[#a1a1aa] text-sm font-light leading-relaxed">{action}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* success signals */}
                          <div>
                            <h4 className="text-[10px] tracking-[0.25em] uppercase text-[#A1A1AA] font-semibold mb-4">Success Signals</h4>
                            <div className="space-y-3">
                              {week.successSignals.map((signal, j) => (
                                <div key={j} className="flex gap-4 items-start">
                                  <div className="w-5 h-5 rounded-full bg-[#A1A1AA]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-[#A1A1AA] text-[10px]">▸</span>
                                  </div>
                                  <span className="text-[#a1a1aa] text-sm font-light leading-relaxed">{signal}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      </div>

      {/* ═══ 07 — CONTENT STRATEGY ═══ */}
      <Section number="07" title="Content Strategy" subtitle="Platform-specific content direction, posting cadence, and recurring pillars.">
        {/* content pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {campaign.contentStrategy.map((pillar, i) => (
            <GlassCard key={i} className="p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#fd3737]/40 to-transparent" />
              <span className="font-display text-4xl text-[#333333]/60">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-display text-xl text-white mt-3 mb-3">{pillar.pillar}</h3>
              <p className="text-[#a1a1aa] text-sm font-light leading-relaxed mb-5">{pillar.description}</p>
              <div className="flex flex-wrap gap-2">
                {pillar.platforms.map((p, j) => (
                  <span key={j} className="text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full bg-[#262626] text-[#71717a] border border-[#333333]/50">
                    {p}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* posting cadence */}
        <GlassCard className="overflow-hidden" hover={false}>
          <div className="p-8 pb-0">
            <h3 className="font-display text-lg text-white mb-6">Posting Cadence</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#333333]/50">
                  <th className="text-left py-4 px-8 text-[10px] tracking-[0.25em] uppercase text-[#71717a] font-semibold">Platform</th>
                  <th className="text-left py-4 px-8 text-[10px] tracking-[0.25em] uppercase text-[#71717a] font-semibold">Frequency</th>
                  <th className="text-left py-4 px-8 text-[10px] tracking-[0.25em] uppercase text-[#71717a] font-semibold">Content Types</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { platform: 'TikTok', frequency: '3–5x weekly', type: 'Challenge, BTS, Reactions', color: '#A1A1AA' },
                  { platform: 'Instagram', frequency: 'Daily Stories + 2x Reels/week', type: 'Aesthetic, Challenge, Reactions', color: '#D42D2D' },
                  { platform: 'YouTube', frequency: '1x weekly', type: 'BTS, Music Video, Long-form', color: '#FD3737' },
                  { platform: 'X', frequency: 'Real-time + 2x daily', type: 'Engagement, Updates', color: '#a1a1aa' },
                ].map((item, i) => (
                  <tr key={i} className="border-b border-[#333333]/20 hover:bg-[#1a1a1a]/50 transition-colors">
                    <td className="py-4 px-8">
                      <span className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold text-sm text-white">{item.platform}</span>
                      </span>
                    </td>
                    <td className="py-4 px-8 text-[#a1a1aa] text-sm font-light">{item.frequency}</td>
                    <td className="py-4 px-8 text-[#a1a1aa] text-sm font-light">{item.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </Section>

      {/* ═══ 08 — CREATOR SEEDING ═══ */}
      <Section number="08" title="Creator Seeding Plan" subtitle="Tiered creator strategy with allocation, outreach approach, and seeding timeline.">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
          {/* tier donut */}
          <GlassCard className="lg:col-span-2 p-8" hover={false}>
            <h3 className="font-display text-lg text-white mb-6">Tier Allocation</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={creatorTierData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {creatorTierData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-3">
              {creatorTierData.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#a1a1aa]">{item.name}</span>
                  </span>
                  <span className="font-semibold text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* tier cards */}
          <div className="lg:col-span-3 space-y-4">
            {[
              { tier: 'Mega Creators', count: '3–5', followers: '5M+', approach: 'Exclusive early access, official first-listen reactions, co-created content', color: '#fd3737' },
              { tier: 'Macro Creators', count: '15–20', followers: '500K–5M', approach: 'Challenge tutorial partnerships, featured on Tyla channels, sound exclusivity', color: '#D42D2D' },
              { tier: 'Micro Creators', count: '50–100', followers: '50K–500K', approach: 'Organic challenge participation, reposts, community seeding', color: '#A1A1AA' },
              { tier: 'Nano Creators', count: 'Open', followers: '<50K', approach: 'Community-driven, incentive-based challenges, user-generated content', color: '#71717A' },
            ].map((item, i) => (
              <GlassCard key={i} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-1 h-16 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-display text-lg text-white">{item.tier}</h4>
                      <div className="flex gap-3">
                        <Badge color={item.color}>{item.count} creators</Badge>
                        <Badge color="#71717a">{item.followers}</Badge>
                      </div>
                    </div>
                    <p className="text-[#a1a1aa] text-sm font-light">{item.approach}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* seeding timeline */}
        <GlassCard className="p-8" hover={false}>
          <h3 className="font-display text-lg text-white mb-8">Seeding Timeline</h3>
          <div className="space-y-6">
            {[
              { phase: 'W-3', action: 'Seed 5 macro creators with NDA mystery audio', color: '#fd3737' },
              { phase: 'W-2', action: '10 mid-tier creators get early access and choreography tutorial', color: '#D42D2D' },
              { phase: 'W-2', action: '3 mega creators post first-listen reactions', color: '#fd3737' },
              { phase: 'W-1', action: 'Release sound to 50+ micro creators', color: '#A1A1AA' },
              { phase: 'W0+', action: 'Activate nano tier and open challenge incentives', color: '#71717A' },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <span className="font-display text-lg min-w-[3rem] text-right" style={{ color: item.color }}>{item.phase}</span>
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[#a1a1aa] text-sm font-light">{item.action}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </Section>

      {/* ═══ 09 — CHANNEL ALLOCATION ═══ */}
      <Section number="09" title="Channel Allocation" subtitle="Strategic distribution of effort across campaign channels.">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* donut */}
          <GlassCard className="lg:col-span-2 p-8" hover={false}>
            <h3 className="font-display text-lg text-white mb-6">Effort Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={channelAllocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {channelAllocationData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-3">
              {channelAllocationData.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#a1a1aa]">{item.name}</span>
                  </span>
                  <span className="font-semibold text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* channel cards */}
          <div className="lg:col-span-3 space-y-4">
            {[
              { channel: 'Organic Social', percent: 40, rationale: 'Owned audience activation, contest seeding, UGC amplification — the foundation of all campaign momentum.', color: '#71717A' },
              { channel: 'Creator Seeding', percent: 30, rationale: 'Organic reach through trusted voices and challenge virality. Tiered approach maximizes authenticity and scale.', color: '#A1A1AA' },
              { channel: 'Paid Social', percent: 25, rationale: 'Amplify top-performing challenge content. Targeted reach in US, South Africa, and key growth markets.', color: '#D42D2D' },
              { channel: 'Experiential', percent: 5, rationale: 'IRL brand building, press coverage, TikTok-worthy moments at key events.', color: '#333333' },
            ].map((item, i) => (
              <GlassCard key={i} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-1 h-16 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-display text-lg text-white">{item.channel}</h4>
                      <span className="font-display text-2xl" style={{ color: item.color }}>{item.percent}%</span>
                    </div>
                    <p className="text-[#a1a1aa] text-sm font-light leading-relaxed">{item.rationale}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ 10 — SUCCESS METRICS ═══ */}
      <Section number="10" title="Success Metrics" subtitle="Phase-gated KPIs benchmarked against genre and tier norms.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              phase: 'Pre-Release',
              color: '#fd3737',
              metrics: ['200K+ pre-saves', '5%+ engagement rate', '100K+ challenge creates', '50M+ social impressions'],
            },
            {
              phase: 'Launch Week',
              color: '#A1A1AA',
              metrics: ['15M+ first-week streams', 'Top 20 Billboard Hot 100', '500K+ TikTok creates', '10M+ social impressions'],
            },
            {
              phase: 'Sustain (4 weeks)',
              color: '#71717A',
              metrics: ['80%+ streaming retention', '1M+ total challenge creates', 'Sustained playlist rotation', '2–3 weeks in top 40 Spotify'],
            },
          ].map((kpi, i) => (
            <GlassCard key={i} className="p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${kpi.color}40, transparent)` }} />
              <h3 className="font-display text-xl text-white mb-2">{kpi.phase}</h3>
              <div className="w-12 h-0.5 rounded-full mb-6" style={{ backgroundColor: kpi.color }} />
              <ul className="space-y-4">
                {kpi.metrics.map((metric, j) => (
                  <li key={j} className="flex gap-3 items-start text-sm">
                    <span className="mt-1 flex-shrink-0" style={{ color: kpi.color }}>◆</span>
                    <span className="text-[#a1a1aa] font-light">{metric}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* ═══ 11 — RISKS & CONTINGENCIES ═══ */}
      <Section number="11" title="Risks & Contingencies" subtitle="Scenario planning with trigger signals and response protocols.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaign.risks.map((risk, i) => (
            <GlassCard key={i} className="p-8">
              <h3 className="font-display text-lg text-white mb-6">{risk.title}</h3>

              <div className="flex gap-3 mb-6">
                <Badge color={risk.likelihood === 'High' ? '#FD3737' : risk.likelihood === 'Medium' ? '#333333' : '#A1A1AA'}>
                  {risk.likelihood} Likelihood
                </Badge>
                <Badge color={risk.impact === 'High' ? '#FD3737' : risk.impact === 'Medium' ? '#333333' : '#A1A1AA'}>
                  {risk.impact} Impact
                </Badge>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-[#71717a] font-semibold mb-2">Trigger Signal</div>
                  <p className="text-[#a1a1aa] text-sm font-light leading-relaxed">{risk.triggerSignal}</p>
                </div>
                <div className="pt-4 border-t border-[#333333]/50">
                  <div className="text-[10px] tracking-[0.25em] uppercase text-[#fd3737] font-semibold mb-2">Contingency</div>
                  <p className="text-[#a1a1aa] text-sm font-light leading-relaxed">{risk.contingency}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative overflow-hidden">
        {/* closing image */}
        <div className="relative h-64 md:h-80">
          <Image
            src={`/images/${campaign.slug || 'tyla-carwash'}/closing.png`}
            alt=""
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/30" />
        </div>

        <div className="relative -mt-32 z-10 pb-16">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.div variants={fadeUp}>
                <h2 className="font-display text-5xl md:text-6xl text-white mb-4">Campaign Ready</h2>
                <p className="text-[#a1a1aa] font-light text-lg max-w-xl mx-auto mb-12">
                  A data-driven, creator-first rollout built to capture the summer moment for Tyla&apos;s &quot;Carwash&quot;.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col items-center gap-6">
                <Image src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control Digital" width={160} height={32} className="opacity-60" />
                <div className="text-[#71717a] text-xs tracking-wider">
                  <span>info@crowdcontroldigital.com</span>
                  <span className="mx-3">·</span>
                  <span>Campaign intelligence, artist positioning &amp; music marketing</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}
