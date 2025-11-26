import Image from "next/image";
import type { Link } from "../../link";

function formatDate(date: Date) {
	const isoDate = date.toISOString();
	if (isoDate.length === 24) {
		return isoDate.slice(0, 10);
	}
	return isoDate.slice(3, 13);
}

type Props = Readonly<{
	link: Link;
}>;

export function LinkListItem(props: Props) {
	const host = new URL(props.link.url).host;

	return (
		<li className="list-row">
			<a
				// TODO: visited:text-base-content/50 does not work
				className="list-col-grow cursor-pointer visited:text-base-content/50 flex items-center gap-4"
				href={props.link.url}
				rel="noopener noreferrer"
				target="_blank"
			>
				<Image
					alt=""
					className="size-12"
					height={128}
					src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${host}&sz=128`}
					width={128}
				/>
				<div className="flex flex-col justify-center gap-2">
					<p className="link">{props.link.title}</p>
					<p className="text-xs">
						{formatDate(props.link.date)} &mdash; {host}
					</p>
				</div>
			</a>
		</li>
	);
}
