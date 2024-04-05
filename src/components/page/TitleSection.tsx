import { HighlightKind, HighlightText } from "@/lib/rendering/highlight.tsx";
import { renderSummary } from "@/lib/rendering/renderSummary.tsx";
import { resolveSourceUrl } from "@/lib/util/resolveUrl.ts";
import { type DeclarationReflection, ReflectionKind } from "typedoc";
import CodeHeading from "./CodeHeading.tsx";

export const PageKinds: Partial<Record<ReflectionKind, string>> = {
	[ReflectionKind.Class]: "class",
	[ReflectionKind.Enum]: "enum",
	[ReflectionKind.Function]: "function",
	[ReflectionKind.Interface]: "interface",
	[ReflectionKind.TypeAlias]: "type",
	[ReflectionKind.Variable]: "const",
} as const;

export function TitleSection({ reflection }: { reflection: DeclarationReflection }) {
	const kind = PageKinds[reflection.kind];

	const sourceUrl = resolveSourceUrl(reflection);

	const heading = (
		<CodeHeading level="h1" url={sourceUrl} id={reflection.name}>
			{kind
				? <HighlightText kind={HighlightKind.Reference}>{kind + " "}</HighlightText>
				: null}
			<HighlightText kind={HighlightKind.SkywareDeclaration}>{reflection.name}</HighlightText>
		</CodeHeading>
	);

	const summary = renderSummary(reflection.comment);

	return <div className="p-2 pt-4 pb-8 space-y-3 group">{heading}{summary}</div>;
}
