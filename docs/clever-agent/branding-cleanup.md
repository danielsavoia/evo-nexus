# Clever Agent Branding Cleanup (Etapa 6.1)

## O que foi removido

- Remocao de "Open source" da comunicacao principal no dashboard e no site.
- Remocao de CTA/comando de onboarding `npx @evoapi/evo-nexus` na landing.
- Remocao de links de navegacao principal para GitHub upstream na landing.

## Por que "open source" nao e posicionamento comercial do Clever Agent

O Clever Agent precisa se apresentar como produto principal para operacao empresarial. "Open source" pode permanecer como contexto tecnico/juridico, mas nao como headline, banner, CTA ou mensagem comercial principal.

## Atribuicoes upstream preservadas

- Atribuicao discreta mantida como texto curto: `Built on EvoNexus`.
- Mantida em areas de baixa hierarquia visual (footer/rodape de telas de acesso), sem destaque comercial.

## Links upstream removidos/neutralizados

- Removidos links visiveis de navegacao para GitHub upstream na landing.
- Comando `npx @evoapi/evo-nexus` substituido por mensagem comercial neutra de implantacao guiada.
- Links tecnicos internos do produto (por exemplo, `/docs`) foram mantidos quando nao apontam para Foundation/upstream externo.

## Logos corrigidos

- Validacao de uso das variantes:
  - Fundo escuro: `/clever-agent-dark.svg`
  - Fundo claro: `/clever-agent.svg`
  - Icone isolado: `/clever-agent-icon.svg`
- Ajuste de tamanho no header do site para faixa visual premium e legivel (`w-[150px] h-auto`).

## Mapa de avatars (proxima etapa)

### Onde ficam os avatars atuais

- `dashboard/frontend/public/avatar/avatar_*.webp` (38 arquivos).

### Como sao referenciados

- Frontend: `dashboard/frontend/src/lib/agent-meta.ts` via paths `/avatar/avatar_<slug>.webp`.
- Backend seed/meta: `dashboard/backend/agent_meta_seed.py` via `avatar_url`.

### Componentes que renderizam avatar

- `dashboard/frontend/src/components/AgentAvatar.tsx`
- `dashboard/frontend/src/components/AgentIcon.tsx`
- Uso em telas como:
  - `dashboard/frontend/src/pages/Agents.tsx`
  - `dashboard/frontend/src/pages/AgentDetail.tsx`
  - `dashboard/frontend/src/components/AgentChat.tsx`
  - `dashboard/frontend/src/pages/Topics.tsx`
  - `dashboard/frontend/src/components/ThreadsSidebar.tsx`

### Path recomendado para white-label

- `brand/clever-agent/avatars/`
- `dashboard/frontend/public/clever-agent/avatars/`
- `site/public/assets/clever-agent/avatars/`

## Pendencias

- Etapa 6.2: produzir avatars proprietarios do Clever Agent e mapear 1:1 para os 38 agentes sem alterar IDs/SDK.
