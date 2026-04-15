# Salesforce Plugin

Analyze PLAUD meeting recordings and sync insights directly to Salesforce. Extracts deal progression, contact changes, account updates, meeting summaries, and action items — then pushes approved changes to your Salesforce org.

## Skills

| Skill | Trigger | What it does |
|-------|---------|-------------|
| `post-meeting` | "process my meeting", "update SF" | Full workflow: analyze → review → push to Salesforce |
| `deal-insights` | deal, pipeline, stage | Stage progression, amount, close date, next steps |
| `contact-updates` | contact, role, title | Title/role changes, contact info updates |
| `company-insights` | company, account | Industry, revenue, company description |
| `file-summary` | summarize, meeting notes | Meeting summary focusing on outcomes and next steps |
| `action-items` | action items, follow-ups | Explicit commitments with owner and due date |
| `sync-to-crm` | push to SF, sync | Push proposed changes to Salesforce records |

## How It Works

```
PLAUD Device → PLAUD (CLI or MCP) → transcript
                                        ↓
                               Analysis Skills (5x)
                                        ↓
                                Proposed CRM changes
                                        ↓
                               User review & approval
                                        ↓
                          Salesforce (CLI or MCP) → Salesforce org
```

1. User describes a meeting or provides a recording ID
2. Skills fetch transcript and current CRM state
3. Analysis compares transcript against CRM baseline to detect changes
4. Proposed changes are presented for review
5. Approved changes are pushed to Salesforce

Skills are platform-agnostic — they describe **what** to do, and the agent uses whichever tools are available (CLI in Claude Code, MCP in Claude Desktop).

## Install

### Claude Code

**Prerequisites**: install and authenticate both CLIs.

```bash
# PLAUD CLI
npm install -g @plaud-ai/cli
plaud login

# Salesforce CLI (https://developer.salesforce.com/tools/salesforcecli)
sf org login web
```

**Install skills**:

```bash
git clone git@github.com:Plaud-AI/plaud-plugins.git
mkdir -p ~/.claude/skills
ln -s "$(pwd)/plaud-plugins/plugins/salesforce/skills"/* ~/.claude/skills/
```

Skills appear immediately — no restart needed. To update:

```bash
cd plaud-plugins && git pull
```

### Claude Desktop

**Step 1 — Install MCP servers** for PLAUD and Salesforce:

```bash
npx @plaud-ai/mcp setup
npx @plaud-dev/mcp-salesforce setup
```

Both commands auto-register in Claude Desktop's config.

**Step 2 — Restart Claude Desktop** to load the MCP servers.

**Step 3 — Upload skills**: clone the repo, then upload each SKILL.md.

```bash
git clone git@github.com:Plaud-AI/plaud-plugins.git
```

Open Claude Desktop → Customize → Skills → click **+** → upload each `SKILL.md` file from `plaud-plugins/plugins/salesforce/skills/*/SKILL.md`

**Step 4 — Authenticate** in a Claude Desktop conversation:

- "Login to PLAUD" — triggers the PLAUD MCP `login` tool
- "Login to Salesforce" — triggers the Salesforce MCP `org_login_web` tool
