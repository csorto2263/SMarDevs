import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { createAdminClientAny } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { name, company, email } = await req.json()

  if (!name || !company || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // Get IP address
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null

  // Save lead to database
  const supabase = createAdminClientAny()
  const { error: dbError } = await supabase
    .from('salary_guide_leads')
    .insert({ name, company, email, ip_address: ip })

  if (dbError) {
    console.error('[salary-guide] DB insert error:', dbError)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  // Read the PDF file
  const pdfPath = path.join(process.cwd(), 'public', 'salary-guide-2026.pdf')
  let pdfBuffer: Buffer
  try {
    pdfBuffer = fs.readFileSync(pdfPath)
  } catch (err) {
    console.error('[salary-guide] PDF not found:', err)
    return NextResponse.json({ error: 'PDF not available' }, { status: 500 })
  }

  // Send email with PDF attachment
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const userHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
      <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 40px 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: rgba(255,255,255,0.15); border-radius: 12px; margin-bottom: 16px;">
          <span style="color: white; font-size: 22px; font-weight: bold;">S</span>
        </div>
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Your Salary Guide is Here!</h1>
        <p style="color: rgba(255,255,255,0.75); margin: 10px 0 0; font-size: 15px;">2026 LATAM Tech Salary Guide — via SMarDevs</p>
      </div>
      <div style="background: #f9fafb; padding: 36px 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="font-size: 16px; color: #111827; margin: 0 0 16px;">Hi ${name},</p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6; margin: 0 0 20px;">
          Thank you for your interest in SMarDevs! Your copy of the <strong>2026 LATAM Tech Salary Guide</strong> is attached to this email.
        </p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6; margin: 0 0 20px;">
          Inside you'll find all-in monthly rates for hiring pre-vetted LATAM engineers through SMarDevs, with real comparisons to equivalent US-based talent — so you can see exactly how much companies like <strong>${company}</strong> can save.
        </p>
        <div style="background: #eff6ff; border-radius: 10px; border-left: 4px solid #2563eb; padding: 18px 20px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #1d4ed8; font-weight: 700;">Typical client savings: 40–63%</p>
          <p style="margin: 6px 0 0; font-size: 14px; color: #1e40af;">All-in pricing means zero hidden costs — salaries, benefits, and management fees included.</p>
        </div>
        <p style="font-size: 15px; color: #374151; line-height: 1.6; margin: 0 0 24px;">
          Ready to discuss your hiring needs? We'd love to help you build your team.
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="https://smardevs.com/contact" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px;">
            Book a Free Consultation
          </a>
        </div>
        <p style="font-size: 13px; color: #9ca3af; text-align: center; margin: 24px 0 0;">
          SMarDevs · Nearshore Tech Talent from Latin America · <a href="https://smardevs.com" style="color: #6b7280;">smardevs.com</a>
        </p>
      </div>
    </div>
  `

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
      <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 32px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">New Salary Guide Lead</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">SMarDevs — Lead Magnet</p>
      </div>
      <div style="background: #f9fafb; padding: 32px 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; width: 120px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: 600; color: #111827;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">Company</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: 600; color: #111827;">${company}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-size: 14px; color: #6b7280;">Email</td>
            <td style="padding: 10px 0; font-size: 14px; font-weight: 600; color: #111827;">
              <a href="mailto:${email}" style="color: #2563eb;">${email}</a>
            </td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #2563eb;">
          <p style="margin: 0; font-size: 13px; color: #1d4ed8; font-weight: 600;">Follow up with this lead</p>
          <p style="margin: 6px 0 0; font-size: 13px; color: #1e40af;">Reach them at <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
        </div>
      </div>
    </div>
  `

  try {
    // Send PDF to the lead
    await transporter.sendMail({
      from: `"SMarDevs" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your 2026 LATAM Tech Salary Guide — SMarDevs',
      html: userHtml,
      attachments: [
        {
          filename: 'SMarDevs-2026-LATAM-Tech-Salary-Guide.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    // Notify admin
    await transporter.sendMail({
      from: `"SMarDevs Leads" <${process.env.SMTP_USER}>`,
      to: 'csorto@smardevs.com',
      cc: 'mortega@smardevs.com',
      replyTo: email,
      subject: `New Salary Guide Lead: ${name} — ${company}`,
      html: adminHtml,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[salary-guide] email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
