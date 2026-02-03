import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@astrojs/react'

export default defineConfig({
  site: 'https://2026.es.pycon.org',
  base: '/',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'ca'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
})
