import type { ReactNode } from "react";
import type { Comment, CommentTag } from "typedoc";
import { renderMarkdown } from "./renderMarkdown.tsx";

export function renderDefaultTag(tag?: CommentTag | undefined): ReactNode {
	if (!tag) return null;
	return (
		<span className="text-docs-base text-gray-900">
			<span className="font-medium">{"Default: "}</span>
			{renderMarkdown(tag.content, true)}
		</span>
	);
}

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

export function renderTags(comment?: Comment | null | undefined): ReactNode {
	if (!comment) return null;

	const defaultTag = comment.getTag("@default");
	const seeTags = comment.getTags("@see");
	const exampleTags = comment.getTags("@example");

	return (
		<>{renderDefaultTag(defaultTag)}{renderSeeTags(seeTags)}{renderExampleTags(exampleTags)}</>
	);
}
