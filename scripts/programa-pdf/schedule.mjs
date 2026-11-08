/**
 * Normalises the Pretalx schedule export into the flat, day-by-day structure
 * used by the PDF generator.
 *
 * Source endpoint: https://pretalx.com/pycones-2026/schedule/export/schedule.json
 * This is the same endpoint the website uses (see src/lib/schedule.ts) because
 * the public REST API (/api/events/<slug>/) is not available for this event.
 */

export const PRETALX_EVENT = 'pycones-2026'
export const SCHEDULE_URL = `https://pretalx.com/${PRETALX_EVENT}/schedule/export/schedule.json`

/** Fallback for the event timezone if Pretalx stops reporting it. */
export const FALLBACK_TIMEZONE = 'Europe/Madrid'

/**
 * Start of the accreditation window per weekday. Pretalx does not publish
 * accreditation as a session, so the original PDF generator hardcoded these.
 * Keyed by ISO date (YYYY-MM-DD).
 */
export const ACCREDITATION_START = {
  '2026-11-06': '14:00',
  '2026-11-07': '08:30',
  '2026-11-08': '09:30',
}

/** Default accreditation window when the date is unknown: 60 minutes. */
const DEFAULT_ACCREDITATION_MINUTES = 60

/**
 * Minimum duration of a gap for it to be shown as a break. Shorter gaps are
 * just the transition between two slots of the timetable.
 */
const MIN_BREAK_MINUTES = 20

/**
 * Session types that run alongside the regular programme for a long time
 * (the Hackathon). They are ignored when looking for the free slots of the
 * timetable, so the breaks still show up.
 */
const LONG_RUNNING_TYPES = new Set(['Hackathon'])

/**
 * Weekday names, indexed by `Date#getUTCDay()` (0 = Sunday).
 */
const WEEKDAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const MONTHS_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

/** Formats an ISO date as "Viernes 6 de noviembre de 2026". */
export function formatDayLabel(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  const weekday = WEEKDAYS_ES[date.getUTCDay()]
  const month = MONTHS_ES[m - 1]
  return `${weekday} ${d} de ${month} de ${y}`
}

