import fs from "fs";
import { $, argv, cd, path, within } from "zx";
import config from "../config.json";

const base = path.resolve(import.meta.dirname, "..");
await $`mkdir -p ${path.join(base, "packages")}`;

for (const library of config.packages) {
	const dirname = library.repo.split("/")[1];

	if (!dirname) {
		throw new Error(`Invalid repo name: ${library.repo}`);
	}

	const packageDir = path.join(base, "packages", dirname);
	const gitDir = path.join(packageDir, ".git");

	if (fs.existsSync(gitDir)) {
		await within(async () => {
			cd(packageDir);
			await $`git fetch --all`;
			if (argv.overwrite) {
				await $`git reset --hard origin/main`;
			} else {
				await $`git pull`;
			}
		});
	} else {
		await $`mkdir -p ${packageDir}`;
		await $`rm -rf ${packageDir}`;
		await $`git clone https://github.com/${library.repo}.git ${packageDir}`;
	}

	await within(async () => {
		cd(packageDir);
		await $`pnpm i`;
	});
}
