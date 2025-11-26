"use client";

import Image from "next/image";
import { useState } from "react";
import type { Link } from "../link";

type Props = Readonly<{
	categories: Array<string>;
	links: Array<Link>;
}>;

export function LinkList(props: Props) {
	const [filterCategory, setFilterCategory] = useState<string | undefined>();

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
				{(filterCategory !== undefined
					? props.links.filter((link) => link.category === filterCategory)
					: props.links
				).map((link) => (
					<li className="list-row" key={`${link.category} ${link.url}`}>
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
		</div>
	);
}
