'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform, animate } from 'framer-motion';
import s from './loek.module.css';
import { loekTheOne as C } from '@/lib/data/loek-the-one';

export const EASE = [0.16, 1, 0.3, 1] as const;
export const PLAN_URL = '/campaign/loek-the-one';
export const RESEARCH_URL = '/campaign/loek-the-one/research';
export const MAIL = `mailto:geoff@crowdcontroldigital.com?subject=${encodeURIComponent('Loek, The One: next steps')}&body=${encodeURIComponent(
  'Hi Geoff,\n\nWe’ve read the plan for “The One”.\n\nAnswers / questions:\n',
)}`;

/** Hydration-safe reduced-motion flag. */
export function useReduced() {
  const pref = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? !!pref : false;
}

/* ── password gate (shared by plan + research) ── */
export function Gated({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { if (sessionStorage.getItem('loek-the-one') === '1') setOk(true); } catch { /* storage blocked */ }
    setReady(true);
  }, []);
  if (!ready) return <div style={{ minHeight: '100vh', background: '#0a0a0a' }} />;
  if (!ok) return <Gate onUnlock={() => setOk(true)} />;
  return <>{children}</>;
}

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [v, setV] = useState('');
  const [err, setErr] = useState(false);
  const submit = () => {
    if (v.trim().toLowerCase() === C.password.toLowerCase()) {
      try { sessionStorage.setItem('loek-the-one', '1'); } catch { /* storage blocked */ }
      onUnlock();
    } else setErr(true);
  };
  return (
    <div className={`${s.page} ${s.gateWrap}`}>
      <div className={s.gateBox}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control Digital" />
        <p className={`${s.mono} ${s.red}`}>Confidential</p>
        <h1 className={s.gateTitle}>Loek<br />The One</h1>
        <p className={s.note} style={{ marginTop: 14 }}>Unreleased campaign strategy for Universal Music Germany.</p>
        <input type="password" aria-label="Password" value={v} onChange={(e) => { setV(e.target.value); setErr(false); }} onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="Password" className={s.gateInput} />
        {err && <p className={s.gateErr}>That’s not it.</p>}
        <button onClick={submit} className={s.gateBtn}>Enter</button>
      </div>
    </div>
  );
}

/* ── scroll spy ── */
function useActive(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

export function Chrome({ current, nav }: { current: 'plan' | 'research'; nav: [string, string][] }) {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const h = () => setSolid(window.scrollY > 40);
    h();
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  const ids = useRef(nav.map(([id]) => id)).current;
  const active = useActive(ids);
  return (
    <>
      <motion.div className={s.progress} style={{ scaleX: x }} />
      <header className={`${s.topbar} ${solid ? s.topbarSolid : ''}`}>
        <div className={s.brand}>
          <a href="#top" aria-label="Back to top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control Digital" />
          </a>
          <nav className={s.switch} aria-label="Pages">
            <Link href={PLAN_URL} aria-current={current === 'plan' ? 'page' : undefined}>The plan</Link>
            <Link href={RESEARCH_URL} aria-current={current === 'research' ? 'page' : undefined}>The research</Link>
          </nav>
        </div>
        <nav className={s.navLinks} aria-label="Sections">
          {nav.map(([id, label]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined}>{label}</a>
          ))}
        </nav>
        <a className={s.navCta} href={MAIL}>Reply to Geoff ↗</a>
      </header>
    </>
  );
}

