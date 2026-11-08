/**
 * HTML/CSS template for the programme PDF.
 *
 * The layout replicates the design of the original PDF (generated with
 * headless Chrome from Pretalx data). Measurements were extracted from the
 * previous artefact so the regenerated file keeps the same look:
 *
 *  - A4 landscape (297mm x 210mm), one page per conference day.
 *  - Header: event title on the left, version + generation date on the right.
 *  - A time gutter on the left and one column per room.
 *  - Each session is a card with a coloured left stripe (the track colour),
 *    a time chip, a language badge, the title, the speakers and the track name.
 *  - Full width bars mark the accreditation window and the breaks.
 *
 * The vertical axis is proportional to real time: one minute of the
 * conference day maps to a fixed number of pixels, so card heights reflect
 * session durations and every day shares a consistent scale.
 */

const TRACK_FALLBACK_COLOR = '#1d1d1b'

/**
 * Space a card needs on top of its content: the padding of the body and the
 * height of the footer with the language badge and the track name.
 */
const CARD_CHROME_HEIGHT = 26

/**
 * Gap left between a card and the next slot, in pixels, so consecutive
 * cards and the break bars do not touch.
 */
const CARD_GAP = 3

/** Converts "HH:MM" to minutes since midnight. */
function toMinutes(time) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Builds the track -> colour map from the Pretalx conference payload.
 * These are the exact colours Pretalx uses in its own schedule widget.
 */
export function buildTrackColors(payload) {
  const tracks = payload?.schedule?.conference?.tracks ?? []
  const map = new Map()
  for (const track of tracks) {
    if (track?.name) map.set(track.name, track.color || TRACK_FALLBACK_COLOR)
  }
  return map
}

/** Renders the language badge (ES / EN / …). */
function languageBadge(language) {
  const label = language ? language.toUpperCase() : '—'
  return `<span class="lang">${escapeHtml(label)}</span>`
}

/** Renders a session card. */
function sessionCard(session, trackColors) {
  const color = (session.track && trackColors.get(session.track)) || TRACK_FALLBACK_COLOR
  const speakers = session.speakers.filter(Boolean).join(', ')
  const trackLabel = session.track
    ? `<div class="track" style="color:${escapeHtml(color)}">${escapeHtml(session.track)}</div>`
    : ''

  return `<div class="card" style="top:${session.top.toFixed(2)}px;height:${session.height.toFixed(2)}px">
          <div class="stripe" style="background:${escapeHtml(color)}">
            <span class="time-start">${escapeHtml(session.start)}</span>
            <span class="time-end">${escapeHtml(session.end)}</span>
          </div>
          <div class="body">
            <div class="content">
              <div class="title">${escapeHtml(session.title)}</div>
              ${speakers ? `<div class="speakers">${escapeHtml(speakers)}</div>` : ''}
            </div>
            <div class="foot">
              ${languageBadge(session.language)}
              ${trackLabel}
            </div>
          </div>
        </div>`
}

