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

## 6. Reapply checklist

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
