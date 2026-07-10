export const ca = {
  title: 'Programa',
  seoDescription: 'Consulta el cronograma complet de xerrades, tallers i activitats de la PyConES 2026.',
  intro: 'Explora totes les xerrades, tallers i activitats de la PyConES 2026.',
  locale: 'ca',
  noscript: 'JavaScript està desactivat al teu navegador. Per veure el programa sense JavaScript,',
  noscriptLink: 'fes clic aquí',
  a11y: {
    statusTemplate: (count: number) => `Mostrant ${count} ${count === 1 ? 'sessió' : 'sessions'}`,
    statusEmpty: 'No hi ha sessions que coincideixin amb els filtres',
    searchLabel: 'Cerca sessions',
    timezoneLabel: 'Zona horària',
    closeFilters: 'Tanca els filtres',
  },
} as const
