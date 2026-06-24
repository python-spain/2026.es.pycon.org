export type TSpeakerLinkType = 'github' | 'linkedin' | 'instagram' | 'website'

export interface ISpeakerLink {
  type: TSpeakerLinkType
  url: string
}

import type { TLocale } from './locale'

export interface ISpeaker {
  name: string
  order: number
  photo: string
  links: ISpeakerLink[]
  descriptions: Record<TLocale, string>
}
