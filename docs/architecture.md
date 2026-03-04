# Field Sales Intelligence Platform — 架构设计文档

> 将 field sales 录音转化为结构化 CRM 数据的 AI Pipeline 设计方案

---

## 1. 概述

本系统将销售人员与客户的通话录音、线下会议录音自动处理为结构化内容，并写入 Salesforce / HubSpot 等 CRM 系统。

**核心价值链：**
```
录音 → 转写 → 结构化抽取 → CRM 写入
```

**关键约束：**
- 每个用户/项目的抽取 Schema 不同（行业、产品线、CRM 字段各异）
- Skill 体系需要支持未来扩展和开放（marketplace 方向）

---

## 2. 核心设计理念

### 2.1 Skill = 完整的抽取单元

Skill 不是 workflow 里的一段 if/else 逻辑，而是一个**自描述的数据对象**，包含三个层面：

| 层面 | 字段 | 作用 |
|---|---|---|
| 如何抽 | `prompt_fragment` | 注入 LLM system prompt 的指令文本 |
| 抽什么 | `output_schema` | JSON Schema fragment，定义结构化输出字段 |
| 往哪写 | `crm_field_mapping` | 抽取结果到 CRM 字段的映射关系 |

### 2.2 Schema-as-Data 原则

**不把 schema 写在代码里，把 schema 存在数据库里。**

- Demo 阶段：skill 是系统内置数据（只读），不允许用户编辑
- 正式产品：skill 是用户可配置数据（可 CRUD），支持 skill marketplace
- 架构不需要变，只需要改权限逻辑

### 2.3 Project 激活 Skill

每个 Project 不存储 schema，而是存储**激活的 skill 列表**。Pipeline 运行时动态组合：

```
Project.active_skill_ids → 加载 Skills → 合并 Schema → LLM tool_use → 路由写入
```

---

## 3. 处理流水线

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌──────────────┐
│  🎙️ 录音输入  │ → │  音频转写    │ → │  Skill 加载  │ → │  Schema 组合  │
│  (Audio)    │   │  (Whisper)  │   │  (Registry) │   │  (Compose)   │
└─────────────┘   └─────────────┘   └─────────────┘   └──────────────┘
                                                               │
                                                               ↓
┌─────────────┐   ┌─────────────┐   ┌──────────────────────────────────┐
│  CRM 写入    │ ← │  CRM 路由    │ ← │         LLM 抽取                 │
│ SF/HubSpot  │   │  (Route)    │   │  Claude API (tool_use)           │
└─────────────┘   └─────────────┘   └──────────────────────────────────┘
```

### 阶段说明

| 阶段 | 技术 | 说明 |
|---|---|---|
| 音频转写 | Whisper / faster-whisper | 支持中文、英文；speaker diarization 识别多人 |
| Skill 加载 | DB query | 根据 `project.active_skill_ids` 从数据库加载 Skill 对象 |
| Schema 组合 | Runtime merge | 将多个 `skill.output_schema` 合并为单一 JSON Schema |
| LLM 抽取 | Claude API `tool_use` | System prompt 注入 `skill.prompt_fragment`，schema 定义 tool |
| CRM 路由 | Per-skill mapping | 按每个 skill 的 `crm_field_mapping` 将结果分发到对应字段 |
| CRM 写入 | REST API | Salesforce REST API / HubSpot API |

---

## 4. 数据模型

### 4.1 Skill（技能单元）

```python
class Skill(BaseModel):
    id: str                        # e.g. "pain-point-extractor"
    name: str                      # 显示名称
    description: str
    is_builtin: bool               # demo 阶段全为 True
    category: str                  # e.g. "qualification", "next-steps"

    prompt_fragment: str           # 注入 system prompt 的指令文本
    output_schema: dict            # JSON Schema fragment
    crm_field_mapping: dict        # { extracted_key: crm_field_name }
```

**内置 Skill 示例：**

```yaml
# pain-point-extractor
prompt_fragment: |
  从对话中识别客户提到的痛点、挑战和不满。
  每个痛点包含：描述、严重程度(1-5)、相关场景。
output_schema:
  pain_points:
    type: array
    items:
      type: object
      properties:
        description: { type: string }
        severity: { type: integer, minimum: 1, maximum: 5 }
        context: { type: string }
crm_field_mapping:
  pain_points: "Description"   # Salesforce Opportunity.Description

# meddic-qualification
output_schema:
  meddic:
    metrics: string           # 可量化的业务指标
    economic_buyer: string    # 经济决策人
    decision_criteria: string
    decision_process: string
    identify_pain: string
    champion: string
