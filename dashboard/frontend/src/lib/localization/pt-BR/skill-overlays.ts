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
 * ✅ ai-image-creator  — full translation (title, description, body)
 * ✅ create-agent       — description only
 * ✅ create-goal        — description only
 * ✅ create-routine     — description only
 * ✅ create-ticket      — description only
 * 📋 remaining skills  — description only (body pending)
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
