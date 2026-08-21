'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { govanniSay2Much as C } from '@/lib/data/govanni-say-2-much';

/* ───────────────── hooks ───────────────── */
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

/* ───────────────── primitives ───────────────── */
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
    <section id={id} className="max-w-6xl mx-auto px-6 py-20 md:py-28 scroll-mt-16">
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
    <motion.div
      variants={fadeUp}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A1A]/80 to-[#141414]/50 border border-[#333333]/60 ${hover ? 'hover:border-[#fd3737]/40 hover:shadow-lg hover:shadow-[#fd3737]/5 transition-all duration-500' : ''} ${glow ? 'shadow-lg shadow-[#fd3737]/5 border-[#fd3737]/20' : ''} ${className}`}
    >{children}</motion.div>
  );
}

function Badge({ children, color = '#fd3737' }: { children: React.ReactNode; color?: string }) {
  return <span className="px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ background: `${color}22`, color }}>{children}</span>;
}

function AnimatedNumber({ value, duration = 1400 }: { value: string; duration?: number }) {
  const { ref, inView } = useInView({ threshold: 0.4 });
  const [display, setDisplay] = useState('0');
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ''));
  const hasNum = !Number.isNaN(numeric) && numeric > 0;
  useEffect(() => {
    if (!inView || !hasNum) { if (!hasNum) setDisplay(value); return; }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = numeric * eased;
      const decimals = value.includes('.') ? 1 : 0;
      const formatted = cur.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      setDisplay(value.replace(/[0-9,.]+/, formatted));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return <span ref={ref}>{display}</span>;
}

function AnimatedBar({ percent, color = '#fd3737', delay = 0 }: { percent: number; color?: string; delay?: number }) {
  const { ref, inView } = useInView({ threshold: 0.3 });
  return (
    <div ref={ref} className="h-2 w-full rounded-full bg-[#262626] overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: inView ? `${percent}%` : 0 }}
        transition={{ duration: 1.1, delay, ease: 'easeOut' }}
      />
    </div>
  );
}

/* ───────────────── the inversion chart ───────────────── */
function InversionChart() {
  const { ref, inView } = useInView({ threshold: 0.25 });
  const d = C.standing.listenerSeries;
  const W = 900, H = 300, PAD_L = 8, PAD_R = 8, PAD_T = 24, PAD_B = 34;
  const iw = W - PAD_L - PAD_R, ih = H - PAD_T - PAD_B;
  const maxL = 500000, maxF = 45000;
  const x = (i: number) => PAD_L + (i / (d.length - 1)) * iw;
  const yL = (v: number) => PAD_T + ih - (v / maxL) * ih;
  const yF = (v: number) => PAD_T + ih - (v / maxF) * ih;
  const pathL = d.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${yL(p.listeners).toFixed(1)}`).join(' ');
  const pathF = d.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${yF(p.followers).toFixed(1)}`).join(' ');

  return (
    <div ref={ref}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-5">
        <span className="flex items-center gap-2 text-[13px] text-[#E4E4E9]">
          <span className="inline-block w-6 h-[3px] rounded" style={{ background: '#A1A1AA' }} />
          Monthly listeners
        </span>
        <span className="flex items-center gap-2 text-[13px] text-[#E4E4E9]">
          <span className="inline-block w-6 h-[3px] rounded" style={{ background: '#fd3737' }} />
          Spotify followers
        </span>
      </div>
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[560px] h-auto" role="img" aria-label="Monthly listeners falling while Spotify followers rise, November 2025 to August 2026">
          {[0, 0.25, 0.5, 0.75, 1].map((g) => (
            <line key={g} x1={PAD_L} x2={W - PAD_R} y1={PAD_T + ih * g} y2={PAD_T + ih * g} stroke="#333333" strokeWidth="1" strokeDasharray="3 5" />
          ))}
          <motion.path d={pathL} fill="none" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.6, ease: 'easeOut' }} />
          <motion.path d={pathF} fill="none" stroke="#fd3737" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.6, delay: 0.25, ease: 'easeOut' }} />
          {d.map((p, i) => (
            <motion.circle key={`f${i}`} cx={x(i)} cy={yF(p.followers)} r="3.5" fill="#fd3737"
              initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ delay: 0.9 + i * 0.05 }} />
          ))}
          {d.map((p, i) => (
            <text key={`t${i}`} x={x(i)} y={H - 10} textAnchor="middle" fontSize="11" fill="#B8B8C0">
              {p.month.split(' ')[0]}
            </text>
          ))}
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="rounded-xl bg-[#141414] border border-[#333333]/60 p-4">
          <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0]">Listeners, Dec to Aug</div>
          <div className="font-display text-2xl md:text-3xl text-[#A1A1AA] mt-1">Down 44%</div>
        </div>
        <div className="rounded-xl bg-[#141414] border border-[#fd3737]/30 p-4">
          <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0]">Followers, Nov to Aug</div>
          <div className="font-display text-2xl md:text-3xl text-[#fd3737] mt-1">Up 60%</div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── page ───────────────── */
