import type { IconMappingWithFallback } from '@/lib/icons/types'
import { socialMapping } from './social'
import { statisticsMapping } from './statistics'
import { technicalMapping } from './technical'
import { statusMapping } from './status'

// Combine all category mappings
const allMappings = {
  ...socialMapping,
  ...statisticsMapping,
  ...technicalMapping,
  ...statusMapping,
}

/**
 * Get icon mapping for a given semantic name
 * Returns the Lucide icon component and optional fallback emoji
 */
export function getIconMapping(name: string): IconMappingWithFallback {
  const mapping = allMappings[name]

  if (mapping) {
    return mapping
  }

  // Log missing mappings in development mode (fallback check)
  try {
    if (typeof window === 'undefined' || (globalThis as any).__DEV__ !== false) {
      console.warn(`[Icon] No mapping found for "${name}". Add it to the appropriate mapping file.`)
    }
  } catch {
    // Silent fallback if environment detection fails
  }

  return {
    icon: null,
    fallback: undefined,
  }
}

/**
 * Get all available icon names for type checking and validation
 */
export function getAvailableIconNames(): string[] {
  return Object.keys(allMappings)
}

/**
 * Check if an icon name is valid
 */
export function isValidIconName(name: string): boolean {
  return name in allMappings
}
