import { BACKEND_BASE_URL } from './baseUrl';

export const apiUrl = {
    listCommittee: `${BACKEND_BASE_URL}/v0/committee`,
    createCommittee: `${BACKEND_BASE_URL}/v0/committee`,
    //signature
    serverSigNature: `${BACKEND_BASE_URL}/v0/auth`,
    getTokenFromSig: `${BACKEND_BASE_URL}/v0/auth`,
    //Project
    getTopProject: `${BACKEND_BASE_URL}/v0/projects`,
    saveProject: `${BACKEND_BASE_URL}/v0/builders`,
    createProject: `${BACKEND_BASE_URL}/v0/builders`,
    getDraft: `${BACKEND_BASE_URL}/v0/builders/drafts`,
    getProject: `${BACKEND_BASE_URL}/v0/builders`,
    //project detail
    projectDetail: `${BACKEND_BASE_URL}/v0/projects`,
    //campaign
    getCampaign: `${BACKEND_BASE_URL}/v0/campaigns`,
    getCampaignAll: `${BACKEND_BASE_URL}/v0/campaigns/all`,
    campaignDetail: `${BACKEND_BASE_URL}/v0/campaigns`,
    postCampaignToIpfs: `${BACKEND_BASE_URL}/v0/campaigns`,
    //profile
    getUserProfile: `${BACKEND_BASE_URL}/v0/builders`,
};
