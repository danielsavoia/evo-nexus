# Clever Agent Avatar White-label (Etapa 6.2)

## Objetivo

Trocar os avatars visuais dos 38 agentes nativos para assets da marca Clever Agent, mantendo 100% da logica funcional (IDs, slugs, nomes, comandos e papeis).

## Paths usados

- Originais preservados (nao sobrescritos): `dashboard/frontend/public/avatar/`
- Fonte da marca: `brand/clever-agent/avatars/`
- Publico no frontend: `dashboard/frontend/public/clever-agent/avatars/`

## Decisao tecnica

- Nao sobrescrever arquivos upstream em `/avatar/` para reduzir conflitos em futuros upstream sync.
- Fazer remapeamento 1:1 para `/clever-agent/avatars/` em:
  - `dashboard/frontend/src/lib/agent-meta.ts`
  - `dashboard/backend/agent_meta_seed.py`

## Mapeamento 1:1

Padrao aplicado para todos os 38 agentes:

- `avatar_<slug>.webp` (antigo) -> `avatar_<slug>.svg` (novo)
- Exemplo: `/avatar/avatar_atlas.webp` -> `/clever-agent/avatars/avatar_atlas.svg`

## Componentes afetados

- `dashboard/frontend/src/components/AgentAvatar.tsx`
- `dashboard/frontend/src/components/AgentIcon.tsx`

Observacao: os componentes ja aceitam URL livre em `meta.avatar`, sem restricao hardcoded para `/avatar/`.

## Estilo visual dos novos avatars

- Formato: SVG vetorial
- Estilo: geometrico, premium, tecnico, limpo e consistente
- Paleta base Clever Agent:
  - `#19402A`
  - `#255938`
  - `#41A650`
  - `#85F2A0`
  - `#F2CB05`
  - `#F7F9F8`

## Como adicionar novos agentes no futuro

1. Criar novo SVG em `brand/clever-agent/avatars/avatar_<slug>.svg`.
2. Copiar para `dashboard/frontend/public/clever-agent/avatars/avatar_<slug>.svg`.
3. Atualizar `agent-meta.ts` e `agent_meta_seed.py` para usar `/clever-agent/avatars/avatar_<slug>.svg`.
4. Validar com `npm run build` no `dashboard/frontend`.

## Regra de governanca visual

Avatars devem permanecer no design system Clever Agent, sem marca EvoNexus/Evolution e sem uso de imagens realistas de pessoas reconheciveis.
