import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { toast } from 'react-toastify';
import { getDataCreateCampaign, postCampaignToIpfs } from 'src/services/campaign/api';
import { useWalletData } from './wallet';
import { useAppContract } from './contracts';
import { saveFile } from 'src/services/services';
import { v4 as uuid } from 'uuid';
import { isNumeric } from 'src/utils';

export type CampaignDataType = {
    name: string;
    banner: string;
    avatar: string;
    description: string;
    applicationTimeStart: string;
    investmentTimeStart: string;
    allocationTimeStart: string;
    privateFunding: boolean;
    committeeId: string;
    keyId: string;
    capacity: number;
    fundingOption: number;
    applicationForm: {
        id: string;
        hint: string;
        detail: string;
        required: boolean;
    }[];
    bannerFile?: File;
    avatarFile?: File;
};

const initData: CampaignDataType = {
    name: '',
    avatar: '',
    banner: '',
    description: '',
    applicationTimeStart: '',
    investmentTimeStart: '',
    allocationTimeStart: '',
    privateFunding: true,
    keyId: '',
    committeeId: '',
    capacity: 0,
    fundingOption: 0,
    applicationForm: [
        {
            id: uuid(),
            hint: '',
            detail: '',
            required: true,
        },
    ],
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
    const addApplicationFormItem = (item: CampaignDataType['applicationForm'][number]) => {
        _setCampaignData((prev) => ({
            ...prev,
            applicationForm: [...prev.applicationForm, item],
        }));
    };

    const editApplicationFormItem = (index: number, item: Partial<CampaignDataType['applicationForm'][number]>) => {
        _setCampaignData((prev) => ({
            ...prev,
            applicationForm: prev.applicationForm.map((formItem, i) => (i === index ? { ...formItem, ...item } : formItem)),
        }));
    };

    const deleteApplicationFormItem = (index: number) => {
        _setCampaignData((prev) => ({
            ...prev,
            applicationForm: prev.applicationForm.filter((_, i) => i !== index),
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

            let avatarUrl = data.avatar;
            if (data.avatarFile) {
                avatarUrl = (await saveFile(data.avatarFile)).URL;
            }
            if (!avatarUrl) {
                throw Error('Avatar required!');
            }

            let bannerUrl = data.banner;
            if (data.bannerFile) {
                bannerUrl = (await saveFile(data.bannerFile)).URL;
            }
            if (!bannerUrl) {
                throw Error('Banner required!');
            }

            if (isNumeric(data.committeeId) === false) {
                throw Error('Select committee is required!');
            }
            if (isNumeric(data.keyId) === false) {
                throw Error('Select key is required!');
            }
            if (isNaN(data.capacity) || !Number.isInteger(data.capacity) || data.capacity <= 0) {
                throw Error('Capacity must be a positive integer number!');
            }

            const dataCreateCampaign = await getDataCreateCampaign(data.committeeId, data.keyId);

            const response = await postCampaignToIpfs({
                avatarImage: avatarUrl,
                capacity: data.capacity,
                coverImage: bannerUrl,
                description: data.description,
                fundingOption: data.fundingOption,
                name: data.name,
                privacyOption: {
                    committeeId: Number(data.committeeId),
                    isPrivate: data.privateFunding,
                    keyId: Number(data.keyId),
                },
                questions: data.applicationForm.map((item) => ({ question: item.detail, hint: item.hint, isRequired: item.required })),
                timeline: {
                    startParticipation: new Date(data.applicationTimeStart).getTime(),
                    startFunding: new Date(data.investmentTimeStart).getTime(),
                    startRequesting: new Date(data.allocationTimeStart).getTime(),
                },
            });
            // console.log(response);
            await workerClient.createCampaign({
                sender: walletData.userAddress,
                ipfsHash: response.Hash || '',
                committeeId: data.committeeId,
                keyId: data.keyId,
                projectId: '',
                startFunding: new Date(data.investmentTimeStart).getTime() / 1000 + '',
                startParticipation: new Date(data.applicationTimeStart).getTime() / 1000 + '',
                startRequesting: new Date(data.allocationTimeStart).getTime() / 1000 + '',
                backendData: dataCreateCampaign,
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
        addApplicationFormItem,
        editApplicationFormItem,
        deleteApplicationFormItem,
        handleCreateCampaign,
    };
};

export const useCampaignData = () => useAtomValue(campaignData);
