import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../context/AuthContext'

const inp = "w-full px-4 py-3 rounded-lg bg-[#122018] border border-[#1E3829] text-[#e2e8f0] placeholder-[#2d4a38] text-sm transition-colors duration-200 focus:outline-none focus:border-[#41A650]/60 focus:ring-1 focus:ring-[#85F2A0]/20"

interface SelectedSnapshot {
  ref: string
  label: string
  includeKb: boolean
}

interface RestoreConfirmProps {
  snapshot: SelectedSnapshot
  onConfirm: () => void
  onBack: () => void
}

export default function RestoreConfirm({ snapshot, onConfirm, onBack }: RestoreConfirmProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const workspaceName = user?.username || 'workspace'
  const [confirm, setConfirm] = useState('')

  const isMatch = confirm.trim().toLowerCase() === workspaceName.toLowerCase()

  return (
    <div className="min-h-screen bg-[#07130D] flex items-center justify-center px-4 font-[Inter,-apple-system,sans-serif]">
      <div className="w-full max-w-[480px] relative z-10">
        <div className="rounded-xl border border-[#1E3829] bg-[#0D1B12] shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
          <div className="px-7 pt-7 pb-5 border-b border-[#1E3829]">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#3a1515] border border-[#5a2020]">
                <AlertTriangle size={18} className="text-[#f87171]" />
              </div>
              <div>
                <h2 className="text-[16px] font-semibold text-[#e2e8f0]">{t('restore.confirm.title')}</h2>
                <p className="text-[11px] text-[#6B8A76] mt-0.5">{t('restore.confirm.subtitle')}</p>
              </div>
            </div>
          </div>

          <div className="px-7 py-6 space-y-4">
            <div className="p-3 rounded-lg bg-[#1a0a0a] border border-[#3a1515]">
              <p className="text-[11px] text-[#f87171] leading-relaxed">
                {t('restore.confirm.warningPart1')}
                <span className="font-semibold">{snapshot.label}</span>
                {'.'}
                {snapshot.includeKb && (
                  <span>{t('restore.confirm.warningKb')}</span>
                )}
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6B8A76] mb-1.5 tracking-[0.08em] uppercase">
                {t('restore.confirm.typeToConfirmPart1')}
                <span className="text-[#e2e8f0]">{workspaceName}</span>
                {t('restore.confirm.typeToConfirmPart2')}
              </label>
              <input
                type="text"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inp}
                placeholder={workspaceName}
                autoFocus
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onBack}
                className="flex-none py-3 px-4 rounded-lg border border-[#1E3829] text-[#6B8A76] hover:border-[#41A650]/30 hover:text-[#e2e8f0] text-sm font-medium transition-colors"
              >
                {t('restore.back')}
              </button>
              <button
                onClick={onConfirm}
                disabled={!isMatch}
                className="flex-1 py-3 rounded-lg bg-[#f87171] text-[#1a0a0a] hover:bg-[#ef4444] text-sm font-semibold transition-colors disabled:opacity-40"
              >
                {t('restore.confirm.restoreBtn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
