# Clever Agent Avatar White-label

**Date:** 2026-05-24
**Branch:** `clever-dev`

---

## Decisão

Os avatars oficiais do Clever Agent são PNGs aprovados manualmente, localizados nos paths white-label do projeto. Eles substituem os avatars originais do upstream (WEBPs em `dashboard/frontend/public/avatar/`) na camada visual do Clever Agent.

---

## Paths

| Finalidade | Path |
|---|---|
| Source de verdade (brand) | `brand/clever-agent/avatars/` |
| Servido pelo frontend | `dashboard/frontend/public/clever-agent/avatars/` |

---

## Origem local dos assets aprovados

Os assets foram aprovados manualmente e originados de:

```
C:\Users\agenc\Downloads\Avatares
```

---

## Regra de governança

**Não sobrescrever** `dashboard/frontend/public/avatar/` — essa pasta pertence ao upstream (EvoNexus) e contém os WEBPs originais. Toda customização Clever Agent usa exclusivamente os paths `/clever-agent/avatars/`.

---

## Formato

- **Formato:** PNG
- **Quantidade:** 38 arquivos
- **Padrão de nome:** `avatar_{slug}.png`

---

## Mapeamento dos 38 avatars

| Arquivo | Agente |
|---|---|
| avatar_apex.png | apex-architect |
| avatar_aria.png | aria-hr |
| avatar_atlas.png | atlas-project |
| avatar_bolt.png | bolt-executor |
| avatar_canvas.png | canvas-designer |
| avatar_clawdia.png | clawdia-assistant |
| avatar_compass.png | compass-planner |
| avatar_dex.png | dex-data |
| avatar_echo.png | echo-analyst |
| avatar_flow.png | flow-git |
| avatar_flux.png | flux-finance |
| avatar_grid.png | grid-tester |
| avatar_hawk.png | hawk-debugger |
| avatar_helm.png | helm-conductor |
| avatar_kai.png | kai-personal-assistant |
| avatar_lens.png | lens-reviewer |
| avatar_lex.png | lex-legal |
| avatar_lumen.png | lumen-learning |
| avatar_mako.png | mako-marketing |
| avatar_mentor.png | mentor-courses |
| avatar_mirror.png | mirror-retro |
| avatar_nex.png | nex-sales |
| avatar_nova.png | nova-product |
| avatar_oath.png | oath-verifier |
| avatar_oracle.png | oracle |
| avatar_pixel.png | pixel-social-media |
| avatar_prism.png | prism-scientist |
| avatar_probe.png | probe-qa |
| avatar_pulse.png | pulse-community |
| avatar_quill.png | quill-writer |
| avatar_raven.png | raven-critic |
| avatar_sage.png | sage-strategy |
| avatar_scout.png | scout-explorer |
| avatar_scroll.png | scroll-docs |
| avatar_trail.png | trail-tracer |
| avatar_vault.png | vault-security |
| avatar_zara.png | zara-cs |
| avatar_zen.png | zen-simplifier |

---

## Arquivos de mapeamento atualizados

| Arquivo | Status |
|---|---|
| `dashboard/frontend/src/lib/agent-meta.ts` | Atualizado para `.png` |
| `dashboard/backend/agent_meta_seed.py` | Atualizado para `.png` |

---

## Observacao para novos agentes

Novos agentes devem receber avatars no mesmo padrao visual Clever Agent (PNG, estilo consistente com os 38 existentes). O asset deve ser adicionado primeiro em `brand/clever-agent/avatars/` e depois em `dashboard/frontend/public/clever-agent/avatars/`. O mapeamento deve ser atualizado em `agent-meta.ts` e `agent_meta_seed.py`.
