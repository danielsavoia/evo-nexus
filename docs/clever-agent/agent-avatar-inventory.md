# Relatório — Inventário dos agentes para criação de avatars Clever Agent

## 1. Resumo geral
- Quantidade total de agentes: 38
- Quantidade total de avatars atuais: 38 (legado em /avatar/) + 38 (white-label em /clever-agent/avatars/)
- Path atual dos avatars: dashboard/frontend/public/avatar/ (originais) e dashboard/frontend/public/clever-agent/avatars/ (ativos no mapeamento)
- Arquivos principais de referência:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/public/avatar/
  - dashboard/frontend/public/clever-agent/avatars/
- Componentes que exibem avatars:
  - dashboard/frontend/src/components/AgentAvatar.tsx
  - dashboard/frontend/src/components/AgentIcon.tsx
  - dashboard/frontend/src/pages/Agents.tsx
  - dashboard/frontend/src/pages/AgentDetail.tsx
  - dashboard/frontend/src/pages/Topics.tsx
  - dashboard/frontend/src/components/ThreadsSidebar.tsx
  - dashboard/frontend/src/components/AgentChat.tsx (via AgentAvatar)

## 2. Tabela geral dos agentes
| # | Nome | Slug/ID | Categoria | Função principal | Avatar atual | Path do avatar |
|---|---|---|---|---|---|---|
| 1 | Atlas | atlas-project | Projects | Coordenação de projetos | avatar_atlas.svg | /clever-agent/avatars/avatar_atlas.svg |
| 2 | Clawdia | clawdia-assistant | Operations | Assistência operacional | avatar_clawdia.svg | /clever-agent/avatars/avatar_clawdia.svg |
| 3 | Flux | flux-finance | Finance | Gestão financeira | avatar_flux.svg | /clever-agent/avatars/avatar_flux.svg |
| 4 | Kai | kai-personal-assistant | Personal | Assistência pessoal | avatar_kai.svg | /clever-agent/avatars/avatar_kai.svg |
| 5 | Mentor | mentor-courses | Courses / Education | Mentoria educacional | avatar_mentor.svg | /clever-agent/avatars/avatar_mentor.svg |
| 6 | Lumen | lumen-learning | Courses / Education | Retenção de aprendizado | avatar_lumen.svg | /clever-agent/avatars/avatar_lumen.svg |
| 7 | Nex | nex-sales | Sales | Operação comercial | avatar_nex.svg | /clever-agent/avatars/avatar_nex.svg |
| 8 | Pixel | pixel-social-media | Social Media | Conteúdo e redes | avatar_pixel.svg | /clever-agent/avatars/avatar_pixel.svg |
| 9 | Pulse | pulse-community | Community | Gestão de comunidade | avatar_pulse.svg | /clever-agent/avatars/avatar_pulse.svg |
| 10 | Sage | sage-strategy | Strategy | Estratégia | avatar_sage.svg | /clever-agent/avatars/avatar_sage.svg |
| 11 | Oracle | oracle | Knowledge | Curadoria de conhecimento | avatar_oracle.svg | /clever-agent/avatars/avatar_oracle.svg |
| 12 | Mako | mako-marketing | Marketing | Marketing e campanhas | avatar_mako.svg | /clever-agent/avatars/avatar_mako.svg |
| 13 | Aria | aria-hr | HR / People | People Ops | avatar_aria.svg | /clever-agent/avatars/avatar_aria.svg |
| 14 | Zara | zara-cs | Customer Success | Sucesso do cliente | avatar_zara.svg | /clever-agent/avatars/avatar_zara.svg |
| 15 | Lex | lex-legal | Legal | Jurídico e compliance | avatar_lex.svg | /clever-agent/avatars/avatar_lex.svg |
| 16 | Nova | nova-product | Product | Gestão de produto | avatar_nova.svg | /clever-agent/avatars/avatar_nova.svg |
| 17 | Dex | dex-data | Data / BI | Dados e BI | avatar_dex.svg | /clever-agent/avatars/avatar_dex.svg |
| 18 | Helm | helm-conductor | Operations / Orchestration | Orquestração de ciclo | avatar_helm.svg | /clever-agent/avatars/avatar_helm.svg |
| 19 | Mirror | mirror-retro | Retrospective | Retrospectiva | avatar_mirror.svg | /clever-agent/avatars/avatar_mirror.svg |
| 20 | Apex | apex-architect | Engineering | Arquitetura | avatar_apex.svg | /clever-agent/avatars/avatar_apex.svg |
| 21 | Bolt | bolt-executor | Engineering | Execução técnica | avatar_bolt.svg | /clever-agent/avatars/avatar_bolt.svg |
| 22 | Canvas | canvas-designer | Engineering / Design | Design aplicado | avatar_canvas.svg | /clever-agent/avatars/avatar_canvas.svg |
| 23 | Compass | compass-planner | Engineering / Planning | Planejamento técnico | avatar_compass.svg | /clever-agent/avatars/avatar_compass.svg |
| 24 | Echo | echo-analyst | Engineering / Analysis | Análise técnica | avatar_echo.svg | /clever-agent/avatars/avatar_echo.svg |
| 25 | Flow | flow-git | Engineering / Git | Operações de versionamento | avatar_flow.svg | /clever-agent/avatars/avatar_flow.svg |
| 26 | Grid | grid-tester | Engineering / QA | Testes | avatar_grid.svg | /clever-agent/avatars/avatar_grid.svg |
| 27 | Hawk | hawk-debugger | Engineering / Debug | Debug | avatar_hawk.svg | /clever-agent/avatars/avatar_hawk.svg |
| 28 | Lens | lens-reviewer | Engineering / Review | Code review | avatar_lens.svg | /clever-agent/avatars/avatar_lens.svg |
| 29 | Oath | oath-verifier | Engineering / Verification | Verificação final | avatar_oath.svg | /clever-agent/avatars/avatar_oath.svg |
| 30 | Prism | prism-scientist | Engineering / Research | Pesquisa técnica | avatar_prism.svg | /clever-agent/avatars/avatar_prism.svg |
| 31 | Probe | probe-qa | Engineering / QA | QA investigativo | avatar_probe.svg | /clever-agent/avatars/avatar_probe.svg |
| 32 | Quill | quill-writer | Engineering / Docs | Documentação | avatar_quill.svg | /clever-agent/avatars/avatar_quill.svg |
| 33 | Raven | raven-critic | Engineering / Critic | Crítica técnica | avatar_raven.svg | /clever-agent/avatars/avatar_raven.svg |
| 34 | Scout | scout-explorer | Engineering / Discovery | Exploração | avatar_scout.svg | /clever-agent/avatars/avatar_scout.svg |
| 35 | Scroll | scroll-docs | Engineering / Docs | Especialista documental | avatar_scroll.svg | /clever-agent/avatars/avatar_scroll.svg |
| 36 | Trail | trail-tracer | Engineering / Tracing | Rastreamento | avatar_trail.svg | /clever-agent/avatars/avatar_trail.svg |
| 37 | Vault | vault-security | Security | Revisão de segurança | avatar_vault.svg | /clever-agent/avatars/avatar_vault.svg |
| 38 | Zen | zen-simplifier | Engineering / Simplification | Simplificação de código | avatar_zen.svg | /clever-agent/avatars/avatar_zen.svg |

