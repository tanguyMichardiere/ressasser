import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientAnalytics } from "../components/client-analytics";
import { env } from "../env";

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
			{env.ANALYTICS && <ClientAnalytics />}
			<body className={`${inter.variable} antialiased`}>{props.children}</body>
		</html>
	);
}
