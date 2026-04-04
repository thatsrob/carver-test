/**
 * Stub when `CF_PAGES=1` — Vite alias replaces `carver-home-load-cms.ts`
 * so static builds never pull `emdash` into the bundle graph.
 */
import carverFallback from "../data/carver-homepage.json";
import type { CarverHomeData } from "./carver-home-load";

export async function loadCarverHomepageFromCms(): Promise<{
	data: CarverHomeData;
	cacheHints: unknown[];
}> {
	return {
		data: structuredClone(carverFallback) as CarverHomeData,
		cacheHints: [],
	};
}
