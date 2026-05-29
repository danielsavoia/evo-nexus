# Clever Agent Provider Stabilization — beta.10 to beta.14

**Maintainer:** Clever Agent team
**Last updated:** 2026-05-29
**Branch:** `clever-dev`
**Status:** ✅ Completo — todos os patches em produção desde beta.14
**Reapply risk:** **CRITICAL** — estes arquivos são tocados em quase toda atualização upstream

---

## 1. Objetivo

Este documento é o dossiê técnico consolidado de todas as correções feitas no subsistema de
**Providers / Chat / Terminal / Harness** entre as releases beta.10 e beta.14 do Clever Agent.

Serve como:

- **Referência de manutenção:** ao receber um upstream merge, saber exatamente o que rereaplicar.
- **Documento de onboarding:** novo desenvolvedor lê aqui antes de tocar em qualquer arquivo de provider.
- **Registro de decisões:** por que cada escolha foi feita, quais antipadrões foram descartados.

Documentos relacionados (referência complementar, não substituem este):

| Documento | Propósito |
|---|---|
| `docs/clever-agent/provider-executable-routing.md` | Snippets detalhados de código + reapply checklists por patch |
| `docs/clever-agent/white-label-patch-ledger.md` | Tabela de todos os patches com commits e risco |
| `docs/clever-agent/white-label-master-inventory.md` | Inventário completo white-label + workflow de reapply |
| `docs/clever-agent/beta-release-0.33.0-clever-beta.{N}.md` | Release notes por versão |

---

## 2. Linha do tempo resumida

| Release | Tag | Data | Problema principal | Correção | Arquivos críticos |
|---|---|---|---|---|---|
| **beta.10** | `clever-agent-v0.33.0-clever-beta.10` | 2026-05-28 | Chat/terminal não funcionavam; auth quebrado; CLIs ausentes; scheduler crash | Auth volumes `:rw`, `CLAUDE_CODE_EXECUTABLE`, CLIs embarcados no Dockerfile, terminal-server multi-processo | `Dockerfile.dashboard`, `start-dashboard.sh`, `claude-bridge.js`, `clever-agent.stack.yml` |
| **beta.11** | `clever-agent-v0.33.0-clever-beta.11` | 2026-05-28 | Avatares lentos; todos os toggles de provider desabilitados; CLIs não detectados no container | Avatar WebP; fix toggle; Node.js + CLIs no Dockerfile.dashboard; mensagens contextuais Providers.tsx | `Dockerfile.dashboard`, `Providers.tsx`, `agent-meta.ts`, `agent_meta_seed.py` |
| **beta.12** | `clever-agent-v0.33.0-clever-beta.12` | 2026-05-28 | Terminal mantinha harness antigo ao trocar provider (PTY reutilizado sem checagem) | `providerSignature` + generation counter; early-return defensivo em `startClaude()` e `startSession()` | `server.js`, `claude-bridge.js`, `provider-config.js` |
| **beta.13** | `clever-agent-v0.33.0-clever-beta.13` | 2026-05-29 | Chat `codex_auth` retornava 404 `model_not_found` (codexplan inválido na API pública OpenAI) | Roteamento para `openclaude -p` headless; env whitelist; segurança auth.json | `chat-bridge.js`, `clever-agent.stack.yml` (volume codex) |
| **beta.14** | `clever-agent-v0.33.0-clever-beta.14` | 2026-05-29 | Terminal ficava preso no harness antigo após troca de provider (validado na VPS) | `POST /api/sessions/reset-provider`; `_reset_terminal_sessions()`; defesa `joinClaudeSession()` | `server.js`, `providers.py` |

---

## 3. Arquitetura final dos providers (após beta.14)

### 3.1 Matriz provider → harness

| Provider ID | `cli_command` | Terminal harness | Chat backend | Auth | Observação |
|---|---|---|---|---|---|
| `anthropic` | `claude` | `/usr/bin/claude` | Claude Agent SDK (`sdkQuery`) | OAuth via `~/.claude/.credentials.json` | Provider nativo Anthropic; sem `requires_logout` |
| `codex_auth` | `openclaude` | `/usr/bin/openclaude` | `openclaude -p "<prompt>"` (headless) | OAuth via `~/.codex/auth.json` | `codexplan` é alias interno; inválido na API pública OpenAI |
| `openrouter` | `openclaude` | `/usr/bin/openclaude` | OpenAI Chat Completions + `OPENAI_API_KEY` | API key | Requer logout Anthropic anterior |
| `openai` | `openclaude` | `/usr/bin/openclaude` | OpenAI Chat Completions + `OPENAI_API_KEY` | API key | gpt-4.x |
| `omnirouter` | `openclaude` | `/usr/bin/openclaude` | OpenAI Chat Completions + `OPENAI_API_KEY` | API key | URL customizado |
| `gemini` | `openclaude` | `/usr/bin/openclaude` | (em breve) | — | Suporte futuro |
| `bedrock` | `openclaude` | `/usr/bin/openclaude` | (em breve) | — | Suporte futuro |
| `vertex` | `openclaude` | `/usr/bin/openclaude` | (em breve) | — | Suporte futuro |

### 3.2 Provedor de assinatura (providerSignature)

Cada sessão PTY carrega a assinatura `"<active>:<cli_command>"`:

| Provider | providerSignature |
|---|---|
| `anthropic` | `"anthropic:claude"` |
| `codex_auth` | `"codex_auth:openclaude"` |
| `openrouter` | `"openrouter:openclaude"` |

A assinatura é comparada ao reconectar/reiniciar — PTY é morto se a assinatura mudou.

