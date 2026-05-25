# Beta Fixes — 0.33.0-clever-beta.5

**Data:** 2026-05-25
**Branch:** `clever-beta` (HEAD `08bb366`)
**Tag:** `clever-agent-v0.33.0-clever-beta.5`
**Promovido de:** `clever-dev` commit `baba52d`
**Executado por:** Claude (automatizado via Claude Code)

---

## 1. Contexto

Na VPS beta, o fluxo de restore do Brain Repo detectava o repositório corretamente (etapa beta.4), mas a tela "Selecione um snapshot" aparecia **vazia**. Dois bugs identificados em `github_api.py`.

---

## 2. Mudanças

### Bug 1 — `validate_pat_scopes`: header X-OAuth-Scopes case-insensitive

**Arquivo:** `dashboard/backend/brain_repo/github_api.py`

`dict(resp.headers)` do Python normaliza nomes de headers de forma inconsistente. A busca `resp_headers.get("X-OAuth-Scopes", "")` retornava string vazia quando o header estava armazenado como `x-oauth-scopes` (lowercase), fazendo a validação do PAT falhar silenciosamente.

**Correção:**
```python
# ANTES:
scopes_header = resp_headers.get("X-OAuth-Scopes", "")

# DEPOIS:
scopes_header = next(
    (v for k, v in resp_headers.items() if k.lower() == "x-oauth-scopes"),
    "",
)
```

### Bug 2 — `list_snapshots`: repo sem tags retornava lista vazia (sem HEAD)

**Arquivo:** `dashboard/backend/brain_repo/github_api.py`

GitHub retorna 404 em `/git/refs/tags` quando o repo não possui tags. O retorno antecipado `if status != 200: return result` impedia a busca de HEAD — usuários com brain repos novos (sem snapshots criados) nunca viam nenhum item na tela.

**Correção:**
```python
# ANTES:
if status != 200 or not isinstance(body, list):
    log.warning("list_snapshots: status %d", status)
    return result
for ref_obj in body:

# DEPOIS:
if status not in (200, 404):
    log.warning("list_snapshots: tags status %d for %s/%s", status, owner, repo)
tags = body if (status == 200 and isinstance(body, list)) else []
for ref_obj in tags:
# ... continua para buscar HEAD
```

### Bug 3 — Repo `danielsavoia/evonexus-brain` sem arquivos de manifest

O repo brain precisava de `.evo-brain` e `manifest.yaml` na raiz para ser detectado e restaurado. Arquivos criados e commitados diretamente no repo (ver Etapa 11 do processo).

---

## 3. Build

| Target | Resultado |
|--------|-----------|
| Backend `compileall` | ✅ via Docker Python 3.12 — sem erros |
| `dashboard/frontend` | ✅ `built in 17.41s` — 0 erros TypeScript |
| Docker image build | ✅ OK |

---

## 4. Imagens GHCR

| Componente | Dockerfile | Imagem | Tag | Digest |
|------------|------------|--------|-----|--------|
| Dashboard (Flask+React+ML) | `Dockerfile.dashboard` | `ghcr.io/danielsavoia/clever-agent-dashboard` | `0.33.0-clever-beta.5` | `sha256:73914690c4f0daf54706c32d87938946fb465563a99022193e8c876c0f64f0e4` |
| Site (nginx+React) | — | Não republicado | `0.33.0-clever-beta.1` | — |
| Runtime (Node+Python+CLI) | — | Não republicado | `0.33.0-clever-beta.1` | — |

---

## 5. Git

| Branch | HEAD antes | HEAD após |
|--------|-----------|-----------|
| `clever-dev` | `42066fa` | `baba52d` |
| `clever-beta` | `edf8c41` | `08bb366` |
| `clever-prod` | — | inalterado |
| `upstream-sync` | — | inalterado |

**Tag:** `clever-agent-v0.33.0-clever-beta.5` → HEAD `08bb366`

---

## 6. Validação

| Item | Resultado |
|------|-----------|
| Backend compile (compileall) | ✅ |
| Build TypeScript sem erros | ✅ |
| Imagem GHCR publicada (digest registrado) | ✅ `sha256:73914690c4f0daf54706c32d87938946fb465563a99022193e8c876c0f64f0e4` |
| Smoke GHCR — HTTP `/` 200 | ✅ |
| Smoke GHCR — title "Clever Agent" | ✅ |
| Smoke GHCR — sem "EvoNexus" | ✅ |
| GHCR latest publicado? | ❌ Não |

---

## 7. Pendências documentadas

| Item | Descrição |
|------|-----------|
| Token em query param | Mover `?token=...` para POST body ou Authorization header em release futura |
| `plugins_installed no such table` | Erro no plugin-ui-registry — não relacionado, não corrigido |

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