crm_field_mapping:
  meddic.metrics: "MEDDIC_Metrics__c"
  meddic.economic_buyer: "MEDDIC_EconomicBuyer__c"

# next-steps
output_schema:
  next_steps:
    type: array
    items:
      type: object
      properties:
        action: { type: string }
        owner: { type: string }
        due_date: { type: string }
        priority: { type: string, enum: [high, medium, low] }
crm_field_mapping:
  next_steps: "NextStep"       # Salesforce Opportunity.NextStep
```

### 4.2 Project（项目配置）

```python
class Project(BaseModel):
    id: str
    owner_id: str
    name: str

    active_skill_ids: list[str]    # ["pain-point-extractor", "meddic-qualification"]
    crm_type: Literal["salesforce", "hubspot", "close"]
    crm_credentials: dict          # encrypted
    crm_field_overrides: dict      # 覆盖 skill 默认的 crm_field_mapping
```

### 4.3 Recording（录音处理记录）

```python
class Recording(BaseModel):
    id: str
    project_id: str

    audio_url: str
    transcript: str                # 转写结果
    speakers: list[dict]           # speaker diarization 结果

    extracted_data: dict           # 按 skill_id 分组的结构化结果
    # {
    #   "pain-point-extractor": { "pain_points": [...] },
    #   "meddic-qualification": { "meddic": {...} },
    # }

    crm_push_status: Literal["pending", "pushed", "failed"]
    crm_record_id: str | None      # 写入后的 CRM record ID
```

---

## 5. 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│   项目配置  │  Skill 选择  │  录音上传  │  抽取结果预览  │  CRM 状态   │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP / REST
┌──────────────────────────────▼──────────────────────────────────┐
│                        Backend (FastAPI)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Recording API│  │ Skill Registry│  │ Pipeline Orchestrator│  │
│  │ POST /upload │  │ GET /skills  │  │ transcribe()         │  │
│  │ GET /results │  │ GET /project │  │ load_skills()        │  │
│  │              │  │   /skills    │  │ compose_schema()     │  │
│  │              │  │              │  │ llm_extract()        │  │
│  │              │  │              │  │ crm_push()           │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     CRM Adapters                           │ │
│  │   SalesforceAdapter  │  HubSpotAdapter  │  CloseAdapter   │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────┬──────────────────────┬──────────────────────────────┘
            │                      │
┌───────────▼──────────┐  ┌────────▼──────────────────────────────┐
│  Database (PostgreSQL)│  │  External Services                    │
│  ├── skills           │  │  ├── Claude API  (LLM 抽取)           │
│  ├── projects         │  │  ├── Whisper API (音频转写)            │
│  └── recordings       │  │  ├── Salesforce REST API              │
└──────────────────────┘  │  └── HubSpot API                      │
                           └────────────────────────────────────────┘
```

---

## 6. 关键设计决策

### Q: 为什么 Skill 存数据库而非代码？

| 维度 | 存代码 | 存数据库 |
|---|---|---|
| 新增 skill | 改代码 + 部署 | INSERT 一条记录 |
| 用户自定义 | 不支持 | 改权限即可开放 |
| Skill marketplace | 重构 | 天然支持 |
| Demo 阶段成本 | 低 | 略高（需建表） |

**结论：** Demo 阶段 skill 是只读的数据库记录，逻辑上与正式产品一致。

### Q: Schema 如何动态组合？

```python
def compose_schema(skills: list[Skill]) -> dict:
    """将多个 skill 的 output_schema 合并为单一 JSON Schema"""
    properties = {}
    for skill in skills:
        properties.update(skill.output_schema)
    return {
        "type": "object",
        "properties": properties
    }
```

### Q: Demo 阶段的简化边界

- Skill 全部内置（`is_builtin=True`），不开放用户编辑
- CRM 写入先做 HubSpot（API 最简单），Salesforce 作为 Phase 2
- 转写先用 OpenAI Whisper API，后期可替换为本地 faster-whisper

---

## 7. 技术栈

| 层 | 技术 |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11+ |
| Database | PostgreSQL + SQLAlchemy |
| 音频转写 | OpenAI Whisper API |
| LLM 抽取 | Claude API (`claude-sonnet-4-6`), `tool_use` |
| CRM 集成 | HubSpot API, Salesforce REST API |
| 部署 | Railway (现有) |

---

## 8. 下一步 (Roadmap)

- [ ] **Phase 1 (Demo):** 内置 3-5 个 skill，HubSpot 集成，录音上传 → 结构化结果展示
- [ ] **Phase 2:** Salesforce 集成，多 skill 可配置，结果人工审核后推送
- [ ] **Phase 3:** 开放 Skill 自定义，Skill marketplace，实时转写（streaming）
