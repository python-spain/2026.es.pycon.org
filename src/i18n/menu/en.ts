export const en = {
  items: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Programme',
      href: '/programa',
    },
    {
      label: 'Information',
      children: [
        {
          label: 'Venue',
          href: '/location',
        },
        {
          label: 'Where to stay',
          href: '/accommodation',
        },
        {
          label: 'Teams',
          href: '/teams',
        },
      ],
    },
    {
      label: 'Diversity and Inclusion',
      children: [
        {
          label: 'Code of Conduct',
          href: '/code-of-conduct',
        },
        {
          label: 'Scholarships',
          href: '/becas',
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
        {
          label: 'Job offers',
          href: '/jobs',
        },
      ],
    },
    {
      label: 'Past Editions',
      href: '/past-editions',
    },
  ],
  new_tab: '(opens in new tab)',
} as const
