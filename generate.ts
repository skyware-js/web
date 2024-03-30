import fs from "fs";
import { $, argv, cd, within } from "zx";
import config from "./config.json";

for (const library of config.packages) {
	const dirname = library.repo.split("/")[1];

	if (!dirname) {
		throw new Error(`Invalid repo name: ${library.repo}`);
	}

	if (fs.existsSync(`packages/${dirname}`)) {
		if (argv.overwrite) {
			await $`rm -rf packages/${dirname}`;
		} else {
			continue;
		}
	}

	await $`mkdir -p packages`;
	await $`git clone https://github.com/${library.repo}.git packages/${dirname}`;

	await within(async () => {
		cd(`packages/${dirname}`);
		await $`pnpm i`;
	});
}
