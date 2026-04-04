import carverFallback from "../data/carver-homepage.json";

export type CarverHomeData = typeof carverFallback;

/**
 * Loads homepage + practice areas from EmDash when the CMS is available (Node SSR + DB).
 *
 * **Local editing (`npm run dev`):** Do not set `CF_PAGES=1`. Run `npm run seed:build` and
 * `npm run seed:apply` (or `seed:reset`) once so `data.db` has the Home page + practice areas.
 * Edit at `/_emdash/admin` → Pages → Home (homepage / layout / seo JSON) and Practice areas.
 *
 * On Cloudflare static builds (`CF_PAGES=1`), skips EmDash imports and uses JSON only.
 */
export async function loadCarverHomepage(): Promise<{
	data: CarverHomeData;
	cacheHints: unknown[];
}> {
	if (import.meta.env.CF_PAGES === "1") {
		return {
			data: structuredClone(carverFallback) as CarverHomeData,
			cacheHints: [],
		};
	}
	return (await import("./carver-home-load-cms")).loadCarverHomepageFromCms();
}
