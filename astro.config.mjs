import { defineConfig } from 'astro/config';

// CONF WITHOUT REAL DOMAIN
export default defineConfig({
  site: 'https://python-spain.github.io',
  base: '/2026.es.pycon.org',
});

//CONFIG WITH REAL DOMAIN
// astro.config.mjs
// export default defineConfig({
//   site: 'https://2026.es.pycon.org',
//   base: '/',
// });