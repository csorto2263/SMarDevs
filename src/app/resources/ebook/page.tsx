"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  BookOpen,
  Users,
  MessageSquare,
  Heart,
  BarChart3,
  Rocket,
  Wrench,
  ChevronDown,
  ChevronUp,
  Quote,
  Calendar,
  Shield,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const learningPoints = [
  {
    icon: Users,
    title: "Team Structure",
    description:
      "Proven organizational models for embedding nearshore engineers into your existing workflows",
  },
  {
    icon: MessageSquare,
    title: "Communication Frameworks",
    description:
      "Protocols and cadences that eliminate miscommunication across distributed teams",
  },
  {
    icon: Heart,
    title: "Cultural Integration",
    description:
      "Strategies for building trust, shared values, and genuine team cohesion across borders",
  },
  {
    icon: BarChart3,
    title: "Performance Management",
    description:
      "KPIs, feedback loops, and evaluation frameworks tailored for nearshore partnerships",
  },
  {
    icon: Rocket,
    title: "Scaling Strategies",
    description:
      "How to grow from a pilot engagement to a fully scaled nearshore engineering center",
  },
  {
    icon: Wrench,
    title: "Tool Recommendations",
    description:
      "The collaboration stack that high-performing distributed teams rely on daily",
  },
];

const testimonials = [
  {
    quote:
      "This ebook gave us a clear playbook for scaling our nearshore team from 3 to 15 engineers. The communication frameworks alone saved us months of trial and error.",
    author: "Rachel Torres",
    title: "Director of Engineering, Pinnacle SaaS",
  },
  {
    quote:
      "We shared this with our entire leadership team before making the decision to go nearshore. The cultural integration chapter addressed every concern our executives had.",
    author: "David Kim",
    title: "CTO, Velocity Retail",
  },
];

const faqs = [
  {
    question: "Who is this ebook written for?",
    answer:
      "The ebook is designed for CTOs, VPs of Engineering, engineering managers, and technical leaders who are evaluating or actively building nearshore engineering teams. It is equally useful whether you are exploring nearshore for the first time or looking to optimize an existing distributed setup.",
  },
  {
    question: "How long is the ebook?",
    answer:
      "The ebook is approximately 45 pages and is structured for practical reference. Each chapter stands on its own, so you can read it cover-to-cover or jump directly to the topics most relevant to your current challenges.",
  },
  {
    question: "Is the content specific to LATAM nearshoring?",
    answer:
      "While the strategies are broadly applicable to distributed teams, the ebook includes LATAM-specific insights around time zone alignment, cultural nuances, compensation benchmarking, and legal considerations that are unique to the region.",
  },
  {
    question: "Will I receive updates if the ebook is revised?",
    answer:
      "Yes. We periodically update the ebook with new case studies, tool recommendations, and market data. All registered readers receive notifications when updated editions are published.",
  },
];

export default function EbookPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Ebook form submitted:", formData);
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
                  <BookOpen className="w-4 h-4 text-accent-400" />
                  <span className="text-sm font-medium text-white/90">
                    Free Ebook
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  How to Build a High-Performing{" "}
                  <span className="gradient-text">Nearshore Team</span>
                </h1>
                <p className="text-lg text-white/70 mb-8 max-w-xl">
                  The comprehensive playbook for engineering leaders who want to
                  scale their teams with LATAM talent — without sacrificing
                  quality, velocity, or team culture.
                </p>
                <div className="flex flex-wrap gap-6 text-sm text-white/60">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-accent-400" />
                    Trusted by 200+ leaders
                  </span>
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-accent-400" />
                    45 pages of actionable insights
                  </span>
                </div>
              </div>

              {/* Lead Gen Form */}
              <div className="bg-white rounded-2xl shadow-glass-xl p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-navy-950 mb-2">
                      Your Ebook Is Ready
                    </h3>
                    <p className="text-gray-600">
                      Check your inbox for the download link. We have also sent
                      you a few bonus resources to help you get started.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-navy-950 mb-2">
                      Get Your Free Copy
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Enter your details below and we will send the ebook
                      straight to your inbox.
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
                          htmlFor="teamSize"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Current Team Size
                        </label>
                        <input
                          type="text"
                          id="teamSize"
                          required
                          value={formData.teamSize}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              teamSize: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-navy-950 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                          placeholder="e.g., 10-25 engineers"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-cta-gradient text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        Download Free Ebook
                        <Download className="w-5 h-5" />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy-950 mb-4">
                What You&apos;ll Learn
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Six chapters of field-tested strategies distilled from over a
                decade of successful nearshore engagements.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {learningPoints.map((point) => (
                <div
                  key={point.title}
                  className="bg-white rounded-2xl shadow-glass p-6 hover:shadow-glass-lg transition-shadow"
                >
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                    <point.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-bold text-navy-950 mb-2">
                    {point.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {point.description}
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
                { stat: "200+", label: "Leaders Downloaded", icon: Users },
                {
                  stat: "45 Pages",
                  label: "Actionable Content",
                  icon: BookOpen,
                },
                {
                  stat: "6 Chapters",
                  label: "Practical Frameworks",
                  icon: BarChart3,
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

        {/* Testimonials */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy-950 mb-4">
                What Leaders Are Saying
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.author}
                  className="bg-white rounded-2xl shadow-glass p-8"
                >
                  <Quote className="w-8 h-8 text-brand-600 opacity-40 mb-4" />
                  <p className="text-gray-700 leading-relaxed mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold text-navy-950">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 section-padding">
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

        {/* Recommended Follow-Up */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-glass-lg p-8 md:p-12 text-center">
              <Calendar className="w-12 h-12 text-brand-600 mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-navy-950 mb-4">
                Take the Next Step
              </h2>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                After downloading the ebook, schedule a free consultation with
                our team to discuss your nearshore strategy. We will help you
                apply the frameworks to your specific engineering goals.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-cta-gradient text-white font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
              >
                Schedule a Free Consultation
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-cta-gradient text-white section-padding">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Building Your Nearshore Dream Team
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Whether you are hiring your first nearshore engineer or scaling to
              a full distributed team, SMarDevs has the talent and expertise to
              make it happen.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
