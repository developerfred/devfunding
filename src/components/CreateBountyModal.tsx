/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment  */
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
import { useBountyData } from "@/hooks/useBountyData";
import { useCreateBounty } from "@/hooks/useCreateBounty";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { http, createPublicClient, parseUnits } from "viem";
import { useAccount, useReadContracts } from "wagmi";

export const CreateBountyModal = () => {
	const [open, setOpen] = useState(false);
	const [isHighlighted, setIsHighlighted] = useState(false);
	const { address } = useAccount();

	const {
		createBounty,
		createHighlightedBounty,
		isPending,
		isError,
		isSuccess,
		error,
	} = useCreateBounty();

	const handleSubmit = async (formData) => {
		try {
			const amountInWei = parseUnits(
				formData.amount,
				formData.currency === "ENT" ? 18 : 6,
			);
			const updatedFormData = { ...formData, amount: amountInWei };

			if (isHighlighted) {
				await createHighlightedBounty(updatedFormData);
			} else {
				await createBounty(updatedFormData);
			}

			if (isSuccess) {
				setOpen(false);
			}
		} catch (err) {
			console.error("Error submitting bounty:", err);
		}
	};

	useEffect(() => {
		if (isSuccess) {
			setOpen(false);
		}
	}, [isSuccess]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">New Bounty</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Bounty</DialogTitle>
					<DialogDescription>
						Create a new bounty for developers to work on.
					</DialogDescription>
				</DialogHeader>
				<BountyForm
					onSubmit={handleSubmit}
					onCancel={() => setOpen(false)}
					isLoading={isPending}
					isHighlighted={isHighlighted}
					setIsHighlighted={setIsHighlighted}
					currencyOptions={["ENT", "USDT", "ETH"]}
					defaultCurrency="ENT"
				/>
			</DialogContent>
		</Dialog>
	);
};
