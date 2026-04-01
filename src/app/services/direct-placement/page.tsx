import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Briefcase,
  Clock,
  DollarSign,
  Shield,
  Star,
  FileCheck,
  Search,
  UserCheck,
  BarChart3,
  Globe2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Direct Placement",
  description:
    "Permanent tech hiring done right. SMarDevs sources, screens, and delivers top-tier LATAM engineering talent for your full-time roles — faster, cheaper, and with a hiring guarantee.",
};

const benefits = [
  {
    icon: Search,
    title: "Proactive Talent Sourcing",
    description:
      "We do not wait for applications. Our recruiting team actively headhunts passive candidates from our proprietary LATAM network, referral ecosystem, and community partnerships — reaching talent your job postings never will.",
  },
  {
    icon: Shield,
    title: "Multi-Stage Technical Vetting",
    description:
      "Every candidate completes a live coding assessment, technical interview with senior engineers, system design review, English proficiency evaluation, and behavioral interview before being presented to you.",
  },
  {
    icon: DollarSign,
    title: "Significant Compensation Advantage",
    description:
      "LATAM professionals expect salaries substantially below US market rates while delivering equivalent technical output. This structural advantage improves your hiring economics and extends your talent budget further.",
  },
  {
    icon: Clock,
    title: "Faster Time to Hire",
    description:
      "Our specialized focus on LATAM engineering talent and our deep pre-built candidate pipelines allow us to complete most direct placement searches in two to three weeks — compared to two to three months for traditional agency searches.",
  },
  {
    icon: Star,
    title: "Hiring Guarantee",
    description:
      "Every direct placement comes with a guarantee period. If a hire does not work out within the agreed timeframe, we re-initiate the search at no additional placement fee. We stand behind every match we make.",
  },
  {
    icon: FileCheck,
    title: "End-to-End Offer Management",
    description:
      "We manage offer preparation, compensation benchmarking, negotiation support, and candidate communication — ensuring a smooth close without putting strain on your internal HR resources.",
  },
];

const whatWeHandle = [
  "Role definition and job description optimization",
  "Targeted sourcing across LATAM engineering communities",
  "Resume screening and initial qualification calls",
  "Live technical assessments and coding evaluations",
  "System design and architecture interviews",
  "English communication proficiency testing",
  "Behavioral and cultural fit evaluation",
  "Reference checks and background verification",
  "Interview scheduling and candidate coordination",
  "Offer preparation, benchmarking, and negotiation",
];

const processSteps = [
  {
    step: "01",
    title: "Role Definition",
    description:
      "We work with your hiring manager to craft a precise role profile — technical requirements, seniority expectations, cultural attributes, compensation range, and growth trajectory — to maximize search accuracy from day one.",
  },
  {
    step: "02",
    title: "Active Sourcing",
    description:
      "Our team activates targeted searches across our LATAM network, reaching passive candidates who are not actively job hunting but are open to the right opportunity.",
  },
  {
    step: "03",
    title: "Full Technical Vetting",
    description:
      "Shortlisted candidates complete our comprehensive evaluation pipeline. Only those who meet your technical bar, communication standards, and cultural expectations advance to your team.",
  },
  {
    step: "04",
    title: "Curated Shortlist",
    description:
      "We present two to four thoroughly evaluated candidates with detailed assessment reports, salary expectations, availability timelines, and our placement recommendation.",
  },
  {
    step: "05",
    title: "Final Interviews",
    description:
      "You conduct final-round interviews with your shortlisted candidates. We coordinate logistics, provide structured evaluation rubrics, and facilitate debrief sessions to support your decision.",
  },
  {
    step: "06",
    title: "Offer & Close",
    description:
      "We prepare competitive offer packages, handle negotiation, and manage candidate communication through acceptance — ensuring a professional close that sets the tone for a strong employment relationship.",
  },
];

const faqs = [
  {
    question: "What types of roles do you fill through direct placement?",
    answer:
      "We specialize in technical roles across the full engineering spectrum: software engineers, frontend and backend developers, full-stack engineers, QA professionals, DevOps and cloud engineers, UI/UX designers, data engineers, tech leads, and engineering managers. We also place product managers and business analysts for technology organizations.",
  },
  {
    question: "How is direct placement priced?",
    answer:
      "Direct placement is priced as a one-time success fee charged upon the candidate's first day of employment. The fee is calculated as a percentage of the placed professional's annual compensation and is disclosed in full during our initial consultation. There are no retainers or upfront costs.",
  },
  {
    question: "How long does a typical direct placement search take?",
    answer:
      "Most searches are completed within two to three weeks from role definition to accepted offer. Senior, specialized, or niche roles may take an additional one to two weeks. We provide regular search updates throughout the process so you always know where we stand.",
  },
  {
    question: "What does your hiring guarantee cover?",
    answer:
      "If a placed professional voluntarily leaves or is terminated for performance-related reasons within the guarantee period (typically 60 to 90 days from start date), we conduct a full replacement search at no additional placement fee. Specific terms are defined in the engagement agreement.",
  },
  {
    question: "Can you handle high-volume or multiple simultaneous searches?",
    answer:
      "Yes. Our recruiting infrastructure is built for scale. We regularly manage multiple concurrent searches across different roles and seniority levels. Clients with volume hiring needs benefit from dedicated recruiter assignment and streamlined intake processes.",
  },
  {
    question: "Do you support remote, hybrid, or on-site roles?",
    answer:
      "Our direct placement services are optimized for remote and hybrid roles where LATAM talent can deliver maximum value. We can accommodate on-site requirements in select LATAM markets. Reach out to discuss the specifics of your location requirements.",
  },
];

export default function DirectPlacementPage() {
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
                <span className="text-brand-400 text-sm font-medium">Direct Placement</span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Permanent Tech Hires,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">
                  Sourced and Delivered
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
                When you need a permanent addition to your engineering roster, SMarDevs delivers. We handle every step — from proactive sourcing and rigorous vetting to offer management and guarantee — so your team can focus on building product, not hiring pipelines.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-950 font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 text-base"
                >
                  Start a Search
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all text-base"
                >
                  Compare All Services
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What We Handle */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">What We Handle For You</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  A Complete Hiring Process,{" "}
                  <span className="gradient-text">Start to Finish</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Direct placement with SMarDevs means handing off every time-consuming step of the hiring process — from initial sourcing through accepted offer — while retaining full control over your final hiring decision. You interview. You decide. We handle everything else.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {whatWeHandle.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Clock, label: "Avg. Time to Hire", value: "2–3 Weeks" },
                  { icon: Globe2, label: "LATAM Coverage", value: "8+ Countries" },
                  { icon: UserCheck, label: "Pass-Through Rate", value: "Top 5%" },
                  { icon: BarChart3, label: "Offer Acceptance Rate", value: "92%" },
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

        {/* Benefits */}
        <section className="section-padding bg-gray-50/50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">Why SMarDevs</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                The Recruiting Partner That{" "}
                <span className="gradient-text">Delivers Results</span>
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
              <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-4">Our Process</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                From Role Brief to{" "}
                <span className="text-brand-400">Accepted Offer</span>
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
                <span className="gradient-text">Direct Placement</span>
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
              Ready to Make Your Next Great Hire?
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
              Share your role requirements and we will activate a targeted search. Most searches deliver a qualified shortlist within two weeks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-950 font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 text-base">
                Start Your Search
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
