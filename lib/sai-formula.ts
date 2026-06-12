export interface SAIResult {
  grossIncome: number
  fedTax: number
  fica: number
  ipa: number
  eea: number
  availableIncome: number
  assessmentRate: number
  sai: number
  familySize: number
}

export function calculateSAI(income: number, familySize: number): SAIResult {
  // Income Protection Allowances (IPA) — 2026-27 official table
  const IPA_TABLE: Record<number, number> = {
    2: 29960,
    3: 37280,
    4: 44880,
    5: 52970,
    6: 61730,
  }
  const ipa =
    familySize <= 6
      ? IPA_TABLE[Math.max(2, familySize)] ?? IPA_TABLE[6]
      : IPA_TABLE[6] + (familySize - 6) * 8760

  // Federal income tax liability estimate (2024 MFJ brackets)
  const standardDeduction = familySize >= 3 ? 29200 : 14600
  let taxableRemaining = Math.max(0, income - standardDeduction)
  let fedTax = 0
  const brackets: [number, number][] = [
    [23200, 0.1],
    [94300, 0.12],
    [201050, 0.22],
    [383900, 0.24],
    [487450, 0.32],
    [731200, 0.35],
    [Infinity, 0.37],
  ]
  let prev = 0
  for (const [limit, rate] of brackets) {
    if (taxableRemaining <= 0) break
    const bracketSize = limit === Infinity ? taxableRemaining : limit - prev
    const chunk = Math.min(taxableRemaining, bracketSize)
    fedTax += chunk * rate
    taxableRemaining -= chunk
    prev = limit === Infinity ? prev : limit
  }
  fedTax = Math.round(fedTax)

  // Payroll tax (FICA) — 7.65% up to SS wage base $168,600, then 1.45%
  const ssWageBase = 168600
  const fica =
    income <= ssWageBase
      ? Math.round(income * 0.0765)
      : Math.round(ssWageBase * 0.0765 + (income - ssWageBase) * 0.0145)

  // Employment expense allowance — lesser of 35% of income or $5,000
  const eea = Math.min(Math.round(income * 0.35), 5000)

  // Available income
  const availableIncome = income - fedTax - fica - ipa - eea

  // Progressive assessment rates on Available Income (2026-27 schedule)
  function getRate(ai: number): number {
    if (ai <= 19400) return 0.22
    if (ai <= 24500) return 0.25
    if (ai <= 29600) return 0.29
    if (ai <= 34700) return 0.34
    if (ai <= 43900) return 0.4
    return 0.47
  }

  const rate = getRate(availableIncome)
  const sai = Math.max(-1500, Math.round(availableIncome * rate))

  return {
    grossIncome: income,
    fedTax,
    fica,
    ipa,
    eea,
    availableIncome,
    assessmentRate: rate,
    sai,
    familySize,
  }
}

export function getIncomeBracketLabel(income: number): string {
  if (income <= 30000) return '$0–$30,000'
  if (income <= 48000) return '$30,001–$48,000'
  if (income <= 75000) return '$48,001–$75,000'
  if (income <= 110000) return '$75,001–$110,000'
  return 'over $110,000'
}

export function getIncomeBracket(income: number): string {
  if (income <= 30000) return 'income_level1'
  if (income <= 48000) return 'income_level2'
  if (income <= 75000) return 'income_level3'
  if (income <= 110000) return 'income_level4'
  return 'income_level5'
}
