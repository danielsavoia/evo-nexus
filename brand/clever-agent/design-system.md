# Clever Agent — Design System

## 1. Identidade da Marca

**Nome do produto:** Clever Agent  
**Família de marca:** Clever AI  
**Posicionamento:** Plataforma SaaS de orquestração de agentes de IA — premium, geométrica, tecnológica e profissional.

---

## 2. Relação com Clever AI

O Clever Agent é um produto da família **Clever AI**. Compartilha a mesma paleta de cores e direção visual, mas possui identidade própria:

| Atributo        | Clever AI            | Clever Agent                    |
|-----------------|----------------------|---------------------------------|
| Foco            | Plataforma geral IA  | Orquestração de agentes         |
| Símbolo         | Definido pela marca  | Hexágono + chat bubble + nós    |
| Cor primária    | Verde escuro #19402A | Verde escuro #19402A (mesma)    |
| Cor de destaque | —                    | Amarelo #F2CB05 (acento único)  |

---

## 3. Paleta Oficial

| Token                          | Hex       | Uso principal                          |
|-------------------------------|-----------|----------------------------------------|
| `--clever-agent-green-900`    | `#19402A` | Wordmark "Clever", fundos escuros      |
| `--clever-agent-green-800`    | `#255938` | Bubble do agente, nó inferior esquerdo |
| `--clever-agent-green-600`    | `#41A650` | Wordmark "Agent", linhas hex, bubble dark |
| `--clever-agent-green-300`    | `#85F2A0` | Nó superior (mint), olhos, linhas top  |
| `--clever-agent-yellow-500`   | `#F2CB05` | Nó inferior direito — acento único     |
| `--clever-agent-bg-light`     | `#F7F9F8` | Fundo claro neutro, variante light     |

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

## 4. Arquivos de Asset

