export interface StateData {
  name: string
  abbr: string
  grant: string
  maxAmount: number
  deadline: string
  urgency: 'asap' | 'early' | 'spring' | 'late' | 'check'
}

export const STATE_DATA: StateData[] = [
  { name: 'Alabama', abbr: 'AL', grant: 'Alabama Student Assistance Program', maxAmount: 1200, deadline: 'Check with your financial aid office', urgency: 'check' },
  { name: 'Alaska', abbr: 'AK', grant: 'Alaska Education Grant', maxAmount: 2000, deadline: 'As soon as possible after Oct. 1, 2025. Awards made while funds exist.', urgency: 'asap' },
  { name: 'Arizona', abbr: 'AZ', grant: 'Arizona Promise Program', maxAmount: 2000, deadline: 'April 1, 2026 (Arizona Promise Program)', urgency: 'spring' },
  { name: 'Arkansas', abbr: 'AR', grant: 'Arkansas Academic Challenge Scholarship', maxAmount: 5000, deadline: 'July 1, 2026 (Academic Challenge)', urgency: 'late' },
  { name: 'California', abbr: 'CA', grant: 'Cal Grant', maxAmount: 12570, deadline: 'March 2, 2026 (date postmarked, Cal Grant)', urgency: 'early' },
  { name: 'Colorado', abbr: 'CO', grant: 'Colorado Student Grant', maxAmount: 1200, deadline: 'Check with your financial aid office', urgency: 'check' },
  { name: 'Connecticut', abbr: 'CT', grant: 'Connecticut Aid to Public College Students', maxAmount: 3250, deadline: 'February 15, 2026 (priority)', urgency: 'early' },
  { name: 'Delaware', abbr: 'DE', grant: 'Delaware Student Excellence Incentive Award', maxAmount: 1000, deadline: 'May 30, 2026', urgency: 'spring' },
  { name: 'District of Columbia', abbr: 'DC', grant: 'DC Tuition Assistance Grant', maxAmount: 10000, deadline: 'June 25, 2026 (DC Tuition Assistance Grant, priority)', urgency: 'late' },
  { name: 'Florida', abbr: 'FL', grant: 'Florida Student Assistance Grant', maxAmount: 2630, deadline: 'May 15, 2026 (date processed)', urgency: 'spring' },
  { name: 'Georgia', abbr: 'GA', grant: 'Georgia Student Finance Commission Grant', maxAmount: 1500, deadline: 'As soon as possible after Oct. 1, 2025', urgency: 'asap' },
  { name: 'Hawaii', abbr: 'HI', grant: 'Hawaii College Student Financial Assistance', maxAmount: 500, deadline: 'Check with your financial aid office', urgency: 'check' },
  { name: 'Idaho', abbr: 'ID', grant: 'Idaho Opportunity Scholarship', maxAmount: 3500, deadline: 'March 1, 2026 (Opportunity Scholarship, priority)', urgency: 'early' },
  { name: 'Illinois', abbr: 'IL', grant: 'Monetary Award Program (MAP)', maxAmount: 6000, deadline: 'As soon as possible after Oct. 1, 2025. Awards made while funds exist. (MAP)', urgency: 'asap' },
  { name: 'Indiana', abbr: 'IN', grant: "Frank O'Bannon Grant", maxAmount: 1100, deadline: "April 15, 2026 (Frank O'Bannon Grant)", urgency: 'spring' },
  { name: 'Iowa', abbr: 'IA', grant: 'Iowa Grant', maxAmount: 1500, deadline: 'July 1, 2026', urgency: 'late' },
  { name: 'Kansas', abbr: 'KS', grant: 'Kansas Comprehensive Grant', maxAmount: 2000, deadline: 'April 1, 2026 (priority)', urgency: 'spring' },
  { name: 'Kentucky', abbr: 'KY', grant: 'Kentucky College Access Program Grant', maxAmount: 2000, deadline: 'As soon as possible after Oct. 1, 2025. Awards made while funds exist.', urgency: 'asap' },
  { name: 'Louisiana', abbr: 'LA', grant: 'Louisiana GO Grant', maxAmount: 3000, deadline: 'July 1, 2027 (Feb. 1, 2026 recommended)', urgency: 'late' },
  { name: 'Maine', abbr: 'ME', grant: 'Maine State Grant', maxAmount: 1250, deadline: 'May 1, 2026', urgency: 'spring' },
  { name: 'Maryland', abbr: 'MD', grant: 'Howard P. Rawlings Educational Excellence Award', maxAmount: 3000, deadline: 'March 1, 2026 (Howard P. Rawlings EEA)', urgency: 'early' },
  { name: 'Massachusetts', abbr: 'MA', grant: 'Massachusetts MASSGrant Plus', maxAmount: 2600, deadline: 'May 1, 2026 (priority)', urgency: 'spring' },
  { name: 'Michigan', abbr: 'MI', grant: 'Michigan Competitive Scholarship', maxAmount: 1000, deadline: 'July 1, 2026 (priority, Michigan Competitive Scholarship)', urgency: 'late' },
  { name: 'Minnesota', abbr: 'MN', grant: 'Minnesota State Grant & North Star Promise', maxAmount: 12840, deadline: 'By 30th day of term (State Grant & North Star Promise)', urgency: 'asap' },
  { name: 'Mississippi', abbr: 'MS', grant: 'Mississippi Tuition Assistance Grant (MTAG)', maxAmount: 1000, deadline: 'Oct. 15, 2026 (MTAG/MESG); April 30, 2026 (HELP Grant)', urgency: 'late' },
  { name: 'Missouri', abbr: 'MO', grant: 'Missouri Access Missouri Grant', maxAmount: 2850, deadline: 'February 2, 2026 (priority); April 1, 2026 final', urgency: 'early' },
  { name: 'Montana', abbr: 'MT', grant: 'Montana University System Honor Scholarship', maxAmount: 1000, deadline: 'As soon as possible after Oct. 1, 2025', urgency: 'asap' },
  { name: 'Nebraska', abbr: 'NE', grant: 'Nebraska Opportunity Grant', maxAmount: 1000, deadline: 'Check with your financial aid office', urgency: 'check' },
  { name: 'Nevada', abbr: 'NV', grant: 'Silver State Opportunity Grant', maxAmount: 2500, deadline: 'As soon as possible after Oct. 1, 2025 (Silver State Opportunity Grant)', urgency: 'asap' },
  { name: 'New Hampshire', abbr: 'NH', grant: 'New Hampshire Granite Guarantee', maxAmount: 500, deadline: 'Check with your financial aid office', urgency: 'check' },
  { name: 'New Jersey', abbr: 'NJ', grant: 'New Jersey Tuition Aid Grant (TAG)', maxAmount: 13100, deadline: 'September 15, 2026 (fall+spring); April 15, 2026 (renewals)', urgency: 'spring' },
  { name: 'New Mexico', abbr: 'NM', grant: 'New Mexico Student Incentive Grant', maxAmount: 2500, deadline: 'Check with your financial aid office', urgency: 'check' },
  { name: 'New York', abbr: 'NY', grant: 'New York Tuition Assistance Program (TAP)', maxAmount: 5665, deadline: 'June 30, 2027 (TAP)', urgency: 'late' },
  { name: 'North Carolina', abbr: 'NC', grant: 'North Carolina Need-Based Scholarship', maxAmount: 3500, deadline: 'As soon as possible after Oct. 1, 2025 (private institutions)', urgency: 'asap' },
  { name: 'North Dakota', abbr: 'ND', grant: 'North Dakota Student Financial Assistance Grant', maxAmount: 1500, deadline: 'As soon as possible after Oct. 1, 2025. Awards made while funds exist.', urgency: 'asap' },
  { name: 'Ohio', abbr: 'OH', grant: 'Ohio College Opportunity Grant', maxAmount: 2760, deadline: 'October 1, 2026', urgency: 'late' },
  { name: 'Oklahoma', abbr: 'OK', grant: 'Oklahoma Tuition Aid Grant', maxAmount: 1000, deadline: 'Check with your financial aid office', urgency: 'check' },
  { name: 'Oregon', abbr: 'OR', grant: 'Oregon Opportunity Grant', maxAmount: 2500, deadline: 'As soon as possible after Oct. 1, 2025 (Oregon Opportunity Grant)', urgency: 'asap' },
  { name: 'Pennsylvania', abbr: 'PA', grant: 'Pennsylvania State Grant', maxAmount: 4696, deadline: 'May 1, 2026 (most applicants)', urgency: 'spring' },
  { name: 'Rhode Island', abbr: 'RI', grant: 'Rhode Island State Grant', maxAmount: 1000, deadline: 'Check with your financial aid office', urgency: 'check' },
  { name: 'South Carolina', abbr: 'SC', grant: 'South Carolina Need-Based Grant', maxAmount: 2500, deadline: 'First come, first served; awards made while funds exist', urgency: 'asap' },
  { name: 'South Dakota', abbr: 'SD', grant: 'South Dakota Need-Based Grant', maxAmount: 500, deadline: 'Check with your financial aid office', urgency: 'check' },
  { name: 'Tennessee', abbr: 'TN', grant: 'Tennessee Student Assistance Award', maxAmount: 1500, deadline: 'April 1, 2026 (State Grant)', urgency: 'spring' },
  { name: 'Texas', abbr: 'TX', grant: 'Texas TEXAS Grant', maxAmount: 5000, deadline: 'January 15, 2026 (priority)', urgency: 'early' },
  { name: 'Utah', abbr: 'UT', grant: 'Utah Centennial Scholarship', maxAmount: 500, deadline: 'Check with your financial aid office. Awards made while funds exist.', urgency: 'check' },
  { name: 'Vermont', abbr: 'VT', grant: 'Vermont Incentive Grant', maxAmount: 12350, deadline: 'As soon as possible after Oct. 1, 2025. Awards made while funds exist.', urgency: 'asap' },
  { name: 'Virginia', abbr: 'VA', grant: 'Virginia Guaranteed Assistance Program', maxAmount: 3000, deadline: 'As soon as possible after Oct. 1, 2025', urgency: 'asap' },
  { name: 'Washington', abbr: 'WA', grant: 'Washington College Grant', maxAmount: 13200, deadline: 'As soon as possible after Oct. 1, 2025', urgency: 'asap' },
  { name: 'West Virginia', abbr: 'WV', grant: 'WV Higher Education Grant', maxAmount: 3000, deadline: 'April 15, 2026 (WV Higher Education Grant)', urgency: 'spring' },
  { name: 'Wisconsin', abbr: 'WI', grant: 'Wisconsin Grant', maxAmount: 3150, deadline: 'Check with your financial aid office', urgency: 'check' },
  { name: 'Wyoming', abbr: 'WY', grant: 'Wyoming Need-Based Grant', maxAmount: 500, deadline: 'Check with your financial aid office', urgency: 'check' },
]

export function getStateByAbbr(abbr: string): StateData | undefined {
  return STATE_DATA.find((s) => s.abbr === abbr)
}

export function getStateByName(name: string): StateData | undefined {
  return STATE_DATA.find((s) => s.name.toLowerCase() === name.toLowerCase())
}
