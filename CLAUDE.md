# Vertical — PLAUD Sales AI Assistant

## What is this

Mobile-first sales AI assistant that connects PLAUD recording devices with Salesforce CRM. Records meetings, transcribes via ElevenLabs, extracts CRM-relevant data via Gemini, and pushes updates to Salesforce through Composio.

## Project Structure

```
frontend/    — Next.js 16 + React 19 + Tailwind v4 + shadcn/ui
backend/     — FastAPI + Pydantic v2 + Supabase
pencil/      — Design file (vertical_mvp.pen, read via Pencil MCP tools only)
supabase/    — Database config
```

## Running

```bash
# Frontend (port 3001)
cd frontend && npm run dev

# Backend (port 8000)
cd backend && uv run uvicorn main:app --reload

# Build check
cd frontend && npm run build
```

## Demo Mode

When `PLAUD_CLIENT_ID` is not set in `backend/.env`, the backend runs in demo mode:
- Auth is bypassed — all requests use `demo_user`
- Mock data returned for sales, deals, schedule endpoints
- CRM update workflow requires Supabase + Gemini + ElevenLabs even in demo mode

## Frontend

- **Framework**: Next.js 16.1.6 App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with CSS custom properties in `globals.css`
- **Components**: shadcn/ui (New York style), Lucide icons
- **Route groups**: `(main)/` has BottomTabBar, `(detail)/` has back-button header, `(auth)/` for login
- **Phone frame**: 402px centered wrapper on desktop, full-width on mobile (`components/layout/phone-frame.tsx`)
- **API client**: `lib/api.ts` — all fetch calls to backend, base URL from `NEXT_PUBLIC_API_URL` env var
- **API proxy**: `app/api/[...path]/` — Next.js proxy for cross-domain cookie support in production
- **Types**: `lib/types.ts` — all shared TypeScript interfaces
- **Inter-page state**: `sessionStorage` (CRM update flow)

### Routes

| Route | Screen |
|-------|--------|
| `/login` | PLAUD OAuth login |
| `/files` | Recording files list |
| `/sales` | Calendar events + CRM update banner |
| `/sales/onboarding/crm` | Connect CRM (Salesforce) |
| `/sales/onboarding/calendar` | Connect Calendar (Google/Outlook) |
| `/deals/[id]` | Deal detail |
| `/schedule/[id]` | Meeting detail |
| `/update-crm/review` | AI chat reviewing/modifying CRM changes |

## Backend

- **Framework**: FastAPI, Python ≥3.11, managed with `uv`
- **Auth**: PLAUD OAuth → session JWT in cookie. Falls back to demo mode when `PLAUD_CLIENT_ID` is not set.
- **Database**: Supabase (PostgreSQL) via `supabase-py`
- **SSE streaming**: `GET /api/workflows/{id}/stream` for real-time workflow progress

### Key Services

| Service | Purpose |
|---------|---------|
| `services/crm_service.py` | Gemini-based meeting analysis + Composio CRM push |
| `services/transcription.py` | ElevenLabs Scribe v2 STT |
| `services/plaud_api.py` | PLAUD API client (OAuth, file list, file detail) |
| `services/plaud_sync.py` | Sync PLAUD recordings to local DB with title diff |
| `services/workflow.py` | Workflow state machine (Supabase-backed) |
| `skills/sales_analyst/` | Gemini extraction agents per CRM object type |

### CRM Update Workflow

```
Create Workflow → Transcribe (ElevenLabs) → Analyze (Gemini) → Review (Chat) → Push to CRM (Composio)
```

Tracked in `workflows` + `workflow_tasks` tables. Progress streamed via SSE.

### API Endpoints

All prefixed with `/api`:

**Auth:**
- `GET /auth/login` — initiate PLAUD OAuth
- `GET /auth/callback` — OAuth callback
- `POST /auth/logout` — clear session
- `GET /auth/me` — current user info

**Files & Recordings:**
- `GET /files` — recording files list (syncs from PLAUD)
- `POST /recordings/{id}/link` — link recording to event
- `POST /recordings/{id}/unlink` — unlink recording

**Sales & Events:**
- `GET /sales/schedule` — today/tomorrow meetings
- `GET /sales/events` — calendar events
- `POST /sales/events/sync` — sync events from calendar

**Deals:**
- `GET /deals` — deal list
- `GET /deals/{id}` — deal detail
- `POST /deals/sync` — sync deals from Salesforce

**Integrations (Composio):**
- `GET /integrations/crm/status` — CRM connection status
- `GET /integrations/calendar/status` — calendar status
- `POST /integrations/connect` — initiate OAuth connection
- `GET /integrations/connect/redirect` — server-side 302 OAuth redirect
- `POST /integrations/disconnect` — disconnect provider

**CRM Update Workflow:**
- `POST /workflows` — create workflow
- `GET /workflows/{id}` — get workflow status
- `GET /workflows/{id}/stream` — SSE progress stream
- `POST /workflows/{id}/chat` — chat with AI about extractions
- `PUT /workflows/{id}/extractions` — direct edit extractions
- `POST /workflows/{id}/confirm` — push to CRM
- `POST /workflows/transcribe-voice` — voice input transcription

**Webhooks:**
- `POST /webhooks/elevenlabs` — ElevenLabs transcription callback
- `POST /webhooks/composio` — Composio event trigger callback

## Design

- Design source: `pencil/vertical_mvp.pen` — **must use Pencil MCP tools** to read, never Read/Grep
- Color theme defined in `frontend/app/globals.css` CSS custom properties
- Key colors: bg #F9F9F9, card #FFFFFF, accent-blue #1A89FF, green #22C55E, red #FB2C36
