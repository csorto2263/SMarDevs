'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save, ArrowLeft, Plus, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { JobCategory, Job } from '@/lib/supabase/types'

interface JobFormProps {
  categories: JobCategory[]
  initialData?: Job
}

interface ArrayFieldEditorProps {
  field: string
  label: string
  placeholder: string
  items: string[]
  onUpdate: (field: string, index: number, value: string) => void
  onAdd: (field: string) => void
  onRemove: (field: string, index: number) => void
  inputClasses: string
  labelClasses: string
}

function ArrayFieldEditor({ field, label, placeholder, items, onUpdate, onAdd, onRemove, inputClasses, labelClasses }: ArrayFieldEditorProps) {
  return (
    <div>
      <label className={labelClasses}>{label}</label>
      <div className="space-y-2">
        {items.map((item: string, idx: number) => (
          <div key={idx} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => onUpdate(field, idx, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  onAdd(field)
                }
              }}
              placeholder={placeholder}
              className={inputClasses}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(field, idx)}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onAdd(field)}
        className="mt-2 inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium"
      >
        <Plus className="w-3.5 h-3.5" />
        Add item
      </button>
    </div>
  )
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function JobForm({ categories, initialData }: JobFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    category_id: initialData?.category_id || '',
    department: initialData?.department || '',
    modality: initialData?.modality || 'remote',
    location: initialData?.location || 'Remote - LATAM',
    seniority: initialData?.seniority || 'mid',
    contract_type: initialData?.contract_type || 'full_time_contractor',
    summary: initialData?.summary || '',
    responsibilities: initialData?.responsibilities || [''],
    requirements: initialData?.requirements || [''],
    preferred_qualifications: initialData?.preferred_qualifications || [''],
    tech_stack: initialData?.tech_stack || [''],
    benefits: initialData?.benefits || [''],
    salary_min: initialData?.salary_min || '',
    salary_max: initialData?.salary_max || '',
    show_salary: initialData?.show_salary || false,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formAny = form as any

  const updateField = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (field === 'title' && !isEditing && typeof value === 'string') {
      setForm(prev => ({ ...prev, slug: slugify(value) }))
    }
  }

  const updateArrayField = (field: string, index: number, value: string) => {
    setForm(prev => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const arr = [...(prev as any)[field] as string[]]
      arr[index] = value
      return { ...prev, [field]: arr }
    })
  }

  const addArrayItem = (field: string) => {
    setForm(prev => ({ ...prev, [field]: [...formAny[field], ''] }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setForm(prev => ({
      ...prev,
      [field]: formAny[field].filter((_val: string, i: number) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const cleanedData = {
      ...form,
      responsibilities: form.responsibilities.filter(Boolean),
      requirements: form.requirements.filter(Boolean),
      preferred_qualifications: form.preferred_qualifications.filter(Boolean),
      tech_stack: form.tech_stack.filter(Boolean),
      benefits: form.benefits.filter(Boolean),
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
    }

    try {
      if (isEditing) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: err } = await supabase.from('jobs').update(cleanedData as any).eq('id', initialData.id)
        if (err) throw err
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: err } = await supabase.from('jobs').insert(cleanedData as any)
        if (err) throw err
      }
      router.push('/admin/jobs')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save job')
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all'
  const labelClasses = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      {/* Basic info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy-950 border-b border-gray-100 pb-3">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClasses}>Job Title *</label>
            <input value={form.title} onChange={(e) => updateField('title', e.target.value)} required placeholder="e.g., Senior Frontend Developer" className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Slug *</label>
            <input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} required placeholder="senior-frontend-developer" className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Department</label>
            <input value={form.department} onChange={(e) => updateField('department', e.target.value)} placeholder="e.g., Engineering" className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Role Category *</label>
            <select value={form.category_id} onChange={(e) => updateField('category_id', e.target.value)} required className={inputClasses}>
              <option value="">Select role category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">Used to assign screening questions automatically.</p>
          </div>
          <div>
            <label className={labelClasses}>Seniority *</label>
            <select value={form.seniority} onChange={(e) => updateField('seniority', e.target.value)} className={inputClasses}>
              <option value="junior">Junior</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="principal">Principal</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Modality *</label>
            <select value={form.modality} onChange={(e) => updateField('modality', e.target.value)} className={inputClasses}>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Location *</label>
            <input value={form.location} onChange={(e) => updateField('location', e.target.value)} required placeholder="Remote - LATAM" className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Contract Type *</label>
            <select value={form.contract_type} onChange={(e) => updateField('contract_type', e.target.value)} className={inputClasses}>
              <option value="full_time_contractor">Full-Time Contractor</option>
              <option value="part_time_contractor">Part-Time Contractor</option>
              <option value="full_time_employee">Full-Time Employee</option>
              <option value="part_time_employee">Part-Time Employee</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy-950 border-b border-gray-100 pb-3">Description</h2>
        <div>
          <label className={labelClasses}>Summary *</label>
          <textarea value={form.summary} onChange={(e) => updateField('summary', e.target.value)} required rows={4} placeholder="Brief description of the role..." className={inputClasses} />
        </div>
      </div>

      {/* Array fields */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-navy-950 border-b border-gray-100 pb-3">Details</h2>
        <ArrayFieldEditor field="responsibilities" label="Responsibilities *" placeholder="e.g., Design and implement new features..." items={form.responsibilities} onUpdate={updateArrayField} onAdd={addArrayItem} onRemove={removeArrayItem} inputClasses={inputClasses} labelClasses={labelClasses} />
        <ArrayFieldEditor field="requirements" label="Requirements *" placeholder="e.g., 5+ years of experience with React..." items={form.requirements} onUpdate={updateArrayField} onAdd={addArrayItem} onRemove={removeArrayItem} inputClasses={inputClasses} labelClasses={labelClasses} />
        <ArrayFieldEditor field="preferred_qualifications" label="Preferred Qualifications" placeholder="e.g., Experience with GraphQL..." items={form.preferred_qualifications} onUpdate={updateArrayField} onAdd={addArrayItem} onRemove={removeArrayItem} inputClasses={inputClasses} labelClasses={labelClasses} />
        <ArrayFieldEditor field="tech_stack" label="Tech Stack" placeholder="e.g., React" items={form.tech_stack} onUpdate={updateArrayField} onAdd={addArrayItem} onRemove={removeArrayItem} inputClasses={inputClasses} labelClasses={labelClasses} />
        <ArrayFieldEditor field="benefits" label="Benefits" placeholder="e.g., Competitive USD compensation..." items={form.benefits} onUpdate={updateArrayField} onAdd={addArrayItem} onRemove={removeArrayItem} inputClasses={inputClasses} labelClasses={labelClasses} />
      </div>

      {/* Salary */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-navy-950 border-b border-gray-100 pb-3">Compensation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className={labelClasses}>Min Salary (USD/month)</label>
            <input type="number" value={form.salary_min} onChange={(e) => updateField('salary_min', e.target.value)} placeholder="e.g., 3000" className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Max Salary (USD/month)</label>
            <input type="number" value={form.salary_max} onChange={(e) => updateField('salary_max', e.target.value)} placeholder="e.g., 6000" className={inputClasses} />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.show_salary} onChange={(e) => updateField('show_salary', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <span className="text-sm text-gray-700">Show salary on listing</span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4">
        <Link href="/admin/jobs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-brand-600/20 transition-all text-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isEditing ? 'Update Job' : 'Create Job'}
        </button>
      </div>
    </form>
  )
}
