import { defineMiddleware } from 'astro/middleware'

const SUPPORTED_LANGS = ['es', 'en', 'ca']
const DEFAULT_LANG = 'es'

export const onRequest = defineMiddleware(({ request, redirect }, next) => {
  const url = new URL(request.url)

  // Solo actuar en la raíz "/"
  if (url.pathname !== '/') {
    return next()
  }

  // Leer el header del navegador
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) {
    return redirect(`/${DEFAULT_LANG}`)
  }

  // Parse simple Accept-Language list and pick first supported
  // Ej: "es-ES,es;q=0.9,en;q=0.8"
  const parsed = acceptLanguage.split(',').map((part) => part.split(';')[0].trim().split('-')[0])

  const matched = parsed.find((l) => SUPPORTED_LANGS.includes(l))
  return redirect(`/${matched ?? DEFAULT_LANG}`)
})
