# Provider Executable Routing

**Patch commit:** (ver patch ledger)
**Branch:** `clever-dev`
**Reapply risk:** High — provider/terminal/chat files tocados em quase toda release

---

## Sintoma

OpenAI Codex OAuth ativo, mas:
1. **Terminal** — aparecia "Claude Code v2.1.152" em vez de "OpenClaude" (openclaude wraps claude-code para TUI; comportamento esperado, mas routing deve usar `/usr/bin/openclaude`).
2. **Chat** — erro "sem API key configurada" ao usar `codex_auth`, que usa OAuth em vez de API key.
3. **UI Providers** — mensagem "Run /logout in Claude Code..." aparecia para providers OpenClaude, texto incorreto.

---

## Causa raiz

| Componente | Causa |
|---|---|
| `chat-bridge.js` | `_startOpenAICompatibleSession` exigia `OPENAI_API_KEY` ou `CODEX_API_KEY`; `codex_auth` usa OAuth (`~/.codex/auth.json`) sem API key → lançava erro |
| `Providers.tsx` (2 lugares) | Mensagem de logout hardcoded "Claude Code" para todos os providers com `requires_logout=true`; deveria ser contextual por `cli_command` |
| `claude-bridge.js` | **JÁ CORRETO** — lê `cli_command` do `providers.json` e usa `findClaudeCommand()` → `/usr/bin/openclaude` para não-Anthropic |

---

## Matriz de provider → executable

| Provider ID | `cli_command` | Terminal executable | Chat harness | Observação |
|---|---|---|---|---|
| `anthropic` | `claude` | `/usr/bin/claude` | Claude Agent SDK (`sdkQuery`) | Provider nativo, sem requires_logout |
| `openrouter` | `openclaude` | `/usr/bin/openclaude` | OpenAI Chat Completions + `OPENAI_API_KEY` | Requires logout de auth Anthropic anterior |
| `omnirouter` | `openclaude` | `/usr/bin/openclaude` | OpenAI Chat Completions + `OPENAI_API_KEY` | URL customizado |
| `openai` | `openclaude` | `/usr/bin/openclaude` | OpenAI Chat Completions + `OPENAI_API_KEY` | gpt-4.x |
| `codex_auth` | `openclaude` | `/usr/bin/openclaude` | `openclaude -p "<prompt>"` (headless) | OAuth via `~/.codex/auth.json`; openclaude roteia internamente para Codex backend; `codexplan` não é modelo válido na API pública OpenAI |
| `gemini` | `openclaude` | `/usr/bin/openclaude` | (em breve) | |
| `bedrock` | `openclaude` | `/usr/bin/openclaude` | (em breve) | |
| `vertex` | `openclaude` | `/usr/bin/openclaude` | (em breve) | |

---

## Arquivos alterados

| Arquivo | Patch | Motivo |
|---|---|---|
| `dashboard/terminal-server/src/chat-bridge.js` | `findOpenClaudeCommand()` helper + `SPAWN_SYSTEM_VARS` whitelist; `_startCodexAuthChatSession()`: valida `~/.codex/auth.json` (sem logar conteúdo), spawna `openclaude -p "<prompt>"` em modo headless, streams stdout como `text_delta`, redacta tokens em stderr, timeout 120s, suporte a abort signal; `startSession()` roteia `codex_auth` para `_startCodexAuthChatSession` antes de `_startOpenAICompatibleSession`; `_startOpenAICompatibleSession` simplificado (bloco codex_auth OAuth removido) | `codexplan` alias inválido na API pública OpenAI (`/v1/chat/completions` → 404); openclaude roteia internamente para Codex backend via `openclaude -p` |
| `dashboard/frontend/src/pages/Providers.tsx` | 2 mensagens de logout: condicionais por `prov.cli_command === 'openclaude'` | Texto "Claude Code" incorreto para providers OpenClaude |

---

## Detalhes da correção — chat-bridge.js (codex_auth via openclaude -p)

**Arquivo:** `dashboard/terminal-server/src/chat-bridge.js`

**Causa raiz:** `codexplan` é um alias interno do `openclaude` que roteia para `chatgpt.com/backend-api/codex`. Não é um modelo válido na API pública da OpenAI (`/v1/chat/completions` → HTTP 404 `model_not_found`). A abordagem de leitura de `auth.json` + chamada à API pública não funciona.

**Solução:** `codex_auth` usa `openclaude -p "<prompt>"` (modo headless não-interativo) — o mesmo mecanismo que o terminal usa internamente para processar prompts.

**Novas adições:**

