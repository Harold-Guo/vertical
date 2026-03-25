# Vertical — PLAUD Sales AI Assistant

A mobile-first sales AI assistant that connects PLAUD recording devices with CRM systems. Records meetings, transcribes them via ElevenLabs, extracts CRM-relevant data via Gemini, and pushes updates to Salesforce.

## Architecture

```
frontend/    — Next.js 16 + React 19 + Tailwind v4 + shadcn/ui
backend/     — FastAPI + Python 3.11+ (uv)
supabase/    — Database schema (Supabase / PostgreSQL)
```

**Key integrations:**
- **PLAUD** — OAuth login + recording file sync
- **Composio** — Salesforce CRM + Google/Outlook Calendar connectors
- **ElevenLabs** — Speech-to-text (Scribe v2)
- **Gemini** — Meeting analysis + CRM extraction (Gemini 2.5 Flash)
- **Supabase** — PostgreSQL database + auth session storage

## Prerequisites

- Node.js ≥ 18
- Python ≥ 3.11
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- Supabase account (cloud or local via `supabase start`)

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url> && cd vertical

# Frontend
cd frontend && npm install

# Backend
cd ../backend && uv sync
```

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Fill in required values (see .env.example for details)

# Frontend
cp frontend/.env.example frontend/.env.local
# Fill in Supabase credentials
```

See the `.env.example` files for full documentation of each variable.

### 3. Set up the database

The project uses Supabase as its PostgreSQL database. You can use either:

- **Supabase Cloud**: Create a project at [supabase.com](https://supabase.com), then copy the URL and service role key into `backend/.env`.
- **Local Supabase**: Run `supabase start` in the project root (requires Docker). Uses default local credentials.

### 4. Run

```bash
# Terminal 1 — Backend (port 8000)
cd backend && uv run uvicorn main:app --reload

# Terminal 2 — Frontend (port 3001)
cd frontend && npm run dev
```

Open http://localhost:3001 in your browser.

### 5. (Optional) Set up external services

Without external service credentials, the app runs in **demo mode** — auth is bypassed and mock data is used. To enable real integrations:

| Service | What it does | Required env vars |
|---------|-------------|-------------------|
| PLAUD | OAuth login, recording sync | `PLAUD_CLIENT_ID`, `PLAUD_CLIENT_SECRET`, `SESSION_SECRET` |
| Supabase | Database | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| Composio | CRM + Calendar connectors | `COMPOSIO_API_KEY`, `COMPOSIO_*_AUTH_CONFIG_ID` |
| ElevenLabs | Transcription (STT) | `ELEVENLABS_API_KEY` |
| Gemini | Meeting analysis | `GEMINI_API_KEY` |

## Project Structure

### Frontend (`frontend/`)

- **Framework**: Next.js 16 App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with CSS custom properties
- **Components**: shadcn/ui (New York style), Lucide icons
- **Route groups**: `(main)/` has bottom tab bar, `(detail)/` has back-button header, `(auth)/` for login
- **Phone frame**: 402px centered wrapper on desktop, full-width on mobile
- **API client**: `lib/api.ts` — all backend calls with credential forwarding
- **API proxy**: `app/api/[...path]/` — Next.js proxy for cross-domain cookie support in production

#### Routes

| Route | Screen |
|-------|--------|
| `/login` | PLAUD OAuth login |
| `/files` | Recording files list |
| `/sales` | Calendar events + CRM update banner |
| `/sales/onboarding/crm` | Connect Salesforce |
| `/sales/onboarding/calendar` | Connect Google/Outlook Calendar |
| `/deals/[id]` | Deal detail (from Salesforce) |
| `/schedule/[id]` | Meeting detail |
| `/update-crm/review` | AI chat reviewing CRM changes |

### Backend (`backend/`)

- **Framework**: FastAPI, Python ≥ 3.11, managed with [uv](https://docs.astral.sh/uv/)
- **Auth**: PLAUD OAuth → session JWT in cookie. When `PLAUD_CLIENT_ID` is not set, falls back to demo mode (no auth required).
- **Database**: Supabase (PostgreSQL) via `supabase-py`

#### Key modules

| Module | Purpose |
|--------|---------|
| `routers/auth.py` | PLAUD OAuth login/callback/logout |
| `routers/workflows.py` | CRM update workflow (create → transcribe → analyze → review → push) |
| `routers/webhooks.py` | ElevenLabs + Composio webhook handlers |
| `routers/integrations.py` | Composio CRM/Calendar connection management |
| `services/crm_service.py` | Gemini-based meeting analysis + CRM push |
| `services/transcription.py` | ElevenLabs Scribe v2 transcription |
| `services/plaud_api.py` | PLAUD API client (file list, file detail, OAuth) |
| `services/plaud_sync.py` | Sync PLAUD recordings to local DB |
| `services/workflow.py` | Workflow state machine (Supabase-backed) |
| `skills/sales_analyst/` | Gemini extraction agents per CRM object type |

#### CRM Update Workflow

The core flow for updating CRM from meeting recordings:

```
Create Workflow → Transcribe (ElevenLabs) → Analyze (Gemini) → Review (Chat) → Push to CRM (Composio)
```

Each step is tracked in the `workflows` and `workflow_tasks` tables. Progress is streamed to the frontend via SSE (`GET /api/workflows/{id}/stream`).

## Demo Mode

When `PLAUD_CLIENT_ID` is **not set**, the backend runs in demo mode:
- Auth is bypassed (all requests use `demo_user`)
- Mock data from `mock_data/` is returned for sales, deals, schedule endpoints
- CRM update workflow still requires Supabase + Gemini + ElevenLabs to function

## Production Deployment

Key environment variables for production:

```bash
# Backend
BACKEND_URL=https://your-api.example.com    # Used for OAuth callback URLs
FRONTEND_URL=https://your-app.example.com   # Used for post-login redirect

# Frontend
NEXT_PUBLIC_API_URL=                         # Leave empty — uses Next.js API proxy in production
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

The frontend includes an API proxy (`app/api/[...path]/`) that forwards requests to the backend, solving cross-domain cookie issues in production.
