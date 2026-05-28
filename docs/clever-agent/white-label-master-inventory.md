# Clever Agent — White-label Master Inventory

**Branch:** `clever-dev`
**Last updated:** 2026-05-28
**Purpose:** Authoritative single-source inventory of every Clever Agent customization on top of upstream Evo Nexus.
After any upstream merge into `clever-dev`, follow §5 (Reapply Workflow) and verify every row in this document.

---

## 1. Purpose

This document is the authoritative inventory for reapplying all Clever Agent customizations after upstream merges.

- Each patch is catalogued with: files, commit, code snippet or rule, reapply risk, and validation command.
- The detailed patch ledger is at `docs/clever-agent/white-label-patch-ledger.md`.
- Detailed per-patch docs are linked where they exist.
- The goal: after a merge, an agent follows this document and spends time **only on new upstream changes**, not rediscovering old fixes.

---

## 2. Brand mapping

| Upstream term | Clever Agent term | Scope |
|---|---|---|
| `EvoNexus` / `Evo Nexus` / `Evo-Nexus` | `Clever Agent` | Product name — all user-facing and agent-facing text |
| `evonexus` (slug, visible text) | `clever-agent` | Visible slugs and texts only |
| `Evo CRM` / `EVO CRM` / `Evolution CRM` | `Clever AI` | CRM platform white-label — user-facing and agent-facing |
| `evo-crm` (visible slug) | `clever-ai` | Visible slugs only |
| Upstream technical identifiers (see §4) | **Preserve** | Imports, packages, DB names, env vars, CLI binaries |

---

## 3. Patch categories

### 3.1 Visual brand assets

**Commits:** `8638de0`, `c576151`, `a2ed5dc`
**Docs:** `docs/clever-agent/branding-cleanup.md`
**Reapply risk:** Medium

| File | Customization | Rule | Validation |
|---|---|---|---|
| `brand/clever-agent/logo-horizontal.svg` | Clever Agent horizontal logo (source of truth) | Never overwrite | Check file exists and is Clever Agent SVG |
| `brand/clever-agent/logo-horizontal-dark.svg` | Dark variant | Never overwrite | Check exists |
| `brand/clever-agent/app-icon.svg` | App icon / symbol | Never overwrite | Check exists |
| `dashboard/frontend/public/clever-agent.svg` | Logo for light backgrounds | Never overwrite | Check sidebar logo renders |
| `dashboard/frontend/public/clever-agent-dark.svg` | Logo for dark backgrounds | Never overwrite | Check login + setup logo renders |
| `dashboard/frontend/public/clever-agent-icon.svg` | Icon only (navbar, small) | Never overwrite | Check favicon/icon renders |
| `dashboard/frontend/public/favicon.svg` | Browser favicon | Never overwrite | Check browser tab icon |
| `dashboard/frontend/public/favicon.png` | Browser favicon PNG | Never overwrite | Check browser tab icon |

**Logo usage rules:**
- Dark backgrounds (login, setup, dashboard sidebar): `clever-agent-dark.svg`
- Light backgrounds (site, email): `clever-agent.svg`
- Icon-only contexts: `clever-agent-icon.svg`

---

### 3.2 Avatar / persona assets

**Commit:** `ba52926`
**Docs:** `docs/clever-agent/avatar-whitelabel.md`, `docs/clever-agent/agent-avatar-inventory.md`
**Reapply risk:** Medium

| Location | Count | Format | Rule |
|---|---|---|---|
| `brand/clever-agent/avatars/avatar_{slug}.png` | 38 PNGs | PNG 400×400 | Source of truth for each persona |
| `brand/clever-agent/avatars/avatar_{slug}.svg` | 38 SVGs | SVG | Source/reference SVGs |
| `dashboard/frontend/public/clever-agent/avatars/avatar_{slug}.png` | 38 PNGs | PNG | Served by Vite; must match brand/ |
| `dashboard/frontend/src/lib/agent-meta.ts` | paths | `.png` extension | All avatar paths must point to `/clever-agent/avatars/avatar_{slug}.png` (not `.webp`) |
| `dashboard/backend/agent_meta_seed.py` | paths | `.png` extension | Must match agent-meta.ts slugs |

**Reapply check:**
```bash
# All avatar paths in agent-meta.ts must be .png not .webp
grep "avatar" dashboard/frontend/src/lib/agent-meta.ts | grep -v "png"
# Expected: no results

# 38 PNGs in public
ls dashboard/frontend/public/clever-agent/avatars/*.png | wc -l
# Expected: 38
```

---

### 3.3 Theme / color palette

**Commits:** `964d903`, `8d430c0`, `41cc42a`, `ace7cc8`
**Docs:** `docs/clever-agent/theme-color-audit.md`, `docs/clever-agent/onboarding-color-audit-0.33.0-clever-beta.2.md`
**Reapply risk:** High (90+ UI files; any upstream UI change may reintroduce old colors)

#### Dashboard theme tokens (`dashboard/frontend/src/index.css`)

