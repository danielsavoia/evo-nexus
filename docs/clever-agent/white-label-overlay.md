# Clever Agent White-label Overlay

**Date:** 2026-05-24 (updated 2026-05-28 — master reapply policy added)
**Branch:** `clever-dev`

> **Navigation:** For the full reapply workflow and per-file inventory, see `docs/clever-agent/white-label-master-inventory.md`.
> For the patch quick-reference, see `docs/clever-agent/white-label-patch-ledger.md`.

---

## 1. Objetivo

Clever Agent e o white-label separado do Evo Nexus / AppSpring / Evolution Foundation. O repositorio fork mantem branding, avatars, textos e futuramente cores proprias, sem alterar a logica funcional do upstream.

Este documento consolida tudo que foi alterado para que, apos qualquer atualizacao upstream, a equipe saiba exatamente o que reaplicar.

---

## 2. Branch governance

| Branch | Papel |
|---|---|
| `upstream-sync` | Espelho limpo do upstream (`upstream/develop`). Nunca recebe commits Clever. |
| `clever-dev` | Branch de desenvolvimento Clever. Merges do upstream entram aqui. |
| `clever-beta` | Staging do produto. Promovida a partir de `clever-dev` apos validacao. |
| `clever-prod` | Producao. Promovida a partir de `clever-beta`. |

Regra: `clever-beta` e `clever-prod` nunca sao alteradas diretamente.

---

## 3. Upstream base

| Campo | Valor |
|---|---|
| Upstream repo | `https://github.com/evolution-foundation/evo-nexus.git` |
| Base atual | `upstream/develop` HEAD `fe15fd5` |
| Tag de referencia | `v0.33.0` — commit `197226c` |
| Ultimo merge documentado | `095eb0b` — reconciliacao v0.33 em `clever-dev` |
| Documentacao | `docs/clever-agent/upstream-v033-reconciliation.md` |

---

## 4. Repositorio e paths locais

| Campo | Valor |
|---|---|
| Path local | `D:\DEV\Clever Agent\evo-nexus` |
| Origin (fork Clever) | `https://github.com/danielsavoia/evo-nexus.git` |
| Upstream (Evo Nexus) | `https://github.com/evolution-foundation/evo-nexus.git` |

---

## 5. Brand assets (source of truth)

Localizados em `brand/clever-agent/`:

| Arquivo | Descricao |
|---|---|
| `logo-horizontal.svg` | Logo horizontal padrao |
| `logo-horizontal-light.svg` | Logo horizontal — fundo claro |
| `logo-horizontal-dark.svg` | Logo horizontal — fundo escuro |
| `icon.svg` | Icone simbolo padrao |
| `icon-light.svg` | Icone — fundo claro |
| `icon-dark.svg` | Icone — fundo escuro |
| `favicon.svg` | Favicon SVG |
| `app-icon.svg` | App icon |
| `preview.html` | Preview visual dos assets |
| `design-system.md` | Tokens de design, paleta, tipografia |
| `avatars/avatar_{slug}.png` | 38 PNGs oficiais dos agentes |

---

## 6. Public dashboard assets

Localizados em `dashboard/frontend/public/`:

| Arquivo | Descricao |
|---|---|
| `clever-agent.svg` | Logo horizontal |
| `clever-agent-dark.svg` | Logo horizontal dark |
| `clever-agent-icon.svg` | Icone simbolo |
| `favicon.svg` | Favicon |
| `favicon.png` | Favicon PNG (fallback) |
| `clever-agent/avatars/avatar_{slug}.png` | 38 PNGs servidos pelo frontend |

Nota: `dashboard/frontend/public/avatar/` pertence ao upstream (WEBPs). Nao sobrescrever.

---

## 7. Site assets

Localizados em `site/public/`:

