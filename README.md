# shadiul.github.io

Personal website of Shadiul Huda — portfolio + dev blog. Live at
**https://shadiul.github.io**.

## Stack

- **[Astro](https://astro.build)** — static output, zero JS by default
- **[Tailwind CSS v4](https://tailwindcss.com)** — via `@tailwindcss/vite`
- **MDX** — for blog posts (`@astrojs/mdx`)
- **GitHub Actions** → **GitHub Pages** — auto-deploy on push to `main`

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # output → ./dist
npm run preview    # preview the production build
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
site and publishes it to GitHub Pages. No manual step. Set the repo's
**Settings → Pages → Source** to **GitHub Actions** once.

## Structure

```
src/
  layouts/     # page shells (Base.astro)
  pages/       # routes (index.astro, ...)
  styles/      # global.css — design tokens (dark-first, violet accent)
public/         # static assets served as-is (favicon, robots.txt)
```
