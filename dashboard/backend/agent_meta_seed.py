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
# avatar_url follows /clever-agent/avatars/avatar_{slug}.png on the frontend.
NATIVE_AGENT_SEED: Dict[str, Dict[str, Optional[str]]] = {
    "atlas-project": {
        "label": "Projects",
        "avatar_url": "/clever-agent/avatars/avatar_atlas.png",
    },
    "clawdia-assistant": {
        "label": "Operations",
        "avatar_url": "/clever-agent/avatars/avatar_clawdia.png",
    },
    "flux-finance": {
        "label": "Finance",
        "avatar_url": "/clever-agent/avatars/avatar_flux.png",
    },
    "kai-personal-assistant": {
        "label": "Personal",
        "avatar_url": "/clever-agent/avatars/avatar_kai.png",
    },
    "mentor-courses": {
        "label": "Courses",
        "avatar_url": "/clever-agent/avatars/avatar_mentor.png",
    },
    "lumen-learning": {
        "label": "Learning Retention",
        "avatar_url": "/clever-agent/avatars/avatar_lumen.png",
    },
    "nex-sales": {
        "label": "Sales",
        "avatar_url": "/clever-agent/avatars/avatar_nex.png",
    },
    "pixel-social-media": {
        "label": "Social Media",
        "avatar_url": "/clever-agent/avatars/avatar_pixel.png",
    },
    "pulse-community": {
        "label": "Community",
        "avatar_url": "/clever-agent/avatars/avatar_pulse.png",
    },
    "sage-strategy": {
        "label": "Strategy",
        "avatar_url": "/clever-agent/avatars/avatar_sage.png",
    },
    "oracle": {
        "label": "Knowledge",
        "avatar_url": "/clever-agent/avatars/avatar_oracle.png",
    },
    "mako-marketing": {
        "label": "Marketing",
        "avatar_url": "/clever-agent/avatars/avatar_mako.png",
    },
    "aria-hr": {
        "label": "HR / People",
        "avatar_url": "/clever-agent/avatars/avatar_aria.png",
    },
    "zara-cs": {
        "label": "Customer Success",
        "avatar_url": "/clever-agent/avatars/avatar_zara.png",
    },
    "lex-legal": {
        "label": "Legal",
        "avatar_url": "/clever-agent/avatars/avatar_lex.png",
    },
    "nova-product": {
        "label": "Product",
        "avatar_url": "/clever-agent/avatars/avatar_nova.png",
    },
    "dex-data": {
        "label": "Data / BI",
        "avatar_url": "/clever-agent/avatars/avatar_dex.png",
    },
    "helm-conductor": {
        "label": "Cycle Orchestration",
        "avatar_url": "/clever-agent/avatars/avatar_helm.png",
    },
    "mirror-retro": {
        "label": "Retrospective",
        "avatar_url": "/clever-agent/avatars/avatar_mirror.png",
    },
    "apex-architect": {
        "label": "Architect",
        "avatar_url": "/clever-agent/avatars/avatar_apex.png",
    },
    "bolt-executor": {
        "label": "Executor",
        "avatar_url": "/clever-agent/avatars/avatar_bolt.png",
    },
    "canvas-designer": {
        "label": "Designer",
        "avatar_url": "/clever-agent/avatars/avatar_canvas.png",
    },
    "compass-planner": {
        "label": "Planner",
        "avatar_url": "/clever-agent/avatars/avatar_compass.png",
    },
    "echo-analyst": {
        "label": "Analyst",
        "avatar_url": "/clever-agent/avatars/avatar_echo.png",
    },
    "flow-git": {
        "label": "Git Master",
        "avatar_url": "/clever-agent/avatars/avatar_flow.png",
    },
    "grid-tester": {
        "label": "Test Engineer",
        "avatar_url": "/clever-agent/avatars/avatar_grid.png",
    },
    "hawk-debugger": {
        "label": "Debugger",
        "avatar_url": "/clever-agent/avatars/avatar_hawk.png",
    },
    "lens-reviewer": {
        "label": "Code Reviewer",
        "avatar_url": "/clever-agent/avatars/avatar_lens.png",
    },
    "oath-verifier": {
        "label": "Verifier",
        "avatar_url": "/clever-agent/avatars/avatar_oath.png",
    },
    "prism-scientist": {
        "label": "Scientist",
        "avatar_url": "/clever-agent/avatars/avatar_prism.png",
    },
    "probe-qa": {
        "label": "QA Tester",
        "avatar_url": "/clever-agent/avatars/avatar_probe.png",
    },
    "quill-writer": {
        "label": "Writer",
        "avatar_url": "/clever-agent/avatars/avatar_quill.png",
    },
    "raven-critic": {
        "label": "Critic",
        "avatar_url": "/clever-agent/avatars/avatar_raven.png",
    },
    "scout-explorer": {
        "label": "Explorer",
        "avatar_url": "/clever-agent/avatars/avatar_scout.png",
    },
    "scroll-docs": {
        "label": "Document Specialist",
        "avatar_url": "/clever-agent/avatars/avatar_scroll.png",
    },
    "trail-tracer": {
        "label": "Tracer",
        "avatar_url": "/clever-agent/avatars/avatar_trail.png",
    },
    "vault-security": {
        "label": "Security Reviewer",
        "avatar_url": "/clever-agent/avatars/avatar_vault.png",
    },
    "zen-simplifier": {
        "label": "Code Simplifier",
        "avatar_url": "/clever-agent/avatars/avatar_zen.png",
    },
}

