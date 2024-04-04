import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { rendererRich, transformerTwoslash } from "@shikijs/twoslash";
import { defineConfig } from "astro/config";
import { renderMarkdownInTwoslashHover } from "./src/util/renderMarkdown";

const base = "/web";

// https://astro.build/config
export default defineConfig({
	site: "https://skyware-js.github.io",
	base,

	redirects: {
		"/docs/bot": base + "/guides/bot/introduction/getting-started",
		"/docs/firehose": base + "/guides/firehose/introduction/getting-started",
	},

	integrations: [tailwind({ applyBaseStyles: false }), react(), mdx()],
	markdown: {
		shikiConfig: {
			theme: "catppuccin-mocha",
			transformers: [
				transformerTwoslash({
					renderer: rendererRich({
						renderMarkdown: renderMarkdownInTwoslashHover!,
						renderMarkdownInline: renderMarkdownInTwoslashHover!,
					}),
				}),
			],
			wrap: true,
		},
	},
});
