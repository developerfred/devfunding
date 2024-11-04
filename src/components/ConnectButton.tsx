/* eslint-disable @typescript-eslint/no-explicit-any,  @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

import React from "react";

// Constants
const BUTTON_STYLES = {
	default:
		"bg-green-200 text-white hover:brightness-110 transition-all duration-200 dark:bg-green-300",
	outline:
		"border-green-200 text-green-200 hover:bg-green-200/10 transition-all duration-200 dark:border-green-300 dark:text-green-300 dark:hover:bg-green-300/10",
} as const;

const buttonVariants = cva(
	[
		"relative",
		"inline-flex",
		"items-center",
		"justify-center",
		"rounded-lg",
		"text-sm",
		"font-medium",
	].join(" "),
	{
		variants: {
			variant: {
				default: BUTTON_STYLES.default,
				outline: BUTTON_STYLES.outline,
			},
			size: {
				sm: "h-9 px-4 py-2",
				md: "h-10 px-6 py-2",
				lg: "h-11 px-8 py-2",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

const WEB3_MODAL_STYLES = `
  :root {
    --wcm-accent-fill-color: #85C83E !important;
    --w3m-accent: #85C83E !important;
    --w3m-default: #85C83E !important;
    --wui-color-accent-base-100: #85C83E !important;
    
    /* Adding more Web3Modal custom variables */
    --w3m-color-fg-1: #1F2227 !important;
    --w3m-color-fg-2: #417803 !important;
    --w3m-color-fg-3: #698518 !important;
    --w3m-color-bg-1: #FFFFFF !important;
    --w3m-color-bg-2: #F7F9F6 !important;
    --w3m-color-bg-3: #EAFF08 !important;
    
    /* Dark mode variables */
    .dark {
      --w3m-color-fg-1: #FFFFFF !important;
      --w3m-color-fg-2: #A8E88B !important;
      --w3m-color-fg-3: #85C83E !important;
      --w3m-color-bg-1: #1F2227 !important;
      --w3m-color-bg-2: #2E323A !important;
      --w3m-color-bg-3: #417803 !important;
    }
  }

  w3m-button {
    background: #85C83E !important;
    border-radius: 0.5rem !important;
    transition: all 0.2s ease !important;
    height: 40px !important;
    min-width: auto !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .dark w3m-button {
    background: #A8E88B !important;
  }

  w3m-button > button {
    background: none !important;
    border: none !important;
    color: white !important;
    font-weight: 500 !important;
    height: 100% !important;
    width: 100% !important;
    padding: 0 1.5rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  w3m-button:hover {
    filter: brightness(110%) !important;
  }

  /* Removing decorative elements */
  w3m-button::before,
  w3m-button::after,
  w3m-button > *::before,
  w3m-button > *::after {
    display: none !important;
  }

  /* Modal styles */
  w3m-modal {
    --w3m-background-color: var(--w3m-color-bg-1) !important;
    --w3m-container-border-radius: 24px !important;
    --w3m-overlay-backdrop-filter: blur(5px) !important;
  }

  /* Modal overlay */
  .w3m-overlay {
    background: rgba(31, 34, 39, 0.7) !important;
  }
`;

interface ConnectButtonProps {
	variant?: "default" | "outline";
	size?: "sm" | "md" | "lg";
	className?: string;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({
	variant = "default",
	size = "md",
	className,
}) => {
	React.useEffect(() => {
		const existingStyle = document.getElementById("web3modal-styles");
		if (existingStyle) {
			existingStyle.remove();
		}

		const style = document.createElement("style");
		style.id = "web3modal-styles";
		style.textContent = WEB3_MODAL_STYLES;
		document.head.appendChild(style);

		return () => {
			const styleToRemove = document.getElementById("web3modal-styles");
			if (styleToRemove) {
				styleToRemove.remove();
			}
		};
	}, []);

	return (
		<div className={cn("relative group rounded-lg overflow-hidden", className)}>
			<w3m-button
				label="Connect Wallet"
				balance="hide"
				size={size === "lg" ? "md" : size}
				className={cn(
					buttonVariants({
						variant,
						size,
					}),
				)}
			/>
		</div>
	);
};

export default ConnectButton;
