import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Handshake,
  Lightbulb,
  ShieldCheck,
  Target,
  Award,
  Users,
  Globe2,
  Sparkles,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us | SMarDevs",
  description:
    "SMarDevs connects exceptional LATAM technical talent with companies building world-class teams. Learn about our mission, values, and the people behind your next great hire.",
};

const values = [
  {
    icon: Award,
    title: "Excellence",
    description:
      "We hold ourselves and every professional in our network to the highest standards. Mediocrity is not in our vocabulary — we deliver talent that performs at the top percentile, every time.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Clear communication, honest pricing, and realistic timelines. We believe trust is built through visibility, so we keep you informed at every step of the process.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    description:
      "We do not see ourselves as a vendor — we operate as an extension of your team. Your goals become our goals, and your success is the only metric that matters.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "The talent landscape evolves constantly. We invest in better sourcing technology, smarter evaluation frameworks, and data-driven matching to stay ahead of the curve.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "Every recommendation we make is honest. If a candidate is not the right fit or a service model does not align with your needs, we will tell you — even if it means losing the deal.",
  },
  {
    icon: Target,
    title: "Impact",
    description:
      "We measure success by the tangible outcomes our placements create: products shipped, revenue generated, teams strengthened. Placement is the beginning, not the end.",
  },
];

const differentiators = [
  {
    title: "Consultative, Not Transactional",
    description:
      "We invest time understanding your architecture, team culture, and growth trajectory before presenting a single candidate. This depth of discovery is why our first-match acceptance rate exceeds 90%.",
  },
  {
    title: "Deep LATAM-Native Network",
    description:
      "Founded in Honduras and embedded across Latin America, we have access to talent pipelines that offshore brokers and US-based agencies simply cannot reach. Our relationships are local, long-standing, and trust-based.",
  },
  {
    title: "End-to-End Talent Operations",
    description:
      "From sourcing and vetting to payroll, compliance, and ongoing performance management — we handle the entire talent lifecycle so you can focus entirely on building product.",
  },
  {
    title: "Engineered for Retention",
    description:
      "Our 97% retention rate is not accidental. We match on technical depth, communication style, cultural alignment, and career aspirations to ensure placements that last years, not months.",
  },
  {
    title: "Transparent Partnership Model",
    description:
      "No hidden markups, no surprise fees, no bait-and-switch. Our pricing is straightforward, our contracts are flexible, and our account managers are available whenever you need them.",
  },
];

const leaders = [
  {
    name: "Marvin Ortega",
    title: "Co-Founder & CEO",
    focus: ["Sales Strategy", "Business Development", "Marketing"],
    bio: "Marvin co-founded SMarDevs with a clear mission: give ambitious companies access to world-class Latin American talent — and give LATAM professionals access to the opportunities they deserve. He leads the company's commercial strategy, client relationships, and growth initiatives, bringing a sharp focus on building partnerships that deliver measurable impact.",
  },
  {
    name: "Carlos Sorto",
    title: "Co-Founder & COO",
    focus: ["Engineering", "Talent Acquisition", "Operations"],
    bio: "Carlos oversees SMarDevs' engineering and talent operations, ensuring every professional placed meets the technical bar and cultural standards clients expect. With deep roots in software engineering and a rigorous approach to candidate evaluation, he architects the vetting methodology and operational systems that power the company's delivery excellence.",
  },
];

