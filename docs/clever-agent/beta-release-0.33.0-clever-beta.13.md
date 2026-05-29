# Clever Agent Dashboard beta.13 Release Notes

**Version:** `0.33.0-clever-beta.13`
**Branch:** `clever-beta`
**Date:** 2026-05-29
**Status:** Released to GHCR

---

## 1. Objetivo

Corrigir Codex OAuth Chat usando OpenClaude harness:
- `codex_auth` chat chamava `api.openai.com/v1/chat/completions` com `model=codexplan` → HTTP 404 `model_not_found`.
- `codexplan` é um alias interno do `openclaude` que roteia para `chatgpt.com/backend-api/codex` — inválido na API pública OpenAI.
- Após esta release: `codex_auth` chat usa `openclaude -p "<prompt>"` (modo headless não-interativo).

---

## 2. Git

| Branch | Commit HEAD |
|---|---|
| `clever-dev` | `25cbb62` — fix: route Codex OAuth chat through OpenClaude harness |
| `clever-beta` | `250682e` — chore: promote Clever Agent dashboard beta.13 |
| Tag | `clever-agent-v0.33.0-clever-beta.13` |
| `clever-prod` | **Preservada — não tocada** |
| `upstream-sync` | **Preservada — não tocada** |

---

## 3. Imagem GHCR

### Dashboard

| Campo | Valor |
|---|---|
| Tag | `ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.13` |
| Digest (index/manifest list) | `sha256:cdf90c30ed2da3d5fe86261a963a15df4906d0b73b07c634bf5cb828ab60dbf4` |
| Digest (linux/amd64) | `sha256:861d6311f3b61f77a9e9ca0ee72a0685f26fbc44159d155ef187ce86336bfad6` |
| Tamanho local (virtual) | ~10.4 GB |
| Tamanho real comprimido (estimado) | ~3.15 GB |
| `latest` publicado? | **Não** |

Pull:
```bash
docker pull ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.13
```

### Runtime (inalterado)

| Campo | Valor |
|---|---|
| Tag | `ghcr.io/danielsavoia/clever-agent-runtime:0.33.0-clever-beta.10` |
| Digest | `sha256:cd9e4f7e2488f4d48e1efcfd232cf13c19d5f489aabf7b9753de9cff88e1e3b1` |

### Site (inalterado)

| Campo | Valor |
|---|---|
| Tag | `ghcr.io/danielsavoia/clever-agent-site:0.33.0-clever-beta.1` |

---

## 4. Commits incluídos (em cima de beta.12)

| SHA | Descrição |
|---|---|
| `250682e` | chore: promote Clever Agent dashboard beta.13 |
| `25cbb62` | fix: route Codex OAuth chat through OpenClaude harness |
| `65bf3d6` | chore: sync Clever Agent dashboard beta.12 release docs |

---

## 5. Correção — Codex OAuth Chat via OpenClaude harness

### Sintoma

Chat com `codex_auth` ativo retornava erro 404 da API OpenAI:
```
model_not_found: The model `codexplan` does not exist or you do not have access to it.
```

### Causa

`_startOpenAICompatibleSession` enviava o prompt para `api.openai.com/v1/chat/completions`
com `model=codexplan`. Este alias só existe internamente no `openclaude` (roteia para
`chatgpt.com/backend-api/codex`) — é inválido na API pública OpenAI.

### Arquivos alterados

| Arquivo | Patch |
|---|---|
| `dashboard/terminal-server/src/chat-bridge.js` | Novo helper `findOpenClaudeCommand()` + constante `SPAWN_SYSTEM_VARS`; novo método `_startCodexAuthChatSession()` que spawna `openclaude -p "<prompt>"` em modo headless; `startSession()` ramifica `codex_auth` para este método antes de `_startOpenAICompatibleSession`; bloco codex_auth OAuth removido de `_startOpenAICompatibleSession` |
| `clever-agent.stack.yml` | Dashboard tag `beta.13`; novo volume `clever_agent_codex_auth:/root/.codex` para persistir auth.json |
| `docs/clever-agent/provider-executable-routing.md` | Matriz atualizada; nova seção "Codex OAuth Chat via openclaude -p (patch 3)"; checklist atualizado |
| `docs/clever-agent/white-label-patch-ledger.md` | Linha Provider executable routing atualizada |
| `docs/clever-agent/white-label-master-inventory.md` | Item 16 na lista de reapply; checks §5 Step 3 |

### Comportamento após o fix

| Cenário | Comportamento |
|---|---|
| `codex_auth` chat | `openclaude -p "<prompt>"` spawna; stdout streamado como `text_delta` |
| `anthropic` chat | Claude Agent SDK (`sdkQuery`) — inalterado |
| `openrouter`/`openai`/`omnirouter` chat | `_startOpenAICompatibleSession` com API key — inalterado |
| `codex_auth` terminal | PTY `openclaude` via `claude-bridge.js` — inalterado |
| Provider switch `codex_auth` → `anthropic` | Terminal reinicia com `/usr/bin/claude` (beta.12) |
| Provider switch `anthropic` → `codex_auth` | Terminal reinicia com `/usr/bin/openclaude` (beta.12) |

