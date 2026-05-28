# Clever Agent — Agent-facing Branding Cleanup

**Data:** 2026-05-27
**Branch:** `clever-dev`
**Patch:** operacional — sem rebuild de imagem nova

---

## 1. Sintoma

Oracle respondeu "Bem-vinda ao EvoNexus" na UI Clever Agent.

Causa imediata: o arquivo `.claude/agents/oracle.md` — definição do agente Oracle — continha a marca upstream "EvoNexus" em múltiplos pontos, incluindo no ponto de entrada da conversa e nos templates de resposta.

---

## 2. Causa

Prompts, skills, rules, templates, docs e seeds lidos pelos agentes ou exibidos ao usuário ainda continham a marca upstream "EvoNexus / Evo Nexus".

Os arquivos em `.claude/` (agents, skills, commands, rules) são lidos diretamente pelo Claude Code como contexto. O texto que eles contêm é citado literalmente nas respostas dos agentes.

---

## 3. Escopo corrigido

### 3.1 Agent-facing direto (`.claude/`)

| Diretório | Arquivos corrigidos |
|---|---|
| `.claude/agents/` | `oracle.md`, `apex-architect.md`, `flow-git.md` |
| `.claude/commands/` | `oracle.md` |
| `.claude/rules/` | `agents.md`, `dev-phases.md`, `heartbeats.md` |
| `.claude/skills/` | 38 SKILL.md com ocorrências |
| `.claude/templates/html/` | `morning-briefing.html`, `weekly-review.html` |

### 3.2 Docs UI / user-facing (`docs/`)

Todos os arquivos em `docs/` exceto `docs/clever-agent/` (histórico técnico) e `docs/real-world/evolution-foundation.md` (preservado). Total: 32 arquivos.

### 3.3 Site marketing (`site/src/i18n/`)

`en.json`, `pt-BR.json`, `es.json`, `index.ts`

### 3.4 Workspace seeds

`workspace/learning/README.md`, `config/workspace.example.yaml`

### 3.5 Plugin template (texto visível)

`cli/templates/plugin-skeleton/agents/example.md`, `cli/templates/plugin-skeleton/README.md`

### 3.6 Frontend components

| Arquivo | Mudança |
|---|---|
| `dashboard/frontend/src/pages/TicketDetail.tsx` | Prompt injetado no agente: "on EvoNexus" → "on Clever Agent" |
| `dashboard/frontend/src/pages/Backups.tsx` | Hint visível ao usuário: `backups/evonexus/` → `backups/clever-agent/` |
| `dashboard/frontend/src/pages/UIPlayground.tsx` | Texto UI: `@evonexus/ui Playground` → `UI Playground` |
| `dashboard/frontend/src/i18n/index.ts` | Comentário de módulo |
| `dashboard/frontend/src/pages/onboarding/OnboardingHeader.tsx` | Comentário de componente |

### 3.7 Terminal server (contexto injetado nos agentes)

| Arquivo | Mudança |
|---|---|
| `dashboard/terminal-server/src/chat-bridge.js` | Dois contextos: "running inside EvoNexus dashboard" → "running inside Clever Agent dashboard" |
| `dashboard/terminal-server/src/utils/openrouter-smart-router.js` | HTTP header X-Title e status name |
| `dashboard/terminal-server/bin/server.js` | Startup log |

### 3.8 Backend — strings user/agent-visible

| Arquivo | Mudança |
|---|---|
| `dashboard/backend/brain_repo/manifest.py` | Template do README do brain repo (lido por agentes) |
| `dashboard/backend/brain_repo/kb_mirror.py` | Texto gerado em arquivos do workspace |
| `dashboard/backend/brain_repo/job_runner.py` | Autor de commits git: "EvoNexus" → "clever-agent" |
| `dashboard/backend/routes/brain_repo.py` | Mesmo autor git (duplicata no router) |
| `dashboard/backend/knowledge/auto_migrator.py` | Mensagens de erro visíveis ao usuário |
| `dashboard/backend/routes/services.py` | Docstring de endpoint |
| `dashboard/backend/routes/providers.py` | Docstring de módulo |
| `scheduler.py` | Docstring e print de startup |
| `backup.py` | Docstring, argparse description, default workspace name |
| `plugins/_v2-mock/plugin.yaml` | Campo `author:` |
| `plugins/_v2-mock/seed-dev.py` | Mesmo campo author |
| `docs/real-world/evolution-foundation.md` | "EvoNexus" → "Clever Agent" (agentes podem citar este doc) |

---

## 4. Ocorrências preservadas (técnico)

