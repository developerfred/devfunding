/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment  */
// @ts-nocheck

import {
	Award,
	BarChart,
	Check,
	ChevronRight,
	Clock,
	Code,
	DollarSign,
	Rocket,
	Shield,
	Star,
	Users,
	Zap,
	github,
} from "lucide-react";
import React from "react";
import CreateGrantModal from "@/components/CreateGrantModal";
import Link from 'next/link';

export default function LandingPage() {	
	return (
		<div className="min-h-screen bg-white text-gray-800">
			{/* Hero Section */}
			<header className="container mx-auto px-4 py-16">
				<div className="text-center">
					<h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-500 to-green-700 text-transparent bg-clip-text">
						DevFunding
					</h1>
					<p className="text-xl text-gray-600 mb-8">
						Connecting Web3 Developers with Protocol Funding Opportunities
					</p>
					<div className="flex gap-4 justify-center">
						<Link href="/grants">
							<button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center">
								Apply for Grants <ChevronRight className="ml-2" size={20} />
							</button>
						</Link>
						<button className="border border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-medium flex items-center">
							Create a Profile <ChevronRight className="ml-2" size={20} />
						</button>
					</div>
				</div>
			</header>

			{/* Stats Section */}
			<section className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					<StatCard number="$2M+" label="Total Funded" />
					<StatCard number="500+" label="Active Developers" />
					<StatCard number="200+" label="Completed Grants" />
					<StatCard number="50+" label="Partner Protocols" />
				</div>
			</section>

			{/* Features Grid */}
			<section className="container mx-auto px-4 py-16 bg-gray-50">
				<h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
					Platform Features
				</h2>
				<div className="grid md:grid-cols-3 gap-8">
					<FeatureCard
						icon={<Shield className="text-green-600" size={32} />}
						title="Secure Escrow"
						description="All funds are held in secure smart contracts with dispute resolution mechanisms"
					/>
					<FeatureCard
						icon={<Users className="text-green-600" size={32} />}
						title="Community Driven"
						description="Transparent voting system for dispute resolution and platform improvements"
					/>
					<FeatureCard
						icon={<Star className="text-green-600" size={32} />}
						title="Premium Features"
						description="Enhanced visibility and exclusive features for premium members"
					/>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="bg-white py-16">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
						How It Works
					</h2>
					<div className="grid md:grid-cols-4 gap-8">
						<ProcessStep
							number="1"
							icon={<Users size={24} />}
							title="Create Profile"
							description="Set up your developer or protocol profile"
						/>
						<ProcessStep
							number="2"
							icon={<Rocket size={24} />}
							title="Post or Apply"
							description="Create grants or apply for opportunities"
						/>
						<ProcessStep
							number="3"
							icon={<Clock size={24} />}
							title="Milestone Tracking"
							description="Track progress through development milestones"
						/>
						<ProcessStep
							number="4"
							icon={<Check size={24} />}
							title="Secure Payment"
							description="Automatic payments through smart contracts"
						/>
					</div>
				</div>
			</section>

			{/* For Developers */}
			<section className="py-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold mb-8 text-gray-800">
						For Developers
					</h2>
					<div className="grid md:grid-cols-2 gap-8">
						<div className="space-y-4">
							<Feature
								icon={<Code size={24} />}
								title="Create Your Profile"
								description="Showcase your skills, experience, and portfolio to attract grant opportunities"
							/>
							<Feature
								icon={<Award size={24} />}
								title="Apply for Grants"
								description="Browse and apply for grants that match your expertise"
							/>
							<Feature
								icon={<Award size={24} />}
								title="Build Reputation"
								description="Earn reputation points and badges as you complete projects"
							/>
						</div>
						<div className="bg-white p-6 rounded-lg shadow-sm">
							<h3 className="text-xl font-semibold mb-4">Developer Benefits</h3>
							<ul className="space-y-2">
								<li className="flex items-center text-gray-600">
									<ChevronRight size={16} className="mr-2 text-green-600" />
									Direct funding opportunities
								</li>
								<li className="flex items-center text-gray-600">
									<ChevronRight size={16} className="mr-2 text-green-600" />
									Protected payments via escrow
								</li>
								<li className="flex items-center text-gray-600">
									<ChevronRight size={16} className="mr-2 text-green-600" />
									Portfolio building
								</li>
								<li className="flex items-center text-gray-600">
									<ChevronRight size={16} className="mr-2 text-green-600" />
									Community recognition
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="bg-green-600 py-16">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl font-bold mb-6 text-white">
						Ready to Get Started?
					</h2>
					<div className="flex gap-4 justify-center">
						<button className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium">
							Connect Wallet
						</button>
						<button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium">
							Learn More
						</button>
					</div>
				</div>
			</section>			
		</div>
	);
}

const StatCard = ({ number, label }) => (
	<div className="text-center">
		<div className="text-3xl font-bold text-green-600 mb-2">{number}</div>
		<div className="text-gray-600">{label}</div>
	</div>
);

const ProcessStep = ({ number, icon, title, description }) => (
	<div className="text-center">
		<div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
			<div className="text-green-600">{icon}</div>
		</div>
		<div className="text-2xl font-bold text-green-600 mb-2">{number}</div>
		<h3 className="font-semibold mb-2 text-gray-800">{title}</h3>
		<p className="text-gray-600 text-sm">{description}</p>
	</div>
);

const FeatureCard = ({ icon, title, description }) => (
	<div className="bg-white p-6 rounded-lg shadow-sm">
		<div className="mb-4">{icon}</div>
		<h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
		<p className="text-gray-600">{description}</p>
	</div>
);

const Feature = ({ icon, title, description }) => (
	<div className="flex items-start">
		<div className="p-2 bg-green-100 rounded-lg mr-4 text-green-600">
			{icon}
		</div>
		<div>
			<h3 className="font-semibold mb-1 text-gray-800">{title}</h3>
			<p className="text-gray-600 text-sm">{description}</p>
		</div>
	</div>
);
