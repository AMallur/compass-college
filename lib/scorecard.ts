export interface SchoolSearchResult {
  id: number
  name: string
  city: string
  state: string
  ownership: number
}

export interface SchoolData {
  id: number
  name: string
  city: string
  state: string
  ownership: number
  schoolUrl: string | null
  tuitionInState: number | null
  tuitionOutOfState: number | null
  costOfAttendance: number | null
  netPriceLevel1: number | null
  netPriceLevel2: number | null
  netPriceLevel3: number | null
  netPriceLevel4: number | null
  netPriceLevel5: number | null
  avgNetPrice: number | null
  pellGrantRate: number | null
  medianDebt: number | null
  studentsWithLoans: number | null
  completionRate: number | null
  medianEarnings10yr: number | null
  repaymentRate3yr: number | null
}

export function getNetPriceForIncome(school: SchoolData, income: number): number | null {
  if (income <= 30000) return school.netPriceLevel1
  if (income <= 48000) return school.netPriceLevel2
  if (income <= 75000) return school.netPriceLevel3
  if (income <= 110000) return school.netPriceLevel4
  return school.netPriceLevel5
}

export function getOwnershipLabel(ownership: number): string {
  if (ownership === 1) return 'Public'
  if (ownership === 2) return 'Private Nonprofit'
  return 'Private For-Profit'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapScorecardResult(raw: Record<string, any>): SchoolData {
  return {
    id: raw['id'],
    name: raw['school.name'],
    city: raw['school.city'],
    state: raw['school.state'],
    ownership: raw['school.ownership'],
    schoolUrl: raw['school.school_url'] ?? null,
    tuitionInState: raw['latest.cost.tuition.in_state'] ?? null,
    tuitionOutOfState: raw['latest.cost.tuition.out_of_state'] ?? null,
    costOfAttendance: raw['latest.cost.attendance.academic_year'] ?? null,
    netPriceLevel1: raw['latest.cost.net_price.consumer.by_income.dependent.income_level1'] ?? null,
    netPriceLevel2: raw['latest.cost.net_price.consumer.by_income.dependent.income_level2'] ?? null,
    netPriceLevel3: raw['latest.cost.net_price.consumer.by_income.dependent.income_level3'] ?? null,
    netPriceLevel4: raw['latest.cost.net_price.consumer.by_income.dependent.income_level4'] ?? null,
    netPriceLevel5: raw['latest.cost.net_price.consumer.by_income.dependent.income_level5'] ?? null,
    avgNetPrice: raw['latest.cost.avg_net_price.consumer'] ?? null,
    pellGrantRate: raw['latest.aid.pell_grant_rate'] ?? null,
    medianDebt: raw['latest.aid.median_debt.completers.overall'] ?? null,
    studentsWithLoans: raw['latest.aid.students_with_any_loan'] ?? null,
    completionRate: raw['latest.completion.rate_suppressed.overall'] ?? null,
    medianEarnings10yr: raw['latest.earnings.10_yrs_after_entry.median'] ?? null,
    repaymentRate3yr: raw['latest.repayment.3_yr_repayment.overall'] ?? null,
  }
}

export const SCORECARD_FIELDS = [
  'id',
  'school.name',
  'school.city',
  'school.state',
  'school.ownership',
  'school.school_url',
  'latest.cost.tuition.in_state',
  'latest.cost.tuition.out_of_state',
  'latest.cost.attendance.academic_year',
  'latest.cost.net_price.consumer.by_income.dependent.income_level1',
  'latest.cost.net_price.consumer.by_income.dependent.income_level2',
  'latest.cost.net_price.consumer.by_income.dependent.income_level3',
  'latest.cost.net_price.consumer.by_income.dependent.income_level4',
  'latest.cost.net_price.consumer.by_income.dependent.income_level5',
  'latest.cost.avg_net_price.consumer',
  'latest.aid.pell_grant_rate',
  'latest.aid.median_debt.completers.overall',
  'latest.aid.students_with_any_loan',
  'latest.completion.rate_suppressed.overall',
  'latest.earnings.10_yrs_after_entry.median',
  'latest.repayment.3_yr_repayment.overall',
].join(',')
