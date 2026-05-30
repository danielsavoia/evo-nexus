# Clever Agent beta.17 — CPU-only PyTorch Images

**Data:** 2026-05-30
**Versão:** `0.33.0-clever-beta.17`

---

## 1. Objetivo

Reduzir drasticamente o tamanho das imagens Docker do Clever Agent eliminando
as bibliotecas NVIDIA CUDA/GPU que eram instaladas desnecessariamente via
`marker-pdf` e `sentence-transformers` (ambas dependências de `torch`).

Os containers rodam em CPU no VPS — nenhuma GPU disponível. O PyTorch padrão
inclui ~2.5 GB de `.so` files CUDA que nunca são executados.

---

## 2. Causa raiz

`pyproject.toml` inclui:
- `marker-pdf>=1.6.1` → depende de `torch` (PDF OCR)
- `sentence-transformers>=3.0` → depende de `torch` (embeddings locais)

Sem intervenção, `uv sync` resolvia o wheel padrão do PyTorch que inclui
CUDA 12.x completo: `libtorch_cuda.so` (435 MB), `libcublasLt.so.13` (517 MB),
`libtriton.so` (396 MB), `libnccl.so.2` (208 MB), etc.

**Solução aplicada:** pré-instalar `torch` CPU-only antes do `uv sync`:

```dockerfile
RUN uv venv .venv \
    && uv pip install torch --index-url https://download.pytorch.org/whl/cpu \
    && uv sync --no-dev \
    && uv cache clean
```

---

## 3. Git

| Branch | HEAD |
|---|---|
| `clever-dev` | _(pending commit)_ — opt: use CPU-only PyTorch in Clever Agent images |
| `clever-beta` | _(pending merge)_ |
| Tag | `clever-agent-v0.33.0-clever-beta.17` |
| `clever-prod` | preservada |
| `upstream-sync` | preservada |

---

## 4. Imagens GHCR

### Dashboard

| Campo | Valor |
|---|---|
| Tag | `ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.17` |
| Digest index | _(registrar após push)_ |
| Digest linux/amd64 | _(registrar após push)_ |
| Tamanho antes (beta.16) | 3.15 GB uncompressed / 10.4 GB virtual |
| Tamanho depois (beta.17) | _(registrar após build)_ |

### Runtime

| Campo | Valor |
|---|---|
| Tag | `ghcr.io/danielsavoia/clever-agent-runtime:0.33.0-clever-beta.17` |
| Digest index | _(registrar após push)_ |
| Digest linux/amd64 | _(registrar após push)_ |
| Tamanho antes (beta.10) | 2.99 GB uncompressed / 9.61 GB virtual |
| Tamanho depois (beta.17) | _(registrar após build)_ |

### Site

| Campo | Valor |
|---|---|
| Tag | `ghcr.io/danielsavoia/clever-agent-site:0.33.0-clever-beta.1` |
| Status | Mantido — não republicado |

**Latest publicado?** Não.

---

## 5. Dockerfiles alterados

| Arquivo | Linha | Mudança |
|---|---|---|
| `Dockerfile.dashboard` | ~70 | `uv pip install torch --index-url .../cpu` antes do `uv sync` |
| `Dockerfile.swarm` | ~65 | `uv pip install torch --index-url .../cpu` antes do `uv sync` |

---

## 6. Validação local

| Teste | Resultado |
|---|---|
| `torch.__version__` | _(registrar)_ |
| `torch.cuda.is_available()` | `False` ✅ |
| `sentence_transformers` import | _(registrar)_ |
| CUDA libs na imagem | _(registrar — esperado: zero ou apenas stubs CPU)_ |
| Dashboard health (`:8080`) | _(registrar)_ |
| Terminal-server health (`:32352`) | _(registrar)_ |
| Runtime smoke | _(registrar)_ |

---

## 7. Funcionalidades preservadas

| Feature | Introduzida em | Status |
|---|---|---|
| Provider fixes (anthropic/codex/openclaude) | beta.10–14 | ✅ |
| Login username/email | beta.15 | ✅ |
| pt-BR agent labels | beta.16 | ✅ |
| Knowledge (sentence-transformers) | sempre | ✅ CPU-only |
| PDF parsing (marker-pdf) | sempre | ✅ CPU-only |

---

## 8. Validação VPS esperada

1. Disco antes: `df -h /dev/sda1`
2. Fazer pull/deploy beta.17
3. Disco depois: comparar
4. Validar login com email
5. Validar Agents → labels pt-BR
6. Validar Providers → troca de provider
7. Validar Chat e Terminal
8. Executar Knowledge search (sentence-transformers em CPU)
