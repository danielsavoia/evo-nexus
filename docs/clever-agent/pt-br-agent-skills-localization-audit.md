# Auditoria — Localização pt-BR de Agent Profiles e Skills

**Data:** 2026-05-30
**Branch auditado:** `clever-dev` (HEAD: `6d13e86`)
**Escopo:** somente leitura — nenhum arquivo foi alterado.

---

## 1. Resultado

| Item | Valor |
|---|---|
| Recomendação | **Opção B — Overlay pt-BR em arquivos separados (frontend-only)** |
| Risco da abordagem recomendada | **Baixo** — runtime nunca é tocado |
| Risco de traduzir diretamente os `.md` de agentes/skills | **Alto** — quebra routing e system prompts |
| Abordagem principal | Arquivo `dashboard/frontend/src/lib/clever-agent/agents-display-pt-BR.ts` para labels/descriptions; overlay `.md` em `brand/clever-agent/i18n/pt-BR/profiles/` para Profile tabs |

---

## 2. Fontes encontradas

| Tipo | Arquivo | Usado por UI | Usado por runtime | Pode traduzir direto? | Observação |
|---|---|---|---|---|---|
| Agent labels (TS) | `dashboard/frontend/src/lib/agent-meta.ts` — campo `label` | ✅ | ❌ | ✅ SIM | Campos `label` em `AGENT_META_SEED` são display-only. Safe de traduzir. |
| Agent labels (TS duplicado) | `dashboard/frontend/src/pages/Agents.tsx` — constante `AGENT_META` | ✅ | ❌ | ✅ SIM | Segunda cópia de labels (com colorMuted/glowColor extra). Mesma duplicação que agent-meta.ts. Ambas precisam ser atualizadas. |
| Agent labels (Python) | `dashboard/backend/agent_meta_seed.py` — campo `label` | Via API | ❌ | ✅ SIM | Serve `/api/agent-meta` — apenas label + avatar_url. Display-only. |
| Agent description (cards) | `.claude/agents/{name}.md` — campo `description` no YAML frontmatter | ✅ (cards) | ✅ (routing Claude) | ⚠️ RISCO | **Dual-use**: Claude Code usa para routing de sub-agentes; UI mostra no card. Traduzir diretamente pode quebrar routing. |
| Agent profile (aba Profile) | `.claude/agents/{name}.md` — corpo markdown | ✅ (Profile tab) | ✅ (system prompt) | ❌ NÃO | O corpo completo é o system prompt do agente. Traduzir = mudar comportamento do AI. |
| Skill description (cards) | `.claude/skills/{id}/SKILL.md` — campo `description` no YAML frontmatter | ✅ (cards) | ✅ (routing) | ⚠️ RISCO | Mesmo dual-use que agent description. |
| Skill detail (SkillDetail) | `.claude/skills/{id}/SKILL.md` — corpo markdown | ✅ (detalhe) | ✅ (instrução) | ❌ NÃO | Runtime instruction — não traduzir. |
| Category labels (Agents.tsx) | `CATEGORY_META` em `Agents.tsx` — `label` e `description` | ✅ | ❌ | ✅ SIM | Hardcoded: `'Business'`, `'Engineering'`, `'Custom'`. Display-only. |
| Tier labels | `TIER_LABELS` em `Agents.tsx` — `'Reasoning · opus'` etc. | ✅ | ❌ | ✅ SIM | Display-only. |
| Filter tab labels | Array de tabs em `Agents.tsx` — `'All'`, `'Business'`... | ✅ | ❌ | ✅ SIM | Display-only. Idealmente mover para i18n. |
| UI chrome | `dashboard/frontend/src/i18n/locales/pt-BR/index.ts` | ✅ | ❌ | ✅ SIM | Já existe pt-BR, en-US, es. Agentes/skills não entram aqui. |
| Skill scripts | `.claude/skills/*/scripts/*.py` | ❌ | ✅ | ❌ NÃO | Código Python executável — jamais traduzir. |

---

## 3. Agent Profiles

### Origem do profile do Oracle

O texto da aba **Profile** (ex: *"You are Oracle — the single entry point..."*) vem de:

```
.claude/agents/oracle.md  →  GET /api/agents/oracle  →  AgentDetail.tsx → <Markdown>
```

**Caminho completo:**
1. Backend `routes/agents.py` (`get_agent()`) lê `.claude/agents/{name}.md` e retorna o conteúdo raw como `text/markdown`
2. `AgentDetail.tsx` faz `api.getRaw('/agents/{name}')` — recebe a string markdown
3. `extractProfileLead()` extrai o primeiro parágrafo (após frontmatter + H1) como "lead"
4. `extractProfileBody()` remove o frontmatter e retorna o corpo completo
5. `<Markdown>{profileBody}</Markdown>` renderiza no tab Profile

