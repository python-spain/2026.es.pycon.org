export const ca = {
  items: [
    {
      label: 'Inici',
      href: '/',
    },
    {
      label: 'Programa',
      href: '/programa',
    },
    {
      label: 'Informació',
      children: [
        {
          label: 'Seu',
          href: '/location',
        },
        {
          label: 'On allotjar-se',
          href: '/accommodation',
        },
        {
          label: 'Equips',
          href: '/teams',
        },
      ],
    },
    {
      label: 'Diversitat i Inclusió',
      children: [
        {
          label: 'Codi de conducta',
          href: '/code-of-conduct',
        },
        {
          label: 'Beces',
          href: '/becas',
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
        {
          label: 'Ofertes de treball',
          href: '/jobs',
        },
      ],
    },
    {
      label: 'Edicions Anteriors',
      href: '/past-editions',
    },
  ],
  new_tab: "(s'obre en una pestanya nova)",
} as const
