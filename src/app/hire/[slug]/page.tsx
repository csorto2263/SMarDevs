import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Award,
  TrendingUp,
  Clock,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { roles } from "@/data/roles";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return roles.map((role) => ({
    slug: role.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const role = roles.find((r) => r.slug === slug);

  if (!role) {
    return {
      title: "Role Not Found",
    };
  }

  return {
    title: `Hire Remote ${role.title}`,
    description: role.heroDescription,
  };
}

function formatSalary(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return `$${amount.toLocaleString()}`;
}

export default async function RolePage({ params }: PageProps) {
  const { slug } = await params;
  const role = roles.find((r) => r.slug === slug);

  if (!role) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-hero-gradient min-h-[60vh] flex items-center">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl" />
          <div className="container-custom relative z-10 py-20 md:py-28">
            <div className="max-w-4xl">
              <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
                <Link
                  href="/hire"
                  className="hover:text-white/90 transition-colors"
                >
                  Hire Remote Talent
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white/90">{role.title}</span>
              </nav>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {role.category}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Hire Remote{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">
                  {role.title}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
                {role.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-950 font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 hover:shadow-glow-lg text-base"
                >
                  Book a Call
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#levels"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all text-base"
                >
                  View Seniority Levels
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Hire Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                  The LATAM Advantage
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                  Why Hire {role.shortTitle}{" "}
                  <span className="gradient-text">from Latin America</span>
                </h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Latin America produces world-class {role.shortTitle.toLowerCase()} who
                  combine deep technical expertise with cultural alignment and
                  full time-zone overlap with North American teams.
                </p>
                <ul className="space-y-4">
                  {role.whyHire.map((point) => (
                    <li key={point} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-brand-50 to-accent-400/10 rounded-3xl p-8 md:p-12">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-glass text-center">
                      <p className="text-4xl font-bold gradient-text">40-50%</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Average Cost Savings
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-glass text-center">
                      <p className="text-4xl font-bold gradient-text">48h</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Candidate Delivery
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-glass text-center">
                      <p className="text-4xl font-bold gradient-text">97%</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Retention Rate
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-glass text-center">
                      <p className="text-4xl font-bold gradient-text">4.9/5</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Client Satisfaction
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SMarDevs Advantage Section */}
        <section className="section-padding bg-gray-50/50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                Our Edge
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                The SMarDevs{" "}
                <span className="gradient-text">Advantage</span>
              </h2>
              <p className="text-gray-600 text-lg">
                When you hire {role.shortTitle.toLowerCase()} through SMarDevs, you get
                more than talent placement — you get a partner invested in
                long-term success.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {role.advantages.map((advantage, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5 group-hover:bg-brand-100 transition-colors">
                    <Sparkles className="w-6 h-6 text-brand-600" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{advantage}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seniority Levels Section */}
        <section id="levels" className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                Seniority Levels
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Choose the Right{" "}
                <span className="gradient-text">Experience Level</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Compare seniority tiers, skill expectations, and typical salary
                ranges between the US market and LATAM talent through SMarDevs.
              </p>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {role.levels.map((level) => (
                <div
                  key={level.name}
                  className="bg-white rounded-2xl border border-gray-100 shadow-glass overflow-hidden hover:shadow-glass-lg transition-all duration-300 flex flex-col"
                >
                  <div className="bg-navy-950 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-5 h-5 text-brand-400" />
                      <h3 className="text-xl font-semibold text-white">
                        {level.name}
                      </h3>
                    </div>
                    <p className="text-white/60 text-sm">{level.experience}</p>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-6">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                        Key Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {level.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-5 mt-auto">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                        Monthly Salary Comparison
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            US Market
                          </span>
                          <span className="text-sm font-semibold text-gray-400 line-through">
                            {formatSalary(level.typicalSalaryUS)}/mo
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 p-2.5 bg-green-50 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-green-600 shrink-0" />
                          <span className="text-sm font-semibold text-green-700">
                            Up to 40–50% savings via SMarDevs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hiring Process Section */}
        <section className="section-padding bg-navy-950 text-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-4">
                How It Works
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Your Path to Hiring{" "}
                <span className="text-brand-400">{role.shortTitle}</span>
              </h2>
              <p className="text-white/60 text-lg">
                Our streamlined process gets top {role.shortTitle.toLowerCase()} on
                your team in days, not months.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              {role.hiringProcess.map((step, index) => (
                <div key={index} className="relative flex gap-6 pb-12 last:pb-0">
                  {index < role.hiringProcess.length - 1 && (
                    <div className="absolute left-5 top-12 bottom-0 w-px bg-gradient-to-b from-brand-500/50 to-transparent" />
                  )}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="pt-1.5">
                    <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
                      Step {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="text-white/80 text-lg leading-relaxed">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-gray-50/50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                Common Questions
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Frequently Asked{" "}
                <span className="gradient-text">Questions</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Everything you need to know about hiring
                remote {role.shortTitle.toLowerCase()} through SMarDevs.
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {role.faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-glass overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer p-6 text-left font-semibold text-gray-900 hover:text-brand-600 transition-colors list-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-brand-600 flex-shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <div className="pl-8">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </details>
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
              Ready to Hire {role.shortTitle}?
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
              Tell us about your requirements and receive curated,
              pre-vetted {role.shortTitle.toLowerCase()} profiles within 48 hours.
              No commitment, no fees until you hire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-950 font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 text-base"
              >
                Book a Call
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/hire"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all text-base"
              >
                Explore Other Roles
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
