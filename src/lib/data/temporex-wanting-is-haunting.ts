// Temporex — "Wanting is Haunting" album rollout
// Research: TikTok metadata (Tokscript), web research, prior CCD analysis (Bad Tuner)
// Note: IG comp deep-dive pending (Tokscript IG service outage at build time).

export const temporex = {
  slug: 'temporex-wanting-is-haunting',
  artist: 'temporex',
  song: 'wanting is haunting',
  releaseType: 'album',
  genre: 'Bedroom Pop / Dream Pop',
  releaseDate: 'November 2026 (TBD)',
  tier: 'Established · Streaming-Strong',
  label: 'Independent',
  homeBase: 'San Diego, CA',
  campaignWindow: 'May 22 – November 2026 · four-single cascade into the album',
  generatedDate: 'May 22, 2026',

  // ── Release calendar ──
  calendar: [
    { date: 'Jul 10', label: 'Single 1 — Waterhole', kind: 'single' },
    { date: 'Aug 14', label: 'Single 2 — Real Time (w/ video)', kind: 'single' },
    { date: 'Sep 18', label: 'Single 3 — Somewhere I’m Better Now', kind: 'single' },
    { date: 'Oct 23', label: 'Single 4 — Fantastic Machine (w/ big video)', kind: 'announce' },
    { date: 'Nov TBD', label: 'Album — focus track Wanting is Haunting', kind: 'ep' },
  ],

  // ── 02 The Diagnosis / Artist Position ──
  diagnosis: {
    headline: 'The 1.4M-streaming dream-pop artist who has been radio silent on socials.',
    body:
      'temporex has 1.4 million Spotify monthly listeners — and just 32K TikTok followers across only 3 lifetime TikTok posts (most recent: October 2024). The previous album "Bowling" dropped in 2021. The streaming engine is huge; the social engine is essentially off. This is the inverse of the Bad Tuner pattern: there, the problem was posting too much of the wrong thing (gig flyers). Here, the problem is not posting at all. The fix is not volume for volume’s sake — the comps in this lane prove that bedroom-pop wins with curation, not cadence. The fix is turning the engine on, in temporex’s own voice (music + visual art), with one connected world that runs across all four singles into the album.',
    stats: [
      { value: '1.4M', label: 'Spotify monthly listeners', tone: 'good' },
      { value: '32K', label: 'TikTok followers (3 lifetime posts)', tone: 'bad' },
      { value: '~5y', label: 'Since last album (Bowling, 2021)', tone: 'bad' },
      { value: 'Nov 26', label: 'Album drop — focus track Wanting is Haunting', tone: 'good' },
    ],
    social: [
      { platform: 'Spotify', value: '1.4M', sub: 'monthly listeners', pct: 100 },
      { platform: 'TikTok', value: '32K', sub: '@.temporex · 3 lifetime posts', pct: 23 },
      { platform: 'Instagram', value: '@temporex', sub: 'IG-first lane; deep audit pending IG service restore', pct: 0 },
    ],
    context: [
      'San Diego–based multi-instrumentalist, producer, and visual artist. The "music + visual art" framing is the central identity lever — use it.',
      'Career credibility: appeared on Spotify Fresh Finds; Tyler, The Creator endorsement. Two prior albums (Care 2016, Bowling 2021). The TBD November release is album three.',
      'No confirmed tour on Songkick at build time. Distribution: Independent.',
      'Reference points the artist follows on IG (per the artist himself): The Garden (365K), Chanel Beads (Jagjaguwar), Nourished by Time, Homeshake / PS Goner. All IG-first; all lo-fi; all build a world, not a feed.',
      'Track context (Waterhole) confirms the lane: a Linn Drum loop + alternate guitar tuning + muttering vocals + a friend (Adrian) on mandolin and bass + a tragic gnome story. The lore is built in — it just needs to be turned outward.',
    ],
    liveMarkets: ['Los Angeles', 'San Diego', 'San Francisco', 'New York', 'Mexico City', 'London'],
  },

  // ── 03 Comp Content Teardown ──
  comps: [
    {
      name: 'The Garden',
      handle: '@__thegarden__ (+ @__vadavada__, @wyattshears, @fletchershears)',
      followers: '365K IG (band) · 308K combined twins · 43K Vada Vada',
      volume: 'High output across multiple linked accounts',
      engagement: 'Large active community around the Vada Vada universe',
      formats: [
        'A self-coined recurring universe ("Vada Vada" = "total freedom of expression") that wraps every post, every video, every merch drop into one connected art project',
        'High-energy DIY punk performance clips',
        'Twin-brother / character dynamic — built-in narrative',
        'Costumes, recurring visual motifs, in-jokes that fans collect',
      ],
      signature: 'The Vada Vada world; matching outfits and characters; in-house visual language',
      topPost: 'The Vada Vada universe IS the topPost — the franchise is the content',
      takeaway: 'The single most useful comp for temporex. They did NOT pick a genre and start posting — they built a self-coined universe ("Vada Vada") and everything they post lives inside it. temporex has the raw material (the gnome, the farm, the visual art) to do the same thing.',
    },
    {
      name: 'Chanel Beads',
      handle: '@chanel_beads · Jagjaguwar',
      followers: 'Jagjaguwar amplification (89K label account)',
      volume: 'Sparse, curated',
      engagement: 'Critically-loved (Pitchfork, The FADER, Line of Best Fit)',
      formats: [
        'Lo-fi visual fragments — slow, grainy, dreamy',
        'Glitchy textures, ghostly violin, atmospheric snippets — the AESTHETIC is the content',
        'Label-amplified posts via Jagjaguwar',
        'Live-set excerpts and collaborator features',
      ],
      signature: '"Suspended between dream and memory" — texture-over-narrative posting; less is more',
      topPost: 'Lo-fi aesthetic is the recurring hook; individual posts read as a single mood',
      takeaway: 'Proof that curation beats cadence in this lane. Temporex does NOT need to post 5x/week — he needs every post to read like the same album. Build the visual identity once and let it carry every clip.',
    },
    {
      name: 'Nourished by Time',
      handle: '@nourishedbytime (Marcus, Baltimore)',
      followers: 'TikTok 969 / 20 lifetime videos · IG larger',
      volume: '~Monthly TikTok posts (lo-fi, casual)',
      engagement: '~1-7K plays/post on TikTok; critically loved (debut "Erotic Probiotic 2" via XL)',
      formats: [
        'Playful one-liner captions ("Joey Buttons", "merch droppppp", "music idea") — lowercase deadpan',
        '"Morning vibes" walking-with-synth ambient mood clips',
        'Quick demos and "wild sequence" snippets',
        'Self-aware "songwright" framing',
      ],
      signature: 'Lowercase warmth, deadpan humor, lo-fi captures, Baltimore identity',
      topPost: '"Work(sssssss)" — 7.5K plays — lo-fi mood + spelled-out vibe',
      takeaway: 'The closest peer at temporex’s social scale (small follower count, big critical voice). The lesson: at this scale, personality and lo-fi humor travel. Every post should feel hand-made.',
    },
    {
      name: 'Homeshake / PS Goner',
      handle: '@pitersugar (Peter Sagar)',
      followers: '~85K IG',
      volume: 'Sparse, mysterious',
      engagement: 'Devoted niche following',
      formats: [
        'Project transition / rebrand storytelling (Homeshake → PS Goner, Feb 2026)',
        'Analog aesthetic — debut PS Goner album "there’s an atm inside" recorded entirely on cassette',
        'Mysterious sparse posting; quiet authority',
        'Slowcore sprawl, intimate vocals',
      ],
      signature: 'Quiet, low-cadence, analog-tape aesthetic; an artist evolving rather than chasing',
      topPost: 'The transition itself is the content — a new project name lands as a tentpole',
      takeaway: 'Demonstrates that "evolving the identity" is its own content engine in this lane. For temporex, the album rollout IS the evolution from Bowling (2021) — frame it that way.',
    },
  ],
  compNote:
    'IG comp deep-dive (top reels, cadence, hooks) is pending — Tokscript IG service was in a sustained outage at build time. It will be appended to this page in place when the service restores; the strategic spine above does not change.',

  // ── 04 Video Intelligence ──
  videoIntel: {
    analyzed: 0,
    summary:
      'Frame-level deep-dive on indie/bedroom-pop reference posts is pending the Tokscript IG service restoring (all four comps are IG-first). In the meantime, the pattern library below carries forward from the prior CCD reference analysis (26 posts, frame-by-frame via TwelveLabs Pegasus) and is layered with bedroom-pop / lo-fi lane data — these patterns hold even more strongly here than in dance.',
    patterns: [
      { pattern: 'Phone-shot beats polished — even more in this lane', prevalence: 'Web data: lo-fi Reels +20% vs polished; TikTok lo-fi +32% watch-through', implication: 'Shoot on a phone. Resist the urge to make every visual "art-directed." The lo-fi instinct is the lever; the visual art piece can sit in static covers, not every Reel.' },
      { pattern: 'Text-on-screen in the first 3 seconds', prevalence: '24 of 26 posts in the prior CCD reference set', implication: 'Open every clip with a context line (most watch with sound off). For temporex this is a free win on lore: "the man who was poisoned by a gnome" reads as a hook.' },
      { pattern: 'Varied pacing, never one constant speed', prevalence: 'The dominant cut pattern across the reference set', implication: 'Mix slow lo-fi shots with fast cuts on a hook. Dream-pop does not mean uniformly slow.' },
      { pattern: 'The single moment is engineered onto a visual peak', prevalence: 'Across the top performers', implication: 'For temporex this is the lyric or the loop drop. Cut so the line "wanting is haunting" lands on a face, an object, or the gnome.' },
      { pattern: 'Caption-driven storytelling outperforms promo lines', prevalence: 'Universal across the prior analysis', implication: 'A specific story (the Waterhole gnome backstory the artist already wrote) beats "out now" or "pre-save link in bio" every time.' },
      { pattern: 'A recurring named world makes every post feel like one project', prevalence: 'The Garden ("Vada Vada"), Barry Cant Swim ("Bhibo"), Fred Again (lowercase diary voice)', implication: 'temporex should give the album a named visual world (the farm + the gnome + the gradient sunset palette) and stamp every clip with it.' },
    ],
    videos: [] as { title: string; artist: string; plays: string; insight: string }[],
  },

  // ── 05 Thesis + Phases ──
  thesis:
    'Turn the lore on. The artist behind 1.4 million monthly streams has been radio silent on socials for years — and unlike Bad Tuner, the fix is not "post less promo," it is "show up at all." But show up in his own voice: visual artist, dream-pop, gnomes-on-a-farm. Build ONE connected world — the album, the gnome, the farm, the desert palette — that runs across all four singles into the album, the way The Garden runs "Vada Vada." Each monthly single is a chapter in that world. The 1.4M people streaming temporex should arrive in November to a Spotify Countdown page already filled with people they recognize from a year of lore.',
  phases: [
    { name: 'Lore Drop / Reset', weeks: 'May 22 – Jul 9', objectives: ['Turn the engine on (he is silent today)', 'Open the visual world: farm + gnome + palette', 'Stand up the 5 content formats; book IG and TikTok cadence'] },
    { name: 'Single 1 · Waterhole', weeks: 'Jul 10 – Aug 13', objectives: ['Drop the gnome story publicly', 'Country-western imagery + Linn Drum demo', 'Friend cameo (Adrian) becomes a recurring beat'] },
    { name: 'Single 2 · Real Time (music video)', weeks: 'Aug 14 – Sep 17', objectives: ['Music video as the centerpiece — clip it 12 ways', 'Open the world wider (new location, new character)', 'Small clipping test off the MV'] },
    { name: 'Single 3 · Somewhere I’m Better Now', weeks: 'Sep 18 – Oct 22', objectives: ['Open the album Countdown page', 'Bridge: tie back to the gnome / the farm', 'Begin album sequencing teases'] },
    { name: 'Single 4 · Fantastic Machine (big video)', weeks: 'Oct 23 – early Nov', objectives: ['The big-budget video is the tentpole and the clipping quarry', 'Main paid clipping push ($3-5K)', 'Pre-album press + creator seeding crescendos'] },
    { name: 'Album Launch · Wanting is Haunting', weeks: 'November (TBD) +', objectives: ['Album drops; Marquee + Showcase on; Countdown converts', 'Drop the focus track "wanting is haunting" as the centerpiece', 'Sustain the world for ≥4 weeks post-release'] },
  ],

  // ── 06 The Content System ──
  formats: [
    { name: 'The Lore', what: 'Episodic illustrated / phone-shot fragments of the album world: the farm, the gnome, the lonely man, the desert. Recurring characters and settings.', platform: 'Instagram Reels · IG carousels', why: 'temporex IS a visual artist — this is his unique advantage. The Garden built a 365K following on exactly this kind of self-coined universe ("Vada Vada"). Same play, different aesthetic.', batch: '1 lore piece per week; mix illustrated and phone-shot.' },
    { name: 'Bedroom Demos', what: 'Phone-shot studio process: Linn Drum loops, alternate guitar tunings, the actual "muttering vocals until words form" workflow he literally described.', platform: 'IG Reels · TikTok', why: 'The closest authentic match to what the artist already does. Bedroom-pop fans want to see the alchemy. Free content, low effort, high authenticity.', batch: '2-3 demos per week from one studio sit.' },
    { name: 'Tuning Diaries', what: 'Short clips revealing alt-tunings, drum machines, specific gear. "Made this beat from a 7th-fret detuned acoustic over a Linn Drum loop."', platform: 'IG Reels · TikTok', why: 'Producer / songwriter TikTok rewards this. High save + share intent — the algorithm signal that matters more than view count.', batch: 'Weekly; one per track on the album.' },
    { name: 'Friend Cameos', what: 'Walk into a track with a collaborator (like Adrian, who played mandolin / bass on Waterhole). Each week a different friend brings one instrument.', platform: 'IG Reels', why: 'Implicitly social; lo-fi by default; the network effect of borrowed audiences. Adrian is the precedent the artist already set.', batch: 'Weekly; 4-5 cameos across the rollout.' },
    { name: 'Album Lookbook', what: 'Visual stills + 10-second mood clips: cover art, character sketches, settings, palette, merch test prints. The visual art identity becomes a recurring channel.', platform: 'IG carousels · IG Stories · IG Reels', why: '"music and visual art" is in his bio. Lean into it. This is the world bible fans collect.', batch: '2 per week; one carousel, one Reel.' },
  ],
  algorithmNote:
    'Recurring world: pick ONE named lore element (the gnome, the farm name, the album’s visual palette) and stamp every clip with it for six months. The gnome should appear in tiny ways across all five formats. By the November album, fans should be commenting "this is the [name]verse" without prompting. Same hook, twenty drops, one payoff.',
  cadence:
    'Target 3-5 posts a week on IG (the lane platform); 1-2 on TikTok. Quality > volume in this lane (lo-fi Reels beat polished by 20%, TikTok by 32%). The 80/20 rule still applies: at most 1 in 5 posts can be a "presave / out Friday" line.',

  // ── 07 Content Ideas ──
  ideas: [
    { name: 'Meet the Gnome', bit: 'A recurring illustrated / claymation gnome character that appears in every clip, takes over Stories for a day, sends "voicemails" via Reels audio. The Bhibo move applied to lore.', hook: 'this is the gnome who poisoned the man', why: 'The artist literally wrote this character into the Waterhole song. Use him. He becomes the album’s mascot.', top3: true },
    { name: 'Waterhole Farm', bit: 'Recurring visual world — the lonely man’s farm — shot in Joshua Tree or SD desert. Photo carousels + 10-second mood clips. Cohesive palette throughout.', hook: 'this is where the man lived', why: 'Album-world cohesion. Gives every post a "home." Plays to the artist’s visual-art identity.', top3: true },
    { name: 'How I Made [track]', bit: 'Linn Drum + alt-tuning demo for each single. Show the actual gear and the actual workflow.', hook: 'made this from a Linn Drum and a detuned acoustic', why: 'Producer TikTok / songwriter Reddit eats this up. High save intent. Real to what he does.', top3: true },
    { name: 'Muttering Vocals', bit: 'Short clips of the artist muttering nonsense over a loop until real words form. The actual songwriting workflow he described in the Waterhole notes.', hook: 'this is how the song starts', why: 'Bedroom-pop process content. Authentic, lo-fi, fascinating.', top3: false },
    { name: 'Visual Art Diary', bit: 'Sketches, paintings, sculpture, ceramics — the work that becomes single covers, merch, lyric video frames. Treat the visual-art half of his bio as a real channel.', hook: 'this is the cover before the cover', why: 'Leans on his actual unique identity (the "music and visual art" framing). Nobody else in the lane has this.', top3: false },
    { name: 'Friend Cameos (one instrument, one room)', bit: 'A recurring slot: each week a different friend (or peer in the SD / LA indie scene) walks in, plays one instrument on one track. Adrian started it.', hook: 'today: Adrian on mandolin', why: 'Borrowed audience + the collab pattern that consistently overperforms in every CCD reference set.', top3: false },
    { name: 'Crate-Digging San Diego', bit: 'Go to local record shops (Folk Arts, M-Theory) and vintage instrument stores. Pull a record, tell its story, sample from it on camera.', hook: 'found this in a $2 bin', why: 'Barry Cant Swim’s Sneaky Pete move, localized to San Diego. Roots him in a place.', top3: false },
    { name: '3 Linn Drum Loops, 3 Rooms', bit: 'Same drum loop interpreted three different ways across three locations (bedroom, garage, desert porch). One constraint, three answers.', hook: 'same loop, three rooms', why: 'Constraint format. Producer-bait. Visually cohesive. Specific to his gear.', top3: false },
    { name: 'Fantastic Machine BTS', bit: 'Episodic build of the big-budget Oct 23 music video. 8-12 short posts capturing pre-production, set build, shoot day, on-monitor moments.', hook: 'day 1: building the machine', why: 'A music video shoot is a content quarry. Fred Again does this; The Garden does this. Free content for weeks.', top3: false },
    { name: 'Wanting is Haunting Lore Drops', bit: 'Cryptic Reels teasing the album’s focus track across the final two months. Slowed-down loops, a single lyric line over a still, the gnome saying the title in a Story.', hook: 'wanting is haunting', why: 'The Bhibo move on the focus track — same hook revealed in new contexts until fans demand the drop.', top3: false },
  ],

  // ── 08 Rollout Playbook ──
  playbook: [
    { week: 'Now – Jul 9', phase: 'Lore Drop / Reset', objective: 'Turn the engine on. He has been radio silent — that ends now, but quietly and curated.', actions: ['Audit and archive any stale posts; reset the grid to the new visual palette', 'Establish the world: drop the first 3 "lore" posts (the farm, the gnome, the desert)', 'Batch 8-10 phone-shot bedroom demos + tuning diaries in one studio sit', 'Open Waterhole pre-save by ~Jun 12 (4 weeks out)'], signals: ['First lore post outperforms his recent baseline', 'Returning followers see "something is happening" without being told'] },
    { week: 'Jul 10 · Single 1 — Waterhole', phase: 'Single 1', objective: 'Drop the gnome story publicly. Country-western imagery, Linn Drum, mandolin. The lore goes live.', actions: ['Pre-save live in every bio (was up by Jun 12)', 'Drop day: Reel of the Linn Drum loop + the line "poisoned by a gnome" as the text-in-3s hook', 'Adrian (mandolin) cameo Reel during week 1', 'Marquee at drop, aimed at lapsed + recent listeners from the 1.4M base'], signals: ['First-week streams vs. his 2021 single baselines', '"who is the gnome" / "what is this album" comments appear'] },
    { week: 'Aug 14 · Single 2 — Real Time (music video)', phase: 'Single 2 · Music video', objective: 'The music video IS the content asset. Clip it 12 ways.', actions: ['Pre-save up by ~Jul 17 (4 wks out); Marquee at drop', 'Music video drops alongside the single; immediately cut 8-12 vertical Reels off it', 'Small paid clipping test ($1-2K) — measure cost-per-save, not just views', 'Push the lore wider: new character or location enters the world'], signals: ['MV crosses 100K views in week 1', 'A clip / lyric line breaks out organically'] },
    { week: 'Sep 18 · Single 3 — Somewhere I’m Better Now', phase: 'Single 3 · Album Countdown opens', objective: 'Mid-rollout tentpole. Open the album Countdown page; bridge the world to the album.', actions: ['Open Spotify Countdown for the album with Clips (~2x pre-saves) — bio + every clip CTA', 'Announce the album: "this is the [name]verse" payoff', 'Pre-save up by ~Aug 21; Marquee at single drop', 'Begin seeding micro-creators on bedroom-pop / dream-pop / indie pages'], signals: ['Countdown pre-saves ramping', 'Announce is the highest-engagement post yet'] },
    { week: 'Oct 23 · Single 4 — Fantastic Machine (big budget video)', phase: 'Single 4 · Big video tentpole', objective: 'Tentpole. Big video is the clipping quarry AND the visual climax of the world.', actions: ['Pre-save up by ~Sep 25 (4 wks out)', 'Drop the music video alongside the single', 'Main paid clipping push: $3-5K, tight brief tying clips to album pre-save', 'Fan-flip cycle peaks — invite fans to recreate one shot from the video'], signals: ['MV crosses 500K views in 2 weeks', 'Clip campaign CPM in the $1-5 range'] },
    { week: 'Nov · Album — Wanting is Haunting', phase: 'Album Launch', objective: 'Album day. Convert the year-long lore audience.', actions: ['Album drops; Marquee + Showcase on; Countdown page converts', 'Drop the focus-track Reel ("wanting is haunting" text-in-3s)', 'Daily Reels of the album’s standout moments across launch week', 'Push press, Your Culture, Strive FM, micro-creator seeding'], signals: ['Album first-week streams beat "Bowling" (2021) baseline by 50%+', 'Sound creates on the focus track climbing on Reels and TikTok'] },
    { week: 'Nov + (sustain)', phase: 'Sustain', objective: 'Hold the world. Bank the audience.', actions: ['Resume the 5-format weekly rotation through year-end', 'Move new followers into Laylo email/SMS', 'Tour announce (if booked) tied to the world / characters', 'Plan visual-art exhibit or merch capsule extending the [name]verse'], signals: ['Streaming holds 70%+ of week 1 by week 4', 'Owned audience (email/SMS) standing up; tour-on-sale activity if relevant'] },
  ],

  // ── 09 Channel Allocation ──
  allocation: [
    { channel: 'Organic content engine (IG-Reels-led)', pct: 50, color: '#FD3737', rationale: 'IG is the lane platform — all four comps live here. Reels do 50% of IG time. The lo-fi format gets +20% on Reels, +32% on TikTok. Highest leverage and the only thing that fixes the underlying silence.' },
    { channel: 'Paid clipping + social', pct: 20, color: '#D42D2D', rationale: 'Small test off the Real Time MV in August; main $3-5K push off the Fantastic Machine big-budget video in October, plus paid behind the best organic angles.' },
    { channel: 'Creator + SWRM engagement', pct: 20, color: '#A1A1AA', rationale: 'Micro-creators on bedroom-pop / dream-pop / indie pages + CCD-owned SWRM real-user engagement to seed lore posts so they clear the algorithm threshold.' },
    { channel: 'DSP + experiential', pct: 10, color: '#71717A', rationale: 'Marquee, Showcase, Countdown page, Spotify Canvas (carry the @handle "follow for the lore" hook). Optional: tour / visual-art exhibit tie-ins.' },
  ],
  allocationPhases: [
    { phase: 'Lore Drop / Reset', split: 'Organic 80 · Seeding 15 · Paid 0 · DSP 5' },
    { phase: 'Singles 1-2', split: 'Organic 60 · Seeding 20 · Paid 5 · DSP 15' },
    { phase: 'Singles 3-4', split: 'Organic 45 · Seeding 25 · Paid 15 · DSP 15' },
    { phase: 'Album Launch', split: 'Organic 30 · Paid 45 · Seeding 15 · DSP 10' },
  ],

  // ── 10 Clipping + Amplification ──
  clipping: {
    intro: 'Different from a tour-artist clipping play: temporex has no Lot Radio long set. Instead, the two music videos are the clipping quarries — small test in August, big push in October.',
    steps: [
      { step: 'Music video #1 (Aug 14)', detail: 'Real Time MV is the first clipping asset. Cut 8-12 vertical Reels off it on launch day.' },
      { step: 'Small paid clipping test', detail: 'Test small (~$1-2K) on Real Time MV in August. Learn what hooks land. Measure cost-per-save and pre-save, not just views.' },
      { step: 'Music video #2 (Oct 23)', detail: 'Fantastic Machine big-budget video is the tentpole. Cut 15-20 verticals. This is the year’s biggest visual asset.' },
      { step: 'Main paid clipping push', detail: 'Scale to $3-5K at the Oct 23 release and through album launch (Nov). $1-5 CPM cap; tight brief tying every clip to the album pre-save and the lore.' },
      { step: 'Lo-fi creator seeding', detail: 'Micro-creators on bedroom-pop / dream-pop / indie pages; lyric / lore clips suit them better than dance set clips.' },
    ],
  },

  // ── SWRM (owned engagement layer) ──
  swrm: {
    intro: 'SWRM is our own two-sided engagement marketplace: verified real users get paid to complete genuine engagement tasks — comments, saves, shares, follows. It is the high-trust alternative to bots and engagement pods, and it is already live, with real users completing tasks and getting paid same-day.',
    why: 'The diagnosis is silence. SWRM puts real early engagement on the first lore posts and the first few clips of each new format so the algorithm starts to learn temporex’s sound and visual world — turning the engine on faster than waiting for organic alone.',
    plays: [
      { name: 'Algorithmic lift on the first posts', detail: 'Seed real saves / comments / shares on the first 1-2 posts of each format so IG and TikTok learn his sound (he has been quiet — the algorithm has nothing recent to work with).' },
      { name: 'Lore breadcrumbs', detail: 'Prime "is this a real place?" / "who is the gnome?" / "when does the album drop?" comments on the lore drops — manufacturing the organic-looking curiosity that a Vada Vada universe earns naturally. Per-user AI-varied comments (via comment-copilot) keep them from looking copy-pasted.' },
      { name: 'Follow + pre-save nudges', detail: 'Route follow and pre-save actions on each single drop to start converting the 1.4M passive streamers into followers and pre-savers.' },
      { name: 'Owned = cost + control', detail: 'As an owned tool, SWRM runs at marketplace cost (20% self-serve), not agency markup. Spend stays in-house and is dialed per drop.' },
    ],
    note: 'Guardrail: SWRMERS are verified real people doing genuine actions, and comments are AI-varied per user. Keep volume tasteful — especially in this lane, where authenticity is the signal that matters most.',
  },

  // ── 11 DSP Conversion ──
  dsp: {
    intro: 'The cascade builds the world; the DSP stack converts the 1.4M streaming audience that has been on autopilot for years.',
    items: [
      { name: 'Per-single pre-save + Marquee', detail: 'Each of the four singles gets a pre-save live ~3-4 weeks out (industry norm is 30 days; we have the runway, use it). Marquee at drop, aimed first at lapsed listeners from the 1.4M base.' },
      { name: 'Album Countdown Page', detail: 'Opens at Single 3 (Sep 18) for ~8-10 weeks of lead-in. Add Clips — artists who do see ~2x more pre-saves. Pre-save link in every bio and clip through the November album drop.' },
      { name: 'Showcase', detail: 'Home-feed banner across album launch week.' },
      { name: 'Spotify Canvas as a social funnel', detail: 'Carry the @handle + "follow for the lore" hook in Canvas loops on every single. This converts the 1.4M passive streamers into followers — the core problem.' },
    ],
  },

  sources: [
    'Tokscript — Temporex (@.temporex) and Nourished by Time (@nourishedbytime) TikTok metadata',
    'Web research — comp identification and handles, Temporex catalog and streaming stats',
    'Prior CCD analysis — universal pattern library from 26-post TwelveLabs Pegasus frame analysis',
    'Web research — bedroom-pop / lo-fi lane data (Sprout Social, Brandlens, NewzEnler 2026)',
    'Artist-supplied — Waterhole track notes and the four reference artists',
  ],
};

export type TemporexData = typeof temporex;
export default temporex;
