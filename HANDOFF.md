# Handoff, 2026-09-08

Written at the point the session stopped. The site work is real and pushed.
The front door is half built and the working tree is not clean. Read the
"Stop here first" section before you touch anything.

## Stop here first

`src/pages/index.astro` has an **uncommitted, broken edit**. The hero was
replaced with a new front door that uses 6 CSS classes:

    .door  .door-title  .door-line  .door-note  .door-stack  .door-n

**None of them exist in `src/styles/global.css`.** The edit that would have
added them was rejected mid-flight, so the home page currently renders an
unstyled hero. It builds, it just looks wrong.

2 honest options:

1. **Discard and restart the door.** `git checkout src/pages/index.astro`.
   Nothing else depends on it. This is the clean choice, and the reason to
   pick it is in "What the front door still needs" below: the direction was
   not agreed yet.
2. **Finish it.** Add the 6 classes to `global.css`, then judge the result.
   Only do this if you already know the answer to the open question below.

Do not commit the tree as it stands.

`.claude/` is also untracked. It is local tool config with machine paths in
it. It was deliberately kept out of every commit. It probably belongs in
`.gitignore`, which is a 1 line change nobody has made yet.

## Why this session stopped

3 reasons, all worth fixing before the next long run.

### 1. Context bleed between 2 workspaces

This session had `c:\9-stage-video-pipeline` as its working directory and did
almost all of its work in `c:\aaf-site`. Those are different projects with
different rules. The pipeline's `CLAUDE.md` loaded as the standing instruction
set for work on a website it does not describe.

That cost real accuracy. The voice laws, the disclosure boundary and the
thesis all live in the pipeline workspace and genuinely do govern site copy,
so the bleed was not all noise. But the routing table, the 9 stages and the
"2 ICMs" warning are about video production and had nothing to do with a
Cloudflare build, and shell working directory flipped between the 2 roots
repeatedly during the session.

**Fix before the next run:** open the site work with `c:\aaf-site` as the
working directory, and give that repo its own `CLAUDE.md` that points at the
3 pipeline files which actually apply:

    _config/the-thesis.md            what the channel is about
    _reference/disclosure-boundary.md   what may never ship
    _reference/voice.md + checks/voice-check.sh   how copy reads

Reference them by path. Do not copy them, or they will drift.

### 2. Model change mid-session

The model changed partway through. Judgement before and after is not the same
judgement, and the seam shows in the work: the audit and the security fixes
are careful and verified, and the front door attempt is not. Treat anything
after the profiles nav fix as less settled than what came before it.

**Fix:** finish a unit of work under 1 model. If the model has to change,
stop at a commit boundary, not mid-edit. This session changed model with an
unstyled hero sitting in the tree.

### 3. Permission prompts blocked unattended progress

Every Bash call and every fetch stopped for approval, so the build could not
run without somebody sitting there. That is the wrong trade for this repo:
the work is a static site build, a git push and a curl against a preview URL,
over and over.

**Fix:** allowlist the safe, repeated commands in `.claude/settings.json` in
the site repo. The ones this session actually needed, many times each:

    npm run build
    git status / diff / log / add / commit / push
    gh pr view / gh api (read only)
    curl against *.pages.dev and agentsasfolders.ai
    node (running throwaway scripts in the scratchpad)

Keep approval on: anything writing to `main`, `wrangler` commands, secret
reads, and `rm`.

There is a `/fewer-permission-prompts` skill that scans transcripts and
generates this allowlist. Run it in the site repo before the next long
session.

## What is done and pushed

Branch `harden-waitlist-and-blog-rendering`, PR #1, 3 commits.
**Nothing has been merged. agentsasfolders.ai is untouched.**

Preview, note Cloudflare truncates branch slugs to 28 characters so the
obvious URL 404s:

    https://harden-waitlist-and-blog-ren.agentsasfolders.pages.dev

### 824d72a, the audit fixes

A full read of all 17 files, then fixes for what it found. Each verified by
running it, not by reading it.

- **Email validation.** The old regex only forbade whitespace and a second @,
  so `"><script>alert(1)</script>@ev.il` validated and was stored, then came
  back out through the export route and the notification mail. Now rejects
  brackets, quotes, backslashes, control characters and separator
  punctuation, with length caps and domain label checks. Verified: 12 real
  addresses pass, 22 hostile inputs rejected.
- **The notification could hang the request.** Awaited inline with no timeout.
  Now `waitUntil` with a 5s timeout, sent after the response. The stated
  invariant, that a failed notification never loses a signup, is now
  structural rather than incidental.
- **The export route had no rate limit at all.** The key was free to brute
  force, unlogged. Now 20 attempts per IP per window, constant time compare,
  key moved to an `Authorization: Bearer` header so it stays out of access
  logs. The old `?key=` still works.