### 3.3 Fluxo de troca de provider (estado após beta.14)

```
Usuário clica "Ativar" em provider X
  → POST /api/providers/active (providers.py)
  → salva active_provider (file ou PostgreSQL)
  → POST /api/sessions/reset-provider (http://127.0.0.1:32352) — best-effort
  → terminal-server: itera claudeSessions; por sessão ativa:
      - generation++
      - stopSession(id) → mata PTY
      - session.active = false
      - broadcast { type: 'claude_stopped', reason: 'provider_changed' }
  → frontend recebe claude_stopped → mostra terminal inativo
  → usuário abre terminal
  → start_claude → startClaude()
  → providers.json lido freshly → PTY novo com harness correto
```

### 3.4 CLIs embarcados — regra de instalação

> **Regra:** Claude Code (`/usr/bin/claude`) e OpenClaude (`/usr/bin/openclaude`) são instalados
> no stage `runtime` do `Dockerfile.dashboard`. A VPS **não** precisa ter esses CLIs instalados
> no host.

```dockerfile
# No Dockerfile.dashboard — stage runtime
RUN npm install -g \
        @anthropic-ai/claude-code \
        @gitlawb/openclaude@latest \
    && npm cache clean --force \
    && rm -rf /root/.npm
```

Consequências:
- Portainer redeploy com nova tag → CLIs sempre atualizados para as versões embarcadas.
- Login/auth pela UI Providers é o **fluxo oficial** onde suportado.
- `docker exec <container> openclaude login` é **plano B** (debug/troubleshooting).
- Nunca instalar os CLIs manualmente no host da VPS como parte do fluxo normal.

---

## 4. beta.10 — Base funcional

**Tag:** `clever-agent-v0.33.0-clever-beta.10`
**Data:** 2026-05-28
**Commits chave:** `efc8899`, `00c220d`, `7334991`, `3a137b3`, `6163ce1`, `428a385`

### 4.1 Problemas resolvidos

#### 4.1.1 Volumes de auth Claude obrigatoriamente `:rw`

**Sintoma:** TUI do terminal renderizava em branco; chat não respondia.

**Causa:**
- `.credentials.json` montado `:ro` → Claude Code 2.x escreve neste arquivo no startup para
  refresh de tokens OAuth → silently hung.
- `.claude.json` montado `:ro` → Claude Code 2.1.152+ escreve estado de sessão, decisões de
  confiança e timestamps → TUI renderizava blank.

**Correção em `clever-agent.stack.yml`:**
```yaml
- /home/claude/.claude/.credentials.json:/root/.claude/.credentials.json:rw  # OBRIGATÓRIO :rw
- /home/claude/.claude.json:/root/.claude.json:rw                              # OBRIGATÓRIO :rw
```

**Regra:** Nunca montar estes arquivos como `:ro`. Ver `docs/clever-agent/claude-auth-container-mount.md`.

#### 4.1.2 CLAUDE_CODE_EXECUTABLE

**Sintoma:** Chat via Claude Agent SDK não respondia.

**Causa:** SDK bundlado v2.1.119 falha silenciosamente. O binário instalado pelo Dockerfile
é `/usr/bin/claude` (v2.1.152+).

**Correção:**
```yaml
environment:
  - CLAUDE_CODE_EXECUTABLE=/usr/bin/claude
```

**Regra:** Esta variável deve estar presente em todas as versões do stack.

#### 4.1.3 Terminal-server multi-processo

**Sintoma:** Chat retornava "Could not reach terminal-server".

**Causa:** CMD do Dockerfile iniciava apenas Flask; `start-dashboard.sh` (que sobe terminal-server
na porta 32352 + Flask) nunca era executado.

**Correção em `Dockerfile.dashboard`:**
```dockerfile
# Stage terminal-build (requer python3 + make + g++ para compilar node-pty)
FROM node:22-slim AS terminal-build
RUN apt-get update && apt-get install -y python3 make g++
WORKDIR /build/terminal-server
COPY dashboard/terminal-server/package.json ./
RUN npm install --omit=dev

# No stage runtime:
COPY --from=terminal-build /build/terminal-server/node_modules \
     dashboard/terminal-server/node_modules
COPY dashboard/terminal-server/ dashboard/terminal-server/

CMD ["/usr/local/bin/start-dashboard.sh"]
```

**Regra:** `start-dashboard.sh` deve ser o CMD. O stage `terminal-build` deve ser mantido
para compilar `node-pty` nativamente para linux/amd64.

#### 4.1.4 CRLF em start-dashboard.sh

**Sintoma:** Container falhava com `env: 'bash\r': No such file or directory`.

**Causa:** Windows git convertia LF→CRLF silenciosamente.

**Correção:** `.gitattributes`:
```
*.sh text eol=lf
Dockerfile* text eol=lf
```

#### 4.1.5 Trust prompt (claude-bridge.js)

Claude Code 2.1.152+ introduziu um novo trust prompt na inicialização da sessão. `claude-bridge.js`
detecta 3 padrões e responde automaticamente:
```javascript
// Padrões detectados (todos os 3 obrigatórios):
"trust the files"
"project you created"
"Quick safety check"
```

#### 4.1.6 Scheduler CMD fix

**Sintoma:** Serviço `runtime` entrava em restart loop no Docker Swarm.

**Causa:** `CMD ["bash"]` no `Dockerfile.swarm` — bash sai imediatamente em container sem TTY.

**Correção:**
```dockerfile
CMD ["uv", "run", "python", "scheduler.py"]
```

### 4.2 Stack resultado em beta.10

