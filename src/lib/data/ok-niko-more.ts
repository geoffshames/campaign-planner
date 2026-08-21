/**
 * OK NIKO - "More" ft. RNZO
 * Campaign audit + $500 paid test plan.
 * Sources: Chartmetric API (pulled 2026-08-21), Cobrand (pulled 2026-08-21), web research.
 */

export const okNikoMore = {
  slug: 'ok-niko-more',
  artist: 'OK NIKO',
  song: 'More',
  feature: 'ft. RNZŌ',
  releaseDate: '2026-08-21',
  genre: 'Dance / Electronic',
  releaseType: 'Single',
  tier: 'Emerging',
  label: "it's nobody",
  homeBase: 'Ivalo, Finland to Los Angeles',
  campaignWindow: 'A 14-day paid test built to convert the biggest listener spike of his career before it decays like the two before it',
  pulledAt: '2026-08-21',

  /* ── 01 THE FINDING ── */
  finding: {
    headline: 'Reach is not the problem. Retention is.',
    body:
      'OK NIKO has produced three listener spikes in eight months without a dollar of paid support. Each one was bigger than the last. Each one converted almost nobody. On 1 January he had 1,633 monthly listeners and 243 Spotify followers. Today he has 29,829 monthly listeners and 349 followers. The listening grew 18-fold. The audience he actually owns grew by 106 people. That gap is the entire strategic problem, and it is the only thing this budget should be pointed at.',
    stats: [
      { value: '29,829', label: 'Spotify monthly listeners, an all-time high', tone: 'good' },
      { value: '349', label: 'Spotify followers, the audience he keeps when the spike ends', tone: 'warn' },
      { value: '85:1', label: 'Listeners per follower. A healthy developing act runs closer to 5:1', tone: 'warn' },
      { value: '0', label: 'Editorial playlist placements. None of this is coming from playlisting', tone: 'warn' },
    ],
    velocity: [
      { metric: 'Monthly listeners', total: 'Peak of a spike that began 23 July', value: '29,829', change: '+1,244% in 30 days' },
      { metric: 'Daily listener gain', total: 'Down from +2,110 on 14 August', value: '+727', change: 'decelerating' },
      { metric: 'Spotify followers', total: 'Up from 319 on 30 July', value: '349', change: '+30 in the same window' },
      { metric: 'Follower conversion', total: 'Share of the 27,610 new listeners who followed', value: '0.11%', change: 'the core failure' },
    ],
    context: [
      'Chartmetric career stage reads "undiscovered" with a growth trend, artist rank 319,233 globally and 1,315 in Finland.',
      'Spotify popularity score sits at 24, consistent with a catalogue that gets discovered repeatedly and retained rarely.',
      'Zero current playlist placements on Spotify, editorial or otherwise. The listening is arriving through association and algorithm, not curation.',
      'His previous release "never mine" sits on 10 playlists total, none editorial.',
    ],
  },

  /* ── 02 SPIKE ANATOMY ── */
  spikes: {
    headline: 'Three spikes, two full decays, and a pattern that predicts what happens next.',
    summary:
      'The listener curve is not a growth line. It is a sawtooth. Two previous spikes rose fast, peaked inside four weeks, and returned to a baseline of roughly 2,400 monthly listeners. Neither left behind a meaningful follower gain. The current spike is the third repetition of the same shape, and it is already decelerating. If it behaves like the last two, the baseline returns around mid-October. That date is the real deadline on this campaign.',
    events: [
      {
        name: 'Spike one',
        window: '22 Jan to 5 Mar',
        low: '1,104',
        peak: '6,254',
        growth: '+466%',
        outcome: 'Returned to 1,637 within two weeks of peak. Followers moved from 244 to 264.',
      },
      {
        name: 'Spike two',
        window: '19 Mar to 25 Jun',
        low: '3,148',
        peak: '11,089',
        growth: '+506%',
        outcome: 'Decayed over ten weeks to 2,429. Followers moved from 264 to 305.',
      },
      {
        name: 'Spike three',
        window: '23 Jul to now',
        low: '2,219',
        peak: '29,829',
        growth: '+1,244%',
        outcome: 'Still climbing but decelerating. Followers have moved from 319 to 349.',
      },
    ],
    series: [
      { date: '01 Jan', listeners: 1633, followers: 243 },
      { date: '22 Jan', listeners: 1104, followers: 245 },
      { date: '19 Feb', listeners: 6254, followers: 257 },
      { date: '05 Mar', listeners: 1637, followers: 262 },
      { date: '26 Mar', listeners: 5999, followers: 272 },
      { date: '16 Apr', listeners: 11089, followers: 293 },
      { date: '07 May', listeners: 5315, followers: 304 },
      { date: '04 Jun', listeners: 2681, followers: 306 },
      { date: '25 Jun', listeners: 2429, followers: 305 },
      { date: '23 Jul', listeners: 2219, followers: 311 },
      { date: '06 Aug', listeners: 14916, followers: 327 },
      { date: '13 Aug', listeners: 21118, followers: 337 },
      { date: '21 Aug', listeners: 29829, followers: 349 },
    ],
    verdict:
      'Every previous spike was rented. The job of this release is to buy some of it outright.',
  },

  /* ── 03 WHERE THE SPIKE CAME FROM ── */
  source: {
    headline: 'The current audience is borrowed from a K-pop record.',
    body:
      'On 23 July, OK NIKO released a remix of GIRLSET\'s single "CHAT". GIRLSET is a JYP Entertainment act with 2.7 million monthly listeners, 359,919 Spotify followers and 2.4 million TikTok followers. Roughly a quarter of their audience sits in Southeast Asia. Two weeks later, Indonesia appears in OK NIKO\'s Chartmetric geography for the first time. Thailand follows on 14 August. Neither market existed in his data before this month. The spike is not OK NIKO discovery. It is GIRLSET\'s fanbase passing through.',
    girlset: [
      { label: 'GIRLSET monthly listeners', value: '2,705,805' },
      { label: 'GIRLSET TikTok followers', value: '2,406,874' },
      { label: 'Share of GIRLSET audience in Southeast Asia', value: '24%' },
      { label: 'Views on the remix sound in Cobrand', value: '126,730' },
      { label: 'Creator posts using that sound', value: '1' },
      { label: 'Share of the parent track\'s views captured', value: '0.12%' },
    ],
    cobrandNote:
      'Cobrand shows the remix sound at 126,730 views from a single post, still accruing roughly 2,200 views a day. That is one asset riding a large host record, not creator adoption. For comparison, the healthy band in this lane is 1,000 to 3,000 views per create. A number this far above the band means the views are concentrated in one place and nothing is distributing them.',
    precedent:
      'There is a real signal buried in this. GIRLSET\'s "Little Miss" has 13,109 creator posts. The TCTS dance remix of the same song has 22,290. A dance remix of a GIRLSET single outperformed the original on creator adoption. The relationship is worth more than one remix.',
  },

  /* ── 04 GEOGRAPHY ── */
  geography: {
    headline: 'Where he is being heard, and why we are not buying there.',
    markets: [
      { country: 'United States', listeners: 18919, percent: 56.9, since: 'Tracked all year', verdict: 'core' },
      { country: 'Indonesia', listeners: 9580, percent: 28.8, since: 'First appeared 8 Aug', verdict: 'borrowed' },
      { country: 'Thailand', listeners: 1330, percent: 4.0, since: 'First appeared 14 Aug', verdict: 'borrowed' },
      { country: 'Norway', listeners: 1227, percent: 3.7, since: 'Tracked since 12 Jan', verdict: 'core' },
      { country: 'Nigeria', listeners: 683, percent: 2.1, since: 'Stale since April', verdict: 'other' },
      { country: 'Singapore', listeners: 380, percent: 1.1, since: 'First appeared 28 Jul', verdict: 'borrowed' },
      { country: 'Sweden', listeners: 366, percent: 1.1, since: 'Stale since June', verdict: 'other' },
      { country: 'Philippines', listeners: 348, percent: 1.0, since: 'Stale since January', verdict: 'other' },
      { country: 'Finland', listeners: 213, percent: 0.6, since: 'Tracked since 19 Jan', verdict: 'core' },
      { country: 'Brazil', listeners: 205, percent: 0.6, since: 'Stale since July', verdict: 'other' },
    ],
    cities: [
      { city: 'Jakarta', listeners: 423 },
      { city: 'Bandung', listeners: 364 },
      { city: 'Bangkok', listeners: 341 },
      { city: 'Los Angeles', listeners: 307 },
      { city: 'Singapore', listeners: 212 },
      { city: 'New York', listeners: 178 },
      { city: 'Oslo', listeners: 164 },
    ],
    exclusion: {
      title: 'The case against spending in Southeast Asia',
      points: [
        'The audience is two weeks old and arrived attached to somebody else\'s song.',
        'It skews K-pop adjacent rather than dance native, which is a poor match for a 140 BPM club record.',
        'It has already demonstrated its conversion rate. Thirty followers on 27,610 new listeners.',
        'It carries the lowest per-stream rates of any market in his top ten, so even a win pays badly.',
        'Every dollar spent there deepens a geographic profile that will make future campaigns in Europe and Australia more expensive to correct.',
      ],
    },
    norway: {
      title: 'The Norway footnote',
      body:
        'Norway is the one market that has held him all year. It has been in his data since 12 January across 142 separate readings, entirely unprompted. It is small at 1,227 listeners, and at 5.4 million people the addressable pool caps out quickly, which is why it is not the test market. It is worth knowing about, and it is worth a second flight if the first one works.',
    },
  },

  /* ── 05 THE TEST ── */
  test: {
    headline: 'Australia and New Zealand. One ad set. Fourteen days.',
    rationale: [
      {
        title: 'Zero baseline means clean attribution',
        body:
          'OK NIKO has no measurable listenership in either country. Neither appears anywhere in his top ten markets. That is the single most valuable property a test market can have. Anything that moves is attributable to this campaign, with no organic noise to separate it from.',
      },
      {
        title: 'The budget goes almost twice as far',
        body:
          'Meta CPMs run roughly $11.04 to $11.63 in Australia against $20.48 in the United States for music campaigns. On $500 that is about 43,000 impressions instead of 24,000. At this budget the difference between a readable result and a noise floor is exactly that margin.',
      },
      {
        title: 'The market is dance literate and English speaking',
        body:
          'Australia and New Zealand sustain one of the densest festival circuits in the world. Overmono, Nia Archives, Hamdi and Oppidan are all booked into the December and January season, so the sonic context is being pre-heated by other people\'s marketing.',
      },
      {
        title: 'The feature gives us an organic partner there',
        body:
          'RNZŌ is a New Zealand artist whose audience is 55% Australian and 45% New Zealand. He converts far better than OK NIKO does, at 12,294 monthly listeners against 4,154 followers, a 3:1 ratio. He can post to that audience for free while the paid runs underneath it.',
      },
    ],
    honesty:
      'One caveat worth stating plainly. RNZŌ\'s 12,294 monthly listeners is a small base, and $500 across two countries will not isolate how much of any result came from the feature versus the market. The Australia case stands on cost efficiency, clean attribution and audience fit. Treat RNZŌ as a free organic multiplier, not as the reason for the buy.',
    spec: [
      { field: 'Platform', value: 'Meta (Instagram and Facebook)' },
      { field: 'Objective', value: 'Traffic' },
      { field: 'Optimisation event', value: 'Landing Page Views' },
      { field: 'Geography', value: 'Australia and New Zealand, combined in one ad set' },
      { field: 'Budget', value: '$35 per day' },
      { field: 'Flight length', value: '14 days, 21 Aug to 3 Sep' },
      { field: 'Total spend', value: '$490 of $500, $10 held back' },
      { field: 'Age range', value: '18 to 34' },
      { field: 'Audience', value: 'Broad, no interest stacking' },
      { field: 'Placements', value: 'Advantage+ (Reels, Stories, Feed)' },
      { field: 'Creative count', value: '3, rotating in a single ad set' },
      { field: 'Destination', value: 'Smart link with Meta Pixel and Conversions API' },
    ],
    decisions: [
      {
        title: 'Why Landing Page Views and not Link Clicks',
        body:
          'Link Clicks counts taps that bounce before the page loads, including accidental taps. Landing Page Views counts only completed loads. It costs marginally more per unit and delivers materially better traffic. This requires the Pixel on the smart link before launch, which is a hard prerequisite, not a nice-to-have.',
      },
      {
        title: 'Why not a conversion objective',
        body:
          'Optimising to a save or pre-save event is the theoretically correct setup, and at a larger budget it is what we would run. Meta needs roughly fifty events a week to exit the learning phase on a conversion objective. $500 will not deliver that, and a conversion campaign stuck in learning performs worse than a well-fed Landing Page View campaign. We will still fire and read the conversion event. We just will not ask the algorithm to optimise against it yet.',
      },
      {
        title: 'Why one ad set and not two',
        body:
          'Splitting Australia and New Zealand would put each at roughly $17 a day, close to the stability floor for the learning phase. Two starved ad sets produce two unreadable results. One properly fed ad set produces one result we can act on. Geography can be read afterwards in the delivery breakdown at no cost.',
      },
      {
        title: 'Why not video views',
        body:
          'Video view campaigns buy the cheapest available attention and tell you very little about intent. Reach has never been this artist\'s constraint. He has manufactured three listener spikes in eight months without spending anything. Buying more of the thing that already is not converting would be an expensive way to prove a point we already have data on.',
      },
    ],
    creatives: [
      {
        name: 'The Drop',
        hook: 'Cold open on the 140 BPM finish',
        detail:
          'No intro, no logo, no artist name in the first frame. Open on the euphoric break and let it run. On-screen text reads "I want more" on the vocal hook. Vertical 9:16, shot or cut to feel native rather than advertised.',
        why: 'The track\'s strongest asset is the last thirty seconds. Leading with the payoff rather than building to it is standard practice for paid dance creative, where you have roughly two seconds before the scroll.',
      },
      {
        name: 'The Feature',
        hook: 'RNZŌ vocal and face forward',
        detail:
          'Lead on RNZŌ performing the vocal, with his name legible within the first two seconds. Cut to the drop at the halfway point.',
        why: 'RNZŌ is the only element of this record with existing recognition in the test market. In a country where OK NIKO has no baseline, the feature is the familiar object.',
      },
      {
        name: 'The Origin',
        hook: 'Ivalo to Los Angeles',
        detail:
          'The producer-turned-artist story told visually. Northern Finland, then the studio, then the record. Slower cut rhythm than the other two, resolving into the drop.',
        why: 'A control against the two performance-led cuts. If the story cut outperforms, the artist narrative is a durable asset worth building the next release around. If it underperforms, we stop spending creative time on it.',
      },
    ],
  },

  /* ── 06 READ-OUT ── */
  readout: {
    headline: 'What we look at, and when.',
    gates: [
      {
        day: 'Days 0 to 3',
        action: 'Change nothing',
        detail:
          'The ad set is in the learning phase. Editing budget, audience or creative resets it and burns the spend that has already been used to train delivery. The most common way a $500 test is wasted is by being optimised on day two.',
      },
      {
        day: 'Day 4',
        action: 'First creative read',
        detail:
          'Pause any creative below 0.8% click-through. Leave budget and targeting untouched. Three creatives down to two is a normal and healthy outcome here.',
      },
      {
        day: 'Day 7',
        action: 'Mid-flight check',
        detail:
          'Compare cost per click against the $0.50 benchmark. If it is running above $0.70, add a single interest layer or refresh the weakest creative. If it is under $0.30, consider pulling the $10 reserve forward.',
      },
      {
        day: 'Day 14',
        action: 'Decision',
        detail:
          'Read the full result against the thresholds below, pull the geographic and placement breakdowns, and decide whether market two is Norway, the United Kingdom or a second Australian flight.',
      },
    ],
    thresholds: [
      { metric: 'Click-through rate', floor: '1.0%', working: '1.5%', strong: '2.5%+' },
      { metric: 'Cost per click', floor: '$0.70', working: '$0.50', strong: 'Under $0.30' },
      { metric: 'Cost per DSP click', floor: '$0.60', working: '$0.40', strong: 'Under $0.20' },
      { metric: 'Spotify follower gain', floor: '+40', working: '+100', strong: '+150' },
    ],
    modelled: {
      title: 'The number that actually matters',
      body:
        'At a $0.40 cost per DSP click, $490 buys roughly 1,225 clicks through to Spotify. If 10 to 15% of those convert to a follow, this campaign adds 120 to 185 followers. Against a base of 349, that is a 35 to 53% increase in the entire audience OK NIKO owns, for $500, in fourteen days. That is the outcome to hold this test to. Not streams, which he can already generate, but followers, which he never has.',
      caveat:
        'Stated honestly: neither Feature.fm nor Linkfire publish a click-to-follow conversion benchmark, and we could not source one. The click volume above is modelled from published cost-per-DSP-click benchmarks. The follow rate is an assumption we are testing, not a figure we are promising. This flight is how we find out what the real number is, and after it we will never have to guess again.',
    },
  },

  /* ── 07 BEYOND THE TEST ── */
  next: {
    headline: 'What the $500 sets up.',
    summary:
      'A first flight is only worth running if the second one is cheaper because of it. Three assets come out of this fortnight that OK NIKO does not currently have: a working Pixel and Conversions API on the smart link, a creative ranking based on his own audience rather than assumption, and an engagement custom audience large enough to seed a lookalike. None of those exist today.',
    moves: [
      {
        window: 'During the flight',
        title: 'Fix the conversion surface',
        detail:
          'Install the Pixel and Conversions API on the smart link before a single dollar runs. Set Spotify as the default destination and make sure the follow action is reachable in one tap. This is the cheapest work in the entire plan and nothing downstream functions without it.',
      },
      {
        window: 'During the flight',
        title: 'Run RNZŌ organically underneath the paid',
        detail:
          'RNZŌ\'s strongest sound carries 791 creator posts and 1.9 million views, and his audience engages at 8 to 27%, well above the 4 to 6% dance norm. He should be posting to it in the same two weeks the paid is live, at no cost, in the same market.',
      },
      {
        window: 'Weeks 3 to 6',
        title: 'Go back to GIRLSET',
        detail:
          'A dance remix of a GIRLSET single has already outperformed the original on creator adoption, 22,290 posts against 13,109. One remix produced the biggest month of OK NIKO\'s career. The relationship is the highest-leverage asset he has and it has been used once.',
      },
      {
        window: 'Weeks 4 to 12',
        title: 'Open the Australian radio and DJ route',
        detail:
          'The ARIA Club Chart is compiled from weekly DJ reports rather than streams, so servicing DJs is the lever there, not paid traffic. In New Zealand, George FM runs roughly 75 presenters who each choose their own music with no central rotation gate, which makes it unusually reachable for an independent record.',
      },
      {
        window: 'Dec 2026 to Jan 2027',
        title: 'Hottest 100 eligibility',
        detail:
          'An August 2026 release is eligible for triple j\'s Hottest 100 of 2026, voted in December and January. It costs nothing to campaign for and it lands in the same window as peak Australian summer listening.',
      },
    ],
    constraints: {
      title: 'Two things that are not available, stated up front',
      points: [
        'triple j Unearthed is restricted to Australian artists, and the Warehouse dance programme is sourced entirely from Unearthed. That door is closed to a Finnish artist based in Los Angeles. It opens with an Australian collaborator or remixer on a follow-up, and Club Angel, Bella Claxton and Strict Face are all in-lane, all Australian and all already in rotation there.',
        'Every major Australian and New Zealand summer festival lineup for this season was announced in July and August and is already public. An August release cannot buy a slot this summer. What it buys is four months of build into the peak consumption window and credibility for the 2027 and 2028 booking conversations.',
      ],
    },
  },

  /* ── 08 COMPETITIVE ── */
  competitive: {
    headline: 'The release window, read honestly.',
    items: [
      { artist: 'MPH x Skrillex', release: '"Mirage", 14 Aug, DisOrder / Capitol', threat: 'High', note: 'Owns the UK Garage conversation and the dance editorial slots this fortnight, with a major behind it and a tour announce following.' },
      { artist: 'Overmono', release: 'Pure Devotion LP, 7 Aug', threat: 'Medium', note: 'Album cycle absorbing attention in the euphoric club lane. Also touring Australia this summer.' },
      { artist: 'Ninajirachi x Porter Robinson', release: '"WannaCry", 28 Jul', threat: 'Medium', note: 'Australian producer with a US legacy feature, still active in exactly our test market.' },
      { artist: '21 August slate', release: 'Jorja Smith, Brandon Flowers, Sam Smith, Jamie T, Fontaines D.C.', threat: 'Low', note: 'Crowded with pop, indie and rap. Very light on 140 BPM club records.' },
    ],
    verdictTitle: 'Position on the euphoric side, not the garage side',
    verdict:
      'The competitive pressure on this release is not the 21 August slate, which is almost empty of club records. It is that MPH and Skrillex own the UK Garage conversation one week ahead with major-label weight behind them. Any positioning that frames "More" as the UK Garage record of late August loses that argument on contact. The air is thinner and the fit is better on the melodic and euphoric end, closer to Barry Can\'t Swim and Four Tet than to a garage record, and that is where the copy and the pitch should sit.',
  },

  /* ── 09 RISKS ── */
  risks: [
    {
      title: 'The spike decays before the flight ends',
      likelihood: 'High',
      impact: 'Medium',
      triggerSignal: 'Daily listener gain drops below +200, or monthly listeners fall two days running.',
      contingency:
        'This is expected rather than feared. It is why the flight is fourteen days and not thirty. The paid traffic is not dependent on the spike, and the follower gain it produces is retained after the spike ends. If decay starts early, pull the $10 reserve forward and front-load the remaining days.',
    },
    {
      title: 'The Pixel is not live at launch',
      likelihood: 'Medium',
      impact: 'High',
      triggerSignal: 'Landing Page View is unavailable as an optimisation event when the ad set is built.',
      contingency:
        'Do not launch on Link Clicks as a workaround. Delay by 24 to 48 hours and install the Pixel and Conversions API. Launching without it forfeits the optimisation event, the conversion read and the retargeting audience, which is most of the value of the test.',
    },
    {
      title: 'Costs run high because the account has no history',
      likelihood: 'Medium',
      impact: 'Medium',
      triggerSignal: 'CPM above $15 or CPC above $0.70 at the day 7 check.',
      contingency:
        'Add a single interest layer drawn from verified in-lane acts touring the market, being Sammy Virji, Overmono, Fred again.., KETTAMA and Nia Archives. Add one layer only. Stacking interests at this budget fragments delivery further.',
    },
    {
      title: 'The result is genuinely inconclusive',
      likelihood: 'Medium',
      impact: 'Low',
      triggerSignal: 'Metrics land between the floor and working thresholds with no clear creative winner.',
      contingency:
        'A $500 test that returns an ambiguous answer has still bought the Pixel, the creative ranking and the seed audience. Treat it as infrastructure spend and run flight two in Norway, where there is an eight-month organic baseline to measure against instead of a cold start.',
    },
  ],
};

export type OkNikoMore = typeof okNikoMore;