## 3. Fichas detalhadas por agente

### Agente 1 — Atlas
- Slug/ID: atlas-project
- Categoria: Projects
- Função principal: Coordenação de projetos
- Resumo do que faz: Gerencia organização e andamento de projetos.
- Tom/persona atual: Organizado, metódico
- Palavras-chave: projeto, planejamento, entrega
- Avatar atual: avatar_atlas.svg
- Path do avatar: /clever-agent/avatars/avatar_atlas.svg (ativo) e dashboard/frontend/public/avatar/avatar_atlas.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Projects
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: clipboard/checklist
- Expressão sugerida: foco confiante
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 2 — Clawdia
- Slug/ID: clawdia-assistant
- Categoria: Operations
- Função principal: Assistência operacional
- Resumo do que faz: Centraliza rotinas operacionais e apoio executivo.
- Tom/persona atual: Ágil, executiva
- Palavras-chave: operação, agenda, rotina
- Avatar atual: avatar_clawdia.svg
- Path do avatar: /clever-agent/avatars/avatar_clawdia.svg (ativo) e dashboard/frontend/public/avatar/avatar_clawdia.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Operations
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: earpiece/notificação
- Expressão sugerida: atenta
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Parcial (escopo exato depende de playbooks)

### Agente 3 — Flux
- Slug/ID: flux-finance
- Categoria: Finance
- Função principal: Gestão financeira
- Resumo do que faz: Acompanha métricas e processos financeiros.
- Tom/persona atual: Preciso, sóbrio
- Palavras-chave: finanças, controle, métricas
- Avatar atual: avatar_flux.svg
- Path do avatar: /clever-agent/avatars/avatar_flux.svg (ativo) e dashboard/frontend/public/avatar/avatar_flux.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Finance
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: gráfico/moeda
- Expressão sugerida: segura
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 4 — Kai
- Slug/ID: kai-personal-assistant
- Categoria: Personal
- Função principal: Assistência pessoal
- Resumo do que faz: Apoia organização pessoal e produtividade diária.
- Tom/persona atual: Próximo, prestativo
- Palavras-chave: pessoal, produtividade, rotina
- Avatar atual: avatar_kai.svg
- Path do avatar: /clever-agent/avatars/avatar_kai.svg (ativo) e dashboard/frontend/public/avatar/avatar_kai.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Personal
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: agenda/coração discreto
- Expressão sugerida: calma
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 5 — Mentor
- Slug/ID: mentor-courses
- Categoria: Courses / Education
- Função principal: Mentoria educacional
- Resumo do que faz: Suporte em cursos e trilhas de aprendizagem.
- Tom/persona atual: Didático, inspirador
- Palavras-chave: curso, ensino, trilha
- Avatar atual: avatar_mentor.svg
- Path do avatar: /clever-agent/avatars/avatar_mentor.svg (ativo) e dashboard/frontend/public/avatar/avatar_mentor.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Courses / Education
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: cap/livro
- Expressão sugerida: encorajadora
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 6 — Lumen
- Slug/ID: lumen-learning
- Categoria: Courses / Education
- Função principal: Retenção de aprendizado
- Resumo do que faz: Foco em reforço e retenção de conhecimento.
- Tom/persona atual: Paciente, analítico
- Palavras-chave: aprendizado, retenção, revisão
- Avatar atual: avatar_lumen.svg
- Path do avatar: /clever-agent/avatars/avatar_lumen.svg (ativo) e dashboard/frontend/public/avatar/avatar_lumen.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Courses / Education
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: lâmpada/notas
- Expressão sugerida: atenta
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Parcial

