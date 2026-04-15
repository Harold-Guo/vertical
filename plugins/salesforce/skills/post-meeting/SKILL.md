---
name: post-meeting
description: One-click post-meeting workflow — analyze a PLAUD recording and sync insights to Salesforce. Use when user says "process my meeting" or "update Salesforce from my last call".
allowed-tools: Bash Read Edit Write WebSearch WebFetch AskUserQuestion
---

# Post-Meeting

End-to-end workflow: analyze a PLAUD recording and push insights to Salesforce.

This skill orchestrates the full flow — you do NOT need to run individual skills separately.

## Preflight Check

Verify access to PLAUD and Salesforce before proceeding. Use whichever tools are available in your environment (CLI, MCP, or API).

- **PLAUD**: confirm the user is authenticated (CLI: `plaud me` / MCP: `get_current_user`)
- **Salesforce**: confirm org connection (CLI: `sf org display` / MCP: `list_all_orgs`)

If either is not connected, attempt login (CLI: `plaud login`, `sf org login web` / MCP: `login`, `org_login_web`). If login still fails, stop and report the error.

## Step 1: Get the Recording

Find the right recording based on what the user provided:

1. **If a recording ID was given** → use it directly
2. **If the user described the meeting** (e.g. "my call with Acme this morning") → discover it:
   - List recent recordings (CLI: `plaud files` / MCP: `list_files`)
   - Match by date ("today", "yesterday"), name keywords, or time of day
   - If multiple matches, show the candidates and ask the user to pick
   - If no match, tell the user and ask for clarification

Fetch all data upfront (CLI: `plaud file`, `plaud transcript`, `plaud summary` / MCP: `get_file` returns metadata, transcript, and summary together).

## Step 2: Identify CRM Context

Search Salesforce for related records. Extract company/person names from the transcript, then search for matching Account, Opportunity, and Contact records.

<details>
<summary>Tool reference</summary>

**CLI** (`sf`):
```bash
sf data search -q "FIND {<company or person name>} RETURNING Account(Id, Name), Opportunity(Id, Name, StageName, Amount, CloseDate), Contact(Id, Name, Title, Email)" --json
```

**MCP** (`run_soql_query`):
- Query: `SELECT Id, Name FROM Account WHERE Name LIKE '%<company>%'`
- Query: `SELECT Id, Name, StageName, Amount, CloseDate FROM Opportunity WHERE AccountId = '<accountId>'`
- Query: `SELECT Id, Name, Title, Email FROM Contact WHERE AccountId = '<accountId>'`
</details>

If multiple results, use transcript context to pick the right ones. If no results, proceed without CRM baseline.

## Step 3: Run All Analysis

Analyze the transcript across all five dimensions. For each, compare against the CRM baseline to detect changes:

1. **Opportunity** — stage progression, amount, close date, next steps
2. **Contact** — title/role changes, new contact info
3. **Account** — industry, revenue, business description updates
4. **Meeting Summary** — concise outcome-focused summary for the Event record
5. **Action Items** — explicit commitments with owner and due date

Apply the same analysis rules as the individual skills:
- Every finding MUST be supported by evidence from the transcript
- Prefer fewer, high-confidence findings over many speculative ones
- If an area has no findings, that's fine — skip it

## Step 4: Present Proposed Changes

Consolidate all findings into a single list of proposed CRM changes:

```
## Analysis Complete — Proposed CRM Updates

### Opportunity: Acme Deal
  - StageName: Qualification → Proposal/Price Quote
  - Amount: $50,000 → $75,000
  - NextStep: "Send revised proposal by Friday"

### Contact: John Smith
  - Title: VP Sales → SVP Sales

### Event: Meeting Summary
  - Description: "Discussed revised pricing for Acme expansion. Agreed on $75K
    scope with proposal due Friday. John confirmed SVP title after Q1 reorg."

### New Tasks
  1. "Send revised proposal to Acme" — Owner: you — Due: Friday
  2. "Schedule technical review with Acme engineering" — Owner: John — Due: next week

No changes detected for: Account
```

Ask the user to review. They can approve, modify, remove, or add changes.

## Step 5: Push to Salesforce

For each approved change, update or create the Salesforce record using whichever tool is available.

<details>
<summary>Tool reference</summary>

**CLI** (`sf`):
```bash
sf data update record -s <ObjectType> -i <RecordId> -v "<Field>='<Value>'" --json
sf data create record -s <ObjectType> -v "<Field>='<Value>'" --json
```

**MCP**: Use the Salesforce MCP tools for record update and creation (e.g. `update_record`, `create_record`, or equivalent).
</details>

Report results:

```
Synced to Salesforce:
  ✓ Opportunity "Acme Deal" — updated 3 fields
  ✓ Contact "John Smith" — updated Title
  ✓ Event — updated Description
  ✓ Task "Send revised proposal" — created
  ✓ Task "Schedule technical review" — created
```

## Error Handling

- If PLAUD is not accessible → stop and report (no transcript = no analysis)
- If Salesforce is not accessible → run analysis only, skip push, suggest user connect Salesforce
- If a push fails → report the error, continue with remaining changes
- If the transcript is casual/social → report "no CRM-relevant findings" and stop
