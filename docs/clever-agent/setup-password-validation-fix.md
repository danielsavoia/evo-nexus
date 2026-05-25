# Setup — Password Validation Fix

**Data:** 2026-05-25
**Branch:** `clever-dev` → `clever-beta`
**Release planejada:** `0.33.0-clever-beta.3`
**Executado por:** Claude (automatizado via Claude Code)

---

## 1. Contexto

Durante o smoke test em produção VPS (`https://agent.cleverai.com.br`), o fluxo de criação de conta no Setup exibia mensagens de erro com HTML bruto:

```
400 : <!doctype html> <html lang=en> <title>400 Bad Request</title>
      <h1>Bad Request</h1> <p>Password must include a special character</p>
```

Quatro problemas identificados:

| # | Problema |
|---|---------|
| P-01 | Nenhum indicador visual das regras de senha antes do submit |
| P-02 | Mensagem de erro exibia HTML bruto ao invés de texto limpo |
| P-03 | Mensagens em inglês (backend) ao invés de português |
| P-04 | Bloqueava uso da beta — usuário não conseguia criar conta |

---

## 2. Causa raiz

### Backend

`auth_security.py` → `_require_password_strength()` chama `abort(400, description=violations_str)`. Flask por padrão retorna uma página HTML para `abort()`, não JSON.

### Frontend (api.ts)

`buildError()` tenta `JSON.parse` primeiro; se falhar, faz fallback para `res.text()` (≤ 500 chars). Como o HTML de erro tem menos de 500 chars, ele era retornado literalmente como string de erro.

### Frontend (Setup.tsx)

- Validação pré-submit: `password.length < 6` (mínimo errado — backend exige 8)
- Sem checklist de regras em tempo real
- Catch block: `setError(ex instanceof Error ? ex.message : t('setup.setupFailed'))` — exibia o erro cru

---

## 3. Correções aplicadas

### 3.1 Backend — `dashboard/backend/app.py`

Adicionado `@app.errorhandler(HTTPException)` que retorna JSON para rotas `/api/`:

```python
from werkzeug.exceptions import HTTPException

@app.errorhandler(HTTPException)
def api_http_error(e: HTTPException):
    """Return JSON instead of Flask's default HTML error pages for /api/ routes."""
    if request.path.startswith('/api/'):
        return jsonify({"error": e.description}), e.code
    return e
```

- Intercepta todos os `abort(4xx/5xx)` em rotas `/api/`
- Retorna `{"error": "..."}` — compatível com `buildError()` em `api.ts`
- Rotas fora de `/api/` (páginas HTML) mantêm comportamento original

### 3.2 Frontend — `dashboard/frontend/src/pages/Setup.tsx`

**Constantes e helpers adicionados (antes de `NetworkCanvas`):**

```typescript
/* ── Password policy (mirrors auth_security.py exactly) ── */
const PW_RULES = [
  { test: (p: string) => p.length >= 8,           label: '8+ caracteres' },
  { test: (p: string) => /[a-z]/.test(p),         label: 'letra minúscula' },
  { test: (p: string) => /[A-Z]/.test(p),         label: 'letra maiúscula' },
  { test: (p: string) => /\d/.test(p),            label: 'um número' },
  { test: (p: string) => /[^a-zA-Z0-9]/.test(p), label: 'caractere especial' },
]
```

- `pwViolations(pw, username, email)` — mirrors `password_policy_violations()` do backend
- `PW_ERROR_MAP` — mapeia strings de erro em inglês → pt-BR
- `parseApiError(ex)` — extrai texto de erro do HTML, aplica mapa pt-BR, fallback genérico

**Validação pré-submit (handleStep2):**

```typescript
// ANTES: if (password.length < 6)
// DEPOIS:
const violations = pwViolations(password, username.trim(), email.trim())
if (violations.length > 0) {
  setError(`A senha precisa ter: ${violations.join(', ')}.`)
  return
}
```

**Catch block:**

```typescript
// ANTES: setError(ex instanceof Error ? ex.message : t('setup.setupFailed'))
// DEPOIS:
setError(parseApiError(ex))
```

**Checklist em tempo real:**

```tsx
{password.length > 0 && (
  <div className="px-3 py-2.5 rounded-lg bg-[#0D1B12] border border-[#1E3829] space-y-1">
    <p className="text-[10px] font-semibold text-[#6B8A76] uppercase tracking-[0.06em] mb-1">
      A senha precisa ter:
    </p>
    {pwRuleStatus.map(({ label, ok }) => (
      <div key={label} className={`flex items-center gap-1.5 text-[10px] transition-colors ${ok ? 'text-[#85F2A0]' : 'text-[#6B8A76]'}`}>
        <span className="w-3 text-center font-bold">{ok ? '✓' : '○'}</span>
        <span>{label}</span>
      </div>
    ))}
  </div>
)}
```

### 3.3 i18n — `dashboard/frontend/src/i18n/locales/pt-BR/index.ts`

```typescript
// ANTES:
passwordMinCharsShort: 'Mín. 6 caracteres',
// DEPOIS:
passwordMinCharsShort: 'Mín. 8 caracteres',
```

---

## 4. Comportamento esperado pós-fix

| Cenário | Antes | Depois |
|---------|-------|--------|
| Campo senha vazio → submit | Nenhuma indicação visual | Checklist aparece ao digitar |
| Senha fraca (`abc`) → submit | `400 : <!doctype html>...Password must include a special character` | `A senha precisa ter: 8+ caracteres, letra maiúscula, um número, caractere especial.` |
| Senha com apenas minúsculas/números | Erro HTML | Erro em pt-BR limpo |
| Senha válida (`A7x!Qr92Lm#`) | Avança normalmente | Avança normalmente |
| Usuário já existe | Texto inglês cru | `Esse nome de usuário já está em uso.` |

---

## 5. Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `dashboard/backend/app.py` | `@app.errorhandler(HTTPException)` retorna JSON para rotas `/api/` |
| `dashboard/frontend/src/pages/Setup.tsx` | `PW_RULES`, `pwViolations()`, `PW_ERROR_MAP`, `parseApiError()`, checklist UI, validação corrigida |
| `dashboard/frontend/src/i18n/locales/pt-BR/index.ts` | `passwordMinCharsShort`: 6 → 8 |

---

## 6. Build

| Target | Resultado |
|--------|-----------|
| `dashboard/frontend` | ✅ `built in 25.09s` — 0 erros TypeScript |

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
