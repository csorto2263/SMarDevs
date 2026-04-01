import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  TrendingUp,
  Award,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { caseStudies } from "@/data/case-studies";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies | SMarDevs",
  description:
    "Explore real results from companies that scaled their engineering teams with SMarDevs. See how our LATAM talent delivers measurable business outcomes.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-hero-gradient text-white section-padding">
          <div className="container-custom text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Award className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-medium text-white/90">
                Proven Track Record
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Real Results from{" "}
              <span className="gradient-text">Real Partnerships</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              Discover how leading companies have accelerated product delivery,
              reduced engineering costs, and scaled their teams with SMarDevs
              nearshore talent.
            </p>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((study) => {
                const metricEntries = Object.entries(study.metrics).slice(0, 3);
                return (
                  <Link
                    key={study.slug}
                    href={`/case-studies/${study.slug}`}
                    className="bg-white rounded-2xl shadow-glass hover:shadow-glass-lg transition-all duration-300 overflow-hidden group hover:-translate-y-1 block"
                  >
                    <div className="p-8">
                      <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 rounded-full px-3 py-1 text-xs font-semibold mb-4">
                        <Building2 className="w-3 h-3" />
                        {study.industry}
                      </div>
                      <h3 className="text-xl font-bold text-navy-950 mb-3 group-hover:text-brand-600 transition-colors">
                        {study.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        Client: {study.client}
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        Duration: {study.duration}
                      </p>

                      {/* Key Metrics Preview */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {metricEntries.map(([label, value]) => (
                          <div
                            key={label}
                            className="text-center bg-gray-50 rounded-xl p-3"
                          >
                            <div className="text-lg font-bold text-brand-600">
                              {value}
                            </div>
                            <div className="text-[10px] text-gray-500 leading-tight mt-1">
                              {label}
                            </div>
                          </div>
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-2 text-brand-600 font-semibold text-sm group-hover:gap-3 transition-all">
                        Read Full Study
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Summary Stats */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy-950 mb-4">
                The Numbers Speak for Themselves
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Across every engagement, our clients see measurable improvements
                in cost efficiency, delivery speed, and engineering quality.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { stat: "57%", label: "Average Cost Savings", icon: TrendingUp },
                { stat: "48hrs", label: "Average Talent Delivery", icon: BarChart3 },
                { stat: "99.9%", label: "Client Retention Rate", icon: Award },
                { stat: "10+", label: "Years of Industry Experience", icon: Building2 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-center bg-white rounded-2xl shadow-glass p-6"
                >
                  <item.icon className="w-8 h-8 text-brand-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-navy-950 mb-1">
                    {item.stat}
                  </div>
                  <div className="text-sm text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-cta-gradient text-white section-padding">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Write Your Own Success Story?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Join the companies that have transformed their engineering
              capacity with SMarDevs. Schedule a consultation to discuss your
              specific needs.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
            >
              Schedule a Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
