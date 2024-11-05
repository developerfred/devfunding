/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment,  @typescript-eslint/no-explicit-any  */
// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { publicClient, devFundingConfig } from "@/lib/contract/client";
import { createWalletClient, custom, parseUnits, isAddress } from "viem";
import { morphHolesky } from "viem/chains";
import { contractAddress } from "@/lib/contract/config";

type FlexibleProvider = {
	request: (...args: any[]) => Promise<any>;
	[key: string]: any;
};

interface CreateBountyModalProps {
	isOpen: boolean;
	onClose: () => void;
}

interface FormData {
	issueLink: string;
	amount: string;
	durationDays: string;
	referrer: string;
	currency: string;
}

const initialFormData: FormData = {
	issueLink: "",
	amount: "",
	durationDays: "30",
	referrer: "",
	currency: "ENT"
};

const CreateBountyModal: React.FC<CreateBountyModalProps> = ({ isOpen, onClose }) => {
	const [isHighlighted, setIsHighlighted] = useState(false);
	const [isCustomToken, setIsCustomToken] = useState(false);
	const [customTokenAddress, setCustomTokenAddress] = useState("");
	const [customTokenDecimals, setCustomTokenDecimals] = useState(18);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isApproving, setIsApproving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);
	const [walletClient, setWalletClient] = useState<any>(null);
	const [formData, setFormData] = useState<FormData>(initialFormData);

	useEffect(() => {
		checkMetaMaskInstallation();
	}, []);

	const checkMetaMaskInstallation = () => {
		const provider = typeof window !== "undefined" ? window.ethereum : undefined;
		const isInstalled = !!provider?.isMetaMask;
		setIsMetaMaskInstalled(isInstalled);

		if (isInstalled && provider) {
			const flexibleProvider = provider as FlexibleProvider;
			const client = createWalletClient({
				chain: morphHolesky,
				transport: custom(flexibleProvider),
			});
			setWalletClient(client);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const validateForm = () => {
		if (!formData.issueLink.trim()) {
			throw new Error("Issue link is required");
		}
		if (!formData.amount || Number(formData.amount) <= 0) {
			throw new Error("Invalid amount");
		}
		if (!formData.durationDays || Number(formData.durationDays) <= 0 || Number(formData.durationDays) > 365) {
			throw new Error("Duration must be between 1 and 365 days");
		}
		if (!isAddress(formData.referrer)) {
			throw new Error("Invalid referrer address");
		}
	};

	const checkAllowance = async (tokenAddress: string, ownerAddress: string, amount: bigint) => {
		try {
			const allowance = await publicClient.readContract({
				address: tokenAddress,
				abi: [{
					type: "function",
					name: "allowance",
					inputs: [
						{ name: "owner", type: "address" },
						{ name: "spender", type: "address" }
					],
					outputs: [{ type: "uint256" }],
					stateMutability: "view"
				}],
				functionName: "allowance",
				args: [ownerAddress, devFundingConfig.address],
			});

			return allowance >= amount;
		} catch (err: any) {
			console.error("Error checking allowance:", err);
			return false;
		}
	};

	const handleApproveToken = async (tokenAddress: string, amount: bigint) => {
		try {
			setIsApproving(true);
			const [address] = await walletClient.requestAddresses();

			const { request: approveRequest } = await publicClient.simulateContract({
				address: tokenAddress,
				abi: [{
					type: "function",
					name: "approve",
					inputs: [
						{ name: "spender", type: "address" },
						{ name: "amount", type: "uint256" }
					],
					outputs: [{ type: "bool" }],
					stateMutability: "nonpayable"
				}],
				functionName: "approve",
				args: [devFundingConfig.address, amount],
				account: address,
			});

			const approveHash = await walletClient.writeContract(approveRequest);
			const receipt = await publicClient.waitForTransactionReceipt({ hash: approveHash });

			if (!receipt.status) {
				throw new Error("Token approval failed");
			}
		} catch (err: any) {
			throw new Error(`Token approval failed: ${err.message}`);
		} finally {
			setIsApproving(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");

		try {
			if (!isMetaMaskInstalled || !walletClient) {
				throw new Error("Please install a web3 wallet to create bounties.");
			}

			validateForm();

			const [address] = await walletClient.requestAddresses();

			const amountInWei = isCustomToken
				? BigInt(Number(formData.amount) * 10 ** customTokenDecimals)
				: parseUnits(formData.amount, formData.currency === "ENT" ? 18 : 6);

			const tokenAddress = isCustomToken ? customTokenAddress :
				formData.currency === "ENT" ? devFundingConfig.tokenAddress :
					formData.currency === "USDT" ? "0x67330f6BC8dcE05816662785A89fb0611F6D149F" :
						"0x5300000000000000000000000000000000000011";

			// Check if we have enough allowance
			const hasAllowance = await checkAllowance(tokenAddress, address, amountInWei);

			if (!hasAllowance) {
				await handleApproveToken(tokenAddress, amountInWei);
			}

			// Simulate the createBounty transaction
			const { request } = await publicClient.simulateContract({
				address: devFundingConfig.address,
				abi: devFundingConfig.abi,
				functionName: isHighlighted ? "createHighlightedBounty" : "createBounty",
				args: [
					amountInWei,
					formData.issueLink,
					BigInt(formData.durationDays),
					formData.referrer
				],
				account: address,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			setSuccess(true);
			setTimeout(() => {
				onClose();
				setSuccess(false);
				setFormData(initialFormData);
			}, 2000);
		} catch (err: any) {
			setError(err.message || "Failed to create bounty. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Create New Bounty</DialogTitle>
					<DialogDescription>
						Create a new bounty for developers to work on.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-4">
						<div>
							<Label htmlFor="issueLink">Issue Link</Label>
							<Textarea
								id="issueLink"
								name="issueLink"
								value={formData.issueLink}
								onChange={handleInputChange}
								required
								placeholder="https://github.com/project/issue/2"
							/>
						</div>

						<div>
							<Label htmlFor="durationDays">Duration (Days)</Label>
							<Input
								id="durationDays"
								name="durationDays"
								type="number"
								required
								min="1"
								max="365"
								value={formData.durationDays}
								onChange={handleInputChange}
								placeholder="30"
							/>
						</div>

						<div>
							<Label htmlFor="amount">Amount</Label>
							<Input
								id="amount"
								name="amount"
								type="number"
								required
								min="0"
								step="0.000001"
								value={formData.amount}
								onChange={handleInputChange}
								placeholder="Enter bounty amount"
							/>
						</div>

						<div>
							<Label htmlFor="currency">Currency</Label>
							<select
								id="currency"
								name="currency"
								className="w-full p-2 border rounded"
								value={formData.currency}
								onChange={(e) => {
									handleInputChange(e);
									setIsCustomToken(e.target.value === "custom");
								}}
							>
								<option value="ENT">ENT</option>
								<option value="USDT">USDT</option>
								<option value="ETH">ETH</option>
								<option value="custom">Custom Token</option>
							</select>
						</div>

						{isCustomToken && (
							<>
								<div>
									<Label htmlFor="tokenAddress">Token Address</Label>
									<Input
										id="tokenAddress"
										value={customTokenAddress}
										onChange={(e) => setCustomTokenAddress(e.target.value)}
										placeholder="Enter token contract address"
									/>
								</div>
								<div>
									<Label htmlFor="tokenDecimals">Token Decimals</Label>
									<Input
										id="tokenDecimals"
										type="number"
										value={customTokenDecimals}
										onChange={(e) => setCustomTokenDecimals(Number(e.target.value))}
										placeholder="Enter token decimals"
									/>
								</div>
							</>
						)}

						<div>
							<Label htmlFor="referrer">Referrer Address</Label>
							<Input
								id="referrer"
								name="referrer"
								value={formData.referrer}
								onChange={handleInputChange}
								required
								placeholder="0x..."
							/>
						</div>

						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								id="highlighted"
								checked={isHighlighted}
								onChange={(e) => setIsHighlighted(e.target.checked)}
							/>
							<Label htmlFor="highlighted">Highlight this bounty</Label>
						</div>
					</div>

					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{success && (
						<Alert className="bg-green-50 border-green-200">
							<AlertDescription className="text-green-600">
								Bounty created successfully!
							</AlertDescription>
						</Alert>
					)}

					<div className="flex justify-end space-x-4">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isSubmitting || isApproving}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting || isApproving}>
							{isApproving ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Approving...
								</>
							) : isSubmitting ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Creating...
								</>
							) : (
								"Create Bounty"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateBountyModal;