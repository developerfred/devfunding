/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment  */
// @ts-nocheck
"use client";
import { CreateBountyModal } from "@/components/CreateBountyModal";
import {CreateDevProfileModal} from "@/components/CreateDevProfileModal";
import CreateGrantModal from "@/components/CreateGrantModal";
import { GrantApplication } from "@/components/GrantApplication";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useBountiesManager } from "@/hooks/useBountiesManager";
import type { Bounty } from "@/types";
import { Bell, Plus, Rocket, Trophy, Users } from "lucide-react";
import React, { useState } from "react";

const BountiesPage = () => {
    const { bounties, isLoading, error, bountyCount } = useBountiesManager();
    const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [modalState, setModalState] = useState({
		bounty: false,
		profile: false,
	});

    const closeBountyModal = () => {
        setModalState(prev => ({ ...prev, bounty: false }));
    };

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
						<p className="text-center">Loading bountys...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			{/* Navigation */}
			<nav className="bg-white ">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16 items-center">
						<div className="flex items-center space-x-4">
							{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
							<button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
								<Bell className="h-5 w-5 text-gray-500" />
							</button>
							{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
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
								<p className="text-sm text-gray-500">Total Bountys</p>
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
								<p className="text-sm text-gray-500">Active Developers</p>
								<p className="text-2xl font-bold text-green-600">156</p>
							</div>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-shadow">
						<CardContent className="flex items-center p-6">
							<div className="p-2 bg-green-100 rounded-lg">
								<Rocket className="h-6 w-6 text-green-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm text-gray-500">Completed Projects</p>
								<p className="text-2xl font-bold text-green-600">89</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* bounty List */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-xl font-semibold text-gray-900">
							Active Bountys
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
                            {bounties &&
                                bounties.map((bounty) => (
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
                                                        Number(bounty.deadline) * 1000,
													).toLocaleDateString()}
												</p>
											</div>
											<div className="text-right">
												<p className="text-xl font-bold text-green-600">
													${Number(bounty.amount) / 1e18}
												</p>
												{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
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
						<DialogTitle>Apply for Grant</DialogTitle>
					</DialogHeader>
					{selectedBounty && <GrantApplication bounty={selectedBounty} />}
				</DialogContent>
			</Dialog>
	
			<CreateDevProfileModal
				isOpen={modalState.profile}
				onClose={() => setModalState((prev) => ({ ...prev, profile: false }))}
			/>

            <CreateBountyModal isOpen={modalState.bounty} onClose={closeBountyModal} />
		</div>
	);
};

export default BountiesPage;
