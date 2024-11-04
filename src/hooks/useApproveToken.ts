/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment  */
// @ts-nocheck
import { useState } from 'react';
import { usePublicClient, useWalletClient } from "wagmi";
import { parseUnits } from "viem";

export const useApproveToken = () => {
    const [isApproving, setIsApproving] = useState(false);
    const [approveError, setApproveError] = useState(null);
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

    const approveToken = async (tokenAddress, amount, spenderAddress) => {
        if (!walletClient) {
            setApproveError("Wallet client not connected");
            return;
        }

        setIsApproving(true);
        setApproveError(null);

        try {
            const [address] = await walletClient.requestAddresses();

            // ABI for the approve function of an ERC20 token
            const approveAbi = [
                {
                    constant: false,
                    inputs: [
                        { name: "_spender", type: "address" },
                        { name: "_value", type: "uint256" },
                    ],
                    name: "approve",
                    outputs: [{ name: "", type: "bool" }],
                    type: "function",
                },
            ];

            // Convert the amount to the appropriate unit for the token
            const amountInWei = parseUnits(amount, 18); // Assuming 18 decimals, adjust as needed

            const { request } = await publicClient.simulateContract({
                address: tokenAddress,
                abi: approveAbi,
                functionName: 'approve',
                args: [spenderAddress, amountInWei],
                account: address,
            });

            const result = await walletClient.writeContract(request);
            await publicClient.waitForTransactionReceipt({ hash: result.transactionHash });

            return result;
        } catch (error) {
            setApproveError(error.message || "Approval failed");
            throw error;
        } finally {
            setIsApproving(false);
        }
    };

    return {
        approveToken,
        isApproving,
        approveError,
    };
};