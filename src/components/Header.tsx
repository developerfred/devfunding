/* eslint-disable @typescript-eslint/no-unused-vars,  */

"use client";
import ConnectButton from "@/components/ConnectButton";
import { Award, Bell, Search, Target, UserPlus, Wallet } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const navigationTabs = [
	{ name: "grants", label: "Grants" },
	{ name: "bounties", label: "Bounties" },
	{ name: "governance", label: "Governance" },
	{ name: "developers", label: "Developers" },
];

const Header = () => {
	const [activeTab, setActiveTab] = useState("dashboard");
	const [modalState, setModalState] = useState({
		bounty: false,
		profile: false,
	});
	const [notifications] = useState([
		{ id: 1, text: "New grant available", type: "info" },
		{ id: 2, text: "Your application was approved", type: "success" },
	]);

	const handleTabClick = (name) => {
		setActiveTab(name);
		window.location.href = `/${name === "developers" ? "leaderboard" : name}`;
	};

	return (
		<header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo Section */}
					<div className="flex items-center">
						<Link href="/" className="flex no-underline ">
							<Award className="h-8 w-8 text-green-500 dark:text-green-400" />
							<span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
								DevFunding
							</span>
						</Link>
					</div>

					{/* Search Bar */}
					<div className="hidden md:flex items-center flex-1 max-w-md mx-8">
						<div className="w-full relative">
							<Input
								type="search"
								placeholder="Search grants, bounties, or developers..."
								className="w-full pl-10 pr-4 py-2"
							/>
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						</div>
					</div>

					{/* Navigation */}
					<nav className="hidden md:flex space-x-1">
						{navigationTabs.map((tab) => (
							<Button
								key={tab.name}
								variant={activeTab === tab.name ? "default" : "ghost"}
								onClick={() => handleTabClick(tab.name)}
								className={`px-3 py-2 text-sm ${
									activeTab === tab.name
										? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
										: "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
								}`}
							>
								{tab.label}
							</Button>
						))}
					</nav>

					{/* Right Section - Actions */}
					<div className="flex items-center space-x-4">
						{/* Notifications */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="relative">
									<Bell className="h-5 w-5" />
									{notifications.length > 0 && (
										<span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full" />
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-64">
								{notifications.map((notification) => (
									<DropdownMenuItem key={notification.id}>
										<span className="text-sm">{notification.text}</span>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Connect Wallet */}
						<ConnectButton />
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
