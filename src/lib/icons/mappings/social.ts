// @ts-nocheck
import type { IconMappingWithFallback } from '@/lib/icons/types'
import {
  Bird, // Bluesky (closest match for blue bird)
  Github, // GitHub (deprecated but functional)
  MessageCircle, // Mastodon (generic social/messaging)
  Twitter, // X/Twitter (deprecated but functional)
  Linkedin, // LinkedIn (deprecated but functional)
  Instagram, // Instagram (deprecated but functional)
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
    icon: Github, // deprecated but functional
    fallback: '🐙',
  },
  mastodon: {
    icon: MessageCircle,
    fallback: '🐘',
  },
  twitter: {
    icon: Twitter, // deprecated but functional
    fallback: '𝕏',
  },
  linkedin: {
    icon: Linkedin, // deprecated but functional
    fallback: '💼',
  },
  instagram: {
    icon: Instagram, // deprecated but functional
    fallback: '📸',
  },
}
