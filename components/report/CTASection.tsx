'use client'

import { useState } from 'react'

interface CTASectionProps {
  avgSavings: number
  onRestart: () => void
}

export default function CTASection({ avgSavings, onRestart }: CTASectionProps) {
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const [skipped, setSkipped] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSaved(true)
  }

  function handleCopy() {
    const text = `My College Cost Reality Check: Families like mine pay an average of $${avgSavings.toLocaleString()} less than sticker price. Generated at compass-college.com`
    navigator.clipboard.writeText(text).catch(() => {})
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Email capture */}
      {!saved && !skipped && (
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
              className="flex-1 px-4 py-3 rounded-xl border border-[#DDE3EA] text-[#0B1D35] focus:outline-none focus:ring-2 focus:ring-[#E8A020] text-sm"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#0B1D35] text-white font-semibold rounded-xl hover:bg-[#0B1D35]/80 transition-colors text-sm whitespace-nowrap"
            >
              Save my report
            </button>
          </form>
          <button
            onClick={() => setSkipped(true)}
            className="mt-3 text-xs text-[#8899AA] underline underline-offset-2 hover:text-[#0B1D35]"
          >
            Continue without saving →
          </button>
        </div>
      )}

      {saved && (
        <div className="bg-[#0D9E6E]/10 border border-[#0D9E6E]/30 rounded-2xl px-6 py-5 text-center">
          <p className="text-[#0D9E6E] font-bold text-lg">✓ Report saved!</p>
          <p className="text-[#8899AA] text-sm mt-1">We&apos;ll remind you before your state grant deadline.</p>
        </div>
      )}

      {/* Primary CTA */}
      <div className="bg-[#0B1D35] rounded-2xl px-6 py-8 text-center">
        <a
          href="https://fafsa.ed.gov"
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
            onClick={handlePrint}
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
