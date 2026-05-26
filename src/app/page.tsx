import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crowd Control Digital · Campaign Planner',
  description: 'Crowd Control Digital · campaign.crowdcontroldigital.com',
  robots: { index: false, follow: false },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-xl">
        <span className="text-[11px] tracking-[0.35em] uppercase text-[#fd3737] font-semibold">Crowd Control Digital</span>
        <h1 className="font-display text-5xl md:text-7xl mt-4">CAMPAIGN PLANNER</h1>
        <p className="text-[#B8B8C0] text-sm md:text-base mt-6 leading-relaxed">
          Client campaign plans live at private URLs and are accessible by direct link only.
          <br />
          If you were sent a link, follow the URL exactly.
        </p>
        <p className="text-[#71717A] text-xs mt-10">info@crowdcontroldigital.com</p>
      </div>
    </div>
  );
}
