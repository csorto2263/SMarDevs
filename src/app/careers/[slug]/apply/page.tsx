import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import ApplicationForm from '@/components/ApplicationForm'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data: job } = await supabase.from('jobs').select('title').eq('slug', slug).eq('status', 'published').single()
  return {
    title: job ? `Apply - ${job.title}` : 'Apply',
    robots: { index: false, follow: false },
  }
}

export default async function ApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  // Fetch the job
  const { data: job } = await supabase
    .from('jobs')
    .select('id, title, slug, status, category_id, job_categories(name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!job) return notFound()

  // Fetch active questions for this job
  const { data: jobQuestions } = await supabase
    .from('job_questions')
    .select('*, questions(*)')
    .eq('job_id', job.id)
    .eq('is_active', true)
    .order('sort_order')

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="container-custom pt-28 pb-20">
          {/* Back */}
          <Link href={`/careers/${slug}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to {job.title}
          </Link>

          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-navy-950">Apply for {job.title}</h1>
              {/* eslint-disable @typescript-eslint/no-explicit-any */}
              {(job as any).job_categories?.name && (
                <p className="text-gray-500 mt-2">{(job as any).job_categories.name}</p>
              )}
              {/* eslint-enable @typescript-eslint/no-explicit-any */}
            </div>

            {/* Form */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <ApplicationForm
              jobId={job.id}
              jobSlug={job.slug}
              jobTitle={job.title}
              questions={(jobQuestions || []) as any}
            />

            {/* Trust */}
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              Your information is encrypted and securely stored
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