O **lead** (primeiro parágrafo) e o **body** (corpo inteiro) são exatamente o sistema de instruções do agente — seu system prompt. Este texto é idêntico ao que Claude Code recebe ao invocar o agente.

### Origem dos demais profiles (38 agentes)

Todos os 38 agentes seguem o mesmo padrão: `.claude/agents/{slug}.md`. Cada arquivo tem:
- **Frontmatter YAML**: `name`, `description`, `model`, `color`, `memory`, opcionalmente `tools`
- **Corpo markdown**: system prompt completo com seções como `Workspace Context`, `Working Folder`, `Your Identity`, `Your Level`, etc.

### Origem das descriptions dos cards

```
.claude/agents/{name}.md  →  fm.get("description")  →  GET /api/agents  →  Agents.tsx card
```

O backend parseia o frontmatter de cada `.md` e retorna `description` na lista de agentes. O mesmo campo que aparece no card é o que Claude Code usa para decidir qual sub-agente invocar.

**Exemplo `aria-hr.md`:**
```yaml
description: "Use this agent when dealing with HR and People Operations activities..."
```
Este texto aparece no card E é usado pelo runtime para routing.

### Duplicação TS/Python de labels

| Campo | `agent-meta.ts` | `Agents.tsx (AGENT_META)` | `agent_meta_seed.py` |
|---|---|---|---|
| `label` (ex: `'HR / People'`) | ✅ Sim | ✅ Sim | ✅ Sim |
| `description` | ❌ Não | ❌ Não | ❌ Não |
| `avatar_url` | ✅ Sim | ❌ Não | ✅ Sim |

**Conclusão**: `label` está triplicado (dois TS + um Python). Para traduzir labels, os três lugares precisam ser atualizados.

### Risco de alterar comportamento

- Alterar o **corpo** do `.md`: **RISCO CRÍTICO** — muda o system prompt do agente
- Alterar o **`description` do frontmatter**: **RISCO ALTO** — muda o routing de sub-agentes pelo Claude Code
- Alterar o `label` nos arquivos TS/Python: **RISCO ZERO** — puramente display

---

## 4. Skills

### Estrutura

```
.claude/skills/{skill-id}/
  SKILL.md          ← frontmatter (name, description, allowed-tools) + corpo de instrução
  scripts/          ← Python/shell executáveis
  references/       ← documentação de referência lida pelos agentes
```

Há **38 SKILL.md** files (um por diretório de skill), mais scripts e references.

### Campos traduzíveis (display-only)

| Campo | Localização | Risco |
|---|---|---|
| `name` do SKILL.md | Frontmatter | ❌ NÃO — é o slug/ID da skill usado internamente |
| `description` do SKILL.md | Frontmatter | ⚠️ RISCO — usado por Claude para triggering |
| Título H1 no corpo | `# AI Image Creator` | ⚠️ RISCO MÉDIO — parte do sistema de instrução |
| Texto de ajuda ao usuário | Partes do corpo em prosa | ⚠️ RISCO — misturado com instruções técnicas |

### Campos proibidos de traduzir

