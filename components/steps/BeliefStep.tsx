'use client'

export type BeliefAnswer = 'toomuch' | 'small' | 'unsure' | 'filed'

interface BeliefStepProps {
  onSelect: (answer: BeliefAnswer) => void
}

const OPTIONS: { value: BeliefAnswer; label: string }[] = [
  { value: 'toomuch', label: 'We earn too much — we assumed we\'d get nothing' },
  { value: 'small', label: 'We expected something but not much' },
  { value: 'unsure', label: 'We had no idea what to expect' },
  { value: 'filed', label: 'We filed FAFSA but never understood the results' },
]

export default function BeliefStep({ onSelect }: BeliefStepProps) {
  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-6 py-12 bg-[#0B1D35]">
      <div className="w-full max-w-xl">
        <p className="text-[#E8A020] font-medium text-sm tracking-widest uppercase mb-3">Step 5 of 5</p>
        <h1 className="text-white text-3xl sm:text-4xl font-bold leading-tight mb-2">
          One last question.
        </h1>
        <p className="text-white/80 text-lg mb-10">
          Before today, what did you believe about your family&apos;s financial aid eligibility?
        </p>

        <div className="flex flex-col gap-3">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className="w-full text-left px-5 py-4 rounded-xl bg-white/5 border-2 border-white/10 text-white font-medium text-base hover:bg-white/10 hover:border-[#E8A020]/40 active:scale-[0.98] transition-all"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
