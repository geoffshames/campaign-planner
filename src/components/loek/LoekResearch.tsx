'use client';

import type { CSSProperties } from 'react';
import { ResponsiveContainer, ComposedChart, Area, Line, ReferenceArea, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { loekTheOne as C, energyCurve, dailyStreams, havenBenchmark } from '@/lib/data/loek-the-one';
import { Band, ChartTip, Chrome, Fill, Footer, Gated, Head, Hero, Legend, PLAN_URL, Reveal, fmtDay, fmtK, fmtMonth, s, tick, ts } from './shared';

const NAV: [string, string][] = [
  ['track', 'The track'], ['start', 'Baseline'], ['weekend', 'Weekend'], ['markets', 'Markets'], ['video', 'Video'], ['comps', 'Comps'],
];
const pad = (i: number) => String(i + 1).padStart(2, '0');
const n = (k: number) => ({ '--n': k }) as CSSProperties;
const fmtT = (x: number) => `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`;
const monthTicks = ['2026-03-01', '2026-04-01', '2026-05-01', '2026-06-01', '2026-07-01', '2026-08-01', '2026-09-01'].map(ts);
const grid = <CartesianGrid stroke="#1f1f1f" vertical={false} />;

/* Chartmetric, 23 Sep 2026: Spotify followers as a share of monthly listeners. */
const RATIOS = [
  { name: 'VisionV', sub: '2.0M listeners · 84.8K followers', pct: 4.22 },
  { name: 'Toby Romeo', sub: '3.4M listeners · 72.5K followers', pct: 2.1 },
  { name: 'HAVEN.', sub: '8.1M listeners · 43.8K followers', pct: 0.54 },
  { name: 'Loek', sub: '716K listeners · 4.4K followers', pct: 0.61, self: true },
];

export function LoekResearch() {
  const listenerData = C.baseline.listenerSeries.map((d) => ({ ...d, t: ts(d.date) }));
  const streamData = dailyStreams.map((d) => ({ ...d, t: ts(d.date) }));
  const havenData = havenBenchmark.map((d) => ({ ...d, t: ts(d.date) }));
  const maxMarket = Math.max(...C.markets.map((m) => m.listeners));
  const maxCity = Math.max(...C.cities.map((m) => m.listeners));
  const maxStreams = Math.max(...C.baseline.catalog.map((c) => c.streams));
  const roleColor = (r: string) => (r === 'Treated' ? '#fd3737' : r === 'Test market' ? '#d42d2d' : r ? '#a1a1aa' : '#333333');

  return (
    <Gated>
      <div className={s.page}>
        <Chrome current="research" nav={NAV} />
        <Hero
          img="/images/loek-the-one/hero-research.jpg"
          small
          kicker="Chartmetric · TwelveLabs · audio teardown · pulled 23 Sep 2026"
          title="The research"
          line="What the data says."
          body="Everything the plan is built on: the track itself, where Loek’s audience actually is, what his last two records say about creates versus paid, and what his best videos have in common."
          stats={[
            { v: '716K', l: 'Monthly listeners, down 42% from a 1.23M peak' },
            { v: '0', l: 'Editorial playlists behind 12.39M “In My Arms” streams' },
            { v: '17,054', l: 'TikTok creates on “In My Arms”. “Weekend” has 326' },
          ]}
          meta={['Loek · The One · Research', 'Sources at the foot of the page']}
        />

        {/* 01 TRACK */}
        <section id="track" className={s.section}>
          <Head n="01" label="The track" title="The hook *is* *the* *intro.*" intro={C.track.read} />
          <Reveal className={s.figs} style={n(6)}>
            {C.track.specs.map((sp) => (
              <div key={sp.label}><span className={s.fig} style={{ fontSize: 'clamp(1.8rem, 3.4vw, 3.4rem)' }}>{sp.value}</span><span className={s.figLabel}>{sp.label}</span></div>
            ))}
          </Reveal>
          <Reveal className={s.chart} style={{ marginTop: 56 }}>
            <div className={s.chartHead}>
              <p className={`${s.mono} ${s.muted}`}>Energy map · full 2:34</p>
              <Legend items={[{ c: '#fd3737', l: 'Full-mix energy' }, { c: '#a1a1aa', l: 'Vocal presence' }, { c: 'rgba(253,55,55,0.3)', l: 'Official sound windows' }]} />
            </div>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={energyCurve} margin={{ top: 16, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fd3737" stopOpacity={0.55} /><stop offset="100%" stopColor="#fd3737" stopOpacity={0} /></linearGradient>
                    <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a1a1aa" stopOpacity={0.45} /><stop offset="100%" stopColor="#a1a1aa" stopOpacity={0} /></linearGradient>
                  </defs>
                  {grid}
                  <ReferenceArea x1={0} x2={16} fill="#fd3737" fillOpacity={0.08} label={{ value: 'SOUND A', fill: '#FAFAFA', fontSize: 10, position: 'insideTop' }} />
                  <ReferenceArea x1={30} x2={62} fill="#fd3737" fillOpacity={0.08} label={{ value: 'SOUND B', fill: '#FAFAFA', fontSize: 10, position: 'insideTop' }} />
                  <XAxis dataKey="t" type="number" domain={[0, 152]} ticks={[0, 16, 47, 76, 120, 152]} tickFormatter={fmtT} stroke="#333" tick={tick} />
                  <YAxis stroke="#333" tick={tick} domain={[0, 110]} />
                  <Tooltip content={<ChartTip names={{ energy: 'Energy', vocal: 'Vocal' }} dayFmt={fmtT} />} />
                  <Area type="monotone" dataKey="vocal" stroke="#a1a1aa" fill="url(#gV)" strokeWidth={1.5} isAnimationActive={false} />
                  <Area type="monotone" dataKey="energy" stroke="#fd3737" fill="url(#gE)" strokeWidth={2} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className={s.note} style={{ marginTop: 12 }}>{C.track.sections.map((x) => `${fmtT(x.from)}–${fmtT(x.to)} ${x.label}`).join(' · ')}</p>
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
          <Head n="02" label="Where Loek starts" title="Borrowed reach, now *decaying.*" intro={C.baseline.listenerNote.body} />
          <Reveal className={s.figs} style={n(5)}>
            {C.baseline.stats.map((st, i) => (
              <div key={i}><span className={`${s.fig} ${i === 0 ? s.figRed : ''}`} style={{ fontSize: 'clamp(2rem, 3.8vw, 3.8rem)' }}>{st.value}</span><span className={s.figLabel}>{st.label}</span></div>
            ))}
          </Reveal>
          <Reveal className={s.chart} style={{ marginTop: 56 }}>
            <div className={s.chartHead}>
              <p className={`${s.mono} ${s.muted}`}>Spotify monthly listeners · Chartmetric</p>
              <Legend items={[{ c: '#fd3737', l: 'Monthly listeners' }, { c: '#a1a1aa', l: 'Spotify followers (right)', dashed: true }]} />
            </div>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={listenerData} margin={{ top: 18, right: 0, left: -12, bottom: 0 }}>
                  {grid}
                  <ReferenceArea yAxisId="l" x1={ts('2026-07-05')} x2={ts('2026-07-17')} fill="#fd3737" fillOpacity={0.1} />
                  <ReferenceLine yAxisId="l" x={ts('2026-03-11')} stroke="#555" strokeDasharray="3 3" label={{ value: 'IN MY ARMS', fill: '#E4E4E9', fontSize: 10, position: 'insideTopLeft' }} />
                  <ReferenceLine yAxisId="l" x={ts('2026-06-19')} stroke="#555" strokeDasharray="3 3" label={{ value: 'WEEKEND', fill: '#E4E4E9', fontSize: 10, position: 'insideTopLeft' }} />
                  <XAxis dataKey="t" type="number" scale="time" domain={[ts('2026-03-01'), ts('2026-09-23')]} ticks={monthTicks} tickFormatter={fmtMonth} stroke="#333" tick={tick} />
                  <YAxis yAxisId="l" domain={[0, 1400000]} tickFormatter={fmtK} stroke="#333" tick={tick} />
                  <YAxis yAxisId="f" orientation="right" domain={[3000, 5000]} tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} stroke="#333" tick={tick} width={42} />
                  <Tooltip content={<ChartTip names={{ listeners: 'Listeners', followers: 'Followers' }} />} />
                  <Line yAxisId="l" type="monotone" dataKey="listeners" stroke="#fd3737" strokeWidth={2.5} dot={{ r: 3, fill: '#fd3737', strokeWidth: 0 }} isAnimationActive={false} />
                  <Line yAxisId="f" type="monotone" dataKey="followers" stroke="#a1a1aa" strokeWidth={1.75} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className={s.note} style={{ marginTop: 12 }}>{C.baseline.listenerNote.note} Shaded: 5–17 Jul “Weekend” stream lift.</p>
          </Reveal>

          <div className={s.split} style={{ marginTop: 'clamp(64px, 10vh, 110px)' }}>
            <Reveal>
              <p className={`${s.mono} ${s.muted}`} style={{ marginBottom: 18 }}>Spotify followers per 100 monthly listeners</p>
              <h3 className={s.h3} style={{ fontSize: 'clamp(2rem, 4vw, 3.6rem)' }}>Listeners <span className={s.red}>rent.</span> They don’t follow.</h3>
              <p className={s.body} style={{ marginTop: 18 }}>{C.baseline.body}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className={s.bars}>
                {RATIOS.map((r) => (
                  <div key={r.name} className={`${s.bar} ${r.self ? s.barSelf : ''}`}>
                    <span className={s.barName}>{r.name}<small>{r.sub}</small></span>
                    <Fill pct={(r.pct / 4.5) * 100} />
                    <span className={s.barVal}>{r.pct.toFixed(2)}%</span>
                  </div>
                ))}
              </div>
              <p className={s.callout}>Every 1,000 people who hear Loek leave six followers behind. VisionV keeps 42.</p>
            </Reveal>
          </div>

          <div className={s.subhead}><h3 className={s.h3}>Catalog, Spotify streams</h3><span className={`${s.mono} ${s.muted}`}>Chartmetric · 23 Sep 2026</span></div>
          <Reveal className={s.bars}>
            {C.baseline.catalog.map((c, i) => (
              <div key={c.title} className={`${s.bar} ${i === 0 ? s.barSelf : ''}`}>
                <span className={s.barName}>{c.title}<small>{c.credit}</small></span>
                <div><Fill pct={(c.streams / maxStreams) * 100} thin color={i < 2 ? '#fd3737' : '#71717a'} /><p className={s.note} style={{ marginTop: 6 }}>{c.daily}</p></div>
                <span className={s.barVal} style={{ color: i === 0 ? 'var(--red)' : undefined }}>{fmtK(c.streams)}</span>
              </div>
            ))}
          </Reveal>

          <div className={s.subhead}><h3 className={s.h3}>On his own channels</h3><span className={`${s.mono} ${s.muted}`}>39 reels · 20 TikToks · TokScript</span></div>
          <Reveal className={s.rows}>
            {C.baseline.social.map((x, i) => (
              <div key={x.t} className={s.row}>
                <span className={s.rowIdx}>{pad(i)}</span>
                <h4 className={s.rowTitle}>{x.t}</h4>
                <p className={s.rowBody}>{x.d}</p>
              </div>
            ))}
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 03 WEEKEND */}
        <section id="weekend" className={s.section}>
          <Head n="03" label="The “Weekend” question" title="What the *boost* did." intro={C.baseline.streamsNote.body} />
          <Reveal className={s.chart}>
            <div className={s.chartHead}>
              <p className={`${s.mono} ${s.muted}`}>Daily Spotify streams · Chartmetric</p>
              <Legend items={[{ c: '#fd3737', l: 'Weekend' }, { c: '#a1a1aa', l: 'In My Arms' }]} />
            </div>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={streamData} margin={{ top: 18, right: 8, left: -12, bottom: 0 }}>
                  {grid}
                  <ReferenceArea x1={ts('2026-07-05')} x2={ts('2026-07-17')} fill="#fd3737" fillOpacity={0.12} label={{ value: 'LIFT', fill: '#FAFAFA', fontSize: 10, position: 'insideTopLeft' }} />
                  <ReferenceLine x={ts('2026-06-19')} stroke="#555" strokeDasharray="3 3" label={{ value: 'WEEKEND OUT', fill: '#E4E4E9', fontSize: 10, position: 'insideTopRight' }} />
                  <XAxis dataKey="t" type="number" scale="time" domain={[ts('2026-03-01'), ts('2026-09-23')]} ticks={monthTicks} tickFormatter={fmtMonth} stroke="#333" tick={tick} />
                  <YAxis tickFormatter={fmtK} stroke="#333" tick={tick} />
                  <Tooltip content={<ChartTip names={{ weekend: 'Weekend', ima: 'In My Arms' }} />} />
                  <Line type="monotone" dataKey="ima" stroke="#a1a1aa" strokeWidth={1.5} dot={false} connectNulls isAnimationActive={false} />
                  <Line type="monotone" dataKey="weekend" stroke="#fd3737" strokeWidth={2.5} dot={false} connectNulls isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className={s.note} style={{ marginTop: 12 }}>{C.baseline.streamsNote.note}</p>
          </Reveal>

          <div className={s.subhead}><h3 className={s.h3}>{C.baseline.playlists.headline}</h3></div>
          <Reveal className={s.tableWrap}>
            <table className={`${s.table} ${s.tableMin}`}>
              <thead><tr><th style={{ width: '18%' }}>Source</th>{C.baseline.playlists.rows.map((r) => <th key={r.track}>{r.track} · {r.streams} streams</th>)}</tr></thead>
              <tbody>
                {([['Spotify editorial', 'editorial'], ['Algorithmic', 'algorithmic'], ['User playlists', 'user'], ['TikTok', 'tiktok']] as const).map(([lbl, key]) => (
                  <tr key={key}>
                    <td className={s.mono} style={{ color: 'var(--red)', paddingTop: 19 }}>{lbl}</td>
                    {C.baseline.playlists.rows.map((r) => <td key={r.track} data-label={r.track} style={{ color: key === 'tiktok' ? 'var(--paper)' : undefined, fontFamily: key === 'tiktok' ? 'var(--display)' : undefined, fontSize: key === 'tiktok' ? 20 : undefined, textTransform: key === 'tiktok' ? 'uppercase' : undefined }}>{r[key]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <Reveal><p className={s.callout}>{C.baseline.playlists.take}</p></Reveal>
        </section>
        <div className={s.rule} />

        {/* 04 MARKETS */}
        <section id="markets" className={s.section}>
          <Head n="04" label="Where people listen" title="A global base, a *European* test." intro={C.marketsNote.body} />
          <div className={`${s.split} ${s.splitWide}`}>
            <Reveal>
              <div className={s.chartHead} style={{ borderTop: '1px solid var(--line)', paddingTop: 18 }}>
                <p className={`${s.mono} ${s.muted}`}>Monthly listeners by country · per 1,000 people</p>
                <Legend items={[{ c: '#fd3737', l: 'Treated' }, { c: '#a1a1aa', l: 'Holdout' }, { c: '#d42d2d', l: 'Test market' }]} />
              </div>
              <div className={s.bars}>
                {C.markets.map((m) => (
                  <div key={m.code} className={s.bar}>
                    <span className={s.barName}>{m.country}<small style={{ color: m.role === 'Treated' ? 'var(--red)' : undefined }}>{m.role || '—'} · {m.perK.toFixed(2)} / 1K</small></span>
                    <Fill pct={(m.listeners / maxMarket) * 100} color={roleColor(m.role)} />
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
                  <div key={c.city} className={`${s.bar} ${s.cityBar} ${c.city === 'Amsterdam' ? s.barSelf : ''}`}>
                    <span className={s.barName}>{c.city}<small>{c.code}</small></span>
                    <Fill pct={(c.listeners / maxCity) * 100} thin color={c.city === 'Amsterdam' ? '#fd3737' : '#71717a'} />
                    <span className={s.barVal} style={{ fontSize: '1.05rem' }}>{fmtK(c.listeners)}</span>
                  </div>
                ))}
              </div>
              <p className={s.callout} style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.4rem)' }}>{C.marketsNote.ade}</p>
            </Reveal>
          </div>

          <div className={s.subhead}><h3 className={s.h3}>Holdout check</h3><span className={`${s.mono} ${s.muted}`}>Treated: DE · NL · UK</span></div>
          <Reveal className={`${s.cols} ${s.cols4}`}>
            {C.marketsNote.verdicts.map((v, i) => (
              <div key={v.t} className={s.col}>
                <span className={s.colIdx}>{v.t}</span>
                <h4 className={s.colTitle} style={{ color: i === 0 ? 'var(--red)' : undefined, fontSize: 'clamp(1.5rem, 2.4vw, 2.2rem)' }}>{v.v}</h4>
                <p>{v.d}</p>
              </div>
            ))}
          </Reveal>

          <div className={s.subhead}><h3 className={s.h3}>Who the audience is</h3><span className={`${s.mono} ${s.muted}`}>{C.baseline.audience.source}</span></div>
          <Reveal className={s.figs} style={n(4)}>
            <div><span className={`${s.fig} ${s.figRed}`}>77%</span><span className={s.figLabel}>Female</span></div>
            <div><span className={s.fig}>54%</span><span className={s.figLabel}>Aged 18–24 (27% are 25–34)</span></div>
            <div><span className={s.fig}>31%</span><span className={s.figLabel}>Of all Instagram likes come from the UK</span></div>
            <div><span className={s.fig}>4%</span><span className={s.figLabel}>Come from Germany, his #2 streaming market</span></div>
          </Reveal>
          <Reveal><p className={s.intro} style={{ marginTop: 32 }}>{C.baseline.audience.take}</p></Reveal>
          <p className={s.note} style={{ marginTop: 28 }}>{C.marketsNote.note}</p>
        </section>
        <div className={s.rule} />

        {/* 05 VIDEO */}
        <section id="video" className={s.section}>
          <Head n="05" label="Video intelligence · TwelveLabs" title="Winners cut on *the* *beat.*" intro={C.videoIntel.body} />
          <Reveal className={s.tableWrap}>
            <table className={`${s.table} ${s.tableMin}`}>
              <thead><tr><th>Post</th><th>Result</th><th>Hook timing</th><th>Edit</th><th>Format</th></tr></thead>
              <tbody>
                {C.videoIntel.rows.map((r) => (
                  <tr key={r.post}>
                    <td>{r.post}</td>
                    <td style={{ whiteSpace: 'nowrap' }}><span className={`${s.tag} ${r.verdict === 'win' ? s.tagFill : r.verdict === 'paid' ? s.tagRed : ''}`}>{r.result}</span></td>
                    <td data-label="Hook timing">{r.hook}</td><td data-label="Edit">{r.cuts}</td><td data-label="Format">{r.format}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <div className={s.subhead}><h3 className={s.h3}>The edit rules for every “The One” asset</h3></div>
          <Reveal className={s.rows}>
            {C.videoIntel.rules.map((r, i) => (
              <div key={r.t} className={s.row}>
                <span className={s.rowIdx}>{pad(i)}</span>
                <h4 className={s.rowTitle}>{r.t}</h4>
                <p className={s.rowBody}>{r.d}</p>
              </div>
            ))}
          </Reveal>

          <div className={s.subhead}><h3 className={s.h3}>{C.youtube.headline}</h3><span className={`${s.mono} ${s.muted}`}>YouTube · 23 Sep 2026</span></div>
          <Reveal className={s.figs} style={n(3)}>
            <div><span className={`${s.fig} ${s.figRed}`}>21.4M</span><span className={s.figLabel}>“I Run” lyric video on a third-party channel</span></div>
            <div><span className={s.fig}>622K</span><span className={s.figLabel}>“I Run” official video</span></div>
            <div><span className={s.fig}>7K</span><span className={s.figLabel}>“Weekend” official visualizer</span></div>
          </Reveal>
          <Reveal><p className={s.intro} style={{ marginTop: 32 }}>{C.youtube.body}</p></Reveal>
          <Reveal className={s.rows} style={{ marginTop: 32 }}>
            {C.youtube.actions.map((a, i) => (
              <div key={i} className={`${s.row} ${s.row2}`}><span className={s.rowIdx}>{pad(i)}</span><p className={s.body}>{a}</p></div>
            ))}
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 06 COMPS */}
        <section id="comps" className={s.section}>
          <Head n="06" label="Comparables" title="How this sound *travels.*" intro="Seven releases that tell us how this sound moves right now, and what to take from each. HAVEN.’s “I Run” is the structural twin." />
          <Reveal className={s.chart}>
            <div className={s.chartHead}>
              <div>
                <p className={`${s.mono} ${s.red}`}>Benchmark · HAVEN. “I Run” · Chartmetric</p>
                <h3 className={s.h3} style={{ marginTop: 12 }}>{C.benchmark.headline}</h3>
              </div>
              <Legend items={[{ c: '#fd3737', l: 'Monthly listeners' }, { c: '#a1a1aa', l: 'Creates, original (right)', dashed: true }, { c: '#d42d2d', l: 'Creates, re-record', dot: true }]} />
            </div>
            <p className={s.body} style={{ maxWidth: '80ch', marginBottom: 18 }}>{C.benchmark.body}</p>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={havenData} margin={{ top: 18, right: 0, left: -12, bottom: 0 }}>
                  {grid}
                  <ReferenceLine yAxisId="l" x={ts('2025-10-29')} stroke="#555" strokeDasharray="3 3" label={{ value: 'ORIGINAL OUT', fill: '#E4E4E9', fontSize: 10, position: 'insideTopLeft' }} />
                  <ReferenceLine yAxisId="l" x={ts('2025-11-21')} stroke="#555" strokeDasharray="3 3" label={{ value: 'RE-RECORD OUT', fill: '#E4E4E9', fontSize: 10, position: 'insideTopLeft' }} />
                  <XAxis dataKey="t" type="number" scale="time" domain={[ts('2025-10-27'), ts('2025-12-05')]} ticks={['2025-11-01', '2025-11-08', '2025-11-15', '2025-11-22', '2025-11-29'].map(ts)} tickFormatter={fmtDay} stroke="#333" tick={tick} />
                  <YAxis yAxisId="l" domain={[0, 8000000]} tickFormatter={fmtK} stroke="#333" tick={tick} />
                  <YAxis yAxisId="c" orientation="right" domain={[0, 250000]} tickFormatter={fmtK} stroke="#333" tick={tick} width={42} />
                  <Tooltip content={<ChartTip names={{ listeners: 'Monthly listeners', creates: 'Creates (original)', createsRerecord: 'Creates (re-record)' }} />} />
                  <Line yAxisId="l" type="monotone" dataKey="listeners" stroke="#fd3737" strokeWidth={2.5} dot={{ r: 3, fill: '#fd3737', strokeWidth: 0 }} connectNulls isAnimationActive={false} />
                  <Line yAxisId="c" type="monotone" dataKey="creates" stroke="#a1a1aa" strokeWidth={1.75} strokeDasharray="5 4" dot={{ r: 2, fill: '#a1a1aa', strokeWidth: 0 }} connectNulls isAnimationActive={false} />
                  <Line yAxisId="c" dataKey="createsRerecord" stroke="#d42d2d" strokeWidth={0} dot={{ r: 5, fill: '#d42d2d', strokeWidth: 0 }} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className={s.note} style={{ marginTop: 12 }}>{C.benchmark.note}</p>
          </Reveal>

          <div className={s.subhead}><h3 className={s.h3}>Seven comparables</h3></div>
          <Reveal className={s.rows}>
            {C.comps.map((c, i) => (
              <div key={c.name} className={`${s.row} ${s.rowComp}`}>
                <span className={s.rowIdx}>{pad(i)}</span>
                <div>
                  <h4 className={s.rowTitle}>{c.name}</h4>
                  <p className={s.note} style={{ marginTop: 8 }}>{c.meta}</p>
                  <span className={`${s.tag} ${c.tag === 'Structural twin' ? s.tagFill : ''}`} style={{ marginTop: 12 }}>{c.tag}</span>
                </div>
                <p className={s.rowBody}><span className={`${s.mono} ${s.muted}`} style={{ display: 'block', marginBottom: 8 }}>What happened</span>{c.what}</p>
                <p className={s.rowBody} style={{ color: 'var(--text2)' }}><span className={`${s.mono} ${s.red}`} style={{ display: 'block', marginBottom: 8 }}>What we take</span>{c.take}</p>
              </div>
            ))}
          </Reveal>

          <div className={s.subhead}><h3 className={s.h3}>What the landscape says</h3></div>
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
