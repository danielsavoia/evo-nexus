# Beta Fixes — 0.33.0-clever-beta.2

**Data:** 2026-05-25
**Branch:** `clever-beta` (HEAD `7a56c3e`)
**Tag:** `clever-agent-v0.33.0-clever-beta.2`
**Promovido de:** `clever-dev` commit `2f72871`
**Executado por:** Claude (automatizado via Claude Code)

---

## 1. Contexto

Durante o smoke test `0.33.0-clever-beta.1` (Etapa 7) foram identificados dois findings não-bloqueantes:

- **F-01** — Wizard de setup/onboarding ainda exibia "Built on EvoNexus" no footer e cores navy upstream nos cards.
- **F-03** — `providers.example.json` ausente da imagem `clever-agent-dashboard`, causando erro "unknown provider: anthropic" no onboarding e exigindo workaround via `docker exec`.

Esta release corrige ambos.

---

## 2. Mudanças

### F-01 — Footer e paleta do wizard de onboarding

Arquivos corrigidos:

| Arquivo | Mudança |
|---------|---------|
| `dashboard/frontend/src/pages/Setup.tsx` | Footer "Built on EvoNexus" → link "Clever Agent" → `https://cleverai.com.br`; paleta Clever Agent nos inputs e cards |
| `dashboard/frontend/src/pages/onboarding/Welcome.tsx` | Mesma substituição de footer; paleta corrigida |
| `dashboard/frontend/src/pages/onboarding/StepProvider.tsx` | Paleta Clever Agent em todos os cards, inputs e info boxes; OpenRouter URL text `#6366F1` → `#85F2A0`; Codex code display → `text-[#85F2A0]` |
| `dashboard/frontend/src/pages/onboarding/StepConfirm.tsx` | Paleta corrigida |
| `dashboard/frontend/src/pages/onboarding/StepBrainRepo.tsx` | Paleta corrigida |
| `dashboard/frontend/src/pages/onboarding/StepBrainChoose.tsx` | Paleta corrigida; `hover:border-[#2a3a4a]` → `hover:border-[#1E3829]/60` |
| `dashboard/frontend/src/pages/onboarding/StepBrainConnect.tsx` | Paleta corrigida |

**Substituições de cor aplicadas:**

| Cor upstream (navy) | Cor Clever Agent | Papel |
|---------------------|------------------|-------|
| `#0b1018` | `#0D1B12` | Card shell bg |
| `#0f1520` | `#122018` | Input / card inner bg |
| `#0a1220` | `#0D1B12` | Info box bg |
| `#152030` | `#1E3829` | Card shell border |
| `#1e2a3a` | `#1E3829` | Input / divider border |
| `#4a5a6e` | `#6B8A76` | Muted subtitle text |
| `#8a9aae` | `#6B8A76` | Secondary body text |
| `#2d3d4f` | `#2d4a38` | Ultra-muted / footer text |
| `#3d4f65` | `#2d4a38` | Placeholder text |
| `placeholder-[#3d4f65]` | `placeholder-[#2d4a38]` | Input placeholder |

### F-03 — providers.example.json disponível sem workaround

**Arquivo corrigido:** `Dockerfile.dashboard`

**Problema:** `_read_config()` tentava copiar `providers.example.json` de `/workspace/config/providers.example.json`, mas `/workspace/config/` é um volume Docker que começa vazio. O arquivo não era copiado pelo Dockerfile e não havia entrypoint que inicializasse o volume.

**Solução:**
1. Arquivos de exemplo (`providers.example.json`, `workspace.example.yaml`, `smart-router.example.json`, `heartbeats.example.yaml`) são copiados para `/workspace/_config_defaults/` durante o build (fora do volume).
2. Um entrypoint mínimo `/usr/local/bin/init-config.sh` é adicionado; ele copia os arquivos de `_config_defaults/` para `config/` se não existirem — executado a cada `docker run` antes do Flask.
3. O `CMD` permanece `uv run python dashboard/backend/app.py`.

