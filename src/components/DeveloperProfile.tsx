/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment  */
// @ts-nocheck


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contractInteractions } from "@/lib/contract/client";
import type { Developer } from "@/types";
import type { FormEvent, ChangeEvent } from "react";
import { useState, useEffect } from "react";

export const DeveloperProfile = ({ address }: { address: string }) => {
	const [profile, setProfile] = useState<Developer | null>(null);
	const [editMode, setEditMode] = useState(false);
	const [isPremium, setIsPremium] = useState(false);
	const [isVerified, setIsVerified] = useState(false);
	const [loading, setLoading] = useState(true);
	const [formData, setFormData] = useState({
		githubHandle: "",
		skills: [] as string[],
		portfolioUrl: "",
	});

	// Carregar os dados do desenvolvedor
	useEffect(() => {
		const loadDeveloperData = async () => {
			try {
				const [devDetails] = await contractInteractions.viewFunctions.getDeveloperDetails(address);

				setProfile({
					githubHandle: devDetails.githubHandle,
					skills: devDetails.skills,
					portfolioUrl: devDetails.portfolioUrl,
					isVerified: devDetails.isVerified,
					isPremium: false,
					completedGrants: devDetails.completedGrants,
					reputation: devDetails.reputation,
				});
				setFormData({
					githubHandle: devDetails.githubHandle,
					skills: devDetails.skills,
					portfolioUrl: devDetails.portfolioUrl,
				});

				// Verificar status premium
				const premiumStatus = await contractInteractions.viewFunctions.isPremiumUser(address);
				setIsPremium(premiumStatus);

				setLoading(false);
			} catch (error) {
				console.error("Error loading developer data:", error);
				setLoading(false);
			}
		};

		if (address) {
			loadDeveloperData();
		}
	}, [address]);

	const handleUpdateProfile = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		try {
			await contractInteractions.writeFunctions.updateDevProfile(
				formData.githubHandle,
				formData.skills,
				formData.portfolioUrl
			);

			
			if (profile) {
				setProfile({
					...formData,
					isVerified,
					isPremium,
					completedGrants: profile.completedGrants,
					reputation: profile.reputation
				});
			}

			setEditMode(false);
		} catch (error) {
			console.error("Error updating profile:", error);
		} finally {
			setLoading(false);
		}
	};

	const handlePurchasePremium = async (months: number) => {
		setLoading(true);
		try {
			await contractInteractions.writeFunctions.purchasePremium(months);
			setIsPremium(true);
			if (profile) {
				setProfile({
					...profile,
					isPremium: true
				});
			}
		} catch (error) {
			console.error("Error purchasing premium:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		if (id === 'skills') {
			setFormData({
				...formData,
				skills: value.split(",").map((s) => s.trim()),
			});
		} else {
			setFormData({
				...formData,
				[id]: value,
			});
		}
	};

	if (loading) {
		return (
			<Card className="rounded-lg shadow-lg">
				<CardContent>
					<div className="flex justify-center items-center h-40">
						<p>Loading...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="rounded-lg shadow-lg">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">Developer Profile</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{editMode ? (
					<form onSubmit={handleUpdateProfile} className="space-y-4">
						<div>
							<Label htmlFor="githubHandle">GitHub Handle</Label>
							<Input
								id="githubHandle"
								type="text"
								placeholder="Enter your GitHub handle"
								value={formData.githubHandle}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<Label htmlFor="portfolioUrl">Portfolio URL</Label>
							<Input
								id="portfolioUrl"
								type="url"
								placeholder="Enter your portfolio URL"
								value={formData.portfolioUrl}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<Label htmlFor="skills">Skills (comma separated)</Label>
							<Input
								id="skills"
								type="text"
								placeholder="Enter your skills"
								value={formData.skills.join(", ")}
								onChange={handleInputChange}
							/>
						</div>
						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setEditMode(false)}
							>
								Cancel
							</Button>
							<Button type="submit">Save Profile</Button>
						</div>
					</form>
				) : (
					<div className="space-y-4">
						{profile && (
							<>
								<div>
									<h3 className="font-medium">GitHub Handle</h3>
									<p>{profile.githubHandle}</p>
								</div>
								<div>
									<h3 className="font-medium">Skills</h3>
									<div className="flex flex-wrap gap-2 mt-2">
										{profile.skills.map((skill, i) => (
											<Badge key={i} variant="secondary">{skill}</Badge>
										))}
									</div>
								</div>
								<div>
									<h3 className="font-medium">Status</h3>
									<div className="flex gap-2 mt-2">
										{profile.isVerified && (
											<Badge variant="secondary">Verified</Badge>
										)}
										{profile.isPremium && (
											<Badge variant="default">Premium</Badge>
										)}
									</div>
								</div>
							</>
						)}
						<div className="flex justify-end">
							<Button onClick={() => setEditMode(true)} variant="outline">
								Edit Profile
							</Button>
						</div>
					</div>
				)}

				{/* Premium Features */}
				{!profile?.isPremium && (
					<div>
						<h3 className="font-medium">Premium Membership</h3>
						<div className="grid grid-cols-3 gap-4 mt-2">
							<Button onClick={() => handlePurchasePremium(1)} disabled={loading}>
								1 Month
							</Button>
							<Button onClick={() => handlePurchasePremium(6)} disabled={loading}>
								6 Months
							</Button>
							<Button onClick={() => handlePurchasePremium(12)} disabled={loading}>
								12 Months
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};