```javascript
// Antes da classe ChatBridge:

function findOpenClaudeCommand() {
  try {
    const resolved = execFileSync('which', ['openclaude'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (resolved) return resolved;
  } catch { /* fall through */ }
  const candidates = [
    '/usr/bin/openclaude',
    '/usr/local/bin/openclaude',
    path.join(os.homedir(), '.local', 'bin', 'openclaude'),
  ];
  for (const p of candidates) {
    try { if (fs.existsSync(p)) return p; } catch { /* skip */ }
  }
  console.warn('[chat-bridge] openclaude not found at known paths, using bare command name');
  return 'openclaude';
}

const SPAWN_SYSTEM_VARS = [
  'HOME', 'USER', 'SHELL', 'PATH', 'LANG', 'LC_ALL', 'LC_CTYPE',
  'LOGNAME', 'HOSTNAME', 'XDG_RUNTIME_DIR', 'XDG_DATA_HOME',
  'XDG_CONFIG_HOME', 'XDG_CACHE_HOME', 'TMPDIR',
  'SSH_AUTH_SOCK', 'SSH_AGENT_PID',
  'NVM_DIR', 'NVM_BIN', 'NVM_INC',
  'CODEX_HOME', 'CLAUDE_CONFIG_DIR',
];
```

**Método `_startCodexAuthChatSession` (novo):**

```javascript
async _startCodexAuthChatSession(sessionId, options, providerConfig) {
  // 1. Validate auth.json exists (NEVER read/log contents — security rule)
  const codexAuthPath = path.join(os.homedir(), '.codex', 'auth.json');
  if (!fs.existsSync(codexAuthPath)) {
    throw new Error('Provider "codex_auth" requer autenticação OAuth. ...');
  }

  // 2. Build prompt: systemCtx + "\n\n---\n\n" + userContent
  // 3. Spawn: nodeSpawn(openclaude, ['-p', fullPrompt], { cwd, env: spawnEnv, stdio: ['ignore','pipe','pipe'] })
  //    spawnEnv = clean whitelist (SPAWN_SYSTEM_VARS only) + providerEnv
  //    + CLAUDE_CODE_USE_OPENAI='1' + OPENAI_MODEL='codexplan' + TERM='dumb'
  //    NEVER spreads process.env (avoids leaking OPENAI_API_KEY)
  
  // 4. Stream stdout as text_delta events
  // 5. Redact tokens in stderr: raw.replace(/[A-Za-z0-9+/=_\-]{40,}/g, '[REDACTED]')
  // 6. 120s timeout, abort signal support
  // 7. exit code != 0 → friendly error message
}
```

**Routing em `startSession()`:**

```javascript
const providerConfig = loadProviderConfig();
if (providerConfig.active !== 'anthropic') {
  if (providerConfig.active === 'codex_auth') {
    return this._startCodexAuthChatSession(sessionId, options, providerConfig);
  }
  return this._startOpenAICompatibleSession(sessionId, options, providerConfig);
}
```

**Regras de segurança aplicadas:**
- `auth.json` validado pela existência, nunca lido/logado
- `spawnEnv` usa whitelist (`SPAWN_SYSTEM_VARS`) em vez de `process.env` (evita vazar `OPENAI_API_KEY`)
- Tokens redactados em stderr (`[REDACTED]`)
- `TERM=dumb` previne códigos ANSI no output

---

## Detalhes da correção — Providers.tsx

**Arquivo:** `dashboard/frontend/src/pages/Providers.tsx`

**Patches:**

### Mensagem 1 — card do provider ativo

```tsx
{/* Logout warning — contextual per harness */}
{prov.requires_logout && isActive && (
  <div className="mx-5 mb-3 px-3 py-1.5 rounded bg-[#1a1500] text-[10px] text-[#FBBF24]">
    {prov.cli_command === 'openclaude'
      ? 'Run /logout in the OpenClaude terminal if you were previously authenticated with another provider'
      : 'Run /logout in Claude Code if you were previously logged into Anthropic'}
  </div>
)}
```

### Mensagem 2 — modal de configuração

```tsx
{prov.requires_logout && (
  <div className="rounded-lg bg-[#1a1500] border border-[#3a2a00] p-3">
    <p className="text-xs text-[#FBBF24]">
      {prov.cli_command === 'openclaude'
        ? <>After activating, run <code className="font-bold">/logout</code> in the OpenClaude terminal if previously authenticated with another provider.</>
        : <>After activating, run <code className="font-bold">/logout</code> in Claude Code if previously logged into Anthropic.</>}
    </p>
  </div>
)}
```

---

## Como o terminal routing funciona (claude-bridge.js)

