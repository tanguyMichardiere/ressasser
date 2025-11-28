import Parser from "rss-parser";
import type { Config } from "./config";
import "server-only";
import { cacheLife } from "next/cache";

export type Link = {
	category: string;
	title: string;
	date: Date;
	url: string;
};

const parser = new Parser();

/**
 * Get the 10 most recent links from a feed URL
 */
async function getFeedLinks(url: string) {
	"use cache";
	cacheLife("minutes");

	const response = await fetch(url);
	const feed = await parser.parseString(await response.text());
	return feed.items
		.flatMap((item) => {
			if (item.title === undefined || item.link === undefined || item.isoDate === undefined) {
				return [];
			}
			const timestamp = Date.parse(item.isoDate);
			return { title: item.title, timestamp, date: new Date(timestamp), url: item.link };
		})
		.toSorted((linkA, linkB) => linkB.timestamp - linkA.timestamp)
		.slice(0, 10);
}

export async function getLinks(config: Config): Promise<[Array<Link>, Array<unknown>]> {
	const linksByFeed = await Promise.allSettled(
		config.categories.flatMap((category) =>
			category.feeds.map((feed) =>
				getFeedLinks(feed.url).then((links) =>
					links
						.slice(0, feed.links ?? category.linksPerFeed ?? config.linksPerFeed)
						.map((link) => ({ ...link, category: category.name })),
				),
			),
		),
	);

	return [
		linksByFeed
			.flatMap((result) => (result.status === "fulfilled" ? result.value : []))
			.toSorted((linkA, linkB) => linkB.timestamp - linkA.timestamp),
		linksByFeed.flatMap((result) => (result.status === "rejected" ? [result.reason] : [])),
	];
}
