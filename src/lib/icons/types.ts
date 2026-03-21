// Icon size variants matching the design system
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Icon color type - can be Tailwind classes or CSS values
export type IconColor = string

// Base icon component props
export interface IconProps {
  name: string
  size?: IconSize
  color?: IconColor
  className?: string
  'aria-label'?: string
  'aria-hidden'?: boolean
}

// Size mappings following TailwindCSS conventions
export const IconSizes: Record<IconSize, string> = {
  xs: 'w-3 h-3', // 12px
  sm: 'w-4 h-4', // 16px
  md: 'w-5 h-5', // 20px (default)
  lg: 'w-6 h-6', // 24px
  xl: 'w-8 h-8', // 32px
}

// Icon mapping interfaces for type safety
export interface IconMapping {
  [semanticName: string]: any // Astro component
}

export interface IconMappingWithFallback {
  icon: any | null // Astro component or null
  fallback?: string // Original emoji for fallback during transition
}

// Category-specific icon name types for better type safety and autocomplete
export type SocialIconName = 'bluesky' | 'github' | 'mastodon' | 'twitter' | 'linkedin' | 'instagram'

export type StatisticIconName = 'attendees' | 'speakers' | 'keynotes' | 'days' | 'companies' | 'collaborators'

export type TechnicalIconName =
  | 'ml-ai'
  | 'data-science'
  | 'software-engineering'
  | 'web-development'
  | 'community'
  | 'devops-cloud'
  | 'others'

export type StatusIconName =
  | 'warning'
  | 'allowed'
  | 'forbidden'
  | 'info'
  | 'location'
  | 'calendar'
  | 'thinking'
  | 'scope'
  | 'standards'
  | 'enforcement'
  | 'reporting'
  | 'privacy'
  | 'attribution'
  | 'junior'
  | 'senior'
  | 'expert'
  | 'construction'
  | 'city'
  | 'stop'
  | 'business'
  | 'love'
  | 'heart'
  | 'leadership'
  | 'search'
  | 'partnership'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'main'

// Union type for all available icon names
export type AvailableIconName = SocialIconName | StatisticIconName | TechnicalIconName | StatusIconName
