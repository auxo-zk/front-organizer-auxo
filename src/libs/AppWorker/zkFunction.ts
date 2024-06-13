import { Field, Mina, PublicKey, UInt64, fetchAccount } from 'o1js';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import { Storage, type ZkApp as ZkAppPlatform } from '@auxo-dev/platform';
import { AddressWitness, DkgLevel1Witness, ZkAppRef, type ZkApp as ZkAppDkg } from '@auxo-dev/dkg';
import { ArgumentTypes } from 'src/global.config';
import { FileSystem } from 'src/states/cache';
import { IpfsHash } from '@auxo-dev/auxo-libs';
import { NetworkId } from 'src/constants';
import { chainInfo } from 'src/constants/chainInfo';
import { TResponseCampaignCreateData } from 'src/services/campaign/api';

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
    compileDone: 0 as number,
    networkId: null as null | NetworkId,
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
        state.networkId = args.chainId;
    },
    getNetworkId: async (args: {}) => {
        return state.networkId;
    },
    loadContract: async (args: {}) => {
        const [{ ZkApp: ZkAppPlatform }, { ZkApp: ZkAppDkg }] = await Promise.all([import('@auxo-dev/platform'), import('@auxo-dev/dkg')]);
        state.ZkAppPlatform = ZkAppPlatform;
        state.ZkAppDkg = ZkAppDkg;
    },
    getPercentageComplieDone: async (args: {}) => {
        return ((state.compileDone / 20) * 100).toFixed(0);
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
        console.log('1. compile UpdateTask done');
        state.compileDone += 1;

        await state.ZkAppDkg!.Requester.RequesterContract.compile({ cache: FileSystem(args.fileCache) }); // 2
        console.log('2. compile RequesterContract done');
        state.compileDone += 1;

        await state.ZkAppDkg!.DKG.UpdateKey.compile({ cache: FileSystem(args.fileCache) }); // 3
        console.log('3. compile UpdateKey done');
        state.compileDone += 1;

        await state.ZkAppDkg!.DKG.DkgContract.compile({ cache: FileSystem(args.fileCache) }); // 4
        console.log('4. compile DkgContract done');
        state.compileDone += 1;

        await state.ZkAppDkg!.Request.ComputeResult.compile({ cache: FileSystem(args.fileCache) }); // 5
        console.log('5. compile ComputeResult done');
        state.compileDone += 1;

        await state.ZkAppDkg!.Request.UpdateRequest.compile({ cache: FileSystem(args.fileCache) }); // 6
        console.log('6. compile UpdateRequest done');
        state.compileDone += 1;

        await state.ZkAppDkg!.Request.RequestContract.compile({ cache: FileSystem(args.fileCache) }); // 7
        console.log('7. compile RequestContract done');
        state.compileDone += 1;

        await state.ZkAppPlatform!.Project.RollupProject.compile({ cache: FileSystem(args.fileCache) }); // 8
        console.log('8. compile RollupProject done');
        state.compileDone += 1;

        await state.ZkAppPlatform!.Campaign.RollupCampaign.compile({ cache: FileSystem(args.fileCache) }); // 9
        console.log('9. compile RollupCampaign done');
        state.compileDone += 1;

        await state.ZkAppPlatform!.Participation.RollupParticipation.compile({ cache: FileSystem(args.fileCache) }); // 10
        console.log('10. compile RollupParticipation done');
        state.compileDone += 1;

        await state.ZkAppPlatform!.Funding.RollupFunding.compile({ cache: FileSystem(args.fileCache) }); // 11
        console.log('11. compile RollupFunding done');
        state.compileDone += 1;

        await state.ZkAppPlatform!.TreasuryManager.RollupTreasuryManager.compile({ cache: FileSystem(args.fileCache) }); // 12
        console.log('12. compile RollupTreasuryManager done');
        state.compileDone += 1;

        await state.ZkAppPlatform!.Project.ProjectContract.compile({ cache: FileSystem(args.fileCache) }); // 13
        console.log('13. compile ProjectContract done');
        state.compileDone += 1;

        await state.ZkAppPlatform!.Campaign.CampaignContract.compile({ cache: FileSystem(args.fileCache) }); // 14
        console.log('14. compile CampaignContract done');
        state.compileDone += 1;

        await state.ZkAppPlatform!.Participation.ParticipationContract.compile({ cache: FileSystem(args.fileCache) }); // 15
        console.log('15. compile ParticipationContract done');
        state.compileDone += 1;

        await state.ZkAppPlatform!.Funding.FundingContract.compile({ cache: FileSystem(args.fileCache) }); // 16
        console.log('16. compile FundingContract done');
        state.compileDone += 1;

        await state.ZkAppPlatform!.TreasuryManager.TreasuryManagerContract.compile({ cache: FileSystem(args.fileCache) }); // 17
        console.log('17. compile TreasuryManagerContract done');
        state.compileDone += 1;

        await state.ZkAppPlatform!.Commitment.RollupCommitment.compile({ cache: FileSystem(args.fileCache) }); // 18
        console.log('18. compile RollupCommitment done');
        state.compileDone += 1;

        await state.ZkAppPlatform!.Commitment.CommitmentContract.compile({ cache: FileSystem(args.fileCache) }); // 19
        console.log('19. compile CommitmentContract done');
        state.compileDone += 1;

        await state.ZkAppPlatform!.Vesting.VestingContract.compile({ cache: FileSystem(args.fileCache) }); // 20
        console.log('20. compile VestingContract done');
        state.compileDone += 1;
    },
    fetchAccount: async (args: { publicKey58: string }) => {
        const publicKey = PublicKey.fromBase58(args.publicKey58);
        return await fetchAccount({ publicKey });
    },
    initZkappInstance: async (args: { campaignContract: string; dkgContract: string; fundingRequesterContract: string }) => {
        const campaignContractPub = PublicKey.fromBase58(args.campaignContract);
        state.CampaignContract = new state.ZkAppPlatform!.Campaign.CampaignContract!(campaignContractPub);

        const dkgContractPub = PublicKey.fromBase58(args.dkgContract);
        state.DkgContract = new state.ZkAppDkg!.DKG.DkgContract!(dkgContractPub);

        const fundingRequesterPub = PublicKey.fromBase58(args.fundingRequesterContract);
        state.FundingRequesterContract = new state.ZkAppDkg!.Requester.RequesterContract!(fundingRequesterPub);
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
        backendData: TResponseCampaignCreateData;
    }) => {
        const sender = PublicKey.fromBase58(args.sender);
        await fetchAccount({ publicKey: sender });
        await fetchAccount({ publicKey: state.CampaignContract!.address });
        await fetchAccount({ publicKey: state.DkgContract!.address });
        await fetchAccount({ publicKey: state.FundingRequesterContract!.address });

        const transaction = await Mina.transaction(sender, async () => {
            await state.CampaignContract!.createCampaign(
                new Storage.CampaignStorage.Timeline({
                    startFunding: UInt64.from(args.startFunding),
                    startParticipation: UInt64.from(args.startParticipation),
                    startRequesting: UInt64.from(args.startRequesting),
                }),
                IpfsHash.fromString(args.ipfsHash),
                new Field(args.committeeId),
                new Field(args.keyId),
                DkgLevel1Witness.fromJSON(args.backendData.keyStatusWitness),
                AddressWitness.fromJSON(args.backendData.campaignContractWitness),
                ZkAppRef.fromJSON(args.backendData.dkgContractRef),
                ZkAppRef.fromJSON(args.backendData.requesterContractRef)
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
