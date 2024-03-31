import CodeHeading from "@/components/page/CodeHeading.tsx";
import { HighlightKind, HighlightText } from "@/util/highlight.tsx";
import { renderType } from "@/util/renderType.tsx";
import { resolveSourceUrl } from "@/util/resolveUrl.ts";
import { Fragment, type ReactNode } from "react";
import { type DeclarationReflection, ReflectionKind } from "typedoc";

export function FunctionSignature({ reflection }: { reflection: DeclarationReflection }) {
	const signatures = reflection.signatures || [];
	if (!signatures.length) {
		throw new Error(`Function ${reflection.name} has no signatures`);
	}

	return signatures.map((overload, i) => {
		const params = overload.parameters || [];

		const paramNodes: Array<ReactNode> = [];
		for (let i = 0; i < params.length; i++) {
			const param = params[i];
			paramNodes.push(
				<Fragment key={param.name}>
					{param.flags.isRest
						? <HighlightText kind={HighlightKind.Punctuation}>...</HighlightText>
						: null}
					<HighlightText kind={HighlightKind.Parameter}>{param.name}</HighlightText>
					{param.flags.isOptional
						? <HighlightText kind={HighlightKind.Punctuation}>?</HighlightText>
						: null}
					{i < params.length - 1
						? <HighlightText kind={HighlightKind.Punctuation}>{", "}</HighlightText>
						: null}
				</Fragment>,
			);
		}

		const keyword = reflection.kind === ReflectionKind.Function
			? <HighlightText kind={HighlightKind.Reference}>{"function "}</HighlightText>
			: null;

		const signature = (
			<CodeHeading level="h2" id={reflection.name} url={resolveSourceUrl(overload)}>
				{keyword}
				<HighlightText kind={reflection.kind}>{reflection.name}</HighlightText>
				<HighlightText kind={HighlightKind.Punctuation}>(</HighlightText>
				{paramNodes}
				<HighlightText kind={HighlightKind.Punctuation}>)</HighlightText>
			</CodeHeading>
		);

		const summaryText = overload.comment?.summary.map((s) => s.text).join("") || "";
		const summary = summaryText
			? <p className="text-docs-base text-gray-900">{summaryText}</p>
			: null;

		const parametersList = params.length
			? (
				<div className="space-y-3">
					<h4 className="font-medium text-docs-h3 text-gray-900">Parameters</h4>
					{params.map((param) => {
						const paramName = (
							<>
								{param.flags.isRest
									? (
										<HighlightText kind={HighlightKind.Punctuation}>
											...
										</HighlightText>
									)
									: null}
								<HighlightText kind={HighlightKind.Parameter}>
									{param.name}
								</HighlightText>
							</>
						);

						const paramType = param.type
							? (
								<>
									{param.flags.isOptional
										? (
											<HighlightText kind={HighlightKind.Punctuation}>
												?
											</HighlightText>
										)
										: null}
									<HighlightText kind={HighlightKind.Punctuation}>
										{": "}
									</HighlightText>
									{renderType(param.type)}
								</>
							)
							: null;

						const paramDefault = param.defaultValue
							? (
								<>
									<HighlightText kind={HighlightKind.Punctuation}>
										{" = "}
									</HighlightText>
									<HighlightText kind={HighlightKind.All}>
										{param.defaultValue}
									</HighlightText>
								</>
							)
							: null;

						const paramSummary = param.comment?.summary.map((s) => s.text).join("")
							|| "";

						return (
							<div key={param.name} className="space-y-2 ml-4">
								<span className="font-mono text-code-h3">
									{paramName}
									{paramType}
									{paramDefault}
								</span>
								{paramSummary
									? <p className="text-docs-base text-gray-900">{paramSummary}</p>
									: null}
							</div>
						);
					})}
				</div>
			)
			: null;

		return (
			<div key={overload.id} className="text-docs-base text-gray-900 space-y-4 group">
				{signature}
				{summary}
				{parametersList}
			</div>
		);
	});
}
