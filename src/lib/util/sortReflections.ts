import type { DeclarationReflection } from "typedoc";

const sorts: Record<string, (a: DeclarationReflection, b: DeclarationReflection) => boolean> = {
	"source-order"(a, b) {
		const aSymbol = a.project.getSymbolIdFromReflection(a);
		const bSymbol = b.project.getSymbolIdFromReflection(b);

		if (aSymbol && bSymbol) {
			if (aSymbol.fileName < bSymbol.fileName) {
				return true;
			}
			if (aSymbol.fileName === bSymbol.fileName && aSymbol.pos < bSymbol.pos) {
				return true;
			}
			return false;
		}
		return false;
	},
	visibility(a, b) {
		if (a.flags.isPrivate && !b.flags.isPrivate) {
			return true;
		}
		if (a.flags.isProtected) {
			return b.flags.isPrivate;
		}
		if (b.flags.isPrivate || b.flags.isProtected) {
			return true;
		}
		return false;
	},
	"external-last"(a, b) {
		return !a.flags.isExternal && b.flags.isExternal;
	},
	alphabetical(a, b) {
		return a.name < b.name;
	},
};

const strategies = ["source-order", "visibility", "external-last", "alphabetical"];

export function sortReflections(reflections: Array<DeclarationReflection>) {
	return reflections.sort((a, b) => {
		for (const s of strategies) {
			if (sorts[s](a, b)) {
				return -1;
			}
			if (sorts[s](b, a)) {
				return 1;
			}
		}
		return 0;
	});
}
