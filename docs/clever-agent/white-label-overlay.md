# Clever Agent White-label Overlay

**Date:** 2026-05-24
**Branch:** `clever-dev`

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

**STATUS: PENDENTE — Etapa 6.4**

Paleta oficial Clever Agent (definida em `brand/clever-agent/design-system.md`):

| Token | Valor |
|---|---|
| `--clever-agent-green-900` | `#19402A` |
| `--clever-agent-green-800` | `#255938` |
| `--clever-agent-green-600` | `#41A650` |
| `--clever-agent-green-300` | `#85F2A0` |
| `--clever-agent-yellow-500` | `#F2CB05` |
| `--clever-agent-bg-light` | `#F7F9F8` |

Cores atuais a substituir (ver `docs/clever-agent/theme-color-audit.md`):
- `#00FFA7` — verde neon upstream (597 ocorrencias) — candidato principal
- `--evo-green` — token CSS (10 ocorrencias)
- `--evo` prefixo — 8 ocorrencias
- Fundos escuros `#0C111D`, `#182230`, `#344054` — avaliar compatibilidade

---

## 13. Reapply checklist after upstream update

Executar apos qualquer `git merge upstream-sync` em `clever-dev`:

- [ ] `index.html` — confirmar `<title>Clever Agent</title>`
- [ ] `Login.tsx`, `Setup.tsx`, `Welcome.tsx` — confirmar footer "Clever Agent · Open source"
- [ ] `Sidebar.tsx` — confirmar credits sem link EvoNexus
- [ ] `Agents.tsx` — confirmar key i18n `agents.subtitle`
- [ ] `api.ts` — confirmar `const API = ''`
- [ ] `vite.config.ts` — confirmar porta 8081 e proxy `/ws`
- [ ] `index.css` — confirmar `@import "@evoapi/evonexus-ui/tokens.css"`
- [ ] `agent-meta.ts` — confirmar 38 paths `.png`
- [ ] `agent_meta_seed.py` — confirmar 38 paths `.png`
- [ ] `dashboard/frontend/public/` — confirmar logos Clever Agent presentes
- [ ] `dashboard/frontend/public/clever-agent/avatars/` — confirmar 38 PNGs
- [ ] `dashboard/frontend/public/avatar/` — confirmar NAO alterada
- [ ] `brand/clever-agent/` — confirmar assets intactos
- [ ] Build: `npm run build` em `dashboard/frontend` passa sem erros
- [ ] Build: `npm run build` em `site` passa sem erros
- [ ] Validar visualmente no dashboard local

---

## 14. Known pending work

| Item | Etapa |
|---|---|
| Aplicar paleta Clever Agent no dashboard e site | Etapa 6.4 |
| `Home.tsx`: `npx @evoapi/evo-nexus` -> comando Clever | Etapa 6.1 |
| `site/` auditoria completa de textos | Etapa 6.1 |
| Validacao visual completa com login | Pendente |
| Promocao para `clever-beta` | Apos validacao visual aprovada |
