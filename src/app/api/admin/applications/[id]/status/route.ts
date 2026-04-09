import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { logAudit } from '@/lib/audit'
import { requireStaff } from '@/lib/auth'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

async function sendRejectionEmail(applicant: {
  first_name: string
  last_name: string
  email: string
  job_title: string
}) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e293b 0%,#334155 100%);padding:36px 40px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <div style="background:#3b82f6;border-radius:10px;width:36px;height:36px;display:inline-block;text-align:center;line-height:36px;font-weight:900;font-size:18px;color:#fff;">S</div>
              <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">SMarDevs</span>
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 20px;font-size:16px;color:#374151;line-height:1.6;">
              Dear <strong>${applicant.first_name}</strong>,
            </p>
            <p style="margin:0 0 20px;font-size:15px;color:#6b7280;line-height:1.7;">
              Thank you for taking the time to apply for the <strong style="color:#374151;">${applicant.job_title}</strong> position at <strong style="color:#374151;">SMarDevs</strong> and for your interest in joining our team.
            </p>
            <p style="margin:0 0 20px;font-size:15px;color:#6b7280;line-height:1.7;">
              After carefully reviewing your application, we have decided to move forward with other candidates whose experience more closely matches our current needs. This was not an easy decision, as we received many strong applications.
            </p>
            <p style="margin:0 0 32px;font-size:15px;color:#6b7280;line-height:1.7;">
              We truly appreciate the effort you put into your application and encourage you to apply for future opportunities that align with your skills and experience. We will keep your profile in mind for roles that may be a better fit.
            </p>

            <!-- Divider -->
            <div style="border-top:1px solid #e5e7eb;margin-bottom:28px;"></div>

            <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
              We wish you all the best in your job search and future endeavors.
            </p>
            <p style="margin:16px 0 0;font-size:15px;color:#374151;">
              Warm regards,<br>
              <strong>The SMarDevs Recruiting Team</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              © ${new Date().getFullYear()} SMarDevs. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  await transporter.sendMail({
    from: `"SMarDevs Recruiting" <${process.env.SMTP_USER}>`,
    to: applicant.email,
    subject: `Your application for ${applicant.job_title} at SMarDevs`,
    html,
  })
}

const PIPELINE_ORDER = ['applied', 'screening', 'interview', 'technical_review', 'final_interview', 'offer', 'hired']

function isValidTransition(from: string, to: string): boolean {
  if (['rejected', 'withdrawn'].includes(to)) return true
  const fromIdx = PIPELINE_ORDER.indexOf(from)
  const toIdx = PIPELINE_ORDER.indexOf(to)
  if (fromIdx === -1 || toIdx === -1) return false
  return toIdx === fromIdx + 1
}

// All transitions require a written justification (min 80 chars)
function requiresJustification(from: string, to: string): boolean {
  return from !== to
}

const VALID_STATUSES = [
  'applied', 'screening', 'interview', 'technical_review',
  'final_interview', 'offer', 'hired', 'rejected', 'withdrawn',
]

