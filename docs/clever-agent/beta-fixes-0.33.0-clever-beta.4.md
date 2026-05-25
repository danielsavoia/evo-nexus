# Beta Fixes — 0.33.0-clever-beta.4

**Data:** 2026-05-25
**Branch:** `clever-beta` (HEAD `7d36b0f`)
**Tag:** `clever-agent-v0.33.0-clever-beta.4`
**Promovido de:** `clever-dev` commit `ec0ffad`
**Executado por:** Claude (automatizado via Claude Code)

---

## 1. Contexto

Durante uso real da beta em `https://agent.cleverai.com.br`, o fluxo de restore do Brain Repo no onboarding falhava ao tentar carregar snapshots:

```
GET /api/brain-repo/snapshots → 400 {"error":"Brain repo not connected","code":400}
```

O usuário via "Falha ao carregar snapshots" mesmo após selecionar um repositório válido.

---

## 2. Mudanças

### Backend — `dashboard/backend/routes/brain_repo.py`

`snapshots()` agora suporta modo temporário via query params:

```
GET /api/brain-repo/snapshots?token=<PAT>&owner=<owner>&repo=<repo_name>
```

- Se `token + owner + repo` presentes: usa diretamente, sem exigir DB
- Se ausentes: modo normal (lê BrainRepoConfig, descriptografa token)
- Tratamento de exceção em `list_snapshots()` → retorna 502 com mensagem clara
- Compatibilidade total com fluxo conectado preservada

### Frontend

| Arquivo | Mudança |
|---------|---------|
| `RestoreSelectRepo.tsx` | `onNext` passa `RestoreInfo{repoUrl, token, owner, repoName}` |
| `RestoreFlow.tsx` | Estado + propagação de `repoToken`, `repoOwner`, `repoName` |
| `RestoreSelectSnapshot.tsx` | Constrói URL com `URLSearchParams`; catch distingue erros |
| `i18n/pt-BR`, `en-US`, `es` | Nova chave `restore.selectSnapshot.notConnected` |

---

## 3. Build

| Target | Resultado |
|--------|-----------|
| `dashboard/frontend` (clever-beta) | ✅ `built in 12.38s` (Docker) — 0 erros TypeScript |
| `brain_repo.py` syntax | ✅ `python -m py_compile` — sem erros |

---

## 4. Imagens GHCR

| Componente | Dockerfile | Imagem | Tag | Digest |
|------------|------------|--------|-----|--------|
| Dashboard (Flask+React+ML) | `Dockerfile.dashboard` | `ghcr.io/danielsavoia/clever-agent-dashboard` | `0.33.0-clever-beta.4` | `sha256:857c93d0804bcb8aa78a171f21227a6ce7323aa81b7da4b501ddf3ca18023a1d` |
| Site (nginx+React) | — | Não republicado | `0.33.0-clever-beta.1` | — |
| Runtime (Node+Python+CLI) | — | Não republicado | `0.33.0-clever-beta.1` | — |

---

## 5. Git

| Branch | HEAD antes | HEAD após |
|--------|-----------|-----------|
| `clever-dev` | `cf68a61` | `ec0ffad` |
| `clever-beta` | `93bc94d` | `7d36b0f` |
| `clever-prod` | — | inalterado |
| `upstream-sync` | — | inalterado |

**Tag:** `clever-agent-v0.33.0-clever-beta.4` → HEAD `7d36b0f`

---

## 6. Validação

| Item | Resultado |
|------|-----------|
| Build TypeScript sem erros | ✅ |
| brain_repo.py syntax | ✅ |
| Imagem GHCR publicada (digest registrado) | ✅ `sha256:857c93d0804bcb8aa78a171f21227a6ce7323aa81b7da4b501ddf3ca18023a1d` |
| Smoke GHCR — HTTP `/` 200 | ✅ |
| Smoke GHCR — `/clever-agent.svg` 200 | ✅ |
| Smoke GHCR — title "Clever Agent" no HTML | ✅ |
| Smoke GHCR — sem "EvoNexus" no HTML | ✅ |
| GHCR latest publicado? | ❌ Não |

---

## 7. Pendências documentadas

| Item | Descrição |
|------|-----------|
| Token em query param | Hardening futuro: mover para POST body / Authorization header |
| `plugins_installed no such table` | Erro de banco no plugin-ui-registry — não relacionado, não corrigido |

---

## 8. Escopo preservado

| Regra | Status |
|-------|--------|
| `clever-prod` alterada? | ❌ Não |
| `upstream-sync` alterada? | ❌ Não |
| VPS acessada? | ❌ Não |
| Deploy feito? | ❌ Não |
| GHCR latest publicado? | ❌ Não |
| Force push usado? | ❌ Não |
| Secrets commitados? | ❌ Não |
