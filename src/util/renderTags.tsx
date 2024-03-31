import { HighlightKind, HighlightText } from "@/util/highlight.tsx";
import { parseMarkdownLinks } from "@/util/parseTags.ts";
import type { ReactNode } from "react";
import type { CommentTag } from "typedoc";

export function renderSeeTags(tags?: Array<CommentTag> | undefined): ReactNode {
	if (!tags || !tags.length) return null;
	const renderSeeTag = (tag: CommentTag) => (
		<span className="text-docs-aside text-gray-700">
			<span className="font-medium">{"See also: "}</span>
			{tag.content.map((part) => {
				const parsed = parseMarkdownLinks(part.text);
				return parsed.map(({ text, url }, i) => (url
					? (
						<a
							key={i}
							href={url}
							className="text-accent underline hover:no-underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							{text}
						</a>
					)
					: text)
				);
			})}
		</span>
	);
	return tags.length > 1
		? <div className="space-y-2">{tags.map(renderSeeTag)}</div>
		: renderSeeTag(tags[0]);
}
