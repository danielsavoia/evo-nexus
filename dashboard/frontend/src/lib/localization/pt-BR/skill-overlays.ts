/*
 * pt-BR display overlays for Skill cards and Skill detail pages.
 *
 * ARCHITECTURE — same principles as agent-overlays.ts:
 *   Runtime (.claude/skills/ - SKILL.md) is NEVER modified — stays in English.
 *   These overlays are frontend-only: replace display text without modifying runtime.
 *
 * PROTECTED TERMS (preserve literally inside all translated text)
 * ──────────────────────────────────────────────────────────────
 *   • flags/args     : --model, --analyze, --prompt, --output, --provider,
 *                      --aspect-ratio, --image-size, --ref, --transparent,
 *                      --costs, --list-models, -o, -p, -m, -r, -t, -a, -s
 *   • tool names     : Write, Read, Bash, Glob, Grep
 *   • paths          : workspace/assets/prompts/prompt.txt,
 *                      workspace/assets/images/, .claude/skills/,
 *                      ${CLAUDE_SKILL_DIR}/scripts/generate-image.py,
 *                      ${CLAUDE_SKILL_DIR}/scripts/composite-banners.py
 *   • model keywords : gemini, riverflow, flux2, seedream, gpt5
 *   • brand names    : OpenRouter, Cloudflare, Google AI Studio,
 *                      Cloudflare AI Gateway BYOK, ImageMagick, ffmpeg,
 *                      Google Gemini, FLUX.2, SeedDream, ByteDance
 *   • env vars       : AI_IMG_CREATOR_CF_ACCOUNT_ID, AI_IMG_CREATOR_CF_GATEWAY_ID,
 *                      AI_IMG_CREATOR_CF_TOKEN, AI_IMG_CREATOR_OPENROUTER_KEY,
 *                      AI_IMG_CREATOR_GEMINI_KEY
 *   • code blocks    : any content inside ``` ... ``` or inline backticks
 *   • URLs           : openrouter.ai/*, download.pytorch.org/*, etc.
 *   • YAML/JSON      : structural key names, IDs, slugs
 *
 * COVERAGE STATUS
 * ───────────────
 * ✅ 193/193 UI skills — title, description, and body overlays
 * ✅ curated overlays remain in SKILL_PT_BR_OVERLAYS / SKILL_BODY_PT_BR_OVERLAYS
 * ✅ generated coverage for remaining real UI skills lives in AUTO_SKILL_PT_BR_OVERLAYS
 */

export interface SkillOverlay {
  /** Human-readable title (replaces skill ID on cards if provided). */
  title?: string
  /** Short description shown on the skill card. */
  description?: string
  /**
   * Full translated markdown body shown in skill detail.
   * If absent, UI shows the original English SKILL.md body.
   * MUST preserve all technical terms literally — see §PROTECTED TERMS above.
   */
  body?: string
}

export const SKILL_PT_BR_OVERLAYS: Record<string, SkillOverlay> = {

  // ────────────────────────────────────────────────────────────────────────
  // AI Image Creator — FULL TRANSLATION
  // ────────────────────────────────────────────────────────────────────────
  'ai-image-creator': {
    title: 'Criador de Imagens com IA',
    description:
      'Gere imagens PNG usando múltiplos modelos de IA (Gemini, FLUX.2, Riverflow, SeedDream, GPT-5 Image) via OpenRouter ou Cloudflare AI Gateway BYOK. Também analisa imagens existentes com visão multimodal. Use quando o usuário pedir para gerar, criar, analisar ou descrever imagens.',
    body: `# Criador de Imagens com IA

Gere imagens PNG via múltiplos modelos de IA, roteados pelo Cloudflare AI Gateway BYOK ou diretamente via OpenRouter/Google AI Studio.

## Seleção de Modelo

Quando o usuário mencionar uma palavra-chave de modelo, use a flag \`--model\` correspondente:

| Palavra-chave | Modelo | Use quando o usuário disser |
|---------|-------|--------------------|
| \`gemini\` | [Google Gemini 3.1 Flash](https://openrouter.ai/google/gemini-3.1-flash-image-preview) (padrão) | "gemini", "gerar uma imagem" (sem modelo especificado) |
| \`riverflow\` | [Sourceful Riverflow v2 Pro](https://openrouter.ai/sourceful/riverflow-v2-pro) | "riverflow", "use riverflow" |
| \`flux2\` | [FLUX.2 Max](https://openrouter.ai/black-forest-labs/flux.2-max) | "flux2", "flux", "use flux" |
| \`seedream\` | [ByteDance SeedDream 4.5](https://openrouter.ai/bytedance-seed/seedream-4.5) | "seedream", "use seedream" |
| \`gpt5\` | [OpenAI GPT-5 Image](https://openrouter.ai/openai/gpt-5-image) | "gpt5", "gpt5 image", "use gpt5" |

## Instruções

> **Verificação de rota:** Se o usuário pedir para **descrever, analisar ou explicar uma imagem existente** (e não gerar uma nova), vá direto para a seção **Análise de Imagem (\`--analyze\`)** abaixo. Sem aprimoramento de prompt, sem caminho de saída.

### Etapa 1: Escrever o Prompt

Para prompts longos ou complexos (recomendado), escreva em \`workspace/assets/prompts/prompt.txt\` usando a ferramenta Write:

\`\`\`
Escreva o texto do prompt em workspace/assets/prompts/prompt.txt
\`\`\`

Para prompts curtos (menos de 200 caracteres, sem caracteres especiais), passe inline via \`--prompt\`.

**CRÍTICO — Dicas de Qualidade de Prompt:**
- Seja detalhado e descritivo. Inclua estilo, cores, composição, fundo e uso pretendido.
- Bom: "Um ícone de globo com design flat, linhas de fuso horário verticais em azul e teal, fundo branco, estilo vetorial limpo, adequado para web app em 512x512 pixels"
- Ruim: "ícone de globo"
- Especifique "fundo transparente" ou "fundo branco" explicitamente.
- Para ícones, mencione o tamanho alvo (ex: "512x512", "favicon em 32x32").
- Para fotos, descreva iluminação, ângulo de câmera e mood.

### Etapa 1.5: Aprimoramento de Prompt (Opcional — Divulgação Progressiva)

Padrões profissionais de prompt estão disponíveis em 3 arquivos de referência. **Não são carregados por padrão** — leia-os somente quando o pedido do usuário se encaixar em uma categoria ou ele pedir explicitamente aprimoramento.

**Detecção de Categoria** — Combine o pedido do usuário com uma categoria:

| Se o pedido mencionar... | Categoria | Leia também |
|----------------------|----------|-----------|
| "foto de produto", "hero image" | \`product_hero\` | \`prompt-core.md\` + \`prompt-categories.md\` § product_hero |
| "lifestyle", "em uso", "em contexto" | \`lifestyle\` | \`prompt-core.md\` + \`prompt-categories.md\` § lifestyle |
| "instagram", "social media", "tiktok", "pinterest" | \`social_media\` | \`prompt-core.md\` + \`prompt-platforms.md\` + \`prompt-categories.md\` § social_media |
| "banner", "anúncio", "cabeçalho de email" | \`marketing_banner\` | \`prompt-core.md\` + \`prompt-platforms.md\` + \`prompt-categories.md\` § marketing_banner |
| "website", "app", "logo", "formato de anúncio" | \`web_app\` | \`prompt-core.md\` + \`prompt-platforms.md\` + \`prompt-categories.md\` § web_app |
| "kit de marca", "banners de logo", "tamanhos IAB" + usuário tem logo existente | \`composite\` | Leia \`references/composite-reference.md\`, use \`composite-banners.py\` |
| "ícone", "favicon", "ícone de app" | \`icon_logo\` | \`prompt-core.md\` + \`prompt-categories.md\` § icon_logo |
| "mascote", "personagem", "ilustração", "arte" | \`illustration\` | \`prompt-core.md\` + \`prompt-categories.md\` § illustration |
| "comida", "bebida", "receita", "restaurante" | \`food_drink\` | \`prompt-core.md\` + \`prompt-categories.md\` § food_drink |
| "descrever", "analisar", "o que tem nessa imagem", "explicar imagem" | \`analyze\` | Pule o aprimoramento — use o modo \`--analyze\` diretamente |
| Sem correspondência / pedido simples | — | Pule os padrões, gere diretamente |

### Etapa 1.5b: Convenção de Caminho de Saída

Salve as imagens geradas em \`workspace/assets/images/\` na raiz do workspace. Use nomes descritivos:
- \`workspace/assets/images/wallpaper-evolution-dark.png\`
- \`workspace/assets/images/icon-agent-512.png\`
- \`workspace/assets/images/banner-summit-2026.png\`

Crie o diretório se não existir. A pasta \`workspace/assets/\` está no gitignore.

### Etapa 1.5c: Seleção de Provedor

O script carrega vars de ambiente do \`.env\` do workspace. Escolha o provedor baseado nas chaves disponíveis:
- Se \`AI_IMG_CREATOR_CF_ACCOUNT_ID\` + \`AI_IMG_CREATOR_CF_GATEWAY_ID\` + \`AI_IMG_CREATOR_CF_TOKEN\` estiverem definidas → use o modo gateway (sem flag)
- Se apenas \`AI_IMG_CREATOR_OPENROUTER_KEY\` → use \`--provider openrouter\` (implícito)
- Se apenas \`AI_IMG_CREATOR_GEMINI_KEY\` → use \`--provider google\`
- **NÃO use \`source .env\`** — o script Python já carrega internamente.

### Etapa 2: Executar o Script de Geração

\`\`\`bash
uv run python \${CLAUDE_SKILL_DIR}/scripts/generate-image.py \\
  -o "workspace/assets/images/NOME_SAIDA.png" \\
  [--provider openrouter|google] \\
  [-a "16:9"] \\
  [-s "2K"] \\
  [-m "id-do-modelo"] \\
  [-r "imagem-referencia.png"] \\
  [-t]
\`\`\`

Com modelo específico:
\`\`\`bash
uv run python \${CLAUDE_SKILL_DIR}/scripts/generate-image.py \\
  -o "CAMINHO_SAIDA" \\
  -m riverflow \\
  -p "Um lago de montanha sereno ao pôr do sol"
\`\`\`

Com fundo transparente (requer ffmpeg + imagemagick):
\`\`\`bash
uv run python \${CLAUDE_SKILL_DIR}/scripts/generate-image.py \\
  -o "mascote.png" \\
  -t \\
  -p "Um personagem mascote de robô amigável"
\`\`\`

### Etapa 3: Salvar o Prompt (renomear para corresponder à imagem)

Após a geração, renomeie o arquivo de prompt para corresponder ao nome da imagem de saída:

\`\`\`bash
mv workspace/assets/prompts/prompt.txt workspace/assets/prompts/NOME_SAIDA.txt
\`\`\`

### Etapa 4: Verificar Saída

\`\`\`bash
file CAMINHO_SAIDA
\`\`\`

Confirme que mostra "PNG image data" e reporte o caminho e tamanho do arquivo.

## Parâmetros

| Argumento | Curto | Obrigatório | Padrão | Descrição |
|----------|-------|----------|---------|-------------|
| \`--output\` | \`-o\` | Sim | -- | Caminho do arquivo de saída |
| \`--prompt\` | \`-p\` | Não | -- | Texto do prompt inline |
| \`--provider\` | -- | Não | \`openrouter\` | \`openrouter\` ou \`google\` |
| \`--aspect-ratio\` | \`-a\` | Não | padrão do modelo | Proporção: \`1:1\`, \`16:9\`, \`9:16\`, etc. |
| \`--image-size\` | \`-s\` | Não | padrão do modelo | \`0.5K\`, \`1K\`, \`2K\`, \`4K\` |
| \`--model\` | \`-m\` | Não | \`gemini\` | Palavra-chave do modelo (\`gemini\`, \`riverflow\`, \`flux2\`, \`seedream\`, \`gpt5\`) |
| \`--ref\` | \`-r\` | Não | -- | Imagem de referência (repetível). Apenas modelos multimodais |
| \`--analyze\` | -- | Não | -- | Analisar/descrever imagem de referência (saída texto, sem geração) |
| \`--transparent\` | \`-t\` | Não | -- | Gerar com fundo transparente. Requer ffmpeg + imagemagick |
| \`--costs\` | -- | Não | -- | Exibir histórico de geração/custo do projeto e sair |

## Variáveis de Ambiente

| Variável | Necessária Para | Descrição |
|----------|-------------|-------------|
| \`AI_IMG_CREATOR_CF_ACCOUNT_ID\` | Modo gateway | ID da conta Cloudflare |
| \`AI_IMG_CREATOR_CF_GATEWAY_ID\` | Modo gateway | Nome do AI Gateway |
| \`AI_IMG_CREATOR_CF_TOKEN\` | Modo gateway | Token de autenticação do gateway |
| \`AI_IMG_CREATOR_OPENROUTER_KEY\` | OpenRouter direto | Chave da API OpenRouter (\`sk-or-...\`) |
| \`AI_IMG_CREATOR_GEMINI_KEY\` | Google direto | Chave da API do Google AI Studio |

Modo gateway ativa quando todas as 3 vars \`CF_*\` estiverem definidas.

## Análise de Imagem (\`--analyze\`)

Descreva, analise ou explique imagens existentes usando visão de IA multimodal. Retorna apenas texto — sem imagem gerada. **Apenas modelos multimodais** (gemini, gpt5).

\`\`\`bash
# Analisar com prompt padrão (descreve assunto, estilo, cores, composição)
uv run python \${CLAUDE_SKILL_DIR}/scripts/generate-image.py \\
  --analyze -r "foto.png"

# Analisar com prompt personalizado
uv run python \${CLAUDE_SKILL_DIR}/scripts/generate-image.py \\
  --analyze -r "foto.png" -p "Descreva esta imagem em texto simples e também em JSON estruturado"

# Comparar duas imagens
uv run python \${CLAUDE_SKILL_DIR}/scripts/generate-image.py \\
  --analyze -r "antes.png" -r "depois.png" -p "Compare estas duas imagens e descreva as diferenças"
\`\`\`

## Modo Transparente (\`-t\`)

Gera imagens com fundos transparentes usando pipeline de 3 etapas:
1. **Geração com chroma key** — Prompt é aumentado para colocar o sujeito em verde sólido #00FF00
2. **FFmpeg chroma key** — Remove o fundo verde + franjas verdes das bordas
3. **Auto-crop do ImageMagick** — Corta o padding transparente

**Requisitos:** \`brew install ffmpeg imagemagick\`

**Casos de uso:** Sprites de jogos, ícones, logos, mascotes, assets de marketing com transparência.

## Rastreamento de Custos (\`--costs\`)

Cada geração é registrada em \`.ai-image-creator/costs.json\` no diretório do projeto. Veja o histórico:

\`\`\`bash
uv run python \${CLAUDE_SKILL_DIR}/scripts/generate-image.py --costs
\`\`\`

## Banners Compostos

Gere banners de logo consistentes em múltiplos tamanhos a partir de uma config JSON. Usa ImageMagick para composição offline — sem chamadas de API.

**Quando usar composite-banners.py** (todos devem ser verdadeiros):
- Usuário tem logo existente que quer usar como está
- Quer branding consistente em múltiplos tamanhos padrão
- Saída é logo + texto em fundo sólido/gradiente

**Quando usar generate-image.py** (qualquer um desses):
- Usuário quer design criativo/artístico
- Quer que a IA crie o conteúdo visual
- Quer um único banner com conteúdo artístico

### Início Rápido

1. **Init config:** \`uv run python \${CLAUDE_SKILL_DIR}/scripts/composite-banners.py --init\`
2. **Editar** \`banner-config.json\` — defina caminho do logo, texto da marca, cores, tamanhos
3. **Validar:** \`uv run python \${CLAUDE_SKILL_DIR}/scripts/composite-banners.py --validate\`
4. **Gerar:** \`uv run python \${CLAUDE_SKILL_DIR}/scripts/composite-banners.py -c banner-config.json -o ./banners/\`

## Problemas Comuns

### "No API credentials configured"
**Causa:** Variáveis de ambiente não definidas ou não exportadas.
**Solução:** Adicione exports ao \`~/.zshrc\` e execute \`source ~/.zshrc\`. Veja \`references/setup-guide.md\`.

### "HTTP 401: Unauthorized"
**Causa:** Chave ou token inválido/expirado.
**Solução:** Verifique \`AI_IMG_CREATOR_CF_TOKEN\` (gateway) ou \`AI_IMG_CREATOR_OPENROUTER_KEY\` (direto). Regenere se necessário.

### "No images in response"
**Causa:** Modelo retornou apenas texto (filtro de segurança, prompt confuso ou pedido não suportado).
**Solução:** Torne o prompt mais específico. Evite conteúdo proibido.

### "Connection error" / timeout
**Causa:** Problema de rede ou geração muito lenta (timeout de 120s).
**Solução:** Tente novamente. Se persistir, experimente \`--provider google\` como alternativa.`,
  },

  // ────────────────────────────────────────────────────────────────────────
  // CREATE-* skills — descriptions only
  // ────────────────────────────────────────────────────────────────────────
  'create-agent': {
    title: 'Criar Agente',
    description:
      'Guia o usuário pela criação de um novo agente personalizado — define nome, domínio, personalidade, skills, modelo e pasta de memória.',
  },
  'create-command': {
    title: 'Criar Comando',
    description:
      'Cria um novo slash command no workspace. Use quando o usuário quiser adicionar um atalho de comando personalizado.',
  },
  'create-goal': {
    title: 'Criar Meta',
    description:
      'Cria uma nova meta no workspace com prazo, métricas e critérios de sucesso. Use quando o usuário quiser rastrear objetivos.',
  },
  'create-heartbeat': {
    title: 'Criar Heartbeat',
    description:
      'Cria um heartbeat recorrente (rotina agendada). Use quando o usuário quiser automatizar tarefas periódicas.',
  },
  'create-integration': {
    title: 'Criar Integração',
    description:
      'Guia a configuração de uma nova integração com serviços externos (CRM, Slack, GitHub, etc.).',
  },
  'create-routine': {
    title: 'Criar Rotina',
    description:
      'Cria uma nova rotina automatizada que pode ser agendada ou disparada por eventos. Use para automatizar fluxos repetitivos.',
  },
  'create-ticket': {
    title: 'Criar Ticket',
    description:
      'Cria um ticket estruturado (tarefa, bug ou feature request) com contexto, prioridade e critérios de aceite.',
  },

  // ────────────────────────────────────────────────────────────────────────
  // CS skills
  // ────────────────────────────────────────────────────────────────────────
  'cs-customer-escalation': {
    title: 'Escalação de Cliente',
    description:
      'Gerencia situações críticas de cliente — identifica urgência, documenta impacto, aciona as equipes corretas e prepara comunicação.',
  },
  'cs-customer-research': {
    title: 'Pesquisa de Cliente',
    description:
      'Pesquisa o perfil do cliente — histórico, uso do produto, tickets anteriores, NPS e saúde do contrato — antes de uma reunião ou escalação.',
  },
  'cs-draft-response': {
    title: 'Rascunhar Resposta ao Cliente',
    description:
      'Redige respostas profissionais para tickets, emails e chats de clientes. Adapta tom e formato ao contexto.',
  },
  'cs-kb-article': {
    title: 'Artigo de Base de Conhecimento',
    description:
      'Cria artigos claros e estruturados para a base de conhecimento — FAQ, guias de troubleshooting e tutoriais de produto.',
  },
  'cs-ticket-triage': {
    title: 'Triagem de Ticket',
    description:
      'Triagem de tickets de suporte — classifica prioridade, identifica categoria, sugere resolução e roteia para o time correto.',
  },

  // ────────────────────────────────────────────────────────────────────────
  // Data skills
  // ────────────────────────────────────────────────────────────────────────
  'data-analyze': {
    title: 'Analisar Dados',
    description:
      'Análise exploratória de datasets — distribições, outliers, correlações e insights iniciais. Primeira etapa de qualquer projeto de dados.',
  },
  'data-build-dashboard': {
    title: 'Construir Dashboard',
    description:
      'Constrói dashboards analíticos com visualizações claras e métricas acionáveis. Define KPIs antes de implementar.',
  },
  'data-create-viz': {
    title: 'Criar Visualização',
    description:
      'Cria gráficos e visualizações de dados — escolhe o tipo correto para cada dado e garante legibilidade.',
  },
  'data-explore': {
    title: 'Explorar Dataset',
    description:
      'Exploração inicial de um dataset novo — estrutura, tipos, qualidade, valores ausentes e estatísticas descritivas.',
  },
  'data-statistical-analysis': {
    title: 'Análise Estatística',
    description:
      'Análise estatística formal com testes de hipótese, intervalos de confiança e interpretação de resultados para tomada de decisão.',
  },
  'data-validate': {
    title: 'Validar Dados',
    description:
      'Valida qualidade de dados — checa integridade, consistência, duplicatas e conformidade com regras de negócio.',
  },
  'data-write-query': {
    title: 'Escrever Query',
    description:
      'Escreve consultas SQL otimizadas para análise de dados. Inclui documentação e testes de validação.',
  },

  // ────────────────────────────────────────────────────────────────────────
  // Dev skills — descriptions only (body pending)
  // ────────────────────────────────────────────────────────────────────────
  'dev-ask': {
    title: 'Perguntar ao Código',
    description: 'Responde perguntas sobre a codebase sem modificar nada.',
  },
  'dev-autopilot': {
    title: 'Piloto Automático',
    description: 'Executa tarefas de desenvolvimento de forma autônoma, reportando progresso.',
  },
  'dev-deep-dive': {
    title: 'Análise Profunda',
    description: 'Análise aprofundada de código, arquitetura ou sistema — identifica padrões, riscos e oportunidades.',
  },
  'dev-plan': {
    title: 'Planejar Implementação',
    description: 'Cria um plano técnico detalhado antes de implementar — quebra em tarefas, estima esforço e identifica dependências.',
  },
  'dev-release': {
    title: 'Preparar Release',
    description: 'Prepara uma nova versão — changelog, notas de release, verificações de qualidade e deploy checklist.',
  },
  'dev-remember': {
    title: 'Lembrar Contexto',
    description: 'Salva contexto importante da sessão atual para uso futuro — decisões, padrões, convenções.',
  },
  'dev-verify': {
    title: 'Verificar Implementação',
    description: 'Verifica que uma implementação funciona corretamente — testes, comportamento esperado e edge cases.',
  },

}

