import type { Metadata } from 'next';
import { EkatorCommandCenter } from '@/components/campaign/EkatorCommandCenter';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'EKATOR Command Center | Crowd Control',
  description: 'Bespoke live campaign dashboard for EKATOR\'s pre-debut documentary-led awareness campaign.',
  openGraph: {
    title: 'EKATOR Command Center | Crowd Control',
    description: 'Live command dashboard for EKATOR\'s pre-debut awareness campaign.',
    images: ['/images/ekator/hero.png'],
  },
};

export default function EkatorPage() {
  return <EkatorCommandCenter />;
}
