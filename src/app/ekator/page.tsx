import type { Metadata } from 'next';
import { EkatorCommandCenter } from '@/components/campaign/EkatorCommandCenter';

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

export default function EkatorPage() {
  return <EkatorCommandCenter />;
}
