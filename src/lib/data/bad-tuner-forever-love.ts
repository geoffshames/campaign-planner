// Bad Tuner — "forever love" EP campaign + content strategy
// Research: Tokscript (cadence/hooks), TwelveLabs Pegasus (visual teardown), web + Spotify.

export const badTuner = {
  slug: 'bad-tuner-forever-love',
  artist: 'bad tuner',
  song: 'forever love',
  releaseType: 'EP',
  genre: 'House / UK Garage',
  releaseDate: 'October 2, 2026',
  tier: 'Mid-Level · Streaming-Strong',
  label: 'Independent Co. / The Orchard',
  homeBase: 'Brooklyn, NY',
  campaignWindow: 'May 20 – October 2, 2026 · four-single cascade into the EP',
  generatedDate: 'May 20, 2026',

  // ── Release calendar ──
  calendar: [
    { date: 'Jun 12', label: 'Single 1 — Young Soul', kind: 'single' },
    { date: 'Jul 10', label: 'Single 2', kind: 'single' },
    { date: 'Aug 7', label: 'Single 3 + EP announce', kind: 'announce' },
    { date: 'Sep 4', label: 'Single 4', kind: 'single' },
    { date: 'Oct 2', label: 'forever love EP', kind: 'ep' },
  ],

  // ── 02 The Diagnosis / Artist Position ──
  diagnosis: {
    headline: 'The streaming star that is hiding on social.',
    body:
      'bad tuner has 412.5K Spotify monthly listeners but only ~16.8K TikTok followers and ~12K on Instagram. He has posted 1,625 TikToks that average roughly 200 likes each. The gap is not effort and it is not frequency. He already posts far more than Barry Cant Swim, Fred Again and Joy Anonymous combined. The problem is format and intent: roughly 90% of his recent posts are gig flyers (\"lmk if you wanna come\", \"tickets in bio\"). The single rule every winning comp follows is the one rule he breaks: they never post ads. The fix is not more posting. It is a repeatable, phone-shot \"show the making\" engine that converts the 412K people who already stream him into followers and pre-savers.',
    stats: [
      { value: '412.5K', label: 'Spotify monthly listeners', tone: 'good' },
      { value: '16.8K', label: 'TikTok followers (1,625 posts)', tone: 'bad' },
      { value: '~200', label: 'Avg likes per TikTok', tone: 'bad' },
      { value: '~90%', label: 'Recent posts that are gig flyers', tone: 'bad' },
    ],
    social: [
      { platform: 'Spotify', value: '412.5K', sub: 'monthly listeners', pct: 100 },
      { platform: 'TikTok', value: '16.8K', sub: '@badtuner · 1,625 videos', pct: 24 },
      { platform: 'Instagram', value: '~12K', sub: '@bad_tuner', pct: 17 },
    ],
    context: [
      'Brooklyn, NY producer — DJ + multi-instrumentalist. House, UK garage and French house lean.',
      'Distributed through The Orchard via Independent Co. Foreign Family Collective lineage; toured supporting TOKiMONSTA; remixes for Two Another and CLAVVS.',
      'Prior EP “lately in the void” (Feb 2026); recent singles “in this world” and “let em rock.” forever love is the next chapter.',
      'Already has the raw material: throws his own NYC parties (Public Records) and has played The Lot Radio — the exact long-form footage source this plan leans on.',
    ],
    liveMarkets: ['New York', 'Los Angeles', 'San Francisco', 'Chicago', 'Denver', 'Portland'],
  },

  // ── 03 Comp Content Teardown ──
  comps: [
    {
      name: 'Barry Cant Swim',
      handle: '@barrycantswim',
      followers: '117.7K TikTok',
      volume: '214 videos · ~3-4 posts/mo',
      engagement: '~6,000 likes/video avg (30x bad tuner)',
      formats: [
        'Unreleased-track teaser with a recurring named motif (“Bhibo”, “Big Dunc”, #trackid) so fans beg for the ID',
        'Story-driven track-discovery captions (“first heard this at Sneaky Pete’s years ago”)',
        'Live moments + b2b collabs (Sammy Virji, salute, Bonobo)',
        'Funnels every clip to “full set on YouTube now” — including The Lot Radio',
      ],
      signature: 'Self-deprecating voice + 🌊🏊‍♂️ on every post',
      topPost: '“First heard this record at Sneaky Pete’s…” — 519K plays, 27.6K likes, 5,073 saves',
      takeaway: 'Curation > volume. He posts 8x less than bad tuner and gets 30x the engagement, because every post is a story or a tease, never an ad.',
    },
    {
      name: 'Fred Again',
      handle: '@fredagainagain',
      followers: '1.5M TikTok',
      volume: '525 videos',
      engagement: 'Millions of plays per post',
      formats: [
        'Live collab moments (Ezra Collective, Kano, Daft Punk, Mike Skinner)',
        'Diaristic, lowercase, vulnerable captions that do the emotional work',
        'Lyric / keyword text overlays synced to emotional peaks',
        '“The whole show is live on YouTube / Apple Music now” long-form funnel',
      ],
      signature: 'Lowercase diary voice; “usb is infinite”',
      topPost: 'Underworld “Born Slippy” rework story — 5.8M plays, 671K likes, 72.6K saves',
      takeaway: 'The caption is the content. A vulnerable, specific story under a live moment outperforms any polished promo.',
    },
    {
      name: 'Joy Anonymous',
      handle: '@joyanonymous',
      followers: '22.7K TikTok',
      volume: '498 videos',
      engagement: '~800 baseline; live clips spike to 130K+',
      formats: [
        'Filmed jam sessions and communal “meeting” concept',
        'Live festival crowd moments (the breakout format)',
        'Playful wordplay hooks (“Buttery Brisket Bass”, “made in Rio”)',
        'Direct-to-camera message of connection / joy',
      ],
      signature: '“Join The Movement” + 🙆‍♂️ communal energy',
      topPost: 'JOY (Chella) live crowd clip — 133K plays vs their ~800 baseline',
      takeaway: 'The closest peer at bad tuner’s social scale. Their lesson: even with a small following, a single live crowd moment outperforms 50 studio clips.',
    },
    {
      name: 'ZEP',
      handle: '@whatszep',
      followers: 'IG: 1M+ views on tentpole reels',
      volume: 'Frequent · persona-led',
      engagement: 'Up to 3.8M views / 371K likes per reel',
      formats: [
        'Persona-first lifestyle reels — the artist IS the content; music is secondary',
        'Short ALL-CAPS punchy captions ("IM BALD AS SHYT", "gimme the aux", "TRYNA DO")',
        'A running personal narrative thread (the bald-head saga, "bought my first car")',
        'Release + tour beats woven in ("NO ENEMIES. FRIDAY.", "LA already sold out")',
      ],
      signature: 'Loud, irreverent, meme-fluent persona; all-caps voice',
      topPost: '"IM BALD AS SHYT" — 3.85M views, 371K likes',
      takeaway: 'Personality and a running narrative beat polish. A character people follow turns every post into reach — the opposite of a faceless gig-flyer feed.',
    },
    {
      name: '&friends.',
      handle: '@andfriends.nyc',
      followers: 'NYC artist-content series',
      volume: '~Weekly artist features',
      engagement: '~1-5K likes; tentpoles 90K+ views',
      formats: [
        'A recurring, named, place-rooted series ("a NY minute / sixty seconds in NY with [artist]")',
        'Intimate phone-shot walk-and-talks around NYC with rising artists',
        'Network effect — every episode borrows the featured artist’s audience',
        '"&friends." collab edits + year-in-review as tentpoles',
      ],
      signature: 'NYC-rooted, recurring "&friends." / "NY minute" naming',
      topPost: '"underscores &friends." + the @idkgreek NY-minute recap (92K views)',
      takeaway: 'The model for a recurring, NYC-owned format — and a live partner: bad tuner should BE in a &friends. NY minute. Borrowed audience + the exact Brooklyn identity this plan is built on.',
    },
  ],
  compNote:
    'Worth adding to the watch-list: Sammy Virji and salute (in Barry’s collab network) are the UK-garage social benchmarks bad tuner’s sound sits next to.',

  // ── 04 Video Intelligence (TwelveLabs Pegasus) ──
  videoIntel: {
    analyzed: 6,
    summary:
      'Six top-performing comp videos were run through TwelveLabs Pegasus for frame-level analysis. The visual language that wins is remarkably consistent — and it is cheap to copy.',
    patterns: [
      { pattern: 'Text-on-screen in the first 3 seconds', prevalence: '6 of 6 videos', implication: 'Open every clip with a context line (“made this beat from a subway sound”). Zero cost, sets the hook, lifts retention.' },
      { pattern: 'Phone-shot and raw beats polished', prevalence: '6 of 6 videos', implication: 'bad tuner’s glossy “let em rock” video underperformed his raw clips. Shoot on a phone. “The key is not perfection, but presence.”' },
      { pattern: 'The drop is engineered onto a visual peak', prevalence: '4 of 6 explicit', implication: 'Cut the clip so the drop lands on a movement, a crowd reaction or a face — Fred at 0:55, Barry at 0:15, bad tuner’s own best at 0:08.' },
      { pattern: 'Edit pace splits by format', prevalence: 'Live = sub-2s cuts on the beat; process = ~10s shots', implication: 'Match the cut rhythm to the format. Live energy montages cut fast; build/teardown clips breathe.' },
      { pattern: 'Lyric / keyword overlays at emotional peaks', prevalence: 'Fred, Barry, Joy', implication: 'Layer a short caption on the climax (“wait for it”, the track name) to amplify the moment without production cost.' },
    ],
    videos: [
      { title: 'Yakitori-shop DJ set', artist: 'Barry Cant Swim', plays: '519K plays · 5,073 saves', insight: 'Unconventional intimate venue + text-set scene + handheld warmth. Most replicable element: an unexpected, personal performance space.' },
      { title: '“Return to Bhibo” unreleased teaser', artist: 'Barry Cant Swim', plays: '17.9K plays · 251 saves', insight: 'Direct-to-camera intro + on-screen “what should I call this?” + snippet + body-nod on the drop. Low-effort community builder.' },
      { title: 'Underworld rework', artist: 'Fred Again', plays: '5.8M plays · 72.6K saves', insight: 'Lyric overlays synced to peaks; drop at 0:55 timed to crowd + lights. On-screen text is the cheapest retention lever.' },
      { title: 'JOY (Chella) crowd clip', artist: 'Joy Anonymous', plays: '133K plays', insight: 'Wide phone shot, persistent event/name text, vocal snippet hitting in the first 3s. Context text = discovery.' },
      { title: 'Public Records party', artist: 'bad tuner (his own best)', plays: '8.7K plays · 132 saves', insight: 'Text-in-3s, drop at 0:08 on a movement shift. Proof his content works the moment it stops being an ad.' },
      { title: 'Tokyo b2b w/ salute', artist: 'Barry Cant Swim', plays: '43.7K plays', insight: 'Shaky, immersive, sub-2s cuts on the beat, drop near the end. Presence over polish.' },
    ],
  },

  // ── 05 Thesis + Phases ──
  thesis:
    'Kill the gig-flyer feed. Replace it with a phone-shot "show the making" engine — five rinse-and-repeat formats batched in NYC, tied together by one recurring forever love motif that runs across all four singles into the EP. Each monthly single is a content sprint that compounds the last, turning 412K passive streamers into followers and pre-savers, then converting them on Oct 2 with clipping, Marquee/Showcase and a Countdown page.',
  phases: [
    { name: 'Reset & Build Engine', weeks: 'Now – Jun 11', objectives: ['Kill the flyer feed', 'Stand up the 5 formats + motif', 'Warm the 412K base before Single 1'] },
    { name: 'Single 1 · Young Soul', weeks: 'Jun 12 – Jul 9', objectives: ['Prove the engine on the first drop', 'Convert streamers to followers', 'Tease toward Single 2'] },
    { name: 'Single 2', weeks: 'Jul 10 – Aug 6', objectives: ['Second sprint; scale the winning format', 'Grow pre-save intent', 'Set up the announce'] },
    { name: 'Single 3 · EP Announce', weeks: 'Aug 7 – Sep 3', objectives: ['Announce forever love', 'Open the EP Countdown page', 'Pay off the recurring motif'] },
    { name: 'Single 4', weeks: 'Sep 4 – Oct 1', objectives: ['Final pre-EP push', 'Peak pre-saves', 'Load the clipping campaign'] },
    { name: 'EP Launch · forever love', weeks: 'Oct 2+', objectives: ['Fire clipping off the long set', 'Marquee + Showcase + Countdown convert', 'Hold the curve into sustain'] },
  ],

  // ── 06 The Content System ──
  formats: [
    { name: 'One sound, one flip', what: 'Grab a NYC sound (subway, bodega beep, street) and flip it into a loop on camera in 15-20s.', platform: 'TikTok · Reels', why: 'Owns his Brooklyn identity; text-in-3s hook (“made a beat from the L train”) maps exactly to the text-first pattern that hit in 6/6 analyzed videos.', batch: 'Shoot 4-5 in one walk around the neighborhood.' },
    { name: 'Constraint beats', what: '“Made a beat with only ___” — one sample, one synth, a single piece of gear.', platform: 'TikTok · Reels', why: 'Producer TikTok and Reddit reward constraint challenges; high save + share intent, the metric that signals the algorithm.', batch: 'Batch 3-4 from one studio session.' },
    { name: 'Started vs. going', what: 'How the forever love track started vs. how it sounds now — same loop, two states.', platform: 'TikTok · Reels', why: 'Built-in payoff structure; reuses ONE EP track so the algorithm learns his sound (Geoff’s “same track 3-5 ways”, done as a format).', batch: '1/week per single across the EP.' },
    { name: 'Fan flips', what: 'React to / build with sounds fans send; make a beat out of them on camera.', platform: 'TikTok · IG', why: 'Barry’s “what should I call this?” teaser format turned comments into a community engine. Converts viewers into co-authors.', batch: 'Weekly, from comment submissions.' },
    { name: 'Live clip of the week', what: 'One clip from sessions or shows — Lot Radio, Public Records — drop timed to a crowd reaction.', platform: 'TikTok · Reels · YT', why: 'Live moments were the #1 driver across every comp (Barry 519K, Fred millions, Joy 133K). He already has Lot Radio footage.', batch: 'Pull from one long set; feeds the clipping campaign too.' },
  ],
  algorithmNote:
    'Recurring hook: pick ONE forever love motif (a vocal chop, a name) and run it across all four singles like Barry runs "Bhibo". Each single is also posted 3-5 different ways so the algorithm learns the sound — and by the Aug 7 announce, fans already recognize the EP. Same motif, four drops, one payoff.',
  cadence:
    'Target 5 posts/week of REAL content — not 5 flyers. The 80/20 rule: at most 1 in 5 posts can mention a show, and show promo lives in Stories / close-friends, not the main feed.',

  // ── 07 Weekly Playbook (10 weeks, relative to release) ──
  playbook: [
    { week: 'Now – Jun 11', phase: 'Reset & Build Engine', objective: 'Get the engine running BEFORE Single 1 — do not launch Young Soul into the old flyer feed.', actions: ['Audit + archive the worst gig flyers; route all show promo to Stories', 'Batch the first 8-10 clips across the 5 formats in 1-2 NYC shoots', 'Plant the forever love motif; post the Young Soul hook 3 ways', 'Get the Young Soul pre-save + Countdown live immediately — only ~3 weeks to Jun 12', 'Capture / select the long-form set (Lot Radio) for later clipping'], signals: ['Per-post engagement up vs. the flyer baseline', '"when is this out" comments on the motif'] },
    { week: 'Jun 12 · Single 1 — Young Soul', phase: 'Single 1', objective: 'First drop. Prove the engine converts streamers into followers.', actions: ['Pre-save live NOW (~3 wks out is the max window left for Jun 12) + in every bio', 'Drop day: live clip timed to the hook + Marquee on', 'Post Young Soul 3-5 ways across the week (flip, started-vs-going, fan flip)', 'Spotify Canvas carries the @handle "follow for the making" hook'], signals: ['First-week streams vs. the "lately in the void" baseline', 'Net new followers pulled from the 412K base'] },
    { week: 'Jul 10 · Single 2', phase: 'Single 2', objective: 'Second monthly sprint — scale whatever format won on Single 1.', actions: ['Pre-save up ~3 wks out (by ~Jun 19); Marquee at drop', 'Lead with the 2 best-performing formats from Single 1', 'One b2b / collab clip with an NYC-garage peer for borrowed reach', 'Keep the motif visible — it now spans two singles'], signals: ['A format or clip breaks out (>50K)', 'Pre-save list growing drop over drop'] },
    { week: 'Aug 7 · Single 3 + EP Announce', phase: 'Single 3 · EP Announce', objective: 'The mid-rollout tentpole. Announce forever love and open the Countdown page.', actions: ['Open the EP Countdown page with Clips (~2x pre-saves) — bios + every clip CTA', 'Announce the EP: "every loop you have seen = this record" (motif payoff)', 'Single 3 drop + Marquee; tracklist / teaser reveal', 'Start seeding micro-creators on house/dance pages with EP sounds'], signals: ['Countdown pre-saves ramping', 'The announce is the highest-engagement post yet'] },
    { week: 'Sep 4 · Single 4', phase: 'Single 4', objective: 'Final single — peak the pre-EP push and load the clipping campaign.', actions: ['Pre-save up ~3-4 wks out (by ~Aug 7-14); Marquee at drop', 'Brief + ready the paid clipping campaign off the long set (tight brief → forever love + pre-save)', 'Fan-flip cycle peaks — give fans EP stems as a pre-save unlock', 'Confirm tour routing → line up The Orchard college/campus push'], signals: ['Pre-saves on track for EP day', 'Clipper brief approved; creators live'] },
    { week: 'Oct 2 · forever love EP', phase: 'EP Launch', objective: 'EP day. Convert the audience the whole cascade built.', actions: ['EP drops; Marquee + Showcase on', 'Fire the paid clipping campaign ($2-5K test, $1-5 CPM cap)', 'Daily live clips timed to the standout EP cuts', 'Double budget on the 2 best clip angles; push Your Culture + Strive FM'], signals: ['EP first-week vs. the single baselines', 'Sound creates climbing; clip CPM in range'] },
    { week: 'Oct 3+ · Sustain', phase: 'Sustain', objective: 'Hold the curve and bank the audience.', actions: ['Resume the 5-format weekly rotation', 'College / Orchard + tour amplification on confirmed dates', 'Move new followers into a Laylo email/SMS list', 'Plan the next motif from EP cuts'], signals: ['Streaming holds 70%+ of week 1', 'Owned audience (email/SMS) established'] },
  ],

  // ── 08 Channel Allocation ──
  allocation: [
    { channel: 'Organic content engine', pct: 45, color: '#FD3737', rationale: 'The 5 phone-shot formats are the core. Highest-leverage, lowest-cost, and the only thing that fixes the underlying problem.' },
    { channel: 'Paid clipping + social', pct: 25, color: '#D42D2D', rationale: 'One long set, clipped and amplified at launch ($2-5K test), plus paid behind the best organic angles.' },
    { channel: 'Creator / UGC seeding', pct: 20, color: '#A1A1AA', rationale: 'Micro-creators on house/dance pages + fan-flip co-authoring to manufacture sound adoption.' },
    { channel: 'DSP + experiential', pct: 10, color: '#71717A', rationale: 'Marquee, Showcase, Countdown page, and tour/college tie-ins via Orchard.' },
  ],
  allocationPhases: [
    { phase: 'Reset & Build', split: 'Organic 80 · Seeding 15 · Paid 0 · DSP 5' },
    { phase: 'Singles 1-2', split: 'Organic 60 · Seeding 20 · Paid 5 · DSP 15' },
    { phase: 'Announce → Single 4', split: 'Organic 50 · Seeding 25 · Paid 10 · DSP 15' },
    { phase: 'EP Launch (Oct 2)', split: 'Organic 30 · Paid 45 · Seeding 15 · DSP 10' },
  ],

  // ── 09 Clipping + Amplification ──
  clipping: {
    intro: 'Barry built reach by clipping his live sets. bad tuner has the same asset and is not using it.',
    steps: [
      { step: 'Source one long-form set', detail: 'Use existing footage (Lot Radio) or capture one new set. One asset feeds dozens of clips.' },
      { step: 'Tight clipper brief', detail: 'Brief clippers to tie every clip back to forever love + a pre-save link, with the EP motif as the hook.' },
      { step: 'Paid clipping test', detail: 'Test small on a strong single first, then scale the main $2-5K push at the EP (Oct 2). $1-5 CPM cap; measure cost-per-save and pre-save, not just views.' },
      { step: 'Third-party amplification', detail: 'Your Culture engagement, Strive FM, and micro-creator UGC seeding across house/dance pages.' },
      { step: 'College via The Orchard', detail: 'Distribution runs through The Orchard via Independent Co — activate The Orchard college/campus radio program, tied to tour routing once dates lock.' },
    ],
  },

  // ── 10 DSP Conversion ──
  dsp: {
    intro: 'The cascade builds the audience; the DSP stack converts it — per single, then at the EP.',
    items: [
      { name: 'Per-single pre-save + Marquee', detail: 'Pre-save live ~3-4 weeks out per single (industry norm ~30 days; Barry Cant Swim ran ~6 weeks on his label single). His own past pushes were only ~2-4 days — too short. Marquee at drop, aimed at lapsed + recent listeners from the 412K base.' },
      { name: 'EP Countdown Page', detail: 'Opens at the Aug 7 announce. Add Clips — artists who do see ~2x more pre-saves. Pre-save link in every bio and clip through Oct 2.' },
      { name: 'Showcase', detail: 'Home-feed banner to keep the EP in view across launch week.' },
      { name: 'Spotify Canvas as a social funnel', detail: 'Carry the @handle + "follow for the making" hook in Canvas loops on every single, converting passive streamers into followers.' },
    ],
  },

  // ── 11 KPIs ──
  kpis: {
    preRelease: [
      { metric: 'TikTok per-post engagement', target: '5-10x current (↑ from ~200 likes)', benchmark: 'Comps run 6K+ likes/post; even 2K would be transformational' },
      { metric: 'Follower growth', target: 'TikTok 16.8K → 30K+, IG 12K → 20K+', benchmark: 'A streaming base of 412K should support 50K+ social' },
      { metric: 'Pre-saves', target: '3,000-6,000', benchmark: 'Countdown + Clips drive ~2x baseline' },
    ],
    launch: [
      { metric: 'First-week streams', target: 'Beat “lately in the void” by 30%+', benchmark: 'Use his own prior EP as the control' },
      { metric: 'TikTok sound creates', target: '500+ on the EP sound', benchmark: 'Micro-seeding + fan flips should compound' },
      { metric: 'Clip campaign efficiency', target: 'CPM $1-5; cost-per-save tracked', benchmark: 'Industry clipping norm' },
    ],
    sustain: [
      { metric: 'Streaming retention', target: 'Hold 70%+ of week-1 by week 4', benchmark: 'Healthy dance-EP curve' },
      { metric: 'Organic creates (no paid)', target: 'Continued sound use post-campaign', benchmark: 'Signals real adoption vs. bought reach' },
      { metric: 'Owned audience', target: 'Email/SMS list stood up via Laylo', benchmark: 'Converts rented reach into owned' },
    ],
  },

  // ── 12 Risks ──
  risks: [
    { title: 'He reverts to posting gig flyers', likelihood: 'High', impact: 'High', trigger: 'More than 1 in 5 main-feed posts is a show announcement', contingency: 'Enforce the 80/20 rule; route ALL show promo to Stories and close-friends; agency owns the main-feed calendar.' },
    { title: 'Organic does not catch despite the reset', likelihood: 'Medium', impact: 'High', trigger: 'No format clears 10K plays by Week 5', contingency: 'Pivot paid earlier: clip the 2-3 best organic angles and amplify, rather than waiting for release week.' },
    { title: 'Pre-saves track below target', likelihood: 'Medium', impact: 'Medium', trigger: 'Under 1,500 pre-saves entering Week 6', contingency: 'Push the recurring motif teaser harder; front-load Marquee budget; add a fan-flip incentive tied to pre-save.' },
    { title: 'Release date stays unset', likelihood: 'Medium', impact: 'Medium', trigger: 'No locked date by end of Week 4', contingency: 'Calendar is relative and holds; but DSP tools (Countdown, Marquee) need ~3-4 weeks lead, so lock before Week 5.' },
  ],

  sources: [
    'Tokscript — profile + video metadata, all four artists',
    'TwelveLabs Pegasus — frame-level analysis of 6 top comp videos',
    'Spotify / web — monthly listeners, catalog, label, tour history',
    'Web research — 2026 clipping norms, Spotify Campaign Kit (Marquee/Showcase/Countdown)',
  ],
};

export type BadTunerData = typeof badTuner;
export default badTuner;
