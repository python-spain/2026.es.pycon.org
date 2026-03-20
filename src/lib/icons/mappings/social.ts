import type { IconMappingWithFallback } from '@/lib/icons/types'
import {
  Bird, // Bluesky (closest match for blue bird)
  Github, // GitHub
  MessageCircle, // Mastodon (generic social/messaging)
  Twitter, // X/Twitter
  Linkedin, // LinkedIn
  Instagram, // Instagram
} from '@lucide/astro'

/**
 * Social media icon mappings
 * Maps semantic names to Lucide Astro components with emoji fallbacks
 */
export const socialMapping: Record<string, IconMappingWithFallback> = {
  bluesky: {
    icon: Bird,
    fallback: '🦋', // Original emoji from i18n files
  },
  github: {
    icon: Github,
    fallback: '🐙',
  },
  mastodon: {
    icon: MessageCircle,
    fallback: '🐘',
  },
  twitter: {
    icon: Twitter,
    fallback: '𝕏',
  },
  linkedin: {
    icon: Linkedin,
    fallback: '💼',
  },
  instagram: {
    icon: Instagram,
    fallback: '📸',
  },
}
