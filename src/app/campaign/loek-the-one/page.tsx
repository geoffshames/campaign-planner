import type { Metadata } from 'next';
import { LoekPlan } from '@/components/loek/LoekPlan';
import { loekMono } from './fonts';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Loek — The One (for a minute) · The plan | Crowd Control Digital',
  description: 'Confidential campaign plan for Loek’s “The One”, the ADE focus track for Island Berlin / Universal Music Germany.',
  openGraph: {
    title: 'Loek — The One (for a minute) | Crowd Control Digital',
    description: 'Confidential campaign plan.',
    images: ['/images/loek-the-one/og.jpg'],
  },
};

export default function LoekPlanPage() {
  return (
    <div className={loekMono.variable}>
      <LoekPlan />
    </div>
  );
}
