/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment  */
// @ts-nocheck
"use client";
import React from "react";
import useGovernance from "@/hooks/useGovernance";
import { Plus, ThumbsUp } from "lucide-react";

const GovernancePage = () => {
	const { proposals, votes, error, voteForProposal, proposeImprovement } =
		useGovernance();

	return (
		<div className="min-h-screen bg-white text-gray-800">
			<header className="container mx-auto px-4 py-16">
				<h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-500 to-green-700 text-transparent bg-clip-text">
					Governance
				</h1>
				{error && <p className="text-red-500">{error}</p>}
			</header>

			<section className="container mx-auto px-4 py-12">
				<h2 className="text-2xl font-bold mb-6">Current Proposals</h2>
				<ul className="space-y-4">
					{proposals.map((proposal, index) => (
						<li key={index} className="p-4 border rounded-lg shadow-sm">
							<h3 className="font-bold">{proposal}</h3>
							<p className="text-gray-600 mb-2">
								{votes[index].toString()} Votes
							</p>
							<button
								className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
								onClick={() => voteForProposal(index)}
							>
								<ThumbsUp className="mr-2" size={20} /> Vote
							</button>
						</li>
					))}
				</ul>
			</section>

			<section className="container mx-auto px-4 py-12">
				<h2 className="text-2xl font-bold mb-6">Propose an Improvement</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						const proposal = e.target.elements.proposal.value;
						if (proposal) proposeImprovement(proposal);
					}}
					className="space-y-4"
				>
					<input
						type="text"
						name="proposal"
						placeholder="Enter your proposal..."
						className="w-full px-3 py-2 border rounded-lg"
					/>
					<button
						type="submit"
						className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
					>
						<Plus className="mr-2" size={20} /> Propose
					</button>
				</form>
			</section>
		</div>
	);
};

export default GovernancePage;
