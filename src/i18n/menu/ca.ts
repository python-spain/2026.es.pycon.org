export const ca = {
  items: [
    {
      label: 'Inici',
      href: '/',
    },
    {
      label: 'Seu',
      href: '/location',
    },
    {
      label: 'On allotjar-se',
      href: '/accommodation',
    },
    {
      label: 'Diversitat i Inclusió',
      children: [
        {
          label: 'Codi de conducta',
          href: '/code-of-conduct',
        },
      ],
    },
    {
      label: 'Patrocinis',
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
          label: 'Lloc',
          href: '/sponsors#location',
        },
        {
          label: 'Opinions',
          href: '/sponsors#testimonials',
        },
        {
          label: 'Paquets de patrocini',
          href: '/sponsors#tiers',
        },
      ],
    },
    {
      label: 'Edicions Anteriors',
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
  new_tab: "(s'obre en una pestanya nova)",
} as const
