import type { Header } from "next/dist/lib/load-custom-routes";

const self = "'self'";
const data = "data:";
const blob = "blob:";
const none = "'none'";
const unsafeEval = "'unsafe-eval'";
const unsafeInline = "'unsafe-inline'";

const contentSecurityPolicy: Record<string, string[]> = {
	"base-uri": [self],
	"default-src": [self],
	"font-src": [self],
	"form-action": [self],
	"frame-ancestors": [none],
	"img-src": [self, blob, data],
	"object-src": [none],
	"script-src": [self, unsafeEval, unsafeInline],
	"style-src": [self, unsafeInline],
};

if (process.env.ALLOW_HTTP !== "true") {
	contentSecurityPolicy["upgrade-insecure-requests"] = [];
}

export const headers = [
	{ key: "X-DNS-Prefetch-Control", value: "on" },
	{ key: "X-XSS-Protection", value: "1; mode=block" },
	{ key: "X-Frame-Options", value: "DENY" },
	// https://www.w3.org/TR/permissions-policy-1/
	{ key: "Permissions-Policy", value: "web-share=self" },
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "Referrer-Policy", value: "origin-when-cross-origin" },
	{
		key:
			process.env.NODE_ENV === "production"
				? "Content-Security-Policy"
				: "Content-Security-Policy-Report-Only",
		value: Object.entries(contentSecurityPolicy)
			.map(([key, value]) => `${key} ${value.join(" ")}`)
			.join("; "),
	},
] satisfies Header["headers"];
