# Terminal Server Fix — Dashboard Multi-process Entrypoint

**Data:** 2026-05-26

## Problema

Ao abrir o chat de um agente, o frontend exibia:

> "Could not reach terminal-server at https://agent.cleverai.com.br/terminal. Is it running?"

## Diagnóstico

A arquitetura upstream (`evonexus.stack.yml`) prevê que o **terminal-server** rode **dentro do container do dashboard**, na porta 32352. O Traefik roteia `/terminal/*` para essa porta com stripprefix.

O `Dockerfile.dashboard` original (e o da Clever até beta.8) tinha:

```dockerfile
CMD ["uv", "run", "python", "dashboard/backend/app.py"]
```

Ou seja:
- Somente o Flask subia.
- `dashboard/terminal-server/` não era copiado para a imagem.
- `node-pty` (dependência nativa) não era compilado.
- Porta 32352 ficava fechada — nenhuma conexão WebSocket do chat funcionava.

## Causa raiz dupla (runtime Dockerfile.swarm)

O `Dockerfile.swarm` (imagem runtime usada pelo serviço `evonexus_scheduler`) tinha:

```dockerfile
CMD ["bash"]
```

Bash sai imediatamente em container sem TTY → o serviço scheduler morria na inicialização
e o Swarm entrava em restart loop.

## Correção — Dockerfile.dashboard

### Novo stage: `terminal-build`

Adicionado entre `frontend-build` e `runtime`:

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

`node-pty` exige compilação nativa (python3 + make + g++). O stage compila o binário
e apenas o resultado é copiado para o runtime (imagem menor, sem toolchain de build).

### Stage runtime — adições

```dockerfile
# Copia terminal-server source + node_modules compilados
COPY dashboard/terminal-server/ dashboard/terminal-server/
COPY --from=terminal-build /build/terminal-server/node_modules dashboard/terminal-server/node_modules

# Porta do terminal-server
ENV TERMINAL_SERVER_PORT=32352
EXPOSE 32352

# Script multi-processo
COPY start-dashboard.sh /usr/local/bin/start-dashboard.sh
RUN chmod +x /usr/local/bin/start-dashboard.sh
```

### CMD alterado

```dockerfile
# ANTES:
CMD ["uv", "run", "python", "dashboard/backend/app.py"]

# DEPOIS:
CMD ["/usr/local/bin/start-dashboard.sh"]
```

O `start-dashboard.sh` (já existia no repo) inicia:
1. `node /workspace/dashboard/terminal-server/bin/server.js --port 32352` (background)
2. `uv run python /workspace/dashboard/backend/app.py` (background)
3. `wait -n` — se qualquer processo morrer, o container para e o Swarm reinicia.

O ENTRYPOINT `init-config.sh` permanece, seeda a config volume e faz `exec "$@"`.

## Correção — Dockerfile.swarm

```dockerfile
# ANTES:
CMD ["bash"]

# DEPOIS:
CMD ["uv", "run", "python", "scheduler.py"]
```

## Validação esperada no container

```bash
docker run --rm -p 8080:8080 -p 32352:32352 \
  ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.9

# Logs esperados:
# [start-dashboard] terminal-server on :32352, Flask on :8080
# [start-dashboard] seeding /root/.claude/settings.json with default theme

# Em outro terminal:
curl -s http://localhost:8080/api/health   # → {"status": "ok"}
curl -s --include http://localhost:32352/  # → 101 Switching Protocols (WS upgrade)
```

## Impacto no stack Swarm

- Serviço `dashboard`: atualizar para `clever-agent-dashboard:0.33.0-clever-beta.9`
- Serviço `runtime`: atualizar para `clever-agent-runtime:0.33.0-clever-beta.9`
- Variável de ambiente necessária no serviço `dashboard`:
  ```
  TERMINAL_SERVER_PORT=32352
  ```
  (já é o default no script, mas é bom declarar explicitamente no stack)
- Traefik routing existente `/terminal/*` → porta 32352 não precisa ser alterado.
