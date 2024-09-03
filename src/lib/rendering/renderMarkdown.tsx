import { type RendererRichOptions, transformerTwoslash } from "@shikijs/twoslash";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { ReactNode } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { getHighlighter } from "shiki/bundle/web";
import { type CommentDisplayPart, Reflection } from "typedoc";
import { join } from "../util/util.ts";
import { LinkIfPossible } from "./renderType.tsx";

const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
const blockCodeRegex = /`{3}([^]+?)\n*`{3}/g;
const inlineCodeRegex = /`([^]+?)\n*`/g;
const plainLinkRegex =
	/(?:^|\s|\(|\[)((?:https?:\/\/[\S]+)|(?:(?:[a-z][a-z0-9]*(?:\.[a-z0-9]+)+)(?!\.)[\S]*))/g;

export function parseMarkdown(
	text: string,
): Array<{ text: string; url?: string; code?: boolean; inline?: boolean; twoslash?: boolean }> {
	const parts = [];
	let lastIndex = 0;

	const regex = new RegExp(
		`${linkRegex.source}|${blockCodeRegex.source}|${inlineCodeRegex.source}|${plainLinkRegex.source}`,
		"gm",
	);
	let match;
	while ((match = regex.exec(text)) !== null) {
		const [fullMatch, linkText, url, _blockCode, inlineCode, plainLink] = match;
		if (lastIndex < match.index) {
			parts.push({ text: text.slice(lastIndex, match.index) });
		}
		if (plainLink) {
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

export const highlighter = await getHighlighter({ themes: ["catppuccin-mocha"], langs: ["ts"] });

export const renderMarkdownInTwoslashHover: RendererRichOptions["renderMarkdown"] = (text) => {
	const parsed = parseMarkdown(text);
	return parsed.map((part) => {
		if (part.url) {
			return {
				type: "element",
				tagName: "a",
				properties: {
					href: part.url.startsWith("http")
						? part.url
						: join(import.meta.env.BASE_URL, part.url),
					class: "text-accent",
				},
				children: [{ type: "text", value: part.text }],
			};
		}
		if (part.code) {
			return {
				type: "element",
				tagName: "code",
				properties: {},
				children: [{ type: "text", value: part.text }],
			};
		}
		return { type: "text", value: part.text };
	});
};
export const renderCode = (
	code: string,
	{ twoslash = true, inline = false }: { twoslash?: boolean; inline?: boolean } = {},
) => {
	const hast = highlighter.codeToHast(code, {
		theme: "catppuccin-mocha",
		lang: "ts",
		meta: { inline: inline ? "true" : "false" },
		transformers: twoslash
			? [transformerTwoslash({
				rendererRich: {
					renderMarkdown: renderMarkdownInTwoslashHover,
					renderMarkdownInline: renderMarkdownInTwoslashHover,
				},
			})]
			: [],
	});
	if (inline && "tagName" in hast.children[0]) hast.children[0].tagName = "code";
	// @ts-expect-error — doesn't like the types of jsx and jsxs
	return toJsxRuntime(hast, { Fragment, jsx, jsxs });
};

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
						href={url.startsWith("http") ? url : join(import.meta.env.BASE_URL, url)}
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
