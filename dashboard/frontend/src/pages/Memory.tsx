import { useEffect, useState } from 'react'
import {
  Brain,
  ChevronDown,
  ChevronRight,
  FileText,
  Database,
  Bot,
  FolderKanban,
  DollarSign,
  Heart,
  GraduationCap,
  Target,
  Camera,
  Users,
  Compass,
  type LucideIcon,
} from 'lucide-react'
import { api } from '../lib/api'
import Markdown from '../components/Markdown'
import { useTranslation } from 'react-i18next'

interface GlobalFile {
  name: string
  path: string
  size: number
}

interface MemoryData {
  global_files: GlobalFile[]
  agent_memory_counts: Record<string, number>
}

// --- Agent meta (same as Agents.tsx) ---
interface AgentMeta {
  icon: LucideIcon
  color: string
  colorMuted: string
  glowColor: string
  label: string
}

const AGENT_META: Record<string, AgentMeta> = {
  'atlas-project': { icon: FolderKanban, color: '#60A5FA', colorMuted: 'rgba(96,165,250,0.12)', glowColor: 'rgba(96,165,250,0.15)', label: 'Projects' },
  'clawdia-assistant': { icon: Brain, color: '#22D3EE', colorMuted: 'rgba(34,211,238,0.12)', glowColor: 'rgba(34,211,238,0.15)', label: 'Operations' },
  'flux-finance': { icon: DollarSign, color: '#34D399', colorMuted: 'rgba(52,211,153,0.12)', glowColor: 'rgba(52,211,153,0.15)', label: 'Finance' },
  'kai-personal-assistant': { icon: Heart, color: '#F472B6', colorMuted: 'rgba(244,114,182,0.12)', glowColor: 'rgba(244,114,182,0.15)', label: 'Personal' },
  'mentor-courses': { icon: GraduationCap, color: '#FBBF24', colorMuted: 'rgba(251,191,36,0.12)', glowColor: 'rgba(251,191,36,0.15)', label: 'Courses' },
  'nex-sales': { icon: Target, color: '#FB923C', colorMuted: 'rgba(251,146,60,0.12)', glowColor: 'rgba(251,146,60,0.15)', label: 'Sales' },
  'pixel-social-media': { icon: Camera, color: '#A78BFA', colorMuted: 'rgba(167,139,250,0.12)', glowColor: 'rgba(167,139,250,0.15)', label: 'Social Media' },
  'pulse-community': { icon: Users, color: '#2DD4BF', colorMuted: 'rgba(45,212,191,0.12)', glowColor: 'rgba(45,212,191,0.15)', label: 'Community' },
  'sage-strategy': { icon: Compass, color: '#818CF8', colorMuted: 'rgba(129,140,248,0.12)', glowColor: 'rgba(129,140,248,0.15)', label: 'Strategy' },
}

const DEFAULT_META: AgentMeta = { icon: Bot, color: '#85F2A0', colorMuted: 'rgba(133, 242, 160,0.12)', glowColor: 'rgba(133, 242, 160,0.15)', label: 'Agent' }

function getMeta(name: string): AgentMeta {
  return AGENT_META[name] || DEFAULT_META
}