```css
:root {
  --clever-agent-green-900: #19402A;
  --clever-agent-green-800: #255938;
  --clever-agent-green-600: #41A650;
  --clever-agent-green-300: #85F2A0;
  --clever-agent-yellow-500: #F2CB05;
  --bg-primary: #0D1B12;
  --bg-card: #122018;
  --bg-sidebar: #091410;
  --border: #1E3829;
  /* ... full token list in theme-color-audit.md */
}
```

**Colors replaced (upstream → Clever Agent):**

| Upstream color | Clever Agent replacement | Context |
|---|---|---|
| `#00FFA7` | `#85F2A0` | Primary green accent |
| `#0b1018`, `#0f1520`, `#152030`, `#1e2a3a` | `#091410`, `#0D1B12`, `#101E16`, `#122018` | Dark navy → deep green backgrounds |
| Amber `#F59E0B`, `#FCD34D` | `#F2CB05` | Yellow accent (8 UI points) |

**Site theme (`site/src/index.css`):**

```css
--primary: 129 44% 45%;         /* Clever Agent green */
--ring: 135 65% 62%;            /* Clever Agent mint accent */
```

**Validation:**
```bash
# Zero upstream accent color remaining in frontend source
grep -rn "#00FFA7" dashboard/frontend/src/ --include="*.tsx" --include="*.ts" --include="*.css"
# Expected: 0 results

# Zero upstream navy backgrounds
grep -rn "#0b1018\|#0f1520\|#152030\|#1e2a3a" dashboard/frontend/src/ --include="*.tsx" --include="*.css"
# Expected: 0 results (onboarding restore flow was fixed in ace7cc8)
```

**Onboarding restore flow (covered in `ace7cc8`):**
Files that also needed palette fix (created upstream after the initial palette patch):
- `dashboard/frontend/src/pages/onboarding/OnboardingHeader.tsx`
- `dashboard/frontend/src/pages/onboarding/StepProvider.tsx`
- `dashboard/frontend/src/pages/onboarding/StepBrainRepo.tsx`
- `dashboard/frontend/src/pages/Setup.tsx` (back-button)
- `dashboard/frontend/src/pages/restore/RestoreSelectRepo.tsx`
- `dashboard/frontend/src/pages/restore/RestoreSelectSnapshot.tsx`
- `dashboard/frontend/src/pages/restore/RestoreExecute.tsx`
- `dashboard/frontend/src/pages/restore/RestoreConfirm.tsx`

---

### 3.4 Text / UI branding patches

**Commits:** `22429a0`, `2f72871`, `7d556af`, `fe49ec9`
**Reapply risk:** High

| File | Patch | Rule | Validation |
|---|---|---|---|
| `dashboard/frontend/index.html` | `<title>Clever Agent</title>` | Upstream resets to "EvoNexus" | Browser tab shows "Clever Agent" |
| `dashboard/frontend/src/lib/api.ts` | `const API = ''` (line 1) | Upstream hardcodes `localhost:8080` | Network requests route correctly |
| `dashboard/frontend/src/pages/Login.tsx` | Logo `clever-agent-dark.svg`; no "Open source" banner | Upstream may restore banner | Login page: Clever Agent logo, no upstream CTAs |
| `dashboard/frontend/src/pages/Agents.tsx` | `t('agents.subtitle')` — subtitle key | Upstream may hardcode EvoNexus text | Agents page: subtitle in pt-BR from i18n |
| `dashboard/frontend/src/pages/Docs.tsx` | `const API = ''`; `whiteLabel()` function replaces EvoNexus→Clever Agent at runtime; neutralize upstream install commands | High — upstream updates Docs.tsx often | `/docs` shows "Clever Agent Docs"; `/docs/getting-started` shows `clever-agent setup` |
| `dashboard/frontend/src/pages/Goals.tsx` | `const API = ''` (line 71) | Upstream hardcodes `localhost:8080` | `/goals` loads without error |
| `dashboard/frontend/src/pages/Setup.tsx` | Footer "Clever Agent" link; no "Built on EvoNexus"; Clever Agent palette on cards | High — Setup rewritten often | Setup: no "EvoNexus" visible; green palette |
| `dashboard/frontend/src/pages/onboarding/Welcome.tsx` | No "Built on EvoNexus" footer | Same as Setup | Onboarding: no upstream footer |
| `dashboard/frontend/src/components/Sidebar.tsx` | `clever-agent-dark.svg` logo; no upstream credits | Sidebar logo Clever Agent | Sidebar: Clever Agent logo visible |
| `dashboard/frontend/src/pages/TicketDetail.tsx` | Context injection: "on Clever Agent" | Preserves Clever Agent brand in agent context | Agent chat context mentions "Clever Agent" |
| `dashboard/frontend/src/pages/Backups.tsx` | `backups/clever-agent/` hint | Minor text | Backup hint correct |
| `dashboard/frontend/src/pages/UIPlayground.tsx` | `UI Playground` (no `@evonexus/ui` prefix) | Minor text | UI Playground header |

