import { atom, useAtom, useAtomValue } from 'jotai';
import ZkAppWorkerClient from 'src/libs/AppWorker/zkWorkerClient';
import { toast } from 'react-toastify';
import { NetworkId } from 'src/constants';

export type TContractData = {
    workerClient: ZkAppWorkerClient | null;
    isInitWorker: boolean;
    isLoading: boolean;
    networkId: NetworkId;
};

const initData: TContractData = {
    workerClient: null,
    isInitWorker: true,
    isLoading: false,
    networkId: NetworkId.AuxoNetwork,
};

const appContract = atom<TContractData>(initData);

export const useAppContract = () => useAtomValue(appContract);

export const useAppContractFunction = () => {
    const [zkApp, _setAppContractData] = useAtom(appContract);

    function setAppContractData(data: Partial<TContractData>) {
        return _setAppContractData((prev) => {
            return {
                ...prev,
                ...data,
            };
        });
    }
    async function initClient() {
        setAppContractData({ isInitWorker: true });
        try {
            console.log('Loading web worker...');
            const _zkapp = new ZkAppWorkerClient();
            await _zkapp.loadWorker();
            console.log('Done loading web worker');
            setAppContractData({
                isInitWorker: false,
                workerClient: _zkapp,
            });
        } catch (err) {
            console.log(err);
            setAppContractData({
                isInitWorker: false,
                workerClient: null,
            });
        }
    }

    async function check(id: any) {
        const percent = await zkApp.workerClient?.getPercentageComplieDone();
        if (Number(percent) < 100) {
            toast.update(id, { render: `Compiling contracts...! ${percent}%` });
        } else {
            toast.update(id, { render: `Compiled contract successfully!`, isLoading: false, type: 'success', autoClose: 3000, hideProgressBar: false });
            return true;
        }
        return false;
    }
    async function compile(cacheFiles: any) {
        setAppContractData({ isLoading: true });
        try {
            if (zkApp.workerClient) {
                const idtoast = toast.loading('Compiling contracts...', { position: 'bottom-left' });
                const checkComplie = setInterval(async () => {
                    if (await check(idtoast)) {
                        clearInterval(checkComplie);
                    }
                }, 2000);
                // await zkApp.workerClient.setActiveInstanceToBerkeley();
                await zkApp.workerClient.loadContract();
                await zkApp.workerClient.compileContract(cacheFiles);
                await zkApp.workerClient.initZkappInstance({
                    campaignContract: 'B62qpaYMPKGMpC4UvuscjW5VoX21eQJFWmcGxGW1zVqfMAUC18yx933',
                    dkgContract: 'B62qizA7ZJxGakVK3Vcy6pdSedtXEY9rZber9EimAkzMAt4fCBpCQL9',
                    fundingRequesterContract: 'B62qkcg1F7ncX45x6661jcmseVR1pAajDUEcyTm1Uhw6WK2ZHE68ANq',
                });
                setAppContractData({
                    isLoading: false,
                });
            }
        } catch (err) {
            console.log(err);
            setAppContractData({
                isLoading: false,
            });
        }
    }

    return {
        setAppContractData,
        compile,
        initClient,
    };
};
