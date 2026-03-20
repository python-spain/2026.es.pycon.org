import type { IconMappingWithFallback } from '@/lib/icons/types'
import {
  AlertTriangle, // Warning (🛑/⚠️)
  CheckCircle, // Allowed (✅)
  XCircle, // Forbidden (🚫)
  Info, // Information (ℹ️)
  MapPin, // Location (📍)
  Calendar, // Calendar/Date (📅)
  MessageCircle, // Thinking/Why (🤔)
  Globe, // Scope/World (🌐)
  FileText, // Standards/Document (📋)
  Scale, // Enforcement/Justice (⚖️)
  Megaphone, // Reporting/Announcement (📢)
  Lock, // Privacy/Security (🔒)
  FileSignature, // Attribution/Document (📝)
  Sprout, // Junior level (🌱)
  Rocket, // Senior level (🚀)
  Brain, // Expert level (🧠)
  Construction, // Construction/Building (🏗️)
  Building, // City/Buildings (🏙️)
  OctagonX, // Stop/Halt (🛑)
  Briefcase, // Professional/Business (💼)
  Heart, // Love/Community (💜/❤️)
  Key, // Key/Leadership (🔑)
  Search, // Search/Find (🔍)
  Handshake, // Partnership/Collaboration (🤝)
  Hexagon, // Bronze tier (🟤) - different from Circle
  Circle, // Silver tier (⚪)
  Star, // Star/Gold (🌟)
  Trophy, // Trophy/Award (🏆)
  Castle, // Castle/Premium (🏰)
} from '@lucide/astro'

/**
 * Status icon mappings
 * Maps semantic names to Lucide icons with emoji fallbacks
 */
export const statusMapping: Record<string, IconMappingWithFallback> = {
  warning: {
    icon: AlertTriangle,
    fallback: '⚠️',
  },
  allowed: {
    icon: CheckCircle,
    fallback: '✅',
  },
  forbidden: {
    icon: XCircle,
    fallback: '🚫',
  },
  info: {
    icon: Info,
    fallback: 'ℹ️',
  },
  location: {
    icon: MapPin,
    fallback: '📍',
  },
  calendar: {
    icon: Calendar,
    fallback: '📅',
  },
  thinking: {
    icon: MessageCircle,
    fallback: '🤔',
  },
  scope: {
    icon: Globe,
    fallback: '🌐',
  },
  standards: {
    icon: FileText,
    fallback: '📋',
  },
  enforcement: {
    icon: Scale,
    fallback: '⚖️',
  },
  reporting: {
    icon: Megaphone,
    fallback: '📢',
  },
  privacy: {
    icon: Lock,
    fallback: '🔒',
  },
  attribution: {
    icon: FileSignature,
    fallback: '📝',
  },
  junior: {
    icon: Sprout,
    fallback: '🌱',
  },
  senior: {
    icon: Rocket,
    fallback: '🚀',
  },
  expert: {
    icon: Brain,
    fallback: '🧠',
  },
  construction: {
    icon: Construction,
    fallback: '🏗️',
  },
  city: {
    icon: Building,
    fallback: '🏙️',
  },
  stop: {
    icon: OctagonX,
    fallback: '🛑',
  },
  business: {
    icon: Briefcase,
    fallback: '💼',
  },
  love: {
    icon: Heart,
    fallback: '💜',
  },
  heart: {
    icon: Heart,
    fallback: '❤️',
  },
  leadership: {
    icon: Key,
    fallback: '🔑',
  },
  search: {
    icon: Search,
    fallback: '🔍',
  },
  partnership: {
    icon: Handshake,
    fallback: '🤝',
  },
  bronze: {
    icon: Hexagon,
    fallback: '🟤',
  },
  silver: {
    icon: Circle,
    fallback: '⚪',
  },
  gold: {
    icon: Star,
    fallback: '🌟',
  },
  platinum: {
    icon: Trophy,
    fallback: '🏆',
  },
  main: {
    icon: Castle,
    fallback: '🏰',
  },
}
