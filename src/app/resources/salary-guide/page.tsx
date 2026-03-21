"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  BarChart3,
  Globe2,
  TrendingUp,
  Users,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Shield,
  BookOpen,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const valueProps = [
  {
    icon: BarChart3,
    text: "Salary benchmarks for 20+ technical roles across LATAM and the US",
  },
  {
    icon: TrendingUp,
    text: "Seniority-level comparisons from junior to staff engineer and beyond",
  },
  {
    icon: Globe2,
    text: "Country-by-country compensation data for Brazil, Colombia, Argentina, Mexico, and more",
  },
  {
    icon: Users,
    text: "Hiring trend analysis and demand forecasts for 2024 and beyond",
  },
  {
    icon: DollarSign,
    text: "Cost optimization tips to maximize your engineering budget without sacrificing quality",
  },
];

const faqs = [
  {
    question: "What roles are covered in the salary guide?",
    answer:
      "The guide covers over 20 technical roles including software engineers, DevOps specialists, data engineers, QA engineers, product managers, UX designers, and engineering managers. Each role includes data for junior, mid-level, senior, and lead positions.",
  },
  {
    question: "How is the salary data collected?",
    answer:
      "Our data is compiled from over a decade of recruiting experience across LATAM, supplemented by market surveys, partner agency data, and publicly available compensation benchmarks. All figures are verified against our internal placement records.",
  },
  {
    question: "How often is the guide updated?",
    answer:
      "We update the salary guide quarterly to reflect market shifts, currency fluctuations, and evolving demand patterns. Subscribers receive automatic notifications when new editions are available.",
  },
  {
    question: "Can I share the guide with my team?",
    answer:
      "Absolutely. The guide is designed to be shared with hiring managers, finance teams, and leadership stakeholders who are involved in engineering hiring decisions. We encourage you to distribute it internally.",
  },
];

export default function SalaryGuidePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Salary guide form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-hero-gradient text-white section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                  <Download className="w-4 h-4 text-accent-400" />
                  <span className="text-sm font-medium text-white/90">
                    Free Download
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  2024 LATAM Tech{" "}
                  <span className="gradient-text">Salary Guide</span>
                </h1>
                <p className="text-lg text-white/70 mb-8 max-w-xl">
                  The definitive resource for understanding US vs. LATAM
                  compensation data. Make informed hiring decisions backed by
                  real market intelligence from years of LATAM recruiting.
                </p>
                <div className="flex flex-wrap gap-6 text-sm text-white/60">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-accent-400" />
                    Built from 10+ years of recruiting data
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent-400" />
                    Real market rates across LATAM
                  </span>
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent-400" />
                    Updated quarterly
                  </span>
                </div>
              </div>

              {/* Lead Gen Form */}
              <div className="bg-white rounded-2xl shadow-glass-xl p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-navy-950 mb-2">
                      Check Your Inbox
                    </h3>
                    <p className="text-gray-600">
                      Your salary guide is on its way. Look for an email from
                      SMarDevs with your download link.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-navy-950 mb-2">
                      Download the Free Guide
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Fill in your details to receive the full salary guide
                      instantly.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                          placeholder="Jane Smith"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Work Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                          placeholder="jane@company.com"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="company"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Company
                        </label>
                        <input
                          type="text"
                          id="company"
                          required
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                          placeholder="Acme Corp"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="role"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Your Role / Title
                        </label>
                        <input
                          type="text"
                          id="role"
                          required
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                          placeholder="VP of Engineering"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-cta-gradient text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        Download Salary Guide
                        <Download className="w-5 h-5" />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* What's Inside */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy-950 mb-4">
                What&apos;s Inside the Guide
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to benchmark compensation, plan your hiring
                budget, and understand the LATAM talent market.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {valueProps.map((prop) => (
                <div
                  key={prop.text}
                  className="flex items-start gap-4 bg-white rounded-2xl shadow-glass p-6"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                    <prop.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {prop.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="bg-gray-50 py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                {
                  stat: "10+",
                  label: "Years of Market Data",
                  icon: Shield,
                },
                {
                  stat: "12",
                  label: "Roles Benchmarked",
                  icon: Users,
                },
                {
                  stat: "Quarterly",
                  label: "Update Frequency",
                  icon: TrendingUp,
                },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <item.icon className="w-8 h-8 text-brand-600 mb-3" />
                  <div className="text-3xl font-bold text-navy-950 mb-1">
                    {item.stat}
                  </div>
                  <div className="text-sm text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-navy-950 mb-4">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-glass overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="font-semibold text-navy-950 pr-4">
                        {faq.question}
                      </span>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-cta-gradient text-white section-padding">
          <div className="container-custom text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Optimize Your Hiring Budget?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Download the salary guide and discover how much you could save by
              hiring world-class LATAM talent through SMarDevs.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
            >
              Talk to a Hiring Expert
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