export const STYLES = `
    @page { size: 297mm 210mm; margin: 0; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #1d1d1b;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 297mm;
      height: 210mm;
      padding: 6.4mm 7.8mm 7mm 7.8mm;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      --scale: 1;
    }
    .page:last-child { page-break-after: auto; }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex: 0 0 auto;
      margin-bottom: 2.2mm;
    }
    .page-title {
      font-size: calc(13pt * var(--scale));
      font-weight: 700;
      color: #1d1d1b;
      margin: 0;
      white-space: nowrap;
    }
    .meta {
      font-size: calc(6.49pt * var(--scale));
      color: #666666;
      white-space: nowrap;
    }

    .grid {
      position: relative;
      flex: 1 1 0;
      display: flex;
      gap: 4.7mm;
      padding-left: 8mm;
      min-height: 0;
    }
    .gutter {
      position: absolute;
      left: 0;
      top: 0;
      width: 8mm;
      height: 100%;
    }
    .gutter-label {
      position: absolute;
      left: 0;
      transform: translateY(-50%);
      font-size: calc(7pt * var(--scale));
      color: #555555;
      white-space: nowrap;
    }
    .columns {
      display: flex;
      gap: 4.7mm;
      flex: 1 1 auto;
      min-width: 0;
    }
    .column {
      flex: 1 1 0;
      min-width: 0;
      position: relative;
    }
    .room-head {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 3;
      text-align: center;
      font-size: calc(7.5pt * var(--scale));
      font-weight: 700;
      color: #1d1d1b;
      padding-bottom: 1mm;
      border-bottom: 0.8pt solid #1d1d1b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .room-body {
      position: absolute;
      top: var(--room-head-height);
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }
    .breaks {
      position: absolute;
      top: var(--room-head-height);
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      pointer-events: none;
    }

    .card {
      position: absolute;
      left: 0;
      right: 0;
      display: flex;
      align-items: stretch;
      border: 0.75pt solid #cfd3da;
      border-radius: 1.4mm;
      background: #ffffff;
      overflow: hidden;
    }
    .stripe {
      width: 9.4mm;
      flex: 0 0 9.4mm;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 0.7mm;
    }
    .time-start {
      font-size: calc(7.5pt * var(--scale));
      font-weight: 700;
      color: #ffffff;
      line-height: 1.15;
    }
    .time-end {
      font-size: calc(5.5pt * var(--scale));
      font-weight: 700;
      color: #ffffff;
      opacity: 0.62;
      line-height: 1.15;
    }
    .body {
      position: relative;
      flex: 1 1 auto;
      min-width: 0;
      padding: 0.7mm 1.1mm 1mm 1.2mm;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    /* Holds the title and the speakers; it takes the space that is left
       once the footer has been laid out, so nothing ever overlaps. The
       title is the part that gives way when the card is too short. */
    .content {
      flex: 0 1 auto;
      min-height: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .title {
      font-size: calc(6.8pt * var(--scale));
      font-weight: 700;
      color: #1d1d1b;
      line-height: 1.28;
      overflow: hidden;
      overflow-wrap: break-word;
      flex: 0 1 auto;
      min-height: 0;
    }
    .speakers {
      font-size: calc(6pt * var(--scale));
      font-weight: 400;
      color: #444444;
      line-height: 1.3;
      margin-top: 0.4mm;
      overflow: hidden;
      overflow-wrap: break-word;
      flex: 0 0 auto;
    }
    .foot {
      margin-top: auto;
      padding-top: 0.6mm;
      display: flex;
      align-items: flex-end;
      gap: 1.4mm;
      min-width: 0;
      flex: 0 0 auto;
    }
    .lang {
      flex: 0 0 auto;
      display: inline-block;
      background: #000000;
      color: #ffffff;
      font-size: calc(5.5pt * var(--scale));
      font-weight: 700;
      border-radius: 0.8mm;
      padding: 0.25mm 0.9mm;
      line-height: 1.15;
    }
    .track {
      font-size: calc(5.6pt * var(--scale));
      font-weight: 700;
      line-height: 1.22;
      overflow: hidden;
      overflow-wrap: break-word;
    }

    .break {
      position: absolute;
      left: 0;
      right: 0;
      background: #eef0f3;
      border: 0.75pt solid #d3d7de;
      border-radius: 1.2mm;
      text-align: center;
      font-size: calc(7pt * var(--scale));
      font-weight: 700;
      color: #1d1d1b;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
`

/**
 * Computes the vertical geometry of a page: the timeline is proportional to
 * real time, so a session card's height reflects its duration.
 *
 * `roomHeadHeight` is the space reserved at the top of every column for the
 * room name; the timeline starts right below it.
 */
/**
 * Computes the vertical geometry of a page.
 *
 * The vertical axis is proportional to real time, so a session card's height
 * reflects its duration. Cards also have a minimum height, so the time chip,
 * the title and the speakers always fit.
 */
