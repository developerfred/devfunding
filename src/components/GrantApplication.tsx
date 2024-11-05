/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any  */
// @ts-nocheck

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { publicClient, devFundingConfig } from "@/lib/contract/client";
import { createWalletClient, custom } from "viem";
import { morphHolesky } from "viem/chains";
import type { Grant } from "@/types";

type FlexibleProvider = {
	request: (...args: any[]) => Promise<any>;
	[key: string]: any;
};

interface GrantApplicationProps {
	grant: Grant;
	onClose?: () => void;
}

const GrantApplication: React.FC<GrantApplicationProps> = ({ grant, onClose }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);
	const [walletClient, setWalletClient] = useState<any>(null);
	const [isOpen, setIsOpen] = useState(false);

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

	useEffect(() => {
		checkMetaMaskInstallation();
	}, []);

	const handleApply = async () => {
		setIsSubmitting(true);
		setError("");

		try {
			if (!isMetaMaskInstalled || !walletClient) {
				setError("Please install a web3 wallet to apply for grants.");
				return;
			}

			const [address] = await walletClient.requestAddresses();

			// Prepare transaction
			const { request } = await publicClient.simulateContract({
				address: devFundingConfig.address,
				abi: devFundingConfig.abi,
				functionName: "applyForGrant",
				args: [BigInt(grant.id)],
				account: address,
			});

			// Send transaction
			const hash = await walletClient.writeContract(request);

			// Wait for confirmation
			const receipt = await publicClient.waitForTransactionReceipt({ hash });

			setSuccess(true);
			setTimeout(() => {
				setIsOpen(false);
				if (onClose) onClose();
				setSuccess(false);
			}, 2000);
		} catch (err) {
			setError(err.message || "Failed to apply for grant. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isMetaMaskInstalled) {
		return (
			<Button onClick={checkMetaMaskInstallation} variant="default">
				Install Web3 Wallet to Apply
			</Button>
		);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="default">Apply for Grant</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Apply for Grant #{grant.id}</DialogTitle>
					<DialogDescription>
						Review and confirm your application for this grant
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div>
						<h3 className="text-sm font-medium leading-none">Description</h3>
						<p className="text-sm text-muted-foreground">{grant.description}</p>
					</div>
					<div>
						<h3 className="text-sm font-medium leading-none">Requirements</h3>
						<p className="text-sm text-muted-foreground">{grant.requirements}</p>
					</div>
					<div>
						<h3 className="text-sm font-medium leading-none">Amount</h3>
						<p className="text-sm text-muted-foreground">
							${Number(grant.amount) / 1e18}
						</p>
					</div>

					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{success && (
						<Alert className="bg-green-50 border-green-200">
							<AlertDescription className="text-green-600">
								Successfully applied for grant!
							</AlertDescription>
						</Alert>
					)}
				</div>

				<div className="flex justify-end gap-4 mt-4">
					<Button
						variant="outline"
						onClick={() => setIsOpen(false)}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button onClick={handleApply} disabled={isSubmitting || success}>
						{isSubmitting ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Applying...
							</>
						) : success ? (
							"Applied!"
						) : (
							"Submit Application"
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default GrantApplication;