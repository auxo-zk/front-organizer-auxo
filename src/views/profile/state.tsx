import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { TProfileInput, getUserProfile, postProfileAvatar, postProfileInfo } from 'src/services/profile/api';
import { useWalletData } from 'src/states/wallet';

export type TProfileState = {
    address: string;
    name: string;
    website: string;
    description: string;
    img: string;
    imgFile?: File;
};

const initState: TProfileState = {
    address: '',
    name: '',
    website: '',
    description: '',
    img: '',
};

const profileData = atom<TProfileState>(initState);
export const useProfileData = () => useAtomValue(profileData);

export const useProfileFunction = () => {
    const _setProfileData = useSetAtom(profileData);
    const { imgFile } = useProfileData();
    const { userAddress } = useWalletData();
    const setProfileData = (data: Partial<TProfileState>) => {
        _setProfileData((prev) => {
            return {
                ...prev,
                ...data,
            };
        });
    };
    const getProfileData = async () => {
        if (userAddress) {
            try {
                const result = await getUserProfile(userAddress);
                console.log('🚀 ~ getProfileData ~ result:', result);
                setProfileData({
                    address: userAddress,
                    description: result.description,
                    img: result.img,
                    name: result.name,
                });
            } catch (error) {
                console.log('getProfileData error:', error);
            }
        }
    };

    const submitProfileInfo = async (input: TProfileInput) => {
        try {
            const result = await postProfileInfo(input);
            toast('Edit Profile Successfully: ', { type: 'success' });
            return result;
        } catch (error) {
            toast('Edit Profile Failed: ' + (error as Error).message, { type: 'error' });
        }
    };

    const submitProfileAvatar = async (imgFile: File) => {
        try {
            const result = await postProfileAvatar(imgFile);
            toast('Edit Profile Avatar Successfully: ', { type: 'success' });
            return result;
        } catch (error) {
            toast('Edit Profile Avatar Failed: ' + (error as Error).message, { type: 'error' });
        }
    };
    return { setProfileData, getProfileData, submitProfileInfo, submitProfileAvatar };
};
