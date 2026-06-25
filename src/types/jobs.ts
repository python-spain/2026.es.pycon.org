import type { TLocale } from './locale'

export type { TLocale }

export type TJobTier = 'platinum' | 'gold' | 'silver' | 'bronze'

export interface IJob {
  title: string
  company: string
  type: string
  skills?: string[]
  salary?: string
  apply_url: string
  tier?: TJobTier
  draft?: boolean
  location: Record<TLocale, string>
  description: Record<TLocale, string>
}
