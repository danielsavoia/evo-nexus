# Beta Fixes — 0.33.0-clever-beta.3

**Data:** 2026-05-25
**Branch:** `clever-beta` (HEAD `344269d`)
**Tag:** `clever-agent-v0.33.0-clever-beta.3`
**Promovido de:** `clever-dev` commit `344269d`
**Executado por:** Claude (automatizado via Claude Code)

---

## 1. Contexto

Durante o uso real da beta em `https://agent.cleverai.com.br`, o fluxo de criação de conta no Setup exibia mensagem de erro com HTML bruto:

```
400 : <!doctype html> <html lang=en> <title>400 Bad Request</title>
      <h1>Bad Request</h1> <p>Password must include a special character</p>
```

Esta release corrige o problema inteiro na fonte.

---

## 2. Mudanças

### Setup — Validação de senha e exibição de erros

**Arquivos corrigidos:**

| Arquivo | Mudança |
|---------|---------|
| `dashboard/backend/app.py` | `@app.errorhandler(HTTPException)` retorna JSON para rotas `/api/`; evita HTML em respostas de erro |
| `dashboard/frontend/src/pages/Setup.tsx` | `PW_RULES` + `pwViolations()` mirrors backend; `PW_ERROR_MAP` + `parseApiError()` mapeia erros para pt-BR; checklist em tempo real com 5 regras (✓/○); validação pré-submit corrigida (era `< 6`, agora `pwViolations()`) |
| `dashboard/frontend/src/i18n/locales/pt-BR/index.ts` | `passwordMinCharsShort`: `'Mín. 6 caracteres'` → `'Mín. 8 caracteres'` |

**Causa raiz:**

| Camada | Problema |
|--------|---------|
| Backend | `abort(400, description=violations)` gerava resposta HTML; não JSON |
| Frontend (api.ts) | Fallback `res.text()` retornava o HTML como string de erro (< 500 chars) |
| Frontend (Setup.tsx) | Validação pré-submit usava mínimo errado (6 vs 8); erro exibido sem conversão |

**Comportamento pós-fix:**

| Cenário | Antes | Depois |
|---------|-------|--------|
| Digitar senha | Sem feedback | Checklist com 5 regras aparece imediatamente |
| Senha fraca → submit | HTML bruto `<!doctype html>...` | `A senha precisa ter: 8+ caracteres, letra maiúscula, ...` |
| Senha válida | Bloqueada por mínimo 6-char check errado | Avança normalmente |
| Erro do servidor | Texto inglês / HTML | pt-BR limpo |

---

## 3. Build

| Target | Resultado |
|--------|-----------|
| `dashboard/frontend` (clever-beta) | ✅ `built in 25.09s` — 0 erros TypeScript |
| Docker image | ✅ Build OK |

---

## 4. Imagens GHCR

| Componente | Dockerfile | Imagem | Tag | Digest |
|------------|------------|--------|-----|--------|
| Dashboard (Flask+React+ML) | `Dockerfile.dashboard` | `ghcr.io/danielsavoia/clever-agent-dashboard` | `0.33.0-clever-beta.3` | `sha256:48464dfa623547ce53137b1dedff771e403a421424661a98574c4c7cabd711f3` |
| Site (nginx+React) | — | Não republicado (sem mudanças) | `0.33.0-clever-beta.1` (mantido) | — |
| Runtime (Node+Python+CLI) | — | Não republicado (sem mudanças) | `0.33.0-clever-beta.1` (mantido) | — |

---

## 5. Git

| Branch | HEAD antes | HEAD após |
|--------|-----------|-----------|
| `clever-dev` | `ef1e5ff` | `344269d` |
| `clever-beta` | `02325bd` | `344269d` |
| `clever-prod` | — | inalterado |
| `upstream-sync` | — | inalterado |

**Tag:** `clever-agent-v0.33.0-clever-beta.3` → HEAD `344269d`

---

## 6. Validação

| Item | Resultado |
|------|-----------|
| Build TypeScript sem erros | ✅ |
| Imagem GHCR publicada (digest registrado) | ✅ `sha256:48464dfa623547ce53137b1dedff771e403a421424661a98574c4c7cabd711f3` |
| Smoke GHCR — HTTP `/` 200 | ✅ |
| Smoke GHCR — `/clever-agent.svg` 200 | ✅ |
| Smoke GHCR — `/clever-agent/avatars/avatar_oracle.png` 200 | ✅ |
| Smoke GHCR — title "Clever Agent" no HTML | ✅ |
| Smoke GHCR — sem "EvoNexus" no HTML | ✅ |
| GHCR latest publicado? | ❌ Não |

> **Nota VPS:** A imagem foi publicada em GHCR. O deploy na VPS (`https://agent.cleverai.com.br`) é uma etapa separada executada pelo agente de deploy.

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