/* ── hero ── */
export function Hero({ img, title, small = false, kicker, line, body, stats, meta }: {
  img: string; title: string; small?: boolean; kicker: string; line: ReactNode; body: string;
  stats: { v: string; l: string }[]; meta: [string, string];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduced();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const words = title.split(' ');
  return (
    <section ref={ref} className={s.hero} id="top">
      <motion.div className={s.heroMedia} style={{ y }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" />
      </motion.div>
      <div className={s.heroShade} />
      <div className={s.heroInner}>
        <p className={`${s.mono} ${s.kicker}`}>{kicker}</p>
        <h1 className={`${s.heroTitle} ${small ? s.heroTitleSm : ''}`} aria-label={title}>
          {words.map((w, i) => (
            <span key={i} className={s.word} aria-hidden="true">
              <motion.span className={s.letter} initial={reduce ? false : { y: '108%' }} animate={{ y: '0%' }} transition={{ duration: 1.05, ease: EASE, delay: 0.15 + i * 0.08 }}>{w}</motion.span>
            </span>
          ))}
        </h1>
        <div className={s.heroRow}>
          <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
            <p className={s.heroLine}>{line}</p>
            <p className={s.heroBody}>{body}</p>
          </motion.div>
          <motion.div className={s.stats} initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}>
            {stats.map((st, i) => (
              <div key={i}><span className={s.stat}>{st.v}</span><span className={s.statLabel}>{st.l}</span></div>
            ))}
          </motion.div>
        </div>
        <div className={`${s.mono} ${s.heroMeta}`}><span>{meta[0]}</span><span>{meta[1]}</span></div>
      </div>
    </section>
  );
}

/* ── type ── */
export function Label({ n, children }: { n: string; children: ReactNode }) {
  return <p className={`${s.mono} ${s.label}`}><b>{n}</b>{children}</p>;
}

/** Headline with letter-rise reveal. Wrap accent words in *asterisks*. */
export function H2({ text, className = '' }: { text: string; className?: string }) {
  const reduce = useReduced();
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const tokens = text.split(' ');
  return (
    <h2 ref={ref} className={`${s.h2} ${className}`} aria-label={text.replace(/\*/g, '')}>
      {tokens.map((tok, i) => {
        const accent = tok.includes('*');
        const clean = tok.replace(/\*/g, '');
        return (
          <span className={s.word} key={i} aria-hidden="true">
            <motion.span className={s.letter} initial={reduce ? false : { y: '108%' }} animate={reduce || inView ? { y: '0%' } : { y: '108%' }} transition={{ duration: 0.9, ease: EASE, delay: i * 0.05 }}>
              {accent ? <em>{clean}</em> : clean}
            </motion.span>
          </span>
        );
      })}
    </h2>
  );
}

export function Head({ n, label, title, intro }: { n: string; label: string; title: string; intro?: ReactNode }) {
  return (
    <div className={s.head}>
      <div>
        <Label n={n}>{label}</Label>
        <H2 text={title} />
      </div>
      {intro && <Reveal delay={0.1}><div className={s.intro}>{intro}</div></Reveal>}
    </div>
  );
}

/** Fade-up reveal driven by the IntersectionObserver hook (not whileInView). */
export function Reveal({ children, delay = 0, y = 24, className, style }: { children: ReactNode; delay?: number; y?: number; className?: string; style?: CSSProperties }) {
  const reduce = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });
  return (
    <motion.div ref={ref} className={className} style={style} initial={reduce ? false : { opacity: 0, y }} animate={reduce || inView ? { opacity: 1, y: 0 } : { opacity: 0, y }} transition={{ duration: 0.85, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

/** Horizontal bar that grows when it scrolls into view. */
export function Fill({ pct, color, thin = false }: { pct: number; color?: string; thin?: boolean }) {
  const reduce = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -5% 0px' });
  return (
    <div ref={ref} className={`${s.barTrack} ${thin ? s.barTrackThin : ''}`}>
      <motion.div className={s.barFill} style={{ width: `${Math.max(0.6, Math.min(100, pct))}%`, background: color }} initial={reduce ? false : { scaleX: 0 }} animate={reduce || inView ? { scaleX: 1 } : { scaleX: 0 }} transition={{ duration: 1.1, ease: EASE }} />
    </div>
  );
}

export function Counter({ to, format }: { to: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReduced();
  const [val, setVal] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setVal(to); return; }
    const c = animate(0, to, { duration: 1.4, ease: EASE, onUpdate: setVal });
    return () => c.stop();
  }, [inView, to, reduce]);
  return <span ref={ref}>{format(val)}</span>;
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className={s.marquee} aria-hidden="true">
      <div className={s.marqueeTrack}>
        {row.map((t, i) => <span key={i} className={s.marqueeItem}>{t}<i>✺</i></span>)}
      </div>
    </div>
  );
}

export function Band({ kicker, href, children, aside }: { kicker: string; href: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className={s.band}>
      <div className={s.bandInner}>
        <div>
          <p className={`${s.mono} ${s.muted}`} style={{ marginBottom: 16 }}>{kicker}</p>
          <Link href={href} className={s.bandLink}>{children} <span>→</span></Link>
        </div>
        {aside}
      </div>
    </div>
  );
}

export function Footer({ sources }: { sources: string[] }) {
  return (
    <footer className={s.footer}>
      <p className={`${s.mono} ${s.muted}`}>Sources & method</p>
      <div className={s.sources}>{sources.map((x, i) => <p key={i}>{x}</p>)}</div>
      <div className={`${s.footRow} ${s.mono}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/CC-LOGO-2024-WHITE.png" alt="Crowd Control Digital" />
        <span>Loek × Crowd Control Digital · Confidential · Prepared for Universal Music Germany · September 2026</span>
        <a href="#top" style={{ textDecoration: 'none' }}>Back to top ↑</a>
      </div>
    </footer>
  );
}

/* ── chart helpers (recharts, styled to the system) ── */
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const ts = (d: string) => Date.parse(`${d}T00:00:00Z`);
export const fmtMonth = (v: number) => MONTHS[new Date(v).getUTCMonth()];
export const fmtDay = (v: number) => { const d = new Date(v); return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`; };
export const fmtK = (v: number) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(v >= 10_000_000 ? 1 : 2)}M` : v >= 1000 ? `${Math.round(v / 1000)}K` : `${v}`);
export const tick = { fill: '#B8B8C0', fontSize: 11, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ChartTip({ active, payload, label, names, dayFmt = fmtDay }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#141414', border: '1px solid #333', padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: '#FAFAFA', fontWeight: 600, marginBottom: 4 }}>{dayFmt(label)}</div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.filter((p: any) => p.value != null).map((p: any) => (
        <div key={p.dataKey} style={{ color: p.stroke === '#fd3737' || p.stroke === '#FD3737' ? '#fd3737' : '#E4E4E9' }}>
          {(names && names[p.dataKey]) || p.dataKey}: {Number(p.value).toLocaleString()}
        </div>
      ))}
    </div>
  );
}

export function Legend({ items }: { items: { c: string; l: string; dashed?: boolean; dot?: boolean }[] }) {
  return (
    <div className={s.legend}>
      {items.map((it) => (
        <span key={it.l}>
          <i style={{ background: it.dashed ? `repeating-linear-gradient(90deg, ${it.c} 0 4px, transparent 4px 7px)` : it.c, ...(it.dot ? { width: 9, height: 9, borderRadius: '50%' } : {}) }} />
          {it.l}
        </span>
      ))}
    </div>
  );
}

/** Autoplays only while on screen. */
export function InViewVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.play().catch(() => { /* autoplay blocked */ }); else el.pause(); }, { threshold: 0.35 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" />;
}

export { s };
