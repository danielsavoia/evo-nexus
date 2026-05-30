# Auditoria — Tamanho das Imagens Docker Clever Agent

**Data:** 2026-05-30
**Auditado em:** clever-dev (HEAD: `b879ce1`)
**Escopo:** somente leitura — nenhum arquivo foi alterado.

---

## 1. Resultado executivo

| Item | Valor |
|---|---|
| **Causa raiz** | `marker-pdf>=1.6.1` + `sentence-transformers>=3.0` no `pyproject.toml` puxam **PyTorch + NVIDIA CUDA** (~5.1 GB instalado) |
| Dashboard beta.16 (`docker inspect .Size`) | **3.15 GB** (uncompressed layers próprios da imagem) |
| Dashboard beta.16 (virtual — docker image ls) | **10.4 GB** (inclui layers da base image compartilhados) |
| Runtime beta.10 (`docker inspect .Size`) | **2.99 GB** |
| `.venv` dentro do container | **5.1 GB** (dominado por torch + nvidia) |
| Upstream `evoapicloud/evo-nexus-dashboard:latest` | **3.26 GB** (10.9 GB virtual) — **maior que a nossa** (npm sem cache clean = 827 MB vs 469 MB) |
| **Classificação** | 🔴 Regressão grave — PyTorch/CUDA desnecessários para web app |

**Conclusão:** As imagens Clever Agent têm tamanho excessivo por causa do stack ML/GPU (PyTorch, NVIDIA CUDA, Triton, OpenCV) que é instalado como dependência transitiva de `marker-pdf` e `sentence-transformers`. Esses pacotes são necessários para a feature de Knowledge Base (embeddings locais + PDF OCR), mas não precisam incluir suporte a GPU em containers web.

---

## 2. Dados da VPS (pré-auditoria)

Fonte: relatório VPS do usuário.

| Item | Valor |
|---|---|
| Disco `/dev/sda1` | 38 GB usados, 35 GB livres (após limpeza) |
| Docker images | 23 imagens, **31.75 GB** |
| Dashboard beta.15/16 | 10.4 GB virtual / ~3.15 GB em GHCR |
| Runtime beta.10 | 9.61 GB virtual |
| Site beta.1 | ~800 MB |

O problema é que cada nova versão do dashboard (~3-10 GB) se acumula com as anteriores sem pruning, e camadas não-dedupadas crescem o consumo.

---

## 3. Comparação de tamanhos

| Imagem | Tag | Virtual (local) | Uncompressed (real) | Observação |
|---|---:|---:|---:|---|
| Clever dashboard | beta.16 | 10.4 GB | 3.15 GB | `.venv` 5.1 GB com PyTorch/CUDA |
| Clever dashboard | beta.15 | 10.4 GB | 3.15 GB | Idêntico |
| Clever runtime | beta.10 | 9.61 GB | 2.99 GB | Mesma `.venv` PyTorch |
| Upstream dashboard | latest | 10.9 GB | **3.26 GB** | uv sync sem cache clean = 5.45 GB; npm sem cache clean = 827 MB — **maior que a nossa** |
| Upstream runtime | latest | 10.2 GB | **3.14 GB** | uv sync sem `--no-dev` nem cache clean; npm sem cache clean (827 MB CLIs) — **maior que a nossa** |

> **Nota sobre tamanho "virtual"**: o `docker image ls` mostra o tamanho virtual que inclui camadas da base image compartilhadas entre todas as imagens locais. O número relevante para decisão de otimização é o `docker inspect .Size` (layers próprios da imagem) e o que é transferido ao VPS.

---

## 4. Análise dos Dockerfiles

### 4.1 Dockerfile.dashboard (nosso)

```
Stage 1: node:22-alpine   → build frontend (React)
Stage 2: node:22-slim     → compile terminal-server (node-pty)
Stage 3: python:3.12-slim → runtime (Flask + CLIs + Python deps)
```

