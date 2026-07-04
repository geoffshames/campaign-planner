'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { temporex as C } from '@/lib/data/temporex-wanting-is-haunting';

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
const scaleIn = { hidden: { opacity: 0, scale: 0.94 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } };

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
function PlatformIcon({ platform, size = 18 }: { platform: string; size?: number }) {
  const p = platform.toLowerCase();
  const c = '#E4E4E9';
  if (p.includes('tiktok')) return <svg width={size} height={size} viewBox="0 0 24 24" fill={c}><path d="M16.6 5.82a4.28 4.28 0 0 1-1.05-2.82h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.27 0 .53.04.78.12V9.78a5.7 5.7 0 1 0 4.92 5.64V9.01a7.3 7.3 0 0 0 4.05 1.22V7.13a4.28 4.28 0 0 1-3-1.31z"/></svg>;
  if (p.includes('insta')) return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill={c} stroke="none"/></svg>;
  if (p.includes('spotify')) return <svg width={size} height={size} viewBox="0 0 24 24" fill={c}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.4a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 1 1-.28-1.21c3.81-.87 7.08-.5 9.72 1.11.3.18.39.57.21.85zm1.23-2.74a.78.78 0 0 1-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 1 1-.45-1.49c3.63-1.1 8.15-.56 11.23 1.33.37.22.49.7.26 1.07zm.11-2.85C14.83 8.95 9.5 8.76 6.42 9.7a.93.93 0 1 1-.54-1.79c3.53-1.07 9.42-.86 13.13 1.34a.94.94 0 0 1-.96 1.61z"/></svg>;
  if (p.includes('youtube')) return <svg width={size} height={size} viewBox="0 0 24 24" fill={c}><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.77-1.77C19.3 5.13 12 5.13 12 5.13s-7.3 0-8.83.4A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.77 1.77c1.53.4 8.83.4 8.83.4s7.3 0 8.83-.4a2.5 2.5 0 0 0 1.77-1.77C23 15.2 23 12 23 12zM9.75 15.02V8.98L15.5 12z"/></svg>;
  return null;
}
function Badge({ children, color = '#fd3737' }: { children: React.ReactNode; color?: string }) {
  return <span className="px-3 py-1 rounded-full text-[11px] font-semibold" style={{ background: `${color}22`, color }}>{children}</span>;
}
function levelColor(v: string) { return v === 'High' ? '#EF4444' : v === 'Medium' ? '#F59E0B' : '#22C55E'; }

