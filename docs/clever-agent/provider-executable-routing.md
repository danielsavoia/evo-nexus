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

## Reapply checklist

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
