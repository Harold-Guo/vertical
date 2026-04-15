---
name: action-items
description: Extract action items and follow-ups from a PLAUD recording. Use when user mentions action items, follow-ups, commitments, or to-dos.
allowed-tools: Bash Read Edit Write WebSearch WebFetch AskUserQuestion
---

# Analyze Task

Extract explicit action items and follow-ups from the transcript.

## Preflight Check

Verify access to PLAUD and Salesforce before proceeding. Use whichever tools are available in your environment (CLI, MCP, or API).

- **PLAUD**: confirm the user is authenticated (CLI: `plaud me` / MCP: `get_current_user`)
- **Salesforce**: confirm org connection (CLI: `sf org display` / MCP: `list_all_orgs`)

If either is not connected, attempt login (CLI: `plaud login`, `sf org login web` / MCP: `login`, `org_login_web`). If login still fails, stop and report the error.

## Getting the Recording

Find the right recording based on what the user provided:

1. **If a recording ID was given** → use it directly
2. **If the user described the meeting** (e.g. "my call with Acme this morning") → discover it:
   - List recent recordings (CLI: `plaud files` / MCP: `list_files`)
   - Match by date ("today", "yesterday"), name keywords, or time of day
   - If multiple matches, show the candidates and ask the user to pick
   - If no match, tell the user and ask for clarification

Once you have the file ID, fetch the full data (CLI: `plaud file`, `plaud transcript`, `plaud summary` / MCP: `get_file` returns metadata, transcript, and summary together).

Use the transcript as the primary source for analysis. The summary provides additional context.

## Context Enrichment via Salesforce

Proactively fetch existing tasks and context to avoid creating duplicates.

1. **Find the Opportunity/Account** — search Salesforce by account/deal name from the transcript
2. **Fetch open Tasks** — list open Tasks related to the Opportunity or Account to avoid duplicates
3. **Identify participants** — search Contacts to correctly assign task owners
4. **Get record IDs** — note the Opportunity or Account ID for linking new Tasks

<details>
<summary>Tool reference</summary>

**CLI** (`sf`):
```bash
sf data search -q "FIND {Acme} RETURNING Opportunity(Id, Name), Account(Id, Name)" --json
sf data query -q "SELECT Id, Subject, Status, ActivityDate, WhoId, WhatId FROM Task WHERE WhatId = '<opportunityId>' AND IsClosed = false" --json
sf data search -q "FIND {John Smith} RETURNING Contact(Id, Name, Title)" --json
```

**MCP** (`run_soql_query`):
- Query: `SELECT Id, Name FROM Opportunity WHERE Name LIKE '%Acme%'`
- Query: `SELECT Id, Subject, Status, ActivityDate, WhoId, WhatId FROM Task WHERE WhatId = '<opportunityId>' AND IsClosed = false`
- Query: `SELECT Id, Name, Title FROM Contact WHERE Name LIKE '%John Smith%'`
</details>

If Salesforce is not available, analyze from the transcript alone — but note that duplicate detection will not be possible.

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
- When existing tasks are available from CRM, flag potential duplicates rather than creating new ones
