# Providers CLI Dashboard Image Fix (beta.8)

**Branch:** `clever-dev`  
**Data:** 2026-05-26  
**Tag:** `clever-agent-v0.33.0-clever-beta.8`  
**Arquivo alterado:** `Dockerfile.dashboard`

---

## Sintoma

Após o fix do toggle (beta.7), a página Providers não ficava mais congelada, mas nenhum
provider podia ser ativado. Todos exibiam "not installed" e o toggle permanecia disabled
para providers inativos.

---

## Causa raiz

`providers.py` usa `shutil.which(cli_command)` dentro do container `dashboard` para
verificar se o CLI está instalado. O container dashboard era baseado em `python:3.12-slim`
sem Node.js — portanto `which claude` e `which openclaude` retornavam `None`.

Com `installed=false`, a UI desabilitava os toggles dos providers inativos (comportamento
correto após beta.7) e exibia "not installed" em todos os cards.

---

## Correção — Dockerfile.dashboard

Adicionada instalação de Node.js 22 via NodeSource e os dois CLIs de providers na stage
`runtime` do `Dockerfile.dashboard`:

```dockerfile
# System deps: curl/git para healthcheck + brain-repo; Node.js 22 via NodeSource para CLIs.
RUN apt-get update && apt-get install -y --no-install-recommends \
        curl ca-certificates gnupg openssl git \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Provider CLIs — providers.py chama shutil.which("claude") / shutil.which("openclaude")
# dentro deste container. Sem estes binários todos os toggles ficam disabled na UI.
RUN npm install -g \
        @anthropic-ai/claude-code \
        @gitlawb/openclaude@latest
```

### Dockerfile.swarm.dashboard

Já possuía Node.js + CLIs. Nenhuma alteração necessária.

---

## Validação em container

```
node --version  → v22.22.2
npm --version   → 10.9.7
which claude    → /usr/bin/claude
which openclaude → /usr/bin/openclaude
```

Os erros de `cp` ao iniciar com `--rm` são do entrypoint tentando popular o volume
`/workspace/config/` que não existe em container efêmero — comportamento esperado.

---

## Pendência arquitetural futura

A verificação `shutil.which(cli)` e a execução dos CLIs deveriam ocorrer no container
`runtime` (onde as sessões Claude Code de fato rodam), não no `dashboard` (que é apenas
a API + UI). Mover essa verificação para o runtime evitaria a necessidade de manter CLIs
pesados na imagem dashboard.

Esta é uma refatoração arquitetural separada — não escopo desta missão.

---

## Terminal-server

Pendência separada. Não alterado nesta missão.

---

## Resultado esperado na VPS após deploy

- `providers.py` → `shutil.which("claude")` retorna `/usr/bin/claude`
- `providers.py` → `shutil.which("openclaude")` retorna `/usr/bin/openclaude`
- Página Providers: `claude_installed=true`, `openclaude_installed=true`
- Todos os toggles de providers inativos voltam a ser clicáveis
- Claude/Anthropic pode ser ativado sem usar Configure
