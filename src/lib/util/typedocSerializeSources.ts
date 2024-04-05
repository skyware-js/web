import {
	Application,
	Context,
	Converter,
	type DeclarationReflection,
	type JSONOutput,
	ProjectReflection,
	ReflectionKind,
} from "typedoc";

const savedKinds = ReflectionKind.Interface
	| ReflectionKind.Function
	| ReflectionKind.TypeAlias
	| ReflectionKind.Variable
	| ReflectionKind.Class
	| ReflectionKind.Enum
	| ReflectionKind.Reference;

declare module "typedoc" {
	interface ReflectionSymbolId {
		line: number;
	}
}

export function serializeSources(app: Application) {
	app.converter.on(Converter.EVENT_RESOLVE, onResolve);

	app.serializer.addSerializer({
		priority: 0,
		supports(model) {
			return model instanceof ProjectReflection;
		},
		toObject(model: ProjectReflection, obj: JSONOutput.ProjectReflection, _ser) {
			for (const id in obj.symbolIdMap) {
				// @ts-expect-error reflectionIdToSymbolIdMap is private
				const reflectionSymbolId = model.reflectionIdToSymbolIdMap.get(parseInt(id));
				if (reflectionSymbolId) {
					obj.symbolIdMap[id] = reflectionSymbolId;
				}
			}
			return obj;
		},
	});

	app.deserializer.addDeserializer({
		priority: 0,
		supports(_model, obj: JSONOutput.ProjectReflection) {
			return obj.variant === "project";
		},
		fromObject(_model, obj: JSONOutput.ProjectReflection) {
			app.deserializer.defer((project) => {
				for (const [id, symbolId] of Object.entries(obj.symbolIdMap)) {
					const newId = app.deserializer.oldIdToNewId[id as never];
					// @ts-expect-error reflectionIdToSymbolIdMap is private
					project.reflectionIdToSymbolIdMap.set(newId, symbolId);
				}
			});
		},
	});

	function onResolve(context: Context, decl: DeclarationReflection) {
		if (!decl.kindOf(savedKinds)) return;
		const symbol = context.project.getSymbolFromReflection(decl);
		if (!symbol) return;

		const declarations = symbol.declarations;
		if (!declarations) return;

		const { line = NaN } = declarations[0].getSourceFile().getLineAndCharacterOfPosition(
			declarations[0].getStart(),
		);

		const symbolId = context.project.getSymbolIdFromReflection(decl);
		if (symbolId) {
			symbolId.line = line;
			// @ts-expect-error reflectionIdToSymbolIdMap is private
			context.project.reflectionIdToSymbolIdMap.set(decl.id, symbolId);
		}
	}
}
