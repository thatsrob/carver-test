/**
 * Astro static builds emit absolute `/ _astro/...` URLs. That breaks when opening
 * `dist/index.html` via the `file://` protocol (browser resolves `/` to the filesystem root).
 * Rewrite those references to `./ _astro/...` so local preview and edge cases work.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const distDir = join(fileURLToPath(new URL("..", import.meta.url)), "dist");

async function walkHtmlFiles(dir, acc = []) {
	const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
	for (const e of entries) {
		const p = join(dir, e.name);
		if (e.isDirectory()) await walkHtmlFiles(p, acc);
		else if (e.name.endsWith(".html")) acc.push(p);
	}
	return acc;
}

const files = await walkHtmlFiles(distDir);
let changed = 0;
for (const f of files) {
	let s = await readFile(f, "utf8");
	if (!s.includes('"/_astro/') && !s.includes("'/_astro/")) continue;
	const next = s
		.replaceAll('href="/_astro/', 'href="./_astro/')
		.replaceAll('src="/_astro/', 'src="./_astro/');
	if (next !== s) {
		await writeFile(f, next);
		changed++;
	}
}

if (changed) {
	console.log(`[relative-public-assets] Rewrote /_astro/ → ./_astro/ in ${changed} HTML file(s).`);
}
