import { tylaCarwashCampaign } from '@/lib/data/tyla-carwash';
import { CampaignPage as CampaignPageComponent } from '@/components/campaign/CampaignPage';

export const metadata = {
  title: `${tylaCarwashCampaign.artist} - ${tylaCarwashCampaign.song} | Campaign Planner`,
  description: `Campaign plan for ${tylaCarwashCampaign.artist}'s ${tylaCarwashCampaign.song}`,
};

export default function CampaignPageServer({ params }: { params: { slug: string } }) {
  if (params.slug !== 'tyla-carwash') {
    return <div className="text-white text-center p-8">Campaign not found</div>;
  }

  return <CampaignPageComponent campaign={tylaCarwashCampaign} />;
}
