import { ExternalIcon } from "../../assets/icons/ExternalIcon.tsx";
import { HighlightKind, HighlightText } from "../../lib/rendering/highlight.tsx";
import { UrlCategoriesReverse } from "../../lib/util/resolveUrl.ts";

export const Reference = (
	{ to, type, children }: { to: string; type?: string; children?: string },
) => {
	const isExternal = to.startsWith("http");
	if (isExternal) {
		return (
			<HighlightText kind={HighlightKind.Reference} as="a" href={to} className="no-underline">
				{children}
				<ExternalIcon className="fill-current w-[0.75em] h-[0.75em]" />
			</HighlightText>
		);
	}

	if (to.startsWith("/")) to = to.slice(1);
	const [_docs, _package, category, name] = to.split("/");

	if (!category || !name) return null;

	const kind = (type && type in HighlightKind)
		? HighlightKind[type as keyof typeof HighlightKind]
		: UrlCategoriesReverse[category];

	return (
		<HighlightText kind={kind} as="a" href={`/${to}`} className="no-underline">
			{children || name}
		</HighlightText>
	);
};
