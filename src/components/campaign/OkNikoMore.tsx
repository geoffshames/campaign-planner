'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';
import {
  ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
} from 'recharts';
import { okNikoMore as C } from '@/lib/data/ok-niko-more';

/* ── hooks ── */
function useInView(opts: { threshold?: number; rootMargin?: string; once?: boolean } = {}) {
  const { threshold = 0.12, rootMargin = '-50px', once = true } = opts;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); if (once) obs.unobserve(el); }
      else if (!once) setInView(false);
    }, { threshold, rootMargin });
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ref, inView };
}

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } } };

/* ── primitives ── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-[#fd3737] origin-left z-50" style={{ scaleX: x }} />;
}

function SectionDivider() {
  return <div className="max-w-6xl mx-auto px-6"><div className="h-px bg-gradient-to-r from-transparent via-[#fd3737]/40 to-transparent" /></div>;
}

function Section({ id, number, title, subtitle, children }: { id: string; number: string; title: string; subtitle?: string; children: React.ReactNode }) {
  const { ref, inView } = useInView();
  return (
    <section id={id} className="max-w-6xl mx-auto px-6 py-20 md:py-28">
      <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}>
        <motion.div variants={fadeUp} className="mb-12">
          <span className="text-[11px] tracking-[0.35em] uppercase text-[#fd3737] font-semibold">{number}</span>
          <h2 className="font-display text-3xl md:text-5xl text-[#FAFAFA] mt-3">{title}</h2>
          {subtitle && <p className="text-[#B8B8C0] text-base md:text-lg mt-4 max-w-3xl">{subtitle}</p>}
        </motion.div>
        {children}
      </motion.div>
    </section>
  );
}

function GlassCard({ children, className = '', glow = false, hover = true }: { children: React.ReactNode; className?: string; glow?: boolean; hover?: boolean }) {
  return (
    <motion.div variants={fadeUp} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A1A]/80 to-[#141414]/50 border border-[#333333]/60 ${hover ? 'hover:border-[#fd3737]/40 hover:shadow-lg hover:shadow-[#fd3737]/5 transition-all duration-500' : ''} ${glow ? 'shadow-lg shadow-[#fd3737]/5 border-[#fd3737]/20' : ''} ${className}`}>{children}</motion.div>
  );
}

function AnimatedBar({ pct, color = '#fd3737' }: { pct: number; color?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="h-2 w-full rounded-full bg-[#262626] overflow-hidden">
      <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: inView ? `${pct}%` : 0 }} transition={{ duration: 1, ease: 'easeOut' }} />
    </div>
  );
}

function Badge({ children, color = '#fd3737' }: { children: React.ReactNode; color?: string }) {
  return <span className="px-3 py-1 rounded-full text-[11px] font-semibold" style={{ background: `${color}22`, color }}>{children}</span>;
}

function levelColor(v: string) { return v === 'High' ? '#EF4444' : v === 'Medium' ? '#F59E0B' : '#22C55E'; }
function toneColor(v: string) { return v === 'good' ? '#fd3737' : v === 'warn' ? '#F59E0B' : '#FAFAFA'; }
function verdictColor(v: string) { return v === 'core' ? '#FD3737' : v === 'borrowed' ? '#F59E0B' : '#71717A'; }

/* equaliser bars for the hero */
function Equaliser() {
  const bars = [18, 42, 26, 68, 34, 88, 50, 30, 72, 40, 22, 60, 36, 80, 28, 54, 44, 92, 32, 24];
  return (
    <div className="flex items-end gap-[3px] h-24 md:h-32" aria-hidden="true">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-[6px] md:w-[10px] rounded-t-sm bg-gradient-to-t from-[#fd3737]/80 to-[#fd3737]/20"
          initial={{ height: '8%' }}
          animate={{ height: [`${h * 0.35}%`, `${h}%`, `${h * 0.5}%`] }}
          transition={{ duration: 1.1 + (i % 5) * 0.22, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: i * 0.045 }}
        />
      ))}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SpikeTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const l = payload.find((p: { dataKey: string }) => p.dataKey === 'listeners');
  const f = payload.find((p: { dataKey: string }) => p.dataKey === 'followers');
  return (
    <div className="rounded-xl border border-[#333333] bg-[#141414] px-4 py-3 shadow-xl">
      <div className="text-[#FAFAFA] text-sm font-semibold mb-2">{label}</div>
      <div className="text-[#fd3737] font-display text-xl">{l?.value?.toLocaleString()}</div>
      <div className="text-[#B8B8C0] text-xs">monthly listeners</div>
      <div className="text-[#E4E4E9] font-display text-lg mt-2">{f?.value?.toLocaleString()}</div>
      <div className="text-[#B8B8C0] text-xs">followers</div>
    </div>
  );
}

