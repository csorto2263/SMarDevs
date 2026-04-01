'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserCog,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Building2,
  UserCheck,
  Globe,
  BookOpen,
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase/types'

const navItems = [
  { href: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { href: '/admin/jobs',       label: 'Jobs',        icon: Briefcase },
  { href: '/admin/applicants', label: 'Applicants',  icon: Users },
  { href: '/admin/exams',      label: 'Exams',       icon: BookOpen },
  { href: '/admin/clients',    label: 'Clients',     icon: Building2,  adminOnly: true },
  { href: '/admin/employees',  label: 'Employees',   icon: UserCheck,  adminOnly: true },
  { href: '/admin/users',      label: 'Users',       icon: UserCog,    adminOnly: true },
  { href: '/admin/settings',   label: 'Settings',    icon: Settings },
]

interface AdminSidebarProps {
  user: User
  profile: Profile | null
}

export default function AdminSidebar({ user, profile }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-navy-800/50">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 text-white text-sm font-bold shadow-md shadow-blue-500/25">
            S
          </span>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">
              SMar<span className="text-blue-400">Devs</span>
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-medium -mt-0.5">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.filter(item => !item.adminOnly || profile?.role === 'admin').map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-brand-600/20 text-brand-400 shadow-sm'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              )}
            >
              <item.icon className={cn('w-5 h-5', active ? 'text-brand-400' : 'text-gray-500')} />
              <span>{item.label}</span>
              {active && <ChevronRight className="w-4 h-4 ml-auto text-brand-400" />}
            </Link>
          )
        })}
      </nav>

      {/* View site */}
      <div className="px-4 pb-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-all"
        >
          <Globe className="w-5 h-5" />
          <span>View Website</span>
        </Link>
      </div>

      {/* User profile + logout */}
      <div className="p-4 border-t border-navy-800/50">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-accent-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {(profile?.full_name || user.email || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              {profile?.full_name || 'Admin'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-navy-900 border border-navy-800 rounded-xl text-gray-400 hover:text-white shadow-lg transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-navy-950 border-r border-navy-800/50 shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-navy-950 border-r border-navy-800/50 z-40">
        <SidebarContent />
      </aside>
    </>
  )
}
