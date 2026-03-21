"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Linkedin,
  Twitter,
  Github,
  Facebook,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Data ─── */

const footerColumns = [
  {
    title: "Services",
    links: [
      { label: "Staff Augmentation", href: "/services/staff-augmentation" },
      { label: "Dedicated Teams", href: "/services/dedicated-teams" },
      { label: "Direct Placement", href: "/services/direct-placement" },
    ],
  },
  {
    title: "Hire Remote",
    links: [
      { label: "React Developers", href: "/hire/react-developers" },
      { label: "Node.js Developers", href: "/hire/nodejs-developers" },
      { label: "Python Developers", href: "/hire/python-developers" },
      { label: "DevOps Engineers", href: "/hire/devops-engineers" },
      { label: "Full-Stack Developers", href: "/hire/fullstack-developers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Salary Guide", href: "/salary-guide" },
      { label: "Ebook", href: "/ebook" },
      { label: "Savings Calculator", href: "/calculator" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com/company/smartdevs", icon: Linkedin },
  { label: "Twitter", href: "https://x.com/smartdevs", icon: Twitter },
  { label: "GitHub", href: "https://github.com/smartdevs", icon: Github },
  { label: "Facebook", href: "https://facebook.com/smartdevs", icon: Facebook },
];

/* ─── Component ─── */

function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with newsletter service
    setEmail("");
  };

  return (
    <footer className="bg-[#0B1120] text-gray-300">
      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-6">
          {/* Brand + newsletter */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 text-white text-sm font-bold shadow-md shadow-blue-500/20">
                S
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                SMar<span className="text-blue-400">Devs</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Elite remote developers from Latin America. Scale your engineering
              team with top-tier talent in your timezone.
            </p>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">
                Stay up to date
              </h4>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex gap-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className={cn(
                    "flex-1 rounded-xl border border-gray-700/60 bg-gray-800/50",
                    "px-4 py-2.5 text-sm text-white placeholder:text-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50",
                    "transition-all duration-200"
                  )}
                />
                <button
                  type="submit"
                  className={cn(
                    "flex h-[42px] w-[42px] shrink-0 items-center justify-center",
                    "rounded-xl bg-blue-600 text-white",
                    "hover:bg-blue-500 transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1120]"
                  )}
                  aria-label="Subscribe"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Contact info */}
            <div className="space-y-1 text-sm text-gray-400">
              <a
                href="mailto:info@smartdevs.com"
                className="block hover:text-white transition-colors"
              >
                info@smartdevs.com
              </a>
              <a
                href="tel:+15551234567"
                className="block hover:text-white transition-colors"
              >
                +1 (555) 123-4567
              </a>
            </div>

            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      "bg-gray-800/60 text-gray-400",
                      "hover:bg-gray-700 hover:text-white",
                      "transition-all duration-150"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-white mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; 2024 SMarDevs. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
