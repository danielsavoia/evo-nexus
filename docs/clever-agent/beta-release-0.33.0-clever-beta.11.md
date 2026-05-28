# Clever Agent beta.11 Release Notes

**Version:** `0.33.0-clever-beta.11`
**Branch:** `clever-beta`
**Date:** 2026-05-28
**Status:** Released to GHCR

---

## Images

| Image | Tag | Digest | Real size |
|---|---|---|---|
| `clever-agent-dashboard` | `0.33.0-clever-beta.11` | `sha256:d3ccb3949d8404ec39bddc05db6c9ea040d766aa7f17166ef443a49dee184174` | 3.15 GB |
| `clever-agent-runtime` | `0.33.0-clever-beta.10` | `sha256:cd9e4f7e2488f4d48e1efcfd232cf13c19d5f489aabf7b9753de9cff88e1e3b1` | 2.99 GB *(unchanged)* |

Pull commands:
```bash
docker pull ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.11
# runtime unchanged — still beta.10
docker pull ghcr.io/danielsavoia/clever-agent-runtime:0.33.0-clever-beta.10
```

---

## Commits included (on top of beta.10)

| SHA | Description |
|---|---|
| `4ae94e8` | fix: remove orphan PNG avatars from public/ (only WebP served) |
| `3d56f60` | chore: promote Clever Agent dashboard beta.11 |
| `bacfc49` | fix: providers toggle — active provider clickable without CLI |
| `573eae8` | fix: install Node.js 22 + Claude Code + OpenClaude in Dockerfile.dashboard |
| `266922e` | *(tag: clever-agent-v0.33.0-clever-beta.10)* |

---

## What's in this release

### Dashboard only (runtime unchanged at beta.10)

### Bug fixes

- **Orphan PNG avatars removed from `public/`:** Vite copies all files from `public/` into `dist/`, which meant 38 PNG masters (1254×1254, ~64 MB) were being bundled into the dashboard Docker image alongside the optimized WebPs. Fixed by removing the PNGs from `public/clever-agent/avatars/` — PNG masters remain in `brand/clever-agent/avatars/` (not bundled).

- **Providers toggle fix (`bacfc49`):** Toggle `disabled` depended on `cliInstalled` for all providers: `!isInstalled || toggling===id`. With `claude_installed=false`, all toggles were disabled — including the active provider. Fix: `toggling===id || (!isInstalled && !isActive)` — active provider stays clickable to deactivate even without CLI; inactive provider without CLI stays locked. Inline "CLI ausente" hint added for inactive providers without CLI.

- **Providers CLI in dashboard image (`573eae8`):** `providers.py` uses `shutil.which(cli)` inside the dashboard container; the image was `python:3.12-slim` without Node.js → `claude`/`openclaude` not found → all providers appeared "not installed". Fix: install Node.js 22 via NodeSource + `@anthropic-ai/claude-code` + `@gitlawb/openclaude@latest` in the runtime stage of `Dockerfile.dashboard`.

### Performance

- **Dashboard image:** 3.21 GB (beta.10) → 3.15 GB (beta.11) — additional reduction from removing 38 PNG orphans (~64 MB) from the Vite dist output.

### Avatar optimization (from beta.10 base)

- 38 PNG avatars (1254×1254 px, ~63.9 MB total) converted to WebP 256×256 q85 (~458 KB total, **-99.3%**).
- `agent-meta.ts` and `agent_meta_seed.py` updated to reference `.webp`.
- PNG masters preserved in `brand/clever-agent/avatars/` (not served, not bundled).

### Provider routing (from beta.10 base)

- `chat-bridge.js`: `codex_auth` provider now reads OAuth access token from `~/.codex/auth.json` when no API key is set. Clear Portuguese error message if auth absent.
- `Providers.tsx`: logout warning messages are now contextual — openclaude providers show "OpenClaude terminal", anthropic shows "Claude Code".

---

## Smoke test results

| Test | Result |
|---|---|
| Image builds without error | ✅ |
| `dist/clever-agent/avatars/` contains only WebP + SVG (0 PNG orphans) | ✅ |
| `dist/clever-agent/avatars/` total ≈ 696 KB | ✅ |
| Flask responds on port 8080 | ✅ |
| Terminal-server responds on port 32352 | ✅ |
| `which claude` → `/usr/bin/claude` | ✅ |
| `which openclaude` → `/usr/bin/openclaude` | ✅ |

---

## Stack

`clever-agent.stack.yml` updated to use `0.33.0-clever-beta.11` for dashboard service only.
Runtime service remains at `0.33.0-clever-beta.10`.

---

## Upgrade from beta.10

1. Pull new dashboard image (Portainer will do this on stack redeploy)
2. Confirm `clever-agent.stack.yml` dashboard image is `0.33.0-clever-beta.11`
3. Confirm runtime image remains `0.33.0-clever-beta.10`
4. Redeploy stack in Portainer

---

## Known issues / pending

- None blocking for beta.11.
- Provider routing: `codex_auth` OAuth requires `~/.codex/auth.json` to be present and mounted in the dashboard container.
