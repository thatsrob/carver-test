/**
 * Cloudflare / npm workspaces can omit Rollup's optional native packages (npm/cli#4828).
 * Install the Linux x64 bindings explicitly before `astro build` when missing.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const carverRoot = join(__dirname, "..");

if (process.platform !== "linux" || process.arch !== "x64") {
	process.exit(0);
}

const rollupPkgPath = join(carverRoot, "node_modules", "rollup", "package.json");
if (!existsSync(rollupPkgPath)) {
	process.exit(0);
}

const version = JSON.parse(readFileSync(rollupPkgPath, "utf8")).version;
const require = createRequire(join(carverRoot, "package.json"));

function hasBinding(name) {
	try {
		require.resolve(name);
		return true;
	} catch {
		return false;
	}
}

const gnu = "@rollup/rollup-linux-x64-gnu";
const musl = "@rollup/rollup-linux-x64-musl";

if (hasBinding(gnu) || hasBinding(musl)) {
	process.exit(0);
}

console.warn(
	`[ensure-rollup-native] Installing Rollup ${version} native bindings (workaround for npm optional-deps on CI)…`,
);
execSync(`npm install ${gnu}@${version} ${musl}@${version} --no-audit --no-fund`, {
	cwd: carverRoot,
	stdio: "inherit",
	env: { ...process.env, npm_config_optional: "true" },
});
