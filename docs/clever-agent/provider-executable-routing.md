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
| `codex_auth` | `openclaude` | `/usr/bin/openclaude` | OpenAI Chat Completions + OAuth token de `~/.codex/auth.json` | OAuth sem API key; terminal spawna openclaude diretamente |
| `gemini` | `openclaude` | `/usr/bin/openclaude` | (em breve) | |
| `bedrock` | `openclaude` | `/usr/bin/openclaude` | (em breve) | |
| `vertex` | `openclaude` | `/usr/bin/openclaude` | (em breve) | |

---

## Arquivos alterados

| Arquivo | Patch | Motivo |
|---|---|---|
| `dashboard/terminal-server/src/chat-bridge.js` | `_startOpenAICompatibleSession`: lê OAuth token de `~/.codex/auth.json` quando `active === 'codex_auth'` e sem API key; mensagem de erro clara se auth.json ausente | `codex_auth` não tem API key — usa OAuth |
| `dashboard/frontend/src/pages/Providers.tsx` | 2 mensagens de logout: condicionais por `prov.cli_command === 'openclaude'` | Texto "Claude Code" incorreto para providers OpenClaude |

---

## Detalhes da correção — chat-bridge.js

**Arquivo:** `dashboard/terminal-server/src/chat-bridge.js`

**Função:** `_startOpenAICompatibleSession`

**Patch:**
```javascript
let apiKey = env.OPENAI_API_KEY || env.CODEX_API_KEY || '';

// Codex OAuth: read access_token from ~/.codex/auth.json when no API key is present.
if (!apiKey && providerConfig.active === 'codex_auth') {
  try {
    const codexAuthPath = path.join(os.homedir(), '.codex', 'auth.json');
    const codexAuth = JSON.parse(fs.readFileSync(codexAuthPath, 'utf8'));
    apiKey = codexAuth?.tokens?.access_token
      || codexAuth?.['openai-codex']?.access
      || '';
    if (apiKey) {
      console.log('[chat-bridge] codex_auth: using OAuth access token from ~/.codex/auth.json');
    }
  } catch { /* auth.json absent — will error below */ }
}

if (!apiKey) {
  const hint = providerConfig.active === 'codex_auth'
    ? `Provider "codex_auth" requer autenticação OAuth. Vá em Providers e clique em Login para autenticar.`
    : `Provider "${providerConfig.active}" sem API key configurada para Chat Completion.`;
  throw new Error(hint);
}
```

**Nota:** Para `codex_auth`, o modelo `codexplan`/`codexspark` é roteado pelo `openclaude` no terminal. No chat, esses aliases podem não ser reconhecidos pelo endpoint `/chat/completions` da OpenAI diretamente — nesse caso, o erro virá da API OpenAI (HTTP 404 de model). O terminal `openclaude` lida com o mapeamento internamente.

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

- [ ] `provider-config.js`: função `getProviderSignature` exportada
- [ ] `server.js` `startClaude()`: bloco `if (session.active)` com comparação de `providerSignature`
- [ ] `server.js` `startClaude()`: `generation` counter antes de `claudeBridge.startSession()`
- [ ] `server.js` `startClaude()`: `onExit`/`onError` callbacks com `generation` guard
- [ ] `server.js` `startClaude()`: `session.providerSignature = getProviderSignature(...)` após `session.active = true`
- [ ] `claude-bridge.js` import: `getProviderSignature` importado de `provider-config`
- [ ] `claude-bridge.js` `startSession()`: early-return ativo com guarda de assinatura
- [ ] `claude-bridge.js` `startSession()`: `providerSignature` salvo no objeto da sessão
- [ ] `claude-bridge.js` `onExit`/`error`: `if (this.sessions.get(sessionId) === session)` antes de `delete`
- [ ] `chat-bridge.js` linha ~297: `let apiKey = env.OPENAI_API_KEY || env.CODEX_API_KEY || '';`
- [ ] `chat-bridge.js` logo após: bloco `if (!apiKey && providerConfig.active === 'codex_auth')` com leitura de `~/.codex/auth.json`
- [ ] `chat-bridge.js` erro hint: mensagem específica para `codex_auth` vs outros providers
- [ ] `Providers.tsx` card ativo (~linha 487): mensagem de logout condicional `prov.cli_command === 'openclaude'`
- [ ] `Providers.tsx` modal config (~linha 605): idem
- [ ] Verificar: `providers.json` — todos providers não-Anthropic têm `cli_command: "openclaude"`
- [ ] Validar Anthropic: terminal usa `/usr/bin/claude`; chat usa Claude Agent SDK
- [ ] Validar codex_auth: terminal usa `/usr/bin/openclaude`; chat lê OAuth token
- [ ] Validar OpenRouter/openai: terminal usa `/usr/bin/openclaude`; chat usa API key
- [ ] Validar UI: mensagens corretas por harness
- [ ] Validar troca codex_auth → anthropic: terminal reinicia com claude
- [ ] Validar troca anthropic → codex_auth: terminal reinicia com openclaude
- [ ] Validar reconexão sem troca: sem reinício, buffer replicado
