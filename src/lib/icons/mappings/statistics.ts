import type { IconMappingWithFallback } from '@/lib/icons/types'
import {
  Users, // Attendees (👥)
  Mic, // Speakers (🎤)
  Star, // Keynotes (🌟)
  Calendar, // Days (🗓)
  Building2, // Companies (🏢)
  Handshake, // Collaborators (🤝)
} from '@lucide/astro'

/**
 * Statistics icon mappings
 * Maps semantic names to Lucide icons with emoji fallbacks
 */
export const statisticsMapping: Record<string, IconMappingWithFallback> = {
  attendees: {
    icon: Users,
    fallback: '👥',
  },
  speakers: {
    icon: Mic,
    fallback: '🎤',
  },
  keynotes: {
    icon: Star,
    fallback: '🌟',
  },
  days: {
    icon: Calendar,
    fallback: '🗓',
  },
  companies: {
    icon: Building2,
    fallback: '🏢',
  },
  collaborators: {
    icon: Handshake,
    fallback: '🤝',
  },
}
