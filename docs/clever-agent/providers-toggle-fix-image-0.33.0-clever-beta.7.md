# Providers Toggle Fix Image — 0.33.0-clever-beta.7

**Data:** 2026-05-26

## Contexto

Código corrigido e promovido em `clever-beta` commit `0c43c15`.  
Correção: toggle do provider ativo permanece clicável mesmo com CLI ausente.  
Ver: [providers-page-toggle-fix.md](providers-page-toggle-fix.md)

## Imagem

- **Imagem:** `ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.7`
- **Digest (index):** `sha256:b12d2521c960edd33f0e636fe7f652d2d0217ad953a402405ce669c7604a4de1`
- **Manifest linux/amd64:** `sha256:f833bf004dcca3f685e1a683b7689206f9a0c90dcc4ef0ff30ce4d44beefb216`
- **`latest` publicado?** Não.

## Build

- Base: `python:3.12-slim` + `node:22-alpine` (frontend-build stage)
- Frontend: `npm run build` — zero erros TypeScript/Vite; `Providers-DNmq6Uz6.js` presente no bundle
- Tamanho da imagem local: ~3,1 GB
- Build executado em: PC local Windows / Docker Desktop

## Push

- Registro: `ghcr.io` (GitHub Container Registry)
- Usuário: `danielsavoia`
- Push: bem-sucedido; camadas já existentes aproveitadas do push beta.6
- Digest confirmado via `docker buildx imagetools inspect`

## Git

- Branch: `clever-beta` @ `0c43c15`
- Tag: `clever-agent-v0.33.0-clever-beta.7`

## Próximo passo — VPS

Atualizar **apenas o serviço `dashboard`** da stack `clever_agent_beta` para:

```
ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.7
```

Validar na página Providers:
1. Toggle do Anthropic (ativo, `claude_installed=false`) está clicável.
2. Clicar no toggle desativa o provider (`active_provider: none`).
3. Providers inativos sem CLI mostram hint "CLI ausente" e toggle disabled.
4. Botão Configure acessível para todos os providers.
5. Página não fica em loading infinito.
