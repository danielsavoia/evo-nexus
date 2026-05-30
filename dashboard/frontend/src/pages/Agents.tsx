import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import OracleWelcomeBanner from '../components/OracleWelcomeBanner'
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
  Search,
  Building2,
  Code2,
  Sparkles,
  Navigation,
  History,
  Lock,
  type LucideIcon,
} from 'lucide-react'
import { api } from '../lib/api'
import { AgentAvatar } from '../components/AgentAvatar'

type Category = 'business' | 'engineering' | 'custom'
type EngTier = 'reasoning' | 'execution' | 'speed'

const BUSINESS_AGENTS = new Set([
  'clawdia-assistant',
  'flux-finance',
  'atlas-project',
  'kai-personal-assistant',
  'pulse-community',
  'sage-strategy',
  'pixel-social-media',
  'nex-sales',
  'mentor-courses',
  'oracle',
  'mako-marketing',
  'aria-hr',
  'zara-cs',
  'lex-legal',
  'nova-product',
  'dex-data',
])

const ENGINEERING_TIERS: Record<EngTier, Set<string>> = {
  reasoning: new Set([
    'apex-architect',
    'echo-analyst',
    'compass-planner',
    'raven-critic',
    'lens-reviewer',
    'zen-simplifier',
    'vault-security',
    'mirror-retro',
  ]),
  execution: new Set([
    'bolt-executor',
    'hawk-debugger',
    'grid-tester',
    'probe-qa',
    'oath-verifier',
    'trail-tracer',
    'flow-git',
    'scroll-docs',
    'canvas-designer',
    'prism-scientist',
    'helm-conductor',
  ]),
  speed: new Set(['scout-explorer', 'quill-writer']),
}

function getCategory(agent: Agent): Category {
  if (agent.custom || agent.name.startsWith('custom-')) return 'custom'
  if (BUSINESS_AGENTS.has(agent.name)) return 'business'
  return 'engineering'
}

function getEngineeringTier(name: string): EngTier | null {
  if (ENGINEERING_TIERS.reasoning.has(name)) return 'reasoning'
  if (ENGINEERING_TIERS.execution.has(name)) return 'execution'
  if (ENGINEERING_TIERS.speed.has(name)) return 'speed'
  return null
}

interface Agent {
  name: string
  description: string
  memory_count: number
  custom?: boolean
  color?: string
  model?: string
  locked?: boolean
}

interface AgentMeta {
  icon: LucideIcon
  color: string
  colorMuted: string
  glowColor: string
  command: string
  label: string
}

