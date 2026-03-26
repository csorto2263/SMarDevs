import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  UserPlus,
  Building2,
  Rocket,
  Globe2,
  Clock,
  DollarSign,
  Shield,
  RefreshCw,
  Headphones,
  FileCheck,
  Code2,
  Monitor,
  Database,
  Layers,
  TestTube,
  TestTubes,
  GitBranch,
  Palette,
  Briefcase,
  BarChart3,
  TrendingUp,
  Settings,
  Workflow,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Services | SMarDevs",
  description:
    "Staff augmentation, dedicated teams, and direct placement services from SMarDevs. Access pre-vetted nearshore tech talent from Latin America aligned with your time zone and standards.",
};

const services = [
  {
    icon: UserPlus,
    title: "Staff Augmentation",
    description:
      "Embed pre-vetted engineers directly into your existing team. They work under your management, follow your processes, and integrate with your tools — as if they were local hires. Ideal for filling skill gaps, accelerating sprints, or handling seasonal workload spikes without the overhead of full-time recruitment.",
  },
  {
    icon: Users,
    title: "Dedicated Teams",
    description:
      "We assemble a fully managed squad — developers, QA, DevOps, designers — tailored to your project requirements. Your dedicated team operates as an autonomous extension of your organization with its own lead, defined workflows, and clear delivery milestones. Perfect for greenfield projects or long-term product development.",
  },
  {
    icon: Briefcase,
    title: "Direct Placement",
    description:
      "When you need permanent additions to your roster, our direct placement service delivers candidates who meet your technical bar and cultural expectations. We handle sourcing, screening, technical evaluation, and offer negotiation so your internal team can focus on building product rather than building pipelines.",
  },
];

const audiences = [
  {
    icon: Rocket,
    title: "Startups",
    description:
      "Move fast without burning runway. Access senior-level talent at startup-friendly rates and scale your engineering team in days instead of months.",
  },
  {
    icon: TrendingUp,
    title: "Scale-ups",
    description:
      "Maintain velocity as you grow. Augment your team with specialists who can handle increasing complexity across infrastructure, product, and QA.",
  },
  {
    icon: Building2,
    title: "Enterprise",
    description:
      "De-risk large initiatives with pre-vetted professionals who integrate seamlessly into enterprise workflows, compliance standards, and toolchains.",
  },
  {
    icon: Globe2,
    title: "Agencies",
    description:
      "Deliver more client projects without overextending your bench. Tap into our talent pool to staff engagements on demand and protect your margins.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Discovery Call",
    description:
      "We begin with a consultative conversation to understand your technical requirements, team dynamics, culture, and timeline. This ensures every candidate we present is aligned with your specific needs.",
  },
  {
    step: "02",
    title: "Talent Sourcing",
    description:
      "Our recruiting team activates our deep LATAM network, leveraging proprietary databases and community partnerships to identify candidates who match your criteria.",
  },
  {
    step: "03",
    title: "Technical Vetting",
    description:
      "Every candidate undergoes rigorous evaluation: live coding assessments, system design reviews, English proficiency testing, and behavioral interviews calibrated to your standards.",
  },
  {
    step: "04",
    title: "Profile Delivery",
    description:
      "Within 48 hours of your request, receive a curated shortlist with detailed candidate profiles — including assessment scores, portfolio highlights, and our recommendation notes.",
  },
  {
    step: "05",
    title: "Client Interviews",
    description:
      "You interview your top picks on your schedule. We handle coordination, provide structured evaluation rubrics, and gather feedback to refine the search if needed.",
  },
  {
    step: "06",
    title: "Onboarding & Support",
    description:
      "Once you select a candidate, we manage contracts, payroll, benefits, and compliance. Your dedicated account manager ensures a smooth ramp-up and provides ongoing support throughout the engagement.",
  },
];

