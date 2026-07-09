import { tylaCarwashCampaign } from '@/lib/data/tyla-carwash';
import { kodokuHeLives } from '@/lib/data/kodoku-he-lives';
import { CampaignPage as CampaignPageComponent } from '@/components/campaign/CampaignPage';
import { BadTunerForeverLove } from '@/components/campaign/BadTunerForeverLove';
import { TemporexWantingIsHaunting } from '@/components/campaign/TemporexWantingIsHaunting';
import { MiguelDamned } from '@/components/campaign/MiguelDamned';
import { EkatorCommandCenter } from '@/components/campaign/EkatorCommandCenter';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return [
    { slug: 'tyla-carwash' },
    { slug: 'bad-tuner-forever-love' },
    { slug: 'temporex-wanting-is-haunting' },
    { slug: 'temporex-fantastic-machine' },
    { slug: 'miguel-damned' },
    { slug: 'kodoku-he-lives' },
    { slug: 'ekator' },
  ];
}

const noIndex = { robots: { index: false, follow: false } } as const;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  if (params.slug === 'ekator') {
    return {
      ...noIndex,
      title: 'EKATOR Social Dashboard | Crowd Control',
      description: 'Owned-channel social analytics and action dashboard for EKATOR / Idol Till I Die.',
      openGraph: {
        title: 'EKATOR Social Dashboard | Crowd Control',
        description: 'Living owned-social analytics dashboard for EKATOR / Idol Till I Die.',
        images: ['/images/ekator/hero.png'],
      },
    };
  }
  if (params.slug === 'temporex-wanting-is-haunting' || params.slug === 'temporex-fantastic-machine') {
    return {
      ...noIndex,
      title: 'temporex — Fantastic Machine | Campaign Planner',
      description: 'Album rollout strategy for temporex (Fantastic Machine), backing into four singles. Lore-driven content system for the 1.4M-streaming dream-pop artist.',
      openGraph: {
        title: 'temporex — Fantastic Machine | Crowd Control Digital',
        description: 'Album rollout strategy for temporex.',
        images: ['/images/temporex-fantastic-machine/og.png'],
      },
    };
  }
  if (params.slug === 'kodoku-he-lives') {
    return {
      ...noIndex,
      title: 'KODOKU — He Lives | Campaign Planner',
      description: 'Album campaign playbook for KODOKU’s He Lives (Aug 2026): riding the Christian R&B wave, RSVP YOUR CITY worship nights, and the pivot story from 65M secular streams to the faith lane.',
      openGraph: {
        title: 'KODOKU — He Lives | Crowd Control Digital',
        description: 'Album campaign playbook for He Lives.',
        images: ['/images/kodoku-he-lives/hero.png'],
      },
    };
  }
  if (params.slug === 'miguel-damned') {
    return {
      ...noIndex,
      title: 'Miguel — damned | Campaign Planner',
      description: '30-day catalog sprint for Miguel’s damned: re-ignite the TikTok wave, convert 172M views into streams, open the LATAM front. Chartmetric + Cobrand grounded.',
      openGraph: {
        title: 'Miguel — damned | Crowd Control Digital',
        description: '30-day sprint playbook for the damned viral moment.',
        images: ['/images/miguel-damned/hero.png'],
      },
    };
  }
  if (params.slug === 'bad-tuner-forever-love') {
    return {
      ...noIndex,
      title: 'bad tuner — forever love | Campaign Planner',
      description: 'Content strategy + EP rollout playbook for bad tuner, grounded in TwelveLabs video analysis and comp teardowns of Barry Cant Swim, Fred Again and Joy Anonymous.',
      openGraph: {
        title: 'bad tuner — forever love | Crowd Control Digital',
        description: 'Content strategy + EP rollout playbook for bad tuner.',
        images: ['/images/bad-tuner-forever-love/og.png'],
      },
    };
  }
  return {
    ...noIndex,
    title: `${tylaCarwashCampaign.artist} - ${tylaCarwashCampaign.song} | Campaign Planner`,
    description: `Campaign plan for ${tylaCarwashCampaign.artist}'s ${tylaCarwashCampaign.song}`,
  };
}

export default function CampaignPageServer({ params }: { params: { slug: string } }) {
  if (params.slug === 'ekator') {
    return <EkatorCommandCenter />;
  }
  if (params.slug === 'temporex-wanting-is-haunting' || params.slug === 'temporex-fantastic-machine') {
    return <TemporexWantingIsHaunting />;
  }
  if (params.slug === 'miguel-damned') {
    return <MiguelDamned />;
  }
  if (params.slug === 'bad-tuner-forever-love') {
    return <BadTunerForeverLove />;
  }
  if (params.slug === 'kodoku-he-lives') {
    return <CampaignPageComponent campaign={kodokuHeLives} />;
  }
  if (params.slug === 'tyla-carwash') {
    return <CampaignPageComponent campaign={tylaCarwashCampaign} />;
  }
  return <div className="text-white text-center p-8">Campaign not found</div>;
}
