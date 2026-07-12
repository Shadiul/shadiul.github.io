// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// User site (Shadiul.github.io) → served at the domain root, so no `base` needed.
// https://docs.astro.build/en/guides/deploy/github/
export default defineConfig({
  site: 'https://shadiul.github.io',
  integrations: [mdx(), sitemap(), react()],
  markdown: {
    shikiConfig: {
      // Dual themes → CSS vars; the .dark class switches them (see global.css).
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});