const roles = [
  { icon: Code2, title: "Software Engineers" },
  { icon: Monitor, title: "Frontend Developers" },
  { icon: Database, title: "Backend Developers" },
  { icon: Layers, title: "Full Stack Developers" },
  { icon: TestTube, title: "QA Manual Engineers" },
  { icon: TestTubes, title: "QA Automation Engineers" },
  { icon: GitBranch, title: "DevOps Engineers" },
  { icon: Palette, title: "UI/UX Designers" },
  { icon: Briefcase, title: "Project Managers" },
  { icon: BarChart3, title: "Business Analysts" },
  { icon: Settings, title: "Tech Leads" },
  { icon: Workflow, title: "Data Engineers & Analysts" },
];

const benefits = [
  {
    icon: DollarSign,
    title: "Up to 40-50% Cost Savings",
    description:
      "Access senior-level LATAM professionals at a fraction of US market rates. Reduce your talent spend without sacrificing quality or output.",
  },
  {
    icon: Clock,
    title: "US-Aligned Time Zones",
    description:
      "Your team operates during your business hours. Real-time collaboration, daily standups, and zero communication lag across every engagement.",
  },
  {
    icon: Shield,
    title: "Rigorously Vetted Talent",
    description:
      "Every professional passes technical assessments, English proficiency evaluations, and cultural fit screening before being presented to you.",
  },
  {
    icon: FileCheck,
    title: "Flexible Contracts",
    description:
      "No long-term lock-ins. Scale up or down based on project demands with monthly terms that adapt to your business cycle.",
  },
  {
    icon: RefreshCw,
    title: "Replacement Guarantee",
    description:
      "If a placement does not meet expectations within the first 30 days, we provide a replacement at no additional cost. Your satisfaction is non-negotiable.",
  },
  {
    icon: Headphones,
    title: "Dedicated Account Management",
    description:
      "A single point of contact manages your engagement end-to-end — from onboarding through performance reviews and contract renewals.",
  },
];

