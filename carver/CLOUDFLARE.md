# Cloudflare Pages

Cloudflare sets `CF_PAGES=1` during builds. This project detects it and emits a **static** site (no Node adapter, no EmDash/SQLite — those need a Node host).

## Rollup native binary on Linux CI

[npm/cli#4828](https://github.com/npm/cli/issues/4828) can omit Rollup’s optional `@rollup/rollup-linux-x64-*` packages (especially with **npm workspaces**). This repo includes **`carver/scripts/ensure-rollup-native.mjs`**, run automatically via **`prebuild`** before `astro build`, which installs the GNU and musl Linux x64 bindings when they are missing.

## Why not npm workspaces?

Workspaces make the Rollup optional-deps bug more likely. Prefer the root **`postinstall`** → `npm ci --prefix carver` layout in this repo, or set the Pages **Root directory** to **`carver`** only.

## Dashboard settings (repo root as Pages root)

| Setting | Value |
|--------|--------|
| **Root directory** | `/` (empty) |
| **Build command** | `npm run build` |
| **Build output directory** | `carver/dist` |
| **Framework preset** | Astro (or None) |

`npm clean-install` at the repo root runs `postinstall`, which runs `npm ci` inside `carver/`, then `npm run build` delegates to `carver`’s `astro build`.

Do **not** override `CF_PAGES` in the dashboard.

## Alternative: only the `carver` app (simplest for Rollup)

If you prefer not to rely on `postinstall`:

| Setting | Value |
|--------|--------|
| **Root directory** | `carver` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |

Install and build run entirely inside `carver/` (no workspace bug).

## Local check (static output)

```bash
CF_PAGES=1 npm run build
```

From repo root, or `cd carver && CF_PAGES=1 npm run build`.

Output: `carver/dist` (or `dist` if building from `carver/`).

Preview:

```bash
cd carver && npx wrangler pages dev dist
```

## Local dev (full EmDash + Node)

From repo root: `npm run dev` (runs `npm run dev --prefix carver`).

Or: `cd carver && npm run dev`.

Full server build (no `CF_PAGES`): `cd carver && npm run build`.
