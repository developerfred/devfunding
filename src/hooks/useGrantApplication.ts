/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment  */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
// @ts-nocheck
import { devFundingConfig } from "@/lib/contract/config";

import { useState } from "react";
import {
	useAccount,
	usePrepareTransactionRequest,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";

export const useGrantApplication = (grantId: string) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { address, isConnected } = useAccount();

	// Prepare the contract write configuration
	const { config } = usePrepareTransactionRequest({
		address: devFundingConfig.address,
		abi: devFundingConfig.abi,
		functionName: "applyForGrant",
		args: [grantId],
		enabled: Boolean(address),
	});

	// Set up the contract write hook
	const { writeContract } = useWriteContract(config);

	// Handle transaction receipt
	const { isLoading: isTransactionLoading, isSuccess: writeSuccess } =
		useWaitForTransactionReceipt({
			hash: writeContract?.hash,
			onSuccess: () => {
				setIsLoading(false);
				setIsSuccess(true);
			},
			onError: (error) => {
				setIsLoading(false);
				setError(error.message);
			},
		});

	const applyForGrant = async () => {
		if (writeContract) {
			try {
				setIsLoading(true);
				await writeContract();
			} catch (error) {
				console.error("Transaction error:", error);
				setIsLoading(false);
				setError("Failed to submit transaction.");
			}
		}
	};

	return {
		isLoading,
		isSuccess,
		error,
		isConnected,
		applyForGrant,
		isTransactionLoading,
	};
};
