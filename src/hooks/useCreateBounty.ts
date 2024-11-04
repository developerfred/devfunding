import { devFundingConfig } from "@/lib/contract/config";
import { http, createPublicClient, parseEther } from "viem";
import { morphHolesky } from "viem/chains";
import { useAccount, useWriteContract } from "wagmi";

const publicClient = createPublicClient({
	chain: morphHolesky,
	transport: http(process.env.REACT_APP_RPC_URL),
});

export function useCreateBounty() {
	const { address } = useAccount();
	const { writeContract, isPending, isError, isSuccess, error } =
		useWriteContract();

	const createBounty = async ({ amount, issueLink, duration, referrer }) => {
		try {
			const durationInDays = BigInt(duration);
			const parsedAmount = parseEther(amount);
			const referrerAddress = referrer || address;

			const tx = await writeContract({
				address: devFundingConfig.address,
				abi: devFundingConfig.abi,
				functionName: "createBounty",
				args: [parsedAmount, issueLink, durationInDays, referrerAddress],
			});

			await publicClient.waitForTransactionReceipt({ hash: tx.hash });
			return true;
		} catch (err) {
			console.error("Error creating bounty:", err);
			throw err;
		}
	};

	const createHighlightedBounty = async ({
		amount,
		issueLink,
		duration,
		referrer,
	}) => {
		try {
			const durationInDays = BigInt(duration);
			const parsedAmount = parseEther(amount);
			const referrerAddress = referrer || address;

			await writeContract({
				address: devFundingConfig.address,
				abi: devFundingConfig.abi,
				functionName: "createHighlightedBounty",
				args: [parsedAmount, issueLink, durationInDays, referrerAddress],
			});

			return true;
		} catch (err) {
			console.error("Error creating highlighted bounty:", err);
			throw err;
		}
	};

	const contributeToBounty = async (bountyId, amount) => {
		try {
			const parsedAmount = parseEther(amount);

			await writeContract({
				address: devFundingConfig.address,
				abi: devFundingConfig.abi,
				functionName: "contributeToBounty",
				args: [BigInt(bountyId), parsedAmount],
			});

			return true;
		} catch (err) {
			console.error("Error contributing to bounty:", err);
			throw err;
		}
	};

	return {
		createBounty,
		createHighlightedBounty,
		contributeToBounty,
		isPending,
		isError,
		isSuccess,
		error,
	};
}
