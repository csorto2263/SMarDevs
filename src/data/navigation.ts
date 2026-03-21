export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  description?: string;
  badge?: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export const mainNavigation: NavItem[] = [
  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "Staff Augmentation",
        href: "/services/staff-augmentation",
        description: "Embed vetted engineers directly into your team",
      },
      {
        label: "Dedicated Teams",
        href: "/services/dedicated-teams",
        description: "Build a full nearshore squad managed by SMarDevs",
      },
      {
        label: "Direct Hire",
        href: "/services/direct-hire",
        description: "Recruit and hire LATAM talent for your payroll",
      },
    ],
  },
  {
    label: "Hire Talent",
    href: "/hire",
    children: [
      {
        label: "Software Engineers",
        href: "/hire/software-engineers",
        description: "Full-cycle developers across languages and frameworks",
      },
      {
        label: "Frontend Developers",
        href: "/hire/frontend-developers",
        description: "React, Vue, Angular, and modern UI specialists",
      },
      {
        label: "Backend Developers",
        href: "/hire/backend-developers",
        description: "API, microservices, and data pipeline experts",
      },
      {
        label: "Full Stack Developers",
        href: "/hire/fullstack-developers",
        description: "End-to-end feature owners across the stack",
      },
      {
        label: "QA Engineers",
        href: "/hire/qa-engineers",
        description: "Manual testing, test strategy, and quality assurance",
      },
      {
        label: "QA Automation Engineers",
        href: "/hire/qa-automation-engineers",
        description: "Test frameworks, CI integration, and automation",
      },
      {
        label: "DevOps Engineers",
        href: "/hire/devops-engineers",
        description: "Cloud infrastructure, CI/CD, and reliability",
      },
      {
        label: "UI/UX Designers",
        href: "/hire/ui-ux-designers",
        description: "Product design, research, and design systems",
      },
      {
        label: "Project Managers",
        href: "/hire/project-managers",
        description: "Agile delivery, coordination, and stakeholder management",
      },
      {
        label: "Business Analysts",
        href: "/hire/business-analysts",
        description: "Requirements, process analysis, and documentation",
      },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      {
        label: "Blog",
        href: "/blog",
        description: "Insights on nearshoring, hiring, and engineering teams",
      },
      {
        label: "Case Studies",
        href: "/case-studies",
        description: "Real results from SMarDevs client engagements",
      },
      {
        label: "Salary Guide",
        href: "/resources/salary-guide",
        description: "US vs. LATAM compensation benchmarks by role",
      },
      {
        label: "How It Works",
        href: "/how-it-works",
        description: "Our vetting, matching, and onboarding process",
      },
      {
        label: "FAQ",
        href: "/faq",
        description: "Common questions about working with SMarDevs",
      },
    ],
  },
  {
    label: "Careers",
    href: "/careers",
    badge: "Hiring",
  },
  {
    label: "About",
    href: "/about",
  },
];

export const ctaNavItem: NavItem = {
  label: "Get Started",
  href: "/contact",
};

export const footerNavigation: FooterColumn[] = [
  {
    title: "Services",
    links: [
      { label: "Staff Augmentation", href: "/services/staff-augmentation" },
      { label: "Dedicated Teams", href: "/services/dedicated-teams" },
      { label: "Direct Hire", href: "/services/direct-hire" },
      { label: "How It Works", href: "/how-it-works" },
    ],
  },
  {
    title: "Hire Talent",
    links: [
      { label: "Software Engineers", href: "/hire/software-engineers" },
      { label: "Frontend Developers", href: "/hire/frontend-developers" },
      { label: "Backend Developers", href: "/hire/backend-developers" },
      { label: "Full Stack Developers", href: "/hire/fullstack-developers" },
      { label: "QA Engineers", href: "/hire/qa-engineers" },
      { label: "QA Automation Engineers", href: "/hire/qa-automation-engineers" },
      { label: "DevOps Engineers", href: "/hire/devops-engineers" },
      { label: "UI/UX Designers", href: "/hire/ui-ux-designers" },
      { label: "Project Managers", href: "/hire/project-managers" },
      { label: "Business Analysts", href: "/hire/business-analysts" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Salary Guide", href: "/resources/salary-guide" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];