**Resultado:** No primeiro boot, `config/providers.example.json` é criado automaticamente. `_read_config()` encontra o arquivo, inicializa `providers.json` com todos os 8 providers e o onboarding funciona sem docker exec.

> Nota: `Dockerfile.swarm.dashboard` já possuía este padrão via `entrypoint.sh` e `_defaults/config/` — não foi alterado.

---

## 3. Builds

| Target | Resultado |
|--------|-----------|
| `dashboard/frontend` (clever-beta) | ✅ `built in 24.27s` — 0 erros TypeScript |

---

## 4. Imagens GHCR

| Componente | Dockerfile | Imagem | Tag | Digest |
|------------|------------|--------|-----|--------|
| Dashboard (Flask+React+ML) | `Dockerfile.dashboard` | `ghcr.io/danielsavoia/clever-agent-dashboard` | `0.33.0-clever-beta.2` | `sha256:e674fe189efb3cc865acb435afc264ca11dac8a126bd5242dbf41e6ec540800d` |
| Site (nginx+React) | — | Não republicado (sem mudanças) | `0.33.0-clever-beta.1` (mantido) | — |
| Runtime (Node+Python+CLI) | — | Não republicado (sem mudanças) | `0.33.0-clever-beta.1` (mantido) | — |

---

## 5. Git

| Branch | HEAD antes | HEAD após |
|--------|-----------|-----------|
| `clever-dev` | `5d9f2a8` | `6fe2a18` (inclui onboarding color audit) |
| `clever-beta` | `a1273c9` | `ace7cc8` (inclui onboarding color audit) |
| `clever-prod` | `7f5dd76` | `7f5dd76` (inalterado) |
| `upstream-sync` | `fe15fd5` | `fe15fd5` (inalterado) |

**Tag:** `clever-agent-v0.33.0-clever-beta.2` → HEAD `ace7cc8` (F-01/F-03 + onboarding color audit)

---

## 6. Validação

| Item | Resultado |
|------|-----------|
| Footer wizard: "Clever Agent" link | ✅ |
| Sem "Built on EvoNexus" em qualquer tela de setup/onboarding | ✅ |
| Provider cards na paleta Clever Agent (verde, não navy) | ✅ |
| `init-config.sh` semeia `providers.example.json` no primeiro boot | ✅ |
| Anthropic selecionável sem "unknown provider: anthropic" | ✅ (verificado via container exec) |
| Main dashboard carrega | ✅ |
| /goals ok | ✅ |
| /docs ok | ✅ |
| /docs/getting-started ok | ✅ |
| Build TypeScript sem erros | ✅ |
| Imagem GHCR publicada (digest registrado) | ✅ `sha256:e674fe189efb3cc865acb435afc264ca11dac8a126bd5242dbf41e6ec540800d` |
| Smoke GHCR — HTTP `/` 200 | ✅ |
| Smoke GHCR — `/clever-agent.svg` 200 | ✅ |
| Smoke GHCR — `/clever-agent/avatars/avatar_oracle.png` 200 | ✅ |
| Smoke GHCR — title "Clever Agent" no HTML | ✅ |
| Smoke GHCR — sem "EvoNexus" no HTML | ✅ |
| Smoke GHCR — `providers.example.json` semeado com 8 providers | ✅ anthropic, openrouter, omnirouter, openai, codex_auth, gemini, bedrock, vertex |
| Smoke GHCR — `init-config.sh` presente no container | ✅ |
| Onboarding color audit aprovado (zero tokens upstream) | ✅ ver `onboarding-color-audit-0.33.0-clever-beta.2.md` |
| GHCR latest publicado? | ❌ Não |

---

## 7. Escopo preservado

| Regra | Status |
|-------|--------|
| `clever-prod` alterada? | ❌ Não |
| `upstream-sync` alterada? | ❌ Não |
| VPS acessada? | ❌ Não |
| Deploy feito? | ❌ Não |
| GHCR latest publicado? | ❌ Não |
| Force push usado? | ❌ Não |
| Secrets commitados? | ❌ Não |
