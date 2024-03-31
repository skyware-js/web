import { Reflection, ReflectionKind, SourceReference } from "typedoc";

export function resolveSourceUrl(reflection: Reflection & { sources?: Array<SourceReference> }) {
	const source = reflection.sources?.[0];
	if (!source) return null;

	const { fileName, line } = source;

	let module: Reflection;
	for (module = reflection; module.kind !== ReflectionKind.Module; module = module.parent!) {}
	if (!module.name) return null;

	const repoName = module.name.split("/").pop();
	if (!repoName) return null;

	return `https://github.com/skyware-js/${repoName}/blob/main/${fileName}#L${line + 1}`;
}

export function resolveReflectionUrl(reflection: Reflection): string | null {
	let module: Reflection;
	for (module = reflection; module.kind !== ReflectionKind.Module; module = module.parent!) {}
	if (!module.name) return null;

	const repoName = module.name.split("/").pop()!;

	const categories: Partial<Record<ReflectionKind, string>> = {
		[ReflectionKind.Class]: "classes",
		[ReflectionKind.Interface]: "types",
		[ReflectionKind.TypeAlias]: "types",
		[ReflectionKind.Function]: "functions",
		[ReflectionKind.Variable]: "variables",
		[ReflectionKind.Enum]: "enums",
	};

	const category = reflection.kind in categories ? categories[reflection.kind] : null;
	if (category) return `/docs/${repoName}/${category}/${reflection.name}`;

	if (reflection.kindOf([ReflectionKind.ClassMember, ReflectionKind.SomeMember])) {
		return resolveReflectionUrl(reflection.parent!) + "#" + reflection.name;
	}

	return null;
}
