import { AnchorIcon } from "@/assets/icons/AnchorIcon.tsx";
import { ExternalIcon } from "@/assets/icons/ExternalIcon.tsx";
import { HighlightKind, HighlightText } from "@/util/highlight.tsx";
import { resolveSourceUrl } from "@/util/resolveSourceUrl.ts";
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
		<CodeHeading level="h1" id="title" className="inline-flex gap-2 items-center">
			<HighlightText kind={HighlightKind.Reference}>{kind}</HighlightText>{" "}
			<HighlightText kind={HighlightKind.SkywareDeclaration}>{reflection.name}</HighlightText>
			<a
				className="text-gray-700 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
				href="#title"
				aria-label="Anchor link to the page title"
			>
				<AnchorIcon className="h-4 w-4 fill-current" />
			</a>
			{sourceUrl && (
				<a
					href={sourceUrl}
					className="text-gray-700 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="View source on GitHub"
				>
					<ExternalIcon className="h-4 w-4 fill-current" />
				</a>
			)}
		</CodeHeading>
	);

	const summaryText = reflection.comment?.summary.map((s) => s.text).join("") || "";
	const summary = summaryText
		? <p className="text-docs-base text-gray-900">{summaryText}</p>
		: null;

	return <div className="p-2 pt-4 pb-8 space-y-3 group">{heading}{summary}</div>;
}
