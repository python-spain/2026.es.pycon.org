/**
 * Minimal Chrome DevTools Protocol client.
 *
 * The generator needs to measure the real height available for the timeline
 * before deciding the scale of each page, so it renders the document once,
 * asks the browser for the computed layout and then re-renders with the
 * final scale.
 */

import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export const CHROME_PATHS = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean)

export function findChrome() {
  for (const candidate of CHROME_PATHS) {
    if (existsSync(candidate)) return candidate
  }
  throw new Error('Could not find a Chrome/Chromium binary. Set CHROME_PATH to its location.')
}

const DEBUG_PORT = 9333

/**
 * Opens the given HTML file in a headless Chrome instance and evaluates
 * `expression` in the page, returning its value.
 */
export async function evaluateInPage(htmlPath, expression, { timeout = 20000 } = {}) {
  const chrome = findChrome()
  const profileDir = await mkdtemp(join(tmpdir(), 'programa-pdf-profile-'))

  const proc = spawn(
    chrome,
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${profileDir}`,
      `--remote-debugging-port=${DEBUG_PORT}`,
      '--window-size=1123,794',
      'about:blank',
    ],
    { stdio: 'ignore' },
  )

  let target
  try {
    target = await waitForTarget(timeout)
  } catch (err) {
    proc.kill()
    await rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }).catch(() => {})
    throw err
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl)
  let id = 0
  const pending = new Map()

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg)
      pending.delete(msg.id)
    }
  }

  await new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = reject
  })

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const msgId = ++id
      pending.set(msgId, resolve)
      ws.send(JSON.stringify({ id: msgId, method, params }))
    })

  try {
    await send('Page.enable')
    await send('Page.navigate', { url: `file://${htmlPath}` })
    await new Promise((r) => setTimeout(r, 1500))
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
    })
    if (res.error) throw new Error(res.error.message)
    if (res.result?.exceptionDetails) {
      throw new Error(res.result.exceptionDetails.text ?? 'Evaluation failed')
    }
    return res.result?.result?.value
  } finally {
    try {
      ws.close()
    } catch {
      /* ignore */
    }
    proc.kill()
    // Chrome may still be writing to its profile directory; a failed cleanup
    // must not break the generation.
    await rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }).catch(() => {})
  }
}

async function waitForTarget(timeout) {
  const deadline = Date.now() + timeout
  let lastError
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)
      const tabs = await res.json()
      const page = tabs.find((t) => t.type === 'page')
      if (page) return page
    } catch (err) {
      lastError = err
    }
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error(`Chrome DevTools endpoint did not respond: ${lastError?.message}`)
}
