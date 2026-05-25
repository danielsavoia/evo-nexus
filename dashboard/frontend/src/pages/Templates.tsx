import { useEffect, useState } from 'react'
import { Layout, FileCode, FileText } from 'lucide-react'
import { api } from '../lib/api'
import Markdown from '../components/Markdown'
import { useTranslation } from 'react-i18next'

interface Template {
  name: string
  path: string
  content?: string
  custom?: boolean
  type?: string
}

export default function Templates() {
  const { t } = useTranslation()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Template | null>(null)

  useEffect(() => {
    api.get('/templates')
      .then((data) => setTemplates(data || []))
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false))
  }, [])

  const loadTemplate = async (t: Template) => {
    if (t.content) {
      setSelected(t)
      return
    }
    const content = await api.getRaw(`/templates/${encodeURIComponent(t.name)}`)
    const updated = { ...t, content }
    setTemplates((prev) => prev.map((p) => (p.name === t.name ? updated : p)))
    setSelected(updated)
  }

  if (selected) {
    const isHtml = selected.name?.endsWith('.html') || selected.path?.includes('/html/')
    return (
      <div>
        <button onClick={() => setSelected(null)} className="text-[#85F2A0] text-sm hover:underline mb-4 inline-block">
          &larr; Back to templates
        </button>
        <h1 className="text-2xl font-bold text-[#F7F9F8] mb-6">{selected.name}</h1>
        <div className="bg-[#122018] border border-[#1E3829] rounded-xl overflow-hidden">
          {isHtml ? (
            <iframe
              srcDoc={selected.content || ''}
              className="w-full border-0"
              style={{ height: 'calc(100vh - 220px)', minHeight: '600px' }}
              title={selected.name}
            />
          ) : (
            <div className="p-6">
              <Markdown>{selected.content || ''}</Markdown>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#F7F9F8]">{t('templates.title')}</h1>
        <p className="text-[#6B8A76] mt-1">Reusable templates</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[#122018] border border-[#1E3829] flex items-center justify-center mx-auto mb-4">
            <Layout size={28} className="text-[#6B8A76]" />
          </div>
          <p className="text-[#6B8A76]">No templates found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map((t, i) => {
            const isHtml = t.type === 'html' || t.name?.endsWith('.html')
            return (
              <button
                key={i}
                onClick={() => loadTemplate(t)}
                className="bg-[#122018] border border-[#1E3829] rounded-xl p-5 hover:border-[#41A650]/40 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{
                    background: isHtml ? 'rgba(96,165,250,0.10)' : 'rgba(133, 242, 160,0.08)',
                    border: isHtml ? '1px solid rgba(96,165,250,0.25)' : '1px solid rgba(133, 242, 160,0.20)',
                  }}>
                    {isHtml ? (
                      <FileCode size={18} className="text-blue-400" />
                    ) : (
                      <FileText size={18} className="text-[#85F2A0]" />
                    )}
                  </div>
                  {t.custom ? (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-[#1E3829]/60 border-[#1E3829] text-[#6B8A76]">custom</span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-[#41A650]/8 border-[#41A650]/20 text-[#85F2A0]">core</span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-[#F7F9F8] group-hover:text-[#85F2A0] transition-colors truncate">
                  {t.name}
                </h3>
                <p className="text-xs text-[#6B8A76] mt-1">{isHtml ? 'HTML Template' : 'Markdown'}</p>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
