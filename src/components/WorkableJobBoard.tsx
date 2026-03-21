"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, MapPin, Clock, ChevronRight, AlertCircle } from "lucide-react";

/**
 * WorkableJobBoard - Dynamic job board component
 *
 * SCENARIO B: Renders jobs fetched from Workable API.
 * Falls back to static jobs if the API is unavailable.
 *
 * Usage:
 *   // In a server component, fetch jobs and pass them:
 *   import { fetchJobsWithFallback } from "@/lib/workable";
 *   import { jobs as staticJobs } from "@/data/jobs";
 *
 *   const { jobs, source } = await fetchJobsWithFallback(staticJobs);
 *   <WorkableJobBoard jobs={jobs} source={source} />
 *
 *   // Or use the widget embed approach (simpler):
 *   <WorkableWidget />
 */

interface JobCardProps {
  title: string;
  location: string;
  department?: string;
  type?: string;
  applyUrl: string;
}

function JobCard({ title, location, department, type, applyUrl }: JobCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold group-hover:text-brand-600 transition-colors">
            {title}
          </h3>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              {location}
            </span>
            {department && (
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                <Briefcase className="w-4 h-4" />
                {department}
              </span>
            )}
            {type && (
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {type}
              </span>
            )}
          </div>
        </div>
        <a
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-5 py-2.5 bg-cta-gradient text-white text-sm font-semibold rounded-full hover:opacity-90 transition-all flex-shrink-0"
        >
          Apply
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

/**
 * WorkableWidget - Embeds the Workable job board widget.
 *
 * This is the simplest integration: just drop this component
 * into your careers page and it renders the full Workable board.
 *
 * Prerequisites:
 * - Set your NEXT_PUBLIC_WORKABLE_SUBDOMAIN in .env.local
 * - Have published jobs in your Workable account
 */
export function WorkableWidget() {
  const subdomain =
    process.env.NEXT_PUBLIC_WORKABLE_SUBDOMAIN || "smartdevs";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.workable.com/assets/embed.js";
    script.async = true;
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whr = (window as any).whr;
      if (whr) {
        whr(document).ready(function () {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).whr_embed(0, {
            whr_pd: subdomain,
            whr_el: "whr_embed_hook",
          });
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [subdomain]);

  return (
    <div className="min-h-[400px]">
      <div id="whr_embed_hook" />
    </div>
  );
}

/**
 * WorkableJobBoard - Client component that renders job listings.
 * Designed to work with data fetched from either Workable API or static files.
 */
interface WorkableJobBoardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jobs: any[];
  source: "workable" | "static";
}

export function WorkableJobBoard({ jobs, source }: WorkableJobBoardProps) {
  const [filter, setFilter] = useState("");

  const filteredJobs = jobs.filter(
    (job) =>
      (job.title || "").toLowerCase().includes(filter.toLowerCase()) ||
      (job.department || job.roleCategory || "")
        .toLowerCase()
        .includes(filter.toLowerCase())
  );

  return (
    <div>
      {source === "static" && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Showing cached job listings. Live positions are updated regularly.
          </p>
        </div>
      )}

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search positions by title or department..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
        />
      </div>

      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No positions match your search. Try different keywords.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id || job.slug}
              title={job.title || job.full_title}
              location={
                job.location?.location_str || job.location || "Remote - LATAM"
              }
              department={job.department || job.roleCategory}
              type={job.employment_type || job.contractType}
              applyUrl={
                job.application_url ||
                job.workableUrl ||
                `/careers/${job.slug}`
              }
            />
          ))
        )}
      </div>

      <div className="mt-4 text-right">
        <p className="text-xs text-gray-400">
          {filteredJobs.length} position{filteredJobs.length !== 1 ? "s" : ""}{" "}
          available
        </p>
      </div>
    </div>
  );
}

/**
 * WorkableApplyButton - Standalone "Apply Now" button
 * Links to the Workable hosted application form for a specific job.
 *
 * Usage:
 *   <WorkableApplyButton
 *     workableUrl="https://apply.workable.com/smartdevs/j/ABC123/apply/"
 *     fallbackUrl="/careers/software-engineer"
 *   />
 */
interface ApplyButtonProps {
  workableUrl?: string;
  fallbackUrl?: string;
  className?: string;
}

export function WorkableApplyButton({
  workableUrl,
  fallbackUrl = "/careers",
  className = "",
}: ApplyButtonProps) {
  const href = workableUrl || fallbackUrl;
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-cta-gradient text-white font-semibold rounded-full hover:opacity-90 transition-all hover:scale-105 ${className}`}
      >
        Apply Now
        <ChevronRight className="w-5 h-5" />
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-cta-gradient text-white font-semibold rounded-full hover:opacity-90 transition-all hover:scale-105 ${className}`}
    >
      Apply Now
      <ChevronRight className="w-5 h-5" />
    </Link>
  );
}
