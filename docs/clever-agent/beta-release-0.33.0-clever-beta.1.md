# Clever Agent Beta Release — 0.33.0-clever-beta.1

**Branch:** `clever-beta`
**Date:** 2026-05-24
**Promoted by:** Claude (automated via Claude Code)

---

## 1. Branches

| Branch | HEAD antes da promoção | HEAD após promoção |
|---|---|---|
| `clever-dev` | `2c35c98` | `2c35c98` (inalterado) |
| `clever-beta` | `7f5dd76` (upstream base) | `ae3b896` (após merge + Dockerfile fix) |
| `clever-prod` | `7f5dd76` | `7f5dd76` (**preservada, não alterada**) |
| `upstream-sync` | `fe15fd5` | `fe15fd5` (**preservada, não alterada**) |

Merge commit: `f4b9002` — `chore: promote clever-dev to clever-beta after visual validation (Etapa 6.6.2)`

---

## 2. Commits Clever Agent incluídos (sobre upstream v0.33.0)

| Commit | Descrição |
|---|---|
| `ae3b896` | fix: add dashboard/packages to Docker build context for @evoapi/evonexus-ui |
| `f4b9002` | chore: promote clever-dev to clever-beta (merge commit) |
| `2c35c98` | docs: add Goals and Docs revalidation report (Etapa 6.6.2) |
| `fe49ec9` | feat: replace 'Built on EvoNexus' footer with Clever Ai link |
| `5cfe9b6` | docs: record goals and docs white-label overlay (Etapa 6.6.1) |
| `7d556af` | fix: repair goals and docs white-label before beta (Etapa 6.6.1) |
| `85d0acc` | docs: add visual validation report for Etapa 6.6 |
| `41cc42a` | fix: add Clever Agent yellow accent details (Etapa 6.5.1) |
| `8d430c0` | fix: apply Clever Agent palette to full dashboard UI surfaces (Etapa 6.5) |
| `964d903` | feat: apply Clever Agent color theme (Etapa 6.4) |
| `32526f1` | docs: consolidate Clever Agent white-label overlay and color audit |
| `ba52926` | feat: apply approved Clever Agent persona avatars (PNG) |
| `00cd3a8` | docs: add agent avatar inventory for persona prompt design |
| `a9e83d0` | fix: rebuild Clever Agent avatars as persona headshots |
| `853532f` | feat: add Clever Agent white-label avatars |
| `22429a0` | fix: clean up Clever Agent branding after upstream sync |
| `04780b9` | chore: ignore local Claude launch config |
| `964a48c` | chore: align dashboard dependencies after upstream sync |
| `b50e4d2` | fix: align version to 0.33.0 after upstream sync |
| `0998bbb` | fix: resolve upstream v0.33 build issues + document reconciliation |
| `095eb0b` | merge: reconcile Clever Agent with upstream v0.33 (develop) |
| `ebec9a8` | fix: remove EvoNexus footer links and fix branding issues |
| `8638de0` | feat: apply Clever Agent visual white-label branding |

---

## 3. White-label incluído

| Item | Status |
|---|---|
| Logo `clever-agent-dark.svg` (sidebar) | ✅ Aplicado |
| Logo `clever-agent.svg` (light variant) | ✅ Aplicado |
| Favicon `favicon.ico`, `favicon.svg` | ✅ Aplicado |
| `<title>Clever Agent</title>` | ✅ Aplicado |
| Remoção "Open source" como posicionamento comercial | ✅ Aplicado |
| Remoção de CTAs upstream (repo, npm, Docker Hub) | ✅ Aplicado |
| 38 avatars PNG (personas Clever Agent) | ✅ Aplicados |
| Paleta green: `#85F2A0` (accent), `#41A650` (action), `#07130D` (bg-deep) | ✅ Aplicada |
| Yellow accent `#F2CB05` em 8 pontos de UI | ✅ Aplicado |
| `Docs.tsx` — `whiteLabel()` runtime overlay | ✅ Aplicada |
| `Docs.tsx` sidebar header "Clever Agent Docs" | ✅ Aplicado |
| `Goals.tsx` — `const API = ''` (proxy fix) | ✅ Aplicado |
| `Goals.tsx` — error state amigável + retry | ✅ Aplicado |
| Footer — "acesse o Clever Ai" → `https://cleverai.com.br` | ✅ Aplicado |
| `Dockerfile.dashboard` + `Dockerfile.swarm.dashboard` workspace fix | ✅ Aplicado |

---

## 4. Builds

| Target | Comando | Resultado |
|---|---|---|
| `dashboard/frontend` (clever-dev) | `npm run build` | ✅ `built in 1.80s` — sem erros TypeScript |
| `site` (clever-dev) | `npm run build` | ✅ `built in 20.49s` — sem erros TypeScript |
| `dashboard/frontend` (clever-beta) | `npm run build` | ✅ `built in 1.54s` — sem erros TypeScript |
| `site` (clever-beta) | `npm run build` | ✅ `built in 6.88s` — sem erros TypeScript |

---

## 5. Imagens GHCR

