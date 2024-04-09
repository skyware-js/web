import type { CollectionEntry, CollectionKey } from "astro:content";
import type { DeclarationReflection } from "typedoc";

export interface Meta {
	title: string;
	description: string;
	ogImage: string;
}

export function generateMeta(
	reflection: DeclarationReflection,
	guide?: CollectionEntry<CollectionKey>,
): Meta {
	let title = guide ? guide.data.title : reflection.name;
	const packageName = guide ? reflection.name : reflection.parent?.name;
	if (packageName) title += ` | ${packageName}`;

	let description: string;
	if (guide) {
		description = guide.data.description;
	} else {
		description = reflection.comment?.summary.map((s) => s.text).join("")
			?? `Documentation for ${reflection.name}` + (packageName ? ` in ${packageName}` : "");
	}

	let ogImage = `/og/`;
	if (packageName) ogImage += `${packageName.split("/").pop()}.png`;
	else ogImage += `og.png`;

	return { title, description, ogImage };
}
