import { NextRequest, NextResponse } from 'next/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import { requireStaff } from '@/lib/auth'

// GET /api/admin/applications/[id]/exams — Get all exam assignments for an application
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireStaff()
  if (!caller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const admin = createAdminClientAny()

  // Fetch assignments with exam details and answers
  const { data: assignments, error } = await admin
    .from('exam_assignments')
    .select(`
      id, status, expires_at, started_at, completed_at, score, total_points, earned_points, assigned_by, created_at, focus_violations,
      exams(id, title, description, duration_minutes, passing_score, question_count, exam_categories(name))
    `)
    .eq('application_id', id)
    .order('created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Check and update expired assignments
  const now = new Date()
  for (const a of (assignments || [])) {
    if (['pending', 'reactivated', 'in_progress'].includes(a.status) && new Date(a.expires_at) < now) {
      await admin.from('exam_assignments').update({ status: 'expired' }).eq('id', a.id)
      a.status = 'expired'
    }
  }

  // Always fetch General category exams — suggested for every job
  const { data: generalCat } = await admin
    .from('exam_categories')
    .select('id')
    .ilike('name', 'general')
    .limit(1)
    .single()

  let generalExams: unknown[] = []
  if (generalCat) {
    const { data } = await admin
      .from('exams')
      .select('id, title, description, duration_minutes, question_count, exam_categories(name)')
      .eq('category_id', generalCat.id)
      .eq('is_active', true)
      .order('title')
    generalExams = data || []
  }

  // Get suggested exams based on job category
  const { data: app } = await admin
    .from('applications')
    .select('jobs(job_categories(name))')
    .eq('id', id)
    .single()

  const categoryName = (app as any)?.jobs?.job_categories?.name
  let categoryExams: unknown[] = []

  if (categoryName) {
    const { data: matchingCat } = await admin
      .from('exam_categories')
      .select('id')
      .ilike('name', `%${categoryName}%`)
      .not('name', 'ilike', 'general')
      .limit(1)
      .single()

    if (matchingCat) {
      const { data } = await admin
        .from('exams')
        .select('id, title, description, duration_minutes, question_count, exam_categories(name)')
        .eq('category_id', matchingCat.id)
        .eq('is_active', true)
        .order('title')
      categoryExams = data || []
    }
  }

  // General exams first, then role-specific ones (deduplicated by id)
  const generalIds = new Set((generalExams as { id: string }[]).map(e => e.id))
  const uniqueCategoryExams = (categoryExams as { id: string }[]).filter(e => !generalIds.has(e.id))
  const suggestedExams = [...generalExams, ...uniqueCategoryExams]

  // Get all active exams for manual selection
  const { data: allExams } = await admin
    .from('exams')
    .select('id, title, description, duration_minutes, question_count, exam_categories(name)')
    .eq('is_active', true)
    .order('title')

  return NextResponse.json({
    assignments: assignments || [],
    suggested_exams: suggestedExams,
    all_exams: allExams || [],
    job_category: categoryName || null,
  })
}
