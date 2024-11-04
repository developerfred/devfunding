"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDevelopersList } from "@/hooks/useDevelopersList";
import { Trophy } from "lucide-react";
import React from "react";

const LeaderboardPage = () => {
	const { developers, isLoading, error } = useDevelopersList();

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
						<p className="text-center">Loading developers...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white py-6">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<header className="mb-6">
					<h1 className="text-3xl font-bold leading-tight text-gray-900">
						<Trophy className="inline-block mr-2 text-yellow-400" /> Developers
						Leaderboard
					</h1>
				</header>

				<Card>
					<CardHeader>
						<CardTitle className="text-xl font-semibold text-gray-900">
							Top Developers
						</CardTitle>
					</CardHeader>
					<CardContent>
						<table className="table-auto w-full">
							<thead>
								<tr className="bg-gray-100">
									<th className="px-4 py-2 text-left">Rank</th>
									<th className="px-4 py-2 text-left">Developer</th>
									<th className="px-4 py-2 text-left">Reputation</th>
									<th className="px-4 py-2 text-left">Completed Grants</th>
									<th className="px-4 py-2 text-left">Grants Created</th>
									<th className="px-4 py-2 text-left">Grants Claimed</th>
								</tr>
							</thead>
							<tbody>
								{developers.map((dev, index) => (
									<tr key={dev.address} className="border-b">
										<td className="px-4 py-2">{index + 1}</td>
										<td className="px-4 py-2">{dev.githubHandle}</td>
										<td className="px-4 py-2">{dev.reputation}</td>
										<td className="px-4 py-2">{dev.completedGrants}</td>
										<td className="px-4 py-2">{dev.grantsCreated}</td>
										<td className="px-4 py-2">{dev.grantsClaimed}</td>
									</tr>
								))}
							</tbody>
						</table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default LeaderboardPage;
