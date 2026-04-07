# System Architecture

> Last updated: 2026-04-03

## Overview

PLAUD Vertical is a mobile-first AI sales assistant. It connects PLAUD recording devices to Salesforce CRM through a pipeline: **record → transcribe → extract → review → push**.

```
PLAUD Device
    │
    ▼
PLAUD API ──► Backend (FastAPI) ──► ElevenLabs (STT)
                   │                      │
                   │◄─────────────────────┘ webhook
                   │
                   ▼
              Gemini AI (extraction)
                   │
                   ▼
              User Review (chat)
                   │
                   ▼
              Composio ──► Salesforce CRM
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16.1.6, React 19, Tailwind CSS v4, shadcn/ui |
| Backend | FastAPI (Python ≥3.11), UV package manager |
| Database | Supabase (PostgreSQL) |
| AI / Extraction | Google Gemini (`gemini-3-flash-preview`), structured output |
| Speech-to-Text | ElevenLabs Scribe v2 |
| CRM / Calendar | Composio (abstract OAuth connector layer) |
| Auth | PLAUD OAuth → session JWT (7-day, HTTP-only cookie) |

---

## CRM Update Workflow

The core feature. Orchestrated by `services/workflow.py` and `services/crm_service.py`.

### State Machine

```
CREATED (0)
    │
    ▼
TRANSCRIBING (1) ──► [ElevenLabs STT per recording, async via webhook]
    │
    ▼
EXTRACTING (2) ──► [Gemini parallel extraction per recording]
    │
    ▼
REVIEW (3) ──► [User chat to approve / modify proposed changes]
    │
    ▼
PUSHING (4) ──► [Composio pushes each approved change to Salesforce]
    │
    ▼
