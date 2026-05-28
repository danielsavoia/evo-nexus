# Clever Agent Dashboard beta.12 Release Notes

**Version:** `0.33.0-clever-beta.12`
**Branch:** `clever-beta`
**Date:** 2026-05-28
**Status:** Released to GHCR

---

## 1. Objetivo

Corrigir bug em que o terminal mantinha o harness antigo ao trocar provider:
- Usuário ativa `codex_auth` → Terminal abre OpenClaude.
- Usuário volta para `anthropic` → Terminal **continuava OpenClaude** (bug).
- Após esta release: Terminal reinicia com Claude Code ao trocar para Anthropic.

---

## 2. Git

| Branch | Commit HEAD |
|---|---|
| `clever-dev` | `2b02624` — fix: restart terminal sessions when provider harness changes |
| `clever-beta` | `e3adb44` — chore: promote Clever Agent dashboard beta.12 |
| Tag | `clever-agent-v0.33.0-clever-beta.12` |
| `clever-prod` | **Preservada — não tocada** |
| `upstream-sync` | **Preservada — não tocada** |

---

## 3. Imagem GHCR

### Dashboard

| Campo | Valor |
|---|---|
| Tag | `ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.12` |
| Digest (index/manifest list) | `sha256:8044cb0601c73c60386e0325098ab2fbc6a79abbce878dda45b272c170797bab` |
| Tamanho local (virtual) | ~10.4 GB |
| Tamanho real comprimido (estimado) | ~3.15 GB |
| `latest` publicado? | **Não** |

Pull:
```bash
docker pull ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.12
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

## 4. Commits incluídos (em cima de beta.11)

| SHA | Descrição |
|---|---|
| `e3adb44` | chore: promote Clever Agent dashboard beta.12 |
| `2b02624` | fix: restart terminal sessions when provider harness changes |

---

## 5. Correção — Provider-aware terminal sessions

### Sintoma

Terminal reutilizava PTY ativa com harness errado após troca de provider. O processo `openclaude` ficava vivo mesmo depois do usuário ativar `anthropic`.

### Causa

- `server.js` `startClaude()`: early-return em `session.active` sem verificar provider.
- `claude-bridge.js` `startSession()`: early-return em `existing.active` sem verificar harness.

### Arquivos alterados

| Arquivo | Patch |
|---|---|
| `dashboard/terminal-server/src/provider-config.js` | Nova função `getProviderSignature(config)` — retorna `"<active>:<cli_command>"` (ex: `"anthropic:claude"`, `"codex_auth:openclaude"`) |
| `dashboard/terminal-server/src/server.js` | `startClaude()`: compara `session.providerSignature` vs provider atual; se diferente → mata PTY e reinicia com harness correto. Generation counter torna callbacks `onExit`/`onError` stale-safe. Armazena `providerSignature` após start. |
| `dashboard/terminal-server/src/claude-bridge.js` | Early-return defensivo com comparação de assinatura. `providerSignature` salvo no objeto PTY. Guards `if (this.sessions.get(id) === session)` em `onExit`/`error` para proteger novo PTY do Map. |

### Comportamento após o fix

| Cenário | Comportamento |
|---|---|
| `anthropic` ativo → terminal abre | PTY: `/usr/bin/claude`; signature: `anthropic:claude` |
| `codex_auth` ativo → terminal abre | PTY: `/usr/bin/openclaude`; signature: `codex_auth:openclaude` |
| Troca `codex_auth` → `anthropic` | Log `Provider changed: old=codex_auth:openclaude new=anthropic:claude`; PTY reiniciado com Claude Code |
| Troca `anthropic` → `codex_auth` | Log `Provider changed: old=anthropic:claude new=codex_auth:openclaude`; PTY reiniciado com OpenClaude |
| Reconexão WebSocket sem troca | Same provider → sem reinício; buffer replicado |
| PTY antigo sai após kill | Log `Ignoring stale PTY exit (gen N vs N+1)`; nenhum `exit` enviado ao cliente |

---

## 6. Patches acumulados (vs beta.10)

Esta release inclui todos os fixes das betas anteriores:

| Beta | Fix |
|---|---|
| beta.11 | Avatar WebP optimization (38 PNGs → WebP 256×256 q85, -99.3%); PNG orphans removidos do `public/` |
| beta.11 | Provider routing: `codex_auth` OAuth via `~/.codex/auth.json` em `chat-bridge.js` |
| beta.11 | Providers.tsx logout messages contextual por `cli_command` |
| beta.12 | Provider-aware terminal sessions (este fix) |

---

## 7. Validação local

| Teste | Resultado |
|---|---|
| `node --check` provider-config.js | ✅ |
| `node --check` server.js | ✅ |
| `node --check` claude-bridge.js | ✅ |
| `node --check` chat-bridge.js | ✅ |
| Frontend `npm run build` | ✅ built in 26.97s |
| `getProviderSignature` dentro da imagem | ✅ 15 matches |
| 38 WebPs em dist, 0 PNG orphans | ✅ |
| Flask HTTP 200 | ✅ |
| Terminal-server `/api/health` | ✅ `{"status":"warning",...}` (warning = sem provider configurado, esperado) |
| Sem erro CRLF no container | ✅ |

---

## 8. Validação VPS esperada

Após atualizar o stack para beta.12:

- [ ] Anthropic ativo → Terminal abre com `╭───Claude Code v2.x`
- [ ] Trocar para `codex_auth` → Terminal reinicia com OpenClaude
- [ ] Trocar de volta para Anthropic → Terminal reinicia com Claude Code
- [ ] Reconexão WebSocket sem troca de provider → sem reinício, sem flash de terminal
- [ ] Chat com Anthropic → resposta via Claude Agent SDK
- [ ] Chat com `codex_auth` → resposta via OAuth (`~/.codex/auth.json`)

---

## 9. Stack

`clever-agent.stack.yml` atualizado:
- `dashboard`: `0.33.0-clever-beta.12`
- `runtime`: `0.33.0-clever-beta.10` (inalterado)

---

## 10. Upgrade da beta.11

1. Pull nova imagem dashboard (Portainer fará automaticamente no redeploy)
2. Confirmar `clever-agent.stack.yml` dashboard em `0.33.0-clever-beta.12`
3. Confirmar runtime em `0.33.0-clever-beta.10`
4. Redeploy stack no Portainer
5. Após deploy: trocar provider no dashboard e abrir terminal — deve reiniciar com harness correto

---

## 11. Known issues / pending

- Nenhum bloqueante para beta.12.
- Validação do comportamento de troca de provider requer container rodando na VPS.
