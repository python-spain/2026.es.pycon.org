import type { TLocale } from './locale'

export type TBecasFaqCategory = 'general' | 'entrada' | 'alojamiento' | 'transporte'

export interface IBecasFaq {
  id: string
  category: TBecasFaqCategory
  order: number
  question: Record<TLocale, string>
  answer: Record<TLocale, string>
}