DONE (5)         FAILED (6)
```

### Task States (per recording)

Each workflow has N tasks, one per recording:

`PENDING (0)` → `TRANSCRIBING (1)` → `COMPLETED (2)` or `FAILED (3)`

When all tasks reach a terminal state, the workflow advances to EXTRACTING. If all failed, workflow goes to FAILED.

### Key Functions

| Function | Location | Description |
|----------|----------|-------------|
| `create_workflow()` | `workflow.py` | Creates workflow + N tasks, kicks off transcription |
| `on_task_completed()` | `workflow.py` | Marks task done, advances state if all done |
| `run_analysis()` | `crm_service.py` | Concurrent Gemini extraction per recording |
| `chat_review()` | `crm_service.py` | LLM-powered chat to modify proposed changes |
| `push_to_crm()` | `crm_service.py` | Pushes approved changes via Composio |

### Proposed Change Lifecycle

```python
ProposedChange = {
    "id": "chg_1",
    "object_type": "Opportunity" | "Account" | "Event" | "Task" | "Contact",
    "object_name": str,
    "record_id": str | None,      # Salesforce record ID
    "action": "update" | "create",
    "changes": [{"field", "label", "old?", "new"}],
    "approved": bool
}
```

1. Gemini creates → stored in `workflows.extractions`
2. User modifies via `/workflows/{id}/chat`
3. User approves → `approved: true`
4. Composio pushes one by one
5. Recording marked `crm_sync_status = 2` (synced)

---

## Database Schema

### Core Tables

#### `workflows`
```sql
id           UUID PK
event_id     UUID FK → events (nullable)
user_id      UUID FK → users (nullable)
state        SMALLINT (0–6, see states above)
extractions  JSONB     -- proposed changes per recording
messages     JSONB     -- LLM conversation context
created_at, updated_at TIMESTAMPTZ
```

#### `workflow_tasks`
```sql
id           UUID PK
workflow_id  UUID FK → workflows ON DELETE CASCADE
type         TEXT ('plaud' | 'local')
recording_id TEXT
state        SMALLINT (0–3)
transcript   TEXT
error        TEXT
created_at, updated_at TIMESTAMPTZ
```

#### `workflow_messages`
```sql
id           UUID PK
workflow_id  UUID FK → workflows ON DELETE CASCADE
role         SMALLINT (0=user, 1=assistant)
type         SMALLINT (0=text, 1=extraction, 2=progress)
content      JSONB     -- {text, proposed_changes?, recording_id?, should_push?}
created_at   TIMESTAMPTZ
```

#### `recordings`
```sql
id               UUID PK
user_id          UUID FK → users (nullable)
event_id         UUID FK → events
plaud_file_id    TEXT
title            TEXT
duration_seconds INTEGER
crm_sync_status  SMALLINT (1=pending, 2=synced)
transcript       TEXT
recorded_at, created_at TIMESTAMPTZ
```

#### `events`
```sql
id           UUID PK
user_id      UUID FK → users (nullable)
title        TEXT
start_time, end_time TIMESTAMPTZ
attendees    JSONB    -- [{email, name, role}]
sales_details JSONB  -- {opportunity, account, participants, user_feedback}
merge_key    TEXT
created_at, updated_at TIMESTAMPTZ
```

#### `user_integrations`
```sql
id                  UUID PK
user_id             UUID FK → users ON DELETE CASCADE
provider            TEXT ('google' | 'outlook' | 'salesforce')
composio_entity_id  TEXT
connected           BOOLEAN
UNIQUE(user_id, provider)
```

---

## SSE Streaming

**Endpoint:** `GET /api/workflows/{id}/stream`

Polls state every 1 second, emits only on change:

```json
{
  "workflow_state": 2,
  "tasks_total": 3,
  "tasks_completed": 2,
  "tasks_failed": 0,
  "message": "Transcribing: 2/3 completed",
  "analysis_progress": {
    "completed": 4,
    "total": 12,
    "recording_index": 0,
    "recording_total": 3
  },
  "push_progress": {
    "completed": 3,
    "total": 8,
    "percent": 37
  },
  "extractions": {}
}
```

---

## Auth Flow

1. `GET /api/auth/login` → returns PLAUD OAuth URL
2. User authenticates on PLAUD → redirected to `GET /api/auth/callback?code=xxx`
3. Backend exchanges code → gets PLAUD access/refresh tokens
4. Fetches PLAUD user profile → upserts into `users` table
5. Issues 7-day session JWT → stored in HTTP-only cookie `session`
6. All requests verify JWT via `middleware/auth.py:get_current_user()`
7. PLAUD tokens auto-refresh with 5-min buffer before expiry

**Demo mode:** When `PLAUD_CLIENT_ID` is not set, auth is bypassed and all requests use `demo_user`. Mock data returned for files, sales, deals, schedule — but real CRM workflow (Supabase + Gemini + ElevenLabs) still runs.

---

## Key Services

| Service | File | Responsibility |
|---------|------|----------------|
| Workflow state machine | `services/workflow.py` | State transitions, task tracking |
| CRM analysis + push | `services/crm_service.py` | Gemini extraction, chat review, Composio push |
| Transcription | `services/transcription.py` | ElevenLabs STT (webhook + sync) |
| PLAUD API client | `services/plaud_api.py` | File listing, presigned URLs, token refresh |
| PLAUD sync | `services/plaud_sync.py` | Diff and sync PLAUD files into DB |
| Messages | `services/messages.py` | Workflow message CRUD |

## AI Skills

Located in `skills/sales_analyst/`:

| File | Responsibility |
|------|----------------|
| `agent.py` | Gemini calls — `run_analysis()`, `chat_review()` |
| `schemas.py` | `ProposedChange`, `AnalysisResult` Pydantic models |
| `prompts.py` | System prompts for analysis categories and review chat |
| `tools.py` | Tool declarations for review chat tool-use |

`skills/connectors/salesforce.py` — Composio push:
- `SALESFORCE_SOBJECT_ROWS_UPDATE` — update existing record
- `SALESFORCE_CREATE_S_OBJECT_RECORD` — create new record

---

## API Endpoints

All prefixed `/api`. Full list in [[../../CLAUDE.md]].

Key workflow endpoints:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/workflows` | Create workflow, start transcription |
| `GET` | `/workflows/{id}` | Get workflow + tasks |
| `GET` | `/workflows/{id}/stream` | SSE progress stream |
| `POST` | `/workflows/{id}/chat` | Chat to review/modify changes |
| `PUT` | `/workflows/{id}/extractions` | Direct edit extractions |
| `POST` | `/workflows/{id}/confirm` | Push to Salesforce |
| `POST` | `/webhooks/elevenlabs/transcription` | ElevenLabs STT callback |
| `POST` | `/webhooks/composio` | Composio event trigger |
