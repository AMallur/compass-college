'use client'

import SliderInput from '@/components/ui/SliderInput'

interface IncomeStepProps {
  income: number
  onChange: (v: number) => void
  onContinue: () => void
}

function formatDollars(n: number): string {
  if (n >= 180000) return '$180,000+'
  return '$' + n.toLocaleString()
}

export default function IncomeStep({ income, onChange, onContinue }: IncomeStepProps) {
  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-6 py-12 bg-[#0B1D35]">
      <div className="w-full max-w-xl">
        <p className="text-[#E8A020] font-medium text-sm tracking-widest uppercase mb-3">Step 1 of 5</p>
        <h1 className="text-white text-3xl sm:text-4xl font-bold leading-tight mb-2">
          What&apos;s your household income?
        </h1>
        <p className="text-[#8899AA] text-base mb-12">
          We&apos;ll show you real federal data for families at your income level.
        </p>

        <div className="mb-4 text-center">
          <span className="font-barlow text-6xl sm:text-7xl font-bold text-white tracking-tight">
            {formatDollars(income)}
          </span>
          <p className="text-[#8899AA] text-sm mt-1">household income / year</p>
        </div>

        <div className="mb-6 px-2">
          <SliderInput
            value={income}
            min={30000}
            max={180000}
            step={1000}
            onChange={onChange}
          />
          <div className="flex justify-between mt-2 text-xs text-[#8899AA]">
            <span>$30,000</span>
            <span>$180,000+</span>
          </div>
        </div>

        <p className="text-[#8899AA] text-xs mb-10 text-center">
          We use 2024 household AGI — the same number on line 11 of your tax return.
        </p>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-xl bg-[#E8A020] text-[#0B1D35] font-bold text-lg hover:bg-amber-400 active:scale-95 transition-all"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
