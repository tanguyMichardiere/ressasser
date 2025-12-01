import { LinkList } from "../../components/link-list";
import { Config } from "../../config";
import { getLinks } from "../../rss";

export default async function FeedPage(props: PageProps<"/feed">) {
	const searchParams = await props.searchParams;
	const rawConfig = searchParams.config;

	// TODO: on missing or invalid config, open a form to edit it
	if (typeof rawConfig !== "string") {
		return <div>Invalid config</div>;
	}

	const config = Config.parse(JSON.parse(atob(rawConfig)));

	const [links, errors] = await getLinks(config);
	if (errors.length > 0) {
		// TODO: display errors
		console.log(errors);
	}

	return (
		<LinkList
			categories={config.categories.map((category) => category.name)}
			className="max-w-md mx-auto"
			links={links}
		/>
	);
}
