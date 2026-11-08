#!/usr/bin/env node
/**
 * Generates public/programa-pycones-2026.pdf from the Pretalx schedule.
 *
 * Usage:
 *   node scripts/generate-programa-pdf.mjs [--out <path>] [--dry-run] [--html <path>]
 *
 * The output mirrors the design of the previous artefact: one A4 landscape
 * page per conference day, one column per room, cards with the track colour
 * and full width bars for the accreditation window and the breaks.
 *
 * The vertical axis is proportional to real time, so card heights reflect
 * session durations. Each page is scaled down (fonts, spacing and timeline
 * together) when the day is too dense to fit on a single page, which is what
 * the original generator did for the busiest day.
 */

import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile, mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import { fetchSchedule, normaliseSchedule, SCHEDULE_URL } from './programa-pdf/schedule.mjs'
import { buildHtmlDocument, buildTrackColors, renderPage, STYLES } from './programa-pdf/template.mjs'
import { evaluateInPage, findChrome } from './programa-pdf/chrome.mjs'

const execFileAsync = promisify(execFile)

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const DEFAULT_OUT = join(REPO_ROOT, 'public', 'programa-pycones-2026.pdf')

/**
 * Pixels per minute of the conference day at scale 1. Combined with the
 * available height this defines how dense the programme looks.
 */
const PX_PER_MINUTE = 1.32
/** Space reserved at the top of every column for the room name. */
const ROOM_HEAD_HEIGHT = 22
/** Lower bound for the scale: below this the text stops being legible. */
const MIN_SCALE = 0.68
/**
 * Minimum height of a card, in pixels, before the typography is scaled
 * down. It has to hold the time chip, the title, the speakers and the
 * footer.
 */
const MIN_CARD_HEIGHT = 62

/**
 * How many times the generator re-renders the document to shrink the
 * typography of the days whose cards do not fit their content.
 */
const MAX_FIT_ATTEMPTS = 8

/**
 * Lower bound for the density of the timeline, in pixels per minute. Below
 * this the cards of the shortest sessions would be unreadable.
 */
const MIN_DENSITY = 0.55

function parseArgs(argv) {
  const args = { out: DEFAULT_OUT, dryRun: false, html: null }
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out') args.out = resolve(argv[++i])
    else if (argv[i] === '--html') args.html = resolve(argv[++i])
    else if (argv[i] === '--dry-run') args.dryRun = true
  }
  return args
}

