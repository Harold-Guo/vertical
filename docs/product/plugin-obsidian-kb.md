# Plugin: Obsidian Knowledge Base (plaud-skills/plugins/obsidian-kb)

## Overview

AI skill plugin that transforms PLAUD recordings into a structured, interconnected Obsidian knowledge base. Based on Karpathy's "flat files + AI" knowledge base philosophy: recordings flow into `raw/`, AI (via graphify) compiles them into an organized `wiki/`, and agents can query the knowledge base to generate insights.

**Input**: PLAUD recordings (transcript + summary, already processed on PLAUD device/app)
**Output**: Obsidian vault with auto-linked wiki articles, searchable by any AI agent

---

## Core Idea

> People record meetings because they want to capture important knowledge — not just archive audio. PLAUD is the highest-quality `raw/` source because it captures real conversations, not secondhand article clippings.

Karpathy's knowledge base pattern:
```
raw/    — source material (dump everything, don't organize)
wiki/   — AI-maintained organized knowledge (never edit by hand)
outputs/ — AI-generated answers, reports, analyses
```

PLAUD completes the hardest part of this system: **automatically filling `raw/`** from real-world knowledge moments (meetings, lectures, discussions, voice memos).

---

## Architecture

```
PLAUD CLI                    Claude (orchestrator)           graphify
──────────                   ──────────────────              ────────
plaud files              →   filter: transcript=available
                             AND summary=available
                             skip already-synced files
plaud transcript <id>    →   merge into structured .md   →   raw/
plaud summary <id>       →   write to raw/                    |
                                                              v
                                                         --watch --wiki
                                                              |
                                                              v
                                                         wiki/ (Obsidian vault)
                                                              |
                                                              v
                                                         /graphify query
                                                              |
                                                              v
                                                         outputs/
```

### Component Responsibilities

| Component | Responsibility | NOT responsible for |
|-----------|---------------|-------------------|
| **PLAUD CLI** | Fetch raw data (files, transcript, summary) | Organizing, structuring, syncing |
| **Claude** (agent) | Orchestration: decide what's new, merge content, write .md to raw/ | Long-term storage, knowledge graph |
| **graphify** | Knowledge graph: raw/ → wiki/ (Obsidian), watch mode, queries | Fetching from PLAUD, auth |

---

## Skills

### Skill: sync-recordings

Syncs new PLAUD recordings to the local knowledge base `raw/` folder.

**Trigger**: User says "sync my recordings to knowledge base" or similar

**Flow**:
1. Run `plaud files` to get all recordings
2. Compare against `.plaud-synced.json` (tracks already-synced IDs)
3. For each new file where `transcript=available` AND `summary=available`:
   a. `plaud transcript <id>` → get transcript text
   b. `plaud summary <id>` → get AI summary (Markdown)
   c. `plaud file <id>` → get metadata (name, date, duration)
   d. Merge into a single `.md` file with frontmatter
   e. Write to `raw/`
4. Update `.plaud-synced.json` with newly synced IDs

**Output file format**:

```markdown
---
id: 4ee917c43f013423df146b97fd14610f
name: Q1 Strategy Meeting
date: 2026-04-09
duration: 45min
source: plaud
type: meeting
---

## Summary

[plaud summary content — already Markdown]

## Transcript

[plaud transcript content — timestamped, speaker-labeled]
[MM:SS - MM:SS] Speaker A: ...
[MM:SS - MM:SS] Speaker B: ...
```

**File naming**: `YYYY-MM-DD_slugified-name.md`
- Example: `2026-04-09_q1-strategy-meeting.md`

**Sync state file** (`.plaud-synced.json`):
```json
{
  "synced": {
    "4ee917c43f013423df146b97fd14610f": {
      "synced_at": "2026-04-09T15:30:00Z",
      "file": "2026-04-09_q1-strategy-meeting.md"
    }
  }
}
```

### Skill: compile-wiki

Triggers graphify to compile the `raw/` folder into an Obsidian wiki.

**Trigger**: "Compile my knowledge base" or auto-trigger after sync

**Flow**:
1. Run `graphify raw/ --wiki --output wiki/`
2. graphify extracts concepts, relationships, and builds:
   - `wiki/INDEX.md` — master index of all topics
   - `wiki/<topic>.md` — one file per major concept, with `[[wikilinks]]`
