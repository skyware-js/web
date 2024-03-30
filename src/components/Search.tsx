import { useEffect, useState } from "react";

export function Search() {
	const [modifier, setModifier] = useState("⌃");

	useEffect(() => {
		setModifier(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? "⌘" : "⌃");
	}, []);

	return (
		<div className="relative w-full rounded-lg">
			<button
				type="button"
				className="block w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-none hover:border-gray-500 focus:border-gray-500 text-left text-docs-base leading-6 text-gray-700"
			>
				Search
			</button>
			<div className="pointer-events-none absolute inset-y-0 right-0 pr-4 flex items-center">
				<span className="text-gray-700 text-docs-aside leading-6">{modifier} K</span>
			</div>
		</div>
	);
}
