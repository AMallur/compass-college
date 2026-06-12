'use client'

import SearchInput from '@/components/ui/SearchInput'
import { SchoolSearchResult } from '@/lib/scorecard'

interface SchoolSearchStepProps {
  schools: SchoolSearchResult[]
  onAdd: (school: SchoolSearchResult) => void
  onRemove: (id: number) => void
  onContinue: () => void
  userState: string
}

export default function SchoolSearchStep({
  schools,
  onAdd,
  onRemove,
  onContinue,
  userState,
}: SchoolSearchStepProps) {
  const canAdd = schools.length < 3

  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-6 py-12 bg-[#0B1D35]">
      <div className="w-full max-w-xl">
        <p className="text-[#E8A020] font-medium text-sm tracking-widest uppercase mb-3">Step 4 of 5</p>
        <h1 className="text-white text-3xl sm:text-4xl font-bold leading-tight mb-2">
          Which colleges are you considering?
        </h1>
        <p className="text-[#8899AA] text-base mb-8">
          We&apos;ll show what families like yours actually paid — from federal data. Add up to 3.
        </p>

        <div className="mb-4">
          <SearchInput
            onSelect={onAdd}
            disabled={!canAdd}
            userState={userState}
          />
        </div>

        {schools.length > 0 && (
          <div className="flex flex-col gap-2 mb-6">
            {schools.map((school) => (
              <div
                key={school.id}
                className="flex items-center justify-between bg-white/10 border border-white/20 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-white font-medium text-sm">{school.name}</p>
                  <p className="text-[#8899AA] text-xs mt-0.5">
                    {school.city}, {school.state}
                    {school.state === userState && (
                      <span className="ml-2 text-[#0D9E6E] font-medium">· In-state tuition applies</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(school.id)}
                  className="ml-3 p-1.5 rounded-lg text-[#8899AA] hover:text-white hover:bg-white/10 transition-colors shrink-0"
                  aria-label="Remove school"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {schools.length === 0 && (
          <p className="text-[#8899AA] text-sm mb-6 text-center">
            Search for at least 1 school to see your report.
          </p>
        )}

        {!canAdd && (
          <p className="text-[#8899AA] text-xs mb-6 text-center">
            Maximum 3 schools. Remove one to add another.
          </p>
        )}

        <button
          onClick={onContinue}
          disabled={schools.length === 0}
          className="w-full py-4 rounded-xl bg-[#E8A020] text-[#0B1D35] font-bold text-lg hover:bg-amber-400 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          See my Cost Reality Check →
        </button>
      </div>
    </div>
  )
}
