/* eslint-disable @typescript-eslint/no-explicit-any,  @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars */
// @ts-nocheck
"use client";
import {
	Activity,
	Award,
	BookOpen,
	ChevronDown,
	PlusCircle,
	Search,
	Star,
	TrendingUp,
	Users,
	Wallet,
} from "lucide-react";
import React, { useState } from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const mockChartData = [
	{ name: "Jan", tvl: 4000, grants: 24 },
	{ name: "Feb", tvl: 5000, grants: 13 },
	{ name: "Mar", tvl: 7000, grants: 38 },
	{ name: "Apr", tvl: 8780, grants: 42 },
	{ name: "May", tvl: 9890, grants: 54 },
	{ name: "Jun", tvl: 11000, grants: 67 },
];

const mockGrants = [
	{
		id: 1,
		title: "Web3 Social Platform Backend",
		amount: "15,000 USDC",
		deadline: "7 days",
		applications: 12,
		type: "Backend Development",
		status: "Active",
	},
	{
		id: 2,
		title: "Smart Contract Security Audit",
		amount: "20,000 USDC",
		deadline: "14 days",
		applications: 8,
		type: "Security",
		status: "Active",
	},
];

const mockVotes = [
	{
		id: 1,
		title: "Grant Distribution Update",
		status: "Active",
		votes: { for: 65, against: 35 },
		endTime: "2 days",
	},
	{
		id: 2,
		title: "New Premium Features",
		status: "Active",
		votes: { for: 78, against: 22 },
		endTime: "5 days",
	},
];

export default function DevFundingDashboard() {
	const [activeTab, setActiveTab] = useState("dashboard");

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Dashboard View */}
				{activeTab === "dashboard" && (
					<div className="space-y-6">
						{/* Stats */}
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
							<div className="bg-white p-6 rounded-lg shadow">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<TrendingUp className="h-6 w-6 text-blue-600" />
									</div>
									<div className="ml-4">
										<h3 className="text-sm font-medium text-gray-500">
											Total Value Locked
										</h3>
										<p className="text-lg font-semibold text-gray-900">
											$11.2M
										</p>
									</div>
								</div>
							</div>
							<div className="bg-white p-6 rounded-lg shadow">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<Activity className="h-6 w-6 text-blue-600" />
									</div>
									<div className="ml-4">
										<h3 className="text-sm font-medium text-gray-500">
											Active Grants
										</h3>
										<p className="text-lg font-semibold text-gray-900">67</p>
									</div>
								</div>
							</div>
							<div className="bg-white p-6 rounded-lg shadow">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<Users className="h-6 w-6 text-blue-600" />
									</div>
									<div className="ml-4">
										<h3 className="text-sm font-medium text-gray-500">
											Developers
										</h3>
										<p className="text-lg font-semibold text-gray-900">2.4k</p>
									</div>
								</div>
							</div>
							<div className="bg-white p-6 rounded-lg shadow">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<BookOpen className="h-6 w-6 text-blue-600" />
									</div>
									<div className="ml-4">
										<h3 className="text-sm font-medium text-gray-500">
											Proposals
										</h3>
										<p className="text-lg font-semibold text-gray-900">156</p>
									</div>
								</div>
							</div>
						</div>

						{/* Chart */}
						<div className="bg-white p-6 rounded-lg shadow">
							<h2 className="text-lg font-medium text-gray-900 mb-4">
								Platform Growth
							</h2>
							<div className="h-64">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={mockChartData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Line type="monotone" dataKey="tvl" stroke="#2563eb" />
										<Line type="monotone" dataKey="grants" stroke="#7c3aed" />
									</LineChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				)}

				{/* Grants View */}
				{activeTab === "grants" && (
					<div className="space-y-6">
						<div className="flex justify-between items-center">
							<h2 className="text-2xl font-bold text-gray-900">
								Active Grants
							</h2>
							<button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
								<PlusCircle className="h-4 w-4 mr-2" />
								Create Grant
							</button>
						</div>

						<div className="bg-white shadow overflow-hidden rounded-lg">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Grant
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Amount
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Deadline
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Applications
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{mockGrants.map((grant) => (
										<tr key={grant.id}>
											<td className="px-6 py-4">
												<div className="flex items-center">
													<div>
														<div className="text-sm font-medium text-gray-900">
															{grant.title}
														</div>
														<div className="text-sm text-gray-500">
															{grant.type}
														</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 text-sm text-gray-500">
												{grant.amount}
											</td>
											<td className="px-6 py-4 text-sm text-gray-500">
												{grant.deadline}
											</td>
											<td className="px-6 py-4 text-sm text-gray-500">
												{grant.applications}
											</td>
											<td className="px-6 py-4">
												<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
													{grant.status}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Governance View */}
				{activeTab === "governance" && (
					<div className="space-y-6">
						<div className="flex justify-between items-center">
							<h2 className="text-2xl font-bold text-gray-900">
								Active Proposals
							</h2>
							<button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
								<PlusCircle className="h-4 w-4 mr-2" />
								New Proposal
							</button>
						</div>

						<div className="grid grid-cols-1 gap-6">
							{mockVotes.map((vote) => (
								<div key={vote.id} className="bg-white shadow rounded-lg p-6">
									<div className="flex justify-between items-start">
										<div>
											<h3 className="text-lg font-medium text-gray-900">
												{vote.title}
											</h3>
											<p className="mt-1 text-sm text-gray-500">
												Ends in {vote.endTime}
											</p>
										</div>
										<span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
											{vote.status}
										</span>
									</div>
									<div className="mt-6">
										<div className="relative pt-1">
											<div className="flex mb-2 items-center justify-between">
												<div>
													<span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
														Votes
													</span>
												</div>
												<div className="text-right">
													<span className="text-xs font-semibold inline-block text-blue-600">
														{vote.votes.for}%
													</span>
												</div>
											</div>
											<div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
												<div
													style={{ width: `${vote.votes.for}%` }}
													className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
												/>
											</div>
										</div>
										<div className="flex justify-end space-x-4">
											<button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200">
												Vote For
											</button>
											<button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200">
												Vote Against
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