---

## 6. Segurança

| Regra | Implementação |
|---|---|
| `auth.json` não lido/logado | Apenas `fs.existsSync()` — nunca `readFileSync` em `_startCodexAuthChatSession` |
| Env whitelist | `SPAWN_SYSTEM_VARS` por chave — `process.env` nunca espalhado no spawn env |
| Token redaction | `stderr.replace(/[A-Za-z0-9+/=_\-]{40,}/g, '[REDACTED]')` |
| Stdin fechado | `stdio: ['ignore', 'pipe', 'pipe']` |
| Sem ANSI no output | `TERM: 'dumb'` |

---

## 7. Stack — novo volume Codex

`clever-agent.stack.yml` atualizado:
- Dashboard: `0.33.0-clever-beta.13`
- Novo volume: `clever_agent_codex_auth:/root/.codex`
- Runtime: `0.33.0-clever-beta.10` (inalterado)

**Nota:** O volume `clever_agent_codex_auth` será criado automaticamente pelo Swarm no redeploy.
Para usar `codex_auth` como provider, executar `openclaude login` dentro do container após o deploy.

---

## 8. Patches acumulados (vs beta.10)

| Beta | Fix |
|---|---|
| beta.11 | Avatar WebP optimization (38 PNGs → WebP 256×256 q85, -99.3%) |
| beta.11 | Provider routing: `codex_auth` OAuth via `~/.codex/auth.json` em `chat-bridge.js` |
| beta.11 | Providers.tsx logout messages contextual por `cli_command` |
| beta.12 | Provider-aware terminal sessions (PTY reinicia ao trocar provider) |
| beta.13 | Codex OAuth Chat via OpenClaude harness (este fix) |

---

## 9. Validação local

| Teste | Resultado |
|---|---|
| `node --check` provider-config.js | ✅ |
| `node --check` server.js | ✅ |
| `node --check` claude-bridge.js | ✅ |
| `node --check` chat-bridge.js | ✅ |
| `node --check` bin/server.js | ✅ |
| Frontend `npm run build` | ✅ built in 18.86s |
| `findOpenClaudeCommand` dentro da imagem | ✅ linha 247 |
| `_startCodexAuthChatSession` dentro da imagem | ✅ linha 325 |
| `SPAWN_SYSTEM_VARS` dentro da imagem | ✅ linha 268 |
| `providerSignature` (beta.12) dentro da imagem | ✅ server.js + claude-bridge.js |
| Flask HTTP 200 | ✅ |
| Terminal-server `/api/health` | ✅ `{"status":"warning",...}` (warning = sem provider configurado, esperado) |
| Sem erro CRLF no container | ✅ |

---

## 10. Validação VPS esperada

Após atualizar o stack para beta.13:

- [ ] Redeploy stack com dashboard `0.33.0-clever-beta.13`
- [ ] Verificar volume `clever_agent_codex_auth` criado pelo Swarm
- [ ] `codex_auth` ativo → Oracle Chat responde sem erro 404 `model_not_found`
- [ ] `codex_auth` ativo → Terminal abre com OpenClaude (banner "Claude Code v2.x" do wrapper)
- [ ] Trocar para `anthropic` → Terminal reinicia com Claude Code (beta.12)
- [ ] Trocar de volta para `codex_auth` → Terminal reinicia com OpenClaude (beta.12)
- [ ] `anthropic` ativo → Oracle Chat responde via Claude Agent SDK
- [ ] `openrouter` ativo → Oracle Chat responde via API key (inalterado)

---

## 11. Stack

`clever-agent.stack.yml` atualizado:
- `dashboard`: `0.33.0-clever-beta.13`
- `runtime`: `0.33.0-clever-beta.10` (inalterado)
- `clever_agent_codex_auth` volume: adicionado

---

## 12. Upgrade da beta.12

1. Pull nova imagem dashboard (Portainer fará automaticamente no redeploy)
2. Confirmar `clever-agent.stack.yml` dashboard em `0.33.0-clever-beta.13`
3. Confirmar runtime em `0.33.0-clever-beta.10`
4. Redeploy stack no Portainer
5. Após deploy: testar chat com `codex_auth` ativo — deve responder sem erro 404
6. Opcional: `docker exec <container> openclaude login` para autenticar Codex OAuth

---

## 13. Known issues / pending

- Validação do chat Codex OAuth requer container na VPS com `openclaude login` realizado.
- Volume `clever_agent_codex_auth` será vazio no primeiro deploy — auth.json precisa ser populado via login.
