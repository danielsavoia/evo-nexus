# Upstream v0.33 Reconciliation — Clever Agent

**Date:** 2026-05-24
**Branch:** `clever-dev`
**Author:** automated via Claude (Etapa 6)

---

## 1. Base anterior

| Campo | Valor |
|---|---|
| Branch | `upstream-sync` → `upstream/main` |
| Commit | `7f5dd76` |
| Descrição | `feat(licensing): headless auto-activation via EVOLUTION_OPERATOR_EMAIL` |
| Última tag estável | `v0.32.3` (`fb9ebd2`) |

---

## 2. Base nova (alvo v0.33.x)

| Campo | Valor |
|---|---|
| Branch | `upstream/develop` |
| Commit | `fe15fd5` |
| Descrição | `fix(knowledge): port api_keys to SQLAlchemy and hard-delete on revoke` |
| Tag v0.33.0 | `197226c` — `release: v0.33.0 — plugin contract bundle + install error surfacing (#57)` |
| Por que develop? | `v0.33.0` ainda não foi mergeada para `upstream/main`; `upstream/develop` inclui v0.33.0 + correções adicionais de knowledge/SQLAlchemy |

---

## 3. Estratégia aplicada

**Upstream-first com preservação de white-label Clever:**

1. `upstream-sync` resetado via `git reset --hard upstream/develop` e publicado com `--force-with-lease` (branch de rastreamento limpo, sem histórico Clever).
2. `clever-dev` mergeado com `upstream-sync` via `git merge upstream-sync --no-ff`.
3. Conflitos resolvidos mantendo Clever para branding e upstream para funcionalidades técnicas.

---

## 4. Conflitos encontrados e resolução

### `dashboard/frontend/index.html`
- **Clever (HEAD):** `<title>Clever Agent</title>`
- **Upstream:** `<title>Evo Workspace</title>` + importmap para React shim (plugin bundles)
- **Resolução:** Mantido `<title>Clever Agent</title>` + adicionado importmap upstream (técnico, necessário para plugins v2)

### `dashboard/frontend/vite.config.ts`
- **Clever (HEAD):** porta 8081 + proxy `/ws`
- **Upstream:** porta 8080 + `resolve.conditions` para `@evonexus/ui`
- **Resolução:** Mantida porta 8081 e `/ws` (fix local) + adicionado `resolve.conditions` upstream (técnico)

---

## 5. Bug upstream corrigido durante reconciliação

**`dashboard/frontend/src/index.css`:** importava `@evonexus/ui/tokens.css` mas o pacote chama-se `@evoapi/evonexus-ui`.
- Corrigido para: `@import "@evoapi/evonexus-ui/tokens.css";`
- Causa raiz: inconsistência de nomenclatura no upstream entre o nome do pacote npm e o caminho de importação no CSS.

---

## 6. Arquivos críticos preservados

| Arquivo/Pasta | Status |
|---|---|
| `brand/clever-agent/` | ✅ Preservado |
| `docs/clever-agent/governance.md` | ✅ Preservado |
| `dashboard/frontend/public/clever-agent-dark.svg` | ✅ Preservado |
| `dashboard/frontend/public/favicon.svg` | ✅ Preservado |
| `dashboard/frontend/index.html` — `<title>Clever Agent</title>` | ✅ Preservado |
| `Sidebar.tsx` — footer "Clever Agent · Open source" | ✅ Preservado |
| `Login.tsx`, `Setup.tsx`, `Welcome.tsx` — logos dark | ✅ Preservado |
| `Agents.tsx` — fix i18n `agents.subtitle` | ✅ Preservado |
| `api.ts` — `const API = ''` (proxy relativo) | ✅ Preservado |

---

## 7. Scope das mudanças upstream integradas

- **232 arquivos**, 34.679 inserções, 2.490 remoções
- Dashboard: 133 arquivos (frontend + backend)
- Docker/CI: 11 arquivos
- Docs: 2 arquivos
- Outros (Python, testes, scripts): 83 arquivos

### Principais features do v0.33.0 integradas

| Feature | Arquivos chave |
|---|---|
| PostgreSQL nativo (Alembic migrations, SQLAlchemy) | `dashboard/alembic/`, `dashboard/backend/db/` |
| Plugin public pages (B2.0) | `dashboard/backend/routes/plugin_public_pages.py` |
| Plugin writable_data + RBAC | `dashboard/backend/plugin_schema.py` |
| Plugin safe_uninstall (B3) | `dashboard/backend/plugin_migrator.py`, `PluginUninstall.tsx` |
| Pacote `@evoapi/evonexus-ui` (UI kit shared) | `dashboard/packages/ui/` |
| React plugin shims (importmap) | `dashboard/frontend/public/react-shim.js` |
| Routine run store (PG) | `dashboard/backend/routine_run_store.py` |
| Chat messages persist (PG) | `dashboard/backend/routes/chat_messages.py` |
| Knowledge API keys (SQLAlchemy) | `dashboard/backend/knowledge/api_keys.py` |
| Import-logs CLI | `dashboard/cli/evonexus_import_logs.py` |
| Workspace audit | `dashboard/backend/workspace_audit.py` |

---

## 8. Regressões visuais remanescentes (para próxima missão)

| Tipo | Localização | Classificação |
|---|---|---|
| `window.EvoNexus`, `EvoNexusSDK`, `initEvoNexusSdk` | `evonexus-sdk.ts` | **Técnico — NÃO alterar** (constraint) |
| `@evoapi/evonexus-ui` package name | Imports técnicos | **Técnico — NÃO alterar** |
| `EVONEXUS_ALLOW_FORCE_UNINSTALL` | Env var técnica | **Técnico — NÃO alterar** |
| `localStorage` keys `evonexus.*` | `AgentChat.tsx`, `Settings.tsx` | **Técnico interno — baixa prioridade** |
| `i18n bootstrap for the EvoNexus dashboard` | Comentário em `i18n/index.ts` | **Comentário — baixa prioridade** |
| `npx @evoapi/evo-nexus` | `site/src/pages/Home.tsx` | **Visível — corrigir em Etapa 6.1** |
| `API principal Evolution (open source)` | `integrationMeta.ts` | **Visível — avaliar em Etapa 6.1** |
| `EVO_NEXUS.webp` logo | `Welcome.tsx` (regressão do upstream) | **Verificar — pode ter sido reintroduzido** |

---

## 9. Builds

| Target | Status |
|---|---|
| `dashboard/frontend` — `npm run build` | ✅ Sucesso |
| `site` — `npm run build` | ✅ Sucesso |

---

## 10. Próxima missão recomendada

### Etapa 6.1 — Cleanup de branding pós-upstream

Objetivos:
1. Corrigir `npx @evoapi/evo-nexus` → comando Clever Agent no site (`Home.tsx`)
2. Verificar e corrigir `EVO_NEXUS.webp` em `Welcome.tsx` se reintroduzido
3. Remover ou ajustar `API principal Evolution` em `integrationMeta.ts`
4. Tirar "open source" da comunicação principal se aplicável
5. Avaliar textos `open source` em `integrationMeta.ts` (contexto de integração com EvoNexus upstream)

### Etapa 6.2 — White-label dos avatars dos agentes

Criar `brand/clever-agent/avatars/` e mapear todos os 38 agentes para avatars Clever Agent personalizados.
