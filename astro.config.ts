import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { rendererRich, transformerTwoslash } from "@shikijs/twoslash";
import { defineConfig } from "astro/config";
import { renderMarkdownInTwoslashHover } from "./src/lib/rendering/renderMarkdown.tsx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://skyware.js.org",

	redirects: {
		"/docs/bot": "/guides/bot/introduction/getting-started",
		"/docs/firehose": "/guides/firehose/introduction/getting-started",
		"/docs/labeler": "/guides/labeler/introduction/getting-started",
		"/docs/jetstream": "/guides/jetstream/introduction/getting-started",
	},

	integrations: [tailwind({ applyBaseStyles: false }), react(), mdx(), sitemap({})],
	markdown: {
		shikiConfig: {
			theme: "catppuccin-mocha",
			transformers: [
				transformerTwoslash({
					renderer: rendererRich({
						renderMarkdown: renderMarkdownInTwoslashHover!,
						renderMarkdownInline: renderMarkdownInTwoslashHover!,
					}),
					twoslashOptions: {
						compilerOptions: {
							module: 199, // nodenext
							moduleResolution: 99 // nodenext
						}
					}
				}),
			],
			wrap: true,
		},
	},
});
