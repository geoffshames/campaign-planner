'use client';

import Link from 'next/link';
import { miguelHyh as C } from '@/lib/data/miguel-have-you-heard';
import { Band, Chrome, Footer, Gated, Head, Hero, InViewVideo, MAIL, Marquee, RESEARCH_URL, Reveal, s } from './shared';

const NAV: [string, string][] = [
  ['brief', 'Brief'], ['idea', 'The idea'], ['activations', 'Activations'], ['examples', 'Creative'], ['date', 'Date'], ['ladder', 'Stagger'], ['shoot', 'Shoots'], ['playbook', 'Playbook'],
  ['system', 'Content'], ['paid', 'Paid'], ['ideas', 'Ideas'], ['measure', 'Measure'], ['next', 'Next'],
];

const pad = (i: number) => String(i + 1).padStart(2, '0');
const display = { fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 17, letterSpacing: '-0.01em' } as const;

export function HyhPlan() {
  return (
    <Gated>
      <div className={s.page}>
        <Chrome current="plan" nav={NAV} />
        <Hero
          img="/images/miguel-have-you-heard/hero-plan.jpg"
          kicker="Single rollout plan"
          title="Miguel"
          line={<>Have You Heard</>}
          body={C.thesis}
          stats={[
            { v: '13 Nov', l: 'Recommended release, Friday' },
            { v: '13', l: 'Planned drops, October to December' },
            { v: '36.8M', l: 'Monthly listeners going in' },
          ]}
          meta={['Prepared for Miguel and RCA Records', 'The plan, October 2026']}
        />
        <Marquee items={['Have you heard?', 'Enjoy the ride', 'Let it move you', 'Heard it here first', 'One song, a long tail']} />

        {/* 01 BRIEF */}
        <section id="brief" className={s.section}>
          <Head n="01" label="The brief" title="The *brief.*" intro="What the plan has to do, and the four principles it is built on." />
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
          <Head n="02" label="The idea" title="The *idea.*" intro={C.idea.line} />
          <Reveal>
            <p className={s.quote}>{C.track.hook}</p>
            <p className={s.note} style={{ marginTop: 14 }}>{C.track.hookNote}</p>
            <p className={s.intro} style={{ marginTop: 28 }}>{C.track.read}</p>
          </Reveal>
          <div className={s.subhead}><h3 className={s.h3}>Four pillars</h3></div>
          <Reveal className={`${s.panels} ${s.panels2}`}>
            {C.idea.pillars.map((p, i) => (
              <div key={p.name} className={`${s.panel} ${i === 0 ? s.panelAlt : ''}`}>
                <p className={`${s.mono} ${s.red}`}>{pad(i)} {p.who}</p>
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
            {C.idea.why.map((w) => (
              <div key={w.t} className={s.col}>
                <span className={`${s.fig} ${s.figRed}`}>{w.n}</span>
                <h4 className={s.colTitle} style={{ marginTop: 16 }}>{w.t}</h4>
                <p>{w.d}</p>
              </div>
            ))}
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* ACTIVATIONS */}
        <section id="activations" className={s.section}>
          <Head n="03" label="Lyric activations" title="Lyric *activations.*" intro="Three real-world moments, each built from a line in the song. Each one is designed to produce footage fans film for us and to grow the S1C list, not to be an expensive stunt that ends when the night does." />
          {C.activations.map((x, i) => (
            <div key={x.name} className={s.feature} style={{ marginTop: i === 0 ? 0 : 'clamp(72px, 12vh, 140px)' }}>
              <Reveal className={s.featureMedia}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={x.img} alt={`${x.name}, example creative`} loading="lazy" />
                <span className={`${s.featureCap} ${s.mono}`}>Example, directional only</span>
              </Reveal>
              <div>
                <Reveal>
                  <p className={`${s.mono} ${s.red}`}>{pad(i)} {x.when}</p>
                  <h3 className={s.h3} style={{ fontSize: 'clamp(2.2rem, 4.4vw, 4rem)', margin: '16px 0 18px' }}>{x.name}</h3>
                  <p className={s.quote} style={{ fontSize: 'clamp(1.3rem, 2.2vw, 2rem)', lineHeight: 1.1 }}>{x.lyric}</p>
                  <p className={s.intro} style={{ marginTop: 24 }}>{x.d}</p>
                </Reveal>
                <div className={s.subhead} style={{ marginTop: 36 }}><h3 className={s.h3}>How it works</h3></div>
                <Reveal className={s.rows}>
                  {x.how.map((h, j) => (
                    <div key={j} className={`${s.row} ${s.row2}`}><span className={s.rowIdx}>{pad(j)}</span><p className={s.body}>{h}</p></div>
                  ))}
                </Reveal>
                <Reveal>
                  <p className={s.signal} style={{ marginTop: 20 }}><b>What it makes</b>{x.makes}</p>
                  <p className={s.signal}><b>Needs</b>{x.needs}</p>
                </Reveal>
              </div>
            </div>
          ))}
          <Reveal><p className={s.note} style={{ marginTop: 48 }}>{C.lyricNote}</p></Reveal>
        </section>
        <div className={s.rule} />

        {/* EXAMPLES */}
        <section id="examples" className={s.section}>
          <Head n="04" label="Example creative" title="Example *creative.*" intro={<><span className={`${s.tag} ${s.tagFill}`}>Examples, directional only</span><span style={{ display: 'block', marginTop: 16 }}>{C.examples.note}</span></>} />
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
            <div className={`${s.reelHint} ${s.mono}`}><span>Swipe for all {C.examples.items.length}</span><span>Stills: GPT Image 2.5. Video: Seedance 2.5</span></div>
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 03 DATE */}
        <section id="date" className={s.section}>
          <Head n="05" label="Release date" title="Release *date.*" intro={C.dateCall.intro} />
          <Reveal className={s.tableWrap}>
            <table className={`${s.table} ${s.tableMin}`}>
              <thead><tr><th style={{ width: '34%' }}>Factor</th><th>Fri 6 Nov</th><th>Fri 13 Nov</th></tr></thead>
              <tbody>
                {C.dateCall.rows.map((r) => (
                  <tr key={r.k}>
                    <td>{r.k}</td>
                    <td data-label="Fri 6 Nov">{r.a}</td>
                    <td data-label="Fri 13 Nov" style={{ color: 'var(--paper)' }}>{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <Reveal><p className={s.callout}>{C.dateCall.verdict}</p><p className={s.intro} style={{ marginTop: 24 }}>{C.dateCall.verdictBody}</p></Reveal>
          <div className={s.subhead}><h3 className={s.h3}>Key dates</h3></div>
          <Reveal>
            <dl style={{ margin: 0, borderTop: '1px solid var(--line)' }}>
              {C.dates.shoots.map((h) => (
                <div key={h.k} className={s.kv}><dt>{h.k}</dt><dd>{h.v}</dd></div>
              ))}
            </dl>
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 04 LADDER */}
        <section id="ladder" className={s.section}>
          <Head n="06" label="The stagger" title="Teaser and video *stagger.*" intro={C.ladder.intro} />
          <Reveal className={s.rows}>
            {C.ladder.items.map((x, i) => (
              <div key={x.when + x.what} className={s.row}>
                <span className={s.rowIdx}>{pad(i)}</span>
                <div>
                  <p className={`${s.mono} ${s.red}`} style={{ fontSize: 11, marginBottom: 8 }}>{x.when}</p>
                  <h4 className={s.rowTitle}>{x.what}</h4>
                  <span className={`${s.tag} ${x.tag === 'Release' || x.tag === 'Video' ? s.tagFill : x.tag.startsWith('Teaser') ? s.tagRed : ''}`} style={{ marginTop: 12 }}>{x.tag}</span>
                </div>
                <p className={s.rowBody}>{x.d}</p>
              </div>
            ))}
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 05 SHOOTS */}
        <section id="shoot" className={s.section}>
          <Head n="07" label="Shot lists" title="Shot *lists.*" intro="The stagger only works if the shoots produce enough distinct pieces. These are the captures we would ask for, alongside whatever the creative team has planned." />
          <Reveal className={`${s.panels} ${s.panels2}`}>
            {([['26 to 27 October', 'Short-form shoot', C.shootAsks.october], ['4 to 5 November', 'Music video shoot', C.shootAsks.video]] as const).map(([when, name, list], i) => (
              <div key={name} className={`${s.panel} ${i === 0 ? s.panelAlt : ''}`}>
                <p className={`${s.mono} ${s.red}`}>{when}</p>
                <h4 className={s.h3} style={{ margin: '18px 0 18px' }}>{name}</h4>
                <ul className={s.tlList}>
                  {list.map((a, j) => <li key={j}><b>{pad(j)}</b><span>{a}</span></li>)}
                </ul>
              </div>
            ))}
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 06 PLAYBOOK */}
        <section id="playbook" className={s.section}>
          <Head n="08" label="Week by week" title="Week by *week.*" intro="Built around a Friday 13 November release. If the date moves to 6 November, every week below shifts one week earlier." />
          <div className={s.timeline}>
            {C.weeks.map((w) => (
              <Reveal key={w.label} className={`${s.tlItem} ${w.label === 'Release week' ? s.tlAde : ''}`}>
                <div>
                  <p className={s.mono}><span className={s.red}>{w.label}</span><span className={s.muted}>&nbsp;&nbsp;{w.dates}</span></p>
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

        {/* 07 SYSTEM */}
        <section id="system" className={s.section}>
          <Head n="09" label="Content system" title="Content by *channel.*" intro="Each channel has one job per phase. Miguel’s feed carries the song, S1C carries the firsts, YouTube carries the video, and paid only follows what is already working." />
          <Reveal className={s.tableWrap}>
            <table className={`${s.table} ${s.tableMin}`}>
              <thead><tr><th>Phase</th><th>Miguel</th><th>S1C</th><th>YouTube</th><th>Paid</th></tr></thead>
              <tbody>
                {C.cadence.map((r) => (
                  <tr key={r.phase}>
                    <td style={{ ...display, whiteSpace: 'nowrap' }}>{r.phase}</td>
                    <td data-label="Miguel">{r.miguel}</td><td data-label="S1C">{r.s1c}</td><td data-label="YouTube">{r.youtube}</td><td data-label="Paid">{r.paid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 08 PAID */}
        <section id="paid" className={s.section}>
          <Head n="10" label="Paid media" title="Paid *media.*" intro={C.paid.intro} />
          <Reveal className={s.tableWrap}>
            <table className={`${s.table} ${s.tableMin}`}>
              <thead><tr><th style={{ width: '22%' }}>Channel</th><th>Role</th><th>How we run it</th></tr></thead>
              <tbody>
                {C.paid.channels.map((r) => (
                  <tr key={r.ch}>
                    <td style={display}>{r.ch}</td>
                    <td data-label="Role">{r.role}</td>
                    <td data-label="How we run it">{r.how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <div className={s.subhead}><h3 className={s.h3}>Techniques</h3></div>
          <Reveal className={`${s.cols} ${s.cols4}`}>
            {C.paid.techniques.map((x, i) => (
              <div key={x.t} className={s.col}>
                <span className={s.colIdx}>{pad(i)}</span>
                <h4 className={s.colTitle}>{x.t}</h4>
                <p>{x.d}</p>
              </div>
            ))}
          </Reveal>
          <Reveal><p className={s.callout}>{C.paid.markets}</p></Reveal>
        </section>
        <div className={s.rule} />

        {/* 09 IDEAS */}
        <section id="ideas" className={s.section}>
          <Head n="11" label="Creative ideas" title="Creative *ideas.*" intro="More ideas beyond the core plan and the three activations, each with who would need to say yes. Pick the ones that feel like Miguel." />
          <Reveal className={s.rows}>
            {C.ideas.map((x, i) => (
              <div key={x.t} className={s.row}>
                <span className={s.rowIdx}>{pad(i)}</span>
                <div>
                  <h4 className={s.rowTitle}>{x.t}</h4>
                  <span className={s.tag} style={{ marginTop: 12 }}>Needs: {x.ask}</span>
                </div>
                <p className={s.rowBody}>{x.d}</p>
              </div>
            ))}
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 10 MEASURE */}
        <section id="measure" className={s.section}>
          <Head n="12" label="Measurement" title="*Measurement.*" intro={C.measurement.body} />
          <Reveal className={s.rows}>
            {C.measurement.methods.map((m, i) => (
              <div key={m.t} className={s.row}>
                <span className={s.rowIdx}>{pad(i)}</span>
                <h4 className={s.rowTitle}>{m.t}</h4>
                <p className={s.rowBody}>{m.d}</p>
              </div>
            ))}
          </Reveal>
          <div className={s.subhead}><h3 className={s.h3}>What success looks like</h3></div>
          <Reveal className={`${s.cols} ${s.cols3}`}>
            {C.kpis.map((k, i) => (
              <div key={k.phase} className={s.col}>
                <span className={s.colIdx}>{pad(i)} {k.phase}</span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {k.items.map((it) => <li key={it} className={s.body} style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>{it}</li>)}
                </ul>
              </div>
            ))}
          </Reveal>
        </section>
        <div className={s.rule} />

        {/* 11 NEXT */}
        <section id="next" className={s.section}>
          <Head n="13" label="Risks and next steps" title="Risks and open *questions.*" intro="What could go wrong and what we do about it, then the answers that finalise the plan." />
          <Reveal className={s.tableWrap}>
            <table className={`${s.table} ${s.tableMin}`}>
              <thead><tr><th>Risk</th><th>Level</th><th>What we do</th></tr></thead>
              <tbody>
                {C.risks.map((r) => (
                  <tr key={r.r}>
                    <td style={display}>{r.r}</td>
                    <td><span className={`${s.tag} ${r.level === 'High' ? s.tagFill : r.level === 'Medium' ? s.tagRed : ''}`}>{r.level}</span></td>
                    <td data-label="What we do">{r.m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <div className={s.subhead}><h3 className={s.h3}>Open questions</h3></div>
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
