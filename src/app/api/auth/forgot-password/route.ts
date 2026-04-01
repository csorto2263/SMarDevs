import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email?.trim()) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  const admin = createAdminClientAny()

  // Find user by email in auth.users
  const { data: { users }, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 })
  if (listError) {
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }

  const user = users.find(u => u.email?.toLowerCase() === email.trim().toLowerCase())

  if (!user) {
    return NextResponse.json(
      { error: 'No account found with this email address.' },
      { status: 404 }
    )
  }

  // Check if user has a staff profile (admin, recruiter, hiring_manager)
  const STAFF_ROLES = ['admin', 'recruiter', 'hiring_manager']

  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return NextResponse.json(
      { error: 'No account found with this email address.' },
      { status: 404 }
    )
  }

  if (!STAFF_ROLES.includes(profile.role)) {
    return NextResponse.json(
      { error: 'This email is not associated with a staff account. Applicants must reset their password from the applicant portal.' },
      { status: 403 }
    )
  }

  // Check if user is banned / inactive
  if (user.banned_until && new Date(user.banned_until) > new Date()) {
    return NextResponse.json(
      { error: 'This account is inactive. Please contact your administrator.' },
      { status: 403 }
    )
  }

  // Send password reset email
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const { error: resetError } = await admin.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${siteUrl}/admin/reset-password`,
  })

  if (resetError) {
    return NextResponse.json(
      { error: 'Failed to send reset email. Please try again.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
