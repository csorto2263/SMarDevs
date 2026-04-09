"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  Clock,
  Calendar,
  Send,
  CheckCircle2,
  ChevronDown,
  MapPin,
  MessageSquare,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const roleOptions = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "QA Engineer",
  "QA Automation Engineer",
  "DevOps Engineer",
  "UI/UX Designer",
  "Project Manager",
  "Business Analyst",
  "Other",
];

const positionOptions = ["1", "2-5", "6-10", "10+"];
const timelineOptions = ["Immediately", "1-2 weeks", "1 month", "Just exploring"];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    role: "",
    positions: "",
    timeline: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = true;
    if (!form.company.trim()) newErrors.company = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch (_) {
      // still show success to user even if email fails
    } finally {
      setSending(false);
      setSubmitted(true);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy-950 text-white">
        {/* Hero */}
        <section className="bg-hero-gradient section-padding pt-32 pb-16">
          <div className="container-custom text-center">
            <div className="inline-flex items-center gap-2 bg-brand-600/10 border border-brand-600/20 rounded-full px-4 py-1.5 mb-6">
              <MessageSquare className="w-4 h-4 text-brand-600" />
              <span className="text-sm text-brand-600 font-medium">Get in Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto">
              Let&#39;s Build Something{" "}
              <span className="gradient-text">Exceptional Together</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Tell us about your hiring needs and our team will craft a tailored staffing solution
              within 24 hours.
            </p>
          </div>
        </section>

        {/* Calendly Inline Widget */}
        <section className="py-16 bg-navy-950">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-brand-600/10 border border-brand-600/20 rounded-full px-4 py-1.5 mb-4">
                <Calendar className="w-4 h-4 text-brand-600" />
                <span className="text-sm text-brand-600 font-medium">Book a Call</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Schedule a Free Discovery Call
              </h2>
              <p className="text-gray-400">
                Pick a time that works for you — no commitment required.
              </p>
            </div>
            <div
              className="calendly-inline-widget w-full rounded-2xl overflow-hidden border border-white/10"
              data-url="https://calendly.com/csorto-smardevs/30min?background_color=0a0f1e&text_color=ffffff&primary_color=2563eb"
              style={{ minWidth: 320, height: 700 }}
            />
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">
              {/* Form */}
              <div className="lg:col-span-3">
                <div className="shadow-glass rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
                  {submitted ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Thank You!</h3>
                      <p className="text-gray-400 max-w-md mx-auto">
                        Our team will reach out within 24 hours. We look forward to helping you
                        build your ideal engineering team.
                      </p>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 mt-8 text-brand-600 hover:text-brand-600/80 font-medium transition-colors"
                      >
                        Back to Home
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <h2 className="text-xl font-semibold mb-2">Tell Us About Your Needs</h2>

                      <div className="grid md:grid-cols-2 gap-5">
                        {/* Full Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1.5">
                            Full Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Smith"
                            className={`w-full bg-navy-950 border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent ${
                              errors.name ? "border-red-500" : "border-white/10"
                            }`}
                          />
                          {errors.name && (
                            <p className="text-red-400 text-xs mt-1">Name is required</p>
                          )}
                        </div>

                        {/* Work Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1.5">
                            Work Email <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="john@company.com"
                            className={`w-full bg-navy-950 border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent ${
                              errors.email ? "border-red-500" : "border-white/10"
                            }`}
                          />
                          {errors.email && (
                            <p className="text-red-400 text-xs mt-1">Valid email is required</p>
                          )}
                        </div>

                        {/* Company */}
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1.5">
                            Company Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={form.company}
                            onChange={handleChange}
                            placeholder="Acme Inc."
                            className={`w-full bg-navy-950 border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent ${
                              errors.company ? "border-red-500" : "border-white/10"
                            }`}
                          />
                          {errors.company && (
                            <p className="text-red-400 text-xs mt-1">Company name is required</p>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1.5">
                            Phone <span className="text-gray-600">(optional)</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-navy-950 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                          />
                        </div>

                        {/* Role */}
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1.5">
                            Role You&#39;re Hiring For
                          </label>
                          <div className="relative">
                            <select
                              name="role"
                              value={form.role}
                              onChange={handleChange}
                              className="w-full bg-navy-950 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                            >
                              <option value="">Select a role</option>
                              {roleOptions.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* Positions */}
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1.5">
                            Number of Positions
                          </label>
                          <div className="relative">
                            <select
                              name="positions"
                              value={form.positions}
                              onChange={handleChange}
                              className="w-full bg-navy-950 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                            >
                              <option value="">Select</option>
                              {positionOptions.map((p) => (
                                <option key={p} value={p}>
                                  {p}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                          Project Timeline
                        </label>
                        <div className="relative">
                          <select
                            name="timeline"
                            value={form.timeline}
                            onChange={handleChange}
                            className="w-full bg-navy-950 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                          >
                            <option value="">Select a timeline</option>
                            {timelineOptions.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                          Message <span className="text-gray-600">(optional)</span>
                        </label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Tell us about your project, tech stack, or any specific requirements..."
                          className="w-full bg-navy-950 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-600/90 text-white font-semibold px-8 py-4 rounded-lg transition-all disabled:opacity-60"
                      >
                        <Send className="w-4 h-4" />
                        {sending ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Info */}
                <div className="shadow-glass rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <a href="mailto:mortega@smardevs.com" className="text-white font-medium hover:text-brand-400 transition-colors">mortega@smardevs.com</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <a href="https://wa.me/15043331465?text=Hi%20there!%20I%20came%20across%20SMarDevs%20and%20I'm%20curious%20about%20your%20talent%20solutions%20for%20LATAM%20engineers.%20I'd%20like%20to%20get%20more%20details%20%E2%80%94%20is%20this%20a%20good%20channel%20to%20reach%20you%3F" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-brand-400 transition-colors">+1 (504) 333-1465</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Office Hours</p>
                        <p className="text-white font-medium">Mon-Fri, 8am - 6pm EST</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="text-white font-medium">Maryland, US</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="shadow-glass rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-400">
                      Typically responds within 4 hours
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Our talent acquisition team reviews every inquiry personally and will respond
                    with a customized proposal.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
