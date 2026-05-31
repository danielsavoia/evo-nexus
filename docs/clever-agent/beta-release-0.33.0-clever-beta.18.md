# Clever Agent dashboard beta.18

## Objetivo

Adicionar overlay pt-BR frontend-only para Agent cards, Agent Profile e Skills.

## Escopo

- 38/38 agent card descriptions traduzidas.
- Oracle profile completo traduzido.
- AI Image Creator title/description/body completo traduzido.
- 27 skills restantes com title/description traduzidos.
- Fallback para inglês quando overlay não existe.
- Runtime `.claude` intocado.

## Git

- clever-dev: `737dcac` antes da promoção; release docs sincronizados após publicação.
- clever-beta: `2a93fd9` após promoção inicial para beta.18.
- tag: `clever-agent-v0.33.0-clever-beta.18`.
- clever-prod preservada: Sim.
- upstream-sync preservada: Sim.

## Imagem

- dashboard tag: `ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.18`.
- digest index: `sha256:1e168f92cc0e36149681c6659e243ea765d80a8f545c6aebc95b554c4f99d165`.
- digest linux/amd64: `sha256:b7f3fa34d6234fae9cd37d455849e3056235173c5f200c6489afe2900eab9554`.
- size: push manifest size `856`; local image size `862MB` (`docker image ls`).
- latest publicado? Não.

## Mantidos

- runtime beta.17.
- site beta.1.

## Validação

- frontend build.
- smoke image.
- strings pt-BR no bundle.
- provider/login markers preservados.

## Pendências

- 37 agent profiles completos.
- 26 skill bodies restantes.

## Evidências

- `npm run build` em `dashboard/frontend`: concluído sem erros.
- `docker buildx build --platform linux/amd64 -f Dockerfile.dashboard`: concluído sem erros.
- Smoke básico da imagem: `node`, `npm`, `claude`, `openclaude`, `python3`, `terminal_node_modules_ok`, `frontend_dist_ok`.
- Container temporário `clever-agent-dashboard-beta18-test`: dashboard `HTTP/1.1 200 OK`; terminal-server `/api/health` `HTTP/1.1 200 OK`.
- Strings pt-BR encontradas em `/workspace/dashboard/frontend/dist`.
- Markers preservados: `reset-provider`, `_startCodexAuthChatSession`, `Usuário ou e-mail`, `RH / Pessoas`.