/* ── page ── */
export function OkNikoMore() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const gx = useSpring(mx, { stiffness: 60, damping: 20 }); const gy = useSpring(my, { stiffness: 60, damping: 20 });
  useEffect(() => {
    const h = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener('mousemove', h); return () => window.removeEventListener('mousemove', h);
  }, [mx, my]);

  const [menuOpen, setMenuOpen] = useState(false);

  const nav: [string, string][] = [
    ['finding', 'The Finding'], ['spikes', 'Spike Anatomy'], ['source', 'The Source'],
    ['geography', 'Geography'], ['test', 'The Test'], ['readout', 'Read-Out'],
    ['next', 'What It Sets Up'], ['window', 'Release Window'], ['risks', 'Risks'],
  ];

  const maxMarket = Math.max(...C.geography.markets.map((m) => m.listeners));
  const maxCity = Math.max(...C.geography.cities.map((m) => m.listeners));

  return (
    <div className="bg-[#0A0A0A] text-[#FAFAFA] min-h-screen relative">
      <ScrollProgress />
      <motion.div className="pointer-events-none fixed w-[420px] h-[420px] rounded-full bg-[#fd3737]/10 blur-[120px] z-0" style={{ left: gx, top: gy, x: '-50%', y: '-50%' }} />

      {/* top brand bar */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-[#0A0A0A]/70 border-b border-[#333333]/40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control Digital" className="h-5 w-auto opacity-90" />
          <div className="hidden lg:flex gap-5 text-[12px] text-[#B8B8C0]">
            {nav.map(([id, label]) => <a key={id} href={`#${id}`} className="uppercase tracking-wide hover:text-[#fd3737] transition-colors">{label}</a>)}
          </div>
          <button onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={menuOpen} className="lg:hidden text-[#FAFAFA] p-2 -mr-2">
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            )}
          </button>
        </div>
        {menuOpen && (
          <div className="lg:hidden border-t border-[#333333]/40 bg-[#0A0A0A]/95">
            <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[13px] text-[#E4E4E9]">
              {nav.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className="uppercase tracking-wide hover:text-[#fd3737] transition-colors">{label}</a>)}
            </div>
          </div>
        )}
      </div>

      {/* ═══ HERO ═══ */}
      <div ref={heroRef} className="relative h-[92vh] min-h-[620px] flex items-end overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(253,55,55,0.20),transparent_60%),radial-gradient(ellipse_at_75%_65%,rgba(253,55,55,0.10),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 64px)' }} />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        </motion.div>
        <motion.div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 w-full" style={{ opacity: heroFade }}>
          <div className="mb-8 opacity-70"><Equaliser /></div>
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge>{C.genre}</Badge>
            <Badge color="#A1A1AA">{C.releaseType}</Badge>
            <Badge color="#A1A1AA">{C.tier}</Badge>
            <Badge color="#A1A1AA">140 BPM</Badge>
          </div>
          <h1 className="font-display text-5xl md:text-8xl leading-[0.95] text-[#FAFAFA]">{C.artist}</h1>
          <p className="font-display text-2xl md:text-4xl text-[#fd3737] mt-3">{C.song} <span className="text-[#B8B8C0]">{C.feature}</span></p>
          <p className="text-[#E4E4E9] text-base md:text-lg mt-6 max-w-2xl leading-relaxed">{C.campaignWindow}.</p>
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-x-10 gap-y-3 mt-9 text-sm text-[#B8B8C0]">
            <span>{C.homeBase}</span>
            <span>{C.label}</span>
            <span>Released {C.releaseDate}</span>
            <span>$500 test budget</span>
          </div>
        </motion.div>
      </div>

      {/* ═══ 01 THE FINDING ═══ */}
      <Section id="finding" number="01" title="The Finding" subtitle={C.finding.headline}>
        <GlassCard className="p-8 md:p-10 mb-10 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <p className="text-[#E4E4E9] text-base md:text-lg leading-relaxed">{C.finding.body}</p>
        </GlassCard>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {C.finding.stats.map((s, i) => (
            <GlassCard key={i} className="p-6">
              <div className="font-display text-3xl md:text-4xl" style={{ color: toneColor(s.tone) }}>{s.value}</div>
              <div className="text-[#B8B8C0] text-xs mt-2 leading-snug">{s.label}</div>
            </GlassCard>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-6">Velocity, Chartmetric, 21 August</h3>
            <div className="space-y-4">
              {C.finding.velocity.map((v, i) => (
                <div key={i} className="flex items-baseline justify-between gap-3 border-b border-[#262626] pb-3 last:border-0">
                  <div>
                    <div className="text-[#E4E4E9] text-sm">{v.metric}</div>
                    <div className="text-[#B8B8C0] text-xs mt-0.5 leading-snug">{v.total}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display text-xl text-[#FAFAFA]">{v.value}</div>
                    <div className="text-xs font-semibold text-[#B8B8C0]">{v.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-6">Supporting context</h3>
            <ul className="space-y-3">
              {C.finding.context.map((c, i) => <li key={i} className="flex gap-2 text-[#E4E4E9] text-sm leading-relaxed"><span className="text-[#fd3737] mt-0.5">▹</span>{c}</li>)}
            </ul>
          </GlassCard>
        </div>
      </Section>

      <SectionDivider />

      {/* ═══ 02 SPIKE ANATOMY ═══ */}
      <Section id="spikes" number="02" title="Spike Anatomy" subtitle={C.spikes.headline}>
        <GlassCard className="p-8 md:p-10 mb-8" hover={false}>
          <p className="text-[#E4E4E9] text-base leading-relaxed mb-8">{C.spikes.summary}</p>
          <div className="h-[300px] md:h-[380px] -ml-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={C.spikes.series} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid stroke="#262626" vertical={false} />
                <XAxis dataKey="date" stroke="#B8B8C0" tick={{ fontSize: 11, fill: '#B8B8C0' }} tickLine={false} axisLine={{ stroke: '#333333' }} />
                <YAxis yAxisId="l" stroke="#B8B8C0" tick={{ fontSize: 11, fill: '#B8B8C0' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <YAxis yAxisId="f" orientation="right" domain={[200, 400]} stroke="#B8B8C0" tick={{ fontSize: 11, fill: '#B8B8C0' }} tickLine={false} axisLine={false} />
                <RTooltip content={<SpikeTooltip />} cursor={{ stroke: '#333333' }} />
                <Line yAxisId="l" type="monotone" dataKey="listeners" stroke="#FD3737" strokeWidth={2.5} dot={{ r: 3, fill: '#FD3737' }} activeDot={{ r: 5 }} />
                <Line yAxisId="f" type="monotone" dataKey="followers" stroke="#A1A1AA" strokeWidth={2} strokeDasharray="5 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-5 mt-5 text-xs text-[#B8B8C0]">
            <span className="flex items-center gap-2"><span className="w-4 h-[3px] rounded bg-[#FD3737] inline-block" /> Monthly listeners (left axis)</span>
            <span className="flex items-center gap-2"><span className="w-4 h-[2px] rounded bg-[#A1A1AA] inline-block" /> Spotify followers (right axis)</span>
          </div>
        </GlassCard>
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {C.spikes.events.map((e, i) => (
            <GlassCard key={i} className="p-7" glow={i === 2}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-lg text-[#FAFAFA]">{e.name}</span>
                <Badge color={i === 2 ? '#fd3737' : '#A1A1AA'}>{e.growth}</Badge>
              </div>
              <div className="text-[#B8B8C0] text-xs mb-4">{e.window}</div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-display text-2xl text-[#B8B8C0]">{e.low}</span>
                <span className="text-[#fd3737]">to</span>
                <span className="font-display text-3xl text-[#FAFAFA]">{e.peak}</span>
              </div>
              <p className="text-[#E4E4E9] text-sm leading-relaxed">{e.outcome}</p>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="p-8 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <p className="font-display text-xl md:text-2xl text-[#FAFAFA] leading-snug">{C.spikes.verdict}</p>
        </GlassCard>
      </Section>

      <SectionDivider />

      {/* ═══ 03 THE SOURCE ═══ */}
      <Section id="source" number="03" title="The Source" subtitle={C.source.headline}>
        <GlassCard className="p-8 md:p-10 mb-8" hover={false}>
          <p className="text-[#E4E4E9] text-base md:text-lg leading-relaxed">{C.source.body}</p>
        </GlassCard>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {C.source.girlset.map((g, i) => (
            <GlassCard key={i} className="p-6">
              <div className="font-display text-2xl md:text-3xl text-[#FAFAFA]">{g.value}</div>
              <div className="text-[#B8B8C0] text-xs mt-2 leading-snug">{g.label}</div>
            </GlassCard>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-4">Read from Cobrand</h3>
            <p className="text-[#E4E4E9] text-sm leading-relaxed">{C.source.cobrandNote}</p>
          </GlassCard>
          <GlassCard className="p-8 border-l-2 border-l-[#fd3737]" glow hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-4">The signal inside it</h3>
            <p className="text-[#E4E4E9] text-sm leading-relaxed">{C.source.precedent}</p>
          </GlassCard>
        </div>
      </Section>

      <SectionDivider />

      {/* ═══ 04 GEOGRAPHY ═══ */}
      <Section id="geography" number="04" title="Geography" subtitle={C.geography.headline}>
        <div className="grid md:grid-cols-2 gap-6 items-start mb-8">
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-6">Listeners by market</h3>
            <div className="space-y-3.5">
              {C.geography.markets.map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5 gap-3">
                    <span className="text-[#E4E4E9]">{m.country}</span>
                    <span className="text-[#FAFAFA] font-semibold shrink-0">{m.listeners.toLocaleString()}</span>
                  </div>
                  <AnimatedBar pct={(m.listeners / maxMarket) * 100} color={verdictColor(m.verdict)} />
                  <div className="text-[#B8B8C0] text-[11px] mt-1">{m.since}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-6 text-xs text-[#B8B8C0]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FD3737] inline-block" /> Established</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block" /> Arrived this month</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#71717A] inline-block" /> Stale</span>
            </div>
          </GlassCard>
          <div className="space-y-6">
            <GlassCard className="p-8 border-l-2 border-l-[#F59E0B]" hover={false}>
              <h3 className="font-display text-lg text-[#FAFAFA] mb-4">{C.geography.exclusion.title}</h3>
              <ul className="space-y-3">
                {C.geography.exclusion.points.map((p, i) => <li key={i} className="flex gap-2 text-[#E4E4E9] text-sm leading-relaxed"><span className="text-[#F59E0B] mt-0.5">▹</span>{p}</li>)}
              </ul>
            </GlassCard>
            <GlassCard className="p-8" hover={false}>
              <h3 className="font-display text-lg text-[#FAFAFA] mb-4">Top cities</h3>
              <div className="space-y-3">
                {C.geography.cities.map((c, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-[#E4E4E9]">{c.city}</span>
                      <span className="text-[#FAFAFA] font-semibold">{c.listeners}</span>
                    </div>
                    <AnimatedBar pct={(c.listeners / maxCity) * 100} color={['Los Angeles', 'New York', 'Oslo'].includes(c.city) ? '#FD3737' : '#71717A'} />
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
        <GlassCard className="p-8" hover={false}>
          <h3 className="font-display text-lg text-[#FAFAFA] mb-4">{C.geography.norway.title}</h3>
          <p className="text-[#E4E4E9] text-sm md:text-base leading-relaxed">{C.geography.norway.body}</p>
        </GlassCard>
      </Section>

      <SectionDivider />

      {/* ═══ 05 THE TEST ═══ */}
      <Section id="test" number="05" title="The $500 Test" subtitle={C.test.headline}>
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {C.test.rationale.map((r, i) => (
            <GlassCard key={i} className="p-7">
              <h3 className="font-display text-lg text-[#FAFAFA] mb-3">{r.title}</h3>
              <p className="text-[#E4E4E9] text-sm leading-relaxed">{r.body}</p>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-7 mb-10 border-l-2 border-l-[#F59E0B]" hover={false}>
          <div className="text-[11px] uppercase tracking-wider text-[#F59E0B] font-semibold mb-2">Stated plainly</div>
          <p className="text-[#E4E4E9] text-sm leading-relaxed">{C.test.honesty}</p>
        </GlassCard>

        {/* spec sheet */}
        <motion.div variants={fadeUp} className="mb-10">
          <h3 className="font-display text-2xl text-[#FAFAFA] mb-6">Build sheet</h3>
          <GlassCard className="overflow-hidden" hover={false}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
              {C.test.spec.map((s, i) => (
                <div key={i} className="p-5 border-b border-r border-[#262626] last:border-b-0">
                  <div className="text-[11px] uppercase tracking-wider text-[#fd3737] font-semibold mb-1.5">{s.field}</div>
                  <div className="text-[#FAFAFA] text-sm font-medium leading-snug">{s.value}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* decisions */}
        <motion.div variants={fadeUp} className="mb-10">
          <h3 className="font-display text-2xl text-[#FAFAFA] mb-6">The calls behind the build</h3>
          <div className="grid md:grid-cols-2 gap-5">
            {C.test.decisions.map((d, i) => (
              <GlassCard key={i} className="p-7">
                <h4 className="font-display text-base text-[#fd3737] mb-3">{d.title}</h4>
                <p className="text-[#E4E4E9] text-sm leading-relaxed">{d.body}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* creatives */}
        <motion.div variants={fadeUp}>
          <h3 className="font-display text-2xl text-[#FAFAFA] mb-6">Three creatives, one ad set</h3>
          <div className="grid md:grid-cols-3 gap-5">
            {C.test.creatives.map((cr, i) => (
              <GlassCard key={i} className="p-7 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-display text-2xl text-[#333333]">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-lg text-[#FAFAFA]">{cr.name}</span>
                </div>
                <div className="text-[#fd3737] text-sm font-semibold mb-4">{cr.hook}</div>
                <p className="text-[#E4E4E9] text-sm leading-relaxed mb-5">{cr.detail}</p>
                <div className="mt-auto pt-4 border-t border-[#262626]">
                  <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0] mb-1.5">Why</div>
                  <p className="text-[#B8B8C0] text-xs leading-relaxed">{cr.why}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══ 06 READ-OUT ═══ */}
      <Section id="readout" number="06" title="Read-Out" subtitle={C.readout.headline}>
        <div className="relative mb-10">
          <div className="absolute left-[17px] md:left-[24px] top-2 bottom-2 w-px bg-gradient-to-b from-[#fd3737] via-[#333333] to-transparent" />
          <div className="space-y-5">
            {C.readout.gates.map((g, i) => (
              <div key={i} className="relative pl-12 md:pl-16">
                <div className="absolute left-[11px] md:left-[18px] top-6 w-3 h-3 rounded-full bg-[#fd3737] ring-4 ring-[#0A0A0A]" />
                <GlassCard className="p-6 md:p-7" hover={false}>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="font-display text-lg text-[#FAFAFA]">{g.day}</span>
                    <Badge color="#A1A1AA">{g.action}</Badge>
                  </div>
                  <p className="text-[#E4E4E9] text-sm leading-relaxed">{g.detail}</p>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        <motion.div variants={fadeUp} className="mb-8">
          <h3 className="font-display text-2xl text-[#FAFAFA] mb-6">Thresholds</h3>
          <GlassCard className="overflow-hidden" hover={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className="border-b border-[#333333]">
                    <th className="text-left p-4 text-[11px] uppercase tracking-wider text-[#B8B8C0] font-semibold">Metric</th>
                    <th className="text-right p-4 text-[11px] uppercase tracking-wider text-[#B8B8C0] font-semibold">Floor</th>
                    <th className="text-right p-4 text-[11px] uppercase tracking-wider text-[#B8B8C0] font-semibold">Working</th>
                    <th className="text-right p-4 text-[11px] uppercase tracking-wider text-[#fd3737] font-semibold">Strong</th>
                  </tr>
                </thead>
                <tbody>
                  {C.readout.thresholds.map((t, i) => (
                    <tr key={i} className="border-b border-[#262626] last:border-0">
                      <td className="p-4 text-[#FAFAFA] font-medium">{t.metric}</td>
                      <td className="p-4 text-right text-[#B8B8C0]">{t.floor}</td>
                      <td className="p-4 text-right text-[#E4E4E9]">{t.working}</td>
                      <td className="p-4 text-right text-[#fd3737] font-semibold">{t.strong}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>

        <GlassCard className="p-8 md:p-10 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <h3 className="font-display text-xl md:text-2xl text-[#FAFAFA] mb-4">{C.readout.modelled.title}</h3>
          <p className="text-[#E4E4E9] text-base leading-relaxed mb-5">{C.readout.modelled.body}</p>
          <div className="pt-5 border-t border-[#262626]">
            <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0] mb-2">Caveat</div>
            <p className="text-[#B8B8C0] text-sm leading-relaxed">{C.readout.modelled.caveat}</p>
          </div>
        </GlassCard>
      </Section>

      <SectionDivider />

      {/* ═══ 07 WHAT IT SETS UP ═══ */}
      <Section id="next" number="07" title="What It Sets Up" subtitle={C.next.headline}>
        <GlassCard className="p-8 md:p-10 mb-8" hover={false}>
          <p className="text-[#E4E4E9] text-base md:text-lg leading-relaxed">{C.next.summary}</p>
        </GlassCard>
        <div className="space-y-4 mb-8">
          {C.next.moves.map((m, i) => (
            <GlassCard key={i} className="p-6 md:p-7">
              <div className="grid md:grid-cols-[150px_1fr] gap-4 md:gap-7">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#fd3737] font-semibold">{m.window}</div>
                </div>
                <div>
                  <h4 className="font-display text-lg text-[#FAFAFA] mb-2">{m.title}</h4>
                  <p className="text-[#E4E4E9] text-sm leading-relaxed">{m.detail}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="p-8 border-l-2 border-l-[#F59E0B]" hover={false}>
          <h3 className="font-display text-lg text-[#FAFAFA] mb-4">{C.next.constraints.title}</h3>
          <ul className="space-y-4">
            {C.next.constraints.points.map((p, i) => <li key={i} className="flex gap-2 text-[#E4E4E9] text-sm leading-relaxed"><span className="text-[#F59E0B] mt-0.5">▹</span>{p}</li>)}
          </ul>
        </GlassCard>
      </Section>

      <SectionDivider />

      {/* ═══ 08 RELEASE WINDOW ═══ */}
      <Section id="window" number="08" title="Release Window" subtitle={C.competitive.headline}>
        <div className="space-y-4 mb-8">
          {C.competitive.items.map((it, i) => (
            <GlassCard key={i} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="font-display text-lg text-[#FAFAFA]">{it.artist}</div>
                  <div className="text-[#B8B8C0] text-sm mt-1">{it.release}</div>
                </div>
                <Badge color={levelColor(it.threat)}>{it.threat} threat</Badge>
              </div>
              <p className="text-[#E4E4E9] text-sm leading-relaxed">{it.note}</p>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="p-8 md:p-10 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <h3 className="font-display text-xl md:text-2xl text-[#FAFAFA] mb-4">{C.competitive.verdictTitle}</h3>
          <p className="text-[#E4E4E9] text-base leading-relaxed">{C.competitive.verdict}</p>
        </GlassCard>
      </Section>

      <SectionDivider />

      {/* ═══ 09 RISKS ═══ */}
      <Section id="risks" number="09" title="Risks" subtitle="What could go wrong on a fourteen-day flight, and the response to each.">
        <div className="grid md:grid-cols-2 gap-5">
          {C.risks.map((r, i) => (
            <GlassCard key={i} className="p-7">
              <h3 className="font-display text-lg text-[#FAFAFA] mb-4">{r.title}</h3>
              <div className="flex gap-2 mb-5">
                <Badge color={levelColor(r.likelihood)}>{r.likelihood} likelihood</Badge>
                <Badge color={levelColor(r.impact)}>{r.impact} impact</Badge>
              </div>
              <div className="mb-4">
                <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0] mb-1.5">Trigger signal</div>
                <p className="text-[#E4E4E9] text-sm leading-relaxed">{r.triggerSignal}</p>
              </div>
              <div className="pt-4 border-t border-[#262626]">
                <div className="text-[11px] uppercase tracking-wider text-[#fd3737] mb-1.5">Response</div>
                <p className="text-[#E4E4E9] text-sm leading-relaxed">{r.contingency}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-[#333333]/40 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control Digital" className="h-6 w-auto opacity-90 mb-4" />
              <div className="text-[#B8B8C0] text-sm">info@crowdcontroldigital.com</div>
            </div>
            <div className="text-[#B8B8C0] text-xs leading-relaxed md:text-right">
              <div>{C.artist}, {C.song} {C.feature}</div>
              <div className="mt-1">Data pulled from Chartmetric and Cobrand on {C.pulledAt}</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