function formatAgentName(name: string): string {
  return name.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Memory() {
  const { t } = useTranslation()
  const [data, setData] = useState<MemoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedGlobal, setExpandedGlobal] = useState<string | null>(null)
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)
  const [agentFiles, setAgentFiles] = useState<Record<string, GlobalFile[]>>({})
  const [expandedFile, setExpandedFile] = useState<string | null>(null)
  const [fileContents, setFileContents] = useState<Record<string, string>>({})

  useEffect(() => {
    api.get('/memory')
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  const loadFileContent = async (path: string) => {
    if (fileContents[path]) return
    try {
      const text = await api.getRaw(`/memory/${path}`)
      setFileContents(prev => ({ ...prev, [path]: text }))
    } catch {
      setFileContents(prev => ({ ...prev, [path]: 'Failed to load' }))
    }
  }

  const toggleGlobal = async (file: GlobalFile) => {
    const key = file.path
    if (expandedGlobal === key) { setExpandedGlobal(null); return }
    setExpandedGlobal(key)
    await loadFileContent(file.path)
  }

  const toggleAgent = async (agent: string) => {
    if (expandedAgent === agent) { setExpandedAgent(null); return }
    setExpandedAgent(agent)
    if (!agentFiles[agent]) {
      try {
        const files = await api.get(`/memory/agents/${agent}`)
        setAgentFiles(prev => ({ ...prev, [agent]: Array.isArray(files) ? files : [] }))
      } catch {
        setAgentFiles(prev => ({ ...prev, [agent]: [] }))
      }
    }
  }

  const toggleFile = async (agent: string, file: GlobalFile) => {
    const key = `${agent}/${file.name}`
    if (expandedFile === key) { setExpandedFile(null); return }
    setExpandedFile(key)
    const path = `agents/${agent}/${file.name}`
    await loadFileContent(path)
  }

  const globalFiles = data?.global_files || []
  const agentCounts = data?.agent_memory_counts || {}
  const totalEntries = globalFiles.length + Object.values(agentCounts).reduce((a, b) => a + b, 0)
  const agentCount = Object.keys(agentCounts).length

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#F7F9F8] tracking-tight">{t('memory.title')}</h1>
        <p className="text-[#6B8A76] text-sm mt-1">Persistent workspace memory</p>

        {/* Stats bar */}
        {!loading && data && (
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 rounded bg-[#41A650]/10">
                <Database size={12} className="text-[#85F2A0]" />
              </div>
              <span className="text-[#C8D5CE]">
                <span className="font-medium text-[#F7F9F8]">{totalEntries}</span> total entries
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 rounded bg-[#41A650]/10">
                <Brain size={12} className="text-[#85F2A0]" />
              </div>
              <span className="text-[#C8D5CE]">
                <span className="font-medium text-[#F7F9F8]">{globalFiles.length}</span> global files
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 rounded bg-[#41A650]/10">
                <Bot size={12} className="text-[#85F2A0]" />
              </div>
              <span className="text-[#C8D5CE]">
                <span className="font-medium text-[#F7F9F8]">{agentCount}</span> agents with memory
              </span>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#1E3829] bg-[#122018] p-5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#1E3829] animate-pulse" />
                <div className="h-4 w-48 rounded bg-[#1E3829] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Global Memory */}
          {globalFiles.length > 0 && (
            <div>
              <h2 className="text-xs font-medium text-[#6B8A76] uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#41A650]/8 border border-[#41A650]/15">
                  <Brain size={12} className="text-[#85F2A0]" />
                </div>
                Global Memory
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#41A650]/10 text-[#85F2A0] border border-[#41A650]/20 normal-case">
                  {globalFiles.length}
                </span>
              </h2>
              <div className="space-y-2">
                {globalFiles.map((file) => (
                  <div
                    key={file.path}
                    className="group bg-[#122018] border border-[#1E3829] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#41A650]/40 hover:shadow-[0_0_24px_rgba(133, 242, 160,0.06)]"
                  >
                    <button onClick={() => toggleGlobal(file)} className="w-full flex items-center justify-between p-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04]">
                          <FileText size={14} className="text-[#6B8A76] group-hover:text-[#F7F9F8] transition-colors" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-[#F7F9F8]">{file.name}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-[#6B8A76]">{file.path}</span>
                            {file.size > 0 && (
                              <span className="text-[10px] text-[#6B8A76]/60">{formatSize(file.size)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {expandedGlobal === file.path
                        ? <ChevronDown size={16} className="text-[#6B8A76]" />
                        : <ChevronRight size={16} className="text-[#6B8A76]" />
                      }
                    </button>
                    {expandedGlobal === file.path && (
                      <div className="px-4 pb-4 border-t border-[#1E3829]">
                        <div className="mt-3">
                          <Markdown>{fileContents[file.path] || 'Loading...'}</Markdown>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agent Memory */}
          <div>
            <h2 className="text-xs font-medium text-[#6B8A76] uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#41A650]/8 border border-[#41A650]/15">
                <Bot size={12} className="text-[#85F2A0]" />
              </div>
              Agent Memory
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#41A650]/10 text-[#85F2A0] border border-[#41A650]/20 normal-case">
                {agentCount}
              </span>
            </h2>
            <div className="space-y-2">
              {Object.entries(agentCounts).sort(([a], [b]) => a.localeCompare(b)).map(([agent, count]) => {
                const meta = getMeta(agent)
                const Icon = meta.icon
                return (
                  <div
                    key={agent}
                    className="group bg-[#122018] border border-[#1E3829] rounded-2xl overflow-hidden transition-all duration-300 hover:border-transparent"
                  >
                    {/* Hover glow */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        boxShadow: `inset 0 0 0 1px ${meta.color}44, 0 0 20px ${meta.glowColor}`,
                        borderRadius: 'inherit',
                      }}
                    />

                    <button onClick={() => toggleAgent(agent)} className="w-full flex items-center justify-between p-4 text-left relative z-10">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: meta.colorMuted }}
                        >
                          <Icon size={16} style={{ color: meta.color }} />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-[#F7F9F8]">{formatAgentName(agent)}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className="text-[10px] font-medium uppercase tracking-wider"
                              style={{ color: meta.color, opacity: 0.8 }}
                            >
                              {meta.label}
                            </span>
                            <span className="flex items-center gap-1 rounded-full bg-[#07130D] px-2 py-0.5 border border-[#1E3829]">
                              <FileText size={10} className="text-[#6B8A76]" />
                              <span className="text-[10px] font-medium text-[#C8D5CE]">{count} files</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      {expandedAgent === agent
                        ? <ChevronDown size={16} className="text-[#6B8A76]" />
                        : <ChevronRight size={16} className="text-[#6B8A76]" />
                      }
                    </button>
                    {expandedAgent === agent && (
                      <div className="border-t border-[#1E3829] relative z-10">
                        {(agentFiles[agent] || []).length === 0 ? (
                          <div className="p-4 text-sm text-[#6B8A76]">Loading files...</div>
                        ) : (
                          (agentFiles[agent] || []).map((file) => {
                            const fileKey = `${agent}/${file.name}`
                            const contentKey = `agents/${agent}/${file.name}`
                            return (
                              <div key={file.name}>
                                <button
                                  onClick={() => toggleFile(agent, file)}
                                  className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-white/[0.03] transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <FileText size={12} className="text-[#6B8A76]" />
                                    <span className="text-sm text-[#C8D5CE]">{file.name}</span>
                                    {file.size > 0 && (
                                      <span className="text-[10px] text-[#6B8A76]/60">{formatSize(file.size)}</span>
                                    )}
                                  </div>
                                  {expandedFile === fileKey
                                    ? <ChevronDown size={14} className="text-[#6B8A76]" />
                                    : <ChevronRight size={14} className="text-[#6B8A76]" />
                                  }
                                </button>
                                {expandedFile === fileKey && (
                                  <div className="px-6 pb-4 border-t border-[#1E3829]/50">
                                    <div className="mt-3">
                                      <Markdown>{fileContents[contentKey] || 'Loading...'}</Markdown>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
