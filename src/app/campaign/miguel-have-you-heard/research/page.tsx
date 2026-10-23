import type { Metadata } from 'next';
import { HyhResearch } from '@/components/miguel-hyh/HyhResearch';
import { hyhMono } from '../fonts';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Miguel, Have You Heard: The Research | Crowd Control Digital',
  description: 'Research behind the rollout plan for Miguel’s “Have You Heard”.',
  openGraph: {
    title: 'Miguel, Have You Heard: Research | Crowd Control Digital',
    description: 'Confidential research.',
    images: ['/images/miguel-have-you-heard/og.jpg'],
  },
};

export default function HyhResearchPage() {
  return (
    <div className={hyhMono.variable}>
      <HyhResearch />
    </div>
  );
}
