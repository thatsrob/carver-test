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

		const raw = (pageRes?.entry?.data as { homepage?: unknown } | undefined)?.homepage;
		if (raw && typeof raw === "object" && !Array.isArray(raw)) {
			data.homepage = mergeDeep(data.homepage, raw as Partial<CarverHomeData["homepage"]>);
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
				return {
					title: String(e.data.title ?? ""),
					url: String(e.data.url ?? "#"),
					iconSrc,
					iconW: 77,
					iconH: 77,
				};
			});
		}
	} catch {
		/* DB empty or not migrated */
	}

	return { data, cacheHints };
}
