import Link from 'next/link';

const campaigns = [
  { slug: 'bad-tuner-forever-love', artist: 'bad tuner', song: 'forever love', genre: 'House / UK Garage', tag: 'Content strategy + EP rollout' },
  { slug: 'tyla-carwash', artist: 'TYLA', song: 'Carwash', genre: 'Pop', tag: 'Pre-release campaign' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <span className="text-[11px] tracking-[0.35em] uppercase text-[#fd3737] font-semibold">Crowd Control Digital</span>
          <h1 className="font-display text-5xl md:text-7xl mt-3">CAMPAIGN PLANNER</h1>
          <p className="text-[#B8B8C0] text-lg mt-4">Data-driven campaign playbooks for music releases.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {campaigns.map((c) => (
            <Link key={c.slug} href={`/campaign/${c.slug}`} className="group block rounded-2xl border border-[#333333]/60 bg-gradient-to-br from-[#1A1A1A]/80 to-[#141414]/50 p-8 hover:border-[#fd3737]/50 hover:shadow-lg hover:shadow-[#fd3737]/5 transition-all duration-500">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#fd3737]/15 text-[#fd3737]">{c.genre}</span>
              <h2 className="font-display text-3xl mt-5 group-hover:text-[#fd3737] transition-colors">{c.artist}</h2>
              <p className="font-display text-xl text-[#fd3737] lowercase">{c.song}</p>
              <p className="text-[#B8B8C0] text-sm mt-4">{c.tag}</p>
              <span className="inline-block mt-6 text-sm text-[#E4E4E9] group-hover:translate-x-1 transition-transform">View playbook →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
