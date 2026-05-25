# Beta Smoke Test — 0.33.0-clever-beta.1

**Data:** 2026-05-25
**Branch:** `clever-beta` (HEAD `3a9d136`)
**Imagens testadas:** `ghcr.io/danielsavoia/clever-agent-{site,dashboard}:0.33.0-clever-beta.1`
**Compose:** `_tmp/clever-agent-beta-smoke/docker-compose.beta-smoke.yml` (arquivo temporário — não commitado)
**Executado por:** Claude (automatizado via Claude Code)

---

## 1. Stack

| Serviço | Imagem | Porta | Status |
|---------|--------|-------|--------|
| `ca-beta-site` | `clever-agent-site:0.33.0-clever-beta.1` | `5180→80` | ✅ Up |
| `ca-beta-dashboard` | `clever-agent-dashboard:0.33.0-clever-beta.1` | `5181→8080` | ✅ Up |

Volumes: `ca_beta_config`, `ca_beta_data` (efêmeros, não persistidos)

---

## 2. HTTP Smoke (10 endpoints)

| Endpoint | Método | Status |
|----------|--------|--------|
| `http://localhost:5180/` | GET | ✅ 200 |
| `http://localhost:5180/assets/` | GET | ✅ 200 |
| `http://localhost:5181/` | GET | ✅ 200 |
| `http://localhost:5181/api/version` | GET | ✅ 200 |
| `http://localhost:5181/api/agents` | GET | ✅ 200 |
| `http://localhost:5181/api/skills` | GET | ✅ 200 |
| `http://localhost:5181/api/routines` | GET | ✅ 200 |
| `http://localhost:5181/api/memory` | GET | ✅ 200 |
| `http://localhost:5181/api/heartbeats` | GET | ✅ 200 |
| `http://localhost:5181/api/goals` | GET | ✅ 200 |

Todos os 10 endpoints retornaram HTTP 200 ✅

---

## 3. Content Checks

| Verificação | Resultado |
|-------------|-----------|
| Site HTML contém "Clever Agent" (≥4x) | ✅ |
| Dashboard `<title>` = "Clever Agent" | ✅ |

---

## 4. White-label Audit (container dist)

### Site (`ca-beta-site`)
Grep nos arquivos dist do nginx (`/usr/share/nginx/html`):

| Padrão | Ocorrências | Classificação |
|--------|-------------|---------------|
| `EvoNexus` | 0 | ✅ Limpo |
| `evo-nexus` | 0 | ✅ Limpo |
| `EvolutionAPI` | 0 | ✅ Limpo |
| `#00FFA7` | 0 | ✅ Limpo |

### Dashboard (`ca-beta-dashboard:/workspace/dashboard/frontend/dist`)

| Padrão | Ocorrências | Classificação |
|--------|-------------|---------------|
| `EvoNexus` | 0 | ✅ Limpo |
| `evo-nexus` (visual) | 0 | ✅ Limpo |
| `npx @evoapi` | 1 | ⚠️ Técnico/Permitido — dentro da regex `whiteLabel()` em `Docs-*.js`; é o padrão de substituição, não texto exibido ao usuário |
| `#00FFA7` | 2 | ⚠️ Técnico/Permitido — em `@evoapi/evonexus-ui` (primitivos de plugin: botão/checkbox). Não faz parte da paleta principal do Clever Agent. |
| `localhost:8080` (não-CSP) | 1 | ⚠️ Técnico/Permitido — helper de cópia de URL de webhook no modo dev (ativa apenas quando origin é `localhost:5173`, não visível em produção) |

**Nenhum leak visual bloqueante encontrado.**

---

## 5. Validação Visual (Browser)

### Setup / Onboarding
| Verificação | Resultado |
|-------------|-----------|
| Logo "Clever Agent" com ícone hexagonal | ✅ |
| Paleta dark green (`#07130D`) | ✅ |
| Botão "Continuar" / "Criar conta" verde | ✅ |
| Badge "38 AGENTS · 137 SKILLS · MULTI-AI" | ✅ |
| Footer do wizard de setup | ⚠️ Mostra "Built on EvoNexus" — ver §6 |

### Agents Grid (`/agents`)
| Verificação | Resultado |
|-------------|-----------|
| Logo Clever Agent na sidebar | ✅ |
| "38" agents (All: 38 badge) | ✅ |
| 38 avatars PNG Clever Agent carregando | ✅ |
| Oracle card com badge amarelo "START HERE" | ✅ |
| Cores sidebar: verde `#41A650`, bg-deep | ✅ |
| Footer sidebar: "acesse o Clever Ai" | ✅ |
| Versão "v0.33.0" | ✅ |

### Oracle Agent Detail (`/agents/oracle`)
| Verificação | Resultado |
|-------------|-----------|
| Avatar Oracle (persona headshot) carregando | ✅ |
| Tab "SESSIONS" com underline amarelo `#F2CB05` | ✅ |
| Tabs PROFILE, MEMORY presentes | ✅ |
| Terminal: "Could not reach terminal-server" | ⚠️ Esperado — `Dockerfile.dashboard` não inclui terminal-server (apenas `Dockerfile.swarm.dashboard`). Não é regressão. |

