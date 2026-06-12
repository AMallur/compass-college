import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://api.data.gov/ed/collegescorecard/v1/schools'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

  const apiKey = process.env.SCORECARD_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    'school.name': q,
    'school.degrees_awarded.predominant': '3',
    fields: 'id,school.name,school.city,school.state,school.ownership,latest.student.size',
    per_page: '10',
    sort: 'latest.student.size:desc',
  })

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`, {
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream API error' }, { status: 502 })
    }

    const data = await res.json()
    const results = (data.results ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r: Record<string, any>) => ({
        id: r['id'],
        name: r['school.name'],
        city: r['school.city'],
        state: r['school.state'],
        ownership: r['school.ownership'],
      })
    )

    return NextResponse.json(results)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 })
  }
}
