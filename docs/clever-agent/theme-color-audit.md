# Clever Agent Theme Color Audit

**Date:** 2026-05-24
**Branch:** `clever-dev`
**Status:** Pre-aplicacao de paleta — documentacao de baseline

---

## 1. Objetivo

Mapear todos os tokens e cores hardcoded atuais antes da aplicacao da paleta Clever Agent (Etapa 6.4). Este documento serve como baseline e guia de substituicao.

---

## 2. Paleta oficial Clever Agent

| Token | Hex | Uso previsto |
|---|---|---|
| `--clever-agent-green-900` | `#19402A` | Fundos escuros principais, wordmark "Clever" |
| `--clever-agent-green-800` | `#255938` | Surfaces secundarias, gradientes |
| `--clever-agent-green-600` | `#41A650` | Destaque medio, wordmark "Agent", bordas ativas |
| `--clever-agent-green-300` | `#85F2A0` | Acento primario, links ativos, destaque principal |
| `--clever-agent-yellow-500` | `#F2CB05` | Acento unico, alertas positivos, pontos de atencao |
| `--clever-agent-bg-light` | `#F7F9F8` | Fundo claro neutro |

---

## 3. Cores e tokens encontrados no codebase atual

| Token / Cor | Ocorrencias | Arquivos principais | Observacao |
|---|---:|---|---|
| `#00FFA7` | 597 | index.css, AgentChat, Sidebar, Login, Setup, Agents, Overview, + 55 arquivos | Verde neon upstream — candidato principal para substituicao |
| `#344054` | 80 | index.css, Sidebar, PluginCard, ChatSessionList, + 23 arquivos | Border/divider escuro |
| `#0C111D` | 65 | index.css, AgentChat, AgentTerminal, Integrations, + 18 arquivos | Background primario mais escuro |
| `#182230` | 18 | index.css, Sidebar, MetricCard, ShareView, + 6 arquivos | Background card |
| `--evo-green` | 10 | index.css, ShareLinks, ShareView, Workspace, UIPlayground | CSS variable — wrapper do #00FFA7 |
| `--evo` (prefixo) | 8 | index.css, ShareLinks, ShareView, Workspace | Tokens CSS com prefixo evo |
| `emerald-` | 7 | Activity.tsx, site/Home.tsx | Classes Tailwind emerald |
| `#22C55E` | 7 | AgentChat.tsx, Agents.tsx | Verde Tailwind hardcoded |
| `green-` | 5 | PluginUninstall.tsx, Triggers.tsx, site/Home.tsx | Classes Tailwind green |
| `#101828` | 0 | — | Ausente |
| `#12B76A` | 0 | — | Ausente |
| `#17B26A` | 0 | — | Ausente |
| `#16A34A` | 0 | — | Ausente |
| `lime-` | 0 | — | Ausente |

---

## 4. Pontos criticos

### `#00FFA7` ainda aparece?
**Sim — 597 ocorrencias.** E a cor de destaque primaria atual do upstream (verde neon). Esta presente em praticamente todos os componentes do dashboard. E o alvo principal da Etapa 6.4.

### Verde neon ainda domina botoes?
**Sim.** `#00FFA7` e usado em botoes primarios, links, bordas de foco, highlights, badges e avatars. A substituicao requer revisao componente a componente.

### Fundos escuros atuais combinam com Clever?
**Parcialmente.** Os fundos `#0C111D` e `#182230` sao neutros escuros. A paleta Clever Agent usa `#19402A` e `#255938` (verde escuro), o que representa uma mudanca de tom. A aplicacao deve ser gradual para evitar regressoes de contraste.

### Site e dashboard usam tokens iguais ou separados?
**Separados.** O dashboard usa tokens CSS em `index.css` (`:root`). O site (`site/src/`) usa principalmente classes Tailwind. A estrategia de aplicacao e diferente para cada um.

---

## 5. Arquivos candidatos para patch de tema (prioridade)

