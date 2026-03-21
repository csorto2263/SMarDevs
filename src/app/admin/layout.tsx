import { createServerSupabaseClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = {
  title: 'Admin | SMarDevs',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The middleware handles redirects for unauthenticated users.
  // Login page must be accessible without auth.
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not authenticated, the middleware will redirect to login.
  // But if somehow we get here without a user (and we're not on login), redirect.
  if (!user) {
    // Return children as-is — this allows the login page to render
    // The middleware already handles redirect logic for non-login admin routes
    return <>{children}</>
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

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
