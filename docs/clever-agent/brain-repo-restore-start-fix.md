# Brain Repo Restore Start — Fix

**Data:** 2026-05-25
**Branch:** `clever-dev` → `clever-beta`
**Release:** `0.33.0-clever-beta.6`
**Executado por:** Claude (automatizado via Claude Code)

---

## 1. Sintoma (VPS)

Após as correções de beta.4/beta.5, o snapshot HEAD passou a aparecer corretamente na tela de restore. Porém ao confirmar e avançar para a execução, o restore falhava:

```
POST /api/brain-repo/restore/start  →  400 {"error": "Brain repo not connected"}
Restauração falhou / Erro: 400 / 0%
```

---

## 2. Causa raiz

**Backend (`brain_repo.py` — `restore_start()`):**
A função lia `_get_config()` do DB logo ao início. Durante o fluxo de onboarding restore, o Brain Repo ainda não foi salvo no DB (o usuário está no wizard, antes do "conectar"), então `brain_repo_configs` está vazio → `abort(400, "Brain repo not connected")`.

**Frontend (`RestoreExecute.tsx`):**
O componente enviava apenas `{ ref, include_kb }` no POST body — sem `token`, `owner` ou `repo`. Mesmo que o backend aceitasse esses campos, não havia como recebê-los.

**Frontend (`RestoreFlow.tsx`):**
O estado raiz já mantinha `repoToken`, `repoOwner`, `repoName` (populados pelo `RestoreSelectRepo`), mas ao avançar para a etapa `execute` esses valores não eram passados como props para `RestoreExecute`.

---

## 3. Correções aplicadas

### 3.1 Backend — `dashboard/backend/routes/brain_repo.py`

Adicionado suporte ao **modo temporário/onboarding** em `restore_start()`, idêntico ao padrão já adotado em `snapshots()`:

```python
# Temporary / onboarding-restore mode: caller passes token + owner + repo
body_token = data.get("token", "").strip()
body_owner = data.get("owner", "").strip()
body_repo  = data.get("repo", "").strip()

if body_token and body_owner and body_repo:
    # Use body params directly, skip DB lookup. Token NOT logged.
    token    = body_token
    repo_url = f"https://github.com/{body_owner}/{body_repo}"
else:
    # Connected mode — read from persisted BrainRepoConfig
    config = _get_config()
    if not config or not config.github_token_encrypted:
        abort(400, description="Brain repo not connected")
    token = _decrypt_token(config)
    if not token:
        abort(400, description="Could not decrypt stored token")
    repo_url = config.repo_url
```

O token viaja no **POST body** (não na query string como em `snapshots`), o que é mais seguro do que o approach anterior.

### 3.2 Frontend — `RestoreFlow.tsx`

`RestoreExecute` agora recebe `token`, `owner`, `repoName`:

```tsx
<RestoreExecute
  snapshot={snapshot}
  token={repoToken}
  owner={repoOwner}
  repoName={repoName}
  onComplete={onComplete}
  onRetry={() => setStep('confirm')}
/>
```

### 3.3 Frontend — `RestoreExecute.tsx`

Props `token?`, `owner?`, `repoName?` adicionadas à interface. Body do POST montado dinamicamente:

```typescript
const bodyPayload: Record<string, unknown> = {
  ref: snapshot.ref,
  include_kb: snapshot.includeKb,
}
if (token && owner && repoName) {
  bodyPayload.token = token
  bodyPayload.owner = owner
  bodyPayload.repo  = repoName
}
```

**Melhoria de erro `!res.ok`:** tenta parsear JSON para extrair `data.error`; mapeia "Brain repo not connected" para mensagem pt-BR amigável; fallback genérico sem HTML.

---

## 4. Segurança / Hardening futuro

| Item | Status |
|------|--------|
| Token em query param (snapshots) | ⚠️ Pendente hardening — migrar para POST body ou Authorization header |
| Token em POST body (restore/start) | ✅ Mais seguro que query param; token não aparece em access logs |
| Token em logs | ✅ Não logado em nenhum dos paths |
| Token em relatório/commit | ✅ Não incluído |

---

## 5. Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `dashboard/backend/routes/brain_repo.py` | `restore_start()` — modo temporário com body token/owner/repo |
| `dashboard/frontend/src/pages/onboarding/restore/RestoreFlow.tsx` | Passa token/owner/repoName para RestoreExecute |
| `dashboard/frontend/src/pages/onboarding/restore/RestoreExecute.tsx` | Props opcionais, body dinâmico, erro JSON melhorado |

---

## 6. Build

| Target | Resultado |
|--------|-----------|
| Backend `compileall` (Python 3.12) | ✅ Sem erros |
| `dashboard/frontend` | ✅ `built in 24.91s` — 0 erros TypeScript |

---

## 7. Teste funcional local

Restore completo exige Brain Repo conectado e container com volume + PAT real. Não testável completamente em ambiente local sem essas precondições. Validação na VPS após deploy.

**Fluxo esperado pós-fix:**
```
POST /api/brain-repo/validate-token  →  200
GET  /api/brain-repo/detect?token=…  →  200
GET  /api/brain-repo/snapshots?…     →  200  (HEAD aparece)
POST /api/brain-repo/restore/start   →  200  (SSE stream inicia)
```

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
| Token em logs/relatório? | ❌ Não |
