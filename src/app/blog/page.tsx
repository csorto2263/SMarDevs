import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Tag,
  User,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | SMarDevs",
  description:
    "Insights, strategies, and best practices for engineering leaders building distributed teams with LATAM talent.",
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-hero-gradient min-h-[50vh] flex items-center">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl" />
          <div className="container-custom relative z-10 py-20 md:py-28">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8">
                <BookOpen className="w-4 h-4" />
                Insights and Resources
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Insights for Modern{" "}
                <span className="gradient-text">Engineering Leaders</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                Practical strategies for hiring, managing, and scaling
                distributed engineering teams. Written by industry practitioners
                who have built teams across borders.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="section-padding bg-navy-950">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => {
                const formattedDate = new Date(post.date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                );

                return (
                  <article
                    key={post.slug}
                    className="group flex flex-col rounded-2xl shadow-glass bg-white/5 border border-white/10 hover:border-brand-600/50 transition-all overflow-hidden"
                  >
                    {/* Cover Image Placeholder */}
                    <div className="relative h-48 bg-gradient-to-br from-brand-600/20 to-accent-500/20 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white/20" />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600/90 text-white text-xs font-medium">
                          <Tag className="w-3 h-3" />
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-6">
                      <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-brand-400 transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="text-white/60 leading-relaxed mb-6 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-white/40 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-white/40 mt-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {formattedDate}
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 font-medium transition-colors mt-4"
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

        {/* Newsletter CTA */}
        <section className="section-padding bg-cta-gradient">
          <div className="container-custom text-center">
            <BookOpen className="w-12 h-12 text-brand-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Ahead of the Curve
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
              Get our latest insights on nearshore hiring, distributed team
              management, and LATAM talent trends delivered to your inbox. No
              spam, just actionable knowledge.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-600 transition-colors"
              />
              <button className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-brand-600/25 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