const SKILL_BODY_PT_BR_OVERLAYS: Record<string, string> = {
  'create-agent': `# Criar Agente

Cria um novo agente personalizado para o workspace sem alterar agentes nativos. Use quando o usuário quiser um agente com papel, domínio, tom, ferramentas e memória próprios.

## Fluxo

1. Entenda o objetivo do agente, o tipo de trabalho e os limites de atuação.
2. Defina nome, slug, descrição, personalidade, modelo preferido e critérios de sucesso.
3. Liste skills necessárias e fontes de memória.
4. Explique o arquivo que será criado e peça confirmação antes de escrever.
5. Depois da criação, oriente o usuário sobre como testar o agente.

## Preservar

Mantenha slugs, paths, frontmatter, comandos e nomes de ferramentas literalmente. Não altere agentes nativos em '.claude/agents/'; novos agentes devem viver no local apropriado para customizações do workspace.

## Saída esperada

Entregue um agente pronto para revisão, com descrição curta, instruções claras, limites explícitos e próximos passos de validação.`,

  'create-command': `# Criar Comando

Cria um novo slash command para automatizar uma ação recorrente no workspace. Use quando o usuário quiser um atalho de comando com instruções reutilizáveis.

## Fluxo

1. Identifique o objetivo do comando e o agente ou skill que ele deve acionar.
2. Defina nome, slug, argumentos esperados e exemplos de uso.
3. Preserve o formato de slash command e qualquer path informado.
4. Peça confirmação antes de criar ou substituir arquivos.
5. Explique como testar o comando depois.

## Regras

Não altere comandos nativos sem pedido explícito. Preserve frontmatter, blocos de código, YAML, JSON, URLs e flags exatamente como foram fornecidos.

## Saída esperada

Entregue o comando com instruções objetivas, exemplos e uma nota de validação manual.`,

  'create-goal': `# Criar Meta

Cria uma meta estruturada para acompanhar objetivo, prazo, métricas, owners e critérios de sucesso. Use quando o usuário quiser transformar uma intenção em acompanhamento concreto.

## Fluxo

1. Clarifique resultado desejado, data-alvo e motivação.
2. Defina métricas observáveis e milestones.
3. Liste riscos, dependências e cadência de revisão.
4. Registre a meta no formato usado pelo workspace.
5. Confirme próximos checkpoints.

## Boas práticas

Metas devem ser específicas, mensuráveis e revisáveis. Se o objetivo for vago, faça perguntas antes de registrar.

## Saída esperada

Entregue uma meta com título, descrição, critérios de sucesso, prazo, status inicial e próximos passos.`,

  'create-heartbeat': `# Criar Heartbeat

Cria uma rotina recorrente para acordar um agente em uma agenda definida. Use quando o usuário quiser monitoramento, revisão ou ação periódica sem lembrar manualmente.

## Fluxo

1. Determine agente responsável, frequência, gatilho e objetivo.
2. Defina o que o heartbeat deve verificar e quando deve agir.
3. Estabeleça limites para evitar ações desnecessárias.
4. Preserve sintaxe de cron, YAML, JSON e paths exatamente.
5. Explique como pausar, revisar ou remover o heartbeat.

## Regras

Não crie automações com efeitos externos sem confirmação. Para tarefas sensíveis, recomende modo de relatório antes de ação automática.

## Saída esperada

Entregue configuração clara, resumo do comportamento e checklist de validação.`,

  'create-integration': `# Criar Integração

Guia a configuração de uma integração com serviço externo. Use quando o usuário quiser conectar APIs, CRMs, comunicação, pagamentos, analytics ou outras ferramentas.

## Fluxo

1. Identifique serviço, objetivo, credenciais necessárias e escopo de permissões.
2. Mapeie variáveis de ambiente, URLs, tokens e limitações.
3. Preserve nomes como API keys, env vars, endpoints e slugs literalmente.
4. Oriente a configuração sem expor secrets.
5. Valide com uma chamada ou checklist seguro quando possível.

## Segurança

Nunca peça para colar secrets em arquivos versionados. Não imprima tokens. Recomende permissões mínimas e rotação quando aplicável.

## Saída esperada

Entregue passos de configuração, variáveis necessárias, teste de conexão e próximos usos da integração.`,

  'create-routine': `# Criar Rotina

Cria uma rotina automatizada ou semiautomatizada para um processo recorrente. Use quando o usuário quiser padronizar um fluxo operacional, relatório, checklist ou sequência de ações.

## Fluxo

1. Entenda objetivo, frequência, entrada, saída e responsável.
2. Separe passos manuais de passos automatizáveis.
3. Defina critérios de disparo e encerramento.
4. Preserve comandos, paths, YAML, JSON e nomes de arquivos.
5. Inclua validação e forma de acompanhar execução.

## Boas práticas

Rotinas devem ser pequenas o suficiente para auditar. Quando houver risco, comece com rotina que apenas relata antes de executar ações.

## Saída esperada

Entregue a rotina com propósito, passos, agenda, agente responsável, critérios de sucesso e plano de rollback quando necessário.`,

  'create-ticket': `# Criar Ticket

Cria um ticket estruturado para bug, feature request, tarefa ou investigação. Use quando o usuário quiser transformar contexto solto em trabalho rastreável.

## Fluxo

1. Classifique tipo do ticket.
2. Registre contexto, impacto, prioridade e owner.
3. Defina critérios de aceite e evidência esperada.
4. Inclua links, arquivos e comandos relevantes sem alterar seu conteúdo.
5. Confirme se o ticket está pronto para execução.

## Saída esperada

Entregue título, descrição, contexto, passos de reprodução quando houver, critérios de aceite, prioridade e próximos passos.`,

  'cs-customer-escalation': `# Escalação de Cliente

Gerencia situações críticas de cliente com clareza, urgência e comunicação controlada. Use quando houver impacto de negócio, risco de churn, incidente, bloqueio ou insatisfação relevante.

## Fluxo

1. Identifique cliente, impacto, severidade, timeline e stakeholders.
2. Separe fatos confirmados de hipóteses.
3. Defina owner interno e canal de comunicação.
4. Prepare atualização para cliente com próximos passos e horário de retorno.
5. Crie plano de mitigação e acompanhamento.

## Regras

Não prometa prazos sem validação. Não atribua culpa. Escale internamente quando houver impacto crítico, dados sensíveis ou risco contratual.

## Saída esperada

Entregue resumo executivo, severidade, plano de ação, mensagem para cliente e cadência de atualização.`,

  'cs-customer-research': `# Pesquisa de Cliente

Pesquisa contexto de cliente antes de reunião, renovação, suporte ou escalonamento. Use para entender histórico, uso, tickets, relacionamento e riscos.

## Fluxo

1. Reúna dados de CRM, tickets, notas, contratos e interações anteriores.
2. Identifique produtos usados, stakeholders e objetivos do cliente.
3. Liste riscos, oportunidades e pendências.
4. Prepare perguntas específicas para a próxima conversa.
5. Preserve fontes e links para rastreabilidade.

## Saída esperada

Entregue brief de conta com contexto, saúde, histórico, riscos, oportunidades e recomendações de abordagem.`,

  'cs-draft-response': `# Rascunhar Resposta ao Cliente

Redige respostas claras e profissionais para clientes em tickets, e-mails ou chats. Use quando o usuário precisar comunicar status, solução, pedido de informação ou escalonamento.

## Fluxo

1. Entenda problema, cliente, tom desejado e canal.
2. Separe o que já é confirmado do que ainda está em investigação.
3. Escreva resposta objetiva, empática e acionável.
4. Inclua próximos passos, prazos de retorno e pedidos específicos.
5. Revise para evitar promessas indevidas.

## Saída esperada

Entregue uma resposta pronta para revisão, com assunto quando aplicável, corpo da mensagem e notas internas opcionais.`,

  'cs-kb-article': `# Artigo de Base de Conhecimento

Cria ou melhora artigos de KB para dúvidas recorrentes, troubleshooting e guias de produto. Use quando um problema deve ser resolvido de forma repetível.

## Fluxo

1. Defina público, pré-requisitos e objetivo do artigo.
2. Estruture passos em ordem de execução.
3. Inclua sintomas, causa provável, solução e validação.
4. Preserve comandos, paths, URLs e mensagens de erro literalmente.
5. Adicione critérios para escalar ao suporte.

## Saída esperada

Entregue artigo com título, resumo, passos, exemplos, validação e seção de troubleshooting.`,

  'cs-ticket-triage': `# Triagem de Ticket

Classifica tickets de suporte por prioridade, categoria, impacto e rota de resolução. Use para reduzir fila, encontrar urgências e encaminhar corretamente.

## Fluxo

1. Leia descrição, impacto, cliente e evidências.
2. Classifique severidade e categoria.
3. Identifique dados ausentes.
4. Sugira próximo owner ou time.
5. Prepare resposta inicial quando apropriado.

## Saída esperada

Entregue prioridade, categoria, justificativa, próximos passos, perguntas ao cliente e sugestão de encaminhamento.`,

  'data-analyze': `# Analisar Dados

Executa análise exploratória para transformar dados em insights iniciais. Use quando o usuário trouxer dataset, métrica ou pergunta analítica.

## Fluxo

1. Entenda a pergunta de negócio.
2. Inspecione schema, tipos, período e granularidade.
3. Verifique nulos, duplicatas, outliers e distribuições.
4. Explore correlações e segmentos relevantes.
5. Traduza achados em hipóteses e próximos passos.

## Regras

Não confunda correlação com causalidade. Preserve nomes de colunas, queries, JSON, CSV e paths literalmente.

## Saída esperada

Entregue resumo executivo, qualidade dos dados, principais achados, limitações e recomendações.`,

  'data-build-dashboard': `# Construir Dashboard

Constrói dashboards analíticos com KPIs, filtros e visualizações úteis para decisão. Use quando o usuário precisar acompanhar métricas de forma recorrente.

## Fluxo

1. Defina público, decisão suportada e cadência de uso.
2. Escolha KPIs principais e métricas auxiliares.
3. Confirme fontes, queries e definições.
4. Planeje layout com hierarquia: visão geral, diagnóstico e detalhe.
5. Inclua estados vazios, filtros e notas de definição.

## Boas práticas

Cada gráfico deve responder uma pergunta. Evite métricas decorativas. Preserve SQL, nomes de tabelas, colunas e formatos de data.

## Saída esperada

Entregue spec de dashboard, lista de métricas, queries ou pseud queries, layout sugerido e plano de validação.`,

  'data-create-viz': `# Criar Visualização

Cria gráficos e visualizações escolhendo o formato correto para cada tipo de dado e pergunta.

## Fluxo

1. Identifique variável, dimensão, métrica e comparação.
2. Escolha gráfico adequado: linha, barra, dispersão, heatmap, tabela ou distribuição.
3. Defina eixos, labels, escala e ordenação.
4. Remova ruído visual.
5. Explique a leitura e limitação da visualização.

## Saída esperada

Entregue recomendação de gráfico, configuração visual, interpretação e alertas sobre possíveis leituras erradas.`,

  'data-explore': `# Explorar Dataset

Explora um dataset novo para entender estrutura, qualidade e potencial analítico.

## Fluxo

1. Liste colunas, tipos e exemplos.
2. Calcule tamanho, cobertura temporal e granularidade.
3. Verifique nulos, duplicatas e valores anômalos.
4. Identifique chaves, categorias e métricas candidatas.
5. Sugira perguntas analíticas promissoras.

## Saída esperada

Entregue data profile, problemas de qualidade, oportunidades de análise e próximos passos de limpeza ou modelagem.`,

  'data-statistical-analysis': `# Análise Estatística

Realiza análise estatística formal com hipóteses, testes, intervalos de confiança e interpretação cuidadosa.

## Fluxo

1. Formule hipótese nula e alternativa.
2. Verifique desenho dos dados e assumptions.
3. Escolha teste adequado ao tipo de variável e distribuição.
4. Calcule efeito, incerteza e significância quando aplicável.
5. Interprete em linguagem de negócio.

## Regras

Não use p-value como única conclusão. Declare limitações, vieses e necessidade de experimento quando causalidade não for suportada.

## Saída esperada

Entregue método, resultado, interpretação, limitações e recomendação.`,

  'data-validate': `# Validar Dados

Valida qualidade, consistência e conformidade de dados antes de análise ou uso operacional.

## Fluxo

1. Defina regras de validade e fonte de verdade.
2. Cheque schema, tipos, nulos, duplicatas e ranges.
3. Verifique integridade referencial e consistência temporal.
4. Classifique severidade dos problemas.
5. Recomende correções e monitoramento.

## Saída esperada

Entregue relatório de validação, regras testadas, falhas encontradas, impacto e plano de correção.`,

  'data-write-query': `# Escrever Query

Escreve consultas SQL para análise, validação ou extração de dados. Use quando o usuário precisar consultar dados com clareza e segurança.

## Fluxo

1. Entenda pergunta, tabelas, joins e filtros.
2. Preserve nomes de tabelas, colunas, schemas e funções SQL.
3. Escreva query legível com CTEs quando útil.
4. Explique assumptions e possíveis problemas de cardinalidade.
5. Inclua query de validação quando necessário.

## Saída esperada

Entregue SQL, explicação breve, validações e notas de performance.`,

  'dev-ask': `# Perguntar ao Código

Responde perguntas sobre a codebase sem modificar arquivos.

## Fluxo

1. Identifique a pergunta e escopo.
2. Busque arquivos com 'rg' ou leitura direcionada.
3. Cite paths e linhas relevantes.
4. Separe fato observado de inferência.
5. Não edite, não formate e não rode mudanças.

## Saída esperada

Entregue resposta curta, referências de código e próximos pontos de investigação se houver incerteza.`,

  'dev-autopilot': `# Piloto Automático

Executa uma tarefa de desenvolvimento de ponta a ponta quando o escopo é claro e a autonomia é desejada.

## Fluxo

1. Leia contexto e status do Git.
2. Planeje passos mínimos.
3. Implemente seguindo padrões locais.
4. Rode verificação adequada.
5. Resuma diff, validação e riscos.

## Regras

Preserve mudanças do usuário. Não faça alterações destrutivas. Não declare conclusão sem evidência de build/teste quando aplicável.

## Saída esperada

Entregue implementação, validação e relatório objetivo.`,

  'dev-deep-dive': `# Análise Profunda

Faz análise detalhada de código, arquitetura, fluxo ou sistema para entender comportamento, riscos e oportunidades.

## Fluxo

1. Defina pergunta de investigação.
2. Mapeie componentes e fluxo de dados.
3. Leia arquivos-chave em profundidade.
4. Identifique padrões, dívidas, riscos e tradeoffs.
5. Entregue síntese com evidências.

## Saída esperada

Entregue análise estruturada, referências de código, riscos e recomendações priorizadas.`,

  'dev-plan': `# Planejar Implementação

Cria plano técnico antes de implementar. Use quando o trabalho tiver múltiplas etapas, riscos ou dependências.

## Fluxo

1. Clarifique objetivo e restrições.
2. Liste arquivos prováveis e responsabilidades.
3. Divida em tarefas pequenas e verificáveis.
4. Defina testes e critérios de sucesso.
5. Aponte riscos e perguntas abertas.

## Saída esperada

Entregue plano com sequência de execução, validação e pontos de decisão.`,

  'dev-release': `# Preparar Release

Prepara uma versão para publicação com changelog, notas, validação e checklist de deploy.

## Fluxo

1. Confirme branch, tag, versão e escopo.
2. Reúna commits e mudanças relevantes.
3. Rode builds, testes e smoke checks necessários.
4. Atualize release notes e documentação.
5. Confirme restrições como não usar 'latest' quando aplicável.

## Saída esperada

Entregue release notes, evidências de validação, imagem/tag quando houver e próximos passos de deploy.`,

  'dev-remember': `# Lembrar Contexto

Registra contexto importante da sessão para uso futuro: decisões, padrões, convenções, riscos e aprendizados.

## Fluxo

1. Identifique informação que terá valor futuro.
2. Remova ruído e dados sensíveis.
3. Escreva memória curta, específica e recuperável.
4. Inclua contexto suficiente para evitar ambiguidade.
5. Confirme onde foi registrada.

## Saída esperada

Entregue memória ou resumo pronto para persistência, com escopo e motivo.`,

  'dev-verify': `# Verificar Implementação

Verifica se uma mudança funciona e atende aos requisitos. Use antes de declarar algo concluído.

## Fluxo

1. Leia critérios de aceite.
2. Escolha comandos de build, teste ou smoke adequados.
3. Rode a verificação completa.
4. Leia saída e identifique falhas.
5. Relate evidência, lacunas e riscos.

## Saída esperada

Entregue checklist de verificação, comandos executados, resultado e conclusão baseada em evidência.`,
}

