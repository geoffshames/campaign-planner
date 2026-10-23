'use client';

import type { CSSProperties } from 'react';
import { ResponsiveContainer, ComposedChart, Area, Line, ReferenceArea, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { miguelHyh as C, energyCurve, listenerSeries } from '@/lib/data/miguel-have-you-heard';
import { Band, ChartTip, Chrome, Fill, Footer, Gated, Head, Hero, Legend, PLAN_URL, Reveal, fmtK, fmtMonth, s, tick, ts } from './shared';

const NAV: [string, string][] = [
  ['track', 'The track'], ['start', 'Baseline'], ['markets', 'Markets'], ['comps', 'Peers'], ['calendar', 'Calendar'], ['landscape', 'Landscape'],
];
const pad = (i: number) => String(i + 1).padStart(2, '0');
const n = (k: number) => ({ '--n': k }) as CSSProperties;
const fmtT = (x: number) => `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`;
const grid = <CartesianGrid stroke="#1f1f1f" vertical={false} />;
const monthTicks = ['2025-10-01', '2025-12-01', '2026-02-01', '2026-04-01', '2026-06-01', '2026-08-01', '2026-10-01'].map(ts);
const fmtMonthYear = (v: number) => {
  const d = new Date(v);
  return d.getUTCMonth() === 0 ? `Jan ${String(d.getUTCFullYear()).slice(2)}` : fmtMonth(v);
};

export function HyhResearch() {
  const listenerData = listenerSeries.map((d) => ({ ...d, t: ts(d.date) }));
  const maxMarket = Math.max(...C.markets.map((m) => m.listeners));
  const maxCity = Math.max(...C.cities.map((m) => m.listeners));

  return (
    <Gated>
      <div className={s.page}>
        <Chrome current="research" nav={NAV} />
        <Hero
          img="/images/miguel-have-you-heard/hero-research.jpg"
          small
          kicker="Chartmetric, audio teardown and peer research, pulled 22 Oct 2026"
          title="The research"
          line="What the plan stands on."
          body="The song itself, where Miguel’s audience is today, the R&B rollouts that worked in the last eighteen months, and the release calendar we are landing in."
          stats={[
            { v: '36.8M', l: 'Spotify monthly listeners, up 47% in a year' },
            { v: '6.5M', l: 'Monthly listeners in the Philippines, his second market' },
            { v: '9×', l: 'The title line in 3:52' },
          ]}
          meta={['Miguel, Have You Heard: research', 'Sources at the foot of the page']}
        />

        {/* 01 TRACK */}
        <section id="track" className={s.section}>
          <Head n="01" label="The track" title="The *track.*" intro={C.track.read} />
          <Reveal className={s.figs} style={n(6)}>
            {C.track.specs.map((sp) => (
              <div key={sp.label}><span className={s.fig} style={{ fontSize: 'clamp(1.8rem, 3.4vw, 3.4rem)' }}>{sp.value}</span><span className={s.figLabel}>{sp.label}</span></div>
            ))}
          </Reveal>
          <Reveal className={s.chart} style={{ marginTop: 56 }}>
            <div className={s.chartHead}>
              <p className={`${s.mono} ${s.muted}`}>Energy map, full 3:52</p>
              <Legend items={[{ c: '#fd3737', l: 'Full-mix energy' }, { c: 'rgba(253,55,55,0.3)', l: 'Official sound windows' }]} />
            </div>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={energyCurve} margin={{ top: 16, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fd3737" stopOpacity={0.55} /><stop offset="100%" stopColor="#fd3737" stopOpacity={0} /></linearGradient>
                  </defs>
                  {grid}
                  <ReferenceArea x1={0} x2={15} fill="#fd3737" fillOpacity={0.1} label={{ value: 'COLD OPEN', fill: '#FAFAFA', fontSize: 10, position: 'insideTop' }} />
                  <ReferenceArea x1={56} x2={72} fill="#fd3737" fillOpacity={0.1} label={{ value: 'CHORUS', fill: '#FAFAFA', fontSize: 10, position: 'insideTop' }} />
                  <ReferenceArea x1={150} x2={170} fill="#fd3737" fillOpacity={0.1} label={{ value: 'BREAKDOWN', fill: '#FAFAFA', fontSize: 10, position: 'insideTop' }} />
                  <XAxis dataKey="t" type="number" domain={[0, 232]} ticks={[0, 20, 56, 89, 117, 150, 180, 232]} tickFormatter={fmtT} stroke="#333" tick={tick} />
                  <YAxis stroke="#333" tick={tick} domain={[0, 110]} />
                  <Tooltip content={<ChartTip names={{ energy: 'Energy' }} dayFmt={fmtT} />} />
                  <Area type="monotone" dataKey="energy" stroke="#fd3737" fill="url(#gE)" strokeWidth={2} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className={s.rows} style={{ marginTop: 18 }}>
              {C.track.sections.map((x, i) => (
                <div key={x.from} className={`${s.row} ${s.row2}`} style={{ padding: '10px 0' }}>
                  <span className={s.mono} style={{ color: 'var(--red)', fontSize: 11 }}>{fmtT(x.from)}</span>
                  <p className={s.body} style={{ fontSize: 14 }}>{x.label}{i === 0 ? ', the title line over a filtered bed' : ''}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <div className={s.subhead}><h3 className={s.h3}>Three official sounds</h3></div>
          <Reveal className={`${s.cols} ${s.cols3}`}>
            {C.track.sounds.map((x) => (
              <div key={x.name} className={s.col}>
                <span className={s.colIdx}>{x.window}</span>
                <h4 className={s.colTitle}>{x.name}</h4>
                <p>{x.use}</p>
              </div>
            ))}
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 02 BASELINE */}
        <section id="start" className={s.section}>
          <Head n="02" label="Where Miguel starts" title="Audience *baseline.*" intro={C.baseline.listenerBody} />
          <Reveal className={s.figs} style={n(4)}>
            {C.baseline.stats.map((st, i) => (
              <div key={i}><span className={`${s.fig} ${i === 0 ? s.figRed : ''}`} style={{ fontSize: 'clamp(2rem, 3.8vw, 3.8rem)' }}>{st.value}</span><span className={s.figLabel}>{st.label}</span></div>
            ))}
          </Reveal>
          <Reveal className={s.chart} style={{ marginTop: 56 }}>
            <div className={s.chartHead}>
              <p className={`${s.mono} ${s.muted}`}>Spotify monthly listeners and followers, Chartmetric</p>
              <Legend items={[{ c: '#fd3737', l: 'Monthly listeners' }, { c: '#a1a1aa', l: 'Spotify followers (right)', dashed: true }]} />
            </div>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={listenerData} margin={{ top: 18, right: 0, left: -12, bottom: 0 }}>
                  {grid}
                  <XAxis dataKey="t" type="number" scale="time" domain={[ts('2025-09-01'), ts('2026-10-22')]} ticks={monthTicks} tickFormatter={fmtMonthYear} stroke="#333" tick={tick} />
                  <YAxis yAxisId="l" domain={[20000000, 40000000]} tickFormatter={fmtK} stroke="#333" tick={tick} />
                  <YAxis yAxisId="f" orientation="right" domain={[5500000, 7500000]} tickFormatter={fmtK} stroke="#333" tick={tick} width={46} />
                  <Tooltip content={<ChartTip names={{ listeners: 'Listeners', followers: 'Followers' }} />} />
                  <Line yAxisId="l" type="monotone" dataKey="listeners" stroke="#fd3737" strokeWidth={2.5} dot={{ r: 2.5, fill: '#fd3737', strokeWidth: 0 }} isAnimationActive={false} />
                  <Line yAxisId="f" type="monotone" dataKey="followers" stroke="#a1a1aa" strokeWidth={1.75} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className={s.note} style={{ marginTop: 12 }}>{C.baseline.listenerNote}</p>
          </Reveal>

          <div className={s.subhead}><h3 className={s.h3}>His channels today</h3><span className={`${s.mono} ${s.muted}`}>Chartmetric, 22 Oct 2026</span></div>
          <Reveal className={`${s.cols} ${s.cols4}`}>
            {C.baseline.social.map((x) => (
              <div key={x.platform} className={s.col}>
                <span className={s.colIdx}>{x.platform}</span>
                <span className={s.fig} style={{ fontSize: 'clamp(2rem, 3.6vw, 3.4rem)' }}>{x.followers}</span>
                <p style={{ marginTop: 12 }}>{x.note}</p>
              </div>
            ))}
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 03 MARKETS */}
        <section id="markets" className={s.section}>
          <Head n="03" label="Where people listen" title="Top *markets.*" intro={C.marketsBody} />
          <div className={`${s.split} ${s.splitWide}`}>
            <Reveal>
              <div className={s.chartHead} style={{ borderTop: '1px solid var(--line)', paddingTop: 18 }}>
                <p className={`${s.mono} ${s.muted}`}>Monthly listeners by country</p>
              </div>
              <div className={s.bars}>
                {C.markets.map((m, i) => (
                  <div key={m.country} className={`${s.bar} ${i === 1 ? s.barSelf : ''}`}>
                    <span className={s.barName}>{m.country}</span>
                    <Fill pct={(m.listeners / maxMarket) * 100} color={i < 2 ? '#fd3737' : '#71717a'} />
                    <span className={s.barVal} style={{ fontSize: 'clamp(1rem, 1.5vw, 1.35rem)' }}>{fmtK(m.listeners)}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className={s.chartHead} style={{ borderTop: '1px solid var(--line)', paddingTop: 18 }}>
                <p className={`${s.mono} ${s.muted}`}>Top cities</p>
              </div>
              <div className={s.bars}>
                {C.cities.map((c) => (
                  <div key={c.city} className={`${s.bar} ${s.cityBar}`}>
                    <span className={s.barName}>{c.city}</span>
                    <Fill pct={(c.listeners / maxCity) * 100} thin color={c.city === 'Los Angeles' ? '#fd3737' : '#71717a'} />
                    <span className={s.barVal} style={{ fontSize: '1.05rem' }}>{fmtK(c.listeners)}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className={s.subhead}><h3 className={s.h3}>Who the audience is</h3><span className={`${s.mono} ${s.muted}`}>{C.baseline.audience.source}</span></div>
          <Reveal className={s.figs} style={n(4)}>
            {C.baseline.audience.figs.map((f, i) => (
              <div key={f.l}><span className={`${s.fig} ${i === 0 ? s.figRed : ''}`}>{f.v}</span><span className={s.figLabel}>{f.l}</span></div>
            ))}
          </Reveal>
          <Reveal><p className={s.intro} style={{ marginTop: 32 }}>{C.baseline.audience.take}</p></Reveal>
          <p className={s.note} style={{ marginTop: 28 }}>{C.marketsNote}</p>
        </section>
        <div className={s.rule} />

        {/* 04 COMPS */}
        <section id="comps" className={s.section}>
          <Head n="04" label="Peer rollouts" title="Peer *rollouts.*" intro="Seven rollouts from the last eighteen months, what happened, and what we take from each into this plan." />
          <Reveal className={s.rows}>
            {C.comps.map((c, i) => (
              <div key={c.name} className={`${s.row} ${s.rowComp}`}>
                <span className={s.rowIdx}>{pad(i)}</span>
                <div>
                  <h4 className={s.rowTitle}>{c.name}</h4>
                  <p className={s.note} style={{ marginTop: 8 }}>{c.meta}</p>
                  <span className={`${s.tag} ${c.tag === 'The template' ? s.tagFill : c.tag === 'Watch-out' ? s.tagRed : ''}`} style={{ marginTop: 12 }}>{c.tag}</span>
                </div>
                <p className={s.rowBody}><span className={`${s.mono} ${s.muted}`} style={{ display: 'block', marginBottom: 8 }}>What happened</span>{c.what}</p>
                <p className={s.rowBody} style={{ color: 'var(--text2)' }}><span className={`${s.mono} ${s.red}`} style={{ display: 'block', marginBottom: 8 }}>What we take</span>{c.take}</p>
              </div>
            ))}
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 05 CALENDAR */}
        <section id="calendar" className={s.section}>
          <Head n="05" label="Release calendar" title="Release *calendar.*" intro="Announced releases and seasonal moments around the window. Album dates shift; we recheck this weekly until release." />
          <Reveal className={s.tableWrap}>
            <table className={`${s.table} ${s.tableMin}`}>
              <thead><tr><th>When</th><th>What</th><th>Impact</th><th>Note</th></tr></thead>
              <tbody>
                {C.calendar.map((r) => (
                  <tr key={r.when}>
                    <td style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16, whiteSpace: 'nowrap' }}>{r.when}</td>
                    <td data-label="What">{r.who}</td>
                    <td><span className={`${s.tag} ${r.level === 'High' ? s.tagFill : r.level === 'Medium' ? s.tagRed : ''}`}>{r.level}</span></td>
                    <td data-label="Note">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 06 LANDSCAPE */}
        <section id="landscape" className={s.section}>
          <Head n="06" label="The landscape" title="Platform *landscape.*" intro="The platform and format realities this plan is built around." />
          <Reveal className={s.rows}>
            {C.landscape.map((l, i) => (
              <div key={l.t} className={s.row}>
                <span className={s.rowIdx}>{pad(i)}</span>
                <h4 className={s.rowTitle}>{l.t}</h4>
                <p className={s.rowBody}>{l.d}</p>
              </div>
            ))}
          </Reveal>
        </section>

        <Band kicker="What we do with all of this" href={PLAN_URL}>Now the plan</Band>
        <Footer sources={C.sources} />
      </div>
    </Gated>
  );
}
