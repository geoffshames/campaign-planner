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
    ['diagnosis', 'Diagnosis'], ['comps', 'Comp Teardown'], ['video', 'Video Intel'],
    ['strategy', 'Strategy'], ['system', 'Content System'], ['ideas', 'Ideas'], ['playbook', 'Playbook'],
    ['channels', 'Channels'], ['clipping', 'Clipping'], ['swrm', 'SWRM'], ['dsp', 'DSP'],
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

      {/* ═══ 01 HERO ═══ */}
      <div ref={heroRef} className="relative h-[88vh] min-h-[600px] flex items-end overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/temporex-wanting-is-haunting/hero.png" alt="" className="w-full h-full object-cover" />
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
          <p className="text-[#E4E4E9] text-base md:text-lg mt-6 max-w-2xl">Content strategy + EP rollout playbook. {C.campaignWindow}.</p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-8 text-sm text-[#B8B8C0]">
            <span>{C.homeBase}</span><span>·</span><span>{C.label}</span><span>·</span><span>Release: {C.releaseDate}</span>
          </div>
        </motion.div>
      </div>

      {/* ═══ 02 DIAGNOSIS ═══ */}
      <Section id="diagnosis" number="01" title="The Diagnosis" subtitle={C.diagnosis.headline}>
        <GlassCard className="p-8 md:p-10 mb-10 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <p className="text-[#E4E4E9] text-base md:text-lg leading-relaxed">{C.diagnosis.body}</p>
        </GlassCard>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {C.diagnosis.stats.map((s, i) => (
            <GlassCard key={i} className="p-6">
              <div className="font-display text-3xl md:text-4xl" style={{ color: s.tone === 'good' ? '#fd3737' : '#FAFAFA' }}>{s.value}</div>
              <div className="text-[#B8B8C0] text-xs mt-2 leading-snug">{s.label}</div>
            </GlassCard>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-6">Audience vs. reach</h3>
            <div className="space-y-5">
              {C.diagnosis.social.map((s, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-[#E4E4E9] text-sm"><PlatformIcon platform={s.platform} /> {s.platform}</span>
                    <span className="font-display text-xl text-[#FAFAFA]">{s.value}</span>
                  </div>
                  <AnimatedBar pct={s.pct} color={i === 0 ? '#fd3737' : '#71717A'} />
                  <div className="text-[#B8B8C0] text-xs mt-1">{s.sub}</div>
                </div>
              ))}
            </div>
            <p className="text-[#B8B8C0] text-xs mt-6 leading-relaxed">Bars scaled to the Spotify base. The streaming audience dwarfs the social footprint — that gap is the opportunity.</p>
          </GlassCard>
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-5">Context</h3>
            <ul className="space-y-4">
              {C.diagnosis.context.map((c, i) => (
                <li key={i} className="flex gap-3 text-[#E4E4E9] text-sm leading-relaxed"><span className="text-[#fd3737] mt-1">▹</span>{c}</li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-[#333333]/60">
              <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0] mb-3">Top live markets</div>
              <div className="flex flex-wrap gap-2">{C.diagnosis.liveMarkets.map((m, i) => <span key={i} className="px-3 py-1 rounded-full bg-[#262626]/80 text-[#E4E4E9] text-xs border border-[#333333]/50">{m}</span>)}</div>
            </div>
          </GlassCard>
        </div>
      </Section>
      <SectionDivider />

      {/* ═══ 03 COMP TEARDOWN ═══ */}
      <Section id="comps" number="02" title="Comp Content Teardown" subtitle="How the reference artists actually post — cadence, hooks and the formats that win. Three dance benchmarks, plus two NYC / persona references.">
        <div className="grid lg:grid-cols-3 gap-6">
          {C.comps.map((a, i) => (
            <GlassCard key={i} className="p-7 flex flex-col">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl text-[#FAFAFA]">{a.name}</h3>
                <span className="text-[#B8B8C0] text-xs">{a.handle}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 mb-4">
                <Badge color="#A1A1AA">{a.followers}</Badge>
              </div>
              <div className="text-[#E4E4E9] text-xs space-y-1 mb-4">
                <div><span className="text-[#B8B8C0]">Cadence:</span> {a.volume}</div>
                <div><span className="text-[#B8B8C0]">Engagement:</span> {a.engagement}</div>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-[#fd3737] mb-2">Winning formats</div>
              <ul className="space-y-2 mb-4">
                {a.formats.map((f, j) => <li key={j} className="flex gap-2 text-[#E4E4E9] text-sm leading-snug"><span className="text-[#fd3737] mt-0.5">▹</span>{f}</li>)}
              </ul>
              <div className="text-[#B8B8C0] text-xs mb-2"><span className="text-[#E4E4E9]">Signature:</span> {a.signature}</div>
              <div className="rounded-xl bg-[#0A0A0A]/60 border border-[#333333]/50 p-3 text-xs text-[#E4E4E9] mb-4">★ {a.topPost}</div>
              <div className="mt-auto pt-4 border-t border-[#333333]/60 text-sm text-[#E4E4E9] leading-relaxed"><span className="text-[#fd3737] font-semibold">Takeaway: </span>{a.takeaway}</div>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="p-6 mt-6" hover={false}><p className="text-[#B8B8C0] text-sm">{C.compNote}</p></GlassCard>
      </Section>
      <SectionDivider />

      {/* ═══ 04 VIDEO INTELLIGENCE ═══ */}
      <Section id="video" number="03" title="Video Intelligence" subtitle={C.videoIntel.summary}>
        <div className="flex items-center gap-3 mb-8">
          <Badge>TwelveLabs Pegasus</Badge>
          <span className="text-[#B8B8C0] text-sm">{C.videoIntel.analyzed > 0 ? `${C.videoIntel.analyzed} top comp videos analyzed frame-by-frame` : `Pattern library + lane data — comp deep-dive pending`}</span>
        </div>
        <div className="text-[11px] uppercase tracking-wider text-[#fd3737] mb-4">Cross-video patterns</div>
        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {C.videoIntel.patterns.map((p, i) => (
            <GlassCard key={i} className="p-7">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-display text-lg text-[#FAFAFA]">{p.pattern}</h4>
              </div>
              <Badge color="#A1A1AA">{p.prevalence}</Badge>
              <p className="text-[#E4E4E9] text-sm leading-relaxed mt-3">{p.implication}</p>
            </GlassCard>
          ))}
        </div>
        {C.videoIntel.videos.length > 0 && (
          <>
            <div className="text-[11px] uppercase tracking-wider text-[#fd3737] mb-4">Deep-dive · all {C.videoIntel.videos.length} posts</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {C.videoIntel.videos.map((v, i) => (
                <GlassCard key={i} className="p-6">
                  <div className="text-[#B8B8C0] text-xs mb-1">{v.artist}</div>
                  <h4 className="font-display text-base text-[#FAFAFA] leading-snug">{v.title}</h4>
                  <div className="text-[#fd3737] text-xs font-semibold mt-2 mb-3">{v.plays}</div>
                  <p className="text-[#E4E4E9] text-sm leading-relaxed">{v.insight}</p>
                </GlassCard>
              ))}
            </div>
          </>
        )}
      </Section>
      <SectionDivider />

      {/* ═══ 05 STRATEGY ═══ */}
      <Section id="strategy" number="04" title="The Strategy" subtitle="One thesis, four phases.">
        <GlassCard className="p-8 md:p-12 mb-12 relative overflow-hidden" glow hover={false}>
          <div className="absolute top-0 left-0 w-1 h-full bg-[#fd3737]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/temporex-wanting-is-haunting/strategy.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
          <div className="relative">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#fd3737] font-semibold">Campaign Thesis</span>
            <p className="text-xl md:text-2xl text-[#FAFAFA] leading-relaxed mt-4">{C.thesis}</p>
          </div>
        </GlassCard>
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {C.phases.map((p, i) => (
            <GlassCard key={i} className="p-6">
              <div className="font-display text-4xl text-[#fd3737]/30">{String(i + 1).padStart(2, '0')}</div>
              <h4 className="font-display text-lg text-[#FAFAFA] mt-2">{p.name}</h4>
              <div className="text-[#B8B8C0] text-xs mb-4">{p.weeks}</div>
              <ul className="space-y-2">{p.objectives.map((o, j) => <li key={j} className="flex gap-2 text-[#E4E4E9] text-sm leading-snug"><span className="text-[#fd3737] mt-0.5">▹</span>{o}</li>)}</ul>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* ═══ 06 CONTENT SYSTEM ═══ */}
      <Section id="system" number="05" title="The Content System" subtitle="Five rinse-and-repeat formats he can batch on a phone and rotate weekly — so he is never out of content.">
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {C.formats.map((f, i) => (
            <GlassCard key={i} className="p-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-display text-2xl text-[#fd3737]">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="font-display text-xl text-[#FAFAFA]">{f.name}</h4>
              </div>
              <p className="text-[#E4E4E9] text-sm leading-relaxed mb-3">{f.what}</p>
              <div className="flex flex-wrap gap-2 mb-3">{f.platform.split(' · ').map((pl, j) => <Badge key={j} color="#A1A1AA">{pl}</Badge>)}</div>
              <p className="text-[#B8B8C0] text-xs leading-relaxed mb-2"><span className="text-[#fd3737]">Why it works: </span>{f.why}</p>
              <p className="text-[#B8B8C0] text-xs"><span className="text-[#E4E4E9]">Batch: </span>{f.batch}</p>
            </GlassCard>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <GlassCard className="p-7 border-l-2 border-l-[#fd3737]" hover={false}>
            <h4 className="font-display text-lg text-[#FAFAFA] mb-3">The algorithm play</h4>
            <p className="text-[#E4E4E9] text-sm leading-relaxed">{C.algorithmNote}</p>
          </GlassCard>
          <GlassCard className="p-7 border-l-2 border-l-[#fd3737]" hover={false}>
            <h4 className="font-display text-lg text-[#FAFAFA] mb-3">Cadence (the real fix)</h4>
            <p className="text-[#E4E4E9] text-sm leading-relaxed">{C.cadence}</p>
          </GlassCard>
        </div>
      </Section>
      <SectionDivider />

      {/* ═══ 06 CONTENT IDEAS ═══ */}
      <Section id="ideas" number="06" title="10 Content Ideas" subtitle="Specific, NYC-rooted, phone-shot bits to batch and rotate — built off the Bad Tuner content call.">
        <div className="grid md:grid-cols-2 gap-5">
          {C.ideas.map((idea, i) => (
            <GlassCard key={i} className={`p-7 ${idea.top3 ? 'border-l-2 border-l-[#fd3737]' : ''}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-display text-2xl text-[#fd3737]">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="font-display text-lg text-[#FAFAFA]">{idea.name}</h4>
                {idea.top3 && <span className="ml-auto"><Badge>Start here</Badge></span>}
              </div>
              <p className="text-[#E4E4E9] text-sm leading-relaxed mb-3">{idea.bit}</p>
              <p className="text-[#B8B8C0] text-xs mb-1">Hook: <span className="text-[#E4E4E9]">{idea.hook}</span></p>
              <p className="text-[#B8B8C0] text-xs"><span className="text-[#fd3737]">Why: </span>{idea.why}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* ═══ 07 PLAYBOOK ═══ */}
      <Section id="playbook" number="07" title="Rollout Playbook" subtitle="A production calendar backing into the five release dates — a single every month into the Oct 2 EP.">
        <div className="relative">
          <div className="absolute left-[19px] md:left-6 top-2 bottom-2 w-px bg-gradient-to-b from-[#fd3737] via-[#333333] to-transparent" />
          <div className="space-y-5">
            {C.playbook.map((w, i) => <PlaybookRow key={i} w={w} />)}
          </div>
        </div>
      </Section>
      <SectionDivider />

      {/* ═══ 08 CHANNELS ═══ */}
      <Section id="channels" number="08" title="Channel Allocation" subtitle="Where the effort and budget go. Organic content is the core because it is the only thing that fixes the underlying problem.">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <GlassCard className="p-8" hover={false}>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={C.allocation as unknown as Record<string, unknown>[]} dataKey="pct" nameKey="channel" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={2} stroke="none">
                    {C.allocation.map((a, i) => <Cell key={i} fill={a.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {C.allocation.map((a, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-[#E4E4E9]"><span className="w-3 h-3 rounded-sm" style={{ background: a.color }} />{a.channel}</span>
                  <span className="font-display text-[#FAFAFA]">{a.pct}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
          <div className="space-y-4">
            {C.allocation.map((a, i) => (
              <GlassCard key={i} className="p-5">
                <div className="flex items-center justify-between mb-1"><span className="font-display text-[#FAFAFA]">{a.channel}</span><span className="font-display text-xl" style={{ color: a.color === '#A1A1AA' || a.color === '#71717A' ? '#E4E4E9' : a.color }}>{a.pct}%</span></div>
                <p className="text-[#B8B8C0] text-xs leading-relaxed">{a.rationale}</p>
              </GlassCard>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {C.allocationPhases.map((p, i) => (
            <GlassCard key={i} className="p-5" hover={false}>
              <div className="text-[#fd3737] text-xs uppercase tracking-wider mb-2">{p.phase}</div>
              <div className="text-[#E4E4E9] text-sm leading-relaxed">{p.split}</div>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* ═══ 09 CLIPPING ═══ */}
      <Section id="clipping" number="09" title="Clipping + Amplification" subtitle={C.clipping.intro}>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {C.clipping.steps.map((s, i) => (
            <GlassCard key={i} className="p-6">
              <div className="font-display text-3xl text-[#fd3737]/30 mb-2">{String(i + 1).padStart(2, '0')}</div>
              <h4 className="font-display text-base text-[#FAFAFA] mb-2 leading-snug">{s.step}</h4>
              <p className="text-[#E4E4E9] text-sm leading-relaxed">{s.detail}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* ═══ 09 SWRM ═══ */}
      <Section id="swrm" number="10" title="SWRM · Owned Engagement Layer" subtitle={C.swrm.intro}>
        <GlassCard className="p-8 md:p-10 mb-8 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <p className="text-[#E4E4E9] text-base md:text-lg leading-relaxed">{C.swrm.why}</p>
        </GlassCard>
        <div className="grid md:grid-cols-2 gap-5">
          {C.swrm.plays.map((p, i) => (
            <GlassCard key={i} className="p-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-display text-2xl text-[#fd3737]">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="font-display text-lg text-[#FAFAFA]">{p.name}</h4>
              </div>
              <p className="text-[#E4E4E9] text-sm leading-relaxed">{p.detail}</p>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="p-6 mt-6" hover={false}><p className="text-[#B8B8C0] text-sm leading-relaxed">{C.swrm.note}</p></GlassCard>
      </Section>
      <SectionDivider />

      {/* ═══ 10 DSP ═══ */}
      <Section id="dsp" number="11" title="DSP Conversion" subtitle={C.dsp.intro}>
        <div className="grid md:grid-cols-2 gap-5">
          {C.dsp.items.map((d, i) => (
            <GlassCard key={i} className="p-7">
              <div className="flex items-center gap-2 mb-3"><PlatformIcon platform="spotify" size={20} /><h4 className="font-display text-lg text-[#FAFAFA]">{d.name}</h4></div>
              <p className="text-[#E4E4E9] text-sm leading-relaxed">{d.detail}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      {/* footer */}
      <div className="relative mt-16 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/temporex-wanting-is-haunting/closing.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="font-display text-2xl md:text-3xl text-[#FAFAFA]">{C.artist} — <span className="text-[#fd3737] lowercase">{C.song}</span></p>
          <p className="text-[#B8B8C0] text-sm mt-4">Sources: {C.sources.join(' · ')}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control Digital" className="h-6 w-auto mx-auto mt-8 opacity-80" />
          <p className="text-[#71717A] text-xs mt-3">Crowd Control Digital · info@crowdcontroldigital.com · Generated {C.generatedDate}</p>
        </div>
      </div>
    </div>
  );
}

export default TemporexWantingIsHaunting;
