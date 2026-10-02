---
title: "AI Agent Memory That Stays Yours: How Hermes Does It"
description: "Where your AI agent memory lives decides who owns it. Here is how Hermes keeps every layer on your own machine, with my real files, 16 models and 482 sessions."
keyword: "ai agent memory"
date: 2026-10-02
draft: false
video: "https://www.youtube.com/watch?v=nTiipMApjAI"
sources:
  - https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
  - https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers
  - https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files
  - https://hermes-agent.nousresearch.com/docs/user-guide/features/curator
  - https://help.openai.com/en/articles/8590148-memory-faq
---

Your AI agent memory lives wherever your agent keeps it. In ChatGPT, Gemini and the Claude app, that is their servers, tied to their model. In Hermes, it is a folder on your own machine, and the model is just a setting.

That is the video above, 25 minutes, walked live on my own Hermes. Here it is in writing, with the real screens.

## Where your AI agent memory lives today

Start with the apps you already use. I read each one's own help page, so these are their words, not mine.

OpenAI's memory page asks the question straight: [does the memory summary include everything ChatGPT remembers?](https://help.openai.com/en/articles/8590148-memory-faq) The answer it gives is "No." The same page says memory can draw on your past chats, saved memories, files, and connected apps like Gmail.

Google tells you to check whether Gemini used your past chats by asking it: "Did you use any info from past chats?"

The Claude app gives each project its own memory, stored in Anthropic's cloud.

None of that is wrong. It is just not yours. It is a feature of someone else's product.

To be fair, not every AI hides its memory. Claude Code keeps its memory as files on your own computer. So the line is not "every AI". It is the chat apps. I walk through all 3 [at 4:20 in the video](https://www.youtube.com/watch?v=nTiipMApjAI&t=260).

## The model is a setting, not the memory

Here is the part that changed how I think about it.

![Hermes Model Settings showing the main model, auxiliary tasks, Mixture of Agents, 16 models used and 482 total sessions over 90 days](/blog/ai-agent-memory-hermes-models.jpg)

Over 90 days I used 16 models across 482 sessions on 1 Hermes. Every one of them wrote to the same memory. I never moved a file.

In Hermes you pick a main model, then give each side job its own. Titles and skill search get a cheap model. Review gets a stronger one. The screen says it plainly: these settings apply to new sessions. [See it at 0:39](https://www.youtube.com/watch?v=nTiipMApjAI&t=39).

In a chat app, switching models means switching apps, and your memory stays behind. In Hermes, the memory stays put and the model changes underneath it.

## The 5 layers of Hermes memory

Hermes memory is not 1 file. It is a system with 5 layers, and every one of them sits in the Hermes home folder on my own server. The [Memory Graph](https://www.youtube.com/watch?v=nTiipMApjAI&t=363) in Hermes Desktop plays back what it learned over time.

**1. Built-in memory.** 2 small files load at the start of every session. MEMORY.md is the agent's notes, capped at 2,200 characters. USER.md is about you, capped at 1,375. When a file is full, Hermes refuses the write, and the agent has to make room. [Watch at 8:39](https://www.youtube.com/watch?v=nTiipMApjAI&t=519).

**2. Session history.** Every conversation is kept in a database file on my machine. The agent searches it when you mention a past chat. It is not loaded every time. On my install, auto-archive hides a session after 3 idle days. It is hidden, not deleted, and it comes back when I pick it up again. [Watch at 10:54](https://www.youtube.com/watch?v=nTiipMApjAI&t=654).

**3. Skills and the curator.** A skill is the agent's memory of how to do a kind of work. The agent sees skill names first and loads a full skill only when a job needs it. The curator marks unused agent-made skills stale after 14 days and archives them after 30. Archived skills can be restored. [Watch at 12:40](https://www.youtube.com/watch?v=nTiipMApjAI&t=760).

**4. The memory provider.** Hermes runs [1 long-term memory provider at a time](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers), on top of built-in memory. Mine is OpenViking, and I host it myself. Some providers run in the cloud. Pick one that runs where you want your memory to live. [Watch at 15:44](https://www.youtube.com/watch?v=nTiipMApjAI&t=944).

**5. The workspace.** The job itself lives in my folders. That one gets its own section.

## How Hermes reads your workspace

I build my workspace with [ICM](/icm), Interpretable Context Methodology, created by Jake Van Clief and David McDermott.

Every working folder carries 2 files. AGENTS.md is a small router. CONTEXT.md is the contract: what the folder is for, what it reads, what it makes, and where a human checks it.

The detail that makes it work: Hermes [loads AGENTS.md on its own](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files), from the top of the project down to the folder it is working in. It does not load CONTEXT.md on its own. The agent reads it because the router tells it to. Small router, real instructions 1 step away. [Watch at 18:12](https://www.youtube.com/watch?v=nTiipMApjAI&t=1092).

If you want the starting version of this, my [Hermes agent tutorial](/blog/hermes-agent-tutorial-1-folder-4-files/) builds 1 job folder from scratch.

## Where "yours" stops

Owning the files does not mean nothing leaves your machine. There are 3 limits, and you should know them.

- **The model sees what Hermes loads.** Whatever model runs a job reads the memory Hermes gives it for that job.
- **A cloud memory provider holds its layer on its servers.** Self-hosted keeps it home. Cloud does not.
- **Session history lasts as long as your setting says.** Check yours.

You choose where each layer lives. Nobody chooses for you. [Watch at 24:27](https://www.youtube.com/watch?v=nTiipMApjAI&t=1467).

The 1 thing to do after reading this: open your own Hermes home and find each layer. If you are still setting up, the [Hermes page](/hermes) is the ladder, rung by rung.
