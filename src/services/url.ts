import { BACKEND_BASE_URL } from './baseUrl';

export const apiUrl = {
    saveFile: `${BACKEND_BASE_URL}/v0/object-storage`,
    listCommittee: `${BACKEND_BASE_URL}/v0/committees`,
    createCommittee: `${BACKEND_BASE_URL}/v0/committee`,
    getCommitteKeys: (id: string) => `${BACKEND_BASE_URL}/v0/committees/${id}/keys`,
    //signature
    serverSigNature: `${BACKEND_BASE_URL}/v0/auth`,
    getTokenFromSig: `${BACKEND_BASE_URL}/v0/auth`,
    //Project
    getTopProject: `${BACKEND_BASE_URL}/v0/projects`,
    getListProject: `${BACKEND_BASE_URL}/v0/projects`,
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
    getParticipatingProjects: (campaignId: string) => `${BACKEND_BASE_URL}/v0/campaigns/${campaignId}/projects`,
    //profile
    getUserProfile: `${BACKEND_BASE_URL}/v0/organizers`,
    getHostingCampaign: (address: string) => `${BACKEND_BASE_URL}/v0/organizers/${address}/campaigns`,
    editProfile: `${BACKEND_BASE_URL}/v0/organizers`,
    editProfileImage: `${BACKEND_BASE_URL}/v0/organizers/update-avatar`,
    checkJwt: `${BACKEND_BASE_URL}/v0/auth/profile`,
};
