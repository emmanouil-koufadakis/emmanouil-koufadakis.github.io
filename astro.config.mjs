// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The public URL of the site. GitHub Actions sets SITE_URL to
// https://<owner>.github.io; locally it falls back to the dev server.
const site = process.env.SITE_URL || 'http://localhost:4321';

// All text lives in db/content.db. While the dev server runs, saving the
// database (e.g. from DB Browser for SQLite) reloads the page with the new text.
/** @returns {import('vite').Plugin} */
function reloadOnDatabaseChange() {
  return {
    name: 'reload-on-database-change',
    configureServer(server) {
      const db = new URL('./db/content.db', import.meta.url).pathname;
      server.watcher.add(db);
      server.watcher.on('change', (file) => {
        if (file !== db) return;
        server.moduleGraph.invalidateAll();
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  // English lives at the root, Greek under /el/. Astro.currentLocale tells
  // components which language to read from the database.
  i18n: {
    locales: ['en', 'el'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // The /cv and /og pages only exist to render the PDF and social image.
      filter: (page) => !/\/(cv|og)\/?$/.test(page),
      // Lists each page with its other-language version (hreflang).
      i18n: { defaultLocale: 'en', locales: { en: 'en-GB', el: 'el-GR' } },
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
    plugins: [tailwindcss(), reloadOnDatabaseChange()],
  },
});
