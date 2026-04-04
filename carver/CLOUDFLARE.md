# Cloudflare Pages

Cloudflare sets `CF_PAGES=1` during builds. This project detects it and emits a **static** site (no Node adapter, no EmDash/SQLite — those need a Node host).

## Dashboard settings

| Setting | Value |
|--------|--------|
| **Framework preset** | Astro (or None) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `carver` if the repo root is the parent folder; otherwise `.` |

Do **not** override `CF_PAGES` in the dashboard; Cloudflare provides it automatically.

## Local check (static output)

```bash
npm run build:pages
```

Preview the folder Pages will upload:

```bash
npx wrangler pages dev dist
```

## Local dev (full EmDash + Node)

```bash
npm run dev
```

Use `npm run build` (without `CF_PAGES=1`) for the full server bundle + EmDash admin routes.
