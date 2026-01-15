import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// CONF WITHOUT REAL DOMAIN
export default defineConfig({
  site: 'https://python-spain.github.io',
  base: '/',
  vite: {
    plugins: [tailwindcss()],
  },
});

//CONFIG WITH REAL DOMAIN
// export default defineConfig({
//   site: 'https://2026.es.pycon.org',
//   base: '/',
// });