### Agente 7 — Nex
- Slug/ID: nex-sales
- Categoria: Sales
- Função principal: Operação comercial
- Resumo do que faz: Suporte a pipeline e execução de vendas.
- Tom/persona atual: Convincente, objetivo
- Palavras-chave: vendas, pipeline, negociação
- Avatar atual: avatar_nex.svg
- Path do avatar: /clever-agent/avatars/avatar_nex.svg (ativo) e dashboard/frontend/public/avatar/avatar_nex.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Sales
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: badge comercial
- Expressão sugerida: confiante
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 8 — Pixel
- Slug/ID: pixel-social-media
- Categoria: Social Media
- Função principal: Conteúdo e redes
- Resumo do que faz: Apoia planejamento e execução em social media.
- Tom/persona atual: Criativo, comunicativo
- Palavras-chave: conteúdo, rede social, engajamento
- Avatar atual: avatar_pixel.svg
- Path do avatar: /clever-agent/avatars/avatar_pixel.svg (ativo) e dashboard/frontend/public/avatar/avatar_pixel.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Social Media
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: spark/post
- Expressão sugerida: dinâmica
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 9 — Pulse
- Slug/ID: pulse-community
- Categoria: Community
- Função principal: Gestão de comunidade
- Resumo do que faz: Monitora e organiza interações de comunidade.
- Tom/persona atual: Empático, ativo
- Palavras-chave: comunidade, moderação, resposta
- Avatar atual: avatar_pulse.svg
- Path do avatar: /clever-agent/avatars/avatar_pulse.svg (ativo) e dashboard/frontend/public/avatar/avatar_pulse.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Community
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: chat bubble
- Expressão sugerida: acolhedora
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 10 — Sage
- Slug/ID: sage-strategy
- Categoria: Strategy
- Função principal: Estratégia
- Resumo do que faz: Analisa direcionamento e decisões estratégicas.
- Tom/persona atual: Sênior, ponderado
- Palavras-chave: estratégia, decisão, visão
- Avatar atual: avatar_sage.svg
- Path do avatar: /clever-agent/avatars/avatar_sage.svg (ativo) e dashboard/frontend/public/avatar/avatar_sage.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Strategy
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: compasso
- Expressão sugerida: serena
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 11 — Oracle
- Slug/ID: oracle
- Categoria: Knowledge
- Função principal: Curadoria de conhecimento
- Resumo do que faz: Organiza e consulta base de conhecimento.
- Tom/persona atual: Consultivo, criterioso
- Palavras-chave: conhecimento, referência, consulta
- Avatar atual: avatar_oracle.svg
- Path do avatar: /clever-agent/avatars/avatar_oracle.svg (ativo) e dashboard/frontend/public/avatar/avatar_oracle.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Knowledge
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: livro
- Expressão sugerida: neutra
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 12 — Mako
- Slug/ID: mako-marketing
- Categoria: Marketing
- Função principal: Marketing e campanhas
- Resumo do que faz: Apoia campanhas, comunicação e execução de marketing.
- Tom/persona atual: Energético, criativo
- Palavras-chave: marketing, campanha, growth
- Avatar atual: avatar_mako.svg
- Path do avatar: /clever-agent/avatars/avatar_mako.svg (ativo) e dashboard/frontend/public/avatar/avatar_mako.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Marketing
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: megafone
- Expressão sugerida: proativa
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 13 — Aria
- Slug/ID: aria-hr
- Categoria: HR / People
- Função principal: People Ops
- Resumo do que faz: Apoia processos de pessoas e RH.
- Tom/persona atual: Acolhedor, profissional
- Palavras-chave: rh, pessoas, onboarding
- Avatar atual: avatar_aria.svg
- Path do avatar: /clever-agent/avatars/avatar_aria.svg (ativo) e dashboard/frontend/public/avatar/avatar_aria.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de HR / People
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: crachá
- Expressão sugerida: amigável
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 14 — Zara
- Slug/ID: zara-cs
- Categoria: Customer Success
- Função principal: Sucesso do cliente
- Resumo do que faz: Acompanha satisfação e suporte ao cliente.
- Tom/persona atual: Cuidadosa, resolutiva
- Palavras-chave: cs, suporte, retenção
- Avatar atual: avatar_zara.svg
- Path do avatar: /clever-agent/avatars/avatar_zara.svg (ativo) e dashboard/frontend/public/avatar/avatar_zara.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Customer Success
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: headset
- Expressão sugerida: prestativa
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 15 — Lex
- Slug/ID: lex-legal
- Categoria: Legal
- Função principal: Jurídico e compliance
- Resumo do que faz: Suporte em revisão e cautelas jurídicas.
- Tom/persona atual: Formal, confiável
- Palavras-chave: jurídico, contrato, compliance
- Avatar atual: avatar_lex.svg
- Path do avatar: /clever-agent/avatars/avatar_lex.svg (ativo) e dashboard/frontend/public/avatar/avatar_lex.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Legal
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: balança
- Expressão sugerida: séria
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 16 — Nova
- Slug/ID: nova-product
- Categoria: Product
- Função principal: Gestão de produto
- Resumo do que faz: Apoia decisões de roadmap e produto.
- Tom/persona atual: Estratégica, analítica
- Palavras-chave: produto, roadmap, discovery
- Avatar atual: avatar_nova.svg
- Path do avatar: /clever-agent/avatars/avatar_nova.svg (ativo) e dashboard/frontend/public/avatar/avatar_nova.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Product
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: roadmap
- Expressão sugerida: focada
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 17 — Dex
- Slug/ID: dex-data
- Categoria: Data / BI
- Função principal: Dados e BI
- Resumo do que faz: Interpreta dados e indicadores operacionais.
- Tom/persona atual: Analítico, técnico
- Palavras-chave: dados, bi, dashboard
- Avatar atual: avatar_dex.svg
- Path do avatar: /clever-agent/avatars/avatar_dex.svg (ativo) e dashboard/frontend/public/avatar/avatar_dex.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Data / BI
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: óculos/gráfico
- Expressão sugerida: racional
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 18 — Helm
- Slug/ID: helm-conductor
- Categoria: Operations / Orchestration
- Função principal: Orquestração de ciclo
- Resumo do que faz: Coordena fluxo e sincronização entre etapas.
- Tom/persona atual: Diretivo, organizado
- Palavras-chave: orquestração, ciclo, coordenação
- Avatar atual: avatar_helm.svg
- Path do avatar: /clever-agent/avatars/avatar_helm.svg (ativo) e dashboard/frontend/public/avatar/avatar_helm.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Operations / Orchestration
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: timão
- Expressão sugerida: determinada
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Parcial

