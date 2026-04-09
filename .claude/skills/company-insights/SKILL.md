---
name: company-insights
description: Extract company insights from a PLAUD recording — industry, revenue, business description. Use when user mentions company info or account details.
allowed-tools: Bash Read Edit Write WebSearch WebFetch
---

# Analyze Account

Analyze the meeting transcript for **Account** insights.

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
- Current Account record (industry, revenue, description, employee count) — needed to detect what changed
- Related Opportunities for business context

Do not fail if no external tools are available — analyze from the transcript alone.

## What To Look For

- **Industry**: Only if explicitly stated or corrected
- **AnnualRevenue**: Only if a specific figure was mentioned
- **Description**: Key business insights worth persisting (strategic direction, product lines, competitive positioning)
- **NumberOfEmployees**: Only if explicitly mentioned
- **Website**: Only if explicitly shared

## Analysis Rules

- Every finding MUST be supported by evidence from the transcript
- Prefer fewer, high-confidence findings over many speculative ones
- If the transcript is casual/social with no business substance, report nothing — that's a valid outcome
- Write in professional sales language, not raw transcript quotes
