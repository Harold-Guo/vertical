---
name: action-items
description: Extract action items and follow-ups from a PLAUD recording. Use when user mentions action items, follow-ups, commitments, or to-dos.
allowed-tools: Bash Read Edit Write WebSearch WebFetch
---

# Analyze Task

Extract explicit action items and follow-ups from the transcript.

## Getting the Recording

Find the right recording based on what the user provided:

1. **If a recording ID was given** → use it directly
2. **If the user described the meeting** (e.g. "my call with Acme this morning") → discover it:
   - Run `plaud files` to list recent recordings
   - Match by date ("today", "yesterday"), name keywords, or time of day
   - If multiple matches, show the candidates and ask the user to pick
   - If no match, tell the user and ask for clarification

Once you have the file ID, fetch the full data:

```bash
plaud file <id>          # metadata (name, date, duration)
plaud transcript <id>    # full transcript
plaud summary <id>       # AI-generated summary
```

Use the transcript as the primary source for analysis. The summary provides additional context.

## Context Enrichment

If external tools are available (CRM, calendar, etc.), proactively fetch context that would improve the analysis:
- Open tasks for the related Opportunity or Account — to avoid creating duplicates
- Meeting attendees — to correctly assign task owners

Do not fail if no external tools are available — analyze from the transcript alone.

## What To Look For

- Only **explicit commitments** with a clear owner
  - "I'll send over the proposal by Friday" → action item
  - "We should think about..." → NOT an action item
- **Who** is responsible
- **Due date** only if actually stated
- **Priority** based on urgency signals in the conversation

## Analysis Rules

- Every action item MUST be supported by evidence from the transcript
- Prefer fewer, high-confidence items over many speculative ones
- If the transcript has no explicit commitments, report nothing — that's a valid outcome
- Write in professional sales language, not raw transcript quotes
