export interface Developer {
	githubHandle: string;
	completedGrants: number;
	reputation: number;
	isVerified: boolean;
	portfolioUrl: string;
	isPremium: boolean;
	skills: string[];
}

export interface Grant {
	id: number;
	creator: string;
	amount: bigint;
	description: string;
	requirements: string;
	deadline: bigint;
	isActive: boolean;
	applicantsCount: number;
	selectedDev: string;
	isClaimed: boolean;
	referrer: string;
	escrowContract: string;
}

export interface Bounty {
	id: number;
	creator: string;
	amount: number;
	issueLink: string;
	deadline: number;
	isActive: boolean;
	referrer: string;
}

export interface Dispute {
	isDispute: boolean;
	isDisputeResolved: boolean;
	resolutionOutcome: string;
	yesVotes: number;
	noVotes: number;
}

export type Currency = "ENT" | "USD" | "EUR";

export interface FormData {
	amount: string;
	currency: Currency;
	description: string;
	requirements: string;
	durationDays: string;
	referrer: string;
}

export interface Dispute {
	id: number;
	grantOrBountyId: number;
	isDisputeResolved: boolean;
	resolutionOutcome: string;
	yesVotes: number;
	noVotes: number;
	createdAt: number;
	disputeInitiator: string;
}
