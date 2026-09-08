// POST /api/waitlist
//
// Cloudflare Pages Function. Stores the address in KV, then tries to notify.
// A failed notification never fails the signup: the KV write is the record.
//
// Bindings needed (Cloudflare dashboard, or wrangler.toml):
//   WAITLIST      KV namespace
//   RESEND_KEY    secret, optional. No key means no email, signups still store.
//   NOTIFY_TO     var, defaults to waitlist@agentsasfolders.ai
//   NOTIFY_FROM   var, must be a domain verified with the mail provider

const RATE_LIMIT = 5 // submissions per window
const WINDOW_S = 600 // 10 minutes

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

// Deliberately loose. Real validation is the confirmation email, later.
const looksLikeEmail = (s) =>
  typeof s === 'string' &&
  s.length > 4 &&
  s.length < 255 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)

export async function onRequestPost({ request, env }) {
  if (!env.WAITLIST) {
    return json({ message: 'Waitlist storage is not configured.' }, 500)
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  const rateKey = `rate:${ip}`
  const seen = parseInt((await env.WAITLIST.get(rateKey)) || '0', 10)
  if (seen >= RATE_LIMIT) {
    return json({ message: 'Too many tries. Give it a few minutes.' }, 429)
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
    return json({ message: 'Could not read that. Try again.' }, 400)
  }

  email = String(email || '').trim().toLowerCase()

  if (!looksLikeEmail(email)) {
    return json({ message: 'That does not look like an email address.' }, 400)
  }

  await env.WAITLIST.put(rateKey, String(seen + 1), {
    expirationTtl: WINDOW_S,
  })

  const key = `sub:${email}`
  const existing = await env.WAITLIST.get(key)
  if (existing) {
    return json({ message: "You're already on the list." })
  }

  // The signup itself. Everything after this is best effort.
  await env.WAITLIST.put(
    key,
    JSON.stringify({
      email,
      source: String(source || '/').slice(0, 120),
      at: new Date().toISOString(),
      ua: (request.headers.get('User-Agent') || '').slice(0, 200),
    })
  )

  if (env.RESEND_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.NOTIFY_FROM || 'waitlist@agentsasfolders.ai',
          to: env.NOTIFY_TO || 'waitlist@agentsasfolders.ai',
          subject: 'New VIP waitlist signup',
          text: `${email}\nfrom ${source || '/'}\n${new Date().toISOString()}`,
        }),
      })
    } catch {
      // Signup already stored. Nothing to do.
    }
  }

  return json({ message: "You're on the list. I'll email you when it opens." })
}

// GET /api/waitlist?key=SECRET  ->  the list as JSON, for export.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const key = url.searchParams.get('key')

  if (!env.EXPORT_KEY || key !== env.EXPORT_KEY) {
    return json({ message: 'Nope.' }, 401)
  }

  const out = []
  let cursor
  do {
    const page = await env.WAITLIST.list({ prefix: 'sub:', cursor })
    for (const k of page.keys) {
      const v = await env.WAITLIST.get(k.name)
      if (v) out.push(JSON.parse(v))
    }
    cursor = page.cursor
    if (page.list_complete) break
  } while (cursor)

  return json({ count: out.length, subscribers: out })
}
