# Handoff, 2026-09-08, second pass

Written at a commit boundary, under 1 model for the whole unit of work. The
tree is clean. Nothing is broken. Read "What the owner still decides" before
doing anything to the home page.

## What changed since the last handoff

The last handoff stopped with an unstyled hero in the tree and an unanswered
question. This pass finished the hero, made the call on the question, and
recorded it here so it can be reversed on purpose rather than by accident.

### 4a963f9, the front door

`src/pages/index.astro` and `src/styles/global.css`.

- `Agents As Folders` is now the `h1` and the largest words on the site.
  Nothing else uses that size.
- 1 line under it says what it is. The badge above it carries the thesis in
  4 words, Hermes agents on ICM brains.
- 3 cards: folders hold the work, an agent walks them, a layer above says no.
- The 3 folder call to action is kept as the first step. The ghost button now
  goes to `/what-this-is/`, not to a same page anchor with the same name.
- The section that repeated card 01 word for word now says something else.
- The 6 door classes the previous edit needed and never got are in
  `global.css`, in their own block, home page only.
- The meta description says what the thing is instead of quoting the blog
  post's hook.

Verified by running it: build clean at 9 pages, 1 `h1`, no skipped heading
levels, voice check clean, all 6 classes in the shipped CSS, no draft in
`dist/`.

### Same commit, the housekeeping the last handoff asked for

- `.claude/` and `CLAUDE.local.md` are in `.gitignore`.
- `CLAUDE.md` exists in this repo. It points at the 3 pipeline files that
  govern copy by relative sibling path and copies none of them. The absolute
  location of the pipeline on this machine lives in `CLAUDE.local.md`, which
  is not committed, because this repo is public and the pipeline is not.
- The permission allowlist was **not** added. The owner's user level settings
  already run with approvals off, and the standing instruction is to never add
  piecemeal allow rules on top of that. The `.claude/settings.json` in this
  folder is a leftover from before that decision. It is ignored and harmless.

## What the owner still decides

The last handoff asked: does the thesis content move onto the home page, or
does the home page stay a door that points at `/what-this-is`?

**This pass built the door and kept the deep dive.** The home page now says
what the thing is in 1 line and 3 cards without a second click, and
`/what-this-is/` stays as the full statement, reached from the ghost button
and the "What" nav item. The reason: a front door to an entire site opens with
the name and routes outward. It does not have to carry the whole argument.

If that is wrong and the thesis should live at home, the change is:

- Move the stack, the 6 jobs and the "do I run this" section from
  `src/pages/what-this-is.astro` into `index.astro` below the cards.
- Delete or shorten `what-this-is.astro`.
- Change or remove the `What` entry in `NAV` in `src/config.ts`.

Nothing else depends on it. Either way, merging PR #1 is the owner's call and
nobody else's.

## What is open, in the order it matters

1. **Merge PR #1, or do not.** Nothing has been merged. agentsasfolders.ai is
   untouched. The preview is at the truncated slug:

       https://harden-waitlist-and-blog-ren.agentsasfolders.pages.dev

2. **The 4 free material cards on the home page link nowhere.** They never
   did. `Hermes basics` could go to `/hermes` and `ICM folder structures` to
   `/icm` today. `Automations` and `Channels` have no page yet, which is the
   same gap as the 2 empty rungs on `/hermes`. Not touched this pass because
   it was not asked for.
3. **The 2 empty rungs on `/hermes`**, 02 and 04, still say "Being written".
   `NEXT.md` describes the flip. Anything written for them obeys the
   disclosure boundary.
4. **KV has no compare and set.** 2 simultaneous signups for 1 address can
   both pass the dedup check. Left open on purpose, see the first handoff's
   reasoning. Revisit if duplicates show up.
5. **`NEXT.md` is stale.** It predates deployment and says nothing is
   deployed. `CLAUDE.md` names this file as the one that supersedes it. Delete
   or rewrite it when convenient.

## Why the last session stopped, and what this pass did about it

- **Context bleed.** This session again ran with the pipeline as its working
  directory. The fix is now in the tree: `CLAUDE.md` here, and a note in the
  pipeline's memory that says to read it. Next time, open `c:\aaf-site`.
- **Model change mid-session.** Did not happen this time. 1 model, 1 unit of
  work, stopped at a commit.
- **Permission prompts.** Already off at the user level. See above.

## What was done and pushed before this pass

Branch `harden-waitlist-and-blog-rendering`, PR #1. The 3 commits below are
unchanged and their reasoning is unchanged. The first handoff described them
in full; this is the short form.

- **824d72a, the audit fixes.** Email validation that rejects hostile input,
  the notification moved off the request path with a timeout, a rate limit
  and a constant time compare on the export route with the key in a header,
  parallel export reads with a 5000 row cap, JSON-LD escaping, video URLs
  parsed against a host allowlist, double submit guard, `/thanks/` as the no
  JavaScript landing, `@astrojs/sitemap` pinned to exactly 3.1.6, RSS and
  blog index on the same draft rule as the post pages.
- **b5d593e, the profiles page had no way out.** 1 link home added to a third
  party file that is otherwise under a do not restyle rule. If that call was
  wrong, revert this 1 commit alone.
- **3da0d12, /what-this-is.** The thesis page. Passes the voice check, shows
  no identifiers, carries both credits. It stays as the deep dive.

## The rules that govern copy on this site

These are not optional and no script catches all of them. `CLAUDE.md` in this
folder points at the source files.

- **Teach the architecture, never show the instance.** No client or member
  names, no message content, no identifiers, no credential surface, no
  infrastructure that maps to the host, no live dashboards. Nothing from
  BuildMarketClose without Ryan McKinney's written approval.
- **Voice.** No em dashes. Numbers as digits. No developer talk on a public
  surface. The owner's banned words never ship. Run the voice check from the
  pipeline folder before shipping copy.
- **The thesis.** Hermes agents on ICM brains running a real business. The
  moat is the control plane: the agent does not police itself.
- **Credits are always owed.** ICM is Jake van Clief's. The framework being
  automated is Ryan McKinney's.

## Verified state at the stop

- Build clean, 9 pages.
- 1 `h1` per page, no skipped heading levels on the home page.
- Voice check clean on `index.astro` and `CLAUDE.md`.
- No draft in `dist/`.
- `--muted` `#8b96a3` on `#0d0f12` unchanged from the first handoff's
  measurement.
- The preview at the truncated slug served 4a963f9 within 4 minutes of the
  push: the `h1` reads Agents As Folders, the door classes are in the served
  stylesheet, and the ghost button resolves to `/what-this-is/`, which
  returns 200.
- PR #1 open. The Cloudflare Pages check on 4a963f9 completed with success.
