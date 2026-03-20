/**
 * Development utilities for the icon system
 * Provides logging and debugging tools for missing icon mappings
 */

/**
 * Log missing icon mappings with context
 */
export function logMissingIcon(iconName: string, context?: string): void {
  const contextMsg = context ? ` in ${context}` : ''
  console.warn(
    `[Icon System] Missing icon mapping for "${iconName}"${contextMsg}. Consider adding it to the appropriate mapping file.`,
  )
}

/**
 * Log icon usage statistics (for optimization)
 */
export function logIconUsage(iconName: string): void {
  if (typeof globalThis !== 'undefined' && !(globalThis as any).__ICON_USAGE__) {
    ;(globalThis as any).__ICON_USAGE__ = new Map()
  }

  const usage = (globalThis as any).__ICON_USAGE__
  if (usage) {
    const count = usage.get(iconName) || 0
    usage.set(iconName, count + 1)
  }
}

/**
 * Get icon usage statistics (for development debugging)
 */
export function getIconUsageStats(): Record<string, number> {
  if (typeof globalThis === 'undefined' || !(globalThis as any).__ICON_USAGE__) {
    return {}
  }

  const usage = (globalThis as any).__ICON_USAGE__
  const stats: Record<string, number> = {}

  for (const [iconName, count] of usage.entries()) {
    stats[iconName] = count
  }

  return stats
}

/**
 * Validate icon name format (semantic naming conventions)
 */
export function validateIconName(iconName: string): { valid: boolean; issues: string[] } {
  const issues: string[] = []

  if (!iconName || typeof iconName !== 'string') {
    issues.push('Icon name must be a non-empty string')
    return { valid: false, issues }
  }

  if (iconName.includes(' ')) {
    issues.push('Icon name should not contain spaces (use kebab-case)')
  }

  if (iconName !== iconName.toLowerCase()) {
    issues.push('Icon name should be lowercase')
  }

  if (!/^[a-z][a-z0-9-]*$/.test(iconName)) {
    issues.push('Icon name should use kebab-case with letters, numbers, and hyphens only')
  }

  return { valid: issues.length === 0, issues }
}
