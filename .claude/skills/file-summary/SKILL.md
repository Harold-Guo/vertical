---
name: file-summary
description: Generate a meeting summary from a PLAUD recording file. Use when user wants to summarize a specific recording, call, or meeting file.
allowed-tools: Bash Read Edit Write WebSearch WebFetch
---

# Summary

Generate a meeting summary from the recording transcript.

## Getting the Recording

Find the right recording based on what the user provided:

1. **If a recording ID was given** → use it directly
2. **If the user described the meeting** (e.g. "my call with Acme this morning") → discover it:
   - Run `plaud files` to list recent recordings
   - Match by date ("today", "yesterday"), name keywords, or time of day
   - If multiple matches, show the candidates and ask the user to pick
   - If no match, tell the user and ask for clarification

Once you have the file ID, fetch the transcript:

```bash
plaud file <id>          # metadata (name, date, duration)
plaud transcript <id>    # full transcript
```

Only use the raw transcript for summarization. Do NOT fetch `plaud summary` — that is an AI-generated summary and would result in summarizing a summary, losing detail and accuracy.

## Context Enrichment

If external tools are available (CRM, calendar, etc.), proactively fetch context that would improve the summary:
- The deal/opportunity this meeting relates to
- Account background
- Meeting attendees and their roles
- Prior meeting notes

Do not fail if no external tools are available — summarize from the transcript alone.

## What To Produce

- A concise 2-3 sentence summary focusing on **outcomes**, not a play-by-play
- Past tense, professional tone
- Key decisions made, action items agreed, next steps

## Analysis Rules

- Focus on what was decided or agreed, not who said what
- If the meeting was casual/social with no business substance, say so
- Write in professional sales language, not raw transcript quotes
