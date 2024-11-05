"use client";

import React, { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { devFundingConfig } from "@/lib/contract/config";

const StatusFooter = () => {
	const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);

	const data = {
		contractAddress: devFundingConfig.address,
		tokenAddress: "0xf5056B96ab242C566002852d0b98ce0BcDf1af51",
		network: "Morph",
	};

	const copyToClipboard = async (text) => {
		try {
			await navigator.clipboard.writeText(text);
			setShowCopiedTooltip(true);
			setTimeout(() => setShowCopiedTooltip(false), 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	return (
		<div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 border-t border-gray-800">
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				{/* Status indicator */}
				<div className="relative">
					<div className="w-3 h-3 bg-green-500 rounded-full absolute -top-1 -right-1 animate-pulse" />
				</div>

				{/* Info containers */}
				<div className="flex space-x-6 flex-1 ml-6">
					<TooltipProvider>
						{/* Contract Address */}
						<div className="flex items-center space-x-2">
							<span className="text-gray-400 text-sm">Contract:</span>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="font-mono text-sm"
										onClick={() => copyToClipboard(data.contractAddress)}
									>
										{data.contractAddress.slice(0, 6)}...
										{data.contractAddress.slice(-4)}
										<Copy className="ml-2 h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>{showCopiedTooltip ? "Copied!" : "Click to copy"}</p>
								</TooltipContent>
							</Tooltip>
						</div>

						{/* Token Address */}
						<div className="flex items-center space-x-2">
							<span className="text-gray-400 text-sm">Token:</span>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="font-mono text-sm"
										onClick={() => copyToClipboard(data.tokenAddress)}
									>
										{data.tokenAddress.slice(0, 6)}...
										{data.tokenAddress.slice(-4)}
										<Copy className="ml-2 h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>{showCopiedTooltip ? "Copied!" : "Click to copy"}</p>
								</TooltipContent>
							</Tooltip>
						</div>

						{/* Network */}
						<div className="flex items-center space-x-2">
							<span className="text-gray-400 text-sm">Network:</span>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="font-mono text-sm"
										onClick={() => copyToClipboard(data.network)}
									>
										{data.network}
										<Copy className="ml-2 h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>{showCopiedTooltip ? "Copied!" : "Click to copy"}</p>
								</TooltipContent>
							</Tooltip>
						</div>
					</TooltipProvider>
				</div>
			</div>
		</div>
	);
};

export default StatusFooter;
