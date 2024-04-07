export const DocSearch = await (async () => {
	const lib = await import("@docsearch/react");
	return typeof window !== "undefined" ? lib.DocSearch : lib.default.DocSearch;
})();