### Agente 19 — Mirror
- Slug/ID: mirror-retro
- Categoria: Retrospective
- Função principal: Retrospectiva
- Resumo do que faz: Revisão de aprendizados e melhoria contínua.
- Tom/persona atual: Reflexivo, objetivo
- Palavras-chave: retro, melhoria, lições
- Avatar atual: avatar_mirror.svg
- Path do avatar: /clever-agent/avatars/avatar_mirror.svg (ativo) e dashboard/frontend/public/avatar/avatar_mirror.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Retrospective
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: espelho
- Expressão sugerida: pensativa
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Parcial

### Agente 20 — Apex
- Slug/ID: apex-architect
- Categoria: Engineering
- Função principal: Arquitetura
- Resumo do que faz: Define padrões e direcionamento técnico.
- Tom/persona atual: Sênior, técnico
- Palavras-chave: arquitetura, design técnico, tradeoff
- Avatar atual: avatar_apex.svg
- Path do avatar: /clever-agent/avatars/avatar_apex.svg (ativo) e dashboard/frontend/public/avatar/avatar_apex.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: blueprint
- Expressão sugerida: segura
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 21 — Bolt
- Slug/ID: bolt-executor
- Categoria: Engineering
- Função principal: Execução técnica
- Resumo do que faz: Implementa mudanças com foco em entrega.
- Tom/persona atual: Rápido, pragmático
- Palavras-chave: implementação, execução, entrega
- Avatar atual: avatar_bolt.svg
- Path do avatar: /clever-agent/avatars/avatar_bolt.svg (ativo) e dashboard/frontend/public/avatar/avatar_bolt.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: chave
- Expressão sugerida: objetiva
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 22 — Canvas
- Slug/ID: canvas-designer
- Categoria: Engineering / Design
- Função principal: Design aplicado
- Resumo do que faz: Apoia soluções visuais e interface.
- Tom/persona atual: Criativo, cuidadoso
- Palavras-chave: design, ui, composição
- Avatar atual: avatar_canvas.svg
- Path do avatar: /clever-agent/avatars/avatar_canvas.svg (ativo) e dashboard/frontend/public/avatar/avatar_canvas.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / Design
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: paleta
- Expressão sugerida: criativa
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Parcial

