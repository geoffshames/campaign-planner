'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { ResponsiveContainer, ComposedChart, BarChart, Bar, Area, Line, ReferenceArea, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip } from 'recharts';
import { loekTheOne as C, energyCurve, igReels, ttPosts, dailyStreams, havenBenchmark } from '@/lib/data/loek-the-one';

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
  // threshold 0: tall sections (7,000px+ on phones) can never show 12% of themselves in one viewport, so a ratio threshold would leave them invisible.
  const { ref, inView } = useInView({ threshold: 0 });
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
  // Neutral badge tints keep a readable text colour: #A1A1AA / #71717A are fills only, never text.
  const neutral = color === '#A1A1AA' || color === '#71717A';
  return <span className="px-3 py-1 rounded-full text-[11px] font-semibold" style={{ background: `${color}22`, color: neutral ? '#E4E4E9' : color }}>{children}</span>;
}

function levelColor(v: string) { return v === 'High' ? '#EF4444' : v === 'Medium' ? '#F59E0B' : '#22C55E'; }

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#262626] text-[#E4E4E9] border border-[#333333]">{children}</span>;
}

function fmtT(s: number) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ts = (d: string) => Date.parse(`${d}T00:00:00Z`);
function fmtMonth(v: number) { return MONTHS[new Date(v).getUTCMonth()]; }
function fmtDay(v: number) { const d = new Date(v); return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`; }
function fmtK(v: number) { return v >= 1_000_000 ? `${(v / 1_000_000).toFixed(v >= 10_000_000 ? 1 : 2)}M` : v >= 1000 ? `${Math.round(v / 1000)}K` : `${v}`; }
const axisTick = { fill: '#B8B8C0', fontSize: 11 };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SeriesTip({ active, payload, label, names }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#333333] bg-[#141414] px-4 py-3 shadow-xl text-xs">
      <div className="text-[#FAFAFA] font-semibold mb-1">{fmtDay(label)}</div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.filter((p: any) => p.value != null).map((p: any) => (
        <div key={p.dataKey} style={{ color: p.dataKey === 'followers' || p.dataKey === 'ima' || p.dataKey === 'creates' ? '#E4E4E9' : '#fd3737' }}>
          {(names && names[p.dataKey]) || p.dataKey} {Number(p.value).toLocaleString()}
        </div>
      ))}
    </div>
  );
}

function LegendDot({ color, dashed = false, children }: { color: string; dashed?: boolean; children: React.ReactNode }) {
  return <span className="flex items-center gap-2"><span className="w-4 h-[3px] rounded-full" style={{ background: dashed ? `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 7px)` : color }} />{children}</span>;
}

function roleColor(r: string) { return r === 'Treated' ? '#fd3737' : r === 'Test market' ? '#D42D2D' : r === 'Holdout' || r === 'Alt. holdout' ? '#A1A1AA' : '#71717A'; }

function InViewVideo({ src, poster, className = '' }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.play().catch(() => { /* autoplay blocked */ }); } else { el.pause(); } }, { threshold: 0.35 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" className={className} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CurveTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const e = payload.find((p: { dataKey: string }) => p.dataKey === 'energy');
  const v = payload.find((p: { dataKey: string }) => p.dataKey === 'vocal');
  return (
    <div className="rounded-xl border border-[#333333] bg-[#141414] px-4 py-3 shadow-xl text-xs">
      <div className="text-[#FAFAFA] font-semibold mb-1">{fmtT(label)}</div>
      <div className="text-[#fd3737]">Energy {e?.value}</div>
      <div className="text-[#E4E4E9]">Vocal {v?.value}</div>
    </div>
  );
}

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [v, setV] = useState('');
  const [err, setErr] = useState(false);
  const submit = () => { if (v.trim().toLowerCase() === C.password.toLowerCase()) { try { sessionStorage.setItem('loek-the-one', '1'); } catch { /* ignore */ } onUnlock(); } else setErr(true); };
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control Digital" className="h-6 w-auto mx-auto mb-10 opacity-90" />
        <p className="text-[11px] tracking-[0.35em] uppercase text-[#fd3737] font-semibold">Confidential</p>
        <h1 className="font-display text-3xl text-[#FAFAFA] mt-3">Loek — The One</h1>
        <p className="text-[#B8B8C0] text-sm mt-3">Unreleased campaign strategy for Universal Music Germany.</p>
        <input type="password" value={v} onChange={(e) => { setV(e.target.value); setErr(false); }} onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="Password" className="mt-8 w-full rounded-xl bg-[#141414] border border-[#333333] px-4 py-3 text-[#FAFAFA] placeholder:text-[#B8B8C0] focus:outline-none focus:border-[#fd3737]" />
        {err && <p className="text-[#fd3737] text-xs mt-2">That’s not it.</p>}
        <button onClick={submit} className="mt-4 w-full rounded-xl bg-[#fd3737] text-[#0A0A0A] font-semibold py-3 hover:bg-[#ff5252] transition-colors">Enter</button>
      </div>
    </div>
  );
}

export function LoekTheOne() {
  const [ok, setOk] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { if (sessionStorage.getItem('loek-the-one') === '1') setOk(true); } catch { /* ignore */ } setReady(true); }, []);
  if (!ready) return <div className="min-h-screen bg-[#0A0A0A]" />;
  if (!ok) return <Gate onUnlock={() => setOk(true)} />;
  return <Page />;
}

function Page() {
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
    ['brief', 'Brief'], ['track', 'The Track'], ['baseline', 'Baseline'], ['markets', 'Markets'], ['video', 'Video'], ['comps', 'Comps'], ['idea', 'The Idea'],
    ['examples', 'Examples'], ['system', 'Content'], ['playbook', 'Playbook'], ['ade', 'ADE'], ['measure', 'Measure'], ['budget', 'Budget'], ['next', 'Next'],
  ];
  const maxStreams = Math.max(...C.baseline.catalog.map((c) => c.streams));
  const listenerData = C.baseline.listenerSeries.map((d) => ({ ...d, t: ts(d.date) }));
  const streamData = dailyStreams.map((d) => ({ ...d, t: ts(d.date) }));
  const havenData = havenBenchmark.map((d) => ({ ...d, t: ts(d.date) }));
  const maxMarket = Math.max(...C.markets.map((m) => m.listeners));
  const maxCity = Math.max(...C.cities.map((m) => m.listeners));
  const monthTicks = ['2026-03-01', '2026-04-01', '2026-05-01', '2026-06-01', '2026-07-01', '2026-08-01', '2026-09-01'].map(ts);

  return (
    <div className="bg-[#0A0A0A] text-[#FAFAFA] min-h-screen relative">
      <ScrollProgress />
      <motion.div className="pointer-events-none fixed w-[420px] h-[420px] rounded-full bg-[#fd3737]/10 blur-[120px] z-0" style={{ left: gx, top: gy, x: '-50%', y: '-50%' }} />

      <div className="sticky top-0 z-40 backdrop-blur-md bg-[#0A0A0A]/70 border-b border-[#333333]/40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control Digital" className="h-5 w-auto opacity-90" />
          <div className="hidden xl:flex gap-3 text-[11px] text-[#B8B8C0] whitespace-nowrap">
            {nav.map(([id, label]) => <a key={id} href={`#${id}`} className="uppercase tracking-wide hover:text-[#fd3737] transition-colors">{label}</a>)}
          </div>
          <button onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={menuOpen} className="xl:hidden text-[#FAFAFA] p-2 -mr-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">{menuOpen ? (<><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></>) : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}</svg>
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
      <div ref={heroRef} className="relative h-[92vh] min-h-[640px] flex items-end overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/loek-the-one/hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(253,55,55,0.18),transparent_60%)]" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
        </motion.div>
        <motion.div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 w-full" style={{ opacity: heroFade }}>
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge>ADE focus track</Badge>
            <Badge color="#A1A1AA">UKG · House</Badge>
            <Badge color="#A1A1AA">129 BPM · F# minor</Badge>
            <Badge color="#A1A1AA">Confidential</Badge>
          </div>
          <h1 className="font-display text-6xl md:text-9xl leading-[0.9] text-[#FAFAFA]">{C.artist}</h1>
          <p className="font-display text-3xl md:text-5xl text-[#fd3737] mt-3">{C.song} <span className="text-[#B8B8C0] text-xl md:text-2xl">(for a minute)</span></p>
          <p className="text-[#E4E4E9] text-base md:text-lg mt-6 max-w-3xl leading-relaxed">{C.thesis}</p>
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-x-10 gap-y-3 mt-9 text-sm text-[#B8B8C0]">
            <span>{C.label}</span><span>Recommended release · Fri 9 Oct 2026</span><span>ADE · 21–25 Oct</span><span>Prepared {C.pulledAt}</span>
          </div>
        </motion.div>
      </div>

      {/* 01 BRIEF */}
      <Section id="brief" number="01" title="What We Heard" subtitle="The brief from the 22 September call, and the four principles the plan is built on.">
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {C.brief.heard.map((h, i) => (
            <GlassCard key={i} className="p-6">
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#fd3737] font-semibold">{h.k}</div>
              <p className="text-[#E4E4E9] text-sm md:text-base mt-2 leading-relaxed">{h.v}</p>
            </GlassCard>
          ))}
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {C.brief.principles.map((p, i) => (
            <GlassCard key={i} className="p-6 border-t-2 border-t-[#fd3737]" glow>
              <div className="font-display text-lg text-[#FAFAFA]">{p.t}</div>
              <p className="text-[#B8B8C0] text-sm mt-3 leading-relaxed">{p.d}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* 02 TRACK */}
      <Section id="track" number="02" title="The Track" subtitle="Teardown of the V3 master. Energy and vocal presence across all 2:34, with the two clip windows we would register as official sounds.">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {C.track.specs.map((s, i) => (
            <GlassCard key={i} className="p-4 text-center">
              <div className="font-display text-xl md:text-2xl text-[#FAFAFA]">{s.value}</div>
              <div className="text-[#B8B8C0] text-[11px] mt-1 uppercase tracking-wide">{s.label}</div>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="p-4 md:p-8 mb-8" hover={false}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="font-display text-lg text-[#FAFAFA]">Energy map</h3>
            <div className="flex gap-4 text-xs text-[#E4E4E9]"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#fd3737]" />Full-mix energy</span><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#A1A1AA]" />Vocal presence</span><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#fd3737]/20 border border-[#fd3737]/50" />Official sound windows</span></div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={energyCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fd3737" stopOpacity={0.6} /><stop offset="100%" stopColor="#fd3737" stopOpacity={0.02} /></linearGradient>
                  <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A1A1AA" stopOpacity={0.5} /><stop offset="100%" stopColor="#A1A1AA" stopOpacity={0.02} /></linearGradient>
                </defs>
                <CartesianGrid stroke="#262626" vertical={false} />
                <ReferenceArea x1={0} x2={16} fill="#fd3737" fillOpacity={0.08} stroke="#fd3737" strokeOpacity={0.4} label={{ value: 'Sound A', fill: '#FAFAFA', fontSize: 11, position: 'insideTop' }} />
                <ReferenceArea x1={30} x2={62} fill="#fd3737" fillOpacity={0.08} stroke="#fd3737" strokeOpacity={0.4} label={{ value: 'Sound B', fill: '#FAFAFA', fontSize: 11, position: 'insideTop' }} />
                <XAxis dataKey="t" type="number" domain={[0, 152]} ticks={[0, 16, 30, 47, 62, 76, 90, 120, 152]} tickFormatter={fmtT} stroke="#71717A" tick={{ fill: '#B8B8C0', fontSize: 11 }} />
                <YAxis stroke="#71717A" tick={{ fill: '#B8B8C0', fontSize: 11 }} domain={[0, 110]} />
                <RTooltip content={<CurveTip />} />
                <Area type="monotone" dataKey="vocal" stroke="#A1A1AA" fill="url(#gV)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="energy" stroke="#fd3737" fill="url(#gE)" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {C.track.sections.map((s, i) => <Pill key={i}>{fmtT(s.from)}–{fmtT(s.to)} · {s.label}</Pill>)}
          </div>
        </GlassCard>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <GlassCard className="p-8" hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-4">The read</h3>
            <p className="text-[#E4E4E9] leading-relaxed">{C.track.read}</p>
          </GlassCard>
          <GlassCard className="p-8 border-l-2 border-l-[#fd3737]" glow hover={false}>
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#fd3737] font-semibold">The hook</div>
            <p className="font-display text-2xl md:text-3xl text-[#FAFAFA] mt-3">{C.track.hook.line}</p>
            <p className="text-[#E4E4E9] mt-4 leading-relaxed">{C.track.hook.why}</p>
            <p className="text-[#B8B8C0] text-xs mt-4">{C.track.hook.note}</p>
          </GlassCard>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {C.track.sounds.map((s, i) => (
            <GlassCard key={i} className="p-6">
              <div className="font-display text-lg text-[#FAFAFA]">{s.name}</div>
              <div className="text-[#fd3737] text-sm mt-1">{s.window}</div>
              <p className="text-[#B8B8C0] text-sm mt-3 leading-relaxed">{s.use}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* 03 BASELINE */}
      <Section id="baseline" number="03" title="Where Loek Starts" subtitle={C.baseline.headline}>
        <GlassCard className="p-8 md:p-10 mb-8 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <p className="text-[#E4E4E9] text-base md:text-lg leading-relaxed">{C.baseline.body}</p>
        </GlassCard>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {C.baseline.stats.map((s, i) => (
            <GlassCard key={i} className="p-6">
              <div className="font-display text-3xl md:text-4xl text-[#FAFAFA]">{s.value}</div>
              <div className="text-[#B8B8C0] text-xs mt-2 leading-snug">{s.label}</div>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="p-4 md:p-8 mb-8" hover={false}>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div>
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#fd3737] font-semibold">Spotify monthly listeners · Chartmetric</div>
              <h3 className="font-display text-xl md:text-2xl text-[#FAFAFA] mt-2">{C.baseline.listenerNote.headline}</h3>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-[#E4E4E9]"><LegendDot color="#fd3737">Monthly listeners</LegendDot><LegendDot color="#A1A1AA" dashed>Spotify followers (right)</LegendDot></div>
          </div>
          <p className="text-[#E4E4E9] text-sm leading-relaxed mb-6 max-w-4xl">{C.baseline.listenerNote.body}</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={listenerData} margin={{ top: 18, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#262626" vertical={false} />
                <ReferenceArea yAxisId="l" x1={ts('2026-07-05')} x2={ts('2026-07-17')} fill="#fd3737" fillOpacity={0.1} />
                <ReferenceLine yAxisId="l" x={ts('2026-03-11')} stroke="#B8B8C0" strokeDasharray="3 3" label={{ value: 'In My Arms', fill: '#E4E4E9', fontSize: 11, position: 'insideTopLeft' }} />
                <ReferenceLine yAxisId="l" x={ts('2026-06-19')} stroke="#B8B8C0" strokeDasharray="3 3" label={{ value: 'Weekend', fill: '#E4E4E9', fontSize: 11, position: 'insideTopLeft' }} />
                <XAxis dataKey="t" type="number" scale="time" domain={[ts('2026-03-01'), ts('2026-09-23')]} ticks={monthTicks} tickFormatter={fmtMonth} stroke="#71717A" tick={axisTick} />
                <YAxis yAxisId="l" domain={[0, 1400000]} tickFormatter={fmtK} stroke="#71717A" tick={axisTick} />
                <YAxis yAxisId="f" orientation="right" domain={[3000, 5000]} tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} stroke="#71717A" tick={axisTick} width={44} />
                <RTooltip content={<SeriesTip names={{ listeners: 'Listeners', followers: 'Followers' }} />} />
                <Line yAxisId="l" type="monotone" dataKey="listeners" stroke="#fd3737" strokeWidth={2.5} dot={{ r: 3, fill: '#fd3737' }} activeDot={{ r: 5 }} isAnimationActive={false} />
                <Line yAxisId="f" type="monotone" dataKey="followers" stroke="#A1A1AA" strokeWidth={2} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[#B8B8C0] text-xs mt-3">{C.baseline.listenerNote.note} Shaded: 5–17 Jul “Weekend” stream lift.</p>
        </GlassCard>
        <GlassCard className="p-8 mb-8" hover={false}>
          <h3 className="font-display text-lg text-[#FAFAFA] mb-6">Catalog, Spotify streams (Chartmetric, 23 Sep)</h3>
          <div className="space-y-5">
            {C.baseline.catalog.map((c, i) => (
              <div key={i}>
                <div className="flex flex-wrap justify-between gap-2 mb-2">
                  <div><span className="text-[#FAFAFA] font-semibold">{c.title}</span> <span className="text-[#B8B8C0] text-xs ml-2">{c.credit}</span></div>
                  <div className="text-[#E4E4E9] text-sm">{c.streams.toLocaleString()} <span className="text-[#B8B8C0] text-xs ml-2">{c.daily}</span></div>
                </div>
                <AnimatedBar pct={(c.streams / maxStreams) * 100} color={i < 2 ? '#fd3737' : '#71717A'} />
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-4 md:p-8 mb-8" hover={false}>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div>
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#fd3737] font-semibold">Daily Spotify streams · Chartmetric</div>
              <h3 className="font-display text-xl md:text-2xl text-[#FAFAFA] mt-2">{C.baseline.streamsNote.headline}</h3>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-[#E4E4E9]"><LegendDot color="#fd3737">Weekend</LegendDot><LegendDot color="#A1A1AA">In My Arms</LegendDot></div>
          </div>
          <p className="text-[#E4E4E9] text-sm leading-relaxed mb-6 max-w-4xl">{C.baseline.streamsNote.body}</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={streamData} margin={{ top: 18, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#262626" vertical={false} />
                <ReferenceArea x1={ts('2026-07-05')} x2={ts('2026-07-17')} fill="#fd3737" fillOpacity={0.1} label={{ value: 'Lift', fill: '#E4E4E9', fontSize: 11, position: 'insideTopLeft' }} />
                <ReferenceLine x={ts('2026-06-19')} stroke="#B8B8C0" strokeDasharray="3 3" label={{ value: 'Weekend out', fill: '#E4E4E9', fontSize: 11, position: 'insideTopRight' }} />
                <XAxis dataKey="t" type="number" scale="time" domain={[ts('2026-03-01'), ts('2026-09-23')]} ticks={monthTicks} tickFormatter={fmtMonth} stroke="#71717A" tick={axisTick} />
                <YAxis tickFormatter={fmtK} stroke="#71717A" tick={axisTick} />
                <RTooltip content={<SeriesTip names={{ weekend: 'Weekend', ima: 'In My Arms' }} />} />
                <Line type="monotone" dataKey="ima" stroke="#A1A1AA" strokeWidth={1.75} dot={false} connectNulls isAnimationActive={false} />
                <Line type="monotone" dataKey="weekend" stroke="#fd3737" strokeWidth={2.5} dot={false} connectNulls isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[#B8B8C0] text-xs mt-3">{C.baseline.streamsNote.note}</p>
        </GlassCard>
        <h3 className="font-display text-2xl text-[#FAFAFA] mb-6">{C.baseline.playlists.headline}</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {C.baseline.playlists.rows.map((r, i) => (
            <GlassCard key={i} className="p-6 md:p-8" glow={i === 0} hover={false}>
              <div className="flex items-baseline justify-between gap-3">
                <div className="font-display text-2xl text-[#FAFAFA]">{r.track}</div>
                <div className="font-display text-2xl text-[#fd3737]">{r.streams}</div>
              </div>
              <div className="space-y-4 mt-6">
                {([['Spotify editorial', r.editorial], ['Algorithmic', r.algorithmic], ['User playlists', r.user], ['TikTok', r.tiktok]] as [string, string][]).map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[#B8B8C0] mb-1">{k}</div>
                    <p className="text-[#E4E4E9] text-sm leading-relaxed">{v}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="p-6 md:p-8 mb-8 border-l-2 border-l-[#fd3737]" hover={false}>
          <p className="text-[#E4E4E9] leading-relaxed">{C.baseline.playlists.take}</p>
        </GlassCard>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <GlassCard className="p-6" hover={false}>
            <h3 className="font-display text-base text-[#FAFAFA] mb-1">Instagram reel views, Mar–Aug 2026</h3>
            <p className="text-[#B8B8C0] text-xs mb-4">Peaks are live and crowd moments. The flat middle is caption-only teasers.</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={igReels} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="#262626" vertical={false} />
                  <XAxis dataKey="d" stroke="#71717A" tick={{ fill: '#B8B8C0', fontSize: 10 }} interval={5} />
                  <YAxis stroke="#71717A" tick={{ fill: '#B8B8C0', fontSize: 10 }} tickFormatter={(v) => `${Math.round(v / 1000)}K`} />
                  <RTooltip cursor={{ fill: '#262626' }} contentStyle={{ background: '#141414', border: '1px solid #333', borderRadius: 12, color: '#FAFAFA' }} />
                  <Bar dataKey="views" fill="#fd3737" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
          <GlassCard className="p-6" hover={false}>
            <h3 className="font-display text-base text-[#FAFAFA] mb-1">TikTok plays, last 20 posts</h3>
            <p className="text-[#B8B8C0] text-xs mb-4">Log scale. The 4 Aug outlier hit 132K plays with a like rate under 0.1%.</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ttPosts} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="#262626" vertical={false} />
                  <XAxis dataKey="d" stroke="#71717A" tick={{ fill: '#B8B8C0', fontSize: 10 }} interval={3} />
                  <YAxis scale="log" domain={[500, 200000]} allowDataOverflow stroke="#71717A" tick={{ fill: '#B8B8C0', fontSize: 10 }} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}K` : `${v}`)} />
                  <RTooltip cursor={{ fill: '#262626' }} contentStyle={{ background: '#141414', border: '1px solid #333', borderRadius: 12, color: '#FAFAFA' }} />
                  <Bar dataKey="plays" fill="#A1A1AA" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {C.baseline.social.map((s, i) => (
            <GlassCard key={i} className="p-6">
              <div className="font-display text-base text-[#FAFAFA]">{s.t}</div>
              <p className="text-[#B8B8C0] text-sm mt-2 leading-relaxed">{s.d}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* 03a MARKETS */}
      <Section id="markets" number="03a" title="Where People Listen" subtitle={C.marketsNote.headline}>
        <GlassCard className="p-8 mb-8 border-l-2 border-l-[#fd3737]" glow hover={false}><p className="text-[#E4E4E9] leading-relaxed">{C.marketsNote.body}</p></GlassCard>
        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          <GlassCard className="lg:col-span-3 p-6 md:p-8" hover={false}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h3 className="font-display text-lg text-[#FAFAFA]">Top countries, monthly listeners</h3>
              <div className="flex flex-wrap gap-3 text-[11px] text-[#E4E4E9]">
                {[['Treated', '#fd3737'], ['Holdout', '#A1A1AA'], ['Test market', '#D42D2D']].map(([l, c]) => <span key={l} className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: c }} />{l}</span>)}
              </div>
            </div>
            <div className="space-y-4">
              {C.markets.map((m) => (
                <div key={m.code}>
                  <div className="flex flex-wrap justify-between gap-2 mb-1.5 text-sm">
                    <span className="text-[#FAFAFA]">{m.country}{m.role && <span className="ml-2 text-[11px] font-semibold" style={{ color: m.role === 'Treated' ? '#fd3737' : '#E4E4E9' }}>· {m.role}</span>}</span>
                    <span className="text-[#E4E4E9]">{m.listeners.toLocaleString()} <span className="text-[#B8B8C0] text-xs ml-2">{m.perK.toFixed(2)} per 1,000</span></span>
                  </div>
                  <AnimatedBar pct={(m.listeners / maxMarket) * 100} color={roleColor(m.role)} />
                </div>
              ))}
            </div>
          </GlassCard>
          <div className="lg:col-span-2 flex flex-col gap-6">
            <GlassCard className="p-6 md:p-8" hover={false}>
              <h3 className="font-display text-lg text-[#FAFAFA] mb-5">Top cities</h3>
              <div className="space-y-3">
                {C.cities.map((c) => (
                  <div key={c.city}>
                    <div className="flex justify-between gap-2 mb-1 text-sm"><span className={c.city === 'Amsterdam' ? 'text-[#fd3737] font-semibold' : 'text-[#FAFAFA]'}>{c.city} <span className="text-[#B8B8C0] text-xs">{c.code}</span></span><span className="text-[#E4E4E9]">{c.listeners.toLocaleString()}</span></div>
                    <AnimatedBar pct={(c.listeners / maxCity) * 100} color={c.city === 'Amsterdam' ? '#fd3737' : '#71717A'} />
                  </div>
                ))}
              </div>
              <p className="text-[#E4E4E9] text-sm leading-relaxed mt-5">{C.marketsNote.ade}</p>
            </GlassCard>
          </div>
        </div>
        <h3 className="font-display text-2xl text-[#FAFAFA] mb-6">Holdout check</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {C.marketsNote.verdicts.map((v, i) => (
            <GlassCard key={i} className="p-6">
              <div className="flex items-center justify-between gap-2"><div className="font-display text-base text-[#FAFAFA]">{v.t}</div><Badge color={i === 0 ? '#fd3737' : '#A1A1AA'}>{v.v}</Badge></div>
              <p className="text-[#B8B8C0] text-sm mt-3 leading-relaxed">{v.d}</p>
            </GlassCard>
          ))}
        </div>
        <h3 className="font-display text-2xl text-[#FAFAFA] mb-2">Who the audience is</h3>
        <p className="text-[#B8B8C0] text-sm mb-6">{C.baseline.audience.source}</p>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <GlassCard className="p-6" hover={false}>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#B8B8C0] mb-4">Gender</div>
            <div className="flex h-3 rounded-full overflow-hidden mb-3">{C.baseline.audience.gender.map((g, i) => <div key={g.label} style={{ width: `${g.pct}%`, background: i === 0 ? '#fd3737' : '#71717A' }} />)}</div>
            <div className="flex justify-between text-sm text-[#E4E4E9]">{C.baseline.audience.gender.map((g) => <span key={g.label}>{g.label} <span className="font-display text-xl text-[#FAFAFA] ml-1">{g.pct}%</span></span>)}</div>
          </GlassCard>
          <GlassCard className="p-6" hover={false}>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#B8B8C0] mb-4">Age</div>
            <div className="space-y-3">{C.baseline.audience.age.map((a) => <div key={a.label}><div className="flex justify-between text-sm mb-1"><span className="text-[#E4E4E9]">{a.label}</span><span className="text-[#FAFAFA] font-semibold">{a.pct}%</span></div><AnimatedBar pct={a.pct} color={a.label === '18–24' ? '#fd3737' : '#71717A'} /></div>)}</div>
          </GlassCard>
          <GlassCard className="p-6" hover={false}>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#B8B8C0] mb-4">Share of Instagram likes</div>
            <div className="space-y-3">{C.baseline.audience.engaged.map((a, i) => <div key={a.label}><div className="flex justify-between text-sm mb-1"><span className="text-[#E4E4E9]">{a.label}</span><span className="text-[#FAFAFA] font-semibold">{a.pct}%</span></div><AnimatedBar pct={a.pct * 3} color={i === 0 ? '#fd3737' : '#71717A'} /></div>)}</div>
          </GlassCard>
        </div>
        <GlassCard className="p-6 md:p-8 border-l-2 border-l-[#fd3737]" hover={false}><p className="text-[#E4E4E9] leading-relaxed">{C.baseline.audience.take}</p></GlassCard>
        <p className="text-[#B8B8C0] text-xs mt-6">{C.marketsNote.note}</p>
      </Section>
      <SectionDivider />

      {/* 03b VIDEO INTEL */}
      <Section id="video" number="03b" title="Video Intelligence" subtitle={C.videoIntel.headline}>
        <GlassCard className="p-8 mb-8 border-l-2 border-l-[#fd3737]" glow hover={false}><p className="text-[#E4E4E9] leading-relaxed">{C.videoIntel.body}</p></GlassCard>
        <GlassCard className="p-0 overflow-x-auto mb-8" hover={false}>
          <table className="w-full text-sm min-w-[860px]">
            <thead><tr className="text-left text-[11px] uppercase tracking-[0.2em] text-[#B8B8C0] border-b border-[#333333]">
              <th className="p-4">Post</th><th className="p-4">Result</th><th className="p-4">Hook timing</th><th className="p-4">Edit</th><th className="p-4">Format</th>
            </tr></thead>
            <tbody>
              {C.videoIntel.rows.map((r, i) => (
                <tr key={i} className="border-b border-[#262626] last:border-0">
                  <td className="p-4 text-[#FAFAFA]">{r.post}</td>
                  <td className="p-4 whitespace-nowrap"><Badge color={r.verdict === 'win' ? '#fd3737' : r.verdict === 'paid' ? '#F59E0B' : '#A1A1AA'}>{r.result}</Badge></td>
                  <td className="p-4 text-[#E4E4E9]">{r.hook}</td>
                  <td className="p-4 text-[#E4E4E9]">{r.cuts}</td>
                  <td className="p-4 text-[#E4E4E9]">{r.format}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
        <h3 className="font-display text-2xl text-[#FAFAFA] mb-6">The edit rules for every “The One” asset</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {C.videoIntel.rules.map((r, i) => (
            <GlassCard key={i} className="p-6">
              <div className="font-display text-base text-[#FAFAFA]">{r.t}</div>
              <p className="text-[#B8B8C0] text-sm mt-2 leading-relaxed">{r.d}</p>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="p-8" hover={false}>
          <div className="text-[11px] tracking-[0.25em] uppercase text-[#fd3737] font-semibold">YouTube</div>
          <div className="font-display text-2xl text-[#FAFAFA] mt-2">{C.youtube.headline}</div>
          <p className="text-[#E4E4E9] text-sm mt-3 leading-relaxed">{C.youtube.body}</p>
          <div className="space-y-2 mt-5">{C.youtube.actions.map((a, i) => <div key={i} className="flex gap-3 text-sm text-[#E4E4E9] leading-relaxed"><span className="text-[#fd3737]">→</span>{a}</div>)}</div>
        </GlassCard>
      </Section>
      <SectionDivider />

      {/* 04 COMPS */}
      <Section id="comps" number="04" title="Comparables" subtitle="Seven releases that tell us how this sound travels right now, and what to take from each.">
        <GlassCard className="p-4 md:p-8 mb-8" glow hover={false}>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div>
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#fd3737] font-semibold">Benchmark · HAVEN. “I Run” · Chartmetric</div>
              <h3 className="font-display text-xl md:text-2xl text-[#FAFAFA] mt-2">{C.benchmark.headline}</h3>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-[#E4E4E9]"><LegendDot color="#fd3737">Monthly listeners</LegendDot><LegendDot color="#A1A1AA" dashed>TikTok creates, original (right)</LegendDot><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#D42D2D]" />Creates, re-record</span></div>
          </div>
          <p className="text-[#E4E4E9] text-sm leading-relaxed mb-6 max-w-4xl">{C.benchmark.body}</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={havenData} margin={{ top: 18, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#262626" vertical={false} />
                <ReferenceLine yAxisId="l" x={ts('2025-10-29')} stroke="#B8B8C0" strokeDasharray="3 3" label={{ value: 'Original out', fill: '#E4E4E9', fontSize: 11, position: 'insideTopLeft' }} />
                <ReferenceLine yAxisId="l" x={ts('2025-11-21')} stroke="#B8B8C0" strokeDasharray="3 3" label={{ value: 'Re-record out', fill: '#E4E4E9', fontSize: 11, position: 'insideTopLeft' }} />
                <XAxis dataKey="t" type="number" scale="time" domain={[ts('2025-10-27'), ts('2025-12-05')]} ticks={['2025-11-01', '2025-11-08', '2025-11-15', '2025-11-22', '2025-11-29'].map(ts)} tickFormatter={fmtDay} stroke="#71717A" tick={axisTick} />
                <YAxis yAxisId="l" domain={[0, 8000000]} tickFormatter={fmtK} stroke="#71717A" tick={axisTick} />
                <YAxis yAxisId="c" orientation="right" domain={[0, 250000]} tickFormatter={fmtK} stroke="#71717A" tick={axisTick} width={44} />
                <RTooltip content={<SeriesTip names={{ listeners: 'Monthly listeners', creates: 'Creates (original)', createsRerecord: 'Creates (re-record)' }} />} />
                <Line yAxisId="l" type="monotone" dataKey="listeners" stroke="#fd3737" strokeWidth={2.5} dot={{ r: 3, fill: '#fd3737' }} connectNulls isAnimationActive={false} />
                <Line yAxisId="c" type="monotone" dataKey="creates" stroke="#A1A1AA" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 2, fill: '#A1A1AA' }} connectNulls isAnimationActive={false} />
                <Line yAxisId="c" dataKey="createsRerecord" stroke="#D42D2D" strokeWidth={0} dot={{ r: 5, fill: '#D42D2D' }} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[#B8B8C0] text-xs mt-3">{C.benchmark.note}</p>
        </GlassCard>
        <div className="space-y-4 mb-10">
          {C.comps.map((c, i) => (
            <GlassCard key={i} className="p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-display text-xl text-[#FAFAFA]">{c.name}</div>
                  <div className="text-[#B8B8C0] text-xs mt-1">{c.meta}</div>
                </div>
                <Badge color={c.tag === 'Structural twin' ? '#fd3737' : '#A1A1AA'}>{c.tag}</Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mt-5">
                <div><div className="text-[11px] uppercase tracking-[0.2em] text-[#B8B8C0] mb-2">What happened</div><p className="text-[#E4E4E9] text-sm leading-relaxed">{c.what}</p></div>
                <div><div className="text-[11px] uppercase tracking-[0.2em] text-[#fd3737] mb-2">What we take</div><p className="text-[#E4E4E9] text-sm leading-relaxed">{c.take}</p></div>
              </div>
            </GlassCard>
          ))}
        </div>
        <h3 className="font-display text-2xl text-[#FAFAFA] mb-6">What the landscape says</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {C.landscape.map((l, i) => (
            <GlassCard key={i} className="p-6">
              <div className="font-display text-base text-[#FAFAFA]">{l.t}</div>
              <p className="text-[#B8B8C0] text-sm mt-2 leading-relaxed">{l.d}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* 05 IDEA */}
      <Section id="idea" number="05" title={C.idea.name} subtitle={C.idea.line}>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {C.idea.pillars.map((p, i) => (
            <GlassCard key={i} className="p-8" glow={i === 0}>
              <div className="flex items-center justify-between gap-3">
                <div className="font-display text-2xl text-[#FAFAFA]">{p.name}</div>
                <Pill>{p.who}</Pill>
              </div>
              <p className="text-[#E4E4E9] text-sm mt-4 leading-relaxed">{p.d}</p>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="p-8 border-l-2 border-l-[#fd3737]" hover={false}>
          <h3 className="font-display text-lg text-[#FAFAFA] mb-4">The mirror brief for Loek</h3>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
            {C.idea.mirrorBrief.map((m, i) => (
              <div key={i} className="flex gap-3 text-[#E4E4E9] text-sm leading-relaxed"><span className="text-[#fd3737] font-display">{String(i + 1).padStart(2, '0')}</span>{m}</div>
            ))}
          </div>
        </GlassCard>
      </Section>
      <SectionDivider />

      {/* 05b EXAMPLES */}
      <Section id="examples" number="05b" title="Example Creative" subtitle="What “The One (For A Minute)” could look like across the three voices and ADE. Six assets, each tied to a pillar.">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-4 py-1.5 rounded-full text-[12px] font-semibold uppercase tracking-[0.2em] bg-[#fd3737] text-[#0A0A0A]">{C.examples.label}</span>
        </div>
        <p className="text-[#E4E4E9] text-sm leading-relaxed mb-10 max-w-4xl">{C.examples.note}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {C.examples.items.map((e, i) => (
            <GlassCard key={i} className="p-0 overflow-hidden flex flex-col" hover={false}>
              <div className="relative bg-[#0A0A0A]" style={{ aspectRatio: e.ratio }}>
                {e.kind === 'video'
                  ? <InViewVideo src={e.src} poster={e.poster} className="absolute inset-0 w-full h-full object-cover" />
                  /* eslint-disable-next-line @next/next/no-img-element */
                  : <img src={e.src} alt={`${e.title}, example creative`} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] bg-[#0A0A0A]/80 text-[#FAFAFA] border border-[#333333]">Example</span>
              </div>
              <div className="p-6 flex-1">
                <div className="text-[11px] uppercase tracking-[0.2em] text-[#fd3737] font-semibold">{e.format} · directional only</div>
                <div className="font-display text-xl text-[#FAFAFA] mt-2">{e.title}</div>
                <div className="text-[#B8B8C0] text-xs mt-1">{e.pillar}</div>
                <p className="text-[#E4E4E9] text-sm mt-3 leading-relaxed">{e.use}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* 06 SYSTEM */}
      <Section id="system" number="06" title="Content System" subtitle="Who posts what, and how often, in each phase. Three voices, one idea.">
        <GlassCard className="p-0 overflow-x-auto" hover={false}>
          <table className="w-full text-sm min-w-[720px]">
            <thead><tr className="text-left text-[11px] uppercase tracking-[0.2em] text-[#B8B8C0] border-b border-[#333333]">
              <th className="p-5">Phase</th><th className="p-5">Loek</th><th className="p-5">Meme pages</th><th className="p-5">Clippers</th>
            </tr></thead>
            <tbody>
              {C.cadence.map((r, i) => (
                <tr key={i} className="border-b border-[#262626] last:border-0">
                  <td className="p-5 text-[#FAFAFA] font-semibold whitespace-nowrap">{r.phase}</td>
                  <td className="p-5 text-[#E4E4E9]">{r.loek}</td>
                  <td className="p-5 text-[#E4E4E9]">{r.pages}</td>
                  <td className="p-5 text-[#E4E4E9]">{r.clippers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </Section>
      <SectionDivider />

      {/* 07 PLAYBOOK */}
      <Section id="playbook" number="07" title="Week by Week" subtitle="Built around a Friday 9 October release. If the camp prefers 2 October, everything shifts one week earlier.">
        <div className="space-y-5">
          {C.weeks.map((w, i) => <WeekCard key={i} w={w} ade={w.label === 'ADE'} />)}
        </div>
      </Section>
      <SectionDivider />

      {/* 08 ADE */}
      <Section id="ade" number="08" title="ADE Activations" subtitle={`${C.ade.dates}. Every appearance is a content set first and a gig second.`}>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {C.ade.activations.map((a, i) => (
            <GlassCard key={i} className="p-6">
              <div className="flex items-center justify-between gap-3"><div className="font-display text-lg text-[#FAFAFA]">{a.name}</div><Pill>{a.status}</Pill></div>
              <p className="text-[#B8B8C0] text-sm mt-3 leading-relaxed">{a.plan}</p>
            </GlassCard>
          ))}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <GlassCard className="md:col-span-3 p-0 overflow-hidden" glow hover={false}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/loek-the-one/closing.jpg" alt="" className="w-full h-56 object-cover opacity-80" />
            <div className="p-8">
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#fd3737] font-semibold">Pop-up concept</div>
              <div className="font-display text-2xl text-[#FAFAFA] mt-2">{C.ade.popup.name}</div>
              <p className="text-[#E4E4E9] text-sm mt-3 leading-relaxed">{C.ade.popup.d}</p>
              <p className="text-[#B8B8C0] text-[11px] mt-4">Image: AI-generated mood reference, directional only.</p>
            </div>
          </GlassCard>
          <GlassCard className="md:col-span-2 p-8" hover={false}>
            <h3 className="font-display text-lg text-[#FAFAFA] mb-4">Capture shot list</h3>
            <div className="space-y-3">
              {C.ade.shotlist.map((s, i) => <div key={i} className="flex gap-3 text-sm text-[#E4E4E9]"><span className="text-[#fd3737]">●</span>{s}</div>)}
            </div>
          </GlassCard>
        </div>
      </Section>
      <SectionDivider />

      {/* 09 MEASURE */}
      <Section id="measure" number="09" title="Measurement" subtitle={C.measurement.headline}>
        <GlassCard className="p-8 mb-6 border-l-2 border-l-[#fd3737]" glow hover={false}><p className="text-[#E4E4E9] leading-relaxed">{C.measurement.body}</p></GlassCard>
        <div className="grid md:grid-cols-2 gap-4">
          {C.measurement.methods.map((m, i) => (
            <GlassCard key={i} className="p-6">
              <div className="font-display text-lg text-[#FAFAFA]">{m.t}</div>
              <p className="text-[#B8B8C0] text-sm mt-2 leading-relaxed">{m.d}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* 10 BUDGET */}
      <Section id="budget" number="10" title="Budget: Test, Then Scale" subtitle={C.budget.note}>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {C.budget.phases.map((p, i) => (
            <GlassCard key={i} className="p-8" glow={i === 1} hover={false}>
              <div className="flex items-baseline justify-between gap-3">
                <div className="font-display text-2xl text-[#FAFAFA]">{p.name}</div>
                <div className="text-[#B8B8C0] text-xs">{p.window}</div>
              </div>
              <div className="font-display text-4xl md:text-5xl text-[#fd3737] mt-3">{p.range}</div>
              <div className="space-y-4 mt-8">
                {p.lines.map((l, j) => (
                  <div key={j}>
                    <div className="flex justify-between gap-3 text-sm mb-2"><span className="text-[#E4E4E9]">{l.item}</span><span className="text-[#FAFAFA] font-semibold">{l.pct}%</span></div>
                    <AnimatedBar pct={l.pct} color={j === 0 ? '#fd3737' : j === 1 ? '#D42D2D' : j === 2 ? '#A1A1AA' : '#71717A'} />
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-xl bg-[#0A0A0A]/60 border border-[#333333] p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-[#fd3737] mb-1">Gate</div>
                <p className="text-[#E4E4E9] text-sm leading-relaxed">{p.gate}</p>
              </div>
            </GlassCard>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {C.kpis.map((k, i) => (
            <GlassCard key={i} className="p-6">
              <div className="text-[11px] uppercase tracking-[0.25em] text-[#fd3737] font-semibold mb-3">{k.phase} KPIs</div>
              <div className="space-y-2">{k.items.map((it, j) => <p key={j} className="text-[#E4E4E9] text-sm leading-relaxed">{it}</p>)}</div>
            </GlassCard>
          ))}
        </div>
      </Section>
      <SectionDivider />

      {/* 11 RISKS + NEXT */}
      <Section id="next" number="11" title="Risks & What We Need" subtitle="What could go wrong, what we do about it, and the five answers that finalise the plan.">
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {C.risks.map((r, i) => (
            <GlassCard key={i} className="p-6">
              <div className="flex items-center justify-between gap-3"><div className="font-display text-base text-[#FAFAFA]">{r.r}</div><Badge color={levelColor(r.level)}>{r.level}</Badge></div>
              <p className="text-[#B8B8C0] text-sm mt-3 leading-relaxed">{r.m}</p>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="p-8 border-l-2 border-l-[#fd3737]" glow hover={false}>
          <h3 className="font-display text-xl text-[#FAFAFA] mb-5">Open questions for the camp</h3>
          <div className="space-y-3">
            {C.questions.map((q, i) => <div key={i} className="flex gap-4 text-[#E4E4E9] text-sm leading-relaxed"><span className="text-[#fd3737] font-display">{String(i + 1).padStart(2, '0')}</span>{q}</div>)}
          </div>
        </GlassCard>
      </Section>

      <footer className="max-w-6xl mx-auto px-6 py-16 border-t border-[#333333]/60">
        <div className="text-[11px] uppercase tracking-[0.25em] text-[#B8B8C0] mb-4">Sources & method</div>
        <div className="space-y-2 mb-10">{C.sources.map((s, i) => <p key={i} className="text-[#B8B8C0] text-xs leading-relaxed">{s}</p>)}</div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control Digital" className="h-5 w-auto opacity-80" />
          <span className="text-[#B8B8C0] text-xs">Crowd Control Digital · info@crowdcontroldigital.com · Confidential, prepared for Universal Music Germany</span>
        </div>
      </footer>
    </div>
  );
}

function WeekCard({ w, ade }: { w: (typeof C.weeks)[number]; ade: boolean }) {
  const { ref, inView } = useInView();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.5 }}
      className={`rounded-2xl border p-6 md:p-8 ${ade ? 'border-[#fd3737]/50 bg-gradient-to-br from-[#fd3737]/10 to-[#141414]' : 'border-[#333333]/60 bg-gradient-to-br from-[#1A1A1A]/80 to-[#141414]/50'}`}>
      <div className="grid md:grid-cols-4 gap-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-[#fd3737] font-semibold">{w.label}</div>
          <div className="text-[#B8B8C0] text-xs mt-1">{w.dates}</div>
          <div className="font-display text-xl text-[#FAFAFA] mt-3">{w.title}</div>
          <p className="text-[#E4E4E9] text-sm mt-3 leading-relaxed">{w.objective}</p>
        </div>
        <div className="md:col-span-2 space-y-2">
          {w.actions.map((a, i) => <div key={i} className="flex gap-3 text-sm text-[#E4E4E9] leading-relaxed"><span className="text-[#fd3737] mt-[2px]">→</span>{a}</div>)}
        </div>
        <div className="rounded-xl bg-[#0A0A0A]/50 border border-[#262626] p-4 h-fit">
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#B8B8C0] mb-2">Success signals</div>
          <p className="text-[#E4E4E9] text-sm leading-relaxed">{w.signals}</p>
        </div>
      </div>
    </motion.div>
  );
}