```yaml
dashboard:
  image: ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.10
  volumes:
    - /home/claude/.claude/.credentials.json:/root/.claude/.credentials.json:rw
    - /home/claude/.claude.json:/root/.claude.json:rw
  environment:
    - CLAUDE_CODE_EXECUTABLE=/usr/bin/claude
    - TERMINAL_SERVER_PORT=32352

runtime:
  image: ghcr.io/danielsavoia/clever-agent-runtime:0.33.0-clever-beta.10
```

### 4.3 Pendências após beta.10

- Terminal mantinha harness antigo ao trocar provider → corrigido em beta.12.
- Chat `codex_auth` falhava com `model_not_found` → corrigido em beta.13.
- Terminal PTY não era morto ao trocar provider via UI → corrigido em beta.14.

---

## 5. beta.11 — Avatar WebP + provider routing inicial

**Tag:** `clever-agent-v0.33.0-clever-beta.11`
**Data:** 2026-05-28
**Commits chave:** `69cd492`, `573eae8`, `bacfc49`, `4ae94e8`

### 5.1 Avatar WebP optimization

**Problema:** 38 PNGs de 1254×1254 px → 63.9 MB total → carregamento lento.

**Correção:** WebP 256×256 q85 → 458 KB total (-99.3%).

```
brand/clever-agent/avatars/avatar_{slug}.png  ← masters (preservados, não servidos)
dashboard/frontend/public/clever-agent/avatars/avatar_{slug}.webp  ← servidos pelo Vite
```

`agent-meta.ts` e `agent_meta_seed.py` atualizados: `.png` → `.webp`.

**PNG orphans removidos:** Os PNGs de 1254px estavam em `public/clever-agent/avatars/` e eram
copiados pelo Vite para `dist/` — aumentando a imagem Docker desnecessariamente.

> **Nota:** A master-inventory usa `.png` (não `.webp`) nas referências do avatar porque em algum
> ponto foi revertido. Verificar a versão atual de `agent-meta.ts` antes de reapply.

### 5.2 Provider routing inicial (chat-bridge.js beta.11)

**Problema:** `codex_auth` não tinha API key → erro "sem API key configurada".

**Correção beta.11 (preliminar):** `chat-bridge.js` lia `~/.codex/auth.json` e passava como token
Bearer para `api.openai.com/v1/chat/completions`. Funcionou como paliativo.

**Limitação descoberta depois:** `codexplan` não é um modelo válido na API pública OpenAI →
retornava 404 `model_not_found`. Corrigido definitivamente em beta.13.

### 5.3 Providers.tsx — mensagens contextuais

Mensagens de logout passaram a ser contextuais por `cli_command`:

| Harness | Mensagem |
|---|---|
| `openclaude` | "Run /logout in the OpenClaude terminal if you were previously authenticated with another provider" |
| `claude` | "Run /logout in Claude Code if you were previously logged into Anthropic" |

### 5.4 Providers toggle fix

**Problema:** `disabled={!cliInstalled || toggling===id}` — com `claude_installed=false`, todos
os toggles ficavam desabilitados incluindo o provider ativo.

**Correção:** `disabled={toggling===id || (!isInstalled && !isActive)}`

### 5.5 CLIs no Dockerfile.dashboard

**Problema:** `providers.py` usa `shutil.which(cli)` para detectar CLIs; imagem era `python:3.12-slim`
sem Node.js → `claude`/`openclaude` não encontrados → todos os providers apareciam "not installed".

**Correção em `Dockerfile.dashboard`:**
```dockerfile
RUN npm install -g \
        @anthropic-ai/claude-code \
        @gitlawb/openclaude@latest \
    && npm cache clean --force \
    && rm -rf /root/.npm
```

---

## 6. beta.12 — providerSignature + provider-aware terminal sessions

**Tag:** `clever-agent-v0.33.0-clever-beta.12`
**Data:** 2026-05-28
**Commits chave:** `2b02624`

### 6.1 Problema raiz

Terminal reutilizava PTY existente ao reconectar ou reiniciar — sem checar se o provider tinha mudado:

```javascript
// ANTES — server.js startClaude():
if (session.active) {
  // reconexão de WebSocket e troca de provider tratadas igual
  this.sendToWebSocket(ws, { type: 'claude_started', ... });
  return;  // ← PTY antigo reutilizado sem checar provider
}

// ANTES — claude-bridge.js startSession():
if (existing.active) {
  return existing;  // ← retorna PTY vivo com harness antigo
}
```

### 6.2 Nova abstração: providerSignature

**`provider-config.js`** — novo helper exportado:
```javascript
function getProviderSignature(providerConfig) {
  const active = (providerConfig?.active || 'anthropic').trim();
  const cli   = (providerConfig?.cli_command || 'claude').trim();
  return `${active}:${cli}`;
}
```

Exemplos: `"anthropic:claude"`, `"codex_auth:openclaude"`, `"openrouter:openclaude"`.

### 6.3 Correção em server.js — startClaude()

```javascript
if (session.active) {
  const currentProvider = loadProviderConfig();
  const currentSig = getProviderSignature(currentProvider);
  const storedSig  = session.providerSignature;

  if (storedSig && storedSig !== currentSig) {
    // Provider mudou → matar PTY e reiniciar
    await this.claudeBridge.stopSession(wsInfo.claudeSessionId);
    session.active = false;
    session.agent  = null;
    session.providerSignature = null;
    // fall through → PTY novo
  } else {
    // Reconexão WebSocket — mesmo provider, reanexar
    this.sendToWebSocket(wsInfo.ws, { type: 'claude_started', ... });
    return;
  }
}

// generation counter — onExit/onError callbacks stale-safe:
const generation = (session.generation || 0) + 1;
session.generation = generation;
```

