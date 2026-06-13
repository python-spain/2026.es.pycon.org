export type TSpeakerLinkType = 'github' | 'linkedin' | 'instagram' | 'website'

export interface ISpeakerLink {
  type: TSpeakerLinkType
  url: string
}

export interface ISpeaker {
  name: string
  order: number
  photo: string
  links: ISpeakerLink[]
  description: string
}
