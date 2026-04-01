'use client'

import { useState } from 'react'
import { FileText, CheckCircle, ArrowRight, Building2, Mail, User, Shield, TrendingDown, Clock, Star } from 'lucide-react'

const highlights = [
  { icon: TrendingDown, text: '40–63% savings vs. equivalent US talent' },
  { icon: Building2, text: 'All-in rates — no hidden fees or surprises' },
  { icon: Star, text: '12 roles across Engineering, QA, DevOps & Design' },
  { icon: Clock, text: 'Updated for 2026 market data' },
]

export default function SalaryGuidePage() {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/salary-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company, email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setSuccess(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-blue-950 pt-28 pb-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 mb-6">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Free Resource</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
            2026 LATAM Tech<br className="hidden sm:block" />
            <span className="text-blue-400"> Salary Guide</span>
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            All-in monthly rates for hiring pre-vetted LATAM engineers via SMarDevs —
            with real side-by-side comparisons to US-based salaries.
          </p>

          {/* Highlight pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            {highlights.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left">
                <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-sm text-gray-300">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-lg">
          {success ? (
            /* Success state */
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your inbox!</h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                We&apos;ve sent the <strong>2026 LATAM Tech Salary Guide</strong> to{' '}
                <span className="font-semibold text-gray-700">{email}</span>.
                It should arrive within a minute or two.
              </p>
              <p className="text-sm text-gray-400 mb-8">
                Don&apos;t see it? Check your spam or promotions folder.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Book a Free Consultation
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            /* Form */
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <h2 className="text-xl font-bold text-white mb-1">Get the Free Salary Guide</h2>
                <p className="text-blue-100 text-sm">Sent instantly to your inbox as a PDF</p>
              </div>

              <div className="p-8">
                {error && (
                  <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="sg-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="sg-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Smith"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="sg-company" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="sg-company"
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Acme Corp"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="sg-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Work Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="sg-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@acmecorp.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-colors text-sm mt-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Get the Salary Guide
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <span>No spam. We respect your privacy and will only send you the guide.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Preview section */}
      <section className="pb-20 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">What&apos;s Inside</h2>
          <p className="text-gray-500 text-center mb-10 text-sm">A comprehensive breakdown of all-in rates for the most in-demand tech roles</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { category: 'Software Engineering', roles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Software Architect'] },
              { category: 'Mobile & Quality', roles: ['Mobile Developer', 'QA Analyst', 'QA Automation Engineer'] },
              { category: 'Infrastructure & Data', roles: ['DevOps Engineer', 'Data Engineer', 'AI/ML Engineer'] },
              { category: 'Design & Product', roles: ['UI/UX Designer', 'Product Manager'] },
            ].map(({ category, roles }) => (
              <div key={category} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">{category}</h3>
                <ul className="space-y-2">
                  {roles.map((role) => (
                    <li key={role} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* CTA card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white">
              <h3 className="font-semibold text-sm mb-2">Each role includes</h3>
              <ul className="space-y-2">
                {['Junior rate range', 'Mid-level rate range', 'Senior rate range', 'US equivalent salary', 'Estimated savings %'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-blue-100">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
