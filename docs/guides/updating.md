# Updating Clever Agent

## Check your current version

Your version is shown in the sidebar footer of the dashboard. You can also check it via API:

```bash
curl http://localhost:8080/api/version
```

Or directly from `pyproject.toml` at the workspace root:

```bash
grep '^version' pyproject.toml
```

## Update via Git (recommended)

```bash
cd /path/to/your/workspace
git pull origin main
```

Then rebuild the frontend and restart the backend:

```bash
cd dashboard/frontend
npm install
npm run build

# Restart the backend (or the full stack)
cd ../backend
# If running directly:
kill $(lsof -ti :8080) 2>/dev/null
python app.py &
```

## Update via Docker (published images)

Starting with **v0.30.2**, official multi-arch images (amd64 + arm64) are published to Docker Hub under the `evoapicloud` namespace:

- `evoapicloud/clever-agent-dashboard` — Flask + React + embedded terminal + Claude CLI
- `evoapicloud/clever-agent-runtime` — Node/Python runtime for the Telegram bot and the scheduler

The images are public — no `docker login` required.

### docker compose (single host, from Docker Hub)

If you deployed with [`docker-compose.hub.yml`](https://github.com/EvolutionAPI/clever-agent/blob/main/docker-compose.hub.yml) (the recommended flow documented in [Installing with Docker](./docker-install.md)):

```bash
docker compose -f docker-compose.hub.yml pull
docker compose -f docker-compose.hub.yml up -d
```

Named volumes are preserved — all your configuration, providers, integrations, and memory stay intact.

### Docker Swarm / Portainer

Bump the image tag in your stack (or leave `:latest` and force a redeploy). Example:

```bash
docker service update --image evoapicloud/clever-agent-dashboard:v0.30.4 clever-agent_clever-agent_dashboard
docker service update --image evoapicloud/clever-agent-runtime:v0.30.4   clever-agent_clever-agent_telegram
docker service update --image evoapicloud/clever-agent-runtime:v0.30.4   clever-agent_clever-agent_scheduler
```

See [`README.swarm.md`](https://github.com/EvolutionAPI/clever-agent/blob/main/README.swarm.md) for the full Swarm / Portainer deployment guide and the `clever-agent.stack.yml` template.

### Local docker compose (building from source)

If you're running `docker-compose.yml` locally (building the image from source instead of pulling from Docker Hub):

```bash
cd /path/to/your/workspace
git pull origin main
docker compose build
docker compose up -d
```

To rebuild without cache (useful if dependencies changed):

```bash
docker compose build --no-cache
docker compose up -d
```

## Custom routines and skills are safe

Your custom routines (`ADWs/scripts/`), skills (`.claude/skills/`), and workspace configuration files are **gitignored** and will not be overwritten by `git pull`. The same applies to:

- `.env` files
- `dashboard/data/` (database, secrets)
- `config/workspace.yaml`
- `memory/` directory contents
- Session logs in `workspace/daily-logs/`

If you've modified a tracked file, `git pull` may show a merge conflict. In that case, stash your changes first:

```bash
git stash
git pull origin main
git stash pop
```

## Checking for updates programmatically

The dashboard checks for updates automatically (cached for 1 hour). You can also call:

```bash
curl http://localhost:8080/api/version/check
```

Returns:

```json
{
  "current": "0.3.2",
  "latest": "0.4.0",
  "update_available": true,
  "release_url": "https://github.com/EvolutionAPI/clever-agent/releases/tag/v0.4.0",
  "release_notes": "..."
}
```

## Changelog

See all releases and changelogs on GitHub:
https://github.com/EvolutionAPI/clever-agent/releases
