# agentsasfolders.ai

Astro, static, deployed to Cloudflare Pages. 1 Pages Function for the waitlist.

## Run it

```
npm install
npm run dev      # localhost:4321
npm run build    # dist/
npm run preview
```

## Where things are

```
src/config.ts              every link and constant. Change them HERE.
src/styles/global.css      the skin. All tokens at the top of the file.
src/layouts/Base.astro     head, header, footer
src/components/            Waitlist.astro
src/pages/                 index, icm, hermes, start, vip, 404
src/pages/blog/            blog index and post template
src/content/blog/          the posts. 1 markdown file each.
src/content/config.ts      what fields a post can have
functions/api/waitlist.js  the Pages Function
```

## Add a blog post

Drop a `.md` file in `src/content/blog/`. Filename becomes the URL.

```yaml
---
title: "The title"
description: "One sentence. Becomes the meta description."
keyword: "the 1 keyword this targets"
date: 2026-09-08
draft: false          # true hides it from the production build
video: "https://youtube.com/watch?v=..."   # optional, embeds
sources:              # optional, renders a list at the bottom
  - https://example.com
---
```

Commit. Cloudflare builds it. `draft: true` posts still render in `npm run dev`.

## Deploy

Cloudflare Pages, connect the repo:

- Build command: `npm run build`
- Output directory: `dist`

**1 project, 1 domain.** The blog is `agentsasfolders.ai/blog`, not a subdomain.
There is nothing extra to deploy: `/blog` and `/blog/<slug>` are routes in this
same build.

## The waitlist

Form posts to `/api/waitlist`. Stores in KV, then tries to email. **If the email
fails the signup still stores.** KV is the record.

Set up once:

```
wrangler kv namespace create WAITLIST
```

Paste the id into `wrangler.toml` and bind `WAITLIST` in the Pages dashboard
under Settings, Functions, KV namespace bindings.

Secrets, in the dashboard or via `wrangler secret put`:

- `RESEND_KEY` optional. Without it, no notification email. Signups still store.
- `EXPORT_KEY` any long random string. Guards the export route.

Vars: `NOTIFY_TO` and `NOTIFY_FROM`, both default to waitlist@agentsasfolders.ai.
`NOTIFY_FROM` must be on a domain verified with the mail provider.

### Getting the list out

The key goes in a header, not the query string, so it stays out of access logs,
proxies and browser history:

```
curl -H "Authorization: Bearer YOUR_EXPORT_KEY" \
  https://agentsasfolders.ai/api/waitlist
```

Or straight from KV:

```
wrangler kv key list --binding WAITLIST --prefix "sub:"
```

Rate limited to 5 submissions per IP per 10 minutes.

## Things that are deliberately true

- **VIP has no buy button.** The classroom is in draft and cannot be bought. The
  section is a waitlist. When it opens, add the button.
- **The BuildMarketClose link is an affiliate link** and every use of it carries
  a visible commission disclosure. Do not remove the disclosure. FTC requires it
  and the audience is business owners.
- **No course list anywhere.** The course material is not written yet, so
  nothing on the site says courses, curriculum, modules or lessons as though
  they exist.
- **`--muted` is `#8b96a3`, not `#6C757D`.** The original gray failed contrast
  on the dark ground. `#6C757D` survives as `--muted-dim` for borders only.
- **Dark only, no theme toggle.** The brand has 1 look.

## Placeholders

| What | Where | Note |
|---|---|---|
| `PASTE_KV_ID_HERE` | `wrangler.toml` | From `wrangler kv namespace create` |
| `RESEND_KEY` | Pages secret | Optional |
| `EXPORT_KEY` | Pages secret | Needed for the export route |

Nothing else is a placeholder. Every link on the site is real.
