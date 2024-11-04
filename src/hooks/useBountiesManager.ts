import { devFundingConfig } from "@/lib/contract/config";
import { useEffect } from "react";
import { useReadContract, useReadContracts } from "wagmi";

const isDev = process.env.NODE_ENV === "development";

function logDebug(...args) {
	if (isDev) {
		console.debug(...args);
	}
}

export function useBountiesManager() {
	const {
		data: bountyCountData,
		isLoading: isBountyCountLoading,
		error: bountyCountError,
	} = useReadContract({
		...devFundingConfig,
		functionName: "bountyCount",
		onSuccess: (data) => logDebug("📊 Bounty count loaded:", data?.toString()),
		onError: (err) => console.error("❌ Error loading bounty count:", err),
	});

	const {
		data: bountiesData,
		isLoading: isBountiesLoading,
		error: bountiesError,
	} = useReadContracts({
		contracts: Array.from({ length: Number(bountyCountData || 0) }, (_, i) => ({
			...devFundingConfig,
			functionName: "bounties",
			args: [BigInt(i)],
		})),
		onSuccess: (data) => logDebug("📝 Bounties loaded:", data),
		onError: (err) => console.error("❌ Error loading bounties:", err),
	});

	useEffect(() => {
		if (isDev) {
			console.group("🔄 Bounties Manager Data Processing");
			console.log("Total Bounties:", bountyCountData?.toString());
			console.log("All Bounties:", bountiesData);
			console.groupEnd();
		}
	}, [bountyCountData, bountiesData]);

	const bounties =
		bountiesData?.map((data, index) => ({
			id: index,
			creator: data.result[0],
			amount: data.result[1],
			issueLink: data.result[2],
			deadline: data.result[3],
			isActive: data.result[4],
			referrer: data.result[5],
		})) || [];

	const isLoading = isBountyCountLoading || isBountiesLoading;
	const error = bountyCountError || bountiesError;

	return {
		bounties,
		isLoading,
		error,
		bountyCount: bountyCountData,
	};
}
