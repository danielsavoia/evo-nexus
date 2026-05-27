# Clever Agent — Claude Auth em Container: Credenciais, Config e Trust Prompt

**Data:** 2026-05-27
**Branch:** `clever-dev`
**Patch:** beta.10 (operacional — stack + code fix, sem rebuild de imagem nova)
**Validado na VPS:** 2026-05-27

---

## 1. Sintomas

| Sintoma | Causa raiz |
|---|---|
| TUI do Claude Code em branco / trava silenciosamente antes de renderizar | `.credentials.json` ou `.claude.json` montado `:ro` — Claude Code 2.1.152 precisa escrever em ambos |
| Chat do agente não responde (retorna 0 mensagens) | SDK usa binário bundlado `v2.1.119` que falha silenciosamente dentro do container |
| Terminal do agente abre mas chat nunca retorna resposta | Ambas as causas acima combinadas |
| TUI renderiza mas trust prompt não é aceito automaticamente | `claude-bridge.js` só detectava texto antigo do prompt |

---

## 2. Causas raiz confirmadas na VPS

### 2.1 `.credentials.json` montado `:ro`

O Claude Code reescreve `/root/.claude/.credentials.json` no startup para fazer refresh do token OAuth.

- No host: `/home/claude/.claude/.credentials.json`
- No container: `/root/.claude/.credentials.json`
- Com `:ro`: escrita falha silenciosamente → TUI trava antes de renderizar → chat-bridge retorna 0 mensagens

**Sintoma:** container sobe normalmente, terminal-server responde, mas chat nunca funciona.

### 2.2 `.claude.json` montado `:ro` (validado na VPS 2026-05-27)

O Claude Code 2.1.152 escreve **session state, decisões de trust e timestamps** em `/root/.claude.json` durante a sessão.

Com `.claude.json:ro`:
- A TUI renderiza **em branco** (sem o banner `╭───Claude Code v2.1.152`)
- A sessão parece congelada
- Não há mensagem de erro visível

Com `.claude.json:rw`:
- A TUI renderiza corretamente: `╭───Claude Code v2.1.152 ───╮`
- O terminal do agente funciona

**Esta foi a causa final confirmada na VPS.** A correção de `.credentials.json:rw` sozinha não era suficiente para o terminal TUI.

### 2.3 Binário bundlado do SDK (`v2.1.119`) falha silenciosamente

O `@anthropic-ai/agent-sdk` contém um binário bundlado em:
```
node_modules/@anthropic-ai/claude-agent-sdk-linux-x64/claude  (v2.1.119)
```

Quando `CLAUDE_CODE_EXECUTABLE` não está definido, `resolveClaudeExecutable()` escolhe esse binário.
Dentro do container ele falha silenciosamente — sem erro no log, mas o chat-bridge retorna 0 mensagens.

O binário do sistema `/usr/bin/claude` (`v2.1.152+`, instalado via `npm install -g @anthropic-ai/claude-code`) é a versão validada.

### 2.4 Trust prompt — texto diferente no Claude 2.1.152

O `claude-bridge.js` fazia auto-accept do trust prompt via detecção de string.

**Claude 2.1.119 (antigo):**
```
Do you trust the files in this folder?
```

**Claude 2.1.152 (novo):**
```
Quick safety check
Is this a project you created or one you trust?
```

Com apenas a detecção antiga, o trust prompt do Claude 2.1.152 não era auto-aceito.

---

## 3. Correções aplicadas

### 3.1 `clever-agent.stack.yml` — serviço `dashboard`

**Volume `.credentials.json`: `:rw` (REQUIRED)**

```yaml
- /home/claude/.claude/.credentials.json:/root/.claude/.credentials.json:rw
```

Motivo: Claude Code reescreve o arquivo no startup para OAuth token refresh.

**Volume `.claude.json`: `:rw` (REQUIRED — validado na VPS 2026-05-27)**

```yaml
# ANTES (incorreto — TUI renderizava em branco):
- /home/claude/.claude.json:/root/.claude.json:ro

# DEPOIS (correto):
- /home/claude/.claude.json:/root/.claude.json:rw
```

Motivo: Claude Code 2.1.152+ escreve session state, trust decisions e timestamps neste arquivo.
Com `:ro` a TUI renderiza em branco e a sessão fica congelada.

**Env `CLAUDE_CODE_EXECUTABLE`:**

```yaml
environment:
  - CLAUDE_CODE_EXECUTABLE=/usr/bin/claude
```

Motivo: Aponta `resolveClaudeExecutable()` para o binário do sistema (`v2.1.152+`) em vez do bundlado (`v2.1.119`).

### 3.2 `dashboard/terminal-server/src/claude-bridge.js` — trust prompt

Expansão da detecção para suportar texto antigo e novo:

```js
// ANTES — só suportava Claude 2.1.119:
if (!trustPromptHandled && dataBuffer.includes('Do you trust the files in this folder?')) {

// DEPOIS — suporta 2.1.119 e 2.1.152+:
const isTrustPrompt =
  dataBuffer.includes('Do you trust the files in this folder?') ||
  dataBuffer.includes('Is this a project you created or one you trust?') ||
  dataBuffer.includes('Quick safety check');

if (!trustPromptHandled && isTrustPrompt) {
```

