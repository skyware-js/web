import fs from "fs";
import { $, argv, cd, path, within } from "zx";
import config from "../config.json";

const base = path.resolve(import.meta.dirname, "..");

for (const library of config.packages) {
	const dirname = library.repo.split("/")[1];

	if (!dirname) {
		throw new Error(`Invalid repo name: ${library.repo}`);
	}

	const packageDir = path.join(base, "packages", dirname);

	if (fs.existsSync(packageDir)) {
		if (argv.overwrite) {
			await $`rm -rf ${packageDir}`;
		} else {
			continue;
		}
	}

	await $`mkdir -p ${path.join(base, "packages")}`;
	await $`git clone https://github.com/${library.repo}.git ${packageDir}`;

	await within(async () => {
		cd(packageDir);
		await $`pnpm i`;
	});
}
