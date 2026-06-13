import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { calculateSAI } from '@/lib/sai-formula'
import { getStateByAbbr } from '@/lib/state-data'
import { buildReportEmail } from '@/lib/email-template'
import { SchoolData, getNetPriceForIncome } from '@/lib/scorecard'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body?.email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const email = String(body.email).toLowerCase().trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const income: number = body.income ?? 80000
  const familySize: number = body.familySize ?? 4
  const stateAbbr: string = body.state ?? ''
  const schools: SchoolData[] = body.schools ?? []
  const belief: string = body.belief ?? ''

  // 1. Save to Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
  )

  const { error: dbError } = await supabase.from('email_captures').insert({
    email,
    income,
    family_size: familySize,
    state: stateAbbr,
    schools: schools.map((s: SchoolData) => ({ id: s.id, name: s.name, state: s.state })),
    belief,
  })

  if (dbError && dbError.code !== '23505') {
    console.error('Supabase insert error:', dbError.message)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  // 2. Build and send email via Resend
  const resend = new Resend(process.env.RESEND_API_KEY!)
  const sai = calculateSAI(income, familySize)
  const stateData = getStateByAbbr(stateAbbr)

  if (stateData && schools.length > 0) {
    const savingsArr = schools
      .map((s: SchoolData) => {
        const net = getNetPriceForIncome(s, income)
        const sticker = s.costOfAttendance
        if (net == null || sticker == null) return null
        return sticker - net
      })
      .filter((v): v is number => v != null && v > 0)

    const avgSavings =
      savingsArr.length > 0
        ? Math.round(savingsArr.reduce((a, b) => a + b, 0) / savingsArr.length)
        : 0

    const { subject, html } = buildReportEmail({
      income,
      familySize,
      stateAbbr,
      schools,
      sai,
      stateData,
      avgSavings,
    })

    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
      to: email,
      subject,
      html,
    })

    if (emailError) {
      // Log but don't fail the request — email is best-effort, save succeeded
      console.error('Resend error:', emailError)
    }
  }

  return NextResponse.json({ ok: true })
}
