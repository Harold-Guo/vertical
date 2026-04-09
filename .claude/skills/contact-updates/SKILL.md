---
name: contact-updates
description: Detect contact info changes from a PLAUD recording — title, role, phone, email updates. Use when user mentions contact info or role changes.
allowed-tools: Bash Read Edit Write WebSearch WebFetch
---

# Analyze Contact

Analyze the meeting transcript for **Contact** insights.

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
- Current Contact records for meeting participants (title, role, department) — needed to detect what changed
- Meeting attendees list from calendar event

Do not fail if no external tools are available — analyze from the transcript alone.

## What To Look For

- **Title/Role**: Only if the person explicitly stated a change (e.g. "I've been promoted to Director")
- **Phone/Email**: Only if explicitly shared or corrected
- **Department**: Only if explicitly stated
- Do NOT create contacts just because a name was mentioned in the conversation

## Analysis Rules

- Every finding MUST be supported by evidence from the transcript
- Prefer fewer, high-confidence findings over many speculative ones
- If the transcript is casual/social with no business substance, report nothing — that's a valid outcome
- Write in professional sales language, not raw transcript quotes
