---
name: file-summary
description: Generate a meeting summary from a PLAUD recording file. Use when user wants to summarize a specific recording, call, or meeting file.
allowed-tools: Bash Read Edit Write WebSearch WebFetch AskUserQuestion
---

# Summary

Generate a meeting summary from the recording transcript.

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

Once you have the file ID, fetch the transcript (CLI: `plaud file`, `plaud transcript` / MCP: `get_file` returns metadata and transcript together).

Only use the raw transcript for summarization. Do NOT fetch the AI-generated summary — that would result in summarizing a summary, losing detail and accuracy.

## Context Enrichment via Salesforce

Proactively fetch CRM context to produce a richer, more relevant summary. Context helps frame the meeting in terms of deal/account status.

1. **Find the Opportunity** — search Salesforce by account/deal name from the transcript
2. **Fetch Opportunity state** — read current stage, amount, next steps to frame the meeting's significance
3. **Fetch Account details** — read industry, description for business context
4. **Identify participant roles** — search Contacts to identify who attended

<details>
<summary>Tool reference</summary>

**CLI** (`sf`):
```bash
sf data search -q "FIND {Acme} RETURNING Opportunity(Id, Name, StageName, Amount, CloseDate, NextStep)" --json
sf data query -q "SELECT Id, Name, Industry, Description FROM Account WHERE Id = '<accountId>'" --json
sf data search -q "FIND {John Smith} RETURNING Contact(Id, Name, Title)" --json
```

**MCP** (`run_soql_query`):
- Query: `SELECT Id, Name, StageName, Amount, CloseDate, NextStep FROM Opportunity WHERE Name LIKE '%Acme%'`
- Query: `SELECT Id, Name, Industry, Description FROM Account WHERE Id = '<accountId>'`
- Query: `SELECT Id, Name, Title FROM Contact WHERE Name LIKE '%John Smith%'`
</details>

If Salesforce is not available, summarize from the transcript alone.

## What To Produce

- A concise 2-3 sentence summary focusing on **outcomes**, not a play-by-play
- Past tense, professional tone
- Key decisions made, action items agreed, next steps
- When CRM context is available, frame the summary relative to the deal stage (e.g. "moved the Acme deal from Qualification to Proposal stage")

## Analysis Rules

- Focus on what was decided or agreed, not who said what
- If the meeting was casual/social with no business substance, say so
- Write in professional sales language, not raw transcript quotes
