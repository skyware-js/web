import { defineCollection, z } from "astro:content";

const guidesCollection = defineCollection({
	type: "content",
	schema: z.object({ title: z.string(), description: z.string(), module: z.string() }),
});

export const collections = { guides: guidesCollection };
