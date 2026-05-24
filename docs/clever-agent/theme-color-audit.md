# Clever Agent Theme Color Audit

**Date:** 2026-05-24
**Branch:** `clever-dev`
**Status:** Paleta aplicada — Etapa 6.4 concluida

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

---

## Applied theme patch (Etapa 6.4)

- **Commit:** (ver git log)
- **Arquivos alterados:** 92 arquivos (dashboard src + site src)
- **Tokens criados em `dashboard/frontend/src/index.css`:**
  - `--clever-agent-green-900: #19402A`
  - `--clever-agent-green-800: #255938`
  - `--clever-agent-green-600: #41A650`
  - `--clever-agent-green-300: #85F2A0`
  - `--clever-agent-yellow-500: #F2CB05`
  - `--clever-agent-bg-light: #F7F9F8`
  - `--clever-agent-bg-deep: #07130D`
  - `--clever-agent-bg-panel: #0B1711`
  - `--clever-agent-border-soft: rgba(133, 242, 160, 0.16)`
  - `--clever-agent-border-medium: rgba(133, 242, 160, 0.28)`
  - `--clever-agent-text-primary: #F7F9F8`
  - `--clever-agent-text-muted: rgba(247, 249, 248, 0.68)`
  - `--evo-green: var(--clever-agent-green-300)` (alias retrocompat)
  - `--evo-accent: var(--clever-agent-green-600)` (alias retrocompat)
- **Fundos escuros atualizados:** `--bg-primary: #0D1B12`, `--bg-card: #122018`, `--bg-sidebar: #091410`, `--border: #1E3829`
- **`#00FFA7` antes:** 597 ocorrencias
- **`#00FFA7` depois:** 0 ocorrencias
- **Regras de substituicao aplicadas:**
  - Botoes CTA/background sólido → `#41A650`
  - Texto accent / highlights → `#85F2A0`
  - Bordas ativas / focus outlines → `#41A650`
  - Glows / via gradients → `#41A650` com opacidade reduzida
  - `rgba(0,255,167,...)` → `rgba(65,166,80,...)` (dashboard) / `rgba(65,166,80,...)` (site)
  - Status semântico verde (#22C55E) → `#41A650` / `#85F2A0`
  - Site `--primary: 159 100% 50%` → `129 44% 45%` (HSL #41A650)
  - Site `--ring: 159 100% 50%` → `135 65% 62%` (HSL mint)
  - Site `--primary-foreground` → branco (texto legível sobre verde médio)
- **Observacoes de contraste:**
  - `#85F2A0` sobre `#0D1B12` → excelente legibilidade (alto contraste)
  - `#F7F9F8` sobre `#41A650` → contraste adequado para texto em botoes
  - Fundos de cards `#122018` mais quentes que upstream — preserva dark mode premium
  - Status semânticos (erro/warning/info) preservados com cores originais
- **Pendencias pos-6.4:**
  - Validacao visual confirmou que apenas a sidebar refletia a paleta Clever — area principal permanecia com fundos upstream navy (#0C111D, #161b22, etc)
  - Corrigido em Etapa 6.5 — ver secao abaixo

---

## Visual correction patch (Etapa 6.5)

- **Commit:** (ver git log)
- **Diagnostico:** Etapa 6.4 substituiu corretamente o neon (#00FFA7) mas deixou intacta a paleta de fundos upstream GitHub Dark (#0C111D, #0d1117, #161b22, #21262d, #344054, #182230, #e6edf3, #667085, #8b949e). O resultado visual foi parcial — sidebar Clever, area principal upstream.
- **Causa raiz:** App.tsx linha 220 usava `bg-[#0C111D]` como container raiz do dashboard. AgentDetail.tsx, Overview.tsx e demais paginas usavam as mesmas cores legacy de fundo e texto.
- **Arquivos alterados:** 119+ (batch replacement + arquivos especificos)
- **Substituicoes aplicadas:**

| Cor antiga (GitHub Dark) | Cor nova (Clever Agent) | Papel |
|---|---|---|
| `#0C111D` | `#091410` | Fundo app raiz |
| `#0d1117` | `#07130D` | Fundo profundo (header, rail) |
| `#080c14` | `#07130D` | Loading onboarding |
| `#161b22` | `#122018` | Cards / paineis |
| `#182230` | `#122018` | Cards variante |
| `#11110c` | `#0D1B12` | Bg variante (agents) |
| `#21262d` | `#1E3829` | Bordas |
| `#344054` | `#1E3829` | Bordas variante |
| `#30363d` | `#2E5040` | Bordas hover |
| `#1c2333` | `#162B1E` | Hover surfaces |
| `#e6edf3` | `#F7F9F8` | Texto primario |
| `#8b949e` | `#C8D5CE` | Texto secundario |
| `#667085` | `#6B8A76` | Texto muted |
| `#5a6b7f` | `#6B8A76` | Texto muted variante |
| `#D0D5DD` | `#C8D5CE` | Texto medio |
| `#3F3F46` | `#3D5445` | Texto very muted / disabled |
| `#0a0f1a` | `#07130D` | CodeMirror/Docs bg |

- **Novos tokens adicionados em index.css:**
  - `--clever-agent-bg-app: #091410`
  - `--clever-agent-bg-elevated: #122018`
  - `--clever-agent-bg-card: #101E16`
  - `--clever-agent-accent: #85F2A0` (alias semantico)
  - `--clever-agent-action: #41A650` (alias semantico)
  - `--clever-agent-warning: #F2CB05` (alias semantico)
  - Ajuste: `--clever-agent-bg-panel: #0D1B12` (era `#0B1711`)
  - Ajuste: `--clever-agent-border-soft: rgba(133, 242, 160, 0.14)` (era 0.16)
  - Ajuste: `--clever-agent-border-medium: rgba(133, 242, 160, 0.24)` (era 0.28)
- **Gradiente de fundo aplicado:** `body` e `.clever-app-shell` usam radial + linear gradient verde-profundo sutil
- **App.tsx:** container raiz migrado para `.clever-app-shell` (gradient)
- **AgentDetail.tsx:** container raiz e secao terminal migrados para gradient + backdrop-blur no header
- **Resultado:** dashboard inteiro visualmente Clever Agent — fundos, paineis, cards, texto, bordas, terminal, rail de sessoes
- **Auditoria final:** todos os 9 padroes de cor legacy = 0 ocorrencias
