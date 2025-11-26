import Parser from "rss-parser";
import type { Category, Config, Feed } from "./config";
import type { Link } from "./link";
import "server-only";

const parser = new Parser();

async function getFeedLinks(feed: Feed, category: Category, config: Config): Promise<Array<Link>> {
	const response = await fetch(feed.url, {
		cache: "force-cache",
		next: { revalidate: 3600 },
	});
	const parsedFeed = await parser.parseString(await response.text());
	return parsedFeed.items
		.flatMap((item) =>
			item.title !== undefined && item.link !== undefined && item.pubDate !== undefined
				? [
						{
							category: category.name,
							title: item.title,
							date: new Date(item.pubDate),
							url: item.link,
						},
					]
				: [],
		)
		.toSorted((linkA, linkB) => linkB.date.getTime() - linkA.date.getTime())
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
			.toSorted((linkA, linkB) => linkB.date.getTime() - linkA.date.getTime()),
		linksByFeed.flatMap((result) => (result.status === "rejected" ? [result.reason] : [])),
	];
}