**Onboarding wizard files (all must have no "Built on EvoNexus" and green palette):**
- `StepProvider.tsx`, `StepConfirm.tsx`, `StepBrainRepo.tsx`, `StepBrainChoose.tsx`, `StepBrainConnect.tsx`

---

### 3.5 Agent-facing content (`.claude/`)

**Commit:** `3a137b3`
**Docs:** `docs/clever-agent/agent-facing-branding-cleanup.md` §3, §8
**Reapply risk:** High — upstream merge overwrites `.claude/` on almost every release

All files in `.claude/` are read directly by Claude Code as context. Upstream brand strings become agent responses.

| Directory | Files affected | Pattern replaced |
|---|---|---|
| `.claude/agents/` | `oracle.md` (7×), `apex-architect.md`, `flow-git.md` | `EvoNexus` → `Clever Agent` |
| `.claude/commands/` | `oracle.md` | `EvoNexus` → `Clever Agent` |
| `.claude/rules/` | `agents.md`, `dev-phases.md`, `heartbeats.md` | `EvoNexus` → `Clever Agent` |
| `.claude/skills/` | 38 SKILL.md files with occurrences | `EvoNexus` → `Clever Agent` |
| `.claude/templates/html/` | `morning-briefing.html`, `weekly-review.html` | `EvoNexus` → `Clever Agent` |

**Terminal server context injections (`dashboard/terminal-server/src/chat-bridge.js`):**
```js
// Line ~248 (chat mode):
'You are running inside Clever Agent dashboard chat.'
// Line ~439 (terminal mode):
'You are running inside the Clever Agent dashboard.'
```

**Backend agent-visible content:**
- `dashboard/backend/brain_repo/manifest.py` — Brain Repo README template (lido por agentes)
- `dashboard/backend/brain_repo/job_runner.py` — git commit author: `clever-agent`
- `dashboard/backend/routes/brain_repo.py` — git commit author: `clever-agent`
- `scheduler.py` — startup print: `Clever Agent Scheduler`
- `backup.py` — argparse description: `Clever Agent`

**Validation:**
```bash
grep -rn "EvoNexus\|Evo Nexus" .claude/ --include="*.md"
# Expected: 0 results

grep -n "EvoNexus" dashboard/terminal-server/src/chat-bridge.js
# Expected: 0 results
```

---

### 3.6 EvoNexus → Clever Agent substitution (non-.claude files)

**Commit:** `3a137b3`
**Docs:** `docs/clever-agent/agent-facing-branding-cleanup.md` §3
**Reapply risk:** High

| File group | Occurrences | Notes |
|---|---|---|
| `docs/` (32 files, excluding `docs/clever-agent/`) | ~200+ | All user-facing docs |
| `site/src/i18n/en.json`, `pt-BR.json`, `es.json`, `index.ts` | ~30 | Site marketing strings |
| `workspace/learning/README.md`, `config/workspace.example.yaml` | ~5 | Workspace seeds |
| `cli/templates/plugin-skeleton/agents/example.md`, `README.md` | ~3 | Plugin template user-visible text |

**Validation:**
```bash
grep -rn "EvoNexus\|Evo Nexus" docs/ --exclude-dir=clever-agent
# Expected: 0 results

grep -rn "EvoNexus\|Evo Nexus" site/src/ .claude/ workspace/ --include="*.md" --include="*.json" --include="*.ts"
# Expected: 0 results
```

---

### 3.7 Evo CRM → Clever AI substitution

**Commit:** `6163ce1`
**Docs:** `docs/clever-agent/agent-facing-branding-cleanup.md` §7
**Reapply risk:** High

| File | Occurrences | Notes |
|---|---|---|
| `.claude/agents/canvas-designer.md` | 1 | Example use case text |
| `.claude/agents/dex-data.md` | 2 | Data source description |
| `.claude/agents/zara-cs.md` | 1 | Integration description |
| `.claude/skills/int-evo-crm/SKILL.md` | 1 | H1 heading only (technical `name:` preserved) |
| `.claude/skills/data-analyze/SKILL.md` | 3 | Description, source table, example |
| `.claude/skills/data-build-dashboard/SKILL.md` | 2 | Description, step |
| `.claude/skills/data-create-viz/SKILL.md` | 2 | Description, conditional |
| `.claude/skills/data-explore/SKILL.md` | 2 | Description, conditional |
| `.claude/skills/data-statistical-analysis/SKILL.md` | 2 | Causality examples |
| `.claude/skills/data-validate/SKILL.md` | 2 | Description, example |
| `.claude/skills/data-write-query/SKILL.md` | 3 | Description, comment, example |
| `.claude/skills/pm-metrics-review/SKILL.md` | 1 | Source table |
| `.claude/skills/pm-synthesize-research/SKILL.md` | 4 | Data sources, persona sizing |
| `.claude/skills/pulse-faq-sync/SKILL.md` | 1 | Section heading |
| `.claude/skills/sage-competitive-analysis/SKILL.md` | 1 | Competitive table |
| `docs/integrations/evo-crm.md` | 9 | Title + all product references |
| `docs/integrations/overview.md` | 2 | Integration list |
| `dashboard/backend/routes/integrations.py` | 2 | Integration name + comment |
| `dashboard/frontend/src/lib/integrationMeta.ts` | 2 | Field hints (env var keys preserved) |
| `README.md` | 2 | Integration list |
| `README.swarm.md` | 2 | Integration list + network table |

