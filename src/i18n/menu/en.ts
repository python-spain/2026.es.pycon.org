export const en = {
  items: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'The Conference',
      children: [
        {
          label: 'Speakers',
          href: '/speakers',
        },
        {
          label: 'Schedule',
          href: '/agenda',
        },
        {
          label: 'Venue',
          href: '/location',
        },
      ],
    },
    {
      label: 'Sponsorship',
      children: [
        {
          label: 'About',
          href: '/sponsors#about',
        },
        {
          label: 'Stats',
          href: '/sponsors#stats',
        },
        {
          label: 'Location',
          href: '/sponsors#location',
        },
        {
          label: 'Testimonials',
          href: '/sponsors#testimonials',
        },
        {
          label: 'Sponsorship Packages',
          href: '/sponsors#tiers',
        },
      ],
    },
    {
      label: 'Past Editions',
      children: [
        {
          label: '2025 (Seville)',
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
