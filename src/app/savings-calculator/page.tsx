"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  DollarSign,
  TrendingDown,
  Users,
  ChevronDown,
  ArrowRight,
  BarChart3,
  Minus,
  Plus,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const roles = [
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
] as const;

type Role = (typeof roles)[number];
type Seniority = "Junior" | "Mid-Level" | "Senior";

// LATAM cost = 60% of US cost (40% savings shown to client; remainder is negotiation margin)
const salaryData: Record<Role, Record<Seniority, { us: number; latam: number }>> = {
  "Software Engineer": {
    Junior:     { us: 8500,  latam: 5100 },
    "Mid-Level":{ us: 11000, latam: 6600 },
    Senior:     { us: 14000, latam: 8400 },
  },
  "Frontend Developer": {
    Junior:     { us: 8500,  latam: 5100 },
    "Mid-Level":{ us: 11000, latam: 6600 },
    Senior:     { us: 14000, latam: 8400 },
  },
  "Backend Developer": {
    Junior:     { us: 8500,  latam: 5100 },
    "Mid-Level":{ us: 11000, latam: 6600 },
    Senior:     { us: 14000, latam: 8400 },
  },
  "Full Stack Developer": {
    Junior:     { us: 8500,  latam: 5100 },
    "Mid-Level":{ us: 11000, latam: 6600 },
    Senior:     { us: 14000, latam: 8400 },
  },
  "QA Engineer": {
    Junior:     { us: 7000,  latam: 4200 },
    "Mid-Level":{ us: 8000,  latam: 4800 },
    Senior:     { us: 10500, latam: 6300 },
  },
  "QA Automation Engineer": {
    Junior:     { us: 8000,  latam: 4800 },
    "Mid-Level":{ us: 10000, latam: 6000 },
    Senior:     { us: 13000, latam: 7800 },
  },
  "DevOps Engineer": {
    Junior:     { us: 8500,  latam: 5100 },
    "Mid-Level":{ us: 11200, latam: 6720 },
    Senior:     { us: 14500, latam: 8700 },
  },
  "UI/UX Designer": {
    Junior:     { us: 7000,  latam: 4200 },
    "Mid-Level":{ us: 9000,  latam: 5400 },
    Senior:     { us: 12000, latam: 7200 },
  },
  "Project Manager": {
    Junior:     { us: 7500,  latam: 4500 },
    "Mid-Level":{ us: 9500,  latam: 5700 },
    Senior:     { us: 13000, latam: 7800 },
  },
  "Business Analyst": {
    Junior:     { us: 7000,  latam: 4200 },
    "Mid-Level":{ us: 9000,  latam: 5400 },
    Senior:     { us: 12000, latam: 7200 },
  },
};

