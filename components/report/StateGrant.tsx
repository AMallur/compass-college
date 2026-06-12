'use client'

import { StateData } from '@/lib/state-data'

interface StateGrantProps {
  stateData: StateData
}

export default function StateGrant({ stateData }: StateGrantProps) {
  const isAsap = stateData.urgency === 'asap'
  const isEarly = stateData.urgency === 'early'

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-sm ${
        isAsap
          ? 'border-amber-300 bg-amber-50'
          : isEarly
          ? 'border-amber-200 bg-amber-50/50'
          : stateData.urgency === 'check'
          ? 'border-[#DDE3EA] bg-white'
          : 'border-blue-200 bg-blue-50/50'
      }`}
    >
      <div className="px-6 py-5">
        {isAsap && (
          <div className="flex items-center gap-2 mb-3 text-amber-700">
            <span className="text-xl">⚠️</span>
            <p className="font-bold text-sm">
              {stateData.name} awards grants as funds run out. File immediately.
            </p>
          </div>
        )}

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="font-bold text-[#0B1D35] text-lg mb-1">{stateData.grant}</h3>
            <p
              className={`text-sm font-medium mb-1 ${
                isAsap ? 'text-amber-700' : isEarly ? 'text-amber-600' : stateData.urgency === 'check' ? 'text-[#8899AA]' : 'text-blue-700'
              }`}
            >
              {isAsap && '⚠️ '}
              {isEarly && '🔔 File before '}
              {stateData.deadline}
            </p>
            <p className="text-[#8899AA] text-xs">
              {stateData.urgency === 'check' ? 'Check with your financial aid office for deadline details.' : ''}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-barlow text-3xl font-bold text-[#0D9E6E]">
              ${stateData.maxAmount.toLocaleString()}
            </p>
            <p className="text-[#8899AA] text-xs">max / year</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-black/5">
          <p className="text-[#0B1D35] text-sm font-medium">
            💡 This grant <strong>stacks on top</strong> of what the schools above offer — it&apos;s additional free money.
          </p>
        </div>
      </div>
    </div>
  )
}
