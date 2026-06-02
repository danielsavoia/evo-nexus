# Clever Agent dashboard beta.21

**Data:** 2026-06-01
**Branch:** `clever-beta` @ `f0c43b6`
**Base:** `clever-agent-v0.33.0-clever-beta.20` @ `485972f`

---

## Objetivo

Alinhar o balão de mensagem do usuário no chat dos agentes à paleta Clever Agent/Clever AI, removendo a cor navy/azul upstream `#1a2744` herdada do EvoNexus.

---

## Escopo

- `AgentChat.tsx`: balão principal do usuário deixa de usar `bg-[#1a2744]` (navy upstream).
- Balão principal de texto: `bg-[#255938] border border-[#85F2A0]/20` (verde médio Clever).
- Bubble de edição inline do usuário: `bg-[#19402A]` (verde escuro base Clever).
- Texto `#F7F9F8` preservado — legibilidade mantida.
- Mensagens do agente: inalteradas.
- Cards `/agents` pt-BR da beta.20: preservados.
- 38/38 Agent Profiles pt-BR: preservados.
- 193/193 Skills pt-BR: preservadas.
- Runtime `.claude`: intocado.
- Providers, terminal-server, backend: inalterados.

---

## Git

| Item | Valor |
|---|---|
| clever-dev HEAD | `11fc61d` — fix: align chat user bubble with Clever Agent palette |
| clever-beta HEAD | `f0c43b6` — chore: promote Clever Agent dashboard beta.21 chat bubble palette |
| tag | `clever-agent-v0.33.0-clever-beta.21` |
| clever-prod | preservada — não tocada |
| upstream-sync | preservada — não tocada |

### Commits incluídos (beta.20 → beta.21)

| Commit | Descrição |
|---|---|
| `11fc61d` | fix: align chat user bubble with Clever Agent palette |
| `f0c43b6` | chore: promote Clever Agent dashboard beta.21 chat bubble palette |

---

## Imagem

| Item | Valor |
|---|---|
| dashboard tag | `ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.21` |
| digest index | _(pendente — preencher após push GHCR)_ |
| digest linux/amd64 | _(pendente — preencher após push GHCR)_ |
| size local | 3.93 GB (862 MB comprimido) |
| latest publicado | **Não** |

---

## Mantidos

| Serviço | Imagem |
|---|---|
| runtime | `ghcr.io/danielsavoia/clever-agent-runtime:0.33.0-clever-beta.17` |
| site | sem serviço site no stack canônico |

---

## Validação local

| Check | Resultado |
|---|---|
| frontend build (`npm run build`) | ✅ built in 6.21s, zero erros |
| `#255938` em AgentChat.tsx | ✅ linha 1148 |
| `#19402A` em AgentChat.tsx | ✅ linha 1060 |
| `#1a2744` em AgentChat.tsx | ✅ ausente |
| `#1a2744` em CodeView (escopo out) | ✅ CodeMirror selection color — fora do escopo |
| node --version no container | ✅ v22.22.2 |
| which claude no container | ✅ /usr/bin/claude |
| which openclaude no container | ✅ /usr/bin/openclaude |
| terminal_node_modules_ok | ✅ |
| frontend_dist_ok | ✅ |
| `#255938` no dist/assets (AgentChat bundle) | ✅ AgentChat-D2RTNjEZ.js |
| `#19402A` no dist/assets (AgentChat bundle) | ✅ AgentChat-D2RTNjEZ.js |
| pt-BR: `RH e Opera` no bundle | ✅ Agents-BAcgMB_W.js |
| pt-BR: `Criador de Imagens` no bundle | ✅ skill-overlays-aFvXxkWA.js |
| Flask HTTP no container | ✅ 200 OK |
| terminal-server health | ✅ `{"status":"ok"}` |
| `.claude` alterado | ✅ Não |

---

## Pendências

- [ ] Push GHCR: `docker push ghcr.io/danielsavoia/clever-agent-dashboard:0.33.0-clever-beta.21`
- [ ] Capturar digest real e atualizar campos acima.
- [ ] Validação visual VPS: deploy dashboard beta.21, confirmar balão verde no chat.

---

## Reapply checklist pós-upstream merge

1. Verificar `AgentChat.tsx` — grep `1a2744` deve retornar zero resultados.
2. Confirmar `bg-[#255938]` presente na linha do balão principal do usuário.
3. Confirmar `bg-[#19402A]` presente na linha do bubble de edição inline.
4. Enviar mensagem como usuário no chat → balão verde (não azul/navy).
5. Clicar no lápis → editar mensagem → bubble verde escuro.
6. Mensagens do agente: sem alteração visual.
