import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  UserPlus,
  Clock,
  DollarSign,
  Shield,
  RefreshCw,
  Headphones,
  Zap,
  Users,
  BarChart3,
  Code2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Staff Augmentation | SMarDevs",
  description:
    "Embed pre-vetted LATAM engineers directly into your existing team. Fill skill gaps, accelerate sprints, and scale your engineering capacity without the overhead of full-time hiring.",
};

const benefits = [
  {
    icon: Zap,
    title: "Rapid Onboarding",
    description:
      "Our professionals are ready to contribute from day one. With comprehensive onboarding support and proactive communication from your account manager, the ramp-up period is measured in days, not months.",
  },
  {
    icon: DollarSign,
    title: "Up to 40-50% Cost Savings",
    description:
      "Access senior-level talent at LATAM rates that represent a fraction of equivalent US market costs — without compromising output quality, communication standards, or professional reliability.",
  },
  {
    icon: Clock,
    title: "Full Time-Zone Overlap",
    description:
      "Every professional operates within US business hours (UTC-3 to UTC-6), enabling real-time collaboration, daily standups, and synchronous problem-solving with zero communication delay.",
  },
  {
    icon: Shield,
    title: "Rigorous Technical Vetting",
    description:
      "Only the top 5% of applicants pass our pipeline: live coding assessments, system design reviews, English proficiency testing, and behavioral interviews calibrated to your hiring standards.",
  },
  {
    icon: RefreshCw,
    title: "30-Day Replacement Guarantee",
    description:
      "If a professional does not meet your expectations within the first 30 days, we replace them at no additional cost. Our 97% retention rate reflects how rarely this guarantee is needed.",
  },
  {
    icon: Headphones,
    title: "Dedicated Account Management",
    description:
      "A single point of contact manages your engagement end-to-end — from requirements gathering through onboarding, performance reviews, and contract renewals.",
  },
];

const useCases = [
  {
    title: "Sprint Acceleration",
    description:
      "When your roadmap outpaces your current team's capacity, augmented engineers integrate directly into your sprints, picking up tickets and delivering production-ready code without missing a beat.",
  },
  {
    title: "Skill Gap Coverage",
    description:
      "Need a senior React developer or a cloud infrastructure specialist for a specific initiative? We place the exact profile you need for exactly as long as you need them.",
  },
  {
    title: "Seasonal Scaling",
    description:
      "Avoid the cost and complexity of permanent hires for workload peaks. Staff up for major releases or high-demand periods and scale down gracefully when the cycle ends.",
  },
  {
    title: "Long-Term Embedded Teams",
    description:
      "Many of our augmented professionals become integral long-term contributors. With flexible month-to-month terms, you can formalize those relationships on your schedule.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Requirements Intake",
    description:
      "We conduct a structured discovery session to understand your technical stack, team dynamics, role expectations, and timeline. This ensures every candidate we present is precisely calibrated to your needs.",
  },
  {
    step: "02",
    title: "Talent Activation",
    description:
      "Within 24 hours of your intake call, our recruiting team activates our LATAM network to source candidates from our pre-vetted pool and active pipelines.",
  },
  {
    step: "03",
    title: "Shortlist Delivery",
    description:
      "You receive a curated shortlist of two to four candidates within 48 business hours, each with detailed profiles, assessment scores, and our placement recommendation.",
  },
  {
    step: "04",
    title: "Client Interviews",
    description:
      "Interview your top candidates on your schedule. We coordinate logistics, provide evaluation frameworks, and gather feedback to iterate if needed.",
  },
  {
    step: "05",
    title: "Contracting & Onboarding",
    description:
      "We handle all contracts, payroll, compliance, and equipment. Your new team member is ready to join your standups, access your repositories, and start contributing immediately.",
  },
];

