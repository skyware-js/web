import { HighlightText } from "@/util/highlight.tsx";
import { _throw } from "@/util/util.ts";
import { type Reflection, ReflectionKind } from "typedoc";
import CodeHeading from "./CodeHeading.tsx";

export const PageKinds = {
	[ReflectionKind.Class]: "class",
	[ReflectionKind.Enum]: "enum",
	[ReflectionKind.Function]: "function",
	[ReflectionKind.Interface]: "interface",
	[ReflectionKind.TypeAlias]: "type",
} as const;

export function TitleSection({ reflection }: { reflection: Reflection }) {
	const reflectionKind = reflection.kind in PageKinds
		? reflection.kind as keyof typeof PageKinds
		: _throw(
			`Tried to render title for invalid reflection kind ${ReflectionKind[reflection.kind]}`,
		);
	const kind = PageKinds[reflectionKind];

	const heading = (
		<CodeHeading level="h1" id="_top">
			<HighlightText kind={ReflectionKind.Reference}>{kind}</HighlightText>{" "}
			<HighlightText kind={reflectionKind}>{reflection.name}</HighlightText>
		</CodeHeading>
	);

	const summaryText = reflection.comment?.summary.map((s) => s.text).join("") || "";
	const summary = summaryText
		? <p className="text-docs-base text-gray-900">{summaryText}</p>
		: null;

	return <div className="p-2 pb-8 space-y-2">{heading}{summary}</div>;
}
