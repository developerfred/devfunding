/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment  */
// @ts-nocheck

'use client'
import React, { useState, useEffect } from "react";
import { Bell, Plus, Rocket, Trophy, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import CreateBountyModal  from "@/components/CreateBountyModal";
import CreateProfileModal  from "@/components/CreateDevProfileModal";
import BountyApplication from "@/components/BountyApplication";
import { useBountiesManager } from "@/hooks/useBountiesManager";
import { publicClient, devFundingConfig } from "@/lib/contract/client";
import type { Bounty } from "@/types";

const BountiesPage = () => {
	const { bounties, isLoading, error, bountyCount } = useBountiesManager();
	const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
	const [userAppliedBounties, setUserAppliedBounties] = useState<number[]>([]);
	const [modalState, setModalState] = useState({
		bounty: false,
		profile: false,
	});

	useEffect(() => {
		const fetchUserBounties = async () => {
			try {
				if (typeof window.ethereum !== "undefined") {
					const [address] = await window.ethereum.request({
						method: "eth_requestAccounts",
					});

					// Fetch all bounties the user has applied for
					const appliedBounties = await publicClient.readContract({
						address: devFundingConfig.address,
						abi: devFundingConfig.abi,
						functionName: "getDevBounties",
						args: [address],
					});

					setUserAppliedBounties(appliedBounties.map(Number));
				}
			} catch (err) {
				console.error("Error fetching user bounties:", err);
			}
		};

		fetchUserBounties();
	}, []);

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Card className="w-full max-w-md">
					<CardContent className="p-6">
						<p className="text-red-500 text-center">Error: {error.message}</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Card className="w-full max-w-md">
					<CardContent className="p-6">
						<p className="text-center">Loading bounties...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const hasAppliedToBounty = (bountyId: number) => {
		return userAppliedBounties.includes(bountyId);
	};

	const appliedBounties = bounties.filter(bounty =>
		hasAppliedToBounty(Number(bounty.id))
	);

	const availableBounties = bounties.filter(bounty =>
		!hasAppliedToBounty(Number(bounty.id))
	);

	return (
		<div className="min-h-screen">
			{/* Navigation */}
			<nav className="bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16 items-center">
						<div className="flex items-center space-x-4">
							<button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
								<Bell className="h-5 w-5 text-gray-500" />
							</button>
							<button
								className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
								onClick={() => setModalState(prev => ({ ...prev, bounty: true }))}
							>
								<Plus className="h-4 w-4 mr-2" />
								Create Bounty
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<Card className="hover:shadow-lg transition-shadow">
						<CardContent className="flex items-center p-6">
							<div className="p-2 bg-green-100 rounded-lg">
								<Trophy className="h-6 w-6 text-green-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm text-gray-500">Total Bounties</p>
								<p className="text-2xl font-bold text-green-600">
									{bountyCount || 0}
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-shadow">
						<CardContent className="flex items-center p-6">
							<div className="p-2 bg-green-100 rounded-lg">
								<Users className="h-6 w-6 text-green-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm text-gray-500">Your Applied Bounties</p>
								<p className="text-2xl font-bold text-green-600">
									{userAppliedBounties.length}
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-shadow">
						<CardContent className="flex items-center p-6">
							<div className="p-2 bg-green-100 rounded-lg">
								<Rocket className="h-6 w-6 text-green-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm text-gray-500">Available Bounties</p>
								<p className="text-2xl font-bold text-green-600">
									{availableBounties.length}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Applied Bounties */}
				{appliedBounties.length > 0 && (
					<Card className="mb-8">
						<CardHeader>
							<CardTitle className="text-xl font-semibold text-gray-900">
								Your Applied Bounties
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{appliedBounties.map((bounty) => (
									<div
										key={bounty.id}
										className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
									>
										<div className="flex justify-between items-start">
											<div>
												<h3 className="font-medium text-lg text-gray-900">
													{bounty.issueLink}
												</h3>
												<p className="text-sm text-gray-400 mt-2">
													Deadline:{" "}
													{new Date(
														Number(bounty.deadline) * 1000
													).toLocaleDateString()}
												</p>
											</div>
											<div className="text-right">
												<p className="text-xl font-bold text-green-600">
													${Number(bounty.amount) / 1e18}
												</p>
												<span className="inline-block mt-2 px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-600">
													Applied
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Available Bounties */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-xl font-semibold text-gray-900">
							Available Bounties
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{availableBounties.map((bounty) => (
								<div
									key={bounty.id}
									className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
								>
									<div className="flex justify-between items-start">
										<div>
											<h3 className="font-medium text-lg text-gray-900">
												{bounty.issueLink}
											</h3>
											<p className="text-sm text-gray-400 mt-2">
												Deadline:{" "}
												{new Date(
													Number(bounty.deadline) * 1000
												).toLocaleDateString()}
											</p>
										</div>
										<div className="text-right">
											<p className="text-xl font-bold text-green-600">
												${Number(bounty.amount) / 1e18}
											</p>
											<button
												onClick={() => setSelectedBounty(bounty)}
												className="mt-2 px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
											>
												Apply
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</main>

			{/* Dialog */}
			<Dialog
				open={!!selectedBounty}
				onOpenChange={() => setSelectedBounty(null)}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Apply for Bounty</DialogTitle>
					</DialogHeader>
					{selectedBounty && (
						<BountyApplication
							bounty={selectedBounty}
							hasApplied={hasAppliedToBounty(Number(selectedBounty.id))}
							onClose={() => setSelectedBounty(null)}
						/>
					)}
				</DialogContent>
			</Dialog>

			<CreateProfileModal
				isOpen={modalState.profile}
				onClose={() => setModalState((prev) => ({ ...prev, profile: false }))}
			/>

			<CreateBountyModal
				isOpen={modalState.bounty}
				onClose={() => setModalState((prev) => ({ ...prev, bounty: false }))}
			/>
		</div>
	);
};

export default BountiesPage;