export function buildGeometry(day, pxPerMinute, roomHeadHeight = 22, minCardHeight = 40) {
  const toMin = (t) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }
  const times = []
  for (const s of day.sessions) times.push(toMin(s.start), toMin(s.end))
  for (const b of day.breaks) times.push(toMin(b.start), toMin(b.end))
  const min = Math.min(...times)
  const max = Math.max(...times)
  return {
    min,
    max,
    height: (max - min) * pxPerMinute,
    roomHeadHeight,
    minCardHeight,
    pxPerMinute,
    yOf: (t) => (toMin(t) - min) * pxPerMinute,
  }
}

/**
 * Lays out the cards of a room.
 *
 * The height of a card is the height of its slot on the timeline, which the
 * generator guarantees is big enough for the title, the speakers and the
 * footer of the card. A small gap is left between the card and the slot, so
 * consecutive cards do not touch.
 */
export function layoutRoom(sessions, geo, contentHeights = new Map()) {
  const sorted = [...sessions].sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
  return sorted.map((session) => {
    const start = geo.yOf(session.start)
    const end = geo.yOf(session.end)
    const slot = end - start
    const height = Math.max(Math.min(slot, geo.minCardHeight), slot - CARD_GAP)
    return { ...session, top: start, height }
  })
}
/**
 * Renders one page of the programme.
 */
export function renderPage(day, geo, opts) {
  const { version, generatedOn, trackColors, scale = 1, contentHeights } = opts

  const header = `<div class="header">
      <div class="page-title">PyConES 2026 · ${escapeHtml(day.label)}</div>
      <div class="meta">Versión ${escapeHtml(version)} · generado el ${escapeHtml(
        generatedOn,
      )} · Programa siempre actualizado en 2026.es.pycon.org</div>
    </div>`

  // Time gutter: one label per session start time, plus the break boundaries.
  const gutterTimes = new Set()
  for (const s of day.sessions) gutterTimes.add(s.start)
  for (const b of day.breaks) gutterTimes.add(b.start)
  const gutter = [...gutterTimes]
    .sort((a, b) => (a < b ? -1 : 1))
    .map((t) => `<div class="gutter-label" style="top:${geo.yOf(t).toFixed(2)}px">${escapeHtml(t)}</div>`)
    .join('\n        ')

  // Full width bars.
  const bars = day.breaks
    .map((b) => {
      const top = geo.yOf(b.start)
      const height = Math.max(geo.yOf(b.end) - geo.yOf(b.start), 10)
      return `<div class="break" style="top:${top.toFixed(2)}px;height:${height.toFixed(
        2,
      )}px"><span>${escapeHtml(b.label)} · ${escapeHtml(b.start)}–${escapeHtml(b.end)}</span></div>`
    })
    .join('\n        ')

  // One column per room; each card is absolutely positioned on the timeline.
  const columns = day.rooms
    .map((room) => {
      const cards = layoutRoom(
        day.sessions.filter((s) => s.room === room),
        geo,
        contentHeights,
      )
        .map((s) => sessionCard(s, trackColors))
        .join('\n')

      return `<div class="column">
          <div class="room-head">${escapeHtml(room)}</div>
          <div class="room-body">
${cards}
          </div>
        </div>`
    })
    .join('\n')

  return `<div class="page" style="--scale:${scale};--timeline-height:${geo.height.toFixed(
    2,
  )}px;--room-head-height:${geo.roomHeadHeight.toFixed(2)}px">
    ${header}
    <div class="grid">
      <div class="gutter">
        ${gutter}
      </div>
      <div class="columns">
${columns}
      </div>
      <div class="breaks">
        ${bars}
      </div>
    </div>
  </div>`
}

/** Wraps the rendered pages into a printable HTML document. */
export function buildHtmlDocument(pages, styles) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Programa PyConES 2026</title>
<style>${styles}</style>
</head>
<body>
${pages.join('\n')}
</body>
</html>`
}
