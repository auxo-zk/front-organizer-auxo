import { url } from 'inspector';
import { apiUrl } from '../url';
import axios from 'axios';
import { getJwt } from '../project/api';
import { CampaignState, TCampaignData } from '../campaign/api';

export type TProfileData = {
    address: string;
    name: string;
    website: string;
    description: string;
    img: string;
};

export async function getUserProfile(address: string): Promise<TProfileData> {
    const response: any = (await axios.get(apiUrl.getUserProfile + `/${address}`)).data;
    return {
        address: response.address,
        name: response.name || 'Unknown',
        description: response.description || '',
        img: response.img || '',
        website: response.website || '',
    };
}

export type THostingCampaign = {
    campaignId: number;
    ipfsHash: string;
    owner: string;
    status: number;
    committeeId: number;
    keyId: number;
    ipfsData: {};
    active: true;
};

export async function fetchHostingCampaign(address: string): Promise<TCampaignData[]> {
    const response: Array<any> = (await axios.get(apiUrl.getHostingCampaign(address))).data;
    return response.map((item) => {
        const timeLine = {
            startParticipation: item.timeline?.startParticipation ? item.timeline.startParticipation * 1000 : Date.now() + 60000,
            startFunding: item.timeline?.startFunding ? item.timeline.startFunding * 1000 : Date.now() + 60000,
            startRequesting: item.timeline?.startRequesting ? item.timeline.startRequesting * 1000 : Date.now() + 60000,
        };
        const now = new Date().getTime();
        let state = CampaignState.UPCOMING;
        if (now > timeLine.startParticipation && now < timeLine.startFunding) {
            state = CampaignState.APPLICATION;
        } else if (now > timeLine.startFunding && now < timeLine.startRequesting) {
            state = CampaignState.FUNDING;
        } else if (now > timeLine.startRequesting) {
            state = CampaignState.ALLOCATION;
        }
        return {
            name: item.ipfsData?.name || '---',
            fundingOption: item.ipfsData?.fundingOption || 2,
            capacity: item.ipfsData?.capacity || '0',
            date: new Date().toLocaleDateString(),
            avatar: item.ipfsData?.avatarImage || '',
            banner: item.ipfsData?.coverImage || '',
            state: state,
            campaignId: item.campaignId + '' || '#',
        };
    });
}

export type TProfileInput = {
    name: string;
    website: string;
    description: string;
};
export type TEditResult = {
    address: string;
    name: string;
    website: string;
    description: string;
    img: string;
};
export async function postProfileInfo(input: TProfileInput): Promise<TEditResult> {
    const jwt = getJwt();
    const response: any = await axios.post(apiUrl.editProfile, input, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    });
    return response;
}

export async function postProfileAvatar(input: File): Promise<string> {
    const jwt = getJwt();
    const formData = new FormData();
    formData.append('avatar', input);
    const result: any = await axios.post(apiUrl.editProfileImage, formData, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    });
    return result.URL;
}

export async function verifyJwt() {
    const jwt = getJwt();
    await axios.get(apiUrl.checkJwt, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    });
    return true;
}