| Padrão | Motivo |
|---|---|
| `evonexus.db` | Nome do arquivo de banco SQLite — mudança quebraria containers em produção |
| `_evonexus_managed` | Sentinel JSON em `.claude/settings.json` — identifica hooks gerenciados; mudar quebraria idempotência |
| `evonexus_version` | Campo obrigatório do schema de plugin (`plugin_schema.py`); manifests existentes usam esta chave |
| `evonexus_dim` | Variável Python interna em `auto_migrator.py` |
| `@evoapi/evonexus-ui` | Pacote npm real — importações em templates e UI components |
| `@evoapi/evo-nexus` | Pacote npm CLI — comandos em README de templates |
| `evonexus-backup-*.zip` | Pattern de glob para encontrar backups existentes — mudar quebraria restore de backups antigos |
| `evonexus-pg-*` | Prefixo de arquivos temporários técnicos |
| `evonexus-backups/` | Prefixo S3 default (compatibilidade com buckets existentes) |
| `evonexus` (CLI binary) | Definido em `pyproject.toml` como entry point; mudança requereria rebuild e reempacotamento |
| `evonexus-migrate` | CLI binary definido em `pyproject.toml` |
| `~/.cache/evonexus/` | Caminhos de filesystem existentes para sentinelas de instalação |
| `~/.evonexus_*` e `~/.claude.json.evonexus.lock` | Arquivos de lock e log no filesystem |
| `evonexus-knowledge-uploads` | Diretório temporário técnico |
| `PRODUCT = "evo-nexus"` em `licensing.py` | Identificador de produto na API de licença externa |
| `User-Agent: EvoNexus/...` | Header HTTP para API de licença externa |
| `application_name: "evonexus-*"` | Nome de conexão PostgreSQL |
| localStorage keys `evonexus.*` | Chaves de storage existentes nos browsers de usuários — mudar perde configurações |
| `initEvoNexusSdk()` | Nome de função em `evonexus-sdk.ts` — mudança requereria renomear arquivo e todas as importações |
| `min_evonexus_version` | Campo schema de plugin — validado em `plugin_schema.py` |
| `dashboard/cli/evonexus_*.py` | Nomes de módulos Python — importações em outros arquivos |
| `.github/workflows/` | CI/CD — técnico |
| `docs/clever-agent/` | Histórico técnico interno — não lido pelos agentes em sessão normal |
| `brand/clever-agent/design-system.md` seção 17 | Nota de atribuição legal upstream (in progress de licença formal) |
| `CHANGELOG.md`, `CONTRIBUTING.md`, `NOTICE.md`, `TRADEMARKS.md`, `SECURITY.md` | Docs legais/upstream — não lidos pelos agentes |
| `evonexus.stack.yml` | Stack upstream — referência técnica |
| Todos os `package.json` com `@evoapi/` | Package names npm reais |
| `pyproject.toml`, `setup.py` | Package names Python |
| Todos os arquivos de teste | Testam comportamento upstream — referência técnica |

---

## 5. Validação

### Busca final — agent-facing

```bash
# Zero ocorrências em .claude/
grep -rn "EvoNexus\|Evo Nexus" .claude/

# Zero ocorrências em docs/ (exceto clever-agent/ histórico)
grep -rn "EvoNexus\|Evo Nexus" docs/ --exclude-dir=clever-agent

# Zero injeções de contexto em chat-bridge.js
grep -n "EvoNexus" dashboard/terminal-server/src/chat-bridge.js

# Zero no prompt de ticket
grep -n "EvoNexus" dashboard/frontend/src/pages/TicketDetail.tsx
```

### Build

- ✅ Frontend: `npm run build` passou (24.53s)
- ✅ JS syntax: `node --check` passou em todos os arquivos .js modificados
- ⚠️ Python compile: indisponível no Windows (Python 3.10 path quebrado); apenas substituições de strings em literais/docstrings — sem alterações sintáticas

---

## 6. Reapply checklist — EvoNexus → Clever Agent

Após qualquer merge upstream:

- [ ] Buscar `EvoNexus/Evo Nexus` em `.claude/agents/*.md`, `.claude/skills/*/SKILL.md`, `.claude/rules/*.md`, `.claude/commands/*.md`
- [ ] Buscar `EvoNexus` em `docs/` (exceto `docs/clever-agent/`)
- [ ] Buscar injeções de contexto em `chat-bridge.js` (linhas com `You are running inside`)
- [ ] Buscar em `TicketDetail.tsx` (linhas com `push(` + texto de contexto)
- [ ] Verificar `brain_repo/manifest.py` — template do README do brain repo
- [ ] Verificar `brain_repo/job_runner.py` e `routes/brain_repo.py` — author de commit git
- [ ] Substituir texto de marca por `Clever Agent` (visível/agent-facing)
- [ ] NÃO substituir: `evonexus.db`, `_evonexus_managed`, `@evoapi/*`, `evonexus-backup-*`, localStorage keys, CLI binaries
- [ ] Rodar `npm run build` no frontend após qualquer mudança em `.tsx`/`.ts`
- [ ] Validar Oracle: primeira resposta não deve conter "EvoNexus"

