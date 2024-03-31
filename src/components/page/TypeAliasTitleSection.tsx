import { PageKinds } from "@/components/page/TitleSection.tsx";
import { HighlightKind, HighlightText } from "@/util/highlight.tsx";
import { renderSummary } from "@/util/renderSummary.tsx";
import { renderType } from "@/util/renderType.tsx";
import { resolveSourceUrl } from "@/util/resolveUrl.ts";
import { type DeclarationReflection } from "typedoc";
import CodeHeading from "./CodeHeading.tsx";

export function TypeAliasTitleSection({ reflection }: { reflection: DeclarationReflection }) {
	const kind = PageKinds[reflection.kind as keyof typeof PageKinds];

	const sourceUrl = resolveSourceUrl(reflection);

	const heading = (
		<CodeHeading level="h1" url={sourceUrl} id="title">
			<HighlightText kind={HighlightKind.Reference}>{kind}</HighlightText>{" "}
			<HighlightText kind={HighlightKind.SkywareDeclaration}>{reflection.name}</HighlightText>
			<HighlightText kind={HighlightKind.Punctuation}>{" = "}</HighlightText>
			{renderType(reflection.type)}
		</CodeHeading>
	);

	const summary = renderSummary(reflection.comment);

	return <div className="p-2 pt-4 pb-8 space-y-3 group">{heading}{summary}</div>;
}