function formatGeneratedDate(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${date.getFullYear()}`
}

const toMin = (t) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

/** Returns the first and last time of a day, in minutes since midnight. */
function daySpan(day) {
  const times = []
  for (const s of day.sessions) times.push(toMin(s.start), toMin(s.end))
  for (const b of day.breaks) times.push(toMin(b.start), toMin(b.end))
  return { min: Math.min(...times), max: Math.max(...times) }
}

/**
 * Builds the geometry of a page for a given scale.
 *
 * `pxPerMinute` maps a minute of the conference day to pixels; the scale
 * only affects the typography, so a dense day gets smaller fonts but keeps
 * the same proportions.
 */
function buildGeometry(day, scale, pxPerMinute) {
  const { min, max } = daySpan(day)
  return {
    min,
    max,
    height: (max - min) * pxPerMinute,
    roomHeadHeight: ROOM_HEAD_HEIGHT * scale,
    // The minimum height of a card is absolute: it is about the content
    // fitting, not about the density of the day.
    minCardHeight: MIN_CARD_HEIGHT,
    pxPerMinute,
    yOf: (t) => (toMin(t) - min) * pxPerMinute,
  }
}

/**
 * Renders the pages for the given per-day scales.
 */
function renderPages(schedule, trackColors, generatedOn, scales, pxPerMinutes, contentHeights) {
  return schedule.days.map((day, i) => {
    const scale = scales[i]
    const geo = buildGeometry(day, scale, pxPerMinutes[i])
    return renderPage(day, geo, {
      version: schedule.version,
      generatedOn,
      trackColors,
      scale,
      contentHeights: contentHeights?.[i],
    })
  })
}

/**
 * Measures, in the real browser, the height available for the timeline of
 * each page and the room header offset.
 */
const MEASURE_SCRIPT = `(() => {
  const pages = [...document.querySelectorAll('.page')]
  return pages.map((page) => {
    const grid = page.querySelector('.grid')
    const roomBody = page.querySelector('.room-body')
    const head = page.querySelector('.room-head')
    // The bottom of the lowest card of the page: the timeline has to be
    // tall enough for it.
    let contentBottom = 0
    for (const card of page.querySelectorAll('.card')) {
      const bottom = card.getBoundingClientRect().bottom - roomBody.getBoundingClientRect().top
      if (bottom > contentBottom) contentBottom = bottom
    }
    return {
      gridHeight: grid ? grid.getBoundingClientRect().height : 0,
      roomBodyHeight: roomBody ? roomBody.getBoundingClientRect().height : 0,
      roomHeadHeight: head ? head.getBoundingClientRect().height : 0,
      contentBottom,
    }
  })
})()`

/**
 * Measures the natural height of the content of every card, so the layout
 * can give each card the room its title, speakers and footer need.
 */
const CARD_HEIGHTS_SCRIPT = `(() => {
  const pages = [...document.querySelectorAll('.page')]
  const out = []
  for (const page of pages) {
    const heights = []
    for (const card of page.querySelectorAll('.card')) {
      const content = card.querySelector('.content')
      const foot = card.querySelector('.foot')
      if (!content) continue
      // The natural height of the title and the speakers: the clone is not
      // clipped, so it is as tall as the text needs.
      const probe = content.cloneNode(true)
      probe.style.position = 'absolute'
      probe.style.visibility = 'hidden'
      probe.style.height = 'auto'
      probe.style.maxHeight = 'none'
      probe.style.overflow = 'visible'
      probe.style.flex = 'none'
      content.parentElement.appendChild(probe)
      const natural = probe.getBoundingClientRect().height
      probe.remove()
      heights.push(natural + (foot ? foot.getBoundingClientRect().height : 0) + 12)
    }
    out.push(heights)
  }
  return out
})()`

async function main() {
  const args = parseArgs(process.argv.slice(2))

  console.log(`[programa-pdf] Fetching ${SCHEDULE_URL}`)
  const payload = await fetchSchedule()
  const schedule = normaliseSchedule(payload)
  const trackColors = buildTrackColors(payload)

  const total = schedule.days.reduce((n, d) => n + d.sessions.length, 0)
  console.log(
    `[programa-pdf] Pretalx schedule version ${schedule.version} · ${schedule.days.length} day(s) · ${total} session(s)`,
  )

  const generatedOn = formatGeneratedDate()

  const workDir = await mkdtemp(join(tmpdir(), 'programa-pdf-'))
  const htmlPath = join(workDir, 'programa.html')
  const pdfPath = join(workDir, 'programa.pdf')

  try {
    // The generator renders, measures and adjusts in a loop:
    //
    //  1. The timeline of a day is proportional to real time.
    //  2. The slot of a card is always big enough for the title, the
    //     speakers and the footer of that card.
    //  3. The whole day has to fit in the sheet: when it does not, the
    //     typography is reduced, so the content needs less room and the
    //     timeline can be compressed to fit.
    const scales = schedule.days.map(() => 1)
    const pxPerMinutes = schedule.days.map(() => PX_PER_MINUTE)
    // The measured height of the content of each card, per day.
    const contentHeights = schedule.days.map(() => new Map())

    for (let attempt = 0; attempt < MAX_FIT_ATTEMPTS; attempt++) {
      const pages = renderPages(schedule, trackColors, generatedOn, scales, pxPerMinutes, contentHeights)
      await writeFile(htmlPath, buildHtmlDocument(pages, STYLES), 'utf8')

      const measurements = await evaluateInPage(htmlPath, MEASURE_SCRIPT)
      const heights = await evaluateInPage(htmlPath, CARD_HEIGHTS_SCRIPT)
      if (!Array.isArray(measurements) || !Array.isArray(heights)) {
        throw new Error('Could not measure the rendered pages')
      }

      let changed = false

      for (let i = 0; i < schedule.days.length; i++) {
        const day = schedule.days[i]
        const available = measurements[i].roomBodyHeight

        // 1. Measure the height the content of every card needs.
        const map = new Map()
        let k = 0
        for (const room of day.rooms) {
          for (const session of day.sessions.filter((s) => s.room === room)) {
            const h = heights[i]?.[k]
            k++
            if (h == null) continue
            const previous = map.get(session.code)
            if (previous == null || Math.abs(previous - h) > 0.5) {
              map.set(session.code, h)
              changed = true
            }
          }
        }
        contentHeights[i] = map

        // 2. The density has to be high enough for the shortest slot of the
        //    day to hold the content of its card.
        let required = 0
        for (const session of day.sessions) {
          const needed = map.get(session.code) ?? 0
          const slot = toMin(session.end) - toMin(session.start)
          if (slot > 0 && needed / slot > required) required = needed / slot
        }

        // 3. The whole day has to fit in the sheet. When the density that
        //    the content needs is too high, the typography is reduced
        //    instead, so the content needs less room.
        const { min, max } = daySpan(day)
        const span = max - min
        const maxDensity = available / span

        if (required > maxDensity) {
          const factor = maxDensity / required
          const next = Math.max(MIN_SCALE, scales[i] * factor)
          if (next < scales[i] - 0.004) {
            scales[i] = next
            changed = true
            continue
          }
          // The typography is at its floor: use the density that fits.
          if (maxDensity > pxPerMinutes[i] + 0.005) {
            pxPerMinutes[i] = maxDensity
            changed = true
          }
          continue
        }

        if (required > pxPerMinutes[i] + 0.005) {
          pxPerMinutes[i] = required
          changed = true
        }
      }

      if (!changed) break
    }

    for (let i = 0; i < schedule.days.length; i++) {
      const day = schedule.days[i]
      console.log(
        `[programa-pdf]   ${day.date} · ${day.rooms.length} room(s) · ${day.sessions.length} session(s) · ${pxPerMinutes[i].toFixed(2)}px per min · scale ${scales[i].toFixed(3)}`,
      )
    }

    // Final render with the resulting geometry.
    const pages = renderPages(schedule, trackColors, generatedOn, scales, pxPerMinutes, contentHeights)
    const html = buildHtmlDocument(pages, STYLES)
    await writeFile(htmlPath, html, 'utf8')

    if (args.html) {
      await writeFile(args.html, html, 'utf8')
      console.log(`[programa-pdf] HTML written to ${args.html}`)
    }

    if (args.dryRun) {
      console.log('[programa-pdf] Dry run, no PDF generated')
      return
    }

    const chrome = findChrome()
    console.log(`[programa-pdf] Rendering with ${chrome}`)

    await execFileAsync(
      chrome,
      [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--no-pdf-header-footer',
        '--run-all-compositor-stages-before-draw',
        '--virtual-time-budget=15000',
        `--print-to-pdf=${pdfPath}`,
        `file://${htmlPath}`,
      ],
      { maxBuffer: 1024 * 1024 * 32 },
    )

    if (!existsSync(pdfPath)) {
      throw new Error('Chrome did not produce a PDF')
    }

    await mkdir(dirname(args.out), { recursive: true })
    await writeFile(args.out, await readFile(pdfPath))

    const { size } = await stat(args.out)
    console.log(`[programa-pdf] Wrote ${args.out} (${size} bytes)`)
  } finally {
    await rm(workDir, { recursive: true, force: true })
  }
}

main().catch((err) => {
  console.error('[programa-pdf] ERROR:', err.message)
  process.exit(1)
})