const AGENT_META: Record<string, AgentMeta> = {
  'atlas-project': {
    icon: FolderKanban,
    color: '#60A5FA',
    colorMuted: 'rgba(96,165,250,0.12)',
    glowColor: 'rgba(96,165,250,0.15)',
    command: '',
    label: 'Projetos',
  },
  'clawdia-assistant': {
    icon: Brain,
    color: '#22D3EE',
    colorMuted: 'rgba(34,211,238,0.12)',
    glowColor: 'rgba(34,211,238,0.15)',
    command: '/clawdia',
    label: 'Operações',
  },
  'flux-finance': {
    icon: DollarSign,
    color: '#34D399',
    colorMuted: 'rgba(52,211,153,0.12)',
    glowColor: 'rgba(52,211,153,0.15)',
    command: '/flux',
    label: 'Financeiro',
  },
  'kai-personal-assistant': {
    icon: Heart,
    color: '#F472B6',
    colorMuted: 'rgba(244,114,182,0.12)',
    glowColor: 'rgba(244,114,182,0.15)',
    command: '/kai',
    label: 'Pessoal',
  },
  'mentor-courses': {
    icon: GraduationCap,
    color: '#FBBF24',
    colorMuted: 'rgba(251,191,36,0.12)',
    glowColor: 'rgba(251,191,36,0.15)',
    command: '/mentor',
    label: 'Cursos',
  },
  'nex-sales': {
    icon: Target,
    color: '#FB923C',
    colorMuted: 'rgba(251,146,60,0.12)',
    glowColor: 'rgba(251,146,60,0.15)',
    command: '/nex',
    label: 'Vendas',
  },
  'pixel-social-media': {
    icon: Camera,
    color: '#A78BFA',
    colorMuted: 'rgba(167,139,250,0.12)',
    glowColor: 'rgba(167,139,250,0.15)',
    command: '/pixel',
    label: 'Social Media',
  },
  'pulse-community': {
    icon: Users,
    color: '#2DD4BF',
    colorMuted: 'rgba(45,212,191,0.12)',
    glowColor: 'rgba(45,212,191,0.15)',
    command: '/pulse',
    label: 'Comunidade',
  },
  'sage-strategy': {
    icon: Compass,
    color: '#818CF8',
    colorMuted: 'rgba(129,140,248,0.12)',
    glowColor: 'rgba(129,140,248,0.15)',
    command: '/sage',
    label: 'Estratégia',
  },
  'oracle': {
    icon: BookOpen,
    color: '#F59E0B',
    colorMuted: 'rgba(245,158,11,0.12)',
    glowColor: 'rgba(245,158,11,0.15)',
    command: '/oracle',
    label: 'Conhecimento',
  },
  'mako-marketing': {
    icon: Megaphone,
    color: '#FB923C',
    colorMuted: 'rgba(251,146,60,0.12)',
    glowColor: 'rgba(251,146,60,0.15)',
    command: '/mako',
    label: 'Marketing',
  },
  'aria-hr': {
    icon: UserCheck,
    color: '#F472B6',
    colorMuted: 'rgba(244,114,182,0.12)',
    glowColor: 'rgba(244,114,182,0.15)',
    command: '/aria',
    label: 'RH / Pessoas',
  },
  'zara-cs': {
    icon: Headphones,
    color: '#22D3EE',
    colorMuted: 'rgba(34,211,238,0.12)',
    glowColor: 'rgba(34,211,238,0.15)',
    command: '/zara',
    label: 'Sucesso do Cliente',
  },
  'lex-legal': {
    icon: Scale,
    color: '#C084FC',
    colorMuted: 'rgba(192,132,252,0.12)',
    glowColor: 'rgba(192,132,252,0.15)',
    command: '/lex',
    label: 'Jurídico',
  },
  'nova-product': {
    icon: Lightbulb,
    color: '#60A5FA',
    colorMuted: 'rgba(96,165,250,0.12)',
    glowColor: 'rgba(96,165,250,0.15)',
    command: '/nova',
    label: 'Produto',
  },
  'dex-data': {
    icon: BarChart3,
    color: '#FBBF24',
    colorMuted: 'rgba(251,191,36,0.12)',
    glowColor: 'rgba(251,191,36,0.15)',
    command: '/dex',
    label: 'Dados / BI',
  },
  'helm-conductor': {
    icon: Navigation,
    color: '#14B8A6',
    colorMuted: 'rgba(20,184,166,0.12)',
    glowColor: 'rgba(20,184,166,0.15)',
    command: '/helm-conductor',
    label: 'Orq. de Ciclos',
  },
  'mirror-retro': {
    icon: History,
    color: '#94A3B8',
    colorMuted: 'rgba(148,163,184,0.12)',
    glowColor: 'rgba(148,163,184,0.15)',
    command: '/mirror-retro',
    label: 'Retrospectiva',
  },
}

const DEFAULT_META: AgentMeta = {
  icon: Bot,
  color: '#85F2A0',
  colorMuted: 'rgba(133, 242, 160,0.12)',
  glowColor: 'rgba(133, 242, 160,0.15)',
  command: '',
  label: 'Agente',
}

function getMeta(name: string, agent?: Agent): AgentMeta {
  const command = `/${name}`
  if (AGENT_META[name]) return { ...AGENT_META[name], command }
  if (agent?.color) {
    const c = agent.color
    return {
      ...DEFAULT_META,
      color: c,
      colorMuted: `${c}1F`,
      glowColor: `${c}26`,
      command,
    }
  }
  return { ...DEFAULT_META, command }
}

