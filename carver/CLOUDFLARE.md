# Cloudflare Pages

Cloudflare sets `CF_PAGES=1` during builds. This project detects it and emits a **static** site (no Node adapter, no EmDash/SQLite — those need a Node host).

The repo includes a **root** `package.json` with an npm **workspace** pointing at `carver/`, so `npm run build` works from the **repository root** (fixes “Could not read package.json” when the app lives in `carver/`).

## Dashboard settings

### If the Pages project root is the **repo root** (recommended with this repo)

| Setting | Value |
|--------|--------|
| **Root directory** | `/` (leave empty or `.`) |
| **Build command** | `npm run build` |
| **Build output directory** | `carver/dist` |
| **Framework preset** | Astro (or None) |

### If you prefer to scope the app folder only

| Setting | Value |
|--------|--------|
| **Root directory** | `carver` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |

Do **not** override `CF_PAGES` in the dashboard; Cloudflare provides it automatically.

### Rollup / `@rollup/rollup-linux-x64-gnu` on CI

npm workspaces can skip Rollup’s Linux optional binary ([npm#4828](https://github.com/npm/cli/issues/4828)). This repo lists `@rollup/rollup-linux-x64-gnu` under **optionalDependencies** (root and `carver/`) so `npm ci` on Cloudflare’s Linux builders installs the native module.

## Local check (static output)

From the **repo root**:

```bash
CF_PAGES=1 npm run build
```

Or:

```bash
npm run build:pages
```

Output is under `carver/dist`. Preview:

```bash
cd carver && npx wrangler pages dev dist
```

## Local dev (full EmDash + Node)

From the **repo root**:

```bash
npm run dev
```

Or from `carver/`: `npm run dev`.

Use `npm run build` (without `CF_PAGES=1`) from `carver/` for the full server bundle + EmDash admin routes.
