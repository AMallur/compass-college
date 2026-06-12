'use client'

import { useEffect, useRef, useState } from 'react'
import { BeliefAnswer } from '@/components/steps/BeliefStep'
import { STATE_DATA } from '@/lib/state-data'

interface ReportHeroProps {
  income: number
  familySize: number
  stateAbbr: string
  avgSavings: number
  belief: BeliefAnswer | null
}

const BELIEF_MESSAGES: Record<BeliefAnswer, string> = {
  toomuch: 'You assumed you\'d get nothing. Federal data says otherwise.',
  small: 'You expected something small. The gap is larger than you thought.',
  unsure: 'Now you know. Here\'s what the data shows for your situation.',
  filed: 'You filed but didn\'t understand the results. This explains them.',
}

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (target === 0) return
    const start = Date.now()
    function tick() {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration])

  return value
}

export default function ReportHero({ income, familySize, stateAbbr, avgSavings, belief }: ReportHeroProps) {
  const animatedSavings = useCountUp(avgSavings)
  const stateName = STATE_DATA.find((s) => s.abbr === stateAbbr)?.name ?? stateAbbr

  return (
    <div className="bg-[#0B1D35] py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-[#E8A020] text-xs font-semibold tracking-widest uppercase mb-4">
          College Cost Reality Check · 2026–27
        </p>
        <p className="text-white/60 text-sm mb-8">
          Family of {familySize} · ${income.toLocaleString()}/yr · {stateName}
        </p>

        {avgSavings > 0 ? (
          <>
            <p className="text-white/70 text-base mb-2">Families like yours paid an average of</p>
            <div className="font-barlow text-6xl sm:text-8xl font-bold text-[#0D9E6E] mb-2 tabular-nums">
              ${animatedSavings.toLocaleString()}
            </div>
            <p className="text-white/70 text-base mb-8">less per year than sticker price</p>
          </>
        ) : (
          <p className="text-white text-2xl font-bold mb-8">
            Your personalized college cost report is ready.
          </p>
        )}

        {belief && (
          <div className="inline-block bg-white/10 border border-white/20 rounded-xl px-6 py-4 max-w-lg">
            <p className="text-white font-semibold text-lg">{BELIEF_MESSAGES[belief]}</p>
          </div>
        )}
      </div>
    </div>
  )
}
