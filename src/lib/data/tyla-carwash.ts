import { CampaignData } from '../types/campaign';

export const tylaCarwashCampaign: CampaignData = {
  artist: 'TYLA',
  song: 'Carwash',
  releaseDate: 'May 29, 2026',
  genre: 'Pop',
  label: 'FAX Records / Epic',
  country: 'South Africa',
  tier: 'Established',
  campaignWindow: {
    start: 'May 1, 2026',
    end: 'June 19, 2026',
  },
  chartmetrics: {
    spotifyMonthlyListeners: 33.03,
    spotifyFollowers: 4.67,
    playlistReach: 321.37,
    editorialPlaylists: 315,
    fanConversionRate: 14.23,
    popularityScore: 79,
    rank: {
      global: 158,
      country: 1,
      genre: 111,
    },
    totalFanbase: 40.3,
  },
  social: [
    {
      platform: 'TikTok',
      followers: 16.2,
      monthlyGrowth: 95,
      growthPercent: 0.59,
      color: '#00f2ea',
    },
    {
      platform: 'Instagram',
      followers: 13.64,
      monthlyGrowth: 135,
      growthPercent: 1.0,
      color: '#E1306C',
    },
    {
      platform: 'YouTube',
      followers: 5.76,
      monthlyGrowth: 52,
      growthPercent: 0.91,
      color: '#FF0000',
    },
    {
      platform: 'Spotify',
      followers: 4.67,
      monthlyGrowth: 168,
      growthPercent: 3.73,
      color: '#1DB954',
    },
  ],
  markets: [
    { country: 'US', percent: 20.5 },
    { country: 'South Africa', percent: 10.2 },
  ],
  demographics: {
    femalePercent: 51.2,
    malePercent: 48.8,
    primaryAge: '25-34',
    primaryAgePercent: 44.5,
    ethnicity: [
      { label: 'Black/African American', percent: 74.55 },
      { label: 'White/Caucasian', percent: 21.46 },
    ],
    languages: [
      { label: 'English', percent: 85.47 },
      { label: 'French', percent: 4.26 },
      { label: 'Portuguese', percent: 3.4 },
    ],
  },
  thesis:
    "Turn the unannounced 'Carwash' into Tyla's summer anthem moment by leveraging the element of surprise, a signature dance challenge, and creator-first rollout that builds from whisper to wave — all within a tight, high-impact 4-week pre-release window.",
  weeklyPlaybook: [
    {
      week: 'Week -4',
      title: 'The Whisper',
      objective: 'Plant cryptic seeds without revealing the song',
      actions: [
        'Post a 5-second Instagram Story of running water with no context',
        'Share a behind-the-scenes studio photo with water emoji caption only',
        'TikTok: post a "getting ready" GRWM with an unidentifiable snippet playing in background',
      ],
      successSignals: ["Fan speculation begins, 'what's coming' comments"],
    },
    {
      week: 'Week -3',
      title: 'The Tease',
      objective: 'Confirm something is coming, build anticipation',
      actions: [
        'Drop a 15-second TikTok of Tyla doing a new move in a parking lot with sudsy water, do not name the song',
        'Instagram carousel of aesthetic car wash imagery (retro, stylized, no text)',
        'X/Twitter: cryptic car and water emoji tweet',
      ],
      creatorActions: ['Seed 5 macro creators with mysterious audio clip under NDA'],
      successSignals: ['Carwash speculation, 500K+ combined views on teasers'],
    },
    {
      week: 'Week -2',
      title: 'The Reveal',
      objective: 'Officially announce, activate pre-saves, drop the choreography teaser',
      actions: [
        'Instagram Reel: official announcement with cover art reveal and pre-save link',
        'TikTok: 30-second choreography teaser, the CHALLENGE launch that people will recreate',
        'YouTube: behind-the-scenes of the music video shoot (2-3 min)',
        'X: pin announcement tweet with pre-save',
      ],
      creatorActions: [
        '10 mid-tier creators get early access to the sound and choreography tutorial',
        '3 mega creators post first listen reaction content',
      ],
      successSignals: ['50K+ pre-saves in first 48 hours, challenge attempts begin appearing'],
    },
    {
      week: 'Week -1',
      title: 'The Wave',
      objective: 'Maximum hype, challenge goes viral, launch week energy',
      actions: [
        'TikTok: post 3 variations of the challenge (solo, with friends, different locations)',
        'Instagram: daily Stories countdown with fan repost highlights',
        'YouTube: music video teaser (30 sec)',
        'IG Live: casual Q and A about the song and A-Pop album tease',
      ],
      creatorActions: [
        'Release sound to all creators, challenge hits peak velocity',
        'Fan-curated creator content shared on Tylas channels',
      ],
      successSignals: ['100K+ challenge creates, trending on TikTok, pre-saves exceed 200K'],
    },
    {
      week: 'Week 0',
      title: 'LAUNCH',
      objective: 'Maximum first-72-hour impact',
      actions: [
        'Midnight release with simultaneous music video drop on YouTube',
        'TikTok: post the official challenge version at 9am EST',
        'Instagram: carousel celebrating the release and fan reaction highlights',
        'X: real-time engagement with fans and chart updates',
      ],
      successSignals: ['15M+ first-week streams, top 10 Spotify daily chart, 500K+ challenge creates'],
    },
    {
      week: 'Week +1',
      title: 'The Remix',
      objective: 'Sustain momentum, expand reach',
      actions: [
        'TikTok: Carwash content in different contexts (beach, pool, summer vibes)',
        'Behind-the-scenes music video content',
        'Creator appreciation posts highlighting best fan content',
        'Potential acoustic remix snippet to refresh the cycle',
      ],
      successSignals: ['Streaming holds 80%+ of week 1, continued creator activity'],
    },
    {
      week: 'Week +2-3',
      title: 'The Summer',
      objective: 'Position as summer anthem, bridge to A-Pop album',
      actions: [
        'IRL activation (pop-up car wash in LA/NYC with Tyla branding)',
        'Tie into tour dates',
        'A-Pop album breadcrumbs',
        'Continue sharing best fan/creator content',
      ],
      successSignals: ['Song enters sustained playlist rotation, cultural conversation status'],
    },
  ],
  phases: [
    {
      name: 'Pre-Seed',
      dateRange: 'May 1-8',
      objectives: ['Plant cryptic teasers', 'Build mystery and curiosity'],
    },
    {
      name: 'Build',
      dateRange: 'May 9-21',
      objectives: ['Confirm release', 'Activate pre-saves', 'Launch choreography challenge'],
    },
    {
      name: 'Launch',
      dateRange: 'May 22 - Jun 1',
      objectives: ['Release song', 'Peak social engagement', 'Maximize first-week impact'],
    },
    {
      name: 'Sustain',
      dateRange: 'Jun 2-19',
      objectives: ['Maintain momentum', 'Expand reach', 'Position as summer anthem'],
    },
  ],
  contentStrategy: [
    {
      pillar: 'The Challenge',
      platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
      description: 'Dance/choreography variations, solo, with friends, different locations',
    },
    {
      pillar: 'The Aesthetic',
      platforms: ['Instagram', 'TikTok', 'Pinterest'],
      description: 'Car wash visual world, retro styling, summer aesthetics',
    },
    {
      pillar: 'The Journey',
      platforms: ['YouTube', 'Instagram Stories', 'TikTok'],
      description: 'Behind-the-scenes, music video shoot, personal moments',
    },
  ],
  risks: [
    {
      title: "Challenge Doesn't Gain Traction",
      likelihood: 'Medium',
      impact: 'High',
      triggerSignal: 'Under 50K creates by end of week -1',
      contingency:
        'Pivot to reaction-content seeding; leverage mega creators for official choreography variations; consider simplified alternate choreography',
    },
    {
      title: 'Competitive Song Drops Same Day',
      likelihood: 'Low',
      impact: 'High',
      triggerSignal: 'Industry news of unexpected May 29 release from major artist',
      contingency:
        'Shift launch to May 28 (midnight) if possible; amplify Tyla storytelling to differentiate; increase paid amplification if budget allows',
    },
    {
      title: "Streaming Platform Algorithm Doesn't Favor Release",
      likelihood: 'Medium',
      impact: 'Medium',
      triggerSignal: 'First-week streams under 10M or poor chart entry',
      contingency:
        'Activate existing audience for replay; creator re-engagement pushes; consider one-off remix or feature collaboration to refresh',
    },
  ],
};

export default tylaCarwashCampaign;