3. Report: new/updated articles, new connections found

### Skill: query-kb

Query the knowledge base for insights.

**Trigger**: "What do I know about [topic]?" or "Based on my meetings, what..."

**Flow**:
1. Run `graphify query "user's question"`
2. graphify searches the wiki, finds relevant nodes
3. Return answer grounded in the user's own captured knowledge

---

## Folder Structure

```
~/knowledge-base/           # User's local knowledge base
  raw/                      # PLAUD recordings land here (sync-recordings skill)
    2026-04-09_q1-strategy-meeting.md
    2026-04-08_product-review.md
    ...
  wiki/                     # graphify-maintained (compile-wiki skill)
    INDEX.md
    sales-pipeline.md
    product-roadmap.md
    ...
  outputs/                  # Query results, reports
    ...
  .plaud-synced.json        # Sync state tracking
  AGENTS.md                 # Schema file (Karpathy-style rules)
```

### AGENTS.md Template

```markdown
# Knowledge Base Schema

## What This Is
A personal knowledge base built from PLAUD recording transcripts.

## How It's Organized
- raw/ contains PLAUD recording transcripts and summaries. Never modify these.
- wiki/ is maintained entirely by AI (via graphify). Do not edit by hand.
- outputs/ contains generated reports, answers, and analyses.

## Wiki Rules
- Every topic gets its own .md file in wiki/
- Every wiki file starts with a one-paragraph summary
- Link related topics using [[topic-name]] format
- Maintain INDEX.md listing every topic with a one-line description
- When new recordings are synced, update relevant wiki articles

## Source Material
All raw/ files come from PLAUD recordings. Each has:
- Frontmatter with id, name, date, duration, source
- An AI-generated summary section
- A full timestamped transcript section
```

---

## Prerequisites

- Node.js >= 20 (for PLAUD CLI)
- Python >= 3.10 (for graphify)
- PLAUD account with recordings that have been transcribed on-device
- Obsidian (for viewing the wiki — optional, any Markdown editor works)

### Installation

```bash
# PLAUD CLI
npm install -g @plaud-ai/cli
plaud login

# graphify
pip install graphifyy
graphify install
```

---

## MVP Scope

- [ ] `sync-recordings` skill: PLAUD CLI → `.md` → `raw/`
- [ ] `compile-wiki` skill: trigger graphify → Obsidian wiki
- [ ] AGENTS.md template for PLAUD knowledge bases
- [ ] `.plaud-synced.json` state tracking
- [ ] Test: sync 2-3 real recordings, verify Obsidian output quality

### NOT in MVP

- Audio file download (graphify doesn't process audio; models don't accept it)
- Auto-trigger transcription from PLAUD (CLI doesn't support this yet)
- Real-time watch mode (manual sync first, automation later)
- Voice memo capture (PLAUD device only, no programmatic trigger)

---

## Validation Plan

1. **Install graphify**, manually create 1-2 `.md` files from `plaud transcript` + `plaud summary` output
2. **Run graphify** on those files with `--wiki` flag, check Obsidian output quality
3. **If output quality is good**: write the `sync-recordings` skill to automate step 1
4. **If output quality is poor**: evaluate whether we need a custom structuring step between PLAUD and graphify

This is the critical path: graphify's wiki output quality determines whether we build on it or build our own.

---

## Future

- `query-kb` skill: semantic search over the knowledge base
- Watch mode: auto-sync + auto-compile on new PLAUD recordings
- Cross-recording synthesis: "What changed in the deal across my last 3 meetings?"
- Health check: monthly knowledge base audit (contradictions, gaps, stale info)
- Integration with other raw/ sources (articles, code sessions, voice memos)

---

## References

- Karpathy's knowledge base approach: flat .md files + AGENTS.md schema + AI maintenance
- [graphify](https://github.com/safishamsi/graphify): Claude Code skill for knowledge graphs, supports Obsidian wiki output
- Nick Spisak's implementation guide: three-folder structure, automated collection, schema-driven wiki
- PLAUD CLI docs: `plaud files`, `plaud transcript <id>`, `plaud summary <id>`

---

**Related**: [[gtm-strategy-options]], [[plugin-field-sales]]
