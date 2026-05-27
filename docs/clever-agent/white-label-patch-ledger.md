# Clever Agent White-label Patch Ledger

**Branch:** `clever-dev`
**Last updated:** 2026-05-27 (terminal-server fix + scheduler CMD fix + Claude auth final fix: credentials.json:rw + claude.json:rw + trust prompt)

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
| Setup password validation | `dashboard/backend/app.py`, `dashboard/frontend/src/pages/Setup.tsx`, `dashboard/frontend/src/i18n/locales/pt-BR/index.ts` | *(beta.3)* | Flask `abort(400)` returned HTML; frontend showed raw HTML error. Fix: `@app.errorhandler(HTTPException)` returns JSON for `/api/` routes; `pwViolations()` mirrors backend rules; `parseApiError()` maps errors to pt-BR; real-time password checklist in UI; min chars 6→8 in i18n | High — `app.py` and `Setup.tsx` touched on most upstream releases | Setup account step: typing password shows checklist; submitting weak password shows pt-BR message; no HTML in error display |
| Brain repo restore snapshots | `dashboard/backend/routes/brain_repo.py`, `restore/RestoreSelectRepo.tsx`, `restore/RestoreFlow.tsx`, `restore/RestoreSelectSnapshot.tsx`, i18n (3 locales) | *(beta.4)* | `/api/brain-repo/snapshots` required DB config; during onboarding restore flow config not yet persisted → 400. Fix: snapshots() now accepts `?token&owner&repo` query params for temporary mode; frontend propagates token/owner/repoName from SelectRepo through Flow to SelectSnapshot; URLSearchParams used to build correct URL | High — restore/ sub-flow may be touched upstream; brain_repo.py updated frequently | Restore flow: selecting repo → selecting snapshot works without "Brain repo not connected" error |
| Brain repo github_api fixes | `dashboard/backend/brain_repo/github_api.py` | *(beta.5)* | Bug 1: `validate_pat_scopes` used case-sensitive dict lookup for `X-OAuth-Scopes` header — fixed to case-insensitive. Bug 2: `list_snapshots` returned early on 404 (repos with no tags) before fetching HEAD — fixed to treat 404 as empty tag list and continue to HEAD fetch | Medium — github_api.py stable but may be touched on brain repo feature updates | PAT validation works; repos with no tags show HEAD snapshot in restore flow |
| Brain repo restore start | `dashboard/backend/routes/brain_repo.py`, `restore/RestoreFlow.tsx`, `restore/RestoreExecute.tsx` | *(beta.6)* | `restore_start()` required DB config; during onboarding restore flow config not yet persisted → 400. Fix: restore_start() now accepts `token`/`owner`/`repo` in POST body for temporary mode (safer than query params); RestoreFlow passes these to RestoreExecute; RestoreExecute builds dynamic body and improves `!res.ok` error handling with JSON parsing + pt-BR mapping | High — brain_repo.py and restore/ components touched frequently | Restore flow: selecting snapshot → confirming → executing restore works without "Brain repo not connected"; SSE stream starts |
| Providers toggle fix | `dashboard/frontend/src/pages/Providers.tsx` | *(beta.7)* | Toggle `disabled` dependia de `cliInstalled` para todos os providers: `!isInstalled \|\| toggling===id`. Com `claude_installed=false`, todos os toggles ficavam disabled — inclusive o do provider ativo. Fix: `toggling===id \|\| (!isInstalled && !isActive)` — provider ativo permanece clicável para desativar mesmo sem CLI; provider inativo sem CLI continua locked. Adicionado hint "CLI ausente" inline para providers inativos sem CLI. Configure e Save & activate não alterados. | Medium — Providers.tsx pode ser tocado em atualizações de UI | Providers: toggle do provider ativo clicável com CLI ausente; providers inativos sem CLI mostram hint; Configure funciona; sem loading infinito |
| Providers CLI — dashboard image | `Dockerfile.dashboard` | *(beta.8)* | `providers.py` usa `shutil.which(cli)` no container dashboard; imagem era `python:3.12-slim` sem Node.js → `claude`/`openclaude` não encontrados → todos os providers apareciam como "not installed". Fix: instalar Node.js 22 via NodeSource + `@anthropic-ai/claude-code` + `@gitlawb/openclaude@latest` na stage runtime do Dockerfile.dashboard. `Dockerfile.swarm.dashboard` já possuía estes CLIs. | High — Dockerfile.dashboard pode ser tocado em qualquer release; NodeSource URL pode mudar | Container dashboard: `which claude` → `/usr/bin/claude`; `which openclaude` → `/usr/bin/openclaude`; Providers page: `claude_installed=true`; toggles clicáveis |
| Terminal-server multi-process | `Dockerfile.dashboard`, `start-dashboard.sh` | *(beta.9)* | Chat de agentes mostrava "Could not reach terminal-server". Causa: CMD do Dockerfile.dashboard iniciava apenas Flask; `start-dashboard.sh` (que sobe terminal-server na porta 32352 + Flask) nunca era chamado. Fix: adicionar stage `terminal-build` para compilar `node-pty` (requer python3+make+g++); copiar source + node_modules para stage runtime; alterar CMD para `start-dashboard.sh`. | High — Dockerfile.dashboard tocado em qualquer release; stage terminal-build deve ser mantido | Container dashboard: porta 32352 responde WebSocket; chat de agente abre terminal sem erro |
| Scheduler CMD fix | `Dockerfile.swarm` | *(beta.9)* | Serviço `runtime` no Swarm entrava em restart loop. Causa: `CMD ["bash"]` no Dockerfile.swarm — bash sai imediatamente em container sem TTY. Fix: `CMD ["uv", "run", "python", "scheduler.py"]`. | Medium — Dockerfile.swarm estável mas pode ser tocado em atualizações do scheduler | Serviço runtime no Swarm: container permanece up; `scheduler.py` inicia e processa tarefas |
| Claude auth writable credentials/config + executable override + trust prompt fix | `clever-agent.stack.yml`, `dashboard/terminal-server/src/claude-bridge.js`, `docs/clever-agent/claude-auth-container-mount.md` | *(beta.10 — stack + code fix, sem rebuild de imagem nova)* | Chat e terminal TUI de todos os agentes não funcionavam. Causa 1: `.credentials.json:ro` → Claude Code trava silenciosamente no startup (OAuth token refresh exige escrita). Causa 2: `.claude.json:ro` → Claude Code 2.1.152 escreve session state/trust/timestamps neste arquivo; TUI renderizava em branco com `:ro`. Causa 3: SDK usava binário bundlado `v2.1.119` que falha silenciosamente. Causa 4: `claude-bridge.js` só detectava trust prompt antigo (`Do you trust the files`); Claude 2.1.152 usa `Is this a project you created or one you trust?` / `Quick safety check`. Fix: `.credentials.json:rw`; `.claude.json:rw`; `CLAUDE_CODE_EXECUTABLE=/usr/bin/claude`; trust prompt expandido para 3 padrões. | **High** — stack e bridge tocados após qualquer atualização de imagem ou Claude SDK; `.claude.json:rw` é regra permanente para Claude 2.1.152+ | `docker exec <dashboard> /usr/bin/claude status` → conta autenticada; Oracle Terminal renderiza `╭───Claude Code v2.1.152`; Oracle Chat retorna resposta; trust prompt auto-aceito |

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
