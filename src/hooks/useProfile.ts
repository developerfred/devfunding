/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

import { devFundingConfig } from "@/lib/contract/config";
import { morph } from "@reown/appkit/networks";

import { useEffect, useState } from "react";
import { http, createPublicClient } from "viem";

const isDev = process.env.NODE_ENV === "development";

function logDebug(...args: any[]) {
	if (isDev) {
		console.debug(...args);
	}
}

interface Profile {
	githubHandle: string;
	reputation: string; // Changed to string to avoid BigInt issues
	completedGrants: number;
	isVerified: boolean;
	isPremium: boolean;
	portfolioUrl: string;
	grantsCreated: number;
	grantsClaimed: number;
	referralCount: number;
	referralEarnings: string;
}

export function useProfile(address: string | null): {
	profile: Profile | null;
	isLoading: boolean;
	error: Error | null;
} {
	const [profile, setProfile] = useState<Profile | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchProfileData = async () => {
			setIsLoading(true);
			try {
				const publicClient = createPublicClient({
					chain: morph,
					transport: http(),
				});

				if (address) {
					// Fetch developer details
					const developer = (await publicClient.readContract({
						...devFundingConfig,
						functionName: "developers",
						args: [address],
					})) as any[];

					// Fetch grants data
					const grantCount = (await publicClient.readContract({
						...devFundingConfig,
						functionName: "grantCount",
					})) as bigint;
					logDebug("📊 Grant count loaded:", grantCount);

					// Convert BigInt to Number, ensuring it's within safe integer limits
					const safeGrantCount = Number(grantCount);
					if (
						safeGrantCount === Number.POSITIVE_INFINITY ||
						safeGrantCount === Number.NEGATIVE_INFINITY
					) {
						throw new Error("Grant count is too large to handle");
					}

					const grants = (await Promise.all(
						Array.from({ length: safeGrantCount }, (_, index) =>
							publicClient.readContract({
								...devFundingConfig,
								functionName: "grants",
								args: [BigInt(index)],
							}),
						),
					)) as any[];

					const grantsCreated = grants.filter((g) => g[0] === address).length;
					const grantsClaimed = grants.filter(
						(g) => g[7] === address && g[8],
					).length;

					// Fetch referral data
					const referralCount = (await publicClient.readContract({
						...devFundingConfig,
						functionName: "referralCount",
						args: [address],
					})) as bigint;

					const referralEarnings = (await publicClient.readContract({
						...devFundingConfig,
						functionName: "referralEarnings",
						args: [address],
					})) as bigint;

					setProfile({
						githubHandle: developer[0],
						reputation: developer[2].toString(), // Convert BigInt to string
						completedGrants: Number(developer[1]), // Assuming this is safe to convert
						isVerified: developer[3],
						isPremium: developer[5],
						portfolioUrl: developer[4],
						grantsCreated,
						grantsClaimed,
						referralCount: Number(referralCount), // Convert BigInt to Number
						referralEarnings: referralEarnings.toString(),
					});
				}
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error("Failed to fetch profile data"),
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProfileData();
	}, [address]);

	return { profile, isLoading, error };
}

export default useProfile;
