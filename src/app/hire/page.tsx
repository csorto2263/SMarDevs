import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Globe2,
  Clock,
  DollarSign,
  Shield,
  Users,
  Zap,
  Code2,
  Layers,
  Database,
  Monitor,
  TestTube,
  GitBranch,
  Palette,
  Briefcase,
  BarChart3,
  Smartphone,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hire Remote Talent | SMarDevs",
  description:
    "Hire elite remote tech talent from Latin America. Pre-vetted software engineers, developers, designers, and more — aligned with your time zone and ready to deliver.",
};

const benefits = [
  {
    icon: Clock,
    title: "48-Hour Candidate Delivery",
    description:
      "Receive curated, pre-vetted profiles within two business days. Our extensive talent network eliminates the months-long sourcing bottleneck.",
  },
  {
    icon: DollarSign,
    title: "Up to 60% Cost Savings",
    description:
      "Hire senior-level professionals at a fraction of US market rates. Redirect those savings into product development, not overhead.",
  },
  {
    icon: Globe2,
    title: "Full Time-Zone Overlap",
    description:
      "Your LATAM team works your business hours. Real-time collaboration on Slack, daily standups, and zero asynchronous delays.",
  },
  {
    icon: Shield,
    title: "Multi-Stage Vetting",
    description:
      "Every candidate completes technical assessments, live coding exercises, English fluency evaluations, and cultural alignment interviews.",
  },
  {
    icon: Users,
    title: "End-to-End Support",
    description:
      "We manage payroll, benefits, compliance, and ongoing performance reviews so you can focus entirely on building your product.",
  },
  {
    icon: Zap,
    title: "Elastic Team Scaling",
    description:
      "Scale from one specialist to an entire squad on demand. No rigid contracts, no long-term commitments — pure flexibility.",
  },
];

const roleCards = [
  {
    icon: Code2,
    title: "Software Engineers",
    slug: "software-engineers",
    description:
      "Full-cycle engineers proficient in modern languages, architectures, and best practices for scalable systems.",
  },
  {
    icon: Monitor,
    title: "Frontend Developers",
    slug: "frontend-developers",
    description:
      "Specialists in React, Next.js, Vue, and Angular who build performant, accessible user interfaces.",
  },
  {
    icon: Database,
    title: "Backend Developers",
    slug: "backend-developers",
    description:
      "Experts in Node.js, Python, Java, Go, and cloud-native APIs that power mission-critical applications.",
  },
  {
    icon: Layers,
    title: "Full Stack Developers",
    slug: "fullstack-developers",
    description:
      "Versatile professionals who own features end-to-end, from database schema to polished UI.",
  },
  {
    icon: TestTube,
    title: "QA Engineers",
    slug: "qa-engineers",
    description:
      "Quality assurance specialists skilled in automated testing, CI pipelines, and comprehensive test strategies.",
  },
  {
    icon: GitBranch,
    title: "DevOps Engineers",
    slug: "devops-engineers",
    description:
      "Infrastructure experts who streamline deployments, optimize cloud costs, and ensure rock-solid uptime.",
  },
  {
    icon: Palette,
    title: "UI/UX Designers",
    slug: "ui-ux-designers",
    description:
      "Design professionals who translate business goals into intuitive, research-driven user experiences.",
  },
  {
    icon: Briefcase,
    title: "Project Managers",
    slug: "project-managers",
    description:
      "Experienced PMs who align cross-functional teams, manage scope, and deliver projects on time and on budget.",
  },
  {
    icon: BarChart3,
    title: "Data Engineers",
    slug: "data-engineers",
    description:
      "Data pipeline architects who build reliable ETL workflows, data warehouses, and analytics infrastructure.",
  },
  {
    icon: Smartphone,
    title: "Mobile Developers",
    slug: "mobile-developers",
    description:
      "iOS, Android, and cross-platform specialists who ship polished mobile applications users love.",
  },
];

export default function HirePage() {
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
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Pre-vetted professionals ready in 48 hours
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
                Hire Elite Remote Talent{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">
                  from Latin America
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                Access rigorously vetted software engineers, developers,
                designers, and tech leaders who work in your time zone and
                deliver from day one — at up to 60% less than US market rates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-950 font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 hover:shadow-glow-lg text-base"
                >
                  Book a Call
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#roles"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all text-base"
                >
                  Browse Roles
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section-padding bg-gray-50/50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                Why Hire Through SMarDevs
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                A Smarter Way to{" "}
                <span className="gradient-text">Build Your Team</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Traditional hiring is slow, expensive, and unpredictable. SMarDevs
                replaces that with a proven system that delivers exceptional
                talent on your timeline.
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

        {/* Role Grid */}
        <section id="roles" className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                Explore Roles
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Top Remote Roles{" "}
                <span className="gradient-text">Available Now</span>
              </h2>
              <p className="text-gray-600 text-lg">
                From individual contributors to team leads, find the exact
                expertise you need across the full spectrum of technical
                disciplines.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {roleCards.map((role) => (
                <Link
                  key={role.slug}
                  href={`/hire/${role.slug}`}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-glass hover:shadow-glass-lg hover:border-brand-200 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5 group-hover:bg-brand-100 transition-colors">
                    <role.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-600 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {role.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-brand-600 text-sm font-medium group-hover:gap-2 transition-all">
                    Learn More
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-hero-gradient text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl" />
          <div className="container-custom relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
              Not Sure Where to Start?
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
              Tell us about the skills and experience you need. Our talent
              advisors will map the right professionals to your requirements and
              deliver curated profiles within 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-950 font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 text-base"
              >
                Schedule a Free Consultation
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
