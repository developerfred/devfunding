/* eslint-disable @typescript-eslint/no-unused-vars,  */
import Link from "next/link";
import type React from "react";

const Footer: React.FC = () => (
	<>
		<footer className="bg-gray-50 py-12">
			<div className="container mx-auto px-4">
				<div className="grid md:grid-cols-4 gap-8">
					<div>
						<h3 className="font-bold mb-4 text-gray-800">DevFunding</h3>
						<p className="text-gray-600 text-sm">
							Connecting Web3 talent with opportunities.
						</p>
					</div>
					<div>
						<h4 className="font-semibold mb-4 text-gray-800">Platform</h4>
						<ul className="space-y-2 text-gray-600 text-sm">
							<li>How it Works</li>
							<li>Features</li>
							<li>Pricing</li>
							<li>FAQ</li>
						</ul>
					</div>
					<div>
						<h4 className="font-semibold mb-4 text-gray-800">Resources</h4>
						<ul className="space-y-2 text-gray-600 text-sm">
							<li>Documentation</li>
							<li>API</li>
							<li>Support</li>
							<li>Community</li>
						</ul>
					</div>
					<div>
						<h4 className="font-semibold mb-4 text-gray-800">Connect</h4>
						<ul className="space-y-2 text-gray-600 text-sm">
							<li>Twitter</li>
							<li>Discord</li>
							<li>GitHub</li>
							<li>Blog</li>
						</ul>
					</div>
				</div>
				<div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600 text-sm">
					© 2024 DevFunding. All rights reserved.
				</div>
			</div>
		</footer>
	</>
);

export default Footer;
