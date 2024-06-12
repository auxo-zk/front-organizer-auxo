import axios from 'axios';
import { apiUrl } from '../url';
import { BACKEND_BASE_URL } from '../baseUrl';
import { LocalStorageKey } from 'src/constants';
import { TProjectData } from '../project/api';
import { TRef, TWitness } from '../type';

const getJwt = () => {
    return localStorage.getItem(LocalStorageKey.AccessToken) || '';
};

export type TCampaignData = { name: string; type: string; date: string; capacity: string; avatar: string; banner: string; status: number; campaignId: string };
export async function getLatestFundingCampaigns(active: boolean = true): Promise<TCampaignData[]> {
    const response: any[] = (await axios.get(apiUrl.getCampaignAll + `?active=${active}`)).data;
    console.log(response);
    return response.map((item) => ({
        name: item.ipfsData?.name || '---',
        type: 'Public, grans',
        capacity: String(item.ipfsData?.capacity || ''),
        date: new Date().toLocaleDateString(),
        avatar: item.ipfsData?.avatarImage || '',
        banner: item.ipfsData?.coverImage || '',
        status: item.status || 0,
        campaignId: item.campaignId + '' || '#',
    }));
}
export type TCampaignDetailOverview = {
    organizer: {
        address: string;
        name: string;
        avatar: string;
    };
    capacity: string;
    description: string;

    allocation: {
        from: number;
        to: number;
    };
    investment: {
        from: number;
        to: number;
    };
    participation: {
        from: number;
        to: number;
    };
};
export type TCampaignResult = {};
export type TCampaignDetail = {
    campaignId: string;
    name: string;
    banner: string;
    avatar: string;
    overview: TCampaignDetailOverview;
    result: TCampaignResult;
    questions: { question: string; hint: ''; isRequired: boolean }[];
};
export async function getCampaignOverview(campaignId: string): Promise<TCampaignDetail> {
    const response = (await axios.get(apiUrl.campaignDetail + `/${campaignId}`)).data;
    return {
        campaignId: response.campaignId + '' || '',
        name: response.ipfsData?.name || '----',
        banner: response?.ipfsData?.coverImage || '',
        avatar: response?.ipfsData?.avatarImage || '',
        overview: {
            organizer: {
                address: response?.owner || '',
                avatar: response?.ownerInfo?.img || '',
                name: response?.ownerInfo?.name || 'Unnkown Name',
            },
            capacity: response.ipfsData?.capacity || '',
            description: response.ipfsData?.description || '',
            allocation: {
                from: new Date(response.ipfsData?.timeline?.allocation?.from || 0).getTime(),
                to: new Date(response.ipfsData?.timeline?.allocation?.to || 0).getTime(),
            },
            participation: {
                from: new Date(response.ipfsData?.timeline?.participation?.from || 0).getTime(),
                to: new Date(response.ipfsData?.timeline?.participation?.to || 0).getTime(),
            },
            investment: {
                from: new Date(response.ipfsData?.timeline?.investment?.from || 0).getTime(),
                to: new Date(response.ipfsData?.timeline?.investment?.to || 0).getTime(),
            },
        },
        result: {},
        questions: response.ipfsData?.questions || [],
    };
}

export type CampaignInput = {
    name: string;
    coverImage: string;
    avatarImage: string;
    description: string;
    timeline: {
        startParticipation: number;
        startFunding: number;
        startRequesting: number;
    };
    privacyOption: {
        isPrivate: boolean;
        committeeId: number;
        keyId: number;
    };
    capacity: number;
    fundingOption: number;
    questions: {
        question: string;
        hint: string;
        isRequired: boolean;
    }[];
};

export async function postCampaignToIpfs(input: CampaignInput): Promise<{
    Name: string;
    Hash: string;
    Size: number;
}> {
    const response = await axios.post(apiUrl.postCampaignToIpfs, input, { headers: { Authorization: `Bearer ${getJwt()}` } });
    return response.data;
}

export async function getParticipatingProjects(campaignId: string): Promise<TProjectData[]> {
    const response = await axios.get(apiUrl.getParticipatingProjects(campaignId));
    return response.data.map((item: any) => {
        return {
            name: item.ipfsData?.name || '',
            avatar: item?.ipfsData?.avatarImage || '',
            banner: item?.ipfsData?.coverImage || '',
            desc: item.ipfsData?.description || '',
            date: new Date().toLocaleDateString(),
            idProject: item.projectId + '' || '#',
        };
    });
}

export type TResponseCampaignCreateData = {
    keyStatusWitness: TWitness;
    campaignContractWitness: TWitness;
    dkgContractRef: TRef;
    requesterContractRef: TRef;
};
export async function getDataCreateCampaign(committeeId: string, keyId: string): Promise<TResponseCampaignCreateData> {
    const response = await axios.get(apiUrl.getDataCreateCampaign(committeeId, keyId));
    return response.data;
}