| Componente | Dockerfile | Imagem | Tag | Status |
|---|---|---|---|---|
| Site (nginx+React) | `site/Dockerfile` | `ghcr.io/danielsavoia/clever-agent-site` | `0.33.0-clever-beta.1` | ✅ Publicada — digest: `sha256:e3c74abd70cb558981a18b5d1a0df2976f0bd1fc7229161f68c84f0118ba7caa` |
| Dashboard (Flask+React+ML) | `Dockerfile.dashboard` | `ghcr.io/danielsavoia/clever-agent-dashboard` | `0.33.0-clever-beta.1` | ✅ Publicada (8.95 GB) — digest: `sha256:278f9fac7fa80fddcddcc7a881828318d3f17ba76501d2130f416159d6353fca` |
| Runtime (Node+Python+Claude CLI) | `Dockerfile` | `ghcr.io/danielsavoia/clever-agent-runtime` | `0.33.0-clever-beta.1` | ✅ Publicada (3.8 GB) — digest: `sha256:6e1920c18a63e70f2665c9d9c42def46b817dbc1d3f5b31e9bd565a1f6389dd1` |

### Nota sobre tamanho das imagens

A imagem `clever-agent-dashboard` tem 8.95 GB porque o `pyproject.toml` inclui
`sentence-transformers>=3.0` e `marker-pdf>=1.6.1`, que puxam PyTorch (~3GB).
Isso é o comportamento upstream e não foi alterado nesta etapa.

### Nota sobre `@evoapi/evonexus-ui`

Os Dockerfiles `Dockerfile.dashboard` e `Dockerfile.swarm.dashboard` não copiavam
`dashboard/packages/` (que contém o pacote workspace `@evoapi/evonexus-ui`), causando
falha TypeScript no build. Corrigidos nesta etapa via commit `ae3b896`.

---

## 6. Git tag

| Item | Valor |
|---|---|
| Tag | `clever-agent-v0.33.0-clever-beta.1` |
| Tipo | Annotated (`git tag -a`) |
| Aponta para | `ae3b896` (HEAD de `clever-beta`) |
| Push | ✅ `origin/clever-agent-v0.33.0-clever-beta.1` |

---

## 7. Validações locais (Etapa 6.6.2 — commit `2c35c98`)

| Página | Resultado |
|---|---|
| `/goals` | ✅ Carrega, empty state "Nenhuma Mission criada ainda.", sem `Failed to fetch` |
| `/docs` | ✅ Header "Clever Agent Docs", conteúdo "What is Clever Agent" por padrão |
| `/docs/getting-started` | ✅ Título correto, `clever-agent setup`, `clever.app/docs`, sem upstream |
| Sidebar | ✅ Logo Clever Agent, paleta green, footer "acesse o Clever Ai" |
| Login footer | ✅ "acesse o Clever Ai" com link `https://cleverai.com.br` |

---

## 8. Pendências após esta etapa

| Item | Status |
|---|---|
| Push dashboard (8.95 GB) para GHCR | ✅ Concluído — digest registrado |
| Push runtime (3.8 GB) para GHCR | ✅ Concluído — digest registrado |
| Todos os digests GHCR registrados | ✅ |
| Deploy VPS | ❌ Não nesta etapa — aguarda decisão do usuário |
| Promoção para `clever-prod` | ❌ Não nesta etapa — aguarda decisão do usuário |
| Redução do tamanho da imagem dashboard | ⚠️ Opcional — `sentence-transformers` é pesado; avaliar se pode ser opcional |

---

## 9. Segurança

| Verificação | Status |
|---|---|
| Nenhum token commitado | ✅ Confirmado |
| Nenhum secret exposto em arquivos | ✅ Confirmado |
| `GITHUB_TOKEN` usado apenas como variável de ambiente em sessão | ✅ Confirmado |
| Nenhuma tag `latest` publicada | ✅ Confirmado |
| `.dockerignore` preserva `.env`, `workspace/`, `agent-memory/` | ✅ Verificado |

---

## 10. Escopo preservado

| Regra | Status |
|---|---|
| `clever-prod` alterada? | ❌ Não — HEAD `7f5dd76` inalterado |
| `upstream-sync` alterada? | ❌ Não — HEAD `fe15fd5` inalterado |
| VPS acessada? | ❌ Não |
| Deploy feito? | ❌ Não |
| GHCR latest publicado? | ❌ Não — apenas tag fixa `0.33.0-clever-beta.1` |
| Clever AI alterado? | ❌ Não |
| `clever-ai-infra` alterado? | ❌ Não |
| `evo-crm-community` alterado? | ❌ Não |
| Force push usado? | ❌ Não |
| Secrets commitados? | ❌ Não |

---

## 11. Próxima etapa recomendada

1. **Validação manual** — clonar `clever-beta` e rodar `docker compose -f docker-compose.yml up` localmente para smoke test completo.
2. **Aguardar pushes GHCR** — dashboard (8.95 GB) e runtime podem demorar; verificar digests no GHCR após completar.
3. **Decisão VPS/deploy** — quando o usuário aprovar, planejar `clever-beta` deploy em ambiente staging separado.
4. **Promoção para `clever-prod`** — apenas após validação em ambiente de staging, com aprovação explícita do usuário.
5. **Revisão do tamanho da imagem** — avaliar se `sentence-transformers` pode ser instalado on-demand (não em imagem base) para reduzir o pull time de 8.95 GB.
