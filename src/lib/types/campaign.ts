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

export interface CampaignData {
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
}
