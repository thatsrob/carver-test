/**
 * Practice icons in JSON use `/carver/wp-content/...` (mirrors `public/carver/` after download).
 * WordPress serves the same files at `https://gocarverllc.com/wp-content/...` (no `/carver/`).
 * Seed mistakenly used `.../carver/wp-content/...` for absolute URLs — those 404.
 */
const LIVE_ORIGIN = "https://gocarverllc.com";

export function normalizePracticeIconSrc(src: string): string {
	if (!src) return src;
	if (src.startsWith(`${LIVE_ORIGIN}/carver/wp-content/`)) {
		return src.replace(`${LIVE_ORIGIN}/carver/wp-content/`, `${LIVE_ORIGIN}/wp-content/`);
	}
	if (src.startsWith("/carver/wp-content/")) {
		return `${LIVE_ORIGIN}${src.replace(/^\/carver\/wp-content\//, "/wp-content/")}`;
	}
	return src;
}

export function finalizePracticeIconUrls(data: { practice_areas: { iconSrc: string }[] }): void {
	for (const pa of data.practice_areas) {
		pa.iconSrc = normalizePracticeIconSrc(pa.iconSrc);
	}
}
