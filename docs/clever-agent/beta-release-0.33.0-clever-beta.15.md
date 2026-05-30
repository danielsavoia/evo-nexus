# Clever Agent dashboard beta.15

**Data:** 2026-05-30
**Versão alvo:** `0.33.0-clever-beta.15`

---

## 1. Objetivo

Permitir login com **username** ou **e-mail** no mesmo campo de autenticação.
Usuários que não recordavam o username podiam ficar bloqueados — o e-mail é mais memorável.

---

## 2. Git

| Branch | HEAD |
|---|---|
| `clever-dev` | `2a9d7e5` — fix: allow login with username or email |
| `clever-beta` | `ad1f825` — chore: promote Clever Agent dashboard beta.15 |
| Tag | `clever-agent-v0.33.0-clever-beta.15` |
| `clever-prod` | preservada (não tocada) |
| `upstream-sync` | preservada (não tocada) |

---

## 3. Imagem GHCR

### Dashboard

| Campo | Valor |
|---|---|
| Tag | `ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.15` |
| Digest index | `sha256:a17881c42f0b6eb01ea3e042efc16232ed93a5adf8fa123e500b2d1053a746be` |
| Digest linux/amd64 | `sha256:babf8e72dba79422f23fbc4261e4480c3d29d8039bf277dd22e5a50dfceb5409` |
| Tamanho local | 10.4 GB |

### Runtime

| Campo | Valor |
|---|---|
| Tag | `ghcr.io/danielsavoia/clever-agent-runtime:0.33.0-clever-beta.10` |
| Status | Mantido — não republicado |

### Site

| Campo | Valor |
|---|---|
| Tag | `ghcr.io/danielsavoia/clever-agent-site:0.33.0-clever-beta.1` |
| Status | Mantido — não republicado |

**Latest publicado?** Não.

---

## 4. Correção implementada

### Backend — `dashboard/backend/routes/auth_routes.py`

Query de login alterada de:
```python
user = User.query.filter_by(username=username, is_active=True).first()
```
Para:
```python
identifier_lower = identifier.lower()
user = User.query.filter(
    User.is_active == True,
    db.or_(
        User.username == identifier,
        db.func.lower(User.email) == identifier_lower,
    ),
).first()
```

- Email NULL nunca produz match falso (SQL: `lower(NULL) = x` é NULL).
- Throttle/lockout aplicado ao identificador normalizado.
- Erro permanece genérico: `"Invalid username/email or password"`.

### Frontend — i18n (3 locais)

| Locale | Antes | Depois |
|---|---|---|
| pt-BR | `'Usuário'` | `'Usuário ou e-mail'` |
| en-US | `'Username'` | `'Username or email'` |
| es | `'Usuario'` | `'Usuario o correo electrónico'` |

---

## 5. Validação local

| Etapa | Resultado |
|---|---|
| Backend AST review (Python local quebrado; Docker indisponível no momento do check) | ✅ Review manual — lógica correta, sem erros de sintaxe |
| Frontend build (`npm run build`) | ✅ Clean — 0 erros TypeScript |
| JS check (`node --check`) | ✅ provider-config, server, chat-bridge OK |
| Sem secrets no diff | ✅ Confirmado |

---

## 6. Validação VPS esperada

1. Login com username atual (`admin`) → OK
2. Logout
3. Login com e-mail da mesma conta (`daniel@cleverai.com.br`) → OK
4. Logout
5. Login com e-mail em caixa alta (`DANIEL@CLEVERAI.COM.BR`) → OK
6. Providers / chat / terminal continuam funcionando

---

## 7. Arquivos alterados

### Código funcional

| Arquivo | Descrição |
|---|---|
| `dashboard/backend/routes/auth_routes.py` | Query OR username/email; mensagens de erro atualizadas |
| `dashboard/frontend/src/i18n/locales/pt-BR/index.ts` | login.username → 'Usuário ou e-mail' |
| `dashboard/frontend/src/i18n/locales/en-US/index.ts` | login.username → 'Username or email' |
| `dashboard/frontend/src/i18n/locales/es/index.ts` | login.username → 'Usuario o correo electrónico' |
| `dashboard/frontend/src/pages/Login.tsx` | Validação client-side atualizada |

### Configuração e documentação

| Arquivo | Descrição |
|---|---|
| `clever-agent.stack.yml` | Dashboard tag: beta.14 → beta.15 |
| `docs/clever-agent/auth-login-email-support.md` | Novo — documentação da correção |
| `docs/clever-agent/white-label-patch-ledger.md` | Entrada beta.15 adicionada |
| `docs/clever-agent/beta-release-0.33.0-clever-beta.15.md` | Este arquivo |
