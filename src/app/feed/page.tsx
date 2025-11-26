import Image from "next/image";
import Parser from "rss-parser";
import type { Category, Feed } from "../../config";
import { Config } from "../../config";

const parser = new Parser();

async function getFeedLinks(feed: Feed, category: Category, config: Config) {
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

async function getAllLinks(config: Config) {
	const linksByFeed = await Promise.allSettled(
		config.categories.flatMap((category) =>
			category.feeds.map((feed) => getFeedLinks(feed, category, config)),
		),
	);

	return [
		linksByFeed
			.flatMap((result) => (result.status === "fulfilled" ? result.value : []))
			.toSorted((linkA, linkB) => linkB.date.getTime() - linkA.date.getTime()),
		linksByFeed.flatMap((result) => (result.status === "rejected" ? result.reason : [])),
	] as const;
}

export default async function HomePage(props: PageProps<"/feed">) {
	const searchParams = await props.searchParams;
	const rawConfig = searchParams.config;

	// TODO: on missing or invalid config, open a form to edit it
	if (typeof rawConfig !== "string") {
		return <div>Invalid config</div>;
	}

	const config = Config.parse(JSON.parse(atob(rawConfig)));

	const [links, errors] = await getAllLinks(config);
	if (errors.length > 0) {
		// TODO: display errors
		console.log(errors);
	}

	return (
		// TODO: checkboxes to disable categories
		<ul className="list">
			{links.map((link) => (
				<li className="list-row" key={link.url}>
					<a
						// TODO: visited:text-base-content/50 does not work
						className="list-col-grow cursor-pointer visited:text-base-content/50 flex items-center gap-4"
						href={link.url}
						rel="noopener noreferrer"
						target="_blank"
					>
						<Image
							alt="favicon"
							className="size-12"
							height={128}
							src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${link.url}&sz=128`}
							width={128}
						/>
						<div className="flex flex-col justify-center gap-2">
							<p className="link">{link.title}</p>
							<p className="text-xs">
								{link.date.toLocaleDateString()} - {new URL(link.url).host}
							</p>
						</div>
					</a>
				</li>
			))}
		</ul>
	);
}
