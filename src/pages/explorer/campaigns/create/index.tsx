import dynamic from 'next/dynamic';

// import CreateCampaign from 'src/views/campaign/CreateCampaign';
const CreateCampaign = dynamic(() => import('src/views/explorer/campaign/CreateCampaign/CreateCampaign'), { ssr: false });

export default function CreateCampaignPage() {
    return <CreateCampaign />;
}