| Arquivo | Descricao |
|---|---|
| `assets/clever-agent.svg` | Logo |
| `assets/clever-agent-icon.svg` | Icone |
| `assets/favicon.svg` | Favicon |
| `assets/favicon.png` | Favicon PNG |
| `favicon.png` | Favicon raiz |

---

## 8. Dashboard files alterados para branding

| Arquivo | Alteracoes |
|---|---|
| `dashboard/frontend/index.html` | `<title>Clever Agent</title>` + importmap upstream preservado |
| `dashboard/frontend/src/pages/Login.tsx` | Footer substituido: "Built on EvoNexus" -> "Clever Agent · Open source" |
| `dashboard/frontend/src/pages/Setup.tsx` | Footer substituido: mesma troca |
| `dashboard/frontend/src/pages/onboarding/Welcome.tsx` | Footer substituido: mesma troca |
| `dashboard/frontend/src/components/Sidebar.tsx` | Credits: link EvoNexus -> texto "Clever Agent · Open source" |
| `dashboard/frontend/src/pages/Agents.tsx` | i18n key `agents.headerSubtitle` -> `agents.subtitle` (fix key inexistente) |
| `dashboard/frontend/src/lib/api.ts` | `const API = ''` (proxy relativo, sem URL upstream hardcoded) |
| `dashboard/frontend/src/lib/agent-meta.ts` | Paths de avatar: `.svg` -> `.png` (38 agentes) |
| `dashboard/backend/agent_meta_seed.py` | Paths de avatar: `.svg` -> `.png` (38 agentes) |
| `dashboard/frontend/src/index.css` | Fix: `@import "@evonexus/ui/tokens.css"` -> `@evoapi/evonexus-ui` |
| `dashboard/frontend/vite.config.ts` | Porta 8081, proxy `/ws`, `resolve.conditions` upstream |

Nota: componentes `OnboardingHeader`, `ShareView`, `Scheduler` podem conter referencias residuais — avaliar em Etapa 6.1.

---

## 9. Site files alterados para branding

| Arquivo | Status |
|---|---|
| `site/index.html` | A verificar |
| `site/src/pages/Home.tsx` | `npx @evoapi/evo-nexus` ainda presente — pendente Etapa 6.1 |
| `site/src/i18n/` | A verificar referencias de produto |

---

## 10. Text replacement policy

| Texto | Regra |
|---|---|
| `EvoNexus` como produto principal | Nao deve aparecer em CTAs/navegacao/titulos |
| `Evo Nexus` | Idem |
| `Evolution Foundation` | Nao deve aparecer como link de navegacao principal |
| `Open source` como posicionamento comercial | Nao deve ser o posicionamento principal do Clever Agent |
| `Built on EvoNexus` | Pode permanecer como atribuicao discreta em rodape |
| `window.EvoNexus`, `EvoNexusSDK`, `@evoapi/evonexus-ui`, `EVONEXUS_ALLOW_FORCE_UNINSTALL` | Internos tecnicos — NAO alterar |

---

## 11. Avatar white-label

Ver `docs/clever-agent/avatar-whitelabel.md` para documentacao completa.

Resumo:
- 38 PNGs aprovados manualmente
- Origem local: `C:\Users\agenc\Downloads\Avatares`
- Brand: `brand/clever-agent/avatars/`
- Public: `dashboard/frontend/public/clever-agent/avatars/`
- Mapeamento em `agent-meta.ts` e `agent_meta_seed.py` atualizado para `.png`
- `dashboard/frontend/public/avatar/` (upstream WEBPs) preservada intocada

---

## 12. Theme / color overlay

**STATUS: APLICADO — Etapa 6.4 concluida em 2026-05-24**

Paleta oficial Clever Agent aplicada (definida em `brand/clever-agent/design-system.md`):