// POST /api/admin/applications/[id]/status
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireStaff()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body   = await req.json()
  const { new_status, comment, hire_data } = body

  if (!new_status || !VALID_STATUSES.includes(new_status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const admin = createAdminClientAny()

  // Fetch current application
  const { data: application, error: fetchErr } = await admin
    .from('applications')
    .select('id, status, first_name, last_name, email, phone, address, linkedin_url, headline, job_id, jobs(title, client_id)')
    .eq('id', id)
    .single()

  if (fetchErr || !application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }

  const currentStatus = application.status as string

  if (currentStatus === new_status) {
    return NextResponse.json({ error: 'Status is already set to that value' }, { status: 400 })
  }

  // Enforce strict pipeline flow
  if (!isValidTransition(currentStatus, new_status)) {
    return NextResponse.json({ error: 'Invalid pipeline transition. Stages must be completed in order.' }, { status: 422 })
  }

  // Validate comment requirement
  if (requiresJustification(currentStatus, new_status)) {
    const trimmed = (comment || '').trim()
    if (trimmed.length < 80) {
      return NextResponse.json(
        { error: 'A justification of at least 80 characters is required for this transition.' },
        { status: 422 }
      )
    }
  }

  // Block final_interview if no exams assigned or not all completed
  if (new_status === 'final_interview') {
    const { data: assignments } = await admin
      .from('exam_assignments')
      .select('id, status')
      .eq('application_id', id)

    if (!assignments || assignments.length === 0) {
      return NextResponse.json(
        { error: 'At least one exam must be assigned and completed before moving to Final Interview.' },
        { status: 422 }
      )
    }

    const allDone = assignments.every((a: { status: string }) => a.status === 'completed')
    if (!allDone) {
      return NextResponse.json(
        { error: 'All assigned exams must be completed before moving to Final Interview.' },
        { status: 422 }
      )
    }
  }

  // If hiring, validate hire_data
  if (new_status === 'hired') {
    if (!hire_data?.client_id) {
      return NextResponse.json({ error: 'A client must be assigned when hiring.' }, { status: 422 })
    }
  }

  const now = new Date().toISOString()
  const trimmedComment = (comment || '').trim() || null

  // 1. Update application status
  const { error: updateErr } = await admin
    .from('applications')
    .update({
      status:                  new_status,
      last_status_comment:     trimmedComment,
      last_status_changed_at:  now,
      last_status_changed_by:  caller.id,
      updated_at:              now,
    })
    .eq('id', id)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  // 2. Insert history entry
  await admin.from('application_status_history').insert({
    application_id: id,
    from_status:    currentStatus,
    to_status:      new_status,
    changed_by:     caller.id,
    note:           trimmedComment,
    created_at:     now,
  })

  // 3. If hired — create employee record
  let newEmployee = null
  if (new_status === 'hired' && hire_data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const app = application as any
    const { data: emp, error: empErr } = await admin
      .from('employees')
      .insert({
        full_name:          `${app.first_name} ${app.last_name}`,
        email:              app.email,
        phone:              app.phone || null,
        address:            app.address || null,
        linkedin_url:       app.linkedin_url || null,
        role_title:         hire_data.role_title,
        role_category:      hire_data.role_category || app.headline || null,
        seniority:          hire_data.seniority        || null,
        start_date:         hire_data.start_date       || null,
        employment_type:    hire_data.employment_type  || null,
        monthly_salary_usd: hire_data.monthly_salary_usd ? Number(hire_data.monthly_salary_usd) : null,
        client_id:          hire_data.client_id,
        source_application_id: id,
        status:             'active',
        is_archived:        false,
        created_by:         caller.id,
        updated_by:         caller.id,
      })
      .select('*, clients(id, name)')
      .single()

    if (empErr) {
      console.error('[status/route] Employee creation failed:', empErr.message)
    } else {
      newEmployee = emp
      await logAudit({
        entity_type: 'employee', entity_id: emp.id, action: 'hire_confirmation',
        performed_by: caller.id,
        metadata: { application_id: id, client_id: hire_data.client_id }
      })
    }
  }

  // 4. Audit log for status change
  await logAudit({
    entity_type: 'application', entity_id: id, action: 'status_change',
    performed_by: caller.id,
    metadata: {
      from_status: currentStatus,
      to_status:   new_status,
      comment:     trimmedComment,
    }
  })

  // 5. Send rejection email (fire-and-forget — don't fail the request if email fails)
  if (new_status === 'rejected') {
    const app = application as any
    sendRejectionEmail({
      first_name: app.first_name,
      last_name:  app.last_name,
      email:      app.email,
      job_title:  app.jobs?.title ?? 'the position',
    }).catch(err => console.error('[rejection email]', err.message))
  }

  return NextResponse.json({
    success:  true,
    new_status,
    employee: newEmployee,
  })
}