### 6.4 Correção em claude-bridge.js

```javascript
// Early-return defensivo:
if (existing.active) {
  const sig = getProviderSignature(this._loadProviderConfig());
  if (existing.providerSignature && existing.providerSignature !== sig) {
    existing.process.kill('SIGKILL');
    this.sessions.delete(sessionId);
    // fall through → novo PTY
  } else {
    return existing;  // reconexão segura
  }
}

// Guard no onExit — evita deletar novo PTY do Map:
onExit: () => {
  if (this.sessions.get(sessionId) === session) {
    this.sessions.delete(sessionId);
  }
}
```

### 6.5 Limitação residual descoberta depois

O fix de beta.12 funciona em `startClaude()` (evento `start_claude` do WebSocket) e no early-return
do `claude-bridge.js`. Porém se o provider muda enquanto uma sessão está ativa e o usuário
apenas recarrega a página sem fechar o terminal, `joinClaudeSession()` reconectava a sessão
stale sem checar a assinatura. Além disso, `set_active_provider()` nunca notificava o
terminal-server. Ambos corrigidos em beta.14.

---

## 7. beta.13 — Codex OAuth Chat via OpenClaude harness

**Tag:** `clever-agent-v0.33.0-clever-beta.13`
**Data:** 2026-05-29
**Commits chave:** `25cbb62`

### 7.1 Causa raiz — codexplan e a API pública OpenAI

```
HTTP POST api.openai.com/v1/chat/completions
  model: "codexplan"
  → 404 model_not_found: "The model 'codexplan' does not exist or you do not have access to it."
```

`codexplan` é um **alias interno** do `openclaude` que roteia para `chatgpt.com/backend-api/codex`.
Ele não existe na API pública da OpenAI. Portanto, qualquer abordagem que tente chamar
`/v1/chat/completions` diretamente com `codexplan` está errada por design.

A abordagem correta é usar o próprio `openclaude` como proxy headless para o backend Codex.

### 7.2 Solução — openclaude -p headless

**`chat-bridge.js`** — novas adições:

#### findOpenClaudeCommand()
```javascript
function findOpenClaudeCommand() {
  // 1. which openclaude
  // 2. fallback paths: /usr/bin, /usr/local/bin, ~/.local/bin
  // 3. bare 'openclaude' como último recurso
}
```

#### SPAWN_SYSTEM_VARS
```javascript
const SPAWN_SYSTEM_VARS = [
  'HOME', 'USER', 'SHELL', 'PATH', 'LANG', 'LC_ALL', 'LC_CTYPE',
  'LOGNAME', 'HOSTNAME', 'XDG_RUNTIME_DIR', 'XDG_DATA_HOME',
  'XDG_CONFIG_HOME', 'XDG_CACHE_HOME', 'TMPDIR',
  'SSH_AUTH_SOCK', 'SSH_AGENT_PID',
  'NVM_DIR', 'NVM_BIN', 'NVM_INC',
  'CODEX_HOME', 'CLAUDE_CONFIG_DIR',
];
```

> **Segurança:** `process.env` nunca é espalhado no spawn env. Apenas as variáveis da whitelist
> são passadas. Isso evita vazar `OPENAI_API_KEY` e outros segredos do processo Node.

#### _startCodexAuthChatSession()
```javascript
async _startCodexAuthChatSession(sessionId, options, providerConfig) {
  // 1. Validar ~/.codex/auth.json por EXISTÊNCIA apenas (nunca ler/logar)
  const codexAuthPath = path.join(os.homedir(), '.codex', 'auth.json');
  if (!fs.existsSync(codexAuthPath)) {
    throw new Error('Provider "codex_auth" requer autenticação OAuth. Execute openclaude login...');
  }

  // 2. Montar prompt: systemCtx + "\n\n---\n\n" + userContent
  // 3. Spawn:
  nodeSpawn(findOpenClaudeCommand(), ['-p', fullPrompt], {
    cwd: process.cwd(),
    env: {
      ...Object.fromEntries(SPAWN_SYSTEM_VARS.map(k => [k, process.env[k]]).filter(([,v]) => v)),
      CLAUDE_CODE_USE_OPENAI: '1',
      OPENAI_MODEL: 'codexplan',
      TERM: 'dumb',   // previne ANSI codes
    },
    stdio: ['ignore', 'pipe', 'pipe'],  // stdin fechado
  });

  // 4. Stream stdout como text_delta
  // 5. Redact tokens em stderr: raw.replace(/[A-Za-z0-9+/=_\-]{40,}/g, '[REDACTED]')
  // 6. Timeout 120s; suporte a abort signal
  // 7. exit code != 0 → erro amigável
}
```

#### Routing em startSession()
```javascript
if (providerConfig.active === 'codex_auth') {
  return this._startCodexAuthChatSession(sessionId, options, providerConfig);
}
// outros providers não-Anthropic:
return this._startOpenAICompatibleSession(sessionId, options, providerConfig);
```

### 7.3 Regras de segurança aplicadas

| Regra | Implementação |
|---|---|
| `auth.json` não lido/logado | `fs.existsSync()` apenas — nunca `readFileSync` |
| `process.env` não espalhado | whitelist `SPAWN_SYSTEM_VARS` explícita |
| Tokens redactados | `stderr.replace(/[A-Za-z0-9+/=_\-]{40,}/g, '[REDACTED]')` |
| Stdin fechado | `stdio: ['ignore', 'pipe', 'pipe']` |
| Sem ANSI no output | `TERM: 'dumb'` |

