import { renderMarkdown } from "@/util/renderMarkdown.tsx";
import type { ReactNode } from "react";
import type { CommentTag } from "typedoc";

export function renderSeeTags(tags?: Array<CommentTag> | undefined): ReactNode {
	if (!tags || !tags.length) return null;
	const renderSeeTag = (tag: CommentTag) => (
		<span className="text-docs-aside text-gray-700">
			<span className="font-medium">{"See also: "}</span>
			{renderMarkdown(tag.content)}
		</span>
	);
	return tags.length > 1
		? <div className="space-y-2">{tags.map(renderSeeTag)}</div>
		: renderSeeTag(tags[0]);
}

export function renderExampleTags(tags?: Array<CommentTag> | undefined): ReactNode {
	console.log(tags);
	if (!tags || !tags.length) return null;
	const renderExampleTag = (tag: CommentTag) => (
		<p className="text-docs-base text-gray-900">
			{tag.name ? <span className="font-medium leading-8">{tag.name}</span> : null}
			<br />
			{renderMarkdown(tag.content)}
		</p>
	);
	return tags.length > 1
		? <div className="space-y-4">{tags.map(renderExampleTag)}</div>
		: renderExampleTag(tags[0]);
}
