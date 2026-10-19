export type TSponsorTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'main' | 'community'

export interface ISponsor {
  name: string
  website: string
  tier: TSponsorTier
  logobg?: string
  nobackground?: boolean
  nopadding?: boolean
  logo: string
}
