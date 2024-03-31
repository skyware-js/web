import CodeHeading from "@/components/page/CodeHeading.tsx";
import { renderParameters } from "@/components/page/FunctionDocumentation.tsx";
import { HighlightKind, HighlightText } from "@/util/highlight.tsx";
import { renderSummary } from "@/util/renderSummary.tsx";
import { renderTags } from "@/util/renderTags.tsx";
import { renderType } from "@/util/renderType.tsx";
import { resolveSourceUrl } from "@/util/resolveUrl.ts";
import type { ReactNode } from "react";
import { type DeclarationReflection, ReflectionKind, type ReflectionType } from "typedoc";

export function renderProperties(properties: Array<DeclarationReflection>) {
	return (
		<div className="space-y-3">
			<h4 className="font-medium text-docs-h3 text-gray-900">Properties</h4>
			{properties.map((property) => {
				const propName = (
					<HighlightText kind={HighlightKind.Parameter}>{property.name}</HighlightText>
				);

				const propType = property.type
					? (
						<>
							{property.flags.isOptional
								? <HighlightText kind={HighlightKind.Punctuation}>?</HighlightText>
								: null}
							<HighlightText kind={HighlightKind.Punctuation}>{": "}</HighlightText>
							{renderType(property.type)}
						</>
					)
					: null;

				const propDefault = property.defaultValue
					? (
						<>
							<HighlightText kind={HighlightKind.Punctuation}>{" = "}</HighlightText>
							<HighlightText kind={HighlightKind.All}>
								{property.defaultValue}
							</HighlightText>
						</>
					)
					: null;

				const propSummary = property.comment?.summary.map((s) => s.text).join("") || "";

				return (
					<div key={property.name} className="space-y-2 ml-4">
						<span className="font-mono text-code-h3">
							{propName}
							{propType}
							{propDefault}
						</span>
						{propSummary
							? <p className="text-docs-base text-gray-900">{propSummary}</p>
							: null}
					</div>
				);
			})}
		</div>
	);
}

export function PropertyMembers({ properties }: { properties: Array<DeclarationReflection> }) {
	return (
		<div className="space-y-10">
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

				let signature: ReactNode, parameters: ReactNode = null;

				const accessorSignature = property.getSignature || property.setSignature;
				if (accessorSignature) {
					const isGetter = accessorSignature.kindOf(ReflectionKind.GetSignature);

					const keyword = isGetter
						? <HighlightText kind={HighlightKind.Keyword}>{"get "}</HighlightText>
						: <HighlightText kind={HighlightKind.Keyword}>{"set "}</HighlightText>;

					const returnType = renderType(accessorSignature.type) || (
						<HighlightText kind={HighlightKind.Intrinsic}>{"any"}</HighlightText>
					);

					if (accessorSignature.parameters?.length) {
						parameters = renderParameters(accessorSignature.parameters);
					}

					signature = (
						<CodeHeading level="h2" id={property.name} url={resolveSourceUrl(property)}>
							{keyword}
							{name}
							<HighlightText kind={HighlightKind.Punctuation}>(</HighlightText>
							{isGetter
								? null
								: (
									<HighlightText kind={HighlightKind.Parameter}>
										{accessorSignature.parameters![0].name}
									</HighlightText>
								)}
							<HighlightText kind={HighlightKind.Punctuation}>)</HighlightText>

							{isGetter
								? (
									<>
										<HighlightText kind={HighlightKind.Punctuation}>
											{": "}
										</HighlightText>
										{returnType}
									</>
								)
								: null}
						</CodeHeading>
					);
				} else {
					const type = renderType(property.type) || (
						<HighlightText kind={HighlightKind.Intrinsic}>{"any"}</HighlightText>
					);

					signature = (
						<CodeHeading level="h2" id={property.name} url={resolveSourceUrl(property)}>
							{modifiers}
							{name}
							{property.flags.isOptional
								? <HighlightText kind={HighlightKind.Punctuation}>?</HighlightText>
								: null}
							<HighlightText kind={HighlightKind.Punctuation}>{": "}</HighlightText>
							{type}
						</CodeHeading>
					);
				}

				const comment = (accessorSignature || property).comment;

				const summary = renderSummary(comment);
				const tags = renderTags(comment);

				const childProperties = ((accessorSignature || property).type as ReflectionType)
					?.declaration?.children;
				const properties = childProperties?.length
					? renderProperties(childProperties)
					: null;

				return (
					<div key={property.name} className="flex flex-col gap-y-4 group">
						{signature}
						{summary}
						{tags}
						{parameters}
						{properties}
					</div>
				);
			})}
		</div>
	);
}
