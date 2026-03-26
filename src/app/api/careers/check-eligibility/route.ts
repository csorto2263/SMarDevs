import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const { email, phone, first_name, last_name, job_id } = await req.json()

    if (!email || !first_name || !last_name || !job_id) {
      return NextResponse.json({ eligible: true }) // missing data = skip check
    }

    const admin = createAdminClientAny()
    const emailLower = email.toLowerCase().trim()
    const firstLower = first_name.toLowerCase().trim()
    const lastLower = last_name.toLowerCase().trim()

    // 1. Check for duplicate application to the SAME position (highest priority)
    let duplicateQuery = admin
      .from('applications')
      .select('id')
      .eq('job_id', job_id)

    // Build OR conditions for matching identity
    const orConditions: string[] = [`email.ilike.${emailLower}`]
    if (phone && phone.trim()) {
      orConditions.push(`phone.eq.${phone.trim()}`)
    }
    // Note: for name matching we need a separate query since ilike OR is complex
    duplicateQuery = duplicateQuery.or(orConditions.join(','))

    const { data: duplicateByEmailPhone } = await duplicateQuery.limit(1)

    if (duplicateByEmailPhone && duplicateByEmailPhone.length > 0) {
      return NextResponse.json({
        eligible: false,
        reason: 'duplicate',
        message: 'You have already applied for this position.',
      })
    }

    // Also check by name for same job
    const { data: duplicateByName } = await admin
      .from('applications')
      .select('id')
      .eq('job_id', job_id)
      .ilike('first_name', firstLower)
      .ilike('last_name', lastLower)
      .limit(1)

    if (duplicateByName && duplicateByName.length > 0) {
      return NextResponse.json({
        eligible: false,
        reason: 'duplicate',
        message: 'You have already applied for this position.',
      })
    }

    // 2. Check for rejection within last 6 months (any position)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const sixMonthsAgoISO = sixMonthsAgo.toISOString()

    // Check by email
    const { data: rejectedByEmail } = await admin
      .from('applications')
      .select('id, last_status_changed_at')
      .eq('status', 'rejected')
      .ilike('email', emailLower)
      .gte('last_status_changed_at', sixMonthsAgoISO)
      .order('last_status_changed_at', { ascending: false })
      .limit(1)

    if (rejectedByEmail && rejectedByEmail.length > 0) {
      const rejectionDate = new Date(rejectedByEmail[0].last_status_changed_at)
      const reapplyDate = new Date(rejectionDate)
      reapplyDate.setMonth(reapplyDate.getMonth() + 6)
      return NextResponse.json({
        eligible: false,
        reason: 'rejection_cooldown',
        message: `Based on a previous application, you may reapply after ${reapplyDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`,
      })
    }

    // Check by phone
    if (phone && phone.trim()) {
      const { data: rejectedByPhone } = await admin
        .from('applications')
        .select('id, last_status_changed_at')
        .eq('status', 'rejected')
        .eq('phone', phone.trim())
        .gte('last_status_changed_at', sixMonthsAgoISO)
        .order('last_status_changed_at', { ascending: false })
        .limit(1)

      if (rejectedByPhone && rejectedByPhone.length > 0) {
        const rejectionDate = new Date(rejectedByPhone[0].last_status_changed_at)
        const reapplyDate = new Date(rejectionDate)
        reapplyDate.setMonth(reapplyDate.getMonth() + 6)
        return NextResponse.json({
          eligible: false,
          reason: 'rejection_cooldown',
          message: `Based on a previous application, you may reapply after ${reapplyDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`,
        })
      }
    }

    // Check by name
    const { data: rejectedByName } = await admin
      .from('applications')
      .select('id, last_status_changed_at')
      .eq('status', 'rejected')
      .ilike('first_name', firstLower)
      .ilike('last_name', lastLower)
      .gte('last_status_changed_at', sixMonthsAgoISO)
      .order('last_status_changed_at', { ascending: false })
      .limit(1)

    if (rejectedByName && rejectedByName.length > 0) {
      const rejectionDate = new Date(rejectedByName[0].last_status_changed_at)
      const reapplyDate = new Date(rejectionDate)
      reapplyDate.setMonth(reapplyDate.getMonth() + 6)
      return NextResponse.json({
        eligible: false,
        reason: 'rejection_cooldown',
        message: `Based on a previous application, you may reapply after ${reapplyDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`,
      })
    }

    return NextResponse.json({ eligible: true })
  } catch (err) {
    console.error('[check-eligibility] Error:', err)
    // On error, allow submission (don't block candidates due to server issues)
    return NextResponse.json({ eligible: true })
  }
}
