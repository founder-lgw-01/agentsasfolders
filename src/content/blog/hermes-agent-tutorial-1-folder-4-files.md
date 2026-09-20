---
title: "Hermes Agent Tutorial: 1 Folder and 4 Files for Any Job"
description: "A hermes agent tutorial for the mistake I kept making. Hermes remembers who you are, not your job. Give the job 1 folder and 4 files, then prove it works."
keyword: "hermes agent tutorial"
date: 2026-09-19
draft: false
video: "https://www.youtube.com/watch?v=q3libDrhXpM"
sources:
  - https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
  - https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files
  - https://arxiv.org/abs/2603.16021
---

This is a hermes agent tutorial for 1 mistake, and it is the one I kept making.
I gave Hermes a job with no folder. It looked everywhere: my files, my calendar,
my records. It mixed them up, because nothing told it where the job lives.

Hermes was not broken that day. It remembers who you are, and it does that well.
What it is not built to be is the record of the job you are doing. So the job
gets a folder. 4 plain text files go in it. Then you prove it works with a chat
that has never seen the job.

That is the video, 7 minutes, above. Here it is in writing, with my real
files, so you can build yours tonight.

## What Hermes memory is for

Hermes has a built-in memory, and by default it is 2 small files. MEMORY.md holds
facts about your setup. USER.md holds how you want things done. It reads both at
the start of every session, and they are capped at 2,200 and 1,375 characters
by default. Small on purpose, so what it keeps stays worth keeping.

It also keeps chat history, and it can use deeper memory tools. None of that is
a clear record of 1 job. Not this week's task, and not what you decided last
week. That is the design, not a fault. The official page on
[persistent memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)
says the same thing in more words.

[Here is that part of the video](https://www.youtube.com/watch?v=q3libDrhXpM&t=31s).

## Where the job goes

It goes in a folder you can open. That is why this site is called Agents as
Folders, and the idea underneath it is [ICM](/icm), Interpretable Context
Methodology. Jake van Clief created it, and he and David McDermott
[wrote the paper on it](https://arxiv.org/abs/2603.16021). I did not invent it.
I use it, I teach it, and I build inside it.

## Pick a job that is safe to draft

Start with 1 job you repeat. Good first jobs:

- Reviewing support requests and writing the replies
- Checking a project list and flagging what needs attention
- Gathering a few updates into a decision brief

Do not start with payments or account changes. Do not start with sending
messages or deleting files. Your first folder prepares information. It does
not act.

## The hermes agent tutorial part: 1 folder, 4 files

Make 1 folder and name it for the job. Mine is called weekly project review.
Inside it go 4 files: AGENTS.md, PURPOSE.md, CONTEXT.md and decisions.md.

Start with AGENTS.md, because it fixes the mistake I made. Hermes looks for
AGENTS.md by itself. In a project, it reads them from the top folder down, and
it picks up a folder's own file when it opens that folder. The deeper file wins,
so the job folder gets the last word. The
[context files page](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)
in the Hermes docs covers the exact order.

Mine is 4 lines long:

```markdown
# Weekly Project Review

This folder is 1 job: the weekly project review.
Read PURPOSE.md first, then CONTEXT.md, then decisions.md.
Prepare drafts only. Never send messages, change records, or take any external action.
```

Keep the router thin, and keep the substance in the files it points at.
[Watch the router get written](https://www.youtube.com/watch?v=q3libDrhXpM&t=144s).

PURPOSE.md says what the job is for. What comes in, and what should come out.
Then 1 line for the human check. That line is the one people skip.

```markdown
# Weekly Project Review

## Purpose
Prepare a short draft of this week's priorities for my review.

## Inputs
- Current project notes
- Last review's decisions

## Output
- A draft priority list with open questions

## Human check
I review the draft before any task, message, calendar, or file change happens.
```

CONTEXT.md holds the facts Hermes needs every time. Short and current beats long
and stale.

```markdown
# Context

- We work on 3 active client projects.
- Jordan makes the final priority decisions.
- Do not contact clients or change project records.
- Flag missing information instead of guessing.
```

decisions.md holds the latest choices and the open questions. Date every entry.
This is the part you never leave to memory or an old chat.

```markdown
# Decisions

## 2026-09-11
- Finish the proposal draft before starting the website refresh.
- Open question: Is the client meeting still scheduled for Thursday?
```

Those 4 files are the handoff. You can open them, a teammate can read them, and
a new chat can use them without you rebuilding it from memory.
[The 3 files, on screen as I read them](https://www.youtube.com/watch?v=q3libDrhXpM&t=201s).

## Ask for a draft, not an action

Now open Hermes inside that folder and ask it for a draft:

```text
Read PURPOSE, CONTEXT and decisions.
Prepare this week's review draft.
List what is missing and what is still open.
Do not send, change or delete anything.
```

Read what comes back. If it missed something, edit the files, not the chat, and
run it again. The folder gets better because the context is where you can see
it.

## The clean chat test

A folder that works for you today is not proof. You already know the job, so
you fill the gaps without noticing. Start a brand new chat that has not seen the
job. Point it at the folder, and ask 4 questions:

1. What is the job?
2. What are you allowed to do?
3. What needs a human decision?
4. What was decided most recently?

If those answers are clear, the folder works. If 1 is vague, the gap is in a
file, not in the model. Fix the file and run the 4 questions again. Same job,
same Hermes, 1 folder of difference.
[The test, at 5:08](https://www.youtube.com/watch?v=q3libDrhXpM&t=308s).

## When folders fit

Folders fit repeatable work with a clear order. They fit when a person reviews
the output. They are a poor fit for high volume, real time work, or for work
that needs many agents at once. For a task you do once, a saved prompt is
enough.

The point is to give the job a place to live.

## Where to go from here

If you have never pointed an agent at a folder, start with the
[3 folder start](/start). It takes about 20 minutes and nothing is installed.
If you have Hermes running, the [Hermes page](/hermes) is the ladder, rung by
rung.

The 4 file starter template from the video is in my classroom inside Build
Market Close. I teach there and I am an admin there. Heads up: that is an
affiliate link, and I earn a commission if you join through it. I would point
you there either way, because it is where I teach.
[Build Market Close](https://www.skool.com/buildmarketclose/about?ref=b4930039368a40fea726f166eb864cc1).

Next on the channel: how Hermes remembers, layer by layer. This post is the
folder. That series is the memory.
