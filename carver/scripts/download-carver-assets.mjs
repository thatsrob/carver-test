/**
 * Downloads homepage media from gocarverllc.com into public/carver/
 */
import { createWriteStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "carver");

const URLS = [
	"https://gocarverllc.com/wp-content/uploads/2021/02/Carver-associates-logo.png",
	"https://gocarverllc.com/wp-content/uploads/2021/02/Carver-law-hero-background.jpg",
	"https://gocarverllc.com/wp-content/uploads/2021/04/Carver-law-hero-background-mobile-min.jpg",
	"https://gocarverllc.com/wp-content/uploads/2021/03/SuperLawyers-1-min.png",
	"https://gocarverllc.com/wp-content/uploads/2021/02/Best-of-417-min.png",
	"https://gocarverllc.com/wp-content/uploads/2021/02/The-Power-30-Missouri-Lawyers-Weekly-1-min.png",
	"https://gocarverllc.com/wp-content/uploads/2021/03/AV-Preminent_Whit.png",
	"https://gocarverllc.com/wp-content/uploads/2021/03/AV-Preminent_Whit-300x95.png",
	"https://gocarverllc.com/wp-content/uploads/2021/02/carver-law-homepage-about-section-min.jpg",
	"https://gocarverllc.com/wp-content/uploads/2021/02/carver-law-homepage-about-section-min-480x428.jpg",
	"https://gocarverllc.com/wp-content/uploads/2021/02/calculator-icon.png",
	"https://gocarverllc.com/wp-content/uploads/2021/02/courthouse-icon.png",
	"https://gocarverllc.com/wp-content/uploads/2021/02/Business-Law-Icon.png",
	"https://gocarverllc.com/wp-content/uploads/2021/01/vehicular-homicide-icon-min.png",
	"https://gocarverllc.com/wp-content/uploads/2021/01/domestic-violence-icon-min.png",
	"https://gocarverllc.com/wp-content/uploads/2021/02/handcuffs-icon.png",
	"https://gocarverllc.com/wp-content/uploads/2021/01/misdemeanor-icon-min.png",
	"https://gocarverllc.com/wp-content/uploads/2021/01/Personal-Injury-Icon.png",
	"https://gocarverllc.com/wp-content/uploads/2021/07/Constellation-Marketing-Lawyer-Marketing.png",
	"https://gocarverllc.com/wp-content/uploads/2021/07/Constellation-Marketing-Lawyer-Marketing-300x67.png",
	"https://gocarverllc.com/wp-content/uploads/2021/03/cropped-Carver-associates-favicon-32x32.png",
	"https://gocarverllc.com/wp-content/uploads/2021/03/cropped-Carver-associates-favicon-192x192.png",
	"https://gocarverllc.com/wp-content/uploads/2021/03/cropped-Carver-associates-favicon-180x180.png",
	"https://gocarverllc.com/wp-content/uploads/2021/03/cropped-Carver-associates-favicon-270x270.png",
	"https://gocarverllc.com/wp-content/uploads/et-fonts/Benne-Regular.ttf",
	"https://gocarverllc.com/wp-content/themes/Divi/core/admin/fonts/modules/all/modules.woff",
];

function pathFromUrl(url) {
	const u = new URL(url);
	return u.pathname.replace(/^\/wp-content\//, "wp-content/");
}

async function download(url, dest) {
	await mkdir(dirname(dest), { recursive: true });
	try {
		await stat(dest);
		return "skip";
	} catch {
		/* fetch */
	}
	const res = await fetch(url, {
		headers: { "User-Agent": "CarverLocalMirror/1.0" },
	});
	if (!res.ok) throw new Error(`${url} -> ${res.status}`);
	const body = Readable.fromWeb(res.body);
	const file = createWriteStream(dest);
	await pipeline(body, file);
	return "ok";
}

let ok = 0;
let skip = 0;
for (const url of URLS) {
	const rel = pathFromUrl(url);
	const dest = join(OUT, rel);
	try {
		const r = await download(url, dest);
		if (r === "ok") ok++;
		else skip++;
		console.log(r, rel);
	} catch (e) {
		console.error("FAIL", url, e.message);
		process.exitCode = 1;
	}
}
console.log(`Done. Fetched ${ok}, skipped ${skip} (already present).`);
