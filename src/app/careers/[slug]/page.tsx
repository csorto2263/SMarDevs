import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  ArrowLeft, ArrowRight, MapPin, Clock, Briefcase, Code2,
  CheckCircle2, Star, Heart, DollarSign, Layers
} from 'lucide-react'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data: job } = await supabase.from('jobs').select('title, summary').eq('slug', slug).eq('status', 'published').single()

  if (!job) return { title: 'Job Not Found' }

  return {
    title: `${job.title} | Careers`,
    description: job.summary,
    openGraph: {
      title: `${job.title} | Careers`,
      description: job.summary,
    },
  }
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('*, job_categories(name, slug)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!job) return notFound()

  const seniorityLabel: Record<string, string> = {
    junior: 'Junior', mid: 'Mid-Level', senior: 'Senior', lead: 'Lead', principal: 'Principal',
  }
  const contractLabel: Record<string, string> = {
    full_time_contractor: 'Full-Time Contractor',
    part_time_contractor: 'Part-Time Contractor',
    full_time_employee: 'Full-Time',
    part_time_employee: 'Part-Time',
  }
  const modalityLabel: Record<string, string> = {
    remote: 'Remote', hybrid: 'Hybrid', onsite: 'On-site',
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-hero-gradient text-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-brand-600/20 rounded-full blur-3xl" />
          </div>
          <div className="container-custom pt-32 pb-16 relative z-10">
            <Link href="/careers" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-6">
              <ArrowLeft className="w-4 h-4" />
              All Positions
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {job.title}
            </h1>
            {job.department && (
              <p className="text-lg text-gray-300 mt-2">{job.department}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm font-medium">
                <Briefcase className="w-4 h-4" />
                {seniorityLabel[job.seniority]}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm font-medium">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm font-medium">
                <Clock className="w-4 h-4" />
                {contractLabel[job.contract_type]}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm font-medium">
                <Layers className="w-4 h-4" />
                {modalityLabel[job.modality]}
              </span>
              {/* eslint-disable @typescript-eslint/no-explicit-any */}
              {(job as any).job_categories?.name && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/20 text-sm font-medium">
                  <Code2 className="w-4 h-4" />
                  {(job as any).job_categories.name}
                </span>
              )}
              {/* eslint-enable @typescript-eslint/no-explicit-any */}
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-green-300 text-lg font-semibold">
              <DollarSign className="w-5 h-5" />
              Compensation: Based on experience
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main */}
              <div className="lg:col-span-2 space-y-10">
                {/* Summary */}
                <div>
                  <h2 className="text-2xl font-bold text-navy-950 mb-4">About This Role</h2>
                  <p className="text-gray-700 leading-relaxed">{job.summary}</p>
                </div>

                {/* Responsibilities */}
                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-navy-950 mb-4">Responsibilities</h2>
                    <ul className="space-y-3">
                      {job.responsibilities.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                          <span className="text-gray-700">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-navy-950 mb-4">Requirements</h2>
                    <ul className="space-y-3">
                      {job.requirements.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                          <span className="text-gray-700">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Preferred */}
                {job.preferred_qualifications && job.preferred_qualifications.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-navy-950 mb-4">Nice to Have</h2>
                    <ul className="space-y-3">
                      {job.preferred_qualifications.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-gray-700">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech stack */}
                {job.tech_stack && job.tech_stack.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-navy-950 mb-4">Tech Stack</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.tech_stack.map((t: string, i: number) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-950/5 text-navy-950 text-sm font-medium">
                          <Code2 className="w-3.5 h-3.5 text-brand-500" />
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-navy-950 mb-4">What You Get</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {job.benefits.map((b: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-green-50/50 border border-green-100">
                          <Heart className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Apply card */}
                <div className="sticky top-24 space-y-6">
                  <div className="bg-gradient-to-br from-brand-600 to-accent-500 rounded-2xl p-6 text-white shadow-xl shadow-brand-600/20">
                    <h3 className="text-xl font-bold mb-2">Interested?</h3>
                    <p className="text-blue-100 text-sm mb-5">
                      Apply now and our team will review your profile within 48 hours.
                    </p>
                    <Link
                      href={`/careers/${job.slug}/apply`}
                      className="flex items-center justify-center gap-2 w-full bg-white text-brand-600 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      Apply Now
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>

                  {/* Quick info */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-sm font-semibold text-navy-950 uppercase tracking-wider mb-4">Position Details</h3>
                    <dl className="space-y-3 text-sm">
                      {/* eslint-disable @typescript-eslint/no-explicit-any */}
                      {(job as any).job_categories?.name && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Category</dt>
                          <dd className="font-medium text-navy-950">{(job as any).job_categories.name}</dd>
                        </div>
                      )}
                      {/* eslint-enable @typescript-eslint/no-explicit-any */}
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Seniority</dt>
                        <dd className="font-medium text-navy-950">{seniorityLabel[job.seniority]}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Location</dt>
                        <dd className="font-medium text-navy-950">{job.location}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Modality</dt>
                        <dd className="font-medium text-navy-950">{modalityLabel[job.modality]}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Contract</dt>
                        <dd className="font-medium text-navy-950">{contractLabel[job.contract_type]}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
