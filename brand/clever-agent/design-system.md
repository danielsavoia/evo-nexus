# Clever Agent — Design System

Version 1.0 — 2026-05-23

---

## 1. Nome da marca

**Clever Agent**

Sempre escrito com letra maiúscula em "Clever" e "Agent". Nunca "clever agent", "CleverAgent" ou "CLEVER AGENT".

---

## 2. Relação com Clever AI

O Clever Agent é um produto separado dentro da família Clever. Compartilha a paleta de cores e os princípios de design do Clever AI, mas possui identidade visual própria com ícone e wordmark distintos.

- **Clever AI** → produto CRM/atendimento/canais
- **Clever Agent** → produto de orquestração de agentes de IA por cliente

Ambos fazem parte do ecossistema Clever e devem ter aparência de família, sem serem idênticos.

---

## 3. Paleta oficial

| Token                         | Hex       | Uso principal                                |
|-------------------------------|-----------|----------------------------------------------|
| `--clever-agent-green-900`    | `#19402A` | Fundo escuro, bubble de chat, texto principal |
| `--clever-agent-green-800`    | `#255938` | Fundo sidebar, bubble no dark mode           |
| `--clever-agent-green-600`    | `#41A650` | "Agent" no wordmark, bordas, ícones ativos   |
| `--clever-agent-green-300`    | `#85F2A0` | Destaque, olhos do agente, nó topo, texto dark mode |
| `--clever-agent-yellow-500`   | `#F2CB05` | Acento secundário, nó inferior direito       |
| `--clever-agent-bg-light`     | `#F7F9F8` | Fundo claro, cards neutros                   |

### Tokens CSS

```css
:root {
  --clever-agent-green-900: #19402A;
  --clever-agent-green-800: #255938;
  --clever-agent-green-600: #41A650;
  --clever-agent-green-300: #85F2A0;
  --clever-agent-yellow-500: #F2CB05;
  --clever-agent-bg-light: #F7F9F8;
}
```

---

## 4. Conceito visual do símbolo

O ícone comunica:

- **Agente de IA**: rosto simplificado de agente (dois olhos) dentro de um balão de conversa
- **Orquestração**: estrutura hexagonal geométrica com linhas de conexão entre nós
- **Rede/automação**: três nós com cores distintas — topo (mint), inferior-esquerdo (verde escuro), inferior-direito (amarelo)
- **Inteligência**: composição limpa, precisa, minimalista

### Anatomia do ícone

```
        ● (nó mint — topo)
       / \
      /   \
   ⬡---------⬡
   |           |
   |  ┌──────┐ |
   |  │ ● ●  │ |   ← balão de chat com "olhos" de agente
   |  └──┘   │ |
   |        ╲│ |   ← cauda do balão
   ⬡---------⬡
  ●             ●
(nó escuro)  (nó amarelo)
```

---

## 5. Arquivos disponíveis

