import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body?.email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const email = String(body.email).toLowerCase().trim()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { error } = await supabase.from('email_captures').insert({
    email,
    income: body.income ?? null,
    family_size: body.familySize ?? null,
    state: body.state ?? null,
    schools: body.schools ?? null,
    belief: body.belief ?? null,
  })

  // Unique constraint violation = already subscribed — treat as success
  if (error && error.code !== '23505') {
    console.error('Supabase insert error:', error.message)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
