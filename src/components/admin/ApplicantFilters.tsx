'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useState, useCallback } from 'react'

interface Props {
  jobs: { id: string; title: string }[]
  currentJob?: string
  currentStatus?: string
  currentSearch?: string
}

export default function ApplicantFilters({ jobs, currentJob, currentStatus, currentSearch }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(currentSearch || '')

  const updateParams = useCallback((key: string, value: string) => {
    const params = new URLSearchParams()
    if (currentJob && key !== 'job') params.set('job', currentJob)
    if (currentStatus && key !== 'status') params.set('status', currentStatus)
    if (currentSearch && key !== 'search') params.set('search', currentSearch)
    if (value) params.set(key, value)
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, currentJob, currentStatus, currentSearch])

  const clearAll = () => {
    router.push(pathname)
    setSearch('')
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams('search', search)
  }

  const hasFilters = currentJob || currentStatus || currentSearch

  const selectClasses = 'px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all'

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
        />
      </form>

      {/* Job filter */}
      <select
        value={currentJob || ''}
        onChange={(e) => updateParams('job', e.target.value)}
        className={selectClasses}
      >
        <option value="">All Positions</option>
        {jobs.map(j => (
          <option key={j.id} value={j.id}>{j.title}</option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={currentStatus || ''}
        onChange={(e) => updateParams('status', e.target.value)}
        className={selectClasses}
      >
        <option value="">All Statuses</option>
        <option value="applied">Applied</option>
        <option value="screening">Screening</option>
        <option value="interview">Interview</option>
        <option value="technical_review">Technical Review</option>
        <option value="final_interview">Final Interview</option>
        <option value="offer">Offer</option>
        <option value="hired">Hired</option>
        <option value="rejected">Rejected</option>
      </select>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  )
}
