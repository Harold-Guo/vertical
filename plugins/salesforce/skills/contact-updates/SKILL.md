---
name: contact-updates
description: Detect contact info changes from a PLAUD recording — title, role, phone, email updates. Use when user mentions contact info or role changes.
allowed-tools: Bash Read Edit Write WebSearch WebFetch AskUserQuestion
---

# Analyze Contact

Analyze the meeting transcript for **Contact** insights.

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

Proactively fetch current Contact records to detect what changed. Without a baseline, you cannot distinguish a new title from one already on file.

1. **Identify participants** — extract names from the transcript
2. **Search Contacts** — find each participant in Salesforce by name
3. **Fetch current state** — read Contact fields: Title, Phone, Email, Department
4. **Cross-reference** — compare transcript mentions against current CRM data

<details>
<summary>Tool reference</summary>

**CLI** (`sf`):
```bash
sf data search -q "FIND {John Smith} RETURNING Contact(Id, Name, Title, Phone, Email, Department, AccountId)" --json
sf data query -q "SELECT Id, Name, Title, Phone, Email, Department FROM Contact WHERE Id = '<id>'" --json
```

**MCP** (`run_soql_query`):
- Query: `SELECT Id, Name, Title, Phone, Email, Department, AccountId FROM Contact WHERE Name LIKE '%John Smith%'`
</details>

If Salesforce is not available, analyze from the transcript alone — but note that all findings will be "new information" without confirmation of whether it's already recorded.

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
- When CRM baseline is available, explicitly note what changed (old → new) to make review easier
