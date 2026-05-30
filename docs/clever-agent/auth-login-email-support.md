# Clever Agent Auth — Login with Username or Email

**Introduzido em:** `0.33.0-clever-beta.15`
**Data:** 2026-05-30

---

## Problema

O campo de login aceitava apenas o **username** (ex: `admin`).
Usuários tentavam logar com seu e-mail e recebiam falha de autenticação.
O e-mail é o identificador mais natural e memorável para a maioria dos usuários.

---

## Correção

O backend agora aceita **username** ou **email** no mesmo campo de login.

### Regras de comportamento

| Regra | Detalhe |
|---|---|
| Username continua funcionando | Comparação exata como antes |
| Email aceito | Case-insensitive: `DANIEL@...` = `daniel@...` |
| Trim no identificador | Espaços no início/fim são removidos antes da busca |
| Email NULL nunca faz match falso | SQL: `lower(NULL) = x` é NULL, não TRUE |
| Erro permanece genérico | "Invalid username/email or password" — não revela se e-mail existe |
| Senha inalterada | Hash de senha não foi modificado |
| Throttle/lockout preservado | Aplica ao identificador (username ou email) normalizado |

### Lógica da query (SQLAlchemy)

```python
identifier_lower = identifier.lower()

user = User.query.filter(
    User.is_active == True,
    db.or_(
        User.username == identifier,           # username exato
        db.func.lower(User.email) == identifier_lower,  # email case-insensitive
    ),
).first()
```

---

## Arquivos alterados

### Backend

| Arquivo | Mudança |
|---|---|
| `dashboard/backend/routes/auth_routes.py` | Query OR username/email; mensagens de erro atualizadas |

### Frontend

| Arquivo | Mudança |
|---|---|
| `dashboard/frontend/src/i18n/locales/pt-BR/index.ts` | `login.username`: `'Usuário'` → `'Usuário ou e-mail'` |
| `dashboard/frontend/src/i18n/locales/en-US/index.ts` | `login.username`: `'Username'` → `'Username or email'` |
| `dashboard/frontend/src/i18n/locales/es/index.ts` | `login.username`: `'Usuario'` → `'Usuario o correo electrónico'` |
| `dashboard/frontend/src/pages/Login.tsx` | Mensagem de validação client-side atualizada |

---

## Cenários de teste

| # | Input | Esperado |
|---|---|---|
| 1 | Username `admin` + senha correta | ✅ Login OK |
| 2 | Email `daniel@cleverai.com.br` + senha correta | ✅ Login OK |
| 3 | Email `DANIEL@CLEVERAI.COM.BR` + senha correta | ✅ Login OK (case-insensitive) |
| 4 | Email ` daniel@cleverai.com.br ` (com espaços) + senha correta | ✅ Login OK (trim) |
| 5 | Email válido + senha errada | ❌ Erro genérico "Invalid username/email or password" |
| 6 | Usuário inexistente | ❌ Erro genérico "Invalid username/email or password" |
| 7 | Campo vazio + qualquer senha | ❌ "Username/email and password are required" |

---

## Segurança

- Senha nunca logada.
- Erro não revela se o e-mail está cadastrado.
- Throttle/lockout por IP e identificador normalizado preservados.
- Nenhum usuário novo é criado no endpoint de login.
- Setup flow não foi alterado.

---

## Compatibilidade

- Payload continua enviando `{ username: "...", password: "..." }`.
- Frontend não foi alterado structuralmente — apenas textos de label/placeholder.
- Nenhuma migration de banco necessária — o campo `email` já existia em `User`.