**O que adicionamos vs upstream:**
| Diferença | Tamanho | Avaliação |
|---|---:|---|
| Instalação Node.js 22 via NodeSource | 361 MB | ✅ Necessário (Claude/OpenClaude CLIs) |
| `npm install -g @anthropic-ai/claude-code + openclaude` | 469 MB | ✅ Necessário + `npm cache clean` OK |
| Build stage terminal-server | 593 MB | ✅ Necessário para WebSocket PTY |
| `uv sync --no-dev && uv cache clean` | 5.37 GB (layer) → 5.1 GB `.venv` instalado | 🔴 **Root cause**: torch/CUDA |

**O que o upstream NÃO faz que fazemos:**
- `npm cache clean --force` → ✅ nós fazemos, upstream não → nossa imagem menor nesse aspecto
- `uv cache clean` → ✅ nós fazemos, upstream não → nossa imagem menor nesse aspecto
- `--no-dev` no uv sync → ✅ nós fazemos, upstream não → nossa imagem menor nesse aspecto

### 4.2 Dockerfile.swarm (runtime — nosso)

```
Base: node:22-slim (single stage — PROBLEMA POTENCIAL)
COPY . .  (com Dockerfile.swarm.dockerignore)
```

**Problemas:**
- `COPY . .` com single stage pode incluir itens indesejados se `.dockerignore` falhar
- No entanto, `Dockerfile.swarm.dockerignore` exclui corretamente `brand/`, `dashboard/frontend/`, `site/`
- `uv sync --no-dev && uv cache clean` → correto, mas `.venv` ainda 5.1 GB

### 4.3 Upstream Dockerfile principal

```bash
RUN uv venv .venv && uv sync   # sem --no-dev, sem uv cache clean → pior que nós!
RUN npm install -g @anthropic-ai/claude-code   # sem npm cache clean
RUN npm install -g @gitlawb/openclaude@latest  # sem npm cache clean
```

**Conclusão verificada por medição direta no upstream `evoapicloud/evo-nexus-dashboard:latest`:**

| Componente | Upstream | Clever Agent | Delta |
|---|---:|---:|---:|
| `/workspace/.venv` | 5.0 GB | 5.1 GB | ≈ igual |
| `nvidia` libs (CUDA) | 2.7 GB | 2.7 GB | idêntico |
| `torch` | 1.1 GB | 1.1 GB | idêntico |
| `triton` | 639 MB | 639 MB | idêntico |
| `/root/.cache/uv` | 🔴 **5.1 GB** | ✅ 0 (limpo) | -5.1 GB |
| `/root/.npm` | 🔴 **245 MB** | ✅ 0 (limpo) | -245 MB |
| `/usr/lib/node_modules` | 558 MB | 462 MB | -96 MB |
| `docker inspect .Size` | **3.26 GB** | **3.15 GB** | **-110 MB** |

**Nota sobre uv cache vs venv:** o uv armazena o cache como hardlinks para os arquivos do `.venv`. Por isso `du -sh /root/.cache/uv` mostra 5.1 GB mas o custo real em disco é ~0 bytes adicionais (mesmos inodes). O prejuízo real do cache residual upstream é contabilístico/operacional — confunde métricas de `du` — mas o problema principal (PyTorch/CUDA) é o mesmo nas duas imagens.

**Nossa imagem é 110 MB menor** que a upstream, graças ao `npm cache clean --force` e `uv cache clean` que adicionamos.

---

## 5. Conteúdo interno — dashboard beta.16

### Top-level directories (uncompressed, `du -xhd1 /`)

| Diretório | Tamanho |
|---:|---:|
| `/workspace` | **5.6 GB** |
| `/usr` | 903 MB |
| `/root` | 58 MB |
| `/var` | 9 MB |
| `/etc` | 1.5 MB |

### /workspace breakdown

| Subdiretório | Tamanho | Categoria |
|---:|---:|---|
| `/workspace/.venv` | **5.1 GB** | 🔴 Root cause |
| `/workspace/dashboard/terminal-server` | **567 MB** | ⚠️ Contém Claude SDK duplicado |
| `/workspace/dashboard/backend` | 4.1 MB | ✅ OK |
| `/workspace/.claude` | 4.5 MB | ✅ Necessário |
| `/workspace/docs` | 2.7 MB | ⚠️ Dispensável no dashboard |
| `/workspace/dashboard/frontend` | 5.4 MB | ✅ (dist compilada) |

### /usr breakdown