| Arquivo                    | Uso                                                  |
|----------------------------|------------------------------------------------------|
| `icon.svg`                 | Ícone standalone, fundo transparente                 |
| `icon-dark.svg`            | Ícone com fundo escuro arredondado (#19402A)         |
| `icon-light.svg`           | Ícone com fundo claro arredondado (#F7F9F8)          |
| `favicon.svg`              | Versão simplificada para favicon (sem hexágono)      |
| `app-icon.svg`             | App icon com gradiente escuro, estilo iOS/Android    |
| `logo-horizontal.svg`      | Logo completa: ícone + wordmark, fundo transparente  |
| `logo-horizontal-dark.svg` | Logo completa em fundo escuro com gradiente          |
| `logo-horizontal-light.svg`| Logo completa em fundo claro (#F7F9F8)               |
| `preview.html`             | Página de preview de todos os assets                 |

---

## 6. Usos do logo

### Logo horizontal

Uso preferencial em:
- Header/topo de dashboard
- Landing page
- Materiais de marketing
- Emails

### Ícone isolado

Uso em:
- Sidebar recolhida (collapsed)
- Favicon
- App icon mobile/desktop
- Avatar de produto em integrações
- Thumbnail em listas de apps

### Wordmark sem ícone

Evitar. Preferir sempre a versão com ícone.

---

## 7. Espaçamento mínimo (clear space)

O logo deve ter ao redor um espaçamento mínimo igual à **altura do nó superior do ícone** (≈ 10% da altura total).

Para a versão standalone do ícone (100×100), o clear space mínimo é **10px** ao redor.

---

## 8. Tamanho mínimo

| Contexto     | Tamanho mínimo |
|--------------|----------------|
| Logo horizontal | 160px de largura |
| Ícone standalone | 32px            |
| Favicon         | 16px (usar `favicon.svg`) |
| App icon        | 48px            |

Abaixo de 32px, usar apenas `favicon.svg` (versão sem hexágono).

---

## 9. Variações permitidas

| Variação | Permitida |
|----------|-----------|
| Logo horizontal padrão (fundo transparente) | ✅ |
| Logo horizontal em fundo claro | ✅ |
| Logo horizontal em fundo escuro | ✅ |
| Ícone standalone transparente | ✅ |
| Ícone em fundo escuro | ✅ |
| Ícone em fundo claro | ✅ |
| App icon / favicon | ✅ |
| Versão monocromática (ex.: para impressão) | ✅ usar `#19402A` sólido |
| Versão negativa (branco sobre escuro) | ✅ com ajuste de cores |

---

## 10. Usos proibidos

- ❌ Distorcer proporções do ícone
- ❌ Rotacionar o logo
- ❌ Aplicar filtros, sombras ou efeitos não previstos
- ❌ Usar cores fora da paleta oficial
- ❌ Substituir a tipografia do wordmark por outra fonte
- ❌ Usar o ícone isolado como substituto completo do logo em contextos editoriais (sempre preferir a versão horizontal)
- ❌ Remover o nó amarelo do símbolo (é elemento de identidade)
- ❌ Usar o logo em fundos que comprometam o contraste mínimo

---

## 11. Aplicação em fundo claro

**Ícone:** `icon.svg` ou `icon-light.svg`  
**Logo:** `logo-horizontal.svg` ou `logo-horizontal-light.svg`

- Bubble do agente: `#19402A` (máximo contraste)
- Hexágono: gradiente mint → verde escuro
- Texto "Clever": `#19402A`
- Texto "Agent": `#41A650`

---

## 12. Aplicação em fundo escuro

**Ícone:** `icon-dark.svg`  
**Logo:** `logo-horizontal-dark.svg`

- Bubble do agente: `#255938` (ligeiramente mais claro que o fundo)
- Hexágono: gradiente mint → verde médio
- Olhos: `#85F2A0` (alto contraste sobre bubble escuro)
- Texto "Clever": `#F7F9F8` (quase branco)
- Texto "Agent": `#85F2A0` (mint)

---

## 13. Favicon

Usar `favicon.svg` — versão sem hexágono, com:
- Fundo círculo escuro `#19402A`
- Bubble grande mint `#85F2A0`
- Dois olhos escuros
- Nó amarelo como detalhe de canto

O hexágono é omitido no favicon porque desaparece em tamanhos pequenos (< 32px).

---

## 14. App icon

Usar `app-icon.svg` — versão com:
- Fundo rounded-square com gradiente escuro (`#255938` → `#19402A`)
- Hexágono com gradiente mint → verde médio
- Bubble mint (invertido em relação ao ícone padrão)
- Olhos escuros sobre bubble mint

Compatível com iOS App Store, Android, macOS, Windows.

---

## 15. Tipografia recomendada

| Uso | Família | Peso | Observação |
|-----|---------|------|-----------|
| Wordmark | Inter | 700 (Bold) | letter-spacing: -0.5px |
| Headings produto | Inter | 600–700 | — |
| Body | Inter | 400–500 | — |
| Código | JetBrains Mono | 400 | Terminais, blocos de código |

**Fallback chain:** `'Inter', 'Helvetica Neue', system-ui, -apple-system, sans-serif`

Inter disponível em: https://fonts.google.com/specimen/Inter

---

## 16. Considerações técnicas dos SVGs

- Todos os SVGs usam `viewBox` sem dimensões fixas — escaláveis livremente
- Gradientes usam `gradientUnits="objectBoundingBox"` para portabilidade
- Gradient IDs têm prefixo `ca-` para minimizar conflitos em inline SVG
- Fontes no wordmark são referenciadas por nome (não convertidas a paths) — converter para paths em ferramentas de design (Figma, Inkscape) para uso em produção fixo
- `fill="none"` no `<svg>` raiz previne preenchimento acidental
- Compatível com: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## 17. Relação com o upstream EvoNexus

O Clever Agent é um white-label baseado no upstream `evolution-foundation/evo-nexus`.

Enquanto a substituição completa do branding upstream não for finalizada:

- Manter atribuição discreta: **"Built on EvoNexus"** ou **"Powered by EvoNexus / Evolution Foundation"** em algum ponto da UI (sidebar, settings, ou about page)
- Não remover `© Evolution Foundation` do rodapé do dashboard até decisão/licença comercial
- Os assets Clever Agent são usados em pontos de entrada visíveis (login, onboarding, sidebar header)
- Os assets EvoNexus permanecem nos rodapés de atribuição por ora

Ver `docs/clever-agent/governance.md` para contexto completo.

---

## 18. Histórico de versões

| Versão | Data       | Descrição                        |
|--------|------------|----------------------------------|
| 1.0    | 2026-05-23 | Criação inicial — ícone, logos, design system |