---

## 7. Evo CRM → Clever AI

**Data:** 2026-05-28
**Patch:** beta.10 (consolidado)

### 7.1 Sintoma

A integração CRM aparecia como "Evo CRM" no dashboard de integrações e nos prompts/skills lidos pelos agentes. O produto white-label da plataforma CRM upstream é **Clever AI**.

### 7.2 Causa

Os arquivos em `.claude/` (agents, skills), `docs/integrations/`, `dashboard/backend/routes/integrations.py` e `dashboard/frontend/src/lib/integrationMeta.ts` ainda referenciavam "Evo CRM" como nome do produto — o nome upstream.

### 7.3 Escopo corrigido

**Padrão substituído:** `"Evo CRM"` → `"Clever AI"` (exato, case-sensitive, com espaço)

Nenhuma variante `EVO CRM` / `Evolution CRM` / `EvoCRM` foi encontrada no repositório.

#### Agentes (`.claude/agents/`)

| Arquivo | Ocorrências | Mudança |
|---|---|---|
| `canvas-designer.md` | 1 | Exemplo de uso: "Evo CRM admin" → "Clever AI admin" |
| `dex-data.md` | 2 | Descrição de fontes e tabela de integrações |
| `zara-cs.md` | 1 | "You integrate with Evo CRM" → "You integrate with Clever AI" |

#### Skills (`.claude/skills/`)

| Arquivo | Ocorrências | Mudança |
|---|---|---|
| `int-evo-crm/SKILL.md` | 1 | H1 heading `# Evo CRM` → `# Clever AI` |
| `data-analyze/SKILL.md` | 3 | description, tabela de fontes, exemplo de uso |
| `data-build-dashboard/SKILL.md` | 2 | description, passo de execução |
| `data-create-viz/SKILL.md` | 2 | description, condicional de fonte |
| `data-explore/SKILL.md` | 2 | description, condicional de fonte |
| `data-statistical-analysis/SKILL.md` | 2 | Exemplos de interpretação causal |
| `data-validate/SKILL.md` | 2 | description, exemplo de uso |
| `data-write-query/SKILL.md` | 3 | description, comentário de dialeto, exemplo de query |
| `pm-metrics-review/SKILL.md` | 1 | Tabela de fontes `Evo CRM (int-evo-crm)` |
| `pm-synthesize-research/SKILL.md` | 4 | Fontes de dados, validação com dados, sizing de persona |
| `pulse-faq-sync/SKILL.md` | 1 | Heading `## Evo CRM` → `## Clever AI` |
| `sage-competitive-analysis/SKILL.md` | 1 | Tabela competitiva "Integrated CRM" |

#### Documentação (`docs/`)

| Arquivo | Ocorrências | Mudança |
|---|---|---|
| `docs/integrations/evo-crm.md` | 9 | Título, descrição, todas as referências ao produto; env vars `EVO_CRM_URL`/`EVO_CRM_TOKEN` preservados |
| `docs/integrations/overview.md` | 2 | Tabela de integrações e lista de links |

#### Dashboard — backend e frontend

| Arquivo | Ocorrências | Mudança |
|---|---|---|
| `dashboard/backend/routes/integrations.py` | 2 | `{"name": "Evo CRM", ...}` → `"Clever AI"`; comentário inline |
| `dashboard/frontend/src/lib/integrationMeta.ts` | 2 | Hints de campo: "Token de acesso do Evo CRM" → "Clever AI"; "URL base da instância Evo CRM" → "Clever AI" |

#### READMEs

| Arquivo | Ocorrências | Mudança |
|---|---|---|
| `README.md` | 2 | Lista de integrações; link "[Evo CRM Community]" → "[Clever AI Community]" (URL GitHub preservada) |
| `README.swarm.md` | 2 | Lista de integrações; tabela de requisitos de rede |

**Total:** 21 arquivos, ~44 ocorrências substituídas.

### 7.4 Ocorrências preservadas

| Padrão | Motivo |
|---|---|
| `int-evo-crm` | Identificador técnico da skill (folder name, YAML `name:`, paths de script) — usado programaticamente |
| `EVO_CRM_TOKEN`, `EVO_CRM_URL` | Nomes de variáveis de ambiente — mudar quebraria containers configurados |
| `evo_crm_client.py` | Nome do script Python da skill — mudar requereria renomear o arquivo e atualizar todos os caminhos |
| `evo-crm-community` | Repositório GitHub externo (Evolution Foundation) — URL real, não controlada pelo Clever Agent |
| `evo-crm.md` | Nome do arquivo de documentação — links internos e externos apontam para este path |
| `CHANGELOG.md` (linhas históricas) | Histórico de releases upstream — não lido pelos agentes em sessão normal |

