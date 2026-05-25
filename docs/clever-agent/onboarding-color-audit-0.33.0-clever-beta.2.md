# Onboarding Color Audit — 0.33.0-clever-beta.2

**Data:** 2026-05-25
**Branch:** `clever-beta` (HEAD ao início: `70208a5`)
**Executado por:** Claude (automatizado via Claude Code)

---

## 1. Escopo

Auditoria cromática e textual dos componentes de onboarding/setup após as correções F-01/F-03 do release `0.33.0-clever-beta.2`.

**Arquivos auditados:**

| Arquivo | Papel |
|---------|-------|
| `dashboard/frontend/src/pages/Setup.tsx` | Wizard de setup inicial (workspace + conta) |
| `dashboard/frontend/src/pages/onboarding/Welcome.tsx` | Tela de boas-vindas do onboarding |
| `dashboard/frontend/src/pages/onboarding/OnboardingHeader.tsx` | Header compartilhado de todas as etapas (logo + progress dots) |
| `dashboard/frontend/src/pages/onboarding/StepProvider.tsx` | Etapa 1 — seleção de provedor |
| `dashboard/frontend/src/pages/onboarding/StepBrainRepo.tsx` | Etapa 2 — repositório do brain |
| `dashboard/frontend/src/pages/onboarding/StepBrainChoose.tsx` | Etapa 2a — escolha de branch/modelo |
| `dashboard/frontend/src/pages/onboarding/StepBrainConnect.tsx` | Etapa 2b — conexão do brain |
| `dashboard/frontend/src/pages/onboarding/StepConfirm.tsx` | Etapa 3 — confirmação |
| `dashboard/frontend/src/pages/onboarding/restore/RestoreSelectRepo.tsx` | Restore flow — seleção de repo |
| `dashboard/frontend/src/pages/onboarding/restore/RestoreSelectSnapshot.tsx` | Restore flow — seleção de snapshot |
| `dashboard/frontend/src/pages/onboarding/restore/RestoreExecute.tsx` | Restore flow — execução |
| `dashboard/frontend/src/pages/onboarding/restore/RestoreConfirm.tsx` | Restore flow — confirmação destrutiva |

---

## 2. Metodologia

1. `grep` sistemático sobre todos os arquivos da lista por tokens de cor upstream e texto de marca upstream
2. Classificação por severidade: **BLOQUEANTE** (cor/texto upstream visível ao usuário) vs. **ACEITÁVEL** (semântico/não-upstream)
3. Correção imediata de todos os BLOQUEANTE
4. `npm run build` (TypeScript zero-error)
5. Inspeção visual via Chrome MCP num container `0.33.0-clever-beta.2`

---

## 3. Tokens pesquisados

### Cores navy/upstream

| Token | Papel upstream |
|-------|---------------|
| `#0b1018` | Card shell background |
| `#0f1520` | Input / card inner bg |
| `#152030` | Card shell border |
| `#1e2a3a` | Input / divider border |
| `#2a3a4a` | Hover border |
| `#4a5a6e` | Muted subtitle text |
| `#8a9aae` | Secondary body text |
| `#8a9ab0` | Running/pending step text |
| `#2d3d4f` | Ultra-muted / footer text |
| `#3d4f65` | Placeholder text |
| `#0a1220` | Info box bg |
| `#F59E0B` | Amber accent (upstream) |
| `bg-slate`, `bg-gray-`, `bg-zinc` | Tailwind utility upstream |

### Texto de marca

| Padrão | Significado |
|--------|------------|
| `Built on EvoNexus` | Footer upstream |
| `EvoNexus` | Nome da plataforma upstream |

---

## 4. Findings

### 4.1 Findings anteriores (corrigidos em beta.2 — confirmados limpos)