**Preserved (must NOT be substituted):**

| Identifier | Type | Reason |
|---|---|---|
| `int-evo-crm` | Skill ID / folder name / YAML `name:` | Technical identifier used programmatically |
| `EVO_CRM_TOKEN`, `EVO_CRM_URL` | Env var keys | Used in containers; renaming breaks configs |
| `evo_crm_client.py` | Script filename | Path referenced in skill SKILL.md commands |
| `evo-crm-community` | GitHub repo name | External repo, not controlled by Clever Agent |
| `evo-crm.md` | Docs filename | Internal links point to this path |

**Validation:**
```bash
grep -rn "Evo CRM" .claude/ docs/ dashboard/ README.md README.swarm.md --include="*.md" --include="*.ts" --include="*.py"
# Expected: 0 results
```

---

### 3.8 Runtime / Claude / Terminal patches

**Commits:** `9cc835e`, `efc8899`, `00c220d`
**Docs:** `docs/clever-agent/claude-auth-container-mount.md`, `docs/clever-agent/terminal-server-dashboard-fix.md`
**Reapply risk:** High — Dockerfile.dashboard and stack.yml are touched after any image update

#### `Dockerfile.dashboard` — three separate patches

| Patch | Lines | Code | Commit |
|---|---|---|---|
| `terminal-build` stage | `FROM node:22-slim AS terminal-build` | Builds `node-pty` native module (requires build tools); copied to runtime stage | `00c220d` |
| Provider CLIs | Stage runtime: `npm install -g @anthropic-ai/claude-code @gitlawb/openclaude@latest && npm cache clean --force` | Required for `providers.py` `shutil.which()` check | `573eae8` |
| `init-config.sh` entrypoint | Seeds `/workspace/config/` from `_config_defaults/` on first boot | Ensures `providers.example.json` is present for onboarding | `2f72871` |
| CMD | `CMD ["/usr/local/bin/start-dashboard.sh"]` | Starts both terminal-server (port 32352) + Flask | `00c220d` |

#### `Dockerfile.swarm` — scheduler CMD fix

| Patch | Code | Commit |
|---|---|---|
| Runtime CMD | `CMD ["uv", "run", "python", "scheduler.py"]` (replaces `CMD ["bash"]`) | `00c220d` |

#### `start-dashboard.sh`

Starts terminal-server process on port 32352, then Flask. **Do not change CMD back to Flask-only.**

#### `clever-agent.stack.yml`

**Three permanent rules — all must survive any stack update:**

```yaml
services:
  dashboard:
    volumes:
      - /home/claude/.claude/.credentials.json:/root/.claude/.credentials.json:rw  # MUST be :rw
      - /home/claude/.claude.json:/root/.claude.json:rw                             # MUST be :rw
    environment:
      - CLAUDE_CODE_EXECUTABLE=/usr/bin/claude  # MUST point to system binary
```

| Rule | Why | Consequence if missing |
|---|---|---|
| `.credentials.json:rw` | Claude Code writes OAuth refresh token on startup | TUI hangs silently; chat returns 0 messages |
| `.claude.json:rw` | Claude Code 2.1.152+ writes session state and trust decisions | TUI renders blank/frozen |
| `CLAUDE_CODE_EXECUTABLE=/usr/bin/claude` | Overrides bundled SDK binary v2.1.119 (fails silently) | Chat responses never arrive |

**`runtime` service: NO auth mounts.** `scheduler.py` is Python-only; it does not invoke the Claude CLI.

#### `dashboard/terminal-server/src/claude-bridge.js` — trust prompt detection

```js
const isTrustPrompt =
  dataBuffer.includes('Do you trust the files in this folder?') ||        // Claude ≤2.1.119
  dataBuffer.includes('Is this a project you created or one you trust?') || // Claude 2.1.152+
  dataBuffer.includes('Quick safety check');                               // Claude 2.1.152+ header
```

**All three patterns must be present.** Claude Code changed the trust prompt text in v2.1.152. If only the old pattern is present, the trust prompt will never be auto-accepted in newer Claude versions.

**Validation:**
```bash
# Verify system binary is used
docker exec <dashboard_container> /usr/bin/claude status
# Expected: authenticated account, no permission errors

# Verify terminal TUI
# Agents → Oracle → Terminal
# Expected: banner "╭───Claude Code v2.1.152"

# Verify port 32352 is open
docker exec <dashboard_container> curl -s http://localhost:32352/health
```

---

### 3.9 Providers patches

**Commits:** `bacfc49`, `573eae8`
**Docs:** `docs/clever-agent/providers-page-toggle-fix.md`, `docs/clever-agent/providers-cli-dashboard-image-fix.md`
**Reapply risk:** Medium-High

#### `dashboard/frontend/src/pages/Providers.tsx` — toggle disabled logic

