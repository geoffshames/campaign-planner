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


/* ── shared checklist state (same Supabase table as the proposal page, so status syncs) ── */
const SB_URL = "https://hcyjlwbmrqcgbbizirzl.supabase.co";
const SB_KEY = "sb_publishable_E1PXDuHKsBxmfbGfeYjbAw_63kK0p1y";
const SB_TABLE = "proposal_checklist_state";

async function fetchShared(storageKey: string): Promise<Record<string, boolean> | null> {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/${SB_TABLE}?storage_key=eq.${encodeURIComponent(storageKey)}&select=item_id,checked`, { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } });
    if (!res.ok) return null;
    const rows: { item_id: string; checked: boolean }[] = await res.json();
    const map: Record<string, boolean> = {};
    for (const r of rows) map[r.item_id] = r.checked;
    return map;
  } catch { return null; }
}
async function pushShared(storageKey: string, itemId: string, checked: boolean) {
  try {
    await fetch(`${SB_URL}/rest/v1/${SB_TABLE}?on_conflict=storage_key,item_id`, { method: "POST", headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" }, body: JSON.stringify({ storage_key: storageKey, item_id: itemId, checked, updated_at: new Date().toISOString() }) });
  } catch {}
}

type CalEntry = { date: string; kind: string; label: string; detail?: string; channel?: string[]; time?: string; cta?: string; status?: string };
type CalPhase = { title: string; window?: string; releaseDate?: string; format?: string; status?: string; summary?: string; entries: CalEntry[] };
type CalData = { cadenceNote?: string; postingRules?: string[]; channelNote?: string; legend?: { kind: string; label: string }[]; footnote?: string; phases: CalPhase[] };
type ChkItem = { id: string; label: string; formats?: string[]; owner?: string; note?: string; status?: string };
type ChkGroup = { heading: string; release?: string; format?: string; status?: string; description?: string; items: ChkItem[] };
type ChkData = { storageKey?: string; standardNote?: string; ownerLegend?: { owner: string; label: string }[]; footnote?: string; groups: ChkGroup[] };

const KIND_DOT: Record<string, string> = {
  release: "bg-[#fd3737]",
  presave: "border-2 border-[#fd3737] bg-transparent",
  announce: "border-2 border-[#fd3737] bg-transparent",
  content: "bg-[#E4E4E9]",
  paid: "border-2 border-[#71717A] bg-transparent",
  asset: "bg-[#71717A] rotate-45",
  live: "bg-[#fd3737]/50",
  milestone: "bg-[#71717A]",
};
const KIND_LABEL: Record<string, string> = { release: "Release", presave: "Pre-save", announce: "Announce", content: "Organic", paid: "Paid", asset: "Asset due", live: "Live", milestone: "Milestone" };
const STATUS_META: Record<string, { label: string; cls: string }> = {
  have: { label: "Have", cls: "border-[#fd3737]/50 text-[#fd3737]" },
  "in-progress": { label: "In progress", cls: "border-[#71717A]/70 text-[#E4E4E9]" },
  needed: { label: "Needed", cls: "border-[#333333] text-[#B8B8C0]" },
};

function ContentCalendar() {
  const CC = C.contentCalendar as unknown as CalData;
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {CC.cadenceNote && (
          <GlassCard className="p-6" hover={false}>
            <div className="text-[11px] uppercase tracking-wider text-[#fd3737] mb-3">The repeating arc</div>
            <p className="text-[#E4E4E9] text-sm leading-relaxed">{CC.cadenceNote}</p>
          </GlassCard>
        )}
        {CC.postingRules && (
          <GlassCard className="p-6" hover={false}>
            <div className="text-[11px] uppercase tracking-wider text-[#fd3737] mb-3">Posting rules</div>
            <ul className="space-y-2">
              {CC.postingRules.map((r, i) => (<li key={i} className="flex gap-2 text-[#E4E4E9] text-sm leading-relaxed"><span className="text-[#fd3737]">&#9656;</span><span>{r}</span></li>))}
            </ul>
          </GlassCard>
        )}
      </div>
      {CC.channelNote && (
        <GlassCard className="p-5 mb-8 border-l-2 border-l-[#fd3737]" hover={false}>
          <div className="text-[11px] uppercase tracking-wider text-[#fd3737] mb-1">Where spend goes</div>
          <p className="text-[#E4E4E9] text-sm leading-relaxed">{CC.channelNote}</p>
        </GlassCard>
      )}
      {CC.legend && (
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-8">
          {CC.legend.map((l, i) => (<div key={i} className="flex items-center gap-2"><span className={`w-[10px] h-[10px] rounded-full ${KIND_DOT[l.kind] || KIND_DOT.milestone}`} /><span className="text-[11px] uppercase tracking-wide text-[#B8B8C0]">{l.label}</span></div>))}
        </div>
      )}
      <div className="space-y-6">
        {CC.phases.map((ph, pi) => (
          <GlassCard key={pi} className={`p-6 md:p-8 ${ph.status === "next" ? "border-[#fd3737]/50" : ""}`} hover={false}>
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 mb-5 border-b border-[#333333]/60">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="font-display text-xl md:text-2xl text-[#FAFAFA]">{ph.title}</h4>
                  {ph.status === "next" && <Badge>next up</Badge>}
                  {ph.status === "done" && <Badge color="#A1A1AA">shipped</Badge>}
                </div>
                {ph.summary && <p className="text-[#B8B8C0] text-sm mt-2 max-w-3xl leading-relaxed">{ph.summary}</p>}
              </div>
              <div className="text-left md:text-right shrink-0">
                {ph.releaseDate && (<><div className="text-[10px] uppercase tracking-wider text-[#71717A]">Release</div><div className="font-display text-lg md:text-xl text-[#fd3737]">{ph.releaseDate}</div></>)}
                {ph.format && <div className="text-[10px] uppercase tracking-wide text-[#B8B8C0] mt-1">{ph.format}</div>}
                {ph.window && <div className="text-[10px] text-[#71717A] mt-1">{ph.window}</div>}
              </div>
            </div>
            <div>
              {ph.entries.map((e, ei) => {
                const last = ei === ph.entries.length - 1;
                const done = e.status === "done";
                return (
                  <div key={ei} className={`relative flex gap-4 ${done ? "opacity-55" : ""}`}>
                    <div className="flex flex-col items-center w-[14px] shrink-0">
                      <span className={`mt-[6px] w-[11px] h-[11px] rounded-full ${KIND_DOT[e.kind] || KIND_DOT.milestone}`} />
                      {!last && <span className="flex-1 w-px bg-[#333333]/70 mt-1" />}
                    </div>
                    <div className={`flex-1 min-w-0 ${last ? "pb-0" : "pb-7"}`}>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-[12px] font-semibold tracking-wide uppercase text-[#fd3737] tabular-nums">{e.date}</span>
                        <span className="text-[10px] uppercase tracking-wider text-[#71717A]">{KIND_LABEL[e.kind] || ""}</span>
                        {done && <span className="text-[10px] uppercase tracking-wider text-[#fd3737]">&#10003; done</span>}
                      </div>
                      <div className={`mt-1 leading-snug ${e.kind === "release" ? "font-display text-base md:text-lg text-[#FAFAFA]" : "text-sm md:text-[15px] font-semibold text-[#E9E9EE]"}`}>{e.label}</div>
                      {e.detail && <p className="mt-1.5 text-[13px] text-[#B8B8C0] leading-relaxed max-w-2xl">{e.detail}</p>}
                      {(e.channel || e.time || e.cta) && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                          {e.channel && <div className="flex flex-wrap gap-1.5">{e.channel.map((c, ci) => (<span key={ci} className="px-2 py-0.5 border border-[#333333] text-[9.5px] uppercase tracking-wide text-[#B8B8C0]">{c}</span>))}</div>}
                          {e.time && <span className="text-[10.5px] text-[#71717A]">&#9687; {e.time}</span>}
                          {e.cta && <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wide" style={{ background: "#fd373722", color: "#fd3737" }}>{e.cta}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        ))}
      </div>
      {CC.footnote && <p className="text-[#71717A] text-xs leading-relaxed border-l-2 border-[#fd3737]/40 pl-4 mt-8">{CC.footnote}</p>}
    </div>
  );
}

function AssetChecklist() {
  const AC = C.assetChecklist as unknown as ChkData;
  const storageKey = AC.storageKey || "temporex-asset-checklist";
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  useEffect(() => {
    let cancelled = false;
    const sync = async () => { const r = await fetchShared(storageKey); if (r && !cancelled) setChecked(r); };
    sync();
    const t = setInterval(sync, 12000);
    return () => { cancelled = true; clearInterval(t); };
  }, [storageKey]);
  const all = AC.groups.flatMap((g) => g.items);
  const total = all.length;
  const done = all.filter((it) => checked[it.id]).length;
  const toggle = (id: string) => { const n = !checked[id]; setChecked((c) => ({ ...c, [id]: n })); pushShared(storageKey, id, n); };
  return (
    <div>
      {AC.standardNote && (
        <GlassCard className="p-6 mb-6" hover={false}>
          <div className="text-[11px] uppercase tracking-wider text-[#fd3737] mb-2">The standard set, every release</div>
          <p className="text-[#E4E4E9] text-sm leading-relaxed">{AC.standardNote}</p>
        </GlassCard>
      )}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
        <div className="flex items-center gap-4 flex-1 min-w-[220px]">
          <div className="text-[12px] uppercase tracking-wider text-[#B8B8C0] whitespace-nowrap">{done} / {total} done</div>
          <div className="flex-1 h-[3px] bg-[#333333]"><div className="h-full bg-[#fd3737] transition-all duration-500" style={{ width: total ? `${(done / total) * 100}%` : "0%" }} /></div>
        </div>
        {AC.ownerLegend && (<div className="flex flex-wrap gap-x-4 gap-y-2">{AC.ownerLegend.map((o, i) => (<span key={i} className="text-[10px] uppercase tracking-wide text-[#B8B8C0]"><span className="text-[#fd3737]">{o.owner}</span> {o.label}</span>))}</div>)}
      </div>
      <div className="space-y-5">
        {AC.groups.map((g, gi) => {
          const gdone = g.items.filter((it) => checked[it.id]).length;
          return (
            <GlassCard key={gi} className={`p-6 md:p-7 ${g.status === "next" ? "border-[#fd3737]/50" : ""}`} hover={false}>
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 mb-4 border-b border-[#333333]/60">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="font-display text-lg md:text-xl text-[#FAFAFA]">{g.heading}</h4>
                    {g.status === "next" && <Badge>next up</Badge>}
                    {g.status === "done" && <Badge color="#A1A1AA">shipped</Badge>}
                  </div>
                  {g.description && <p className="text-[#B8B8C0] text-sm mt-2 max-w-3xl leading-relaxed">{g.description}</p>}
                </div>
                <div className="text-left md:text-right shrink-0">
                  {g.release && (<><div className="text-[10px] uppercase tracking-wider text-[#71717A]">Release</div><div className="font-display text-base md:text-lg text-[#fd3737]">{g.release}</div></>)}
                  {g.format && <div className="text-[10px] uppercase tracking-wide text-[#B8B8C0] mt-1">{g.format}</div>}
                  <div className="text-[10px] uppercase tracking-wide text-[#71717A] mt-1 tabular-nums">{gdone} / {g.items.length} done</div>
                </div>
              </div>
              <div>
                {g.items.map((it, ii) => {
                  const c = !!checked[it.id];
                  const st = it.status ? STATUS_META[it.status] : null;
                  return (
                    <div key={ii} className={`flex items-start gap-3.5 py-3.5 border-b border-[#333333]/40 last:border-b-0 ${c ? "opacity-60" : ""}`}>
                      <button onClick={() => toggle(it.id)} aria-label={`Toggle ${it.label}`} className={`mt-0.5 w-5 h-5 shrink-0 border flex items-center justify-center transition-colors ${c ? "border-[#fd3737] bg-[#fd3737] text-[#0A0A0A]" : "border-[#555555] hover:border-[#fd3737]"}`}>{c && <span className="text-[11px] font-bold leading-none">&#10003;</span>}</button>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                          <span className={`text-sm md:text-[15px] font-semibold ${c ? "text-[#B8B8C0] line-through" : "text-[#FAFAFA]"}`}>{it.label}</span>
                          {st && <span className={`px-2 py-0.5 border text-[9px] uppercase tracking-wider ${st.cls}`}>{st.label}</span>}
                        </div>
                        {(it.formats || it.owner) && (
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            {it.formats && it.formats.map((f, fi) => (<span key={fi} className="px-2 py-0.5 text-[9.5px] tracking-wide" style={{ background: "#fd373714", color: "#fd3737", border: "1px solid #fd373733" }}>{f}</span>))}
                            {it.owner && <span className="px-2 py-0.5 border border-[#333333] text-[9.5px] uppercase tracking-wide text-[#B8B8C0]">{it.owner}</span>}
                          </div>
                        )}
                        {it.note && <p className="mt-1.5 text-[12.5px] text-[#71717A] leading-relaxed max-w-2xl">{it.note}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          );
        })}
      </div>
      {AC.footnote && <p className="text-[#71717A] text-xs leading-relaxed border-l-2 border-[#fd3737]/40 pl-4 mt-8">{AC.footnote}</p>}
    </div>
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
    ['overview', 'Overview'], ['calendar', 'Calendar'], ['checklist', 'Checklist'], ['spend', 'Digital Spend'], ['activations', 'Activations'],
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

      {/* 02 CONTENT CALENDAR */}
      <Section id="calendar" number="02" title="The Content Calendar" subtitle="Every post, asset drop and paid moment across the cycle, by day. Water Holes is done; Real Time is next.">
        <ContentCalendar />
      </Section>
      <SectionDivider />

      {/* 03 ASSET CHECKLIST */}
      <Section id="checklist" number="03" title="The Asset Checklist" subtitle="The actual asset list per release, mapped to who makes each piece. Check items off as they land so the whole team sees status.">
        <AssetChecklist />
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
