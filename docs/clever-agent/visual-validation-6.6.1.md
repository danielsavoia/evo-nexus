# Etapa 6.6.1 — Visual Validation Report

**Branch:** `clever-dev`
**Date:** 2026-05-24
**Validator:** Claude (automated via Chrome MCP)
**Server:** `http://localhost:5174` (dashboard — Vite dev, port 5174)

---

## Purpose

Correção e validação das páginas `/goals` e `/docs` que bloquearam a promoção para `clever-beta` após a Etapa 6.6.

---

## 1. Estado inicial

| Campo | Valor |
|---|---|
| Branch | `clever-dev` |
| Commit inicial | `85d0acc` |
| Working tree | Limpa |

---

## 2. Goals / Metas (`/goals`)

### Erro reproduzido

```
Error: Failed to fetch
```
Aparecia imediatamente ao carregar `/goals`. Sem dados, sem fallback.

### Endpoint que falhou

`http://localhost:8080/api/missions`

### Causa

`Goals.tsx` linha 71 tinha `const API = import.meta.env.DEV ? 'http://localhost:8080' : ''`.  
O proxy Vite (`vite.config.ts`) roteia `/api` → `http://localhost:8081`.  
Chamada para `8080` bypassa o proxy e vai para a porta errada (CRM, não o backend do dashboard).  
O backend correto em `8081` confirmado com `curl -w "%{http_code}" http://localhost:8081/api/missions` → `401` (endpoint existe, precisa de auth).

### Correção aplicada

```diff
- const API = import.meta.env.DEV ? 'http://localhost:8080' : ''
+ const API = ''
```

Error state melhorado:
- Mensagem amigável em português: "Não foi possível carregar as metas"
- Instruções: "Verifique se o backend do Clever Agent está em execução"
- Detalhe técnico visível apenas em `import.meta.env.DEV`
- Botão "Tentar novamente" com retry

### Resultado em `/goals` ✅ APROVADO

- Sem `Failed to fetch`
- API funcionando via proxy Vite → backend 8081
- Empty state correto: "Nenhuma Mission criada ainda." (workspace novo sem dados)
- Paleta Clever Agent aplicada
- Sidebar "Metas" ativo com borda amarela

---

## 3. Docs (`/docs` e `/docs/getting-started`)

### Problemas encontrados

| Problema | Localização |
|---|---|
| `EvoNexus Docs` no header da sidebar | `Docs.tsx` linha 123 |
| `/docs` em branco (sem conteúdo) | `loading && sections.length > 0` bug + URL errada |
| Conteúdo com títulos "EvoNexus" na nav | API retorna strings não substituídas |
| `npx @evoapi/evo-nexus` no getting-started | conteúdo markdown upstream |
| URLs `github.com/EvolutionAPI/evo-nexus` | conteúdo markdown upstream |
| `const API = 'http://localhost:8080'` | mesmo problema que Goals.tsx |

### Correções aplicadas

**1. API URL:**
```diff
- const API = import.meta.env.DEV ? 'http://localhost:8080' : ''
+ const API = ''
```

**2. Sidebar header white-label:**
```diff
- <span className="text-[#85F2A0]">Evo</span>
- <span className="text-white">Nexus</span>
+ <span className="text-[#85F2A0]">Clever</span>
+ <span className="text-white"> Agent</span>
```

**3. `whiteLabel()` function** — aplica substituições em render-time:
```typescript
function whiteLabel(text: string): string {
  return text
    .replace(/npx @evoapi\/evo-nexus\S*/g, 'clever-agent setup')
    .replace(/https:\/\/raw\.githubusercontent\.com\/EvolutionAPI\/evo-nexus.../g, 'https://clever.app/docs/install')
    .replace(/https:\/\/github\.com\/EvolutionAPI\/evo-nexus.../g, 'https://clever.app/docs')
    .replace(/@evoapi\/evo-nexus/g, 'clever-agent')
    .replace(/EvoNexus/g, 'Clever Agent')
    .replace(/Evo Nexus/g, 'Clever Agent')
    .replace(/evo-nexus/g, 'clever-agent')
    // ... (ordem importa — específicos antes de genéricos)
}
```

