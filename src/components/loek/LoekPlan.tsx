'use client';

import Link from 'next/link';
import { loekTheOne as C } from '@/lib/data/loek-the-one';
import { Band, Chrome, Fill, Footer, Gated, Head, Hero, InViewVideo, MAIL, Marquee, RESEARCH_URL, Reveal, s } from './shared';

const NAV: [string, string][] = [
  ['heard', 'Brief'], ['idea', 'The idea'], ['examples', 'Creative'], ['system', 'Content'], ['playbook', 'Playbook'],
  ['ade', 'ADE'], ['measure', 'Measure'], ['budget', 'Budget'], ['next', 'Next'],
];

const pad = (i: number) => String(i + 1).padStart(2, '0');
const hook = C.track.hook.line.replace(/[“”"…]/g, '').trim();

const WHY = [
  { n: '17,054', t: 'Creates, not editorial', d: '“In My Arms” reached 12.39M streams with zero Spotify editorial support. It travelled on TikTok creates and user playlists. So the test phase is judged on creates of the official sounds.' },
  { n: '0:01', t: 'The hook is the intro', d: 'The vocal opens the record with no intro. Any clip cut from the first 16 seconds starts on the line people will sing back.' },
  { n: '2s', t: 'Cut on the beat', d: 'His best reels land the hook inside two seconds, cut every 1.5–2 seconds and caption the lyric one word at a time. His weakest are single takes.' },
];

export function LoekPlan() {
  return (
    <Gated>
      <div className={s.page}>
        <Chrome current="plan" nav={NAV} />
        <Hero
          img="/images/loek-the-one/hero-plan.jpg"
          kicker="ADE focus track · Island Berlin · Universal Music Germany"
          title="Loek"
          line={<>The One <small>(for a minute)</small></>}
          body={C.thesis}
          stats={[
            { v: '9 Oct', l: 'Recommended release, Friday' },
            { v: '21–25', l: 'ADE, October: the harvest' },
            { v: '€8–12K', l: 'Test budget before any scale' },
          ]}
          meta={['Prepared for David Korr · UMG Germany', 'The plan · September 2026']}
        />
        <Marquee items={['Be the one', 'For a minute', 'One brief, three voices', 'ADE is the harvest', 'Measure it this time']} />

        {/* 01 BRIEF */}
        <section id="heard" className={s.section}>
          <Head n="01" label="What we heard" title="One push, *done* properly." intro="The brief from the 22 September call, and the four principles the plan is built on." />
          <Reveal>
            <dl style={{ margin: 0, borderTop: '1px solid var(--line)' }}>
              {C.brief.heard.map((h) => (
                <div key={h.k} className={s.kv}><dt>{h.k}</dt><dd>{h.v}</dd></div>
              ))}
            </dl>
          </Reveal>
          <div className={s.subhead}><h3 className={s.h3}>Four principles</h3></div>
          <Reveal className={`${s.cols} ${s.cols4}`}>
            {C.brief.principles.map((p, i) => (
              <div key={p.t} className={s.col}>
                <span className={s.colIdx}>{pad(i)}</span>
                <h4 className={s.colTitle}>{p.t}</h4>
                <p>{p.d}</p>
              </div>
            ))}
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 02 IDEA */}
        <section id="idea" className={s.section}>
          <Head n="02" label="The idea" title="The one *for* *a* *minute.*" intro={C.idea.line} />
          <Reveal>
            <p className={s.quote}>{hook}</p>
            <p className={s.note} style={{ marginTop: 14 }}>{C.track.hook.note}</p>
            <p className={s.intro} style={{ marginTop: 28 }}>{C.track.hook.why}</p>
          </Reveal>
          <div className={s.subhead}><h3 className={s.h3}>Four pillars</h3><span className={`${s.mono} ${s.muted}`}>One brief · three voices</span></div>
          <Reveal className={`${s.panels} ${s.panels2}`}>
            {C.idea.pillars.map((p, i) => (
              <div key={p.name} className={`${s.panel} ${i === 0 ? s.panelAlt : ''}`}>
                <p className={`${s.mono} ${s.red}`}>{pad(i)} · {p.who}</p>
                <h4 className={s.h3} style={{ margin: '18px 0 14px' }}>{p.name}</h4>
                <p className={s.body}>{p.d}</p>
              </div>
            ))}
          </Reveal>

          <div className={s.subhead}>
            <h3 className={s.h3}>Why this idea</h3>
            <Link href={RESEARCH_URL} className={`${s.mono} ${s.red}`} style={{ textDecoration: 'none' }}>See the research →</Link>
          </div>
          <Reveal className={`${s.cols} ${s.cols3}`}>
            {WHY.map((w) => (
              <div key={w.t} className={s.col}>
                <span className={`${s.fig} ${s.figRed}`}>{w.n}</span>
                <h4 className={s.colTitle} style={{ marginTop: 16 }}>{w.t}</h4>
                <p>{w.d}</p>
              </div>
            ))}
          </Reveal>

          <div className={s.subhead}><h3 className={s.h3}>The mirror brief for Loek</h3></div>
          <Reveal className={s.rows}>
            {C.idea.mirrorBrief.map((m, i) => (
              <div key={i} className={`${s.row} ${s.row2}`}>
                <span className={s.rowIdx}>{pad(i)}</span>
                <p className={s.body} style={{ fontSize: 16 }}>{m}</p>
              </div>
            ))}
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 03 EXAMPLES */}
        <section id="examples" className={s.section}>
          <Head n="03" label="Example creative" title="What it *looks* like." intro={<><span className={`${s.tag} ${s.tagFill}`}>{C.examples.label}</span><span style={{ display: 'block', marginTop: 16 }}>{C.examples.note}</span></>} />
          <Reveal>
            <div className={s.reel}>
              {C.examples.items.map((e, i) => (
                <article key={e.src} className={`${s.clip} ${e.ratio === '4 / 5' ? s.clipWide : ''}`}>
                  <div className={s.clipMedia} style={{ aspectRatio: e.ratio }}>
                    {e.kind === 'video'
                      ? <InViewVideo src={e.src} poster={e.poster} />
                      // eslint-disable-next-line @next/next/no-img-element
                      : <img src={e.src} alt={`${e.title}, example creative`} loading="lazy" />}
                    <span className={s.clipChip}>Example</span>
                  </div>
                  <div className={s.clipMeta}>
                    <div>
                      <h3>{e.title}</h3>
                      <p className={s.mono} style={{ fontSize: 10, marginTop: 8, color: 'var(--red)' }}>{e.format}</p>
                      <p>{e.use}</p>
                    </div>
                    <span className={s.clipIdx}>{pad(i)}</span>
                  </div>
                </article>
              ))}
            </div>
            <div className={`${s.reelHint} ${s.mono}`}><span>Swipe for all six</span><span>Stills: GPT Image 2 · Video: Seedance 2.5</span></div>
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 04 SYSTEM */}
        <section id="system" className={s.section}>
          <Head n="04" label="Content system" title="Three voices, *one* idea." intro="Who posts what, and how often, in each phase. A scroller should meet the same idea three ways in the same fortnight." />
          <Reveal className={s.tableWrap}>
            <table className={`${s.table} ${s.tableMin}`}>
              <thead><tr><th>Phase</th><th>Loek</th><th>Meme pages</th><th>Clippers</th></tr></thead>
              <tbody>
                {C.cadence.map((r) => (
                  <tr key={r.phase}>
                    <td style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 17, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{r.phase}</td>
                    <td data-label="Loek">{r.loek}</td><td data-label="Meme pages">{r.pages}</td><td data-label="Clippers">{r.clippers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 05 PLAYBOOK */}
        <section id="playbook" className={s.section}>
          <Head n="05" label="Week by week" title="Six weeks, *one* curve." intro="Built around a Friday 9 October release. If the camp prefers 2 October, everything shifts one week earlier and ADE becomes week three." />
          <div className={s.timeline}>
            {C.weeks.map((w) => (
              <Reveal key={w.label} className={`${s.tlItem} ${w.label === 'ADE' ? s.tlAde : ''}`}>
                <div>
                  <p className={s.mono}><span className={s.red}>{w.label}</span><span className={s.muted}> · {w.dates}</span></p>
                  <h3 className={s.tlTitle}>{w.title}</h3>
                  <p className={s.body}>{w.objective}</p>
                </div>
                <div>
                  <ul className={s.tlList}>
                    {w.actions.map((a, j) => <li key={j}><b>{pad(j)}</b><span>{a}</span></li>)}
                  </ul>
                  <p className={s.signal}><b>Signal</b>{w.signals}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
        <div className={s.rule} />

        {/* 06 ADE */}
        <section id="ade" className={s.section}>
          <Head n="06" label={`ADE · ${C.ade.dates}`} title="Amsterdam is the *harvest.*" intro={<>Every appearance is a content set first and a gig second. {C.marketsNote.ade}</>} />
          <Reveal className={s.tableWrap}>
            <table className={`${s.table} ${s.tableMin}`}>
              <thead><tr><th>Appearance</th><th>Status</th><th>How we use it</th></tr></thead>
              <tbody>
                {C.ade.activations.map((a) => (
                  <tr key={a.name}>
                    <td style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 17, whiteSpace: 'nowrap' }}>{a.name}</td>
                    <td><span className={`${s.tag} ${a.status.startsWith('Confirmed') ? s.tagRed : ''}`}>{a.status}</span></td>
                    <td data-label="How we use it">{a.plan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <div className={s.feature} style={{ marginTop: 'clamp(56px, 9vh, 96px)' }}>
            <Reveal className={s.featureMedia}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/loek-the-one/examples/keyart-the-one-for-a-minute.jpg" alt="Pop-up key art, example creative" />
              <span className={`${s.featureCap} ${s.mono}`}>Example · directional only</span>
            </Reveal>
            <div>
              <Reveal>
                <p className={`${s.mono} ${s.red}`}>Pop-up concept</p>
                <h3 className={s.h3} style={{ fontSize: 'clamp(2rem, 4vw, 3.6rem)', margin: '16px 0 18px' }}>{C.ade.popup.name}</h3>
                <p className={s.intro}>{C.ade.popup.d}</p>
              </Reveal>
              <div className={s.subhead} style={{ marginTop: 48 }}><h3 className={s.h3}>Capture shot list</h3><span className={`${s.mono} ${s.muted}`}>Two-person crew</span></div>
              <Reveal className={s.rows}>
                {C.ade.shotlist.map((x, i) => (
                  <div key={i} className={`${s.row} ${s.row2}`}><span className={s.rowIdx}>{pad(i)}</span><p className={s.body}>{x}</p></div>
                ))}
              </Reveal>
            </div>
          </div>
        </section>
        <div className={s.rule} />

        {/* 07 MEASUREMENT */}
        <section id="measure" className={s.section}>
          <Head n="07" label="Measurement" title="An answer *this* time." intro={C.measurement.body} />
          <Reveal className={s.rows}>
            {C.measurement.methods.map((m, i) => (
              <div key={m.t} className={s.row}>
                <span className={s.rowIdx}>{pad(i)}</span>
                <h4 className={s.rowTitle}>{m.t}</h4>
                <p className={s.rowBody}>{m.d}</p>
              </div>
            ))}
          </Reveal>
          <Reveal>
            <p className={s.callout}>Switzerland is the clean control: 1.21 listeners per 1,000 people, the same as Germany and the Netherlands. <Link href={`${RESEARCH_URL}#markets`} className={s.red} style={{ textDecoration: 'none' }}>The holdout check →</Link></p>
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 08 BUDGET */}
        <section id="budget" className={s.section}>
          <Head n="08" label="Budget" title="Test, then *scale.*" intro={C.budget.note} />
          <Reveal className={`${s.panels} ${s.panels2}`}>
            {C.budget.phases.map((p, i) => (
              <div key={p.name} className={`${s.panel} ${i === 1 ? s.panelAlt : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'baseline' }}>
                  <p className={`${s.mono} ${s.red}`}>{pad(i)} · {p.name}</p>
                  <p className={`${s.mono} ${s.muted}`}>{p.window}</p>
                </div>
                <p className={s.range} style={{ marginTop: 22, color: i === 1 ? 'var(--red)' : undefined }}>{p.range}</p>
                <div className={s.lines}>
                  {p.lines.map((l, j) => (
                    <div key={l.item} className={s.line}>
                      <div className={s.lineTop}><span>{l.item}</span><b>{l.pct}%</b></div>
                      <Fill pct={l.pct * 2} thin color={j === 0 ? '#fd3737' : j === 1 ? '#d42d2d' : j === 2 ? '#a1a1aa' : '#71717a'} />
                    </div>
                  ))}
                </div>
                <p className={s.gate}>{p.gate}</p>
              </div>
            ))}
          </Reveal>
          <div className={s.subhead}><h3 className={s.h3}>What success looks like</h3></div>
          <Reveal className={`${s.cols} ${s.cols3}`}>
            {C.kpis.map((k, i) => (
              <div key={k.phase} className={s.col}>
                <span className={s.colIdx}>{pad(i)} · {k.phase}</span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {k.items.map((it) => <li key={it} className={s.body} style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>{it}</li>)}
                </ul>
              </div>
            ))}
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 09 NEXT */}
        <section id="next" className={s.section}>
          <Head n="09" label="Risks & next steps" title="Five answers *lock* it." intro="What could go wrong and what we do about it, then the five answers that finalise the plan." />
          <Reveal className={s.tableWrap}>
            <table className={`${s.table} ${s.tableMin}`}>
              <thead><tr><th>Risk</th><th>Level</th><th>What we do</th></tr></thead>
              <tbody>
                {C.risks.map((r) => (
                  <tr key={r.r}>
                    <td style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 17 }}>{r.r}</td>
                    <td><span className={`${s.tag} ${r.level === 'High' ? s.tagFill : r.level === 'Medium' ? s.tagRed : ''}`}>{r.level}</span></td>
                    <td data-label="What we do">{r.m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <div className={s.subhead}><h3 className={s.h3}>Open questions for the camp</h3></div>
          <Reveal className={s.rows}>
            {C.questions.map((q, i) => (
              <div key={i} className={`${s.row} ${s.row2}`}>
                <span className={s.rowIdx}>{pad(i)}</span>
                <p style={{ fontSize: 'clamp(1.02rem, 1.4vw, 1.2rem)', color: 'var(--paper)', lineHeight: 1.5 }}>{q}</p>
              </div>
            ))}
          </Reveal>
          <Reveal style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 40 }}>
            <a className={`${s.btn} ${s.btnRed}`} href={MAIL}>Reply to Geoff ↗</a>
            <Link className={s.btn} href={RESEARCH_URL}>Read the research →</Link>
          </Reveal>
        </section>

        <Band kicker="The evidence behind every call" href={RESEARCH_URL}>Read the research</Band>
        <Footer sources={C.sources} />
      </div>
    </Gated>
  );
}