const faqs = [
  {
    question: "How quickly can you place an engineer?",
    answer:
      "We deliver a curated shortlist within 48 business hours of your intake call. Most engagements begin within one to two weeks of the initial request, depending on candidate availability and your interview schedule.",
  },
  {
    question: "Do augmented professionals work exclusively with my team?",
    answer:
      "Yes. Staff augmentation professionals are dedicated exclusively to your team and project. They do not split their time across multiple clients and are expected to operate as full members of your organization.",
  },
  {
    question: "Who manages the day-to-day work?",
    answer:
      "You do. Staff augmentation professionals work under your direct management. They follow your processes, use your tools, attend your meetings, and report to your team leads — exactly like a local hire.",
  },
  {
    question: "What is the minimum engagement length?",
    answer:
      "Our standard minimum is one month, with flexible month-to-month renewals thereafter. We recommend a minimum of three months for engagements requiring significant context-building or architecture work.",
  },
  {
    question: "Who handles payroll, taxes, and compliance?",
    answer:
      "SMarDevs serves as the employer of record. We manage payroll processing, local tax obligations, benefits administration, and compliance in each professional's home country — eliminating all administrative and legal complexity on your end.",
  },
];

export default function StaffAugmentationPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-hero-gradient min-h-[65vh] flex items-center">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl" />
          <div className="container-custom relative z-10 py-20 md:py-32">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <Link href="/services" className="text-white/50 text-sm hover:text-white/80 transition-colors">Services</Link>
                <span className="text-white/30">/</span>
                <span className="text-brand-400 text-sm font-medium">Staff Augmentation</span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Embed World-Class Engineers{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">
                  Directly Into Your Team
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
                Augment your existing team with pre-vetted LATAM professionals who operate under your management, follow your processes, and deliver production-ready results — from day one.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-950 font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 text-base"
                >
                  Request a Proposal
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/hire"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all text-base"
                >
                  Browse Available Roles
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What It Is */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">What Is Staff Augmentation?</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  Your Team, Extended —{" "}
                  <span className="gradient-text">Without the Overhead</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Staff augmentation is the practice of supplementing your in-house team with external professionals who integrate directly into your workflows, tools, and culture. Unlike traditional outsourcing, there are no handoffs, no black boxes, and no loss of control.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  With SMarDevs, your augmented engineers work as embedded team members — attending your standups, committing to your repositories, and reporting to your leads. The only difference is that they sit in Latin America and cost significantly less than equivalent US hires.
                </p>
                <div className="space-y-3">
                  {[
                    "Full integration into your existing workflows and tools",
                    "Direct management by your team leads",
                    "Dedicated to your project — not shared across clients",
                    "Scalable up or down with flexible monthly terms",
                    "Payroll, compliance, and benefits handled by SMarDevs",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Code2, label: "Avg. Onboarding Time", value: "3–5 Days" },
                  { icon: DollarSign, label: "Average Cost Savings", value: "Up to 40-50%" },
                  { icon: Users, label: "Retention Rate", value: "97%" },
                  { icon: BarChart3, label: "Profiles Delivered", value: "Within 48h" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-glass text-center">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-5 h-5 text-brand-600" />
                    </div>
                    <div className="text-2xl font-bold text-navy-950 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="section-padding bg-gray-50/50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">When To Use It</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Common Scenarios Where{" "}
                <span className="gradient-text">Augmentation Delivers</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((uc) => (
                <div key={uc.title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-glass hover:shadow-glass-lg transition-all">
                  <h3 className="text-xl font-semibold mb-3 text-navy-950">{uc.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{uc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">Why SMarDevs</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Everything You Need for a{" "}
                <span className="gradient-text">Successful Engagement</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="group bg-white rounded-2xl p-8 shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5 group-hover:bg-brand-100 transition-colors">
                    <benefit.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding bg-navy-950 text-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-4">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                From Request to{" "}
                <span className="text-brand-400">First Commit in Days</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {processSteps.map((step) => (
                <div key={step.step}>
                  <span className="text-5xl font-bold text-white/10 block mb-4">{step.step}</span>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">FAQ</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Common Questions About{" "}
                <span className="gradient-text">Staff Augmentation</span>
              </h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="group bg-white rounded-2xl border border-gray-100 shadow-glass overflow-hidden">
                  <summary className="flex items-center justify-between cursor-pointer px-8 py-6 text-lg font-semibold text-navy-950 hover:text-brand-600 transition-colors list-none [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-8 pb-6 text-gray-600 leading-relaxed">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-hero-gradient text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl" />
          <div className="container-custom relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
              Ready to Extend Your Team?
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
              Tell us what you need. We will deliver a curated shortlist of pre-vetted engineers within 48 hours — no obligation, no pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-950 font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 text-base">
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/services" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all text-base">
                View All Services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
