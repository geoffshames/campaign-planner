import { tylaCarwashCampaign } from '@/lib/data/tyla-carwash';
import { CampaignPage as CampaignPageComponent } from '@/components/campaign/CampaignPage';
import { BadTunerForeverLove } from '@/components/campaign/BadTunerForeverLove';
import { TemporexWantingIsHaunting } from '@/components/campaign/TemporexWantingIsHaunting';
import { MiguelDamned } from '@/components/campaign/MiguelDamned';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return [
    { slug: 'tyla-carwash' },
    { slug: 'bad-tuner-forever-love' },
    { slug: 'temporex-wanting-is-haunting' },
    { slug: 'temporex-fantastic-machine' },
    { slug: 'miguel-damned' },
  ];
}

const noIndex = { robots: { index: false, follow: false } } as const;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  if (params.slug === 'temporex-wanting-is-haunting' || params.slug === 'temporex-fantastic-machine') {
    return {
      ...noIndex,
      title: 'temporex — Fantastic Machine | Campaign Planner',
      description: 'Album rollout strategy for temporex (Fantastic Machine, Nov 2026), backing into four singles. Lore-driven content system for the 1.4M-streaming dream-pop artist.',
      openGraph: {
        title: 'temporex — Fantastic Machine | Crowd Control Digital',
        description: 'Album rollout strategy for temporex.',
        images: ['/images/temporex-fantastic-machine/og.png'],
      },
    };
  }
  if (params.slug === 'miguel-damned') {
    return {
      ...noIndex,
      title: 'Miguel — damned | Campaign Planner',
      description: '30-day catalog sprint for Miguel\u2019s damned: re-ignite the TikTok wave, convert 172M views into streams, open the LATAM front. Chartmetric + Cobrand grounded.',
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
  if (params.slug === 'temporex-wanting-is-haunting' || params.slug === 'temporex-fantastic-machine') {
    return <TemporexWantingIsHaunting />;
  }
  if (params.slug === 'miguel-damned') {
    return <MiguelDamned />;
  }
  if (params.slug === 'bad-tuner-forever-love') {
    return <BadTunerForeverLove />;
  }
  if (params.slug === 'tyla-carwash') {
    return <CampaignPageComponent campaign={tylaCarwashCampaign} />;
  }
  return <div className="text-white text-center p-8">Campaign not found</div>;
}
