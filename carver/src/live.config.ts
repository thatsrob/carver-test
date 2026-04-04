/**
 * EmDash Live Content Collections
 *
 * When `import.meta.env.CF_PAGES === "1"`, the emdash branch is dead code and must not
 * be bundled (no `virtual:emdash/config` on static Cloudflare builds).
 */
import { defineLiveCollection } from "astro:content";

export const collections = await (
	import.meta.env.CF_PAGES === "1" ?
		Promise.resolve({})
	:	import("emdash/runtime").then(({ emdashLoader }) => ({
			_emdash: defineLiveCollection({
				loader: emdashLoader(),
			}),
		}))
);