```javascript
// 1. Lê providers.json frescos a cada session start
const providerConfig = this._loadProviderConfig();
const providerMode = getProviderMode(providerConfig);  // 'anthropic' | 'code' | 'chat'

// 2. Bloqueia se provider em modo chat (ex: openrouter com modelo gpt-4o puro)
if (providerConfig.active !== 'anthropic' && providerMode !== 'code') {
  throw new Error('Use o Chat para esse modelo...');
}

// 3. Resolve path do CLI correto
// providers.json: codex_auth.cli_command = 'openclaude'
const cliCommand = this.findClaudeCommand(providerConfig.cli_command);
// → which openclaude → /usr/bin/openclaude

// 4. Spawn com env LIMPO (não herda process.env)
// CLAUDE_CODE_EXECUTABLE não é incluído → openclaude lê seu próprio config
spawn(cliCommand, args, { env: { ...cleanEnv, ...providerEnv } });
```

**Nota sobre banner "Claude Code":** `openclaude` é um wrapper que usa `claude-code` para renderização TUI. O banner "Claude Code v2.x" que aparece no terminal é do processo interno do openclaude — não indica que Claude/Anthropic está sendo usado como provider. O modelo real vem de `OPENAI_MODEL=codexplan` injetado pelo `providerEnv`.

---

---

## Provider-aware terminal sessions (patch 2)

### Sintoma

Terminal mantinha o harness antigo após troca de provider:
- Usuário ativa `codex_auth` → Terminal abre OpenClaude.
- Usuário volta para `anthropic` → Terminal continua OpenClaude.

### Causa raiz

| Arquivo | Causa |
|---|---|
| `server.js` | `startClaude()` linha ~956: `if (session.active) { return early }` sem checar se o provider atual bate com o da sessão — reconexão de WebSocket e troca de provider eram tratados igual |
| `claude-bridge.js` | `startSession()` linha ~75: `if (existing.active) { return existing }` sem checar provider — PTY vivo com harness antigo era reutilizado |

### Correção — visão geral

1. **`provider-config.js`** — novo helper `getProviderSignature(config)` retorna `"<active>:<cli_command>"` (ex: `"codex_auth:openclaude"`, `"anthropic:claude"`).

2. **`server.js` `startClaude()`** — ao receber `start_claude` com sessão ativa, compara `session.providerSignature` com assinatura atual. Se diferente: chama `claudeBridge.stopSession()`, marca `session.active = false`, cai no caminho normal de início. Se igual: reconexão segura, reenvia `claude_started`.

3. **`server.js` callbacks** — generation counter por invocação de `startSession`. `onExit`/`onError` callbacks comparam `currentSession.generation` com geração capturada — stale exits do PTY antigo são descartados silenciosamente, evitando que `session.active = false` do PTY antigo interfira com o novo PTY.

4. **`claude-bridge.js`** — guarda defensiva na early-return de sessão ativa: compara `existing.providerSignature` com provider atual, mata PTY se diferente. Salva `providerSignature` no objeto de sessão. `onExit`/`error` handlers: `if (this.sessions.get(sessionId) === session)` antes de deletar — evita deletar o novo PTY do Map quando o antigo finalmente sai.

### Snippets críticos

#### `provider-config.js`
```javascript
function getProviderSignature(providerConfig) {
  const active = (providerConfig?.active || 'anthropic').trim();
  const cli   = (providerConfig?.cli_command || 'claude').trim();
  return `${active}:${cli}`;
}
```

#### `server.js` — bloco `if (session.active)` em `startClaude()`
```javascript
if (session.active) {
  const currentProvider = loadProviderConfig();
  const currentSig = getProviderSignature(currentProvider);
  const storedSig  = session.providerSignature;

  if (storedSig && storedSig !== currentSig) {
    console.log(`[startClaude] Provider changed for session ${sessionId}: old=${storedSig} new=${currentSig} — restarting terminal`);
    await this.claudeBridge.stopSession(wsInfo.claudeSessionId);
    session.active = false;
    session.agent  = null;
    session.providerSignature = null;
    // fall through — start fresh PTY
  } else {
    // WebSocket reconnect — same provider, reattach
    this.sendToWebSocket(wsInfo.ws, { type: 'claude_started', sessionId: wsInfo.claudeSessionId });
    return;
  }
}

const generation = (session.generation || 0) + 1;
session.generation = generation;
```

#### `server.js` — callbacks stale-safe
```javascript
onExit: (code, signal) => {
  const s = this.claudeSessions.get(sessionId);
  if (!s || s.generation !== generation) return; // stale
  s.active = false;
  this.broadcastToSession(sessionId, { type: 'exit', code, signal });
},
```

