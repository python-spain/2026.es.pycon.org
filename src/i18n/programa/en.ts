export const en = {
  title: 'Programme',
  seoDescription: 'Check out the full schedule of talks, workshops and activities at PyConES 2026.',
  intro: 'Explore all the talks, workshops and activities at PyConES 2026.',
  locale: 'en',
  noscript: 'JavaScript is disabled in your browser. To view the schedule without JavaScript,',
  noscriptLink: 'click here',
  a11y: {
    statusTemplate: (count: number) => `Showing ${count} ${count === 1 ? 'session' : 'sessions'}`,
    statusEmpty: 'No sessions match the filters',
    searchLabel: 'Search sessions',
    timezoneLabel: 'Timezone',
    closeFilters: 'Close filters',
  },
} as const