Dentro de cada SKILL.md:
- `name:` no frontmatter (é o ID da skill)
- `allowed-tools:` (nomes de tools Claude Code)
- `compatibility:` (instrução técnica)
- `metadata.tags:` (keywords de routing)
- Blocos de código (````python`, ````bash`, ````markdown`)
- Nomes de flags CLI (`--model`, `--analyze`, `-t`, `-r`)
- Caminhos de arquivo (`~/.zshrc`, `/workspace/`)
- Scripts Python em `scripts/` — jamais
- Arquivos em `references/` — são documentação técnica interna

### Origem na UI

```
.claude/skills/{id}/SKILL.md  →  GET /api/skills  (description do frontmatter)  →  Skills.tsx cards
.claude/skills/{id}/SKILL.md  →  GET /api/skills/{id} (raw markdown)  →  SkillDetail.tsx → <Markdown>
```

Idêntico ao padrão de agentes. O mesmo arquivo serve runtime e UI.

---

## 5. i18n existente

| Locale | Arquivo | Status |
|---|---|---|
| pt-BR | `dashboard/frontend/src/i18n/locales/pt-BR/index.ts` | ✅ Existe e completo para UI chrome |
| en-US | `dashboard/frontend/src/i18n/locales/en-US/index.ts` | ✅ Existe |
| es | `dashboard/frontend/src/i18n/locales/es/index.ts` | ✅ Existe |

**O que o i18n atual cobre:**
- Navegação, botões, labels de formulário, mensagens de erro
- Strings da página Agents (`agents.title`, `agents.subtitle`, `agents.welcomeBanner`, etc.)
- Strings da página Skills (`skills.title`, `skills.subtitle`, etc.)

**O que NÃO está no i18n:**
- `agent.description` (vem da API — do frontmatter do `.md`)
- `meta.label` em `Agents.tsx` (hardcoded em TS, duplicado em 3 lugares)
- Conteúdo da aba Profile (vem da API como raw markdown)
- `CATEGORY_META.label/description` em `Agents.tsx` (hardcoded)
- `TIER_LABELS` em `Agents.tsx` (hardcoded)
- Filter tab labels `'All'`, `'Business'`... (hardcoded)

**Como integrar:**
- Labels simples (CATEGORY_META, TIER_LABELS, filter tabs, agent labels): adicionar chaves ao i18n existente
- Descriptions e profiles de agentes: overlay separado (ver §6)

---

## 6. Arquitetura recomendada

### Opção escolhida: B — Overlay pt-BR em arquivos separados (frontend-only)

**Por quê esta opção:**
- Runtime files (`.claude/agents/*.md`, `.claude/skills/*/SKILL.md`) nunca são tocados
- Sem risco de quebrar system prompts, routing, ou comportamento dos agentes
- Fácil reapply após upstream merge: arquivos de overlay são independentes
- Compatível com o modelo white-label já estabelecido (brand/clever-agent/)
- Extensível para outros idiomas no futuro

### Paths sugeridos

```
dashboard/frontend/src/lib/clever-agent/
  agents-display-pt-BR.ts       ← labels + descriptions traduzidas dos cards
  skills-display-pt-BR.ts       ← labels + descriptions traduzidas dos cards de skills

brand/clever-agent/i18n/pt-BR/
  profiles/
    oracle.md                   ← Tradução do Profile tab do Oracle
    aria-hr.md                  ← Tradução do Profile tab de Aria
    ...                         ← Um arquivo por agente (somente os necessários)
  skills/
    ai-image-creator.md         ← Tradução do SkillDetail de ai-image-creator
    ...
```

Também adicionar ao i18n existente (`pt-BR/index.ts`):
```typescript
agents: {
  // ... chaves existentes ...
  categoryBusiness: 'Negócios',
  categoryEngineering: 'Engenharia',
  categoryCustom: 'Personalizado',
  tierReasoning: 'Raciocínio · opus',
  tierExecution: 'Execução · sonnet',
  tierSpeed: 'Velocidade · haiku',
  filterAll: 'Todos',
  // agent labels (opcional — se mover label para i18n)
}
```

### Formato sugerido para agents-display-pt-BR.ts

```typescript
// dashboard/frontend/src/lib/clever-agent/agents-display-pt-BR.ts
export const AGENTS_DISPLAY_PT_BR: Record<string, {
  label: string
  description: string
}> = {
  'aria-hr': {
    label: 'RH / Pessoas',
    description: 'Use este agente para atividades de RH e Operações de Pessoas...',
  },
  'oracle': {
    label: 'Conhecimento',
    description: 'Use este agente como ponto de entrada único do Clever Agent...',
  },
  // ... 38 agentes
}
```

### Como usar na UI

Em `Agents.tsx`, antes de renderizar `agent.description`:

```typescript
import { AGENTS_DISPLAY_PT_BR } from '@/lib/clever-agent/agents-display-pt-BR'

const { i18n } = useTranslation()
const lang = i18n.language  // 'pt-BR', 'en-US', 'es'

const displayDesc = lang === 'pt-BR'
  ? (AGENTS_DISPLAY_PT_BR[agent.name]?.description ?? agent.description)
  : agent.description
```

Para o Profile tab em `AgentDetail.tsx`, verificar se existe overlay antes de renderizar o raw markdown:

```typescript
// Pseudo-código — o fetch do overlay seria do backend ou bundle
const profileOverlay = await fetchProfileOverlay(name, lang)  // null se não existir
const bodyToRender = profileOverlay ?? extractProfileBody(content)
```

---

## 7. Campos proibidos de traduzir

Lista explícita de campos que **NUNCA** devem ser traduzidos:

### Em `.claude/agents/{name}.md`
- `name:` no frontmatter — é o slug/ID do agente
- `model:` no frontmatter — identificador de modelo (`sonnet`, `opus`, `haiku`)
- `color:` no frontmatter — token de cor
- `memory:` no frontmatter — instrução de memória
- `tools:` no frontmatter — nomes de tools Claude Code (`Read`, `Write`, `Bash`, etc.)
- O **corpo inteiro** do markdown — é o system prompt; traduzir muda o comportamento

### Em `.claude/skills/{id}/SKILL.md`
- `name:` no frontmatter — slug da skill
- `allowed-tools:` no frontmatter — nomes de tools
- `compatibility:` no frontmatter — instrução técnica
- `metadata.tags:` — keywords de routing
- Blocos de código (```python, ```bash, ```markdown)
- Flags CLI, caminhos, nomes de arquivo, env vars
- Scripts em `scripts/` — código executável

