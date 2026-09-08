# Pick up here

Paused 2026-09-08. The site builds clean and runs locally. Nothing is deployed.

## What is done

- Astro site, 7 pages, builds with no errors
- The skin, tokens in `src/styles/global.css`
- Blog with Content Collections, RSS, sitemap, JSON-LD, draft handling
- Waitlist form and the Pages Function behind it
- 1 sample post, `draft: true`, at
  `src/content/blog/why-your-ai-second-brain-doesnt-work.md`
- Every link real. The BMC affiliate link is a single constant in
  `src/config.ts` and carries a visible disclosure at every use.

## What the next session does, in order

1. **GitHub.** Repo, first commit, push. `.gitignore` is already correct.
2. **Cloudflare Pages project.** Connect the repo.
   Build command `npm run build`, output directory `dist`.
3. **Custom domain** `agentsasfolders.ai` on that project.
4. **KV namespace.**
   ```
   wrangler kv namespace create WAITLIST
   ```
   Paste the id into `wrangler.toml`, then bind `WAITLIST` in the Pages
   dashboard under Settings, Functions, KV namespace bindings.
5. **Secrets** in the Pages dashboard:
   - `EXPORT_KEY`, any long random string. Guards the list export route.
   - `RESEND_KEY`, optional. Without it there is no notification email and
     signups still store in KV.
6. **Verify the waitlist end to end.** Submit a real address, then pull it back:
   ```
   curl "https://agentsasfolders.ai/api/waitlist?key=YOUR_EXPORT_KEY"
   ```
   A form that looks fine and stores nothing is the failure worth catching.
7. **Nothing to do for the blog.** It is `agentsasfolders.ai/blog`, a route in
   this same build, not a subdomain and not a 2nd project. If
   `blog.agentsasfolders.ai` was ever pointed anywhere, send it to
   `agentsasfolders.ai/blog` with a 301 and leave it at that.
8. **Decide on the sample post.** Flip `draft: false` to publish it, or delete
   it. It is the video's script turned into prose.

## Decisions already made, do not redo

- **No `hermes.` subdomain.** Hermes is `/hermes` on the main site. 3
  subdomains would split the ICM lane 3 ways.
- **VIP has no buy button** because the classroom is in draft and cannot be
  bought. When it opens, that section becomes a real offer at 29 dollars a
  month founding price and nothing else on the page has to change.
- **The affiliate disclosure stays visible.** Every BMC link carries it.
- **No course list anywhere.** The material is not written yet.
- **`--muted` is `#8b96a3`.** The brand guide's `#6C757D` fails contrast on the
  dark ground. It survives as `--muted-dim` for borders only.
- **`@astrojs/sitemap` is pinned to 3.1.6.** Newer versions crash against this
  Astro build. Do not bump it without testing.

## Known and deliberate

`npm audit` reports vulnerabilities in the dev toolchain. They are build time
only and do not ship in `dist/`. Check them before adding anything that runs at
request time beyond the waitlist function.

## The 2 empty rungs on /hermes

`src/pages/hermes.astro` has a ladder near the top of the file. 2 rungs render
greyed with a "Being written" tag and link nowhere:

    02  Getting started            installing Hermes and running it once
    04  Channels and automations   Discord, Telegram, email, scheduled work

When that content exists, add a page, set `href`, and flip `ready: true` in the
array. No other edits.

The owner is writing 02 later. It is the honest gap: a fresh visitor from the
video has no on-ramp to actually running Hermes, and rung 05, the profiles
guide, assumes it is already installed.

⚠️ Anything written for these rungs obeys
`c:\9-stage-video-pipeline\_reference\disclosure-boundary.md`. Teach the
architecture, never show the real system. Every screenshot is a purpose built
demo.

## The other workspace

The production line that made the video this site supports is at
`c:\9-stage-video-pipeline`. Its own handoff is
`production/second-brain-doesnt-work/HANDOFF.md`. Video 1 is at stage 2 of 9 and
its stages 8 and 9 are blocked until this site and the blog resolve.