const faqs = [
  {
    question: "What types of services does SMarDevs offer?",
    answer:
      "SMarDevs provides three core talent solutions: Staff Augmentation (embedding individual professionals into your existing team), Dedicated Teams (fully managed squads built around your project), and Direct Placement (permanent hires sourced and vetted by our team). Each model is designed to address different scaling needs and budget structures.",
  },
  {
    question: "How quickly can you deliver candidates?",
    answer:
      "For staff augmentation and dedicated team engagements, we deliver curated candidate profiles within 48 business hours of receiving your requirements. Direct placement timelines vary depending on seniority and specialization, but most searches are completed within two to three weeks.",
  },
  {
    question: "What does your pricing structure look like?",
    answer:
      "Our pricing is transparent and competitive. Staff augmentation is billed on a monthly rate per professional. Dedicated teams are priced as a fixed monthly retainer based on team composition. Direct placement involves a one-time fee upon successful hire. We provide detailed proposals after our initial discovery call so there are no surprises.",
  },
  {
    question: "What are your contract terms and minimum commitments?",
    answer:
      "Staff augmentation engagements have a minimum commitment of one month with flexible month-to-month renewals. Dedicated teams typically start with a three-month minimum to allow for proper team formation and ramp-up. Direct placements carry a standard guarantee period. All contracts can be tailored to your specific requirements.",
  },
  {
    question: "How do you vet candidates for technical skills?",
    answer:
      "Our vetting pipeline includes resume screening, a live technical interview conducted by senior engineers, a timed coding assessment or system design exercise, English proficiency evaluation, and a behavioral interview focused on communication and collaboration. Only candidates who score in the top 5% of our applicant pool are presented to clients.",
  },
  {
    question: "What happens if a candidate is not a good fit?",
    answer:
      "We stand behind every placement with a 30-day replacement guarantee. If a professional does not meet your performance expectations or cultural requirements within the first month, we will source and onboard a replacement at no additional cost. Our 97% retention rate reflects the rigor of our matching process.",
  },
  {
    question: "Do you handle payroll, compliance, and benefits for augmented staff?",
    answer:
      "Yes. For staff augmentation and dedicated team engagements, SMarDevs serves as the employer of record. We manage payroll processing, local tax compliance, health benefits, paid time off, and equipment provisioning. This eliminates legal complexity and administrative burden for your organization.",
  },
  {
    question: "Which countries do your professionals come from?",
    answer:
      "Our talent network spans across Latin America, with particularly strong concentrations in Honduras, Colombia, Mexico, Argentina, Brazil, and Costa Rica. All professionals operate within US-aligned time zones (UTC-3 to UTC-6) and have demonstrated strong English communication skills as part of our screening process.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-hero-gradient min-h-[70vh] flex items-center">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl" />
          <div className="container-custom relative z-10 py-20 md:py-32">
            <div className="max-w-4xl">
              <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-6">
                Our Services
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
                Talent Solutions{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">
                  Engineered for Scale
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
                From staff augmentation to dedicated teams and direct placement,
                SMarDevs delivers the nearshore talent infrastructure your
                organization needs to grow without compromise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-950 font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 hover:shadow-glow-lg text-base"
                >
                  Get a Custom Proposal
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/hire"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all text-base"
                >
                  Browse Roles
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                What We Do
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Three Models,{" "}
                <span className="gradient-text">One Standard of Excellence</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Choose the engagement model that fits your timeline, budget, and
                organizational structure. Each is backed by the same rigorous
                vetting and white-glove support.
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="group bg-white rounded-2xl p-8 md:p-10 shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mb-6 group-hover:bg-brand-100 transition-colors">
                    <service.icon className="w-7 h-7 text-brand-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="section-padding bg-gray-50/50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                Who We Serve
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Built for Teams at{" "}
                <span className="gradient-text">Every Stage of Growth</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Whether you are a three-person startup or a Fortune 500
                enterprise, our talent solutions adapt to your scale and
                complexity.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {audiences.map((audience) => (
                <div
                  key={audience.title}
                  className="group bg-white rounded-2xl p-8 shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mb-5 mx-auto group-hover:bg-brand-100 transition-colors">
                    <audience.icon className="w-7 h-7 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {audience.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {audience.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding bg-navy-950 text-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-4">
                Our Process
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                A Proven Path from{" "}
                <span className="text-brand-400">Request to Results</span>
              </h2>
              <p className="text-white/60 text-lg">
                Every engagement follows a structured six-step process designed
                to minimize risk and maximize the probability of a successful,
                long-term match.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {processSteps.map((step) => (
                <div key={step.step} className="relative">
                  <div className="relative z-10">
                    <span className="text-5xl font-bold text-white/10 block mb-4">
                      {step.step}
                    </span>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-white/60 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles / Profiles */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                Talent Profiles
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Specialists Across{" "}
                <span className="gradient-text">Every Technical Discipline</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Our network spans the full spectrum of technology roles. Every
                professional is pre-vetted, English-proficient, and ready to
                contribute from day one.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {roles.map((role) => (
                <div
                  key={role.title}
                  className="group flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-glass hover:shadow-glass-lg hover:border-brand-200 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 transition-colors">
                    <role.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-semibold group-hover:text-brand-600 transition-colors">
                    {role.title}
                  </h3>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/hire"
                className="inline-flex items-center gap-2 px-8 py-4 bg-cta-gradient text-white font-semibold rounded-full hover:opacity-90 transition-all hover:scale-105 hover:shadow-glow"
              >
                Explore All Roles
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="section-padding bg-gray-50/50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                The SMarDevs Advantage
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Commercial Benefits That{" "}
                <span className="gradient-text">Move the Needle</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Beyond great talent, we deliver measurable business outcomes that
                improve your bottom line and operational efficiency.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="group bg-white rounded-2xl p-8 shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5 group-hover:bg-brand-100 transition-colors">
                    <benefit.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                Frequently Asked Questions
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Everything You Need{" "}
                <span className="gradient-text">to Know</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Answers to the most common questions about working with SMarDevs.
                Have a question not listed here? Reach out and we will respond
                within one business day.
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-glass overflow-hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-8 py-6 text-lg font-semibold text-navy-950 hover:text-brand-600 transition-colors list-none [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-8 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
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
              Let Us Build Your Ideal Team
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
              Tell us what you need and receive a tailored proposal within 24
              hours. No obligation, no pressure — just a clear path to the
              talent your organization deserves.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-950 font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 text-base"
              >
                Request a Consultation
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/savings-calculator"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all text-base"
              >
                Calculate Your Savings
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