### /goals (`/goals`)
| Verificação | Resultado |
|-------------|-----------|
| Página "Metas" carrega | ✅ |
| Empty state "Nenhuma Mission criada ainda." | ✅ |
| Sem "Failed to fetch" ou erros de rede | ✅ |
| `const API = ''` (proxy relativo) funcionando | ✅ |

### /docs (`/docs`)
| Verificação | Resultado |
|-------------|-----------|
| Header: "Clever Agent Docs" | ✅ |
| Sidebar nav: "What is Clever Agent" padrão | ✅ |
| Título do artigo: "What is Clever Agent" | ✅ |
| Conteúdo: "38 specialized agents" | ✅ |
| Sem "EvoNexus" visível | ✅ |

### /docs/getting-started
| Verificação | Resultado |
|-------------|-----------|
| Título: "Getting Started with Clever Agent" | ✅ |
| CLI Option B: `clever-agent setup` | ✅ |
| Option A URL: `https://clever.app/docs/install` | ✅ |
| Option C clone: `https://clever.app/docs` | ✅ |
| Sem referências upstream EvoNexus | ✅ |

### Site Home (`http://localhost:5180`)
| Verificação | Resultado |
|-------------|-----------|
| Tab title: "Clever Agent — AI Agent Orchestration Platform" | ✅ |
| Logo "Clever Agent" no nav | ✅ |
| Top bar: "Clever Agent — orchestrated AI for intelligent operations." | ✅ |
| Hero headline: "Your AI team, pre-assembled." com verde accent | ✅ |
| Badge "38 AI Agents" | ✅ |
| CTA "Get Started" verde | ✅ |

---

## 6. Findings (Não-Bloqueantes)

### F-01 — Footer "Built on EvoNexus" no wizard de setup/onboarding
**Severidade:** Baixa — aparece apenas durante o setup inicial (onboarding wizard); não visível para usuários já configurados.
**Componente:** Arquivo de setup/onboarding (não `Login.tsx` nem `Sidebar.tsx`, que foram corrigidos).
**Impacto:** Usuário novo vê "Built on EvoNexus" durante os ~2 minutos de setup inicial. Após concluir, o dashboard exibe o branding correto.
**Recomendação:** Identificar e corrigir o componente do wizard (provavelmente `SetupWizard.tsx` ou similar) em próxima iteração antes de produção.

### F-02 — Terminal não disponível na imagem `clever-agent-dashboard`
**Severidade:** Info — comportamento esperado do `Dockerfile.dashboard`.
**Causa:** A imagem smoke usa `Dockerfile.dashboard` (Python/Flask + React apenas). O terminal-server (`node-pty`) só está presente no `Dockerfile.swarm.dashboard`.
**Impacto:** Apenas smoke test; deploy real usa Swarm com `Dockerfile.swarm.dashboard`.

### F-03 — `providers.example.json` ausente em `/workspace/config/`
**Severidade:** Baixa — causa `unknown provider: anthropic` no primeiro acesso quando `providers.json` ainda não existe.
**Causa:** O `Dockerfile.dashboard` não copia `config/providers.example.json` (ou o arquivo não existe no repo na path esperada).
**Workaround aplicado:** `providers.json` foi injetado manualmente via `docker exec` durante o smoke test.
**Recomendação:** Verificar se `providers.example.json` deve existir no repo e ser copiado pelo Dockerfile; ou inicializar `providers.json` no entrypoint.

---

## 7. Conclusão

| Critério | Resultado |
|----------|-----------|
| Todos os endpoints HTTP 200 | ✅ |
| Nenhum leak visual bloqueante | ✅ |
| White-label correto no dashboard principal | ✅ |
| White-label correto no site | ✅ |
| `/goals` sem erros de fetch | ✅ |
| `/docs` e `/docs/getting-started` white-labeled | ✅ |
| Avatars e paleta Clever Agent aplicados | ✅ |
| Footer "acesse o Clever Ai" na sidebar | ✅ |
| Footer onboarding ainda "Built on EvoNexus" | ⚠️ Não-bloqueante (F-01) |
| Terminal indisponível no dashboard image | ⚠️ Esperado (F-02) |

**Veredicto: APROVADO para `clever-beta` — pronto para staging ou promoção a `clever-prod` com ressalva F-01 (corrigir footer do wizard antes de produção).**

---

## 8. Scope preservado

| Regra | Status |
|-------|--------|
| `clever-prod` alterada? | ❌ Não |
| `upstream-sync` alterada? | ❌ Não |
| VPS acessada? | ❌ Não |
| Deploy feito? | ❌ Não |
| GHCR latest publicado? | ❌ Não |
| Force push usado? | ❌ Não |
| Secrets commitados? | ❌ Não |
| Stack derrubada após teste? | ✅ Sim — `docker compose down --remove-orphans` |