```tsx
// WRONG (upstream original):
disabled={!isInstalled || toggling === id}
// Active provider locked out when CLI not installed

// CORRECT (Clever Agent fix):
disabled={toggling === prov.id || (!isInstalled && !isActive)}
// Active provider stays clickable even without CLI
```

Additional: inline "CLI ausente" hint for inactive providers without CLI.

**Validation:**
- Provider active (Anthropic) → toggle enabled even when `claude_installed: false`
- Inactive providers without CLI → toggle disabled + shows "CLI ausente" hint
- Configure and Save & Activate → unchanged behavior

#### `Dockerfile.dashboard` — provider CLIs in image

```dockerfile
RUN npm install -g \
    @anthropic-ai/claude-code \
    @gitlawb/openclaude@latest \
    && npm cache clean --force
```

Without this, `providers.py`'s `shutil.which('claude')` returns `None` → all providers show "not installed".

**Validation:**
```bash
docker exec <dashboard_container> which claude     # → /usr/bin/claude
docker exec <dashboard_container> which openclaude  # → /usr/bin/openclaude
# Providers page: claude_installed: true
```

---

### 3.10 Brain repo / restore patches

**Commits:** `ec0ffad` (beta.4), `baba52d` (beta.5), `6bdf918` (beta.6)
**Docs:** `docs/clever-agent/brain-repo-restore-snapshots-fix.md`, `docs/clever-agent/brain-repo-restore-start-fix.md`
**Reapply risk:** High — `brain_repo.py` and restore/ components updated often

| File | Patch | Commit |
|---|---|---|
| `dashboard/backend/routes/brain_repo.py` | `snapshots()` accepts `?token&owner&repo` query params for temporary mode (no DB config needed during onboarding) | `ec0ffad` |
| `dashboard/backend/routes/brain_repo.py` | `restore_start()` accepts `token`/`owner`/`repo` in POST body for temporary mode | `6bdf918` |
| `dashboard/backend/brain_repo/github_api.py` | `validate_pat_scopes()` — case-insensitive header lookup for `X-OAuth-Scopes` | `baba52d` |
| `dashboard/backend/brain_repo/github_api.py` | `list_snapshots()` — treat 404 as empty tag list (not early return) so HEAD commit is still fetched | `baba52d` |
| `restore/RestoreSelectRepo.tsx` | Propagates `token`/`owner`/`repoName` through SelectRepo → Flow → SelectSnapshot | `ec0ffad` |
| `restore/RestoreFlow.tsx` | Passes token/owner/repo params to RestoreExecute | `6bdf918` |
| `restore/RestoreExecute.tsx` | Builds dynamic POST body with optional token params; improved `!res.ok` error handling with JSON parsing + pt-BR mapping | `6bdf918` |
| `dashboard/backend/brain_repo/manifest.py` | README template: "Clever Agent Brain Repo" | `3a137b3` |
| `dashboard/backend/brain_repo/job_runner.py` | git commit author: `clever-agent` | `3a137b3` |

**Validation:**
- Restore flow: SelectRepo → SelectSnapshot works without "Brain repo not connected" (400) error
- Repos with no tags: shows HEAD snapshot
- Restore execution: SSE stream starts correctly

---

### 3.11 Setup / password validation patch

**Commit:** `344269d`
**Docs:** `docs/clever-agent/setup-password-validation-fix.md`
**Reapply risk:** High — `app.py` and `Setup.tsx` touched on most upstream releases

| File | Patch |
|---|---|
| `dashboard/backend/app.py` | `@app.errorhandler(HTTPException)` returns JSON `{"error": str(e.description)}` for `/api/` routes; HTML error responses for non-API routes preserved |
| `dashboard/frontend/src/pages/Setup.tsx` | `pwViolations()` function mirrors backend password rules; `parseApiError()` maps errors to pt-BR; real-time password checklist in UI; minimum 6→8 chars |
| `dashboard/frontend/src/i18n/locales/pt-BR/index.ts` | pt-BR translations for all password violation messages |

**Validation:**
- Setup account step: typing password shows real-time checklist
- Submitting weak password: shows pt-BR message (not raw HTML)
- Network: response is JSON `{"error": "..."}` not HTML 400

---

### 3.12 Docker / image optimization

**Commit:** `7334991`
**Docs:** `docs/clever-agent/image-size-optimization.md`
**Reapply risk:** Medium — Dockerfile touched on any upstream release

| Optimization | File | Code | Size savings |
|---|---|---|---|
| `uv cache clean` in same RUN layer | `Dockerfile.dashboard`, `Dockerfile.swarm` | `RUN uv venv .venv && uv sync --no-dev && uv cache clean` | ~5.1 GB dashboard, ~5.1 GB runtime |
| `npm cache clean --force` in same RUN layer | `Dockerfile.dashboard` | Same RUN block as `npm install -g ...` | ~225 MB |
| `Dockerfile.swarm.dockerignore` | `Dockerfile.swarm.dockerignore` | Excludes `site/node_modules/`, `dashboard/frontend/`, `**/node_modules` | ~711 MB from runtime build context |

