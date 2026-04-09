---
name: deal-insights
description: Extract deal insights from a PLAUD recording — stage progression, amount, close date, next steps. Use when user mentions deal, pipeline, opportunity, or stage changes.
allowed-tools: Bash Read Edit Write WebSearch WebFetch
---

# Analyze Opportunity

Analyze the meeting transcript for **Opportunity** insights.

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
- Current Opportunity record (stage, amount, close date, next step) — needed to detect what changed
- Related Account details
- Meeting attendees and their roles

Do not fail if no external tools are available — analyze from the transcript alone.

## What To Look For

- **Stage progression**: Only if the conversation clearly indicates movement. Evidence patterns:
  - "They asked for a demo / want to learn more" → Prospecting → Qualification
  - "They want to see a proposal / asked for pricing" → Qualification → Proposal/Price Quote
  - "Let's discuss pricing terms / negotiate contract" → Proposal → Negotiation/Review
  - "We have verbal agreement / they want to proceed" → Negotiation → Closed Won
  - Do NOT advance stage just because a meeting happened
- **Amount**: Only if a specific number was discussed or revised
- **CloseDate**: Only if explicitly mentioned or clearly shifted
- **NextStep**: Concrete follow-up actions agreed upon (not vague intentions)
- **Probability**: Only if win likelihood was explicitly discussed

## Analysis Rules

- Every finding MUST be supported by evidence from the transcript
- Prefer fewer, high-confidence findings over many speculative ones
- If the transcript is casual/social with no business substance, report nothing — that's a valid outcome
- Write in professional sales language, not raw transcript quotes