| Arquivo | Finding | Status |
|---------|---------|--------|
| `Setup.tsx` | `"Built on EvoNexus"` no footer | ✅ Corrigido em `2f72871` |
| `Welcome.tsx` | `"Built on EvoNexus"` no footer | ✅ Corrigido em `2f72871` |
| `StepProvider.tsx` | Paleta navy (`#0f1520`, `#152030`, `#1e2a3a`, `#4a5a6e`) | ✅ Corrigido em `2f72871` |
| `StepConfirm.tsx` | Paleta navy | ✅ Corrigido em `2f72871` |
| `StepBrainRepo.tsx` | Paleta navy | ✅ Corrigido em `2f72871` |
| `StepBrainChoose.tsx` | Paleta navy + `hover:border-[#2a3a4a]` | ✅ Corrigido em `2f72871` |
| `StepBrainConnect.tsx` | Paleta navy | ✅ Corrigido em `2f72871` |

### 4.2 Novos findings detectados nesta auditoria

| # | Arquivo | Linha | Token upstream | Severidade |
|---|---------|-------|---------------|-----------|
| A-01 | `OnboardingHeader.tsx` | 23 | `bg-[#152030]` (progress dots inativos) | **BLOQUEANTE** |
| A-02 | `StepProvider.tsx` | 699 | `text-[#3d4f65]` (sub-aviso Codex device) | **BLOQUEANTE** |
| A-03 | `StepBrainRepo.tsx` | 35 | `text-[#8a9ab0]` (texto corpo) | **BLOQUEANTE** |
| A-04 | `restore/RestoreSelectRepo.tsx` | 6, 74–77, 146, 157, 175 | `bg-[#0f1520]`, `border-[#1e2a3a]`, `border-[#152030]`, `bg-[#0b1018]`, `text-[#4a5a6e]`, `text-[#2d3d4f]`, `placeholder-[#3d4f65]`, `hover:border-[#2a3a4a]` | **BLOQUEANTE** |
| A-05 | `restore/RestoreSelectSnapshot.tsx` | 47, 57, 60, 98–101, 126, 162, 174 | Mesma paleta navy + `text-[#F59E0B]` (AlertTriangle) | **BLOQUEANTE** |
| A-06 | `restore/RestoreExecute.tsx` | 143–144, 148, 158, 177, 179, 209 | Paleta navy + `text-[#8a9ab0]` | **BLOQUEANTE** |
| A-07 | `restore/RestoreConfirm.tsx` | 6, 31–32, 39, 75 | Paleta navy completa | **BLOQUEANTE** |
| A-08 | `Setup.tsx` | 301 | `border-[#1e2a3a]`, `hover:border-[#2e3a4a]`, `hover:text-[#8a9aae]` (botão Voltar) | **BLOQUEANTE** |

**Causa raiz A-04 a A-07:** O subdiretório `restore/` (fluxo "Restaurar brain repo") foi criado upstream após o patch de paleta de `2f72871` e nunca recebeu as substituições de cor Clever Agent.

---

## 5. Correções aplicadas

### Substituições de cor

| Token upstream | Token Clever Agent | Papel |
|---------------|-------------------|-------|
| `bg-[#0b1018]` | `bg-[#0D1B12]` | Card shell background |
| `bg-[#0f1520]` | `bg-[#122018]` | Input / card inner bg |
| `border-[#152030]` | `border-[#1E3829]` | Card shell border |
| `border-[#1e2a3a]` | `border-[#1E3829]` | Input / divider border |
| `hover:border-[#2a3a4a]` | `hover:border-[#1E3829]/60` | Hover border |
| `hover:border-[#2e3a4a]` | `hover:border-[#41A650]/30` | Hover border (Voltar btn) |
| `text-[#4a5a6e]` | `text-[#6B8A76]` | Muted subtitle text |
| `text-[#8a9aae]` | `text-[#e2e8f0]` | Hover text (Voltar btn) |
| `text-[#8a9ab0]` | `text-[#6B8A76]` | Running/pending step text |
| `text-[#2d3d4f]` | `text-[#2d4a38]` | Ultra-muted count text |
| `text-[#3d4f65]` | `text-[#2d4a38]` | Placeholder / sub-aviso text |
| `placeholder-[#3d4f65]` | `placeholder-[#2d4a38]` | Input placeholder |
| `text-[#F59E0B]` | `text-[#F2CB05]` | AlertTriangle (warning icon) |
| `bg-[#152030]` | `bg-[#1E3829]` | Progress dot inativo |

### Arquivos modificados nesta auditoria

