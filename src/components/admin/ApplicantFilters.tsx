'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useState, useCallback } from 'react'

interface Props {
  jobs: { id: string; title: string }[]
  countries: { code: string; name: string }[]
  currentJob?: string
  currentStatus?: string
  currentSearch?: string
  currentCountry?: string
  currentFrom?: string
  currentTo?: string
}

export default function ApplicantFilters({ jobs, countries, currentJob, currentStatus, currentSearch, currentCountry, currentFrom, currentTo }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(currentSearch || '')

  const updateParams = useCallback((key: string, value: string) => {
    const params = new URLSearchParams()
    if (currentJob && key !== 'job') params.set('job', currentJob)
    if (currentStatus && key !== 'status') params.set('status', currentStatus)
    if (currentSearch && key !== 'search') params.set('search', currentSearch)
    if (currentCountry && key !== 'country') params.set('country', currentCountry)
    if (currentFrom && key !== 'from') params.set('from', currentFrom)
    if (currentTo && key !== 'to') params.set('to', currentTo)
    if (value) params.set(key, value)
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, currentJob, currentStatus, currentSearch, currentCountry, currentFrom, currentTo])

  const clearAll = () => {
    router.push(pathname)
    setSearch('')
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams('search', search)
  }

  const hasFilters = currentJob || currentStatus || currentSearch || currentCountry || currentFrom || currentTo

  const selectClasses = 'px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all'
  const dateClasses = 'px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all'

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[200px] max-w-xs">
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

      {/* Country filter */}
      {countries.length > 0 && (
        <select
          value={currentCountry || ''}
          onChange={(e) => updateParams('country', e.target.value)}
          className={selectClasses}
        >
          <option value="">All Countries</option>
          {countries.map(c => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      )}

      {/* Date range */}
      <div className="inline-flex items-center gap-1.5">
        <input
          type="date"
          value={currentFrom || ''}
          onChange={(e) => updateParams('from', e.target.value)}
          className={dateClasses}
          title="From date"
        />
        <span className="text-xs text-gray-400">to</span>
        <input
          type="date"
          value={currentTo || ''}
          onChange={(e) => updateParams('to', e.target.value)}
          className={dateClasses}
          title="To date"
        />
      </div>

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
