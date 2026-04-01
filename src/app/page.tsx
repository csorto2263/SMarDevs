import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
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
  Star,
  ChevronRight,
  Send,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const trustedCompanies = [
  "TechVenture Co.",
  "Meridian Health",
  "Stratos Finance",
  "NovaCraft Labs",
  "Pinnacle SaaS",
  "Velocity Retail",
];

const benefits = [
  {
    icon: Clock,
    title: "48-Hour Talent Delivery",
    description:
      "Receive pre-vetted candidate profiles within two business days. Our deep talent pipeline eliminates lengthy sourcing cycles.",
  },
  {
    icon: DollarSign,
    title: "Up to 40-50% Cost Savings",
    description:
      "Access senior-level expertise at a fraction of US market rates without compromising on technical standards or output quality.",
  },
  {
    icon: Globe2,
    title: "US-Aligned Time Zones",
    description:
      "Your LATAM team operates during your business hours. Real-time collaboration, daily standups, and zero communication lag.",
  },
  {
    icon: Shield,
    title: "Rigorous Vetting Process",
    description:
      "Every candidate passes technical assessments, English proficiency evaluation, and cultural fit screening before reaching your desk.",
  },
  {
    icon: Users,
    title: "Seamless Team Integration",
    description:
      "We handle onboarding, payroll, benefits, and compliance so your new team members integrate as naturally as local hires.",
  },
  {
    icon: Zap,
    title: "Flexible Scaling",
    description:
      "Scale your team up or down based on project demands. No long-term lock-ins, no overhead — just the talent you need, when you need it.",
  },
];

const whyLatam = [
  "Over 1.5 million tech graduates enter the LATAM workforce annually",
  "Strong engineering culture with deep expertise in modern frameworks",
  "Cultural alignment with North American business practices",
  "English proficiency rates among tech professionals exceed 75%",
  "Same-day overlap with US Eastern, Central, and Pacific time zones",
  "Proven track record powering Fortune 500 and fast-growth startups alike",
];

const processSteps = [
  {
    step: "01",
    title: "Share Your Requirements",
    description:
      "Tell us about the role, technical skills, seniority level, and team dynamics. We tailor our search to your exact specifications.",
  },
  {
    step: "02",
    title: "Review Curated Profiles",
    description:
      "Within 48 hours, receive a shortlist of pre-vetted candidates who match your technical and cultural criteria.",
  },
  {
    step: "03",
    title: "Interview & Select",
    description:
      "Conduct interviews on your schedule. We coordinate logistics and provide structured evaluation frameworks.",
  },
  {
    step: "04",
    title: "Onboard & Build",
    description:
      "Your chosen professional starts within days. We handle contracts, compliance, and ongoing support while you focus on building.",
  },
];

const popularRoles = [
  { icon: Code2, title: "Software Engineers", slug: "software-engineers" },
  { icon: Monitor, title: "Frontend Developers", slug: "frontend-developers" },
  { icon: Database, title: "Backend Developers", slug: "backend-developers" },
  { icon: Layers, title: "Full Stack Developers", slug: "fullstack-developers" },
  { icon: TestTube, title: "QA Engineers", slug: "qa-engineers" },
  { icon: GitBranch, title: "DevOps Engineers", slug: "devops-engineers" },
  { icon: Palette, title: "UI/UX Designers", slug: "ui-ux-designers" },
  { icon: Briefcase, title: "Project Managers", slug: "project-managers" },
  { icon: BarChart3, title: "Business Analysts", slug: "business-analysts" },
];

const testimonials = [
  {
    quote:
      "SMarDevs transformed our hiring strategy. We scaled from 3 to 12 engineers in under two months, and every single one has been exceptional.",
    author: "Sarah Mitchell",
    title: "VP of Engineering",
    company: "TechVenture Co.",
  },
  {
    quote:
      "The caliber of talent we access through SMarDevs rivals what we see from top-tier US candidates — at a significantly lower cost. It is a game-changer.",
    author: "James Rivera",
    title: "CTO",
    company: "NovaCraft Labs",
  },
  {
    quote:
      "What sets SMarDevs apart is the ongoing support. They do not just place talent and disappear — they ensure long-term success for both sides.",
    author: "Michelle Park",
    title: "Head of Product",
    company: "Stratos Finance",
  },
];

