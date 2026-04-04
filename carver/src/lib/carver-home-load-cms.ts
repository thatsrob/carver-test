import carverFallback from "../data/carver-homepage.json";
import { getEmDashCollection, getEmDashEntry } from "emdash";
import type { CarverHomeData } from "./carver-home-load";

function mergeDeep<T extends object>(a: T, b: Partial<T>): T {
	const o = { ...a };
	for (const k of Object.keys(b) as (keyof T)[]) {
		const v = b[k];
		if (v && typeof v === "object" && !Array.isArray(v)) {
			o[k] = mergeDeep(o[k] as object, v as object) as T[typeof k];
		} else if (v !== undefined) {
			o[k] = v as T[typeof k];
		}
	}
	return o;
}

export async function loadCarverHomepageFromCms(): Promise<{
	data: CarverHomeData;
	cacheHints: unknown[];
}> {
	const data = structuredClone(carverFallback) as CarverHomeData;
	const cacheHints: unknown[] = [];

	try {
		const pageRes = await getEmDashEntry("pages", "home");
		if (pageRes?.cacheHint) cacheHints.push(pageRes.cacheHint);

		const pageData = pageRes?.entry?.data as
			| { homepage?: unknown; layout?: unknown; seo?: unknown }
			| undefined;

		const rawHome = pageData?.homepage;
		if (rawHome && typeof rawHome === "object" && !Array.isArray(rawHome)) {
			data.homepage = mergeDeep(data.homepage, rawHome as Partial<CarverHomeData["homepage"]>);
		}

		const rawLayout = pageData?.layout;
		if (rawLayout && typeof rawLayout === "object" && !Array.isArray(rawLayout)) {
			data.layout = mergeDeep(data.layout, rawLayout as Partial<CarverHomeData["layout"]>);
		}

		const rawSeo = pageData?.seo;
		if (rawSeo && typeof rawSeo === "object" && !Array.isArray(rawSeo)) {
			data.meta = mergeDeep(data.meta, rawSeo as Partial<CarverHomeData["meta"]>);
		}

		const paRes = await getEmDashCollection("practice_areas", {
			status: "published",
			limit: 50,
			orderBy: { sort_order: "asc" },
		});
		if (paRes?.cacheHint) cacheHints.push(paRes.cacheHint);

		const entries = paRes?.entries;
		if (entries?.length) {
			const sorted = [...entries].sort(
				(a, b) => (Number(a.data.sort_order) || 0) - (Number(b.data.sort_order) || 0),
			);
			data.practice_areas = sorted.map((e) => {
				const icon = e.data.icon as { src?: string } | string | undefined;
				const iconSrc = typeof icon === "string" ? icon : (icon?.src ?? "");
				const d = e.data as { icon_width?: unknown; icon_height?: unknown };
				const iconW = Number(d.icon_width);
				const iconH = Number(d.icon_height);
				return {
					title: String(e.data.title ?? ""),
					url: String(e.data.url ?? "#"),
					iconSrc,
					iconW: Number.isFinite(iconW) && iconW > 0 ? iconW : 77,
					iconH: Number.isFinite(iconH) && iconH > 0 ? iconH : 77,
				};
			});
		}
	} catch {
		/* DB empty or not migrated */
	}

	return { data, cacheHints };
}