### 7.4 Volume Codex adicionado no stack

Para persistir `~/.codex/auth.json` entre restarts do container:

```yaml
services:
  dashboard:
    volumes:
      - clever_agent_codex_auth:/root/.codex  # ← adicionado em beta.13

volumes:
  clever_agent_codex_auth:  # ← criado automaticamente pelo Swarm no primeiro deploy
```

**Nota de instalação:** O volume será vazio no primeiro deploy. Executar
`docker exec <container> openclaude login` uma vez para popular o volume.
Nos deploys subsequentes, o volume persiste automaticamente.

### 7.5 Fluxos preservados (inalterados)

| Provider | Chat backend | Status |
|---|---|---|
| `anthropic` | Claude Agent SDK (`sdkQuery`) | inalterado |
| `openrouter` / `openai` / `omnirouter` | OpenAI Chat Completions + API key | inalterado |
| `codex_auth` | `openclaude -p` headless | **NOVO** |

---

## 8. beta.14 — Reset real de terminal sessions quando provider muda

**Tag:** `clever-agent-v0.33.0-clever-beta.14`
**Data:** 2026-05-29
**Commits chave:** `315d2d8`

### 8.1 Sintoma confirmado na VPS

```
Estado: Codex OAuth ativo
Ação: Trocar para Anthropic no dashboard
Resultado esperado: Chat usa Claude SDK + Terminal usa Claude Code
Resultado real: Chat usa Claude SDK ✅; Terminal CONTINUA OpenClaude ❌
Causa: PTY antigo com harness OpenClaude permanecia vivo
```

### 8.2 Causa raiz — três gaps independentes

| # | Gap | Arquivo | Causa detalhada |
|---|---|---|---|
| 1 | **providers.py não notificava terminal-server** | `dashboard/backend/routes/providers.py` | `set_active_provider()` gravava `active_provider` e retornava 200. Nenhuma notificação para o terminal-server. |
| 2 | **joinClaudeSession sem defesa** | `dashboard/terminal-server/src/server.js` | `joinClaudeSession()` reconectava sessão stale sem checar `providerSignature`. Apenas `startClaude()` fazia essa verificação (beta.12). |
| 3 | **Sem endpoint externo de reset** | `dashboard/terminal-server/src/server.js` | Não existia endpoint para forçar reset de PTYs de fora do terminal-server. |

### 8.3 Correção — três camadas de defesa

#### Camada 1 — POST /api/sessions/reset-provider (server.js)

Novo endpoint em `setupExpress()`:

```javascript
this.app.post('/api/sessions/reset-provider', async (req, res) => {
  const { reason = 'provider_changed', provider_id = null } = req.body || {};
  let stopped = 0;
  for (const [sessionId, session] of this.claudeSessions.entries()) {
    if (!session.active) continue;
    session.generation = (session.generation || 0) + 1;  // invalida callbacks stale
    try { await this.claudeBridge.stopSession(sessionId); } catch (err) { /* log warn */ }
    session.active = false;
    session.agent = null;
    session.providerSignature = null;
    this.broadcastToSession(sessionId, { type: 'claude_stopped', reason: 'provider_changed' });
    stopped++;
  }
  console.log(`[terminal] reset-provider reason=${reason} provider=${provider_id||'unknown'} stopped=${stopped}`);
  res.json({ status: 'ok', stopped, reason });
});
```

#### Camada 2 — _reset_terminal_sessions() (providers.py)

Novo helper, chamado em **AMBOS** os caminhos de `set_active_provider()`:

```python
def _reset_terminal_sessions(provider_id: str) -> None:
    import urllib.request as _urlreq
    terminal_port = os.environ.get("TERMINAL_SERVER_PORT", "32352")
    url = f"http://127.0.0.1:{terminal_port}/api/sessions/reset-provider"
    body = json.dumps({"reason": "provider_changed", "provider_id": provider_id}).encode("utf-8")
    req = _urlreq.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with _urlreq.urlopen(req, timeout=3) as resp:
            current_app.logger.info("[providers] terminal sessions reset (HTTP %s)", resp.status)
    except Exception as exc:
        current_app.logger.warning("[providers] Could not reset terminal sessions: %s", exc)
```

```python
# Caminho PostgreSQL:
_pstore.set_active_provider(provider_id)
_reset_terminal_sessions(provider_id)  # ← OBRIGATÓRIO em ambos os caminhos
return jsonify({"status": "ok", "active_provider": provider_id})

# Caminho arquivo JSON:
config["active_provider"] = provider_id
_write_config(config)
_reset_terminal_sessions(provider_id)  # ← OBRIGATÓRIO em ambos os caminhos
return jsonify({"status": "ok", "active_provider": provider_id})
```

> **Importante:** Falha no reset **nunca** bloqueia o save do provider. `except Exception` captura
> tudo e loga como `WARNING`. O provider é salvo com sucesso independentemente.

#### Camada 3 — defesa em joinClaudeSession() (server.js)

```javascript
// Adicionado no início de joinClaudeSession(), antes do leaveClaudeSession:
if (session.active && session.providerSignature) {
  try {
    const currentProvider = loadProviderConfig();
    const currentSig = getProviderSignature(currentProvider);
    if (session.providerSignature !== currentSig) {
      session.generation = (session.generation || 0) + 1;
      await this.claudeBridge.stopSession(claudeSessionId);
      session.active = false;
      session.agent = null;
      session.providerSignature = null;
      this.broadcastToSession(claudeSessionId, { type: 'claude_stopped', reason: 'provider_changed' });
    }
  } catch (_) { /* non-fatal — proceed */ }
}
```

