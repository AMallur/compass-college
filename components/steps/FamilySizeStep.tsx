'use client'

interface FamilySizeStepProps {
  familySize: number
  onSelect: (size: number) => void
}

const SIZES = [2, 3, 4, 5, 6, 7]

export default function FamilySizeStep({ familySize, onSelect }: FamilySizeStepProps) {
  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-6 py-12 bg-[#0B1D35]">
      <div className="w-full max-w-xl">
        <p className="text-[#E8A020] font-medium text-sm tracking-widest uppercase mb-3">Step 2 of 5</p>
        <h1 className="text-white text-3xl sm:text-4xl font-bold leading-tight mb-2">
          How many people are in your household?
        </h1>
        <p className="text-[#8899AA] text-base mb-10">
          Include everyone who depends on your income.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onSelect(size)}
              className={`py-5 rounded-xl text-2xl font-bold transition-all active:scale-95 border-2 ${
                familySize === size
                  ? 'bg-[#E8A020] border-[#E8A020] text-[#0B1D35]'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {size === 7 ? '7+' : size}
            </button>
          ))}
        </div>

        <p className="text-[#8899AA] text-xs mt-6 text-center">
          Tap your household size to continue.
        </p>
      </div>
    </div>
  )
}
