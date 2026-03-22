import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Briefcase, MapPin, Clock, ArrowRight, Code2, Zap, Globe2, Heart, Rocket, Users } from 'lucide-react'
import type { Metadata } from 'next'
import CareersFilters from '@/components/CareersFilters'

export const metadata: Metadata = {
  title: 'Careers | SMarDevs',
  description: 'Join SMarDevs and work with top US companies from anywhere in Latin America. Explore open positions in engineering, QA, design, and more.',
  openGraph: {
    title: 'Careers at SMarDevs',
    description: 'Build your career with elite remote teams. Competitive USD pay, flexible hours, and meaningful projects.',
  },
}

export const revalidate = 60 // ISR: revalidate every 60 seconds

export default async function CareersPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; seniority?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createServerSupabaseClient()

  // Fetch published jobs with categories
  const query = supabase
    .from('jobs')
    .select('*, job_categories(name, slug)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const { data: jobs } = await query

  // Fetch categories for filter
  const { data: categories } = await supabase
    .from('job_categories')
    .select('*')
    .order('sort_order')

  // Apply filters client-side for simplicity with ISR
  let filtered = jobs || []
  if (params.category) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filtered = filtered.filter((j: any) => j.job_categories?.slug === params.category)
  }
  if (params.seniority) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filtered = filtered.filter((j: any) => j.seniority === params.seniority)
  }
  if (params.search) {
    const s = params.search.toLowerCase()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filtered = filtered.filter((j: any) =>
      j.title.toLowerCase().includes(s) ||
      j.summary.toLowerCase().includes(s)
    )
  }

  const seniorityLabel: Record<string, string> = {
    junior: 'Junior',
    mid: 'Mid-Level',
    senior: 'Senior',
    lead: 'Lead',
    principal: 'Principal',
  }

  const contractLabel: Record<string, string> = {
    full_time_contractor: 'Full-Time Contractor',
    part_time_contractor: 'Part-Time Contractor',
    full_time_employee: 'Full-Time',
    part_time_employee: 'Part-Time',
  }

  const benefits = [
    { icon: Zap, title: 'Competitive USD Pay', description: 'Market-rate compensation paid in US dollars every month' },
    { icon: Globe2, title: 'Fully Remote', description: 'Work from anywhere in Latin America with flexible hours' },
    { icon: Rocket, title: 'Career Growth', description: 'Continuous learning opportunities and a clear path forward' },
    { icon: Code2, title: 'Cutting-Edge Projects', description: 'Work with modern tech stacks for innovative US companies' },
    { icon: Heart, title: 'Supportive Culture', description: 'A team that invests in your wellbeing and development' },
    { icon: Users, title: 'Global Community', description: 'Collaborate with talented professionals across the region' },
  ]

  const steps = [
    { num: '01', title: 'Apply Online', description: 'Submit your profile and resume through our application form.' },
    { num: '02', title: 'Technical Review', description: 'Our team reviews your experience, skills, and background against the role requirements.' },
    { num: '03', title: 'Screening Interview', description: 'A 15-minute conversation to validate your CV, understand your background, and get to know you as a professional.' },
    { num: '04', title: 'Challenge', description: 'When relevant to the role, a practical assessment to demonstrate your technical abilities. Not always required.' },
    { num: '05', title: 'Technical Interview', description: 'A deeper technical discussion to review your challenge results and evaluate problem-solving approach.' },
    { num: '06', title: 'Client Interview', description: 'Meet with the client\'s hiring team for a final evaluation and cultural fit conversation.' },
    { num: '07', title: 'Welcome Aboard', description: 'Congratulations — you\'re in. Get onboarded and start your new role with full SMarDevs support.' },
  ]

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-hero-gradient text-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-brand-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          </div>
          <div className="container-custom section-padding relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-200">{filtered.length} open position{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Shape the Future of{' '}
              <span className="gradient-text">Tech Talent</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Join an elite network of Latin American professionals working with innovative US companies.
              Competitive pay, remote flexibility, and meaningful projects.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase mb-3">Why Join SMarDevs</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-950">
                Why LATAM Professionals Choose Us
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b) => (
                <div key={b.title} className="group p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg hover:border-brand-100 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4 group-hover:bg-brand-100 transition-colors">
                    <b.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy-950 mb-2">{b.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase mb-3">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-950">Application Process</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {steps.map((step) => (
                <div key={step.num} className="text-center w-40">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 flex items-center justify-center text-white text-lg font-bold mb-4 shadow-lg shadow-brand-600/20">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-semibold text-navy-950 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="section-padding bg-white" id="positions">
          <div className="container-custom">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase mb-3">Open Positions</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-950">Find Your Next Role</h2>
            </div>

            {/* Filters */}
            <CareersFilters
              categories={categories || []}
              currentCategory={params.category}
              currentSeniority={params.seniority}
              currentSearch={params.search}
            />

            {/* Job cards */}
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-navy-950 mb-2">No positions found</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  {params.category || params.seniority || params.search
                    ? 'Try adjusting your filters to see more results.'
                    : 'We don\'t have open positions right now, but check back soon or send us your profile.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {filtered.map((job: any) => (
                  <Link
                    key={job.id}
                    href={`/careers/${job.slug}`}
                    className="group p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-brand-100 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-navy-950 group-hover:text-brand-600 transition-colors">
                        {job.title}
                      </h3>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-medium">
                        <Briefcase className="w-3 h-3" />
                        {seniorityLabel[job.seniority] || job.seniority}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        {contractLabel[job.contract_type] || job.contract_type}
                      </span>
                      {job.job_categories?.name && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-500/10 text-accent-700 text-xs font-medium">
                          <Code2 className="w-3 h-3" />
                          {job.job_categories.name}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium">
                        Compensation: Based on experience
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-cta-gradient text-white section-padding">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Don&apos;t See Your Role?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              We&apos;re always looking for exceptional talent. Send us your profile and we&apos;ll reach out when a matching opportunity arises.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-8 py-3.5 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get In Touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
