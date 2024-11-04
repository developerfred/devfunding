/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment  */
/* eslint-disable @typescript-eslint/no-explicit-any,  @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { devFundingConfig } from "@/lib/contract/config";
import { useEffect } from "react";

import { useReadContract, useReadContracts } from "wagmi";

const isDev = process.env.NODE_ENV === "development";

function logDebug(...args: any[]) {
	if (isDev) {
		console.debug(...args);
	}
}

interface Grant {
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

export function useGrantsManager(): {
	grants: Grant[];
	isLoading: boolean;
	error: Error | null;
	grantCount: number;
} {
	const {
		data: grantCountData,
		isLoading: isGrantCountLoading,
		error: grantCountError,
	} = useReadContract({
		...devFundingConfig,
		functionName: "grantCount",
		onSuccess: (data) => logDebug("📊 Grant count loaded:", data?.toString()),
		onError: (err) => console.error("❌ Error loading grant count:", err),
	});

	const {
		data: grantsData,
		isLoading: isGrantsLoading,
		error: grantsError,
	} = useReadContracts({
		contracts: Array.from({ length: Number(grantCountData || 0) }, (_, i) => ({
			...devFundingConfig,
			functionName: "grants",
			args: [BigInt(i)],
		})),
		onSuccess: (data) => logDebug("📝 Grants loaded:", data),
		onError: (err) => console.error("❌ Error loading grants:", err),
	});

	useEffect(() => {
		if (isDev) {
			console.group("🔄 Grants Manager Data Processing");
			console.log("Total Grants:", grantCountData?.toString());
			console.log("All Grants:", grantsData);
			console.groupEnd();
		}
	}, [grantCountData, grantsData]);

	const grants: Grant[] =
		grantsData?.map((data, index) => ({
			id: index,
			creator: data.result[0],
			amount: BigInt(data.result[1].toString()),
			description: data.result[2],
			requirements: data.result[3],
			deadline: BigInt(data.result[4].toString()),
			isActive: data.result[5],
			applicantsCount: Number(data.result[6]),
			selectedDev: data.result[7],
			isClaimed: data.result[8],
			referrer: data.result[9],
			escrowContract: data.result[10],
		})) || [];

	const isLoading = isGrantCountLoading || isGrantsLoading;
	const error = grantCountError || grantsError;

	return {
		grants,
		isLoading,
		error: error as Error | null,
		grantCount: Number(grantCountData) || 0,
	};
}
