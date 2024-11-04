/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment  */
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment  */
// @ts-nocheck
"use client";
import BountyForm from "@/components/BountyForm";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApproveToken } from "@/hooks/useApproveToken";
import { useBountyData } from "@/hooks/useBountyData";
import { useCreateBounty } from "@/hooks/useCreateBounty";
import { contractAddress } from "@/lib/contract/config";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { http, createPublicClient, parseUnits } from "viem";
import { useAccount, useReadContracts } from "wagmi";

export const CreateBountyModal = ({ isOpen, onClose }) => {
	const [isHighlighted, setIsHighlighted] = useState(false);
	const [isCustomToken, setIsCustomToken] = useState(false);
	const [customTokenAddress, setCustomTokenAddress] = useState('');
	const [customTokenDecimals, setCustomTokenDecimals] = useState(0);
	const { address } = useAccount();
	const { createBounty, createHighlightedBounty, isPending, isError, isSuccess, error } = useCreateBounty();
	const { approveToken, isApproving, approveError } = useApproveToken();


	const handleSubmit = async (formData) => {
		try {
			// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
			let amountInWei;
			if (isCustomToken) {
				amountInWei = BigInt(formData.amount * (10 ** customTokenDecimals));
			} else {
				amountInWei = parseUnits(formData.amount, formData.currency === "ENT" ? 18 : 6);
			}
			const updatedFormData = { ...formData, amount: amountInWei, tokenAddress: isCustomToken ? customTokenAddress : formData.currency };

			if (isCustomToken) {				
				await approveToken(customTokenAddress, amountInWei, contractAddress);
			}
			if (isHighlighted) {
				await createHighlightedBounty(updatedFormData);
			} else {
				await createBounty(updatedFormData);
			}

			if (isSuccess) {
				onClose(); 
			}
		} catch (err) {
			console.error("Error submitting bounty:", err);
		}
	};

	const onCancel = () => {
		onClose(); 
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Bounty</DialogTitle>
					<DialogDescription>
						Create a new bounty for developers to work on.
					</DialogDescription>
				</DialogHeader>
				<BountyForm
					onSubmit={handleSubmit}
					onCancel={onCancel}
					isLoading={isPending || isApproving}
					isHighlighted={isHighlighted}
					setIsHighlighted={setIsHighlighted}
					currencyOptions={["ENT", "USDT", "ETH"]}
					defaultCurrency="ENT"
					isCustomToken={isCustomToken}
					setIsCustomToken={setIsCustomToken}
					customTokenAddress={customTokenAddress}
					setCustomTokenAddress={setCustomTokenAddress}
					customTokenDecimals={customTokenDecimals}
					setCustomTokenDecimals={setCustomTokenDecimals}
				/>
			</DialogContent>
		</Dialog>
	);
};