| Token | Valor | Status |
|---|---|---|
| `--clever-agent-green-900` | `#19402A` | Aplicado — `--bg-sidebar: #091410` (variante) |
| `--clever-agent-green-800` | `#255938` | Aplicado — surfaces secundarias |
| `--clever-agent-green-600` | `#41A650` | Aplicado — botoes CTA, bordas ativas |
| `--clever-agent-green-300` | `#85F2A0` | Aplicado — texto accent, highlights |
| `--clever-agent-yellow-500` | `#F2CB05` | Definido em token, uso reservado |
| `--clever-agent-bg-light` | `#F7F9F8` | Aplicado — texto primario claro |

Substituicoes realizadas:
- `#00FFA7` — **597 ocorrencias → 0** (dashboard + site)
- `--evo-green` — alias retrocompat: `var(--clever-agent-green-300)` (intencional)
- `--evo-accent` — alias retrocompat: `var(--clever-agent-green-600)` (intencional)
- Fundos escuros migrados: `--bg-primary: #0D1B12`, `--bg-card: #122018`, `--bg-sidebar: #091410`
- Site HSL tokens: `--primary: 129 44% 45%`, `--ring: 135 65% 62%`

Arquivos alterados: 92 (dashboard/frontend/src + site/src). Ver `docs/clever-agent/theme-color-audit.md` para auditoria completa.

Pendencias pos-aplicacao:
- Validacao visual completa no browser (Etapa 6.5)
- Ajustes finos de contraste se detectados visualmente
- `--evo-green` e `--evo-accent` podem ser removidos apos validacao

---

## 13. Dashboard Docs white-label

**STATUS: APLICADO — Etapa 6.6.1 concluida em 2026-05-24 | Commit `7d556af`**

### Regra fundamental

The embedded dashboard docs route (`/docs`) is part of the Clever Agent white-label overlay.
It must not expose EvoNexus as the primary product name, upstream installation commands,
or upstream navigation links. `/docs` must render a non-empty Clever Agent documentation entry page.

### Arquivo responsável

`dashboard/frontend/src/pages/Docs.tsx`

### O que foi alterado (Etapa 6.6.1)

| Alteração | Detalhe |
|---|---|
| API URL | `const API = import.meta.env.DEV ? 'http://localhost:8080' : ''` → `const API = ''` |
| Sidebar header | `EvoNexus Docs` → **`Clever Agent Docs`** (inline JSX, linhas 122–126) |
| `whiteLabel()` function | Adicionada — aplica substituições em render-time sem alterar o backend |
| Aplicação do whiteLabel | `setContent(whiteLabel(md))` + `{whiteLabel(child.title)}` na nav |
| Loading state | `loading && sections.length > 0` → `loading` (não fica em branco no carregamento inicial) |
| sections fetch catch | Agora faz `setLoading(false)` em falha (sem spinner infinito) |
| `!docPath` early return | Agora faz `setLoading(false)` quando sections já carregou |

### Substituições obrigatórias de marca (reapply após upstream)

Ao reaplicar o white-label, garantir que os seguintes textos sejam substituídos na UI e docs:

| Texto original | Substituto |
|---|---|
| `EvoNexus` | `Clever Agent` |
| `Evo Nexus` | `Clever Agent` |
| `Getting Started with EvoNexus` | `Getting Started with Clever Agent` |
| `What is EvoNexus` | `What is Clever Agent` |
| `Installing EvoNexus with Docker` | `Installing Clever Agent with Docker` |
| `Updating EvoNexus` | `Updating Clever Agent` |
| `EvoNexus Plugin Contract` | `Clever Agent Plugin Contract` |

### Tabela de substituições da `whiteLabel()` (em ordem de aplicação)

> Ordem importa: padrões específicos multi-segmento ANTES do genérico `evo-nexus`.

