// @ts-check
import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The public URL of the site. GitHub Actions sets SITE_URL to
// https://<owner>.github.io; locally it falls back to the dev server.
const site = process.env.SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    sitemap({
      // The /cv and /og pages only exist to render the PDF and social image.
      filter: (page) => !/\/(cv|og)\/?$/.test(page),
    }),
  ],
  env: {
    schema: {
      // Web3Forms access key: public by design, safe to ship to the browser.
      PUBLIC_WEB3FORMS_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
      // Phone number for the downloadable PDF only. Never set in CI, so the
      // deployed HTML never contains it.
      CV_PHONE: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
