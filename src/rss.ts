import Parser from "rss-parser";
import type { Category, Config, Feed } from "./config";
import "server-only";

export type Link = {
	category: string;
	title: string;
	timestamp: number;
	date: Date;
	url: string;
};

const parser = new Parser();

async function getFeedLinks(feed: Feed, category: Category, config: Config): Promise<Array<Link>> {
	const response = await fetch(feed.url, { cache: "force-cache", next: { revalidate: 60 } });
	const parsedFeed = await parser.parseString(await response.text());
	return parsedFeed.items
		.flatMap((item) => {
			if (item.title === undefined || item.link === undefined || item.isoDate === undefined) {
				return [];
			}
			const timestamp = Date.parse(item.isoDate);
			return [
				{
					category: category.name,
					title: item.title,
					timestamp,
					date: new Date(timestamp),
					url: item.link,
				},
			];
		})
		.toSorted((linkA, linkB) => linkB.timestamp - linkA.timestamp)
		.slice(0, feed.links ?? category.linksPerFeed ?? config.linksPerFeed);
}

export async function getLinks(config: Config): Promise<[Array<Link>, Array<unknown>]> {
	const linksByFeed = await Promise.allSettled(
		config.categories.flatMap((category) =>
			category.feeds.map((feed) => getFeedLinks(feed, category, config)),
		),
	);

	return [
		linksByFeed
			.flatMap((result) => (result.status === "fulfilled" ? result.value : []))
			.toSorted((linkA, linkB) => linkB.timestamp - linkA.timestamp),
		linksByFeed.flatMap((result) => (result.status === "rejected" ? [result.reason] : [])),
	];
}