### Agente 23 — Compass
- Slug/ID: compass-planner
- Categoria: Engineering / Planning
- Função principal: Planejamento técnico
- Resumo do que faz: Estrutura planos de execução e sequência.
- Tom/persona atual: Organizado, preditivo
- Palavras-chave: planejamento, priorização, cronograma
- Avatar atual: avatar_compass.svg
- Path do avatar: /clever-agent/avatars/avatar_compass.svg (ativo) e dashboard/frontend/public/avatar/avatar_compass.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / Planning
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: calendário
- Expressão sugerida: atenta
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Parcial

### Agente 24 — Echo
- Slug/ID: echo-analyst
- Categoria: Engineering / Analysis
- Função principal: Análise técnica
- Resumo do que faz: Examina cenários e valida hipóteses técnicas.
- Tom/persona atual: Investigativo, analítico
- Palavras-chave: análise, diagnóstico, evidência
- Avatar atual: avatar_echo.svg
- Path do avatar: /clever-agent/avatars/avatar_echo.svg (ativo) e dashboard/frontend/public/avatar/avatar_echo.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / Analysis
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: barras analíticas
- Expressão sugerida: concentrada
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Parcial

### Agente 25 — Flow
- Slug/ID: flow-git
- Categoria: Engineering / Git
- Função principal: Operações de versionamento
- Resumo do que faz: Apoia fluxos e disciplina de Git.
- Tom/persona atual: Metódico, disciplinado
- Palavras-chave: git, branch, fluxo
- Avatar atual: avatar_flow.svg
- Path do avatar: /clever-agent/avatars/avatar_flow.svg (ativo) e dashboard/frontend/public/avatar/avatar_flow.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / Git
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: branch git
- Expressão sugerida: calma
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 26 — Grid
- Slug/ID: grid-tester
- Categoria: Engineering / QA
- Função principal: Testes
- Resumo do que faz: Conduz validações e cobertura de testes.
- Tom/persona atual: Detalhista, sistemático
- Palavras-chave: teste, cobertura, validação
- Avatar atual: avatar_grid.svg
- Path do avatar: /clever-agent/avatars/avatar_grid.svg (ativo) e dashboard/frontend/public/avatar/avatar_grid.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / QA
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: bug/check
- Expressão sugerida: precisa
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 27 — Hawk
- Slug/ID: hawk-debugger
- Categoria: Engineering / Debug
- Função principal: Debug
- Resumo do que faz: Investiga falhas e causa raiz.
- Tom/persona atual: Afiado, investigativo
- Palavras-chave: debug, erro, causa raiz
- Avatar atual: avatar_hawk.svg
- Path do avatar: /clever-agent/avatars/avatar_hawk.svg (ativo) e dashboard/frontend/public/avatar/avatar_hawk.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / Debug
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: lupa
- Expressão sugerida: focada
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 28 — Lens
- Slug/ID: lens-reviewer
- Categoria: Engineering / Review
- Função principal: Code review
- Resumo do que faz: Revisa qualidade e riscos de código.
- Tom/persona atual: Crítico, construtivo
- Palavras-chave: review, qualidade, risco
- Avatar atual: avatar_lens.svg
- Path do avatar: /clever-agent/avatars/avatar_lens.svg (ativo) e dashboard/frontend/public/avatar/avatar_lens.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / Review
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: checklist
- Expressão sugerida: criteriosa
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 29 — Oath
- Slug/ID: oath-verifier
- Categoria: Engineering / Verification
- Função principal: Verificação final
- Resumo do que faz: Valida conformidade e consistência de entregas.
- Tom/persona atual: Rigoroso, confiável
- Palavras-chave: verificação, conformidade, aceite
- Avatar atual: avatar_oath.svg
- Path do avatar: /clever-agent/avatars/avatar_oath.svg (ativo) e dashboard/frontend/public/avatar/avatar_oath.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / Verification
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: escudo
- Expressão sugerida: séria
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Parcial

