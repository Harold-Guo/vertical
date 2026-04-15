---
name: deal-insights
description: Extract deal insights from a PLAUD recording — stage progression, amount, close date, next steps. Use when user mentions deal, pipeline, opportunity, or stage changes.
allowed-tools: Bash Read Edit Write WebSearch WebFetch AskUserQuestion
---

# Analyze Opportunity

Analyze the meeting transcript for **Opportunity** insights.

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

Proactively fetch current CRM state to detect what changed. Without a baseline, you can only guess whether a stage is new or already recorded.

1. **Find the Opportunity** — search Salesforce by account or deal name from the transcript
2. **Fetch current state** — read Opportunity fields: StageName, Amount, CloseDate, NextStep, Probability, Description
3. **Fetch related Account** — read the parent Account for business context
4. **Fetch related Contacts** — list Contacts on the Account to match transcript participants

<details>
<summary>Tool reference</summary>

**CLI** (`sf`):
```bash
sf data search -q "FIND {Acme} RETURNING Opportunity(Id, Name, StageName, Amount, CloseDate, NextStep, Probability)" --json
sf data query -q "SELECT Id, Name, StageName, Amount, CloseDate, NextStep, Probability, Description FROM Opportunity WHERE Id = '<id>'" --json
sf data query -q "SELECT Id, Name, Industry, Description FROM Account WHERE Id = '<accountId>'" --json
sf data query -q "SELECT Id, Name, Title, Email FROM Contact WHERE AccountId = '<accountId>'" --json
```

**MCP** (`run_soql_query`):
- Query: `SELECT Id, Name, StageName, Amount, CloseDate, NextStep, Probability, Description FROM Opportunity WHERE Name LIKE '%Acme%'`
- Query: `SELECT Id, Name, Industry, Description FROM Account WHERE Id = '<accountId>'`
- Query: `SELECT Id, Name, Title, Email FROM Contact WHERE AccountId = '<accountId>'`
</details>

If Salesforce is not available, analyze from the transcript alone — but note that findings will be less precise without a baseline to compare against.

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
- When CRM baseline is available, explicitly note what changed (old → new) to make review easier
