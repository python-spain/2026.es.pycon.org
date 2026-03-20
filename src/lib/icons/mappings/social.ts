/**
 * Social media icon mappings
 *
 * NOTE: Some Lucide icons (Github, Twitter, Linkedin, Instagram) are marked as deprecated
 * but are still functional and visually appropriate for social media use. These warnings
 * can be safely ignored until Lucide provides stable replacement icons.
 *
 * Maps semantic names to Lucide Astro components with emoji fallbacks
 */

import type { IconMappingWithFallback } from '@/lib/icons/types'
import {
  Bird, // Bluesky (closest match for blue bird)
  MessageCircle, // Mastodon (generic social/messaging)
} from '@lucide/astro'

// Import deprecated social media icons - warnings are expected and safe to ignore
import {
  Github as GitHubIcon, // ⚠️ Deprecated but functional
  Twitter as TwitterIcon, // ⚠️ Deprecated but functional
  Linkedin as LinkedInIcon, // ⚠️ Deprecated but functional
  Instagram as InstagramIcon, // ⚠️ Deprecated but functional
} from '@lucide/astro'

/**
 * Social media icon mappings
 * Maps semantic names to Lucide Astro components with emoji fallbacks
 */
export const socialMapping: Record<string, IconMappingWithFallback> = {
  bluesky: {
    icon: Bird,
    fallback: '🦋',
  },
  github: {
    icon: GitHubIcon, // Using deprecated but functional Github icon
    fallback: '🐙',
  },
  mastodon: {
    icon: MessageCircle,
    fallback: '🐘',
  },
  twitter: {
    icon: TwitterIcon, // Using deprecated but functional Twitter icon
    fallback: '𝕏',
  },
  linkedin: {
    icon: LinkedInIcon, // Using deprecated but functional Linkedin icon
    fallback: '💼',
  },
  instagram: {
    icon: InstagramIcon, // Using deprecated but functional Instagram icon
    fallback: '📸',
  },
}
