/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment  */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

import { devFundingConfig } from "@/lib/contract/config";
import { morphHolesky } from "@reown/appkit/networks";
import { useEffect, useState } from "react";
import { http, createPublicClient } from "viem";

interface Developer {
	address: string;
	githubHandle: string;
	reputation: number;
	completedGrants: number;
	grantsCreated: number;
	grantsClaimed: number;
	referralCount: number;
	referralEarnings: string;
	isVerified: boolean;
	isPremium: boolean;
}

export function useDevelopersList(): {
	developers: Developer[];
	isLoading: boolean;
	error: Error | null;
} {
	const [developers, setDevelopers] = useState<Developer[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchDevelopers = async () => {
			setIsLoading(true);
			try {
				const publicClient = createPublicClient({
					chain: morphHolesky,
					transport: http(),
				});

				// Get the total number of grants
				const grantCount = (await publicClient.readContract({
					...devFundingConfig,
					functionName: "grantCount",
				})) as bigint;

				const grants = await Promise.all(
					Array.from({ length: Number(grantCount) }, (_, index) =>
						publicClient.readContract({
							...devFundingConfig,
							functionName: "grants",
							args: [BigInt(index)],
						}),
					),
				);

				// Collect unique developer addresses from grants
				const addresses = new Set<string>([
					...grants.map((grant) => grant[0]), // Grant creators
					...grants.map((grant) => grant[7]), // Selected developers
				]);

				const devsList: Developer[] = [];

				for (const address of addresses) {
					const developer = (await publicClient.readContract({
						...devFundingConfig,
						functionName: "developers",
						args: [address],
					})) as any[];

					if (developer[0]) {
						// Check if the developer exists
						devsList.push({
							address: address,
							githubHandle: developer[0],
							reputation: Number(developer[2]),
							completedGrants: Number(developer[1]),
							grantsCreated: grants.filter((g) => g[0] === address).length, // Number of grants created
							grantsClaimed: grants.filter((g) => g[7] === address && g[8])
								.length, // Number of grants claimed
							referralCount: Number(
								await publicClient.readContract({
									...devFundingConfig,
									functionName: "referralCount",
									args: [address],
								}),
							),
							referralEarnings: (
								await publicClient.readContract({
									...devFundingConfig,
									functionName: "referralEarnings",
									args: [address],
								})
							).toString(),
							isVerified: developer[3],
							isPremium: developer[5],
						});
					}
				}

				setDevelopers(devsList);
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error("Failed to fetch developers list"),
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDevelopers();
	}, []);

	return { developers, isLoading, error };
}
