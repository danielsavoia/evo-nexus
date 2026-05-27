# Clever Agent beta.9 — Terminal Server Dashboard Fix

**Data:** 2026-05-27
**Tag Git:** `clever-agent-v0.33.0-clever-beta.9`
**Branch:** `clever-beta` @ `95cd2a4`

---

## 1. Contexto

### Sintoma
Ao abrir o chat/terminal de qualquer agente, o frontend exibia:

> "Could not reach terminal-server at https://agent.cleverai.com.br/terminal. Is it running?"

### Causa raiz — Dockerfile.dashboard
O `CMD` do `Dockerfile.dashboard` iniciava apenas o Flask:

```dockerfile
CMD ["uv", "run", "python", "dashboard/backend/app.py"]
```

O `start-dashboard.sh` (que sobe o terminal-server na porta 32352 + Flask) nunca era
chamado. O `dashboard/terminal-server/` também não era copiado para a imagem, e o
`node-pty` (dependência nativa) não era compilado.

Resultado: porta 32352 fechada → nenhuma conexão WebSocket do chat funcionava.

### Causa raiz — Dockerfile.swarm
O serviço `runtime` no Swarm entrava em restart loop porque o `CMD` era:

```dockerfile
CMD ["bash"]
```

`bash` sai imediatamente em container sem TTY → container morria na inicialização →
Swarm reiniciava indefinidamente.

### Arquitetura correta (upstream)
O `evonexus.stack.yml` upstream prevê que o **terminal-server** rode **dentro do
container do dashboard**, na porta 32352. O Traefik roteia `/terminal/*` para essa porta
com stripprefix. Não há comunicação entre dashboard e runtime para o terminal.

---

## 2. Correções

### Dockerfile.dashboard

1. **Stage `terminal-build` adicionado** — compila `node-pty` (requer `python3`, `make`,
   `g++`); apenas `node_modules/` é copiado para o stage runtime (sem toolchain na imagem
   final):

   ```dockerfile
   FROM node:22-slim AS terminal-build
   RUN apt-get update && apt-get install -y --no-install-recommends \
           python3 make g++ \
       && rm -rf /var/lib/apt/lists/*
   WORKDIR /build/terminal-server
   COPY dashboard/terminal-server/package.json ./
   COPY dashboard/terminal-server/package-lock.json* ./
   RUN npm install --omit=dev
   ```

2. **Stage runtime — cópia do terminal-server:**

   ```dockerfile
   COPY dashboard/terminal-server/ dashboard/terminal-server/
   COPY --from=terminal-build /build/terminal-server/node_modules \
        dashboard/terminal-server/node_modules
   ```

3. **ENV/EXPOSE adicionados:**

   ```dockerfile
   ENV TERMINAL_SERVER_PORT=32352
   EXPOSE 32352
   ```

4. **CMD corrigido:**

   ```dockerfile
   # ANTES:
   CMD ["uv", "run", "python", "dashboard/backend/app.py"]

   # DEPOIS:
   CMD ["/usr/local/bin/start-dashboard.sh"]
   ```

   O `start-dashboard.sh` (pré-existente) inicia:
   - `node /workspace/dashboard/terminal-server/bin/server.js --port 32352` (background)
   - `uv run python /workspace/dashboard/backend/app.py` (background)
   - `wait -n` — se qualquer processo morrer, container para e Swarm reinicia.

### Dockerfile.swarm

```dockerfile
# ANTES:
CMD ["bash"]

# DEPOIS:
CMD ["uv", "run", "python", "scheduler.py"]
```

---

## 3. Imagens GHCR

### Dashboard
- **Image:** `ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.9`
- **Digest index:** `sha256:f7b83ef6e6dd5e9b45e9a8ad0043d9799b675809ac923c655797b77e38f67335`
- **Digest linux/amd64:** `sha256:39a8076a2372733bc475d24686be301a4c6af64dd9e9d960911ab7358b1de1ca`

### Runtime
- **Image:** `ghcr.io/danielsavoia/clever-agent-runtime:0.33.0-clever-beta.9`
- **Digest index:** `sha256:be57779713509a544323b4466d1b0375cb094a55b6c862f0de74310de749cfd9`
- **Digest linux/amd64:** `sha256:8e9b85596f8fadfc18afcd75e2cf93d9ca71a073a4fbe4bde65f213c81bd4604`

### latest publicado?
**Não.**

---

## 4. Git

| Item | Valor |
|---|---|
| clever-dev HEAD | `00c220d` — fix(dashboard): terminal-server multi-process + scheduler CMD — beta.9 |
| clever-beta HEAD | `95cd2a4` — Merge clever-dev into clever-beta: terminal-server fix + scheduler CMD — beta.9 |
| Tag | `clever-agent-v0.33.0-clever-beta.9` |
| clever-prod preservada | `7f5dd76` — não tocada |
| upstream-sync preservada | `fe15fd5` — não tocada |

---

## 5. Validação local

### Dashboard image test
```
node --version   → v22.22.2
npm --version    → 10.9.7
which claude     → /usr/bin/claude
which openclaude → /usr/bin/openclaude
terminal_node_modules_ok
```

### Runtime image test
```
uv --version     → uv 0.11.16 (x86_64-unknown-linux-gnu)
python3 --version → Python 3.11.2
runtime_ok
```

### GHCR inspect
Ambas as imagens confirmadas via `docker buildx imagetools inspect` — ver seção 3.

---

## 6. Validação esperada na VPS

```bash
# 1. Processos no container dashboard
docker exec <dashboard_container> ps aux | grep -E "server\.js|app\.py"
# Esperado: node ...server.js  E  python ...app.py

# 2. Porta 32352 ouvindo no dashboard
docker exec <dashboard_container> ss -lntp | grep 32352
# Esperado: LISTEN 0.0.0.0:32352

# 3. Traefik roteando /terminal/* → dashboard:32352
curl -si https://agent.cleverai.com.br/terminal/ | head -5
# Esperado: HTTP/1.1 101 ou HTTP/1.1 426 (WebSocket upgrade)

# 4. Scheduler rodando no runtime
docker exec <runtime_container> ps aux | grep scheduler.py
# Esperado: python ...scheduler.py

# 5. Validação visual
# Agents → qualquer agente → Chat/Terminal
# Esperado: terminal abre sem erro "Could not reach terminal-server"
```

---

## 7. Reapply checklist

- [ ] Se `Dockerfile.dashboard` for alterado por upstream, **preservar** o stage `terminal-build` (python3/make/g++ para compilar node-pty).
- [ ] **Preservar** `COPY dashboard/terminal-server/ ...` e `COPY --from=terminal-build .../node_modules ...` no stage runtime.
- [ ] **Preservar** `start-dashboard.sh` como CMD (não reverter para Flask direto).
- [ ] **Preservar** `EXPOSE 32352` e `ENV TERMINAL_SERVER_PORT=32352`.
- [ ] **Preservar** rota Traefik `/terminal/*` → porta 32352 do serviço dashboard (não do runtime).
- [ ] **Preservar** `CMD ["uv", "run", "python", "scheduler.py"]` no `Dockerfile.swarm`.
- [ ] Se upstream alterar `start-dashboard.sh`, verificar se ainda inicia terminal-server + Flask com `wait -n`.
