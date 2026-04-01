export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  outcome: string;
  metrics: Record<string, string>;
  testimonial: {
    quote: string;
    author: string;
    title: string;
  };
  duration: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "fintech-platform-scaling",
    title: "Scaling a Fintech Platform from 10K to 1M Users",
    client: "Stratos Finance",
    industry: "Financial Services",
    challenge:
      "Stratos Finance needed to scale their payment processing platform to handle 100x transaction volume within six months. Their existing US-based team of five engineers was stretched thin maintaining current operations while trying to rebuild core infrastructure for scale. Hiring domestically at the pace required was neither financially viable nor fast enough to meet their Series B growth commitments.",
    solution:
      "SMarDevs assembled a dedicated nearshore squad of four senior engineers specializing in distributed systems, event-driven architecture, and cloud-native development. The team integrated directly into Stratos's Agile workflow, participating in daily standups and sprint planning from overlapping time zones in Colombia and Argentina. Engineers were onboarded within two weeks and began contributing production code by their third week.",
    outcome:
      "The platform successfully migrated to a microservices architecture with event-driven processing, achieving sub-200ms transaction latency at 10x the previous throughput. The combined team delivered the migration three weeks ahead of schedule, enabling Stratos to onboard enterprise clients on their accelerated timeline. The nearshore team remains embedded 14 months later as a permanent extension of the engineering organization.",
    metrics: {
      "Engineering Cost Reduction": "47% vs. US hiring",
      "Time to Market": "3 weeks ahead of schedule",
      "Transaction Throughput": "10x increase",
      "System Uptime": "99.97% post-migration",
    },
    testimonial: {
      quote:
        "The SMarDevs engineers felt like an extension of our own team from day one. Their technical depth in distributed systems was exactly what we needed, and the time zone alignment meant we never lost a day waiting for handoffs.",
      author: "Marcus Chen",
      title: "CTO, Stratos Finance",
    },
    duration: "6 months",
  },
  {
    slug: "healthtech-compliance-platform",
    title: "HIPAA-Compliant Telehealth Platform Rebuild",
    client: "Meridian Health",
    industry: "Healthcare Technology",
    challenge:
      "Meridian Health's legacy telehealth application was built on outdated technology that could not meet evolving HIPAA compliance requirements. They faced a tight regulatory deadline and struggled to find US-based engineers with both healthcare domain expertise and modern cloud security skills at a sustainable budget. The existing platform also suffered from poor patient experience scores that were driving churn.",
    solution:
      "SMarDevs provided a cross-functional team of three backend engineers and two frontend specialists with prior healthcare SaaS experience. The team executed a phased rebuild, replacing the monolithic application with a HIPAA-compliant, cloud-native platform on AWS with end-to-end encryption, comprehensive audit logging, and role-based access controls. A dedicated QA engineer ensured compliance requirements were validated at every stage of development.",
    outcome:
      "Meridian Health passed their compliance audit with zero critical findings and launched the new platform two weeks before the regulatory deadline. Patient satisfaction scores for the telehealth experience improved by 34%, and the new architecture reduced page load times by 60%. The engineering cost structure allowed Meridian to reinvest savings into expanding their product feature set.",
    metrics: {
      "Compliance Audit Findings": "Zero critical issues",
      "Development Cost Savings": "52% vs. domestic contractors",
      "Patient Satisfaction Improvement": "+34%",
      "Delivery Timeline": "2 weeks ahead of deadline",
    },
    testimonial: {
      quote:
        "We were skeptical about nearshore talent handling sensitive healthcare infrastructure, but SMarDevs matched us with engineers who understood HIPAA requirements deeply. The quality of their security implementation exceeded what we had seen from domestic contractors.",
      author: "Dr. Sarah Okafor",
      title: "VP of Engineering, Meridian Health",
    },
    duration: "8 months",
  },
  {
    slug: "b2b-marketplace-launch",
    title: "Launching an Enterprise B2B Marketplace in Record Time",
    client: "NovaCraft Labs",
    industry: "SaaS / E-Commerce",
    challenge:
      "NovaCraft Labs secured Series B funding with a mandate to launch their B2B procurement marketplace within four months. Their product roadmap required complex multi-tenant architecture, real-time inventory synchronization with supplier systems, and payment escrow functionality that their lean founding team of three engineers could not build alone. Every week of delay risked losing first-mover advantage in their market segment.",
    solution:
      "SMarDevs deployed a full-stack squad of six engineers covering React, Node.js, PostgreSQL, and DevOps. The team operated as a dedicated product squad with their own tech lead, collaborating with NovaCraft's product managers through shared Figma designs, Linear project boards, and bi-weekly stakeholder demos. A QA automation engineer was included from sprint one to establish automated testing pipelines that maintained quality at speed.",
    outcome:
      "The marketplace launched on schedule with all core features operational, including multi-vendor onboarding, automated escrow payments, and real-time inventory synchronization across supplier APIs. NovaCraft onboarded their first 50 enterprise buyers within the first month post-launch. The automated test suite achieved 89% coverage, giving the team confidence to iterate rapidly on post-launch feedback without introducing regressions.",
    metrics: {
      "Launch Timeline": "Delivered on 4-month schedule",
      "Engineering Cost Savings": "51% vs. US team build-out",
      "Automated Test Coverage": "89%",
      "First-Month Enterprise Buyers": "50+ organizations",
    },
    testimonial: {
      quote:
        "SMarDevs gave us a cohesive, senior squad that owned outcomes, not just tasks. Our investors were impressed by the development velocity, and the code quality meant we could iterate confidently post-launch without accumulating technical debt.",
      author: "James Whitfield",
      title: "CEO, NovaCraft Labs",
    },
    duration: "4 months",
  },
];
