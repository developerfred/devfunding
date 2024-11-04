import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import ContextProvider from "@/context";
import { headers } from "next/headers";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "DevFunding on Morph",
	description: "Decentralized funding platform for developers",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookies = headers().get("cookie");

	return (
		<html lang="en" className="h-full">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full`}
			>
				<div className="min-h-screen bg-white dark:bg-gray-500">
					{/* Background Pattern */}
					<div
						className="absolute inset-0 -z-10 opacity-50 dark:opacity-30"
						style={{
							backgroundImage: `
                radial-gradient(at 27% 37%, hsla(108, 62%, 47%, 0.2) 0px, transparent 50%),
                radial-gradient(at 97% 21%, hsla(108, 65%, 75%, 0.2) 0px, transparent 50%),
                radial-gradient(at 52% 99%, hsla(108, 55%, 65%, 0.2) 0px, transparent 50%),
                radial-gradient(at 10% 29%, hsla(108, 45%, 55%, 0.2) 0px, transparent 50%),
                radial-gradient(at 97% 96%, hsla(108, 35%, 45%, 0.2) 0px, transparent 50%),
                radial-gradient(at 33% 50%, hsla(108, 25%, 35%, 0.2) 0px, transparent 50%),
                radial-gradient(at 79% 53%, hsla(108, 15%, 25%, 0.2) 0px, transparent 50%)
              `,
						}}
					/>

					{/* Content */}
					<div className="relative">
						<ContextProvider cookies={cookies}>
							<Header />
							<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
								{children}
							</main>
						</ContextProvider>
					</div>
				</div>
			</body>
		</html>
	);
}
