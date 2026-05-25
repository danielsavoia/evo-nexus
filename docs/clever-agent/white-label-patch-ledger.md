# Clever Agent White-label Patch Ledger

**Branch:** `clever-dev`
**Last updated:** 2026-05-25

This file tracks every Clever Agent white-label patch applied on top of the upstream Evo Nexus codebase.
**After every upstream/AppSpring/Evo Nexus merge into `clever-dev`, review each row and reapply as needed.**

---

## Patch registry

| Area | Files | Commit | Purpose | Reapply risk | Validation |
|---|---|---|---|---|---|
| Brand assets | `brand/clever-agent/*`, `dashboard/frontend/public/clever-agent.svg`, `clever-agent-dark.svg`, `clever-agent-icon.svg`, `favicon.*` | `8638de0` | Clever Agent logos, favicons, icon | Medium — upstream may reset public assets | Check logo in sidebar + browser tab |
| Branding cleanup | `Login.tsx`, `Setup.tsx`, `Welcome.tsx`, `Sidebar.tsx`, `Agents.tsx`, `lib/api.ts`, `index.html` | `22429a0` | Remove "Open source" positioning; remove upstream CTAs; set `<title>Clever Agent</title>`; `const API = ''` in api.ts | High — any of these files may be touched upstream | UI text audit on login, setup, sidebar footer, agents subtitle |
| Avatars | `brand/clever-agent/avatars/avatar_{slug}.png` (38), `dashboard/frontend/public/clever-agent/avatars/` (38), `agent-meta.ts`, `agent_meta_seed.py` | `ba52926` | 38 Clever Agent persona PNG avatars replacing upstream WEBPs | Medium — agent list/slugs may change; avatar public path may reset | Agents grid: PNG avatars load; no broken images |
| Theme palette | `dashboard/frontend/src/index.css`, `dashboard/frontend/src/App.tsx`, 90+ UI files, `site/src/index.css`, `site/src/**` | `964d903`, `8d430c0`, `41cc42a` | Full Clever Agent green/yellow palette; replace `#00FFA7`, GitHub Dark navy, and amber accent; yellow `#F2CB05` in 8 UI points | High — any upstream UI change may reintroduce old colors | Full visual validation: Overview, Agents, AgentDetail, Sidebar, Login, Site |
| Docs/Goals routes | `dashboard/frontend/src/pages/Docs.tsx`, `dashboard/frontend/src/pages/Goals.tsx` | `7d556af` | Fix `localhost:8080` API bypass; docs white-label runtime overlay; `EvoNexus Docs` → `Clever Agent Docs`; neutralize upstream install commands | High — upstream frequently updates Docs.tsx and Goals.tsx | `/goals` loads without error; `/docs` shows "Clever Agent Docs"; `/docs/getting-started` shows `clever-agent setup` |
| Onboarding wizard | `Setup.tsx`, `onboarding/Welcome.tsx`, `StepProvider.tsx`, `StepConfirm.tsx`, `StepBrainRepo.tsx`, `StepBrainChoose.tsx`, `StepBrainConnect.tsx` | `2f72871` | Remove "Built on EvoNexus" footer from all wizard screens; replace footer with "Clever Agent" link; apply Clever Agent palette to all wizard cards/inputs (remove navy `#0b1018`/`#0f1520`/`#152030`/`#1e2a3a`) | High — setup/onboarding rewritten on upstream updates | Setup/onboarding flow: no "EvoNexus" text visible; cards in green palette |
| Dockerfile.dashboard config seed | `Dockerfile.dashboard` | `2f72871` | Add `init-config.sh` entrypoint that seeds `/workspace/config/` from `_config_defaults/` on first boot; includes `providers.example.json` so onboarding works without manual `docker exec` | Medium — Dockerfile changes may conflict on upstream bumps | Fresh container: onboarding Anthropic provider selectable without error |
| Onboarding restore flow + header palette | `OnboardingHeader.tsx`, `StepProvider.tsx`, `StepBrainRepo.tsx`, `Setup.tsx`, `restore/RestoreSelectRepo.tsx`, `restore/RestoreSelectSnapshot.tsx`, `restore/RestoreExecute.tsx`, `restore/RestoreConfirm.tsx` | *(esta auditoria)* | Apply Clever Agent palette to restore/ sub-flow (never patched before) and fix residual navy tokens in OnboardingHeader, StepProvider, StepBrainRepo, Setup back-button | High — restore/ sub-flow created upstream after initial palette patch; may be rewritten on upstream updates | Restore flow visible: no navy cards; OnboardingHeader inactive dots `#1E3829`; zero grep matches for upstream colors |

---

## How to use this ledger

1. After every `git merge upstream-sync` into `clever-dev`, run `git diff upstream-sync..clever-dev -- <file>` for each file in the "Files" column.
2. If the diff shows upstream overwriting a Clever patch, reapply per the "Purpose" column.
3. Run "Validation" checks in browser to confirm the reapply worked.
4. Reference `docs/clever-agent/white-label-overlay.md` for exact code snippets and substitution tables.

---

## Risk levels

| Level | Meaning |
|---|---|
| **High** | Upstream touches these files in almost every release. Expect to reapply after every merge. |
| **Medium** | Upstream may touch these files on major releases. Check on every merge, reapply if needed. |
| **Low** | Stable files that upstream rarely changes. Verify once per major upstream version. |

---

## Related documents

| Document | Purpose |
|---|---|
| `docs/clever-agent/white-label-overlay.md` | Full specification of every white-label change, rules, and reapply checklists |
| `docs/clever-agent/theme-color-audit.md` | Detailed audit of every color token replaced |
| `docs/clever-agent/avatar-whitelabel.md` | Avatar PNG inventory and path mapping |
| `docs/clever-agent/visual-validation-6.6.md` | Visual validation report for Etapa 6.6 |
| `docs/clever-agent/visual-validation-6.6.1.md` | Visual validation report for Etapa 6.6.1 (Goals + Docs fix) |
| `docs/clever-agent/upstream-v033-reconciliation.md` | Upstream v0.33 merge reconciliation notes |