### 8.4 Por que três camadas?

| Cenário de falha | Proteção |
|---|---|
| Reset via providers.py chega antes do usuário abrir terminal | Camada 1 mata PTYs ativos |
| Reset falha (race condition, terminal-server brevemente offline) | Camada 3 pega no próximo join |
| Usuário recarrega página com sessão ativa e provider já trocado | Camada 3 pega em joinClaudeSession |
| PTY antigo sai depois de ser morto | generation counter descarta callbacks stale |

### 8.5 Validação

| Cenário | Comportamento esperado | Log esperado |
|---|---|---|
| Codex ativo → troca para Anthropic | PTY morto; terminal mostra inativo; reabre com Claude Code | `reset-provider reason=provider_changed stopped=1` |
| Anthropic ativo → troca para Codex | PTY morto; terminal mostra inativo; reabre com OpenClaude | `reset-provider reason=provider_changed stopped=1` |
| Nenhuma sessão ativa → troca provider | Nenhuma ação no terminal | `reset-provider stopped=0` |
| Falha no reset (terminal offline) | Provider salvo; warning no Flask log | `Could not reset terminal sessions: ...` |
| Usuário recarrega página após trocar provider | joinClaudeSession pega assinatura diferente; broadcast `claude_stopped` | `Provider changed for session ... old=X new=Y` |

---

## 9. Arquivos alterados por área

| Área | Arquivo | Release | Tipo de patch | Risco de conflito upstream | Reapply obrigatório? |
|---|---|---|---|---|---|
| **Terminal harness** | `dashboard/terminal-server/src/provider-config.js` | beta.12 | Nova função `getProviderSignature()` | Médio — arquivo novo, upstream improvável de tocar | Sim |
| **Terminal sessions** | `dashboard/terminal-server/src/server.js` | beta.12, beta.14 | `startClaude()` providerSignature check; generation counter; `joinClaudeSession()` defesa; `POST /api/sessions/reset-provider` | **Alto** — server.js tocado em quase todo release | Sim — verificar 4 pontos |
| **PTY bridge** | `dashboard/terminal-server/src/claude-bridge.js` | beta.10, beta.12 | Trust prompt; early-return defensivo; guard onExit; `providerSignature` no objeto PTY | **Alto** — tocado em releases de Claude SDK | Sim |
| **Chat Codex** | `dashboard/terminal-server/src/chat-bridge.js` | beta.11, beta.13 | `_startCodexAuthChatSession()`; `findOpenClaudeCommand()`; `SPAWN_SYSTEM_VARS`; routing codex_auth | **Alto** — tocado em releases de chat/providers | Sim |
| **Provider save** | `dashboard/backend/routes/providers.py` | beta.14 | `_reset_terminal_sessions()`; chamada em ambos os caminhos | **Alto** — tocado em releases de provider | Sim |
| **UI Providers** | `dashboard/frontend/src/pages/Providers.tsx` | beta.11 | Toggle fix; mensagens contextuais por `cli_command` | **Alto** — Providers.tsx tocado frequentemente | Sim |
| **Avatar meta** | `dashboard/frontend/src/lib/agent-meta.ts` | beta.11 | Extensão `.webp` nos paths de avatar | Médio | Sim — verificar extensão |
| **Avatar seed** | `dashboard/backend/agent_meta_seed.py` | beta.11 | Extensão `.webp` no seed | Médio | Sim — verificar extensão |
| **Dockerfile** | `Dockerfile.dashboard` | beta.10, beta.11 | Node.js + CLIs + terminal-build stage + start-dashboard CMD | **Alto** — Dockerfile tocado em todo release | Sim — verificar 5 pontos |
| **Stack** | `clever-agent.stack.yml` | beta.10, beta.13 | `:rw` volumes; `CLAUDE_CODE_EXECUTABLE`; `clever_agent_codex_auth` volume | **Alto** — stack atualizado a cada release | Sim |
| **Docs routing** | `docs/clever-agent/provider-executable-routing.md` | beta.11–14 | Snippets de código; checklists; matriz de providers | Baixo — só docs | Recomendado |
| **Patch ledger** | `docs/clever-agent/white-label-patch-ledger.md` | contínuo | Linhas por patch | Baixo — só docs | Recomendado |
| **Master inventory** | `docs/clever-agent/white-label-master-inventory.md` | contínuo | Seções por área; workflow reapply | Baixo — só docs | Recomendado |

---

## 10. Reapply checklist para futuras atualizações upstream

Executar após `git merge upstream-sync` → `clever-dev`. Verificar na ordem abaixo.

### 10.1 Provider config

```bash
# getProviderSignature exportada
grep -n "getProviderSignature" dashboard/terminal-server/src/provider-config.js
# Esperado: function definition + module.exports

# Importada no server.js e claude-bridge.js
grep -n "getProviderSignature" dashboard/terminal-server/src/server.js
grep -n "getProviderSignature" dashboard/terminal-server/src/claude-bridge.js
# Esperado: import na linha 1 de cada arquivo
```

### 10.2 Terminal sessions (server.js)

```bash
# providerSignature nos 4 pontos críticos
grep -n "providerSignature" dashboard/terminal-server/src/server.js
# Esperado:
#   - startClaude() bloco if(session.active): comparação de assinatura
#   - startClaude(): session.providerSignature = getProviderSignature(...) após active=true
#   - joinClaudeSession(): defesa de assinatura (try/catch)
#   - reset-provider: session.providerSignature = null

# generation counter
grep -n "generation" dashboard/terminal-server/src/server.js
# Esperado: counter antes de startSession(); guard em onExit/onError

# endpoint reset-provider
grep -n "reset-provider" dashboard/terminal-server/src/server.js
# Esperado: this.app.post('/api/sessions/reset-provider', ...)

# broadcast claude_stopped
grep -n "provider_changed" dashboard/terminal-server/src/server.js
# Esperado: em reset-provider E em joinClaudeSession()
```

