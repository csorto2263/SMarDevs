export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  coverImage: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-nearshoring-is-replacing-offshoring-for-us-companies",
    title: "Why Nearshoring Is Replacing Offshoring for US Tech Companies in 2026",
    excerpt:
      "The shift from offshore to nearshore development is accelerating. US companies are discovering that time zone alignment, cultural compatibility, and reduced communication friction deliver better outcomes than chasing the lowest hourly rate. Here is what is driving the change and how to evaluate whether nearshoring is right for your engineering organization.",
    author: "Santiago Morales",
    date: "2026-03-15",
    readTime: "8 min read",
    category: "Nearshoring",
    coverImage: "/images/blog/nearshoring-replacing-offshoring.jpg",
  },
  {
    slug: "true-cost-of-hiring-software-engineers-us-vs-latam",
    title: "The True Cost of Hiring Software Engineers: US vs. Latin America",
    excerpt:
      "Salary is only part of the equation. When you factor in recruiting costs, benefits, office space, turnover, and ramp-up time, the total cost of a US-based software engineer can exceed $200,000 annually. We break down the real numbers and show how LATAM staff augmentation can cut your engineering costs by 40-50% without sacrificing quality.",
    author: "Carolina Restrepo",
    date: "2026-03-08",
    readTime: "10 min read",
    category: "Cost Optimization",
    coverImage: "/images/blog/hiring-cost-comparison.jpg",
  },
  {
    slug: "building-high-performing-remote-engineering-teams",
    title: "Building High-Performing Remote Engineering Teams: A Practical Playbook",
    excerpt:
      "Managing a distributed engineering team requires more than Slack channels and Zoom calls. From async communication protocols to sprint ceremonies that respect time zones, this guide covers the practices that separate high-performing remote teams from those that struggle with coordination and delivery.",
    author: "Diego Fernandez",
    date: "2026-02-28",
    readTime: "12 min read",
    category: "Remote Teams",
    coverImage: "/images/blog/remote-engineering-teams.jpg",
  },
  {
    slug: "qa-automation-strategy-when-to-automate-what-to-skip",
    title: "QA Automation Strategy: When to Automate and What to Skip",
    excerpt:
      "Not every test should be automated. The most effective QA automation strategies focus on high-value regression scenarios while leaving exploratory and edge-case testing to skilled manual testers. Learn how to build an automation roadmap that maximizes ROI and actually improves your release confidence.",
    author: "Valentina Ruiz",
    date: "2026-02-20",
    readTime: "9 min read",
    category: "Quality Assurance",
    coverImage: "/images/blog/qa-automation-strategy.jpg",
  },
  {
    slug: "staff-augmentation-vs-outsourcing-which-model-fits",
    title: "Staff Augmentation vs. Outsourcing: Which Model Fits Your Team?",
    excerpt:
      "Staff augmentation and project outsourcing solve different problems. One embeds talent into your existing team while the other delegates entire deliverables to an external provider. We compare both models across control, cost, speed, and quality dimensions to help you choose the right approach for your next initiative.",
    author: "Santiago Morales",
    date: "2026-02-12",
    readTime: "7 min read",
    category: "Hiring",
    coverImage: "/images/blog/staff-augmentation-vs-outsourcing.jpg",
  },
  {
    slug: "scaling-engineering-teams-without-breaking-culture",
    title: "Scaling Engineering Teams Without Breaking Your Culture",
    excerpt:
      "Rapid team growth is one of the biggest risks to engineering culture. When you double your team size in six months, communication overhead increases, knowledge silos form, and the practices that made your small team effective start to break down. Here is how to scale deliberately while preserving what makes your team great.",
    author: "Carolina Restrepo",
    date: "2026-01-30",
    readTime: "11 min read",
    category: "Remote Teams",
    coverImage: "/images/blog/scaling-engineering-culture.jpg",
  },
];
