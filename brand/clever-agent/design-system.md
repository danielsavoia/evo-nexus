# Clever Agent - Design System

## Visao geral da marca
Clever Agent e um produto separado dentro da familia Clever, construido sobre o Evo Nexus white-label. A identidade visual segue a familia da Clever AI com o mesmo sistema cromatico e linguagem minimalista, premium e tecnologica.

## Relacao com Clever AI
- Mesma familia visual e paleta base.
- Marca propria com simbolo e wordmark "Clever Agent".
- Deve coexistir sem descaracterizar a assinatura visual da Clever.

## Conceito visual
- Estrutura conectada em forma hexagonal para representar orquestracao.
- Balao central com dois olhos para representar agente conversacional.
- Nos de rede para reforcar conectividade e inteligencia distribuida.

## Paleta oficial
- `#19402A` verde profundo (Clever)
- `#255938` verde secundario estrutural
- `#41A650` verde principal (Agent)
- `#85F2A0` verde claro de destaque
- `#F2CB05` amarelo de acento
- `#F7F9F8` fundo claro neutro

Uso sugerido:
- "Clever" -> `#19402A`
- "Agent" -> `#41A650`
- Estrutura secundaria -> `#255938`
- Destaque claro -> `#85F2A0`
- No/acento -> `#F2CB05`
- Fundo claro -> `#F7F9F8`

## Tokens CSS
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

## Construcao do logo
Arquivos mestre em SVG vetorial:
- `logo-horizontal.svg`
- `logo-horizontal-light.svg`
- `logo-horizontal-dark.svg`

Composicao horizontal:
- Simbolo a esquerda
- Wordmark "Clever Agent" a direita
- Espacamento fixo para manter equilibrio visual

## Icone isolado
Arquivos:
- `icon.svg`
- `icon-light.svg` / `icon-white.svg`
- `icon-dark.svg` / `icon-green.svg`

Estrutura obrigatoria do simbolo:
- Frame conectado tipo hexagono
- Balao central com dois olhos
- No superior verde claro
- No inferior esquerdo escuro
- No inferior direito amarelo

## Wordmark
- Objetivo: aparencia visual fiel ao aprovado.
- Fonte usada no SVG: familia geometrica de alto peso (`Poppins` com fallbacks).
- Conversao para paths: recomendada para lock final de producao se for necessario congelar forma tipografica sem dependencia de fonte instalada.

## Versoes light/dark
- `light`: otimizada para fundo branco e `#F7F9F8`.
- `dark`: ajuste de contraste com texto claro e simbolo preservado.
- Sem alteracao de geometria entre variacoes.

## Margem de respiro
- Margem minima recomendada: 0.5x do diametro do no superior ao redor do logo.
- Nunca encostar o simbolo ou wordmark em bordas de cards ou header.

## Tamanho minimo
- Logo horizontal: minimo `160px` de largura.
- Icone isolado: minimo `24px`.
- Favicon: `16px` a `32px` usando `favicon.svg`.
- App icon: base de exportacao `512x512`.

## Usos corretos
- Manter proporcoes originais.
- Usar apenas paleta oficial.
- Escolher versao light/dark conforme contraste do fundo.

## Usos incorretos
- Alterar geometria do simbolo.
- Trocar tipografia por alternativa aleatoria.
- Mudar posicao dos nos.
- Aplicar efeitos de sombra/blur que descaracterizem.
- Distorcer horizontal ou verticalmente.

## Favicon
Arquivo: `favicon.svg`
- Versao reduzida com leitura em tamanhos pequenos.
- Estrutura principal preservada sem descaracterizacao.

## App icon
Arquivo: `app-icon.svg`
- Uso para avatar, tile, launcher e sidebar icon.
- Fundo rounded-square com contraste alto e simbolo central.

## Recomendacao de uso (dashboard/site/docs)
- Dashboard: logo horizontal no topo e icone na navegacao colapsada.
- Site: logo horizontal em header e rodape.
- Docs: icone em sidebar e logo horizontal na capa.

## Estrutura dos SVGs
Grupos nomeados padrao:
- `icon`
- `frame`
- `nodes`
- `bubble`
- `eyes`
- `wordmark`
- `text-clever`
- `text-agent`

Todos os arquivos sao vetoriais, com `viewBox`, sem raster embutido e prontos para web.

