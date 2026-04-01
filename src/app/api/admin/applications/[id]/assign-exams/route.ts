import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { logAudit } from '@/lib/audit'
import { generateApplicantPassword } from '@/lib/evaluation'
import { requireStaff } from '@/lib/auth'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// POST /api/admin/applications/[id]/assign-exams
// Body: { exam_ids: string[] }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireStaff()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id: applicationId } = await params
  const { exam_ids } = await req.json()

  if (!exam_ids || !Array.isArray(exam_ids) || exam_ids.length === 0) {
    return NextResponse.json({ error: 'At least one exam must be selected' }, { status: 400 })
  }

  const admin = createAdminClientAny()

  // Fetch the application
  const { data: app, error: appErr } = await admin
    .from('applications')
    .select('id, first_name, last_name, email, status, applicant_user_id, job_id, jobs(title, job_categories(name))')
    .eq('id', applicationId)
    .single()

  if (appErr || !app) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }

  // Must be in technical_review stage
  if (app.status !== 'technical_review') {
    return NextResponse.json(
      { error: 'Exams can only be assigned during the Technical Review stage' },
      { status: 422 }
    )
  }

  // Check exam_ids are valid and active
  const { data: exams, error: examsErr } = await admin
    .from('exams')
    .select('id, title')
    .in('id', exam_ids)
    .eq('is_active', true)

  if (examsErr || !exams || exams.length !== exam_ids.length) {
    return NextResponse.json({ error: 'One or more selected exams are invalid or inactive' }, { status: 400 })
  }

  // Create applicant auth user if not already created
  let applicantUserId = app.applicant_user_id
  let password: string | null = null

  if (!applicantUserId) {
    // Count existing applicant accounts for correlative
    const { count } = await admin
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .not('applicant_user_id', 'is', null)

    const correlative = (count ?? 0) + 1
    const jobTitle = (app as any).jobs?.title || 'General'
    password = generateApplicantPassword(app.first_name, jobTitle, correlative)

    // Create Supabase auth user
    const { data: authData, error: authErr } = await admin.auth.admin.createUser({
      email: app.email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: `${app.first_name} ${app.last_name}`,
        role: 'applicant',
        application_id: applicationId,
      },
    })

    if (authErr) {
      return NextResponse.json({ error: `Failed to create applicant account: ${authErr.message}` }, { status: 500 })
    }

    applicantUserId = authData.user.id

    // Create profile for the applicant
    await admin.from('profiles').upsert({
      id: applicantUserId,
      full_name: `${app.first_name} ${app.last_name}`,
      email: app.email,
      role: 'applicant',
      status: 'active',
    })

    // Link the auth user to the application
    await admin
      .from('applications')
      .update({ applicant_user_id: applicantUserId })
      .eq('id', applicationId)
  }

  // Create exam assignments (1 week expiration)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  const assignmentsToInsert = exam_ids.map((examId: string) => ({
    application_id: applicationId,
    exam_id: examId,
    assigned_by: caller.id,
    status: 'pending',
    expires_at: expiresAt.toISOString(),
  }))

  const { data: assignments, error: assignErr } = await admin
    .from('exam_assignments')
    .upsert(assignmentsToInsert, { onConflict: 'application_id,exam_id' })
    .select('id, exam_id, status, expires_at')

  if (assignErr) {
    return NextResponse.json({ error: assignErr.message }, { status: 500 })
  }

  // Send credentials email if this is the first time
  if (password) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smardevs.com'
    const portalUrl = `${siteUrl}/portal`
    const examTitles = exams.map((e: { title: string }) => e.title)

    try {
      await transporter.sendMail({
        from: `"SMarDevs Evaluations" <${process.env.SMTP_USER}>`,
        to: app.email,
        subject: `Your Technical Assessment — ${(app as any).jobs?.title || 'SMarDevs'}`,
        html: buildCredentialsEmail({
          firstName: app.first_name,
          jobTitle: (app as any).jobs?.title || 'the position',
          email: app.email,
          password,
          portalUrl,
          examTitles,
          expiresAt: expiresAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        }),
      })
    } catch (emailErr) {
      console.error('[assign-exams] Email send error:', emailErr)
      // Don't fail the whole operation if email fails
    }
  }

  // Audit log
  await logAudit({
    entity_type: 'application',
    entity_id: applicationId,
    action: 'exams_assigned',
    performed_by: caller.id,
    metadata: {
      exam_ids,
      exam_titles: exams.map((e: { title: string }) => e.title),
      applicant_user_created: !!password,
      expires_at: expiresAt.toISOString(),
    },
  })

  return NextResponse.json({
    success: true,
    assignments,
    credentials_sent: !!password,
    applicant_user_id: applicantUserId,
  })
}

function buildCredentialsEmail(data: {
  firstName: string
  jobTitle: string
  email: string
  password: string
  portalUrl: string
  examTitles: string[]
  expiresAt: string
}): string {
  const examList = data.examTitles.map(t => `<li style="padding:4px 0;color:#334155;">${t}</li>`).join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
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
            <td style="background:#ffffff;border-radius:16px;padding:40px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;text-align:center;">
                Technical Assessment
              </h1>
              <p style="margin:0 0 24px;font-size:14px;color:#64748b;text-align:center;">
                You've been selected for the next phase!
              </p>

              <p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.6;">
                Hi ${data.firstName},
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.6;">
                Congratulations! Your application for <strong style="color:#0f172a;">${data.jobTitle}</strong> has progressed to the Technical Review stage. We've prepared some assessments to evaluate your skills.
              </p>

              <!-- Credentials Box -->
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin:0 0 20px;">
                <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#1e40af;">Your Portal Credentials</p>
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding:4px 0;font-size:14px;color:#64748b;width:80px;">Email:</td>
                    <td style="padding:4px 0;font-size:14px;font-weight:600;color:#0f172a;">${data.email}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;font-size:14px;color:#64748b;">Password:</td>
                    <td style="padding:4px 0;font-size:14px;font-weight:600;color:#0f172a;font-family:monospace;">${data.password}</td>
                  </tr>
                </table>
              </div>

              <!-- Exams List -->
              <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#0f172a;">Assigned Assessments:</p>
              <ul style="margin:0 0 20px;padding-left:20px;font-size:14px;">
                ${examList}
              </ul>

              <!-- Important Info -->
              <div style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;padding:16px;margin:0 0 20px;">
                <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
                  <strong>Important:</strong><br/>
                  • You have <strong>1 attempt</strong> per assessment<br/>
                  • Assessments expire on <strong>${data.expiresAt}</strong><br/>
                  • Each assessment is timed — the timer starts when you begin<br/>
                  • You must complete all assessments to proceed
                </p>
              </div>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="${data.portalUrl}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#3b82f6);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:12px;">
                      Go to Assessment Portal
                    </a>
                  </td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 20px;" />
              <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">
                Good luck!<br/>
                <strong style="color:#0f172a;">The SMarDevs Talent Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                &copy; ${new Date().getFullYear()} SMarDevs. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim()
}
