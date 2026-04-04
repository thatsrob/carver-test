import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import { viteStubEmdashVirtual } from "./scripts/vite-stub-emdash-virtual.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Cloudflare Pages sets CF_PAGES=1 during build — static site, no EmDash/SQLite (Workers-incompatible). */
const isCfPages = process.env.CF_PAGES === "1";

const integrations = [(await import("@astrojs/react")).default()];

let adapter;
if (!isCfPages) {
	const { default: emdash, local } = await import("emdash/astro");
	const { sqlite } = await import("emdash/db");
	const { default: node } = await import("@astrojs/node");
	integrations.push(
		emdash({
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
		}),
	);
	adapter = node({ mode: "standalone" });
}

export default defineConfig({
	output: isCfPages ? "static" : "server",
	adapter,
	integrations,
	devToolbar: { enabled: false },
	vite: {
		define: {
			"import.meta.env.CF_PAGES": JSON.stringify(process.env.CF_PAGES ?? ""),
		},
		plugins: [isCfPages ? viteStubEmdashVirtual() : null].filter(Boolean),
		resolve: {
			alias: isCfPages ?
				{
					[path.resolve(__dirname, "src/lib/carver-home-load-cms.ts")]: path.resolve(
						__dirname,
						"src/lib/carver-home-load-cms.stub.ts",
					),
				}
			:	{},
		},
	},
});
