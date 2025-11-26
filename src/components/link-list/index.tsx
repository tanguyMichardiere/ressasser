"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import type { Link } from "../../link";
import { LinkListItem } from "./item";

type Props = Readonly<{
	categories: Array<string>;
	links: Array<Link>;
}>;

export function LinkList(props: Props) {
	const [filterCategory, setFilterCategory] = useState<string | undefined>();

	function handleFormChange(event: FormEvent<HTMLFormElement>) {
		if (event.target instanceof HTMLInputElement) {
			setFilterCategory(event.target.value);
		}
	}

	function handleFormReset() {
		setFilterCategory(undefined);
	}

	const filteredLinks =
		filterCategory !== undefined
			? props.links.filter((link) => link.category === filterCategory)
			: props.links;

	return (
		<div>
			<form className="filter p-4" onChange={handleFormChange} onReset={handleFormReset}>
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
					<LinkListItem key={`${link.category} ${link.url}`} link={link} />
				))}
			</ul>
		</div>
	);
}
