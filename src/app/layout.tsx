import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Ressasser",
	description: "RSS Server Side Reader",
};

export default function RootLayout(props: LayoutProps<"/">) {
	return (
		<html lang="en">
			<body className={`${inter.variable} antialiased max-w-md mx-auto`}>{props.children}</body>
		</html>
	);
}
