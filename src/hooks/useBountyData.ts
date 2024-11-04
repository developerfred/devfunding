import { devFundingConfig } from "@/lib/contract/config";
import { useReadContract } from "wagmi";

export function useBountyData(bountyId) {
	const {
		data: bounty,
		isLoading,
		error,
	} = useReadContract({
		address: devFundingConfig.address,
		abi: devFundingConfig.abi,
		functionName: "bounties",
		args: [BigInt(bountyId)],
	});

	return {
		bounty: bounty
			? {
					creator: bounty[0],
					amount: bounty[1],
					issueLink: bounty[2],
					deadline: bounty[3],
					isActive: bounty[4],
					referrer: bounty[5],
				}
			: null,
		isLoading,
		error,
	};
}
