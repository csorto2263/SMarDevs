import { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | SMarDevs",
};

const sections = [
  {
    title: "Agreement to Terms",
    content: [
      "By accessing or using the SMarDevs website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.",
      "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to this page. Your continued use of our services following the posting of revised terms constitutes your acceptance of those changes.",
      "These terms apply to all visitors, users, and clients who access or use our website and nearshore staffing services.",
    ],
  },
  {
    title: "Description of Services",
    content: [
      "SMarDevs provides nearshore technology staffing solutions, connecting businesses with pre-vetted software development professionals located in Latin America. Our services include talent sourcing, candidate screening, team building, and ongoing talent management.",
      "We act as an intermediary between client companies and technology professionals. While we conduct thorough vetting of all candidates, the final hiring decision and management responsibility rests with the client.",
      "Service availability, pricing, and specific terms are outlined in individual service agreements executed between SMarDevs and each client. These Terms of Service supplement but do not replace any specific contractual agreements.",
    ],
  },
  {
    title: "User Obligations",
    content: [
      "You agree to provide accurate, current, and complete information when using our contact forms, requesting consultations, or engaging our services. Providing false or misleading information may result in the termination of services.",
      "You are responsible for maintaining the confidentiality of any account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.",
      "You agree not to use our website or services for any unlawful purpose, to solicit others to perform or participate in unlawful acts, or to violate any international, federal, or state regulations, rules, or laws.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "The SMarDevs website, including its design, text, graphics, logos, icons, and software, is the property of SMarDevs and is protected by United States and international copyright, trademark, and other intellectual property laws.",
      "You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content from our website without prior written consent from SMarDevs.",
      "Any materials, tools, or deliverables produced by professionals placed through our services are subject to the intellectual property terms defined in the specific service agreement between SMarDevs and the client.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "SMarDevs and its directors, employees, partners, agents, suppliers, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses.",
      "Our total liability for any claims arising out of or relating to these terms or our services shall not exceed the amount you paid to SMarDevs during the twelve months preceding the claim.",
      "We do not guarantee that our services will be uninterrupted, timely, secure, or error-free. We are not responsible for the performance, conduct, or work product of any professionals placed through our services beyond our initial vetting process.",
    ],
  },
  {
    title: "Indemnification",
    content: [
      "You agree to defend, indemnify, and hold harmless SMarDevs, its officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, or expenses arising out of or relating to your violation of these terms or your use of our services.",
    ],
  },
  {
    title: "Governing Law",
    content: [
      "These Terms of Service shall be governed by and construed in accordance with the laws of the State of Florida, United States, without regard to its conflict of law provisions.",
      "Any disputes arising from these terms or your use of our services shall be resolved exclusively in the state or federal courts located in Miami-Dade County, Florida. You consent to the personal jurisdiction of these courts.",
    ],
  },
  {
    title: "Termination",
    content: [
      "We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason, including but not limited to a breach of these Terms of Service.",
      "All provisions of these terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.",
    ],
  },
  {
    title: "Contact Information",
    content: [
      "If you have any questions about these Terms of Service, please contact us at legal@smartdevs.com or visit our contact page. We are committed to addressing your concerns promptly and transparently.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy-950 text-white">
        {/* Hero */}
        <section className="bg-hero-gradient section-padding pt-32 pb-16">
          <div className="container-custom text-center">
            <div className="inline-flex items-center gap-2 bg-brand-600/10 border border-brand-600/20 rounded-full px-4 py-1.5 mb-6">
              <FileText className="w-4 h-4 text-brand-600" />
              <span className="text-sm text-brand-600 font-medium">Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-400">
              Last updated: March 1, 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="shadow-glass rounded-2xl border border-white/10 bg-white/5 p-6 md:p-10">
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Please read these Terms of Service carefully before using the SMarDevs website or
                  engaging our nearshore staffing services. These terms establish the legal
                  agreement between you and SMarDevs regarding your use of our platform and
                  services.
                </p>

                <div className="space-y-10">
                  {sections.map((section, i) => (
                    <div key={i}>
                      <h2 className="text-xl font-semibold mb-4 text-white">
                        {i + 1}. {section.title}
                      </h2>
                      <div className="space-y-3">
                        {section.content.map((paragraph, j) => (
                          <p key={j} className="text-gray-400 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-600/80 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
