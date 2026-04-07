import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#141414] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
          CAMPAIGN PLANNER
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Strategic music release planning for modern artists
        </p>
        <Link
          href="/campaign/tyla-carwash"
          className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-200"
        >
          View Tyla &quot;Carwash&quot; Campaign
        </Link>
      </div>
    </div>
  );
}
