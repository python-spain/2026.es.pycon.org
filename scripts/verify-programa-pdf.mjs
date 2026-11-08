#!/usr/bin/env node
/**
 * Verifies the generated programme PDF against the Pretalx schedule.
 *
 * Usage:
 *   node scripts/verify-programa-pdf.mjs [--pdf <path>]
 *
 * It checks that every session of the schedule appears in the PDF, that the
 * break bars are present, that the track colours match the ones Pretalx
 * publishes and that the page geometry is the expected A4 landscape.
 *
 * Requires `pymupdf` (`pip install pymupdf`).
 */

import { execFile } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import { fetchSchedule, normaliseSchedule } from './programa-pdf/schedule.mjs'

const execFileAsync = promisify(execFile)

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const DEFAULT_PDF = join(REPO_ROOT, 'public', 'programa-pycones-2026.pdf')

const A4_LANDSCAPE = { width: 841.92, height: 594.96 }

function parseArgs(argv) {
  const args = { pdf: DEFAULT_PDF }
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--pdf') args.pdf = resolve(argv[++i])
  }
  return args
}

/**
 * Extracts the text of every page with pymupdf.
 *
 * `PYTHON` can be used to point at a specific interpreter, for example a
 * virtualenv that has `pymupdf` installed.
 */
async function extractPages(pdfPath) {
  const script = `
import sys, json
import pymupdf
doc = pymupdf.open(sys.argv[1])
out = []
for page in doc:
    out.append({
        "text": page.get_text(),
        "rect": [page.rect.width, page.rect.height],
        "drawings": [
            {"fill": d.get("fill"), "rect": [d["rect"].x0, d["rect"].y0, d["rect"].x1, d["rect"].y1]}
            for d in page.get_drawings()
        ],
    })
print(json.dumps(out))
`
  const python = process.env.PYTHON || 'python3'
  const { stdout } = await execFileAsync(python, ['-c', script, pdfPath], {
    maxBuffer: 1024 * 1024 * 64,
  })
  return JSON.parse(stdout)
}

/** Normalises a string so it can be compared (no accents, no punctuation). */
function normalise(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .toLowerCase()
    .trim()
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (!existsSync(args.pdf)) {
    throw new Error(`PDF not found: ${args.pdf}`)
  }

  console.log('[verify] Fetching the Pretalx schedule')
  const payload = await fetchSchedule()
  const schedule = normaliseSchedule(payload)
  const trackColors = new Map(
    (payload?.schedule?.conference?.tracks ?? []).map((t) => [t.name, (t.color ?? '').toLowerCase()]),
  )

  console.log(`[verify] Reading ${args.pdf}`)
  const pages = await extractPages(args.pdf)

  const errors = []
  const warnings = []

  // --- Geometry -----------------------------------------------------------
  if (pages.length !== schedule.days.length) {
    errors.push(`Expected ${schedule.days.length} pages, found ${pages.length}`)
  }
  for (const [i, page] of pages.entries()) {
    const [w, h] = page.rect
    if (Math.abs(w - A4_LANDSCAPE.width) > 1 || Math.abs(h - A4_LANDSCAPE.height) > 1) {
      errors.push(
        `Page ${i + 1}: expected A4 landscape (${A4_LANDSCAPE.width}x${A4_LANDSCAPE.height}), found ${w.toFixed(2)}x${h.toFixed(2)}`,
      )
    }
  }

  // --- Content ------------------------------------------------------------
  const allText = normalise(pages.map((p) => p.text).join(' '))

  for (const day of schedule.days) {
    const dayText = normalise(pages[schedule.days.indexOf(day)]?.text ?? '')
    for (const session of day.sessions) {
      const title = normalise(session.title)
      // A title can be wrapped over several lines, so compare the first
      // words and the last words of the title.
      const words = title.split(' ').filter(Boolean)
      if (words.length === 0) continue
      const head = words.slice(0, 3).join(' ')
      const tail = words.slice(-2).join(' ')
      if (!dayText.includes(head) || !dayText.includes(tail)) {
        errors.push(`Missing session on ${day.date}: "${session.title}"`)
      }
      for (const speaker of session.speakers) {
        const name = normalise(speaker)
        if (name && !dayText.includes(name)) {
          warnings.push(`Speaker not found on ${day.date}: "${speaker}"`)
        }
      }
    }
    for (const br of day.breaks) {
      const label = normalise(br.label)
      if (!dayText.includes(label)) {
        errors.push(`Missing break on ${day.date}: ${br.label}`)
      }
    }
  }

  // --- Colours ------------------------------------------------------------
  const usedColors = new Set()
  for (const page of pages) {
    for (const d of page.drawings) {
      if (!d.fill) continue
      const hex =
        '#' +
        d.fill
          .map((v) =>
            Math.round(v * 255)
              .toString(16)
              .padStart(2, '0'),
          )
          .join('')
      usedColors.add(hex)
    }
  }
  for (const [name, color] of trackColors) {
    if (!usedColors.has(color)) {
      warnings.push(`Track colour not found in the PDF: ${name} (${color})`)
    }
  }

  // --- Report -------------------------------------------------------------
  console.log(`[verify] Pages: ${pages.length}`)
  console.log(`[verify] Sessions checked: ${schedule.days.reduce((n, d) => n + d.sessions.length, 0)}`)
  console.log(`[verify] Colours found: ${usedColors.size}`)

  for (const w of warnings) console.log(`[verify] WARN  ${w}`)
  for (const e of errors) console.log(`[verify] ERROR ${e}`)

  if (errors.length > 0) {
    console.error(`[verify] Failed with ${errors.length} error(s)`)
    process.exit(1)
  }
  console.log('[verify] OK')
}

main().catch((err) => {
  console.error('[verify] ERROR:', err.message)
  process.exit(1)
})
