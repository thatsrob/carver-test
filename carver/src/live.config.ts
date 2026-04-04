/**
 * EmDash Live Content Collections
 *
 * On Cloudflare Pages (`CF_PAGES=1`), collections are empty — EmDash admin/API require Node + SQLite.
 */

import { defineLiveCollection } from "astro:content";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const isCfPages = process.env.CF_PAGES === "1";

export const collections = isCfPages
	? {}
	: {
			_emdash: defineLiveCollection({
				loader: createRequire(fileURLToPath(import.meta.url))("emdash/runtime").emdashLoader(),
			}),
		};
