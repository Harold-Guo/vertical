---
name: company-insights
description: Extract company insights from a PLAUD recording — industry, revenue, business description. Use when user mentions company info or account details.
allowed-tools: Bash Read Edit Write WebSearch WebFetch AskUserQuestion
---

# Analyze Account

Analyze the meeting transcript for **Account** insights.

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

Proactively fetch current Account record to detect what changed. Without a baseline, you cannot tell whether "We're in fintech" is new info or already on file.

1. **Find the Account** — search Salesforce by company name from the transcript
2. **Fetch current state** — read Account fields: Industry, AnnualRevenue, Description, NumberOfEmployees, Website
3. **Fetch related Opportunities** — list open Opportunities for business context

<details>
<summary>Tool reference</summary>

**CLI** (`sf`):
```bash
sf data search -q "FIND {Acme Corp} RETURNING Account(Id, Name, Industry, AnnualRevenue, Description, NumberOfEmployees, Website)" --json
sf data query -q "SELECT Id, Name, Industry, AnnualRevenue, Description, NumberOfEmployees, Website FROM Account WHERE Id = '<id>'" --json
sf data query -q "SELECT Id, Name, StageName, Amount FROM Opportunity WHERE AccountId = '<accountId>' AND IsClosed = false" --json
```

**MCP** (`run_soql_query`):
- Query: `SELECT Id, Name, Industry, AnnualRevenue, Description, NumberOfEmployees, Website FROM Account WHERE Name LIKE '%Acme Corp%'`
- Query: `SELECT Id, Name, StageName, Amount FROM Opportunity WHERE AccountId = '<accountId>' AND IsClosed = false`
</details>

If Salesforce is not available, analyze from the transcript alone — but note that all findings will be "new information" without confirmation of whether it's already recorded.

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
- When CRM baseline is available, explicitly note what changed (old → new) to make review easier
