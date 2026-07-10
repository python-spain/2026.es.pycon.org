// Shape of the legacy Pretalx schedule export
// (https://pretalx.com/<event>/schedule/export/schedule.json)
// We declare the fields we actually use; Pretalx returns more but we ignore the rest.

export interface PretalxPerson {
  code: string
  name: string
  public_name?: string
  biography?: string
  avatar?: string | null
}

export interface PretalxSession {
  code: string
  id: number
  date: string // ISO 8601 with timezone, e.g. "2026-11-06T16:00:00+01:00"
  start: string // "HH:MM" (no date, no TZ)
  end: string // ISO 8601 with timezone
  duration: string // "HH:MM"
  room: string
  track: string | null
  type: string
  language: 'en' | 'es' | 'ca' | string
  title: string
  subtitle?: string
  abstract?: string
  description?: string | null
  persons: PretalxPerson[]
  url?: string
  do_not_record?: boolean
}

export interface PretalxRoom {
  name: string
  guid?: string
  description?: string | null
  capacity?: number | null
}

export interface PretalxTrack {
  name: string
  color?: string
}

export interface PretalxDay {
  index: number
  date: string // "YYYY-MM-DD"
  day_start: string
  day_end: string
  // Note: day.rooms is a dict { [roomName]: PretalxSession[] } in the API response
}

export interface PretalxConference {
  acronym: string
  title: string
  start: string
  end: string
  daysCount: number
  time_zone_name: string
  rooms: PretalxRoom[]
  tracks: PretalxTrack[]
  days: PretalxDay[]
}

export interface PretalxScheduleResponse {
  schedule: {
    conference: PretalxConference
    version: string
  }
}

export interface ScheduleDay {
  index: number
  date: string
  sessions: PretalxSession[]
}

export interface Schedule {
  conferenceTitle: string
  timezone: string
  days: ScheduleDay[]
}
