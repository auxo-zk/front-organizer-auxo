import { Field, Mina, PublicKey, UInt64, fetchAccount } from 'o1js';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import { Storage, type ZkApp as ZkAppPlatform } from '@auxo-dev/platform';
import type { ZkApp as ZkAppDkg } from '@auxo-dev/dkg';
import { ArgumentTypes } from 'src/global.config';
import { FileSystem } from 'src/states/cache';
import { IpfsHash } from '@auxo-dev/auxo-libs';
import { NetworkId } from 'src/constants';
import { chainInfo } from 'src/constants/chainInfo';

const state = {
    ZkAppPlatform: null as null | typeof ZkAppPlatform,
    ZkAppDkg: null as null | typeof ZkAppDkg,
    FundingRequesterContract: null as null | ZkAppDkg.Requester.RequesterContract,
    VestingRequesterContract: null as null | ZkAppDkg.Requester.RequesterContract,
    DkgContract: null as null | ZkAppDkg.DKG.DkgContract,
    RequestContract: null as null | ZkAppDkg.Request.RequestContract,
    ProjectContract: null as null | ZkAppPlatform.Project.ProjectContract,
    ParticipationContract: null as null | ZkAppPlatform.Participation.ParticipationContract,
    CommitmentContract: null as null | ZkAppPlatform.Commitment.CommitmentContract,
    VestingContract: null as null | ZkAppPlatform.Vesting.VestingContract,
    TreasuryContract: null as null | ZkAppPlatform.TreasuryManager.TreasuryManagerContract,
    CampaignContract: null as null | ZkAppPlatform.Campaign.CampaignContract,
    transaction: null as null | Transaction,
    complieDone: 0 as number,
};

// ---------------------------------------------------------------------------------------

