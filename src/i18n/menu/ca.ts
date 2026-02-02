export const ca = {
  items: [
    {
      label: 'Inici',
      href: '/',
    },
    {
      label: 'La Conferència',
      children: [
        {
          label: 'Speakers',
          href: '/speakers',
        },
        {
          label: 'Agenda',
          href: '/agenda',
        },
        {
          label: 'Seu',
          href: '/location',
        },
      ],
    },
    {
      label: 'Patrocinis',
      href: '/sponsors',
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
} as const
