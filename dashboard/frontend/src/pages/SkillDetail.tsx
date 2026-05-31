import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import Markdown from '../components/Markdown'
import { getSkillBodyPtBR, getSkillTitlePtBR } from '../lib/localization/pt-BR/skill-overlays'

export default function SkillDetail() {
  const { name } = useParams()
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (name) {
      api.getRaw(`/skills/${name}`)
        .then(setContent)
        .catch(() => setContent('# Skill not found'))
        .finally(() => setLoading(false))
    }
  }, [name])

  if (loading) {
    return (
      <div>
        <div className="skeleton h-8 w-48 mb-4 rounded" />
        <div className="skeleton h-96 rounded-xl" />
      </div>
    )
  }

  // Use pt-BR overlay if available, otherwise fall back to original English content.
  // The overlay is display-only — runtime always receives the original SKILL.md.
  const ptBRBody = name ? getSkillBodyPtBR(name) : undefined
  const displayContent = ptBRBody ?? content
  const displayTitle = name ? (getSkillTitlePtBR(name) ?? name) : name

  return (
    <div>
      <Link to="/skills" className="text-[#85F2A0] text-sm hover:underline mb-4 inline-block">
        &larr; Habilidades
      </Link>
      <h1 className="text-2xl font-bold text-[#F9FAFB] mb-6">{displayTitle}</h1>
      <div className="bg-[#122018] border border-[#1E3829] rounded-xl p-6">
        <div className="markdown-content">
          <Markdown>{displayContent}</Markdown>
        </div>
      </div>
    </div>
  )
}
