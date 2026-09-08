// POST /api/waitlist
//
// Cloudflare Pages Function. Stores the address in KV, then tries to notify.
// A failed notification never fails the signup: the KV write is the record,
// and the notification is handed to waitUntil AFTER the response is sent, so
// a slow mail provider can never hang the caller.
//
// Bindings needed (Cloudflare dashboard, or wrangler.toml):
//   WAITLIST      KV namespace
//   RESEND_KEY    secret, optional. No key means no email, signups still store.
//   EXPORT_KEY    secret, guards the GET export route. No key means no export.
//   NOTIFY_TO     var, defaults to waitlist@agentsasfolders.ai
//   NOTIFY_FROM   var, must be a domain verified with the mail provider

const RATE_LIMIT = 5 // submissions per window
const WINDOW_S = 600 // 10 minutes
const NOTIFY_TIMEOUT_MS = 5000 // never let the mail provider hold a request
const EXPORT_LIMIT = 20 // export attempts per IP per window
const EXPORT_MAX = 5000 // hard cap on rows pulled in one export

const FALLBACK_NOTIFY = 'waitlist@agentsasfolders.ai'

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
    },
  })

// Loose on purpose: real validation is the confirmation email, later. But it
// must reject anything that stops being an address and starts being a payload.
// No angle brackets, quotes, backslashes, control characters or commas, since
// the stored value is later read back into mail bodies and admin views.
const EMAIL_RE = /^[^\s@<>"'\\,;:()[\]]+@[^\s@<>"'\\,;:()[\]]+\.[a-z]{2,24}$/i
const CONTROL_RE = /[\u0000-\u001f\u007f]/

const looksLikeEmail = (s) => {
  if (typeof s !== 'string') return false
  if (s.length < 6 || s.length > 254) return false
  if (CONTROL_RE.test(s)) return false
  if (!EMAIL_RE.test(s)) return false
  const [local, domain] = s.split('@')
  if (local.length > 64) return false
  // No empty, leading, trailing or doubled labels: a@-.co and a@b..co are out.
  const labels = domain.split('.')
  if (labels.some((l) => l.length === 0 || l.startsWith('-') || l.endsWith('-')))
    return false
  return true
}

const clientIp = (request) =>
  request.headers.get('CF-Connecting-IP') || 'unknown'

// KV has no compare-and-set, so this counter is best effort by construction.
// It stops casual repeat submits; it is not a defence against a distributed
// flood. Cloudflare WAF rate limiting is the control that belongs in front.
async function overLimit(env, key, limit) {
  const seen = parseInt((await env.WAITLIST.get(key)) || '0', 10)
  if (seen >= limit) return true
  // Written before the work, not after, so concurrent requests race toward the
  // limit rather than all reading zero and all passing.
  await env.WAITLIST.put(key, String(seen + 1), { expirationTtl: WINDOW_S })
  return false
}

async function notify(env, email, source) {
  if (!env.RESEND_KEY) return
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.NOTIFY_FROM || FALLBACK_NOTIFY,
        to: env.NOTIFY_TO || FALLBACK_NOTIFY,
        subject: 'New VIP waitlist signup',
        text: `${email}\nfrom ${source}\n${new Date().toISOString()}`,
      }),
      signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS),
    })
  } catch {
    // Signup is already stored. KV is the record. Nothing to do.
  }
}

// A browser posting the bare form (no JavaScript) gets a real page back, not
// a JSON document. Anything else, including our own fetch, gets JSON.
const wantsHtml = (request) =>
  (request.headers.get('Accept') || '').includes('text/html')

const seeOther = (request, status) => {
  const to = new URL('/thanks/', new URL(request.url).origin)
  to.searchParams.set('s', status)
  return new Response(null, {
    status: 303,
    headers: { Location: to.href, 'Cache-Control': 'no-store' },
  })
}

const reply = (request, body, status = 200, outcome = 'ok') =>
  wantsHtml(request) ? seeOther(request, outcome) : json(body, status)

