# Clever Agent beta.10 Release Notes

**Version:** `0.33.0-clever-beta.10`
**Branch:** `clever-beta`
**Date:** 2026-05-28
**Status:** Released to GHCR

---

## Images

| Image | Tag | Digest | Real size |
|---|---|---|---|
| `clever-agent-dashboard` | `0.33.0-clever-beta.10` | `sha256:22a693c07e44ba357913e0a950ae2764e0f96d783c1258168aba42aafc917f5d` | 3.21 GB |
| `clever-agent-runtime` | `0.33.0-clever-beta.10` | `sha256:cd9e4f7e2488f4d48e1efcfd232cf13c19d5f489aabf7b9753de9cff88e1e3b1` | 2.99 GB |

Pull commands:
```bash
docker pull ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.10
docker pull ghcr.io/danielsavoia/clever-agent-runtime:0.33.0-clever-beta.10
```

---

## Commits included (clever-dev → clever-beta)

| SHA | Description |
|---|---|
| `428a385` | fix: normalize start-dashboard.sh to LF + add .gitattributes |
| `d09e021` | chore: promote Clever Agent beta.10 release candidate |
| `99a52ed` | docs: consolidate Clever Agent white-label master inventory |
| `6163ce1` | fix: replace Evo CRM brand with Clever AI in agent-facing content |
| `3a137b3` | fix: replace EvoNexus brand in agent-facing content |
| `efc8899` | fix: make Claude config writable and support new trust prompt |
| `7334991` | chore: optimize Docker image sizes (dashboard -68.6%, runtime -15.7%) |
| `00c220d` | fix: terminal-server multi-process in Dockerfile.dashboard; Scheduler CMD fix |

---

## What's in this release

### Bug fixes
- **CRLF fix in `start-dashboard.sh`:** Windows git was silently converting LF→CRLF in the shell script, causing `env: 'bash\r': No such file or directory` inside the container. Fixed by normalizing to LF. Added `.gitattributes` (`*.sh text eol=lf`, `Dockerfile* text eol=lf`) to prevent recurrence.
- **Claude auth writable volumes:** `.credentials.json` and `.claude.json` both mounted `:rw`. Required for Claude 2.1.152+.
- **`CLAUDE_CODE_EXECUTABLE` override:** Forces `/usr/bin/claude` instead of bundled SDK binary v2.1.119.
- **Trust prompt detection:** `claude-bridge.js` detects 3 patterns for the trust prompt.
- **Terminal-server multi-process:** `start-dashboard.sh` now starts both terminal-server (port 32352) and Flask (port 8080).
- **Scheduler CMD:** `Dockerfile.swarm` fixed from `CMD ["bash"]` (exits immediately) to `CMD ["uv", "run", "python", "scheduler.py"]`.

### Brand
- **EvoNexus → Clever Agent:** All agent-facing and user-facing content updated (~200 occurrences in 60+ files including `.claude/`, `docs/`, `dashboard/`, `scheduler.py`, `backup.py`).
- **Evo CRM → Clever AI:** Integration renamed in 21 files (~44 occurrences). Preserved: `int-evo-crm` (skill ID), `EVO_CRM_TOKEN`, `EVO_CRM_URL` (env vars), `evo_crm_client.py`.

### Performance
- **Dashboard image:** 11 GB → 3.21 GB real size (-70.8%) via `uv cache clean` in same RUN layer, `npm cache clean --force` in same build block, multi-stage build.
- **Runtime image:** 11.4 GB → 2.99 GB real size (-73.8%).

### Documentation
- **`white-label-master-inventory.md`** (new): Full authoritative single-source inventory of all 19 white-label patches with per-file tables, code snippets, commit SHAs, reapply workflows, validation commands.
- **`white-label-patch-ledger.md`** updated: All 19 patches, all commits filled in.
- **`white-label-overlay.md`** updated: Master reapply policy, agent-facing brand overlay rules.
- **`agent-facing-branding-cleanup.md`** updated: Granular per-file tables for both brand substitutions.

---

## Smoke test results

| Test | Result |
|---|---|
| Container starts without `bash\r` error | ✅ |
| Flask responds on port 8080 | ✅ HTTP 200 |
| Terminal-server responds on port 32352 | ✅ Port open |
| `[start-dashboard]` log line visible | ✅ |
| Config seeding cp errors (no volumes) | ✅ Expected, non-blocking |

---

## Stack

`clever-agent.stack.yml` updated to use `0.33.0-clever-beta.10` for both services.

---

## Upgrade from beta.9

1. Pull new images (Portainer will do this on stack redeploy)
2. Ensure `clever-agent.stack.yml` mounts `.credentials.json:rw` and `.claude.json:rw`
3. Ensure `CLAUDE_CODE_EXECUTABLE=/usr/bin/claude` is set in the dashboard service environment
4. Redeploy stack in Portainer

---

## Known issues / pending

- None blocking for beta.10.
- See `docs/clever-agent/white-label-master-inventory.md` §7 for pending work items.
