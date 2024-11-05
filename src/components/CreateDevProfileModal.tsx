/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment,  @typescript-eslint/no-explicit-any  */
// @ts-nocheck

"use client";
import React, { useEffect, useState } from "react";
import { Loader2, Plus, X, Github, Link as LinkIcon } from "lucide-react";
import {
	contractInteractions,
	devFundingConfig,
	publicClient,
} from "@/lib/contract/client";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAccount } from "wagmi";
import { createWalletClient, custom } from "viem";
import { morph, morphHolesky } from "viem/chains";

type FlexibleProvider = {
	request: (...args: any[]) => Promise<any>;
	[key: string]: any;
};
const CreateProfileModal: React.FC = ({ isOpen, onClose }) => {
	const [skills, setSkills] = useState([""]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [isMetaMaskInstalled, setIsMetaMaskInstalled] =
		useState<boolean>(false);
	const [walletClient, setWalletClient] = useState<WalletClient | null>(null);

	useEffect(() => {
		checkMetaMaskInstallation();
	}, []);

	function checkMetaMaskInstallation(): void {
		const provider =
			typeof window !== "undefined" ? window.ethereum : undefined;
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
	}

	const handleAddSkill = () => {
		if (skills.length < 10) {
			setSkills([...skills, ""]);
		}
	};

	const handleRemoveSkill = (index) => {
		if (skills.length > 1) {
			setSkills(skills.filter((_, i) => i !== index));
		}
	};

	const handleSkillChange = (index, value) => {
		const newSkills = [...skills];
		newSkills[index] = value;
		setSkills(newSkills);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");

		const formData = new FormData(e.target);
		const githubHandle = formData.get("githubHandle");
		const portfolioUrl = formData.get("portfolioUrl");
		const filteredSkills = skills.filter((skill) => skill.trim() !== "");

		try {
			if (!isMetaMaskInstalled || !walletClient) {
				setError("Please install web3 wallet to create an ad.");
				return;
			}

			const [address] = await walletClient.requestAddresses();

			// Prepare transaction
			const { request } = await publicClient.simulateContract({
				address: devFundingConfig.address,
				abi: devFundingConfig.abi,
				functionName: "createDevProfile",
				args: [githubHandle, filteredSkills, portfolioUrl],
				account: address,
			});

			// Send transaction
			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			// Wait for confirmation
			const receipt = await publicClient.waitForTransactionReceipt({ hash });

			setSuccess(true);
			setTimeout(() => {
				onClose();
				setSuccess(false);
			}, 2000);
		} catch (err) {
			setError(err.message || "Failed to create profile. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => !isSubmitting && !open && onClose()}
		>
			<DialogContent className="sm:max-w-[500px] h-[50vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						Create Developer Profile
					</DialogTitle>
					<DialogDescription className="text-gray-500">
						Set up your developer profile to start applying for grants and
						bounties
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-2">
					<div className="space-y-2">
						<Label htmlFor="githubHandle" className="text-sm font-medium">
							<Github className="w-4 h-4 inline-block mr-2" />
							GitHub Handle
						</Label>
						<Input
							id="githubHandle"
							name="githubHandle"
							placeholder="your-github-username"
							required
							className="w-full"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="portfolioUrl" className="text-sm font-medium">
							<LinkIcon className="w-4 h-4 inline-block mr-2" />
							Portfolio URL
						</Label>
						<Input
							id="portfolioUrl"
							name="portfolioUrl"
							type="url"
							placeholder="https://your-portfolio.com"
							required
							className="w-full"
						/>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label className="text-sm font-medium">Skills</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleAddSkill}
								disabled={skills.length >= 10 || isSubmitting}
								className="h-8"
							>
								<Plus className="w-4 h-4 mr-1" /> Add Skill
							</Button>
						</div>

						<div className="space-y-3">
							{skills.map((skill, index) => (
								<div key={index} className="flex gap-2">
									<Input
										value={skill}
										onChange={(e) => handleSkillChange(index, e.target.value)}
										placeholder={`Skill ${index + 1}`}
										required
										disabled={isSubmitting}
									/>
									{skills.length > 1 && (
										<Button
											type="button"
											variant="outline"
											size="icon"
											onClick={() => handleRemoveSkill(index)}
											disabled={isSubmitting}
											className="h-10 w-10"
										>
											<X className="w-4 h-4" />
										</Button>
									)}
								</div>
							))}
						</div>
						<div className="space-y-3">
							{error && (
								<Alert variant="destructive" className="mb-4">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							{success && (
								<Alert className="mb-4 bg-green-50 border-green-200">
									<AlertDescription className="text-green-600">
										Profile created successfully!
									</AlertDescription>
								</Alert>
							)}
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Creating...
								</>
							) : (
								"Create Profile"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateProfileModal;