function formatAgentName(name: string): string {
  return name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function AgentCard({ agent, isRunning }: { agent: Agent; isRunning: boolean }) {
  const meta = getMeta(agent.name, agent)
  const isActive = agent.memory_count > 0
  const tier = getEngineeringTier(agent.name)
  const locked = agent.locked === true

  if (locked) {
    return (
      <div
        className="group relative block rounded-xl border border-[#1E3829] bg-[#122018] p-3.5 opacity-50 grayscale cursor-not-allowed"
        title="Sem acesso"
      >
        {/* Lock overlay */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#07130D] border border-[#1E3829]">
          <Lock size={12} className="text-[#6B8A76]" />
        </div>

        {/* Top row: avatar + status */}
        <div className="relative flex items-start justify-between mb-3">
          <div>
            <AgentAvatar name={agent.name} size={56} />
          </div>
          <span className="inline-block h-2 w-2 rounded-full mt-7" style={{ backgroundColor: '#3D5445' }} />
        </div>

        {/* Name + domain label */}
        <div className="relative mb-1.5">
          <h3 className="text-[13px] font-semibold text-[#F7F9F8]">
            {formatAgentName(agent.name)}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-block text-[10px] font-medium uppercase tracking-wider" style={{ color: meta.color, opacity: 0.8 }}>
              {meta.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="relative mb-3 text-[11px] leading-relaxed text-[#6B8A76] line-clamp-2">
          {agent.description || 'Sem descrição disponível.'}
        </p>

        {/* Bottom row */}
        <div className="relative flex items-center justify-between">
          <span className="text-[10px] text-[#6B8A76]">Sem acesso</span>
          <div className="flex items-center gap-1 rounded-full bg-[#07130D] px-2 py-0.5 border border-[#1E3829]">
            <Brain size={10} className="text-[#6B8A76]" />
            <span className="text-[10px] font-medium text-[#C8D5CE]">{agent.memory_count}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Link
      to={`/agents/${agent.name}`}
      className="group relative block rounded-xl border border-[#1E3829] bg-[#122018] p-3.5 transition-all duration-300 hover:border-transparent"
      style={{
        ['--agent-color' as string]: meta.color,
        ['--agent-glow' as string]: meta.glowColor,
      }}
    >
      {/* Hover glow effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 0 1px ${meta.color}44, 0 0 20px ${meta.glowColor}`,
          borderRadius: 'inherit',
        }}
      />

      {/* Top row: avatar + status */}
      <div className="relative flex items-start justify-between mb-3">
        <div className="transition-transform duration-300 group-hover:scale-105">
          <AgentAvatar name={agent.name} size={56} />
        </div>

        {/* Status dot + running badge */}
        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="flex items-center gap-1 rounded-full bg-[#41A650]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#85F2A0] border border-[#41A650]/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#41A650] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#41A650]" />
              </span>
              Em execução
            </span>
          )}
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{
              backgroundColor: isActive ? '#41A650' : '#3D5445',
              boxShadow: isActive ? '0 0 6px rgba(65, 166, 80,0.5)' : 'none',
            }}
          />
        </div>
      </div>

      {/* Name + domain label */}
      <div className="relative mb-1.5">
        <h3 className="text-[13px] font-semibold text-[#F7F9F8] transition-colors duration-200 group-hover:text-white">
          {formatAgentName(agent.name)}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span
            className="inline-block text-[10px] font-medium uppercase tracking-wider"
            style={{ color: meta.color, opacity: 0.8 }}
          >
            {meta.label}
          </span>
          {agent.custom ? (
            <span className="rounded-full bg-[#6B7280]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#6B7280] border border-[#6B7280]/20">
              custom
            </span>
          ) : (
            <span className="rounded-full bg-[#41A650]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#85F2A0] border border-[#41A650]/20">
              core
            </span>
          )}
          {tier && (
            <span className="rounded-full bg-[#818CF8]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#818CF8] border border-[#818CF8]/20 uppercase tracking-wider">
              {tier === 'reasoning' ? 'opus' : tier === 'execution' ? 'sonnet' : 'haiku'}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="relative mb-3 text-[11px] leading-relaxed text-[#6B8A76] line-clamp-2">
        {agent.description || 'Sem descrição disponível.'}
      </p>

      {/* Bottom row: command badge + memory badge */}
      <div className="relative flex items-center justify-between">
        {meta.command ? (
          <code className="rounded-md bg-[#07130D] px-1.5 py-0.5 font-mono text-[10px] text-[#C8D5CE] border border-[#1E3829]">
            {meta.command}
          </code>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-1 rounded-full bg-[#07130D] px-2 py-0.5 border border-[#1E3829]">
          <Brain size={10} className="text-[#6B8A76]" />
          <span className="text-[10px] font-medium text-[#C8D5CE]">
            {agent.memory_count}
          </span>
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[#1E3829] bg-[#122018] p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="h-10 w-10 rounded-lg bg-[#1E3829] animate-pulse" />
        <div className="h-2 w-2 rounded-full bg-[#1E3829] animate-pulse" />
      </div>
      <div className="h-4 w-32 rounded bg-[#1E3829] animate-pulse mb-2" />
      <div className="h-3 w-16 rounded bg-[#1E3829] animate-pulse mb-3" />
      <div className="space-y-1.5 mb-4">
        <div className="h-3 w-full rounded bg-[#1E3829] animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-[#1E3829] animate-pulse" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-6 w-16 rounded-md bg-[#1E3829] animate-pulse" />
        <div className="h-6 w-12 rounded-full bg-[#1E3829] animate-pulse" />
      </div>
    </div>
  )
}

function OracleHeroCard({ agent, isRunning }: { agent: Agent; isRunning: boolean }) {
  if (agent.locked) {
    return (
      <div
        className="group relative block overflow-hidden rounded-2xl border border-[#1E3829] bg-[#0D1B12] opacity-50 grayscale cursor-not-allowed"
        title="Sem acesso"
      >
        <div className="relative flex items-center gap-5 px-6 py-5">
          <AgentAvatar name={agent.name} size={56} />
          <div className="flex-1 min-w-0">
            <h2 className="text-[22px] font-bold text-[#F9FAFB] leading-tight mb-0.5">Oracle</h2>
            <p className="text-[12.5px] text-[#C8D5CE] leading-snug">Sem acesso</p>
          </div>
          <Lock size={16} className="flex-shrink-0 text-[#6B8A76]" />
        </div>
      </div>
    )
  }

  return (
    <Link
      to={`/agents/${agent.name}`}
      className="group relative block overflow-hidden rounded-2xl border border-[#F2CB05]/22 bg-[#0D1B12] transition-all duration-300 hover:border-[#F2CB05]/45"
      style={{
        boxShadow: '0 0 28px rgba(242,203,5,0.05), inset 0 1px 0 rgba(242,203,5,0.07)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-35"
        style={{ background: 'radial-gradient(circle, rgba(242,203,5,0.28), transparent 65%)' }}
      />

      <div className="relative flex items-center gap-5 px-6 py-5">
        {/* Avatar */}
        <div className="transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 0 10px rgba(242,203,5,0.22))' }}>
          <AgentAvatar name={agent.name} size={56} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-full bg-[#F2CB05]/12 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#F2CB05] border border-[#F2CB05]/28">
              Comece Aqui
            </span>
            {isRunning && (
              <span className="flex items-center gap-1 rounded-full bg-[#41A650]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#85F2A0] border border-[#41A650]/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#41A650] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#41A650]" />
                </span>
                Em execução
              </span>
            )}
            <code className="ml-auto sm:ml-0 font-mono text-[11px] text-[#F2CB05]/75">/oracle</code>
          </div>
          <h2 className="text-[22px] font-bold text-[#F7F9F8] leading-tight mb-0.5 group-hover:text-white transition-colors">
            Oracle
          </h2>
          <p className="text-[12.5px] text-[#C8D5CE] leading-snug">
            Seu ponto de entrada no Clever Agent. Entrevista você, mapeia as capacidades do workspace para suas dores e entrega um plano de implementação em fases.
          </p>
        </div>

        {/* CTA arrow */}
        <div className="hidden sm:flex flex-shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-[#F2CB05]/65 group-hover:text-[#F2CB05] transition-colors">
          Abrir
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  )
}

type FilterValue = 'all' | Category

const FILTERS: { value: FilterValue; label: string; icon: LucideIcon }[] = [
  { value: 'all', label: 'Todos', icon: Bot },
  { value: 'business', label: 'Negócios', icon: Building2 },
  { value: 'engineering', label: 'Engenharia', icon: Code2 },
  { value: 'custom', label: 'Personalizado', icon: Sparkles },
]

const CATEGORY_META: Record<Category, { label: string; color: string; description: string }> = {
  business: {
    label: 'Negócios',
    color: '#85F2A0',
    description: 'Operações, finanças, marketing, RH, jurídico, produto, dados',
  },
  engineering: {
    label: 'Engenharia',
    color: '#818CF8',
    description: 'Desenvolvimento de software — raciocínio, execução, velocidade',
  },
  custom: {
    label: 'Personalizado',
    color: '#C084FC',
    description: 'Agentes pessoais (gitignored)',
  },
}

const TIER_LABELS: Record<EngTier, string> = {
  reasoning: 'Raciocínio · opus',
  execution: 'Execução · sonnet',
  speed: 'Velocidade · haiku',
}

function SectionHeader({
  label,
  count,
  color,
  description,
}: {
  label: string
  count: number
  color: string
  description?: string
}) {
  return (
    <div className="mb-3 flex items-end justify-between border-b border-[#1E3829] pb-2">
      <div className="flex items-baseline gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F7F9F8]" style={{ color }}>
          {label}
        </h2>
        <span className="rounded-full bg-[#07130D] px-2 py-0.5 text-[11px] font-medium text-[#C8D5CE] border border-[#1E3829]">
          {count}
        </span>
      </div>
      {description && (
        <p className="hidden md:block text-[11px] text-[#6B8A76]">{description}</p>
      )}
    </div>
  )
}

function SubSectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="mb-2 mt-4 flex items-center gap-2">
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-[#6B8A76]">{label}</h3>
      <span className="text-[11px] text-[#3D5445]">·</span>
      <span className="text-[11px] text-[#6B8A76]">{count}</span>
    </div>
  )
}

// Recent agents — persisted in localStorage
const RECENT_KEY = 'evo:recent-agents'
const MAX_RECENT = 6

function getRecentAgents(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as { name: string; ts: number }[]
    return data.sort((a, b) => b.ts - a.ts).map(d => d.name).slice(0, MAX_RECENT)
  } catch { return [] }
}

export function trackAgentVisit(agentName: string) {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    let data: { name: string; ts: number }[] = raw ? JSON.parse(raw) : []
    data = data.filter(d => d.name !== agentName)
    data.unshift({ name: agentName, ts: Date.now() })
    data = data.slice(0, MAX_RECENT)
    localStorage.setItem(RECENT_KEY, JSON.stringify(data))
  } catch {}
}

export default function Agents() {
  const { t } = useTranslation()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [runningAgents, setRunningAgents] = useState<string[]>([])
  const [filter, setFilter] = useState<FilterValue>('all')
  const [query, setQuery] = useState('')
  const [recentNames] = useState(getRecentAgents)

  useEffect(() => {
    api.get('/agents')
      .then((data) => setAgents(data || []))
      .catch(() => setAgents([]))
      .finally(() => setLoading(false))
  }, [])

  // Poll active agents every 5 seconds
  useEffect(() => {
    const fetchActive = () => {
      fetch('/api/agents/active')
        .then((r) => r.json())
        .then((data) => {
          const names = (data.active_agents || []).map((a: { agent: string }) => a.agent)
          setRunningAgents(names)
        })
        .catch(() => {})
    }
    fetchActive()
    const interval = setInterval(fetchActive, 5000)
    return () => clearInterval(interval)
  }, [])

  const totalMemories = agents.reduce((sum, a) => sum + a.memory_count, 0)
  const activeCount = agents.filter((a) => a.memory_count > 0).length

  const counts = useMemo(() => {
    const c = { all: agents.length, business: 0, engineering: 0, custom: 0 }
    for (const a of agents) c[getCategory(a)]++
    return c
  }, [agents])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return agents.filter((a) => {
      if (filter !== 'all' && getCategory(a) !== filter) return false
      if (!q) return true
      return (
        a.name.toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q)
      )
    })
  }, [agents, filter, query])

  const grouped = useMemo(() => {
    let oracle: Agent | null = null
    const business: Agent[] = []
    const engineering: Record<EngTier, Agent[]> & { other: Agent[] } = {
      reasoning: [],
      execution: [],
      speed: [],
      other: [],
    }
    const custom: Agent[] = []
    for (const a of filtered) {
      if (a.name === 'oracle') {
        oracle = a
        continue
      }
      const cat = getCategory(a)
      if (cat === 'business') business.push(a)
      else if (cat === 'custom') custom.push(a)
      else {
        const tier = getEngineeringTier(a.name)
        if (tier) engineering[tier].push(a)
        else engineering.other.push(a)
      }
    }
    const sorter = (x: Agent, y: Agent) => x.name.localeCompare(y.name)
    business.sort(sorter)
    custom.sort(sorter)
    engineering.reasoning.sort(sorter)
    engineering.execution.sort(sorter)
    engineering.speed.sort(sorter)
    engineering.other.sort(sorter)
    return { oracle, business, engineering, custom }
  }, [filtered])

  const isRunning = (name: string) =>
    runningAgents.some((r) => name.includes(r) || r.includes(name.split('-')[0]))

  const gridClass =
    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'

  return (
    <div>
      {/* Oracle welcome banner — only renders when onboarding_completed_agents_visit is false */}
      <OracleWelcomeBanner />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#F7F9F8]">{t('agents.title')}</h1>
        <p className="text-[#6B8A76] mt-1">{t('agents.subtitle')}</p>

        {/* Stats bar */}
        {!loading && agents.length > 0 && (
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full bg-[#41A650]"
                style={{ boxShadow: '0 0 6px rgba(65, 166, 80,0.5)' }}
              />
              <span className="text-[#C8D5CE]">
                <span className="font-medium text-[#F7F9F8]">{activeCount}</span> ativos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Brain size={14} className="text-[#6B8A76]" />
              <span className="text-[#C8D5CE]">
                <span className="font-medium text-[#F7F9F8]">{totalMemories}</span> memórias
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 size={14} className="text-[#85F2A0]" />
              <span className="text-[#C8D5CE]">
                <span className="font-medium text-[#F7F9F8]">{counts.business}</span> negócios
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 size={14} className="text-[#818CF8]" />
              <span className="text-[#C8D5CE]">
                <span className="font-medium text-[#F7F9F8]">{counts.engineering}</span> engenharia
              </span>
            </div>
            {counts.custom > 0 && (
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#C084FC]" />
                <span className="text-[#C8D5CE]">
                  <span className="font-medium text-[#F7F9F8]">{counts.custom}</span> personalizado
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent agents */}
      {!loading && recentNames.length > 0 && filter === 'all' && !query && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <History size={13} className="text-[#6B8A76]" />
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-[#6B8A76]">Recentes</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recentNames
              .filter(n => agents.some(a => a.name === n))
              .map(name => {
                const meta = AGENT_META[name] || DEFAULT_META
                const running = isRunning(name)
                return (
                  <Link
                    key={name}
                    to={`/agents/${name}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-[#1E3829] bg-[#122018] hover:border-[#2E5040] hover:bg-[#162B1E] transition-all flex-shrink-0 group"
                  >
                    <div className="relative flex-shrink-0">
                      <AgentAvatar name={name} size={28} />
                      {running && (
                        <span
                          className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#122018]"
                          style={{ backgroundColor: '#41A650', boxShadow: '0 0 6px rgba(65, 166, 80,0.5)' }}
                        />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-medium text-[#F7F9F8] group-hover:text-white truncate">
                        {name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: meta.color }}>
                        {meta.command}
                      </span>
                    </div>
                  </Link>
                )
              })}
          </div>
        </div>
      )}

      {/* Filter + Search bar */}
      {!loading && agents.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const FIcon = f.icon
              const active = filter === f.value
              const c = counts[f.value]
              return (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all ${
                    active
                      ? 'border-[#41A650]/40 bg-[#41A650]/10 text-[#85F2A0]'
                      : 'border-[#1E3829] bg-[#122018] text-[#C8D5CE] hover:border-[#2E5040] hover:text-[#F7F9F8]'
                  }`}
                >
                  <FIcon size={12} />
                  {f.label}
                  <span className="rounded-full bg-[#07130D] px-1.5 py-0.5 text-[10px] text-[#6B8A76] border border-[#1E3829]">
                    {c}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="relative sm:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B8A76]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar agentes..."
              className="w-full rounded-full border border-[#1E3829] bg-[#122018] py-1.5 pl-9 pr-3 text-[12px] text-[#F7F9F8] placeholder:text-[#6B8A76] focus:border-[#41A650]/40 focus:outline-none"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className={gridClass}>
          {[...Array(9)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#122018] border border-[#1E3829]">
            <Bot size={32} className="text-[#3D5445]" />
          </div>
          <p className="text-[#6B8A76] text-lg">Nenhum agente encontrado</p>
          <p className="text-[#3D5445] text-sm mt-1">
            Adicione arquivos de agente em .claude/agents/ para começar
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#6B8A76] text-sm">Nenhum agente corresponde aos filtros.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.oracle && (
            <OracleHeroCard agent={grouped.oracle} isRunning={isRunning(grouped.oracle.name)} />
          )}
          {grouped.business.length > 0 && (
            <section>
              <SectionHeader
                label={CATEGORY_META.business.label}
                count={grouped.business.length}
                color={CATEGORY_META.business.color}
                description={CATEGORY_META.business.description}
              />
              <div className={gridClass}>
                {grouped.business.map((agent) => (
                  <AgentCard key={agent.name} agent={agent} isRunning={isRunning(agent.name)} />
                ))}
              </div>
            </section>
          )}

          {(grouped.engineering.reasoning.length > 0 ||
            grouped.engineering.execution.length > 0 ||
            grouped.engineering.speed.length > 0 ||
            grouped.engineering.other.length > 0) && (
            <section>
              <SectionHeader
                label={CATEGORY_META.engineering.label}
                count={
                  grouped.engineering.reasoning.length +
                  grouped.engineering.execution.length +
                  grouped.engineering.speed.length +
                  grouped.engineering.other.length
                }
                color={CATEGORY_META.engineering.color}
                description={CATEGORY_META.engineering.description}
              />
              {(['reasoning', 'execution', 'speed'] as EngTier[]).map((tier) =>
                grouped.engineering[tier].length > 0 ? (
                  <div key={tier}>
                    <SubSectionHeader label={TIER_LABELS[tier]} count={grouped.engineering[tier].length} />
                    <div className={gridClass}>
                      {grouped.engineering[tier].map((agent) => (
                        <AgentCard key={agent.name} agent={agent} isRunning={isRunning(agent.name)} />
                      ))}
                    </div>
                  </div>
                ) : null
              )}
              {grouped.engineering.other.length > 0 && (
                <div>
                  <SubSectionHeader label="Other" count={grouped.engineering.other.length} />
                  <div className={gridClass}>
                    {grouped.engineering.other.map((agent) => (
                      <AgentCard key={agent.name} agent={agent} isRunning={isRunning(agent.name)} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {grouped.custom.length > 0 && (
            <section>
              <SectionHeader
                label={CATEGORY_META.custom.label}
                count={grouped.custom.length}
                color={CATEGORY_META.custom.color}
                description={CATEGORY_META.custom.description}
              />
              <div className={gridClass}>
                {grouped.custom.map((agent) => (
                  <AgentCard key={agent.name} agent={agent} isRunning={isRunning(agent.name)} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
