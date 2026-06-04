'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { miguelDamned as C } from '@/lib/data/miguel-damned';

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

const DONUT = ['#FD3737', '#D42D2D', '#A1A1AA', '#71717A', '#333333'];

function PlaybookRow({ w }: { w: (typeof C)['playbook'][number] }) {
  const { ref, inView } = useInView({ threshold: 0.2, rootMargin: '-20px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.45 }} className="relative pl-12 md:pl-16">
      <div className="absolute left-[11px] md:left-[18px] top-6 w-3 h-3 rounded-full bg-[#fd3737] ring-4 ring-[#0A0A0A]" />
      <GlassCard className="p-6 md:p-7" hover={false}>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-display text-lg text-[#FAFAFA]">{w.week}</span>
          <Badge color="#A1A1AA">{w.phase}</Badge>
        </div>
        <p className="text-[#fd3737] text-sm font-semibold mb-4">{w.objective}</p>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0] mb-2">Actions</div>
            <ul className="space-y-2">{w.actions.map((a, j) => <li key={j} className="flex gap-2 text-[#E4E4E9] text-sm leading-snug"><span className="text-[#fd3737] mt-0.5">▹</span>{a}</li>)}</ul>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0] mb-2">Success signals</div>
            <ul className="space-y-2">{w.signals.map((sig, j) => <li key={j} className="flex gap-2 text-[#E4E4E9] text-sm leading-snug"><span className="text-[#22C55E] mt-0.5">✓</span>{sig}</li>)}</ul>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ── page ── */
export function MiguelDamned() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const gx = useSpring(mx, { stiffness: 60, damping: 20 }); const gy = useSpring(my, { stiffness: 60, damping: 20 });
  useEffect(() => {
    const h = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener('mousemove', h); return () => window.removeEventListener('mousemove', h);
  }, [mx, my]);

  const [menuOpen, setMenuOpen] = useState(false);

  const nav = [
    ['moment', 'The Moment'], ['position', 'Position'], ['audience', 'Audience'],
    ['anatomy', 'Trend Anatomy'], ['activations', 'Activations'], ['channels', 'Budget'],
    ['playbook', 'Playbook'], ['kpis', 'KPIs'], ['risks', 'Risks'],
  ];

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
      <div ref={heroRef} className="relative h-[88vh] min-h-[600px] flex items-end overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/miguel-damned/hero.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/55 to-[#0A0A0A]/30" />
        </motion.div>
        <motion.div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 w-full" style={{ opacity: heroFade }}>
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge>{C.genre}</Badge>
            <Badge color="#A1A1AA">{C.releaseType}</Badge>
            <Badge color="#A1A1AA">{C.tier}</Badge>
          </div>
          <h1 className="font-display text-5xl md:text-8xl leading-[0.95] text-[#FAFAFA]">{C.artist}</h1>
          <p className="font-display text-2xl md:text-4xl text-[#fd3737] mt-3 lowercase">{C.song}</p>
          <p className="text-[#E4E4E9] text-base md:text-lg mt-6 max-w-2xl">{C.campaignWindow}.</p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-8 text-sm text-[#B8B8C0]">
            <span>{C.homeBase}</span><span>·</span><span>{C.label}</span><span>·</span><span>Original release: {C.releaseDate}</span>
          </div>
        </motion.div>
      </div>

      {/* ═══ 01 THE MOMENT ═══ */}
      <Section id="moment" number="01" title="The Moment" subtitle={C.moment.headline}>
        <GlassCard className="p-8 md:p-10 mb-10 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <p className="text-[#E4E4E9] text-base md:text-lg leading-relaxed">{C.moment.body}</p>
        </GlassCard>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {C.moment.stats.map((s, i) => (
            <GlassCard key={i} className="p-6">
              <div className="font-display text-3xl md:text-4xl" style={{ color: s.tone === 'good' ? '#fd3737' : s.tone === 'warn' ? '#F59E0B' : '#FAFAFA' }}>{s.value}</div>
              <div className="text-[#B8B8C0] text-xs mt-2 leading-snug">{s.label}</div>
            </GlassCard>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-6">7-day velocity (Chartmetric, Jun 4)</h3>
            <div className="space-y-4">
              {C.moment.velocity.map((v, i) => (
                <div key={i} className="flex items-baseline justify-between gap-3 border-b border-[#262626] pb-3">
                  <div>
                    <div className="text-[#E4E4E9] text-sm">{v.metric}</div>
                    <div className="text-[#B8B8C0] text-xs mt-0.5">{v.total}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display text-xl text-[#FAFAFA]">{v.value}</div>
                    <div className="text-xs font-semibold" style={{ color: v.change.startsWith('-') ? '#F59E0B' : '#22C55E' }}>{v.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-6">Chart footprint — 121 entries and counting</h3>
            <ul className="space-y-3">
              {C.moment.charts.map((c, i) => <li key={i} className="flex gap-2 text-[#E4E4E9] text-sm leading-relaxed"><span className="text-[#fd3737] mt-0.5">▹</span>{c}</li>)}
            </ul>
          </GlassCard>
        </div>
      </Section>

      <SectionDivider />

      {/* ═══ 02 POSITION ═══ */}
      <Section id="position" number="02" title="Artist Position" subtitle={C.position.headline}>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {C.position.chartmetrics.map((m, i) => (
            <GlassCard key={i} className="p-6">
              <div className="font-display text-3xl md:text-4xl text-[#FAFAFA]">{m.value}</div>
              <div className="text-[#fd3737] text-xs font-semibold mt-2">{m.label}</div>
              <div className="text-[#B8B8C0] text-xs mt-1 leading-snug">{m.sub}</div>
            </GlassCard>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6 items-start mb-10">
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-6">Owned social reach</h3>
            <div className="space-y-5">
              {C.position.social.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[#E4E4E9] text-sm">{s.platform}</span>
                    <span className="font-display text-2xl text-[#FAFAFA]">{s.value}</span>
                  </div>
                  <AnimatedBar pct={s.pct} />
                  <div className="text-[#B8B8C0] text-xs mt-1.5">{s.sub}</div>
                </div>
              ))}
            </div>
            <p className="text-[#B8B8C0] text-sm leading-relaxed mt-6">{C.position.insight}</p>
          </GlassCard>
          <GlassCard className="p-8 border-l-2 border-l-[#fd3737]" hover={false} glow>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-6">{C.position.sureThing.title}</h3>
            <ul className="space-y-3">
              {C.position.sureThing.points.map((p, i) => <li key={i} className="flex gap-2 text-[#E4E4E9] text-sm leading-relaxed"><span className="text-[#fd3737] mt-0.5">▹</span>{p}</li>)}
            </ul>
          </GlassCard>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.div variants={fadeUp}><img src="/images/miguel-damned/strategy.png" alt="" className="w-full h-56 md:h-72 object-cover rounded-2xl opacity-80" /></motion.div>
      </Section>

      <SectionDivider />

      {/* ═══ 03 AUDIENCE ═══ */}
      <Section id="audience" number="03" title="Audience" subtitle="62% female, half aged 25–34 — and the five biggest cities in his world are all in Mexico.">
        <div className="grid md:grid-cols-2 gap-6 items-start mb-10">
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-6">Top markets — share of total audience</h3>
            <div className="space-y-3">
              {C.audience.markets.map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#E4E4E9]">{m.country}</span>
                    <span className="text-[#FAFAFA] font-semibold">{m.percent}%</span>
                  </div>
                  <AnimatedBar pct={(m.percent / 37.6) * 100} color={['Mexico', 'Chile', 'Colombia', 'Brazil'].includes(m.country) ? '#FD3737' : '#71717A'} />
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-5 text-xs text-[#B8B8C0]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FD3737] inline-block" /> LATAM markets</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#71717A] inline-block" /> Other</span>
            </div>
          </GlassCard>
          <div className="space-y-6">
            <GlassCard className="p-8 border-l-2 border-l-[#fd3737]" hover={false} glow>
              <h3 className="font-display text-lg text-[#FAFAFA] mb-4">The LATAM case</h3>
              <p className="text-[#E4E4E9] text-sm leading-relaxed">{C.audience.latamCallout}</p>
            </GlassCard>
            <GlassCard className="p-8" hover={false}>
              <h3 className="font-display text-lg text-[#FAFAFA] mb-4">Top cities</h3>
              <div className="flex flex-wrap gap-2">
                {C.audience.cities.map((c, i) => <Badge key={i} color={i < 5 ? '#FD3737' : '#A1A1AA'}>{c}</Badge>)}
              </div>
              <p className="text-[#B8B8C0] text-xs leading-relaxed mt-5">{C.audience.trendGeo}</p>
            </GlassCard>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-6"><div className="font-display text-3xl md:text-4xl text-[#FAFAFA]">{C.audience.demographics.femalePercent}%</div><div className="text-[#B8B8C0] text-xs mt-2">Female audience</div></GlassCard>
          <GlassCard className="p-6"><div className="font-display text-3xl md:text-4xl text-[#FAFAFA]">{C.audience.demographics.primaryAge}</div><div className="text-[#B8B8C0] text-xs mt-2">Primary age · {C.audience.demographics.primaryAgePercent}% of audience</div></GlassCard>
          <GlassCard className="p-6"><div className="font-display text-3xl md:text-4xl text-[#FAFAFA]">14.5M</div><div className="text-[#B8B8C0] text-xs mt-2">Total social footprint</div></GlassCard>
          <GlassCard className="p-6"><div className="font-display text-3xl md:text-4xl text-[#FAFAFA]">~26%</div><div className="text-[#B8B8C0] text-xs mt-2">LATAM share of audience (MX+CL+CO+BR)</div></GlassCard>
        </div>
      </Section>

      <SectionDivider />

      {/* ═══ 04 TREND ANATOMY ═══ */}
      <Section id="anatomy" number="04" title="Trend Anatomy" subtitle={C.trendAnatomy.headline}>
        <GlassCard className="p-8 md:p-10 mb-10 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <p className="text-[#E4E4E9] text-base md:text-lg leading-relaxed">{C.trendAnatomy.body}</p>
        </GlassCard>
        <div className="grid md:grid-cols-2 gap-6 items-start mb-10">
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-6">Sound landscape (Cobrand, Jun 4)</h3>
            <div className="space-y-4">
              {C.trendAnatomy.sounds.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1.5 gap-2">
                    <span className="text-[#E4E4E9] text-sm truncate">{s.name}</span>
                    <span className="font-display text-lg text-[#FAFAFA] shrink-0">{(s.creates / 1000).toFixed(1)}K</span>
                  </div>
                  <AnimatedBar pct={(s.creates / 130202) * 100} color={s.type.includes('Official') ? '#FD3737' : '#71717A'} />
                  <div className="text-[#B8B8C0] text-xs mt-1">{s.type}</div>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-6">Nano accounts, mega views</h3>
            <p className="text-[#B8B8C0] text-xs mb-5">Top damned videos on Chartmetric — every one from a sub-2,100-follower account.</p>
            <div className="space-y-4">
              {C.trendAnatomy.topVideos.map((v, i) => (
                <div key={i} className="flex items-baseline justify-between gap-3 border-b border-[#262626] pb-3">
                  <div>
                    <div className="text-[#E4E4E9] text-sm">{v.handle}</div>
                    <div className="text-[#B8B8C0] text-xs mt-0.5">{v.followers}</div>
                  </div>
                  <div className="font-display text-base text-[#fd3737] text-right shrink-0">{v.views}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {C.trendAnatomy.formats.map((f, i) => (
            <GlassCard key={i} className="p-6">
              <Badge color={f.share === 'Open lane' ? '#22C55E' : '#A1A1AA'}>{f.share}</Badge>
              <h4 className="font-display text-base text-[#FAFAFA] mt-4 mb-2">{f.name}</h4>
              <p className="text-[#B8B8C0] text-xs leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <SectionDivider />

      {/* ═══ 05 ACTIVATIONS ═══ */}
      <Section id="activations" number="05" title="The Activation Stack" subtitle="Six coordinated programs. Every dollar either re-ignites creation, converts attention to streams, or captures the audience for keeps.">
        <div className="space-y-6">
          {C.activations.map((a, i) => (
            <GlassCard key={i} className="p-7 md:p-9" hover={false}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-display text-xl md:text-2xl text-[#FAFAFA]">{String(i + 1).padStart(2, '0')} · {a.name}</span>
                    <Badge>{a.cost}</Badge>
                  </div>
                  <div className="text-[#B8B8C0] text-xs mt-2">{a.rate} · {a.timing}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0]">Projection</div>
                  <div className="text-[#fd3737] text-sm font-semibold max-w-[260px]">{a.projection}</div>
                </div>
              </div>
              <p className="text-[#E4E4E9] text-sm md:text-base leading-relaxed mb-5">{a.description}</p>
              <div className="flex flex-wrap gap-2">
                {a.kpis.map((k, j) => <span key={j} className="px-3 py-1.5 rounded-lg bg-[#262626] text-[#E4E4E9] text-xs">✓ {k}</span>)}
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <SectionDivider />

      {/* ═══ 06 CHANNELS + BUDGET ═══ */}
      <Section id="channels" number="06" title="Channel Allocation & Budget" subtitle={`Total sprint budget: ${C.budget.total}.`}>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-2">Effort split</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={C.channels.map((c) => ({ name: c.name, value: c.pct }))} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={3} stroke="none">
                    {C.channels.map((_, i) => <Cell key={i} fill={DONUT[i % DONUT.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-2">
              {C.channels.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: DONUT[i % DONUT.length] }} />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm"><span className="text-[#E4E4E9]">{c.name}</span><span className="text-[#FAFAFA] font-semibold">{c.pct}%</span></div>
                    <div className="text-[#B8B8C0] text-xs">{c.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
          <div className="space-y-6">
            <GlassCard className="p-8" hover={false}>
              <h3 className="font-display text-lg text-[#FAFAFA] mb-6">Budget lines</h3>
              <div className="space-y-3">
                {C.budget.lines.map((b, i) => (
                  <div key={i} className="flex justify-between items-baseline border-b border-[#262626] pb-3">
                    <span className="text-[#E4E4E9] text-sm">{b.item}</span>
                    <span className="font-display text-lg text-[#FAFAFA]">{b.amount}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </Section>

      <SectionDivider />

      {/* ═══ 07 PLAYBOOK ═══ */}
      <Section id="playbook" number="07" title="The 30-Day Playbook" subtitle="Week 0 locks infrastructure; Weeks 1–4 run Re-Ignite → Convert → Amplify → Sustain.">
        <div className="relative">
          <div className="absolute left-[16px] md:left-[23px] top-2 bottom-2 w-px bg-gradient-to-b from-[#fd3737]/60 via-[#333333] to-transparent" />
          <div className="space-y-6">
            {C.playbook.map((w, i) => <PlaybookRow key={i} w={w} />)}
          </div>
        </div>
      </Section>

      <SectionDivider />

      {/* ═══ 08 KPIs ═══ */}
      <Section id="kpis" number="08" title="What Success Looks Like" subtitle="Benchmarked against the do-nothing decay path, not against zero.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {C.kpis.map((k, i) => (
            <GlassCard key={i} className="p-6">
              <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0] mb-3">{k.label}</div>
              <div className="font-display text-2xl md:text-3xl text-[#fd3737] leading-tight">{k.target}</div>
              <div className="text-[#B8B8C0] text-xs mt-2">{k.baseline}</div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <SectionDivider />

      {/* ═══ 09 RISKS ═══ */}
      <Section id="risks" number="09" title="Risks & Contingencies" subtitle="Pre-committed pivots — no mid-flight improvisation.">
        <div className="grid md:grid-cols-2 gap-6">
          {C.risks.map((r, i) => (
            <GlassCard key={i} className="p-7" hover={false}>
              <h4 className="font-display text-lg text-[#FAFAFA] mb-3">{r.title}</h4>
              <div className="flex gap-2 mb-4">
                <Badge color={levelColor(r.likelihood)}>Likelihood: {r.likelihood}</Badge>
                <Badge color={levelColor(r.impact)}>Impact: {r.impact}</Badge>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0] mb-1.5">Trigger signal</div>
              <p className="text-[#E4E4E9] text-sm leading-relaxed mb-4">{r.trigger}</p>
              <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0] mb-1.5">Contingency</div>
              <p className="text-[#E4E4E9] text-sm leading-relaxed">{r.contingency}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* ═══ CLOSING ═══ */}
      <div className="relative h-[50vh] min-h-[380px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/miguel-damned/closing.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/40 to-[#0A0A0A]" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div>
            <p className="font-display text-2xl md:text-4xl text-[#FAFAFA] max-w-3xl">The wave already happened. The next 30 days decide who owns it.</p>
            <p className="text-[#B8B8C0] text-sm mt-6">Crowd Control Digital · info@crowdcontroldigital.com · Built {C.generatedDate}</p>
          </div>
        </div>
      </div>

      <footer className="border-t border-[#333333]/40 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control Digital" className="h-4 w-auto opacity-60" />
          <p className="text-[#B8B8C0] text-xs max-w-xl">Sources: {C.evidence.slice(0, 3).join(' · ')}</p>
        </div>
      </footer>
    </div>
  );
}
