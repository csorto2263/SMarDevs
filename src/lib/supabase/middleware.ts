import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const STAFF_ROLES = ['admin', 'recruiter', 'hiring_manager']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Anon client — used only for session refresh
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Service-role client — bypasses RLS for role lookups
  const adminClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser()

  // ── /portal routes ──────────────────────────────────────────────────────────
  if (request.nextUrl.pathname.startsWith('/portal')) {
    if (request.nextUrl.pathname === '/portal/login') {
      if (user) {
        const url = request.nextUrl.clone()
        url.pathname = '/portal'
        return NextResponse.redirect(url)
      }
      return supabaseResponse
    }
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/portal/login'
      return NextResponse.redirect(url)
    }

    // Logged-in users who are staff should NOT access the portal
    if (user) {
      const { data: profile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      if (profile && STAFF_ROLES.includes(profile.role)) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
    }

    return supabaseResponse
  }

  // ── /admin routes ───────────────────────────────────────────────────────────
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Always allow: email-link reset, forgot password, and login page
    if (
      request.nextUrl.pathname === '/admin/reset-password' ||
      request.nextUrl.pathname === '/admin/forgot-password' ||
      request.nextUrl.pathname === '/admin/login'
    ) {
      if (user && (request.nextUrl.pathname === '/admin/login' || request.nextUrl.pathname === '/admin/forgot-password')) {
        // Already authenticated — check if they're staff before redirecting
        const { data: profile } = await adminClient
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (profile && STAFF_ROLES.includes(profile.role)) {
          const url = request.nextUrl.clone()
          url.pathname = '/admin'
          return NextResponse.redirect(url)
        }
        // Logged in but not staff → send them to portal or login
        const url = request.nextUrl.clone()
        url.pathname = profile?.role === 'applicant' ? '/portal' : '/admin/login'
        return NextResponse.redirect(url)
      }
      return supabaseResponse
    }

    // Not logged in → redirect to login
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Logged in — verify they are staff (admin / recruiter / hiring_manager)
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !STAFF_ROLES.includes(profile.role)) {
      // Applicant trying to access admin → kick to portal
      const url = request.nextUrl.clone()
      url.pathname = profile?.role === 'applicant' ? '/portal' : '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
