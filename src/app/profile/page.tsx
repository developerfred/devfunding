"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useProfile from "@/hooks/useProfile";
import React from "react";
import { useAccount } from "wagmi";

function ProfilePage() {
	const { address } = useAccount();
	const { profile, isLoading, error } = useProfile(address || null); // Provide a fallback value

	if (isLoading) return <div>Loading profile...</div>;
	if (error) return <div>Error loading profile: {error.message}</div>;
	if (!profile)
		return <div>No profile found or please connect your wallet.</div>;

	return (
		<div className="min-h-screen p-4">
			<Card>
				<CardHeader>
					<CardTitle>User Profile</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<h2 className="text-2xl font-bold">{profile.githubHandle}</h2>
						<p>Reputation: {profile.reputation.toString()}</p>
						<p>Completed Grants: {profile.completedGrants}</p>
						<p>
							Verification: {profile.isVerified ? "Verified" : "Not Verified"}
						</p>
						<p>Premium Status: {profile.isPremium ? "Premium" : "Standard"}</p>
						<p>
							Portfolio URL:
							<a
								href={profile.portfolioUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								{profile.portfolioUrl}
							</a>
						</p>
						<p>Grants Created: {profile.grantsCreated}</p>
						<p>Grants Claimed: {profile.grantsClaimed}</p>
						<p>Referrals: {profile.referralCount}</p>
						<p>Referral Earnings: {profile.referralEarnings} Tokens</p>

						<div className="mt-4 space-x-2">
							<Button
								onClick={() => {
									/* Navigate to create grant page */
								}}
							>
								Create Grant
							</Button>
							<Button
								onClick={() => {
									/* Open modal or navigate to apply for grant page */
								}}
							>
								Apply for Grant
							</Button>
							<Button
								onClick={() => {
									/* Open modal or navigate to manage premium */
								}}
							>
								Manage Premium
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default ProfilePage;
