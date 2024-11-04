/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment,  @typescript-eslint/no-explicit-any, react/jsx-no-undef  */
// @ts-nocheck

"use client";
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
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { parseEther } from "viem";
import { useAccount, useReadContracts } from "wagmi";

interface BountyFormProps {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onSubmit: (formData: any) => Promise<void>;
	onCancel: () => void;
	isLoading: boolean;
	isHighlighted: boolean;
	setIsHighlighted: React.Dispatch<React.SetStateAction<boolean>>;
	currencyOptions: string[];
	defaultCurrency: string;
}

const BountyForm: React.FC<BountyFormProps> = ({
	onSubmit,
	onCancel,
	isLoading,
	isHighlighted,
	setIsHighlighted,
	currencyOptions,
	defaultCurrency,
	isCustomToken,
	setIsCustomToken,
	customTokenAddress,
	setCustomTokenAddress,
	customTokenDecimals,
	setCustomTokenDecimals
}) => {
	const { address } = useAccount();



	const handleSubmit = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);

		const bountyData = {
			amount: formData.get("amount"),
			issueLink: formData.get("issueLink"),
			duration: formData.get("duration"),
			referrer: formData.get("referrer") || address,
		};

		await onSubmit(bountyData);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid w-full gap-1.5">
				<div>
					<Label htmlFor="amount">Amount</Label>
					<Input id="amount" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount of tokens" />
				</div>
				<div>
					<Checkbox id="isCustomToken" checked={isCustomToken} onChange={() => setIsCustomToken(!isCustomToken)} />
					<Label htmlFor="isCustomToken">Use Custom Token</Label>
				</div>
				<Input
					id="amount"
					name="amount"
					type="number"
					step="0.01"
					required
					className="col-span-3"
				/>
			</div>
			{isCustomToken && (
				<>
					<div>
						<Label htmlFor="customTokenAddress">Custom Token Address</Label>
						<Input id="customTokenAddress" value={customTokenAddress} onChange={e => setCustomTokenAddress(e.target.value)} />
					</div>
					<div>
						<Label htmlFor="customTokenDecimals">Token Decimals</Label>
						<Input type="number" id="customTokenDecimals" value={customTokenDecimals} onChange={e => setCustomTokenDecimals(Number(e.target.value))} />
					</div>
				</>
			)}

			<div className="grid w-full gap-1.5">
				<Label htmlFor="issueLink">Issue Link</Label>
				<Input
					id="issueLink"
					name="issueLink"
					type="url"
					required
					className="col-span-3"
				/>
			</div>

			<div className="grid w-full gap-1.5">
				<Label htmlFor="duration">Duration (days)</Label>
				<Input
					id="duration"
					name="duration"
					type="number"
					min="1"
					required
					className="col-span-3"
				/>
			</div>

			<div className="grid w-full gap-1.5">
				<Label htmlFor="referrer">Referrer Address (Optional)</Label>
				<Input
					id="referrer"
					name="referrer"
					placeholder={address}
					className="col-span-3"
				/>
			</div>

			<div className="flex justify-end space-x-2">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					disabled={isLoading}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? "Creating..." : "Create Bounty"}
				</Button>
			</div>
		</form>
	);
};

export default BountyForm;
