import type { IconMappingWithFallback } from '@/lib/icons/types'
import {
  Bot, // ML & IA (🤖)
  BarChart3, // Data Science (📊)
  Blocks, // Software Engineering (🏗️)
  Monitor, // Web Development (💻)
  Users, // Community (🤝) - reusing Users for community context
  Cloud, // DevOps & Cloud (☁️)
  Wrench, // Others/Tools (🔧)
} from '@lucide/astro'

/**
 * Technical category icon mappings
 * Maps semantic names to Lucide icons with emoji fallbacks
 */
export const technicalMapping: Record<string, IconMappingWithFallback> = {
  'ml-ai': {
    icon: Bot,
    fallback: '🤖',
  },
  'data-science': {
    icon: BarChart3,
    fallback: '📊',
  },
  'software-engineering': {
    icon: Blocks,
    fallback: '🏗️',
  },
  'web-development': {
    icon: Monitor,
    fallback: '💻',
  },
  community: {
    icon: Users,
    fallback: '🤝',
  },
  'devops-cloud': {
    icon: Cloud,
    fallback: '☁️',
  },
  others: {
    icon: Wrench,
    fallback: '🔧',
  },
}
