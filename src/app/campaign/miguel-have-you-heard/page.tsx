import type { Metadata } from 'next';
import { HyhPlan } from '@/components/miguel-hyh/HyhPlan';
import { hyhMono } from './fonts';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Miguel, Have You Heard: The Plan | Crowd Control Digital',
  description: 'Confidential single rollout plan for Miguel’s “Have You Heard”.',
  openGraph: {
    title: 'Miguel, Have You Heard | Crowd Control Digital',
    description: 'Confidential single rollout plan.',
    images: ['/images/miguel-have-you-heard/og.jpg'],
  },
};

export default function HyhPlanPage() {
  return (
    <div className={hyhMono.variable}>
      <HyhPlan />
    </div>
  );
}
