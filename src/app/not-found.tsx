import Link from "next/link";

export default function NotFound() {
	return (
		<div className="hero bg-base-200 min-h-screen">
			<div className="hero-content text-center">
				<div className="max-w-md">
					<h1 className="text-5xl font-bold">Not Found</h1>
					<p className="py-6">Could not find the requested page.</p>
					<Link className="link" href="/feed">
						Home Page
					</Link>
				</div>
			</div>
		</div>
	);
}
