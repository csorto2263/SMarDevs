'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface Props {
  categories: { id: string; name: string; slug: string }[]
  currentCategory?: string
  currentSeniority?: string
  currentSearch?: string
}

export default function CareersFilters({ categories, currentCategory, currentSeniority, currentSearch }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(currentSearch || '')

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams()
    if (currentCategory && key !== 'category') params.set('category', currentCategory)
    if (currentSeniority && key !== 'seniority') params.set('seniority', currentSeniority)
    if (currentSearch && key !== 'search') params.set('search', currentSearch)
    if (value) params.set(key, value)
    const qs = params.toString()
    router.push(`${pathname}${qs ? `?${qs}` : ''}#positions`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams('search', search)
  }

  const clearAll = () => {
    router.push(`${pathname}#positions`)
    setSearch('')
  }

  const hasFilters = currentCategory || currentSeniority || currentSearch

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-center">
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search positions..."
          className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all w-56"
        />
      </form>

      <select
        value={currentCategory || ''}
        onChange={(e) => updateParams('category', e.target.value)}
        className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
      >
        <option value="">All Categories</option>
        {categories.map(c => (
          <option key={c.id} value={c.slug}>{c.name}</option>
        ))}
      </select>

      <select
        value={currentSeniority || ''}
        onChange={(e) => updateParams('seniority', e.target.value)}
        className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
      >
        <option value="">All Levels</option>
        <option value="junior">Junior</option>
        <option value="mid">Mid-Level</option>
        <option value="senior">Senior</option>
        <option value="lead">Lead</option>
        <option value="principal">Principal</option>
      </select>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear filters
        </button>
      )}
    </div>
  )
}