function PlaybookRow({ w }: { w: (typeof C)['playbook'][number] }) {
  const { ref, inView } = useInView({ threshold: 0.2, rootMargin: '-20px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45 }} className="relative pl-12 md:pl-16">
      <div className="absolute left-[11px] md:left-[18px] top-6 w-3 h-3 rounded-full bg-[#fd3737] ring-4 ring-[#0A0A0A]" />
      <GlassCard className="p-6 md:p-7" hover={false}>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-display text-lg text-[#FAFAFA]">{w.week}</span>
          <Badge color="#71717A">{w.phase}</Badge>
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
export function TemporexWantingIsHaunting() {
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
    ['overview', 'Overview'], ['rollout', 'Rollout'], ['spend', 'Digital Spend'], ['activations', 'Activations'],
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
          <div className="hidden lg:flex gap-6 text-[12px] text-[#B8B8C0]">
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

      {/* HERO */}
      <div ref={heroRef} className="relative h-[80vh] min-h-[560px] flex items-end overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/temporex-fantastic-machine/hero.png" alt="" className="w-full h-full object-cover" />
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
          <p className="text-[#E4E4E9] text-base md:text-lg mt-6 max-w-2xl">Album marketing plan: creative-asset rollout, digital spend, and activation concepts. {C.campaignWindow}.</p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-8 text-sm text-[#B8B8C0]">
            <span>{C.homeBase}</span><span>·</span><span>{C.label}</span><span>·</span><span>Release: {C.releaseDate}</span>
          </div>
        </motion.div>
      </div>

      {/* 01 OVERVIEW */}
      <Section id="overview" number="01" title="Overview" subtitle={C.overview.headline}>
        <GlassCard className="p-8 md:p-10 mb-10 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <p className="text-[#E4E4E9] text-base md:text-lg leading-relaxed">{C.overview.body}</p>
        </GlassCard>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {C.overview.stats.map((st, i) => (
            <GlassCard key={i} className="p-6">
              <div className="font-display text-3xl md:text-4xl" style={{ color: st.tone === 'good' ? '#fd3737' : '#FAFAFA' }}>{st.value}</div>
              <div className="text-[#B8B8C0] text-xs mt-2 leading-snug">{st.label}</div>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* 02 ROLLOUT */}
      <Section id="rollout" number="02" title="The Rollout" subtitle="The release cadence, and the asset ladder that repeats on every single.">
        <div className="mb-12">
          <div className="text-[11px] uppercase tracking-wider text-[#fd3737] mb-4">Release calendar</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {C.calendar.map((c, i) => (
              <GlassCard key={i} className={`p-5 text-center ${c.kind === 'ep' ? 'border-2 border-[#fd3737]/50' : c.kind === 'announce' ? 'border-l-2 border-l-[#fd3737]' : ''}`}>
                <div className="font-display text-2xl text-[#FAFAFA]">{c.date}</div>
                <div className="text-[#B8B8C0] text-xs mt-1 leading-snug">{c.label}</div>
              </GlassCard>
            ))}
          </div>
        </div>
        <div id="assets" className="scroll-mt-24">
          <div className="text-[11px] uppercase tracking-wider text-[#fd3737] mb-4">Asset rollout · every single, in relative days</div>
          <GlassCard className="p-6 md:p-8 mb-4" hover={false}>
            <p className="text-[#E4E4E9] text-sm md:text-base leading-relaxed">{C.assetLadder.intro}</p>
            <p className="text-[#B8B8C0] text-xs md:text-sm leading-relaxed mt-4 pt-4 border-t border-[#333333]/60"><span className="text-[#fd3737]">Deliverable base: </span>{C.assetLadder.spec}</p>
          </GlassCard>
          <div className="space-y-2">
            {C.assetLadder.rows.map((r, i) => (
              <GlassCard key={i} className="p-4 md:p-5" hover={false}>
                <div className="flex items-start gap-4">
                  <div className="font-display text-lg md:text-xl text-[#fd3737] w-16 md:w-24 shrink-0">{r.day}</div>
                  <div className="flex-1">
                    <div className="text-[#FAFAFA] text-sm md:text-base leading-snug">{r.asset}</div>
                    <div className="text-[#B8B8C0] text-xs mt-1 leading-relaxed">{r.note}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
          <GlassCard className="p-5 mt-4 border-l-2 border-l-[#fd3737]" hover={false}>
            <p className="text-[#E4E4E9] text-sm leading-relaxed"><span className="text-[#fd3737] font-semibold">Album: </span>{C.assetLadder.albumNote}</p>
          </GlassCard>
        </div>
      </Section>
      <SectionDivider />

      {/* 03 DIGITAL SPEND */}
      <Section id="spend" number="03" title="Digital Spend" subtitle="The full $14K, by drop and by channel. About $12K deployed now, ~$2K held in reserve.">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {C.budgets.perDrop.map((d, i) => (
            <GlassCard key={i} className="p-6">
              <div className="text-[#B8B8C0] text-xs mb-1">{d.drop}</div>
              <div className="font-display text-3xl text-[#fd3737]">{d.amount}</div>
              <p className="text-[#E4E4E9] text-xs leading-relaxed mt-3">{d.allocation}</p>
            </GlassCard>
          ))}
          <GlassCard className="p-6 border-l-2 border-l-[#fd3737]" hover={false}>
            <div className="text-[#B8B8C0] text-xs mb-1">Reserve</div>
            <div className="font-display text-3xl text-[#fd3737]">$2,000</div>
            <p className="text-[#E4E4E9] text-xs leading-relaxed mt-3">{C.budgets.reserveNote}</p>
          </GlassCard>
        </div>
        <div className="text-[11px] uppercase tracking-wider text-[#fd3737] mb-4">Where the $12K goes, by channel</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {C.budgets.byChannel.map((c, i) => (
            <GlassCard key={i} className="p-5 text-center" hover={false}>
              <div className="font-display text-2xl text-[#FAFAFA]">{c.amount}</div>
              <div className="text-[#B8B8C0] text-xs mt-1 leading-snug">{c.channel}</div>
            </GlassCard>
          ))}
        </div>
        <p className="text-[#B8B8C0] text-xs italic">{C.budgets.note}</p>
      </Section>
      <SectionDivider />

      {/* 04 ACTIVATIONS */}
      <Section id="activations" number="04" title="Creative Activations" subtitle="Three greenlight-later plays that build the Fantastic Machine world and capture owned audience. Pitch concepts, not costed against the $14K.">
        <div className="grid lg:grid-cols-3 gap-6">
          {C.worldBuilding.map((p, i) => (
            <GlassCard key={i} className="p-7 flex flex-col">
              <div className="text-[#fd3737] text-[11px] uppercase tracking-wider mb-2">{p.format}</div>
              <h4 className="font-display text-lg text-[#FAFAFA] mb-3 leading-snug">{p.name}</h4>
              <p className="text-[#E4E4E9] text-sm leading-relaxed mb-4">{p.bit}</p>
              <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0] mb-1 mt-auto">Why</div>
              <p className="text-[#E4E4E9] text-sm leading-relaxed">{p.why}</p>
              {p.refs.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#333333]/60">
                  <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0] mb-2">References</div>
                  <div className="space-y-1">
                    {p.refs.map((r, k) => (
                      <a key={k} href={r.url} target="_blank" rel="noopener noreferrer" className="block text-[#E4E4E9] text-xs hover:text-[#fd3737] transition-colors">{r.label} ↗</a>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* footer */}
      <div className="relative mt-16 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/temporex-fantastic-machine/closing.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="font-display text-2xl md:text-3xl text-[#FAFAFA]">{C.artist} — <span className="text-[#fd3737] lowercase">{C.song}</span></p>
          <p className="text-[#B8B8C0] text-sm mt-4">Crowd Control Digital · Temporex album marketing plan</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control Digital" className="h-6 w-auto mx-auto mt-8 opacity-80" />
          <p className="text-[#71717A] text-xs mt-3">Crowd Control Digital · info@crowdcontroldigital.com · Generated {C.generatedDate}</p>
        </div>
      </div>
    </div>
  );
}

export default TemporexWantingIsHaunting;