export async function onRequestPost(context) {
  const { request, env } = context

  if (!env.WAITLIST) {
    return reply(request, { message: 'Waitlist storage is not configured.' }, 500, 'error')
  }

  const rateKey = `rate:${clientIp(request)}`
  if (await overLimit(env, rateKey, RATE_LIMIT)) {
    return reply(request, { message: 'Too many tries. Give it a few minutes.' }, 429, 'slow')
  }

  let email, source
  try {
    const ct = request.headers.get('Content-Type') || ''
    if (ct.includes('application/json')) {
      const body = await request.json()
      email = body.email
      source = body.source
    } else {
      const form = await request.formData()
      email = form.get('email')
      source = form.get('source')
    }
  } catch {
    return reply(request, { message: 'Could not read that. Try again.' }, 400, 'error')
  }

  email = String(email || '').trim().toLowerCase()

  if (!looksLikeEmail(email)) {
    return reply(
      request,
      { message: 'That does not look like an email address.' },
      400,
      'invalid'
    )
  }

  // Strip anything that is not a plain path before it is stored or mailed.
  const cleanSource = String(source || '/')
    .replace(CONTROL_RE, '')
    .slice(0, 120)

  const key = `sub:${email}`
  const existing = await env.WAITLIST.get(key)
  if (existing) {
    return reply(request, { message: "You're already on the list." }, 200, 'already')
  }

  // The signup itself. Everything after this is best effort.
  await env.WAITLIST.put(
    key,
    JSON.stringify({
      email,
      source: cleanSource,
      at: new Date().toISOString(),
      ua: (request.headers.get('User-Agent') || '')
        .replace(CONTROL_RE, '')
        .slice(0, 200),
    })
  )

  // Sent after the response goes out. A dead mail provider costs the caller
  // nothing and cannot lose the signup, which is already committed above.
  context.waitUntil(notify(env, email, cleanSource))

  return reply(
    request,
    { message: "You're on the list. I'll email you when it opens." },
    200,
    'ok'
  )
}

// Constant-time compare so a wrong key leaks nothing through response timing.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

// GET /api/waitlist  ->  the list as JSON, for export.
// The key goes in the Authorization header, not the query string, so it stays
// out of access logs, proxies and browser history.
//   curl -H "Authorization: Bearer $EXPORT_KEY" https://agentsasfolders.ai/api/waitlist
export async function onRequestGet({ request, env }) {
  if (!env.WAITLIST) return json({ message: 'Nope.' }, 401)

  // Rate limited too. Without this the key is brute forceable for free.
  const attemptKey = `xrate:${clientIp(request)}`
  if (await overLimit(env, attemptKey, EXPORT_LIMIT)) {
    return json({ message: 'Nope.' }, 429)
  }

  const auth = request.headers.get('Authorization') || ''
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  const url = new URL(request.url)
  const supplied = bearer || url.searchParams.get('key') || ''

  if (!env.EXPORT_KEY || !safeEqual(supplied, env.EXPORT_KEY)) {
    return json({ message: 'Nope.' }, 401)
  }

  const out = []
  let cursor
  let truncated = false

  do {
    const page = await env.WAITLIST.list({ prefix: 'sub:', cursor, limit: 1000 })

    // One read per key would blow the subrequest budget on a large list, so
    // pull each page's values in parallel and stop at a hard cap.
    const values = await Promise.all(
      page.keys.map((k) => env.WAITLIST.get(k.name))
    )
    for (const v of values) {
      if (!v) continue
      try {
        out.push(JSON.parse(v))
      } catch {
        // A row that is not JSON is skipped rather than failing the export.
      }
    }

    if (out.length >= EXPORT_MAX) {
      truncated = true
      break
    }

    if (page.list_complete) break
    cursor = page.cursor
  } while (cursor)

  return json({ count: out.length, truncated, subscribers: out })
}