export const zkFunctions = {
    setActiveInstanceToNetwork: async (args: { chainId: NetworkId }) => {
        const networkInfo = chainInfo[args.chainId];
        const Network = Mina.Network({
            mina: networkInfo.rpcUrl,
            archive: networkInfo.archiveUrl,
        });
        console.log(`${networkInfo.name} Instance Created`);
        Mina.setActiveInstance(Network);
    },
    loadContract: async (args: {}) => {
        const [{ ZkApp: ZkAppPlatform }, { ZkApp: ZkAppDkg }] = await Promise.all([import('@auxo-dev/platform'), import('@auxo-dev/dkg')]);
        state.ZkAppPlatform = ZkAppPlatform;
        state.ZkAppDkg = ZkAppDkg;
    },
    getPercentageComplieDone: async (args: {}) => {
        return ((state.complieDone / 20) * 100).toFixed(0);
    },
    checkValidAddress: async (args: { address: string }) => {
        try {
            PublicKey.fromBase58(args.address);
            return true;
        } catch (err) {
            return false;
        }
    },
    compileContract: async (args: { fileCache: any }) => {
        await state.ZkAppDkg!.Requester.UpdateTask.compile({ cache: FileSystem(args.fileCache) }); // 1
        console.log('1. complie UpdateTask done');
        state.complieDone += 1;

        await state.ZkAppDkg!.Requester.RequesterContract.compile({ cache: FileSystem(args.fileCache) }); // 2
        console.log('2. complie RequesterContract done');
        state.complieDone += 1;

        await state.ZkAppDkg!.DKG.UpdateKey.compile({ cache: FileSystem(args.fileCache) }); // 3
        console.log('3. complie UpdateKey done');
        state.complieDone += 1;

        await state.ZkAppDkg!.DKG.DkgContract.compile({ cache: FileSystem(args.fileCache) }); // 4
        console.log('4. complie DkgContract done');
        state.complieDone += 1;

        await state.ZkAppDkg!.Request.ComputeResult.compile({ cache: FileSystem(args.fileCache) }); // 5
        console.log('5. complie ComputeResult done');
        state.complieDone += 1;

        await state.ZkAppDkg!.Request.UpdateRequest.compile({ cache: FileSystem(args.fileCache) }); // 6
        console.log('6. complie UpdateRequest done');
        state.complieDone += 1;

        await state.ZkAppDkg!.Request.RequestContract.compile({ cache: FileSystem(args.fileCache) }); // 7
        console.log('7. complie RequestContract done');
        state.complieDone += 1;

        await state.ZkAppPlatform!.Project.RollupProject.compile({ cache: FileSystem(args.fileCache) }); // 8
        console.log('8. complie RollupProject done');
        state.complieDone += 1;

        await state.ZkAppPlatform!.Campaign.RollupCampaign.compile({ cache: FileSystem(args.fileCache) }); // 9
        console.log('9. complie RollupCampaign done');
        state.complieDone += 1;

        await state.ZkAppPlatform!.Participation.RollupParticipation.compile({ cache: FileSystem(args.fileCache) }); // 10
        console.log('10. complie RollupParticipation done');
        state.complieDone += 1;

        await state.ZkAppPlatform!.Funding.RollupFunding.compile({ cache: FileSystem(args.fileCache) }); // 11
        console.log('11. complie RollupFunding done');
        state.complieDone += 1;

        await state.ZkAppPlatform!.TreasuryManager.RollupTreasuryManager.compile({ cache: FileSystem(args.fileCache) }); // 12
        console.log('12. complie RollupTreasuryManager done');
        state.complieDone += 1;

        await state.ZkAppPlatform!.Project.ProjectContract.compile({ cache: FileSystem(args.fileCache) }); // 13
        console.log('13. complie ProjectContract done');
        state.complieDone += 1;

        await state.ZkAppPlatform!.Campaign.CampaignContract.compile({ cache: FileSystem(args.fileCache) }); // 14
        console.log('14. complie CampaignContract done');
        state.complieDone += 1;

        await state.ZkAppPlatform!.Participation.ParticipationContract.compile({ cache: FileSystem(args.fileCache) }); // 15
        console.log('15. complie ParticipationContract done');
        state.complieDone += 1;

        await state.ZkAppPlatform!.Funding.FundingContract.compile({ cache: FileSystem(args.fileCache) }); // 16
        console.log('16. complie FundingContract done');
        state.complieDone += 1;

        await state.ZkAppPlatform!.TreasuryManager.TreasuryManagerContract.compile({ cache: FileSystem(args.fileCache) }); // 17
        console.log('17. complie TreasuryManagerContract done');
        state.complieDone += 1;

        await state.ZkAppPlatform!.Commitment.RollupCommitment.compile({ cache: FileSystem(args.fileCache) }); // 18
        console.log('18. complie RollupCommitment done');
        state.complieDone += 1;

        await state.ZkAppPlatform!.Commitment.CommitmentContract.compile({ cache: FileSystem(args.fileCache) }); // 19
        console.log('19. complie CommitmentContract done');
        state.complieDone += 1;

        await state.ZkAppPlatform!.Vesting.VestingContract.compile({ cache: FileSystem(args.fileCache) }); // 20
        console.log('20. complie VestingContract done');
        state.complieDone += 1;
    },
    fetchAccount: async (args: { publicKey58: string }) => {
        const publicKey = PublicKey.fromBase58(args.publicKey58);
        return await fetchAccount({ publicKey });
    },
    initZkappInstance: async (args: { campaignContract: string }) => {
        const campaignContractPub = PublicKey.fromBase58(args.campaignContract);
        state.CampaignContract = new state.ZkAppPlatform!.Campaign.CampaignContract!(campaignContractPub);
    },

    createCampaign: async (args: {
        sender: string;
        projectId: string;
        committeeId: string;
        startFunding: string;
        startParticipation: string;
        startRequesting: string;
        ipfsHash: string;
        keyId: string;
    }) => {
        const sender = PublicKey.fromBase58(args.sender);
        await fetchAccount({ publicKey: sender });
        await fetchAccount({ publicKey: state.CampaignContract!.address });

        const transaction = await Mina.transaction(sender, async () => {
            await state.CampaignContract!.createCampaign(
                new Storage.CampaignStorage.Timeline({
                    startFunding: UInt64.from(args.startFunding),
                    startParticipation: UInt64.from(args.startParticipation),
                    startRequesting: UInt64.from(args.startRequesting),
                }),
                IpfsHash.fromString(args.ipfsHash),
                new Field(args.committeeId),
                Field(args.keyId)
            );
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
