import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Clock,
  Target,
  Lightbulb,
  Trophy,
  Quote,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { caseStudies } from "@/data/case-studies";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) {
    return { title: "Case Study Not Found | SMarDevs" };
  }
  return {
    title: `${study.title} | SMarDevs Case Study`,
    description: study.outcome,
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

  const metricEntries = Object.entries(study.metrics);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-hero-gradient text-white section-padding">
          <div className="container-custom">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Case Studies
            </Link>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Building2 className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-medium text-white/90">
                {study.industry}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-4xl">
              {study.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {study.client}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {study.duration}
              </span>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="-mt-12 relative z-10">
          <div className="container-custom">
            <div className={`grid grid-cols-2 md:grid-cols-${metricEntries.length} gap-4`}>
              {metricEntries.map(([label, value]) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl shadow-glass-lg p-6 text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-brand-600 mb-2">
                    {value}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Challenge */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-navy-950 mb-4">
                    The Challenge
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {study.challenge}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="bg-gray-50 section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-navy-950 mb-4">
                    Our Solution
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {study.solution}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Outcome */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-navy-950 mb-4">
                    The Outcome
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {study.outcome}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-navy-950 text-white section-padding">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <Quote className="w-12 h-12 text-brand-600 mx-auto mb-6 opacity-60" />
              <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8 text-white/90">
                &ldquo;{study.testimonial.quote}&rdquo;
              </blockquote>
              <div>
                <p className="font-semibold text-white">
                  {study.testimonial.author}
                </p>
                <p className="text-white/60 text-sm">
                  {study.testimonial.title}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-cta-gradient text-white section-padding">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Achieve Similar Results
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Every company has unique engineering challenges. Let us show you
              how SMarDevs can deliver the talent and outcomes your team needs to
              succeed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
              >
                View More Case Studies
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