| Arquivo                      | Uso                                              |
|-----------------------------|--------------------------------------------------|
| `icon.svg`                  | Símbolo isolado — fundo transparente, fundos claros |
| `icon-dark.svg`             | Símbolo isolado — fundos escuros                 |
| `icon-light.svg`            | Símbolo com fundo claro explícito (#F7F9F8)      |
| `logo-horizontal.svg`       | Logo padrão — ícone + wordmark, fundo transparente |
| `logo-horizontal-dark.svg`  | Logo para fundos escuros                         |
| `logo-horizontal-light.svg` | Logo com fundo claro explícito                   |
| `favicon.svg`               | Favicon otimizado para 16×16 e 32×32 px          |
| `app-icon.svg`              | Ícone de app — fundo escuro arredondado, 1:1      |

---

## 5. Uso do Logo

### Versão horizontal (padrão)
- Usar em cabeçalhos, landing pages, e-mails e apresentações.
- Ícone sempre à esquerda, wordmark à direita.
- Proporção fixa — nunca distorcer.

### Ícone isolado
- Usar como avatar de produto, favicon, sidebar colapsado e notificações.
- Mínimo recomendado: **24 × 24 px**.
- Abaixo de 24 px, usar o favicon.svg otimizado.

### Favicon
- Versão simplificada com fundo escuro arredondado.
- Otimizado para 16 × 16 e 32 × 32 px.
- Sem linhas hex (muito finas em tamanho pequeno) — reconhecível pelo bubble + olhos.

### App Icon
- Para PWA, iOS, Android e Electron.
- Exportar em **1024 × 1024 px** via SVG-to-PNG.
- Raio de borda: 22% (compatível com guideline iOS).

---

## 6. Espaçamento Mínimo (Clear Space)

Em torno do logo, manter uma área de respiro igual à **altura da letra "C"** do wordmark em todos os lados.

```
┌─────────────────────────────────┐
│         [clear space]           │
│   [clear]  LOGO  [clear]        │
│         [clear space]           │
└─────────────────────────────────┘
```

Para o ícone isolado, manter respiro mínimo equivalente ao **raio de 1 nó** (r=5.5 no viewBox 100×100).

---

## 7. Tamanhos Mínimos

| Contexto              | Mínimo             |
|-----------------------|--------------------|
| Logo horizontal       | 120 px de largura  |
| Ícone isolado         | 24 × 24 px         |
| Favicon               | 16 × 16 px         |
| App icon              | 57 × 57 px (iOS mín.) |

---

## 8. Variações Permitidas

- ✅ Logo padrão sobre fundo branco ou claro
- ✅ Logo dark sobre fundos #19402A, #255938 ou qualquer fundo escuro
- ✅ Ícone isolado (com ou sem fundo)
- ✅ App icon (fundo escuro arredondado obrigatório)
- ✅ Favicon simplificado
- ✅ Escala proporcional em qualquer tamanho acima dos mínimos

---

## 9. Usos Proibidos

- ❌ Alterar as cores da paleta oficial
- ❌ Distorcer ou rotacionar o logo/ícone
- ❌ Adicionar sombras, contornos ou efeitos não previstos
- ❌ Usar o logo sobre fundos que comprometam o contraste
- ❌ Substituir a tipografia do wordmark por outra família
- ❌ Remover o ponto amarelo (#F2CB05) — é o diferencial visual da marca
- ❌ Usar versão standard sobre fundo escuro (usar sempre a dark variant)
- ❌ Recortar, mascarar ou sobrepor outros elementos sobre o ícone

---

## 10. Aplicação em Fundo Claro

- Usar `logo-horizontal.svg` ou `icon.svg`
- Fundo: branco `#FFFFFF`, neutro `#F7F9F8` ou cinza claro
- Wordmark: "Clever" em `#19402A`, "Agent" em `#41A650`
- Linhas hex: gradiente mint → verde médio → verde escuro

---

## 11. Aplicação em Fundo Escuro

- Usar `logo-horizontal-dark.svg` ou `icon-dark.svg`
- Fundo: `#19402A`, `#255938`, preto ou qualquer surface escura
- Wordmark: "Clever" em `#F7F9F8` (off-white), "Agent" em `#85F2A0`
- Linhas hex: gradiente branco → mint → verde médio
- Bubble: `#41A650` (mais claro para contrastar com o fundo)

---

## 12. Ícone Isolado

O símbolo hexagonal deve aparecer sozinho quando:
- O nome "Clever Agent" já está presente no contexto
- O espaço disponível é limitado (sidebar, avatar, botão)
- Em notificações push e ícones de sistema

Sempre respeitar os tamanhos mínimos. Abaixo de 32 px, preferir o `favicon.svg`.

---

## 13. Favicon

- Arquivo: `favicon.svg`
- Design simplificado: fundo escuro arredondado + bubble bold + 2 olhos
- Sem linhas hex (muito finas em escala pequena)
- 3 nós de acento visíveis como pontos de cor
- Para máxima compatibilidade, exportar também como `favicon.ico` (16×16 + 32×32 multi-resolução)

---

## 14. App Icon

- Arquivo: `app-icon.svg`
- Background: gradiente escuro `#255938` → `#19402A`
- Ícone: versão clara (linhas brancas/mint, olhos brancos)
- Raio da borda: 22% (rx=22 no viewBox 100×100)
- Exportações necessárias para produção:
  - `1024×1024` PNG (iOS App Store, Google Play)
  - `512×512` PNG (PWA manifest)
  - `192×192` PNG (PWA splash)

---

## 15. Tipografia Recomendada

### Wordmark

| Fonte           | Peso  | Estilo  | Disponibilidade          |
|-----------------|-------|---------|--------------------------|
| **DM Sans**     | 600   | Normal  | Google Fonts (preferida) |
| **Inter**       | 600   | Normal  | Google Fonts (fallback)  |
| **Nunito**      | 600   | Normal  | Google Fonts (alternativa) |
| system-ui       | 600   | Normal  | Nativo (último recurso)  |

### Para produção (versão final dos SVGs)
Converter o texto do wordmark em paths usando DM Sans 600 para eliminar dependência de fonte no SVG final. O arquivo com texto editável é mantido como fonte de edição.

### Tipografia do produto (UI/dashboard)

```css
font-family: 'DM Sans', 'Inter', system-ui, -apple-system, sans-serif;
```

| Uso                  | Tamanho | Peso |
|----------------------|---------|------|
| Título principal     | 32–40px | 700  |
| Subtítulo / heading  | 20–28px | 600  |
| Corpo / UI           | 14–16px | 400  |
| Labels / captions    | 12px    | 500  |

---

## 16. Pontos de Integração no Projeto

Os assets estão prontos para integrar nos seguintes locais (aguardando autorização para substituir upstream):

```
public/clever-agent.svg              ← logo-horizontal.svg
public/clever-agent-icon.svg         ← icon.svg
dashboard/frontend/public/clever-agent.svg
dashboard/frontend/public/clever-agent-icon.svg
site/public/assets/clever-agent.svg
site/public/assets/clever-agent-icon.svg
```

**Atenção:** Não substituir `EVO_NEXUS.webp` nem remover atribuições do EvoNexus/Evolution Foundation sem decisão de licença formal.

---

## 17. Atribuição Legal (Upstream)

Até resolução formal de licença, manter atribuição discreta na UI:

```
Built on EvoNexus
```
ou
```
Powered by EvoNexus / Evolution Foundation
```

Posicionamento sugerido: rodapé do dashboard, página About, ou tooltip no logo.

---

## 18. Changelog

| Data       | Versão | Descrição                                      |
|------------|--------|------------------------------------------------|
| 2026-05-24 | 1.0.0  | Criação inicial — 8 assets SVG + design system |
