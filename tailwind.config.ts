import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{md,mdx,ts,tsx,astro}"],
	theme: {
		colors: {
			gray: {
				100: "#1A1E22",
				300: "#2B3E4D",
				500: "#576C7F",
				700: "#818A91",
				900: "#E6E8E9",
			},
			accent: "#70BAFF",
			current: "currentColor",
		},
		fontFamily: {
			sans: ["Geist Variable", "sans-serif"],
			mono: ["Geist Mono Variable", "monospace"],
		},
		extend: {
			fontSize: {
				"code-h1": "1.25rem",
				"code-h2": "1.125rem",
				"code-h3": "0.9375rem",
				"docs-h3": ["1rem", "1.5rem"],
				"docs-base": ["0.875rem", "1.125rem"],
				"docs-aside": ["0.75rem", "1rem"],
			},
		},
	},
	plugins: [forms],
} satisfies Config;