#### `claude-bridge.js` — early return defensivo
```javascript
if (existing.active) {
  const sig = getProviderSignature(this._loadProviderConfig());
  if (existing.providerSignature && existing.providerSignature !== sig) {
    existing.process.kill('SIGKILL');
    this.sessions.delete(sessionId);
    // fall through
  } else {
    return existing; // safe reconnect
  }
}
```

#### `claude-bridge.js` — guard no onExit
```javascript
if (this.sessions.get(sessionId) === session) {
  this.sessions.delete(sessionId);
}
```

### Validação

| Cenário | Comportamento esperado |
|---|---|
| `codex_auth` → terminal abre | PTY com `/usr/bin/openclaude`; log `provider signature: codex_auth:openclaude` |
| Troca para `anthropic` → terminal reabre | Log `Provider changed: old=codex_auth:openclaude new=anthropic:claude`; PTY reinicia com `/usr/bin/claude` |
| Troca de volta para `codex_auth` | Log `Provider changed: old=anthropic:claude new=codex_auth:openclaude`; PTY reinicia com openclaude |
| WebSocket reconecta sem trocar provider | Log `already active (anthropic:claude), returning existing session`; buffer replicado; sem reinício |
| PTY antigo sai após kill | Log `Ignoring stale PTY exit for session ... (gen N vs N+1)`; nenhum `exit` enviado ao cliente |

---

## Reapply checklist

### Provider-aware terminal sessions (patch 2)

- [ ] `provider-config.js`: função `getProviderSignature` exportada
- [ ] `server.js` `startClaude()`: bloco `if (session.active)` com comparação de `providerSignature`
- [ ] `server.js` `startClaude()`: `generation` counter antes de `claudeBridge.startSession()`
- [ ] `server.js` `startClaude()`: `onExit`/`onError` callbacks com `generation` guard
- [ ] `server.js` `startClaude()`: `session.providerSignature = getProviderSignature(...)` após `session.active = true`
- [ ] `claude-bridge.js` import: `getProviderSignature` importado de `provider-config`
- [ ] `claude-bridge.js` `startSession()`: early-return ativo com guarda de assinatura
- [ ] `claude-bridge.js` `startSession()`: `providerSignature` salvo no objeto da sessão
- [ ] `claude-bridge.js` `onExit`/`error`: `if (this.sessions.get(sessionId) === session)` antes de `delete`
- [ ] Validar troca codex_auth → anthropic: terminal reinicia com claude
- [ ] Validar troca anthropic → codex_auth: terminal reinicia com openclaude
- [ ] Validar reconexão sem troca: sem reinício, buffer replicado

### Codex OAuth chat via openclaude -p (patch 3)

- [ ] `chat-bridge.js` import: `{ spawn: nodeSpawn, execFileSync }` de `child_process`
- [ ] `chat-bridge.js`: função `findOpenClaudeCommand()` antes da classe `ChatBridge`
- [ ] `chat-bridge.js`: constante `SPAWN_SYSTEM_VARS` (whitelist de variáveis de ambiente)
- [ ] `chat-bridge.js`: método `_startCodexAuthChatSession()` na classe `ChatBridge`
- [ ] `chat-bridge.js` `startSession()`: branch `if (providerConfig.active === 'codex_auth')` antes de `_startOpenAICompatibleSession`
- [ ] `chat-bridge.js` `_startOpenAICompatibleSession`: bloco codex_auth OAuth removido (dead code)
- [ ] `Providers.tsx` card ativo (~linha 487): mensagem de logout condicional `prov.cli_command === 'openclaude'`
- [ ] `Providers.tsx` modal config (~linha 605): idem
- [ ] Verificar: `providers.json` — todos providers não-Anthropic têm `cli_command: "openclaude"`
- [ ] Validar Anthropic: terminal usa `/usr/bin/claude`; chat usa Claude Agent SDK
- [ ] Validar codex_auth: terminal usa `/usr/bin/openclaude`; chat usa `openclaude -p`
- [ ] Validar OpenRouter/openai: terminal usa `/usr/bin/openclaude`; chat usa API key via Chat Completions
- [ ] Validar UI: mensagens corretas por harness

---

## Provider change terminal reset (patch 4)

### Sintoma confirmado na VPS

- Chat mudava corretamente para o provider novo.
- Terminal mantinha PTY antigo/harness antigo após troca de provider.
- Codex OAuth ativo → troca para Anthropic → Chat usa Claude SDK, Terminal continua preso no OpenClaude.

### Causa raiz — três gaps