**Before/after:**

| Image | Before | After |
|---|---|---|
| `clever-agent-dashboard` | 11 GB | 3.45 GB (-68.6%) |
| `clever-agent-runtime` | 11.4 GB | 9.61 GB (-15.7%) |

**Rule:** `uv cache clean` must be in the **same** `RUN` layer as `uv sync`. Separate layers do not reduce final image size (Docker layer caching).

---

### 3.13 Stack / deploy operations

**Files:** `clever-agent.stack.yml`
**Docs:** `docs/clever-agent/beta-release-0.33.0-clever-beta.1.md`, beta-fixes docs

#### Stack deployment rules

| Rule | Detail |
|---|---|
| Stack name on VPS | `clever_agent_beta` |
| Deploy via | Portainer > Stacks > clever_agent_beta > Editor |
| Images | Use explicit semantic tags (e.g. `0.33.0-clever-beta.9`); **never** `latest` |
| Auth volumes preflight | Verify `/home/claude/.claude/.credentials.json` and `/home/claude/.claude.json` exist on Swarm manager node before deploy |
| Storage volumes | Named volumes auto-created by Swarm on first deploy; persist across restacks |
| Rollback | Change image tag in stack and redeploy; do NOT keep old images locally for rollback |
| Docker storage cleanup | `docker system prune -f` periodically; `docker image prune -a --filter "until=168h"` to reclaim space |
| No `latest` tag | All published images use explicit version tags only |

#### GHCR image tagging convention

```
ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.{N}
ghcr.io/danielsavoia/clever-agent-runtime:0.33.0-clever-beta.{N}
```

Never publish `latest`. Always use the explicit beta tag.

#### Docker Swarm storage policy

- Worker nodes do NOT cache images between deployments.
- There is no local rollback. Rollback by changing the stack tag to a previous published GHCR tag.
- Old images accumulate on worker nodes; periodic `docker image prune` is required.

---

## 4. Preserved upstream technical identifiers

These patterns MUST NOT be substituted, renamed, or modified in any white-label pass:

| Pattern / File | Category | Reason |
|---|---|---|
| `evonexus.db` | DB filename | SQLite database file — renaming breaks containers in production |
| `_evonexus_managed` | JSON sentinel | Identifies managed hooks in `.claude/settings.json`; renaming breaks hook idempotency |
| `evonexus_version` | Plugin schema field | Validated in `plugin_schema.py`; existing plugin manifests use this key |
| `evonexus_dim` | Python internal variable | `auto_migrator.py` internal |
| `@evoapi/evonexus-ui` | npm package | Real npm package — all imports and CSS `@import` statements |
| `@evoapi/evo-nexus` | npm CLI package | CLI commands in README templates |
| `evonexus-backup-*.zip` | Glob pattern | Used to find existing backup files; renaming breaks restore of old backups |
| `evonexus-pg-*` | Temp file prefix | Technical temporary files |
| `evonexus-backups/` | S3 prefix | S3 bucket compatibility — renaming breaks existing cloud backups |
| `evonexus` (CLI binary) | `pyproject.toml` entry point | CLI binary definition; renaming requires rebuild and repackaging |
| `evonexus-migrate` | `pyproject.toml` entry point | Same as above |
| `~/.cache/evonexus/` | Filesystem path | Installation sentinels |
| `~/.evonexus_*`, `~/.claude.json.evonexus.lock` | Lock/log files | Filesystem locks and logs |
| `evonexus-knowledge-uploads` | Temp directory | Technical temp directory |
| `PRODUCT = "evo-nexus"` | `licensing.py` | External licensing API product identifier |
| `User-Agent: EvoNexus/...` | HTTP header | External licensing API header |
| `application_name: "evonexus-*"` | PostgreSQL connection | Connection pool identifier |
| `localStorage keys evonexus.*` | Browser storage | Existing user browser data; renaming loses user settings |
| `initEvoNexusSdk()` | Function in `evonexus-sdk.ts` | Renaming requires updating file and all imports |
| `min_evonexus_version` | Plugin schema field | `plugin_schema.py` validation; manifests use this key |
| `dashboard/cli/evonexus_*.py` | Python module names | Import references throughout codebase |
| `.github/workflows/` | CI/CD files | Upstream CI — technical |
| `CHANGELOG.md`, `CONTRIBUTING.md`, `NOTICE.md`, `TRADEMARKS.md`, `SECURITY.md` | Legal/upstream docs | Not read by agents in normal sessions |
| `evonexus.stack.yml` | Upstream stack file | Reference only |
| `package.json` `@evoapi/*` | npm package names | Real npm package names |
| `pyproject.toml`, `setup.py` | Python package names | Build system |
| Test files | Any `tests/` | Test upstream behavior — technical |
| **CRM-specific** | | |
| `int-evo-crm` | Skill ID / folder / YAML `name:` | Programmatic identifier for CRM skill |
| `EVO_CRM_TOKEN`, `EVO_CRM_URL` | Environment variables | Container env var keys |
| `evo_crm_client.py` | Script filename | Referenced in SKILL.md command paths |
| `evo-crm-community` | GitHub repo name | External repository |
| `evo-crm.md` | Documentation filename | Internal links |