| Arquivo | Commit anterior | Mudança nesta auditoria |
|---------|----------------|------------------------|
| `OnboardingHeader.tsx` | Não tocado | Ponto inativo: `#152030` → `#1E3829` |
| `StepProvider.tsx` | `2f72871` | Sub-aviso Codex: `#3d4f65` → `#2d4a38` |
| `StepBrainRepo.tsx` | `2f72871` | Corpo texto: `#8a9ab0` → `#6B8A76` |
| `Setup.tsx` | `2f72871` | Botão Voltar: paleta corrigida |
| `restore/RestoreSelectRepo.tsx` | Nunca tocado | Paleta Clever Agent completa |
| `restore/RestoreSelectSnapshot.tsx` | Nunca tocado | Paleta Clever Agent + `#F59E0B` → `#F2CB05` |
| `restore/RestoreExecute.tsx` | Nunca tocado | Paleta Clever Agent completa |
| `restore/RestoreConfirm.tsx` | Nunca tocado | Paleta Clever Agent completa |

---

## 6. Build

| Target | Resultado |
|--------|-----------|
| `dashboard/frontend` (pós-correções) | ✅ `built in 22.84s` — 0 erros TypeScript |

---

## 7. Validação visual

Validação via Chrome MCP contra container `clever-agent-dashboard:0.33.0-clever-beta.2` (porta 5185).

> **Nota:** O container usa a imagem beta.2 (commit `7a56c3e`), que contém as correções de `2f72871` (StepProvider, StepBrainRepo, etc.) mas NÃO as novas correções desta auditoria (restore/, OnboardingHeader, Setup botão Voltar). As telas abaixo refletem o estado beta.2. As novas correções estarão na imagem do próximo build.

| Tela | URL | Resultado |
|------|-----|-----------|
| Login | `/` (redirect) | ✅ Clever Agent logo, paleta verde, sem texto upstream |
| Setup — Workspace | `/setup` (step 1) | ✅ Green palette, footer "Clever Agent", sem "Built on EvoNexus" |
| Setup — Conta | `/setup` (step 2) | ✅ Green palette, botões corretos |
| Onboarding Welcome | `/onboarding` | ✅ Clever Agent logo, footer "Clever Agent", sem "Built on EvoNexus", paleta verde |
| StepProvider (lista) | `/onboarding` step 1 | ✅ Cards em paleta verde (`#1E3829` borders, `#0D1B12` bg), OnboardingHeader com logo correto |
| Progress dots | Header step 1 | ✅ Primeiro dot verde (`#41A650`); dots inativos visualmente escuros |

---

## 8. Estado pós-auditoria

### Grep final — zero matches upstream em onboarding/ e Setup.tsx

```
Padrão: #0b1018|#0f1520|#152030|#1e2a3a|#4a5a6e|#8a9aae|#2d3d4f|#3d4f65|#0a1220|#2a3a4a|#8a9ab0|#F59E0B
Escopo: dashboard/frontend/src/pages/onboarding/** + Setup.tsx

Resultado: 0 matches ✅
```

### Tokens ACEITÁVEIS mantidos (não são upstream)

| Token | Arquivo(s) | Justificativa |
|-------|-----------|--------------|
| `#3a1515`, `#5a2020` | `RestoreConfirm.tsx`, `RestoreSelectSnapshot.tsx` | Background/border de estado de erro (semântico — vermelhos para destruição) |
| `#1a0a0a`, `#3a1515` | Múltiplos | Background de mensagem de erro (semântico) |
| `#f87171` | Múltiplos | Texto de erro destrutivo (semântico) |
| `#0a1a12` | `RestoreExecute.tsx` | Background de estado de sucesso (semântico — escuro verde) |
| `#4a9a6a` | `RestoreExecute.tsx` | Texto de sucesso de restore (semântico — verde) |
| `#b89070` | `RestoreSelectSnapshot.tsx` | Texto de aviso KB (semântico — âmbar escuro) |

---

## 9. Escopo preservado

| Regra | Status |
|-------|--------|
| `clever-prod` alterada? | ❌ Não |
| `upstream-sync` alterada? | ❌ Não |
| VPS acessada? | ❌ Não |
| Deploy feito? | ❌ Não |
| Force push usado? | ❌ Não |
| Secrets commitados? | ❌ Não |
