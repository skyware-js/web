import { renderCode } from "@/util/highlight.tsx";
import { LinkIfPossible } from "@/util/renderType.tsx";
import { Fragment, type ReactNode } from "react";
import { type CommentDisplayPart, Reflection } from "typedoc";

const plainLinkRegex =
	/(?:^|\s|\(|\[)((?:https?:\/\/[\S]+)|(?:(?:[a-z][a-z0-9]*(?:\.[a-z0-9]+)+)(?!\.)[\S]*))/g;
const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
const blockCodeRegex = /`{3}([^]+?)\n*`{3}/g;
const inlineCodeRegex = /`([^]+?)\n*`/g;

export function parseMarkdown(
	text: string,
): Array<{ text: string; url?: string; code?: boolean; inline?: boolean; twoslash?: boolean }> {
	const parts = [];
	let lastIndex = 0;

	const regex = new RegExp(
		`${plainLinkRegex.source}|${linkRegex.source}|${blockCodeRegex.source}|${inlineCodeRegex.source}`,
		"gm",
	);
	let match;
	while ((match = regex.exec(text)) !== null) {
		const [fullMatch, plainLink, linkText, url, _blockCode, inlineCode] = match;
		if (lastIndex < match.index) {
			parts.push({ text: text.slice(lastIndex, match.index) });
		}
		if (plainLink) {
			console.log(plainLink);
			parts.push({ text: plainLink, url: plainLink });
		} else if (url) {
			parts.push({ text: linkText, url });
		} else if (inlineCode) {
			parts.push({ text: inlineCode.trim(), code: true, inline: true });
		} else if (_blockCode) {
			const [lang, ...blockCodeParts] = _blockCode.split("\n");
			const blockCode = blockCodeParts.join("\n");
			parts.push({
				text: blockCode.trim(),
				code: true,
				inline: false,
				twoslash: lang.includes("twoslash"),
			});
		}
		lastIndex = match.index + fullMatch.length;
	}
	if (lastIndex < text.length) {
		parts.push({ text: text.slice(lastIndex) });
	}
	return parts;
}

export function renderMarkdown(
	parts?: Array<CommentDisplayPart> | null | undefined,
	inline = false,
): ReactNode {
	if (!parts) return null;

	const renderText = (text: string) =>
		parseMarkdown(text).map(({ text, url, code, inline: inlineCode, twoslash = false }, i) => {
			const codeBlockIsInline = (code && (inline || inlineCode)) || false;
			return (url
				? (
					<a
						key={url}
						href={url}
						className="text-accent underline hover:no-underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						{text}
					</a>
				)
				: code
				? (
					<Fragment key={text}>
						{renderCode(text, { inline: codeBlockIsInline, twoslash })}
					</Fragment>
				)
				: text);
		});

	return (
		<>
			{parts.map((part, i) => {
				if (part.kind === "text" || part.kind === "code") {
					const { text } = part;
					return <Fragment key={text}>{renderText(text)}</Fragment>;
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
							return (
								<LinkIfPossible key={i} reflection={target}>
									{tsLinkText || text}
								</LinkIfPossible>
							);
						} else return renderText(text);
					} else {
						return renderText(text);
					}
				}
				return null;
			})}
		</>
	);
}
