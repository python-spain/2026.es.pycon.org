import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
   site: 'https://2026.es.pycon.org',
  base: '/',
  vite: {
    plugins: [tailwindcss()],
  },
});

