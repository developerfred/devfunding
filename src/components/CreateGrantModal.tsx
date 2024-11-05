/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps  */
// @ts-nocheck

import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { devFundingConfig } from "@/lib/contract/config";
import { publicClient } from "@/lib/contract/client";
import { Loader2 } from "lucide-react";
import { parseUnits, createWalletClient, custom } from "viem";
import { morph } from "viem/chains";
import { useAccount } from "wagmi";
import { contractAddress } from "@/lib/contract/config";

type FlexibleProvider = {
	request: (...args: any[]) => Promise<any>;
	[key: string]: any;
};

interface FormData {
	amount: string;
	description: string;
	requirements: string;
	durationDays: string;
	referrer: string;
	isHighlighted: boolean;
}

const CreateGrantModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
	isOpen,
	onClose,
}) => {
	const { address } = useAccount();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [walletClient, setWalletClient] = useState<any>(null);
	const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
	const [isPremiumUser, setIsPremiumUser] = useState(false);
	const [premiumExpiry, setPremiumExpiry] = useState<number>(0);

	const [formData, setFormData] = useState<FormData>({
		amount: "",
		description: "",
		requirements: "",
		durationDays: "",
		referrer: "",
		isHighlighted: false,
	});

	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		checkMetaMaskInstallation();
	}, []);

	useEffect(() => {
		if (address) {
			checkPremiumStatus();
		}
	}, [address]);

	const checkMetaMaskInstallation = () => {
		const provider = typeof window !== "undefined" ? window.ethereum : undefined;
		const isInstalled = !!provider?.isMetaMask;
		setIsMetaMaskInstalled(isInstalled);

		if (isInstalled && provider) {
			const flexibleProvider = provider as FlexibleProvider;
			const client = createWalletClient({
				chain: morph,
				transport: custom(flexibleProvider),
			});
			setWalletClient(client);
		}
	};

	const checkPremiumStatus = async () => {
		try {
			const [isPremium, expiryTime] = await publicClient.readContract({
				address: devFundingConfig.address,
				abi: devFundingConfig.abi,
				functionName: "checkPremiumStatus",
				args: [address],
			});

			setIsPremiumUser(isPremium);
			setPremiumExpiry(Number(expiryTime));
		} catch (err) {
			console.error("Error checking premium status:", err);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			if (!isMetaMaskInstalled || !walletClient) {
				throw new Error("Please install a web3 wallet first");
			}

			if (!address) {
				throw new Error("Please connect your wallet first");
			}

			if (!formData.referrer.startsWith("0x")) {
				throw new Error("Referrer address must start with '0x'");
			}

			if (formData.isHighlighted && !isPremiumUser) {
				throw new Error("Premium membership required for highlighted grants");
			}

			const amountInWei = parseUnits(formData.amount, 18);
			const [userAddress] = await walletClient.requestAddresses();

			// First approve the token spend
			const { request: approveRequest } = await publicClient.simulateContract({
				address: devFundingConfig.tokenAddress,
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
				args: [contractAddress, amountInWei],
				account: userAddress,
			});

			const approveHash = await walletClient.writeContract(approveRequest);
			await publicClient.waitForTransactionReceipt({ hash: approveHash });

			// Then create the grant
			const { request } = await publicClient.simulateContract({
				address: devFundingConfig.address,
				abi: devFundingConfig.abi,
				functionName: formData.isHighlighted ? "createHighlightedGrant" : "createGrant",
				args: [
					amountInWei,
					formData.description,
					formData.requirements,
					BigInt(formData.durationDays),
					formData.referrer as `0x${string}`,
				],
				account: userAddress,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			setSuccess(true);
			setTimeout(() => {
				handleClose();
			}, 2000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unknown error occurred");
			console.error("Error creating grant:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError(null);
	};

	const handleHighlightedChange = (checked: boolean) => {
		setFormData((prev) => ({
			...prev,
			isHighlighted: checked,
		}));
		setError(null);
	};

	const handleClose = () => {
		setFormData({
			amount: "",
			description: "",
			requirements: "",
			durationDays: "",
			referrer: "",
			isHighlighted: false,
		});
		setError(null);
		setSuccess(false);
		onClose();
	};

	const isPremiumExpired = premiumExpiry > 0 && premiumExpiry < Date.now() / 1000;

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Create New Grant</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="amount">Grant Amount (ENT)</Label>
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

					<div className="flex items-center space-x-2">
						<Checkbox
							id="highlighted"
							checked={formData.isHighlighted}
							onCheckedChange={handleHighlightedChange}
							disabled={!isPremiumUser || isPremiumExpired}
						/>
						<Label htmlFor="highlighted" className="text-sm">
							Highlight this grant (Premium feature)
						</Label>
					</div>

					{!isPremiumUser && formData.isHighlighted && (
						<Alert className="bg-yellow-50 border-yellow-200">
							<AlertDescription className="text-yellow-800">
								Premium membership required to highlight grants. Purchase premium to unlock this feature.
							</AlertDescription>
						</Alert>
					)}

					{isPremiumExpired && (
						<Alert className="bg-yellow-50 border-yellow-200">
							<AlertDescription className="text-yellow-800">
								Your premium membership has expired. Please renew to access premium features.
							</AlertDescription>
						</Alert>
					)}

					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{success && (
						<Alert className="bg-green-50 border-green-200">
							<AlertDescription className="text-green-600">
								Grant created successfully!
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