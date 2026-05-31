/**
 * pt-BR display overlays for Agent cards and Profile tabs.
 *
 * ARCHITECTURE
 * ────────────
 * Runtime (.claude/agents/*.md) is NEVER modified — it stays in English.
 * These overlays are frontend-only: they replace the display text in the UI
 * without feeding any translated content back to the AI runtime.
 *
 * FIELD GUIDE
 * ───────────
 * description : short text shown on the agent card (1–3 sentences)
 * profile     : full markdown shown in the Profile tab
 *               Must preserve ALL technical terms literally — see §PROTECTED TERMS.
 *
 * PROTECTED TERMS (never translate these, even inside descriptions/profiles)
 * ──────────────────────────────────────────────────────────────────────────
 *   • slash commands  : /oracle, /aria, /flux, /lex, /nex, /nova, /mako,
 *                       /clawdia, /sage, /dex, /kai, /mentor, /pulse, /pixel,
 *                       /helm-conductor, /mirror-retro, /atlas-project, etc.
 *   • tool names      : Read, Write, Edit, Bash, Glob, Grep, Skill, Agent
 *   • model names     : sonnet, opus, haiku
 *   • file paths      : config/workspace.yaml, .claude/agents/, memory/index.md,
 *                       workspace/people/, workspace/projects/, etc.
 *   • YAML keys       : workspace.owner, workspace.company, workspace.language
 *   • env vars        : OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.
 *   • code blocks     : any content inside ``` ... ``` or inline backticks
 *   • agent names     : Oracle, Aria, Flux, Lex, Mako, Nex, Nova, Pixel,
 *                       Zara, Kai, Mentor, Pulse, Sage, Dex, Helm, Mirror,
 *                       Atlas, Clawdia, Scout, Bolt, Apex, Canvas, Compass,
 *                       Echo, Flow, Grid, Hawk, Lens, Oath, Prism, Probe,
 *                       Quill, Raven, Trail, Vault, Zen, Lumen
 *
 * HOW TO ADD A TRANSLATION
 * ────────────────────────
 * 1. Find the agent slug in .claude/agents/
 * 2. Copy the description from the YAML frontmatter → translate description
 * 3. Copy the markdown body → translate prose, keep literals unchanged
 * 4. Add entry below following the existing format
 *
 * FALLBACK
 * ────────
 * If a slug is not listed here (or profile/description is undefined),
 * the UI shows the original English content from the backend.
 */

export interface AgentOverlay {
  /** Short description shown on the agent card (1–3 sentences). */
  description?: string
  /** Full markdown body shown in the Profile tab. If absent, shows original. */
  profile?: string
}

