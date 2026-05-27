# Clever Agent — Claude Auth em Container: Credenciais e Executável

**Data:** 2026-05-27
**Branch:** `clever-dev`
**Patch:** beta.10 (operacional — stack/doc only, sem rebuild de imagem)

---

## 1. Sintomas

| Sintoma | Causa raiz |
|---|---|
| TUI do Claude Code trava silenciosamente antes de renderizar | `.credentials.json` montado `:ro` — Claude Code tenta reescrever o arquivo no startup para refresh de token OAuth e falha silenciosamente |
| Chat do agente não responde (retorna 0 mensagens) | SDK usa binário bundlado `v2.1.119` que falha silenciosamente dentro do container |
| Terminal do agente abre mas chat nunca retorna resposta | Ambas as causas acima combinadas |

---

## 2. Causa raiz

### 2.1 `.credentials.json` montado `:ro`

O Claude Code reescreve `/root/.claude/.credentials.json` no startup para fazer refresh do token OAuth.

- No host: arquivo em `/home/claude/.claude/.credentials.json`
- No container: montado em `/root/.claude/.credentials.json`
- Com `:ro`: a tentativa de escrita falha silenciosamente → TUI trava antes de renderizar → SDK chat-bridge recebe 0 mensagens

**Comportamento:** sem mensagem de erro visível. O container sobe normalmente, o terminal-server responde, mas o chat nunca funciona.

### 2.2 Binário bundlado do SDK (`v2.1.119`) falha silenciosamente

O `@anthropic-ai/agent-sdk` contém um binário bundlado em:
```
node_modules/@anthropic-ai/claude-agent-sdk-linux-x64/claude
```
Versão: `v2.1.119`

Quando `CLAUDE_CODE_EXECUTABLE` não está definido, `resolveClaudeExecutable()` escolhe esse binário bundlado.

Dentro do container, este binário falha silenciosamente — não há erro no log, mas o chat-bridge retorna 0 mensagens.

O binário do sistema `/usr/bin/claude` (instalado via `npm install -g @anthropic-ai/claude-code`) é a versão validada: `v2.1.152+`.

---

## 3. Correções aplicadas

### 3.1 `clever-agent.stack.yml` — serviço `dashboard`

**Volume `.credentials.json`: `:ro` → `:rw`**

```yaml
# ANTES (stack manual na VPS):
- /home/claude/.claude/.credentials.json:/root/.claude/.credentials.json:ro

# DEPOIS:
- /home/claude/.claude/.credentials.json:/root/.claude/.credentials.json:rw
```

**Motivo:** Claude Code precisa de escrita para refresh de token OAuth. `:ro` bloqueia silenciosamente.

**Volume `.claude.json`: permanece `:ro`**

```yaml
- /home/claude/.claude.json:/root/.claude.json:ro
```

**Motivo:** Arquivo de configuração global (model defaults, feature flags). Não é token store. Leitura suficiente.

**Env `CLAUDE_CODE_EXECUTABLE`:**

```yaml
environment:
  - CLAUDE_CODE_EXECUTABLE=/usr/bin/claude
```

**Motivo:** Aponta `resolveClaudeExecutable()` para o binário do sistema (`v2.1.152+`) em vez do bundlado (`v2.1.119`).

### 3.2 Serviço `runtime` — sem mounts de auth

O serviço `runtime` executa apenas `scheduler.py` (Python). **Não invoca o Claude CLI** e não precisa de refresh de token OAuth.

Portanto:
- **Sem** `.credentials.json` bind mount no runtime
- **Sem** `CLAUDE_CODE_EXECUTABLE` no runtime

> Se uma versão futura do runtime adicionar invocação do Claude CLI, adicionar os mesmos bind mounts do serviço `dashboard`.

---

## 4. Por que o container usa `/root/.claude/` e não `/home/claude/.claude/`?

O container roda como `root` (padrão Docker sem `USER` declarado).
O `HOME` do processo root é `/root/`.
O Claude Code sempre usa `$HOME/.claude/` para armazenar credenciais.

Portanto:
- Host: `/home/claude/.claude/.credentials.json`
- Container: `/root/.claude/.credentials.json`

O bind mount mapeia o arquivo do host para o path correto dentro do container.

---

## 5. Notas de segurança

| Regra | Motivo |
|---|---|
| NÃO montar `/home/claude/` inteiro | Exposição desnecessária de arquivos do host |
| NÃO montar `/home/claude/.claude/` como diretório | Expõe outros arquivos além das credenciais |
| NÃO commitar `.credentials.json` no repositório | Contém tokens OAuth reais |
| NÃO incluir conteúdo de `.credentials.json` em documentação | Idem |
| NÃO logar o conteúdo do arquivo em CI/CD | Idem |
| `.credentials.json` `:rw` é necessário | Claude Code só opera com token válido; sem refresh = falha silenciosa |

### O que `.credentials.json` contém

OAuth tokens da conta Claude (access token + refresh token). **Não é a ANTHROPIC_API_KEY.**

A `ANTHROPIC_API_KEY` é configurada via dashboard UI após o primeiro deploy, não via bind mount.

---

## 6. Validação pós-deploy na VPS

```bash
# 1. Verificar que o arquivo está montado como rw no container
docker exec <dashboard_container> ls -la /root/.claude/.credentials.json
# Esperado: arquivo existe (não importa permissões exatas — o que importa é que não está ro)

# 2. Verificar que o Claude binary correto está sendo usado
docker exec <dashboard_container> sh -c 'echo $CLAUDE_CODE_EXECUTABLE && $CLAUDE_CODE_EXECUTABLE --version'
# Esperado: /usr/bin/claude, depois a versão (v2.1.152+)

# 3. Status do Claude Code
docker exec <dashboard_container> /usr/bin/claude status
# Esperado: conta autenticada, sem erro de permissão

# 4. Chat funcional via UI
# Agents → Oracle (ou qualquer agente) → Chat
# Esperado: mensagem enviada → resposta recebida (não fica em loading infinito)

# 5. Terminal funcional via UI
# Agents → Oracle → Terminal
# Esperado: terminal abre e responde comandos
```

---

## 7. Pré-requisitos no nó manager do Swarm

Antes do deploy, verificar que os arquivos existem no host:

```bash
ls -la /home/claude/.claude/.credentials.json
# Esperado: arquivo existe e não está vazio

ls -la /home/claude/.claude.json
# Esperado: arquivo existe
```

Se `.credentials.json` não existir, é preciso autenticar o Claude Code no host primeiro:
```bash
sudo -u claude claude
# Realizar login OAuth na interface que aparecer
```

---

## 8. Reapply checklist

Após qualquer atualização do stack, Dockerfile, ou Claude SDK:

- [ ] `clever-agent.stack.yml` → `dashboard.volumes`: `.credentials.json` é `:rw` (não `:ro`)
- [ ] `clever-agent.stack.yml` → `dashboard.volumes`: `.claude.json` é `:ro`
- [ ] `clever-agent.stack.yml` → `dashboard.environment`: `CLAUDE_CODE_EXECUTABLE=/usr/bin/claude` presente
- [ ] `clever-agent.stack.yml` → `runtime`: **sem** `.credentials.json` bind mount
- [ ] Se `Dockerfile.dashboard` atualizar a instalação do `claude` CLI, verificar que `/usr/bin/claude` ainda é o path correto
- [ ] Após redeploy: validar com `docker exec <dashboard_container> /usr/bin/claude status`
