# Beta Fixes — 0.33.0-clever-beta.6

**Data:** 2026-05-25
**Branch:** `clever-beta` (HEAD `50c03b3`)
**Tag:** `clever-agent-v0.33.0-clever-beta.6`
**Promovido de:** `clever-dev` commit `6bdf918`
**Executado por:** Claude (automatizado via Claude Code)

---

## 1. Contexto

Após beta.5 (snapshot HEAD visível), ao confirmar e executar o restore, o backend retornava:

```
POST /api/brain-repo/restore/start  →  400 {"error": "Brain repo not connected"}
```

O snapshot aparecia mas a execução falhava em 0%.

---

## 2. Mudanças

### Backend — `dashboard/backend/routes/brain_repo.py`

`restore_start()` agora suporta modo temporário/onboarding: se `token`, `owner` e `repo` estiverem presentes no POST body, o lookup de DB é ignorado e `repo_url` é construído a partir dos parâmetros.

Modo conectado (DB) permanece inalterado.

### Frontend — `restore/RestoreFlow.tsx`

Passa `token={repoToken}`, `owner={repoOwner}`, `repoName={repoName}` para `RestoreExecute`.

### Frontend — `restore/RestoreExecute.tsx`

Props `token?`, `owner?`, `repoName?` adicionadas. POST body agora inclui esses campos quando presentes. Tratamento de erro `!res.ok` melhorado: parse JSON, mapeamento pt-BR, fallback genérico.

---

## 3. Build

| Target | Resultado |
|--------|-----------|
| Backend `compileall` (Python 3.12) | ✅ |
| `dashboard/frontend` | ✅ `built in 24.91s` — 0 erros TypeScript |
| Docker image build | ✅ |

---

## 4. Imagens GHCR

| Componente | Tag | Digest |
|------------|-----|--------|
| `clever-agent-dashboard` | `0.33.0-clever-beta.6` | `sha256:0e9a9818f549663f1b8126bce7b26ae5b6d647acdf165837e4bad70bf9b92e04` |

`latest` não publicado.

---

## 5. Git

| Branch | HEAD antes | HEAD após |
|--------|-----------|-----------|
| `clever-dev` | `d410a51` | `6bdf918` |
| `clever-beta` | `e8d3faf` | `50c03b3` |
| `clever-prod` | — | inalterado |
| `upstream-sync` | — | inalterado |

**Tag:** `clever-agent-v0.33.0-clever-beta.6` → HEAD `50c03b3`

---

## 6. Validação smoke

| Item | Resultado |
|------|-----------|
| HTTP `/` 200 | ✅ |
| Title "Clever Agent" | ✅ |
| Sem "EvoNexus" | ✅ |
| `latest` publicado? | ❌ Não |

---

## 7. Escopo preservado

| Regra | Status |
|-------|--------|
| `clever-prod` alterada? | ❌ Não |
| `upstream-sync` alterada? | ❌ Não |
| VPS acessada? | ❌ Não |
| Deploy feito? | ❌ Não |
| GHCR latest publicado? | ❌ Não |
| Force push usado? | ❌ Não |
| Secrets commitados? | ❌ Não |
| Token em logs/relatório? | ❌ Não |