### Agente 30 — Prism
- Slug/ID: prism-scientist
- Categoria: Engineering / Research
- Função principal: Pesquisa técnica
- Resumo do que faz: Explora hipóteses e experimentos técnicos.
- Tom/persona atual: Curioso, científico
- Palavras-chave: pesquisa, experimento, ciência
- Avatar atual: avatar_prism.svg
- Path do avatar: /clever-agent/avatars/avatar_prism.svg (ativo) e dashboard/frontend/public/avatar/avatar_prism.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / Research
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: frasco
- Expressão sugerida: curiosa
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Parcial

### Agente 31 — Probe
- Slug/ID: probe-qa
- Categoria: Engineering / QA
- Função principal: QA investigativo
- Resumo do que faz: Valida comportamento com foco em detecção de falhas.
- Tom/persona atual: Minucioso, persistente
- Palavras-chave: qa, inspeção, defeito
- Avatar atual: avatar_probe.svg
- Path do avatar: /clever-agent/avatars/avatar_probe.svg (ativo) e dashboard/frontend/public/avatar/avatar_probe.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / QA
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: alvo
- Expressão sugerida: atenta
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Parcial

### Agente 32 — Quill
- Slug/ID: quill-writer
- Categoria: Engineering / Docs
- Função principal: Documentação
- Resumo do que faz: Produz escrita técnica e documentação.
- Tom/persona atual: Claro, didático
- Palavras-chave: documentação, escrita, clareza
- Avatar atual: avatar_quill.svg
- Path do avatar: /clever-agent/avatars/avatar_quill.svg (ativo) e dashboard/frontend/public/avatar/avatar_quill.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / Docs
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: pena
- Expressão sugerida: neutra
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 33 — Raven
- Slug/ID: raven-critic
- Categoria: Engineering / Critic
- Função principal: Crítica técnica
- Resumo do que faz: Questiona decisões e aponta fragilidades.
- Tom/persona atual: Direto, analítico
- Palavras-chave: crítica, revisão, objeção
- Avatar atual: avatar_raven.svg
- Path do avatar: /clever-agent/avatars/avatar_raven.svg (ativo) e dashboard/frontend/public/avatar/avatar_raven.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / Critic
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: alerta
- Expressão sugerida: firme
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Parcial

