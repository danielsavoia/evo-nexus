import { GitBranch, History, RefreshCw, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import OnboardingHeader from './OnboardingHeader'

interface StepBrainRepoProps {
  onYes: () => void
  onNo: () => void
  onBack: () => void
}

export default function StepBrainRepo({ onYes, onNo, onBack }: StepBrainRepoProps) {
  const { t } = useTranslation()
  const benefits = [
    { icon: History, label: t('onboarding.brainRepo.benefits.snapshotLabel'), desc: t('onboarding.brainRepo.benefits.snapshotDesc') },
    { icon: RefreshCw, label: t('onboarding.brainRepo.benefits.restoreLabel'), desc: t('onboarding.brainRepo.benefits.restoreDesc') },
    { icon: Shield, label: t('onboarding.brainRepo.benefits.privacyLabel'), desc: t('onboarding.brainRepo.benefits.privacyDesc') },
  ]
  return (
    <div className="min-h-screen bg-[#07130D] flex items-center justify-center px-4 font-[Inter,-apple-system,sans-serif]">
      <div className="w-full max-w-[480px] relative z-10">
        <OnboardingHeader step="step2of3" filled={2} />

        <div className="rounded-xl border border-[#1E3829] bg-[#0D1B12] shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
          <div className="px-7 pt-7 pb-5 border-b border-[#1E3829]">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#41A650]/10 border border-[#41A650]/20">
                <GitBranch size={18} className="text-[#85F2A0]" />
              </div>
              <h2 className="text-[16px] font-semibold text-[#e2e8f0]">{t('onboarding.brainRepo.title')}</h2>
            </div>
            <p className="text-[11px] text-[#6B8A76]">{t('onboarding.brainRepo.subtitle')}</p>
          </div>

          <div className="px-7 py-6 space-y-5">
            <p className="text-[13px] text-[#6B8A76] leading-relaxed">
              {t('onboarding.brainRepo.descriptionPart1')}
              <span className="text-[#e2e8f0] font-medium">{t('onboarding.brainRepo.descriptionEmphasis')}</span>
              {t('onboarding.brainRepo.descriptionPart2')}
            </p>

            {/* Benefits list */}
            <div className="space-y-3">
              {benefits.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-[#122018] border border-[#1E3829]">
                  <Icon size={14} className="text-[#85F2A0] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[12px] font-medium text-[#e2e8f0]">{label}</p>
                    <p className="text-[11px] text-[#6B8A76]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onBack}
                className="flex-none py-3 px-4 rounded-lg border border-[#1E3829] text-[#6B8A76] hover:border-[#41A650]/30 hover:text-[#e2e8f0] text-sm font-medium transition-colors"
              >
                {t('onboarding.back')}
              </button>
              <button
                onClick={onNo}
                className="flex-1 py-3 rounded-lg border border-[#1E3829] text-[#6B8A76] hover:border-[#41A650]/30 hover:text-[#e2e8f0] text-sm font-medium transition-colors"
              >
                {t('onboarding.brainRepo.notNow')}
              </button>
              <button
                onClick={onYes}
                className="flex-1 py-3 rounded-lg bg-[#41A650] text-[#07130D] hover:bg-[#00e69a] text-sm font-semibold transition-colors"
              >
                {t('onboarding.brainRepo.yesVersion')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
