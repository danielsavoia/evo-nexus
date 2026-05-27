# Clever Agent — Otimização de Tamanho das Imagens Docker

**Data:** 2026-05-27
**Branch:** `clever-dev`

---

## 1. Diagnóstico — Tamanhos originais

| Imagem | Tag | Tamanho |
|---|---|---|
| clever-agent-dashboard | 0.33.0-clever-beta.9 | **11 GB** |
| clever-agent-runtime | 0.33.0-clever-beta.9 | **11.4 GB** |

### Maiores culpados

**Ambas as imagens:**

| Item | Tamanho | Causa |
|---|---|---|
| `/root/.cache/uv` | **5.1 GB** | Cache de download do `uv sync` não limpo no mesmo layer |
| `.venv` (torch/sentence-transformers/marker-pdf) | 5.1 GB | Deps legítimas do upstream — não removível |
| `/root/.npm` | 225–226 MB | Cache npm não limpo após `npm install -g` |

**Apenas runtime (Dockerfile.swarm usa `COPY . .`):**

| Item | Tamanho | Causa |
|---|---|---|
| `site/node_modules/` | 393 MB | Site marketing copiado desnecessariamente |
| `dashboard/frontend/` (source) | 318 MB | Source React copiado — scheduler não usa |
| `dashboard/node_modules/` | 118 MB | Build deps frontend — scheduler não usa |
| `brand/` (avatars) | 65 MB | Assets UI — scheduler não usa |

### Por que o Python venv tem 5.1 GB?

Dependências legítimas do upstream `pyproject.toml`:
- `sentence-transformers>=3.0` → puxa **PyTorch** (~2 GB) + CUDA libs
- `marker-pdf>=1.6.1` → puxa libs OCR/PDF pesadas
- `anthropic`, `openai`, `google-genai` → API clients (pequenos)

Essas dependências existem no upstream e são usadas pelas features de knowledge/documentos. **Não devem ser removidas.**

---

## 2. Otimizações implementadas

### 2.1 `Dockerfile.dashboard` — limpeza de caches

```dockerfile
# ANTES:
RUN npm install -g @anthropic-ai/claude-code @gitlawb/openclaude@latest

# DEPOIS:
RUN npm install -g @anthropic-ai/claude-code @gitlawb/openclaude@latest \
    && npm cache clean --force \
    && rm -rf /root/.npm
```

```dockerfile
# ANTES:
RUN uv venv .venv && uv sync --no-dev

# DEPOIS:
RUN uv venv .venv && uv sync --no-dev && uv cache clean
```

**Economia esperada:** ~5.3 GB (5.1 GB uv cache + 225 MB npm cache)

### 2.2 `Dockerfile.swarm` — limpeza de caches + --no-dev

```dockerfile
# npm install -g com cache clean no mesmo layer (cada grupo):
RUN npm install -g @anthropic-ai/claude-code && npm cache clean --force
RUN npm install -g @gitlawb/openclaude@latest && npm cache clean --force
RUN npm install -g todoist-ts-cli && npm cache clean --force && rm -rf /root/.npm

# uv sync com --no-dev e limpeza de cache:
RUN uv venv .venv && uv sync --no-dev && uv cache clean
```

**Economia esperada:** ~5.5 GB (5.1 GB uv cache + 226 MB npm cache + remoção de pytest)

### 2.3 `.dockerignore` — melhorado

| Adicionado | Motivo |
|---|---|
| `**/node_modules` | Substituiu `node_modules/` (raiz apenas) — agora exclui qualquer nível |
| `.github/` | CI/CD files desnecessários |
| `*.tar`, `*.tgz`, `*.tar.gz` | Archives |
| `_tmp/`, `tmp/` | Temporários |
| `.pytest_cache/`, `.ruff_cache/`, `.mypy_cache/` | Tool caches |
| `playwright-report/`, `test-results/` | Test outputs |
| `.env.*` | Variantes de .env |
| `*.pyo` | Bytecode adicional |

### 2.4 `Dockerfile.swarm.dockerignore` — NOVO (runtime-específico)

Docker 23+ usa `<Dockerfile>.dockerignore` automaticamente se o arquivo existir.
Para o runtime (scheduler), exclusões adicionais além do `.dockerignore` base:

| Excluído | Tamanho poupado | Motivo |
|---|---|---|
| `dashboard/frontend/` | ~318 MB | SPA React — scheduler não serve web |
| `dashboard/packages/` | ~1 MB | Workspace npm packages — build only |
| `site/` | ~400 MB | Site marketing — scheduler não usa |
| `brand/` | ~65 MB | Avatar images — dashboard serve, não runtime |
| `tests/` | ~1 MB | Test files |

**Economia adicional para runtime:** ~785 MB no layer `COPY . .`

---

## 3. Tamanhos após otimização (size-test)

| Imagem | Tag | Tamanho antes | Tamanho depois | Redução |
|---|---|---|---|---|
| clever-agent-dashboard | 0.33.0-clever-beta.10-size-test | 11 GB | **3.45 GB** | **-7.55 GB (-68.6%)** |
| clever-agent-runtime | 0.33.0-clever-beta.10-size-test | 11.4 GB | **9.61 GB** | **-1.79 GB (-15.7%)** |

### Confirmações do build