### 10.3 PTY bridge (claude-bridge.js)

```bash
# Defesa early-return
grep -n "providerSignature" dashboard/terminal-server/src/claude-bridge.js
# Esperado: comparação em startSession() + stored no objeto de sessão + null em onExit

# Guard same-instance no onExit
grep -n "sessions.get(sessionId) === session" dashboard/terminal-server/src/claude-bridge.js
# Esperado: 1+ matches nos handlers onExit/error
```

### 10.4 Provider save (providers.py)

```bash
# Helper definido
grep -n "_reset_terminal_sessions" dashboard/backend/routes/providers.py
# Esperado: definição + 2 call-sites (1 PostgreSQL, 1 file)

# import current_app (para o logger)
grep -n "from flask import" dashboard/backend/routes/providers.py
# Esperado: current_app na lista de imports
```

### 10.5 Codex OAuth chat (chat-bridge.js)

```bash
# Método codex_auth
grep -n "_startCodexAuthChatSession" dashboard/terminal-server/src/chat-bridge.js
# Esperado: definição + chamada em startSession()

# Helpers de segurança
grep -n "findOpenClaudeCommand\|SPAWN_SYSTEM_VARS" dashboard/terminal-server/src/chat-bridge.js
# Esperado: ambos definidos antes da classe ChatBridge

# codex_auth NOT em _startOpenAICompatibleSession (seria bug)
grep -n "codex_auth" dashboard/terminal-server/src/chat-bridge.js
# Esperado: SOMENTE em startSession() routing → _startCodexAuthChatSession
```

### 10.6 Stack

```bash
# Volumes auth obrigatoriamente :rw
grep -n "credentials.json\|claude.json" clever-agent.stack.yml
# Esperado: ambos com :rw

# CLAUDE_CODE_EXECUTABLE
grep -n "CLAUDE_CODE_EXECUTABLE" clever-agent.stack.yml
# Esperado: CLAUDE_CODE_EXECUTABLE=/usr/bin/claude

# Volume Codex (adicionado em beta.13)
grep -n "clever_agent_codex_auth\|/root/.codex" clever-agent.stack.yml
# Esperado: volume mount + volumes section

# TERMINAL_SERVER_PORT
grep -n "TERMINAL_SERVER_PORT" clever-agent.stack.yml
# Esperado: TERMINAL_SERVER_PORT=32352
```

### 10.7 Dockerfile.dashboard

```bash
# Node.js + CLIs presentes
grep -n "claude-code\|openclaude" Dockerfile.dashboard
# Esperado: ambos no mesmo RUN npm install

# npm cache clean no mesmo layer
grep -A5 "openclaude" Dockerfile.dashboard | grep "npm cache clean"
# Esperado: npm cache clean --force no mesmo bloco

# Stage terminal-build
grep -n "terminal-build\|node-pty\|python3.*make.*g++" Dockerfile.dashboard
# Esperado: stage FROM + apt-get python3 make g++

# CMD start-dashboard.sh
grep -n "^CMD\|start-dashboard" Dockerfile.dashboard
# Esperado: CMD referência ao start-dashboard.sh
```

### 10.8 Providers.tsx

```bash
# Toggle fix
grep -n "isInstalled && !isActive" dashboard/frontend/src/pages/Providers.tsx
# Esperado: 1 match

# Mensagens contextuais por harness
grep -n "cli_command.*openclaude\|openclaude.*cli_command" dashboard/frontend/src/pages/Providers.tsx
# Esperado: 2 matches (card ativo + modal)
```

### 10.9 Trust prompt (claude-bridge.js)

```bash
grep -n "trust the files\|project you created\|Quick safety check" \
     dashboard/terminal-server/src/claude-bridge.js
# Esperado: 3 matches
```

---

## 11. Test plan de homologação

### 11.1 Fresh install

```
1. Deploy stack com nova imagem (sem volumes pré-existentes)
2. Acessar https://agent.cleverai.com.br → needs_setup: true
3. Setup wizard: criar conta, definir senha
4. Providers page: deve mostrar providers disponíveis (claude_installed: true)
5. Configurar Anthropic (inserir API key ou usar OAuth)
6. Ativar Anthropic → log "reset-provider stopped=0" (nenhuma sessão ainda)
```

### 11.2 Anthropic

```
1. Anthropic ativo
2. Oracle → Chat → "Quem você é?"
   Esperado: resposta do Claude, menciona "Clever Agent"
3. Oracle → Terminal
   Esperado: banner "╭───Claude Code v2.1.152" (ou versão mais nova)
   Log: signature "anthropic:claude"
4. Trocar para outro provider
   Esperado: terminal mostra inativo após broadcast claude_stopped
```

### 11.3 Codex OAuth

```
1. docker exec <container> openclaude login
   (ou UI Providers se suportado)
   Verificar: /root/.codex/auth.json existe no volume clever_agent_codex_auth
2. Ativar codex_auth no dashboard
3. Oracle → Chat → mensagem qualquer
   Esperado: resposta via OpenClaude headless
   Log: "_startCodexAuthChatSession", sem "model_not_found"
   NÃO esperado: logs com tokens/auth.json conteúdo
4. Oracle → Terminal
   Esperado: OpenClaude TUI (banner "Claude Code v2.x" do wrapper; provider real é Codex)
   Log: signature "codex_auth:openclaude"
5. Volume persistência: reiniciar container → auth.json ainda existe → chat funciona
```

