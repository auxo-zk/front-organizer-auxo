import axios from 'axios';
import { apiUrl } from '../url';
import { LocalStorageKey } from 'src/constants';
import { TFileSaved } from '../services';

export enum KeyProjectInput {
    'solution' = 'solution',
    'problemStatement' = 'problem-statement',
    'challengesAndRisks' = 'challenges-and-risks',
}
//PROJECT LIST ************************************************************************************************************************************************
export type TProjectData = {
    name: string;
    desc: string;
    date: string;
    banner: string;
    avatar: string;
    idProject: string;
};
export const getJwt = () => {
    return localStorage.getItem(LocalStorageKey.AccessToken) || '';
};

export async function getTopProject(): Promise<TProjectData[]> {
    const response: any[] = (await axios.get(apiUrl.getTopProject)).data;
    return response.map((item: any) => ({
        name: item.ipfsData?.name || '',
        avatar: item?.ipfsData?.avatarImage || '',
        banner: item?.ipfsData?.coverImage || '',
        desc: item.ipfsData?.description || '',
        date: new Date().toLocaleDateString(),
        idProject: item.projectId + '' || '#',
    }));
}

//PROJECT DETAIL ************************************************************************************************************************************************
export type TProjectOverview = {
    raisingAmount?: number;
    campaignAmount?: number;
    description: string;
    documents: TFileSaved[];
    member: {
        name: string;
        role: string;
        link: string;
    }[];
} & {
    [key in KeyProjectInput]: string;
};
export type TScopeOfWork = {
    deadline: string;
    information: string;
    milestone: string;
    raisingAmount: string;
};

export type TProjectDetail = {
    name: string;
    avatar: string;
    banner: string;
    date: string;
    totalClaimedAmount: number;
    totalFundedAmount: number;
    overview: TProjectOverview;
};

export async function getProjectDetail(projectId: string): Promise<TProjectDetail> {
    const response = (await axios.get(apiUrl.projectDetail + `/${projectId}`)).data;
    return {
        name: response?.ipfsData?.name || '',
        avatar: response?.ipfsData?.avatarImage || '',
        banner: response?.ipfsData?.coverImage || '',
        date: new Date().toLocaleDateString(),
        totalClaimedAmount: response?.totalClaimedAmount || 0,
        totalFundedAmount: response?.totalFundedAmount || 0,
        overview: {
            description: response?.ipfsData?.description || '',
            documents: response?.ipfsData?.documents || [],
            member: response?.ipfsData?.members || [],
            campaignAmount: 0,
            raisingAmount: 0,
            [KeyProjectInput.solution]: response?.ipfsData ? response?.ipfsData[KeyProjectInput.solution] || '' : '',
            [KeyProjectInput.problemStatement]: response?.ipfsData ? response?.ipfsData[KeyProjectInput.problemStatement] || '' : '',
            [KeyProjectInput.challengesAndRisks]: response?.ipfsData ? response?.ipfsData[KeyProjectInput.challengesAndRisks] || '' : '',
        },
    };
}

export type TQuestions = {
    question: string;
    hint: string;
    isRequired: boolean;
};
export type TProjectFundRaising = {
    campaignId: string;
    campaignName: string;
    fundedAmount: number;
    targetAmount: number;
    raiseInfo: {
        scope: string;
        budgetRequired: string;
        etc: string;
    }[];
    documents: TFileSaved[];
    scopeOfWorks: TScopeOfWork[];
    questions: TQuestions[];
    answers: string[];
};

export async function getFundRaisingProject(projectId: string): Promise<TProjectFundRaising[]> {
    const response = (await axios.get(apiUrl.getParticipationsByProjectId(projectId))).data;
    return response.map((item: any) => ({
        campaignId: item.campaignId + '',
        campaignName: item.campaign?.ipfsData?.name || '',
        fundedAmount: item.claimedAmount || 0,
        targetAmount:
            item.ipfsData?.scopeOfWorks?.reduce((accumulator: number, item: any) => {
                return accumulator + Number(item.raisingAmount);
            }, 0) || 0,
        raiseInfo: item.raiseInfo || [],
        documents: item.ipfsData?.documents || [],
        scopeOfWorks: item.ipfsData?.scopeOfWorks || [],
        questions: item.campaign?.ipfsData?.questions || [],
        answers: item.ipfsData?.answers || [],
    }));
}
//PROJECT EDIT ******************************************************************************************************************************************
export type MemberDataType = {
    profileName: string;
    role: string;
    socialLink: string;
};
export type TEditProjectData = {
    draftId?: string;
    name: string;
    banner: string;
    publicKey: string;
    overViewDescription: string;
    problemStatement: string;
    solution: string;
    challengeAndRisk: string;
    customSections: {
        [key: string]: {
            title: string;
            description?: string;
        };
    };
    teamMember?: {
        [id: string]: MemberDataType;
    };
    additionalDocument?: any;
};

export async function saveProject(address: string, project: TEditProjectData) {
    if (!project.draftId || !address) {
        return;
    }
    const jwt = getJwt();
    await axios.post(
        apiUrl.saveProject + `${address}/drafts/${project.draftId}`,
        {
            address: address,
            name: project.name,
            publicKey: project.publicKey,
            description: project.overViewDescription,
            problemStatement: project.problemStatement,
            solution: project.solution,
            challengeAndRisks: project.challengeAndRisk,
            members: project.teamMember,
            documents: [],
        },
        {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    );
    return { success: true };
}

export async function createProject(address: string, project: TEditProjectData) {
    if (!address) {
        return;
    }
    const jwt = getJwt();
    await axios.post(
        apiUrl.saveProject + `/drafts`,
        {
            address: address,
            name: project.name,
            publicKey: project.publicKey,
            description: project.overViewDescription,
            problemStatement: project.problemStatement,
            solution: project.solution,
            challengeAndRisks: project.challengeAndRisk,
            members: Object.values(project.teamMember || {}),
            documents: [],
        },
        {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    );
    return { success: true };
}

export type ProjectMetaData = {
    name: string;
    avatar: string;
    banner: string;
    type: 'project' | 'draft';
    overviewDesc: string;
};
export async function getDraftProject(): Promise<ProjectMetaData[]> {
    const response: any[] = (await axios.get(apiUrl.getDraft, { headers: { Authorization: `Bearer ${getJwt()}` } })).data || [];
    return response.map((item) => ({
        name: item.name,
        avatar: item.avatar || '',
        banner: item.nammer || '',
        type: 'draft',
        overviewDesc: item.description,
    }));
}
export async function getUserProject(address: string): Promise<ProjectMetaData[]> {
    const response: any[] = (await axios.get(apiUrl.getProject + `/${address}/projects`, { headers: { Authorization: `Bearer ${getJwt()}` } })).data || [];
    return response.map((item) => ({
        name: item.name,
        avatar: item.avatar || '',
        banner: item.nammer || '',
        type: 'draft',
        overviewDesc: item.description,
    }));
}