---

## 5. Reapply workflow after upstream update

After any `git merge upstream-sync` into `clever-dev`:

### Step 1 — Check working tree

```bash
git status --short --branch
# Expected: clean tree (only _tmp/ untracked)
```

### Step 2 — Brand scan (run first, fix before anything else)

```bash
# EvoNexus brand
grep -rn "EvoNexus\|Evo Nexus" .claude/ docs/ site/src/ dashboard/terminal-server/ \
  --include="*.md" --include="*.json" --include="*.ts" --include="*.tsx" --include="*.js" \
  --include="*.html" --exclude-dir=node_modules --exclude-dir=.git \
  | grep -v "docs/clever-agent/"
# Expected: 0 results

# Evo CRM brand
grep -rn "Evo CRM\|EVO CRM" .claude/ docs/ dashboard/ README.md README.swarm.md \
  --include="*.md" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.py" \
  --exclude-dir=node_modules --exclude-dir=.git
# Expected: 0 results
```

### Step 3 — Per-file quick checks (high-risk files)

```bash
# Dashboard root URL
grep -n "localhost:8080" dashboard/frontend/src/lib/api.ts dashboard/frontend/src/pages/Goals.tsx dashboard/frontend/src/pages/Docs.tsx
# Expected: 0 results

# index.html title
grep -n "<title>" dashboard/frontend/index.html
# Expected: <title>Clever Agent</title>

# Dockerfile.dashboard CMD
grep -n "^CMD\|^ENTRYPOINT" Dockerfile.dashboard
# Expected: init-config.sh entrypoint + start-dashboard.sh CMD

# Dockerfile.swarm CMD
grep -n "^CMD" Dockerfile.swarm
# Expected: CMD ["uv", "run", "python", "scheduler.py"]

# Stack auth volumes
grep -n "credentials.json\|claude.json\|CLAUDE_CODE_EXECUTABLE" clever-agent.stack.yml
# Expected: both :rw mounts + CLAUDE_CODE_EXECUTABLE=/usr/bin/claude

# Trust prompt patterns (all 3 must be present)
grep -n "trust the files\|project you created\|Quick safety check" dashboard/terminal-server/src/claude-bridge.js
# Expected: 3 matches

# Providers toggle fix
grep -n "isInstalled && !isActive" dashboard/frontend/src/pages/Providers.tsx
# Expected: 1 match

# Provider CLIs in Dockerfile
grep -n "claude-code\|openclaude" Dockerfile.dashboard
# Expected: both present
```

### Step 4 — uv/npm cache cleanup still in same RUN layer

```bash
grep -A3 "uv sync" Dockerfile.dashboard | grep "uv cache clean"
# Expected: uv cache clean in same line/layer

grep -A3 "openclaude" Dockerfile.dashboard | grep "npm cache clean"
# Expected: npm cache clean --force in same RUN block
```

### Step 5 — Avatar paths are .png

```bash
grep "avatar" dashboard/frontend/src/lib/agent-meta.ts | grep -v "\.png"
# Expected: 0 results (all must end in .png)
```

### Step 6 — Color check

```bash
grep -rn "#00FFA7\|#0b1018\|#0f1520" dashboard/frontend/src/ --include="*.tsx" --include="*.css" | grep -v node_modules
# Expected: 0 results

grep -n "primary.*129\|ring.*135" site/src/index.css
# Expected: both Clever Agent green values present
```

### Step 7 — Build validation

```bash
cd dashboard/frontend && npm run build
# Expected: ✓ built in <30s, no TypeScript errors

# JS syntax check for terminal-server files
node --check dashboard/terminal-server/src/claude-bridge.js
node --check dashboard/terminal-server/src/chat-bridge.js
```

### Step 8 — Reapply patches where needed

For each diff that shows upstream overwrite, reapply per the relevant section in this document (§3.x).

Reapply order (lowest risk first):
1. `index.html` title
2. `api.ts` const API
3. `Docs.tsx` + `Goals.tsx` const API + whiteLabel()
4. Brand text substitutions (sed pass on .claude/, docs/)
5. Evo CRM substitutions (sed pass)
6. Avatar paths
7. Color tokens (index.css + affected UI files)
8. Onboarding wizard / restore flow palette
9. Docker CMDs and cache cleanup
10. Stack auth volumes + CLAUDE_CODE_EXECUTABLE
11. Trust prompt patterns
12. Providers toggle fix
13. Provider CLIs in Dockerfile
14. Brain repo temporary-mode params

### Step 9 — Post-reapply validation

```bash
# Build
cd dashboard/frontend && npm run build

# Oracle smoke test (requires deployed container)
# Agents → Oracle → Chat → "Who are you?"
# Expected: Response mentions "Clever Agent" not "EvoNexus"

# Terminal TUI
# Agents → Oracle → Terminal
# Expected: banner "╭───Claude Code v2.1.152"
```

