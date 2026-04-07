'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CampaignData } from '@/lib/types/campaign';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function CampaignPage({ campaign }: { campaign: CampaignData }) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const platformData = campaign.social.map((s) => ({
    name: s.platform,
    value: s.followers,
    color: s.color,
  }));

  const channelAllocationData = [
    { name: 'Organic Social', value: 40 },
    { name: 'Creator Seeding', value: 30 },
    { name: 'Paid Social', value: 25 },
    { name: 'Experiential', value: 5 },
  ];

  const channelColors = ['#1DB954', '#00f2ea', '#E1306C', '#FF0000'];

  const creatorTierData = [
    { name: 'Mega', value: 10 },
    { name: 'Macro', value: 30 },
    { name: 'Micro', value: 40 },
    { name: 'Nano', value: 20 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#fd3737]/10 via-transparent to-[#0a0a0a]" />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-8xl md:text-9xl font-bold tracking-tighter mb-4"
          >
            {campaign.artist}
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-6xl text-[#fd3737] font-bold mb-8"
          >
            {campaign.song}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center mb-8"
          >
            <div className="px-4 py-2 bg-[#e040fb]/20 border border-[#e040fb] rounded-full text-sm font-semibold">
              {campaign.genre}
            </div>
            <div className="px-4 py-2 bg-[#262626] border border-[#333333] rounded-full text-sm font-semibold">
              {campaign.releaseDate}
            </div>
            <div className="px-4 py-2 bg-[#262626] border border-[#333333] rounded-full text-sm font-semibold">
              {campaign.campaignWindow.start} - {campaign.campaignWindow.end}
            </div>
            <div className="px-4 py-2 bg-[#262626] border border-[#333333] rounded-full text-sm font-semibold">
              {campaign.tier}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ARTIST POSITION */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <span className="text-[#fd3737] text-sm font-bold">SECTION 02</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">Artist Position</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div variants={itemVariants} className="gradient-card p-8 rounded-2xl">
            <h3 className="text-sm font-semibold text-[#a1a1aa] mb-4">
              SPOTIFY MONTHLY LISTENERS
            </h3>
            <div className="text-5xl font-bold mb-2">
              {campaign.chartmetrics.spotifyMonthlyListeners}M
            </div>
            <div className="text-[#71717a] text-sm">
              (-3.12M stabilizing after growth)
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="gradient-card p-8 rounded-2xl">
            <h3 className="text-sm font-semibold text-[#a1a1aa] mb-4">POPULARITY SCORE</h3>
            <div className="text-5xl font-bold mb-2">
              {campaign.chartmetrics.popularityScore}/100
            </div>
            <div className="text-[#71717a] text-sm">Superstar momentum + Growth trajectory</div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="gradient-card p-8 rounded-2xl">
            <h3 className="text-lg font-bold mb-6">Platform Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-2 text-sm">
              {platformData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="font-semibold">{item.value}M</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {campaign.social.map((platform, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="gradient-card p-6 rounded-2xl"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">{platform.platform}</h4>
                  <span className="text-xs font-semibold text-[#71717a]">
                    +{platform.growthPercent}% monthly
                  </span>
                </div>
                <div className="text-3xl font-bold">{platform.followers}M followers</div>
                <div className="text-[#71717a] text-sm mt-1">
                  +{platform.monthlyGrowth}K followers
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <motion.div variants={itemVariants} className="gradient-card p-8 rounded-2xl">
            <h3 className="text-lg font-bold mb-6">Top Markets</h3>
            <div className="space-y-4">
              {campaign.markets.map((market, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{market.country}</span>
                    <span className="text-[#71717a]">{market.percent}%</span>
                  </div>
                  <div className="w-full bg-[#262626] rounded-full h-2">
                    <div
                      className="bg-[#fd3737] h-2 rounded-full"
                      style={{ width: `${market.percent * 3}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="gradient-card p-8 rounded-2xl">
            <h3 className="text-lg font-bold mb-6">Demographics</h3>
            <div className="space-y-3">
              <div>
                <div className="text-[#a1a1aa] text-sm mb-1">Gender</div>
                <div className="flex gap-4">
                  <span className="font-semibold">{campaign.demographics.femalePercent}% F</span>
                  <span className="font-semibold">{campaign.demographics.malePercent}% M</span>
                </div>
              </div>
              <div>
                <div className="text-[#a1a1aa] text-sm mb-1">Primary Age</div>
                <div className="font-semibold">{campaign.demographics.primaryAge}</div>
                <div className="text-[#71717a] text-sm">
                  {campaign.demographics.primaryAgePercent}% of audience
                </div>
              </div>
              <div className="pt-3 border-t border-[#333333]">
                <div className="text-[#a1a1aa] text-sm mb-2">Top Ethnicity</div>
                <div className="font-semibold">
                  {campaign.demographics.ethnicity[0].label}
                </div>
                <div className="text-[#71717a] text-sm">
                  {campaign.demographics.ethnicity[0].percent}%
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* GENRE LANDSCAPE */}
      <GenreLandscapeSection />

      {/* COMPETITIVE CALENDAR */}
      <CompetitiveCalendarSection />

      {/* CAMPAIGN OVERVIEW */}
      <CampaignOverviewSection campaign={campaign} />

      {/* PLAYBOOK */}
      <PlaybookSection campaign={campaign} expandedWeek={expandedWeek} setExpandedWeek={setExpandedWeek} />

      {/* CONTENT STRATEGY */}
      <ContentStrategySection campaign={campaign} />

      {/* CREATOR SEEDING */}
      <CreatorSeedingSection creatorTierData={creatorTierData} channelColors={channelColors} />

      {/* CHANNEL ALLOCATION */}
      <ChannelAllocationSection channelAllocationData={channelAllocationData} channelColors={channelColors} />

      {/* SUCCESS METRICS */}
      <SuccessMetricsSection />

      {/* RISKS */}
      <RisksSection campaign={campaign} />

      {/* FOOTER */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-4 md:px-8 bg-gradient-to-t from-[#0a0a0a] to-transparent text-center border-t border-[#333333]"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Campaign Ready</h2>
          <p className="text-[#a1a1aa] mb-8">
            A data-driven, creator-first rollout built to capture the summer moment for Tylas &quot;Carwash&quot;.
          </p>
          <div className="text-[#71717a] text-sm">
            <div className="mb-4">Crowd Control Digital</div>
            <div>Campaign planning, music marketing, and artist positioning intelligence.</div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

// Sub-components
function GenreLandscapeSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <span className="text-[#fd3737] text-sm font-bold">SECTION 03</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">Genre Landscape: Pop in 2026</h2>
      </div>

      <motion.div className="gradient-card p-8 rounded-2xl mb-12">
        <p className="text-lg leading-relaxed text-[#a1a1aa]">
          Pop in 2026 is experiencing a chart slump — new releases struggling against catalog. Winning campaigns are
          building narrative worlds, batching 20-30 short-form videos per song, and leading with IRL activations.
          Tylas Afrobeats-Pop crossover and dance challenge DNA position her to cut through the noise.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {[
          {
            title: 'World-Building Narratives',
            desc: 'Create immersive visual/conceptual universes around releases',
          },
          {
            title: 'Video Batching',
            desc: '20-30 short-form pieces per song across TikTok, Reels, Shorts',
          },
          {
            title: 'Creator Seeding',
            desc: 'Tier-based approach (mega, macro, micro, nano) for organic reach',
          },
          {
            title: 'Dance Challenges',
            desc: 'Choreographed challenges that drive community participation',
          },
        ].map((tactic, idx) => (
          <motion.div
            key={idx}
            className="gradient-card p-6 rounded-2xl border-l-4 border-[#fd3737]"
          >
            <h4 className="font-bold text-lg mb-2">{tactic.title}</h4>
            <p className="text-[#a1a1aa] text-sm">{tactic.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function CompetitiveCalendarSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <span className="text-[#fd3737] text-sm font-bold">SECTION 04</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">Competitive Calendar: May 29</h2>
      </div>

      <motion.div className="gradient-card p-8 rounded-2xl mb-8">
        <h3 className="text-lg font-bold mb-6">May 29 Releases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { artist: 'Billy Joel', release: 'Live Album Collection' },
            { artist: 'Shinedown', release: 'New Rock Single' },
            { artist: 'The Who', release: 'Legacy Live Album' },
            { artist: 'Alana Springsteen', release: 'Country Single' },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 p-4 bg-[#1a1a1a] rounded-lg">
              <div className="w-1 bg-[#fd3737] rounded" />
              <div>
                <div className="font-semibold">{item.artist}</div>
                <div className="text-[#71717a] text-sm">{item.release}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div className="gradient-card p-8 rounded-2xl border-l-4 border-[#1db954]">
        <div className="flex gap-4">
          <div className="text-3xl">✓</div>
          <div>
            <h4 className="text-lg font-bold mb-2">Limited Major Pop Competition</h4>
            <p className="text-[#a1a1aa]">
              May 29 is a clear lane for Tyla to dominate the news cycle. No major pop releases competing for streaming
              share and playlist placement.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

function CampaignOverviewSection({ campaign }: { campaign: CampaignData }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <span className="text-[#fd3737] text-sm font-bold">SECTION 05</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">Campaign Overview</h2>
      </div>

      <motion.div className="gradient-card p-8 rounded-2xl mb-12 border-l-4 border-[#fd3737]">
        <h3 className="text-lg font-bold mb-4">Campaign Thesis</h3>
        <p className="text-[#a1a1aa] leading-relaxed">{campaign.thesis}</p>
      </motion.div>

      <motion.div className="space-y-4">
        {campaign.phases.map((phase, idx) => (
          <div key={idx} className="gradient-card p-6 rounded-2xl">
            <div className="flex gap-4 items-start">
              <div className="text-3xl font-bold text-[#fd3737] min-w-fit">{idx + 1}</div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                  <h4 className="text-lg font-bold">{phase.name}</h4>
                  <span className="text-[#71717a] text-sm whitespace-nowrap">{phase.dateRange}</span>
                </div>
                <div className="space-y-2">
                  {phase.objectives.map((obj, oidx) => (
                    <div key={oidx} className="flex gap-2 text-[#a1a1aa]">
                      <span className="text-[#fd3737]">•</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
}

function PlaybookSection({
  campaign,
  expandedWeek,
  setExpandedWeek,
}: {
  campaign: CampaignData;
  expandedWeek: number | null;
  setExpandedWeek: (week: number | null) => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <div className="mb-12">
        <span className="text-[#fd3737] text-sm font-bold">SECTION 06</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">Week-by-Week Playbook</h2>
        <p className="text-[#a1a1aa] mt-4">
          Detailed tactical breakdown of each weeks campaign activities, creator actions, and success signals.
        </p>
      </div>

      <div className="space-y-4">
        {campaign.weeklyPlaybook.map((week, idx) => (
          <motion.div key={idx} className="gradient-card rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedWeek(expandedWeek === idx ? null : idx)}
              className="w-full p-6 text-left hover:bg-[#1a1a1a]/50 transition-colors flex justify-between items-start"
            >
              <div>
                <h3 className="text-lg font-bold mb-2">
                  {week.week}: {week.title}
                </h3>
                <p className="text-[#a1a1aa] text-sm">{week.objective}</p>
              </div>
              <div className="text-2xl flex-shrink-0 ml-4">{expandedWeek === idx ? '−' : '+'}</div>
            </button>

            {expandedWeek === idx && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-6 pb-6 border-t border-[#333333] space-y-6"
              >
                <div>
                  <h4 className="font-bold text-[#fd3737] mb-3">Actions</h4>
                  <ul className="space-y-2">
                    {week.actions.map((action, aidx) => (
                      <li key={aidx} className="flex gap-3 text-[#a1a1aa]">
                        <span className="text-[#1db954] flex-shrink-0">✓</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {week.creatorActions && (
                  <div>
                    <h4 className="font-bold text-[#e1306c] mb-3">Creator Actions</h4>
                    <ul className="space-y-2">
                      {week.creatorActions.map((action, aidx) => (
                        <li key={aidx} className="flex gap-3 text-[#a1a1aa]">
                          <span className="text-[#e1306c] flex-shrink-0">★</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-[#00f2ea] mb-3">Success Signals</h4>
                  <ul className="space-y-2">
                    {week.successSignals.map((signal, sidx) => (
                      <li key={sidx} className="flex gap-3 text-[#a1a1aa]">
                        <span className="text-[#00f2ea] flex-shrink-0">▸</span>
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function ContentStrategySection({ campaign }: { campaign: CampaignData }) {
  const contentPostingCadence = [
    { platform: 'TikTok', frequency: '3-5x weekly', type: 'Challenge, BTS, Reactions' },
    { platform: 'Instagram', frequency: 'Daily Stories, 2x Reels/week', type: 'Aesthetic, Challenge, Reactions' },
    { platform: 'YouTube', frequency: '1x weekly', type: 'BTS, Music Video, Long-form' },
    { platform: 'X/Twitter', frequency: 'Real-time + 2x daily', type: 'Engagement, Updates' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <span className="text-[#fd3737] text-sm font-bold">SECTION 07</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">Content Strategy</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {campaign.contentStrategy.map((pillar, idx) => (
          <motion.div
            key={idx}
            className="gradient-card p-8 rounded-2xl border-t-2 border-[#fd3737]"
          >
            <h3 className="text-lg font-bold mb-2">{pillar.pillar}</h3>
            <p className="text-[#a1a1aa] text-sm mb-4">{pillar.description}</p>
            <div className="flex flex-wrap gap-2">
              {pillar.platforms.map((platform, pidx) => (
                <span key={pidx} className="text-xs px-3 py-1 bg-[#262626] rounded-full text-[#a1a1aa]">
                  {platform}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div className="gradient-card p-8 rounded-2xl">
        <h3 className="text-lg font-bold mb-6">Posting Cadence</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#333333]">
                <th className="text-left py-3 px-4 text-[#a1a1aa] font-semibold">Platform</th>
                <th className="text-left py-3 px-4 text-[#a1a1aa] font-semibold">Frequency</th>
                <th className="text-left py-3 px-4 text-[#a1a1aa] font-semibold">Content Types</th>
              </tr>
            </thead>
            <tbody>
              {contentPostingCadence.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#333333]/50 hover:bg-[#1a1a1a] transition-colors"
                >
                  <td className="py-3 px-4 font-semibold">{item.platform}</td>
                  <td className="py-3 px-4 text-[#a1a1aa]">{item.frequency}</td>
                  <td className="py-3 px-4 text-[#a1a1aa]">{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.section>
  );
}

function CreatorSeedingSection({
  creatorTierData,
  channelColors,
}: {
  creatorTierData: Array<{ name: string; value: number }>;
  channelColors: string[];
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <span className="text-[#fd3737] text-sm font-bold">SECTION 08</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">Creator Seeding Plan</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div className="gradient-card p-8 rounded-2xl">
          <h3 className="text-lg font-bold mb-6">Creator Tier Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={creatorTierData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {creatorTierData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={channelColors[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-2 text-sm">
            {creatorTierData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: channelColors[idx] }}
                  />
                  {item.name}
                </span>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="space-y-4">
          {[
            {
              tier: 'Mega Creators',
              count: '3-5',
              followers: '5M+',
              approach: 'Exclusive early access, official first-listen reactions, co-created content',
            },
            {
              tier: 'Macro Creators',
              count: '15-20',
              followers: '500K - 5M',
              approach: 'Challenge tutorial partnerships, featured on Tyla channels, sound exclusivity',
            },
            {
              tier: 'Micro Creators',
              count: '50-100',
              followers: '50K - 500K',
              approach: 'Organic challenge participation, reposts, community seeding',
            },
            {
              tier: 'Nano Creators',
              count: 'Open',
              followers: '< 50K',
              approach: 'Community-driven, incentive-based challenges, user-generated content',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="gradient-card p-6 rounded-2xl border-l-4"
              style={{ borderColor: channelColors[idx] }}
            >
              <div className="font-bold text-lg mb-2">{item.tier}</div>
              <div className="text-sm text-[#a1a1aa] space-y-1 mb-3">
                <div>
                  <span className="font-semibold">{item.count}</span> creators
                </div>
                <div>
                  <span className="font-semibold">{item.followers}</span> followers
                </div>
              </div>
              <div className="text-[#a1a1aa] text-sm">{item.approach}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div className="gradient-card p-8 rounded-2xl mt-8">
        <h3 className="text-lg font-bold mb-4">Seeding Timeline</h3>
        <div className="space-y-4">
          {[
            { phase: 'Week -3', action: 'Seed 5 macro creators with NDAs mystery audio' },
            { phase: 'Week -2', action: '10 mid-tier creators get early access and choreography tutorial' },
            { phase: 'Week -2', action: '3 mega creators post first-listen reactions' },
            { phase: 'Week -1', action: 'Release sound to 50+ micro creators' },
            { phase: 'Week 0+', action: 'Activate nano tier and open challenge incentives' },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="font-semibold text-[#fd3737] min-w-fit">{item.phase}</div>
              <div className="text-[#a1a1aa]">{item.action}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}

function ChannelAllocationSection({
  channelAllocationData,
  channelColors,
}: {
  channelAllocationData: Array<{ name: string; value: number }>;
  channelColors: string[];
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <span className="text-[#fd3737] text-sm font-bold">SECTION 09</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">Channel Allocation</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div className="gradient-card p-8 rounded-2xl">
          <h3 className="text-lg font-bold mb-6">Budget Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={channelAllocationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {channelAllocationData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={channelColors[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-2 text-sm">
            {channelAllocationData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: channelColors[idx] }}
                  />
                  {item.name}
                </span>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="space-y-4">
          {[
            {
              channel: 'Organic Social',
              percent: '40%',
              rationale: 'Owned audience activation, contest seeding, UGC amplification',
            },
            {
              channel: 'Creator Seeding',
              percent: '30%',
              rationale: 'Organic reach through trusted voices, challenge virality',
            },
            {
              channel: 'Paid Social',
              percent: '25%',
              rationale: 'Amplify challenge content, targeted reach in US and South Africa',
            },
            {
              channel: 'Experiential',
              percent: '5%',
              rationale: 'IRL brand building, press coverage, TikTok-worthy moments',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="gradient-card p-6 rounded-2xl border-l-4"
              style={{ borderColor: channelColors[idx] }}
            >
              <div className="font-bold text-lg mb-1">{item.channel}</div>
              <div className="text-[#fd3737] font-semibold text-sm mb-2">{item.percent}</div>
              <div className="text-[#a1a1aa] text-sm">{item.rationale}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

function SuccessMetricsSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <span className="text-[#fd3737] text-sm font-bold">SECTION 10</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">Success Metrics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            phase: 'Pre-Release KPIs',
            metrics: ['200K+ pre-saves', '5%+ engagement rate', '100K+ challenge creates', '50M+ impressions'],
          },
          {
            phase: 'Launch KPIs',
            metrics: ['15M+ first-week streams', 'Top 20 Billboard Hot 100', '500K+ TikTok creates', '10M+ social impressions'],
          },
          {
            phase: 'Sustain KPIs',
            metrics: ['80%+ streaming retention', '1M+ total challenge creates', 'Sustained playlist rotation', 'Avg. 2-3 weeks in top 40 Spotify'],
          },
        ].map((kpi, idx) => (
          <motion.div key={idx} className="gradient-card p-8 rounded-2xl">
            <h3 className="text-lg font-bold mb-6 text-[#fd3737]">{kpi.phase}</h3>
            <ul className="space-y-3">
              {kpi.metrics.map((metric, midx) => (
                <li key={midx} className="flex gap-3 text-[#a1a1aa]">
                  <span className="text-[#fd3737] flex-shrink-0">◆</span>
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function RisksSection({ campaign }: { campaign: CampaignData }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <span className="text-[#fd3737] text-sm font-bold">SECTION 11</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">Risks & Contingencies</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {campaign.risks.map((risk, idx) => (
          <motion.div key={idx} className="gradient-card p-8 rounded-2xl">
            <h3 className="font-bold text-lg mb-4">{risk.title}</h3>

            <div className="space-y-4">
              <div>
                <div className="text-[#a1a1aa] text-xs font-semibold mb-1">LIKELIHOOD</div>
                <div
                  className={`inline-block px-3 py-1 rounded text-xs font-bold ${
                    risk.likelihood === 'High'
                      ? 'bg-[#ff0000]/20 text-[#ff0000]'
                      : risk.likelihood === 'Medium'
                        ? 'bg-[#fd3737]/20 text-[#fd3737]'
                        : 'bg-[#1db954]/20 text-[#1db954]'
                  }`}
                >
                  {risk.likelihood}
                </div>
              </div>

              <div>
                <div className="text-[#a1a1aa] text-xs font-semibold mb-1">IMPACT</div>
                <div
                  className={`inline-block px-3 py-1 rounded text-xs font-bold ${
                    risk.impact === 'High'
                      ? 'bg-[#ff0000]/20 text-[#ff0000]'
                      : risk.impact === 'Medium'
                        ? 'bg-[#fd3737]/20 text-[#fd3737]'
                        : 'bg-[#1db954]/20 text-[#1db954]'
                  }`}
                >
                  {risk.impact}
                </div>
              </div>

              <div className="border-t border-[#333333] pt-4">
                <div className="text-[#a1a1aa] text-xs font-semibold mb-2">TRIGGER SIGNAL</div>
                <div className="text-[#a1a1aa] text-sm">{risk.triggerSignal}</div>
              </div>

              <div>
                <div className="text-[#a1a1aa] text-xs font-semibold mb-2">CONTINGENCY</div>
                <div className="text-[#a1a1aa] text-sm">{risk.contingency}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
