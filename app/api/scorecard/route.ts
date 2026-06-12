import { NextRequest, NextResponse } from 'next/server'
import { SCORECARD_FIELDS, mapScorecardResult } from '@/lib/scorecard'

const BASE_URL = 'https://api.data.gov/ed/collegescorecard/v1/schools'

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get('ids')
  if (!idsParam) {
    return NextResponse.json({ error: 'ids parameter required' }, { status: 400 })
  }

  const ids = idsParam
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 3)

  if (ids.length === 0) {
    return NextResponse.json({ error: 'No valid IDs provided' }, { status: 400 })
  }

  const apiKey = process.env.SCORECARD_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    const results = await Promise.all(
      ids.map(async (id) => {
        const params = new URLSearchParams({
          api_key: apiKey,
          id,
          fields: SCORECARD_FIELDS,
          per_page: '1',
        })

        const res = await fetch(`${BASE_URL}?${params.toString()}`, {
          next: { revalidate: 3600 },
        })

        if (!res.ok) return null

        const data = await res.json()
        const raw = data.results?.[0]
        if (!raw) return null

        return mapScorecardResult(raw)
      })
    )

    return NextResponse.json(results.filter(Boolean))
  } catch {
    return NextResponse.json({ error: 'Failed to fetch school data' }, { status: 500 })
  }
}
