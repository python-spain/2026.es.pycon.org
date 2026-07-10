export const es = {
  title: 'Programa',
  seoDescription: 'Consulta el cronograma completo de charlas, talleres y actividades de la PyConES 2026.',
  intro: 'Explora todas las charlas, talleres y actividades de la PyConES 2026.',
  locale: 'es',
  noscript: 'JavaScript está deshabilitado en tu navegador. Para ver el programa sin JavaScript,',
  noscriptLink: 'haz click aquí',
  a11y: {
    statusTemplate: (count: number) => `Mostrando ${count} ${count === 1 ? 'sesión' : 'sesiones'}`,
    statusEmpty: 'No hay sesiones que coincidan con los filtros',
    searchLabel: 'Buscar sesiones',
    timezoneLabel: 'Zona horaria',
    closeFilters: 'Cerrar filtros',
  },
} as const
