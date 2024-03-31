import { ChevronLeftIcon } from "@/assets/icons/ChevronLeftIcon.tsx";
import { ChevronRightIcon } from "@/assets/icons/ChevronRightIcon.tsx";
import CodeHeading from "@/components/page/CodeHeading.tsx";
import { HighlightKind, HighlightText } from "@/util/highlight.tsx";
import { renderSummary } from "@/util/renderSummary.tsx";
import { renderTags } from "@/util/renderTags.tsx";
import { renderType } from "@/util/renderType.tsx";
import { resolveSourceUrl } from "@/util/resolveUrl.ts";
import { Fragment, type ReactNode, useState } from "react";
import {
	type DeclarationReflection,
	ParameterReflection,
	ReflectionKind,
	SignatureReflection,
} from "typedoc";

export function renderParameters(parameters: Array<ParameterReflection>) {
	return (
		<div className="space-y-3">
			<h4 className="font-medium text-docs-h3 text-gray-900">Parameters</h4>
			{parameters.map((param) => {
				const paramName = (
					<>
						{param.flags.isRest
							? <HighlightText kind={HighlightKind.Punctuation}>...</HighlightText>
							: null}
						<HighlightText kind={HighlightKind.Parameter}>{param.name}</HighlightText>
					</>
				);

				const paramType = param.type
					? (
						<>
							{param.flags.isOptional
								? <HighlightText kind={HighlightKind.Punctuation}>?</HighlightText>
								: null}
							<HighlightText kind={HighlightKind.Punctuation}>{": "}</HighlightText>
							{renderType(param.type)}
						</>
					)
					: null;

				const paramDefault = param.defaultValue
					? (
						<>
							<HighlightText kind={HighlightKind.Punctuation}>{" = "}</HighlightText>
							<HighlightText kind={HighlightKind.All}>
								{param.defaultValue}
							</HighlightText>
						</>
					)
					: null;

				const paramSummary = renderSummary(param.comment);

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
	);
}

function FunctionSignature({ signature }: { signature: SignatureReflection }): ReactNode {
	const reflection = signature.parent;

	const params = signature.parameters || [];

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

	const typeSignature = (
		<CodeHeading level="h2" id={reflection.name} url={resolveSourceUrl(signature)}>
			{keyword}
			<HighlightText kind={reflection.kind}>{reflection.name}</HighlightText>
			<HighlightText kind={HighlightKind.Punctuation}>(</HighlightText>
			{paramNodes}
			<HighlightText kind={HighlightKind.Punctuation}>)</HighlightText>
		</CodeHeading>
	);

	const summary = renderSummary(signature.comment);
	const tags = renderTags(signature.comment);

	const parametersList = params.length ? renderParameters(params) : null;

	return (
		<div className="text-docs-base text-gray-900 space-y-4 group">
			{typeSignature}
			{summary}
			{tags}
			{parametersList}
		</div>
	);
}

function FunctionOverloads({ overloads }: { overloads: Array<SignatureReflection> }) {
	const signatures = overloads.filter((overload) => !overload.flags.isExternal).sort((a, b) =>
		a.id > b.id ? 1 : -1
	);

	const id = signatures[0].parent.name + signatures[0].parent.id.toString();

	return (
		<div id={id} className="overloads">
			<span className="inline-flex items-center mb-2 gap-0.5 text-gray-700 text-docs-aside font-medium leading-6">
				<button id={id + "-button-left"} className="fill-gray-700 hover:fill-gray-900">
					<ChevronLeftIcon className="h-4" />
				</button>
				<span id={id + "-label"}>Overload 1/{signatures.length}</span>
				<button
					id={id + "-button-right"}
					className="cursor-pointer fill-gray-700 hover:fill-gray-900"
				>
					<ChevronRightIcon className="h-4" />
				</button>
			</span>
			{signatures.map((signature) => (
				<FunctionSignature key={signature.id} signature={signature} />
			))}
		</div>
	);
}
export function FunctionDocumentation({ reflection }: { reflection: DeclarationReflection }) {
	const signatures = reflection.signatures || [];
	if (!signatures.length) {
		throw new Error(`Function ${reflection.name} has no signatures`);
	}

	return signatures.length > 1
		? <FunctionOverloads overloads={signatures} />
		: <FunctionSignature signature={signatures[0]} />;
}