export default function AboutPage() {
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
                About SMarDevs
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
                Built to Bridge{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">
                  Talent and Ambition
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
                We exist to connect exceptional Latin American professionals
                with companies that refuse to settle for anything less than
                world-class engineering.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                  Our Story
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8">
                  From Honduras to{" "}
                  <span className="gradient-text">the World</span>
                </h2>
                <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                  <p>
                    SMarDevs was founded in Honduras with a clear mission — to
                    connect the exceptional technical talent of Latin America with
                    companies seeking to build world-class teams. With over a
                    decade of experience in tech recruiting, our founding team
                    knows exactly what it takes to match the right talent with
                    the right opportunity.
                  </p>
                  <p>
                    The idea emerged from a simple observation: brilliant
                    engineers across LATAM were being overlooked by companies that
                    defaulted to costly domestic hiring or impersonal offshore
                    outsourcing. We believed there was a better model — one
                    grounded in deep local relationships, rigorous quality
                    standards, and genuine partnership with both the talent we
                    represent and the companies we serve.
                  </p>
                  <p>
                    Today, SMarDevs operates from Honduras serving companies
                    across North America, with a growing network of carefully
                    vetted technology professionals throughout Latin America.
                    We place engineers, designers, QA specialists, and technical
                    leaders into teams that demand excellence — and we stand
                    behind every placement with hands-on support.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-brand-50 to-accent-400/10 rounded-3xl p-8 md:p-12">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-glass text-center">
                      <p className="text-4xl font-bold gradient-text">10+</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Years of Experience
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-glass text-center">
                      <p className="text-4xl font-bold gradient-text">6+</p>
                      <p className="text-sm text-gray-600 mt-2">
                        LATAM Countries
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-glass text-center">
                      <p className="text-4xl font-bold gradient-text">97%</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Retention Rate
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-glass text-center">
                      <p className="text-4xl font-bold gradient-text">2K+</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Professionals Vetted Annually
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-gray-50/50">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-glass border border-gray-100">
                <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-brand-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To democratize access to elite technical talent by building
                  bridges between LATAM professionals and global opportunities.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-glass border border-gray-100">
                <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mb-6">
                  <Globe2 className="w-7 h-7 text-brand-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To become the most trusted nearshore talent partner for
                  technology companies worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                Our Values
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Principles That{" "}
                <span className="gradient-text">Guide Every Decision</span>
              </h2>
              <p className="text-gray-600 text-lg">
                These are not aspirational statements posted on a wall. They are
                the operating principles that shape how we evaluate talent, serve
                clients, and build our company.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="group bg-white rounded-2xl p-8 shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5 group-hover:bg-brand-100 transition-colors">
                    <value.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section className="section-padding bg-navy-950 text-white">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-4">
                  Our Approach
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                  Consultative,{" "}
                  <span className="text-brand-400">Not Transactional</span>
                </h2>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  Most staffing firms operate like resume factories — collecting
                  requirements, blasting job boards, and hoping for a match. We
                  take a fundamentally different approach. Every engagement
                  begins with a deep understanding of your technology stack,
                  team culture, delivery cadence, and long-term product roadmap.
                </p>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  This consultative foundation allows us to present candidates
                  who do not just meet the technical requirements on paper but
                  integrate naturally into your workflows, communicate
                  effectively with your team, and contribute meaningfully from
                  their first week.
                </p>
                <p className="text-white/70 text-lg leading-relaxed">
                  The result is a partnership model that reduces churn,
                  accelerates ramp-up, and delivers compounding value over time.
                  It is why our clients stay — and why they refer us to their
                  peers.
                </p>
              </div>
              <div className="space-y-6">
                {differentiators.map((item) => (
                  <div
                    key={item.title}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  >
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-white/60 leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                Leadership
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                The People Behind{" "}
                <span className="gradient-text">Your Next Great Hire</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Our leadership team combines deep expertise in technology
                recruiting, LATAM operations, and engineering management.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {leaders.map((leader) => (
                <div
                  key={leader.name}
                  className="bg-white rounded-2xl overflow-hidden shadow-glass border border-gray-100"
                >
                  <div className="h-56 bg-gradient-to-br from-navy-900 to-brand-700 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-16 h-16 text-white/20 mx-auto mb-3" />
                      <p className="text-white/40 text-sm font-medium">
                        Photo coming soon
                      </p>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-semibold mb-1">
                      {leader.name}
                    </h3>
                    <p className="text-brand-600 font-medium text-sm mb-3">
                      {leader.title}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {leader.focus.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full border border-brand-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {leader.bio}
                    </p>
                  </div>
                </div>
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
              Ready to Work with a Partner Who Gets It?
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
              Discover how SMarDevs can help you build the engineering team your
              product deserves. Schedule a conversation with our team — no
              commitment, no pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-950 font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 text-base"
              >
                Start a Conversation
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all text-base"
              >
                Explore Our Services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
