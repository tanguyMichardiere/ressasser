"use client";

import type { BeforeSendEvent } from "@vercel/analytics";
import { Analytics } from "@vercel/analytics/next";

function beforeSend(event: BeforeSendEvent) {
	const url = new URL(event.url);
	url.searchParams.delete("config");
	return { ...event, url: url.toString() };
}

export function ClientAnalytics() {
	return <Analytics beforeSend={beforeSend} />;
}
