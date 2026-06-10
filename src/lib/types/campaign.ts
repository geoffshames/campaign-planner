export interface ChartmetricData {
  spotifyMonthlyListeners: number;
  spotifyFollowers: number;
  playlistReach: number;
  editorialPlaylists: number;
  fanConversionRate: number;
  popularityScore: number;
  rank: {
    global: number;
    country: number;
    genre: number;
  };
  totalFanbase: number;
}

export interface SocialMetrics {
  platform: string;
  followers: number;
  monthlyGrowth: number;
  growthPercent: number;
  color: string;
}

export interface DemographicData {
  femalePercent: number;
  malePercent: number;
  primaryAge: string;
  primaryAgePercent: number;
  ethnicity: {
    label: string;
    percent: number;
  }[];
  languages: {
    label: string;
    percent: number;
  }[];
}

export interface WeeklyObjective {
  week: string;
  title: string;
  objective: string;
  actions: string[];
  creatorActions?: string[];
  successSignals: string[];
}

export interface CampaignPhase {
  name: string;
  dateRange: string;
  objectives: string[];
}

export interface RiskCard {
  title: string;
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  triggerSignal: string;
  contingency: string;
}

export interface CompetitiveCalendar {
  subtitle: string;
  items: { artist: string; release: string; threat: 'Low' | 'Medium' | 'High' }[];
  verdictTitle: string;
  verdict: string;
}

export interface GenreLandscape {
  subtitle: string;
  summary: string;
  tactics: { title: string; desc: string }[];
  trends: string[];
}

export interface TopPost {
  platform: string;
  title: string;
  date: string;
  views: string;
  likes: string;
  engagementRate: string;
  format: string;
  insight: string;
}

export interface TopPostsAnalysis {
  subtitle: string;
  posts: TopPost[];
  patterns: { title: string; desc: string }[];
}

export interface NinetyDayPhase {
  window: string;
  title: string;
  focus: string;
  moves: string[];
  target: string;
}

export interface NinetyDayPlan {
  subtitle: string;
  summary: string;
  phases: NinetyDayPhase[];
}

export interface SuccessMetricGroup {
  phase: string;
  color: string;
  metrics: string[];
}

export interface CampaignData {
  slug: string;
  artist: string;
  song: string;
  releaseDate: string;
  genre: string;
  label: string;
  country: string;
  tier: string;
  campaignWindow: {
    start: string;
    end: string;
  };
  chartmetrics: ChartmetricData;
  social: SocialMetrics[];
  markets: {
    country: string;
    percent: number;
  }[];
  demographics: DemographicData;
  thesis: string;
  weeklyPlaybook: WeeklyObjective[];
  phases: CampaignPhase[];
  contentStrategy: {
    pillar: string;
    platforms: string[];
    description: string;
  }[];
  risks: RiskCard[];
  competitiveCalendar?: CompetitiveCalendar;
  genreLandscape?: GenreLandscape;
  topPosts?: TopPostsAnalysis;
  ninetyDay?: NinetyDayPlan;
  successMetrics?: SuccessMetricGroup[];
}