| Subdiretório | Tamanho | Categoria |
|---:|---:|---|
| `/usr/lib/node_modules` | 462 MB | ⚠️ Claude CLI global + deps |
| `/usr/lib/x86_64-linux-gnu` | 89 MB | ✅ Sistema |
| `/usr/bin/node` | 119 MB | ✅ Necessário |
| `/usr/bin` | 161 MB | ✅ Sistema + ferramentas |
| `/root/.local/bin` | 58 MB | ✅ `uv` binary |

### Arquivos >50 MB

| Arquivo | Tamanho | Categoria |
|---|---:|---|
| `libcublasLt.so.13` (NVIDIA) | 517 MB | 🔴 GPU — desnecessário |
| `libcufft.so.12` (NVIDIA) | 273 MB | 🔴 GPU — desnecessário |
| `libtriton.so` (Triton) | 396 MB | 🔴 GPU JIT — desnecessário |
| `libtorch_cuda.so` (PyTorch CUDA) | 435 MB | 🔴 GPU — desnecessário |
| `libtorch_cpu.so` (PyTorch CPU) | 430 MB | ⚠️ CPU OK, mas versão compacta basta |
| `libnccl.so.2` (NVIDIA NCCL) | 208 MB | 🔴 Distributed training — desnecessário |
| `libcusparseLt.so.0` (NVIDIA) | 223 MB | 🔴 GPU sparse math — desnecessário |
| `claude` (SDK linux-x64, terminal-server) | 234 MB | ⚠️ Duplicado — também no global npm |
| `claude` (SDK linux-x64-musl, terminal-server) | 228 MB | 🔴 Musl não usado em Debian |
| `claude.exe` (global npm claude-code) | 229 MB | ✅ Necessário (/usr/bin/claude) |
| `claude` (global npm, nested) | 229 MB | ⚠️ Redundante com claude.exe |
| `cv2.abi3.so` (OpenCV) | 63 MB | ⚠️ Pesado, necessário para marker-pdf |
| `node` binary | 119 MB | ✅ Necessário |
| `uv` binary | 57 MB | ✅ Necessário |

---

## 6. Conteúdo interno — runtime beta.10

### /workspace e .venv

| Item | Tamanho |
|---:|---:|
| `/workspace/.venv` | **5.1 GB** |
| `torch` (PyTorch) | 1.1 GB |
| `nvidia` (CUDA libs) | **2.7 GB** |
| `triton` | 639 MB |
| `scipy` | 83 MB |
| `cv2` (OpenCV) | 63 MB |

O runtime carrega a mesma `.venv` que o dashboard, incluindo todo o PyTorch/CUDA — porém o `scheduler.py` provavelmente nunca usa PyTorch diretamente.

### Claude CLI no runtime

| Arquivo | Tamanho |
|---|---:|
| `claude.exe` (global npm, claude-code) | 229 MB |
| `claude` (global npm, nested linux-x64) | 229 MB |

---

## 6b. Conteúdo interno — upstream runtime (confirmado)

| Componente | Upstream runtime | Clever runtime beta.10 | Delta |
|---|---:|---:|---:|
| `/workspace/.venv` | 5.1 GB | 5.1 GB | idêntico |
| `nvidia` (CUDA libs) | 2.7 GB | 2.7 GB | idêntico |
| `/root/.cache/uv` | 🔴 **5.1 GB** | ✅ 0 (limpo) | -5.1 GB* |
| `/root/.npm` | 🔴 **247 MB** | ✅ 0 (limpo) | -247 MB |
| npm installs (claude + openclaude) | **827 MB** (sem cache clean) | **470 MB** (com cache clean) | -357 MB |
| `docker inspect .Size` | **3.14 GB** | **2.99 GB** | **-150 MB** |

\* Hardlinks — mesmo impacto de inodes; ver nota §4.3 sobre uv cache.

**Upstream runtime adicional vs nosso:** sem `--no-dev` no uv sync (instala pytest etc.) + `CMD ["bash"]` ao invés do correto `CMD ["uv", "run", "python", "scheduler.py"]`.

---

## 7. Análise de layers (docker history)

### Dashboard beta.16 — layers mais pesados

