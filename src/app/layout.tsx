import type { Metadata } from "next";
import "./globals.css";
import SMartyWidget from "@/components/SMartyWidget";

export const metadata: Metadata = {
  title: {
    default: "SMarDevs | Elite Nearshore Tech Talent for Growing Teams",
    template: "%s | SMarDevs",
  },
  description:
    "Connect with rigorously vetted software engineers, developers, QA specialists, and tech professionals from Latin America. Reduce costs by up to 40-50% while maintaining world-class quality.",
  keywords: [
    "nearshore staffing",
    "remote developers",
    "LATAM talent",
    "staff augmentation",
    "hire remote engineers",
    "nearshore development",
    "software engineers LATAM",
    "tech talent outsourcing",
  ],
  authors: [{ name: "SMarDevs" }],
  creator: "SMarDevs",
  metadataBase: new URL("https://smardevs.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smardevs.com",
    siteName: "SMarDevs",
    title: "SMarDevs | Elite Nearshore Tech Talent for Growing Teams",
    description:
      "Connect with rigorously vetted software engineers, developers, QA specialists, and tech professionals from Latin America.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SMarDevs - Elite Nearshore Tech Talent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SMarDevs | Elite Nearshore Tech Talent",
    description:
      "Rigorously vetted tech talent from Latin America. Save up to 40-50% on hiring costs.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SMarDevs",
    url: "https://smardevs.com",
    logo: "https://smardevs.com/og-image.png",
    description:
      "Connect with rigorously vetted software engineers, developers, QA specialists, and tech professionals from Latin America.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@smardevs.com",
      contactType: "sales",
    },
    sameAs: [
      "https://www.facebook.com/smardevs",
      "https://www.linkedin.com/company/smardevs",
    ],
    areaServed: ["US", "CA", "GB"],
    serviceType: [
      "Staff Augmentation",
      "Dedicated Development Teams",
      "Direct Placement",
    ],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased text-navy-950 bg-white">
        {children}
        <SMartyWidget />
      </body>
    </html>
  );
}