- Export pages read in parallel with a 5000 row cap, was 1 sequential read per
  key and would exhaust the subrequest budget on a real list.
- **JSON-LD breakout.** `JSON.stringify` does not escape the slash, so a title
  containing `</script>` closed the block and ran as HTML. Now escaped.
- **Video URL.** Matched `v=` anywhere in any string, so any host could supply
  an ID, while real `/shorts/` and `/embed/` links did not work. Now parsed
  against a host allowlist. Verified: 8 real forms parse, 8 spoofed rejected.
- Double submit guard, null safe message write, button can no longer be left
  permanently disabled.
- `/thanks/` added as the no-JavaScript landing page, noindex, out of sitemap.
- **`@astrojs/sitemap` pinned to exactly 3.1.6.** It was `^3.1.6`, so any tree
  refresh could pull a 3.x that crashes this build, which the caret was
  supposed to prevent.
- RSS and blog index now use the same dev/prod draft rule as the post pages.
  They disagreed.

**Left open on purpose:** KV has no compare and set, so 2 simultaneous signups
for 1 address can both pass the dedup check. Closing it needs Durable Objects.
Judged not worth the architecture change for a waitlist. Revisit if duplicates
actually show up.

### b5d593e, the profiles page had no way out

Every link in its nav was a same page anchor. A visitor from a video had no
route back to the site. The brand became a link home, 1 nav link, 1 footer
line. 5 lines added, 1 changed.

⚠️ This edits `public/profiles/index.html`, which is third party and under a
"do not reformat or restyle" rule. Adding a link was judged a different kind
of change from restyling, and it was asked for directly. No content, wording
or layout of the guide itself was touched. If that call was wrong, revert this
1 commit and the other 2 are unaffected.

### 3da0d12, /what-this-is

A page stating the thesis: the 4 layer stack, recall is not structure, the
control plane and its 6 jobs, who it is not for. States in words that the
owner runs this, and states just as plainly that the running system never
ships. Passes `checks/voice-check.sh` clean. No identifiers, no
infrastructure, no names beyond the 2 credits always owed, Jake van Clief for
ICM and Ryan McKinney for the framework being automated.

**This page is good and it is also not what was asked for.** See below.

## What the front door still needs

The last instruction was, and this is the important sentence in the whole
handoff:

> that's not a front door to an entire website with Block Title Agents As
> Folders at the top. that's an explainer page

That is correct and it was not built. `/what-this-is` is a good interior page
hung off the nav. A front door is the home page, and it opens with the name
of the thing.

The home page today opens with a blog post's hook, "Your AI asks who you are
every single morning", and **never says Agents As Folders anywhere above the
fold.** The name appears only in the header brand and the footer.

The half finished edit in the tree was an attempt at:

- `Agents As Folders` as the largest words on the site, in an `h1`
- 1 line under it saying what it is
- 3 cards: folders hold the work, an agent walks them, a layer above says no
- The existing "3 folders tonight" call to action kept as the first step

**The open question, and it was never answered:** does the thesis content live
on the home page, with `/what-this-is` deleted or reduced to a deep dive, or
does the home page stay a door that points at it? Both are defensible. The
first is probably right, since a site this small should not make someone click
twice to find out what it is, but that is a judgement for the owner, not for
whoever picks this up.

Also unresolved: the nav currently reads "What" and points at
`/what-this-is/`. If the thesis moves home, that nav item needs to change or
go.

## The rules that govern copy on this site

These are not optional and no script catches all of them.

- `_reference/disclosure-boundary.md`. **Teach the architecture, never show
  the instance.** No client or member names, no message content, no
  identifiers, no credential surface, no infrastructure that maps to the host,
  no live dashboards. Nothing from BuildMarketClose without Ryan McKinney's
  written approval.
- `_reference/voice.md`. No em dashes. Numbers as digits. No developer talk on
  a public surface. The owner's banned words never ship. Run
  `bash checks/voice-check.sh <file>` from the pipeline workspace against the
  prose before shipping copy.
- `_config/the-thesis.md`. Hermes agents on ICM brains running a real
  business. The moat is the control plane: the agent does not police itself, a
  layer it does not control sets its boundary.
- Credits are always owed. ICM is Jake van Clief's. The framework being
  automated is Ryan McKinney's.

## Verified state at the stop

- Build clean, 9 pages.
- No draft in `dist/`, the sitemap or the RSS feed.
- No secrets in `dist/`.
- Heading order correct on every page, 1 h1 each, no skipped levels.
- `--muted` `#8b96a3` measures 6.39:1 on `#0d0f12`. The earlier lift holds.
- All 5 profiles diagrams serve as `image/svg+xml` on the preview.
- PR #1 mergeable, Cloudflare check passing.

The one thing not verified by machine is whether the front door reads like a
front door. It does not yet.
