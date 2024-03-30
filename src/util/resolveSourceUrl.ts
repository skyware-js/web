import { type DeclarationReflection, Reflection, ReflectionKind } from "typedoc";

export function resolveSourceUrl(reflection: DeclarationReflection) {
	const source = reflection.sources?.[0];
	if (!source) return null;

	const { fileName, line } = source;

	let module: Reflection;
	for (module = reflection; module.kind !== ReflectionKind.Module; module = module.parent!) {}
	if (!module.name) return null;

	const repoName = module.name.split("/").pop();
	if (!repoName) return null;

	return `https://github.com/skyware-js/${repoName}/blob/main/${fileName}#L${line}`;
}