/** Converts "HH:MM" to minutes since midnight. */
export function toMinutes(time) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/** Converts minutes since midnight back to "HH:MM". */
export function fromMinutes(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function pickRoomOrder(conference, days) {
  // Prefer the canonical room order declared by the conference, then append
  // any room that only shows up in the day payloads.
  const declared = (conference.rooms ?? []).map((r) => r.name)
  const seen = new Set()
  const ordered = []
  for (const name of declared) {
    if (!seen.has(name)) {
      seen.add(name)
      ordered.push(name)
    }
  }
  for (const day of days) {
    for (const name of Object.keys(day.rooms ?? {})) {
      if (!seen.has(name)) {
        seen.add(name)
        ordered.push(name)
      }
    }
  }
  return ordered
}

/**
 * Infers the full-width bars (accreditation window, coffee breaks, lunch
 * break) that live between sessions. Pretalx does not publish them as
 * sessions, but they belong on the printed programme.
 */
function inferBreaks(date, sessions) {
  const breaks = []
  if (sessions.length === 0) return breaks

  const sorted = [...sessions].sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
  const firstStart = toMinutes(sorted[0].start)

  // Accreditation window: from the (known or default) accreditation start up
  // to the first session of the day.
  const accreditationStart = ACCREDITATION_START[date]
  const credFrom = accreditationStart
    ? toMinutes(accreditationStart)
    : firstStart - DEFAULT_ACCREDITATION_MINUTES
  if (credFrom < firstStart) {
    breaks.push({
      label: 'Acreditaciones',
      start: fromMinutes(credFrom),
      end: fromMinutes(firstStart),
      fullWidth: true,
    })
  }

  // Gaps between consecutive sessions.
  //
  // Long running side events (the Hackathon) span the whole day and would
  // otherwise swallow every break, so they are ignored when looking for the
  // free slots of the regular programme.
  const boundaries = new Set()
  for (const s of sorted) {
    boundaries.add(toMinutes(s.start))
    boundaries.add(toMinutes(s.end))
  }
  const points = [...boundaries].sort((a, b) => a - b)

  for (let i = 0; i < points.length - 1; i++) {
    const gapStart = points[i]
    const gapEnd = points[i + 1]
    const gap = gapEnd - gapStart
    // Short gaps are just the transition between two slots of the
    // timetable, not a break.
    if (gap < MIN_BREAK_MINUTES) continue

    // A regular session overlaps this gap -> it is not a free slot.
    const overlapping = sorted.some(
      (s) => !LONG_RUNNING_TYPES.has(s.type) && toMinutes(s.start) < gapEnd && toMinutes(s.end) > gapStart,
    )
    if (overlapping) continue

    breaks.push({
      label: breakLabel(gapStart, gapEnd, gap),
      start: fromMinutes(gapStart),
      end: fromMinutes(gapEnd),
      fullWidth: true,
    })
  }

  return breaks
}

/**
 * Labels a gap between two sessions. Long gaps around midday are lunch, short
 * ones are coffee breaks.
 */
function breakLabel(startMin, endMin, gap) {
  // Lunch: long gap that starts around midday.
  if (gap >= 60 && startMin >= 11 * 60 + 30 && startMin <= 14 * 60) {
    return 'Pausa para la comida'
  }
  if (gap >= 45 && startMin >= 11 * 60 + 30 && startMin <= 14 * 60) {
    return 'Pausa para la comida'
  }
  if (gap <= 45) return 'Pausa para el café'
  // Long gaps outside of lunch hours are generic breaks.
  return 'Pausa'
}

/**
 * Normalises the raw Pretalx export payload.
 */
export function normaliseSchedule(payload) {
  const schedule = payload?.schedule
  if (!schedule?.conference) {
    throw new Error('Unexpected Pretalx payload: missing schedule.conference')
  }

  const conference = schedule.conference
  const roomOrder = pickRoomOrder(conference, schedule.conference.days ?? [])
  const timezone = conference.time_zone_name || FALLBACK_TIMEZONE

  const days = (conference.days ?? [])
    .map((day) => {
      const sessions = []
      for (const [room, roomSessions] of Object.entries(day.rooms ?? {})) {
        for (const raw of roomSessions) {
          sessions.push({
            code: raw.code ?? '',
            title: raw.title ?? '',
            start: (raw.date ?? '').slice(11, 16),
            end: (raw.end ?? '').slice(11, 16),
            duration: raw.duration ?? '',
            room,
            track: raw.track ?? null,
            type: raw.type ?? '',
            language: (raw.language ?? '').toLowerCase(),
            speakers: (raw.persons ?? []).map((p) => p.public_name ?? p.name ?? ''),
          })
        }
      }

      const date = day.date
      const sessionsWithTimes = sessions.filter((s) => s.start && s.end)
      const breaks = inferBreaks(date, sessionsWithTimes)

      // Only keep the rooms that actually host something that day, but keep
      // the canonical order.
      const usedRooms = roomOrder.filter((room) => sessionsWithTimes.some((s) => s.room === room))

      return {
        date,
        label: formatDayLabel(date),
        rooms: usedRooms,
        sessions: sessionsWithTimes.sort(
          (a, b) => toMinutes(a.start) - toMinutes(b.start) || a.room.localeCompare(b.room),
        ),
        breaks,
      }
    })
    .filter((day) => day.sessions.length > 0)

  return {
    version: schedule.version ?? '—',
    timezone,
    days,
  }
}

/** Downloads the Pretalx schedule export. */
export async function fetchSchedule(url = SCHEDULE_URL) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Pretalx returned ${res.status} for ${url}`)
  }
  return res.json()
}
