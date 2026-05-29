# Clever Agent Dashboard — Release 0.33.0-clever-beta.14

**Data:** 2026-05-29
**Imagem:** `ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.14`
**Digest index (manifest list):** `sha256:26f42b9edfa4a00e3952fee445cba39b154fad0361f23aae384fc8f149a4ab04`
**Digest linux/amd64:** `sha256:db95db9bf2be1b35dcccea5f11a941991ee6370e89638acf77491624026b5049`
**Branch:** clever-beta @ `9c7f944`
**Commit principal:** `315d2d8` — fix: reset terminal sessions when provider changes
**Runtime:** `0.33.0-clever-beta.10` (inalterado)
**Site:** `0.33.0-clever-beta.1` (inalterado)

---

## O que mudou

### Provider Change Terminal Reset (patch 4)

**Sintoma corrigido:** ao trocar de provider no dashboard (ex.: Codex → Anthropic), o chat
passava a usar o novo provider corretamente, mas o Terminal continuava executando o harness
antigo (OpenClaude) até que o container fosse reiniciado ou a sessão manualmente encerrada.

**Causa raiz — três gaps independentes:**

| Gap | Local | Problema |
|-----|-------|----------|
| GAP 1 | `providers.py::set_active_provider()` | Nunca notificava o terminal-server após salvar o novo provider |
| GAP 2 | `server.js::joinClaudeSession()` | Reconectava sessão stale sem verificar se o provider mudou |
| GAP 3 | `terminal-server` | Não existia endpoint externo para forçar reset de PTYs |

**Solução implementada — três camadas:**

1. **Novo endpoint** `POST /api/sessions/reset-provider` (`server.js`):
   - Itera `claudeSessions`, para cada sessão ativa chama `stopSession()`, reseta metadados,
     faz broadcast `claude_stopped` para clientes WebSocket, incrementa `generation` para
     descartar callbacks stale de `onExit`/`onError`.
   - Retorna `{ status, stopped, reason }`.

2. **Helper `_reset_terminal_sessions(provider_id)`** (`providers.py`):
   - Chamado em AMBOS os paths de `set_active_provider()` (PostgreSQL e arquivo JSON).
   - Usa `urllib.request` (sem dependências extras), timeout 3 s, best-effort — falha
     loga como `WARNING` e nunca bloqueia o save do provider.

3. **Defesa em `joinClaudeSession()`** (`server.js`):
   - Ao reconectar sessão ativa, compara `session.providerSignature` com a assinatura atual.
   - Se divergirem: para a PTY stale, reseta metadados, faz broadcast, e continua com join
     limpo. Garante proteção mesmo que o reset-provider tenha falhado (ex.: race condition).

---

## Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `dashboard/terminal-server/src/server.js` | + endpoint `POST /api/sessions/reset-provider`; + defesa providerSignature em `joinClaudeSession()` |
| `dashboard/backend/routes/providers.py` | + helper `_reset_terminal_sessions()`; chamada em ambos paths de `set_active_provider()` |
| `clever-agent.stack.yml` | tag dashboard `0.33.0-clever-beta.13` → `0.33.0-clever-beta.14` |
| `docs/clever-agent/provider-executable-routing.md` | + seção "Provider change terminal reset (patch 4)" |
| `docs/clever-agent/white-label-patch-ledger.md` | + linha patch 4 |
| `docs/clever-agent/white-label-master-inventory.md` | + item 17 + grep checks §5 |

---

## Patches acumulados nesta imagem

| # | Versão | Patch |
|---|--------|-------|
| 1 | beta.10 | Patches iniciais Clever Agent |
| 2 | beta.12 | `providerSignature` + `getProviderSignature()` + generation counter em `startClaude()` |
| 3 | beta.13 | Codex OAuth chat via `openclaude -p` (`_startCodexAuthChatSession`, `findOpenClaudeCommand`, `SPAWN_SYSTEM_VARS`); volume `clever_agent_codex_auth` |
| 4 | **beta.14** | **Provider change terminal reset** (`POST /api/sessions/reset-provider` + `_reset_terminal_sessions()` + defesa `joinClaudeSession()`) |

---

## Stack

```yaml
dashboard:
  image: ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.14
  volumes:
    - clever_agent_codex_auth:/root/.codex   # Codex OAuth — beta.13+

runtime:
  image: ghcr.io/danielsavoia/clever-agent-runtime:0.33.0-clever-beta.10
```

---

## Deploy no VPS

```bash
# Atualizar imagem
docker service update --image ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.14 clever_agent_dashboard

# Verificar endpoint reset-provider (interno ao container)
curl -X POST http://localhost:32352/api/sessions/reset-provider \
  -H "Content-Type: application/json" \
  -d '{"reason":"post_deploy_check","provider_id":"test"}'
# Esperado: {"status":"ok","stopped":0,"reason":"post_deploy_check"}
```

---

## Validação pós-deploy

1. Configurar dois providers no dashboard (ex.: Anthropic + Codex).
2. Abrir Terminal — iniciar sessão com provider A.
3. No painel Providers, trocar para provider B.
4. **Esperado:** Terminal exibe `claude_stopped` e na próxima abertura usa harness do provider B.
5. Conferir logs do terminal-server: `reset-provider reason=provider_changed stopped=1`.