| Padrão original | Substituto | Motivo da ordem |
|---|---|---|
| `npx @evoapi/evo-nexus*` | `clever-agent setup` | específico antes do genérico |
| `raw.githubusercontent.com/EvolutionAPI/evo-nexus*` | `https://clever.app/docs/install` | URL full antes do partial |
| `github.com/EvolutionAPI/evo-nexus*` | `https://clever.app/docs` | URL full antes do partial |
| `github.com/evolution-foundation/evo-nexus*` | `https://clever.app/docs` | URL full antes do partial |
| `@evoapi/evo-nexus` | `clever-agent` | package específico |
| `EvoNexus` | `Clever Agent` | genérico |
| `Evo Nexus` | `Clever Agent` | genérico |
| `evo-nexus` | `clever-agent` | genérico (último, pois altera URLs já processadas) |
| `github.com/EvolutionAPI/clever-agent` | `clever.app/docs` | limpeza pós-substituição genérica |
| `EvolutionAPI/clever-agent` | `clever-agent` | limpeza pós-substituição genérica |

### Comandos e links upstream neutralizados

Os seguintes itens **não devem aparecer como instrução principal** na UI Clever Agent:

| Item | Substituto white-label |
|---|---|
| `npx @evoapi/evo-nexus` | `clever-agent setup` |
| `github.com/EvolutionAPI/evo-nexus` | `clever.app/docs` |
| `github.com/evolution-foundation/evo-nexus` | `clever.app/docs` |
| `raw.githubusercontent.com/EvolutionAPI/evo-nexus` | `https://clever.app/docs/install` |
| `localhost:8080` (como referência de instalação upstream) | mantido apenas em contexto técnico de backend |

> **Nota:** These placeholders are white-label documentation placeholders and must be replaced
> by the official Clever Agent installation flow when the deployment architecture is finalized.

### Regra de reapply

Se upstream atualizar `Docs.tsx` e restaurar `http://localhost:8080` ou `EvoNexus Docs`,
reaplicar: `const API = ''`, sidebar header JSX, e a função `whiteLabel()` completa.

---

## 14. Dashboard Goals route

**STATUS: APLICADO — Etapa 6.6.1 concluida em 2026-05-24 | Commit `7d556af`**

### Rota e arquivo

- Rota: `/goals`
- Arquivo: `dashboard/frontend/src/pages/Goals.tsx`

### Problema anterior

`Failed to fetch` ao carregar `/goals`. O componente chamava `http://localhost:8080/api/missions`
diretamente, bypassando o proxy Vite. O backend do dashboard fica em `localhost:8081`; a porta
`8080` era de outro serviço (CRM). O endpoint `/api/missions` existe e requer autenticação — confirmado
com `curl -w "%{http_code}" http://localhost:8081/api/missions` → `401`.

### Causa raiz

```diff
// ANTES — hardcoded, bypassa proxy, porta errada
- const API = import.meta.env.DEV ? 'http://localhost:8080' : ''

// DEPOIS — relativo, roteado pelo proxy Vite para :8081
+ const API = ''
```

### Regra de governança

The Goals route must not call `http://localhost:8080` directly in the frontend.
It must use relative API paths so Vite (local dev) and future deployment proxies
can route requests correctly.

### Error/empty states obrigatórios

Se a API/backend não estiver disponível, a tela **não deve exibir** apenas `Error: Failed to fetch`.
Deve exibir:
- Mensagem amigável em português explicando o problema
- Instrução para verificar o backend
- Botão de retry
- Detalhe técnico do erro apenas em modo DEV (`import.meta.env.DEV`)

### Regra de reapply

Se upstream atualizar `Goals.tsx` e restaurar `http://localhost:8080` como URL de API,
reaplicar `const API = ''` e o error state amigável.

---

## 15. Reapply checklist after upstream update

Executar apos qualquer `git merge upstream-sync` em `clever-dev`:

