'use client'

interface ProgressBarProps {
  step: number
  total: number
}

export default function ProgressBar({ step, total }: ProgressBarProps) {
  const pct = Math.round((step / total) * 100)
  return (
    <div className="w-full bg-[#0B1D35] py-4 px-6 sticky top-0 z-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#8899AA] tracking-widest uppercase">
            Step {step} of {total}
          </span>
          <span className="text-xs font-medium text-[#8899AA]">{pct}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#E8A020] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
