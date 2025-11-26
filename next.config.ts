import withNextBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import { headers } from "./headers.config";

let nextConfig: NextConfig = {
	// type checking is done in CI
	typescript: { ignoreBuildErrors: true },
	typedRoutes: true,
	reactStrictMode: true,
	reactCompiler: true,
	headers() {
		return Promise.resolve([{ headers, source: "/:path*" }]);
	},
	poweredByHeader: false,
	images: {
		remotePatterns: [
			{
				hostname: "s2.googleusercontent.com",
				pathname: "/s2/favicons",
				port: "",
				protocol: "https",
			},
		],
	},
	output: process.env.STANDALONE_OUTPUT === "true" ? "standalone" : undefined,
};

nextConfig = withNextBundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
})(nextConfig);

export default nextConfig;
