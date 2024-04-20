import { Fragment, type ReactNode } from "react";
import {
	type DeclarationReflection,
	ParameterReflection,
	ReflectionKind,
	SignatureReflection,
} from "typedoc";
import { ChevronLeftIcon } from "../../assets/icons/ChevronLeftIcon.tsx";
import { ChevronRightIcon } from "../../assets/icons/ChevronRightIcon.tsx";
import CodeHeading from "../../components/page/CodeHeading.tsx";
import { HighlightKind, HighlightText } from "../../lib/rendering/highlight.tsx";
import { reflectionShouldBeRendered } from "../../lib/rendering/reflectionShouldBeRendered.ts";
import { renderMarkdown } from "../../lib/rendering/renderMarkdown.tsx";
import { renderSummary } from "../../lib/rendering/renderSummary.tsx";
import { renderTags } from "../../lib/rendering/renderTags.tsx";
import { renderType } from "../../lib/rendering/renderType.tsx";
import { resolveSourceUrl } from "../../lib/util/resolveUrl.ts";

export function renderParameters(parameters: Array<ParameterReflection>) {
	return (
		<div className="space-y-3">
			<h4 className="font-medium text-docs-h3 text-gray-900">Parameters</h4>
			{parameters.map((param) => {
				const paramName = param.name === "__namedParameters" ? null : (
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
						<h5 className="font-mono text-code-h3">
							{paramName}
							{paramType}
							{paramDefault}
						</h5>
						{paramSummary}
					</div>
				);
			})}
		</div>
	);
}

function renderReturns(signature: SignatureReflection) {
	const returns = signature.type;
	if (!returns) return null;

	if (signature.kindOf(ReflectionKind.ConstructorSignature)) return null;

	if (["void", "Promise<void>"].includes(returns.stringify("none"))) return null;

	const description = renderMarkdown(signature.comment?.getTag("@returns")?.content);

	return (
		<div className="space-y-2">
			<h4 className="font-medium text-docs-h3 text-gray-900">Returns</h4>
			<p className="font-mono text-code-h3 ml-2">{renderType(returns)}</p>
			<span className="ml-2 block">{description}</span>
		</div>
	);
}

function FunctionSignature({ signature }: { signature: SignatureReflection }): ReactNode {
	if (!reflectionShouldBeRendered(signature)) return null;

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
				{param.flags.isOptional || param.defaultValue
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
		<CodeHeading
			level={reflection.kind === ReflectionKind.Function ? "h1" : "h2"}
			id={reflection.name}
			url={resolveSourceUrl(signature)}
		>
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

	const returns = renderReturns(signature);

	return (
		<div className="text-docs-base text-gray-900 space-y-4 group">
			{typeSignature}
			{summary}
			{tags}
			{parametersList}
			{returns}
		</div>
	);
}

function FunctionOverloads({ overloads }: { overloads: Array<SignatureReflection> }) {
	const overloadSignatures = overloads.filter((overload) => !overload.flags.isExternal).sort((
		a,
		b,
	) => a.id > b.id ? 1 : -1);

	const signatures = overloadSignatures.map((signature) => (
		<FunctionSignature key={signature.id} signature={signature} />
	)).filter((signature) => signature !== null);

	const id = overloadSignatures[0].parent.name + overloadSignatures[0].parent.id.toString();

	return (
		<div id={id} className="overloads [&>div]:hidden">
			<span className="inline-flex items-center mb-2 gap-0.5 text-gray-700 text-docs-aside font-medium leading-6">
				<button
					id={id + "-button-left"}
					className="fill-gray-700 hover:fill-gray-900"
					aria-label="View previous overload"
				>
					<ChevronLeftIcon className="h-4" />
				</button>
				<span id={id + "-label"}>Overload 1/{overloadSignatures.length}</span>
				<button
					id={id + "-button-right"}
					className="cursor-pointer fill-gray-700 hover:fill-gray-900"
					aria-label="View next overload"
				>
					<ChevronRightIcon className="h-4" />
				</button>
			</span>
			{signatures}
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
