# Clever Agent — pt-BR Agent/Skill Display Overlay

**Introduzido em:** `0.33.0-clever-beta.18` (planejado)
**Fase:** 2 (Overlay de Descrições e Profiles)
**Data:** 2026-05-30

---

## Arquitetura

```
.claude/agents/*.md          ← NUNCA alterado — runtime em inglês
.claude/skills/**/SKILL.md   ← NUNCA alterado — runtime em inglês
                                      │
                                      ▼
dashboard/frontend/src/lib/localization/pt-BR/
  ├── agent-overlays.ts   ← overlay de descriptions e profiles dos agentes
  └── skill-overlays.ts   ← overlay de titles, descriptions e body das skills
                                      │
                                      ▼
Agents.tsx, AgentDetail.tsx, Skills.tsx, SkillDetail.tsx
  ├── Se overlay disponível → exibe tradução pt-BR
  └── Se overlay ausente   → fallback para original inglês
```

**Princípio central:** O frontend exibe a tradução, o runtime nunca a vê.

---

## Arquivos

| Arquivo | Função |
|---|---|
| `dashboard/frontend/src/lib/localization/pt-BR/agent-overlays.ts` | Descriptions e profiles de agentes |
| `dashboard/frontend/src/lib/localization/pt-BR/skill-overlays.ts` | Titles, descriptions e bodies de skills |
| `dashboard/frontend/src/pages/Agents.tsx` | Integra `getAgentDescriptionPtBR()` nos cards |
| `dashboard/frontend/src/pages/AgentDetail.tsx` | Integra `getAgentProfilePtBR()` na aba Profile |
| `dashboard/frontend/src/pages/Skills.tsx` | Integra `getSkillTitlePtBR()` e `getSkillDescriptionPtBR()` nos cards |
| `dashboard/frontend/src/pages/SkillDetail.tsx` | Integra `getSkillBodyPtBR()` no detalhe |

---

## API dos overlays

### Agentes

```typescript
import {
  getAgentDescriptionPtBR,  // string | undefined
  getAgentProfilePtBR,       // string | undefined (markdown completo)
} from '../lib/localization/pt-BR/agent-overlays'

// Uso em cards:
const desc = getAgentDescriptionPtBR('aria-hr') ?? agent.description

// Uso na aba Profile:
const ptBR = getAgentProfilePtBR('oracle')
const profileBody = ptBR ?? extractProfileBody(content)
```

### Skills

```typescript
import {
  getSkillTitlePtBR,        // string | undefined
  getSkillDescriptionPtBR,  // string | undefined
  getSkillBodyPtBR,          // string | undefined (markdown completo)
} from '../lib/localization/pt-BR/skill-overlays'

// Uso em cards:
const title = getSkillTitlePtBR('ai-image-creator') ?? skill.name
const desc = getSkillDescriptionPtBR('ai-image-creator') ?? skill.description

// Uso no detalhe:
const body = getSkillBodyPtBR('ai-image-creator') ?? content
```

---

## Cobertura atual

### Agentes

| Agente | Description | Profile |
|---|---|---|
| oracle | ✅ | ✅ completo |
| aria-hr | ✅ | — |
| atlas-project | ✅ | — |
| bolt-executor | ✅ | — |
| canvas-designer | ✅ | — |
| clawdia-assistant | ✅ | — |
| compass-planner | ✅ | — |
| dex-data | ✅ | — |
| echo-analyst | ✅ | — |
| flow-git | ✅ | — |
| flux-finance | ✅ | — |
| grid-tester | ✅ | — |
| hawk-debugger | ✅ | — |
| helm-conductor | ✅ | — |
| kai-personal-assistant | ✅ | — |
| lens-reviewer | ✅ | — |
| lex-legal | ✅ | — |
| lumen-learning | ✅ | — |
| mako-marketing | ✅ | — |
| mentor-courses | ✅ | — |
| mirror-retro | ✅ | — |
| nex-sales | ✅ | — |
| nova-product | ✅ | — |
| oath-verifier | ✅ | — |
| pixel-social-media | ✅ | — |
| prism-scientist | ✅ | — |
| probe-qa | ✅ | — |
| pulse-community | ✅ | — |
| quill-writer | ✅ | — |
| raven-critic | ✅ | — |
| sage-strategy | ✅ | — |
| scout-explorer | ✅ | — |
| scroll-docs | ✅ | — |
| trail-tracer | ✅ | — |
| vault-security | ✅ | — |
| zara-cs | ✅ | — |
| zen-simplifier | ✅ | — |
| apex-architect | ✅ | — |

**Total:** 38/38 descriptions ✅ | 1/38 profiles ✅

### Skills

