import {
  Bot,
  Brain,
  FolderKanban,
  DollarSign,
  Heart,
  GraduationCap,
  Target,
  Camera,
  Users,
  Compass,
  BookOpen,
  Megaphone,
  UserCheck,
  Headphones,
  Scale,
  Lightbulb,
  BarChart3,
  Navigation,
  History,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export interface AgentMeta {
  icon: LucideIcon
  color: string
  command: string
  label: string
  avatar?: string
  // Wave 2.0: plugin agents may declare an avatar_url served by the backend
  avatar_url?: string | null
}

// ---------------------------------------------------------------------------
// Static seed — 38 native agents (pre-hydration fallback, covers 100% of
// natives before the first fetch completes). Contract: getAgentMeta() is
// always synchronous.
// ---------------------------------------------------------------------------
const AGENT_META_SEED: Record<string, AgentMeta> = {
  'atlas-project': { icon: FolderKanban, color: '#60A5FA', command: '/atlas-project', label: 'Projects', avatar: '/clever-agent/avatars/avatar_atlas.svg' },
  'clawdia-assistant': { icon: Brain, color: '#22D3EE', command: '/clawdia', label: 'Operations', avatar: '/clever-agent/avatars/avatar_clawdia.svg' },
  'flux-finance': { icon: DollarSign, color: '#34D399', command: '/flux', label: 'Finance', avatar: '/clever-agent/avatars/avatar_flux.svg' },
  'kai-personal-assistant': { icon: Heart, color: '#F472B6', command: '/kai', label: 'Personal', avatar: '/clever-agent/avatars/avatar_kai.svg' },
  'mentor-courses': { icon: GraduationCap, color: '#FBBF24', command: '/mentor', label: 'Courses', avatar: '/clever-agent/avatars/avatar_mentor.svg' },
  'lumen-learning': { icon: Zap, color: '#FCD34D', command: '/lumen-learning', label: 'Learning Retention', avatar: '/clever-agent/avatars/avatar_lumen.svg' },
  'nex-sales': { icon: Target, color: '#FB923C', command: '/nex', label: 'Sales', avatar: '/clever-agent/avatars/avatar_nex.svg' },
  'pixel-social-media': { icon: Camera, color: '#A78BFA', command: '/pixel', label: 'Social Media', avatar: '/clever-agent/avatars/avatar_pixel.svg' },
  'pulse-community': { icon: Users, color: '#2DD4BF', command: '/pulse', label: 'Community', avatar: '/clever-agent/avatars/avatar_pulse.svg' },
  'sage-strategy': { icon: Compass, color: '#818CF8', command: '/sage', label: 'Strategy', avatar: '/clever-agent/avatars/avatar_sage.svg' },
  oracle: { icon: BookOpen, color: '#F59E0B', command: '/oracle', label: 'Knowledge', avatar: '/clever-agent/avatars/avatar_oracle.svg' },
  'mako-marketing': { icon: Megaphone, color: '#FB923C', command: '/mako', label: 'Marketing', avatar: '/clever-agent/avatars/avatar_mako.svg' },
  'aria-hr': { icon: UserCheck, color: '#F472B6', command: '/aria', label: 'HR / People', avatar: '/clever-agent/avatars/avatar_aria.svg' },
  'zara-cs': { icon: Headphones, color: '#22D3EE', command: '/zara', label: 'Customer Success', avatar: '/clever-agent/avatars/avatar_zara.svg' },
  'lex-legal': { icon: Scale, color: '#C084FC', command: '/lex', label: 'Legal', avatar: '/clever-agent/avatars/avatar_lex.svg' },
  'nova-product': { icon: Lightbulb, color: '#60A5FA', command: '/nova', label: 'Product', avatar: '/clever-agent/avatars/avatar_nova.svg' },
  'dex-data': { icon: BarChart3, color: '#FBBF24', command: '/dex', label: 'Data / BI', avatar: '/clever-agent/avatars/avatar_dex.svg' },
  'helm-conductor': { icon: Navigation, color: '#14B8A6', command: '/helm-conductor', label: 'Cycle Orchestration', avatar: '/clever-agent/avatars/avatar_helm.svg' },
  'mirror-retro': { icon: History, color: '#94A3B8', command: '/mirror-retro', label: 'Retrospective', avatar: '/clever-agent/avatars/avatar_mirror.svg' },
  'apex-architect': { icon: Bot, color: '#A78BFA', command: '/apex-architect', label: 'Architect', avatar: '/clever-agent/avatars/avatar_apex.svg' },
  'bolt-executor': { icon: Bot, color: '#FCD34D', command: '/bolt-executor', label: 'Executor', avatar: '/clever-agent/avatars/avatar_bolt.svg' },
  'canvas-designer': { icon: Bot, color: '#F472B6', command: '/canvas-designer', label: 'Designer', avatar: '/clever-agent/avatars/avatar_canvas.svg' },
  'compass-planner': { icon: Bot, color: '#60A5FA', command: '/compass-planner', label: 'Planner', avatar: '/clever-agent/avatars/avatar_compass.svg' },
  'echo-analyst': { icon: Bot, color: '#22D3EE', command: '/echo-analyst', label: 'Analyst', avatar: '/clever-agent/avatars/avatar_echo.svg' },
  'flow-git': { icon: Bot, color: '#34D399', command: '/flow-git', label: 'Git Master', avatar: '/clever-agent/avatars/avatar_flow.svg' },
  'grid-tester': { icon: Bot, color: '#FBBF24', command: '/grid-tester', label: 'Test Engineer', avatar: '/clever-agent/avatars/avatar_grid.svg' },
  'hawk-debugger': { icon: Bot, color: '#FB923C', command: '/hawk-debugger', label: 'Debugger', avatar: '/clever-agent/avatars/avatar_hawk.svg' },
  'lens-reviewer': { icon: Bot, color: '#C084FC', command: '/lens-reviewer', label: 'Code Reviewer', avatar: '/clever-agent/avatars/avatar_lens.svg' },
  'oath-verifier': { icon: Bot, color: '#2DD4BF', command: '/oath-verifier', label: 'Verifier', avatar: '/clever-agent/avatars/avatar_oath.svg' },
  'prism-scientist': { icon: Bot, color: '#818CF8', command: '/prism-scientist', label: 'Scientist', avatar: '/clever-agent/avatars/avatar_prism.svg' },
  'probe-qa': { icon: Bot, color: '#F59E0B', command: '/probe-qa', label: 'QA Tester', avatar: '/clever-agent/avatars/avatar_probe.svg' },
  'quill-writer': { icon: Bot, color: '#94A3B8', command: '/quill-writer', label: 'Writer', avatar: '/clever-agent/avatars/avatar_quill.svg' },
  'raven-critic': { icon: Bot, color: '#F87171', command: '/raven-critic', label: 'Critic', avatar: '/clever-agent/avatars/avatar_raven.svg' },
  'scout-explorer': { icon: Bot, color: '#22D3EE', command: '/scout-explorer', label: 'Explorer', avatar: '/clever-agent/avatars/avatar_scout.svg' },
  'scroll-docs': { icon: Bot, color: '#FCD34D', command: '/scroll-docs', label: 'Document Specialist', avatar: '/clever-agent/avatars/avatar_scroll.svg' },
  'trail-tracer': { icon: Bot, color: '#34D399', command: '/trail-tracer', label: 'Tracer', avatar: '/clever-agent/avatars/avatar_trail.svg' },
  'vault-security': { icon: Bot, color: '#F87171', command: '/vault-security', label: 'Security Reviewer', avatar: '/clever-agent/avatars/avatar_vault.svg' },
  'zen-simplifier': { icon: Bot, color: '#A78BFA', command: '/zen-simplifier', label: 'Code Simplifier', avatar: '/clever-agent/avatars/avatar_zen.svg' },
}

// ---------------------------------------------------------------------------
// Wave 2.0: runtime registry — starts as a copy of the seed; hydrated once
// per session via hydrateAgentMeta(). Merge is additive: seed entries for
// native agents are never removed.
// ---------------------------------------------------------------------------

// Module-level mutable registry (not exported — callers use getAgentMeta).
let _registry: Record<string, AgentMeta> = { ...AGENT_META_SEED }
let _hydrated = false

const DEFAULT_META: AgentMeta = {
  icon: Bot,
  color: '#00FFA7',
  command: '',
  label: 'Agent',
}

/**
 * Fetch /api/agent-meta and merge plugin agents into the local registry.
 *
 * - Idempotent: second call is a no-op unless `force` is true.
 * - Never destroys the seed: native agent entries are kept even on fetch error.
 * - Plugin agents gain `avatar_url` from the backend response.
 */
export async function hydrateAgentMeta(force = false): Promise<void> {
  if (_hydrated && !force) return
  try {
    const API = import.meta.env.DEV ? 'http://localhost:8080' : ''
    const res = await fetch(`${API}/api/agent-meta`, { credentials: 'include' })
    if (!res.ok) return  // silently keep seed on non-2xx
    const data: Record<string, { label: string; avatar_url: string | null }> = await res.json()
    for (const [slug, entry] of Object.entries(data)) {
      const existing = _registry[slug]
      if (existing) {
        // Native agent: update avatar_url (and avatar for AgentAvatar.tsx compat) if backend provides one
        _registry[slug] = {
          ...existing,
          avatar_url: entry.avatar_url ?? existing.avatar_url,
          avatar: entry.avatar_url ?? existing.avatar,
        }
      } else {
        // Plugin agent: synthesize a new entry with defaults for icon/color/command.
        // Set both avatar_url (Wave 2.0 field) and avatar (AgentAvatar.tsx reads this).
        _registry[slug] = {
          icon: Bot,
          color: '#00FFA7',
          command: `/${slug}`,
          label: entry.label || slug,
          avatar_url: entry.avatar_url,
          avatar: entry.avatar_url ?? undefined,
        }
      }
    }
    _hydrated = true
  } catch {
    // Network error — keep seed, don't set _hydrated so next call retries
  }
}

/**
 * Synchronous agent meta lookup.
 *
 * Returns the seed entry (or hydrated entry) for native agents.
 * Returns a synthesized entry for plugin agents after hydration.
 * Falls back to DEFAULT_META for unknown slugs.
 *
 * Contract: always synchronous. Callers in hot render paths (AgentAvatar,
 * AgentChat) are unaffected.
 */
export function getAgentMeta(name: string): AgentMeta {
  const base = _registry[name] || DEFAULT_META
  return { ...base, command: _registry[name]?.command || `/${name}` }
}

