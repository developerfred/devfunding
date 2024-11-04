/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	http,
	type PublicClient,
	type WalletClient,
	createPublicClient,
	createWalletClient,
	custom,
} from "viem";
import { morphHolesky } from "viem/chains";
import { contractAddress, devFundingConfig } from "./config";

export const publicClient = createPublicClient({
	chain: morphHolesky,
	transport: http(),
});

export const walletClient: WalletClient | null = null;

export const createViemWalletClient = (provider: any): WalletClient => {
	return createWalletClient({
		chain: morphHolesky,
		transport: custom(provider),
	});
};

const getWalletClient = (): WalletClient => {
	if (!walletClient) {
		throw new Error(
			"Wallet client has not been initialized. Please connect a wallet first.",
		);
	}
	return walletClient;
};

export const contractInteractions = {
	viewFunctions: {
		async getBounty(
			bountyId: number,
			client: PublicClient = publicClient,
		): Promise<any[]> {
			return client.readContract({
				abi: devFundingConfig.abi,
				address: devFundingConfig.address,
				functionName: "bounties",
				args: [BigInt(bountyId)],
			});
		},

		async getBountyCount(client: PublicClient = publicClient): Promise<bigint> {
			return client.readContract({
				abi: devFundingConfig.abi,
				address: devFundingConfig.address,
				functionName: "bountyCount",
			});
		},

		async getDeveloperDetails(
			address: string,
			client: PublicClient = publicClient,
		): Promise<any[]> {
			return client.readContract({
				address: devFundingConfig.address,
				abi: devFundingConfig.abi,
				functionName: "developers",
				args: [address],
			});
		},

		async getGrantCount(client: PublicClient = publicClient): Promise<bigint> {
			return client.readContract({
				abi: devFundingConfig.abi,
				address: devFundingConfig.address,
				functionName: "grantCount",
			});
		},

		async getGrant(
			grantId: number,
			client: PublicClient = publicClient,
		): Promise<any[]> {
			return client.readContract({
				abi: devFundingConfig.abi,
				address: devFundingConfig.address,
				functionName: "grants",
				args: [BigInt(grantId)],
			});
		},

		async hasAppliedForGrant(
			grantId: number,
			applicant: string,
			client: PublicClient = publicClient,
		): Promise<boolean> {
			return client.readContract({
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "hasAppliedForGrant",
				args: [BigInt(grantId), applicant],
			});
		},

		async isPremiumUser(
			user: string,
			client: PublicClient = publicClient,
		): Promise<boolean> {
			return client.readContract({
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "isPremiumUser",
				args: [user],
			});
		},

		async getPlatformFeeBps(
			client: PublicClient = publicClient,
		): Promise<bigint> {
			return client.readContract({
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "platformFeeBps",
			});
		},

		async getPlatformToken(
			client: PublicClient = publicClient,
		): Promise<string> {
			return client.readContract({
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "platformToken",
			});
		},

		async getPremiumExpiryTime(
			user: string,
			client: PublicClient = publicClient,
		): Promise<bigint> {
			return client.readContract({
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "premiumExpiryTime",
				args: [user],
			});
		},

		async getPremiumPrice(
			client: PublicClient = publicClient,
		): Promise<bigint> {
			return client.readContract({
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "premiumPrice",
			});
		},

		async getProposalCount(
			client: PublicClient = publicClient,
		): Promise<bigint> {
			return client.readContract({
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "proposalCount",
			});
		},

		async getProposal(
			proposalId: number,
			client: PublicClient = publicClient,
		): Promise<string> {
			return client.readContract({
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "proposals",
				args: [BigInt(proposalId)],
			});
		},

		async getReferralCount(
			address: string,
			client: PublicClient = publicClient,
		): Promise<bigint> {
			return client.readContract({
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "referralCount",
				args: [address],
			});
		},

		async getReferralEarnings(
			address: string,
			client: PublicClient = publicClient,
		): Promise<bigint> {
			return client.readContract({
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "referralEarnings",
				args: [address],
			});
		},

		async getReferralFeeBps(
			client: PublicClient = publicClient,
		): Promise<bigint> {
			return client.readContract({
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "referralFeeBps",
			});
		},

		async getReferredBy(
			address: string,
			client: PublicClient = publicClient,
		): Promise<string> {
			return client.readContract({
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "referredBy",
				args: [address],
			});
		},

		async getVotes(
			proposalId: number,
			client: PublicClient = publicClient,
		): Promise<bigint> {
			return client.readContract({
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "votes",
				args: [BigInt(proposalId)],
			});
		},

        async disputes(id: number, client: PublicClient = publicClient): Promise<[boolean, string, bigint, bigint, bigint]> {
            return client.readContract({
                address: devFundingConfig.address,
                abi: devFundingConfig.abi,
                functionName: 'disputes',
                args: [BigInt(id)],
            });
        },
	},
	writeFunctions: {
		async applyForGrant(grantId: number): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				abi: devFundingConfig.abi,
				address: devFundingConfig.address,
				functionName: "applyForGrant",
				args: [BigInt(grantId)],
			});
			return client.writeContract(request);
		},

		async createBounty(
			amount: bigint,
			issueLink: string,
			durationDays: number,
			referrer: string,
		): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "createBounty",
				args: [amount, issueLink, BigInt(durationDays), referrer],
			});
			return client.writeContract(request);
		},

		async createDevProfile(
			githubHandle: string,
			skills: string[],
			portfolioUrl: string,
		): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				abi: devFundingConfig.abi,
				address: devFundingConfig.address,
				functionName: "createDevProfile",
				args: [githubHandle, skills, portfolioUrl],
			});
			return client.writeContract(request);
		},

		createGrant: async (
      amount: bigint,
      description: string,
      requirements: string, 
      durationDays: number,
      referrer: `0x${string}`
    ) => {
      try {        
        const provider = (window as any).ethereum
        if (!provider) {
          throw new Error('No wallet provider found')
        }

        // Criar wallet client
        const walletClient = createViemWalletClient(provider)
        
        // Obter endereço da conta conectada
        const [address] = await walletClient.getAddresses()

        // Preparar a transação
        const { request } = await publicClient.simulateContract({
          address: devFundingConfig.address,
          abi: devFundingConfig.abi,
          functionName: 'createGrant',
          args: [amount, description, requirements, BigInt(durationDays), referrer],
          account: address,
        })

        // Enviar a transação
        const hash = await walletClient.writeContract(request)
        
        // Aguardar confirmação
        const receipt = await publicClient.waitForTransactionReceipt({ 
          hash 
        })

        return receipt
		} catch (error) {
        console.error('Error in createGrant:', error)
        throw error
      }
    },

		async withdrawReferralEarnings(): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "withdrawReferralEarnings",
			});
			return client.writeContract(request);
		},

		async withdrawPlatformFees(): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "withdrawPlatformFees",
			});
			return client.writeContract(request);
		},

		async cancelGrant(client: WalletClient, grantId: number): Promise<any> {
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "cancelGrant",
				args: [BigInt(grantId)],
			});
			return client.writeContract(request);
		},

		async claimGrant(client: WalletClient, grantId: number): Promise<any> {
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "claimGrant",
				args: [BigInt(grantId)],
			});
			return client.writeContract(request);
		},

		async contributeToBounty(
			client: WalletClient,
			bountyId: number,
			amount: bigint,
		): Promise<any> {
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "contributeToBounty",
				args: [BigInt(bountyId), amount],
			});
			return client.writeContract(request);
		},

		async manageBountyContribution(
			bountyId: number,
			amount: bigint,
			isAdding: boolean,
		): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "manageBountyContribution",
				args: [BigInt(bountyId), amount, isAdding],
			});
			return client.writeContract(request);
		},

		async proposeImprovement(proposal: string): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "proposeImprovement",
				args: [proposal],
			});
			return client.writeContract(request);
		},

		async purchasePremium(durationMonths: number): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "purchasePremium",
				args: [BigInt(durationMonths)],
			});
			return client.writeContract(request);
		},

		async raiseDispute(id: number): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "raiseDispute",
				args: [BigInt(id)],
			});
			return client.writeContract(request);
		},

		async recordDeveloperActivity(
			developer: string,
			activityDescription: string,
		): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "recordDeveloperActivity",
				args: [developer, activityDescription],
			});
			return client.writeContract(request);
		},

		async registerReferral(referrer: string): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "registerReferral",
				args: [referrer],
			});
			return client.writeContract(request);
		},

		async renewPremium(additionalMonths: number): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "renewPremium",
				args: [BigInt(additionalMonths)],
			});
			return client.writeContract(request);
		},

		async selectDeveloper(grantId: number, developer: string): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "selectDeveloper",
				args: [BigInt(grantId), developer],
			});
			return client.writeContract(request);
		},

		async sendMessage(grantOrBountyId: number, message: string): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "sendMessage",
				args: [BigInt(grantOrBountyId), message],
			});
			return client.writeContract(request);
		},

		async transferGrant(grantId: number, newCreator: string): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "transferGrant",
				args: [BigInt(grantId), newCreator],
			});
			return client.writeContract(request);
		},

		async updateDevProfile(
			githubHandle: string,
			skills: string[],
			portfolioUrl: string,
		): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "updateDevProfile",
				args: [githubHandle, skills, portfolioUrl],
			});
			return client.writeContract(request);
		},

		async updatePlatformFee(newFeeBps: bigint): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "updatePlatformFee",
				args: [newFeeBps],
			});
			return client.writeContract(request);
		},

		async updatePremiumPrice(newPrice: bigint): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "updatePremiumPrice",
				args: [newPrice],
			});
			return client.writeContract(request);
		},

		async verifyDeveloper(devAddress: string): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "verifyDeveloper",
				args: [devAddress],
			});
			return client.writeContract(request);
		},

		async voteForProposal(proposalId: number): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "voteForProposal",
				args: [BigInt(proposalId)],
			});
			return client.writeContract(request);
		},

		async voteOnDispute(id: number, vote: boolean): Promise<any> {
			const client = getWalletClient();
			const [address] = await client.requestAddresses();
			const { request } = await publicClient.simulateContract({
				account: address,
				address: contractAddress,
				abi: devFundingConfig.abi,
				functionName: "voteOnDispute",
				args: [BigInt(id), vote],
			});
			return client.writeContract(request);
		},
	},
};
