'use client'

import { useState } from 'react'
import { SchoolData, SchoolSearchResult } from '@/lib/scorecard'
import { BeliefAnswer } from '@/components/steps/BeliefStep'

interface CTASectionProps {
  avgSavings: number
  onRestart: () => void
  income: number
  familySize: number
  stateAbbr: string
  schools: SchoolSearchResult[]
  resolvedSchools: SchoolData[]
  belief: BeliefAnswer | null
}

type SubmitState = 'idle' | 'loading' | 'saved' | 'error' | 'skipped'

export default function CTASection({
  avgSavings,
  onRestart,
  income,
  familySize,
  stateAbbr,
  schools,
  resolvedSchools,
  belief,
}: CTASectionProps) {
  const [email, setEmail] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitState('loading')

    try {
      const res = await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          income,
          familySize,
          state: stateAbbr,
          schools: resolvedSchools,
          belief,
        }),
      })

      if (!res.ok) throw new Error('Request failed')
      setSubmitState('saved')
    } catch {
      setSubmitState('error')
    }
  }

  function handleCopy() {
    const text = `My College Cost Reality Check: Families like mine pay an average of $${avgSavings.toLocaleString()} less than sticker price. Generated at compass-college.com`
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <div className="space-y-6">
      {/* Email capture */}
      {submitState !== 'saved' && submitState !== 'skipped' && (
        <div className="bg-white rounded-2xl border border-[#DDE3EA] shadow-sm px-6 py-5">
          <h3 className="font-bold text-[#0B1D35] text-lg mb-1">Save this report + get deadline reminders</h3>
          <p className="text-[#8899AA] text-sm mb-4">
            No spam. Compass sends one reminder before your state deadline.
          </p>
          <form onSubmit={handleSave} className="flex gap-3 flex-col sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={submitState === 'loading'}
              className="flex-1 px-4 py-3 rounded-xl border border-[#DDE3EA] text-[#0B1D35] focus:outline-none focus:ring-2 focus:ring-[#E8A020] text-sm disabled:opacity-50"
              required
            />
            <button
              type="submit"
              disabled={submitState === 'loading'}
              className="px-6 py-3 bg-[#0B1D35] text-white font-semibold rounded-xl hover:bg-[#0B1D35]/80 transition-colors text-sm whitespace-nowrap disabled:opacity-50 flex items-center gap-2 justify-center"
            >
              {submitState === 'loading' && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Save my report
            </button>
          </form>
          {submitState === 'error' && (
            <p className="mt-2 text-sm text-red-600">Something went wrong — please try again.</p>
          )}
          <button
            onClick={() => setSubmitState('skipped')}
            className="mt-3 text-xs text-[#8899AA] underline underline-offset-2 hover:text-[#0B1D35]"
          >
            Continue without saving →
          </button>
        </div>
      )}

      {submitState === 'saved' && (
        <div className="bg-[#0D9E6E]/10 border border-[#0D9E6E]/30 rounded-2xl px-6 py-5 text-center">
          <p className="text-[#0D9E6E] font-bold text-lg">✓ Report saved!</p>
          <p className="text-[#8899AA] text-sm mt-1">We&apos;ll remind you before your state grant deadline.</p>
        </div>
      )}

      {/* Primary CTA */}
      <div className="bg-[#0B1D35] rounded-2xl px-6 py-8 text-center">
        <a
          href="https://studentaid.gov/h/apply-for-aid/fafsa"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full py-4 rounded-xl bg-[#E8A020] text-[#0B1D35] font-bold text-lg hover:bg-amber-400 active:scale-95 transition-all mb-6"
        >
          Start my FAFSA — lock in these numbers →
        </a>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 text-white/80 text-sm">
          <span>✓ Takes 25 minutes</span>
          <span>✓ Your answers pre-fill most of it</span>
          <span>✓ Free — no credit card ever</span>
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={handleCopy}
            className="text-white/60 text-sm underline underline-offset-2 hover:text-white"
          >
            Copy results to share
          </button>
          <button
            onClick={() => window.print()}
            className="text-white/60 text-sm underline underline-offset-2 hover:text-white"
          >
            Print report
          </button>
        </div>
      </div>

      {/* Restart */}
      <div className="text-center">
        <button
          onClick={onRestart}
          className="text-[#8899AA] text-sm underline underline-offset-2 hover:text-[#0B1D35]"
        >
          Try different schools or income →
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-[#8899AA] text-xs leading-relaxed text-center max-w-2xl mx-auto">
        Net prices are federal data for the most recent available year. Actual aid depends on your complete financial
        situation and each school&apos;s policies. This is educational guidance, not a guarantee. State grant amounts from
        official program publications; verify current amounts with your state agency.
      </p>
    </div>
  )
}
