import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export type CampaignDataType = {
    name: string;
    banner: string;
    description: string;
    applicationPeriod: {
        from: number;
        to: number;
    };
    investmentPeriod: {
        from: number;
        to: number;
    };
    allocationPeriod: {
        from: number;
        to: number;
    };
    privateFunding: boolean;
    dkgCommittee: string;
    encyptionKey: string;
    capacity: number;
    fundingOption: string;
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
    applicationPeriod: {
        from: 0,
        to: 0,
    },
    investmentPeriod: {
        from: 0,
        to: 0,
    },
    allocationPeriod: {
        from: 0,
        to: 0,
    },
    privateFunding: true,
    dkgCommittee: '',
    encyptionKey: '',
    capacity: 0,
    fundingOption: '',
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
    return {
        setCampaignData,
        setApplicationForm,
    };
};

export const useCampaignData = () => useAtomValue(campaignData);
