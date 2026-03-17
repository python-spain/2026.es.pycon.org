export const es = {
  items: [
    {
      label: 'Inicio',
      href: '/',
    },
    {
      label: 'Sede',
      href: '/location',
    },
    {
      label: 'Dónde alojarse',
      href: '/accommodation',
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
      ],
    },
    {
      label: 'Ediciones Anteriores',
      children: [
        {
          label: '2025 (Sevilla)',
          href: 'https://2025.es.pycon.org',
        },
        {
          label: '2024 (Vigo)',
          href: 'https://2024.es.pycon.org',
        },
      ],
    },
  ],
} as const
