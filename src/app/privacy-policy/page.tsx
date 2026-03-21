import { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | SMarDevs",
};

const sections = [
  {
    title: "Information We Collect",
    content: [
      "We collect information you provide directly when you fill out our contact forms, request a consultation, or communicate with our team. This includes your name, email address, phone number, company name, and details about your staffing requirements.",
      "We also automatically collect certain technical information when you visit our website, including your IP address, browser type, operating system, referring URLs, and pages viewed. This data helps us understand how visitors interact with our site and improve our services.",
      "If you engage our staffing services, we may collect additional business information necessary to fulfill our contractual obligations, including project specifications, technical requirements, and billing details.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "We use the information we collect to respond to your inquiries, provide our nearshore staffing services, and communicate with you about potential talent matches and project updates.",
      "Your data helps us improve our service offerings, personalize your experience, and develop new features. We may also use aggregated, anonymized data for internal analytics and business intelligence purposes.",
      "With your consent, we may send you newsletters, industry insights, and information about our services. You can opt out of these communications at any time by clicking the unsubscribe link included in every email.",
    ],
  },
  {
    title: "Information Sharing and Disclosure",
    content: [
      "We do not sell, rent, or trade your personal information to third parties for marketing purposes. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, provided those parties agree to keep this information confidential.",
      "We may disclose your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect our or others' rights, property, or safety.",
      "In the event of a merger, acquisition, or sale of assets, your personal information may be transferred as part of that transaction. We will notify you of any such change in ownership or control of your personal information.",
    ],
  },
  {
    title: "Data Security",
    content: [
      "We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include SSL encryption, secure server infrastructure, and regular security audits.",
      "While we strive to protect your information, no method of transmission over the Internet or electronic storage is completely secure. We cannot guarantee absolute security but are committed to maintaining robust safeguards for your data.",
    ],
  },
  {
    title: "Cookies and Tracking Technologies",
    content: [
      "Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. Cookies are small text files placed on your device that help us provide a more personalized experience.",
      "We use both session cookies, which expire when you close your browser, and persistent cookies, which remain on your device until deleted. You can configure your browser to refuse cookies or alert you when cookies are being sent, though some features of our site may not function properly without them.",
      "We may use third-party analytics services such as Google Analytics to help us understand website usage patterns. These services may collect information about your use of our website using their own cookies.",
    ],
  },
  {
    title: "Your Rights and Choices",
    content: [
      "You have the right to access, correct, or delete your personal information at any time. You may also request a copy of the data we hold about you in a portable format.",
      "If you are a resident of the European Economic Area, you have additional rights under the General Data Protection Regulation (GDPR), including the right to restrict processing and the right to object to processing of your personal data.",
      "California residents have specific rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected and the right to request deletion of personal information.",
    ],
  },
  {
    title: "Contact Us",
    content: [
      "If you have any questions about this Privacy Policy, your personal data, or would like to exercise any of your data protection rights, please contact us at privacy@smartdevs.com or through our contact page.",
      "We will respond to all legitimate requests within 30 days. In certain circumstances, we may need additional time, in which case we will notify you and keep you updated on our progress.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy-950 text-white">
        {/* Hero */}
        <section className="bg-hero-gradient section-padding pt-32 pb-16">
          <div className="container-custom text-center">
            <div className="inline-flex items-center gap-2 bg-brand-600/10 border border-brand-600/20 rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-4 h-4 text-brand-600" />
              <span className="text-sm text-brand-600 font-medium">Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
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
                  At SMarDevs, we are committed to protecting your privacy and ensuring the security
                  of your personal information. This Privacy Policy explains how we collect, use,
                  disclose, and safeguard your information when you visit our website or engage our
                  nearshore staffing services.
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
