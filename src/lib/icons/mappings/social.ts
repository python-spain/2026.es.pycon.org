// @ts-nocheck
import type { IconMappingWithFallback } from '@/lib/icons/types'
import {
  Bird, // Bluesky (closest match for blue bird)
  Github, // GitHub (deprecated but functional)
  MessageCircle, // Mastodon (generic social/messaging)
  Twitter, // X/Twitter (deprecated but functional)
  Linkedin, // LinkedIn (deprecated but functional)
  Instagram, // Instagram (deprecated but functional)
  Youtube,
  Headphones, // Spotify (no native Lucide icon for Spotify brand)
  Podcast, // Apple Podcasts (no native Lucide icon for Apple Podcasts brand)
  Rss,
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
  youtube: {
    icon: Youtube,
    fallback: '▶️',
  },
  spotify: {
    icon: Headphones, // No native Spotify icon in Lucide
    fallback: '🎧',
  },
  applepodcasts: {
    icon: Podcast, // No native Apple Podcasts icon in Lucide
    fallback: '🎙️',
  },
  rss: {
    icon: Rss,
    fallback: '📡',
  },
}