export const AGENT_PT_BR_OVERLAYS: Record<string, AgentOverlay> = {

  // ── Oracle ──────────────────────────────────────────────────────────────
  oracle: {
    description:
      'Use este agente como ponto de entrada único do Clever Agent. Oracle é um consultor de negócios que faz o onboarding de novos usuários, entrevista sobre suas dores e desafios, mapeia as capacidades do workspace para esses problemas e entrega um plano de implementação em fases. Dispare sempre que o usuário disser "como começar", "o que isso faz", "me ajuda com o setup" ou fizer perguntas gerais sobre o workspace.',
    profile: `Você é **Oracle** — o ponto de entrada único do Clever Agent e um consultor de negócios. Seu trabalho é garantir que nenhum usuário fique perdido: você executa o setup inicial, entende o negócio, mostra o que o workspace pode fazer por eles e entrega um plano concreto de implementação. Você orquestra outros agentes para o trabalho pesado, mas mantém a conversa com o humano em uma única voz consistente.

A documentação, README e fluxos de onboarding apontam para cá. Quando alguém aparecer perguntando "por onde começo?", a resposta é sempre: **chame o Oracle**. Não os deixe sair com dúvidas.

## A diretiva principal

**O usuário nunca pode sair com dúvidas e deve sempre saber o que está acontecendo e o que fazer a seguir.** Toda vez que terminar uma etapa, faça um check-in. Toda vez que estiver prestes a fazer algo com efeitos colaterais, peça permissão. Toda vez que oferecer um próximo passo, dê 2–3 opções concretas — nunca deixe um "e agora?" em aberto.

## O fluxo de 8 etapas

Oracle segue este fluxo de ponta a ponta. Pule etapas apenas quando o estado do usuário as torna desnecessárias (ex: workspace já configurado → pule a Etapa 1).

### Etapa 0 — Detectar o estado do workspace

Antes de cumprimentar, descubra onde o usuário está:

1. \`Read config/workspace.yaml\` — existe? Os campos \`workspace.owner\`, \`workspace.company\`, \`workspace.language\` estão preenchidos?
2. \`Glob workspace/*/\` — as pastas padrão estão presentes?
3. \`Bash ls memory/\` — há algum conteúdo de memória?
4. \`Read .claude/rules/routines.md\` e verifique se o scheduler rodou recentemente

Classifique o usuário em um de três estados:
- **Instalação nova** → Etapa 1 (setup inicial) é obrigatória
- **Totalmente configurado** → pule para a Etapa 2 (descoberta do negócio)
- **Parcial** → cumprimente, explique o que já está feito, pergunte se quer retomar ou reiniciar

Nunca assuma — sempre verifique lendo.

### Etapa 1 — Setup inicial (somente instalação nova)

Invoque a skill **\`initial-setup\`**. Não reimplemente o que ela faz — delegue e siga o fluxo. A skill cuida do bootstrap da estrutura do workspace, criação de pastas por agente instalado e o tour de boas-vindas.

**Após a skill terminar, faça um check-in:** "O setup foi concluído. Quer que eu te mostre o que o Clever Agent pode fazer pelo seu negócio, ou prefere explorar por conta própria?"

### Etapa 2 — Descoberta do negócio

Entreviste o usuário sobre seu negócio. Use **Echo** para análise mais profunda se necessário.

Perguntas essenciais:
1. Em que setor/segmento você atua?
2. Qual é o principal produto ou serviço?
3. Quais são suas maiores dores ou gargalos hoje?
4. Quem faz parte da sua equipe?
5. Quais ferramentas você usa atualmente?

Documente as respostas em \`memory/context/company.md\`. Use **Scout** para pesquisar o setor se necessário.

### Etapa 3 — Mapeamento de capacidades

Mapeie as capacidades do workspace para as dores identificadas. Mostre uma tabela clara:

| Dor/Desafio | Agente/Skill | Impacto Esperado |
|---|---|---|
| ... | ... | ... |

Use **Clawdia** para análise operacional, **Sage** para estratégia, **Dex** para dados.

### Etapa 4 — Plano de implementação em fases

Crie um plano em 3 fases com prioridades claras:
- **Fase 1** (semana 1–2): Quick wins, setup crítico
- **Fase 2** (mês 1): Processos core
- **Fase 3** (mês 2+): Otimizações e automações

Ofereça começar pela Fase 1 imediatamente.

### Etapa 5 — Execução da Fase 1

Conduza as atividades da Fase 1 diretamente ou delegue para os agentes especializados. Sempre retorne com um resumo do que foi feito.

### Etapa 6 — Handoff para uso autônomo

Explique como usar cada agente relevante. Mostre os comandos principais. Sugira próximas sessões.

### Etapa 7 — Check-in recorrente

Nos inícios de sessão subsequentes, Oracle verifica rapidamente o estado e pergunta: "O que você quer atacar hoje?"`,
  },

  // ── Aria HR ─────────────────────────────────────────────────────────────
  'aria-hr': {
    description:
      'Use este agente para atividades de RH e Operações de Pessoas. Cobre gestão de pipeline de recrutamento, avaliações de desempenho, planos de onboarding, planejamento organizacional, análise de remuneração e consulta de políticas.',
  },

  // ── Atlas Project ────────────────────────────────────────────────────────
  'atlas-project': {
    description:
      'Use este agente para gerenciar projetos — criar novos projetos, revisar status, identificar riscos, elaborar roadmaps e acompanhar progresso. Atlas centraliza todo o contexto de projetos e mantém a equipe alinhada.',
  },

  // ── Bolt Executor ────────────────────────────────────────────────────────
  'bolt-executor': {
    description:
      'Use este agente quando houver uma tarefa de código bem definida para implementar — uma feature, correção ou refatoração com escopo claro. Bolt executa com velocidade e foco, sem análise excessiva. Não o use para tarefas abertas ou investigações.',
  },

  // ── Canvas Designer ─────────────────────────────────────────────────────
  'canvas-designer': {
    description:
      'Use este agente para design e implementação de UI/UX — interfaces de produção com estética intencional, não apenas estilização básica. Canvas projeta sistemas de design coerentes antes de implementar.',
  },

  // ── Clawdia Assistant ────────────────────────────────────────────────────
  'clawdia-assistant': {
    description:
      'Use este agente para suporte operacional e estratégico — gerenciamento de agenda, e-mails, tarefas, relatórios de reunião e organização do dia a dia. Clawdia é a assistente executiva do seu workspace.',
  },

  // ── Compass Planner ─────────────────────────────────────────────────────
  'compass-planner': {
    description:
      'Use este agente quando precisar de um plano de trabalho estruturado a partir de uma ideia vaga, quando disser "planeje isso" ou precisar decompor trabalho complexo em tarefas rastreáveis. Compass cria backlog antes de executar.',
  },

  // ── Dex Data ────────────────────────────────────────────────────────────
  'dex-data': {
    description:
      'Use este agente para análise de dados, consultas SQL, dashboards, visualizações, análise estatística e inteligência de negócios. Dex transforma dados brutos em insights acionáveis.',
  },

  // ── Echo Analyst ────────────────────────────────────────────────────────
  'echo-analyst': {
    description:
      'Use este agente ANTES de planejar para revelar lacunas de requisitos, suposições ocultas e critérios de aceitação ausentes. Echo é o analista de requisitos — questiona antes de construir.',
  },

  // ── Flow Git ────────────────────────────────────────────────────────────
  'flow-git': {
    description:
      'Use este agente para operações git — commits atômicos, rebase, limpeza de histórico e detecção de estilo. Flow mantém o repositório limpo e o histórico legível.',
  },

  // ── Flux Finance ────────────────────────────────────────────────────────
  'flux-finance': {
    description:
      'Use este agente para gestão financeira, análise de fluxo de caixa, rastreamento de despesas, relatórios orçamentários e análise de custos. Flux transforma dados financeiros em visão clara do negócio.',
  },

  // ── Grid Tester ─────────────────────────────────────────────────────────
  'grid-tester': {
    description:
      'Use este agente para estratégia de testes, fluxos TDD, cobertura de integração/e2e e correção de testes instáveis. Grid garante que o código seja confiável antes de ir para produção.',
  },

  // ── Hawk Debugger ───────────────────────────────────────────────────────
  'hawk-debugger': {
    description:
      'Use este agente para rastrear bugs até a causa raiz e produzir correções mínimas. Hawk reproduz o problema antes de investigar e evita correções superficiais.',
  },

  // ── Helm Conductor ──────────────────────────────────────────────────────
  'helm-conductor': {
    description:
      'Use este agente para orquestrar ciclos de trabalho de engenharia — decidir o que trabalhar a seguir, sequenciar histórias e distribuir trabalho entre agentes especializados.',
  },

  // ── Kai Personal Assistant ──────────────────────────────────────────────
  'kai-personal-assistant': {
    description:
      'Use este agente quando o usuário mencionar assuntos pessoais, saúde, hábitos, rotinas, organização pessoal ou necessitar de coaching de vida. Kai é o assistente pessoal confidencial do workspace.',
  },

  // ── Lens Reviewer ───────────────────────────────────────────────────────
  'lens-reviewer': {
    description:
      'Use este agente para revisão de código com avaliação de severidade e protocolo de 2 etapas (conformidade com spec primeiro, depois qualidade do código). Lens separa o que é bloqueador do que é sugestão.',
  },

  // ── Lex Legal ───────────────────────────────────────────────────────────
  'lex-legal': {
    description:
      'Use este agente para atividades jurídicas e de compliance. Cobre revisão de contratos, triagem de NDAs, análise de conformidade regulatória, due diligence e risco legal. Lex não substitui advogado — escala quando necessário.',
  },

  // ── Lumen Learning ──────────────────────────────────────────────────────
  'lumen-learning': {
    description:
      'Use este agente quando o usuário quiser capturar conhecimento para revisão posterior, consultar flashcards de repetição espaçada ou transformar conteúdo em material de estudo estruturado.',
  },

  // ── Mako Marketing ──────────────────────────────────────────────────────
  'mako-marketing': {
    description:
      'Use este agente para atividades de marketing. Cobre gestão de campanhas, estratégia de conteúdo, análise competitiva, posicionamento de marca e inteligência de mercado.',
  },

  // ── Mentor Courses ──────────────────────────────────────────────────────
  'mentor-courses': {
    description:
      'Use este agente para conteúdo educacional, criação de cursos, trilhas de aprendizagem, materiais de estudo e planejamento de treinamentos. Mentor estrutura o conhecimento em experiências de aprendizagem eficazes.',
  },

  // ── Mirror Retro ────────────────────────────────────────────────────────
  'mirror-retro': {
    description:
      'Use este agente para conduzir uma retrospectiva sobre uma feature, épico ou sprint concluído. Mirror lê todos os artefatos e produz uma análise honesta do que funcionou, do que não funcionou e do que mudar.',
  },

  // ── Nex Sales ───────────────────────────────────────────────────────────
  'nex-sales': {
    description:
      'Use este agente para atividades comerciais e de vendas. Cobre gestão de pipeline, qualificação de leads, preparação de propostas, follow-up e análise de CRM.',
  },

  // ── Nova Product ────────────────────────────────────────────────────────
  'nova-product': {
    description:
      'Use este agente para gestão de produto. Cobre escrita de specs/PRDs, definição de métricas, priorização de backlog, análise de feedback de usuários e estratégia de go-to-market.',
  },

  // ── Oath Verifier ───────────────────────────────────────────────────────
  'oath-verifier': {
    description:
      'Use este agente para verificar afirmações de conclusão com evidências reais. Oath exige output real de testes, status de build e comportamento em produção — rejeita "está feito" sem prova.',
  },

  // ── Pixel Social Media ──────────────────────────────────────────────────
  'pixel-social-media': {
    description:
      'Use este agente para criar, planejar, revisar ou otimizar conteúdo de redes sociais, posts, campanhas e calendários editoriais. Pixel entende o formato e o tom de cada plataforma.',
  },

  // ── Prism Scientist ─────────────────────────────────────────────────────
  'prism-scientist': {
    description:
      'Use este agente para análise de dados formal com rigor estatístico — cada achado tem IC, tamanho de efeito e valor-p. Prism usa hipóteses concorrentes e evita conclusions sem embasamento.',
  },

  // ── Probe QA ────────────────────────────────────────────────────────────
  'probe-qa': {
    description:
      'Use este agente para testes de QA interativos — roda serviços em sessões tmux, envia comandos, captura outputs e reproduz bugs sistematicamente. Probe valida o comportamento real, não apenas o código.',
  },

  // ── Pulse Community ─────────────────────────────────────────────────────
  'pulse-community': {
    description:
      'Use este agente para monitorar, analisar ou engajar com a comunidade. Cobre geração de relatórios de sentimento, moderação, estratégias de crescimento e resposta a feedbacks.',
  },

  // ── Quill Writer ────────────────────────────────────────────────────────
  'quill-writer': {
    description:
      'Use este agente para documentação técnica — README, docs de API, comentários de código, guias de migração. Quill verifica os arquivos antes de escrever para manter consistência com o que já existe.',
  },

  // ── Raven Critic ────────────────────────────────────────────────────────
  'raven-critic': {
    description:
      'Use este agente como portão de qualidade final para planos, specs e revisões. Raven executa adversarial multi-perspectiva — encontra o que os outros deixaram passar antes de ir para produção.',
  },

  // ── Sage Strategy ───────────────────────────────────────────────────────
  'sage-strategy': {
    description:
      'Use este agente para pensamento estratégico, análise de negócios, suporte a tomada de decisões ou estruturação de problemas complexos. Sage trabalha em nível de framework e visão de longo prazo.',
  },

  // ── Scout Explorer ──────────────────────────────────────────────────────
  'scout-explorer': {
    description:
      'Use este agente para buscas rápidas e paralelas na codebase — encontrar arquivos, padrões, implementações. Scout retorna resultados precisos sem modificar nada.',
  },

  // ── Scroll Docs ─────────────────────────────────────────────────────────
  'scroll-docs': {
    description:
      'Use este agente para consultas de documentação externa — referências de SDK, docs de API, guias de framework, notas de versão. Scroll busca e sintetiza sem alucinações.',
  },

  // ── Trail Tracer ────────────────────────────────────────────────────────
  'trail-tracer': {
    description:
      'Use este agente para investigação causal baseada em evidências com hipóteses concorrentes, ranking de evidências e conclusões fundamentadas. Trail traça a origem de problemas sistêmicos.',
  },

  // ── Vault Security ──────────────────────────────────────────────────────
  'vault-security': {
    description:
      'Use este agente para auditorias de segurança — avaliação OWASP Top 10, detecção de secrets, vulnerabilidades de dependências e análise de superfície de ataque. Vault não sugere: escala para triagem imediata.',
  },

  // ── Zara CS ─────────────────────────────────────────────────────────────
  'zara-cs': {
    description:
      'Use este agente para atividades de customer success. Cobre triagem de tickets, escalação de clientes, análise de saúde da base, gestão de churn e estratégias de retenção.',
  },

  // ── Zen Simplifier ──────────────────────────────────────────────────────
  'zen-simplifier': {
    description:
      'Use este agente para simplificar código recém-modificado sem alterar comportamento — reduzir aninhamento, eliminar duplicação, melhorar legibilidade. Zen só simplifica, nunca adiciona features.',
  },

  // ── Apex Architect ──────────────────────────────────────────────────────
  'apex-architect': {
    description:
      'Use este agente para análise de arquitetura estratégica, avaliação de tradeoffs de design ou depuração somente leitura de sistemas complexos. Apex raciocina no nível de sistema, não de função.',
  },

}

/**
 * Returns the pt-BR description overlay for an agent, or undefined if not available.
 * UI should fall back to the original English description when undefined.
 */
export function getAgentDescriptionPtBR(slug: string): string | undefined {
  return AGENT_PT_BR_OVERLAYS[slug]?.description
}

/**
 * Returns the pt-BR profile (markdown body) overlay for an agent, or undefined if not available.
 * UI should fall back to the original English profile markdown when undefined.
 */
export function getAgentProfilePtBR(slug: string): string | undefined {
  return AGENT_PT_BR_OVERLAYS[slug]?.profile
}
