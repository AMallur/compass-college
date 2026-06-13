'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import ProgressBar from '@/components/ui/ProgressBar'
import IncomeStep from '@/components/steps/IncomeStep'
import FamilySizeStep from '@/components/steps/FamilySizeStep'
import StateStep from '@/components/steps/StateStep'
import SchoolSearchStep from '@/components/steps/SchoolSearchStep'
import BeliefStep, { BeliefAnswer } from '@/components/steps/BeliefStep'

import ReportHero from '@/components/report/ReportHero'
import SchoolCard from '@/components/report/SchoolCard'
import FormulaBreakdown from '@/components/report/FormulaBreakdown'
import StateGrant from '@/components/report/StateGrant'
import CTASection from '@/components/report/CTASection'

import { calculateSAI } from '@/lib/sai-formula'
import { getStateByAbbr } from '@/lib/state-data'
import { SchoolData, SchoolSearchResult, getNetPriceForIncome } from '@/lib/scorecard'

type Step = 1 | 2 | 3 | 4 | 5 | 'calculating' | 'report'

function SchoolCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#DDE3EA] p-5 animate-pulse">
      <div className="h-6 bg-[#F4F6F9] rounded w-2/3 mb-3" />
      <div className="h-4 bg-[#F4F6F9] rounded w-1/3 mb-6" />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="h-20 bg-[#F4F6F9] rounded-xl" />
        <div className="h-20 bg-[#F4F6F9] rounded-xl" />
      </div>
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#DDE3EA]">
        <div className="h-10 bg-[#F4F6F9] rounded" />
        <div className="h-10 bg-[#F4F6F9] rounded" />
        <div className="h-10 bg-[#F4F6F9] rounded" />
      </div>
    </div>
  )
}

