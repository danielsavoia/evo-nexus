# Brain Repo Restore — Snapshots Fix

**Data:** 2026-05-25
**Branch:** `clever-dev` → `clever-beta`
**Release planejada:** `0.33.0-clever-beta.4`
**Executado por:** Claude (automatizado via Claude Code)

---

## 1. Sintoma (VPS)

Durante o fluxo de restore do Brain Repo no onboarding, após selecionar o repositório o usuário via a tela "Selecione um snapshot" com a mensagem de erro:

```
Falha ao carregar snapshots
```

Log do servidor (VPS):
```
POST /api/brain-repo/validate-token → 200
GET  /api/brain-repo/detect?token=*** → 200
GET  /api/brain-repo/snapshots        → 400  {"error":"Brain repo not connected","code":400}
```

---

## 2. Causa raiz

### Backend

`GET /api/brain-repo/snapshots` em `dashboard/backend/routes/brain_repo.py` chamava `_get_config()` e abortava com `400 "Brain repo not connected"` se não houvesse entrada no DB.

Durante o fluxo de **restore onboarding**, o usuário ainda **não** conectou/confirmou o Brain Repo — portanto não há linha em `brain_repo_configs`. O endpoint `/detect` já suportava modo temporário via `?token=...` (query param), mas `/snapshots` não.

### Frontend

`RestoreSelectSnapshot.tsx` chamava `api.get('/brain-repo/snapshots')` sem nenhum parâmetro, mesmo tendo recebido `repoUrl` como prop. O token, owner e repoName obtidos no passo anterior (`RestoreSelectRepo`) **não eram propagados** para o componente seguinte.

---

## 3. Correções aplicadas

### 3.1 Backend — `dashboard/backend/routes/brain_repo.py`

Função `snapshots()` agora suporta dois modos:

| Modo | Condição | Comportamento |
|------|----------|---------------|
| **Temporário / onboarding** | `?token=...&owner=...&repo=...` presentes | Usa params diretamente, sem DB |
| **Conectado** | Sem query params (ou incompletos) | Lê DB, descriptografa token, usa owner/repo persistidos |

- Tratamento de exceção em `list_snapshots()` com log e retorno 502 ao invés de 500 genérico
- Compatibilidade total com fluxo já conectado (sem params → comportamento idêntico ao anterior)

**SECURITY NOTE (hardening futuro):** o token no query param fica visível em access logs e histórico do browser. Migrar para POST com token no body ou header `Authorization` em release futura.

### 3.2 Frontend — `RestoreSelectRepo.tsx`

- Interface `onNext` alterada de `(repoUrl: string)` para `(info: RestoreInfo)` onde `RestoreInfo = { repoUrl, token, owner, repoName }`
- `handleNext` extrai `owner` e `repoName` de `selectedRepo.full_name` (formato `owner/repo`)
- Token não é exibido em nenhum log ou retorno

### 3.3 Frontend — `RestoreFlow.tsx`

- Adicionado estado `repoToken`, `repoOwner`, `repoName`
- `onNext` de `RestoreSelectRepo` agora popula esses estados
- Passados como props para `RestoreSelectSnapshot`

### 3.4 Frontend — `RestoreSelectSnapshot.tsx`

- Adicionadas props opcionais: `token?`, `owner?`, `repoName?`
- `useEffect` constrói URL com `URLSearchParams` se todas as três props estiverem presentes
- Catch block melhorado: distingue `"Brain repo not connected"` (mostra `notConnected`) de erros genéricos (mostra `failed`)

### 3.5 i18n — três locales (pt-BR, en-US, es)

Nova chave `restore.selectSnapshot.notConnected` adicionada:

| Locale | Mensagem |
|--------|---------|
| pt-BR | `O Brain Repo ainda não está conectado. Verifique se o repositório possui snapshots válidos ou tente conectar novamente.` |
| en-US | `Brain repo is not connected yet. Check that the repository has valid snapshots or try reconnecting.` |
| es | `El Brain Repo aún no está conectado. Verifica que el repositorio tenga snapshots válidos o intenta reconectar.` |

---

## 4. Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `dashboard/backend/routes/brain_repo.py` | `snapshots()`: modo temporário via query params |
| `dashboard/frontend/src/pages/onboarding/restore/RestoreSelectRepo.tsx` | `onNext` passa `RestoreInfo` com token/owner/repoName |
| `dashboard/frontend/src/pages/onboarding/restore/RestoreFlow.tsx` | Estado e propagação de token/owner/repoName |
| `dashboard/frontend/src/pages/onboarding/restore/RestoreSelectSnapshot.tsx` | Props opcionais, URL com params, erro melhorado |
| `dashboard/frontend/src/i18n/locales/pt-BR/index.ts` | `notConnected` key |
| `dashboard/frontend/src/i18n/locales/en-US/index.ts` | `notConnected` key |
| `dashboard/frontend/src/i18n/locales/es/index.ts` | `notConnected` key |

---

## 5. Build

| Target | Resultado |
|--------|-----------|
| `dashboard/frontend` | ✅ `built in 18.28s` — 0 erros TypeScript |
| `brain_repo.py` syntax | ✅ `python -m py_compile` — sem erros |

---

## 6. Pendências (fora do escopo desta missão)

| Item | Descrição |
|------|-----------|
| Token em query param | Mover `?token=...` para POST body ou header `Authorization` em release futura para evitar exposição em access logs |
| `plugins_installed no such table` | Erro de banco no plugin-ui-registry observado em logs VPS — não relacionado ao restore flow, não corrigido aqui |

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
