import type { IconMappingWithFallback } from '@/lib/icons/types'
import { socialSvgs } from '@/lib/icons/assets'

/**
 * Social media icon mappings
 * Uses raw SVG assets to avoid the upcoming deprecation of brand icons in Lucide.
 * Emoji fallback kept for resilience in case an asset is missing.
 */
export const socialMapping: Record<string, IconMappingWithFallback> = {
  bluesky: {
    icon: null,
    svg: socialSvgs.bluesky,
    fallback: '🦋',
  },
  github: {
    icon: null,
    svg: socialSvgs.github,
    fallback: '🐙',
  },
  mastodon: {
    icon: null,
    svg: socialSvgs.mastodon,
    fallback: '🐘',
  },
  twitter: {
    icon: null,
    svg: socialSvgs.twitter,
    fallback: '𝕏',
  },
  linkedin: {
    icon: null,
    svg: socialSvgs.linkedin,
    fallback: '💼',
  },
  instagram: {
    icon: null,
    svg: socialSvgs.instagram,
    fallback: '📸',
  },
  website: {
    icon: null,
    svg: socialSvgs.web,
    fallback: '🌐',
  },
  youtube: {
    icon: null,
    svg: socialSvgs.youtube,
    fallback: '▶️',
  },
  spotify: {
    icon: null,
    svg: socialSvgs.spotify,
    fallback: '🎧',
  },
  applepodcasts: {
    icon: null,
    svg: socialSvgs.podcasts,
    fallback: '🎙️',
  },
  rss: {
    icon: null,
    svg: socialSvgs.rss,
    fallback: '📡',
  },
}
