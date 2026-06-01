# Clever Agent dashboard beta.20

## Objetivo

Corrigir a página /agents para exibir descrições resumidas dos cards em pt-BR usando overlay frontend-only.

## Escopo

- Agent cards agora usam `getAgentDescriptionPtBR(...)`.
- Fallback preservado para `agent.description`.
- Aliases/normalização de slug preservados.
- 38/38 Agent Profiles pt-BR preservados.
- 193/193 Skills pt-BR preservadas.
- Runtime `.claude` intocado.

## Git

- clever-dev: `3f0219d` antes da promocao; release docs sincronizados apos publicacao.
- clever-beta: `52ca8f3` apos promocao inicial para beta.20.
- tag: `clever-agent-v0.33.0-clever-beta.20`.
- clever-prod preservada: Sim.
- upstream-sync preservada: Sim.

## Imagem

- dashboard tag: `ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.20`.
- digest index: `sha256:e5877fc27f355ea3b23ae6fa33431f0593d80f79fa36babdaa50b0a2ba860ebf`.
- digest linux/amd64: `sha256:de17f894c9c5715bc501de71248d55b141e77adbf21a678e1fbe7cc8b513b8a7`.
- size: index manifest size `856`; linux/amd64 manifest size `5433`; local image inspect size `862072895` bytes.
- latest publicado? Não.

## Mantidos

- runtime beta.17.
- site beta.1.

## Validação

- frontend build.
- smoke image.
- cards pt-BR no bundle/imagem.
- profile/skills pt-BR preservados.
- provider/login markers preservados.
- `.claude` intocado.

## Pendências

- validação visual VPS.

## Evidências

- `npm run build` em `dashboard/frontend`: concluído sem erros.
- Helpers/aliases presentes: `getAgentDescriptionPtBR`, `localizedDescription`, `aria -> aria-hr`, `flux`, `lex`, `nex`, `nova`.
- Strings de cards pt-BR no bundle/imagem: `RH e Operações de Pessoas`, `gerenciar projetos`, `suporte operacional`, `análise de dados`, `gestão financeira`, `atividades jurídicas`.
- Profiles/skills preservados na imagem: `Você é Oracle`, `Criador de Imagens com IA`.
- Smoke básico da imagem: `node`, `npm`, `claude`, `openclaude`, `python3`, `terminal_node_modules_ok`, `frontend_dist_ok`.
- Container temporário `clever-agent-dashboard-beta20-test`: dashboard `HTTP/1.1 200 OK`; terminal-server `/api/health` `HTTP/1.1 200 OK`.
- Markers preservados: `reset-provider`, `_startCodexAuthChatSession`, `Usuário ou e-mail`.
