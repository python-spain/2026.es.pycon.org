export const es = {
  items: [
    {
      label: 'Inicio',
      href: '/',
    },
    {
      label: 'Programa',
      href: '/programa',
    },
    {
      label: 'Información',
      children: [
        {
          label: 'Sede',
          href: '/location',
        },
        {
          label: 'Dónde alojarse',
          href: '/accommodation',
        },
        {
          label: 'Equipos',
          href: '/teams',
        },
      ],
    },
    {
      label: 'Diversidad e Inclusión',
      children: [
        {
          label: 'Código de conducta',
          href: '/code-of-conduct',
        },
        {
          label: 'Becas',
          href: '/becas',
        },
      ],
    },
    {
      label: 'Patrocinios',
      children: [
        {
          label: 'Sobre la PyConES',
          href: '/sponsors#about',
        },
        {
          label: 'En números',
          href: '/sponsors#stats',
        },
        {
          label: 'Lugar',
          href: '/sponsors#location',
        },
        {
          label: 'Testimonios',
          href: '/sponsors#testimonials',
        },
        {
          label: 'Paquetes de patrocinio',
          href: '/sponsors#tiers',
        },
        {
          label: 'Ofertas de trabajo',
          href: '/jobs',
        },
      ],
    },
    {
      label: 'Ediciones Anteriores',
      href: '/past-editions',
    },
  ],
  new_tab: '(se abre en nueva pestaña)',
} as const
