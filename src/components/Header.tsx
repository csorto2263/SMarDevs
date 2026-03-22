"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  BookOpen,
  FileText,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

/* ─── Data ─── */

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Hire Remote", href: "/hire" },
];

const resourceLinks = [
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Case Studies", href: "/case-studies", icon: FileText },
  { label: "Savings Calculator", href: "/savings-calculator", icon: Calculator },
];

/* ─── Component ─── */

function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const isResourceActive = resourceLinks.some((r) => isActive(r.href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        "bg-white border-b border-gray-200/60",
        scrolled && "shadow-sm"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 text-white text-sm font-bold shadow-md shadow-blue-500/25">
            S
          </span>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            SMar<span className="text-blue-600">Devs</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-colors duration-150",
                isActive(link.href)
                  ? "text-blue-600 bg-blue-50/80"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* Resources dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setResourcesOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-150",
                isResourceActive || resourcesOpen
                  ? "text-blue-600 bg-blue-50/80"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
              )}
            >
              Resources
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  resourcesOpen && "rotate-180"
                )}
              />
            </button>

            <div
              className={cn(
                "absolute right-0 top-full mt-2 w-64 origin-top-right",
                "rounded-2xl border border-gray-200/60 bg-white/90 backdrop-blur-xl",
                "shadow-lg shadow-gray-200/50 p-2",
                "transition-all duration-200",
                resourcesOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              )}
            >
              {resourceLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setResourcesOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150",
                      isActive(link.href)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <Button href="/contact" size="sm" arrow>
            Book a Call
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100/60 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* ─── Mobile overlay ─── */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-40 lg:hidden",
          "bg-white/95 backdrop-blur-xl",
          "transition-all duration-300",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col gap-1 px-4 pt-6 pb-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                isActive(link.href)
                  ? "text-blue-600 bg-blue-50/80"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile resources */}
          <div className="mt-2 mb-1 px-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Resources
          </div>
          {resourceLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors",
                  isActive(link.href)
                    ? "text-blue-600 bg-blue-50/80"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-gray-400" />
                {link.label}
              </Link>
            );
          })}

          <div className="mt-6 px-4">
            <Button href="/contact" size="md" arrow className="w-full">
              Book a Call
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
