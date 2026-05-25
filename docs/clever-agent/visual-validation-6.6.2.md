# Clever Agent Visual/Functional Validation — Etapa 6.6.2

**Branch:** `clever-dev`
**Date:** 2026-05-24
**Validator:** Claude (automated via Chrome MCP + static analysis)
**Server:** `http://localhost:5174` (dashboard — Vite dev, port 5174)

---

## Scope

Final revalidation of `/goals` and `/docs` after Goals/Docs white-label patch and
documentation ledger. Also covers the footer attribution change (commit `fe49ec9`).

## Commits covered

| Commit | Message |
|---|---|
| `7d556af` | fix: repair goals and docs white-label before beta (Etapa 6.6.1) |
| `5cfe9b6` | docs: record goals and docs white-label overlay (Etapa 6.6.1) |
| `fe49ec9` | feat: replace 'Built on EvoNexus' footer with Clever Ai link |

---

## 1. Estado inicial

| Campo | Valor |
|---|---|
| Branch | `clever-dev` |
| Commit inicial | `fe49ec9` |
| Working tree | Limpa |
| Remotes | `origin` (github.com/danielsavoia/evo-nexus), `upstream` (evolution-foundation/evo-nexus) |

---

## 2. Documentação versionada

| Documento | Existe | Goals/Docs documentados | Commit `7d556af` referenciado |
|---|---|---|---|
| `white-label-overlay.md` | ✅ | ✅ Seções 13 (Docs) e 14 (Goals) | ✅ |
| `visual-validation-6.6.1.md` | ✅ | ✅ Relatório completo de Goals e Docs | ✅ |
| `white-label-patch-ledger.md` | ✅ | ✅ Linha `Docs/Goals routes` | ✅ |

Verificações adicionais:

| Item | Status |
|---|---|
| `localhost:8080` documentado como antipadrão | ✅ Aparece em contexto de correção/risco, não como URL válida |
| `EvoNexus Docs` documentado como problema resolvido | ✅ Aparece apenas em tabelas de "antes/depois" |
| `Clever Agent Docs` como estado correto | ✅ Confirmado em `visual-validation-6.6.1.md` linha 145 |
| `whiteLabel()` documentada | ✅ Código e ordem de substituições registrados em `white-label-overlay.md` §13 |

---

## 3. Build

| Target | Resultado |
|---|---|
| `dashboard/frontend` | ✅ `built in 2.62s` — sem erros TypeScript |
| `site` | Não alterado nesta etapa |

---

## 4. `/goals`

| Check | Resultado |
|---|---|
| Carregou? | ✅ Sim — título "Clever Agent", heading "Metas" visível |
| `Error: Failed to fetch` eliminado? | ✅ Não apareceu |
| Endpoint/proxy | ✅ `const API = ''` confirmado na linha 71 de `Goals.tsx` — proxy Vite roteia `/api` → `:8081` |
| Empty state | ✅ "Nenhuma Mission criada ainda. Missions são os objetivos de topo da sua organização..." |
| Erros de console do app | ✅ Nenhum (único erro é da extensão Chrome, não do Vite) |
| Visual Clever Agent | ✅ Paleta dark green aplicada, sidebar "Metas" ativo |
| Retry button | ✅ Presente no error state (não ativado pois API respondeu corretamente) |
| **Resultado** | ✅ **APROVADO** |

---

## 5. `/docs`

| Check | Resultado |
|---|---|
| Página vazia? | ✅ Não — "What is Clever Agent" carregou por padrão |
| Sidebar header | ✅ "**Clever** Agent Docs" (JSX: `<span>Clever</span><span> Agent</span><span>Docs</span>`) |
| Branding na nav | ✅ "What is Clever Agent", "Getting Started with Clever Agent", "Clever Agent Plugin Contract" |
| `EvoNexus Docs` visível? | ✅ Não aparece em nenhum elemento do DOM |
| Conteúdo inicial | ✅ "What is Clever Agent" — página completa renderizada |
| Seções na sidebar | ✅ Getting Started, Guides, Dashboard, Agents, Skills, Routines, Integrations, Real World, Reference, Clever Agent, Providers, Project |
| Erros de console do app | ✅ Nenhum |
| Visual Clever Agent | ✅ Paleta dark green aplicada |
| **Resultado** | ✅ **APROVADO** |