### Agente 34 — Scout
- Slug/ID: scout-explorer
- Categoria: Engineering / Discovery
- Função principal: Exploração
- Resumo do que faz: Mapeia opções e caminhos técnicos.
- Tom/persona atual: Exploratório, curioso
- Palavras-chave: exploração, descoberta, opções
- Avatar atual: avatar_scout.svg
- Path do avatar: /clever-agent/avatars/avatar_scout.svg (ativo) e dashboard/frontend/public/avatar/avatar_scout.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / Discovery
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: binóculo
- Expressão sugerida: curiosa
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Parcial

### Agente 35 — Scroll
- Slug/ID: scroll-docs
- Categoria: Engineering / Docs
- Função principal: Especialista documental
- Resumo do que faz: Organiza e mantém documentação detalhada.
- Tom/persona atual: Organizado, paciente
- Palavras-chave: docs, referência, registro
- Avatar atual: avatar_scroll.svg
- Path do avatar: /clever-agent/avatars/avatar_scroll.svg (ativo) e dashboard/frontend/public/avatar/avatar_scroll.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / Docs
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: scroll
- Expressão sugerida: calma
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 36 — Trail
- Slug/ID: trail-tracer
- Categoria: Engineering / Tracing
- Função principal: Rastreamento
- Resumo do que faz: Segue trilhas de execução e dependências.
- Tom/persona atual: Metódico, técnico
- Palavras-chave: trace, fluxo, dependência
- Avatar atual: avatar_trail.svg
- Path do avatar: /clever-agent/avatars/avatar_trail.svg (ativo) e dashboard/frontend/public/avatar/avatar_trail.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / Tracing
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: path marker
- Expressão sugerida: focada
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Parcial

### Agente 37 — Vault
- Slug/ID: vault-security
- Categoria: Security
- Função principal: Revisão de segurança
- Resumo do que faz: Avalia riscos e postura de segurança.
- Tom/persona atual: Cauteloso, rigoroso
- Palavras-chave: segurança, risco, proteção
- Avatar atual: avatar_vault.svg
- Path do avatar: /clever-agent/avatars/avatar_vault.svg (ativo) e dashboard/frontend/public/avatar/avatar_vault.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Security
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: cadeado
- Expressão sugerida: séria
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Não

