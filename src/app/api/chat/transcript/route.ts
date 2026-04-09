import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createAdminClientAny } from '@/lib/supabase/admin'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface LeadData {
  type: 'company' | 'candidate' | null
  full_name: string | null
  email: string | null
  company_name: string | null
  company_website: string | null
  role_needed: string | null
  positions: string | null
  seniority: string | null
  timeline: string | null
  role_interest: string | null
  phone: string | null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, messages, startedAt, pageUrl, language, leadData } = body as {
      sessionId: string
      messages: ChatMessage[]
      startedAt: string
      pageUrl: string
      language: string
      leadData?: LeadData
    }

    if (!messages || messages.length < 2) {
      return NextResponse.json({ ok: true })
    }

    // Extract email/phone from conversation if frontend didn't capture
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content).join(' ')
    const emailMatch = userMessages.match(/[\w.+-]+@[\w-]+\.[\w.]+/)
    const leadEmail = leadData?.email || (emailMatch ? emailMatch[0] : null)
    const visitorType = leadData?.type || null

    const endedAt = new Date().toISOString()
    const messageCount = messages.length
    const userMessageCount = messages.filter(m => m.role === 'user').length

    // ── Save structured lead to Supabase ──
    if (leadEmail || visitorType) {
      try {
        const admin = createAdminClientAny()
        await admin.from('chat_leads').insert({
          session_id: sessionId,
          type: visitorType || 'company',
          full_name: leadData?.full_name || null,
          email: leadEmail,
          company_name: leadData?.company_name || null,
          company_website: leadData?.company_website || null,
          role_needed: leadData?.role_needed || null,
          positions: leadData?.positions || null,
          seniority: leadData?.seniority || null,
          timeline: leadData?.timeline || null,
          role_interest: leadData?.role_interest || null,
          phone: leadData?.phone || null,
          page_url: pageUrl,
          language: language || 'en',
        })
      } catch (err) {
        console.error('[transcript] Failed to save lead:', err)
      }
    }

    // ── Build lead summary for email ──
    const leadFields: { label: string; value: string }[] = []
    if (visitorType) leadFields.push({ label: 'Type', value: visitorType === 'company' ? '🏢 Company / Hiring' : '💼 Candidate' })
    if (leadData?.full_name) leadFields.push({ label: 'Name', value: leadData.full_name })
    if (leadEmail) leadFields.push({ label: 'Email', value: leadEmail })
    if (leadData?.phone) leadFields.push({ label: 'Phone', value: leadData.phone })
    if (leadData?.company_name) leadFields.push({ label: 'Company', value: leadData.company_name })
    if (leadData?.company_website) leadFields.push({ label: 'Website', value: leadData.company_website })
    if (leadData?.role_needed) leadFields.push({ label: 'Role Needed', value: leadData.role_needed })
    if (leadData?.role_interest) leadFields.push({ label: 'Role Interest', value: leadData.role_interest })
    if (leadData?.positions) leadFields.push({ label: 'Positions', value: leadData.positions })
    if (leadData?.seniority) leadFields.push({ label: 'Seniority', value: leadData.seniority })
    if (leadData?.timeline) leadFields.push({ label: 'Timeline', value: leadData.timeline })

    const hasLead = leadEmail || leadFields.length > 1

    // ── Build HTML email ──
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1a1a2e;">
        <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 32px 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">SMarty Chat Transcript</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">
            ${hasLead ? '🎯 Lead captured' : 'Conversation from the website'}
          </p>
        </div>
        <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none;">

          ${hasLead ? `
          <div style="margin-bottom: 20px; padding: 16px; background: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #065f46; font-weight: 700;">Lead Information</p>
            <table style="width: 100%; border-collapse: collapse;">
              ${leadFields.map(f => `
              <tr>
                <td style="padding: 4px 8px 4px 0; font-size: 13px; color: #065f46; width: 120px;">${f.label}</td>
                <td style="padding: 4px 0; font-size: 13px; color: #064e3b; font-weight: 600;">${
                  f.label === 'Email' ? `<a href="mailto:${f.value}" style="color: #059669;">${f.value}</a>` :
                  f.label === 'Website' ? `<a href="${f.value.startsWith('http') ? f.value : 'https://' + f.value}" style="color: #059669;">${f.value}</a>` :
                  f.label === 'Phone' ? `<a href="tel:${f.value}" style="color: #059669;">${f.value}</a>` :
                  f.value
                }</td>
              </tr>`).join('')}
            </table>
          </div>
          ` : ''}

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #6b7280; width: 130px;">Session ID</td>
              <td style="padding: 8px 0; font-size: 13px; color: #111827; font-weight: 500;">${sessionId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #6b7280;">Started</td>
              <td style="padding: 8px 0; font-size: 13px; color: #111827; font-weight: 500;">${new Date(startedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #6b7280;">Ended</td>
              <td style="padding: 8px 0; font-size: 13px; color: #111827; font-weight: 500;">${new Date(endedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #6b7280;">Page</td>
              <td style="padding: 8px 0; font-size: 13px; color: #111827; font-weight: 500;">${pageUrl}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #6b7280;">Language</td>
              <td style="padding: 8px 0; font-size: 13px; color: #111827; font-weight: 500;">${language === 'es' ? 'Spanish' : 'English'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #6b7280;">Messages</td>
              <td style="padding: 8px 0; font-size: 13px; color: #111827; font-weight: 500;">${messageCount} total (${userMessageCount} from visitor)</td>
            </tr>
          </table>

          <h2 style="font-size: 16px; color: #1a1a2e; margin: 24px 0 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">Conversation</h2>
          ${messages.map(m => `
            <div style="margin-bottom: 16px; padding: 12px 16px; border-radius: 10px; ${
              m.role === 'user'
                ? 'background: #eff6ff; border-left: 3px solid #2563eb;'
                : 'background: #ffffff; border: 1px solid #e5e7eb;'
            }">
              <p style="margin: 0 0 4px; font-size: 11px; color: #6b7280; font-weight: 600; text-transform: uppercase;">
                ${m.role === 'user' ? '👤 Visitor' : '🤖 SMarty'} · ${new Date(m.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p style="margin: 0; font-size: 14px; color: #111827; white-space: pre-wrap; line-height: 1.5;">${m.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </div>
          `).join('')}

          <div style="margin-top: 24px; padding: 16px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #2563eb;">
            <p style="margin: 0; font-size: 13px; color: #1d4ed8; font-weight: 600;">Follow Up</p>
            <p style="margin: 6px 0 0; font-size: 13px; color: #1e40af;">
              ${leadEmail
                ? `Reply to lead at <a href="mailto:${leadEmail}" style="color: #2563eb;">${leadEmail}</a> within 4 hours.`
                : 'No email captured. Review transcript for potential lead opportunities.'}
            </p>
          </div>
        </div>
        <div style="padding: 16px 24px; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #9ca3af;">Sent by SMarty — SMarDevs Website Chatbot</p>
        </div>
      </div>
    `

    // ── Send email ──
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })

    const typeLabel = visitorType === 'company' ? 'Company' : visitorType === 'candidate' ? 'Candidate' : 'Visitor'
    const subject = leadEmail
      ? `[SMarty ${typeLabel}] ${leadEmail}${leadData?.company_name ? ` — ${leadData.company_name}` : ''}`
      : `[SMarty] Chat Transcript — ${new Date(endedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`

    const leadSummary = leadFields.map(f => `${f.label}: ${f.value}`).join('\n')
    const transcriptLines = messages.map(m => {
      const time = new Date(m.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      return `[${time}] ${m.role === 'user' ? 'Visitor' : 'SMarty'}:\n${m.content}`
    }).join('\n\n---\n\n')

    await transporter.sendMail({
      from: `"SMarty Bot" <${process.env.SMTP_USER}>`,
      to: 'csorto@smardevs.com',
      cc: 'mortega@smardevs.com',
      subject,
      html,
      text: `SMarty Chat Transcript\n\nSession: ${sessionId}\nStarted: ${startedAt}\nEnded: ${endedAt}\nPage: ${pageUrl}\nLanguage: ${language}\n\n${leadSummary ? `--- Lead Info ---\n${leadSummary}\n\n` : ''}--- Conversation ---\n\n${transcriptLines}`,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[transcript] Email delivery failed:', err)
    return NextResponse.json({ ok: true })
  }
}
