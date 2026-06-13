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
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="background:#F4F6F9;border-radius:8px;padding:16px;text-align:center;color:#8899AA;font-size:14px;">
        Federal net price data not available for this school.
        ${school.schoolUrl ? ` Visit <a href="https://${school.schoolUrl}" style="color:#0B1D35;">their Net Price Calculator</a> for an estimate.` : ''}
      </td></tr>
    </table>`

  const priceBlock = netPrice == null ? noDataBlock : `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
      <tr>
        <td width="50%" style="padding-right:6px;vertical-align:top;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:#F4F6F9;border-radius:8px;padding:16px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#8899AA;text-transform:uppercase;letter-spacing:0.05em;">Sticker Price</p>
              <p style="margin:0;font-size:28px;font-weight:700;color:#0B1D35;font-family:Arial Narrow,Arial,sans-serif;line-height:1.2;">${fmt(sticker)}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#8899AA;">per year</p>
            </td></tr>
          </table>
        </td>
        <td width="50%" style="padding-left:6px;vertical-align:top;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:#e8f9f3;border-radius:8px;padding:16px;border:1px solid #b2e8d4;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#0D9E6E;text-transform:uppercase;letter-spacing:0.05em;">Families Like Yours Paid</p>
              <p style="margin:0;font-size:28px;font-weight:700;color:#0D9E6E;font-family:Arial Narrow,Arial,sans-serif;line-height:1.2;">${fmt(netPrice)}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#8899AA;">per year</p>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 12px;font-size:12px;color:#8899AA;">Based on federal data for families earning ${bracketLabel(income)}${income > 110000 ? ' — data shown for the $110,001+ bracket' : ''}</p>
    ${savings && savings > 0 ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
      <tr><td style="background:#e8f9f3;border:1px solid #b2e8d4;border-radius:8px;padding:12px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="color:#0D9E6E;font-weight:700;font-size:15px;">You'd save ${fmt(savings)}/yr vs. sticker</td>
            <td align="right" style="color:#8899AA;font-size:12px;white-space:nowrap;">
              Over 4 years:<br>
              <strong style="color:#0B1D35;">${fmt(netPrice * 4)}</strong>
              vs. <span style="text-decoration:line-through;">${fmt(sticker ? sticker * 4 : null)}</span>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>` : ''}
    ${isInState && school.tuitionInState ? `<p style="margin:0 0 12px;font-size:12px;color:#0D9E6E;">&#10003; In-state rates apply &nbsp;·&nbsp; In-state tuition: ${fmt(school.tuitionInState)} &nbsp;·&nbsp; Out-of-state: ${fmt(school.tuitionOutOfState)}</p>` : ''}
    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #DDE3EA;padding-top:12px;">
      <tr>
        <td width="33%" align="center" style="padding:8px 4px;">
          <p style="margin:0 0 4px;font-size:11px;color:#8899AA;">Grad Rate</p>
          <p style="margin:0;font-size:20px;font-weight:700;color:#0B1D35;font-family:Arial Narrow,Arial,sans-serif;">${fmtPct(school.completionRate)}</p>
        </td>
        <td width="33%" align="center" style="padding:8px 4px;border-left:1px solid #DDE3EA;border-right:1px solid #DDE3EA;">
          <p style="margin:0 0 4px;font-size:11px;color:#8899AA;">Earnings 10yr</p>
          <p style="margin:0;font-size:20px;font-weight:700;color:#0B1D35;font-family:Arial Narrow,Arial,sans-serif;">${fmt(school.medianEarnings10yr)}</p>
        </td>
        <td width="33%" align="center" style="padding:8px 4px;">
          <p style="margin:0 0 4px;font-size:11px;color:#8899AA;">Median Debt</p>
          <p style="margin:0;font-size:20px;font-weight:700;color:#0B1D35;font-family:Arial Narrow,Arial,sans-serif;">${fmt(school.medianDebt)}</p>
        </td>
      </tr>
    </table>`

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
    <tr><td style="background:#ffffff;border:1px solid #DDE3EA;border-radius:12px;padding:20px;">
      <!-- School header -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
        <tr>
          <td style="vertical-align:top;">
            <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#0B1D35;">${school.name}</p>
            <p style="margin:0;font-size:13px;color:#8899AA;">${school.city}, ${school.state}${isInState ? ' &nbsp;<span style="color:#0D9E6E;">&#183; In-state</span>' : ''}</p>
          </td>
          <td align="right" style="vertical-align:top;white-space:nowrap;">
            <span style="font-size:11px;color:#8899AA;border:1px solid #DDE3EA;border-radius:20px;padding:3px 10px;">${getOwnershipLabel(school.ownership)}</span>
          </td>
        </tr>
      </table>
      ${priceBlock}
    </td></tr>
  </table>`
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
  const urgencyBg =
    stateData.urgency === 'asap' ? '#fff5f5' :
    stateData.urgency === 'early' ? '#fffbf0' :
    stateData.urgency === 'check' ? '#f8f9fa' : '#f0f7ff'
  const urgencyBorder =
    stateData.urgency === 'asap' ? '#ffcdd2' :
    stateData.urgency === 'early' ? '#fde8b0' :
    stateData.urgency === 'check' ? '#DDE3EA' : '#c2d9f5'
  const urgencyPrefix =
    stateData.urgency === 'asap' ? '&#9888;&#65039; ' :
    stateData.urgency === 'early' ? '&#128276; File before: ' : ''
  const urgencyText = stateData.urgency === 'asap'
    ? `<strong>${stateData.name} awards grants as funds run out. File immediately.</strong>`
    : stateData.deadline

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#F4F6F9;font-family:Arial,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F6F9;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

      <!-- ===== HEADER ===== -->
      <tr><td style="background:#0B1D35;border-radius:16px 16px 0 0;padding:40px 32px;text-align:center;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#E8A020;letter-spacing:0.1em;text-transform:uppercase;">College Cost Reality Check &middot; 2026&ndash;27</p>
        <p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.6);">Family of ${familySize} &nbsp;&middot;&nbsp; $${income.toLocaleString()}/yr &nbsp;&middot;&nbsp; ${stateData.name}</p>
        ${avgSavings > 0 ? `
        <p style="margin:0 0 4px;font-size:15px;color:rgba(255,255,255,0.7);">Families like yours paid an average of</p>
        <p style="margin:0 0 4px;font-size:60px;font-weight:700;color:#0D9E6E;font-family:Arial Narrow,Arial,sans-serif;line-height:1;">$${avgSavings.toLocaleString()}</p>
        <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.7);">less per year than sticker price</p>
        ` : `
        <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">Your personalized college cost report</p>
        `}
      </td></tr>

      <!-- ===== BODY ===== -->
      <tr><td style="background:#ffffff;padding:32px;">

        <!-- SCHOOLS -->
        <p style="margin:0 0 16px;font-size:20px;font-weight:700;color:#0B1D35;">Your Schools, Side by Side</p>
        ${schools.map((s) => schoolBlock(s, income, stateAbbr)).join('')}

        <!-- SAI -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          <tr><td style="background:#ffffff;border:1px solid #DDE3EA;border-radius:12px;padding:20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
              <tr>
                <td style="vertical-align:middle;">
                  <p style="margin:0;font-size:18px;font-weight:700;color:#0B1D35;">Your Estimated SAI</p>
                </td>
                <td align="right" style="vertical-align:middle;">
                  <span style="font-size:32px;font-weight:700;color:#0B1D35;font-family:Arial Narrow,Arial,sans-serif;">$${sai.sai.toLocaleString()}</span>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 14px;font-size:14px;color:#8899AA;">This number determines how much aid you qualify for. <strong style="color:#0B1D35;">Lower = more aid.</strong>${sai.sai < 0 ? ' A negative SAI typically means maximum Pell Grant eligibility.' : ''}</p>
            <table width="100%" cellpadding="6" cellspacing="0" style="background:#F4F6F9;border-radius:8px;font-size:13px;">
              <tr>
                <td style="color:#8899AA;">Gross income</td>
                <td align="right" style="font-weight:600;color:#0B1D35;">$${sai.grossIncome.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color:#C0392B;">&minus; Federal income tax</td>
                <td align="right" style="color:#C0392B;font-weight:600;">&minus;$${sai.fedTax.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color:#C0392B;">&minus; FICA payroll taxes</td>
                <td align="right" style="color:#C0392B;font-weight:600;">&minus;$${sai.fica.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color:#C0392B;">&minus; Income Protection Allowance</td>
                <td align="right" style="color:#C0392B;font-weight:600;">&minus;$${sai.ipa.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color:#C0392B;">&minus; Employment expense allowance</td>
                <td align="right" style="color:#C0392B;font-weight:600;">&minus;$${sai.eea.toLocaleString()}</td>
              </tr>
              <tr style="border-top:2px solid #DDE3EA;">
                <td style="font-weight:600;color:#0B1D35;padding-top:10px;">Available income</td>
                <td align="right" style="font-weight:700;color:#0B1D35;padding-top:10px;">$${sai.availableIncome.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color:#8899AA;">Assessment rate</td>
                <td align="right" style="color:#8899AA;">${Math.round(sai.assessmentRate * 100)}%</td>
              </tr>
              <tr style="border-top:2px solid #DDE3EA;">
                <td style="font-weight:700;color:#0B1D35;font-size:15px;padding-top:10px;">Estimated SAI</td>
                <td align="right" style="font-weight:700;color:#0B1D35;font-size:15px;padding-top:10px;">$${sai.sai.toLocaleString()}</td>
              </tr>
            </table>
            <p style="margin:8px 0 0;font-size:11px;color:#8899AA;">2026&ndash;27 FAFSA Formula A (dependent students). Based on income only &mdash; full formula also considers assets.</p>
          </td></tr>
        </table>

        <!-- STATE GRANT -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr><td style="background:${urgencyBg};border:1px solid ${urgencyBorder};border-radius:12px;padding:20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
              <tr>
                <td style="vertical-align:top;padding-right:16px;">
                  <p style="margin:0 0 6px;font-size:17px;font-weight:700;color:#0B1D35;">${stateData.grant}</p>
                  <p style="margin:0;font-size:13px;font-weight:600;color:${urgencyColor};">${urgencyPrefix}${urgencyText}</p>
                </td>
                <td align="right" style="vertical-align:top;white-space:nowrap;">
                  <p style="margin:0;font-size:28px;font-weight:700;color:#0D9E6E;font-family:Arial Narrow,Arial,sans-serif;line-height:1;">$${stateData.maxAmount.toLocaleString()}</p>
                  <p style="margin:4px 0 0;font-size:12px;color:#8899AA;text-align:right;">max / year</p>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="border-top:1px solid ${urgencyBorder};padding-top:14px;">
                <p style="margin:0;font-size:14px;color:#0B1D35;">&#128161; This grant <strong>stacks on top</strong> of what the schools above offer &mdash; it&apos;s additional free money.</p>
              </td></tr>
            </table>
          </td></tr>
        </table>

        <!-- CTA BUTTON -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr><td style="background:#0B1D35;border-radius:12px;padding:32px;text-align:center;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 20px;">
              <tr><td style="background:#E8A020;border-radius:10px;">
                <a href="https://fafsa.ed.gov" style="display:block;padding:16px 32px;color:#0B1D35;font-weight:700;font-size:17px;text-decoration:none;font-family:Arial,sans-serif;">
                  Start my FAFSA &mdash; lock in these numbers &rarr;
                </a>
              </td></tr>
            </table>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="color:rgba(255,255,255,0.7);font-size:13px;padding:0 12px;">&#10003; Takes 25 minutes</td>
                <td style="color:rgba(255,255,255,0.7);font-size:13px;padding:0 12px;">&#10003; Free &mdash; no credit card ever</td>
              </tr>
            </table>
          </td></tr>
        </table>

        <!-- DISCLAIMER -->
        <p style="margin:0;font-size:11px;color:#8899AA;line-height:1.6;text-align:center;">
          Net prices are federal data for the most recent available year. Actual aid depends on your complete financial situation and each school&apos;s policies. This is educational guidance, not a guarantee. State grant amounts from official program publications; verify current amounts with your state agency.
        </p>

      </td></tr>

      <!-- ===== FOOTER ===== -->
      <tr><td style="background:#0B1D35;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;">
        <p style="margin:0 0 4px;font-size:13px;color:rgba(255,255,255,0.5);">Compass Financial &middot; College Planning Tools</p>
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);">You received this because you requested a College Cost Reality Check report.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`

  return { subject, html }
}
