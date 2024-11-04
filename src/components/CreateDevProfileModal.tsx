/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { contractInteractions } from "@/lib/contract/client";
import { devFundingConfig } from "@/lib/contract/config";
import { useRef, useState, FormEvent, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { http, createPublicClient, parseEther } from "viem";
import { morphHolesky } from "viem/chains";
import { useAccount, useTransaction, useWriteContract } from "wagmi";

const client = createPublicClient({
	chain: morphHolesky,
	transport: http(process.env.REACT_APP_RPC_URL),
});

interface CreateDevProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const CreateDevProfileModal: React.FC<CreateDevProfileModalProps> = ({ isOpen, onClose }) => {
	const [open, setOpen] = useState(isOpen);
	const [skills, setSkills] = useState<string[]>([""]);
	const { isConnected, address } = useAccount();

	const formRef = useRef<HTMLFormElement>(null);

	const addSkill = () => {
		setSkills(prevSkills => [...prevSkills, ""]);
	};

	const updateSkill = (index: number, value: string) => {
		setSkills(prevSkills => {
			const newSkills = [...prevSkills];
			newSkills[index] = value;
			return newSkills;
		});
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (formRef.current && !formRef.current.checkValidity()) {
			return;
		}

		const formData = new FormData(event.currentTarget);
		const githubHandle = formData.get("githubHandle") as string;
		const portfolioUrl = formData.get("portfolioUrl") as string;
		const filteredSkills = skills.filter(skill => skill.trim() !== "");

		try {
			if (isConnected && address) {
				const result = await contractInteractions.writeFunctions.createDevProfile(
					githubHandle,
					filteredSkills,
					portfolioUrl,
				);
				console.log("Transaction hash:", result.hash);
				setOpen(false);
				onClose();
			} else {
				console.error("Wallet is not connected");
			}
		} catch (error) {
			console.error("Error creating developer profile:", error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Create Developer Profile</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Developer Profile</DialogTitle>
					<DialogDescription>
						Set up your developer profile to start working on bounties.
					</DialogDescription>
				</DialogHeader>
				<form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
					{/* ... input fields ... */}
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateDevProfileModal;