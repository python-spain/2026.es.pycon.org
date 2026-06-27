export type TSpeakerLinkType =
  | 'github'
  | 'linkedin'
  | 'instagram'
  | 'website'
  | 'bluesky'
  | 'twitter'
  | 'youtube'
  | 'spotify'
  | 'applepodcasts'
  | 'rss'

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