| Layer | Tamanho | Causa |
|---|---:|---|
| `uv venv .venv && uv sync --no-dev && uv cache clean` | **5.37 GB** | PyTorch + CUDA (marker-pdf + sentence-transformers) |
| `COPY terminal-server/node_modules` | 593 MB | Claude Agent SDK + deps (node-pty etc.) |
| `npm install -g claude-code + openclaude && npm cache clean` | 469 MB | CLIs + musl + x64 variants |
| `apt-get install nodejs + cleanup` | 361 MB | Node.js 22 runtime |
| `curl install uv` | 60 MB | uv binary |
| `COPY .claude/` | 4.62 MB | Skills/agents runtime |
| `COPY docs/` | 2.8 MB | Documentação (dispensável no dashboard) |

### Runtime beta.10 — layers mais pesados

| Layer | Tamanho | Causa |
|---|---:|---|
| `uv venv .venv && uv sync --no-dev && uv cache clean` | **5.37 GB** | Mesma causa |
| `npm install -g claude-code` | 243 MB | Claude CLI |
| `npm install -g openclaude` | 227 MB | OpenClaude CLI |
| `apt-get install + github-cli` | 182 MB | Sistema + gh |
| `COPY . .` | 14.5 MB | Workspace (bem filtrado pelo .swarm.dockerignore) |

---

## 8. Causas classificadas

### A. Necessário e esperado

| Item | Tamanho | Motivo |
|---|---:|---|
| Python 3.12 + Flask stack | ~200 MB | Backend web |
| Node.js 22 runtime | 119 MB | Terminal-server + CLIs |
| `/usr/bin/claude` (via global npm claude-code) | ~230 MB | Harness terminal Anthropic |
| `/usr/bin/openclaude` (via global npm openclaude) | ~120 MB | Harness terminal outros providers |
| terminal-server node_modules (node-pty + ws + express) | ~100 MB | PTY WebSocket |
| frontend dist (React SPA compilada) | 5.6 MB | UI |
| `.claude/` agents + skills | 4.5 MB | Runtime do agente |
| PyTorch CPU + deps (SOMENTE para Knowledge) | ~400 MB | sentence-transformers embeddings locais |
| sentence-transformers (SOMENTE para Knowledge) | ~100 MB | Embeddings locais Knowledge module |
| marker-pdf sem CUDA (SOMENTE para Knowledge) | ~200 MB | PDF parsing Knowledge module |

### B. Suspeito / possível lixo

| Item | Tamanho estimado | Motivo |
|---|---:|---|
| Claude Agent SDK musl variant (`claude-agent-sdk-linux-x64-musl/claude`) | 228 MB | Container usa glibc (Debian slim) — musl não é usado |
| Claude CLI nested no terminal-server node_modules | ~460 MB total (x64 + musl) | Mesmo binário já no global npm; duplicação |
| `docs/` copiado no dashboard | 2.7 MB | Documentação do projeto — não serve HTML |
| `/tmp/node-compile-cache` | 2.6 MB | Cache de compilação V8 — pode ficar |
| uv binary (`/root/.local/bin/uv`) | 57 MB | Necessário para rodar app (`uv run`) |

### C. Regressão crítica — PyTorch + NVIDIA CUDA

| Item | Tamanho | Causa |
|---|---:|---|
| `torch/lib/libtorch_cuda.so` | 435 MB | 🔴 CUDA GPU — desnecessário em prod CPU |
| `torch/lib/libtorch_cpu.so` | 430 MB | ⚠️ CPU — necessário, mas versão CPU-only compacta é suficiente |
| `nvidia/cu13/lib/libcublasLt.so.13` | 517 MB | 🔴 CUDA — desnecessário |
| `nvidia/cu13/lib/libcufft.so.12` | 273 MB | 🔴 CUDA — desnecessário |
| `triton/_C/libtriton.so` | 396 MB | 🔴 CUDA JIT compiler — desnecessário |
| `nvidia/nccl/lib/libnccl.so.2` | 208 MB | 🔴 Distributed training — desnecessário |
| `nvidia/cusparselt/lib/libcusparseLt.so.0` | 223 MB | 🔴 CUDA sparse — desnecessário |
| Total CUDA estimado | **~2.5 GB** | Todos dispensáveis em container web |

