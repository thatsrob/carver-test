/**
 * Generates seed/seed.json from src/data/carver-homepage.json so CMS schema
 * stays in sync with the static fallback used on Cloudflare builds.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "src/data/carver-homepage.json"), "utf8"));

const base = "https://gocarverllc.com";

const seed = {
	$schema: "https://emdashcms.com/seed.schema.json",
	version: "1",
	meta: {
		name: "Carver & Associates",
		description: "Criminal defense — Springfield, MO",
		author: "Carver",
	},
	settings: {
		title: "Carver & Associates Law Firm",
		tagline: "Criminal Defense",
	},
	collections: [
		{
			slug: "pages",
			label: "Pages",
			labelSingular: "Page",
			supports: ["drafts", "revisions", "search", "seo"],
			fields: [
				{ slug: "title", label: "Title", type: "string", required: true, searchable: true },
				{ slug: "homepage", label: "Homepage sections (structured JSON)", type: "json" },
				{ slug: "layout", label: "Site header, footer, nav (structured JSON)", type: "json" },
				{ slug: "seo", label: "SEO (title, description, og image)", type: "json" },
			],
		},
		{
			slug: "practice_areas",
			label: "Practice Areas",
			labelSingular: "Practice Area",
			supports: ["drafts", "search", "seo"],
			fields: [
				{ slug: "title", label: "Title", type: "string", required: true, searchable: true },
				{ slug: "url", label: "Link URL", type: "string", required: true },
				{ slug: "icon", label: "Icon", type: "image" },
				{ slug: "icon_width", label: "Icon width (px)", type: "integer" },
				{ slug: "icon_height", label: "Icon height (px)", type: "integer" },
				{ slug: "sort_order", label: "Sort order", type: "integer" },
			],
		},
	],
	content: {
		pages: [
			{
				id: "carver-home",
				slug: "home",
				status: "published",
				data: {
					title: "Home",
					homepage: data.homepage,
					layout: data.layout,
					seo: {
						title: data.meta.title,
						description: data.meta.description,
						siteOrigin: data.meta.siteOrigin,
						ogImage: data.meta.ogImage,
					},
				},
			},
		],
		practice_areas: data.practice_areas.map((pa, i) => ({
			id: `pa-${i + 1}`,
			slug: `practice_area_${i + 1}`,
			status: "published",
			data: {
				title: pa.title,
				url: pa.url,
				sort_order: i + 1,
				icon_width: pa.iconW ?? 77,
				icon_height: pa.iconH ?? 77,
				icon:
					pa.iconSrc.startsWith("http") ?
						pa.iconSrc
					:	`${base}${pa.iconSrc}`,
			},
		})),
	},
};

const out = path.join(root, "seed", "seed.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(seed, null, "\t") + "\n");
console.log("Wrote", out);
