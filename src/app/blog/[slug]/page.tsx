import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Mail,
  Phone,
  Tag,
  User,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blog";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) {
    return { title: "Article Not Found | SMarDevs" };
  }
  return {
    title: `${post.title} | Blog | SMarDevs`,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-hero-gradient pt-32 pb-16">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="container-custom relative z-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600/20 text-brand-400 text-sm font-medium mb-6">
                <Tag className="w-3.5 h-3.5" />
                {post.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/50">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="section-padding bg-navy-950">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Article */}
              <article className="lg:col-span-2">
                {/* Cover Image */}
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-12">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-600/20 to-accent-500/20 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
                </div>

                {/* Article Body */}
                <div className="prose prose-lg prose-invert max-w-none space-y-6">
                  {/* Lead paragraph */}
                  <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-white/80 leading-relaxed text-lg mb-0">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Article content sections */}
                  <div className="space-y-8 text-white/70 leading-relaxed">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-3">Key Takeaways</h2>
                      <ul className="space-y-3 list-none pl-0">
                        {[
                          "Understanding the core drivers behind this trend is essential for engineering leaders planning their 2026 hiring strategy.",
                          "The decisions you make today around talent sourcing will compound over time — both in cost savings and team cohesion.",
                          "Practical frameworks and real-world benchmarks are more valuable than generic advice when navigating complex hiring decisions.",
                        ].map((point, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-600/30 text-brand-400 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 rounded-2xl bg-brand-600/10 border-l-4 border-brand-500">
                      <p className="text-white/80 italic text-base mb-0">
                        &ldquo;The engineering leaders who will win in the next five years are the ones building diverse, distributed teams — not the ones clinging to expensive, local-only hiring pipelines.&rdquo;
                      </p>
                      <p className="text-white/40 text-sm mt-3 mb-0">— {post.author}, SMarDevs</p>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-white mb-3">What This Means for Your Team</h2>
                      <p>
                        The landscape of software engineering talent has fundamentally shifted. Companies that adapt their hiring strategies to leverage global talent pools — particularly from Latin America — are consistently outperforming those that don&apos;t in both delivery speed and cost efficiency.
                      </p>
                      <p className="mt-4">
                        Whether you are just starting to explore nearshore talent or looking to scale an existing distributed team, the principles discussed in this article apply directly to your situation. The key is taking action before your competitors do.
                      </p>
                    </div>
                  </div>

                  {/* CTA within article */}
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-brand-600/20 to-accent-500/10 border border-brand-600/20 text-center">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Want to go deeper on this topic?
                    </h3>
                    <p className="text-white/60 leading-relaxed max-w-lg mx-auto mb-6 text-sm">
                      Our team of nearshore hiring specialists can walk you through exactly how these strategies apply to your company&apos;s size, industry, and engineering roadmap.
                    </p>
                    <Link
                      href="/#contact"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-all text-sm"
                    >
                      Talk to a Specialist
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Author Bio */}
                <div className="mt-12 p-8 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-600/30 to-accent-500/30 flex items-center justify-center shrink-0">
                    <User className="w-8 h-8 text-white/40" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {post.author}
                    </h4>
                    <p className="text-sm text-brand-400 mb-3">
                      Contributing Writer at SMarDevs
                    </p>
                    <p className="text-white/60 leading-relaxed text-sm">
                      Sharing practical insights on building and managing
                      distributed engineering teams across Latin America and
                      North America.
                    </p>
                  </div>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  {/* Book a Call CTA */}
                  <div className="p-8 rounded-2xl shadow-glass bg-white/5 border border-white/10">
                    <Phone className="w-8 h-8 text-brand-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Ready to Build Your Team?
                    </h3>
                    <p className="text-white/60 leading-relaxed mb-6 text-sm">
                      Schedule a free consultation with our team to discuss your
                      hiring needs and learn how SMarDevs can help you find the
                      right LATAM talent.
                    </p>
                    <Link
                      href="/#contact"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-brand-600/25 text-sm"
                    >
                      Book a Call
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Newsletter Signup */}
                  <div className="p-8 rounded-2xl shadow-glass bg-white/5 border border-white/10">
                    <Mail className="w-8 h-8 text-accent-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Subscribe to Our Newsletter
                    </h3>
                    <p className="text-white/60 leading-relaxed mb-6 text-sm">
                      Get the latest articles on nearshore hiring, distributed
                      team management, and LATAM talent trends delivered
                      straight to your inbox.
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-600 transition-colors text-sm"
                      />
                      <button className="w-full px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-all text-sm">
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="section-padding bg-navy-950/80">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((related) => {
                const relatedDate = new Date(related.date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                );

                return (
                  <article
                    key={related.slug}
                    className="group flex flex-col rounded-2xl shadow-glass bg-white/5 border border-white/10 hover:border-brand-600/50 transition-all overflow-hidden"
                  >
                    <div className="relative h-40 overflow-hidden">
                      {related.coverImage ? (
                        <Image
                          src={related.coverImage}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-600/20 to-accent-500/20 flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-white/20" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600/90 text-white text-xs font-medium">
                          <Tag className="w-3 h-3" />
                          {related.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-brand-400 transition-colors">
                        <Link href={`/blog/${related.slug}`}>
                          {related.title}
                        </Link>
                      </h3>
                      <p className="text-white/60 leading-relaxed text-sm mb-4 flex-1">
                        {related.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-white/40">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3 h-3" />
                          {related.author}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {relatedDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {related.readTime}
                        </span>
                      </div>
                      <Link
                        href={`/blog/${related.slug}`}
                        className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 font-medium transition-colors mt-4 text-sm"
                      >
                        Read Article
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
