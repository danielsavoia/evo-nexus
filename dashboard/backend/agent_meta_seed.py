"""Static seed of native agent metadata for the /api/agent-meta endpoint.

Mirrors dashboard/frontend/src/lib/agent-meta.ts (the 38 native agents).
Only label and avatar_url are needed server-side — the frontend retains its
own icon/color/command seed for pre-hydration rendering.

Wave 2.0: this seed is merged with plugin agent entries at request time.
Plugin agents contribute avatar_url = /plugins/{slug}/ui/{path}.
"""
from __future__ import annotations

from typing import Dict, Optional

# Each entry: {label: str, avatar_url: str | None}
# avatar_url follows /clever-agent/avatars/avatar_{slug}.webp on the frontend.
NATIVE_AGENT_SEED: Dict[str, Dict[str, Optional[str]]] = {
    "atlas-project": {
        "label": "Projetos",
        "avatar_url": "/clever-agent/avatars/avatar_atlas.webp",
    },
    "clawdia-assistant": {
        "label": "Operações",
        "avatar_url": "/clever-agent/avatars/avatar_clawdia.webp",
    },
    "flux-finance": {
        "label": "Financeiro",
        "avatar_url": "/clever-agent/avatars/avatar_flux.webp",
    },
    "kai-personal-assistant": {
        "label": "Pessoal",
        "avatar_url": "/clever-agent/avatars/avatar_kai.webp",
    },
    "mentor-courses": {
        "label": "Cursos",
        "avatar_url": "/clever-agent/avatars/avatar_mentor.webp",
    },
    "lumen-learning": {
        "label": "Retenção de Aprendizado",
        "avatar_url": "/clever-agent/avatars/avatar_lumen.webp",
    },
    "nex-sales": {
        "label": "Vendas",
        "avatar_url": "/clever-agent/avatars/avatar_nex.webp",
    },
    "pixel-social-media": {
        "label": "Social Media",
        "avatar_url": "/clever-agent/avatars/avatar_pixel.webp",
    },
    "pulse-community": {
        "label": "Comunidade",
        "avatar_url": "/clever-agent/avatars/avatar_pulse.webp",
    },
    "sage-strategy": {
        "label": "Estratégia",
        "avatar_url": "/clever-agent/avatars/avatar_sage.webp",
    },
    "oracle": {
        "label": "Conhecimento",
        "avatar_url": "/clever-agent/avatars/avatar_oracle.webp",
    },
    "mako-marketing": {
        "label": "Marketing",
        "avatar_url": "/clever-agent/avatars/avatar_mako.webp",
    },
    "aria-hr": {
        "label": "RH / Pessoas",
        "avatar_url": "/clever-agent/avatars/avatar_aria.webp",
    },
    "zara-cs": {
        "label": "Sucesso do Cliente",
        "avatar_url": "/clever-agent/avatars/avatar_zara.webp",
    },
    "lex-legal": {
        "label": "Jurídico",
        "avatar_url": "/clever-agent/avatars/avatar_lex.webp",
    },
    "nova-product": {
        "label": "Produto",
        "avatar_url": "/clever-agent/avatars/avatar_nova.webp",
    },
    "dex-data": {
        "label": "Dados / BI",
        "avatar_url": "/clever-agent/avatars/avatar_dex.webp",
    },
    "helm-conductor": {
        "label": "Orq. de Ciclos",
        "avatar_url": "/clever-agent/avatars/avatar_helm.webp",
    },
    "mirror-retro": {
        "label": "Retrospectiva",
        "avatar_url": "/clever-agent/avatars/avatar_mirror.webp",
    },
    "apex-architect": {
        "label": "Arquiteto",
        "avatar_url": "/clever-agent/avatars/avatar_apex.webp",
    },
    "bolt-executor": {
        "label": "Executor",
        "avatar_url": "/clever-agent/avatars/avatar_bolt.webp",
    },
    "canvas-designer": {
        "label": "Designer",
        "avatar_url": "/clever-agent/avatars/avatar_canvas.webp",
    },
    "compass-planner": {
        "label": "Planejador",
        "avatar_url": "/clever-agent/avatars/avatar_compass.webp",
    },
    "echo-analyst": {
        "label": "Analista",
        "avatar_url": "/clever-agent/avatars/avatar_echo.webp",
    },
    "flow-git": {
        "label": "Git Master",
        "avatar_url": "/clever-agent/avatars/avatar_flow.webp",
    },
    "grid-tester": {
        "label": "Eng. de Testes",
        "avatar_url": "/clever-agent/avatars/avatar_grid.webp",
    },
    "hawk-debugger": {
        "label": "Debugger",
        "avatar_url": "/clever-agent/avatars/avatar_hawk.webp",
    },
    "lens-reviewer": {
        "label": "Revisor de Código",
        "avatar_url": "/clever-agent/avatars/avatar_lens.webp",
    },
    "oath-verifier": {
        "label": "Verificador",
        "avatar_url": "/clever-agent/avatars/avatar_oath.webp",
    },
    "prism-scientist": {
        "label": "Cientista",
        "avatar_url": "/clever-agent/avatars/avatar_prism.webp",
    },
    "probe-qa": {
        "label": "Testador QA",
        "avatar_url": "/clever-agent/avatars/avatar_probe.webp",
    },
    "quill-writer": {
        "label": "Redator",
        "avatar_url": "/clever-agent/avatars/avatar_quill.webp",
    },
    "raven-critic": {
        "label": "Crítico",
        "avatar_url": "/clever-agent/avatars/avatar_raven.webp",
    },
    "scout-explorer": {
        "label": "Explorador",
        "avatar_url": "/clever-agent/avatars/avatar_scout.webp",
    },
    "scroll-docs": {
        "label": "Especialista em Docs",
        "avatar_url": "/clever-agent/avatars/avatar_scroll.webp",
    },
    "trail-tracer": {
        "label": "Rastreador",
        "avatar_url": "/clever-agent/avatars/avatar_trail.webp",
    },
    "vault-security": {
        "label": "Revisor de Segurança",
        "avatar_url": "/clever-agent/avatars/avatar_vault.webp",
    },
    "zen-simplifier": {
        "label": "Simplificador",
        "avatar_url": "/clever-agent/avatars/avatar_zen.webp",
    },
}

