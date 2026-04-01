import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClientAny } from '@/lib/supabase/admin'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = {
  title: 'Admin | SMarDevs',
  robots: { index: false, follow: false },
}

const STAFF_ROLES = ['admin', 'recruiter', 'hiring_manager']

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // No session → login page renders itself, everything else redirects
  if (!user) {
    return <>{children}</>
  }

  // Use admin client to bypass RLS for role check
  const adminClient = createAdminClientAny()
  const { data: profile } = await adminClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Not a staff member → hard redirect, no UI rendered
  if (!profile || !STAFF_ROLES.includes(profile.role)) {
    redirect(profile?.role === 'applicant' ? '/portal' : '/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar user={user} profile={profile} />
      <main className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
