import type { DeclarationReflection } from "typedoc";

export interface Meta {
	title: string;
	description: string;
}

export function generateMeta(reflection: DeclarationReflection): Meta {
	let title = reflection.name;
	const packageName = reflection.parent?.name;
	if (packageName) title += ` | ${packageName}`;

	const description = reflection.comment?.summary.map((s) => s.text).join("")
		?? `Documentation for ${reflection.name}` + (packageName ? ` in ${packageName}` : "");

	return { title, description };
}
