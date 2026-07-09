import type { Metadata } from 'next';
import { EkatorCommandCenter } from '@/components/campaign/EkatorCommandCenter';
import { getEkatorFullSnapshot } from '@/lib/ekator-dashboard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'EKATOR Social Dashboard | Crowd Control',
  description: 'Owned-channel social analytics and action dashboard for EKATOR / Idol Till I Die.',
  openGraph: {
    title: 'EKATOR Social Dashboard | Crowd Control',
    description: 'Living owned-social analytics dashboard for EKATOR / Idol Till I Die.',
    images: ['/images/ekator/hero.png'],
  },
};

export default async function CampaignEkatorPage() {
  const { registry, assets } = await getEkatorFullSnapshot();
  return <EkatorCommandCenter registry={registry} assets={assets} />;
}