### 11.4 Switching — fluxo crítico

```
Cenário A: Codex → Anthropic
1. codex_auth ativo; terminal aberto (OpenClaude rodando)
2. Providers → ativar Anthropic
3. Esperado:
   - Flask log: "[providers] terminal sessions reset (HTTP 200)"
   - Terminal-server log: "reset-provider reason=provider_changed stopped=1"
   - Terminal UI: mostra "inactive" / "claude_stopped"
4. Abrir terminal novamente
   Esperado: Claude Code; signature "anthropic:claude"

Cenário B: Anthropic → Codex
1. anthropic ativo; terminal aberto (Claude Code rodando)
2. Providers → ativar codex_auth
3. Esperado: mesmo fluxo com harnesses trocados
4. Abrir terminal: OpenClaude; signature "codex_auth:openclaude"

Cenário C: Reset sem sessão ativa
1. Provider ativo; sem terminal aberto
2. Trocar provider
3. Esperado: "reset-provider stopped=0"; nenhum efeito no terminal

Cenário D: Falha no reset
1. terminal-server brevemente offline (simulado)
2. Trocar provider no dashboard
3. Esperado: provider salvo com sucesso; WARNING no Flask log
   "Could not reset terminal sessions: ..."
4. Terminal-server volta online → abrir terminal → joinClaudeSession() pega assinatura
   diferente e mata PTY stale (Camada 3)
```

### 11.5 Outros providers (openrouter, openai, omnirouter)

```
Pré-requisito: API key configurada para o provider
1. Ativar openrouter (ou openai/omnirouter)
2. Oracle → Chat → mensagem qualquer
   Esperado: resposta via OpenAI Chat Completions
3. Oracle → Terminal
   Esperado: OpenClaude TUI
4. Verificar: nenhuma API key vazada nos logs
```

### 11.6 Logs de segurança (checagem negativa)

```bash
# NUNCA deve aparecer nos logs:
docker logs <dashboard_container> 2>&1 | grep -i "auth.json\|OPENAI_API_KEY\|Bearer " | head -20
# Esperado: nenhum resultado com conteúdo de tokens

# REDACTION funcionando:
docker logs <dashboard_container> 2>&1 | grep "REDACTED" | head -5
# Se aparecer: confirmar que substitui tokens reais por [REDACTED]
```

---

## 12. Decisões de produto e instalação

| Decisão | Justificativa |
|---|---|
| **Claude Code e OpenClaude embarcados na imagem Docker** | VPS host não precisa de Node.js, npm ou CLIs. Deploy/update via Portainer. Sem risco de versão divergente entre host e container. |
| **Login pela UI Providers é o fluxo oficial** | Mais seguro (sem SSH); credenciais persistidas em volume nomeado gerenciado pelo Swarm. |
| **Volume `clever_agent_codex_auth` para Codex** | Persistência de `~/.codex/auth.json` entre restarts/redeploys sem exposição no stack YAML. |
| **`docker exec openclaude login` é plano B** | Aceito para troubleshooting ou primeiro setup antes da UI suportar login Codex. Não é o fluxo preferido. |
| **Falha no reset-provider não bloqueia save do provider** | UX: usuário não fica preso se terminal-server tiver problema. A Camada 3 (joinClaudeSession) protege contra o stale PTY residual. |
| **Sem `latest` tags no GHCR** | Rastreabilidade: toda imagem tem versão explícita. Rollback = alterar tag no stack, não `docker pull`. |
| **SPAWN_SYSTEM_VARS whitelist em vez de `process.env`** | Previne vazamento de `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` e outros segredos do ambiente do processo Node para o processo filho openclaude. |
| **auth.json validado por existência apenas** | Nunca ler/logar conteúdo do arquivo OAuth. `fs.existsSync()` é suficiente para o check de pré-condição. |

---

## 13. Pendências e melhorias futuras

| Item | Prioridade | Contexto |
|---|---|---|
| **Badge de harness na UI** | Alta | Mostrar provider ativo + harness (Claude Code / OpenClaude) + model/profile em tempo real no terminal/chat. Útil para debugging e transparência para o usuário. |
| **Login Codex OAuth pela UI** | Alta | Hoje requer `docker exec openclaude login`. Implementar flow OAuth na UI Providers eliminaria o plano B de SSH. |
| **Mensagem OpenClaude não identifica LLM exato** | Média | Banner "Claude Code v2.x" no terminal quando OpenClaude é usado pode confundir usuários — é o TUI do wrapper, não o provider real. Melhorar com override de banner ou badge explícita. |
| **Testar OpenRouter/OpenAI/OMNIROUTER** | Média | Falta validação end-to-end com credenciais reais desses providers. Apenas Anthropic e Codex foram validados na VPS. |
| **Provider switching com múltiplas sessões simultâneas** | Média | Validar comportamento quando múltiplos agentes têm terminais abertos e o provider é trocado. `reset-provider` itera todas as sessões, mas o comportamento concorrente precisa de teste. |
| **Migrar docs CRM em contexto agent-facing** | Baixa | Se ainda houver referências "Evo CRM" em contextos agent-facing após upstream merges, o reapply deste patch precisa ser executado. |
| **Upstream v0.34+ merge** | Planejado | Quando upstream liberar próxima versão, seguir workflow §5 do `white-label-master-inventory.md`. Os patches listados neste documento são os de mais alto risco de conflito. |