### Em geral
- Slugs e IDs de qualquer tipo
- Nomes de comandos (`/oracle`, `/aria`, `/flux`)
- Nomes de paths (`workspace/`, `.claude/`, `memory/`)
- Nomes de ferramentas/tools
- Variáveis de ambiente
- JSON/YAML estrutural
- Qualquer bloco `<code>` ou monospace no markdown

---

## 8. Plano de implementação

### Fase 1 — Labels e categories ✅ IMPLEMENTADO (beta.16)

**O que:** traduzir labels de agentes, categorias, tiers e filter tabs na UI.

**Onde:**
- `dashboard/frontend/src/pages/Agents.tsx` — `CATEGORY_META`, `TIER_LABELS`, filter tabs, `AGENT_META.label`
- `dashboard/frontend/src/lib/agent-meta.ts` — `AGENT_META_SEED.label`
- `dashboard/backend/agent_meta_seed.py` — `NATIVE_AGENT_SEED.label`
- `dashboard/frontend/src/i18n/locales/pt-BR/index.ts` — adicionar chaves de category/tier/filter

**Risco:** Baixo — campos puramente display.

**Status:** ✅ Concluído em `1e99e2a` (beta.16). 38 labels + categorias + tiers + filter tabs.

### Fase 2 — Overlay frontend-only: descriptions + profiles + skills ✅ IMPLEMENTADO (beta.18 planejado)

**O que:** overlay frontend-only com descriptions de cards de agentes, profile do Oracle, e descriptions/bodies de skills.

**Implementação real (diverge do plano original):**
- Arquitetura escolhida: overlay TypeScript puro no frontend, sem fetch adicional ao backend.
- `dashboard/frontend/src/lib/localization/pt-BR/agent-overlays.ts` — 38 descriptions + Oracle profile completo
- `dashboard/frontend/src/lib/localization/pt-BR/skill-overlays.ts` — 27 skills com title+description, `ai-image-creator` com body completo
- Integração em 4 páginas: `Agents.tsx`, `AgentDetail.tsx`, `Skills.tsx`, `SkillDetail.tsx`
- Fallback automático para inglês quando overlay ausente

**Cobertura:**
- 38/38 agent descriptions ✅
- 1/38 agent profiles (Oracle) ✅
- 27 skills com title+description ✅
- 1 skill com body completo (ai-image-creator) ✅
- `.claude/agents` e `.claude/skills` intocados ✅

**Risco:** Médio — display-only; runtime nunca recebe traduções.

**Ver:** `docs/clever-agent/pt-br-agent-skill-overlay.md`

### Fase 3 — Completar profiles de agentes (pendente)

**O que:** adicionar profiles pt-BR completos para os demais 37 agentes (além de Oracle).

**Onde:** `dashboard/frontend/src/lib/localization/pt-BR/agent-overlays.ts` — adicionar campo `profile` por agente.

**Risco:** Baixo — mesmo mecanismo da Fase 2, apenas mais conteúdo.

### Fase 4 — Completar bodies de skills (pendente)

**O que:** adicionar bodies pt-BR completos para as skills pendentes (atualmente só `ai-image-creator` tem body).

**Onde:** `dashboard/frontend/src/lib/localization/pt-BR/skill-overlays.ts` — adicionar campo `body` por skill.

**Risco:** Baixo — mesmo mecanismo da Fase 2, apenas mais conteúdo.

### Fase 4 — Skill descriptions (cards)

**O que:** criar arquivo de overlay `skills-display-pt-BR.ts` para descriptions dos cards de skills.

**Onde:** `dashboard/frontend/src/lib/clever-agent/skills-display-pt-BR.ts`

**Risco:** Baixo para cards. Não tocar o corpo das SKILL.md.

### Fase 5 — Documentação e validação

**O que:** registrar todos os arquivos de overlay criados, atualizar patch ledger, criar checklist.