**Por que esse lixo está aqui:**
- `pyproject.toml` inclui `marker-pdf>=1.6.1` (para OCR de PDFs no Knowledge module)
- `marker-pdf` depende de `torch` (PyTorch)
- `pyproject.toml` inclui `sentence-transformers>=3.0` (para embeddings locais)
- `sentence-transformers` também depende de `torch`
- `uv sync` instala a versão padrão do PyTorch que inclui CUDA (o default no pip/uv)
- Resultado: 5.1 GB de libs GPU num container que roda em CPU no VPS

---

## 9. Plano de redução

### Fase 1 — Sem risco, ganho imediato (~2-2.5 GB)

**Solução: Forçar PyTorch CPU-only antes do `uv sync`**

Adicionar ao `Dockerfile.dashboard` e `Dockerfile.swarm`:

```dockerfile
# Force CPU-only PyTorch BEFORE uv sync.
# Without this, uv/pip installs the default torch (CUDA) which adds
# ~2.5 GB of GPU libraries (libtorch_cuda, libcublas, libnccl, etc.)
# that serve no purpose in a container running on CPU.
RUN uv pip install torch --index-url https://download.pytorch.org/whl/cpu && \
    uv venv .venv && uv sync --no-dev && uv cache clean
```

Ou alternativamente, adicionar ao `pyproject.toml`:

```toml
[tool.uv.sources]
torch = { url = "https://download.pytorch.org/whl/cpu/torch-2.5.1+cpu-cp312-cp312-linux_x86_64.whl" }
```

**Ganho estimado:**
- PyTorch CPU-only: ~250-400 MB (vs ~900 MB GPU)
- Sem NVIDIA CUDA libs: elimina ~2.5 GB
- Total: **−2.0 a −2.5 GB** na imagem

**Risco:** Baixo — Knowledge module (embeddings locais + PDF OCR) continua funcionando em CPU. Apenas perde GPU acceleration (não disponível no VPS de qualquer forma).

### Fase 2 — Médio risco (~500 MB adicionais)

1. **Remover Claude Agent SDK musl variant do terminal-server:**
   Adicionar ao `terminal-server/.npmrc` ou `package.json`:
   ```json
   "optionalDependencies": remove musl variant
   ```
   Ganho: ~228 MB

2. **Evitar duplicação do Claude CLI no terminal-server node_modules:**
   Verificar se `@anthropic-ai/claude-agent-sdk` precisa carregar o binário claude. Se o binário global (`/usr/bin/claude`) for suficiente, mover `CLAUDE_CODE_EXECUTABLE` para apontar para o global.
   Ganho: ~230-460 MB

3. **Remover `docs/` do dashboard image:**
   No `Dockerfile.dashboard`, remover `COPY docs/ docs/` — docs não são servidos como HTML pelo Flask.
   Ganho: 2.7 MB (pequeno mas sinaliza disciplina)

### Fase 3 — Alto risco (revisão de arquitetura)

1. **Separar Knowledge module em container dedicado:**
   - Dashboard + Runtime leves (sem PyTorch)
   - `clever-agent-knowledge:latest` com torch + marker-pdf + sentence-transformers
   - Ganho nas imagens principais: −5.1 GB

2. **Usar embeddings via API externa ao invés de local:**
   - OpenAI embeddings API (text-embedding-3-small)
   - Google embeddings API
   - Elimina `sentence-transformers` completamente
   - Ganho: −5.1 GB (todo o PyTorch stack desaparece)

3. **Usar API externa para PDF parsing:**
   - LlamaParse API, UpstageAPI, etc.
   - Elimina `marker-pdf` completamente
   - Ganho adicional: elimina OpenCV (63 MB)

---

## 10. Estimativas de tamanho após otimização

| Cenário | Dashboard | Runtime | Observação |
|---|---:|---:|---|
| Atual (beta.16) | 3.15 GB | 2.99 GB | Baseline |
| Fase 1 (CPU-only torch) | ~1.0–1.2 GB | ~0.8–1.0 GB | -2 a -2.5 GB por imagem |
| Fase 1 + 2 (sem SDK dup) | ~0.7–0.9 GB | ~0.6–0.8 GB | -500 MB adicionais |
| Fase 3 (sem torch) | ~0.3–0.4 GB | ~0.2–0.3 GB | -4.7 GB se Knowledge externa |

