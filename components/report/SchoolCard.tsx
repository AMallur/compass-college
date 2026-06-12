'use client'

import { SchoolData, getNetPriceForIncome, getOwnershipLabel } from '@/lib/scorecard'
import { getIncomeBracketLabel } from '@/lib/sai-formula'

interface SchoolCardProps {
  school: SchoolData
  income: number
  userState: string
  isBestValue?: boolean
  isBestOutcomes?: boolean
}

function fmt(n: number | null, prefix = '$'): string {
  if (n == null) return 'N/A'
  return prefix + Math.round(n).toLocaleString()
}

function fmtPct(n: number | null): string {
  if (n == null) return 'N/A'
  return Math.round(n * 100) + '%'
}

export default function SchoolCard({
  school,
  income,
  userState,
  isBestValue,
  isBestOutcomes,
}: SchoolCardProps) {
  const netPrice = getNetPriceForIncome(school, income)
  const sticker = school.costOfAttendance
  const savings = sticker && netPrice ? sticker - netPrice : null
  const isInState = school.state === userState
  const bracketLabel = getIncomeBracketLabel(income)

  return (
    <div className="bg-white rounded-2xl border border-[#DDE3EA] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#DDE3EA] flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-[#0B1D35] text-lg leading-tight">{school.name}</h3>
          </div>
          <p className="text-[#8899AA] text-sm">
            {school.city}, {school.state}
            {isInState && (
              <span className="ml-2 text-[#0D9E6E] font-medium text-xs">· In-state rates apply</span>
            )}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#F4F6F9] text-[#8899AA] border border-[#DDE3EA]">
            {getOwnershipLabel(school.ownership)}
          </span>
          {isBestValue && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#0D9E6E]/10 text-[#0D9E6E] border border-[#0D9E6E]/30">
              ★ Best Value
            </span>
          )}
          {isBestOutcomes && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
              ★ Best Outcomes
            </span>
          )}
        </div>
      </div>

      {/* Cost comparison */}
      <div className="p-5">
        {netPrice == null ? (
          <div className="bg-[#F4F6F9] rounded-xl p-4 text-center">
            <p className="text-[#8899AA] text-sm">Federal net price data not available for this school.</p>
            {school.schoolUrl && (
              <p className="text-sm mt-1">
                We recommend using their official{' '}
                <a
                  href={`https://${school.schoolUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0B1D35] underline font-medium"
                >
                  Net Price Calculator
                </a>
                .
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#F4F6F9] rounded-xl p-4">
                <p className="text-xs font-semibold text-[#8899AA] uppercase tracking-wide mb-1">Sticker Price</p>
                <p className="font-barlow text-3xl font-bold text-[#0B1D35]">{fmt(sticker)}</p>
                <p className="text-[#8899AA] text-xs mt-1">per year</p>
              </div>
              <div className="bg-[#0D9E6E]/8 rounded-xl p-4 border border-[#0D9E6E]/20">
                <p className="text-xs font-semibold text-[#0D9E6E] uppercase tracking-wide mb-1">Families Like Yours Paid</p>
                <p className="font-barlow text-3xl font-bold text-[#0D9E6E]">{fmt(netPrice)}</p>
                <p className="text-[#8899AA] text-xs mt-1">per year</p>
              </div>
            </div>

            <p className="text-[#8899AA] text-xs mb-4">
              Based on federal data for families earning {bracketLabel}
              {income > 110000 && ' — data shown for the $110,001+ bracket'}
            </p>

            {savings != null && savings > 0 && (
              <div className="bg-[#0D9E6E]/10 border border-[#0D9E6E]/25 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                <span className="text-[#0D9E6E] font-bold text-base">
                  You&apos;d save {fmt(savings)}/yr vs. sticker
                </span>
                <span className="text-[#8899AA] text-xs text-right">
                  Over 4 years:<br />
                  <span className="font-semibold text-[#0B1D35]">{fmt(netPrice * 4)}</span>{' '}
                  vs. <span className="line-through">{fmt(sticker ? sticker * 4 : null)}</span>
                </span>
              </div>
            )}

            {isInState && school.tuitionInState != null && school.tuitionOutOfState != null && (
              <p className="text-[#8899AA] text-xs mb-4">
                In-state tuition: {fmt(school.tuitionInState)} · Out-of-state: {fmt(school.tuitionOutOfState)}
              </p>
            )}
          </>
        )}

        {/* Secondary metrics */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#DDE3EA]">
          <div className="text-center">
            <p className="text-xs text-[#8899AA] mb-1">Grad Rate</p>
            <p className="font-barlow text-xl font-bold text-[#0B1D35]">{fmtPct(school.completionRate)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#8899AA] mb-1">Earnings 10yr</p>
            <p className="font-barlow text-xl font-bold text-[#0B1D35]">{fmt(school.medianEarnings10yr)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#8899AA] mb-1">Median Debt</p>
            <p className="font-barlow text-xl font-bold text-[#0B1D35]">{fmt(school.medianDebt)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
