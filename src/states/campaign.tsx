import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { toast } from 'react-toastify';
import { postCampaignToIpfs } from 'src/services/campaign/api';
import { useWalletData } from './wallet';
import { useAppContract } from './contracts';
import { saveFile } from 'src/services/services';

export type CampaignDataType = {
    name: string;
    banner: string;
    avatar?: string;
    description: string;
    applicationFrom: string;
    applicationTo: string;
    investmentFrom: string;
    investmentTo: string;
    allocationFrom: string;
    allocationTo: string;
    privateFunding: boolean;
    dkgCommittee: string;
    encyptionKey: string;
    capacity: number;
    fundingOption: number;
    applicationForm: {
        [key: string]: {
            hint?: string;
            detail: string;
            required?: boolean;
        };
    };
    bannerFile?: File;
    avatarFile?: File;
};

const initData: CampaignDataType = {
    name: '',
    banner: '',
    description: '',
    applicationFrom: '',
    applicationTo: '',
    investmentFrom: '',
    investmentTo: '',
    allocationFrom: '',
    allocationTo: '',
    privateFunding: true,
    dkgCommittee: '',
    encyptionKey: '',
    capacity: 0,
    fundingOption: 0,
    applicationForm: {
        '0': {
            hint: '',
            detail: '',
            required: true,
        },
    },
};
type ImageFiles = { bannerFile?: File; avatarFile?: File };

const campaignData = atom<CampaignDataType & ImageFiles>(initData);

export default function InitCampaignData({ data }: { data?: CampaignDataType }) {
    const setCampaignData = useSetAtom(campaignData);
    setCampaignData(data || initData);
}
export const useCampaignFunctions = () => {
    const _setCampaignData = useSetAtom(campaignData);
    const data = useCampaignData();
    const walletData = useWalletData();
    const { workerClient } = useAppContract();
    const setCampaignData = (data: Partial<CampaignDataType>) => {
        _setCampaignData((prev) => ({
            ...prev,
            ...data,
        }));
    };
    const setApplicationForm = (data: CampaignDataType['applicationForm']) => {
        _setCampaignData((prev) => ({
            ...prev,
            applicationForm: {
                ...prev.applicationForm,
                ...data,
            },
        }));
    };
    const handleCreateCampaign = async () => {
        const idtoast = toast.loading('Create transaction and proving...', { position: 'top-center', type: 'info' });
        try {
            if (!walletData.userAddress) {
                throw Error('Login');
            }
            if (workerClient === null) {
                throw Error('Worker client failed');
            }
            if (!data.avatarFile) {
                throw Error('Avatar required!');
            }
            if (!data.bannerFile) {
                throw Error('Banner required!');
            }
            const avatarUrl = await saveFile(data.avatarFile);
            const bannerUrl = await saveFile(data.bannerFile);
            const response = await postCampaignToIpfs({
                avatarImage: avatarUrl,
                capacity: data.capacity,
                coverImage: bannerUrl,
                description: data.description,
                fundingOption: data.fundingOption,
                name: data.name,
                privacyOption: {
                    committeeId: 0,
                    isPrivate: data.privateFunding,
                    keyId: 0,
                },
                questions: Object.values(data.applicationForm).map((item) => ({ question: item.detail, hint: item.hint || '', isRequired: item.required || false })),
                timeline: {
                    allocation: {
                        from: String(data.allocationFrom),
                        to: String(data.allocationTo),
                    },
                    investment: {
                        from: String(data.investmentFrom),
                        to: String(data.investmentTo),
                    },
                    participation: {
                        from: String(data.applicationFrom),
                        to: String(data.applicationTo),
                    },
                },
            });
            // console.log(response);
            await workerClient.createCampaign({
                committeeId: '0',
                ipfsHash: response.Hash || '',
                keyId: '0',
                projectId: '',
                sender: walletData.userAddress,
            });
            await workerClient.proveTransaction();
            const transactionJSON = await workerClient.getTransactionJSON();
            console.log(transactionJSON);
            toast.update(idtoast, { render: 'Prove successfull! Sending the transaction...' });
            const { transactionLink } = await workerClient.sendTransaction(transactionJSON);
            console.log(transactionLink);
            toast.update(idtoast, { render: 'Send transaction successfull!', isLoading: false, type: 'success', autoClose: 3000, hideProgressBar: false });
        } catch (error) {
            if (idtoast) {
                toast.update(idtoast, { render: (error as Error).message, type: 'error', position: 'top-center', isLoading: false, autoClose: 3000, hideProgressBar: false });
            }
        }
    };
    return {
        setCampaignData,
        setApplicationForm,
        handleCreateCampaign,
    };
};

export const useCampaignData = () => useAtomValue(campaignData);
