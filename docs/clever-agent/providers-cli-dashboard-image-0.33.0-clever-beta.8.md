# Providers CLI Dashboard Image — 0.33.0-clever-beta.8

**Data:** 2026-05-26

## Contexto

Código corrigido e promovido em `clever-beta` — `Dockerfile.dashboard` agora inclui
Node.js 22 + `@anthropic-ai/claude-code` + `@gitlawb/openclaude@latest`.  
Ver: [providers-cli-dashboard-image-fix.md](providers-cli-dashboard-image-fix.md)

## Imagem

- **Imagem:** `ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.8`
- **Digest (index):** `sha256:d4dd5af100fe45ee3f11c63d512fedb6125ec32eba22363dce47036a0459cd44`
- **Manifest linux/amd64:** `sha256:d75f4ccc75d88adaf091acc0e0d670dee351536e5cbd19d4ef1b3d4299441d7b`
- **`latest` publicado?** Não.

## Validação em container

```
node --version   → v22.22.2
npm --version    → 10.9.7
which claude     → /usr/bin/claude
which openclaude → /usr/bin/openclaude
```

## Build

- Base: `python:3.12-slim` + Node.js 22 (NodeSource) + `node:22-alpine` (frontend-build)
- CLIs instalados via `npm install -g` na stage runtime
- Frontend: `npm run build` — zero erros TypeScript/Vite
- Python deps: 138 pacotes (uv sync)

## Push

- Registro: `ghcr.io` (GitHub Container Registry)
- Usuário: `danielsavoia`
- Push: bem-sucedido; digest local = digest remoto ✓

## Git

- Branch: `clever-beta` @ `9bb62ba`
- Tag: `clever-agent-v0.33.0-clever-beta.8`

## Próximo passo — VPS

Atualizar **apenas o serviço `dashboard`** da stack `clever_agent_beta` para:

```
ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.8
```

Validar na página Providers:
1. `claude_installed=true` e `openclaude_installed=true` na status bar.
2. Todos os toggles de providers inativos estão clicáveis.
3. Anthropic pode ser ativado pelo toggle (sem precisar de Configure).
4. Configure continua funcional para OpenRouter/OpenAI/etc.