- [ ] `index.html` — confirmar `<title>Clever Agent</title>`
- [ ] `Login.tsx`, `Setup.tsx`, `Welcome.tsx` — confirmar footer "Clever Agent · Open source"
- [ ] `Sidebar.tsx` — confirmar credits sem link EvoNexus
- [ ] `Agents.tsx` — confirmar key i18n `agents.subtitle`
- [ ] `api.ts` — confirmar `const API = ''`
- [ ] `Goals.tsx` — confirmar `const API = ''` (linha 71)
- [ ] `Goals.tsx` — confirmar friendly loading, empty, and error states (não apenas `Failed to fetch`)
- [ ] `Docs.tsx` — confirmar `const API = ''` (linha 7) e `whiteLabel()` function presente
- [ ] `Docs.tsx` sidebar header — confirmar `Clever Agent Docs` (não `EvoNexus Docs`)
- [ ] `/docs` renders a non-empty Clever Agent docs entry page (não fica em branco)
- [ ] Docs markdown is passed through the `whiteLabel()` transformation layer
- [ ] Upstream install commands not exposed as primary Clever Agent instructions (`npx @evoapi/evo-nexus` ausente)
- [ ] Docs links do not point to upstream GitHub/EvolutionAPI as primary navigation
- [ ] `vite.config.ts` — confirmar porta 8081 e proxy `/ws`
- [ ] `index.css` — confirmar `@import "@evoapi/evonexus-ui/tokens.css"`
- [ ] `agent-meta.ts` — confirmar 38 paths `.png`
- [ ] `agent_meta_seed.py` — confirmar 38 paths `.png`
- [ ] `dashboard/frontend/public/` — confirmar logos Clever Agent presentes
- [ ] `dashboard/frontend/public/clever-agent/avatars/` — confirmar 38 PNGs
- [ ] `dashboard/frontend/public/avatar/` — confirmar NAO alterada
- [ ] `brand/clever-agent/` — confirmar assets intactos
- [ ] `index.css` (dashboard) — confirmar tokens `--clever-agent-*` e aliases `--evo-green`, `--evo-accent`
- [ ] Verificar `#00FFA7` ausente: `Select-String -Pattern '#00FFA7'` retorna 0 ocorrencias
- [ ] `site/src/index.css` — confirmar `--primary: 129 44% 45%` e `--ring: 135 65% 62%`
- [ ] Build: `npm run build` em `dashboard/frontend` passa sem erros
- [ ] Build: `npm run build` em `site` passa sem erros
- [ ] Validar visualmente no dashboard local

---

## 16. Agent-facing brand overlay

Dois níveis de substituição de marca foram aplicados sobre o upstream:

### 16.1 EvoNexus → Clever Agent (produto principal)

| Padrão substituído | Substituição | Escopo |
|---|---|---|
| `EvoNexus`, `Evo Nexus`, `Evo-Nexus` | `Clever Agent` | Todos os conteúdos user/agent-facing |
| `evonexus` (em texto visível) | `clever-agent` | Slugs e textos visíveis |

**Preservados:** `evonexus.db`, `_evonexus_managed`, `@evoapi/evonexus-ui`, `evonexus-backup-*`, localStorage keys, `min_evonexus_version`, CLI binaries.

**Referência completa:** `docs/clever-agent/agent-facing-branding-cleanup.md` seções 3 e 8.

### 16.2 Evo CRM → Clever AI (plataforma CRM)

| Padrão substituído | Substituição | Escopo |
|---|---|---|
| `Evo CRM` | `Clever AI` | `.claude/`, `docs/integrations/`, dashboard, READMEs |

**Preservados:** `int-evo-crm` (skill ID), `EVO_CRM_TOKEN`, `EVO_CRM_URL` (env vars), `evo_crm_client.py` (script), `evo-crm-community` (GitHub repo), `evo-crm.md` (file path).

**Referência completa:** `docs/clever-agent/agent-facing-branding-cleanup.md` seções 7 e 8.

### 16.3 Regra de reapply

Após qualquer merge upstream:

