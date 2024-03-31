import { codeToHtml } from "@/util/highlight.tsx";
import { LinkIfPossible } from "@/util/renderType.tsx";
import type { ReactNode } from "react";
import { type CommentDisplayPart, Reflection } from "typedoc";

export function parseMarkdown(text: string): Array<{ text: string; url?: string; code?: boolean }> {
	const parts = [];
	let lastIndex = 0;
	const regex = /\[([^\]]+)\]\(([^)]+)\)|```\w*\n*([^]+?)\n*```/g;
	let match;
	while ((match = regex.exec(text)) !== null) {
		const [fullMatch, linkText, url, codeText] = match;
		if (lastIndex < match.index) {
			parts.push({ text: text.slice(lastIndex, match.index) });
		}
		if (url) {
			parts.push({ text: linkText, url });
		} else if (codeText) {
			parts.push({ text: codeText.trim(), code: true });
		}
		lastIndex = match.index + fullMatch.length;
	}
	if (lastIndex < text.length) {
		parts.push({ text: text.slice(lastIndex) });
	}
	return parts;
}

export function renderMarkdown(parts: Array<CommentDisplayPart>): ReactNode {
	const renderText = (text: string) =>
		parseMarkdown(text).map((
			{ text, url, code },
			i,
		) => (url
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
			: code
			? <code dangerouslySetInnerHTML={{ __html: codeToHtml(text) }} key={i} />
			: text)
		);

	return parts.map((part, i) => {
		if (part.kind === "text" || part.kind === "code") {
			const { text } = part;
			return renderText(text);
		} else if (part.kind === "inline-tag") {
			const { tag, tsLinkText, target, text } = part;
			if (tag === "@link" && target) {
				if (typeof target === "string") {
					return (
						<a
							key={i}
							href={target}
							className="text-accent underline hover:no-underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							{tsLinkText || text}
						</a>
					);
				} else if (target instanceof Reflection) {
					return <LinkIfPossible reflection={target} />;
				} else return renderText(text);
			} else {
				return renderText(text);
			}
		}
		return null;
	});
}
