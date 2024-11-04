'use client'
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

import { contractInteractions } from "@/lib/contract/client";

import { useRef, useState, FormEvent} from "react";
import { useAccount} from "wagmi";


interface CreateDevProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const CreateDevProfileModal: React.FC<CreateDevProfileModalProps> = ({ isOpen, onClose }) => {
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

	const removeSkill = (index: number) => {
		setSkills(prevSkills => prevSkills.filter((_, i) => i !== index));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!isConnected) {
			console.error("Wallet is not connected");
			return;
		}

		if (!address) {
			console.error("No address available");
			return;
		}

		const formData = new FormData(event.currentTarget);
		const githubHandle = formData.get("githubHandle") as string;
		const portfolioUrl = formData.get("portfolioUrl") as string;
		const filteredSkills = skills.filter(skill => skill.trim() !== "");

		try {
			const result = await contractInteractions.writeFunctions.createDevProfile(
				githubHandle,
				filteredSkills,
				portfolioUrl
			);
			console.log("Transaction hash:", result.hash);
			setOpen(false);
			onClose();  
		} catch (error) {
			console.error("Error creating developer profile:", error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={(open) => {
			setOpen(open);
			if (!open) onClose(); 
		}}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Developer Profile</DialogTitle>
					<DialogDescription>
						Set up your developer profile to start working on bounties.
					</DialogDescription>
				</DialogHeader>
				<form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="githubHandle">GitHub Handle</Label>
						<Input id="githubHandle" name="githubHandle" required />
					</div>
					<div>
						<Label htmlFor="portfolioUrl">Portfolio URL</Label>
						<Input id="portfolioUrl" name="portfolioUrl" required />
					</div>
					{skills.map((skill, index) => (
						<div key={index}>
							<Label htmlFor={`skills[${index}]`}>Skill {index + 1}</Label>
							<Input
								id={`skills[${index}]`}
								name={`skills[${index}]`}
								value={skill}
								onChange={(e) => updateSkill(index, e.target.value)}
							/>
							{index !== 0 && (
								<Button type="button" variant="destructive" onClick={() => removeSkill(index)}>
									Remove Skill
								</Button>
							)}
						</div>
					))}
					<Button type="button" variant="outline" onClick={addSkill}>
						Add Skill
					</Button>
					<Button type="submit" variant="default">
						Create Profile
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};