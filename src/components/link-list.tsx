"use client";

import Image from "next/image";
import { useState } from "react";
import type { Link } from "../link";

function formatDate(date: Date) {
	const isoDate = date.toISOString();
	if (isoDate.length === 24) {
		return isoDate.slice(0, 10);
	}
	return isoDate.slice(3, 13);
}

type Props = Readonly<{
	categories: Array<string>;
	links: Array<Link>;
}>;

export function LinkList(props: Props) {
	const [filterCategory, setFilterCategory] = useState<string | undefined>();

	const filteredLinks =
		filterCategory !== undefined
			? props.links.filter((link) => link.category === filterCategory)
			: props.links;

	return (
		<div>
			<form
				className="filter p-4"
				onChange={(event) => {
					if (event.target instanceof HTMLInputElement) {
						setFilterCategory(event.target.value);
					}
				}}
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
						type="radio"
						value={category}
					/>
				))}
			</form>
			<ul className="list">
				{filteredLinks.map((link) => (
					<li className="list-row" key={`${link.category} ${link.url}`}>
						<a
							// TODO: visited:text-base-content/50 does not work
							className="list-col-grow cursor-pointer visited:text-base-content/50 flex items-center gap-4"
							href={link.url}
							rel="noopener noreferrer"
							target="_blank"
						>
							<Image
								alt=""
								className="size-12"
								height={128}
								src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${new URL(link.url).host}&sz=128`}
								width={128}
							/>
							<div className="flex flex-col justify-center gap-2">
								<p className="link">{link.title}</p>
								<p className="text-xs">
									{formatDate(link.date)} &mdash; {new URL(link.url).host}
								</p>
							</div>
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