export function GoVanniSay2Much() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const gx = useSpring(mx, { stiffness: 60, damping: 20 });
  const gy = useSpring(my, { stiffness: 60, damping: 20 });
  useEffect(() => {
    const h = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, [mx, my]);

  const [menuOpen, setMenuOpen] = useState(false);
  const nav: [string, string][] = [
    ['read', 'The Read'], ['standing', 'Where He Stands'], ['diagnosis', 'Diagnosis'],
    ['budget', 'Budget'], ['test', 'The Test'], ['readout', 'Measurement'],
    ['free', 'Free Levers'], ['phase2', 'Phase 2'], ['assets', 'Assets'], ['risks', 'Risks'],
  ];

  const maxMarket = C.standing.markets[0].listeners;
  const maxCity = C.standing.cities[0].listeners;

  return (
    <div className="bg-[#0A0A0A] text-[#FAFAFA] min-h-screen relative">
      <ScrollProgress />
      <motion.div className="pointer-events-none fixed w-[420px] h-[420px] rounded-full bg-[#fd3737]/10 blur-[120px] z-0 hidden md:block" style={{ left: gx, top: gy, x: '-50%', y: '-50%' }} />

      {/* nav */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-[#0A0A0A]/80 border-b border-[#333333]/40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control Digital" className="h-5 w-auto opacity-90" />
          <div className="hidden xl:flex gap-5 text-[11px] text-[#B8B8C0]">
            {nav.map(([id, label]) => <a key={id} href={`#${id}`} className="uppercase tracking-wide hover:text-[#fd3737] transition-colors">{label}</a>)}
          </div>
          <button onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={menuOpen} className="xl:hidden text-[#FAFAFA] p-2 -mr-2">
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            )}
          </button>
        </div>
        {menuOpen && (
          <div className="xl:hidden border-t border-[#333333]/40 bg-[#0A0A0A]/95">
            <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[13px] text-[#E4E4E9]">
              {nav.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className="uppercase tracking-wide hover:text-[#fd3737] transition-colors">{label}</a>)}
            </div>
          </div>
        )}
      </div>

      {/* HERO */}
      <div ref={heroRef} className="relative h-[86vh] min-h-[600px] flex items-end overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/govanni-say-2-much/artist.jpg" alt="" className="w-full h-full object-cover object-top opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A]/60" />
        </motion.div>
        <motion.div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 w-full" style={{ opacity: heroFade }}>
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge>{C.genre}</Badge>
            <Badge color="#A1A1AA">Single</Badge>
            <Badge color="#A1A1AA">{C.tier}</Badge>
            <Badge color="#A1A1AA">${C.budget} test</Badge>
          </div>
          <p className="text-[11px] tracking-[0.35em] uppercase text-[#fd3737] font-semibold mb-4">{C.hero.strap}</p>
          <h1 className="font-display text-5xl md:text-8xl leading-[0.95] text-[#FAFAFA]">{C.artist}</h1>
          <p className="font-display text-2xl md:text-4xl text-[#fd3737] mt-3">{C.song}</p>
          <p className="text-[#E4E4E9] text-base md:text-lg mt-6 max-w-2xl">{C.hero.line}</p>
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-x-10 gap-y-3 mt-8 text-sm text-[#B8B8C0]">
            <span>{C.homeBase}</span>
            <span>{C.label}</span>
            <span>Released {C.releaseDate}</span>
            <span>{C.campaignWindow}</span>
          </div>
        </motion.div>
      </div>

      {/* 01 THE READ */}
      <Section id="read" number="01" title="The Read">
        <GlassCard className="p-8 md:p-10 mb-10 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <p className="font-display text-xl md:text-3xl text-[#FAFAFA] leading-tight mb-5">{C.read.headline}</p>
          <p className="text-[#E4E4E9] text-base md:text-lg leading-relaxed">{C.read.body}</p>
        </GlassCard>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {C.read.stats.map((s) => (
            <GlassCard key={s.label} className="p-5 md:p-6">
              <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0] leading-snug">{s.label}</div>
              <div className="font-display text-3xl md:text-4xl text-[#FAFAFA] mt-2"><AnimatedNumber value={s.value} /></div>
              <div className="text-[12px] text-[#B8B8C0] mt-2 leading-snug">{s.note}</div>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="p-6 md:p-8" hover={false}>
          <InversionChart />
        </GlassCard>
      </Section>
      <SectionDivider />

      {/* 02 WHERE HE STANDS */}
      <Section id="standing" number="02" title="Where He Stands" subtitle={C.standing.subtitle}>
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <GlassCard className="p-6 md:p-8">
            <h3 className="font-display text-xl text-[#FAFAFA] mb-6">Top markets by monthly listeners</h3>
            <div className="space-y-4">
              {C.standing.markets.slice(0, 7).map((m, i) => (
                <div key={m.country}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[14px] text-[#E4E4E9]">{m.country}</span>
                    <span className="text-[13px] text-[#B8B8C0] tabular-nums">{m.listeners.toLocaleString('en-US')}</span>
                  </div>
                  <AnimatedBar percent={(m.listeners / maxMarket) * 100} color={i < 3 ? '#fd3737' : '#71717A'} delay={i * 0.06} />
                </div>
              ))}
            </div>
            <p className="text-[13px] text-[#B8B8C0] mt-6 leading-relaxed border-t border-[#333333]/60 pt-4">
              Germany and Poland ranking second and third is the finding that shapes this media plan. It is not an anomaly. OsamaSon, the most commercially successful artist in the same subgenre, routed his autumn tour through Berlin, Warsaw and Munich.
            </p>
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <h3 className="font-display text-xl text-[#FAFAFA] mb-6">Top cities</h3>
            <div className="space-y-4">
              {C.standing.cities.map((c, i) => (
                <div key={c.city}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[14px] text-[#E4E4E9]">{c.city}</span>
                    <span className="text-[13px] text-[#B8B8C0] tabular-nums">{c.listeners.toLocaleString('en-US')}</span>
                  </div>
                  <AnimatedBar percent={(c.listeners / maxCity) * 100} color={i < 3 ? '#fd3737' : '#71717A'} delay={i * 0.06} />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* socials */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {C.standing.socials.map((s) => (
            <GlassCard key={s.platform} className="p-5 md:p-6">
              <div className="text-[11px] uppercase tracking-wider text-[#fd3737] font-semibold">{s.platform}</div>
              <div className="font-display text-3xl md:text-4xl text-[#FAFAFA] mt-2">
                <AnimatedNumber value={s.followers.toLocaleString('en-US')} />
              </div>
              <div className="text-[12px] text-[#E4E4E9] mt-1">{s.handle}</div>
              <div className="text-[12px] text-[#B8B8C0] mt-2 leading-snug">{s.note}</div>
            </GlassCard>
          ))}
        </div>

        {/* demographics */}
        <div className="grid lg:grid-cols-2 gap-6">
          <GlassCard className="p-6 md:p-8">
            <h3 className="font-display text-xl text-[#FAFAFA] mb-6">Age and gender</h3>
            <div className="space-y-4 mb-6">
              {C.standing.demographics.age.map((a, i) => (
                <div key={a.bracket}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[14px] text-[#E4E4E9]">{a.bracket}</span>
                    <span className="text-[13px] text-[#B8B8C0] tabular-nums">{a.percent}%</span>
                  </div>
                  <AnimatedBar percent={a.percent * 2} color={a.percent > 30 ? '#fd3737' : '#71717A'} delay={i * 0.06} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mb-4">
              {C.standing.demographics.gender.map((g, i) => (
                <div key={g.label} className="flex-1 rounded-xl bg-[#141414] border border-[#333333]/60 p-4">
                  <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0]">{g.label}</div>
                  <div className="font-display text-2xl mt-1" style={{ color: i === 0 ? '#fd3737' : '#E4E4E9' }}>{g.percent}%</div>
                </div>
              ))}
            </div>
            <p className="text-[13px] text-[#B8B8C0] leading-relaxed border-t border-[#333333]/60 pt-4">{C.standing.demographics.ageNote}</p>
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <h3 className="font-display text-xl text-[#FAFAFA] mb-2">Brand over-index</h3>
            <p className="text-[13px] text-[#B8B8C0] mb-6">Multiples above the general Instagram population.</p>
            <div className="space-y-4">
              {C.standing.demographics.affinities.map((a, i) => (
                <div key={a.name}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[14px] text-[#E4E4E9]">{a.name}</span>
                    <span className="text-[13px] text-[#fd3737] tabular-nums font-semibold">{a.index}x</span>
                  </div>
                  <AnimatedBar percent={(a.index / 7) * 100} color={i === 0 ? '#fd3737' : '#71717A'} delay={i * 0.06} />
                </div>
              ))}
            </div>
            <p className="text-[13px] text-[#B8B8C0] mt-6 leading-relaxed border-t border-[#333333]/60 pt-4">{C.standing.demographics.affinityNote}</p>
          </GlassCard>
        </div>
      </Section>
      <SectionDivider />

      {/* 03 DIAGNOSIS */}
      <Section id="diagnosis" number="03" title="Diagnosis">
        <GlassCard className="p-8 md:p-10 mb-8 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <p className="font-display text-xl md:text-3xl text-[#FAFAFA] leading-tight mb-5">{C.diagnosis.headline}</p>
          <p className="text-[#E4E4E9] text-base md:text-lg leading-relaxed">{C.diagnosis.body}</p>
        </GlassCard>
        <div className="grid md:grid-cols-2 gap-4">
          {C.diagnosis.evidence.map((e) => (
            <GlassCard key={e.title} className="p-6">
              <h4 className="font-display text-lg text-[#FAFAFA] mb-2">{e.title}</h4>
              <p className="text-[14px] text-[#B8B8C0] leading-relaxed">{e.detail}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* 04 BUDGET */}
      <Section id="budget" number="04" title="Budget">
        <GlassCard className="p-8 md:p-10 mb-8 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <p className="font-display text-xl md:text-3xl text-[#FAFAFA] leading-tight mb-5">{C.budget_talk.headline}</p>
          <p className="text-[#E4E4E9] text-base md:text-lg leading-relaxed">{C.budget_talk.body}</p>
        </GlassCard>
        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard className="p-6 md:p-8">
            <h4 className="font-display text-lg text-[#B8B8C0] mb-5 uppercase tracking-wider text-[13px]">What it will not do</h4>
            <ul className="space-y-3">
              {C.budget_talk.cannot.map((t) => (
                <li key={t} className="flex gap-3 text-[15px] text-[#E4E4E9] leading-relaxed">
                  <span className="text-[#71717A] mt-0.5 shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard className="p-6 md:p-8" glow>
            <h4 className="font-display text-lg text-[#fd3737] mb-5 uppercase tracking-wider text-[13px]">What it will do</h4>
            <ul className="space-y-3">
              {C.budget_talk.can.map((t) => (
                <li key={t} className="flex gap-3 text-[15px] text-[#E4E4E9] leading-relaxed">
                  <span className="text-[#fd3737] mt-0.5 shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </Section>
      <SectionDivider />

      {/* 05 THE TEST */}
      <Section id="test" number="05" title="The First Test">
        <GlassCard className="p-8 md:p-10 mb-8 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <p className="font-display text-xl md:text-3xl text-[#FAFAFA] leading-tight mb-5">{C.test.headline}</p>
          <p className="text-[#E4E4E9] text-base md:text-lg leading-relaxed mb-4">{C.test.thesis}</p>
          <p className="text-[#B8B8C0] text-[15px] leading-relaxed">{C.test.whyNotUS}</p>
        </GlassCard>

        {/* cells */}
        <div className="grid lg:grid-cols-3 gap-5 mb-10">
          {C.test.cells.map((cell) => (
            <GlassCard key={cell.id} className="p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-[#fd3737] font-semibold">Cell {cell.id}</div>
                  <h4 className="font-display text-xl text-[#FAFAFA] mt-1.5 leading-tight">{cell.name}</h4>
                </div>
                <div className="font-display text-3xl text-[#fd3737] shrink-0 ml-3">${cell.spend}</div>
              </div>
              <div className="space-y-2.5 mb-4 pb-4 border-b border-[#333333]/60">
                {[
                  ['Platform', cell.platform],
                  ['Market', cell.geo],
                  ['Objective', cell.objective],
                  ['Flight', `${cell.days} days at ${cell.daily} per day`],
                  ['Est. impressions', cell.estImpressions],
                  ['Est. CPM', cell.cpm],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 text-[13px]">
                    <span className="text-[#B8B8C0] shrink-0">{k}</span>
                    <span className="text-[#E4E4E9] text-right">{v}</span>
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-[#B8B8C0] leading-relaxed">{cell.rationale}</p>
            </GlassCard>
          ))}
        </div>

        {/* targeting */}
        <h3 className="font-display text-2xl text-[#FAFAFA] mb-5">Targeting</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {([
            ['Age', C.test.targeting.age, C.test.targeting.ageRationale],
            ['Gender', C.test.targeting.gender, C.test.targeting.genderRationale],
            ['Interests', C.test.targeting.interests, C.test.targeting.interestsRationale],
            ['Placements', C.test.targeting.placements, C.test.targeting.placementsRationale],
          ] as [string, string, string][]).map(([label, value, why]) => (
            <GlassCard key={label} className="p-6">
              <div className="text-[11px] uppercase tracking-[0.25em] text-[#fd3737] font-semibold mb-2">{label}</div>
              <p className="font-display text-lg text-[#FAFAFA] mb-3 leading-snug">{value}</p>
              <p className="text-[13px] text-[#B8B8C0] leading-relaxed">{why}</p>
            </GlassCard>
          ))}
        </div>

        {/* creative */}
        <h3 className="font-display text-2xl text-[#FAFAFA] mb-3">Creative slots</h3>
        <p className="text-[#B8B8C0] text-[15px] mb-2 max-w-3xl leading-relaxed">{C.test.creative.note}</p>
        <p className="text-[#B8B8C0] text-[14px] mb-6 max-w-3xl leading-relaxed">{C.test.creative.specs}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {C.test.creative.slots.map((s) => (
            <GlassCard key={s.id} className="p-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-display text-2xl text-[#fd3737]">{String(s.id).padStart(2, '0')}</span>
                <h4 className="font-display text-lg text-[#FAFAFA]">{s.name}</h4>
              </div>
              <p className="text-[14px] text-[#B8B8C0] leading-relaxed">{s.direction}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* 06 MEASUREMENT */}
      <Section id="readout" number="06" title="Measurement">
        <GlassCard className="p-8 md:p-10 mb-8 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <p className="font-display text-xl md:text-3xl text-[#FAFAFA] leading-tight mb-5">{C.readout.headline}</p>
          <p className="text-[#E4E4E9] text-base md:text-lg leading-relaxed">{C.readout.holdRule}</p>
        </GlassCard>

        <GlassCard className="p-0 overflow-hidden mb-8" hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead>
                <tr className="border-b border-[#333333]">
                  <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-[#B8B8C0] font-semibold">Metric</th>
                  <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-[#B8B8C0] font-semibold">Good</th>
                  <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-[#fd3737] font-semibold">Great</th>
                  <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-[#B8B8C0] font-semibold">Note</th>
                </tr>
              </thead>
              <tbody>
                {C.readout.thresholds.map((t, i) => (
                  <tr key={t.metric} className={i % 2 ? 'bg-[#141414]/50' : ''}>
                    <td className="px-6 py-4 text-[14px] text-[#FAFAFA] font-medium">{t.metric}</td>
                    <td className="px-6 py-4 text-[14px] text-[#E4E4E9] tabular-nums">{t.good}</td>
                    <td className="px-6 py-4 text-[14px] text-[#fd3737] tabular-nums font-semibold">{t.great || 'Not applicable'}</td>
                    <td className="px-6 py-4 text-[13px] text-[#B8B8C0]">{t.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard className="p-6 md:p-8" glow>
            <h4 className="font-display text-lg text-[#FAFAFA] mb-3">Picking the winner</h4>
            <p className="text-[15px] text-[#E4E4E9] leading-relaxed">{C.readout.winnerRule}</p>
          </GlassCard>
          <GlassCard className="p-6 md:p-8">
            <h4 className="font-display text-lg text-[#FAFAFA] mb-4">What you get back</h4>
            <ul className="space-y-2.5">
              {C.readout.deliverables.map((d) => (
                <li key={d} className="flex gap-3 text-[14px] text-[#E4E4E9] leading-relaxed">
                  <span className="text-[#fd3737] mt-0.5 shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </Section>
      <SectionDivider />

      {/* 07 FREE LEVERS */}
      <Section id="free" number="07" title="Free Levers" subtitle={C.free.headline}>
        <div className="grid md:grid-cols-2 gap-4">
          {C.free.items.map((f) => (
            <GlassCard key={f.title} className="p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="font-display text-lg text-[#FAFAFA] leading-snug">{f.title}</h4>
                <Badge color={f.cost === 'No cash cost' ? '#fd3737' : '#A1A1AA'}>{f.cost}</Badge>
              </div>
              <p className="text-[14px] text-[#B8B8C0] leading-relaxed">{f.detail}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* 08 PHASE 2 */}
      <Section id="phase2" number="08" title="Phase 2">
        <GlassCard className="p-8 md:p-10 mb-8 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <p className="font-display text-xl md:text-3xl text-[#FAFAFA] leading-tight mb-5">{C.phase2.headline}</p>
          <p className="text-[#E4E4E9] text-base md:text-lg leading-relaxed mb-6">{C.phase2.body}</p>
          <div className="rounded-xl bg-[#141414] border border-[#fd3737]/25 p-5">
            <div className="text-[11px] uppercase tracking-[0.25em] text-[#fd3737] font-semibold mb-2">Timing</div>
            <p className="font-display text-lg text-[#FAFAFA] mb-2">{C.phase2.timing}</p>
            <p className="text-[14px] text-[#B8B8C0] leading-relaxed">{C.phase2.timingReason}</p>
          </div>
        </GlassCard>
        <div className="grid md:grid-cols-2 gap-4">
          {C.phase2.moves.map((m) => (
            <GlassCard key={m.title} className="p-6">
              <h4 className="font-display text-lg text-[#FAFAFA] mb-2">{m.title}</h4>
              <p className="text-[14px] text-[#B8B8C0] leading-relaxed">{m.detail}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* 09 ASSETS */}
      <Section id="assets" number="09" title="Assets Needed" subtitle={C.assets.headline}>
        <div className="grid md:grid-cols-2 gap-4">
          {C.assets.items.map((a) => (
            <GlassCard key={a.item} className="p-6">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-display text-lg text-[#FAFAFA] leading-snug">{a.item}</h4>
                <Badge color={a.priority === 'Blocking' ? '#fd3737' : '#A1A1AA'}>{a.priority}</Badge>
              </div>
              <p className="text-[14px] text-[#B8B8C0] leading-relaxed">{a.detail}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* 10 RISKS */}
      <Section id="risks" number="10" title="Risks">
        <div className="grid md:grid-cols-2 gap-4">
          {C.risks.map((r) => (
            <GlassCard key={r.title} className="p-6">
              <h4 className="font-display text-lg text-[#FAFAFA] mb-3 leading-snug">{r.title}</h4>
              <div className="flex gap-2 mb-4">
                <Badge color={r.likelihood === 'High' ? '#fd3737' : '#A1A1AA'}>{r.likelihood} likelihood</Badge>
                <Badge color={r.impact === 'High' ? '#fd3737' : '#A1A1AA'}>{r.impact} impact</Badge>
              </div>
              <div className="mb-3">
                <div className="text-[11px] uppercase tracking-wider text-[#B8B8C0] mb-1">Signal</div>
                <p className="text-[14px] text-[#E4E4E9] leading-relaxed">{r.signal}</p>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#fd3737] mb-1">Response</div>
                <p className="text-[14px] text-[#B8B8C0] leading-relaxed">{r.response}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-[#333333]/40 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#fd3737] font-semibold mb-4">Sources</h4>
          <ul className="space-y-1.5 mb-6">
            {C.sources.map((s) => <li key={s} className="text-[13px] text-[#B8B8C0]">{s}</li>)}
          </ul>
          <p className="text-[13px] text-[#B8B8C0] leading-relaxed max-w-3xl mb-8 border-t border-[#333333]/40 pt-5">{C.sourceNote}</p>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-[#333333]/40 pt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control Digital" className="h-5 w-auto opacity-70" />
            <div className="text-[13px] text-[#B8B8C0]">
              Crowd Control Digital
              <span className="mx-3 text-[#333333]">|</span>
              info@crowdcontroldigital.com
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