| Skill | Title | Description | Body |
|---|---|---|---|
| ai-image-creator | ✅ | ✅ | ✅ completo |
| create-agent | ✅ | ✅ | — |
| create-command | ✅ | ✅ | — |
| create-goal | ✅ | ✅ | — |
| create-heartbeat | ✅ | ✅ | — |
| create-integration | ✅ | ✅ | — |
| create-routine | ✅ | ✅ | — |
| create-ticket | ✅ | ✅ | — |
| cs-customer-escalation | ✅ | ✅ | — |
| cs-customer-research | ✅ | ✅ | — |
| cs-draft-response | ✅ | ✅ | — |
| cs-kb-article | ✅ | ✅ | — |
| cs-ticket-triage | ✅ | ✅ | — |
| data-analyze | ✅ | ✅ | — |
| data-build-dashboard | ✅ | ✅ | — |
| data-create-viz | ✅ | ✅ | — |
| data-explore | ✅ | ✅ | — |
| data-statistical-analysis | ✅ | ✅ | — |
| data-validate | ✅ | ✅ | — |
| data-write-query | ✅ | ✅ | — |
| dev-ask | ✅ | ✅ | — |
| dev-autopilot | ✅ | ✅ | — |
| dev-deep-dive | ✅ | ✅ | — |
| dev-plan | ✅ | ✅ | — |
| dev-release | ✅ | ✅ | — |
| dev-remember | ✅ | ✅ | — |
| dev-verify | ✅ | ✅ | — |

**Total:** 27 skills com title+description ✅ | 1 skill com body completo ✅

---

## Campos protegidos (NUNCA traduzir)

Os seguintes termos devem aparecer literalmente dentro das traduções:

### Slash commands
`/oracle`, `/aria`, `/flux`, `/lex`, `/nex`, `/nova`, `/mako`, `/clawdia`,
`/sage`, `/dex`, `/kai`, `/mentor`, `/pulse`, `/pixel`, `/helm-conductor`,
`/mirror-retro`, `/atlas-project`, `/bolt-executor`, `/canvas-designer`, etc.

### Tool names (Claude Code)
`Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `Skill`, `Agent`

### Model names
`sonnet`, `opus`, `haiku`

### Flags e argumentos de CLI
`--model`, `--analyze`, `--prompt`, `--output`, `--provider`,
`--aspect-ratio`, `--image-size`, `--ref`, `--transparent`, `--costs`,
`-o`, `-p`, `-m`, `-r`, `-t`, `-a`, `-s`

### Keywords de modelo (AI Image Creator)
`gemini`, `riverflow`, `flux2`, `seedream`, `gpt5`

### Marcas / serviços externos
`OpenRouter`, `Cloudflare`, `Google AI Studio`, `Cloudflare AI Gateway BYOK`,
`ImageMagick`, `ffmpeg`, `Google Gemini`, `FLUX.2`, `SeedDream`, `ByteDance`

### Variáveis de ambiente
`AI_IMG_CREATOR_CF_ACCOUNT_ID`, `AI_IMG_CREATOR_CF_GATEWAY_ID`,
`AI_IMG_CREATOR_CF_TOKEN`, `AI_IMG_CREATOR_OPENROUTER_KEY`,
`AI_IMG_CREATOR_GEMINI_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`

### Paths de arquivo
`workspace/assets/prompts/prompt.txt`, `workspace/assets/images/`,
`config/workspace.yaml`, `.claude/agents/`, `memory/index.md`,
`${CLAUDE_SKILL_DIR}/scripts/generate-image.py`

### YAML/JSON técnico
Qualquer chave de frontmatter (`name:`, `model:`, `tools:`, `allowed-tools:`),
IDs de skill, slugs de agente.

### Blocos de código
Todo conteúdo dentro de ` ``` ``` ` ou backticks inline.

---

## Como adicionar uma nova tradução

### Novo agente

1. Encontre o slug em `.claude/agents/` (ex: `aria-hr`)
2. Copie a `description:` do frontmatter YAML → traduza
3. Copie o corpo markdown → traduza a prosa, preserve literais
4. Adicione em `agent-overlays.ts`:

```typescript
'aria-hr': {
  description: 'Tradução da description aqui...',
  profile: `Tradução do profile aqui...`,
},
```

### Nova skill

1. Encontre o ID em `.claude/skills/` (ex: `dev-plan`)
2. Copie `description:` do frontmatter → traduza
3. Para body completo: copie o markdown → traduza prosa, preserve literais/código
4. Adicione em `skill-overlays.ts`:

```typescript
'dev-plan': {
  title: 'Planejar Implementação',
  description: 'Tradução da description aqui...',
  body: `# Planejar Implementação\n\n...corpo traduzido...`,
},
```

---

## Checklist de validação

- [ ] `npm run build` — 0 erros TypeScript
- [ ] Bundle contém strings pt-BR (grep no dist/)
- [ ] Bundle contém termos técnicos preservados (`--model`, `gemini`, `OpenRouter`, etc.)
- [ ] `.claude/agents/` não foi modificado
- [ ] `.claude/skills/` não foi modificado
- [ ] `git diff --name-only` não mostra `.claude/`
- [ ] Fallback funciona: remover entrada do overlay → exibe inglês original
- [ ] Runtime intacto: chat e terminal funcionam normalmente
