import { AnchorIcon } from "@/assets/icons/AnchorIcon.tsx";
import { ExternalIcon } from "@/assets/icons/ExternalIcon.tsx";
import { HighlightKind, HighlightText } from "@/util/highlight.tsx";
import { resolveSourceUrl } from "@/util/resolveUrl.ts";
import { type DeclarationReflection, ReflectionKind } from "typedoc";
import CodeHeading from "./CodeHeading.tsx";

export const PageKinds = {
	[ReflectionKind.Class]: "class",
	[ReflectionKind.Enum]: "enum",
	[ReflectionKind.Function]: "function",
	[ReflectionKind.Interface]: "interface",
	[ReflectionKind.TypeAlias]: "type",
} as const;

export function TitleSection({ reflection }: { reflection: DeclarationReflection }) {
	const kind = PageKinds[reflection.kind as keyof typeof PageKinds];

	const sourceUrl = resolveSourceUrl(reflection);

	const heading = (
		<CodeHeading level="h1" url={sourceUrl} id="title">
			<HighlightText kind={HighlightKind.Reference}>{kind}</HighlightText>{" "}
			<HighlightText kind={HighlightKind.SkywareDeclaration}>{reflection.name}</HighlightText>
		</CodeHeading>
	);

	const summaryText = reflection.comment?.summary.map((s) => s.text).join("") || "";
	const summary = summaryText
		? <p className="text-docs-base text-gray-900">{summaryText}</p>
		: null;

	return <div className="p-2 pt-4 pb-8 space-y-3 group">{heading}{summary}</div>;
}
