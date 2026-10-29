import type { IconMappingWithFallback } from '@/lib/icons/types'
import { Mail } from '@lucide/astro'

/**
 * Contact icon mappings
 * Maps semantic names to Lucide icons with emoji fallbacks
 */
export const contactMapping: Record<string, IconMappingWithFallback> = {
  mail: {
    icon: Mail,
    fallback: '✉️',
  },
}
