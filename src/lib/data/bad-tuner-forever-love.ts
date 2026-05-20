// Bad Tuner — "forever love" EP campaign + content strategy
// Research: Tokscript (cadence/hooks), TwelveLabs Pegasus (visual teardown), web + Spotify.

export const badTuner = {
  slug: 'bad-tuner-forever-love',
  artist: 'bad tuner',
  song: 'forever love',
  releaseType: 'EP',
  genre: 'House / UK Garage',
  releaseDate: 'Date TBD',
  tier: 'Mid-Level · Streaming-Strong',
  label: 'Independent Co. / The Orchard',
  homeBase: 'Brooklyn, NY',
  campaignWindow: '10-week flexible window · anchors on confirmed release date',
  generatedDate: 'May 20, 2026',

  // ── 02 The Diagnosis / Artist Position ──
  diagnosis: {
    headline: 'A streaming star who is invisible on social.',
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
    'Kill the gig-flyer feed. Replace it with a phone-shot “show the making” engine — five rinse-and-repeat formats batched in NYC, built around one recurring unreleased forever love hook — that turns 412K passive streamers into followers and pre-savers, then converts that owned audience on release week with clipping, DSP tools and a Countdown page.',
  phases: [
    { name: 'Reset & Seed', weeks: 'Weeks 1-3', objectives: ['Stop posting ads', 'Stand up the 5 content formats', 'Plant the recurring forever love hook'] },
    { name: 'Build', weeks: 'Weeks 4-6', objectives: ['Post the same EP track 3-5 ways', 'Open Countdown page + pre-save', 'Seed micro-creators on house/dance pages'] },
    { name: 'Launch', weeks: 'Weeks 7-8', objectives: ['EP drops', 'Fire clipping campaign off the long set', 'Marquee + Showcase + Countdown convert'] },
    { name: 'Sustain', weeks: 'Weeks 9-10', objectives: ['Keep the engine running', 'Fan-flip + live-clip cycle', 'Tie college + tour amplification to dates'] },
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
    'Recurring hook: pick ONE forever love motif (a vocal chop, a name) and run it across teasers like Barry runs “Bhibo” — same unreleased track, posted 3-5 different ways, until fans are commenting “track id?”. That is how the algorithm learns his sound and how demand is manufactured before release.',
  cadence:
    'Target 5 posts/week of REAL content — not 5 flyers. The 80/20 rule: at most 1 in 5 posts can mention a show, and show promo lives in Stories / close-friends, not the main feed.',

  // ── 07 Weekly Playbook (10 weeks, relative to release) ──
  playbook: [
    { week: 'Week 1', phase: 'Reset & Seed', objective: 'Stop the bleeding. No more flyers in the main feed.', actions: ['Audit + archive the worst gig-flyer posts; move all show promo to Stories', 'Film 5 “one sound, one flip” clips in one NYC walk', 'Post 3 of them, each opening with a text-in-3s hook'], signals: ['Per-post avg engagement up vs. flyer baseline', 'Saves appear (the algorithm signal)'] },
    { week: 'Week 2', phase: 'Reset & Seed', objective: 'Establish the constraint-beat format.', actions: ['Batch 4 “made a beat with only ___” clips in one session', 'Post 5x this week (mix flip + constraint)', 'Reply to every comment within the first hour'], signals: ['First clip over 5K plays', 'Comment-to-view ratio climbing'] },
    { week: 'Week 3', phase: 'Reset & Seed', objective: 'Plant the recurring forever love hook.', actions: ['Tease ONE EP loop as a named motif (the “Bhibo” move)', 'Post the same loop 2 ways (flip + started-vs-going)', 'Pin the best-performing format to profile'], signals: ['“track id?” / “when is this out” comments begin', 'Follower growth turns positive week-over-week'] },
    { week: 'Week 4', phase: 'Build', objective: 'Turn on demand-capture infrastructure.', actions: ['Open Spotify Countdown Page + pre-save link in every bio', 'Launch “fan flips” — ask fans to send sounds', 'Post the EP motif a 3rd way'], signals: ['First 250-500 pre-saves', 'Fan submissions in the inbox'] },
    { week: 'Week 5', phase: 'Build', objective: 'Lock the date and the long set.', actions: ['Confirm EP release date; back-time DSP tools', 'Capture / select one long-form set (Lot Radio or new) for clipping', 'Brief the clipping vendor — tight brief tying to forever love + pre-save'], signals: ['Release date locked', 'Long set + clip brief approved'] },
    { week: 'Week 6', phase: 'Build', objective: 'Seed the creator + page network.', actions: ['Seed 8-12 micro-creators on house/dance pages with the EP sound', 'Post a fan-flip you actually built (co-author moment)', 'Add Clips to the Countdown page (2x pre-save lift)'], signals: ['First creator posts live', 'Pre-saves pacing toward target'] },
    { week: 'Week 7', phase: 'Launch', objective: 'Release week — convert the owned audience.', actions: ['EP drops; turn on Marquee + Showcase', 'Launch the paid clipping campaign off the long set ($2-5K test)', 'Post a live clip timed to the drop, every day this week'], signals: ['First-week streams vs. “lately in the void” baseline', 'Clip campaign CPM in the $1-5 range'] },
    { week: 'Week 8', phase: 'Launch', objective: 'Amplify what is already moving.', actions: ['Double down budget on the 2 best-performing clip angles', 'Push Your Culture + Strive FM placements', 'Repost the best fan + creator UGC to main'], signals: ['One clip / sound breaks out (>50K)', 'Sound creates climbing on TikTok'] },
    { week: 'Week 9', phase: 'Sustain', objective: 'Hold the curve, keep the engine on.', actions: ['Resume the 5-format weekly rotation', 'Run “started vs going” on the strongest EP track', 'Tie college / Orchard push to confirmed tour dates'], signals: ['Streaming holds 70%+ of week 1', 'Organic creates continue without paid'] },
    { week: 'Week 10', phase: 'Sustain', objective: 'Bank the audience and set up the next cycle.', actions: ['Move new followers to a Laylo / email + SMS list', 'Plan the next recurring motif from EP cuts', 'Recap reel of the best moments of the rollout'], signals: ['Follower retention holding', 'Owned audience (email/SMS) established'] },
  ],

  // ── 08 Channel Allocation ──
  allocation: [
    { channel: 'Organic content engine', pct: 45, color: '#FD3737', rationale: 'The 5 phone-shot formats are the core. Highest-leverage, lowest-cost, and the only thing that fixes the underlying problem.' },
    { channel: 'Paid clipping + social', pct: 25, color: '#D42D2D', rationale: 'One long set, clipped and amplified at launch ($2-5K test), plus paid behind the best organic angles.' },
    { channel: 'Creator / UGC seeding', pct: 20, color: '#A1A1AA', rationale: 'Micro-creators on house/dance pages + fan-flip co-authoring to manufacture sound adoption.' },
    { channel: 'DSP + experiential', pct: 10, color: '#71717A', rationale: 'Marquee, Showcase, Countdown page, and tour/college tie-ins via Orchard.' },
  ],
  allocationPhases: [
    { phase: 'Reset & Seed', split: 'Organic 80 · Seeding 15 · Paid 0 · DSP 5' },
    { phase: 'Build', split: 'Organic 55 · Seeding 25 · Paid 5 · DSP 15' },
    { phase: 'Launch', split: 'Organic 30 · Paid 45 · Seeding 15 · DSP 10' },
    { phase: 'Sustain', split: 'Organic 60 · Seeding 20 · Paid 10 · DSP 10' },
  ],

  // ── 09 Clipping + Amplification ──
  clipping: {
    intro: 'Barry built reach by clipping his live sets. bad tuner has the same asset and is not using it.',
    steps: [
      { step: 'Source one long-form set', detail: 'Use existing footage (Lot Radio) or capture one new set. One asset feeds dozens of clips.' },
      { step: 'Tight clipper brief', detail: 'Brief clippers to tie every clip back to forever love + a pre-save link, with the EP motif as the hook.' },
      { step: 'Paid clipping test', detail: '$2-5K test at a $1-5 CPM cap. Measure cost-per-save and pre-save, not just views.' },
      { step: 'Third-party amplification', detail: 'Your Culture engagement, Strive FM, and micro-creator UGC seeding across house/dance pages.' },
      { step: 'College via The Orchard', detail: 'Distribution runs through The Orchard via Independent Co — activate The Orchard college/campus radio program, tied to tour routing once dates lock.' },
    ],
  },

  // ── 10 DSP Conversion ──
  dsp: {
    intro: 'The whole point of the content reset is to have an audience to convert on release week. The DSP stack does the converting.',
    items: [
      { name: 'Countdown Page', detail: 'Open in the Build phase. Add Clips — artists who do see ~2x more pre-saves. Pre-save link in every bio and clip.' },
      { name: 'Marquee', detail: 'Full-screen new-release recommendation at launch. Target lapsed + recent listeners from his 412K base.' },
      { name: 'Showcase', detail: 'Home-feed banner to keep the EP in view through launch week.' },
      { name: 'Pre-save funnel', detail: 'Every organic clip ends on the same CTA. The recurring motif teases manufacture the intent the Countdown page captures.' },
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
