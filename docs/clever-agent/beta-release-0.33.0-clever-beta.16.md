# Clever Agent dashboard beta.16

**Data:** 2026-05-30
**Versão alvo:** `0.33.0-clever-beta.16`

---

## 1. Objetivo

Fase 1 da localização pt-BR dos Agents:
traduzir labels de agentes, categorias, tiers e filter tabs na UI.
Sem alterar runtime, system prompts ou `.claude/agents`.

---

## 2. Git

| Branch | HEAD |
|---|---|
| `clever-dev` | `1e99e2a` — feat: localize agent display labels to pt-BR |
| `clever-beta` | `80564e1` — chore: promote Clever Agent dashboard beta.16 |
| Tag | `clever-agent-v0.33.0-clever-beta.16` |
| `clever-prod` | preservada (não tocada) |
| `upstream-sync` | preservada (não tocada) |

---

## 3. Imagem GHCR

### Dashboard

| Campo | Valor |
|---|---|
| Tag | `ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.16` |
| Digest index | `sha256:fd6e61366d14181de640536832f9a67a04280d6fffa84a6d57719c1e273f7e04` |
| Digest linux/amd64 | `sha256:bbe5e564373b481019a5ec6a790dca0296a403f173612dce84aa9045a46e0809` |
| Tamanho local | 10.4 GB |

### Runtime

| Campo | Valor |
|---|---|
| Tag | `ghcr.io/danielsavoia/clever-agent-runtime:0.33.0-clever-beta.10` |
| Status | Mantido — não republicado |

### Site

| Campo | Valor |
|---|---|
| Tag | `ghcr.io/danielsavoia/clever-agent-site:0.33.0-clever-beta.1` |
| Status | Mantido — não republicado |

**Latest publicado?** Não.

---

## 4. Escopo

- **Display-only** — nenhum arquivo de runtime alterado.
- `.claude/agents/*.md` — **NÃO alterado**.
- `.claude/skills/**` — **NÃO alterado**.
- System prompts — **NÃO alterados**.
- Routing/behavior — **sem mudança**.

---

## 5. Mudanças implementadas

### `dashboard/frontend/src/pages/Agents.tsx`

| Elemento | Antes | Depois |
|---|---|---|
| AGENT_META.label (18 agentes) | Inglês | pt-BR |
| DEFAULT_META.label | 'Agent' | 'Agente' |
| FILTERS | 'All', 'Business', 'Engineering', 'Custom' | 'Todos', 'Negócios', 'Engenharia', 'Personalizado' |
| CATEGORY_META.label | 'Business', 'Engineering', 'Custom' | 'Negócios', 'Engenharia', 'Personalizado' |
| CATEGORY_META.description | Inglês | pt-BR |
| TIER_LABELS | 'Reasoning · opus', 'Execution · sonnet', 'Speed · haiku' | 'Raciocínio · opus', 'Execução · sonnet', 'Velocidade · haiku' |
| Oracle 'Start Here' | 'Start Here' | 'Comece Aqui' |
| Oracle 'Running' | 'Running' | 'Em execução' |
| Oracle description | Inglês | pt-BR |
| Oracle 'Open' | 'Open' | 'Abrir' |
| Cards 'Running' | 'Running' | 'Em execução' |
| 'No description available.' | Inglês | 'Sem descrição disponível.' |
| 'Recent' | 'Recent' | 'Recentes' |
| Search placeholder | 'Search agents...' | 'Buscar agentes...' |
| Empty state | 'No agents found' | 'Nenhum agente encontrado' |
| Empty state hint | Inglês | pt-BR |
| Filter empty | 'No agents match...' | 'Nenhum agente corresponde...' |
| Stats: active | 'active' | 'ativos' |
| Stats: memories | 'total memories' | 'memórias' |
| Stats: categories | 'business', 'engineering', 'custom' | 'negócios', 'engenharia', 'personalizado' |

### `dashboard/frontend/src/lib/agent-meta.ts`

38 labels traduzidos para pt-BR em `AGENT_META_SEED`.

### `dashboard/backend/agent_meta_seed.py`

38 labels traduzidos para pt-BR em `NATIVE_AGENT_SEED`.

### `dashboard/frontend/src/i18n/locales/pt-BR/index.ts`

Novas chaves adicionadas na seção `agents`:
`categoryBusiness`, `categoryEngineering`, `categoryCustom`,
`categoryBusinessDescription`, `categoryEngineeringDescription`, `categoryCustomDescription`,
`tierReasoning`, `tierExecution`, `tierSpeed`,
`filterAll`, `filterBusiness`, `filterEngineering`, `filterCustom`

### `en-US/index.ts` e `es/index.ts`

Mesmas chaves adicionadas para paridade de estrutura.

---

## 6. Validação local

| Etapa | Resultado |
|---|---|
| Frontend build (`npm run build`) | ✅ 0 erros TypeScript |
| `.claude/agents` não alterado | ✅ Confirmado |
| `.claude/skills` não alterado | ✅ Confirmado |
| Strings pt-BR no código | ✅ 33 ocorrências confirmadas |

---

## 7. Validação VPS esperada

1. Abrir `/agents` — cards com labels em pt-BR (ex: "RH / Pessoas", "Financeiro", "Jurídico")
2. Categorias "Negócios" / "Engenharia" / "Personalizado"
3. Filter tabs "Todos" / "Negócios" / "Engenharia" / "Personalizado"
4. Oracle hero card com "Comece Aqui" e descrição em pt-BR
5. Tiers "Raciocínio · opus" / "Execução · sonnet" / "Velocidade · haiku"
6. Chat / terminal — sem regressão
7. Login — continua funcionando (username ou email)