const seniorities: Seniority[] = ["Junior", "Mid-Level", "Senior"];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SavingsCalculatorPage() {
  const [role, setRole] = useState<Role>("Software Engineer");
  const [seniority, setSeniority] = useState<Seniority>("Mid-Level");
  const [hires, setHires] = useState(3);

  const data = salaryData[role][seniority];
  const monthlyUS = data.us * hires;
  const monthlyLATAM = data.latam * hires;
  const monthlySavings = monthlyUS - monthlyLATAM;
  const annualSavings = monthlySavings * 12;
  const savingsPercent = Math.round((monthlySavings / monthlyUS) * 100);
  const barPercent = Math.round((monthlyLATAM / monthlyUS) * 100);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy-950 text-white">
        {/* Hero */}
        <section className="bg-hero-gradient section-padding pt-32 pb-16">
          <div className="container-custom text-center">
            <div className="inline-flex items-center gap-2 bg-brand-600/10 border border-brand-600/20 rounded-full px-4 py-1.5 mb-6">
              <Calculator className="w-4 h-4 text-brand-600" />
              <span className="text-sm text-brand-600 font-medium">Savings Calculator</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto">
              See How Much You Can Save with{" "}
              <span className="gradient-text">Nearshore Talent</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Compare the cost of hiring US-based professionals versus LATAM nearshore talent.
              Adjust the role, seniority, and team size to see your potential savings.
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-5xl mx-auto">
              {/* Input Controls */}
              <div className="shadow-glass rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 mb-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-600" />
                  Configure Your Team
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Role
                    </label>
                    <div className="relative">
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                        className="w-full bg-navy-950 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Seniority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Seniority
                    </label>
                    <div className="flex gap-2">
                      {seniorities.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSeniority(s)}
                          className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all ${
                            seniority === s
                              ? "bg-brand-600 text-white"
                              : "bg-navy-950 border border-white/10 text-gray-400 hover:border-white/20"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Number of Hires */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Number of Hires
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setHires(Math.max(1, hires - 1))}
                        className="w-10 h-10 rounded-lg bg-navy-950 border border-white/10 flex items-center justify-center text-gray-400 hover:border-white/20 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={hires}
                        onChange={(e) => {
                          const v = parseInt(e.target.value);
                          if (!isNaN(v)) setHires(Math.min(50, Math.max(1, v)));
                        }}
                        className="flex-1 bg-navy-950 border border-white/10 rounded-lg px-4 py-2.5 text-center text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => setHires(Math.min(50, hires + 1))}
                        className="w-10 h-10 rounded-lg bg-navy-950 border border-white/10 flex items-center justify-center text-gray-400 hover:border-white/20 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Summary Cards */}
                <div className="space-y-4">
                  <div className="shadow-glass rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">Monthly US Cost <span className="text-gray-500">({hires} {hires === 1 ? "engineer" : "engineers"})</span></span>
                      <DollarSign className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">{formatCurrency(monthlyUS)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatCurrency(data.us)} per person
                    </p>
                  </div>

                  <div className="shadow-glass rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">Monthly LATAM Cost <span className="text-gray-500">({hires} {hires === 1 ? "engineer" : "engineers"})</span></span>
                      <Users className="w-4 h-4 text-accent-500" />
                    </div>
                    <p className="text-2xl font-bold text-accent-500">
                      {formatCurrency(monthlyLATAM)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatCurrency(data.latam)} per person
                    </p>
                  </div>

                  <div className="shadow-glass rounded-2xl border border-brand-600/30 bg-brand-600/10 p-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-brand-600">Monthly Savings</span>
                      <TrendingDown className="w-4 h-4 text-brand-600" />
                    </div>
                    <p className="text-2xl font-bold text-brand-600">
                      {formatCurrency(monthlySavings)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {savingsPercent}% reduction in monthly payroll
                    </p>
                  </div>

                  <div className="shadow-glass rounded-2xl border border-green-500/30 bg-green-500/10 p-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-green-400">Annual Savings</span>
                      <BarChart3 className="w-4 h-4 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-green-400">
                      {formatCurrency(annualSavings)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Projected yearly savings for {hires} {hires === 1 ? "hire" : "hires"}
                    </p>
                  </div>
                </div>

                {/* Visual Comparison */}
                <div className="shadow-glass rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-center">
                  <h3 className="text-lg font-semibold mb-6">Cost Comparison</h3>

                  <div className="space-y-6">
                    {/* US Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">US-Based</span>
                        <span className="text-sm font-semibold text-white">
                          {formatCurrency(monthlyUS)}/mo
                        </span>
                      </div>
                      <div className="w-full h-10 bg-navy-950 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gray-500 to-gray-400 rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                          style={{ width: "100%" }}
                        >
                          <span className="text-xs font-medium text-navy-950">100%</span>
                        </div>
                      </div>
                    </div>

                    {/* LATAM Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">LATAM Nearshore</span>
                        <span className="text-sm font-semibold text-accent-500">
                          {formatCurrency(monthlyLATAM)}/mo
                        </span>
                      </div>
                      <div className="w-full h-10 bg-navy-950 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-600 to-accent-500 rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                          style={{ width: `${barPercent}%` }}
                        >
                          <span className="text-xs font-medium text-white">{barPercent}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Savings Highlight */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-center gap-3">
                        <div className="text-center">
                          <p className="text-4xl font-bold gradient-text">{savingsPercent}%</p>
                          <p className="text-sm text-gray-400 mt-1">Cost Savings</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Per-person breakdown */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-500 text-center">
                      Based on {hires} {seniority} {role}
                      {hires > 1 ? "s" : ""} &middot; Rates include overhead and management fees
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center bg-cta-gradient rounded-2xl p-10 md:p-14 shadow-glass">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Saving?</h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Our team will help you build a high-performing nearshore team tailored to your
                technical requirements and budget.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-600/90 text-white font-semibold px-8 py-4 rounded-lg transition-all"
              >
                Book a Call
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
