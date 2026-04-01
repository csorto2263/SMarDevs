import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Users,
  Clock,
  DollarSign,
  Shield,
  RefreshCw,
  Headphones,
  Target,
  Layers,
  BarChart3,
  GitBranch,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dedicated Teams",
  description:
    "Build a fully managed, autonomous engineering squad tailored to your product. SMarDevs assembles dedicated LATAM teams with developers, QA, DevOps, and designers — ready to deliver from sprint one.",
};

const benefits = [
  {
    icon: Target,
    title: "Built Around Your Product",
    description:
      "Every dedicated team is assembled from scratch based on your specific technical requirements, product stage, and organizational culture — not templated from a pre-packaged offering.",
  },
  {
    icon: DollarSign,
    title: "Predictable Monthly Investment",
    description:
      "Fixed monthly retainer pricing based on your team composition. No surprise invoices, no hourly billing ambiguity — just a clear, consistent cost structure that scales with your roadmap.",
  },
  {
    icon: Clock,
    title: "Full Time-Zone Alignment",
    description:
      "Your dedicated squad operates within US business hours across Latin America. Daily standups, real-time Slack communication, and sprint ceremonies all happen in your time zone.",
  },
  {
    icon: Shield,
    title: "Senior-Led Squads",
    description:
      "Every dedicated team includes an experienced tech lead who owns architecture decisions, maintains code quality standards, and interfaces directly with your product and engineering leadership.",
  },
  {
    icon: RefreshCw,
    title: "Seamless Talent Continuity",
    description:
      "We manage attrition proactively. If a team member transitions out, we source and onboard a vetted replacement with minimal disruption to your delivery cadence and institutional knowledge.",
  },
  {
    icon: Headphones,
    title: "End-to-End Account Support",
    description:
      "A dedicated account manager oversees your engagement, facilitates performance reviews, resolves blockers, and ensures the team continues to evolve in alignment with your business goals.",
  },
];

const teamCompositions = [
  {
    title: "Full-Stack Product Team",
    roles: ["Tech Lead", "Frontend Developer", "Backend Developer", "QA Engineer"],
    ideal: "Startups and scale-ups building or evolving a core product.",
  },
  {
    title: "Platform & Infrastructure Team",
    roles: ["DevOps Lead", "Backend Engineer", "Cloud Specialist", "SRE"],
    ideal: "Companies modernizing infrastructure or migrating to cloud-native architectures.",
  },
  {
    title: "Mobile Development Squad",
    roles: ["Tech Lead", "iOS Developer", "Android Developer", "QA Automation"],
    ideal: "Organizations building or expanding native or cross-platform mobile products.",
  },
  {
    title: "Data & Analytics Team",
    roles: ["Data Engineer", "Backend Developer", "BI Analyst", "QA Engineer"],
    ideal: "Teams building data pipelines, analytics platforms, or ML-adjacent products.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Strategic Discovery",
    description:
      "We begin with a deep dive into your product roadmap, technical architecture, team culture, and delivery expectations. This session defines the composition, seniority mix, and operating model for your dedicated squad.",
  },
  {
    step: "02",
    title: "Team Design",
    description:
      "Based on discovery outputs, we design the optimal team structure — role by role — and present a staffing proposal with projected cost, timeline, and onboarding plan for your review.",
  },
  {
    step: "03",
    title: "Talent Sourcing & Vetting",
    description:
      "Our recruiting team activates targeted searches for each role, running every candidate through our full technical and cultural evaluation pipeline before presenting shortlists.",
  },
  {
    step: "04",
    title: "Client Interviews",
    description:
      "You meet your proposed team members individually and collectively. We facilitate structured interviews and gather feedback to refine the lineup until you are fully confident in every hire.",
  },
  {
    step: "05",
    title: "Onboarding & Kickoff",
    description:
      "We handle contracts, payroll, equipment, and system access setup. Your team is formally introduced, aligned on workflows and tooling, and ready to begin delivering in their first sprint.",
  },
  {
    step: "06",
    title: "Ongoing Performance Management",
    description:
      "Regular check-ins between your leadership and your SMarDevs account manager ensure the team continues to perform, adapt, and grow alongside your product and organizational needs.",
  },
];

