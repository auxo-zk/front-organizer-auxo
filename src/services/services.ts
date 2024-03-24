import axios from 'axios';
import { apiUrl } from './url';

export type TCommitteeData = {
    id: string;
    idCommittee: string;
    name: string;
    status: 'Active' | 'Pending';
    threshold: number;
    numberOfMembers: number;
    creator: string;
    members: { publicKey: string; alias: string; lastActive: string }[];
};
export async function getListCommittees(): Promise<TCommitteeData[]> {
    const response = await axios.get(apiUrl.listCommittee);

    return response.data.map((item: any) => {
        return {
            id: item['_id'],
            idCommittee: (item.committeeId + '').padStart(2, '0') || '---',
            name: item.ipfsData?.name || 'Unknown',
            status: item.active ? 'Active' : 'Pending',
            threshold: item.threshold || 0,
            numberOfMembers: item.numberOfMembers || 0,
            creator: item.ipfsData?.creator || 'Unknown',
            members: item.members || [],
        };
    });
}

export async function postCreateCommittee(data: { name: string; creator: string; network: string }) {
    const response = await axios.post(apiUrl.createCommittee, data);
    console.log('post new committee', response.data);
    return response.data;
}

export type RTCommitteeKey = {
    _id: string;
    committeeId: number;
    keyId: number;
    status: number;
    publicKey: string;
    // round1s: [];
    // round2s: [];
    // requests: [];
};

export async function getCommiteeKeys(committeeId: string): Promise<RTCommitteeKey[]> {
    const response = await axios.get<RTCommitteeKey[]>(apiUrl.getCommitteKeys(committeeId));
    return response.data.filter((i) => i.publicKey);
}

type RTSeverSig = {
    msg: string[];
    signature: string;
};
export async function getServerSig(): Promise<RTSeverSig> {
    const response = (await axios.get(apiUrl.serverSigNature)).data as RTSeverSig;
    return response;
}

type RTGetTokenFromSig = string;
export async function getTokenFromSig(data: {
    address: string;
    role: number;
    signature: {
        r: string;
        s: string;
    };
    serverSignature: {
        msg: string[];
        signature: string;
    };
}): Promise<RTGetTokenFromSig> {
    const response = (await axios.post(apiUrl.getTokenFromSig, data)).data as RTGetTokenFromSig;
    return response;
}

export async function saveFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res: string = (await axios.post(apiUrl.saveFile, formData)).data;
    return res;
}