---

## 6. `/docs/getting-started`

| Check | Resultado |
|---|---|
| Título | ✅ "Getting Started with Clever Agent" |
| `Getting Started with EvoNexus`? | ✅ Não aparece |
| `npx @evoapi/evo-nexus` | ✅ Não aparece — substituído por `clever-agent setup` (Option B) |
| `github.com/EvolutionAPI/evo-nexus` | ✅ Não aparece |
| `raw.githubusercontent.com/EvolutionAPI/evo-nexus` | ✅ Não aparece |
| Option A Docker | ✅ `curl -O https://clever.app/docs/install` |
| Option B npx | ✅ `clever-agent setup` |
| Option C clone | ✅ `git clone --depth 1 https://clever.app/docs` |
| `localhost:8080` como URL de API | ✅ Apenas como porta do app Docker pós-instalação (contexto legítimo de runtime, não API bypass) |
| Erros de console do app | ✅ Nenhum |
| **Resultado** | ✅ **APROVADO** |

---

## 7. Busca final no código (`Docs.tsx` + `Goals.tsx`)

| Padrão | `Docs.tsx` | `Goals.tsx` |
|---|---|---|
| `http://localhost:8080` | ✅ Não encontrado | ✅ Não encontrado |
| `EvoNexus Docs` | ✅ Não encontrado | n/a |
| `@evoapi/evo-nexus` | ✅ Não encontrado (apenas dentro da regex da função `whiteLabel`) | ✅ Não encontrado |
| `github.com/EvolutionAPI` | ✅ Não encontrado (apenas dentro da regex da função `whiteLabel`) | n/a |
| `const API = ''` | ✅ Linha 7 | ✅ Linha 71 |
| `whiteLabel()` function | ✅ Definida (linha 15), aplicada em linhas 117 e 229 | n/a |
| `Clever Agent Docs` | ✅ No JSX do sidebar header | n/a |

---

## 8. Footer attribution

| Local | Antes | Depois |
|---|---|---|
| `Sidebar.tsx` footer | `Built on EvoNexus` (texto estático) | `acesse o Clever Ai` → link `https://cleverai.com.br` |
| `Login.tsx` footer | `Built on EvoNexus` (texto estático) | `acesse o Clever Ai` → link `https://cleverai.com.br` |

Commit: `fe49ec9` | Build: ✅ sem erros

---

## 9. Documentação nova

| Documento | Status |
|---|---|
| `docs/clever-agent/visual-validation-6.6.2.md` | ✅ Este arquivo |

---

## 10. Confirmações de escopo

| Regra | Status |
|---|---|
| `clever-beta` alterada? | ❌ Não |
| `clever-prod` alterada? | ❌ Não |
| `upstream-sync` alterada? | ❌ Não |
| VPS acessada? | ❌ Não |
| Deploy feito? | ❌ Não |
| GHCR publicado? | ❌ Não |
| Clever AI / clever-ai-infra alterados? | ❌ Não |
| Avatars alterados? | ❌ Não |
| Logos alterados? | ❌ Não |
| Refatoração ampla? | ❌ Não |

---

## 11. Decisão

**Todas as páginas bloqueantes (`/goals`, `/docs`, `/docs/getting-started`) estão funcionais
e white-labeled corretamente.**

| Item | Status |
|---|---|
| `/goals` carrega sem `Failed to fetch` | ✅ |
| `/docs` não está vazio, header "Clever Agent Docs" | ✅ |
| `/docs/getting-started` sem referências upstream | ✅ |
| Código limpo (`const API = ''`, `whiteLabel()` presente) | ✅ |
| Build sem erros TypeScript | ✅ |
| Footer "Built on EvoNexus" removido | ✅ |
| Documentação de governança atualizada | ✅ |

**Aprovado para o usuário decidir promoção para `clever-beta`.**

> ⚠️ Não promover para `clever-beta` até aprovação explícita do usuário.
