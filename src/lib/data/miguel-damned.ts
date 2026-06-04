// Miguel — "damned" 30-Day Catalog Sprint
// Research: Chartmetric (artist 3853 / track 15677303, pulled Jun 4 2026), Cobrand Global Sound
// Search, kworb Spotify dailies, web research. Built Jun 4, 2026.

export const miguelDamned = {
  slug: 'miguel-damned',
  artist: 'Miguel',
  song: 'damned',
  releaseType: '30-Day Catalog Sprint',
  genre: 'R&B / Soul',
  releaseDate: 'June 26, 2015 (Wildheart)',
  tier: 'Superstar · Catalog Reactivation',
  label: 'ByStorm Entertainment / RCA Records',
  homeBase: 'Los Angeles, CA',
  campaignWindow: 'June 9 – July 6, 2026 · four-week sprint on a live viral moment',
  generatedDate: 'June 4, 2026',

  // ── 01 The Moment ──
  moment: {
    headline: 'An 11-year-old deep cut is doing 460K+ streams a day — with zero editorial support.',
    body:
      'In mid-April 2026 a TikTok trend built around the "when the gavel hit the stand, I\'m damned" lyric turned a Wildheart deep cut into Miguel\'s second-biggest song by daily velocity — 462K+ daily Spotify streams, behind only Sure Thing. The wave was created almost entirely by nano accounts: the top five videos (2M–4M views each) come from accounts with 277 to 2,040 followers, and the biggest sound is a fan re-upload with 130K creates — nearly 3x the official sound\'s 46K. TikTok creation has now plateaued (-0.1% this week after +584.7% over 30 days) while streams are still accelerating (+13.2% week over week). That is the exact window where Sure Thing 2023 became a #11 Hot 100 record: UGC peak passed, conversion phase open. The song has no Spotify editorial placement, sits at #37 and climbing on Apple Music US R&B, and just entered Shazam city charts in Denver, Charlotte and Irvine. Thirty days of coordinated pressure decides whether damned becomes a 100M-stream catalog pillar or a passing trend.',
    stats: [
      { value: '462K+', label: 'Daily Spotify streams (Miguel’s #2 song by velocity)', tone: 'good' },
      { value: '525.2K', label: 'TikTok creates · +584.7% in 30 days, now flat', tone: 'warn' },
      { value: '172M', label: 'TikTok views on damned sounds', tone: 'good' },
      { value: '0', label: 'Spotify editorial playlists — the conversion gap', tone: 'bad' },
    ],
    velocity: [
      { metric: 'Spotify streams (7d)', value: '+3.1M', change: '+13.2%', total: '26.4M total' },
      { metric: 'Spotify playlist reach (7d)', value: '+404.6K', change: '+93.4%', total: '842.7K — algorithmic only' },
      { metric: 'Shazams (7d)', value: '+18.8K', change: '+27.5%', total: '87.2K total' },
      { metric: 'TikTok views (7d)', value: '+12.8M', change: '+8.1%', total: '172M total' },
      { metric: 'TikTok creates (7d)', value: '-747', change: '-0.1%', total: '525.2K total — plateau signal' },
      { metric: 'Genius lyric views (7d)', value: '+3.4K', change: '+6.5%', total: '55.3K — meaning-seeking behavior' },
    ],
    charts: [
      'Apple Music US R&B/Soul #37 and climbing (+2 this week)',
      'Shazam Daily Tracks R&B #44 (+10) and #55 (+11) — 121 total chart entries worldwide',
      'Shazam city charts: Denver #182, Charlotte #185, Irvine #198 (all entered Jun 4)',
      'Apple Music R&B charts: Canada #47 (+5), UK #36, Estonia #46, Latvia #38, Suriname peak #4',
      'Deezer Top Tracks: Morocco peak #8, Hungary #38 — the trend is global, not US-only',
    ],
  },

  // ── 02 Artist Position (Chartmetric) ──
  position: {
    headline: 'The whole artist business is rising with the tide.',
    chartmetrics: [
      { label: 'Spotify monthly listeners', value: '30.73M', sub: '+221.7K this week · #208 worldwide' },
      { label: 'Spotify followers', value: '6.71M', sub: '21.84% fan conversion rate' },
      { label: 'Artist playlist reach', value: '322.7M', sub: '48x reach-to-follower ratio' },
      { label: 'Chartmetric rank', value: '#260', sub: '#120 US · #84 R&B/Soul · #76 Alternative' },
      { label: 'Shazam total', value: '65.3M', sub: '+96.4K this week' },
      { label: 'Pandora streams', value: '3.19B', sub: '2.66M monthly listeners · 10.98M artist stations' },
    ],
    social: [
      { platform: 'Instagram', value: '4.76M', sub: '0.54% engagement (peer median 1.24%)', pct: 100 },
      { platform: 'YouTube', value: '2.36M', sub: '2.43B channel views · 818K daily views', pct: 50 },
      { platform: 'TikTok', value: '716.4K', sub: '+1.3% this week · 0.68% engagement', pct: 15 },
    ],
    insight:
      'Career stage: Superstar. Momentum: Growth. But social engagement is rated Emerging — Miguel’s owned channels punch under their weight (IG engagement 0.54% vs 1.24% peer median; TikTok 716K followers vs 30.7M monthly listeners). The moment is being carried by other people’s pages. That is fixable leverage: the audience demonstrably wants this song; the sprint puts infrastructure around it rather than waiting for the artist feed to carry it.',
    sureThing: {
      title: 'The proven playbook: Sure Thing, 2023',
      points: [
        'Identical setup: a 12-year-old catalog track, organic TikTok wave (4M+ videos), sped-up version fueling it.',
        'With label + team pressure applied it hit #11 Hot 100, #1 US Pop Airplay, #4 UK — beating its original 2011 chart run.',
        'It drove the parent album to #20 on Top R&B Albums 13 years after release, and still does 1.03M streams/day.',
        'Miguel leaning in personally (reaction content, interviews, live moments) was a documented accelerant.',
      ],
    },
  },

  // ── 03 Audience (who is streaming this) ──
  audience: {
    demographics: {
      femalePercent: 62.2,
      primaryAge: '25–34',
      primaryAgePercent: 50.2,
      secondaryAge: '18–24',
      languages: [
        { label: 'English', percent: 84.25 },
        { label: 'Spanish', percent: 3.51 },
        { label: 'Portuguese', percent: 3.22 },
        { label: 'French', percent: 2.06 },
      ],
    },
    markets: [
      { country: 'United States', percent: 37.6 },
      { country: 'Mexico', percent: 15.9 },
      { country: 'Philippines', percent: 5.4 },
      { country: 'United Kingdom', percent: 4.1 },
      { country: 'Chile', percent: 4.0 },
      { country: 'Germany', percent: 3.9 },
      { country: 'Colombia', percent: 3.5 },
      { country: 'South Africa', percent: 2.8 },
      { country: 'Australia', percent: 2.7 },
      { country: 'Brazil', percent: 2.3 },
    ],
    latamCallout:
      'Miguel’s five biggest cities in the world are ALL Mexican: Mexico City, Guadalajara, Tijuana, Monterrey, Cancún — ahead of New York and LA. Mexico alone is 15.9% of total audience; add Chile, Colombia and Brazil and LATAM is ~26% of the fanbase. He has ready-made Spanish-language assets (Perderme — already trending at 69K daily streams, Caramelo Duro with Kali Uchis, Spanish versions of Banana Clip / Sky Walker / Criminal, the CAOS album’s Spanish-forward material) and zero current LATAM content infrastructure. This is the cheapest expansion surface in the entire plan.',
    cities: ['Mexico City', 'Guadalajara', 'Tijuana', 'Monterrey', 'Cancún', 'New York', 'Los Angeles', 'Chicago', 'Washington D.C.', 'Houston'],
    trendGeo: 'Top creator countries on the trend: US, UK, Lebanon, Philippines (Chartmetric UGC geo). The Shazam city entries (Denver, Charlotte, Irvine) mark where passive listeners are actively hunting the song — prime radio + Strive targeting.',
  },

  // ── 04 Trend Anatomy (Cobrand) ──
  trendAnatomy: {
    headline: 'A volume trend, not an influencer trend.',
    body:
      'Cobrand Global Sound Search shows the trend lives on derivative "original sound" re-uploads, not the official sound — and the top-performing videos come from accounts with a few hundred followers. The sound carries the video; the creator does not. That has two consequences: (1) paid amplification should buy VOLUME (clipping, fan pages) not expensive macro creators, and (2) the official sound is under-indexed, so every official-sound activation also recaptures attribution RCA can actually monetize and control.',
    sounds: [
      { name: 'original sound — dancemaidance', creates: 130202, type: 'Fan re-upload (sped)' },
      { name: 'original sound — mochaaalaceee', creates: 111858, type: 'Fan re-upload' },
      { name: 'original sound — lollibara', creates: 59174, type: 'Fan re-upload (ByStorm/RCA claimed)' },
      { name: 'original sound — c4sh5tar', creates: 51900, type: 'Fan re-upload' },
      { name: 'damned — Miguel (official)', creates: 46098, type: 'Official sound' },
    ],
    formats: [
      { name: 'The Gavel Hit', desc: '"When the gavel hit the stand, I’m damned" — judgment-moment POVs: caught feelings, caught lacking, verdict-on-my-love formats. The core trend grammar.', share: 'Dominant' },
      { name: 'Lyric-meaning explainers', desc: 'TikTok discover pages full of "damned miguel explained" — Genius views +6.5% weekly. Meaning-seeking content has open demand.', share: 'High' },
      { name: 'Aesthetic / mood edits', desc: '2026 R&B virality skews mood-and-atmosphere over dance: slow zooms, film grain, couple edits, quiet-luxury montages.', share: 'High' },
      { name: 'Vocal showcases & covers', desc: 'R&B’s reliable lane: harmonies, runs, duets over the bridge. Currently under-supplied on this sound.', share: 'Open lane' },
    ],
    topVideos: [
      { handle: '@pushingdownandpraying67', followers: '398 followers', views: '3.8M views · 637.5K likes' },
      { handle: '@malayyahh', followers: '2.04K followers', views: '3.7M views · 731.6K likes' },
      { handle: '@itsbritneysdiary', followers: '597 followers', views: '3.0M views · 599.7K likes' },
      { handle: '@melaylay671', followers: '342 followers', views: '2.6M views · 584.6K likes' },
      { handle: '@matchaloverrr09', followers: '337 followers', views: '2.4M views · 602.5K likes' },
    ],
  },

  // ── 05 Activation Stack ──
  activations: [
    {
      name: 'Clipping Program',
      cost: '$5,000 starting budget',
      rate: '$1–3 CPM · performance-based',
      projection: '1.7M–5M guaranteed views (≈2.9M at $1.75 blended CPM)',
      timing: 'Launch Week 1 · two waves',
      description:
        'The trend’s own data proves nano-account volume wins here — top videos came from <2K-follower accounts. A briefed clipping campaign (Whop / Clipify-style marketplaces) industrializes exactly that. Wave 1 (Week 1, $3K): four briefed lanes — Gavel Hit POVs, Wildheart-era nostalgia edits, lyric-meaning explainers, couple/relationship storytimes — official sound REQUIRED for payout. Wave 2 (Week 3, $2K): double down on the winning lane plus a Spanish-caption LATAM lane routed to the fan-page network. Music campaigns clear $3–5 CPM on these marketplaces, so a $1–3 CPM brief is competitive but fundable at our volume.',
      kpis: ['≥2.5M verified views at ≤$2.00 blended CPM', '≥60% of paid clips on the official sound', 'Creates curve back to net-positive by Day 10'],
    },
    {
      name: 'LATAM Fan-Page Network',
      cost: '$2,500/mo per page',
      rate: 'Start with 1–2 pages · ES-first',
      projection: 'Consistent daily LATAM presence · scale on proof, not promises',
      timing: 'Onboard Week 1 · always-on',
      description:
        'Operate dedicated Spanish-language fan pages (TikTok + IG Reels) at $2,500/month per page — start with one Mexico-focused page (his top 5 cities worldwide are all Mexican), with a second ES page covering Colombia/Chile as the option once page one proves out. Content system: damned trend formats with Spanish captions and subtitled lyric translations ("condenado a amarte"), Perderme and Caramelo Duro cross-pollination, CAOS-era live clips from the Feb–Apr tour, and Sure Thing nostalgia. Pages post 3–5x daily, seed comment sections in Spanish, and funnel to the official sound. This is the burner-page/Chaotic Good model Billboard documented as music’s dominant 2026 tactic — applied to the single cheapest audience expansion surface Miguel has. No inflated reach projections: Week 4 retro decides whether to add pages based on actual creates share and Mexico listener movement.',
      kpis: ['≥10% of new damned creates from LATAM geos by Day 30', 'Page-sourced engagement trending up week over week', 'Mexico monthly listeners visibly inflecting in Chartmetric'],
    },
    {
      name: 'Strive.fm Rideshare Campaign',
      cost: '~$1,500 + fees',
      rate: '≈150,000 streams',
      projection: 'Real-listener US streams + Shazam/algorithmic flywheel',
      timing: 'Launch Week 2 · 3-week flight',
      description:
        'Strive pays rideshare drivers to play campaign tracks; 30+ second listens register as real Spotify streams from real, geo-distributed listeners. Program damned as the lead track (plus Sure Thing and Adorn as catalog support slots in the 5-song campaign). Geo-weight to the cities where Shazam shows active song-hunting (Denver, Charlotte, Irvine) plus core US markets (LA, NYC, Houston, Chicago). Beyond the ~150K streams, the second-order effect is the point: rideshare plays drive passenger Shazams and saves — the exact signals feeding the algorithmic playlisting that is already +93% week-over-week.',
      kpis: ['150K streams delivered over flight', 'Shazam weekly velocity holds ≥+20%', 'Save rate on campaign streams ≥8%'],
    },
    {
      name: 'Third-Party Playlisting + DSP Push',
      cost: '$1,500–2,500',
      rate: 'Vetted curators only — no guarantees-for-cash',
      projection: '300–500K added playlist reach · editorial unlock',
      timing: 'Pitch Week 1 · adds land Weeks 2–4',
      description:
        'The song has 1.8K user playlists and ZERO Spotify editorial — at 462K daily streams. Two-track approach: (1) Agency-side: vetted independent curator pitching (SubmitHub/Playlist Push-grade networks, 2-year growth-chart checks on every list, no stream-count guarantees — purge-proof) targeting R&B, throwback, and "in my feels" mood lists; (2) Label-side: a data memo to RCA same week — Sure Thing precedent, velocity table, chart entries — pushing for Are & Be, R&B Right Now, Viral 50 consideration, plus Discovery Mode activation on damned and a Marquee/Showcase flight for Wildheart. Editorial is the single highest-leverage unlock in the plan: it converts a UGC spike into a durable streaming base.',
      kpis: ['≥2 Spotify editorial adds by Day 30', '+300K legitimate playlist reach', 'Playlist-sourced streams ≥12% of total by Day 30'],
    },
    {
      name: 'Artist Moment + Official Assets',
      cost: 'Production only (~$2–4K)',
      rate: 'Owned channels',
      projection: 'The Sure Thing accelerant, repeated',
      timing: 'Film Week 1 · drop Weeks 2–4',
      description:
        'Miguel’s 2023 Sure Thing reaction moment was a documented accelerant — repeat it deliberately. One half-day shoot yields the whole sprint: (1) a direct-to-camera "I see you" reaction to the trend + duet of a nano-creator video (punching down to tiny accounts is the story); (2) a stripped live one-take of damned (vocal-showcase lane is wide open); (3) a 60-second "what damned actually means" storytime answering the Genius-search demand; (4) Spanish-language thank-you to Mexico naming Mexico City/Guadalajara/Monterrey by name. Label side: ship an official sped-up + slowed pack (Sure Thing’s sped-up did 216M streams), a lyric visualizer for the 818K-daily-view YouTube channel, and CID claims routing derivative-sound traffic to the official sound.',
      kpis: ['Artist trend-participation post ≥5M views', 'Official sped-up pack live by Week 3', 'YouTube visualizer ≥500K views in window'],
    },
    {
      name: 'Conversion & Capture Layer',
      cost: '$0–1,000',
      rate: 'Infrastructure',
      projection: 'Owns the audience the trend rented',
      timing: 'Weeks 2–4',
      description:
        'Catch-net for the attention the other five activations generate: Laylo drop page teasing "something for the damned" (capture SMS/email before any next move), Genius verified annotation push, comment-seeding squads on trending videos (EN + ES), a damned-anchored "Wildheart, revisited" official playlist to spread the surge across the album (Sure Thing 2023 lifted its parent album onto the charts), and a Pandora/iHeart radio promo memo built on the Shazam city-chart data. If Week 4 metrics hold, this layer becomes the bridge into a month-two decision: live session release, LATAM remix feature, or paid amplification scale-up.',
      kpis: ['≥10K Laylo/SMS captures', 'Wildheart album streams +25%', 'Radio adds in ≥3 Shazam-spiking markets'],
    },
  ],

  // ── 06 Channel Allocation (sums to 100) ──
  channels: [
    { name: 'Clipping / creator volume', pct: 38, note: 'Two waves · the trend’s proven engine' },
    { name: 'Streaming acquisition (Strive + playlisting)', pct: 26, note: 'Converts attention into durable streams' },
    { name: 'LATAM fan-page network', pct: 19, note: 'Always-on · $2,500/mo per page · scale on proof' },
    { name: 'Artist content + official assets', pct: 12, note: 'One shoot, four weeks of drops' },
    { name: 'Capture layer (Laylo, seeding, radio memo)', pct: 5, note: 'Owns what the trend rented' },
  ],
  budget: {
    total: '$12,800–15,800 for the 30-day sprint (one LATAM page; +$2,500/mo per additional page)',
    lines: [
      { item: 'Clipping program (2 waves)', amount: '$5,000' },
      { item: 'LATAM fan-page network (per page)', amount: '$2,500/mo' },
      { item: 'Strive.fm flight', amount: '~$1,800 all-in' },
      { item: 'Third-party playlisting', amount: '$1,500–2,500' },
      { item: 'Artist content production', amount: '$2,000–4,000' },
      { item: 'Capture layer tools', amount: '$0–1,000' },
    ],
  },

  // ── 07 Weekly Playbook ──
  playbook: [
    {
      week: 'Week 0 · Jun 5–8',
      phase: 'Setup',
      objective: 'Lock infrastructure before the wave cools — every day of plateau is paid reach lost.',
      actions: [
        'Send RCA the data memo: velocity table, Sure Thing precedent, editorial ask (Are & Be / R&B Right Now / Viral 50), Discovery Mode + Marquee request, official sped-up/slowed pack greenlight, CID claims on the four big derivative sounds.',
        'Post clipping briefs to 2–3 marketplaces (Whop Clipping Culture, Clipify-grade): 4 lanes, official sound required, $1–3 CPM tiered by lane, content approval gate.',
        'Onboard the Mexico fan page (page one of the network): handle, brand kit, Spanish caption bank ("condenado a amarte" lyric translations), content calendar v1.',
        'Book Miguel half-day content shoot for Week 1 (4 deliverables, one setup).',
        'Begin vetted curator outreach with 2-year growth-chart screening; build target list of 60 R&B/throwback/mood playlists.',
      ],
      signals: ['Briefs live with ≥100 clipper signups', 'Mexico page claimed + warmed', 'Label memo acknowledged', 'Shoot on calendar'],
    },
    {
      week: 'Week 1 · Jun 9–15',
      phase: 'Re-Ignite',
      objective: 'Reverse the creates plateau with paid volume before organic decay sets in.',
      actions: [
        'Clipping Wave 1 ($3K) goes live across the four briefed lanes; daily leaderboard, kill underperforming lanes at 72 hours.',
        'Mexico fan page starts posting 3–5x daily: Gavel Hit formats with ES captions, tour-clip edits, Perderme cross-posts.',
        'Film the Miguel shoot: trend reaction + nano-creator duet, stripped live one-take, lyric storytime, Spanish thank-you. Hold all drops until edited as a 4-week pipeline.',
        'Drop #1 (Friday): Miguel’s trend-reaction/duet on artist TikTok + IG — the "artist sees the trend" story moment.',
        'Comment-seeding squads (EN/ES) active on every trending damned video >100K views.',
      ],
      signals: ['Creates curve net-positive again (+3–5K/day)', 'Official-sound share of new creates rising', 'Reaction post ≥2M views in 72h', 'First curator adds land'],
    },
    {
      week: 'Week 2 · Jun 16–22',
      phase: 'Convert',
      objective: 'Turn 172M views into owned streaming infrastructure.',
      actions: [
        'Strive.fm flight launches: damned lead slot, Sure Thing + Adorn support, geo-weighted to Denver / Charlotte / Irvine / LA / NYC / Houston.',
        'Drop #2: stripped live one-take of damned — feeds the open vocal-showcase lane and gives cover/duet creators an official stem to react to.',
        'Curator adds compound: target 150–250K added reach this week; follow up label editorial ask with Week 1 velocity proof.',
        'Launch "Wildheart, revisited" official playlist with damned at #1; push via artist stories + fan pages.',
        'Laylo drop page live ("for the damned — algo viene"); seeded through fan-page link-in-bios.',
        'LATAM push: Spanish thank-you video drops; fan pages run Mexico-city-shoutout formats timed to it.',
      ],
      signals: ['Daily streams hold ≥420K', 'Spotify algorithmic reach passes 1.2M', 'Strive streams pacing to 150K', 'Mexico listener growth visible in Chartmetric'],
    },
    {
      week: 'Week 3 · Jun 23–29',
      phase: 'Amplify',
      objective: 'Pour fuel on what Week 1–2 proved; ship the official derivative assets.',
      actions: [
        'Clipping Wave 2 ($2K): winning lane only + Spanish-caption LATAM lane; raise CPM to $2.50 for official-sound clips if volume lags.',
        'Official sped-up + slowed + reverb pack ships to DSPs; TikTok official sounds for both; fan pages and clippers pivot to the new sounds.',
        'Drop #3: lyric storytime ("what damned actually means") — captures the Genius/explainer search demand.',
        'Lyric visualizer premieres on YouTube (818K daily-view channel); Shorts cutdowns ship same day.',
        'Radio memo to Pandora/iHeart programmers: Shazam city-chart data + Apple R&B #37 trajectory; push for test spins in Denver/Charlotte.',
        'Boost top 3 organic clips via Spark Ads / TikTok Promote ($500 reserve) — amplify winners, never cold creative.',
      ],
      signals: ['Sped-up pack ≥50K day-one streams', 'Apple Music US R&B top 30', '≥1 editorial add confirmed', 'Blended clipping CPM ≤$2.00'],
    },
    {
      week: 'Week 4 · Jun 30–Jul 6',
      phase: 'Sustain + Decide',
      objective: 'Lock the gains, spread them across the catalog, and make the month-two call with data.',
      actions: [
        'Drop #4: Spanish thank-you follow-up — duet a LATAM fan-page edit from Miguel’s account; tease "algo para México" if month-two LATAM plan is greenlit.',
        'Wildheart cross-pollination: fan pages + clippers brief shifts 30% to album cuts (Coffee, waves, Anointed — already at 150K daily streams itself).',
        'Push Laylo captures through first SMS blast: live one-take full version as a gift, not an ask.',
        'Full-sprint retro: stream retention curve vs. Day 0, editorial status, LATAM share shift, CPM efficiency by lane.',
        'Month-two decision memo: (A) add LATAM page two + scale clipping, (B) LATAM remix feature / "condenado" Spanish version, (C) live session release, or (D) hold at maintenance.',
      ],
      signals: ['30-day cume ≥+13M streams', 'Daily streams ≥400K at Day 30 (vs ~250K natural decay)', 'Billboard Hot R&B Songs debut', '≥10K fan contacts owned'],
    },
  ],

  // ── 08 KPIs ──
  kpis: [
    { label: '30-day stream cume', target: '+13–15M', baseline: 'vs +9M natural decay path' },
    { label: 'Daily streams at Day 30', target: '≥400K', baseline: 'vs ~250K if trend dies undefended' },
    { label: 'Spotify editorial adds', target: '≥2', baseline: 'currently 0' },
    { label: 'TikTok creates trend', target: 'Net-positive by Day 10', baseline: 'currently -747/wk' },
    { label: 'Clipping views', target: '≥2.5M at ≤$2.00 CPM', baseline: '$5K budget' },
    { label: 'Strive streams', target: '150K delivered', baseline: '3-week flight' },
    { label: 'LATAM creates share', target: '≥10% of new creates', baseline: 'fan-page KPI · gates page-two spend' },
    { label: 'Chart position', target: 'Apple US R&B top 25 · Billboard R&B debut', baseline: 'currently #37 Apple' },
  ],

  // ── 09 Risks ──
  risks: [
    {
      title: 'Trend decays faster than paid volume can replace it',
      likelihood: 'Medium',
      impact: 'High',
      trigger: 'Creates still net-negative at Day 10 despite Wave 1; views-per-clip falling across all lanes.',
      contingency: 'Shift Wave 2 budget from creates-volume to streams-conversion: double Strive flight, raise playlisting spend, and pull the sped-up pack forward — catalog moments monetize on DSPs long after TikTok cools (Sure Thing still does 1M+/day three years later).',
    },
    {
      title: 'Playlisting contamination triggers artificial-streaming flags',
      likelihood: 'Low',
      impact: 'High',
      trigger: 'A curator list shows bot-pattern growth; streams from playlists with <40% listener retention.',
      contingency: 'Vetted-only policy from Day 0 (2-year growth charts, no guaranteed-stream sellers), all placements documented, kill-switch on any list that fails retention checks. Route the bulk of conversion budget through Strive (real listeners) and editorial (label pitch) instead.',
    },
    {
      title: 'A major R&B release window swallows the moment',
      likelihood: 'Medium',
      impact: 'Medium',
      trigger: 'Brent Faiyaz Icon cycle or a surprise summer R&B drop dominates editorial slots and creator attention in late June.',
      contingency: 'Catalog revivals don’t compete for release-week editorial — lean harder into throwback/mood playlists, nostalgia framing ("11 years later"), and the LATAM lane where the release calendar is quieter. Shift artist drops to counter-program (Tuesday/Wednesday).',
    },
    {
      title: 'Rights friction on derivative sounds',
      likelihood: 'Low',
      impact: 'Medium',
      trigger: 'CID claims on fan re-upload sounds kill trend momentum or anger the community.',
      contingency: 'Claim revenue, never takedown: keep all derivative sounds live and monetized, while paying clippers only on official sound to migrate share organically. The fan sounds are free marketing; the goal is attribution, not control.',
    },
  ],

  evidence: [
    'Chartmetric artist 3853 + track 15677303, pulled Jun 4 2026 (artist overview, audience, UGC, charts tabs)',
    'Cobrand Global Sound Search "damned", Jun 4 2026 — sound-level creates + creator landscape',
    'kworb.net Spotify dailies (May 13 2026 snapshot): damned 462,980/day; Anointed 150,548/day; Perderme 69,463/day',
    'Billboard Pro: "Burner Pages and Volume Posting" + "Secret Tactics Digital Marketers Use" (2026) — fan-page network precedent',
    'Variety / Billboard 2023 Sure Thing revival coverage — chart + album-lift outcomes',
    'Strive.fm published mechanics; Whop/Clipify 2026 clipping-market rate cards ($1–3 standard, $3–5 music)',
  ],
};

export type MiguelDamnedData = typeof miguelDamned;