O comportamento de auto-accept (enviar `\r` após 500 ms) não foi alterado.
Ambos os prompts default-highlightam a opção 1 (trust/yes), então `Enter` confirma sem trocar a seleção.

### 3.3 Serviço `runtime` — sem mounts de auth (mantido)

O `runtime` executa apenas `scheduler.py` (Python). Não invoca o Claude CLI e não precisa de refresh de token.

> Se uma versão futura do runtime adicionar invocação do Claude CLI, adicionar os mesmos bind mounts do dashboard.

---

## 4. Regra operacional consolidada

### Serviço `dashboard`

```yaml
volumes:
  - /home/claude/.claude/.credentials.json:/root/.claude/.credentials.json:rw  # MUST be rw
  - /home/claude/.claude.json:/root/.claude.json:rw                             # MUST be rw

environment:
  - CLAUDE_CODE_EXECUTABLE=/usr/bin/claude
```

### Por que o container usa `/root/.claude/` e não `/home/claude/.claude/`?

O container roda como `root`. O `HOME` do processo root é `/root/`.
O Claude Code sempre usa `$HOME/.claude/` para armazenar credenciais e config.

- Host: `/home/claude/.claude/.credentials.json` e `/home/claude/.claude.json`
- Container: `/root/.claude/.credentials.json` e `/root/.claude.json`

---

## 5. Notas de segurança

| Regra | Motivo |
|---|---|
| NÃO montar `/home/claude/` inteiro | Exposição desnecessária de arquivos do host |
| NÃO montar `/home/claude/.claude/` como diretório | Expõe outros arquivos além das credenciais |
| NÃO commitar `.credentials.json` no repositório | Contém tokens OAuth reais |
| NÃO commitar `.claude.json` no repositório | Pode conter decisões de trust e state |
| NÃO incluir conteúdo de `.credentials.json` ou `.claude.json` em documentação | Idem |
| NÃO logar o conteúdo desses arquivos em CI/CD | Idem |
| `:rw` em ambos é necessário | Claude Code 2.1.152 escreve em ambos; `:ro` em qualquer um causa falha silenciosa |

### O que cada arquivo contém

- **`.credentials.json`** — OAuth tokens da conta Claude (access token + refresh token). Não é a `ANTHROPIC_API_KEY`.
- **`.claude.json`** — Config global (model defaults, feature flags) + session state + trust decisions (escrito pelo Claude Code 2.1.152+).

A `ANTHROPIC_API_KEY` é configurada via dashboard UI após o primeiro deploy, não via bind mount.

---

## 6. Validação pós-deploy na VPS

```bash
# 1. Verificar binário correto
docker exec <dashboard_container> sh -c 'echo $CLAUDE_CODE_EXECUTABLE && $CLAUDE_CODE_EXECUTABLE --version'
# Esperado: /usr/bin/claude + versão 2.1.152+

# 2. Status do Claude Code
docker exec <dashboard_container> /usr/bin/claude status
# Esperado: conta autenticada, sem erro de permissão

# 3. Verificar que os arquivos estão montados como rw
docker exec <dashboard_container> sh -c 'ls -la /root/.claude/.credentials.json && ls -la /root/.claude.json'
# Esperado: ambos existem

# 4. Chat funcional via UI
# Agents → Oracle → Chat → enviar mensagem
# Esperado: resposta recebida (não fica em loading infinito)

# 5. Terminal TUI funcional via UI
# Agents → Oracle → Terminal
# Esperado: banner "╭───Claude Code v2.1.152" renderiza corretamente
```

---

## 7. Pré-requisitos no nó manager do Swarm

```bash
ls -la /home/claude/.claude/.credentials.json
# Esperado: arquivo existe e não está vazio

ls -la /home/claude/.claude.json
# Esperado: arquivo existe
```

Se `.credentials.json` não existir, autenticar no host:
```bash
sudo -u claude claude
# Realizar login OAuth na interface que aparecer
```

---

## 8. Reapply checklist

Após qualquer atualização do stack, Dockerfile, ou Claude SDK:

- [ ] `clever-agent.stack.yml` → `dashboard.volumes`: `.credentials.json` é `:rw`
- [ ] `clever-agent.stack.yml` → `dashboard.volumes`: `.claude.json` é `:rw` (não `:ro`)
- [ ] `clever-agent.stack.yml` → `dashboard.environment`: `CLAUDE_CODE_EXECUTABLE=/usr/bin/claude`
- [ ] `clever-agent.stack.yml` → `runtime`: **sem** bind mounts de auth (scheduler.py não usa Claude CLI)
- [ ] `claude-bridge.js` → trust prompt detecta os três padrões: `Do you trust`, `Is this a project`, `Quick safety check`
- [ ] Se `Dockerfile.dashboard` atualizar o `claude` CLI, verificar que `/usr/bin/claude` ainda é o path correto
- [ ] Após redeploy: `docker exec <dashboard_container> /usr/bin/claude status`
- [ ] Após redeploy: Oracle Terminal renderiza `╭───Claude Code v2.1.152`
- [ ] NÃO montar home inteiro; NÃO expor tokens em docs ou logs
