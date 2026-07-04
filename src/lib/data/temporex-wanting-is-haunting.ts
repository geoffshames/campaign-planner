// Temporex — "Fantastic Machine" album rollout
// Research: TikTok metadata (Tokscript), web research, indie / bedroom-pop lane data
// Note: IG comp deep-dive pending (Tokscript IG service outage at build time).

export const temporex = {
  slug: 'temporex-fantastic-machine',
  artist: 'temporex',
  song: 'fantastic machine',
  releaseType: 'album',
  genre: 'Bedroom Pop / Dream Pop',
  releaseDate: 'November 2026 (TBD)',
  tier: 'Established · Streaming-Strong',
  label: 'Independent',
  homeBase: 'San Diego, CA',
  campaignWindow: 'July – November 2026 · four-single cascade into the album',
  generatedDate: 'July 4, 2026',

  // ── Release calendar ──
  calendar: [
    { date: 'Jul 10', label: 'Single 1 — Waterhole', kind: 'single' },
    { date: 'Aug 14', label: 'Single 2 — Real Time (w/ video)', kind: 'single' },
    { date: 'Sep 18', label: 'Single 3 — Somewhere I’m Better Now', kind: 'single' },
    { date: 'Oct 23', label: 'Single 4 — Fantastic Machine (title track + big video)', kind: 'announce' },
    { date: 'Nov TBD', label: 'Album · Fantastic Machine (working title T3)', kind: 'ep' },
  ],

  // ── Asset rollout ladder (relative days, repeats per single) ──
  assetLadder: {
    intro:
      'The tentative asset rollout, in relative days, that repeats for every single. It follows the asset priority ladder we locked on 7/2: single art first, then one animated “coming soon” / pre-save asset, then the Spotify Canvas, then “out now” last. One base, text swapped a few times, minimal waste.',
    spec:
      'Per-single deliverable base (6/29 spec): 15s + 30s cutdowns, each in three text/CTA versions, one Spotify Canvas, vertical + square. Build the base once, resize and swap the CTA. The live footage filmed on the 19th is the hero content that anchors the cutdowns.',
    rows: [
      { day: 'D-14', asset: 'Single art as “coming soon” tease + pre-save live', note: 'Single art is #1 and already delivered. Pre-save link into every bio.' },
      { day: 'D-10', asset: 'Lore / BTS drop — organic, no CTA', note: 'A bedroom demo, tuning diary, or gnome / lore fragment. Warms the algorithm before the ask.' },
      { day: 'D-7', asset: 'Animated “coming soon” / pre-save push (15s + 30s, vert + square)', note: 'The one animated asset that carries the pre-save. Meta pre-save ads go live.' },
      { day: 'D-3', asset: 'Second hook clip + Spotify Canvas finalized', note: 'Lyric or loop-drop clip cut to the hook. Marquee scheduled for drop day.' },
      { day: 'D-1', asset: '“Out tomorrow” Story + countdown sticker', note: 'Low-lift reminders across Stories; last pre-save nudge (SWRM follow / pre-save actions).' },
      { day: 'Release', asset: '“Out now” set (15s + 30s × 3 CTA) + Canvas live + first live-footage clip', note: 'Marquee fires at drop, aimed first at lapsed listeners from the 1.4M base.' },
      { day: 'D+3', asset: 'Paid amplification of the single best organic clip', note: 'Dark-post the winner on Meta + TikTok Spark. Optimize to saves / pre-saves, not views.' },
      { day: 'D+7', asset: 'Cutdown wave off the live footage + creator seeds', note: 'Luis cuts the footage from the 19th; seed micro-creators on bedroom-pop / indie pages.' },
      { day: 'D+14', asset: 'Sustain post → roll into the next single’s D-14 tease', note: 'Bridge the world forward so every drop hands off to the next.' },
    ],
    albumNote:
      'The album runs the same ladder but longer: the Spotify Countdown page opens at Single 3 (~8–10 weeks out) and launch week stacks Marquee + Showcase + Strive rideshare + the Fantastic Machine video. Real Time (Single 2) and Fantastic Machine (Single 4) each add a music-video cutdown wave on release day.',
  },

  // ── 02 The Diagnosis / Artist Position ──
  diagnosis: {
    headline: 'The 1.4M-streaming dream-pop artist who has been radio silent on socials.',
    body:
      'temporex has 1.4 million Spotify monthly listeners — and just 32K TikTok followers across only 3 lifetime TikTok posts (most recent: October 2024). The previous album "Bowling" dropped in 2021. The streaming engine is huge; the social engine is essentially off. The problem is not posting at all. The fix is not volume for volume’s sake — the comps in this lane prove that bedroom-pop wins with curation, not cadence. The fix is turning the engine on, in temporex’s own voice (music + visual art), with one connected world that runs across all four singles into the album.',
    stats: [
      { value: '1.4M', label: 'Spotify monthly listeners', tone: 'good' },
      { value: '32K', label: 'TikTok followers (3 lifetime posts)', tone: 'bad' },
      { value: '~5y', label: 'Since last album (Bowling, 2021)', tone: 'bad' },
      { value: 'Nov 26', label: 'Album drop — Fantastic Machine', tone: 'good' },
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
      'Frame-level deep-dive on temporex’s reference posts (The Garden, Chanel Beads, Nourished by Time, Homeshake) is pending the Tokscript IG service restoring (all four comps are IG-first). In the meantime, the pattern library below pulls from short-form best practice and bedroom-pop / lo-fi lane research — and these patterns hold especially strongly in this lane.',
    patterns: [
      { pattern: 'Phone-shot beats polished — even more in this lane', prevalence: 'Web data: lo-fi Reels +20% vs polished; TikTok lo-fi +32% watch-through', implication: 'Shoot on a phone. Resist the urge to make every visual "art-directed." The lo-fi instinct is the lever; the visual art piece can sit in static covers, not every Reel.' },
      { pattern: 'Text-on-screen in the first 3 seconds', prevalence: 'Universal in short-form best practice; most viewers watch sound-off', implication: 'Open every clip with a context line (most watch with sound off). For temporex this is a free win on lore: "the man who was poisoned by a gnome" reads as a hook.' },
      { pattern: 'Varied pacing, never one constant speed', prevalence: 'The dominant cut pattern across the reference set', implication: 'Mix slow lo-fi shots with fast cuts on a hook. Dream-pop does not mean uniformly slow.' },
      { pattern: 'The single moment is engineered onto a visual peak', prevalence: 'Across the top performers', implication: 'For temporex this is the lyric or the loop drop. Cut so the title-track hook lands on a face, an object, or the gnome.' },
      { pattern: 'Caption-driven storytelling outperforms promo lines', prevalence: 'Universal across the prior analysis', implication: 'A specific story (the Waterhole gnome backstory the artist already wrote) beats "out now" or "pre-save link in bio" every time.' },
      { pattern: 'A recurring named world makes every post feel like one project', prevalence: 'The Garden built 365K on exactly this with "Vada Vada"', implication: 'temporex should give the album a named visual world (the farm + the gnome + the gradient sunset palette) and stamp every clip with it.' },
    ],
    videos: [] as { title: string; artist: string; plays: string; insight: string }[],
  },

  // ── 05 Thesis + Phases ──
  thesis:
    'Turn the lore on. The artist behind 1.4 million monthly streams has been radio silent on socials for years. The fix is to show up — but in his own voice: visual artist, surreal live-action cartoon (The Mask, Monkeybone, Cool World, Earthworm Jim), strange and unnatural proportions, intricate sets and costumes, late-90s film palette. Build ONE connected world — the gnome, the farm, the unnatural creatures, the faded peach-lavender palette — that runs across all four singles into the Fantastic Machine album. Each monthly single is a chapter in that world. The 1.4M people streaming temporex should arrive in November to a Spotify Countdown page already filled with people they recognize from a year of lore.',
  phases: [
    { name: 'Lore Drop / Reset', weeks: 'May 22 – Jul 9', objectives: ['Turn the engine on (he is silent today)', 'Open the visual world: farm + gnome + palette', 'Stand up the 5 content formats; book IG and TikTok cadence'] },
    { name: 'Single 1 · Waterhole', weeks: 'Jul 10 – Aug 13', objectives: ['Drop the gnome story publicly', 'Country-western imagery + Linn Drum demo', 'Friend cameo (Adrian) becomes a recurring beat'] },
    { name: 'Single 2 · Real Time (music video)', weeks: 'Aug 14 – Sep 17', objectives: ['Music video as the centerpiece — clip it 12 ways', 'Open the world wider (new location, new character)', 'Small clipping test off the MV'] },
    { name: 'Single 3 · Somewhere I’m Better Now', weeks: 'Sep 18 – Oct 22', objectives: ['Open the album Countdown page', 'Bridge: tie back to the gnome / the farm', 'Begin album sequencing teases'] },
    { name: 'Single 4 · Fantastic Machine (title track + big video)', weeks: 'Oct 23 – early Nov', objectives: ['The big-budget video is the tentpole and the clipping quarry', 'Main paid clipping push off the big-budget video (album line + reserve)', 'Pre-album press + creator seeding crescendos'] },
    { name: 'Album Launch · Fantastic Machine', weeks: 'November (TBD) +', objectives: ['Album drops; Marquee + Showcase on; Countdown converts', 'The title track Fantastic Machine is the centerpiece', 'Sustain the world for ≥4 weeks post-release'] },
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
    'Recurring world: pick ONE named lore element (the gnome, the farm, the cartoon palette, the Fantastic Machine itself) and stamp every clip with it for six months. The gnome and the unnatural-proportions visual language should appear across all five formats. By the November album, fans should be commenting "this is the Fantastic Machine world" without prompting. Same hook, twenty drops, one payoff.',
  cadence:
    'Target 3-5 posts a week on IG (the lane platform); 1-2 on TikTok. Quality > volume in this lane (lo-fi Reels beat polished by 20%, TikTok by 32%). The 80/20 rule still applies: at most 1 in 5 posts can be a "presave / out Friday" line.',

  // ── 07 Content Ideas ──
  ideas: [
    { name: 'Meet the Gnome', bit: 'A recurring illustrated / claymation gnome with strange and unnatural proportions (per the album’s vis-dev). Appears in every clip, takes over Stories for a day, sends "voicemails" via Reels audio.', hook: 'this is the gnome who poisoned the man', why: 'The artist wrote this character into the Waterhole song. Use him. He becomes the Fantastic Machine mascot.', top3: true },
    { name: 'Waterhole Farm', bit: 'Recurring visual world (the lonely man’s farm) shot live-action with cartoon set pieces — Cool World aesthetic. Photo carousels + 10-second mood clips. Cohesive palette throughout.', hook: 'this is where the man lived', why: 'Album-world cohesion. Anchors the cartoon-meets-real direction.', top3: true },
    { name: 'How I Made [track]', bit: 'Linn Drum + alt-tuning demo for each single. Real desk, real gear, with a single oversized cartoon prop (Earthworm Jim style) sneaking into frame.', hook: 'made this from a Linn Drum and a detuned acoustic', why: 'Producer TikTok / songwriter Reddit eats this. High save intent. Plays to his actual workflow.', top3: true },
    { name: 'Muttering Vocals', bit: 'Short clips of the artist muttering nonsense over a loop until real words form. The actual songwriting workflow he described in the Waterhole notes.', hook: 'this is how the song starts', why: 'Bedroom-pop process content. Authentic, lo-fi, fascinating.', top3: false },
    { name: 'Visual Art Diary', bit: 'Sketches, paintings, sculpture, ceramics — the work that becomes single covers, merch, lyric video frames, and Fantastic Machine cover art.', hook: 'this is the cover before the cover', why: 'Leans on his actual unique identity (the "music and visual art" framing). Nobody else in the lane has this.', top3: false },
    { name: 'Friend Cameos (one instrument, one room)', bit: 'A recurring slot: each week a different friend (Adrian on mandolin started it) walks in, plays one instrument on one track.', hook: 'today: Adrian on mandolin', why: 'Borrowed audience + a low-effort collab pattern. Rotate in directors and visual collaborators too (Eagan, Cage Claypool).', top3: false },
    { name: 'Costume + Set BTS', bit: 'Document the intricate sets, surreal lighting, and costumes the artist explicitly wants for the music videos. Shoot-day photos, prop builds, costume tests, set walk-throughs.', hook: 'building the Fantastic Machine', why: 'The vis-dev doc calls out intricate set design + costumes as the central visual lever. The production process IS content.', top3: false },
    { name: '3 Linn Drum Loops, 3 Rooms', bit: 'Same drum loop interpreted three different ways across three locations (bedroom, garage, desert porch). One constraint, three answers.', hook: 'same loop, three rooms', why: 'Constraint format. Producer-bait. Visually cohesive. Specific to his gear.', top3: false },
    { name: 'FPV Drone Music Video', bit: 'One-shot FPV drone music video — the artist named this directly in vis-dev. Could be Real Time or a deep cut. Frame-perfect motion through the Fantastic Machine world.', hook: 'one take. one drone.', why: 'Direct from the artist’s wishlist. FPV drone work travels: shareable as a clip, novel for the lane, builds the world.', top3: false },
    { name: 'Fantastic Machine MV Build', bit: 'Episodic build of the big-budget Oct 23 music video. Pre-production, set build, costume tests, shoot day, on-monitor moments — surreal cartoon-meets-real proportions on display.', hook: 'day 1: building the machine', why: 'A music video shoot is a content quarry. The Garden does this constantly. Free content for weeks, and it sells the visual identity.', top3: false },
    { name: '3D Premiere + Glasses', bit: 'Host an in-person Fantastic Machine premiere event with a 3D animated short and 3D glasses handed out. Clip the audience-reaction footage for socials.', hook: 'free 3D glasses at the door', why: 'Artist’s explicit ask from the vis-dev doc. A novel, deeply on-brand experiential moment that doubles as IRL press and content.', top3: false },
    { name: 'Crate-Digging San Diego', bit: 'Local record shops (Folk Arts, M-Theory) and vintage instrument stores. Pull a record, tell its story, sample from it on camera — with one cartoon prop in every shot.', hook: 'found this in a $2 bin', why: 'The classic crate-dig-meets-sample-flip move, rooted in San Diego. Anchors the artist in a place.', top3: false },
  ],

  // ── Visual Identity (from artist’s vis-dev) ──
  visualIdentity: {
    lookAndFeel: 'Surreal live-action cartoon. Real-world bedrooms, desks, streets fused with hand-painted characters of strange and unnatural proportions — long arms, stretched smiles, faded peach-lavender palette, film grain. The lineage is The Mask (1994), Monkeybone (2001), Cool World (1992), Who Framed Roger Rabbit (1988), Rocky & Bullwinkle (2000) — with an Earthworm Jim energy underneath all of it.',
    principles: [
      'Part visualizer, part performance — minimal nonsensical narrative drives every video',
      'Intricate set design and surreal lighting; costumes do real work',
      'Late-90s faded film palette (peach, lavender, dull cyan) — never glossy',
      'Strange and unnatural proportions on every recurring character (the gnome included)',
    ],
    mvReferences: [
      { title: 'Nirvana — Heart-Shaped Box', url: 'https://www.youtube.com/watch?v=n6P0SitRwy8' },
      { title: 'Michael Jackson — Leave Me Alone', url: 'https://www.youtube.com/watch?v=crbFmpezO4A' },
      { title: 'Peter Gabriel — Sledgehammer', url: 'https://www.youtube.com/watch?v=OJWJE0x7T4Q' },
      { title: 'Peter Gabriel — Big Time', url: 'https://www.youtube.com/watch?v=PBAl9cchQac' },
      { title: 'Slow Pulp — Falling Apart', url: 'https://www.youtube.com/watch?v=yuoFLLHB1Fc' },
      { title: 'Magdalena Bay — Second Sleep', url: 'https://www.youtube.com/watch?v=JAe2faaZ3sY' },
      { title: 'Duelin’ Firemen! Summer CES 1994 Teaser', url: 'https://www.youtube.com/watch?v=MY0GZEqOIJ4' },
    ],
  },

  // ── Production / Video Collaborator Leads (from artist) ──
  collaborators: [
    { name: 'Eagan', role: 'Music video director', note: 'Friend of the artist with a clear artistic vision. Artist is enthusiastic about him directing one of the videos.' },
    { name: 'Cage Claypool', role: 'Music video / visual creator', note: 'Flagged as a strong potential collaborator in the vis-dev doc.' },
    { name: 'Open seat #1', role: 'Director / visual creator (full creative control on offer)', note: 'The artist flagged two unnamed creators whose work he loves enough to give full creative control. Identify from the vis-dev doc IG links and brief.' },
    { name: 'Open seat #2', role: 'Director / visual creator (full creative control on offer)', note: 'The second of the two unnamed creators referenced in vis-dev. Same standing offer.' },
  ],

  // ── Budgets by drop ──
  budgets: {
    total: '$14,000 · ~$12K deployed, ~$2K reserve',
    perDrop: [
      { drop: 'Single 1 · Waterhole', amount: '$2,000', allocation: 'Meta $900 (dark-post best clips + the pre-save asset) · TikTok Spark $350 · Spotify Marquee $350 (aimed at lapsed listeners from the 1.4M base) · YouTube pre-roll $200 · micro-creator seeding + cutdowns $200. Lead single — deploy the full envelope to set the tone.' },
      { drop: 'Single 2 · Real Time (video)', amount: '$2,000', allocation: 'Meta $600 · YouTube pre-roll $350 (lean into the video) · TikTok Spark $250 · Spotify Marquee $200 · clipping test + edits $100. ~$1,500 live, ~$500 held to reserve. Video is Joseph + Luis in-house, not ababa.' },
      { drop: 'Single 3 · Somewhere I’m Better Now', amount: '$2,000', allocation: 'Meta $600 · TikTok Spark $300 · Spotify Marquee + open the album Countdown page $300 · YouTube pre-roll $150 · creator seeding + edits $150. ~$1,500 live, ~$500 held to reserve.' },
      { drop: 'Single 4 · Fantastic Machine (video)', amount: '$2,000', allocation: 'Meta $800 · YouTube pre-roll $400 (big video) · TikTok Spark $300 · clipping push off the video $300 · Spotify Marquee $200. Pre-album tentpole — the title-track video is the clipping quarry.' },
      { drop: 'Album · Fantastic Machine (T3)', amount: '$6,000', allocation: 'Meta $1,800 (multi-format launch) · Strive FM rideshare playlisting $1,600 (~150K streams, decay hedge on the hero) · Spotify Marquee + Showcase $700 · YouTube pre-roll $500 · clipping + creator seeding $400. ~$5,000 live, ~$1,000 held to reserve. The hero drop.' },
    ],
    note: 'Marketing only, and separate from production: the ababa animation retainer (~$6.5K/mo) and the music-video shoots ride the recording/production line, not this $14K. The ~$2,000 reserve is held centrally for extra live-footage cutdowns and to double down on whichever single overperforms. The creative activations below (microsite, web game, IRL booth) are greenlight-later concepts, not costed against this $14K.',
  },

  // ── 08 Rollout Playbook ──
  playbook: [
    { week: 'Now – Jul 9', phase: 'Lore Drop / Reset', objective: 'Turn the engine on. He has been radio silent — that ends now, but quietly and curated.', actions: ['Audit and archive any stale posts; reset the grid to the new visual palette', 'Establish the world: drop the first 3 "lore" posts (the farm, the gnome, the desert)', 'Batch 8-10 phone-shot bedroom demos + tuning diaries in one studio sit', 'Open Waterhole pre-save by ~Jun 12 (4 weeks out)'], signals: ['First lore post outperforms his recent baseline', 'Returning followers see "something is happening" without being told'] },
    { week: 'Jul 10 · Single 1 — Waterhole', phase: 'Single 1', objective: 'Drop the gnome story publicly. Country-western imagery, Linn Drum, mandolin. The lore goes live.', actions: ['Pre-save live in every bio (was up by Jun 12)', 'Drop day: Reel of the Linn Drum loop + the line "poisoned by a gnome" as the text-in-3s hook', 'Adrian (mandolin) cameo Reel during week 1', 'Marquee at drop, aimed at lapsed + recent listeners from the 1.4M base'], signals: ['First-week streams vs. his 2021 single baselines', '"who is the gnome" / "what is this album" comments appear'] },
    { week: 'Aug 14 · Single 2 — Real Time (music video)', phase: 'Single 2 · Music video', objective: 'The music video IS the content asset. Clip it 12 ways.', actions: ['Pre-save up by ~Jul 17 (4 wks out); Marquee at drop', 'Music video drops alongside the single; immediately cut 8-12 vertical Reels off it', 'Small paid clipping test (~$100 + reserve if it hits) — measure cost-per-save, not just views', 'Push the lore wider: new character or location enters the world'], signals: ['MV crosses 100K views in week 1', 'A clip / lyric line breaks out organically'] },
    { week: 'Sep 18 · Single 3 — Somewhere I’m Better Now', phase: 'Single 3 · Album Countdown opens', objective: 'Mid-rollout tentpole. Open the album Countdown page; bridge the world to the album.', actions: ['Open Spotify Countdown for the album with Clips (~2x pre-saves) — bio + every clip CTA', 'Announce the album: "this is the [name]verse" payoff', 'Pre-save up by ~Aug 21; Marquee at single drop', 'Begin seeding micro-creators on bedroom-pop / dream-pop / indie pages'], signals: ['Countdown pre-saves ramping', 'Announce is the highest-engagement post yet'] },
    { week: 'Oct 23 · Single 4 — Fantastic Machine (big budget video)', phase: 'Single 4 · Big video tentpole', objective: 'Tentpole. Big video is the clipping quarry AND the visual climax of the world.', actions: ['Pre-save up by ~Sep 25 (4 wks out)', 'Drop the music video alongside the single', 'Paid clipping push (~$300 on this drop + first call on the $2K reserve), tight brief tying clips to the album pre-save', 'Fan-flip cycle peaks — invite fans to recreate one shot from the video'], signals: ['MV crosses 500K views in 2 weeks', 'Clip campaign CPM in the $1-5 range'] },
    { week: 'Nov · Album — Fantastic Machine', phase: 'Album Launch', objective: 'Album day. Convert the year-long lore audience.', actions: ['Album drops; Marquee + Showcase on; Countdown page converts', 'Drop the title-track Reel ("Fantastic Machine" text-in-3s, cartoon hook visual)', 'Daily Reels of the album’s standout moments across launch week', 'Push press, Your Culture, Strive FM, micro-creator seeding'], signals: ['Album first-week streams beat "Bowling" (2021) baseline by 50%+', 'Sound creates on the title track climbing on Reels and TikTok'] },
    { week: 'Nov + (sustain)', phase: 'Sustain', objective: 'Hold the world. Bank the audience.', actions: ['Resume the 5-format weekly rotation through year-end', 'Move new followers into Laylo email/SMS', 'Tour announce (if booked) tied to the world / characters', 'Plan visual-art exhibit or merch capsule extending the [name]verse'], signals: ['Streaming holds 70%+ of week 1 by week 4', 'Owned audience (email/SMS) standing up; tour-on-sale activity if relevant'] },
  ],

  // ── 09 Channel Allocation ──
  allocation: [
    { channel: 'Organic content engine (IG-Reels-led)', pct: 50, color: '#FD3737', rationale: 'IG is the lane platform — all four comps live here. Reels do 50% of IG time. The lo-fi format gets +20% on Reels, +32% on TikTok. Highest leverage and the only thing that fixes the underlying silence.' },
    { channel: 'Paid clipping + social', pct: 20, color: '#D42D2D', rationale: 'Small test off the Real Time video in August; a focused push off the Fantastic Machine video in October (album line + reserve), plus paid dark-posts behind the best organic clips on every drop.' },
    { channel: 'Creator + SWRM engagement', pct: 20, color: '#A1A1AA', rationale: 'Micro-creators on bedroom-pop / dream-pop / indie pages + CCD-owned SWRM real-user engagement to seed lore posts so they clear the algorithm threshold.' },
    { channel: 'DSP + experiential', pct: 10, color: '#71717A', rationale: 'Marquee at every drop, Showcase + Strive FM rideshare playlisting at album launch, the Countdown page, and Spotify Canvas carrying the @handle "follow for the lore" hook. Optional: tour / visual-art exhibit tie-ins.' },
  ],
  allocationPhases: [
    { phase: 'Lore Drop / Reset', split: 'Organic 80 · Seeding 15 · Paid 0 · DSP 5' },
    { phase: 'Singles 1-2', split: 'Organic 60 · Seeding 20 · Paid 5 · DSP 15' },
    { phase: 'Singles 3-4', split: 'Organic 45 · Seeding 25 · Paid 15 · DSP 15' },
    { phase: 'Album Launch', split: 'Organic 30 · Paid 45 · Seeding 15 · DSP 10' },
  ],

  // ── 10 Clipping + Amplification ──
  clipping: {
    intro: 'temporex has no recurring long-set asset to clip — the two music videos are the clipping quarries. Small test off the Real Time video in August (~$100 from the Single 2 line), main push off the Fantastic Machine video in October–November (~$300 from the album line + the $2K reserve). Kept deliberately lean on a $14K budget; scale only what proves out.',
    steps: [
      { step: 'Music video #1 (Aug 14)', detail: 'Real Time MV is the first clipping asset. Cut 8-12 vertical Reels off it on launch day.' },
      { step: 'Small paid clipping test', detail: 'Test small (~$100 + reserve) on the Real Time video in August. Learn what hooks land. Measure cost-per-save and pre-save, not just views.' },
      { step: 'Music video #2 (Oct 23)', detail: 'Fantastic Machine big-budget video is the tentpole. Cut 15-20 verticals. This is the year’s biggest visual asset.' },
      { step: 'Main paid clipping push', detail: 'Scale using the album clipping line (~$300–400) plus the $2K reserve at the Oct 23 release and through album launch (Nov). $1–5 CPM cap; tight brief tying every clip to the album pre-save and the lore.' },
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
      { name: 'Album Countdown Page', detail: 'Opens at Single 3 (Sep 18) for ~8-10 weeks of lead-in toward Fantastic Machine. Add Clips — artists who do see ~2x more pre-saves. Pre-save link in every bio and clip through the November album drop.' },
      { name: 'Showcase', detail: 'Home-feed banner across album launch week.' },
      { name: 'Spotify Canvas as a social funnel', detail: 'Carry the @handle + "follow for the lore" hook in Canvas loops on every single. This converts the 1.4M passive streamers into followers — the core problem.' },
    ],
  },


  // ── World-Building Activations (Substack / Microsite / Booth) ──
  worldBuilding: [
    {
      name: 'The Machine Room · explorable web game + gamified pre-save',
      format: 'Web-based 3D world (WebGL / Blender) · custom domain',
      bit:
        'A browser-playable room built from the album’s Blender assets — the modular platforms, facades and engine-parts Joseph is already making. Players walk and parkour through the Fantastic Machine world (Mirror’s Edge-style), and the promo lives inside the world: billboards along the route read “new single — out now,” FIFA-pitch-side style, so it never feels like an ad slapped over the animation. A gamified gate unlocks the next room — “your phone number is your ticket to the ride.” Drop an email / phone to open a hidden track or the album countdown, captured straight into Laylo for email + SMS retargeting on future drops and shows.',
      why:
        'The single best answer to the core problem: 1.4M passive catalog streamers, almost none of them owned. The game converts curiosity into an owned email / SMS list (pull, not push), the in-world billboards make every single announcement immersive instead of salesy, and it reuses assets the artist + ababa are already building — so the incremental cost is mostly web dev. Clip the playthrough for Reels and it doubles as the album’s centerpiece “dark ride” content.',
      refs: [] as { label: string; url: string }[],
    },
    {
      name: 'Substack · "From inside the Machine"',
      format: 'Episodic narrative · owned email + on-platform',
      bit: 'A Substack where each entry is written in the voice of a different character from the album. No song titles, no album mentions, just voices logging their days, unaware they are part of something larger. The hermit from Waterhole goes first. As new singles drop, new voices take over. Every narrator mentions a Machine in passing — one has it in his barn, another heard it running in the distance, a third is trying to build one and cannot finish it. Nobody explains it. By the album drop, the reader realizes they have been moving through Fantastic Machine the whole time.',
      why: 'Owned narrative real estate. Substack subscribers convert at far higher intent than social followers, so this builds a small but extremely engaged email list across the rollout. Doubles as the seed bible for the Microsite and the Booth, and feeds organic lore breadcrumbs into Reels copy and SWRM comments.',
      refs: [] as { label: string; url: string }[],
    },
    {
      name: 'Archive Microsite · the Machine repair manual',
      format: 'Standalone microsite (Vercel · custom domain)',
      bit: 'A standalone site framed as a repair manual or catalog for a Machine that never existed. Each page is a component — illustrated, labeled with a made-up technical name, with a description of its unknown function. New parts get added as the rollout progresses. The full Machine is never shown until album day. Aesthetic: Dr. Seuss meets Looney Toons — pure cartoon absurdism, no steampunk. The Substack characters are hidden in the diagrams if you look close enough.',
      why: 'A standalone artifact fans collect and share — the modern equivalent of liner notes. Generates inbound press and "look at this" tweets. Becomes the destination link from every Reel and every Substack entry. Locks in the visual identity in a way no social post can.',
      refs: [
        { label: 'eastasiangraphicsarchive.com', url: 'http://eastasiangraphicsarchive.com' },
        { label: 'clothes.trudy.computer', url: 'http://clothes.trudy.computer' },
      ],
    },
    {
      name: 'Collaborative Animation Booth · live event activation',
      format: 'IRL booth · Heavy Manners + animated-shorts events',
      bit: 'A booth at the Heavy Manners show (and adjacent animated-shorts events) where attendees draw a single component of the Machine — a gear, a pipe, a lever, a creature — on an iPad or laptop. Each drawing gets added to a growing master illustration. The booth prints a personalized flier showing the current state of the Machine with their piece visibly in it, plus the album date. No two fliers are the same. By the album drop the Machine is fully assembled, built by strangers across every event the booth appears at. The final version becomes part of the short film.',
      why: 'Turns every event night into a content moment + a tangible fan artifact + a real piece of the album world. The "your drawing made it into the film" narrative converts attendees into superfans, and the build-up across events becomes its own social series ("Machine at 23% complete · Tokyo, Sept 7" style updates).',
      refs: [
        { label: 'Reve assembly example (X)', url: 'https://x.com/reve/status/2060045081013592486' },
      ],
    },
  ],
  sources: [
    'Tokscript — Temporex (@.temporex) and Nourished by Time (@nourishedbytime) TikTok metadata',
    'Web research — comp identification and handles, Temporex catalog and streaming stats',
    'Web research — bedroom-pop / lo-fi lane data (Sprout Social, Brandlens, NewzEnler 2026)',
    'Artist-supplied — Waterhole track notes, Fantastic Machine vis-dev doc (MV refs + collaborators + 3D-glasses premiere idea), the Substack / Microsite / Booth activation briefs, and the four reference artists',
  ],
};

export type TemporexData = typeof temporex;
export default temporex;
