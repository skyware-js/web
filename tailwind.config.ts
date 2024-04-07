import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

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
			external: "#CBA6F7",
			current: "currentColor",
			transparent: "transparent",
		},
		fontFamily: {
			sans: ["Geist Variable", "sans-serif"],
			mono: ["Geist Mono Variable", "monospace"],
		},
		extend: {
			fontSize: {
				"code-h1": "1.25rem",
				"code-h2": "1.125rem",
				"code-h3": "1rem",
				"docs-h3": ["1.125rem", "1.75rem"],
				"docs-base": ["1rem", "1.625rem"],
				"docs-aside": ["0.875rem", "1rem"],
			},
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						"--tw-prose-body": theme("colors.gray.900"),
						"--tw-prose-headings": theme("colors.gray.900"),
						"--tw-prose-lead": theme("colors.gray.500"),
						"--tw-prose-links": theme("colors.accent"),
						"--tw-prose-bold": theme("colors.gray.900"),
						"--tw-prose-counters": theme("colors.gray.500"),
						"--tw-prose-bullets": theme("colors.gray.700"),
						"--tw-prose-hr": theme("colors.gray.700"),
						"--tw-prose-quotes": theme("colors.gray.300"),
						"--tw-prose-quote-borders": theme("colors.gray.700"),
						"--tw-prose-captions": theme("colors.gray.500"),
						"--tw-prose-kbd": theme("colors.gray.900"),
						"--tw-prose-code": theme("colors.gray.900"),
						"--tw-prose-pre-code": theme("colors.gray.100"),
						"--tw-prose-pre-bg": theme("colors.gray.300") + "80",
						"--tw-prose-th-borders": theme("colors.gray.700"),
						"--tw-prose-td-borders": theme("colors.gray.700"),
						h1: { fontWeight: 500 },
						h2: { fontWeight: 500 },
					},
				},
			}),
			screens: { xs: "400px" },
		},
	},
	plugins: [
		forms,
		typography,
		plugin(({ addVariant }) => {
			addVariant("menu-open", "body[data-menu-open] &");
		}),
	],
} satisfies Config;
