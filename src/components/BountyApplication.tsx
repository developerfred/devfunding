/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment,  @typescript-eslint/no-explicit-any  */
// @ts-nocheck
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { publicClient, devFundingConfig } from "@/lib/contract/client";
import { createWalletClient, custom, parseEther } from "viem";
import { morphHolesky } from "viem/chains";
import type { Bounty } from "@/types";

type FlexibleProvider = {
  request: (...args: any[]) => Promise<any>;
  [key: string]: any;
};

interface BountyApplicationProps {
  bounty: Bounty;
  onClose?: () => void;
  hasApplied?: boolean;
}

const BountyApplication: React.FC<BountyApplicationProps> = ({ bounty, onClose, hasApplied = false }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);
  const [walletClient, setWalletClient] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const REQUIRED_CONTRIBUTION = parseEther("1"); // 1 ENT in wei

  const checkMetaMaskInstallation = () => {
    const provider = typeof window !== "undefined" ? window.ethereum : undefined;
    const isInstalled = !!provider?.isMetaMask;
    setIsMetaMaskInstalled(isInstalled);

    if (isInstalled && provider) {
      const flexibleProvider = provider as FlexibleProvider;
      const client = createWalletClient({
        chain: morphHolesky,
        transport: custom(flexibleProvider),
      });
      setWalletClient(client);
    }
  };

  useEffect(() => {
    checkMetaMaskInstallation();
  }, []);

  const handleApply = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      if (!isMetaMaskInstalled || !walletClient) {
        setError("Please install a web3 wallet to apply for bounties.");
        return;
      }

      const [address] = await walletClient.requestAddresses();

      // Check token approval first
      const { request: approveRequest } = await publicClient.simulateContract({
        address: devFundingConfig.tokenAddress, 
        abi: [
          {
            name: "approve",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [
              { name: "spender", type: "address" },
              { name: "amount", type: "uint256" }
            ],
            outputs: [{ name: "", type: "bool" }]
          }
        ],
        functionName: "approve",
        args: [devFundingConfig.address, REQUIRED_CONTRIBUTION],
        account: address,
      });

      // Execute approval
      const approveHash = await walletClient.writeContract(approveRequest);
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      // Contribute to bounty
      const { request: contributionRequest } = await publicClient.simulateContract({
        address: devFundingConfig.address,
        abi: devFundingConfig.abi,
        functionName: "contributeToBounty",
        args: [BigInt(bounty.id), REQUIRED_CONTRIBUTION],
        account: address,
      });

      // Send contribution transaction
      const hash = await walletClient.writeContract(contributionRequest);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        if (onClose) onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to apply for bounty. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMetaMaskInstalled) {
    return (
      <Button onClick={checkMetaMaskInstallation} variant="default">
        Install Web3 Wallet to Apply
      </Button>
    );
  }

  if (hasApplied) {
    return (
      <Button variant="default" disabled>
        Already Applied
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Apply for Bounty</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for Bounty #{bounty.id}</DialogTitle>
          <DialogDescription>
            Review and confirm your application for this bounty. 
            A contribution of 1 ENT token is required to apply.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <h3 className="text-sm font-medium leading-none">Issue Link</h3>
            <p className="text-sm text-muted-foreground">{bounty.issueLink}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium leading-none">Bounty Amount</h3>
            <p className="text-sm text-muted-foreground">
              ${Number(bounty.amount) / 1e18}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium leading-none">Required Contribution</h3>
            <p className="text-sm text-muted-foreground">1 ENT Token</p>
          </div>
          <div>
            <h3 className="text-sm font-medium leading-none">Deadline</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(Number(bounty.deadline) * 1000).toLocaleDateString()}
            </p>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-600">
              You will need to approve the contract to spend 1 ENT token, then confirm the contribution transaction.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-600">
                Successfully applied for bounty!
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={isSubmitting || success}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : success ? (
              "Applied!"
            ) : (
              "Contribute & Apply"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BountyApplication;