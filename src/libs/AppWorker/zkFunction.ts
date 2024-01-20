import { Field, Mina, PublicKey, fetchAccount } from 'o1js';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { ZkApp } from '@auxo-dev/platform';
import { ArgumentTypes } from 'src/global.config';
import { FileSystem } from 'src/states/cache';
import { IPFSHash } from '@auxo-dev/auxo-libs';

const state = {
    TypeZkApp: null as null | typeof ZkApp,
    CampaignContract: null as null | ZkApp.Campaign.CampaignContract,
    transaction: null as null | Transaction,
    complieDone: 0 as number,
};

// ---------------------------------------------------------------------------------------

export const zkFunctions = {
    setActiveInstanceToBerkeley: async (args: {}) => {
        const Berkeley = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');
        console.log('Berkeley Instance Created');
        Mina.setActiveInstance(Berkeley);
    },
    loadContract: async (args: {}) => {
        const { ZkApp } = await import('@auxo-dev/platform');
        state.TypeZkApp = ZkApp;
    },
    getPercentageComplieDone: async (args: {}) => {
        return ((state.complieDone / 2) * 100).toFixed(0);
    },
    compileContract: async (args: { fileCache: any }) => {
        await state.TypeZkApp!.Campaign.CreateCampaign.compile({ cache: FileSystem(args.fileCache) }); // 1
        console.log('complie CreateCampaign done');
        state.complieDone += 1;

        await state.TypeZkApp!.Campaign.CampaignContract.compile({ cache: FileSystem(args.fileCache) }); // 1
        console.log('complie CampaignContract done');
        state.complieDone += 1;
    },
    fetchAccount: async (args: { publicKey58: string }) => {
        const publicKey = PublicKey.fromBase58(args.publicKey58);
        return await fetchAccount({ publicKey });
    },
    initZkappInstance: async (args: { campaignContract: string }) => {
        const campaignContractPub = PublicKey.fromBase58(args.campaignContract);
        state.CampaignContract = new state.TypeZkApp!.Campaign.CampaignContract!(campaignContractPub);
    },

    createCampaign: async (args: { sender: string; projectId: string; committeeId: string; ipfsHash: string; keyId: string }) => {
        const sender = PublicKey.fromBase58(args.sender);
        await fetchAccount({ publicKey: sender });
        await fetchAccount({ publicKey: state.CampaignContract!.address });

        const transaction = await Mina.transaction(sender, () => {
            state.CampaignContract!.createCampaign({
                committeeId: new Field(args.committeeId),
                ipfsHash: IPFSHash.fromString(args.ipfsHash),
                keyId: Field(args.keyId),
            });
        });
        state.transaction = transaction;
    },

    proveTransaction: async (args: {}) => {
        await state.transaction!.prove();
    },
    getTransactionJSON: async (args: {}) => {
        return state.transaction!.toJSON();
    },
};

export type TZkFuction = keyof typeof zkFunctions;
// ---------------------------------------------------------------------------------------
export type ArgumentZkFuction<NameFunction extends TZkFuction> = ArgumentTypes<(typeof zkFunctions)[NameFunction]>['0'];
export type ReturenValueZkFunction<NameFunction extends TZkFuction> = ReturnType<(typeof zkFunctions)[NameFunction]>;

// export type TCallEvent<NameFunction extends TZkFuction> = (fn: NameFunction, args: ArgumentTypes<(typeof zkFunctions)[NameFunction]>['0']) => ReturnType<(typeof zkFunctions)[NameFunction]>;
