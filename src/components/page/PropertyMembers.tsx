import CodeHeading from "@/components/page/CodeHeading.tsx";
import { HighlightKind, HighlightText } from "@/util/highlight.tsx";
import { renderSeeTags } from "@/util/renderTags.tsx";
import { renderType } from "@/util/renderType.tsx";
import { resolveSourceUrl } from "@/util/resolveUrl.ts";
import { type DeclarationReflection } from "typedoc";

export function PropertyMembers({ properties }: { properties: Array<DeclarationReflection> }) {
	return (
		<div className="space-y-6">
			{properties.map((property) => {
				if (property.flags.isExternal) return null;

				const modifiers = (
					<>
						{property.flags.isStatic
							? (
								<HighlightText kind={HighlightKind.Keyword}>
									{"static "}
								</HighlightText>
							)
							: null}
						{property.flags.isReadonly
							? (
								<HighlightText kind={HighlightKind.Keyword}>
									{"readonly "}
								</HighlightText>
							)
							: null}
					</>
				);
				const name = (
					<HighlightText kind={HighlightKind.Text}>{property.name}</HighlightText>
				);
				const type = renderType(property.type) || (
					<HighlightText kind={HighlightKind.Intrinsic}>{"any"}</HighlightText>
				);

				const summaryText = property.comment?.summary.map((s) => s.text).join("") || "";
				const summary = summaryText
					? <p className="text-docs-base text-gray-900">{summaryText}</p>
					: null;

				const seeTags = renderSeeTags(property.comment?.getTags("@see"));

				return (
					<div key={property.name} className="flex flex-col gap-y-4 group">
						<CodeHeading level="h2" id={property.name} url={resolveSourceUrl(property)}>
							{modifiers}
							{name}
							{property.flags.isOptional
								? <HighlightText kind={HighlightKind.Punctuation}>?</HighlightText>
								: null}
							<HighlightText kind={HighlightKind.Punctuation}>{": "}</HighlightText>
							{type}
						</CodeHeading>
						{summary}
						{seeTags}
					</div>
				);
			})}
		</div>
	);
}
