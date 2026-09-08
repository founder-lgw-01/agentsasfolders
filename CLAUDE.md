# agentsasfolders.ai, the map

This is the public site: Astro, static, served by Cloudflare Pages, 1 Pages
Function for the waitlist. It is not the video pipeline. The pipeline is a
private sibling checkout, and 3 of its files govern every word on this site.
Read them there. Never copy them here, or the 2 copies drift.

## Open this folder as the working directory

Not the pipeline's. The pipeline's `CLAUDE.md` describes 9 stages of video
production and none of them apply here. A session that opens the pipeline and
works in here loads the wrong rules, and the last one that did cost real
accuracy. `HANDOFF.md` says how.

## The 3 pipeline files that rule the copy

Paths are relative to this folder. The absolute location of the pipeline on
this machine is in `CLAUDE.local.md`, which is not committed.

| What | Where |
|---|---|
| What the channel is about | `../9-stage-video-pipeline/_config/the-thesis.md` |
| What may never ship | `../9-stage-video-pipeline/_reference/disclosure-boundary.md` |
| How copy reads | `../9-stage-video-pipeline/_reference/voice.md` |
| The check that enforces it | `../9-stage-video-pipeline/checks/voice-check.sh` |

Run the check from the pipeline folder, so it finds the owner's banned words:

    cd ../9-stage-video-pipeline
    bash checks/voice-check.sh ../aaf-site/src/pages/<page>.astro

A failing check is a stop, not a note.

## Where things are

| Task | Go to |
|---|---|
| What was done last, what is open, why the last session stopped | `HANDOFF.md`. It supersedes `NEXT.md` |
| How to run, deploy, and add a post | `README.md` |
| A page | `src/pages/` |
| Every link, name and nav item | `src/config.ts`. Change them there, nowhere else |
| The 1 stylesheet, tokens at the top | `src/styles/global.css` |
| The shell every page sits in | `src/layouts/Base.astro` |
| Blog posts | `src/content/blog/` |
| The waitlist function | `functions/api/waitlist.js` |
| The profiles guide | `public/profiles/index.html`. Third party. Do not reformat or restyle |

## The loop

    npm run build          must finish clean
    git push               to the working branch, never to main
    curl the preview       Cloudflare cuts the branch slug to 28 characters

Verify by running it, not by reading it.

## Never

- Merge to `main`, or touch what serves agentsasfolders.ai. The owner does that.
- Show the instance. No client or member names, no message content, no
  identifiers, no credential surface, no infrastructure that maps to the host,
  no live dashboards. The architecture is the lesson.
- Ship anything from BuildMarketClose without Ryan McKinney's written approval.
- Drop a credit. ICM is Jake van Clief's. The framework being automated is
  Ryan McKinney's.
- Use an em dash, spell out a number, or use developer talk on a page.
- Invent a number. Count it, cite it, or leave it out.
- Remove the affiliate disclosure from a BuildMarketClose link.
- Restyle `public/profiles/index.html`.
- Loosen the `@astrojs/sitemap` pin. It is exactly 3.1.6 because newer 3.x
  versions crash this build.
- Commit `.claude/` or `CLAUDE.local.md`. They are local config.