```bash
# Brand 1: EvoNexus
grep -rn "EvoNexus\|Evo Nexus" .claude/ docs/ --exclude-dir=clever-agent
# Esperado: 0 resultados

# Brand 2: Evo CRM
grep -rn "Evo CRM" .claude/ docs/ dashboard/ README.md README.swarm.md
# Esperado: 0 resultados
```

---

## 17. Known pending work

| Item | Etapa | Status |
|---|---|---|
| Aplicar paleta Clever Agent no dashboard e site | Etapa 6.4 | ✅ CONCLUIDO |
| Aplicar paleta no App.tsx e superficies GitHub Dark | Etapa 6.5 | ✅ CONCLUIDO |
| Amarelo `#F2CB05` em detalhes de design | Etapa 6.5.1 | ✅ CONCLUIDO |
| Validacao visual completa (Overview, Agents, AgentDetail, Sidebar, Site) | Etapa 6.6 | ✅ CONCLUIDO |
| Goals `Failed to fetch` corrigido | Etapa 6.6.1 | ✅ CONCLUIDO |
| Docs white-label (`EvoNexus Docs` → `Clever Agent Docs`) | Etapa 6.6.1 | ✅ CONCLUIDO |
| Agent-facing branding: EvoNexus → Clever Agent | beta.10 | ✅ CONCLUIDO |
| CRM brand: Evo CRM → Clever AI | beta.10 | ✅ CONCLUIDO |
| Master inventory document created | 2026-05-28 | ✅ CONCLUIDO |
| `site/` auditoria completa de textos | Etapa 6.1 | Pendente |
| Login page validacao visual (requer logout) | Etapa 6.6 | Pendente |
| beta.10 image build + VPS deploy | Aguardando autorização | Pendente |

---

## 18. Master reapply policy

This section defines the rules every future agent/developer must follow after any upstream merge.

### 18.1 Inventory-first rule

**Before writing any new code after an upstream merge, read `docs/clever-agent/white-label-master-inventory.md` §5 (Reapply Workflow) end-to-end.**

Never try to remember what was patched. The inventory is the source of truth.

### 18.2 Per-file inventory rule

Every Clever Agent customization must be documented with:
- The exact file(s) modified
- The exact code change (inline rule or link to detail doc)
- The commit SHA
- The reapply risk level (High / Medium / Low)
- A validation command or UI check

Any new patch added in a future session must add a row to `white-label-patch-ledger.md` and a section to `white-label-master-inventory.md` before committing.

### 18.3 Brand substitution rules

| Rule | Detail |
|---|---|
| Pattern to replace | Exact strings only: `"EvoNexus"`, `"Evo Nexus"`, `"Evo-Nexus"`, `"Evo CRM"` |
| Tool | `sed -i 's/PATTERN/REPLACEMENT/g'` on specific file lists — never `--exclude` broad patterns |
| Verification | Run grep after every sed pass to confirm zero matches remain |
| Never touch | All identifiers in `white-label-master-inventory.md §4` |
| Scope | User-facing and agent-facing content only; skip test files, legal docs, CI/CD, Python package names |

### 18.4 Preservation rule

When in doubt whether to replace a term: **check §4 of the master inventory first.**

If the identifier is in the preservation table → do NOT replace.
If not listed → safe to replace in user/agent-facing contexts.

### 18.5 Validation rule

After any reapply, run all commands in `white-label-master-inventory.md §6` before committing.
Minimum mandatory:
1. Brand scan → 0 results
2. Color scan → 0 results
3. `npm run build` → passes
4. JS syntax check on any modified `.js` file

### 18.6 Documentation rule for new patches

When a new upstream change requires a new fix:
1. Create/update `docs/clever-agent/<area>-fix.md` with root cause, fix, and reapply checklist
2. Add a row to `white-label-patch-ledger.md`
3. Add a section to `white-label-master-inventory.md §3`
4. Update `white-label-overlay.md §17` status table
5. Commit docs in the same commit as the fix (or a follow-up docs commit on the same day)

This ensures the next merge cycle starts with complete information.
