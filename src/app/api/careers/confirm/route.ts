import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, jobTitle } = await req.json()

  if (!email || !jobTitle) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'there'

  let error: Error | null = null
  try {
    await transporter.sendMail({
      from: `"SMarDevs Talent" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `We received your application — ${jobTitle}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#2563eb,#3b82f6);border-radius:12px;width:44px;height:44px;text-align:center;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:22px;font-weight:700;line-height:44px;">S</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="font-size:22px;font-weight:700;color:#0f172a;">SMar<span style="color:#2563eb;">Devs</span></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;padding:40px 40px 36px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

              <!-- Icon -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <div style="width:64px;height:64px;background:#eff6ff;border-radius:50%;display:inline-block;text-align:center;line-height:64px;font-size:32px;">✅</div>
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;text-align:center;">
                Application Received!
              </h1>
              <p style="margin:0 0 28px;font-size:14px;color:#64748b;text-align:center;">
                Thank you for your interest in joining our team.
              </p>

              <!-- Body -->
              <p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.6;">
                Hi ${fullName},
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.6;">
                Thank you for applying for the <strong style="color:#0f172a;">${jobTitle}</strong> position at SMarDevs. We truly appreciate the time and effort you put into your application.
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.6;">
                Our talent team will carefully review your profile and get back to you within <strong style="color:#0f172a;">48 business hours</strong>. If your background aligns with what we're looking for, we'll reach out to schedule the next steps.
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#334155;line-height:1.6;">
                In the meantime, feel free to explore other open positions on our website — we're always growing!
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px;" />

              <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">
                Warm regards,<br />
                <strong style="color:#0f172a;">The SMarDevs Talent Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                © ${new Date().getFullYear()} SMarDevs. All rights reserved.<br />
                This email was sent because you submitted an application on our website.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
    })
  } catch (err) {
    error = err as Error
  }

  if (error) {
    console.error('[confirm email] SMTP error:', error)
    return NextResponse.json({ success: false, error: error.message })
  }

  return NextResponse.json({ success: true })
}
