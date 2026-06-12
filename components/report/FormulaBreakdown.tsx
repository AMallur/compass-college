'use client'

import { useState } from 'react'
import { SAIResult } from '@/lib/sai-formula'

interface FormulaBreakdownProps {
  result: SAIResult
}

function fmt(n: number): string {
  const abs = Math.abs(Math.round(n))
  const sign = n < 0 ? '-' : ''
  return sign + '$' + abs.toLocaleString()
}

export default function FormulaBreakdown({ result }: FormulaBreakdownProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-[#DDE3EA] overflow-hidden shadow-sm">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-[#0B1D35] text-lg">Your Estimated SAI</h3>
          <span className="font-barlow text-4xl font-bold text-[#0B1D35]">
            {result.sai <= 0 ? fmt(result.sai) : fmt(result.sai)}
          </span>
        </div>
        <p className="text-[#8899AA] text-sm mb-4">
          This number determines how much aid you qualify for.{' '}
          <strong className="text-[#0B1D35]">Lower = more aid.</strong>
          {result.sai < 0 && ' A negative SAI typically means maximum Pell Grant eligibility.'}
        </p>

        <button
          onClick={() => setOpen(!open)}
          className="text-sm text-[#0B1D35] font-semibold underline underline-offset-2 flex items-center gap-1"
        >
          How was this calculated?
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <div className="mt-4 bg-[#F4F6F9] rounded-xl p-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8899AA]">Gross income (AGI)</span>
                <span className="font-semibold text-[#0B1D35]">{fmt(result.grossIncome)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Federal income tax</span>
                <span className="font-semibold">− {fmt(result.fedTax)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>FICA payroll taxes</span>
                <span className="font-semibold">− {fmt(result.fica)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Income Protection Allowance (IPA)</span>
                <span className="font-semibold">− {fmt(result.ipa)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Employment expense allowance</span>
                <span className="font-semibold">− {fmt(result.eea)}</span>
              </div>
              <div className="flex justify-between border-t border-[#DDE3EA] pt-2 mt-2">
                <span className="font-semibold text-[#0B1D35]">Available income</span>
                <span className="font-bold text-[#0B1D35]">{fmt(result.availableIncome)}</span>
              </div>
              <div className="flex justify-between text-[#8899AA]">
                <span>Assessment rate</span>
                <span>{Math.round(result.assessmentRate * 100)}%</span>
              </div>
              <div className="flex justify-between border-t border-[#DDE3EA] pt-2 mt-2">
                <span className="font-bold text-[#0B1D35]">Estimated SAI</span>
                <span className="font-bold text-[#0B1D35] text-base">{fmt(result.sai)}</span>
              </div>
            </div>
            <p className="text-[#8899AA] text-xs mt-3">
              2026–27 FAFSA Formula A (dependent students). Based on income only — full formula also considers assets.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
