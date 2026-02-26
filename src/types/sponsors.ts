export type TSponsorTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'main'

export interface ISponsor {
  name: string
  website: string
  tier: TSponsorTier
  logo: string
}
