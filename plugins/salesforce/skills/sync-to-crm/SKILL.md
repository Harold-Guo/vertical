---
name: sync-to-crm
description: Push proposed changes from analysis skills to Salesforce. Use after running analysis skills when user wants to update CRM records.
allowed-tools: Bash Read Edit Write AskUserQuestion
---

# Sync to CRM

Push proposed changes to Salesforce. This skill runs AFTER analysis skills have produced findings.

## Preflight Check

Verify access to Salesforce before proceeding. Use whichever tools are available in your environment (CLI, MCP, or API).

- **Salesforce**: confirm org connection (CLI: `sf org display` / MCP: `list_all_orgs`)

If not connected, attempt login (CLI: `sf org login web` / MCP: `org_login_web`). If login still fails, stop and report the error.

Analysis findings must be ready — this skill does not analyze transcripts itself.

## Input

This skill expects a set of proposed changes, each with:

- **object_type**: Salesforce object (Opportunity, Contact, Account, Task, Event)
- **action**: `update` or `create`
- **record_id**: Salesforce record ID (for updates; null for creates)
- **changes**: list of field → value pairs

## Step 1: Present Changes for Review

Before pushing anything, present ALL proposed changes to the user in a clear format:

```
1. [update] Opportunity "Acme Deal"
   - StageName: Qualification → Proposal/Price Quote
   - Amount: $50,000 → $75,000
   - NextStep: "Send revised proposal by Friday"

2. [create] Task
   - Subject: "Send revised proposal to Acme"
   - ActivityDate: 2026-04-18
   - Priority: High

3. [update] Contact "John Smith"
   - Title: VP Sales → SVP Sales
```

Ask the user to confirm. They can:
- **Approve all**: "looks good" / "push it"
- **Remove changes**: "skip #3" / "remove the contact update"
- **Modify**: "change the close date to September 30"
- **Cancel**: "don't push anything"

## Step 2: Push Approved Changes

For each approved change, update or create the Salesforce record using whichever tool is available.

**Update an existing record** — set the specified fields on the record by ID.

**Create a new record** — insert a new record with the specified fields.

<details>
<summary>Tool reference</summary>

**CLI** (`sf`):
```bash
sf data update record -s Opportunity -i 006xx000001abc -v "StageName='Proposal/Price Quote' Amount=75000 NextStep='Send revised proposal by Friday'" --json
sf data create record -s Task -v "Subject='Send revised proposal to Acme' ActivityDate=2026-04-18 Priority='High' Status='Not Started' WhatId='006xx000001abc'" --json
```

**MCP**: Use the Salesforce MCP tools for record update and creation (e.g. `update_record`, `create_record`, or equivalent).
</details>

## Step 3: Report Results

After pushing, report per-change status:

```
Pushed 2/3 changes to Salesforce:
  ✓ Opportunity "Acme Deal" — updated StageName, Amount, NextStep
  ✓ Task "Send revised proposal to Acme" — created
  ✗ Contact "John Smith" — skipped by user
```

## Error Handling

- If a push fails, report the error and continue with remaining changes
- Do NOT retry automatically — report the failure and let the user decide
- Common errors:
  - `INVALID_FIELD`: field name is wrong — check Salesforce API names
  - `INSUFFICIENT_ACCESS`: user doesn't have permission to update this record
  - `ENTITY_IS_DELETED`: record was deleted — skip it
