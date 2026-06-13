import { SchoolData, getNetPriceForIncome, getOwnershipLabel } from './scorecard'
import { SAIResult } from './sai-formula'
import { StateData } from './state-data'

function fmt(n: number | null): string {
  if (n == null) return 'N/A'
  return '$' + Math.round(n).toLocaleString()
}

function fmtPct(n: number | null): string {
  if (n == null) return 'N/A'
  return Math.round(n * 100) + '%'
}

function bracketLabel(income: number): string {
  if (income <= 30000) return '$0–$30,000'
  if (income <= 48000) return '$30,001–$48,000'
  if (income <= 75000) return '$48,001–$75,000'
  if (income <= 110000) return '$75,001–$110,000'
  return 'over $110,000'
}

const URGENCY_COLOR: Record<StateData['urgency'], string> = {
  asap: '#C0392B',
  early: '#E8A020',
  spring: '#1a73e8',
  late: '#1a73e8',
  check: '#8899AA',
}

function schoolBlock(school: SchoolData, income: number, userState: string): string {
  const netPrice = getNetPriceForIncome(school, income)
  const sticker = school.costOfAttendance
  const savings = sticker && netPrice ? sticker - netPrice : null
  const isInState = school.state === userState

  const noDataBlock = `
    <div style="background:#F4F6F9;border-radius:8px;padding:16px;text-align:center;color:#8899AA;font-size:14px;">
      Federal net price data not available for this school.
      ${school.schoolUrl ? `Visit <a href="https://${school.schoolUrl}" style="color:#0B1D35;">their Net Price Calculator</a> for an estimate.` : ''}
    </div>`

  const priceBlock = netPrice == null ? noDataBlock : `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
      <tr>
        <td width="50%" style="padding-right:8px;">
          <div style="background:#F4F6F9;border-radius:8px;padding:16px;">
            <div style="font-size:11px;font-weight:600;color:#8899AA;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Sticker Price</div>
            <div style="font-size:28px;font-weight:700;color:#0B1D35;font-family:Arial Narrow,sans-serif;">${fmt(sticker)}</div>
            <div style="font-size:12px;color:#8899AA;margin-top:2px;">per year</div>
          </div>
        </td>
        <td width="50%" style="padding-left:8px;">
          <div style="background:#e8f9f3;border-radius:8px;padding:16px;border:1px solid #b2e8d4;">
            <div style="font-size:11px;font-weight:600;color:#0D9E6E;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Families Like Yours Paid</div>
            <div style="font-size:28px;font-weight:700;color:#0D9E6E;font-family:Arial Narrow,sans-serif;">${fmt(netPrice)}</div>
            <div style="font-size:12px;color:#8899AA;margin-top:2px;">per year</div>
          </div>
        </td>
      </tr>
    </table>
    <p style="font-size:12px;color:#8899AA;margin:0 0 12px;">Based on federal data for families earning ${bracketLabel(income)}${income > 110000 ? ' — data shown for the $110,001+ bracket' : ''}</p>
    ${savings && savings > 0 ? `
    <div style="background:#e8f9f3;border:1px solid #b2e8d4;border-radius:8px;padding:12px 16px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#0D9E6E;font-weight:700;font-size:16px;">You'd save ${fmt(savings)}/yr vs. sticker</span>
      <span style="color:#8899AA;font-size:12px;text-align:right;">Over 4 years:<br><strong style="color:#0B1D35;">${fmt(netPrice * 4)}</strong> vs. <span style="text-decoration:line-through;">${fmt(sticker ? sticker * 4 : null)}</span></span>
    </div>` : ''}
    ${isInState && school.tuitionInState ? `<p style="font-size:12px;color:#0D9E6E;margin:0 0 12px;">✓ In-state rates apply · In-state tuition: ${fmt(school.tuitionInState)} · Out-of-state: ${fmt(school.tuitionOutOfState)}</p>` : ''}
    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #DDE3EA;padding-top:12px;margin-top:4px;">
      <tr>
        <td width="33%" style="text-align:center;padding:8px 4px;">
          <div style="font-size:11px;color:#8899AA;margin-bottom:4px;">Grad Rate</div>
          <div style="font-size:20px;font-weight:700;color:#0B1D35;font-family:Arial Narrow,sans-serif;">${fmtPct(school.completionRate)}</div>
        </td>
        <td width="33%" style="text-align:center;padding:8px 4px;">
          <div style="font-size:11px;color:#8899AA;margin-bottom:4px;">Earnings 10yr</div>
          <div style="font-size:20px;font-weight:700;color:#0B1D35;font-family:Arial Narrow,sans-serif;">${fmt(school.medianEarnings10yr)}</div>
        </td>
        <td width="33%" style="text-align:center;padding:8px 4px;">
          <div style="font-size:11px;color:#8899AA;margin-bottom:4px;">Median Debt</div>
          <div style="font-size:20px;font-weight:700;color:#0B1D35;font-family:Arial Narrow,sans-serif;">${fmt(school.medianDebt)}</div>
        </td>
      </tr>
    </table>`

  return `
    <div style="background:#ffffff;border:1px solid #DDE3EA;border-radius:12px;padding:20px;margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
        <div>
          <h3 style="margin:0 0 4px;font-size:18px;font-weight:700;color:#0B1D35;">${school.name}</h3>
          <p style="margin:0;font-size:13px;color:#8899AA;">${school.city}, ${school.state}${isInState ? ' · <span style="color:#0D9E6E;">In-state</span>' : ''}</p>
        </div>
        <span style="font-size:12px;color:#8899AA;border:1px solid #DDE3EA;border-radius:20px;padding:3px 10px;white-space:nowrap;">${getOwnershipLabel(school.ownership)}</span>
      </div>
      ${priceBlock}
    </div>`
}

