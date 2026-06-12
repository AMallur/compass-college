'use client'

import { useEffect, useRef, useState } from 'react'
import { SchoolSearchResult } from '@/lib/scorecard'

interface SearchInputProps {
  onSelect: (school: SchoolSearchResult) => void
  disabled?: boolean
  userState?: string
}

export default function SearchInput({ onSelect, disabled, userState }: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SchoolSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setResults(data)
          setOpen(data.length > 0)
        }
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  function handleSelect(school: SchoolSearchResult) {
    onSelect(school)
    setQuery('')
    setResults([])
    setOpen(false)
  }

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-[#8899AA]">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled}
          placeholder={disabled ? 'Maximum 3 schools added' : 'Search for a college or university…'}
          className="w-full pl-11 pr-4 py-4 rounded-xl border border-[#DDE3EA] bg-white text-[#0B1D35] placeholder-[#8899AA] text-base focus:outline-none focus:ring-2 focus:ring-[#E8A020] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {loading && (
          <div className="absolute right-4">
            <div className="w-5 h-5 border-2 border-[#E8A020] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-[#DDE3EA] rounded-xl shadow-lg overflow-hidden">
          {results.length === 0 && query.length >= 2 && !loading && (
            <li className="px-4 py-3 text-sm text-[#8899AA]">
              No matches found. Try a shorter search (e.g., &ldquo;Purdue&rdquo; instead of &ldquo;Purdue University West Lafayette&rdquo;)
            </li>
          )}
          {results.map((school) => (
            <li key={school.id}>
              <button
                type="button"
                onMouseDown={() => handleSelect(school)}
                className="w-full text-left px-4 py-3 hover:bg-[#F4F6F9] transition-colors flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-medium text-[#0B1D35] text-sm">{school.name}</div>
                  <div className="text-xs text-[#8899AA] mt-0.5">
                    {school.city}, {school.state}
                    {userState && school.state === userState && (
                      <span className="ml-2 text-[#0D9E6E] font-medium">· In-state</span>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-xs text-[#8899AA] border border-[#DDE3EA] rounded-full px-2 py-0.5">
                  {school.ownership === 1 ? 'Public' : school.ownership === 2 ? 'Private' : 'For-Profit'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!loading && query.length >= 2 && results.length === 0 && !open && (
        <p className="mt-2 text-sm text-[#8899AA]">
          No matches. Try a shorter name — e.g. &ldquo;Purdue&rdquo; instead of &ldquo;Purdue University West Lafayette&rdquo;.
        </p>
      )}
    </div>
  )
}
