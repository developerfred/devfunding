import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useGrantApplication } from "@/hooks/useGrantApplication";
import type { Grant } from "@/types";
import { useAppKit } from "@reown/appkit/react";

export const GrantApplication: React.FC<{ grant: Grant }> = ({ grant }) => {
	const { open: openConnectModal } = useAppKit();
	const {
		isLoading,
		isSuccess,
		error,
		isConnected,
		applyForGrant,
		isTransactionLoading,
	} = useGrantApplication(grant.id);

	if (!isConnected) {
		return (
			<Button onClick={openConnectModal} variant="default">
				Connect Wallet to Apply
			</Button>
		);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default">Apply for Grant</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Apply for Grant #{grant.id}</DialogTitle>
					<DialogDescription>
						Review and confirm your application details below.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div>
						<h3 className="text-sm font-medium leading-none">Description</h3>
						<p className="text-sm text-muted-foreground">{grant.description}</p>
					</div>
					<div>
						<h3 className="text-sm font-medium leading-none">Requirements</h3>
						<p className="text-sm text-muted-foreground">
							{grant.requirements}
						</p>
					</div>
					<div>
						<h3 className="text-sm font-medium leading-none">Amount</h3>
						<p className="text-sm text-muted-foreground">
							${Number(grant.amount) / 1e18}
						</p>
					</div>
				</div>

				{error && <div className="text-red-500 text-sm mb-4">{error}</div>}

				<Button
					onClick={applyForGrant}
					disabled={isLoading || isTransactionLoading || isSuccess}
				>
					{isLoading || isTransactionLoading
						? "Applying..."
						: isSuccess
							? "Applied!"
							: "Submit Application"}
				</Button>

				{isTransactionLoading && (
					<p className="text-sm text-muted-foreground mt-4">
						Waiting for transaction confirmation...
					</p>
				)}

				{isSuccess && (
					<p className="text-sm text-green-500 mt-4">
						Your application has been submitted successfully. Check your wallet
						for transaction details.
					</p>
				)}
			</DialogContent>
		</Dialog>
	);
};