export function buildReportEmail(params: {
  income: number
  familySize: number
  stateAbbr: string
  schools: SchoolData[]
  sai: SAIResult
  stateData: StateData
  avgSavings: number
}): { subject: string; html: string } {
  const { income, familySize, stateAbbr, schools, sai, stateData, avgSavings } = params

  const schoolNames = schools.map((s) => s.name.split(' ').slice(0, 2).join(' ')).join(', ')
  const subject = `Your College Cost Reality Check — ${schoolNames}`

  const urgencyColor = URGENCY_COLOR[stateData.urgency]
  const urgencyBg = stateData.urgency === 'asap' ? '#fff5f5' : stateData.urgency === 'early' ? '#fffbf0' : '#f0f7ff'
  const urgencyBorder = stateData.urgency === 'asap' ? '#ffcdd2' : stateData.urgency === 'early' ? '#fde8b0' : '#c2d9f5'
  const urgencyLabel = stateData.urgency === 'asap'
    ? `⚠️ <strong>${stateData.name} awards grants as funds run out. File immediately.</strong>`
    : stateData.urgency === 'early'
    ? `🔔 File before: ${stateData.deadline}`
    : stateData.deadline

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#F4F6F9;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F9;">
  <tr><td align="center" style="padding:32px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

      <!-- HEADER -->
      <tr><td style="background:#0B1D35;border-radius:16px 16px 0 0;padding:40px 32px;text-align:center;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#E8A020;letter-spacing:0.1em;text-transform:uppercase;">College Cost Reality Check · 2026–27</p>
        <p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.6);">Family of ${familySize} · $${income.toLocaleString()}/yr · ${stateData.name}</p>
        ${avgSavings > 0 ? `
        <p style="margin:0 0 4px;font-size:15px;color:rgba(255,255,255,0.7);">Families like yours paid an average of</p>
        <p style="margin:0 0 4px;font-size:64px;font-weight:700;color:#0D9E6E;font-family:Arial Narrow,sans-serif;line-height:1;">$${avgSavings.toLocaleString()}</p>
        <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.7);">less per year than sticker price</p>
        ` : `<p style="margin:0;font-size:20px;font-weight:700;color:#fff;">Your personalized college cost report</p>`}
      </td></tr>

      <!-- BODY -->
      <tr><td style="background:#ffffff;padding:32px;">

        <!-- SCHOOLS -->
        <h2 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#0B1D35;">Your Schools, Side by Side</h2>
        ${schools.map((s) => schoolBlock(s, income, stateAbbr)).join('')}

        <!-- SAI -->
        <div style="background:#ffffff;border:1px solid #DDE3EA;border-radius:12px;padding:20px;margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <h3 style="margin:0;font-size:18px;font-weight:700;color:#0B1D35;">Your Estimated SAI</h3>
            <span style="font-size:32px;font-weight:700;color:#0B1D35;font-family:Arial Narrow,sans-serif;">$${sai.sai.toLocaleString()}</span>
          </div>
          <p style="margin:0 0 16px;font-size:14px;color:#8899AA;">This number determines how much aid you qualify for. <strong style="color:#0B1D35;">Lower = more aid.</strong>${sai.sai < 0 ? ' A negative SAI typically means maximum Pell Grant eligibility.' : ''}</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F9;border-radius:8px;padding:16px;font-size:13px;">
            <tr><td style="color:#8899AA;padding:4px 0;">Gross income</td><td align="right" style="font-weight:600;color:#0B1D35;padding:4px 0;">$${sai.grossIncome.toLocaleString()}</td></tr>
            <tr><td style="color:#C0392B;padding:4px 0;">− Federal income tax</td><td align="right" style="color:#C0392B;font-weight:600;padding:4px 0;">−$${sai.fedTax.toLocaleString()}</td></tr>
            <tr><td style="color:#C0392B;padding:4px 0;">− FICA payroll taxes</td><td align="right" style="color:#C0392B;font-weight:600;padding:4px 0;">−$${sai.fica.toLocaleString()}</td></tr>
            <tr><td style="color:#C0392B;padding:4px 0;">− Income Protection Allowance</td><td align="right" style="color:#C0392B;font-weight:600;padding:4px 0;">−$${sai.ipa.toLocaleString()}</td></tr>
            <tr><td style="color:#C0392B;padding:4px 0;">− Employment expense allowance</td><td align="right" style="color:#C0392B;font-weight:600;padding:4px 0;">−$${sai.eea.toLocaleString()}</td></tr>
            <tr style="border-top:1px solid #DDE3EA;"><td style="font-weight:600;color:#0B1D35;padding:8px 0 4px;">Available income</td><td align="right" style="font-weight:700;color:#0B1D35;padding:8px 0 4px;">$${sai.availableIncome.toLocaleString()}</td></tr>
            <tr><td style="color:#8899AA;padding:4px 0;">Assessment rate</td><td align="right" style="color:#8899AA;padding:4px 0;">${Math.round(sai.assessmentRate * 100)}%</td></tr>
            <tr style="border-top:1px solid #DDE3EA;"><td style="font-weight:700;color:#0B1D35;padding:8px 0 4px;">Estimated SAI</td><td align="right" style="font-weight:700;font-size:16px;color:#0B1D35;padding:8px 0 4px;">$${sai.sai.toLocaleString()}</td></tr>
          </table>
          <p style="margin:8px 0 0;font-size:11px;color:#8899AA;">2026–27 FAFSA Formula A (dependent students). Based on income only — full formula also considers assets.</p>
        </div>

        <!-- STATE GRANT -->
        <div style="background:${urgencyBg};border:1px solid ${urgencyBorder};border-radius:12px;padding:20px;margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
            <div style="flex:1;min-width:200px;">
              <h3 style="margin:0 0 6px;font-size:17px;font-weight:700;color:#0B1D35;">${stateData.grant}</h3>
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:${urgencyColor};">${urgencyLabel}</p>
            </div>
            <div style="text-align:right;">
              <div style="font-size:28px;font-weight:700;color:#0D9E6E;font-family:Arial Narrow,sans-serif;">$${stateData.maxAmount.toLocaleString()}</div>
              <div style="font-size:12px;color:#8899AA;">max / year</div>
            </div>
          </div>
          <div style="margin-top:14px;padding-top:14px;border-top:1px solid ${urgencyBorder};">
            <p style="margin:0;font-size:14px;color:#0B1D35;">💡 This grant <strong>stacks on top</strong> of what the schools above offer — it's additional free money.</p>
          </div>
        </div>

        <!-- CTA -->
        <div style="background:#0B1D35;border-radius:12px;padding:32px;text-align:center;margin-bottom:24px;">
          <a href="https://fafsa.ed.gov" style="display:inline-block;width:100%;max-width:400px;padding:16px 24px;background:#E8A020;color:#0B1D35;font-weight:700;font-size:17px;text-decoration:none;border-radius:10px;box-sizing:border-box;">
            Start my FAFSA — lock in these numbers →
          </a>
          <div style="margin-top:20px;color:rgba(255,255,255,0.7);font-size:13px;">
            <span style="margin:0 8px;">✓ Takes 25 minutes</span>
            <span style="margin:0 8px;">✓ Free — no credit card ever</span>
          </div>
        </div>

        <!-- DISCLAIMER -->
        <p style="font-size:11px;color:#8899AA;line-height:1.6;text-align:center;margin:0;">
          Net prices are federal data for the most recent available year. Actual aid depends on your complete financial situation and each school's policies. This is educational guidance, not a guarantee. State grant amounts from official program publications; verify current amounts with your state agency.
        </p>

      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#0B1D35;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;">
        <p style="margin:0 0 4px;font-size:13px;color:rgba(255,255,255,0.5);">Compass Financial · College Planning Tools</p>
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);">You received this because you requested a College Cost Reality Check report.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`

  return { subject, html }
}