**Dashboard** (`uv cache clean` confirmado no build):
```
Clearing cache at: /root/.cache/uv
Removed 29586 files (5.0GiB)
```

**Runtime** (`uv cache clean` confirmado no build):
```
Clearing cache at: /root/.cache/uv
Removed 29715 files (5.0GiB)
```

**Build context runtime** (`Dockerfile.swarm.dockerignore` funcionando):
```
transferring context: 1.45MB done
```

### Smoke tests — 2026-05-27

**Dashboard (`0.33.0-clever-beta.10-size-test`):**
| Check | Resultado |
|---|---|
| `node --version` | v22.22.2 ✅ |
| `which claude` | /usr/bin/claude ✅ |
| `which openclaude` | /usr/bin/openclaude ✅ |
| `python3 --version` | Python 3.12.13 ✅ |
| `uv --version` | uv 0.11.16 ✅ |
| `terminal-server/node_modules/` existe | ✅ |
| `dashboard/frontend/dist/` existe | ✅ |
| `scheduler.py` existe | ✅ |
| `.claude/` existe | ✅ |
| `start-dashboard.sh` existe | ✅ |
| `/root/.npm` ausente | ✅ |
| `/root/.cache/uv` ausente | ✅ |

**Runtime (`0.33.0-clever-beta.10-size-test`):**
| Check | Resultado |
|---|---|
| `node --version` | v22.22.3 ✅ |
| `which claude` | /usr/local/bin/claude ✅ |
| `python3 --version` | Python 3.11.2 ✅ |
| `uv --version` | uv 0.11.16 ✅ |
| `scheduler.py` existe | ✅ |
| `.venv/` existe | ✅ |
| `.claude/` (agents, commands, hooks, rules) | ✅ |
| `which gh` | /usr/bin/gh ✅ |
| `which todoist` | /usr/local/bin/todoist ✅ |
| `/root/.npm` ausente | ✅ |
| `/root/.cache/uv` ausente | ✅ |

---

## 4. O que foi preservado

- ✅ Flask + app.py no dashboard
- ✅ terminal-server na porta 32352 (start-dashboard.sh)
- ✅ node, npm, claude, openclaude no dashboard
- ✅ terminal-server/node_modules com node-pty compilado
- ✅ White-label assets (brand, avatars, paleta) no dashboard
- ✅ docs/ baked no dashboard (necessários para `/docs` da UI)
- ✅ scheduler.py + deps Python no runtime
- ✅ .claude/ (skills, agents, commands) no runtime
- ✅ gh CLI, todoist CLI no runtime

---

## 5. Arquivos alterados

| Arquivo | Tipo de alteração |
|---|---|
| `Dockerfile.dashboard` | +`uv cache clean` +`npm cache clean` no mesmo RUN |
| `Dockerfile.swarm` | +`uv cache clean` +`npm cache clean` por grupo +`--no-dev` |
| `.dockerignore` | `node_modules/` → `**/node_modules`, novos padrões |
| `Dockerfile.swarm.dockerignore` | NOVO — exclusões específicas para runtime |

---

## 6. Reapply checklist (após upstream merge)

- [ ] Verificar se `Dockerfile.dashboard` ainda tem `&& uv cache clean` após `uv sync --no-dev`
- [ ] Verificar se `Dockerfile.dashboard` tem `&& npm cache clean --force && rm -rf /root/.npm`
- [ ] Verificar se `Dockerfile.swarm` tem `&& uv cache clean` após `uv sync`
- [ ] Verificar se `Dockerfile.swarm` usa `--no-dev`
- [ ] Verificar se `Dockerfile.swarm` limpa npm cache em cada grupo de install-g
- [ ] Verificar se `.dockerignore` mantém `**/node_modules` (não só `node_modules/`)
- [ ] Verificar se `Dockerfile.swarm.dockerignore` existe e exclui `site/`, `brand/`, `dashboard/frontend/`, `tests/`
- [ ] Rodar smoke test `docker run --rm --entrypoint sh ... -lc "node --version && which claude && test -d /workspace/dashboard/terminal-server/node_modules && echo ok"`
- [ ] Comparar tamanho do `docker image ls` antes e depois

---

## 7. Notas técnicas

### Por que `uv cache clean` economiza 5 GB?

O `uv sync` baixa todos os wheels para `/root/.cache/uv/` antes de instalá-los em `.venv`.
O cache de download não é necessário em runtime — serve só para builds subsequentes.
`uv cache clean` remove apenas o cache de download, deixando `.venv` intacto.
**Deve estar no mesmo `RUN` que o `uv sync` para que o layer não inclua o cache.**

### Por que `npm cache clean` deve estar no mesmo RUN?

Docker layers são imutáveis. Um `RUN npm cache clean` separado cria um novo layer
mas os bytes do cache ainda existem no layer anterior. Limpar no mesmo `RUN` evita
que o cache apareça em qualquer layer da imagem final.

### Por que `Dockerfile.swarm.dockerignore` e não alterar o `.dockerignore` global?

O `Dockerfile.dashboard` precisa do `dashboard/frontend/` no build context (COPY source → npm build).
O `Dockerfile.swarm` não precisa. Com `.dockerignore` único, seria impossível ter
regras diferentes. Docker 23+ suporta `<Dockerfile>.dockerignore` por Dockerfile.