const faqs = [
  {
    question: "How is a dedicated team different from staff augmentation?",
    answer:
      "Staff augmentation embeds individual professionals into your existing team under your management. A dedicated team is a fully formed, autonomous squad assembled and managed by SMarDevs, operating as an independent unit with its own tech lead, defined workflows, and delivery milestones. Dedicated teams are ideal for discrete product initiatives or long-term parallel development tracks.",
  },
  {
    question: "What is the minimum team size?",
    answer:
      "Dedicated teams typically start at three professionals — a tech lead and two engineers — to ensure functional autonomy. Most high-performing squads range from four to eight members depending on scope and delivery velocity requirements.",
  },
  {
    question: "What is the minimum commitment period?",
    answer:
      "We recommend a minimum of three months for dedicated team engagements. This allows sufficient time for team formation, context-building, and meaningful delivery cycles. Shorter-term engagements may be accommodated on a case-by-case basis.",
  },
  {
    question: "Can we scale the team up or down over time?",
    answer:
      "Yes. Dedicated teams are designed to be composable. As your product evolves, you can add specialists, rotate roles, or reduce capacity with appropriate notice periods. Your account manager facilitates all transitions.",
  },
  {
    question: "Who manages the team on a day-to-day basis?",
    answer:
      "Your dedicated tech lead manages the team operationally and interfaces with your product and engineering leadership. SMarDevs provides strategic oversight and account management, ensuring alignment between your business goals and team performance.",
  },
];

export default function DedicatedTeamsPage() {
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
                <span className="text-brand-400 text-sm font-medium">Dedicated Teams</span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                A Complete Engineering Squad,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">
                  Built for Your Product
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
                We assemble fully managed, autonomous teams — developers, QA, DevOps, designers — tailored to your initiative, operating in your time zone, and delivering from sprint one.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-950 font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 text-base"
                >
                  Design My Team
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

        {/* What It Is */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">What Is a Dedicated Team?</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  An Autonomous Squad That{" "}
                  <span className="gradient-text">Owns Its Delivery</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  A dedicated team is a fully formed engineering squad that operates as an independent, product-focused unit within your organization. Unlike staff augmentation — where individuals integrate into your existing team — a dedicated squad functions with its own tech lead, defined processes, and clear ownership over a product area or initiative.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  SMarDevs handles all recruitment, onboarding, payroll, and administrative overhead so your internal leadership can focus entirely on product direction and strategic alignment.
                </p>
                <div className="space-y-3">
                  {[
                    "Custom team composition tailored to your product requirements",
                    "Senior tech lead included in every engagement",
                    "Autonomous delivery with defined milestones and sprint cadences",
                    "Full administrative management by SMarDevs",
                    "Scalable team structure with flexible monthly terms",
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
                  { icon: Layers, label: "Avg. Team Size", value: "4–8 Engineers" },
                  { icon: GitBranch, label: "Time to First Sprint", value: "2–3 Weeks" },
                  { icon: BarChart3, label: "Retention Rate", value: "97%" },
                  { icon: DollarSign, label: "vs. US Equivalent", value: "Save 55–65%" },
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

        {/* Team Compositions */}
        <section className="section-padding bg-gray-50/50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">Example Configurations</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Teams Designed for{" "}
                <span className="gradient-text">Every Product Context</span>
              </h2>
              <p className="text-gray-600 text-lg">
                These are representative configurations. Every team we build is customized to your exact requirements, tech stack, and organizational structure.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {teamCompositions.map((team) => (
                <div key={team.title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-glass hover:shadow-glass-lg transition-all">
                  <h3 className="text-xl font-semibold mb-4 text-navy-950">{team.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {team.roles.map((role) => (
                      <span key={role} className="px-3 py-1 bg-brand-50 text-brand-700 text-sm font-medium rounded-full">{role}</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Ideal for:</span> {team.ideal}</p>
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
                The Infrastructure Behind{" "}
                <span className="gradient-text">Every Great Team</span>
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
                From Brief to{" "}
                <span className="text-brand-400">First Sprint in Weeks</span>
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
                <span className="gradient-text">Dedicated Teams</span>
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
              Let Us Build Your Dedicated Squad
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
              Share your product vision and team requirements. We will design a custom squad and deliver a proposal within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-950 font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 text-base">
                Request a Team Design
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
