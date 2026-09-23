import type { Metadata } from 'next';
import { LoekResearch } from '@/components/loek/LoekResearch';
import { loekMono } from '../fonts';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Loek — The One · The research | Crowd Control Digital',
  description: 'The research behind the campaign plan for Loek’s “The One”: audio teardown, Chartmetric, markets and video intelligence.',
  openGraph: {
    title: 'Loek — The One · The research | Crowd Control Digital',
    description: 'Confidential campaign research.',
    images: ['/images/loek-the-one/og.jpg'],
  },
};

export default function LoekResearchPage() {
  return (
    <div className={loekMono.variable}>
      <LoekResearch />
    </div>
  );
}
