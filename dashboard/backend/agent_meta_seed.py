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
# avatar_url follows /clever-agent/avatars/avatar_{slug}.svg on the frontend.
NATIVE_AGENT_SEED: Dict[str, Dict[str, Optional[str]]] = {
    "atlas-project": {
        "label": "Projects",
        "avatar_url": "/clever-agent/avatars/avatar_atlas.svg",
    },
    "clawdia-assistant": {
        "label": "Operations",
        "avatar_url": "/clever-agent/avatars/avatar_clawdia.svg",
    },
    "flux-finance": {
        "label": "Finance",
        "avatar_url": "/clever-agent/avatars/avatar_flux.svg",
    },
    "kai-personal-assistant": {
        "label": "Personal",
        "avatar_url": "/clever-agent/avatars/avatar_kai.svg",
    },
    "mentor-courses": {
        "label": "Courses",
        "avatar_url": "/clever-agent/avatars/avatar_mentor.svg",
    },
    "lumen-learning": {
        "label": "Learning Retention",
        "avatar_url": "/clever-agent/avatars/avatar_lumen.svg",
    },
    "nex-sales": {
        "label": "Sales",
        "avatar_url": "/clever-agent/avatars/avatar_nex.svg",
    },
    "pixel-social-media": {
        "label": "Social Media",
        "avatar_url": "/clever-agent/avatars/avatar_pixel.svg",
    },
    "pulse-community": {
        "label": "Community",
        "avatar_url": "/clever-agent/avatars/avatar_pulse.svg",
    },
    "sage-strategy": {
        "label": "Strategy",
        "avatar_url": "/clever-agent/avatars/avatar_sage.svg",
    },
    "oracle": {
        "label": "Knowledge",
        "avatar_url": "/clever-agent/avatars/avatar_oracle.svg",
    },
    "mako-marketing": {
        "label": "Marketing",
        "avatar_url": "/clever-agent/avatars/avatar_mako.svg",
    },
    "aria-hr": {
        "label": "HR / People",
        "avatar_url": "/clever-agent/avatars/avatar_aria.svg",
    },
    "zara-cs": {
        "label": "Customer Success",
        "avatar_url": "/clever-agent/avatars/avatar_zara.svg",
    },
    "lex-legal": {
        "label": "Legal",
        "avatar_url": "/clever-agent/avatars/avatar_lex.svg",
    },
    "nova-product": {
        "label": "Product",
        "avatar_url": "/clever-agent/avatars/avatar_nova.svg",
    },
    "dex-data": {
        "label": "Data / BI",
        "avatar_url": "/clever-agent/avatars/avatar_dex.svg",
    },
    "helm-conductor": {
        "label": "Cycle Orchestration",
        "avatar_url": "/clever-agent/avatars/avatar_helm.svg",
    },
    "mirror-retro": {
        "label": "Retrospective",
        "avatar_url": "/clever-agent/avatars/avatar_mirror.svg",
    },
    "apex-architect": {
        "label": "Architect",
        "avatar_url": "/clever-agent/avatars/avatar_apex.svg",
    },
    "bolt-executor": {
        "label": "Executor",
        "avatar_url": "/clever-agent/avatars/avatar_bolt.svg",
    },
    "canvas-designer": {
        "label": "Designer",
        "avatar_url": "/clever-agent/avatars/avatar_canvas.svg",
    },
    "compass-planner": {
        "label": "Planner",
        "avatar_url": "/clever-agent/avatars/avatar_compass.svg",
    },
    "echo-analyst": {
        "label": "Analyst",
        "avatar_url": "/clever-agent/avatars/avatar_echo.svg",
    },
    "flow-git": {
        "label": "Git Master",
        "avatar_url": "/clever-agent/avatars/avatar_flow.svg",
    },
    "grid-tester": {
        "label": "Test Engineer",
        "avatar_url": "/clever-agent/avatars/avatar_grid.svg",
    },
    "hawk-debugger": {
        "label": "Debugger",
        "avatar_url": "/clever-agent/avatars/avatar_hawk.svg",
    },
    "lens-reviewer": {
        "label": "Code Reviewer",
        "avatar_url": "/clever-agent/avatars/avatar_lens.svg",
    },
    "oath-verifier": {
        "label": "Verifier",
        "avatar_url": "/clever-agent/avatars/avatar_oath.svg",
    },
    "prism-scientist": {
        "label": "Scientist",
        "avatar_url": "/clever-agent/avatars/avatar_prism.svg",
    },
    "probe-qa": {
        "label": "QA Tester",
        "avatar_url": "/clever-agent/avatars/avatar_probe.svg",
    },
    "quill-writer": {
        "label": "Writer",
        "avatar_url": "/clever-agent/avatars/avatar_quill.svg",
    },
    "raven-critic": {
        "label": "Critic",
        "avatar_url": "/clever-agent/avatars/avatar_raven.svg",
    },
    "scout-explorer": {
        "label": "Explorer",
        "avatar_url": "/clever-agent/avatars/avatar_scout.svg",
    },
    "scroll-docs": {
        "label": "Document Specialist",
        "avatar_url": "/clever-agent/avatars/avatar_scroll.svg",
    },
    "trail-tracer": {
        "label": "Tracer",
        "avatar_url": "/clever-agent/avatars/avatar_trail.svg",
    },
    "vault-security": {
        "label": "Security Reviewer",
        "avatar_url": "/clever-agent/avatars/avatar_vault.svg",
    },
    "zen-simplifier": {
        "label": "Code Simplifier",
        "avatar_url": "/clever-agent/avatars/avatar_zen.svg",
    },
}

