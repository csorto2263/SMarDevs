import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const { name, email, company, phone, role, positions, timeline, message } = await req.json()

  if (!name || !email || !company) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
      <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 32px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">New Contact Form Submission</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">SMarDevs — Contact Page</p>
      </div>
      <div style="background: #f9fafb; padding: 32px 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; width: 140px;">Full Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: 600; color: #111827;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">Work Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: 600; color: #111827;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">Company</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: 600; color: #111827;">${company}</td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: 600; color: #111827;">${phone}</td>
          </tr>` : ''}
          ${role ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">Role Needed</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: 600; color: #111827;">${role}</td>
          </tr>` : ''}
          ${positions ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">Positions</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: 600; color: #111827;">${positions}</td>
          </tr>` : ''}
          ${timeline ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">Timeline</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: 600; color: #111827;">${timeline}</td>
          </tr>` : ''}
          ${message ? `
          <tr>
            <td style="padding: 10px 0; font-size: 14px; color: #6b7280; vertical-align: top;">Message</td>
            <td style="padding: 10px 0; font-size: 14px; color: #111827;">${message}</td>
          </tr>` : ''}
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #2563eb;">
          <p style="margin: 0; font-size: 13px; color: #1d4ed8; font-weight: 600;">Action Required</p>
          <p style="margin: 6px 0 0; font-size: 13px; color: #1e40af;">Reply to this lead within 4 hours at <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
        </div>
      </div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"SMarDevs Contact" <${process.env.SMTP_USER}>`,
      to: 'csorto@smardevs.com',
      cc: 'mortega@smardevs.com',
      replyTo: email,
      subject: `New Inquiry from ${name} — ${company}`,
      html,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact email] error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
