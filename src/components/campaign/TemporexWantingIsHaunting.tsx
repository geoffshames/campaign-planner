'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';
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
function Badge({ children, color = '#fd3737' }: { children: React.ReactNode; color?: string }) {
  return <span className="px-3 py-1 rounded-full text-[11px] font-semibold" style={{ background: `${color}22`, color }}>{children}</span>;
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
    ['overview', 'Overview'], ['rollout', 'Rollout'], ['persingle', 'Per Single'], ['spend', 'Digital Spend'], ['activations', 'Activations'],
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
        <div className="mt-10">
          <div className="text-[11px] uppercase tracking-wider text-[#fd3737] mb-4">Video + live footage — where it goes</div>
          <div className="grid md:grid-cols-2 gap-4">
            <GlassCard className="p-6" hover={false}>
              <h4 className="font-display text-base text-[#FAFAFA] mb-2">Live performance · the hero content</h4>
              <p className="text-[#E4E4E9] text-sm leading-relaxed">{C.videoFootage.live}</p>
            </GlassCard>
            <GlassCard className="p-6" hover={false}>
              <h4 className="font-display text-base text-[#FAFAFA] mb-2">The two music videos</h4>
              <p className="text-[#E4E4E9] text-sm leading-relaxed">{C.videoFootage.videos}</p>
            </GlassCard>
          </div>
        </div>
      </Section>
      <SectionDivider />

      {/* 03 PER-SINGLE BREAKOUT */}
      <Section id="persingle" number="03" title="Per-Single Breakout" subtitle="Every single, broken out: the exact assets and where each one goes.">
        <div className="space-y-5">
          {C.perSingle.map((sg, i) => (
            <GlassCard key={i} className={`p-6 md:p-7 ${sg.kind === 'ep' ? 'border-l-2 border-l-[#fd3737]' : ''}`} hover={false}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h4 className="font-display text-lg md:text-xl text-[#FAFAFA]">{sg.name}</h4>
                <Badge color="#A1A1AA">{sg.timing}</Badge>
                {sg.kind === 'video' && <Badge>music video</Badge>}
                {sg.kind === 'ep' && <Badge>album</Badge>}
              </div>
              <div>
                {sg.assets.map((a, j) => (
                  <div key={j} className="grid md:grid-cols-2 gap-1 md:gap-4 py-2 border-t border-[#333333]/50">
                    <div className="text-[#FAFAFA] text-sm leading-snug">{a.a}</div>
                    <div className="text-[#B8B8C0] text-sm leading-snug"><span className="text-[#fd3737]">→ </span>{a.w}</div>
                  </div>
                ))}
              </div>
              <p className="text-[#B8B8C0] text-xs italic mt-4">{sg.note}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* 04 DIGITAL SPEND */}
      <Section id="spend" number="04" title="Digital Spend" subtitle="The full $14K, by drop and by channel. About $12K deployed now, ~$2K held in reserve.">
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
      <Section id="activations" number="05" title="Creative Activations" subtitle="Three greenlight-later plays that build the Fantastic Machine world and capture owned audience. Pitch concepts, not costed against the $14K.">
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
