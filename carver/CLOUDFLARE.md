# Cloudflare Pages

Cloudflare sets `CF_PAGES=1` during builds. This project detects it and emits a **static** site (no Node adapter, no EmDash/SQLite — those need a Node host).

## Fix: site only works at `/dist` and images 404

Two separate issues:

### 1) Wrong “Build output directory” (site lives under `/dist` in the URL)

Cloudflare’s **Build output directory** is a **path on disk**, not a URL segment. Whatever folder you point to becomes **`/`** on your domain. You must **not** double the folder name.

Pick **one** layout:

#### Option A — Monorepo root is the Pages root (this repo)

| Setting | Value |
|--------|--------|
| **Root directory** (Advanced) | _empty_ |
| **Build command** | `npm run build:cf` |
| **Build output directory** | `carver/dist` |

Here the app lives under `carver/` in git, but the **built files** are in `carver/dist/`. Cloudflare publishes **the contents** of `carver/dist` at `https://<project>.pages.dev/` — **no** `/dist` in the public URL.

#### Option B — Only the `carver` folder is the Pages root

| Setting | Value |
|--------|--------|
| **Root directory** (Advanced) | `carver` |
| **Build command** | `npm run build:cf` |
| **Build output directory** | `dist` |

Because the project root **is** already `carver/`, the output folder is **`dist`**, not `carver/dist`. Using `carver/dist` here often breaks paths (wrong nested folder) and can make the site appear under `/dist`.

**Wrong combinations**

| Root directory | Build output directory | Problem |
|----------------|------------------------|--------|
| `carver` | `carver/dist` | Usually resolves to the wrong path (`carver/carver/dist` or similar). |
| _empty_ | `dist` | Wrong unless `index.html` is at repo `dist/` (it is under `carver/dist`). |

### 2) Images don’t load

HTML/CSS use `/carver/wp-content/uploads/...`. Those files must exist under **`public/carver/`** in the Astro project so they copy into **`dist/carver/`**.

The script **`npm run build:cf`** runs **`download-carver-assets`** first (pulls from gocarverllc.com), then **`npm run build`**. Use **`build:cf`** as the Cloudflare **Build command** so every deploy includes images.

If you use plain **`npm run build`** on Pages without downloading first, `public/carver/` may be empty and images 404.

---

## Rollup native binary on Linux CI

[npm/cli#4828](https://github.com/npm/cli/issues/4828) can omit Rollup’s optional `@rollup/rollup-linux-x64-*` packages. This repo includes **`carver/scripts/ensure-rollup-native.mjs`** (via **`prebuild`**) to install Linux bindings when missing.

## Install step (repo root)

Root **`postinstall`** runs **`npm ci --prefix carver`**. Keep using **`npm clean-install`** (or **`npm ci`**) at the repo root so `carver` dependencies install.

## Environment

Do **not** override **`CF_PAGES`** in the dashboard; Cloudflare sets it automatically.

## Local preview (static)

```bash
cd carver && CF_PAGES=1 npm run build && npm run preview:static
```

Open the URL `serve` prints (usually **`/`** is the homepage, not `/dist`).

## Local dev (full EmDash + Node)

`npm run dev` from repo root, or `cd carver && npm run dev`.