**Validação completa:**
1. Build frontend (`npm run build`) — 0 erros
2. Abrir `/agents` — cards em pt-BR
3. Abrir `/agents/oracle` — Profile em pt-BR (se overlay criado)
4. Abrir `/skills` — cards em pt-BR
5. Chat com Oracle — responde em pt-BR (via `workspace.language`) — sem mudança
6. Chat com Aria — responde corretamente — sem mudança
7. Mudar idioma para en-US — volta ao original

---

## 9. Checklist de validação

Após cada fase de implementação:

- [x] `npm run build` — 0 erros TypeScript
- [x] `/agents` — labels das categorias em pt-BR
- [x] `/agents` — descriptions dos cards em pt-BR
- [x] `/agents/oracle` — aba Profile em pt-BR
- [ ] Runtime intacto — chat com Oracle responde normalmente
- [ ] Runtime intacto — chat com Aria responde normalmente
- [x] `/skills` — cards com descriptions em pt-BR
- [x] `/skills/ai-image-creator` — detalhe mostra body pt-BR completo
- [ ] Mudar idioma para en-US — conteúdo original restaurado
- [x] Nenhum arquivo `.claude/agents/*.md` alterado
- [x] Nenhum arquivo `.claude/skills/*/SKILL.md` alterado
- [x] Nenhum script Python nos skills alterado

---

## 10. Status beta.18

Publicado no dashboard `0.33.0-clever-beta.18`.

- Agent cards: 38/38 descriptions em pt-BR.
- Agent Profile: Oracle completo em pt-BR.
- Skills: 28/28 title + description em pt-BR.
- Skill body: `ai-image-creator` completo em pt-BR.
- Runtime: `.claude/agents` e `.claude/skills` intocados.
- Pendências: 37 agent profiles completos e 26 skill bodies restantes.

Release notes: `docs/clever-agent/beta-release-0.33.0-clever-beta.18.md`.

---

## 11. Próximo prompt recomendado

O prompt abaixo implementa a **Fase 1** (labels e categories) — baixo risco, sem tocar runtime:

---

```
Projeto: Clever Agent
Ambiente: PC Local Windows
Repo: D:\DEV\Clever Agent\evo-nexus
Branch inicial: clever-dev
Versão alvo: 0.33.0-clever-beta.16

Objetivo:
Implementar Fase 1 da localização pt-BR de agentes:
traduzir labels de agentes, nomes de categorias, tiers e filter tabs na UI.
Não tocar runtime. Não tocar .claude/agents/*.md. Não tocar .claude/skills/.

Baseado no documento:
docs/clever-agent/pt-br-agent-skills-localization-audit.md — §8 Fase 1

Arquivos a alterar:
1. dashboard/frontend/src/pages/Agents.tsx
   - CATEGORY_META: 'Business' → 'Negócios', 'Engineering' → 'Engenharia', 'Custom' → 'Personalizado'
   - TIER_LABELS: 'Reasoning · opus' → 'Raciocínio · opus', 'Execution · sonnet' → 'Execução · sonnet', 'Speed · haiku' → 'Velocidade · haiku'
   - Filter tabs: 'All' → 'Todos', 'Business' → 'Negócios', 'Engineering' → 'Engenharia', 'Custom' → 'Personalizado'
   - AGENT_META labels: traduzir para pt-BR os labels dos 38 agentes
   - Strings hardcoded visíveis ao usuário (ex: 'No description available.', 'Sem acesso', 'Running')

2. dashboard/frontend/src/lib/agent-meta.ts
   - AGENT_META_SEED labels: mesma tradução dos 38 agentes

3. dashboard/backend/agent_meta_seed.py
   - NATIVE_AGENT_SEED labels: mesma tradução dos 38 agentes

4. dashboard/frontend/src/i18n/locales/pt-BR/index.ts
   - Adicionar chaves agents.categoryBusiness, agents.categoryEngineering, agents.categoryCustom
   - Adicionar chaves agents.tierReasoning, agents.tierExecution, agents.tierSpeed
   - Adicionar chaves agents.filterAll, agents.filterBusiness, agents.filterEngineering, agents.filterCustom

Regras:
- NÃO alterar .claude/agents/*.md
- NÃO alterar .claude/skills/**
- NÃO commitar secrets
- NÃO publicar imagem ainda (avaliar depois)
- NÃO acessar VPS
- Fazer npm run build ao final para confirmar 0 erros

[... resto do prompt padrão de missão ...]
```

---

*Auditoria concluída. Nenhum arquivo de código foi alterado.*