| Gap | Arquivo | Causa |
|---|---|---|
| GAP 1 | `dashboard/backend/routes/providers.py` | `set_active_provider()` grava `active_provider` e retorna 200 — nunca notifica o terminal-server |
| GAP 2 | `dashboard/terminal-server/src/server.js` | `joinClaudeSession()` reconecta a sessão existente sem checar `providerSignature` — só `startClaude()` fazia essa verificação |
| GAP 3 | `dashboard/terminal-server/src/server.js` | Não havia endpoint externo para forçar reset de sessões PTY |

### Correção — visão geral

1. **`server.js` `setupExpress()`** — novo endpoint `POST /api/sessions/reset-provider`:
   - Itera todas as sessões ativas em `this.claudeSessions`
   - Por sessão: incrementa generation, chama `claudeBridge.stopSession()`, marca `active=false`, limpa `providerSignature`, broadcast `claude_stopped`
   - Retorna `{ status: "ok", stopped: N, reason }`

2. **`providers.py` `set_active_provider()`** — chama `_reset_terminal_sessions(provider_id)` após salvar com sucesso (ambos os caminhos: file e PostgreSQL)
   - Helper `_reset_terminal_sessions`: `urllib.request` POST para `http://127.0.0.1:{TERMINAL_SERVER_PORT}/api/sessions/reset-provider`
   - Falha silenciosa (except + logger.warning) — nunca bloqueia o provider save

3. **`server.js` `joinClaudeSession()`** — defesa adicional (GAP 2):
   - Se sessão ativa com `providerSignature` diferente da atual: mata PTY, limpa estado, broadcast `claude_stopped` antes de rejoin
   - Guard `try/except` — não-fatal

### Snippets críticos

#### `providers.py` — helper
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

#### `providers.py` — chamada em `set_active_provider()`
```python
config["active_provider"] = provider_id
_write_config(config)
_reset_terminal_sessions(provider_id)   # <-- new
return jsonify({"status": "ok", "active_provider": provider_id})
```

#### `server.js` — endpoint
```javascript
this.app.post('/api/sessions/reset-provider', async (req, res) => {
  const { reason = 'provider_changed', provider_id = null } = req.body || {};
  let stopped = 0;
  for (const [sessionId, session] of this.claudeSessions.entries()) {
    if (!session.active) continue;
    session.generation = (session.generation || 0) + 1;
    try { await this.claudeBridge.stopSession(sessionId); } catch (err) { /* warn */ }
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

#### `server.js` — defesa `joinClaudeSession()`
```javascript
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
  } catch (_) { /* non-fatal */ }
}
```

### Fluxo corrigido

```
Providers UI → POST /api/providers/active
  → providers.py: salva active_provider
  → providers.py: POST /api/sessions/reset-provider (localhost)
  → terminal-server: mata PTYs ativos → broadcast claude_stopped
  → frontend: terminal mostra "inactive"
  → usuário abre terminal → start_claude → startClaude()
  → PTY novo com harness correto
```

### Validação esperada

| Cenário | Comportamento |
|---|---|
| Anthropic ativo → abrir terminal | PTY `/usr/bin/claude`; signature `anthropic:claude` |
| Codex ativo → abrir terminal | PTY `/usr/bin/openclaude`; signature `codex_auth:openclaude` |
| Codex → troca para Anthropic | Log `reset-provider ... stopped=1`; terminal mostra inativo; reabre com `/usr/bin/claude` |
| Anthropic → troca para Codex | Log `reset-provider ... stopped=1`; terminal mostra inativo; reabre com `/usr/bin/openclaude` |
| Terminal sem sessão ativa | `stopped=0`; nenhum efeito |
| Falha no reset (terminal-server offline) | Warning no Flask log; provider save OK |

### Reapply checklist (patch 4)

- [ ] `providers.py`: import `current_app` do Flask
- [ ] `providers.py`: função `_reset_terminal_sessions(provider_id)` com `urllib.request`
- [ ] `providers.py` `set_active_provider()`: chamada `_reset_terminal_sessions(provider_id)` em AMBOS os caminhos (file + postgresql)
- [ ] `server.js` `setupExpress()`: rota `POST /api/sessions/reset-provider`
- [ ] `server.js` `joinClaudeSession()`: defesa de providerSignature com `try/except`
- [ ] Falha no reset não bloqueia provider save
- [ ] Logs sem tokens/secrets
- [ ] Validar Codex → Anthropic: terminal reinicia com Claude Code
- [ ] Validar Anthropic → Codex: terminal reinicia com OpenClaude
- [ ] Validar logs `reset-provider stopped=N`