export default function Page() {
  const [step, setStep] = useState<Step>(1)
  const [income, setIncome] = useState(82000)
  const [familySize, setFamilySize] = useState(4)
  const [stateAbbr, setStateAbbr] = useState('')
  const [schools, setSchools] = useState<SchoolSearchResult[]>([])
  const [belief, setBelief] = useState<BeliefAnswer | null>(null)

  const [schoolData, setSchoolData] = useState<Record<number, SchoolData>>({})
  const [loadingSchools, setLoadingSchools] = useState(false)
  const fetchedIds = useRef<Set<number>>(new Set())

  // Pre-fetch school data as soon as schools are added
  const fetchSchoolData = useCallback(async (ids: number[]) => {
    const newIds = ids.filter((id) => !fetchedIds.current.has(id))
    if (newIds.length === 0) return

    newIds.forEach((id) => fetchedIds.current.add(id))
    setLoadingSchools(true)

    try {
      const res = await fetch(`/api/scorecard?ids=${newIds.join(',')}`)
      if (!res.ok) throw new Error('API error')
      const data: SchoolData[] = await res.json()
      setSchoolData((prev) => {
        const next = { ...prev }
        data.forEach((s) => { next[s.id] = s })
        return next
      })
    } catch {
      // silently fail — cards will show error state
    } finally {
      setLoadingSchools(false)
    }
  }, [])

  // Pre-fetch when 2nd school is added
  useEffect(() => {
    if (schools.length >= 2) {
      fetchSchoolData(schools.map((s) => s.id))
    }
  }, [schools, fetchSchoolData])

  function handleBeliefSelect(answer: BeliefAnswer) {
    setBelief(answer)
    setStep('calculating')
    // Fetch remaining school data during the 2.5s calculating screen
    fetchSchoolData(schools.map((s) => s.id))
    setTimeout(() => setStep('report'), 2500)
  }

  function addSchool(school: SchoolSearchResult) {
    if (schools.length >= 3) return
    if (schools.some((s) => s.id === school.id)) return
    setSchools((prev) => [...prev, school])
  }

  function removeSchool(id: number) {
    setSchools((prev) => prev.filter((s) => s.id !== id))
  }

  function restart() {
    setStep(1)
    setSchools([])
    setSchoolData({})
    setBelief(null)
    fetchedIds.current.clear()
    window.scrollTo({ top: 0 })
  }

  // Compute report data
  const saiResult = calculateSAI(income, familySize)
  const stateData = getStateByAbbr(stateAbbr)

  const resolvedSchools = schools.map((s) => schoolData[s.id]).filter(Boolean) as SchoolData[]

  const avgSavings = (() => {
    const savingsArr = resolvedSchools
      .map((s) => {
        const net = getNetPriceForIncome(s, income)
        const sticker = s.costOfAttendance
        if (net == null || sticker == null) return null
        return sticker - net
      })
      .filter((v): v is number => v != null && v > 0)
    if (savingsArr.length === 0) return 0
    return Math.round(savingsArr.reduce((a, b) => a + b, 0) / savingsArr.length)
  })()

  const bestValueId = (() => {
    if (resolvedSchools.length < 2) return null
    let best: SchoolData | null = null
    for (const s of resolvedSchools) {
      const net = getNetPriceForIncome(s, income)
      if (net == null) continue
      const bestNet = best ? getNetPriceForIncome(best, income) : null
      if (bestNet == null || net < bestNet) best = s
    }
    return best?.id ?? null
  })()

  const bestOutcomesId = (() => {
    if (resolvedSchools.length < 2) return null
    let best: SchoolData | null = null
    for (const s of resolvedSchools) {
      if (s.medianEarnings10yr == null) continue
      if (best == null || s.medianEarnings10yr > (best.medianEarnings10yr ?? 0)) best = s
    }
    return best?.id ?? null
  })()

  if (step === 'calculating') {
    return (
      <div className="min-h-screen bg-[#0B1D35] flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E8A020] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-white text-xl font-bold mb-2">Pulling real federal data…</p>
          <p className="text-[#8899AA] text-sm">Checking what families like yours actually paid.</p>
        </div>
      </div>
    )
  }

  if (step === 'report') {
    return (
      <main className="min-h-screen bg-[#F4F6F9]">
        <ReportHero
          income={income}
          familySize={familySize}
          stateAbbr={stateAbbr}
          avgSavings={avgSavings}
          belief={belief}
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
          {/* School cards */}
          <div>
            <h2 className="text-[#0B1D35] font-bold text-2xl mb-4">Your Schools, Side by Side</h2>
            <div className="space-y-5">
              {schools.map((s) => {
                const data = schoolData[s.id]
                if (!data) {
                  return loadingSchools ? (
                    <SchoolCardSkeleton key={s.id} />
                  ) : (
                    <div key={s.id} className="bg-white rounded-2xl border border-[#DDE3EA] p-5">
                      <p className="font-bold text-[#0B1D35]">{s.name}</p>
                      <p className="text-[#8899AA] text-sm mt-1">
                        Data temporarily unavailable — live data could not be retrieved.
                      </p>
                    </div>
                  )
                }
                return (
                  <SchoolCard
                    key={s.id}
                    school={data}
                    income={income}
                    userState={stateAbbr}
                    isBestValue={bestValueId === s.id}
                    isBestOutcomes={bestOutcomesId === s.id}
                  />
                )
              })}
            </div>
          </div>

          {/* SAI section */}
          <FormulaBreakdown result={saiResult} />

          {/* State grant */}
          {stateData && <StateGrant stateData={stateData} />}

          {/* CTA (email + FAFSA button + restart) */}
          <CTASection
            avgSavings={avgSavings}
            onRestart={restart}
            income={income}
            familySize={familySize}
            stateAbbr={stateAbbr}
            schools={schools}
            belief={belief}
          />
        </div>
      </main>
    )
  }

  return (
    <main>
      {typeof step === 'number' && <ProgressBar step={step} total={5} />}

      {step === 1 && (
        <IncomeStep
          income={income}
          onChange={setIncome}
          onContinue={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <FamilySizeStep
          familySize={familySize}
          onSelect={(size) => { setFamilySize(size); setStep(3) }}
        />
      )}

      {step === 3 && (
        <StateStep
          selectedState={stateAbbr}
          onSelect={setStateAbbr}
          onContinue={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <SchoolSearchStep
          schools={schools}
          onAdd={addSchool}
          onRemove={removeSchool}
          onContinue={() => setStep(5)}
          userState={stateAbbr}
        />
      )}

      {step === 5 && (
        <BeliefStep onSelect={handleBeliefSelect} />
      )}
    </main>
  )
}
