/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Address } from "viem";

export const contractAddress =
	"0x8bDD366A31aBadf21818917Ce286Ea1543990d98" as const;

export const devFundingConfig = {
	address: contractAddress as Address,
	abi: [
		{
			type: "constructor",
			inputs: [
				{ name: "_platformToken", type: "address", internalType: "address" },
			],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "applyForGrant",
			inputs: [{ name: "grantId", type: "uint256", internalType: "uint256" }],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "bounties",
			inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			outputs: [
				{ name: "creator", type: "address", internalType: "address" },
				{ name: "amount", type: "uint256", internalType: "uint256" },
				{ name: "issueLink", type: "string", internalType: "string" },
				{ name: "deadline", type: "uint256", internalType: "uint256" },
				{ name: "isActive", type: "bool", internalType: "bool" },
				{ name: "referrer", type: "address", internalType: "address" },
			],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "bountyCount",
			inputs: [],
			outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "cancelGrant",
			inputs: [{ name: "grantId", type: "uint256", internalType: "uint256" }],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "checkAndUpdatePremiumStatus",
			inputs: [{ name: "user", type: "address", internalType: "address" }],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "checkPremiumStatus",
			inputs: [{ name: "user", type: "address", internalType: "address" }],
			outputs: [
				{ name: "", type: "bool", internalType: "bool" },
				{ name: "", type: "uint256", internalType: "uint256" },
			],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "claimGrant",
			inputs: [{ name: "grantId", type: "uint256", internalType: "uint256" }],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "contributeToBounty",
			inputs: [
				{ name: "bountyId", type: "uint256", internalType: "uint256" },
				{ name: "amount", type: "uint256", internalType: "uint256" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "createBounty",
			inputs: [
				{ name: "amount", type: "uint256", internalType: "uint256" },
				{ name: "issueLink", type: "string", internalType: "string" },
				{ name: "durationDays", type: "uint256", internalType: "uint256" },
				{ name: "referrer", type: "address", internalType: "address" },
			],
			outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "createDevProfile",
			inputs: [
				{ name: "githubHandle", type: "string", internalType: "string" },
				{ name: "skills", type: "string[]", internalType: "string[]" },
				{ name: "portfolioUrl", type: "string", internalType: "string" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "createDisputeBoard",
			inputs: [
				{ name: "_id", type: "uint256", internalType: "uint256" },
				{ name: "_members", type: "address[]", internalType: "address[]" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "createGrant",
			inputs: [
				{ name: "amount", type: "uint256", internalType: "uint256" },
				{ name: "description", type: "string", internalType: "string" },
				{ name: "requirements", type: "string", internalType: "string" },
				{ name: "durationDays", type: "uint256", internalType: "uint256" },
				{ name: "referrer", type: "address", internalType: "address" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "createHighlightedBounty",
			inputs: [
				{ name: "amount", type: "uint256", internalType: "uint256" },
				{ name: "issueLink", type: "string", internalType: "string" },
				{ name: "durationDays", type: "uint256", internalType: "uint256" },
				{ name: "referrer", type: "address", internalType: "address" },
			],
			outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "createHighlightedGrant",
			inputs: [
				{ name: "amount", type: "uint256", internalType: "uint256" },
				{ name: "description", type: "string", internalType: "string" },
				{ name: "requirements", type: "string", internalType: "string" },
				{ name: "durationDays", type: "uint256", internalType: "uint256" },
				{ name: "referrer", type: "address", internalType: "address" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "devBounties",
			inputs: [
				{ name: "", type: "address", internalType: "address" },
				{ name: "", type: "uint256", internalType: "uint256" },
			],
			outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "devGrants",
			inputs: [
				{ name: "", type: "address", internalType: "address" },
				{ name: "", type: "uint256", internalType: "uint256" },
			],
			outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "developers",
			inputs: [{ name: "", type: "address", internalType: "address" }],
			outputs: [
				{ name: "githubHandle", type: "string", internalType: "string" },
				{ name: "completedGrants", type: "uint256", internalType: "uint256" },
				{ name: "reputation", type: "uint256", internalType: "uint256" },
				{ name: "isVerified", type: "bool", internalType: "bool" },
				{ name: "portfolioUrl", type: "string", internalType: "string" },
				{ name: "isPremium", type: "bool", internalType: "bool" },
			],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "disputes",
			inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			outputs: [
				{ name: "isDispute", type: "bool", internalType: "bool" },
				{ name: "isDisputeResolved", type: "bool", internalType: "bool" },
				{ name: "resolutionOutcome", type: "string", internalType: "string" },
				{ name: "startTime", type: "uint256", internalType: "uint256" },
				{ name: "yesVotes", type: "uint256", internalType: "uint256" },
				{ name: "noVotes", type: "uint256", internalType: "uint256" },
			],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "grantCount",
			inputs: [],
			outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "grants",
			inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			outputs: [
				{ name: "creator", type: "address", internalType: "address" },
				{ name: "amount", type: "uint256", internalType: "uint256" },
				{ name: "description", type: "string", internalType: "string" },
				{ name: "requirements", type: "string", internalType: "string" },
				{ name: "deadline", type: "uint256", internalType: "uint256" },
				{ name: "isActive", type: "bool", internalType: "bool" },
				{ name: "applicantsCount", type: "uint256", internalType: "uint256" },
				{ name: "selectedDev", type: "address", internalType: "address" },
				{ name: "isClaimed", type: "bool", internalType: "bool" },
				{ name: "referrer", type: "address", internalType: "address" },
				{ name: "escrowContract", type: "address", internalType: "address" },
			],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "hasAppliedForGrant",
			inputs: [
				{ name: "grantId", type: "uint256", internalType: "uint256" },
				{ name: "applicant", type: "address", internalType: "address" },
			],
			outputs: [{ name: "", type: "bool", internalType: "bool" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "isPremiumUser",
			inputs: [{ name: "", type: "address", internalType: "address" }],
			outputs: [{ name: "", type: "bool", internalType: "bool" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "manageBountyContribution",
			inputs: [
				{ name: "bountyId", type: "uint256", internalType: "uint256" },
				{ name: "amount", type: "uint256", internalType: "uint256" },
				{ name: "isAdding", type: "bool", internalType: "bool" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "messages",
			inputs: [
				{ name: "", type: "uint256", internalType: "uint256" },
				{ name: "", type: "uint256", internalType: "uint256" },
			],
			outputs: [{ name: "", type: "string", internalType: "string" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "owner",
			inputs: [],
			outputs: [{ name: "", type: "address", internalType: "address" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "platformFeeBps",
			inputs: [],
			outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "platformToken",
			inputs: [],
			outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "premiumExpiryTime",
			inputs: [{ name: "", type: "address", internalType: "address" }],
			outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "premiumPrice",
			inputs: [],
			outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "proposalCount",
			inputs: [],
			outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "proposals",
			inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			outputs: [{ name: "", type: "string", internalType: "string" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "proposeImprovement",
			inputs: [{ name: "proposal", type: "string", internalType: "string" }],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "purchasePremium",
			inputs: [
				{ name: "durationMonths", type: "uint256", internalType: "uint256" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "raiseDispute",
			inputs: [{ name: "_id", type: "uint256", internalType: "uint256" }],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "recordDeveloperActivity",
			inputs: [
				{ name: "developer", type: "address", internalType: "address" },
				{ name: "activityDescription", type: "string", internalType: "string" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "referralCount",
			inputs: [{ name: "", type: "address", internalType: "address" }],
			outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "referralEarnings",
			inputs: [{ name: "", type: "address", internalType: "address" }],
			outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "referralFeeBps",
			inputs: [],
			outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "referredBy",
			inputs: [{ name: "", type: "address", internalType: "address" }],
			outputs: [{ name: "", type: "address", internalType: "address" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "registerReferral",
			inputs: [{ name: "referrer", type: "address", internalType: "address" }],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "renewPremium",
			inputs: [
				{ name: "additionalMonths", type: "uint256", internalType: "uint256" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "renounceOwnership",
			inputs: [],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "selectDeveloper",
			inputs: [
				{ name: "grantId", type: "uint256", internalType: "uint256" },
				{ name: "developer", type: "address", internalType: "address" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "sendMessage",
			inputs: [
				{ name: "grantOrBountyId", type: "uint256", internalType: "uint256" },
				{ name: "message", type: "string", internalType: "string" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "transferGrant",
			inputs: [
				{ name: "grantId", type: "uint256", internalType: "uint256" },
				{ name: "newCreator", type: "address", internalType: "address" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "transferOwnership",
			inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "updateDevProfile",
			inputs: [
				{ name: "githubHandle", type: "string", internalType: "string" },
				{ name: "skills", type: "string[]", internalType: "string[]" },
				{ name: "portfolioUrl", type: "string", internalType: "string" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "updatePlatformFee",
			inputs: [{ name: "newFeeBps", type: "uint256", internalType: "uint256" }],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "updatePremiumPrice",
			inputs: [{ name: "newPrice", type: "uint256", internalType: "uint256" }],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "verifyDeveloper",
			inputs: [
				{ name: "devAddress", type: "address", internalType: "address" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "voteForProposal",
			inputs: [
				{ name: "proposalId", type: "uint256", internalType: "uint256" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "voteOnDispute",
			inputs: [
				{ name: "_id", type: "uint256", internalType: "uint256" },
				{ name: "_vote", type: "bool", internalType: "bool" },
			],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "votes",
			inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
			stateMutability: "view",
		},
		{
			type: "function",
			name: "withdrawPlatformFees",
			inputs: [],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "function",
			name: "withdrawReferralEarnings",
			inputs: [],
			outputs: [],
			stateMutability: "nonpayable",
		},
		{
			type: "event",
			name: "BountyContribution",
			inputs: [
				{
					name: "bountyId",
					type: "uint256",
					indexed: true,
					internalType: "uint256",
				},
				{
					name: "contributor",
					type: "address",
					indexed: true,
					internalType: "address",
				},
				{
					name: "amount",
					type: "uint256",
					indexed: true,
					internalType: "uint256",
				},
			],
			anonymous: false,
		},
		{
			type: "event",
			name: "BountyCreated",
			inputs: [
				{
					name: "bountyId",
					type: "uint256",
					indexed: true,
					internalType: "uint256",
				},
				{
					name: "creator",
					type: "address",
					indexed: true,
					internalType: "address",
				},
				{
					name: "amount",
					type: "uint256",
					indexed: false,
					internalType: "uint256",
				},
				{
					name: "issueLink",
					type: "string",
					indexed: false,
					internalType: "string",
				},
				{
					name: "deadline",
					type: "uint256",
					indexed: true,
					internalType: "uint256",
				},
				{
					name: "referrer",
					type: "address",
					indexed: false,
					internalType: "address",
				},
			],
			anonymous: false,
		},
		{
			type: "event",
			name: "DevProfileCreated",
			inputs: [
				{
					name: "developer",
					type: "address",
					indexed: true,
					internalType: "address",
				},
				{
					name: "githubHandle",
					type: "string",
					indexed: false,
					internalType: "string",
				},
			],
			anonymous: false,
		},
		{
			type: "event",
			name: "DisputeRaised",
			inputs: [
				{ name: "id", type: "uint256", indexed: true, internalType: "uint256" },
				{
					name: "raisedBy",
					type: "address",
					indexed: true,
					internalType: "address",
				},
			],
			anonymous: false,
		},
		{
			type: "event",
			name: "DisputeResolved",
			inputs: [
				{ name: "id", type: "uint256", indexed: true, internalType: "uint256" },
				{
					name: "outcome",
					type: "string",
					indexed: true,
					internalType: "string",
				},
			],
			anonymous: false,
		},
		{
			type: "event",
			name: "GrantClaimed",
			inputs: [
				{
					name: "grantId",
					type: "uint256",
					indexed: true,
					internalType: "uint256",
				},
				{
					name: "developer",
					type: "address",
					indexed: true,
					internalType: "address",
				},
			],
			anonymous: false,
		},
		{
			type: "event",
			name: "GrantCreated",
			inputs: [
				{
					name: "grantId",
					type: "uint256",
					indexed: true,
					internalType: "uint256",
				},
				{
					name: "creator",
					type: "address",
					indexed: true,
					internalType: "address",
				},
				{
					name: "amount",
					type: "uint256",
					indexed: false,
					internalType: "uint256",
				},
			],
			anonymous: false,
		},
		{
			type: "event",
			name: "OwnershipTransferred",
			inputs: [
				{
					name: "previousOwner",
					type: "address",
					indexed: true,
					internalType: "address",
				},
				{
					name: "newOwner",
					type: "address",
					indexed: true,
					internalType: "address",
				},
			],
			anonymous: false,
		},
		{
			type: "event",
			name: "PlatformFeeCollected",
			inputs: [
				{
					name: "amount",
					type: "uint256",
					indexed: true,
					internalType: "uint256",
				},
			],
			anonymous: false,
		},
		{
			type: "event",
			name: "PremiumPurchased",
			inputs: [
				{
					name: "user",
					type: "address",
					indexed: true,
					internalType: "address",
				},
				{
					name: "duration",
					type: "uint256",
					indexed: true,
					internalType: "uint256",
				},
			],
			anonymous: false,
		},
		{
			type: "event",
			name: "ReferralPaid",
			inputs: [
				{
					name: "referrer",
					type: "address",
					indexed: true,
					internalType: "address",
				},
				{
					name: "referred",
					type: "address",
					indexed: true,
					internalType: "address",
				},
				{
					name: "amount",
					type: "uint256",
					indexed: true,
					internalType: "uint256",
				},
			],
			anonymous: false,
		},
		{
			type: "event",
			name: "Voted",
			inputs: [
				{ name: "id", type: "uint256", indexed: true, internalType: "uint256" },
				{
					name: "voter",
					type: "address",
					indexed: true,
					internalType: "address",
				},
				{ name: "vote", type: "bool", indexed: true, internalType: "bool" },
			],
			anonymous: false,
		},
		{
			type: "error",
			name: "OwnableInvalidOwner",
			inputs: [{ name: "owner", type: "address", internalType: "address" }],
		},
		{
			type: "error",
			name: "OwnableUnauthorizedAccount",
			inputs: [{ name: "account", type: "address", internalType: "address" }],
		},
		{ type: "error", name: "ReentrancyGuardReentrantCall", inputs: [] },
	] as const,
} as const;

export interface CurrentAd {
	link: string;
	imageUrl: string;
	price: bigint;
	advertiser: Address;
	referrer: Address;
	isActive: boolean;
	engagements: bigint;
	createdAt: bigint;
}

export interface Advertisement {
	link: string;
	imageUrl: string;
	price: bigint;
	advertiser: Address;
	referrer: Address;
	isActive: boolean;
	engagements: bigint;
	createdAt: bigint;
	index?: number;
}

export interface UserStats {
	totalEngagements: bigint;
	engagedAdsCount: bigint;
	level: bigint;
	isActive: boolean;
}

export interface UserDetails {
	reputation: bigint;
	timesChief: bigint;
	referredBy: Address;
	isAdvertiser: boolean;
}

export interface SpecialEvent {
	name: string;
	duration: bigint;
	multiplier: bigint;
}

export const FRESH_DATA_INTERVAL = 30_000;

declare global {
	interface Window {
		ethereum?: {
			isMetaMask?: boolean;
			// @ts-ignore
			request?: (...args: any[]) => Promise<any>;
		};
	}
}