### 7.5 Reapply checklist — Evo CRM → Clever AI

Após qualquer merge upstream:

- [ ] `grep -rn "Evo CRM" .claude/ --include="*.md"` → zero resultados
- [ ] `grep -rn "Evo CRM" docs/integrations/` → zero resultados
- [ ] `grep -n "Evo CRM" dashboard/backend/routes/integrations.py` → zero resultados
- [ ] `grep -n "Evo CRM" dashboard/frontend/src/lib/integrationMeta.ts` → zero resultados
- [ ] Verificar `README.md` e `README.swarm.md` — listas de integrações
- [ ] NÃO renomear: `int-evo-crm`, `EVO_CRM_TOKEN`, `EVO_CRM_URL`, `evo_crm_client.py`, `evo-crm-community`
- [ ] Rodar `npm run build` após mudanças em `.ts`/`.tsx`
- [ ] Validar: página de Integrações no dashboard mostra "Clever AI" (não "Evo CRM")

---

## 8. Tabelas granulares — EvoNexus → Clever Agent

Abaixo a visão por arquivo de todas as substituições `EvoNexus / Evo Nexus / Evo-Nexus` → `Clever Agent` / `clever-agent` aplicadas no beta.10.

### 8.1 `.claude/` — agent-facing direto

| Arquivo | Padrão substituído | Contexto |
|---|---|---|
| `.claude/agents/oracle.md` | `EvoNexus` (7×) | Welcome template, discovery templates, descrição do agente |
| `.claude/agents/apex-architect.md` | `EvoNexus` | Contexto do workspace |
| `.claude/agents/flow-git.md` | `EvoNexus` | Contexto do workspace |
| `.claude/commands/oracle.md` | `EvoNexus` | Definição de comando |
| `.claude/rules/agents.md` | `EvoNexus` | Regras de comportamento de agentes |
| `.claude/rules/dev-phases.md` | `EvoNexus` | Regras de fase de desenvolvimento |
| `.claude/rules/heartbeats.md` | `EvoNexus` | Regras de heartbeat |
| `.claude/skills/` (38 skills) | `EvoNexus` | Ocorrências em descriptions e corpos de SKILL.md |
| `.claude/templates/html/morning-briefing.html` | `EvoNexus` | Template de briefing HTML |
| `.claude/templates/html/weekly-review.html` | `EvoNexus` | Template de revisão semanal HTML |

### 8.2 `docs/` — user-facing

32 arquivos em `docs/` (exceto `docs/clever-agent/` e `docs/real-world/evolution-foundation.md` preservado):
- `docs/agents/*.md` — definições de agentes
- `docs/integrations/*.md` — guias de integração
- `docs/getting-started.md`, `docs/skills.md`, `docs/commands.md`, etc.

### 8.3 `site/src/i18n/`

| Arquivo | Padrão substituído |
|---|---|
| `en.json` | `EvoNexus` / `Evo Nexus` |
| `pt-BR.json` | `EvoNexus` / `Evo Nexus` |
| `es.json` | `EvoNexus` / `Evo Nexus` |
| `index.ts` | comentário de módulo |

### 8.4 Frontend components

| Arquivo | Mudança |
|---|---|
| `dashboard/frontend/src/pages/TicketDetail.tsx` | Prompt injetado no agente: "on EvoNexus" → "on Clever Agent" |
| `dashboard/frontend/src/pages/Backups.tsx` | Hint visível: `backups/evonexus/` → `backups/clever-agent/` |
| `dashboard/frontend/src/pages/UIPlayground.tsx` | Texto UI: `@evonexus/ui Playground` → `UI Playground` |

### 8.5 Terminal server

| Arquivo | Mudança |
|---|---|
| `dashboard/terminal-server/src/chat-bridge.js` | 2 contextos injetados: "inside EvoNexus dashboard" → "inside Clever Agent dashboard" |
| `dashboard/terminal-server/src/utils/openrouter-smart-router.js` | HTTP header `X-Title` e status name |
| `dashboard/terminal-server/bin/server.js` | Startup log |

### 8.6 Backend

| Arquivo | Mudança |
|---|---|
| `dashboard/backend/brain_repo/manifest.py` | Template README do brain repo |
| `dashboard/backend/brain_repo/kb_mirror.py` | Texto gerado em arquivos do workspace |
| `dashboard/backend/brain_repo/job_runner.py` | Autor de commits git |
| `dashboard/backend/routes/brain_repo.py` | Autor de commits git |
| `dashboard/backend/knowledge/auto_migrator.py` | Mensagens de erro |
| `scheduler.py` | Docstring e print de startup |
| `backup.py` | Docstring, argparse description, workspace name default |