### Agente 38 — Zen
- Slug/ID: zen-simplifier
- Categoria: Engineering / Simplification
- Função principal: Simplificação de código
- Resumo do que faz: Reduz complexidade e melhora legibilidade técnica.
- Tom/persona atual: Calmo, pragmático
- Palavras-chave: simplificação, refatoração, clareza
- Avatar atual: avatar_zen.svg
- Path do avatar: /clever-agent/avatars/avatar_zen.svg (ativo) e dashboard/frontend/public/avatar/avatar_zen.webp (legado)
- Arquivos onde aparece:
  - dashboard/frontend/src/lib/agent-meta.ts
  - dashboard/backend/agent_meta_seed.py
  - dashboard/frontend/src/components/AgentAvatar.tsx (render principal)
  - dashboard/frontend/src/components/AgentIcon.tsx (versões compactas)
  - dashboard/frontend/src/pages/Agents.tsx, AgentDetail.tsx, Topics.tsx, ThreadsSidebar.tsx, AgentChat.tsx
- Conceito visual recomendado: headshot/busto profissional de agente de Engineering / Simplification
- Tipo de personagem ideal: especialista SaaS/IA corporativo (não cartunesco)
- Elemento/acessório visual recomendado: minus
- Expressão sugerida: serena
- Observação de leitura em tamanho pequeno: priorizar contorno da cabeça + acessório único de alto contraste; evitar microdetalhes.
- Ambiguidade de função no código atual: Parcial

## 4. Agrupamento por categoria
### HR / People
- agentes: Aria
- pontos visuais em comum: acolhimento, comunicação, identificação de people ops.

### Finance
- agentes: Flux
- pontos visuais em comum: sobriedade, precisão, elementos de métricas/controle.

### Data / BI
- agentes: Dex
- pontos visuais em comum: leitura analítica, gráficos/óculos/dados.

### Legal
- agentes: Lex
- pontos visuais em comum: formalidade, confiança, compliance.

### Marketing
- agentes: Mako
- pontos visuais em comum: energia criativa, comunicação e campanhas.

### Personal
- agentes: Kai
- pontos visuais em comum: proximidade, suporte pessoal, produtividade.

### Product
- agentes: Nova
- pontos visuais em comum: visão estratégica de roadmap e priorização.

### Sales
- agentes: Nex
- pontos visuais em comum: postura comercial, confiança e negociação.

### Social Media
- agentes: Pixel
- pontos visuais em comum: criatividade digital, conteúdo e engajamento.

### Courses / Education
- agentes: Mentor, Lumen
- pontos visuais em comum: didática, orientação, evolução de aprendizado.

### Operations / Projects / outras
- agentes: Atlas, Clawdia, Pulse, Sage, Oracle, Zara, Helm, Mirror, Apex, Bolt, Canvas, Compass, Echo, Flow, Grid, Hawk, Lens, Oath, Prism, Probe, Quill, Raven, Scout, Scroll, Trail, Vault, Zen
- pontos visuais em comum: perfil técnico-profissional, acessório de especialidade único por agente, alta legibilidade em miniatura.

## 5. Recomendações para criação dos avatars
- Direção visual geral recomendada: bustos/headshots vetoriais, família visual única, traço limpo, fundo simples com contraste para tema escuro.
- O que evitar: símbolos abstratos isolados, badges genéricos, excesso de gradiente, cenas complexas e corpo inteiro.
- Observações sobre legibilidade em tamanho pequeno: usar silhueta forte de cabeça/ombros, olhos e acessório principal grandes; no máximo 1-2 elementos semânticos.
- Observações sobre busto/rosto/cabeça: personagem centralizado ocupando a maior área do avatar, expressão neutra-profissional, diferenças claras de cabelo/acessório/roupa.
- Sugestões para manter consistência entre os 38 agentes:
  - manter mesma estrutura base (fundo, enquadramento, espessura de traço)
  - variar somente persona/acessório/expressão conforme função
  - preservar paleta Clever Agent como base e usar acentos discretos por categoria
  - revisar todos os 38 em grade 32px/48px antes de aprovação final