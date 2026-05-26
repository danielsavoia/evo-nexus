# Providers Page — Toggle Fix (beta.7)

**Branch:** `clever-dev`  
**Data:** 2026-05-26  
**Tag:** `clever-agent-v0.33.0-clever-beta.7`  
**Arquivo alterado:** `dashboard/frontend/src/pages/Providers.tsx`

---

## Sintoma

A página Providers parecia congelada na VPS de produção. Todos os toggles ficavam
desabilitados, inclusive o do provider ativo (Anthropic), impossibilitando qualquer
troca ou desativação de provider.

Estado observado na VPS:
- `active_provider: anthropic`
- `claude_installed: false`
- `openclaude_installed: false`

---

## Causa raiz

A lógica anterior do toggle era:

```tsx
disabled={!isInstalled || toggling === prov.id}
```

Como `claude_installed=false`, `isInstalled` era `false` para todos os providers
que usam o CLI `claude`, tornando todos os toggles `disabled` — inclusive o do
provider já ativo.

O backend **não bloqueia** troca ou desativação via `POST /api/providers/active`;
o bloqueio era puramente no frontend.

---

## Correção

```tsx
// Antes
disabled={!isInstalled || toggling === prov.id}

// Depois
disabled={toggling === prov.id || (!isInstalled && !isActive)}
```

Onde `isActive` já existia no componente:

```tsx
const isActive = prov.is_active && activeProvider === prov.id
```

### Critérios após correção

| Estado | Toggle |
|--------|--------|
| Provider ativo, CLI instalado | Clicável (desativa) |
| Provider ativo, CLI ausente | **Clicável** (desativa) — comportamento corrigido |
| Provider inativo, CLI instalado | Clicável (ativa) |
| Provider inativo, CLI ausente | Disabled — comportamento mantido |
| Qualquer provider, toggle em progresso | Disabled |

---

## UX — hint para CLI ausente

Para providers inativos com CLI ausente, foi adicionado um hint discreto à direita
do card (visível em telas ≥ sm):

```tsx
{!isInstalled && !isActive && (
  <span className="text-[9px] text-[#3d4f65] hidden sm:block whitespace-nowrap">
    CLI ausente
  </span>
)}
```

O badge "not installed" já existia no nome do provider; o hint reforça no lado das
ações sem quebrar o layout.

---

## Configure preservado

O fluxo **Configure → Save & activate** não foi alterado. Ele chama:
1. `POST /api/providers/{id}/config` — salva variáveis de ambiente
2. `POST /api/providers/active` — ativa o provider

Continua funcional como workaround mesmo com CLI ausente, pois o backend aceita
a troca independentemente do estado de instalação do CLI.

---

## Pendências separadas (não neste PR)

- Instalar `claude` e/ou `openclaude` na imagem dashboard para que os providers
  possam ser testados via botão "Test" e o badge "not installed" desapareça.
- Terminal-server runtime: funcionalidade separada, não afetada por esta correção.

---

## Validação local

Build frontend: `npm run build` — OK, zero erros de TypeScript ou Vite.

Validação em container real (VPS) a ser feita após deploy da imagem `beta.7`:
1. Abrir página Providers.
2. Verificar que toggle do Anthropic (ativo) está clicável.
3. Clicar → provider deve ser desativado (`active_provider: none`).
4. Providers inativos com CLI ausente devem mostrar "CLI ausente" e toggle disabled.
5. Botão Configure deve permanecer clicável para todos os providers.
6. Página não deve ficar em loading infinito.