### Step 10 — Commit and push

```bash
git add docs/clever-agent  # docs first
git add <patched-files>
git commit -m "reapply: Clever Agent patches after upstream v0.X.Y merge"
git push origin clever-dev
```

Do NOT promote to `clever-beta` without explicit user authorization.

---

## 6. Validation commands reference

### Brand scan

```bash
# EvoNexus in agent/user-facing files
grep -rn "EvoNexus\|Evo Nexus\|Evo-Nexus" \
  .claude/ docs/ site/src/ workspace/ config/ \
  dashboard/terminal-server/src/ \
  dashboard/frontend/src/pages/ dashboard/frontend/src/components/ \
  --include="*.md" --include="*.json" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.html" \
  --exclude-dir=node_modules --exclude-dir=.git \
  | grep -v "docs/clever-agent/"
# Expected: 0 results

# Evo CRM
grep -rn "Evo CRM\|EVO CRM\|Evolution CRM" \
  .claude/ docs/ dashboard/ README.md README.swarm.md \
  --include="*.md" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.py" \
  --exclude-dir=node_modules --exclude-dir=.git
# Expected: 0 results
```

### Color scan

```bash
# Upstream green accent
grep -rn "#00FFA7" dashboard/frontend/src/ --include="*.tsx" --include="*.ts" --include="*.css" | grep -v node_modules
# Expected: 0 results

# Upstream navy (must be 0 in UI files)
grep -rn "#0b1018\|#0f1520\|#152030\|#1e2a3a" dashboard/frontend/src/ --include="*.tsx" --include="*.css" | grep -v node_modules
# Expected: 0 results
```

### Asset checks

```bash
# Favicons and logos present
ls dashboard/frontend/public/clever-agent.svg dashboard/frontend/public/clever-agent-dark.svg dashboard/frontend/public/clever-agent-icon.svg dashboard/frontend/public/favicon.svg dashboard/frontend/public/favicon.png

# Avatar count
ls dashboard/frontend/public/clever-agent/avatars/*.png | wc -l
# Expected: 38
```

### Docker checks

```bash
# Cache cleanup in same layer
grep -c "uv cache clean\|npm cache clean" Dockerfile.dashboard
# Expected: ≥2

# CMD correct
grep "^CMD\|^ENTRYPOINT" Dockerfile.dashboard
# Expected: init-config.sh ENTRYPOINT + start-dashboard.sh CMD

grep "^CMD" Dockerfile.swarm
# Expected: CMD ["uv", "run", "python", "scheduler.py"]
```

---

## 7. Pending work

| Item | Priority | Notes |
|---|---|---|
| Publish beta.10 dashboard + runtime images | High | After auth stack fix + branding fixes; awaiting user authorization |
| Terminal TUI validation post-deploy | High | Verify Oracle Terminal renders `╭───Claude Code v2.1.152` on VPS |
| Oracle chat smoke test post-deploy | High | Verify first response says "Clever Agent" not "EvoNexus" |
| `site/` full text audit (Etapa 6.1) | Medium | `site/src/` may still have upstream text in some components |
| Login page visual validation | Low | Requires logout to see; pending VPS access |
| `plugins_installed` migration | Low | Upstream schema change if still pending |
| `docs/clever-agent/` cleanup | Low | Some beta-fixes docs could be consolidated |
| Upstream v0.34+ merge | Future | When upstream releases next version, follow §5 workflow |

---

## 8. Document index

| Document | Purpose |
|---|---|
| **This file** (`white-label-master-inventory.md`) | Single-source authoritative inventory; start here after any upstream merge |
| `white-label-patch-ledger.md` | Quick-reference table of all patches with commits and risk levels |
| `white-label-overlay.md` | Detailed code snippets and substitution rules |
| `agent-facing-branding-cleanup.md` | Granular per-file tables for EvoNexus→Clever Agent and Evo CRM→Clever AI |
| `theme-color-audit.md` | Every color token replaced, with before/after values |
| `avatar-whitelabel.md` | Avatar PNG inventory and path mapping |
| `claude-auth-container-mount.md` | Stack auth volumes, CLAUDE_CODE_EXECUTABLE, trust prompt |
| `terminal-server-dashboard-fix.md` | Terminal-server multi-process Dockerfile fix |
| `providers-page-toggle-fix.md` | Providers.tsx toggle disabled logic fix |
| `providers-cli-dashboard-image-fix.md` | CLI binaries in Dockerfile.dashboard |
| `brain-repo-restore-snapshots-fix.md` | Snapshots during onboarding (no DB) fix |
| `brain-repo-restore-start-fix.md` | Restore start during onboarding fix |
| `setup-password-validation-fix.md` | Password validation and error display fix |
| `image-size-optimization.md` | Docker image size reduction (11GB → 3.45GB) |
| `onboarding-color-audit-0.33.0-clever-beta.2.md` | Restore flow + OnboardingHeader palette audit |
| `upstream-v033-reconciliation.md` | v0.33 upstream merge reconciliation notes |
| `governance.md` | Branch strategy and governance rules |
