/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment  */
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { devFundingConfig } from "@/lib/contract/config";
import { contractInteractions } from "@/lib/contract/client";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import { FormData } from "@/types";

const CreateGrantModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
	isOpen,
	onClose
}) => {
	const { address } = useAccount();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		amount: "",
		currency: "ENT",
		description: "",
		requirements: "",
		durationDays: "",
		referrer: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [txHash, setTxHash] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			if (!address) {
				throw new Error("Please connect your wallet first");
			}

			const decimalPlaces = formData.currency === "ENT" ? 18 : 6;
			const amountInWei = parseUnits(formData.amount, decimalPlaces);

			if (!formData.referrer.startsWith('0x')) {
				throw new Error("Referrer address must start with '0x'");
			}

			const receipt = await contractInteractions.writeFunctions.createGrant(
				BigInt(amountInWei.toString()),
				formData.description,
				formData.requirements,
				Number(formData.durationDays),
				formData.referrer as `0x${string}`,
			);

			setTxHash(receipt.transactionHash);
			onClose();

		} catch (err) {
			setError(err instanceof Error ? err.message : "An unknown error occurred");
			console.error("Error creating grant:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
		setError(null);
	};

	const handleClose = () => {
		setFormData({
			amount: "",
			currency: "ENT",
			description: "",
			requirements: "",
			durationDays: "",
			referrer: "",
		});
		setError(null);
		setTxHash(null);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Create New Grant</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-3 gap-4">
						<div className="col-span-2">
							<Label htmlFor="amount">Grant Amount</Label>
							<Input
								id="amount"
								name="amount"
								type="number"
								step="0.01"
								required
								placeholder="0.00"
								value={formData.amount}
								onChange={handleInputChange}
							/>
						</div>
						<div className="col-span-1">
							<Label htmlFor="currency">Currency</Label>
							<select
								id="currency"
								name="currency"
								className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
								value={formData.currency}
								onChange={handleInputChange}
							>
								<option value="ENT">ENT</option>
								<option value="USD">USDT</option>
								<option value="EUR">ETH</option>
							</select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							name="description"
							required
							placeholder="Describe the grant and its goals"
							value={formData.description}
							onChange={handleInputChange}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="requirements">Requirements</Label>
						<Textarea
							id="requirements"
							name="requirements"
							required
							placeholder="List the requirements and deliverables"
							value={formData.requirements}
							onChange={handleInputChange}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="durationDays">Duration (Days)</Label>
						<Input
							id="durationDays"
							name="durationDays"
							type="number"
							required
							min="1"
							placeholder="30"
							value={formData.durationDays}
							onChange={handleInputChange}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="referrer">Referrer Address</Label>
						<Input
							id="referrer"
							name="referrer"
							type="text"
							required
							placeholder="0x..."
							value={formData.referrer}
							onChange={handleInputChange}
						/>
					</div>

					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{txHash && (
						<Alert>
							<AlertDescription>
								Transaction submitted! Hash: {txHash}
							</AlertDescription>
						</Alert>
					)}

					<DialogFooter>
						<Button type="button" variant="outline" onClick={handleClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								"Create Grant"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateGrantModal;