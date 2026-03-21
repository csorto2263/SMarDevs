'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Loader2, CheckCircle2, AlertCircle, X, FileText } from 'lucide-react'
import Link from 'next/link'
import { latamCountries, statesByCountry } from '@/data/locations'

interface QuestionData {
  id: string
  question_id: string
  is_required: boolean | null
  questions: {
    id: string
    question_text: string
    question_type: string
    options: string[] | string | null
    placeholder: string | null
    helper_text: string | null
  }
}

interface Props {
  jobId: string
  jobSlug: string
  jobTitle: string
  questions: QuestionData[]
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ApplicationForm({ jobId, jobSlug, jobTitle, questions }: Props) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Form fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [headline, setHeadline] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [country, setCountry] = useState('')
  const [stateProvince, setStateProvince] = useState('')
  const [city, setCity] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [salaryExpectation, setSalaryExpectation] = useState('')
  const [isLatam, setIsLatam] = useState('')
  const [englishLevel, setEnglishLevel] = useState('')
  const [availability, setAvailability] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [emailError, setEmailError] = useState('')

  // Dynamic question answers
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const validateEmail = (value: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!value) return
    setEmailError(re.test(value) ? '' : 'Please enter a valid email address (e.g. john@example.com)')
  }

  const updateAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Validate type
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(file.type)) {
      setErrorMessage('Please upload a PDF or Word document')
      return
    }
    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size must be under 5MB')
      return
    }
    setResumeFile(file)
    setErrorMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRe.test(email)) {
      setEmailError('Please enter a valid email address (e.g. john@example.com)')
      return
    }

    setFormState('submitting')
    setErrorMessage('')

    try {
      const supabase = createClient()

      // Upload resume if provided
      let resumeUrl = ''
      let resumeFilename = ''
      if (resumeFile) {
        const ext = resumeFile.name.split('.').pop()
        const path = `${jobId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(path, resumeFile)

        if (uploadError) throw new Error('Resume upload failed: ' + uploadError.message)

        // Store the path (not public URL) since bucket is private
        resumeUrl = path
        resumeFilename = resumeFile.name
      }

      // Generate ID client-side to avoid needing SELECT-after-INSERT (anon has no SELECT policy)
      const applicationId = crypto.randomUUID()

      // Create application
      const { error: appError } = await supabase
        .from('applications')
        .insert({
          id: applicationId,
          job_id: jobId,
          first_name: firstName,
          last_name: lastName,
          email,
          phone: phone || null,
          headline: headline || null,
          address: [streetAddress, city, stateProvince, country].filter(Boolean).join(', ') || null,
          resume_url: resumeUrl || null,
          resume_filename: resumeFilename || null,
          linkedin_url: linkedinUrl || null,
          portfolio_url: portfolioUrl || null,
          github_url: githubUrl || null,
          cover_letter: coverLetter || null,
          salary_expectation: salaryExpectation ? Number(salaryExpectation) : null,
          is_latam: isLatam === 'yes' ? true : isLatam === 'no' ? false : null,
          english_level: englishLevel || null,
          availability: availability || null,
        })

      if (appError) throw appError

      // Save dynamic answers
      if (Object.keys(answers).length > 0) {
        const answerRows = Object.entries(answers)
          .filter((entry) => entry[1].trim())
          .map(([qId, val]) => ({
            application_id: applicationId,
            question_id: qId,
            answer_text: val,
          }))

        if (answerRows.length > 0) {
          const { error: ansError } = await supabase
            .from('application_answers')
            .insert(answerRows)
          if (ansError) console.error('Answers save error:', ansError)
        }
      }

      // Send confirmation email (fire and forget — don't block success on this)
      fetch('/api/careers/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, jobTitle }),
      }).catch(() => {/* silent fail */})

      setFormState('success')
    } catch (err: unknown) {
      console.error('Application submit error:', err)
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setFormState('error')
    }
  }

  // Success state
  if (formState === 'success') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-5">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-navy-950 mb-2">Application Submitted!</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Thank you for applying to <strong>{jobTitle}</strong>. Our team will review your profile and get back to you within 48 hours.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/careers" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            Browse More Positions
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const inputClasses = 'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all'
  const labelClasses = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error */}
      {(formState === 'error' || errorMessage) && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage || 'Submission failed. Please try again.'}</span>
        </div>
      )}

      {/* Section A: Personal Information */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-navy-950 mb-5 pb-3 border-b border-gray-100">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>First Name *</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="John" className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Last Name *</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Doe" className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value) }}
              onBlur={(e) => validateEmail(e.target.value)}
              required
              placeholder="john@example.com"
              className={`${inputClasses} ${emailError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
            />
            {emailError && <p className="mt-1.5 text-xs text-red-500">{emailError}</p>}
          </div>
          <div>
            <label className={labelClasses}>Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+504 9999-9999" className={inputClasses} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClasses}>Headline <span className="text-gray-400 font-normal">(optional)</span></label>
            <input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g., Senior React Developer with 6 years of experience" className={inputClasses} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClasses}>Address <span className="text-gray-400 font-normal">(optional)</span></label>
            <input value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="e.g., 123 Main Street, Suite 4" className={inputClasses} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClasses}>Location</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <select value={country} onChange={(e) => { setCountry(e.target.value); setStateProvince('') }} className={inputClasses}>
                  <option value="">Country *</option>
                  {latamCountries.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <select value={stateProvince} onChange={(e) => setStateProvince(e.target.value)} className={inputClasses} disabled={!country}>
                  <option value="">State / Province</option>
                  {(statesByCountry[country] || []).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <input value={city} onChange={(e) => setCity(e.target.value.slice(0, 30))} placeholder="City" maxLength={30} className={inputClasses} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section B: Profile */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-navy-950 mb-5 pb-3 border-b border-gray-100">Profile</h2>
        <div className="space-y-4">
          {/* Resume upload */}
          <div>
            <label className={labelClasses}>Resume *</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 transition-all"
            >
              {resumeFile ? (
                <>
                  <FileText className="w-8 h-8 text-brand-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-950 truncate">{resumeFile.name}</p>
                    <p className="text-xs text-gray-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setResumeFile(null) }}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-navy-950">Upload your resume</p>
                    <p className="text-xs text-gray-500">PDF or Word document, max 5MB</p>
                  </div>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
          </div>
          <div>
            <label className={labelClasses}>LinkedIn URL</label>
            <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className={inputClasses} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Portfolio URL <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://yourportfolio.com" className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>GitHub URL <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/yourusername" className={inputClasses} />
            </div>
          </div>
          <div>
            <label className={labelClasses}>Cover Letter / Additional Notes <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={4} placeholder="Tell us why you're interested in this role..." className={inputClasses} />
          </div>
        </div>
      </div>

      {/* Section C: Details */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-navy-950 mb-5 pb-3 border-b border-gray-100">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Monthly Salary Expectation (USD) *</label>
            <input type="number" value={salaryExpectation} onChange={(e) => setSalaryExpectation(e.target.value)} required placeholder="e.g., 4000" className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Are you located in LATAM? *</label>
            <select value={isLatam} onChange={(e) => setIsLatam(e.target.value)} required className={inputClasses}>
              <option value="">Select...</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>English Level *</label>
            <select value={englishLevel} onChange={(e) => setEnglishLevel(e.target.value)} required className={inputClasses}>
              <option value="">Select...</option>
              <option value="A1 - Beginner">A1 - Beginner</option>
              <option value="A2 - Elementary">A2 - Elementary</option>
              <option value="B1 - Intermediate">B1 - Intermediate</option>
              <option value="B2 - Upper Intermediate">B2 - Upper Intermediate</option>
              <option value="C1 - Advanced">C1 - Advanced</option>
              <option value="C2 - Proficient">C2 - Proficient</option>
              <option value="Native">Native Speaker</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Availability / Notice Period *</label>
            <select value={availability} onChange={(e) => setAvailability(e.target.value)} required className={inputClasses}>
              <option value="">Select...</option>
              <option value="Immediate">Immediate</option>
              <option value="1 week">1 week</option>
              <option value="2 weeks">2 weeks</option>
              <option value="1 month">1 month</option>
              <option value="More than 1 month">More than 1 month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section D: Role-specific questions */}
      {questions.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy-950 mb-5 pb-3 border-b border-gray-100">Role-Specific Questions</h2>
          <div className="space-y-5">
            {questions.map((jq) => {
              const q = jq.questions
              return (
                <div key={jq.id}>
                  <label className={labelClasses}>
                    {q.question_text} {jq.is_required && <span className="text-red-500">*</span>}
                  </label>
                  {q.helper_text && <p className="text-xs text-gray-500 mb-1.5">{q.helper_text}</p>}

                  {q.question_type === 'textarea' && (
                    <textarea
                      value={answers[q.id] || ''}
                      onChange={(e) => updateAnswer(q.id, e.target.value)}
                      required={jq.is_required ?? false}
                      placeholder={q.placeholder || ''}
                      rows={3}
                      className={inputClasses}
                    />
                  )}
                  {q.question_type === 'text' && (
                    <input
                      value={answers[q.id] || ''}
                      onChange={(e) => updateAnswer(q.id, e.target.value)}
                      required={jq.is_required ?? false}
                      placeholder={q.placeholder || ''}
                      className={inputClasses}
                    />
                  )}
                  {q.question_type === 'url' && (
                    <input
                      type="url"
                      value={answers[q.id] || ''}
                      onChange={(e) => updateAnswer(q.id, e.target.value)}
                      required={jq.is_required ?? false}
                      placeholder={q.placeholder || 'https://...'}
                      className={inputClasses}
                    />
                  )}
                  {q.question_type === 'number' && (
                    <input
                      type="number"
                      value={answers[q.id] || ''}
                      onChange={(e) => updateAnswer(q.id, e.target.value)}
                      required={jq.is_required ?? false}
                      placeholder={q.placeholder || ''}
                      className={inputClasses}
                    />
                  )}
                  {(q.question_type === 'select' || q.question_type === 'radio') && q.options && (
                    <select
                      value={answers[q.id] || ''}
                      onChange={(e) => updateAnswer(q.id, e.target.value)}
                      required={jq.is_required ?? false}
                      className={inputClasses}
                    >
                      <option value="">Select an option...</option>
                      {(Array.isArray(q.options) ? q.options : JSON.parse(q.options)).map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={formState === 'submitting'}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-accent-500 hover:from-brand-500 hover:to-accent-400 text-white font-semibold px-10 py-4 rounded-full shadow-lg shadow-brand-600/25 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formState === 'submitting' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </form>
  )
}