Aplicada a: `setContent(whiteLabel(md))` + `{whiteLabel(child.title)}` na nav.

**4. Loading state:**
```diff
- {loading && sections.length > 0 ? (
+ {loading ? (
```

**5. sections fetch catch:**
```diff
  .catch(() => {
    setSections([])
+   setLoading(false)  // evita spinner infinito em falha de fetch
  })
```

**6. `!docPath` early return:**
```diff
  if (!docPath) {
-   if (sections.length > 0) setContent('...')
+   if (sections.length > 0) {
+     setContent('...')
+     setLoading(false)
+   }
    return
  }
```

### Resultado em `/docs` ✅ APROVADO

| Check | Resultado |
|---|---|
| Sidebar header: "Clever Agent Docs" | ✅ |
| Sidebar nav: "What is Clever Agent" | ✅ |
| Sidebar nav: "Getting Started with Clever Agent" | ✅ |
| Sidebar nav: "Clever Agent Plugin Contract" | ✅ |
| Nenhum "EvoNexus" visível na nav | ✅ |
| Página não está em branco | ✅ |
| Carrega "What is Clever Agent" por padrão | ✅ |

### Resultado em `/docs/getting-started` ✅ APROVADO

| Check | Resultado |
|---|---|
| Título: "Getting Started with Clever Agent" | ✅ |
| Option A Docker: `curl -O https://clever.app/docs/install` | ✅ |
| Option B npx: `clever-agent setup` (era `npx @evoapi/evo-nexus`) | ✅ |
| Option C clone: `git clone --depth 1 https://clever.app/docs` | ✅ |
| Nenhum `github.com/EvolutionAPI/evo-nexus` visível | ✅ |
| Paleta Clever Agent aplicada | ✅ |

---

## 4. Arquivos alterados

| Arquivo | Alteração |
|---|---|
| `dashboard/frontend/src/pages/Goals.tsx` | `const API = ''`; error state amigável |
| `dashboard/frontend/src/pages/Docs.tsx` | `const API = ''`; `whiteLabel()`; sidebar header; loading fixes |
| `docs/clever-agent/white-label-overlay.md` | Seção 13 Goals+Docs, checklist, pending work |
| `docs/clever-agent/visual-validation-6.6.1.md` | Este arquivo |

---

## 5. White-label

| Item | Status |
|---|---|
| "EvoNexus Docs" removido | ✅ Sim |
| Comandos `npx @evoapi/evo-nexus` substituídos | ✅ Sim → `clever-agent setup` |
| URLs `github.com/EvolutionAPI/evo-nexus` substituídas | ✅ Sim → `clever.app/docs` |
| Títulos na nav white-labeled | ✅ Sim |
| Atribuição discreta preservada | ✅ "Built on EvoNexus" no sidebar footer (intencional) |

---

## 6. Build

| Target | Resultado |
|---|---|
| `dashboard/frontend` | ✅ `built in 1.32s` — sem erros TS |
| `site` | Não alterado — build desnecessário |

---

## 7. Validação visual

| Página | Resultado |
|---|---|
| `/goals` | ✅ Carrega, empty state correto, paleta ok |
| `/docs` | ✅ Carrega, "Clever Agent Docs", "What is Clever Agent" |
| `/docs/getting-started` | ✅ Título correto, comandos white-labeled |
| Pendências | Nenhuma |

---

## 8. Documentação

| Documento | Status |
|---|---|
| `white-label-overlay.md` | ✅ Seção 13 (Goals+Docs) adicionada; checklist e pending work atualizados |
| `visual-validation-6.6.1.md` | ✅ Este arquivo criado |

---

## 9. Commit e push

Ver commit seguinte neste branch.

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
| Refatoração ampla? | ❌ Não — apenas correções pontuais |

---

## 11. Decisão

**Pendente aprovação do usuário para promoção a `clever-beta`.**

As duas páginas problemáticas (`/goals`, `/docs`) estão corrigidas e validadas.
A Etapa 6.6.1 está concluída.