const blogHighlights = [
  {
    title: "The Real Cost of Hiring Engineers in the US vs. Latin America",
    category: "Cost Optimization",
    slug: "us-vs-latam-hiring-costs",
  },
  {
    title: "5 Signs Your Team Is Ready for Nearshore Staff Augmentation",
    category: "Hiring Strategy",
    slug: "signs-ready-for-nearshore",
  },
  {
    title: "Building High-Performing Remote QA Teams: A Practical Guide",
    category: "QA & Testing",
    slug: "building-remote-qa-teams",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-hero-gradient min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl" />
          <div className="container-custom relative z-10 py-20 md:py-32">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Backed by a team with 10+ years in tech recruiting
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
                Elite Nearshore Tech Talent{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">
                  from Latin America.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
                Access rigorously vetted software engineers, developers, and
                tech specialists from Latin America — fully aligned with your
                time zone, your standards, and your growth ambitions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-950 font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 hover:shadow-glow-lg text-base"
                >
                  Build Your Team
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/hire"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all text-base"
                >
                  Explore Roles
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="py-12 md:py-16 border-b border-gray-100">
          <div className="container-custom">
            <p className="text-center text-sm font-medium text-gray-400 uppercase tracking-widest mb-8">
              Trusted by forward-thinking companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {trustedCompanies.map((company) => (
                <span
                  key={company}
                  className="text-gray-300 font-semibold text-lg md:text-xl tracking-tight"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="section-padding bg-gray-50/50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                Why SMarDevs
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Everything You Need to{" "}
                <span className="gradient-text">Scale with Confidence</span>
              </h2>
              <p className="text-gray-600 text-lg">
                We combine deep talent networks, rigorous evaluation, and
                white-glove service to deliver professionals who perform from
                day one.
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
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why LATAM */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                  The LATAM Advantage
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                  World-Class Engineers,{" "}
                  <span className="gradient-text">Smarter Economics</span>
                </h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Latin America has become the premier destination for US
                  companies seeking top-tier technical talent. The region
                  combines exceptional engineering education, cultural proximity,
                  and cost efficiency that offshore alternatives simply cannot
                  match.
                </p>
                <ul className="space-y-4">
                  {whyLatam.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
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
                      <p className="text-4xl font-bold gradient-text">10+</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Years of Experience
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding bg-navy-950 text-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-4">
                How It Works
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                From Request to Results in{" "}
                <span className="text-brand-400">Days, Not Months</span>
              </h2>
              <p className="text-white/60 text-lg">
                Our streamlined process eliminates the friction of traditional
                hiring while maintaining the rigor your team deserves.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

        {/* Popular Roles */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                In-Demand Roles
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Hire Pre-Vetted Professionals{" "}
                <span className="gradient-text">Across Every Discipline</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Whether you need a single specialist or an entire squad, we
                deliver talent that integrates seamlessly into your workflow.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {popularRoles.map((role) => (
                <Link
                  key={role.slug}
                  href={`/hire/${role.slug}`}
                  className="group flex items-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-glass hover:shadow-glass-lg hover:border-brand-200 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 transition-colors">
                    <role.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg group-hover:text-brand-600 transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-sm text-gray-500">View details</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-600 transition-colors" />
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/hire"
                className="inline-flex items-center gap-2 px-8 py-4 bg-cta-gradient text-white font-semibold rounded-full hover:opacity-90 transition-all hover:scale-105 hover:shadow-glow"
              >
                View All Roles
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-padding bg-gray-50/50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                Client Success
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Trusted by Engineering Leaders{" "}
                <span className="gradient-text">Worldwide</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.author}
                  className="bg-white rounded-2xl p-8 shadow-glass border border-gray-100"
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.title}, {testimonial.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies Preview */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                  Proven Results
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Real Impact, Real Numbers
                </h2>
              </div>
              <Link
                href="/case-studies"
                className="text-brand-600 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all mt-4 md:mt-0"
              >
                View all case studies
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Scaling a Fintech Platform",
                  metric: "12 Engineers",
                  outcome: "Deployed in 6 weeks",
                  industry: "Financial Services",
                  slug: "scaling-fintech-platform",
                },
                {
                  title: "QA Transformation for E-Commerce",
                  metric: "85% Bug Reduction",
                  outcome: "3-month engagement",
                  industry: "E-Commerce",
                  slug: "qa-transformation-ecommerce",
                },
                {
                  title: "DevOps Overhaul for HealthTech",
                  metric: "99.9% Uptime",
                  outcome: "Infrastructure modernized",
                  industry: "Healthcare Technology",
                  slug: "devops-overhaul-healthtech",
                },
              ].map((study) => (
                <Link
                  key={study.slug}
                  href={`/case-studies/${study.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-48 bg-gradient-to-br from-navy-900 to-brand-700 flex flex-col items-center justify-center gap-1">
                    <span className="text-white text-5xl font-bold">
                      {study.metric}
                    </span>
                    <span className="text-white/50 text-sm">{study.outcome}</span>
                  </div>
                  <div className="p-6 text-center">
                    <span className="text-xs font-medium text-brand-600 uppercase tracking-wider">
                      {study.industry}
                    </span>
                    <h3 className="text-xl font-semibold mt-2 group-hover:text-brand-600 transition-colors">
                      {study.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Highlights */}
        <section className="section-padding bg-gray-50/50">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-4">
                  Insights & Resources
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  From Our Blog
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-brand-600 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all mt-4 md:mt-0"
              >
                Read more articles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {blogHighlights.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-brand-50 flex items-center justify-center">
                    <BarChart3 className="w-16 h-16 text-brand-200" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-brand-600 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-semibold mt-2 group-hover:text-brand-600 transition-colors leading-snug">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="section-padding bg-hero-gradient text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl" />
          <div className="container-custom relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
              Ready to Build Your Dream Team?
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
              Our team brings over a decade of experience connecting US
              companies with elite LATAM talent. Get matched with
              pre-vetted professionals in as little as 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-950 font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 text-base"
              >
                Schedule a Consultation
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

        {/* Newsletter */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-3">
                Stay Ahead of the Curve
              </h3>
              <p className="text-gray-600 mb-6">
                Get weekly insights on nearshore hiring, engineering leadership,
                and cost optimization delivered to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="flex-1 px-5 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cta-gradient text-white font-semibold rounded-full hover:opacity-90 transition-all text-sm"
                >
                  Subscribe
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-3">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
