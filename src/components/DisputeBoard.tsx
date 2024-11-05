/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment  */
// @ts-nocheck

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";
import { useState, useEffect } from "react";
import { contractInteractions } from "@/lib/contract/client";
import type { Dispute } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface DisputeBoardProps {
	disputeId: number;
	onVoteComplete?: () => void;
}

export const DisputeBoard: React.FC<DisputeBoardProps> = ({
	disputeId,
	onVoteComplete,
}) => {
	const [dispute, setDispute] = useState<Dispute | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { toast } = useToast();

	const fetchDispute = async () => {
		try {
			const [
				isDisputeResolved,
				resolutionOutcome,
				yesVotes,
				noVotes,
				startTime,
			] = await contractInteractions.disputes(disputeId);
			setDispute({
				id: disputeId,
				isDisputeResolved,
				resolutionOutcome,
				yesVotes: Number(yesVotes),
				noVotes: Number(noVotes),
				createdAt: Number(startTime),
			});
		} catch (error) {
			console.error("Error fetching dispute:", error);
			toast({
				title: "Error",
				description: "Failed to fetch dispute details",
				variant: "destructive",
			});
		}
	};

	const handleVote = async (vote: boolean) => {
		if (!dispute) return;

		setIsLoading(true);
		try {
			await contractInteractions.voteOnDispute(dispute.id, vote);
			toast({
				title: "Success",
				description: "Vote submitted successfully",
			});
			await fetchDispute();
			onVoteComplete?.();
		} catch (error) {
			console.error("Error voting:", error);
			toast({
				title: "Error",
				description: "Failed to submit vote",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleRaiseDispute = async () => {
		setIsLoading(true);
		try {
			await contractInteractions.raiseDispute(disputeId);
			toast({
				title: "Success",
				description: "Dispute raised successfully",
			});
			await fetchDispute();
		} catch (error) {
			console.error("Error raising dispute:", error);
			toast({
				title: "Error",
				description: "Failed to raise dispute",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchDispute();
	}, [disputeId]);

	if (!dispute) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="flex justify-center">
						<p>Loading dispute details...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Dispute Resolution #{disputeId}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div>
						<h3 className="font-medium">Status</h3>
						<p>{dispute.isDisputeResolved ? "Resolved" : "Active"}</p>
					</div>

					{dispute.isDisputeResolved ? (
						<Alert>
							<AlertDescription>
								Resolution: {dispute.resolutionOutcome}
							</AlertDescription>
						</Alert>
					) : (
						<div>
							<h3 className="font-medium">Current Votes</h3>
							<div className="grid grid-cols-2 gap-4 mt-2">
								<div>
									<p className="text-green-600">Yes: {dispute.yesVotes}</p>
								</div>
								<div>
									<p className="text-red-600">No: {dispute.noVotes}</p>
								</div>
							</div>
							<div className="flex gap-2 mt-4">
								<Button onClick={() => handleVote(true)} disabled={isLoading}>
									Vote Yes
								</Button>
								<Button
									onClick={() => handleVote(false)}
									variant="destructive"
									disabled={isLoading}
								>
									Vote No
								</Button>
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
