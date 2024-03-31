export function parseMarkdownLinks(text: string): Array<{ text: string; url?: string }> {
	const links = text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
	const parts = [];
	let lastIndex = 0;
	for (const link of links) {
		const [full, text, url] = link;
		if (lastIndex < link.index) {
			parts.push({ text: text.slice(lastIndex, link.index) });
		}
		parts.push({ text, url });
		lastIndex = link.index + full.length;
	}
	if (lastIndex < text.length) {
		parts.push({ text: text.slice(lastIndex) });
	}
	return parts;
}

export function parseMarkdownCodeBlock(text: string): string {
	const match = text.match(/```(.*)\n([\s\S]*)\n```/);
	if (!match) {
		return text;
	}
	const [, language, code] = match;
	return code;
}
