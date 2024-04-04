import { clsx } from "clsx/lite";
import type { AllHTMLAttributes, ReactNode } from "react";
import theme from "shiki/themes/catppuccin-mocha.mjs";
import { ReflectionKind } from "typedoc";

export const HighlightKind = {
	...ReflectionKind,
	SkywareDeclaration: 1000,
	Punctuation: 2000,
	Text: 3000,
	Intrinsic: 4000,
	Keyword: 5000,
	String: 6000,
};
export type HighlightKind = typeof HighlightKind[keyof typeof HighlightKind];

const themeColors = theme.tokenColors!.reduce<Record<string, string>>((acc, color) => {
	const scopes = color.scope ? (Array.isArray(color.scope) ? color.scope : [color.scope]) : [];
	for (const scope of scopes) {
		if (color.settings.foreground) acc[scope] = color.settings.foreground;
	}
	return acc;
}, {});
export function reflectionColor(kind: HighlightKind) {
	switch (kind) {
		case HighlightKind.EnumMember:
			return themeColors["variable.other.enummember"];
		case HighlightKind.Constructor:
		case HighlightKind.ConstructorSignature:
		case HighlightKind.Reference:
		case HighlightKind.Intrinsic:
		case HighlightKind.Keyword:
			return themeColors["storage.type"];
		case HighlightKind.Parameter:
		case HighlightKind.SomeValue:
			return themeColors["variable.parameter"];
		case HighlightKind.Function:
		case HighlightKind.Method:
		case HighlightKind.FunctionOrMethod:
			return themeColors["entity.name.function"];
		case HighlightKind.SomeExport:
		case HighlightKind.Class:
		case HighlightKind.Interface:
		case HighlightKind.TypeAlias:
		case HighlightKind.TypeLiteral:
		case HighlightKind.Enum:
		case HighlightKind.Namespace:
		case HighlightKind.TypeParameter:
			return themeColors["entity.name.type"];
		case HighlightKind.SkywareDeclaration:
			return "#70BAFF";
		case HighlightKind.Punctuation:
			return themeColors["punctuation.definition.comment"];
		case HighlightKind.String:
			return themeColors["string"];
		case HighlightKind.Text:
		default:
			return themeColors["text"];
	}
}

export function HighlightText(
	{ kind, as: Element = "span", children, ...props }:
		& Omit<AllHTMLAttributes<HTMLElement>, "kind" | "children">
		& { kind: HighlightKind; as?: string; children: ReactNode },
): ReactNode {
	const color = reflectionColor(kind);
	return (
		// @ts-expect-error — doesn't understand that passing children is valid
		<Element
			style={{ "--color": color, "--color-dim": color + "33" }}
			{...props}
			className={clsx(
				"text-[var(--color)] font-mono",
				Element === "a"
					&& `relative border-b border-b-[var(--color)] border-dotted hover:border-b-transparent\
 before:content-[''] before:absolute before:block before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 before:w-[105%] before:h-[120%] before:hover:bg-[var(--color-dim)] before:rounded-sm`,
				props.className,
			)}
		>
			{children}
		</Element>
	);
}
