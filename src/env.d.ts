/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "astro/client" {
	interface ImportMetaEnv {
		BASE_URL: string;
	}
}
