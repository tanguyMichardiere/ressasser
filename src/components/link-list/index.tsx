"use client";

import { useState } from "react";
import type { Link } from "../../rss";
import { LinkListItem } from "./item";

type Props = Readonly<{
	categories: Array<string>;
	className?: string;
	links: Array<Link>;
}>;

export function LinkList(props: Props) {
	const [filterCategory, setFilterCategory] = useState<string | undefined>();

	const filteredLinks =
		filterCategory !== undefined
			? props.links.filter((link) => link.category === filterCategory)
			: props.links;

	return (
		<div className={props.className}>
			{props.categories.length > 1 && (
				<form
					className="filter p-4"
					onReset={() => {
						setFilterCategory(undefined);
					}}
				>
					<input className="btn btn-square" type="reset" value="×" />
					{props.categories.map((category) => (
						<input
							aria-label={category}
							className="btn"
							key={category}
							name="categories"
							onClick={() => {
								setFilterCategory(category);
							}}
							type="radio"
						/>
					))}
				</form>
			)}
			<ul className="list">
				{filteredLinks.map((link) => (
					<LinkListItem key={`${link.category} ${link.url}`} link={link} />
				))}
			</ul>
		</div>
	);
}
