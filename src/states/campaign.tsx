import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { toast } from 'react-toastify';
import { postCampaignToIpf } from 'src/services/campaign/api';
import { useWalletData } from './wallet';
import { useAppContract } from './contracts';

export type CampaignDataType = {
    name: string;
    banner: string;
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
            hint: 'Test hint',
            detail: 'hahahahahaaaaa',
            required: true,
        },
    },
};

const campaignData = atom<CampaignDataType>(initData);

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
            const response = await postCampaignToIpf({
                avatarImage: 'https://storage.googleapis.com/auxo/de373f009ca62b59aef619ec35b826c5e517d738234d39bff64b9a00e40559f5.png',
                capacity: data.capacity,
                coverImage: 'https://storage.googleapis.com/auxo/de373f009ca62b59aef619ec35b826c5e517d738234d39bff64b9a00e40559f5.png',
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
            const result = await workerClient.createCampaign({
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
