import type { PretalxScheduleResponse, Schedule, ScheduleDay, PretalxSession } from '@/types/schedule'

const PRETALX_EVENT = 'pycones-2026'
const SCHEDULE_URL = `https://pretalx.com/${PRETALX_EVENT}/schedule/export/schedule.json`
const FALLBACK_TIMEZONE = 'Europe/Madrid'

export class ScheduleNotAvailableError extends Error {
  constructor(public readonly cause: unknown) {
    super(`Schedule for ${PRETALX_EVENT} is not available`)
    this.name = 'ScheduleNotAvailableError'
  }
}

interface FetchOptions {
  /** When true, log warnings on stderr instead of throwing. Default: true. */
  silent?: boolean
}

/**
 * Fetches the schedule JSON from Pretalx and normalises it into a flat
 * day-by-day structure that's easy to render. Returns `null` if the schedule
 * is not available (e.g. event not yet published) so the caller can render
 * a fallback state instead of crashing the build.
 */
export async function getSchedule(opts: FetchOptions = {}): Promise<Schedule | null> {
  const { silent = true } = opts

  let data: PretalxScheduleResponse
  try {
    const res = await fetch(SCHEDULE_URL)
    if (!res.ok) {
      if (silent) console.warn(`[schedule] Pretalx returned ${res.status} for ${PRETALX_EVENT}`)
      return null
    }
    data = (await res.json()) as PretalxScheduleResponse
  } catch (err) {
    if (silent) console.warn(`[schedule] Fetch failed: ${(err as Error).message}`)
    return null
  }

  if (!data?.schedule?.conference) {
    if (silent) console.warn(`[schedule] Unexpected payload shape`)
    return null
  }

  const conf = data.schedule.conference

  // day.rooms is a dict { [roomName]: Session[] } — flatten into a single list per day
  const dayEntries = conf.days as unknown as Array<
    PretalxScheduleResponse['schedule']['conference']['days'][number] & {
      rooms?: Record<string, PretalxSession[]>
    }
  >

  const days: ScheduleDay[] = dayEntries
    .map((d) => {
      const sessions = d.rooms ? Object.values(d.rooms).flat() : []
      return {
        index: d.index,
        date: d.date,
        sessions: sessions.sort((a, b) => a.date.localeCompare(b.date)),
      }
    })
    .filter((d) => d.sessions.length > 0)

  return {
    conferenceTitle: conf.title,
    timezone: conf.time_zone_name || FALLBACK_TIMEZONE,
    days,
  }
}

/**
 * Formats an ISO 8601 datetime in the event's timezone as a human label
 * like "Viernes 6 de noviembre" / "Friday, November 6".
 */
export function formatDayLabel(date: string, locale: string, timezone: string): string {
  const lang = locale === 'ca' ? 'ca-ES' : locale === 'en' ? 'en-US' : 'es-ES'
  return new Intl.DateTimeFormat(lang, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: timezone,
  }).format(new Date(date))
}

/**
 * Formats the time portion of an ISO 8601 datetime in the event's timezone.
 * Returns "HH:MM" in 24h format.
 */
export function formatTime(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: timezone,
  }).format(new Date(iso))
}