for (const [skillId, body] of Object.entries(SKILL_BODY_PT_BR_OVERLAYS)) {
  SKILL_PT_BR_OVERLAYS[skillId] = {
    ...SKILL_PT_BR_OVERLAYS[skillId],
    body,
  }
}

const AUTO_SKILL_PT_BR_OVERLAYS: Record<string, SkillOverlay> = {
  'db-mongo': {
    title: 'Banco de Dados MongoDB',
    description: 'Executa o fluxo de Banco de Dados MongoDB no domínio de bancos de dados. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Banco de Dados MongoDB

Overlay pt-BR frontend-only para a skill 'db-mongo'. O runtime continua lendo a definição original em inglês em '.claude/skills/db-mongo/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Banco de Dados MongoDB no domínio de bancos de dados. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'db-mysql': {
    title: 'Banco de Dados MySQL',
    description: 'Executa o fluxo de Banco de Dados MySQL no domínio de bancos de dados. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Banco de Dados MySQL

Overlay pt-BR frontend-only para a skill 'db-mysql'. O runtime continua lendo a definição original em inglês em '.claude/skills/db-mysql/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Banco de Dados MySQL no domínio de bancos de dados. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'db-postgres': {
    title: 'Banco de Dados Postgres',
    description: 'Executa o fluxo de Banco de Dados Postgres no domínio de bancos de dados. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Banco de Dados Postgres

Overlay pt-BR frontend-only para a skill 'db-postgres'. O runtime continua lendo a definição original em inglês em '.claude/skills/db-postgres/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Banco de Dados Postgres no domínio de bancos de dados. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'db-redis': {
    title: 'Banco de Dados Redis',
    description: 'Executa o fluxo de Banco de Dados Redis no domínio de bancos de dados. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Banco de Dados Redis

Overlay pt-BR frontend-only para a skill 'db-redis'. O runtime continua lendo a definição original em inglês em '.claude/skills/db-redis/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Banco de Dados Redis no domínio de bancos de dados. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-ai-slop-cleaner': {
    title: 'Dev IA Slop Cleaner',
    description: 'Executa o fluxo de Dev IA Slop Cleaner no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev IA Slop Cleaner

Overlay pt-BR frontend-only para a skill 'dev-ai-slop-cleaner'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-ai-slop-cleaner/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev IA Slop Cleaner no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-cancel': {
    title: 'Dev Cancelar',
    description: 'Executa o fluxo de Dev Cancelar no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev Cancelar

Overlay pt-BR frontend-only para a skill 'dev-cancel'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-cancel/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev Cancelar no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-ccg': {
    title: 'Dev CCG',
    description: 'Executa o fluxo de Dev CCG no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev CCG

Overlay pt-BR frontend-only para a skill 'dev-ccg'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-ccg/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev CCG no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-configure-notifications': {
    title: 'Dev Configurar Notificações',
    description: 'Executa o fluxo de Dev Configurar Notificações no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev Configurar Notificações

Overlay pt-BR frontend-only para a skill 'dev-configure-notifications'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-configure-notifications/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev Configurar Notificações no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-deep-interview': {
    title: 'Dev Análise Profunda Entrevista',
    description: 'Executa o fluxo de Dev Análise Profunda Entrevista no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev Análise Profunda Entrevista

Overlay pt-BR frontend-only para a skill 'dev-deep-interview'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-deep-interview/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev Análise Profunda Entrevista no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-deepinit': {
    title: 'Dev Deep Init',
    description: 'Executa o fluxo de Dev Deep Init no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev Deep Init

Overlay pt-BR frontend-only para a skill 'dev-deepinit'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-deepinit/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev Deep Init no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-external-context': {
    title: 'Dev Contexto Externo Contexto',
    description: 'Executa o fluxo de Dev Contexto Externo Contexto no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev Contexto Externo Contexto

Overlay pt-BR frontend-only para a skill 'dev-external-context'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-external-context/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev Contexto Externo Contexto no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-learner': {
    title: 'Dev Aprendiz',
    description: 'Executa o fluxo de Dev Aprendiz no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev Aprendiz

Overlay pt-BR frontend-only para a skill 'dev-learner'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-learner/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev Aprendiz no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-mcp-setup': {
    title: 'Dev MCP Setup',
    description: 'Executa o fluxo de Dev MCP Setup no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev MCP Setup

Overlay pt-BR frontend-only para a skill 'dev-mcp-setup'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-mcp-setup/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev MCP Setup no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-project-session-manager': {
    title: 'Dev Projeto Sessão Gerenciador',
    description: 'Executa o fluxo de Dev Projeto Sessão Gerenciador no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev Projeto Sessão Gerenciador

Overlay pt-BR frontend-only para a skill 'dev-project-session-manager'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-project-session-manager/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev Projeto Sessão Gerenciador no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-ralph': {
    title: 'Dev Ralph',
    description: 'Executa o fluxo de Dev Ralph no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev Ralph

Overlay pt-BR frontend-only para a skill 'dev-ralph'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-ralph/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev Ralph no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-ralplan': {
    title: 'Dev Ralplan',
    description: 'Executa o fluxo de Dev Ralplan no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev Ralplan

Overlay pt-BR frontend-only para a skill 'dev-ralplan'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-ralplan/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev Ralplan no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-sciomc': {
    title: 'Dev SciOMC',
    description: 'Executa o fluxo de Dev SciOMC no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev SciOMC

Overlay pt-BR frontend-only para a skill 'dev-sciomc'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-sciomc/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev SciOMC no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-skillify': {
    title: 'Dev Skillify',
    description: 'Executa o fluxo de Dev Skillify no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev Skillify

Overlay pt-BR frontend-only para a skill 'dev-skillify'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-skillify/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev Skillify no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-team': {
    title: 'Dev Time',
    description: 'Executa o fluxo de Dev Time no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev Time

Overlay pt-BR frontend-only para a skill 'dev-team'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-team/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev Time no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-trace': {
    title: 'Dev Rastrear',
    description: 'Executa o fluxo de Dev Rastrear no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev Rastrear

Overlay pt-BR frontend-only para a skill 'dev-trace'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-trace/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev Rastrear no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-ultraqa': {
    title: 'Dev Ultra QA',
    description: 'Executa o fluxo de Dev Ultra QA no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev Ultra QA

Overlay pt-BR frontend-only para a skill 'dev-ultraqa'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-ultraqa/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev Ultra QA no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'dev-visual-verdict': {
    title: 'Dev Visual Veredito',
    description: 'Executa o fluxo de Dev Visual Veredito no domínio de desenvolvimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Dev Visual Veredito

Overlay pt-BR frontend-only para a skill 'dev-visual-verdict'. O runtime continua lendo a definição original em inglês em '.claude/skills/dev-visual-verdict/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Dev Visual Veredito no domínio de desenvolvimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'discord-create-channel': {
    title: 'Discord Criar Canal',
    description: 'Executa o fluxo de Discord Criar Canal no domínio de Discord. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Discord Criar Canal

Overlay pt-BR frontend-only para a skill 'discord-create-channel'. O runtime continua lendo a definição original em inglês em '.claude/skills/discord-create-channel/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Discord Criar Canal no domínio de Discord. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'discord-get-messages': {
    title: 'Discord Get Mensagens',
    description: 'Executa o fluxo de Discord Get Mensagens no domínio de Discord. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Discord Get Mensagens

Overlay pt-BR frontend-only para a skill 'discord-get-messages'. O runtime continua lendo a definição original em inglês em '.claude/skills/discord-get-messages/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Discord Get Mensagens no domínio de Discord. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'discord-list-channels': {
    title: 'Discord Listar Channels',
    description: 'Executa o fluxo de Discord Listar Channels no domínio de Discord. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Discord Listar Channels

Overlay pt-BR frontend-only para a skill 'discord-list-channels'. O runtime continua lendo a definição original em inglês em '.claude/skills/discord-list-channels/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Discord Listar Channels no domínio de Discord. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'discord-manage-channel': {
    title: 'Discord Gerenciar Canal',
    description: 'Executa o fluxo de Discord Gerenciar Canal no domínio de Discord. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Discord Gerenciar Canal

Overlay pt-BR frontend-only para a skill 'discord-manage-channel'. O runtime continua lendo a definição original em inglês em '.claude/skills/discord-manage-channel/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Discord Gerenciar Canal no domínio de Discord. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'discord-send-message': {
    title: 'Discord Enviar Message',
    description: 'Executa o fluxo de Discord Enviar Message no domínio de Discord. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Discord Enviar Message

Overlay pt-BR frontend-only para a skill 'discord-send-message'. O runtime continua lendo a definição original em inglês em '.claude/skills/discord-send-message/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Discord Enviar Message no domínio de Discord. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'fin-audit-support': {
    title: 'Financeiro Auditoria Suporte',
    description: 'Executa o fluxo de Financeiro Auditoria Suporte no domínio de finanças. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Financeiro Auditoria Suporte

Overlay pt-BR frontend-only para a skill 'fin-audit-support'. O runtime continua lendo a definição original em inglês em '.claude/skills/fin-audit-support/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Financeiro Auditoria Suporte no domínio de finanças. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'fin-close-management': {
    title: 'Financeiro Fechamento Gestão',
    description: 'Executa o fluxo de Financeiro Fechamento Gestão no domínio de finanças. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Financeiro Fechamento Gestão

Overlay pt-BR frontend-only para a skill 'fin-close-management'. O runtime continua lendo a definição original em inglês em '.claude/skills/fin-close-management/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Financeiro Fechamento Gestão no domínio de finanças. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'fin-daily-pulse': {
    title: 'Financeiro Diário Pulse',
    description: 'Executa o fluxo de Financeiro Diário Pulse no domínio de finanças. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Financeiro Diário Pulse

Overlay pt-BR frontend-only para a skill 'fin-daily-pulse'. O runtime continua lendo a definição original em inglês em '.claude/skills/fin-daily-pulse/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Financeiro Diário Pulse no domínio de finanças. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'fin-financial-statements': {
    title: 'Financeiro Financeiras Demonstrações',
    description: 'Executa o fluxo de Financeiro Financeiras Demonstrações no domínio de finanças. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Financeiro Financeiras Demonstrações

Overlay pt-BR frontend-only para a skill 'fin-financial-statements'. O runtime continua lendo a definição original em inglês em '.claude/skills/fin-financial-statements/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Financeiro Financeiras Demonstrações no domínio de finanças. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'fin-journal-entry': {
    title: 'Financeiro Lançamento Contábil',
    description: 'Executa o fluxo de Financeiro Lançamento Contábil no domínio de finanças. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Financeiro Lançamento Contábil

Overlay pt-BR frontend-only para a skill 'fin-journal-entry'. O runtime continua lendo a definição original em inglês em '.claude/skills/fin-journal-entry/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Financeiro Lançamento Contábil no domínio de finanças. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'fin-journal-entry-prep': {
    title: 'Financeiro Lançamento Contábil Preparação',
    description: 'Executa o fluxo de Financeiro Lançamento Contábil Preparação no domínio de finanças. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Financeiro Lançamento Contábil Preparação

Overlay pt-BR frontend-only para a skill 'fin-journal-entry-prep'. O runtime continua lendo a definição original em inglês em '.claude/skills/fin-journal-entry-prep/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Financeiro Lançamento Contábil Preparação no domínio de finanças. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'fin-monthly-close-kickoff': {
    title: 'Financeiro Mensal Fechamento Kickoff',
    description: 'Executa o fluxo de Financeiro Mensal Fechamento Kickoff no domínio de finanças. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Financeiro Mensal Fechamento Kickoff

Overlay pt-BR frontend-only para a skill 'fin-monthly-close-kickoff'. O runtime continua lendo a definição original em inglês em '.claude/skills/fin-monthly-close-kickoff/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Financeiro Mensal Fechamento Kickoff no domínio de finanças. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'fin-reconciliation': {
    title: 'Financeiro Reconciliação',
    description: 'Executa o fluxo de Financeiro Reconciliação no domínio de finanças. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Financeiro Reconciliação

Overlay pt-BR frontend-only para a skill 'fin-reconciliation'. O runtime continua lendo a definição original em inglês em '.claude/skills/fin-reconciliation/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Financeiro Reconciliação no domínio de finanças. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'fin-sox-testing': {
    title: 'Financeiro SOX Testes',
    description: 'Executa o fluxo de Financeiro SOX Testes no domínio de finanças. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Financeiro SOX Testes

Overlay pt-BR frontend-only para a skill 'fin-sox-testing'. O runtime continua lendo a definição original em inglês em '.claude/skills/fin-sox-testing/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Financeiro SOX Testes no domínio de finanças. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'fin-variance-analysis': {
    title: 'Financeiro Variação Análise',
    description: 'Executa o fluxo de Financeiro Variação Análise no domínio de finanças. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Financeiro Variação Análise

Overlay pt-BR frontend-only para a skill 'fin-variance-analysis'. O runtime continua lendo a definição original em inglês em '.claude/skills/fin-variance-analysis/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Financeiro Variação Análise no domínio de finanças. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'fin-weekly-report': {
    title: 'Financeiro Semanal Relatório',
    description: 'Executa o fluxo de Financeiro Semanal Relatório no domínio de finanças. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Financeiro Semanal Relatório

Overlay pt-BR frontend-only para a skill 'fin-weekly-report'. O runtime continua lendo a definição original em inglês em '.claude/skills/fin-weekly-report/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Financeiro Semanal Relatório no domínio de finanças. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'gog-calendar': {
    title: 'Google Calendar',
    description: 'Executa o fluxo de Google Calendar no domínio de Google Workspace. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Google Calendar

Overlay pt-BR frontend-only para a skill 'gog-calendar'. O runtime continua lendo a definição original em inglês em '.claude/skills/gog-calendar/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Google Calendar no domínio de Google Workspace. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'gog-email-draft': {
    title: 'Google Email Rascunhar',
    description: 'Executa o fluxo de Google Email Rascunhar no domínio de Google Workspace. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Google Email Rascunhar

Overlay pt-BR frontend-only para a skill 'gog-email-draft'. O runtime continua lendo a definição original em inglês em '.claude/skills/gog-email-draft/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Google Email Rascunhar no domínio de Google Workspace. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'gog-email-send': {
    title: 'Google Email Enviar',
    description: 'Executa o fluxo de Google Email Enviar no domínio de Google Workspace. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Google Email Enviar

Overlay pt-BR frontend-only para a skill 'gog-email-send'. O runtime continua lendo a definição original em inglês em '.claude/skills/gog-email-send/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Google Email Enviar no domínio de Google Workspace. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'gog-email-triage': {
    title: 'Google Email Triagem',
    description: 'Executa o fluxo de Google Email Triagem no domínio de Google Workspace. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Google Email Triagem

Overlay pt-BR frontend-only para a skill 'gog-email-triage'. O runtime continua lendo a definição original em inglês em '.claude/skills/gog-email-triage/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Google Email Triagem no domínio de Google Workspace. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'gog-followups': {
    title: 'Google Follow-ups',
    description: 'Executa o fluxo de Google Follow-ups no domínio de Google Workspace. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Google Follow-ups

Overlay pt-BR frontend-only para a skill 'gog-followups'. O runtime continua lendo a definição original em inglês em '.claude/skills/gog-followups/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Google Follow-ups no domínio de Google Workspace. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'gog-tasks': {
    title: 'Google Tasks',
    description: 'Executa o fluxo de Google Tasks no domínio de Google Workspace. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Google Tasks

Overlay pt-BR frontend-only para a skill 'gog-tasks'. O runtime continua lendo a definição original em inglês em '.claude/skills/gog-tasks/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Google Tasks no domínio de Google Workspace. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'hr-comp-analysis': {
    title: 'RH Remuneração Análise',
    description: 'Executa o fluxo de RH Remuneração Análise no domínio de RH. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# RH Remuneração Análise

Overlay pt-BR frontend-only para a skill 'hr-comp-analysis'. O runtime continua lendo a definição original em inglês em '.claude/skills/hr-comp-analysis/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de RH Remuneração Análise no domínio de RH. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'hr-draft-offer': {
    title: 'RH Rascunhar Oferta',
    description: 'Executa o fluxo de RH Rascunhar Oferta no domínio de RH. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# RH Rascunhar Oferta

Overlay pt-BR frontend-only para a skill 'hr-draft-offer'. O runtime continua lendo a definição original em inglês em '.claude/skills/hr-draft-offer/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de RH Rascunhar Oferta no domínio de RH. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'hr-interview-prep': {
    title: 'RH Entrevista Preparação',
    description: 'Executa o fluxo de RH Entrevista Preparação no domínio de RH. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# RH Entrevista Preparação

Overlay pt-BR frontend-only para a skill 'hr-interview-prep'. O runtime continua lendo a definição original em inglês em '.claude/skills/hr-interview-prep/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de RH Entrevista Preparação no domínio de RH. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'hr-onboarding': {
    title: 'RH Onboarding',
    description: 'Executa o fluxo de RH Onboarding no domínio de RH. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# RH Onboarding

Overlay pt-BR frontend-only para a skill 'hr-onboarding'. O runtime continua lendo a definição original em inglês em '.claude/skills/hr-onboarding/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de RH Onboarding no domínio de RH. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'hr-org-planning': {
    title: 'RH Organização Planejamento',
    description: 'Executa o fluxo de RH Organização Planejamento no domínio de RH. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# RH Organização Planejamento

Overlay pt-BR frontend-only para a skill 'hr-org-planning'. O runtime continua lendo a definição original em inglês em '.claude/skills/hr-org-planning/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de RH Organização Planejamento no domínio de RH. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'hr-people-report': {
    title: 'RH Pessoas Relatório',
    description: 'Executa o fluxo de RH Pessoas Relatório no domínio de RH. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# RH Pessoas Relatório

Overlay pt-BR frontend-only para a skill 'hr-people-report'. O runtime continua lendo a definição original em inglês em '.claude/skills/hr-people-report/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de RH Pessoas Relatório no domínio de RH. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'hr-performance-review': {
    title: 'RH Performance Revisão',
    description: 'Executa o fluxo de RH Performance Revisão no domínio de RH. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# RH Performance Revisão

Overlay pt-BR frontend-only para a skill 'hr-performance-review'. O runtime continua lendo a definição original em inglês em '.claude/skills/hr-performance-review/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de RH Performance Revisão no domínio de RH. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'hr-policy-lookup': {
    title: 'RH Política Consulta',
    description: 'Executa o fluxo de RH Política Consulta no domínio de RH. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# RH Política Consulta

Overlay pt-BR frontend-only para a skill 'hr-policy-lookup'. O runtime continua lendo a definição original em inglês em '.claude/skills/hr-policy-lookup/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de RH Política Consulta no domínio de RH. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'hr-recruiting-pipeline': {
    title: 'RH Recrutamento Pipeline',
    description: 'Executa o fluxo de RH Recrutamento Pipeline no domínio de RH. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# RH Recrutamento Pipeline

Overlay pt-BR frontend-only para a skill 'hr-recruiting-pipeline'. O runtime continua lendo a definição original em inglês em '.claude/skills/hr-recruiting-pipeline/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de RH Recrutamento Pipeline no domínio de RH. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'initial-setup': {
    title: 'Inicial Setup',
    description: 'Executa o fluxo de Inicial Setup no domínio de configuração inicial. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Inicial Setup

Overlay pt-BR frontend-only para a skill 'initial-setup'. O runtime continua lendo a definição original em inglês em '.claude/skills/initial-setup/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Inicial Setup no domínio de configuração inicial. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-asaas': {
    title: 'Integração Asaas',
    description: 'Executa o fluxo de Integração Asaas no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração Asaas

Overlay pt-BR frontend-only para a skill 'int-asaas'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-asaas/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração Asaas no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-bling': {
    title: 'Integração Bling',
    description: 'Executa o fluxo de Integração Bling no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração Bling

Overlay pt-BR frontend-only para a skill 'int-bling'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-bling/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração Bling no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-evo-crm': {
    title: 'Integração Evo CRM',
    description: 'Executa o fluxo de Integração Evo CRM no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração Evo CRM

Overlay pt-BR frontend-only para a skill 'int-evo-crm'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-evo-crm/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração Evo CRM no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-evolution-api': {
    title: 'Integração Evolution API',
    description: 'Executa o fluxo de Integração Evolution API no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração Evolution API

Overlay pt-BR frontend-only para a skill 'int-evolution-api'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-evolution-api/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração Evolution API no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-evolution-go': {
    title: 'Integração Evolution Go',
    description: 'Executa o fluxo de Integração Evolution Go no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração Evolution Go

Overlay pt-BR frontend-only para a skill 'int-evolution-go'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-evolution-go/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração Evolution Go no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-fathom': {
    title: 'Integração Fathom',
    description: 'Executa o fluxo de Integração Fathom no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração Fathom

Overlay pt-BR frontend-only para a skill 'int-fathom'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-fathom/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração Fathom no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-github-review': {
    title: 'Integração GitHub Revisão',
    description: 'Executa o fluxo de Integração GitHub Revisão no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração GitHub Revisão

Overlay pt-BR frontend-only para a skill 'int-github-review'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-github-review/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração GitHub Revisão no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-instagram': {
    title: 'Integração Instagram',
    description: 'Executa o fluxo de Integração Instagram no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração Instagram

Overlay pt-BR frontend-only para a skill 'int-instagram'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-instagram/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração Instagram no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-linear-review': {
    title: 'Integração Linear Revisão',
    description: 'Executa o fluxo de Integração Linear Revisão no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração Linear Revisão

Overlay pt-BR frontend-only para a skill 'int-linear-review'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-linear-review/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração Linear Revisão no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-linkedin': {
    title: 'Integração LinkedIn',
    description: 'Executa o fluxo de Integração LinkedIn no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração LinkedIn

Overlay pt-BR frontend-only para a skill 'int-linkedin'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-linkedin/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração LinkedIn no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-omie': {
    title: 'Integração Omie',
    description: 'Executa o fluxo de Integração Omie no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração Omie

Overlay pt-BR frontend-only para a skill 'int-omie'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-omie/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração Omie no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-stripe': {
    title: 'Integração Stripe',
    description: 'Executa o fluxo de Integração Stripe no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração Stripe

Overlay pt-BR frontend-only para a skill 'int-stripe'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-stripe/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração Stripe no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-sync-meetings': {
    title: 'Integração Sincronizar Reuniões',
    description: 'Executa o fluxo de Integração Sincronizar Reuniões no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração Sincronizar Reuniões

Overlay pt-BR frontend-only para a skill 'int-sync-meetings'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-sync-meetings/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração Sincronizar Reuniões no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-telegram': {
    title: 'Integração Telegram',
    description: 'Executa o fluxo de Integração Telegram no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração Telegram

Overlay pt-BR frontend-only para a skill 'int-telegram'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-telegram/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração Telegram no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-todoist': {
    title: 'Integração Todoist',
    description: 'Executa o fluxo de Integração Todoist no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração Todoist

Overlay pt-BR frontend-only para a skill 'int-todoist'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-todoist/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração Todoist no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'int-youtube': {
    title: 'Integração YouTube',
    description: 'Executa o fluxo de Integração YouTube no domínio de integrações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Integração YouTube

Overlay pt-BR frontend-only para a skill 'int-youtube'. O runtime continua lendo a definição original em inglês em '.claude/skills/int-youtube/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Integração YouTube no domínio de integrações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'knowledge-admin': {
    title: 'Conhecimento Administração',
    description: 'Executa o fluxo de Conhecimento Administração no domínio de conhecimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Conhecimento Administração

Overlay pt-BR frontend-only para a skill 'knowledge-admin'. O runtime continua lendo a definição original em inglês em '.claude/skills/knowledge-admin/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Conhecimento Administração no domínio de conhecimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'knowledge-browse': {
    title: 'Conhecimento Navegar',
    description: 'Executa o fluxo de Conhecimento Navegar no domínio de conhecimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Conhecimento Navegar

Overlay pt-BR frontend-only para a skill 'knowledge-browse'. O runtime continua lendo a definição original em inglês em '.claude/skills/knowledge-browse/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Conhecimento Navegar no domínio de conhecimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'knowledge-ingest': {
    title: 'Conhecimento Ingerir',
    description: 'Executa o fluxo de Conhecimento Ingerir no domínio de conhecimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Conhecimento Ingerir

Overlay pt-BR frontend-only para a skill 'knowledge-ingest'. O runtime continua lendo a definição original em inglês em '.claude/skills/knowledge-ingest/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Conhecimento Ingerir no domínio de conhecimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'knowledge-organize': {
    title: 'Conhecimento Organizar',
    description: 'Executa o fluxo de Conhecimento Organizar no domínio de conhecimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Conhecimento Organizar

Overlay pt-BR frontend-only para a skill 'knowledge-organize'. O runtime continua lendo a definição original em inglês em '.claude/skills/knowledge-organize/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Conhecimento Organizar no domínio de conhecimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'knowledge-query': {
    title: 'Conhecimento Query',
    description: 'Executa o fluxo de Conhecimento Query no domínio de conhecimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Conhecimento Query

Overlay pt-BR frontend-only para a skill 'knowledge-query'. O runtime continua lendo a definição original em inglês em '.claude/skills/knowledge-query/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Conhecimento Query no domínio de conhecimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'knowledge-summarize': {
    title: 'Conhecimento Resumir',
    description: 'Executa o fluxo de Conhecimento Resumir no domínio de conhecimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Conhecimento Resumir

Overlay pt-BR frontend-only para a skill 'knowledge-summarize'. O runtime continua lendo a definição original em inglês em '.claude/skills/knowledge-summarize/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Conhecimento Resumir no domínio de conhecimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'learn-capture': {
    title: 'Aprendizagem Capturar',
    description: 'Executa o fluxo de Aprendizagem Capturar no domínio de aprendizagem. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Aprendizagem Capturar

Overlay pt-BR frontend-only para a skill 'learn-capture'. O runtime continua lendo a definição original em inglês em '.claude/skills/learn-capture/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Aprendizagem Capturar no domínio de aprendizagem. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'learn-quiz': {
    title: 'Aprendizagem Quiz',
    description: 'Executa o fluxo de Aprendizagem Quiz no domínio de aprendizagem. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Aprendizagem Quiz

Overlay pt-BR frontend-only para a skill 'learn-quiz'. O runtime continua lendo a definição original em inglês em '.claude/skills/learn-quiz/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Aprendizagem Quiz no domínio de aprendizagem. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'learn-review': {
    title: 'Aprendizagem Revisão',
    description: 'Executa o fluxo de Aprendizagem Revisão no domínio de aprendizagem. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Aprendizagem Revisão

Overlay pt-BR frontend-only para a skill 'learn-review'. O runtime continua lendo a definição original em inglês em '.claude/skills/learn-review/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Aprendizagem Revisão no domínio de aprendizagem. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'learn-stats': {
    title: 'Aprendizagem Estatísticas',
    description: 'Executa o fluxo de Aprendizagem Estatísticas no domínio de aprendizagem. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Aprendizagem Estatísticas

Overlay pt-BR frontend-only para a skill 'learn-stats'. O runtime continua lendo a definição original em inglês em '.claude/skills/learn-stats/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Aprendizagem Estatísticas no domínio de aprendizagem. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'legal-brief': {
    title: 'Jurídico Briefing',
    description: 'Executa o fluxo de Jurídico Briefing no domínio de jurídico. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Jurídico Briefing

Overlay pt-BR frontend-only para a skill 'legal-brief'. O runtime continua lendo a definição original em inglês em '.claude/skills/legal-brief/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Jurídico Briefing no domínio de jurídico. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'legal-compliance-check': {
    title: 'Jurídico Compliance Checagem',
    description: 'Executa o fluxo de Jurídico Compliance Checagem no domínio de jurídico. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Jurídico Compliance Checagem

Overlay pt-BR frontend-only para a skill 'legal-compliance-check'. O runtime continua lendo a definição original em inglês em '.claude/skills/legal-compliance-check/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Jurídico Compliance Checagem no domínio de jurídico. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'legal-meeting-briefing': {
    title: 'Jurídico Reunião Briefing',
    description: 'Executa o fluxo de Jurídico Reunião Briefing no domínio de jurídico. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Jurídico Reunião Briefing

Overlay pt-BR frontend-only para a skill 'legal-meeting-briefing'. O runtime continua lendo a definição original em inglês em '.claude/skills/legal-meeting-briefing/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Jurídico Reunião Briefing no domínio de jurídico. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'legal-response': {
    title: 'Jurídico Resposta',
    description: 'Executa o fluxo de Jurídico Resposta no domínio de jurídico. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Jurídico Resposta

Overlay pt-BR frontend-only para a skill 'legal-response'. O runtime continua lendo a definição original em inglês em '.claude/skills/legal-response/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Jurídico Resposta no domínio de jurídico. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'legal-review-contract': {
    title: 'Jurídico Revisão Contrato',
    description: 'Executa o fluxo de Jurídico Revisão Contrato no domínio de jurídico. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Jurídico Revisão Contrato

Overlay pt-BR frontend-only para a skill 'legal-review-contract'. O runtime continua lendo a definição original em inglês em '.claude/skills/legal-review-contract/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Jurídico Revisão Contrato no domínio de jurídico. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'legal-risk-assessment': {
    title: 'Jurídico Risco Avaliação',
    description: 'Executa o fluxo de Jurídico Risco Avaliação no domínio de jurídico. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Jurídico Risco Avaliação

Overlay pt-BR frontend-only para a skill 'legal-risk-assessment'. O runtime continua lendo a definição original em inglês em '.claude/skills/legal-risk-assessment/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Jurídico Risco Avaliação no domínio de jurídico. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'legal-signature-request': {
    title: 'Jurídico Assinatura Solicitação',
    description: 'Executa o fluxo de Jurídico Assinatura Solicitação no domínio de jurídico. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Jurídico Assinatura Solicitação

Overlay pt-BR frontend-only para a skill 'legal-signature-request'. O runtime continua lendo a definição original em inglês em '.claude/skills/legal-signature-request/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Jurídico Assinatura Solicitação no domínio de jurídico. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'legal-triage-nda': {
    title: 'Jurídico Triagem NDA',
    description: 'Executa o fluxo de Jurídico Triagem NDA no domínio de jurídico. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Jurídico Triagem NDA

Overlay pt-BR frontend-only para a skill 'legal-triage-nda'. O runtime continua lendo a definição original em inglês em '.claude/skills/legal-triage-nda/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Jurídico Triagem NDA no domínio de jurídico. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'legal-vendor-check': {
    title: 'Jurídico Fornecedor Checagem',
    description: 'Executa o fluxo de Jurídico Fornecedor Checagem no domínio de jurídico. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Jurídico Fornecedor Checagem

Overlay pt-BR frontend-only para a skill 'legal-vendor-check'. O runtime continua lendo a definição original em inglês em '.claude/skills/legal-vendor-check/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Jurídico Fornecedor Checagem no domínio de jurídico. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'manage-heartbeats': {
    title: 'Gerenciar Heartbeats',
    description: 'Executa o fluxo de Gerenciar Heartbeats no domínio de rotinas. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Gerenciar Heartbeats

Overlay pt-BR frontend-only para a skill 'manage-heartbeats'. O runtime continua lendo a definição original em inglês em '.claude/skills/manage-heartbeats/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Gerenciar Heartbeats no domínio de rotinas. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'mkt-autoresearch': {
    title: 'Marketing Pesquisa Automática',
    description: 'Executa o fluxo de Marketing Pesquisa Automática no domínio de marketing. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Marketing Pesquisa Automática

Overlay pt-BR frontend-only para a skill 'mkt-autoresearch'. O runtime continua lendo a definição original em inglês em '.claude/skills/mkt-autoresearch/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Marketing Pesquisa Automática no domínio de marketing. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'mkt-brand-review': {
    title: 'Marketing Marca Revisão',
    description: 'Executa o fluxo de Marketing Marca Revisão no domínio de marketing. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Marketing Marca Revisão

Overlay pt-BR frontend-only para a skill 'mkt-brand-review'. O runtime continua lendo a definição original em inglês em '.claude/skills/mkt-brand-review/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Marketing Marca Revisão no domínio de marketing. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'mkt-campaign-plan': {
    title: 'Marketing Campanha Planejar',
    description: 'Executa o fluxo de Marketing Campanha Planejar no domínio de marketing. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Marketing Campanha Planejar

Overlay pt-BR frontend-only para a skill 'mkt-campaign-plan'. O runtime continua lendo a definição original em inglês em '.claude/skills/mkt-campaign-plan/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Marketing Campanha Planejar no domínio de marketing. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'mkt-competitive-brief': {
    title: 'Marketing Competitivo Briefing',
    description: 'Executa o fluxo de Marketing Competitivo Briefing no domínio de marketing. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Marketing Competitivo Briefing

Overlay pt-BR frontend-only para a skill 'mkt-competitive-brief'. O runtime continua lendo a definição original em inglês em '.claude/skills/mkt-competitive-brief/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Marketing Competitivo Briefing no domínio de marketing. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'mkt-content-creation': {
    title: 'Marketing Conteúdo Criação',
    description: 'Executa o fluxo de Marketing Conteúdo Criação no domínio de marketing. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Marketing Conteúdo Criação

Overlay pt-BR frontend-only para a skill 'mkt-content-creation'. O runtime continua lendo a definição original em inglês em '.claude/skills/mkt-content-creation/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Marketing Conteúdo Criação no domínio de marketing. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'mkt-draft-content': {
    title: 'Marketing Rascunhar Conteúdo',
    description: 'Executa o fluxo de Marketing Rascunhar Conteúdo no domínio de marketing. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Marketing Rascunhar Conteúdo

Overlay pt-BR frontend-only para a skill 'mkt-draft-content'. O runtime continua lendo a definição original em inglês em '.claude/skills/mkt-draft-content/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Marketing Rascunhar Conteúdo no domínio de marketing. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'mkt-email-sequence': {
    title: 'Marketing Email Sequence',
    description: 'Executa o fluxo de Marketing Email Sequence no domínio de marketing. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Marketing Email Sequence

Overlay pt-BR frontend-only para a skill 'mkt-email-sequence'. O runtime continua lendo a definição original em inglês em '.claude/skills/mkt-email-sequence/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Marketing Email Sequence no domínio de marketing. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'mkt-experiment': {
    title: 'Marketing Experimento',
    description: 'Executa o fluxo de Marketing Experimento no domínio de marketing. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Marketing Experimento

Overlay pt-BR frontend-only para a skill 'mkt-experiment'. O runtime continua lendo a definição original em inglês em '.claude/skills/mkt-experiment/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Marketing Experimento no domínio de marketing. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'mkt-performance-report': {
    title: 'Marketing Performance Relatório',
    description: 'Executa o fluxo de Marketing Performance Relatório no domínio de marketing. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Marketing Performance Relatório

Overlay pt-BR frontend-only para a skill 'mkt-performance-report'. O runtime continua lendo a definição original em inglês em '.claude/skills/mkt-performance-report/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Marketing Performance Relatório no domínio de marketing. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'mkt-quality-gate': {
    title: 'Marketing Qualidade Gate',
    description: 'Executa o fluxo de Marketing Qualidade Gate no domínio de marketing. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Marketing Qualidade Gate

Overlay pt-BR frontend-only para a skill 'mkt-quality-gate'. O runtime continua lendo a definição original em inglês em '.claude/skills/mkt-quality-gate/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Marketing Qualidade Gate no domínio de marketing. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'mkt-seo-audit': {
    title: 'Marketing SEO Auditoria',
    description: 'Executa o fluxo de Marketing SEO Auditoria no domínio de marketing. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Marketing SEO Auditoria

Overlay pt-BR frontend-only para a skill 'mkt-seo-audit'. O runtime continua lendo a definição original em inglês em '.claude/skills/mkt-seo-audit/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Marketing SEO Auditoria no domínio de marketing. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'mkt-seo-ops': {
    title: 'Marketing SEO Operações',
    description: 'Executa o fluxo de Marketing SEO Operações no domínio de marketing. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Marketing SEO Operações

Overlay pt-BR frontend-only para a skill 'mkt-seo-ops'. O runtime continua lendo a definição original em inglês em '.claude/skills/mkt-seo-ops/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Marketing SEO Operações no domínio de marketing. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'obs-defuddle': {
    title: 'Obsidian Defuddle',
    description: 'Executa o fluxo de Obsidian Defuddle no domínio de Obsidian. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Obsidian Defuddle

Overlay pt-BR frontend-only para a skill 'obs-defuddle'. O runtime continua lendo a definição original em inglês em '.claude/skills/obs-defuddle/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Obsidian Defuddle no domínio de Obsidian. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'obs-json-canvas': {
    title: 'Obsidian JSON Canvas',
    description: 'Executa o fluxo de Obsidian JSON Canvas no domínio de Obsidian. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Obsidian JSON Canvas

Overlay pt-BR frontend-only para a skill 'obs-json-canvas'. O runtime continua lendo a definição original em inglês em '.claude/skills/obs-json-canvas/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Obsidian JSON Canvas no domínio de Obsidian. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'obs-obsidian-bases': {
    title: 'Obsidian Obsidian Bases',
    description: 'Executa o fluxo de Obsidian Obsidian Bases no domínio de Obsidian. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Obsidian Obsidian Bases

Overlay pt-BR frontend-only para a skill 'obs-obsidian-bases'. O runtime continua lendo a definição original em inglês em '.claude/skills/obs-obsidian-bases/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Obsidian Obsidian Bases no domínio de Obsidian. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'obs-obsidian-cli': {
    title: 'Obsidian Obsidian CLI',
    description: 'Executa o fluxo de Obsidian Obsidian CLI no domínio de Obsidian. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Obsidian Obsidian CLI

Overlay pt-BR frontend-only para a skill 'obs-obsidian-cli'. O runtime continua lendo a definição original em inglês em '.claude/skills/obs-obsidian-cli/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Obsidian Obsidian CLI no domínio de Obsidian. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'obs-obsidian-markdown': {
    title: 'Obsidian Obsidian Markdown',
    description: 'Executa o fluxo de Obsidian Obsidian Markdown no domínio de Obsidian. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Obsidian Obsidian Markdown

Overlay pt-BR frontend-only para a skill 'obs-obsidian-markdown'. O runtime continua lendo a definição original em inglês em '.claude/skills/obs-obsidian-markdown/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Obsidian Obsidian Markdown no domínio de Obsidian. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'ops-capacity-plan': {
    title: 'Operações Capacidade Planejar',
    description: 'Executa o fluxo de Operações Capacidade Planejar no domínio de operações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Operações Capacidade Planejar

Overlay pt-BR frontend-only para a skill 'ops-capacity-plan'. O runtime continua lendo a definição original em inglês em '.claude/skills/ops-capacity-plan/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Operações Capacidade Planejar no domínio de operações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'ops-change-request': {
    title: 'Operações Mudança Solicitação',
    description: 'Executa o fluxo de Operações Mudança Solicitação no domínio de operações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Operações Mudança Solicitação

Overlay pt-BR frontend-only para a skill 'ops-change-request'. O runtime continua lendo a definição original em inglês em '.claude/skills/ops-change-request/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Operações Mudança Solicitação no domínio de operações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'ops-compliance-tracking': {
    title: 'Operações Compliance Tracking',
    description: 'Executa o fluxo de Operações Compliance Tracking no domínio de operações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Operações Compliance Tracking

Overlay pt-BR frontend-only para a skill 'ops-compliance-tracking'. O runtime continua lendo a definição original em inglês em '.claude/skills/ops-compliance-tracking/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Operações Compliance Tracking no domínio de operações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'ops-process-doc': {
    title: 'Operações Processo Documento',
    description: 'Executa o fluxo de Operações Processo Documento no domínio de operações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Operações Processo Documento

Overlay pt-BR frontend-only para a skill 'ops-process-doc'. O runtime continua lendo a definição original em inglês em '.claude/skills/ops-process-doc/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Operações Processo Documento no domínio de operações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'ops-process-optimization': {
    title: 'Operações Processo Otimização',
    description: 'Executa o fluxo de Operações Processo Otimização no domínio de operações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Operações Processo Otimização

Overlay pt-BR frontend-only para a skill 'ops-process-optimization'. O runtime continua lendo a definição original em inglês em '.claude/skills/ops-process-optimization/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Operações Processo Otimização no domínio de operações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'ops-risk-assessment': {
    title: 'Operações Risco Avaliação',
    description: 'Executa o fluxo de Operações Risco Avaliação no domínio de operações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Operações Risco Avaliação

Overlay pt-BR frontend-only para a skill 'ops-risk-assessment'. O runtime continua lendo a definição original em inglês em '.claude/skills/ops-risk-assessment/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Operações Risco Avaliação no domínio de operações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'ops-runbook': {
    title: 'Operações Runbook',
    description: 'Executa o fluxo de Operações Runbook no domínio de operações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Operações Runbook

Overlay pt-BR frontend-only para a skill 'ops-runbook'. O runtime continua lendo a definição original em inglês em '.claude/skills/ops-runbook/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Operações Runbook no domínio de operações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'ops-status-report': {
    title: 'Operações Status Relatório',
    description: 'Executa o fluxo de Operações Status Relatório no domínio de operações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Operações Status Relatório

Overlay pt-BR frontend-only para a skill 'ops-status-report'. O runtime continua lendo a definição original em inglês em '.claude/skills/ops-status-report/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Operações Status Relatório no domínio de operações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'ops-vendor-review': {
    title: 'Operações Fornecedor Revisão',
    description: 'Executa o fluxo de Operações Fornecedor Revisão no domínio de operações. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Operações Fornecedor Revisão

Overlay pt-BR frontend-only para a skill 'ops-vendor-review'. O runtime continua lendo a definição original em inglês em '.claude/skills/ops-vendor-review/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Operações Fornecedor Revisão no domínio de operações. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'plugin-health': {
    title: 'Plugin Saúde',
    description: 'Executa o fluxo de Plugin Saúde no domínio de plugins. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Plugin Saúde

Overlay pt-BR frontend-only para a skill 'plugin-health'. O runtime continua lendo a definição original em inglês em '.claude/skills/plugin-health/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Plugin Saúde no domínio de plugins. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'plugin-install': {
    title: 'Plugin Instalar',
    description: 'Executa o fluxo de Plugin Instalar no domínio de plugins. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Plugin Instalar

Overlay pt-BR frontend-only para a skill 'plugin-install'. O runtime continua lendo a definição original em inglês em '.claude/skills/plugin-install/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Plugin Instalar no domínio de plugins. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'plugin-list': {
    title: 'Plugin Listar',
    description: 'Executa o fluxo de Plugin Listar no domínio de plugins. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Plugin Listar

Overlay pt-BR frontend-only para a skill 'plugin-list'. O runtime continua lendo a definição original em inglês em '.claude/skills/plugin-list/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Plugin Listar no domínio de plugins. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'plugin-marketplace': {
    title: 'Plugin Marketplace',
    description: 'Executa o fluxo de Plugin Marketplace no domínio de plugins. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Plugin Marketplace

Overlay pt-BR frontend-only para a skill 'plugin-marketplace'. O runtime continua lendo a definição original em inglês em '.claude/skills/plugin-marketplace/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Plugin Marketplace no domínio de plugins. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'plugin-security-scan': {
    title: 'Plugin Segurança Scan',
    description: 'Executa o fluxo de Plugin Segurança Scan no domínio de plugins. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Plugin Segurança Scan

Overlay pt-BR frontend-only para a skill 'plugin-security-scan'. O runtime continua lendo a definição original em inglês em '.claude/skills/plugin-security-scan/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Plugin Segurança Scan no domínio de plugins. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'plugin-uninstall': {
    title: 'Plugin Desinstalar',
    description: 'Executa o fluxo de Plugin Desinstalar no domínio de plugins. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Plugin Desinstalar

Overlay pt-BR frontend-only para a skill 'plugin-uninstall'. O runtime continua lendo a definição original em inglês em '.claude/skills/plugin-uninstall/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Plugin Desinstalar no domínio de plugins. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'plugin-update': {
    title: 'Plugin Atualizar',
    description: 'Executa o fluxo de Plugin Atualizar no domínio de plugins. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Plugin Atualizar

Overlay pt-BR frontend-only para a skill 'plugin-update'. O runtime continua lendo a definição original em inglês em '.claude/skills/plugin-update/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Plugin Atualizar no domínio de plugins. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'pm-metrics-review': {
    title: 'Produto Métricas Revisão',
    description: 'Executa o fluxo de Produto Métricas Revisão no domínio de produto. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Produto Métricas Revisão

Overlay pt-BR frontend-only para a skill 'pm-metrics-review'. O runtime continua lendo a definição original em inglês em '.claude/skills/pm-metrics-review/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Produto Métricas Revisão no domínio de produto. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'pm-product-brainstorming': {
    title: 'Produto Produto Brainstorming',
    description: 'Executa o fluxo de Produto Produto Brainstorming no domínio de produto. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Produto Produto Brainstorming

Overlay pt-BR frontend-only para a skill 'pm-product-brainstorming'. O runtime continua lendo a definição original em inglês em '.claude/skills/pm-product-brainstorming/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Produto Produto Brainstorming no domínio de produto. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'pm-roadmap-update': {
    title: 'Produto Roadmap Atualizar',
    description: 'Executa o fluxo de Produto Roadmap Atualizar no domínio de produto. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Produto Roadmap Atualizar

Overlay pt-BR frontend-only para a skill 'pm-roadmap-update'. O runtime continua lendo a definição original em inglês em '.claude/skills/pm-roadmap-update/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Produto Roadmap Atualizar no domínio de produto. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'pm-stakeholder-update': {
    title: 'Produto Stakeholder Atualizar',
    description: 'Executa o fluxo de Produto Stakeholder Atualizar no domínio de produto. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Produto Stakeholder Atualizar

Overlay pt-BR frontend-only para a skill 'pm-stakeholder-update'. O runtime continua lendo a definição original em inglês em '.claude/skills/pm-stakeholder-update/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Produto Stakeholder Atualizar no domínio de produto. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'pm-synthesize-research': {
    title: 'Produto Sintetizar Pesquisa',
    description: 'Executa o fluxo de Produto Sintetizar Pesquisa no domínio de produto. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Produto Sintetizar Pesquisa

Overlay pt-BR frontend-only para a skill 'pm-synthesize-research'. O runtime continua lendo a definição original em inglês em '.claude/skills/pm-synthesize-research/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Produto Sintetizar Pesquisa no domínio de produto. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'pm-write-spec': {
    title: 'Produto Escrever Spec',
    description: 'Executa o fluxo de Produto Escrever Spec no domínio de produto. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Produto Escrever Spec

Overlay pt-BR frontend-only para a skill 'pm-write-spec'. O runtime continua lendo a definição original em inglês em '.claude/skills/pm-write-spec/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Produto Escrever Spec no domínio de produto. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'prod-activation-plan': {
    title: 'Produtividade Ativação Planejar',
    description: 'Executa o fluxo de Produtividade Ativação Planejar no domínio de produtividade. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Produtividade Ativação Planejar

Overlay pt-BR frontend-only para a skill 'prod-activation-plan'. O runtime continua lendo a definição original em inglês em '.claude/skills/prod-activation-plan/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Produtividade Ativação Planejar no domínio de produtividade. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'prod-dashboard': {
    title: 'Produtividade Dashboard',
    description: 'Executa o fluxo de Produtividade Dashboard no domínio de produtividade. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Produtividade Dashboard

Overlay pt-BR frontend-only para a skill 'prod-dashboard'. O runtime continua lendo a definição original em inglês em '.claude/skills/prod-dashboard/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Produtividade Dashboard no domínio de produtividade. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'prod-end-of-day': {
    title: 'Produtividade Fim de Dia',
    description: 'Executa o fluxo de Produtividade Fim de Dia no domínio de produtividade. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Produtividade Fim de Dia

Overlay pt-BR frontend-only para a skill 'prod-end-of-day'. O runtime continua lendo a definição original em inglês em '.claude/skills/prod-end-of-day/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Produtividade Fim de Dia no domínio de produtividade. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'prod-good-morning': {
    title: 'Produtividade Bom Dia',
    description: 'Executa o fluxo de Produtividade Bom Dia no domínio de produtividade. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Produtividade Bom Dia

Overlay pt-BR frontend-only para a skill 'prod-good-morning'. O runtime continua lendo a definição original em inglês em '.claude/skills/prod-good-morning/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Produtividade Bom Dia no domínio de produtividade. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'prod-memory-management': {
    title: 'Produtividade Memória Gestão',
    description: 'Executa o fluxo de Produtividade Memória Gestão no domínio de produtividade. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Produtividade Memória Gestão

Overlay pt-BR frontend-only para a skill 'prod-memory-management'. O runtime continua lendo a definição original em inglês em '.claude/skills/prod-memory-management/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Produtividade Memória Gestão no domínio de produtividade. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'prod-review-todoist': {
    title: 'Produtividade Revisão Todoist',
    description: 'Executa o fluxo de Produtividade Revisão Todoist no domínio de produtividade. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Produtividade Revisão Todoist

Overlay pt-BR frontend-only para a skill 'prod-review-todoist'. O runtime continua lendo a definição original em inglês em '.claude/skills/prod-review-todoist/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Produtividade Revisão Todoist no domínio de produtividade. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'prod-trends': {
    title: 'Produtividade Tendências',
    description: 'Executa o fluxo de Produtividade Tendências no domínio de produtividade. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Produtividade Tendências

Overlay pt-BR frontend-only para a skill 'prod-trends'. O runtime continua lendo a definição original em inglês em '.claude/skills/prod-trends/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Produtividade Tendências no domínio de produtividade. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'pulse-daily': {
    title: 'Pulse Diário',
    description: 'Executa o fluxo de Pulse Diário no domínio de comunidade. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Pulse Diário

Overlay pt-BR frontend-only para a skill 'pulse-daily'. O runtime continua lendo a definição original em inglês em '.claude/skills/pulse-daily/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Pulse Diário no domínio de comunidade. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'pulse-faq-sync': {
    title: 'Pulse FAQ Sincronizar',
    description: 'Executa o fluxo de Pulse FAQ Sincronizar no domínio de comunidade. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Pulse FAQ Sincronizar

Overlay pt-BR frontend-only para a skill 'pulse-faq-sync'. O runtime continua lendo a definição original em inglês em '.claude/skills/pulse-faq-sync/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Pulse FAQ Sincronizar no domínio de comunidade. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'pulse-monthly': {
    title: 'Pulse Mensal',
    description: 'Executa o fluxo de Pulse Mensal no domínio de comunidade. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Pulse Mensal

Overlay pt-BR frontend-only para a skill 'pulse-monthly'. O runtime continua lendo a definição original em inglês em '.claude/skills/pulse-monthly/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Pulse Mensal no domínio de comunidade. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'pulse-weekly': {
    title: 'Pulse Semanal',
    description: 'Executa o fluxo de Pulse Semanal no domínio de comunidade. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Pulse Semanal

Overlay pt-BR frontend-only para a skill 'pulse-weekly'. O runtime continua lendo a definição original em inglês em '.claude/skills/pulse-weekly/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Pulse Semanal no domínio de comunidade. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'sage-competitive-analysis': {
    title: 'Estratégia Competitivo Análise',
    description: 'Executa o fluxo de Estratégia Competitivo Análise no domínio de estratégia. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Estratégia Competitivo Análise

Overlay pt-BR frontend-only para a skill 'sage-competitive-analysis'. O runtime continua lendo a definição original em inglês em '.claude/skills/sage-competitive-analysis/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Estratégia Competitivo Análise no domínio de estratégia. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'sage-okr-review': {
    title: 'Estratégia OKR Revisão',
    description: 'Executa o fluxo de Estratégia OKR Revisão no domínio de estratégia. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Estratégia OKR Revisão

Overlay pt-BR frontend-only para a skill 'sage-okr-review'. O runtime continua lendo a definição original em inglês em '.claude/skills/sage-okr-review/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Estratégia OKR Revisão no domínio de estratégia. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'sage-strategy-digest': {
    title: 'Estratégia Estratégia Digest',
    description: 'Executa o fluxo de Estratégia Estratégia Digest no domínio de estratégia. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Estratégia Estratégia Digest

Overlay pt-BR frontend-only para a skill 'sage-strategy-digest'. O runtime continua lendo a definição original em inglês em '.claude/skills/sage-strategy-digest/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Estratégia Estratégia Digest no domínio de estratégia. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'salve': {
    title: 'Salve',
    description: 'Executa o fluxo de Salve no domínio de atendimento. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Salve

Overlay pt-BR frontend-only para a skill 'salve'. O runtime continua lendo a definição original em inglês em '.claude/skills/salve/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Salve no domínio de atendimento. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'schedule-task': {
    title: 'Agendar Tarefa',
    description: 'Executa o fluxo de Agendar Tarefa no domínio de agenda. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Agendar Tarefa

Overlay pt-BR frontend-only para a skill 'schedule-task'. O runtime continua lendo a definição original em inglês em '.claude/skills/schedule-task/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Agendar Tarefa no domínio de agenda. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-analytics-report': {
    title: 'Social Media Analytics Relatório',
    description: 'Executa o fluxo de Social Media Analytics Relatório no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media Analytics Relatório

Overlay pt-BR frontend-only para a skill 'social-analytics-report'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-analytics-report/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media Analytics Relatório no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-audience-growth-tracker': {
    title: 'Social Media Audiência Crescimento Tracker',
    description: 'Executa o fluxo de Social Media Audiência Crescimento Tracker no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media Audiência Crescimento Tracker

Overlay pt-BR frontend-only para a skill 'social-audience-growth-tracker'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-audience-growth-tracker/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media Audiência Crescimento Tracker no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-carousel-writer': {
    title: 'Social Media Carrossel Writer',
    description: 'Executa o fluxo de Social Media Carrossel Writer no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media Carrossel Writer

Overlay pt-BR frontend-only para a skill 'social-carousel-writer'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-carousel-writer/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media Carrossel Writer no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-content-calendar': {
    title: 'Social Media Conteúdo Calendar',
    description: 'Executa o fluxo de Social Media Conteúdo Calendar no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media Conteúdo Calendar

Overlay pt-BR frontend-only para a skill 'social-content-calendar'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-content-calendar/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media Conteúdo Calendar no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-content-pattern-analyzer': {
    title: 'Social Media Conteúdo Padrão Analyzer',
    description: 'Executa o fluxo de Social Media Conteúdo Padrão Analyzer no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media Conteúdo Padrão Analyzer

Overlay pt-BR frontend-only para a skill 'social-content-pattern-analyzer'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-content-pattern-analyzer/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media Conteúdo Padrão Analyzer no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-content-repurposer': {
    title: 'Social Media Conteúdo Reaproveitamento',
    description: 'Executa o fluxo de Social Media Conteúdo Reaproveitamento no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media Conteúdo Reaproveitamento

Overlay pt-BR frontend-only para a skill 'social-content-repurposer'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-content-repurposer/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media Conteúdo Reaproveitamento no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-content-strategy': {
    title: 'Social Media Conteúdo Estratégia',
    description: 'Executa o fluxo de Social Media Conteúdo Estratégia no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media Conteúdo Estratégia

Overlay pt-BR frontend-only para a skill 'social-content-strategy'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-content-strategy/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media Conteúdo Estratégia no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-context': {
    title: 'Social Media Contexto',
    description: 'Executa o fluxo de Social Media Contexto no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media Contexto

Overlay pt-BR frontend-only para a skill 'social-context'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-context/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media Contexto no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-hook-writer': {
    title: 'Social Media Hook Writer',
    description: 'Executa o fluxo de Social Media Hook Writer no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media Hook Writer

Overlay pt-BR frontend-only para a skill 'social-hook-writer'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-hook-writer/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media Hook Writer no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-instagram-report': {
    title: 'Social Media Instagram Relatório',
    description: 'Executa o fluxo de Social Media Instagram Relatório no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media Instagram Relatório

Overlay pt-BR frontend-only para a skill 'social-instagram-report'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-instagram-report/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media Instagram Relatório no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-linkedin-report': {
    title: 'Social Media LinkedIn Relatório',
    description: 'Executa o fluxo de Social Media LinkedIn Relatório no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media LinkedIn Relatório

Overlay pt-BR frontend-only para a skill 'social-linkedin-report'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-linkedin-report/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media LinkedIn Relatório no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-optimization-advisor': {
    title: 'Social Media Otimização Advisor',
    description: 'Executa o fluxo de Social Media Otimização Advisor no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media Otimização Advisor

Overlay pt-BR frontend-only para a skill 'social-optimization-advisor'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-optimization-advisor/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media Otimização Advisor no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-performance-analyzer': {
    title: 'Social Media Performance Analyzer',
    description: 'Executa o fluxo de Social Media Performance Analyzer no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media Performance Analyzer

Overlay pt-BR frontend-only para a skill 'social-performance-analyzer'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-performance-analyzer/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media Performance Analyzer no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-platform-strategy': {
    title: 'Social Media Plataforma Estratégia',
    description: 'Executa o fluxo de Social Media Plataforma Estratégia no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media Plataforma Estratégia

Overlay pt-BR frontend-only para a skill 'social-platform-strategy'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-platform-strategy/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media Plataforma Estratégia no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-post-writer': {
    title: 'Social Media Post Writer',
    description: 'Executa o fluxo de Social Media Post Writer no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media Post Writer

Overlay pt-BR frontend-only para a skill 'social-post-writer'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-post-writer/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media Post Writer no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-thread-writer': {
    title: 'Social Media Thread Writer',
    description: 'Executa o fluxo de Social Media Thread Writer no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media Thread Writer

Overlay pt-BR frontend-only para a skill 'social-thread-writer'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-thread-writer/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media Thread Writer no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-x-longform': {
    title: 'Social Media X Longform',
    description: 'Executa o fluxo de Social Media X Longform no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media X Longform

Overlay pt-BR frontend-only para a skill 'social-x-longform'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-x-longform/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media X Longform no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-youtube-report': {
    title: 'Social Media YouTube Relatório',
    description: 'Executa o fluxo de Social Media YouTube Relatório no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media YouTube Relatório

Overlay pt-BR frontend-only para a skill 'social-youtube-report'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-youtube-report/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media YouTube Relatório no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'social-yt-competitive': {
    title: 'Social Media YouTube Competitivo',
    description: 'Executa o fluxo de Social Media YouTube Competitivo no domínio de social media. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Social Media YouTube Competitivo

Overlay pt-BR frontend-only para a skill 'social-yt-competitive'. O runtime continua lendo a definição original em inglês em '.claude/skills/social-yt-competitive/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Social Media YouTube Competitivo no domínio de social media. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'trigger-registry': {
    title: 'Gatilho Registro',
    description: 'Executa o fluxo de Gatilho Registro no domínio de gatilhos. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Gatilho Registro

Overlay pt-BR frontend-only para a skill 'trigger-registry'. O runtime continua lendo a definição original em inglês em '.claude/skills/trigger-registry/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Gatilho Registro no domínio de gatilhos. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
  'workspace-share': {
    title: 'Workspace Compartilhar',
    description: 'Executa o fluxo de Workspace Compartilhar no domínio de workspace. Use esta skill quando o usuário precisar desse trabalho na UI, mantendo comandos, arquivos e integrações técnicas preservados no runtime.',
    body: `# Workspace Compartilhar

Overlay pt-BR frontend-only para a skill 'workspace-share'. O runtime continua lendo a definição original em inglês em '.claude/skills/workspace-share/SKILL.md'.

## Quando usar

Use esta skill quando o usuário precisar de Workspace Compartilhar no domínio de workspace. A UI mostra este texto em português, mas comandos, arquivos, integrações e comportamento interno continuam preservados no runtime original.

## Fluxo

1. Entenda o objetivo do usuário e o contexto mínimo necessário.
2. Identifique entradas, fontes, arquivos, integrações ou sistemas envolvidos.
3. Execute o fluxo de trabalho da skill mantendo nomes técnicos literais.
4. Entregue resultado claro, acionável e verificável.
5. Registre próximos passos, riscos ou validações quando aplicável.

## Preservar literalmente

- comandos CLI, flags e argumentos
- paths e nomes de arquivos
- JSON, YAML, XML e blocos de código
- variáveis de ambiente e secrets redigidos
- URLs, nomes de APIs, modelos e provedores
- OpenRouter, Claude, Anthropic, OpenAI, Codex, Gemini, GPT, Flux, Seedream, Riverflow, Google AI Studio e Cloudflare AI Gateway BYOK

## Observação de arquitetura

Este conteúdo existe apenas para exibição no frontend. Não edite a skill original, frontmatter, routing, providers, backend ou system prompts para localizar a UI.`,
  },
}

for (const [skillId, overlay] of Object.entries(AUTO_SKILL_PT_BR_OVERLAYS)) {
  SKILL_PT_BR_OVERLAYS[skillId] = {
    ...overlay,
    ...SKILL_PT_BR_OVERLAYS[skillId],
    body: SKILL_PT_BR_OVERLAYS[skillId]?.body ?? overlay.body,
  }
}

/**
 * Returns the pt-BR title overlay for a skill, or undefined if not available.
 */
export function getSkillTitlePtBR(skillId: string): string | undefined {
  return SKILL_PT_BR_OVERLAYS[skillId]?.title
}

/**
 * Returns the pt-BR description overlay for a skill, or undefined if not available.
 */
export function getSkillDescriptionPtBR(skillId: string): string | undefined {
  return SKILL_PT_BR_OVERLAYS[skillId]?.description
}

/**
 * Returns the pt-BR body (full markdown) overlay for a skill, or undefined if not available.
 * UI should fall back to the original English SKILL.md body when undefined.
 */
export function getSkillBodyPtBR(skillId: string): string | undefined {
  return SKILL_PT_BR_OVERLAYS[skillId]?.body
}
