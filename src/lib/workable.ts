/**
 * Workable Integration Module for SMarDevs.com
 *
 * This module provides two integration approaches:
 *
 * SCENARIO A: Simple Embed (Recommended for v1)
 *   - Each job in jobs.ts has a `workableUrl` field
 *   - "Apply Now" buttons link directly to the Workable hosted application form
 *   - No API credentials needed
 *   - Setup: Create jobs in Workable, copy the application URL, add to jobs.ts
 *
 * SCENARIO B: API Integration (For dynamic sync)
 *   - Fetches jobs from Workable API and renders them in your custom design
 *   - Requires a Workable API access token
 *   - Jobs are fetched at build time (ISR) or on demand
 *
 * HOW TO SET UP:
 *
 * 1. Create a Workable account at https://www.workable.com
 * 2. Go to Settings > Integrations > Access Tokens
 * 3. Generate an API token with "read" permissions
 * 4. Add to your .env.local file:
 *    WORKABLE_API_TOKEN=your_token_here
 *    WORKABLE_SUBDOMAIN=smartdevs
 * 5. Create job postings in Workable dashboard
 * 6. For Scenario A: Copy the application URL from each job and add to jobs.ts
 * 7. For Scenario B: The API will automatically sync jobs
 */

// ============================================================
// CONFIGURATION
// ============================================================

const WORKABLE_SUBDOMAIN = process.env.WORKABLE_SUBDOMAIN || "smartdevs";
const WORKABLE_API_TOKEN = process.env.WORKABLE_API_TOKEN || "";
const WORKABLE_API_BASE = `https://${WORKABLE_SUBDOMAIN}.workable.com/spi/v3`;

// ============================================================
// TYPES
// ============================================================

export interface WorkableJob {
  id: string;
  title: string;
  full_title: string;
  shortcode: string;
  code: string;
  state: string;
  department: string;
  url: string;
  application_url: string;
  shortlink: string;
  location: {
    location_str: string;
    country: string;
    country_code: string;
    region: string;
    region_code: string;
    city: string;
    zip_code: string;
    telecommuting: boolean;
  };
  created_at: string;
}

export interface WorkableJobDetail extends WorkableJob {
  full_description: string;
  description: string;
  requirements: string;
  benefits: string;
  employment_type: string;
  industry: string;
  function: string;
  experience: string;
  education: string;
}

// ============================================================
// SCENARIO A: SIMPLE EMBED HELPERS
// ============================================================

/**
 * Generates the Workable application URL for a given job shortcode.
 * Use this when you know the job's shortcode from Workable.
 *
 * Example: getWorkableApplyUrl("ABC123") =>
 *   "https://apply.workable.com/smartdevs/j/ABC123/apply/"
 */
export function getWorkableApplyUrl(shortcode: string): string {
  return `https://apply.workable.com/${WORKABLE_SUBDOMAIN}/j/${shortcode}/apply/`;
}

/**
 * Generates the Workable job view URL.
 */
export function getWorkableJobUrl(shortcode: string): string {
  return `https://apply.workable.com/${WORKABLE_SUBDOMAIN}/j/${shortcode}/`;
}

/**
 * Returns the Workable widget embed script URL.
 * Add this to your careers page to embed the full Workable job board.
 *
 * Usage in a component:
 *   <Script src={getWorkableWidgetUrl()} strategy="lazyOnload" />
 *   <div id="whr_embed_hook"></div>
 *
 * Also add to your page:
 *   <Script id="workable-widget-init" strategy="lazyOnload">
 *     {`whr(document).ready(function(){whr_embed(0, {whr_pd: "${WORKABLE_SUBDOMAIN}", whr_el: "whr_embed_hook"});});`}
 *   </Script>
 */
export function getWorkableWidgetUrl(): string {
  return "https://www.workable.com/assets/embed.js";
}

// ============================================================
// SCENARIO B: API INTEGRATION
// ============================================================

/**
 * Fetches all published jobs from Workable API.
 * Requires WORKABLE_API_TOKEN environment variable.
 *
 * Use with Next.js ISR:
 *   export const revalidate = 3600; // Revalidate every hour
 */
export async function fetchWorkableJobs(): Promise<WorkableJob[]> {
  if (!WORKABLE_API_TOKEN) {
    console.warn(
      "[Workable] No API token configured. Set WORKABLE_API_TOKEN in .env.local"
    );
    return [];
  }

  try {
    const response = await fetch(`${WORKABLE_API_BASE}/jobs?state=published`, {
      headers: {
        Authorization: `Bearer ${WORKABLE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Workable API error: ${response.status}`);
    }

    const data = await response.json();
    return data.jobs || [];
  } catch (error) {
    console.error("[Workable] Failed to fetch jobs:", error);
    return [];
  }
}

/**
 * Fetches a single job's full details from Workable API.
 */
export async function fetchWorkableJob(
  shortcode: string
): Promise<WorkableJobDetail | null> {
  if (!WORKABLE_API_TOKEN) {
    console.warn(
      "[Workable] No API token configured. Set WORKABLE_API_TOKEN in .env.local"
    );
    return null;
  }

  try {
    const response = await fetch(`${WORKABLE_API_BASE}/jobs/${shortcode}`, {
      headers: {
        Authorization: `Bearer ${WORKABLE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Workable API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("[Workable] Failed to fetch job:", error);
    return null;
  }
}

// ============================================================
// FALLBACK STRATEGY
// ============================================================

/**
 * Fetches jobs with fallback to static data.
 * If Workable API fails or is not configured, returns the static jobs
 * from your local data file.
 *
 * Usage:
 *   import { jobs as staticJobs } from "@/data/jobs";
 *   const allJobs = await fetchJobsWithFallback(staticJobs);
 */
export async function fetchJobsWithFallback<T>(
  staticJobs: T[]
): Promise<{ jobs: T[] | WorkableJob[]; source: "workable" | "static" }> {
  if (!WORKABLE_API_TOKEN) {
    return { jobs: staticJobs, source: "static" };
  }

  try {
    const workableJobs = await fetchWorkableJobs();
    if (workableJobs.length > 0) {
      return { jobs: workableJobs, source: "workable" };
    }
    return { jobs: staticJobs, source: "static" };
  } catch {
    return { jobs: staticJobs, source: "static" };
  }
}
