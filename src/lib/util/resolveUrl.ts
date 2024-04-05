import {
	DeclarationReflection,
	ReferenceType,
	Reflection,
	ReflectionKind,
	type SomeType,
	SourceReference,
} from "typedoc";

export const externalSymbolLinkMappings = {
	global: {
		Promise:
			"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
		Date:
			"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
	},
	typescript: {
		Promise:
			"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
		Date:
			"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
	},
	limiter: { "*": "https://www.npmjs.com/package/limiter" },
	"quick-lru": { "*": "https://www.npmjs.com/package/quick-lru" },
};

export function parseAtprotoLexiconPath(fileName: string): Array<string> | null {
	const lexiconMatch = fileName.match(/client\/types\/(\w+)\/(\w+)\/(\w+)\/(\w+)\.ts/);
	if (!lexiconMatch) return null;

	const [, ...lexiconParts] = lexiconMatch.filter(Boolean);
	if (lexiconParts.length !== 4) return null;

	return lexiconParts;
}

function resolveAtprotoTypeUrl(type: ReferenceType): string | null {
	if (!type.symbolId?.fileName) return null;

	const lexiconParts = parseAtprotoLexiconPath(type.symbolId.fileName);
	if (lexiconParts) {
		return `https://github.com/bluesky-social/atproto/tree/main/lexicons/${
			lexiconParts.join("/")
		}.json`;
	}

	const filepath = type.symbolId.fileName.match(/@atproto\/api\/(.+)/)?.[1];
	if (filepath) {
		return `https://github.com/bluesky-social/atproto/tree/main/packages/api/${filepath}`;
	}

	return null;
}

export function resolveSourceUrl(reflection: Reflection & { sources?: Array<SourceReference> }) {
	const source = reflection.sources?.[0];
	if (!source) return null;

	const { fileName, line } = source;

	let module: Reflection = reflection;
	while (module?.parent && module?.kind !== ReflectionKind.Module) {
		module = module.parent;
	}
	if (!module?.name) return null;

	const repoName = module.name.split("/").pop();
	if (!repoName) return null;

	return `https://github.com/skyware-js/${repoName}/blob/main/${fileName}#L${line + 1}`;
}

export function resolveTypeUrl(type?: SomeType | null | undefined): string | null {
	if (!(type instanceof ReferenceType)) return null;
	if (type.externalUrl) return type.externalUrl;
	if (type.package === "@atproto/api") {
		return resolveAtprotoTypeUrl(type);
	}
	return null;
}

export function resolveReflectionUrl(reflection?: Reflection | null | undefined): string | null {
	if (!reflection) return null;

	if (reflection.url) return reflection.url;
	if (reflection instanceof DeclarationReflection) {
		const typeUrl = resolveTypeUrl(reflection.type);
		if (typeUrl) return typeUrl;
	}

	let module: Reflection = reflection;
	while (module?.parent && module?.kind !== ReflectionKind.Module) {
		module = module.parent;
	}
	if (!module?.name) return null;

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
		return resolveReflectionUrl(reflection.parent) + "#" + reflection.name;
	}

	return null;
}