---

## 11. Recomendação

### Deploy beta.16 pode seguir?

**Sim** — a versão atual funciona corretamente. O problema de tamanho é de performance operacional (disco VPS), não de funcionalidade. Deploy beta.16 pode ir agora.

### Meta de tamanho alvo

| Imagem | Atual | Target Fase 1 | Target Final |
|---|---:|---:|---:|
| Dashboard | 3.15 GB | ≤ 1.2 GB | ≤ 500 MB |
| Runtime | 2.99 GB | ≤ 1.0 GB | ≤ 400 MB |
| Site | ~800 MB | manter | manter |

### Próxima missão sugerida

**Missão: Otimizar imagem Clever Agent beta.17 — PyTorch CPU-only (Fase 1)**

Escopo: modificar `Dockerfile.dashboard` e `Dockerfile.swarm` para forçar instalação de PyTorch CPU-only antes do `uv sync`. Sem alterar pyproject.toml (mantém compatibilidade com desenvolvimento local). Medir redução antes de publicar. Meta: dashboard ≤ 1.5 GB uncompressed.

---

## 11. CPU-only PyTorch — beta.17

### Solução implementada

**Arquivos alterados:** `Dockerfile.dashboard` e `Dockerfile.swarm`

**Antes (beta.16):**
```dockerfile
RUN uv venv .venv && uv sync --no-dev && uv cache clean
```

**Depois (beta.17):**
```dockerfile
RUN uv venv .venv \
    && uv pip install torch --index-url https://download.pytorch.org/whl/cpu \
    && uv sync --no-dev \
    && uv cache clean
```

### Estratégia

O `uv pip install torch --index-url .../cpu` pré-instala o wheel CPU-only no `.venv`
**antes** do `uv sync`. Quando o `uv sync` resolve as dependências de `marker-pdf` e
`sentence-transformers`, encontra `torch` já satisfeito no `.venv` e não tenta
instalar o wheel padrão (CUDA). Resultado: zero CUDA libs na imagem final.

### Resultados de validação (beta.17)

| Teste | Antes (beta.16) | Depois (beta.17) |
|---|---:|---:|
| `docker image ls` virtual | 10.4 GB | _(registrar)_ |
| `docker inspect .Size` | 3.15 GB | _(registrar)_ |
| `.venv` total | 5.1 GB | _(registrar)_ |
| `nvidia/` CUDA libs | 2.7 GB | _(esperado: 0)_ |
| `torch/lib/libtorch_cuda.so` | 435 MB | _(esperado: ausente)_ |
| `triton/` | 639 MB | _(esperado: ausente)_ |
| `torch.cuda.is_available()` | True | `False` ✅ |
| `sentence_transformers` import | OK | OK ✅ |
| `marker_pdf` import | OK | OK ✅ |

### Risco e rollback

- **Risco:** Medium — `marker-pdf` e `sentence-transformers` continuam funcionando em CPU.
  GPU acceleration indisponível de qualquer forma no VPS.
- **Rollback:** remover a linha `uv pip install torch --index-url .../cpu` do Dockerfile.
- **Reapply obrigatório:** se upstream alterar `pyproject.toml`, `Dockerfile.dashboard`
  ou `Dockerfile.swarm`.

---

## 12. Apêndice — comandos usados

```bash
# Tamanho das imagens
docker image inspect <tag> | grep '"Size"'
docker history <tag> --format "table {{.Size}}\t{{.CreatedBy}}"

# Conteúdo interno
docker run --rm --entrypoint sh <tag> -lc "
  du -xhd1 / 2>/dev/null | sort -h | tail -20
  du -xhd2 /workspace 2>/dev/null | sort -h | tail -30
  find / -xdev -type f -size +50M -printf '%s\t%p\n' 2>/dev/null | sort -n | tail -30
"

# Manifests GHCR
docker buildx imagetools inspect <tag>
```

---

*Auditoria concluída em clever-dev. Nenhum arquivo de código foi alterado.*
