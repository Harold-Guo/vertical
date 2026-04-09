# Plugin: Field Sales (plaud-skills/plugins/field-sales)

## Overview

AI skill plugin that analyzes sales meeting transcripts from PLAUD recordings and proposes structured CRM updates. Designed to work with Claude, Gemini, Codex, and other AI agent platforms via skill/connector configuration.

**Input**: PLAUD meeting transcript (from `plaud transcript <id>`)
**Output**: Proposed CRM field-level changes, ready to push to Salesforce

---

## Architecture

```
User says: "Analyze my last sales call and update Salesforce"
    |
    v
Agent (Claude/Gemini/Codex)
    |
    ├── PLAUD CLI: plaud transcript <id> → raw transcript text
    |
    ├── Skills (per CRM object type, run in parallel):
    |   ├── contact       — detect title/role/info changes
    |   ├── opportunity   — stage progression, amount, close date, next steps
    |   ├── account       — industry, revenue, description updates
    |   ├── event         — meeting summary for the calendar event
    |   └── task          — explicit commitments → new Salesforce Tasks
    |
    ├── Review (agent chat):
    |   modify / remove / add changes via natural language
    |
    └── Connector: Salesforce
        push approved changes via Composio API
```

---

## Skills

Each skill is a focused analysis prompt that reads a transcript + current CRM state and outputs proposed changes for ONE object type only. Skills run in parallel for speed.

### Shared Input Schema

All skills receive:

```yaml
transcript: string        # Full meeting transcript text
crm_context:              # Current CRM state (optional, improves accuracy)
  event:                  # Calendar event this meeting relates to
    id: string
    subject: string
    start_time: string
    end_time: string
  opportunity:            # Current opportunity record (if linked)
    Id: string
    StageName: string
    Amount: number
    CloseDate: string
    NextStep: string
    # ... other fields
  account:                # Current account record
    Id: string
    Industry: string
    # ...
  participants:           # Meeting attendees
    - name: string
      email: string
      role: string
  user_feedback: string   # Optional: rep's verbal first impression
```

### Shared Output Schema

```yaml
proposed_changes:
  - id: string            # e.g. "chg_1"
    object_type: string   # Salesforce object: Opportunity, Contact, etc.
    object_name: string   # Display name (e.g. "Acme Deal")
    record_id: string     # Salesforce record ID (null for create)
    action: update | create
    changes:
      - field: string     # Salesforce API field name (e.g. "StageName")
        label: string     # Human-readable (e.g. "Stage")
        old: string       # Current value or null
        new: string       # Proposed value
    approved: boolean
summary: string           # 1-2 sentence assessment
```

### Skill: contact

Detects Contact record updates from transcript.

- Update title/role only if explicitly stated as changed
- Do NOT create contacts just because a name was mentioned
- Fields: Title, Phone, Email, Department

### Skill: opportunity

Detects Opportunity movement from transcript. Most complex skill.

- Stage progression with evidence-based rules:
  - "Asked for demo" → Prospecting → Qualification
  - "Want a proposal / pricing" → Qualification → Proposal
  - "Negotiate terms" → Proposal → Negotiation
  - "Verbal agreement / want to proceed" → Negotiation → Closed Won
  - Do NOT advance just because a meeting happened
- Amount: only if specific number discussed
- CloseDate: only if explicitly mentioned
- NextStep: concrete follow-ups, not vague intentions
- Fields: StageName, Amount, CloseDate, NextStep, Probability, Description

### Skill: account

Detects Account-level updates.

- Industry, AnnualRevenue: only if explicitly stated
- Description: key business insights worth persisting
- Fields: Industry, AnnualRevenue, Description, NumberOfEmployees, Website

### Skill: event

Writes a meeting summary back to the calendar Event record.

- 2-3 sentence summary focusing on outcomes, not play-by-play
- Past tense, professional tone
- Fields: Description, Subject

### Skill: task

Creates new Task records for explicit commitments.

- Only for statements with a clear owner: "I'll send the proposal by Friday" = Task
- "We should think about..." = NOT a Task
- Due date only if actually stated
- Fields: Subject, Description, ActivityDate, WhoId, WhatId, Priority, Status

---

## Connector: Salesforce

Pushes approved proposed changes to Salesforce.

### Operations

| Action | Salesforce API | Description |
|--------|---------------|-------------|
| `update` | `SALESFORCE_SOBJECT_ROWS_UPDATE` | Update fields on existing record |
| `create` | `SALESFORCE_CREATE_S_OBJECT_RECORD` | Create new record (e.g. Task) |

### Auth

Uses Composio for OAuth. User connects Salesforce once, then all skills can push via the connector.

Connection flow:
1. User triggers connection (OAuth redirect via Composio)
2. Composio stores access/refresh tokens per user
3. Connector uses `composio.tools.execute()` with `connected_account_id`

### Push Logic

- Only push changes where `approved: true`
- Push one-by-one with progress tracking
- Report success/failure per change
- On partial failure: report which succeeded, allow retry

---

## Review Chat

After skills generate proposed changes, user can review via natural language:

- **modify**: "Change the close date to September 30"
- **remove**: "Remove the stage change, it's premature"
- **add**: "Add a follow-up task: send proposal by Friday"
- **confirm**: "Looks good, push to Salesforce"

Review tools:
- `modify_change(change_id, field, new_value)` — edit a field
- `remove_change(change_id, fields?)` — remove change or specific fields
- `add_change(object_type, action, fields[])` — add new change
- `confirm_and_push()` — push all approved changes

---

## Existing Implementation Reference

This plugin is extracted from the vertical demo app. Key source files:

| Plugin Component | Source in vertical/ |
|-----------------|-------------------|
| Analysis prompts (per object type) | `backend/skills/sales_analyst/prompts.py` |
| Output schemas (ProposedChange, FieldDiff) | `backend/skills/sales_analyst/schemas.py` |
| Parallel analysis orchestration | `backend/skills/sales_analyst/agent.py` |
| Review chat tools | `backend/skills/sales_analyst/tools.py` |
| Salesforce push connector | `backend/skills/connectors/salesforce.py` |
| CRM service (workflow glue) | `backend/services/crm_service.py` |

### What to extract vs. what to leave behind

**Extract (portable, model-agnostic):**
- Analysis prompts per object type (the instructions in `_ANALYSIS_CATEGORIES`)
- Output schema (ProposedChange format)
- Review chat prompt + tool definitions
- Salesforce push logic

**Leave behind (vertical-app specific):**
- Supabase workflow state machine
- SSE streaming progress
- FastAPI endpoints
- Gemini-specific SDK calls (plugin should be model-agnostic)

### Key design decisions for plugin

1. **Model-agnostic**: Prompts as markdown, not hardcoded to Gemini SDK. Let the host agent (Claude/Gemini/Codex) handle the LLM call.
2. **Skills as .md files**: Each skill is a prompt template + schema definition. The agent reads the skill and executes it.
3. **Connector as separate unit**: Salesforce push logic is independent from analysis. Other connectors (HubSpot) plug into the same `proposed_changes` schema.

---

## MVP Scope

- [x] 5 skills: contact, opportunity, account, event, task
- [x] 1 connector: Salesforce (via Composio)
- [ ] Package as installable plugin (Claude Code / Cowork format)
- [ ] AGENTS.md entry point
- [ ] Test with real PLAUD transcript

## Future

- HubSpot connector
- `deal-summary` command: chains all skills + generates executive brief
- Batch mode: process multiple recordings in one command
- CRM context auto-fetch: query Salesforce for current state before analysis

---

**Related**: [[gtm-strategy-options]], [[architecture]]
