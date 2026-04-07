# PLAUD Vertical Agent — GTM 策略方案

---

## 全局前提（战略已决策）

### 1. 产品定位：Wide 战略

PLAUD 作为横跨多行业的硬件平台，执行 Wide 战略，不押注单一垂直场景。

- PLAUD first-party 覆盖各行业"最痛"的核心场景（高价值、高频、强需求）
- 长尾场景、细分行业由开发者生态解决，不是 PLAUD 自己铺
- 当前 Field Sales CRM update demo 是 Wide 战略的第一个验证单元，跑通"录音 → 结构化 → 行动"的链路后横向扩展

### 2. 产品两层结构

```
核心能力层（platform-agnostic）
  Skill + Connector 封装
  类似 Claude plugin 的形式：skill 是能力，connector 是与目标系统的对接
  与 UI 无关，可在任意平台上运行

        ↓ 能力层确定后

分发/体验层（由数据决定）
  终端用户通过哪个入口使用这个能力
  → PLAUD app UI 集成 / 独立 app / workflow 平台（n8n、Dify、Zapier）
```

分发形式不提前决策，由验证数据驱动。

### 3. Demo app 的定位

当前 demo app = 终端用户验证的临时载体，不是最终产品形态。验证完成后根据数据决定是否迁移到 PLAUD 生态或其他分发形式。暂不主动并入 PLAUD app，等数据支撑后再评估。

---

## 现状

PLAUD 拥有一个可运行的 field sales AI demo（录音 → ElevenLabs 转写 → Gemini 提取 → Composio 推送 CRM），基于 PLAUD 硬件采集 + 独立 app 架构。该 demo 已能端到端跑通，**现在要做的是如何验证和 GTM，而不是是否要做。**

### 用户真实需求（来自 feedback.plaud.ai 数据）

| 需求 | 票数 | 开发状态 |
|------|------|---------|
| 云存储导出（iCloud/GDrive/OneDrive） | 554 票 | — |
| API 集成 | 185 票 | Planned |
| Zapier / Make / n8n / webhook | 106 票 | In Development |
| 第三方 SaaS 同步（Notion/Calendar 等） | 67 票 | In Development |
| CRM / Microsoft Teams 集成 | 18 票 | — |

> 来源：[feedback.plaud.ai/b/nvk7pg0r/feature-ideas](https://feedback.plaud.ai/b/nvk7pg0r/feature-ideas)

### 核心洞察

用户"数据导出"需求的本质不是"把文件搬出去"，而是：

> **将录音转化为结构化信息，导入到他们的工作工具（CRM、项目管理、笔记），并触发后续行动（任务分配、跟进提醒、报告生成）。**

这是 PLAUD 硬件 + AI 的差异化价值：**record → structure → act**。

---

## 两条并行验证路径

能力层（Skill + Connector）封装后，通过两条路径同步验证不同维度的价值。

```
Skill + Connector 封装
        ↓
┌─────────────────────────┬──────────────────────────────┐
│  开发者验证路径            │  终端用户验证路径               │
│                         │                              │
│  n8n / Dify /           │  当前 demo app（立即可用）      │
│  Zapier / Make 模板       │  → PLAUD marketplace listing  │
│  + PLAUD developer       │     （PLAUD 配合后）           │
│    portal（建设中）        │                              │
│                         │                              │
│  验证：connector 技术可用   │  验证：sales rep 真实留存      │
│  性 + 开发者集成意愿        │  和使用意愿                   │
└─────────────────────────┴──────────────────────────────┘
        ↓ 两侧数据汇合
  决定最终分发形式
```

### 路径 1：开发者验证

**目标**：验证 connector 技术可用性，积累开发者集成案例，同时在技术型用户中验证场景价值。

**为什么先做这条：** n8n/Dify 上搭 workflow 的用户通常是 power user 或技术型销售，他们既是开发者也是终端用户，反馈质量高，且这条路现在就能做，不依赖任何外部平台建设。

**执行：**
- 将 Skill + Connector 封装发布到 n8n / Dify / Zapier / Make 社区
- 提供 workflow 模板（field sales CRM update 为首个模板）
- 收集：集成量、workflow 运行频次、开发者反馈

**建设中：** PLAUD developer portal（作为上述平台的更好入口，团队自建或合作）

### 路径 2：终端用户验证

**目标**：验证非技术用户（sales rep）的真实使用意愿和留存。

**为什么需要独立做：** 开发者数据无法替代终端用户数据。Sales rep 不写代码，他们的使用行为和开发者完全不同，两条路径的数据回答不同的问题。

**执行（当前）：** demo app + PLAUD 内部销售团队内测
- 找 2-3 个 PLAUD 内部销售 rep，用 app 录真实客户会议
- 记录：CRM 更新准确率、rep 主动使用频次、留存周期

**执行（PLAUD 配合后）：** 在 PLAUD marketplace/integration 中挂载入口，触达更广的 PLAUD 存量用户

---

## 分发形式（数据触发决策）

两条验证路径的数据汇合后，决定最终分发形式。不提前选定，由数据说话。

| 分发形式 | 触发条件 | 说明 |
|---------|---------|------|
| **深化 workflow 平台** | 开发者路径数据好，n8n/Dify 上有稳定用户 | 持续发布更多 connector 和模板 |
| **PLAUD app UI 集成** | 终端用户路径数据好，PLAUD 用户留存高 | 与 PLAUD 工程团队合作做 native 体验 |
| **独立 app 深化** | 两条路径数据都好但 PLAUD 合作受阻 | 独立 app 作为长期产品形态 |
| **企业 CRM 合作** | 有 100+ 企业用户 + 企业询价出现 | Salesforce/HubSpot ISV 合作（暂缓） |

---

## 三阶段路线图

```
Phase 1 — 双路径并行验证（当前，4-8 周）
  开发者路径：Skill + Connector 封装 → n8n/Dify/Zapier 发布
  终端用户路径：demo app → PLAUD 内部分发渠道
  建设中：PLAUD developer portal
  前置：确认 PLAUD 内部分发 sponsor
  出口条件：两条路径各有数据 → 决定分发形式优先级

Phase 2 — 优先分发形式深化（Phase 1 出口后）
  根据 Phase 1 数据选定 1-2 个主要分发形式
  Wide 横向扩展：在已验证渠道内增加更多垂直场景
  评估节点：是否并入 PLAUD app 生态（条件待定）

Phase 3 — 开发者生态规模化（远期）
  PLAUD developer portal 成熟，开放第三方开发者发布 skill
  Wide 战略长尾由开发者生态驱动
  触发：Phase 2 有稳定用户基础
```

---

## 推荐执行顺序

**立刻可做（不依赖外部）：**
1. 将 Skill + Connector 封装，发布首个 n8n/Dify 模板（field sales CRM）
2. 启动内测：找 2-3 个 PLAUD 销售 rep 用真实会议跑一次

**同步推进（需内部协调）：**
3. 确认 PLAUD 内部分发 sponsor（终端用户路径的关键单点）
4. 推进 PLAUD developer portal 建设规划（自建或与 PLAUD 合作）

**数据达标后触发：**
5. 根据两条路径数据，决定深化哪个分发形式

---

## 开放问题

1. PLAUD 内部分发 sponsor 是谁？（终端用户验证路径的关键前提）
2. PLAUD marketplace/integration 入口：PLAUD 产品团队的配合意愿和时间线？
3. PLAUD 用户职业构成数据从哪里获取？（影响 Wide 场景优先级排序）
4. Phase 2 分发形式评估的具体条件是什么？（用户数、留存率、付费意愿？）

---

**Related**: [[../engineering/architecture]]
