import { type DeclarationReflection, ReflectionKind } from "typedoc";
import { HighlightKind, HighlightText } from "../../lib/rendering/highlight.tsx";
import { renderSummary } from "../../lib/rendering/renderSummary.tsx";
import { renderType } from "../../lib/rendering/renderType.tsx";
import { resolveSourceUrl } from "../../lib/util/resolveUrl.ts";
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

	const extended = reflection.extendedTypes?.length
		? (
			<CodeHeading level="h3" className="-mt-2">
				<HighlightText kind={HighlightKind.Text}>{"extends "}</HighlightText>
				{reflection.extendedTypes.map((type) => renderType(type))}
			</CodeHeading>
		)
		: null;

	const summary = renderSummary(reflection.comment);

	return (
		<div className="flex flex-col p-2 pt-4 pb-8 gap-y-3 group">
			{heading}
			{extended}
			{summary}
		</div>
	);
}