### Alta prioridade (define o sistema visual)
| Arquivo | Razao |
|---|---|
| `dashboard/frontend/src/index.css` | Define `:root` tokens — `--evo-green`, `--bg-primary`, `--bg-card`, etc. |
| `dashboard/frontend/tailwind.config.*` | Configuracao Tailwind se existir |
| `brand/clever-agent/design-system.md` | Fonte de verdade dos tokens |

### Media prioridade (componentes mais visiveis)
| Arquivo | Razao |
|---|---|
| `dashboard/frontend/src/components/Sidebar.tsx` | Navegacao principal, muito visivel |
| `dashboard/frontend/src/pages/Login.tsx` | Primeira impressao |
| `dashboard/frontend/src/pages/Overview.tsx` | Dashboard principal |
| `dashboard/frontend/src/pages/Agents.tsx` | Pagina core do produto |
| `dashboard/frontend/src/components/AgentChat.tsx` | UI de chat — muito usada |
| `site/src/pages/Home.tsx` | Landing page |

### Baixa prioridade (utilitarios/internos)
| Arquivo | Razao |
|---|---|
| `dashboard/frontend/src/pages/UIPlayground.tsx` | So desenvolvimento |
| `dashboard/frontend/src/pages/Audit.tsx` | Uso eventual |
| `dashboard/frontend/src/pages/Reports.tsx` | Uso eventual |

---

## 6. Estrategia recomendada para Etapa 6.4

1. **Criar tokens Clever Agent em `index.css`**
   - Adicionar variaveis `--clever-agent-*` ao `:root`
   - Reatribuir `--evo-green` para `var(--clever-agent-green-300)` como alias de compatibilidade

2. **Substituir os tokens Evo por aliases Clever quando seguro**
   - `--evo-green` → alias para `--clever-agent-green-300: #85F2A0`
   - Manter os nomes originais como alias durante a transicao

3. **Substituir `#00FFA7` hardcoded gradualmente**
   - Priorizar `index.css` (efeito cascata maxima)
   - Depois componentes de alta visibilidade
   - Usar `var(--clever-agent-green-300)` em vez de hex direto

4. **Avaliar fundos escuros separadamente**
   - `#0C111D` e `#182230` podem permanecer ou migrar para `#19402A`/`#255938`
   - Validar contraste WCAG antes de aplicar

5. **Site: via Tailwind config**
   - Adicionar cores Clever Agent ao tema Tailwind em `tailwind.config.*` do site
   - Substituir classes `emerald-*` e `green-*` por classes Clever Agent

6. **Validacao visual antes/depois**
   - Screenshot do dashboard antes de comecar
   - Screenshot apos cada fase de substituicao
   - Confirmar: botoes, links, badges, highlights, dark mode, hover/focus

---

## 7. Riscos

| Risco | Probabilidade | Mitigacao |
|---|---|---|
| Contraste insuficiente em texto sobre fundo escuro | Media | Verificar WCAG AA para cada substituicao |
| Dark mode comprometido | Alta | `#85F2A0` e mais claro que `#00FFA7` — revisar texto branco sobre verde |
| Hover/focus states quebrados | Media | Testar interativamente apos substituicao |
| Charts e status badges com cor semantica errada | Baixa | Charts usam cores categoricas, nao o acento principal |
| Conflito em proximo upstream sync | Media | Manter substituicoes em tokens CSS (index.css), nao em componentes individuais |

---

## 8. Proxima etapa proposta

**Etapa 6.4 — Aplicar paleta Clever Agent no dashboard e site**

Prerequisitos:
- [ ] Validacao visual completa do estado atual aprovada
- [ ] Screenshot baseline tirado
- [ ] Este documento revisado e aprovado pela equipe
- [ ] Branch `clever-dev` limpa antes de comecar

Escopo previsto:
- Atualizar `dashboard/frontend/src/index.css` com tokens Clever Agent
- Criar aliases de compatibilidade para tokens `--evo-*`
- Substituir `#00FFA7` no subset de alta prioridade
- Avaliar e decidir sobre fundos escuros
- Atualizar `site/tailwind.config.*` com paleta Clever
- Build e validacao visual completa
- Commit documentado
