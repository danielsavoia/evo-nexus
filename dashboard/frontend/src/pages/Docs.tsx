import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChevronDown, ChevronRight, Search, Menu, X, BookOpen, Rocket, LayoutDashboard, Bot, Zap, Clock, Plug, Globe, FileText } from 'lucide-react'

const API = ''

// White-label overlay: replace upstream product branding at render time.
// The backend serves markdown content referencing EvoNexus; this function
// rewrites those references before they reach the DOM, keeping the backend
// data source intact while displaying Clever Agent branding.
// NOTE: order matters — specific multi-segment patterns run BEFORE the generic
// `evo-nexus` → `clever-agent` replacement so they match original text.
function whiteLabel(text: string): string {
  return text
    // Specific install commands (replace entire command, not just name)
    .replace(/npx @evoapi\/evo-nexus\S*/g, 'clever-agent setup')
    // Full GitHub URLs before the generic evo-nexus swap scrambles them
    .replace(/https:\/\/raw\.githubusercontent\.com\/EvolutionAPI\/evo-nexus[^\s)"'\]]+/g, 'https://clever.app/docs/install')
    .replace(/https:\/\/github\.com\/EvolutionAPI\/evo-nexus[^\s)"'\]]+/g, 'https://clever.app/docs')
    .replace(/https:\/\/github\.com\/evolution-foundation\/evo-nexus[^\s)"'\]]+/g, 'https://clever.app/docs')
    // Package reference
    .replace(/@evoapi\/evo-nexus/g, 'clever-agent')
    // Generic name replacements
    .replace(/EvoNexus/g, 'Clever Agent')
    .replace(/Evo Nexus/g, 'Clever Agent')
    .replace(/evo-nexus/g, 'clever-agent')
    // Clean up any remaining EvolutionAPI/ GitHub org prefix in paths
    .replace(/github\.com\/EvolutionAPI\/clever-agent/g, 'clever.app/docs')
    .replace(/EvolutionAPI\/clever-agent/g, 'clever-agent')
}

interface DocEntry {
  title: string
  slug: string
  path: string
  content_preview?: string
}

interface DocSection {
  title: string
  slug: string
  children: DocEntry[]
}

export default function Docs() {
  const location = useLocation()
  const navigate = useNavigate()

  const [sections, setSections] = useState<DocSection[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSlug, setActiveSlug] = useState('')

  // Derive the current doc slug from the URL
  const getSlugFromPath = useCallback(() => {
    const prefix = '/docs'
    const path = location.pathname
    if (path === prefix || path === prefix + '/') return ''
    return path.slice(prefix.length + 1)
  }, [location.pathname])

  // Load the doc tree
  useEffect(() => {
    fetch(`${API}/api/docs`)
      .then((r) => r.json())
      .then((data) => setSections(data.sections || []))
      .catch(() => {
        setSections([])
        setLoading(false)
      })
  }, [])

  // Load content when slug changes
  useEffect(() => {
    const slug = getSlugFromPath()
    setActiveSlug(slug)

    // Find the matching doc entry
    let docPath = ''
    if (!slug && sections.length > 0) {
      // Default to first doc
      const first = sections[0]?.children?.[0]
      if (first) {
        docPath = first.path
        setActiveSlug(first.slug)
      }
    } else {
      for (const sec of sections) {
        const entry = sec.children.find((c) => c.slug === slug)
        if (entry) {
          docPath = entry.path
          break
        }
      }
    }

    if (!docPath) {
      if (sections.length > 0) {
        setContent('# Page not found\n\nThe requested documentation page was not found.')
        setLoading(false)
      }
      return
    }

    setLoading(true)
    fetch(`${API}/api/docs/${docPath}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found')
        return r.text()
      })
      .then((md) => {
        setContent(whiteLabel(md))
        setLoading(false)
      })
      .catch(() => {
        setContent('# Error\n\nCould not load this page.')
        setLoading(false)
      })
  }, [getSlugFromPath, sections])

  const handleNav = (slug: string) => {
    navigate(`/docs/${slug}`)
    setMobileOpen(false)
  }

  const toggleSection = (slug: string) => {
    setCollapsed((prev) => ({ ...prev, [slug]: !prev[slug] }))
  }

  // Filter sections by search (matches title and content_preview)
  const searchLower = search.toLowerCase()
  const filtered = sections
    .map((sec) => ({
      ...sec,
      children: sec.children.filter((c) =>
        c.title.toLowerCase().includes(searchLower) ||
        (c.content_preview && c.content_preview.toLowerCase().includes(searchLower))
      ),
    }))
    .filter((sec) => sec.children.length > 0)

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-5 flex items-center justify-between border-b border-[#1E3829]">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-[#85F2A0]" />
          <span className="text-lg font-bold">
            <span className="text-[#85F2A0]">Clever</span>
            <span className="text-white"> Agent</span>
            <span className="text-[#6B8A76] ml-1.5 text-sm font-normal">Docs</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1 rounded hover:bg-white/10 text-[#6B8A76]"
        >
          <X size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-[#6B8A76]" />
          <input
            type="text"
            placeholder="Search docs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-[#122018] border border-[#1E3829] rounded-lg text-[#C8D5CE] placeholder-[#6B8A76] focus:outline-none focus:border-[#41A650]/50"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {filtered.map((sec) => {
          const sectionIcons: Record<string, typeof Rocket> = {
            'getting-started': Rocket,
            'guides': BookOpen,
            'dashboard': LayoutDashboard,
            'agents': Bot,
            'skills': Zap,
            'routines': Clock,
            'integrations': Plug,
            'real-world': Globe,
            'reference': FileText,
          }
          const Icon = sectionIcons[sec.slug] || FileText
          return (
          <div key={sec.slug} className="mb-2">
            <button
              onClick={() => toggleSection(sec.slug)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] uppercase tracking-widest text-[#6B8A76] font-semibold hover:text-[#C8D5CE] transition-colors"
            >
              {collapsed[sec.slug] ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              <Icon size={13} className="text-[#85F2A0]/60" />
              {sec.title}
            </button>
            {!collapsed[sec.slug] && (
              <div className="ml-2">
                {sec.children.map((child) => {
                  const matchesContent = search && child.content_preview &&
                    !child.title.toLowerCase().includes(searchLower) &&
                    child.content_preview.toLowerCase().includes(searchLower)
                  const snippetStart = matchesContent
                    ? child.content_preview!.toLowerCase().indexOf(searchLower)
                    : -1
                  const snippet = matchesContent && snippetStart >= 0
                    ? '...' + child.content_preview!.slice(Math.max(0, snippetStart - 20), snippetStart + search.length + 40) + '...'
                    : null

                  return (
                    <button
                      key={child.slug}
                      onClick={() => handleNav(child.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-0.5 block ${
                        activeSlug === child.slug
                          ? 'text-[#85F2A0] bg-[#41A650]/10 border-l-2 border-[#41A650]'
                          : 'text-[#6B8A76] hover:text-[#C8D5CE] hover:bg-white/5 border-l-2 border-transparent'
                      }`}
                    >
                      {whiteLabel(child.title)}
                      {snippet && (
                        <span className="block text-xs text-[#475467] mt-0.5 truncate">
                          {snippet}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          )
        })}
      </nav>

      {/* Back to dashboard */}
      <div className="px-4 py-3 border-t border-[#1E3829]/50">
        <a
          href="/"
          className="flex items-center justify-center gap-1.5 text-xs text-[#6B8A76] hover:text-[#85F2A0] transition-colors"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#091410]">
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-[#122018] border border-[#1E3829] text-[#C8D5CE] hover:text-[#85F2A0] transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 bottom-0 w-64 bg-[#07130D] border-r border-[#1E3829] flex flex-col z-50
          transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {sidebar}
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-0 lg:ml-64 p-4 lg:p-12 pt-16 lg:pt-12 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-[#6B8A76] text-sm">Loading...</div>
          ) : (
            <article className="docs-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ src, alt, ...props }) => (
                    <img
                      src={src?.startsWith('/api/') ? `${API}${src}` : src}
                      alt={alt || ''}
                      className="rounded-lg border border-[#1E3829] my-4 max-w-full"
                      {...props}
                    />
                  ),
                  a: ({ href, children, ...props }) => (
                    <a
                      href={href}
                      className="text-[#85F2A0] hover:underline"
                      target={href?.startsWith('http') ? '_blank' : undefined}
                      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </article>
          )}
        </div>
      </main>

      <style>{`
        .docs-content h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #F5F5F6;
          margin-bottom: 1rem;
          margin-top: 0;
          line-height: 1.2;
        }
        .docs-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #F5F5F6;
          margin-top: 2.5rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #1E3829;
        }
        .docs-content h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #C8D5CE;
          margin-top: 2rem;
          margin-bottom: 0.5rem;
        }
        .docs-content h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #C8D5CE;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .docs-content p {
          color: #98A2B3;
          line-height: 1.75;
          margin-bottom: 1rem;
        }
        .docs-content ul, .docs-content ol {
          color: #98A2B3;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .docs-content li {
          margin-bottom: 0.4rem;
          line-height: 1.7;
        }
        .docs-content code {
          background: #122018;
          color: #85F2A0;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-size: 0.875rem;
        }
        .docs-content pre {
          background: #07130D;
          border: 1px solid #1E3829;
          border-radius: 8px;
          padding: 1rem;
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }
        .docs-content pre code {
          background: none;
          padding: 0;
          color: #C8D5CE;
        }
        .docs-content blockquote {
          border-left: 3px solid #41A650;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #6B8A76;
        }
        .docs-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
        }
        .docs-content th {
          text-align: left;
          padding: 0.6rem 0.8rem;
          border-bottom: 2px solid #1E3829;
          color: #C8D5CE;
          font-weight: 600;
          font-size: 0.875rem;
        }
        .docs-content td {
          padding: 0.5rem 0.8rem;
          border-bottom: 1px solid #1D2939;
          color: #98A2B3;
          font-size: 0.875rem;
        }
        .docs-content hr {
          border: none;
          border-top: 1px solid #1E3829;
          margin: 2rem 0;
        }
        .docs-content strong {
          color: #C8D5CE;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
