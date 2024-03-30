import theme from "shiki/themes/catppuccin-mocha.mjs";
import { ReflectionKind } from "typedoc";

export const HighlightKind = { ...ReflectionKind, SkywareDeclaration: 1000 };
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
		case ReflectionKind.EnumMember:
			return themeColors["variable.other.enummember"];
		case ReflectionKind.Constructor:
		case ReflectionKind.ConstructorSignature:
		case ReflectionKind.Reference:
			return themeColors["storage.type"];
		case ReflectionKind.Parameter:
			return themeColors["variable.parameter"];
		case ReflectionKind.Class:
		case ReflectionKind.Interface:
		case ReflectionKind.TypeAlias:
		case ReflectionKind.TypeLiteral:
		case ReflectionKind.Enum:
		case ReflectionKind.Namespace:
		case ReflectionKind.TypeParameter:
			return themeColors["entity.name.type"];
		case ReflectionKind.Function:
		case ReflectionKind.Method:
			return themeColors["entity.name.function"];
		case HighlightKind.SkywareDeclaration:
			return "#70BAFF";
		default:
			return themeColors["text"];
	}
}

export const HighlightText = ({ kind, children }: { kind: HighlightKind; children: string }) => (
	<span style={{ color: reflectionColor(kind) }}>{children}</span>
);
