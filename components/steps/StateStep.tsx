'use client'

import { useState } from 'react'
import { STATE_DATA, StateData } from '@/lib/state-data'

interface StateStepProps {
  selectedState: string
  onSelect: (abbr: string) => void
  onContinue: () => void
}

const URGENCY_ICON: Record<StateData['urgency'], string> = {
  asap: '⚠️',
  early: '🔔',
  spring: '📅',
  late: '📅',
  check: 'ℹ️',
}

const URGENCY_COLOR: Record<StateData['urgency'], string> = {
  asap: 'text-amber-400',
  early: 'text-amber-300',
  spring: 'text-blue-400',
  late: 'text-blue-400',
  check: 'text-[#8899AA]',
}

export default function StateStep({ selectedState, onSelect, onContinue }: StateStepProps) {
  const [search, setSearch] = useState('')

  const filtered = search.length > 0
    ? STATE_DATA.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.abbr.toLowerCase().includes(search.toLowerCase())
      )
    : STATE_DATA

  const selected = STATE_DATA.find((s) => s.abbr === selectedState)

  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-6 py-12 bg-[#0B1D35]">
      <div className="w-full max-w-xl">
        <p className="text-[#E8A020] font-medium text-sm tracking-widest uppercase mb-3">Step 3 of 5</p>
        <h1 className="text-white text-3xl sm:text-4xl font-bold leading-tight mb-2">
          What state do you live in?
        </h1>
        <p className="text-[#8899AA] text-base mb-8">
          State grants can add thousands on top of federal aid.
        </p>

        <div className="relative mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search states…"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-[#8899AA] focus:outline-none focus:ring-2 focus:ring-[#E8A020] text-sm"
          />
        </div>

        <div className="max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-white/5 mb-6">
          {filtered.map((s) => (
            <button
              key={s.abbr}
              onClick={() => { onSelect(s.abbr); setSearch('') }}
              className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                selectedState === s.abbr
                  ? 'bg-[#E8A020]/20 text-[#E8A020]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span className="font-medium text-sm">{s.name}</span>
              <span className="text-xs text-[#8899AA]">{s.abbr}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-3 text-sm text-[#8899AA]">No states found.</p>
          )}
        </div>

        {selected && (
          <div className={`mb-6 p-4 rounded-xl border ${
            selected.urgency === 'asap' ? 'border-amber-500/40 bg-amber-500/10' : 'border-white/10 bg-white/5'
          }`}>
            <div className="flex items-start gap-2">
              <span className="text-lg">{URGENCY_ICON[selected.urgency]}</span>
              <div>
                <p className="text-white font-semibold text-sm">{selected.grant}</p>
                <p className={`text-xs mt-0.5 ${URGENCY_COLOR[selected.urgency]}`}>
                  {selected.deadline}
                </p>
                <p className="text-[#8899AA] text-xs mt-1">
                  Up to ${selected.maxAmount.toLocaleString()} / year
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onContinue}
          disabled={!selectedState}
          className="w-full py-4 rounded-xl bg-[#E8A020] text-[#0B1D35] font-bold text-lg hover:bg-amber-400 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
