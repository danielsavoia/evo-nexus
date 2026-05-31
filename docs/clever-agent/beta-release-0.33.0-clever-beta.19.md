# Clever Agent dashboard beta.19

## Objetivo

Publicar localização pt-BR completa via overlay frontend-only para agents e skills.

## Escopo

- 38/38 Agent Profiles traduzidos.
- 193/193 Skills da UI traduzidas.
- Title, description e body das skills traduzidos.
- Runtime `.claude` intocado.
- Fallback para inglês preservado.

## Git

- clever-dev: `1a71106` antes da promocao; release docs sincronizados apos publicacao.
- clever-beta: `94cdb0b` apos promocao inicial para beta.19.
- tag: `clever-agent-v0.33.0-clever-beta.19`.
- clever-prod preservada: Sim.
- upstream-sync preservada: Sim.

## Imagem

- dashboard tag: `ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.19`.
- digest index: `sha256:ebb4da1e05e4b9d67a05c0b087db2bd051c32d725d2fdb05e1aa51a441b4f9cf`.
- digest linux/amd64: `sha256:e42afa5e49b785fa5f677dc45043812972520d21dd5b4c50d1e4be32db1e819a`.
- size: index manifest size `856`; linux/amd64 manifest size `5433`; local image inspect size `862071938` bytes.
- latest publicado? Não.

## Mantidos

- runtime beta.17.
- site beta.1.

## Validação

- frontend build.
- smoke image.
- strings pt-BR no bundle/imagem.
- provider/login markers preservados.
- `.claude` intocado.

## Pendências

- validação visual VPS.

## Evidências

- `npm run build` em `dashboard/frontend`: concluído sem erros.
- Cobertura overlay: 38/38 agent descriptions, 38/38 agent profiles, 193/193 skill overlays, 193/193 skill bodies.
- `docker buildx build --platform linux/amd64 -f Dockerfile.dashboard`: concluído sem erros.
- Smoke básico da imagem: `node`, `npm`, `claude`, `openclaude`, `python3`, `terminal_node_modules_ok`, `frontend_dist_ok`.
- Container temporário `clever-agent-dashboard-beta19-test`: dashboard `HTTP/1.1 200 OK`; terminal-server `/api/health` `HTTP/1.1 200 OK`.
- Strings pt-BR encontradas na imagem: `Criador de Imagens com IA`, `Você é Oracle`, `Gere imagens PNG`, `Verificação de rota`, `RH / Pessoas`.
- Markers preservados: `reset-provider`, `_startCodexAuthChatSession`, `Usuário ou e-mail`.
