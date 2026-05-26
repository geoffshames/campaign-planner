import { tylaCarwashCampaign } from '@/lib/data/tyla-carwash';
import { badTuner } from '@/lib/data/bad-tuner-forever-love';
import { CampaignPage as CampaignPageComponent } from '@/components/campaign/CampaignPage';
import { BadTunerForeverLove } from '@/components/campaign/BadTunerForeverLove';
import { TemporexWantingIsHaunting } from '@/components/campaign/TemporexWantingIsHaunting';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return [{ slug: 'tyla-carwash' }, { slug: 'bad-tuner-forever-love' }, { slug: 'temporex-wanting-is-haunting' }];
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  if (params.slug === 'bad-tuner-forever-love') {
    return {
      title: 'bad tuner — forever love | Campaign Planner',
      description: 'Content strategy + EP rollout playbook for bad tuner, grounded in TwelveLabs video analysis and comp teardowns of Barry Cant Swim, Fred Again and Joy Anonymous.',
      robots: { index: false, follow: false },
      openGraph: {
        title: 'bad tuner — forever love | Crowd Control Digital',
        description: 'Content strategy + EP rollout playbook for bad tuner.',
        images: ['/images/bad-tuner-forever-love/og.png'],
      },
    };
  }
  return {
    title: `${tylaCarwashCampaign.artist} - ${tylaCarwashCampaign.song} | Campaign Planner`,
    description: `Campaign plan for ${tylaCarwashCampaign.artist}'s ${tylaCarwashCampaign.song}`,
    robots: { index: false, follow: false },
  };
}

export default function CampaignPageServer({ params }: { params: { slug: string } }) {
  if (params.slug === 'temporex-wanting-is-haunting') {
    return <TemporexWantingIsHaunting />;
  }
  if (params.slug === 'bad-tuner-forever-love') {
    return <BadTunerForeverLove />;
  }
  if (params.slug === 'tyla-carwash') {
    return <CampaignPageComponent campaign={tylaCarwashCampaign} />;
  }
  return <div className="text-white text-center p-8">Campaign not found</div>;
}
