import { z } from "zod";

export const Feed = z.object({
	url: z.url(),
	links: z.optional(z.int().positive().max(10)),
});
export type Feed = z.infer<typeof Feed>;

export const Category = z.object({
	name: z.string(),
	feeds: z
		.array(Feed)
		.refine((feeds) => new Set(feeds.map((feed) => feed.url)).size === feeds.length, {
			error: "Duplicate feed URLs in category",
		}),
	linksPerFeed: z.optional(z.int().positive().max(10)),
});
export type Category = z.infer<typeof Category>;

export const Config = z.object({
	categories: z
		.array(Category)
		.refine(
			(categories) =>
				new Set(categories.map((category) => category.name)).size === categories.length,
			{
				error: "Duplicate category names",
			},
		),
	linksPerFeed: z.int().positive().max(10).default(3),
});
export type Config = z.infer<typeof Config>;
