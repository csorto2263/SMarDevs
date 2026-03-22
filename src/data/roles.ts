export interface Role {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  heroDescription: string;
  whyHire: string[];
  advantages: string[];
  levels: {
    name: string;
    experience: string;
    skills: string[];
    typicalSalaryUS: number;
    typicalSalaryLATAM: number;
  }[];
  hiringProcess: string[];
  faqs: { question: string; answer: string }[];
}

export const roles: Role[] = [
  {
    slug: "software-engineers",
    title: "Hire Software Engineers",
    shortTitle: "Software Engineers",
    category: "Engineering",
    description:
      "Build scalable, reliable software products with experienced engineers from Latin America. Our software engineers bring deep technical expertise across multiple languages and frameworks, delivering production-ready code that meets enterprise standards.",
    heroDescription:
      "Access top-tier software engineering talent from Latin America at a fraction of US costs. Our rigorously vetted engineers integrate seamlessly with your team, working in your time zone to ship high-quality code faster.",
    whyHire: [
      "Accelerate product development without the overhead of traditional hiring, reducing time-to-hire from months to weeks.",
      "Gain access to engineers proficient in modern architectures including microservices, event-driven systems, and cloud-native applications.",
      "Reduce engineering costs by 40-60% compared to US-based hires while maintaining the same quality standards and output.",
      "Scale your engineering team up or down based on project demands without long-term contractual obligations.",
      "Work with professionals in overlapping time zones who participate in standups, code reviews, and sprint ceremonies in real time.",
    ],
    advantages: [
      "Every engineer passes a multi-stage vetting process including live coding assessments, system design interviews, and behavioral evaluations.",
      "SMarDevs assigns a dedicated talent partner who understands your tech stack and culture to find the right match.",
      "All engineers are fluent or advanced English speakers, ensuring clear communication across your organization.",
      "We handle payroll, benefits, equipment, and compliance so you can focus entirely on building your product.",
      "Our 30-day satisfaction guarantee means you only pay for talent that meets your expectations.",
      "Continuous performance monitoring and quarterly reviews ensure sustained delivery quality over time.",
    ],
    levels: [
      {
        name: "Junior",
        experience: "1-2 years",
        skills: [
          "Proficient in at least one primary language (Python, Java, JavaScript, or C#)",
          "Familiarity with version control using Git and branching strategies",
          "Basic understanding of relational databases and SQL queries",
          "Experience with unit testing and test-driven development fundamentals",
          "Ability to work within an Agile/Scrum team structure",
        ],
        typicalSalaryUS: 7500,
        typicalSalaryLATAM: 3500,
      },
      {
        name: "Mid-Level",
        experience: "3-5 years",
        skills: [
          "Strong proficiency in two or more programming languages with production experience",
          "Experience designing and building RESTful APIs and integrating third-party services",
          "Solid understanding of design patterns, SOLID principles, and clean architecture",
          "Comfortable with CI/CD pipelines, containerization with Docker, and cloud platforms",
          "Ability to mentor junior developers and lead code review processes",
        ],
        typicalSalaryUS: 11000,
        typicalSalaryLATAM: 6000,
      },
      {
        name: "Senior",
        experience: "6+ years",
        skills: [
          "Expert-level knowledge of distributed systems, scalability patterns, and performance optimization",
          "Proven ability to architect complex software solutions and make high-impact technical decisions",
          "Deep experience with cloud infrastructure (AWS, GCP, or Azure) and infrastructure as code",
          "Strong track record of leading technical teams and driving engineering best practices",
          "Experience with system observability, incident response, and production reliability engineering",
        ],
        typicalSalaryUS: 15500,
        typicalSalaryLATAM: 9000,
      },
    ],
    hiringProcess: [
      "Discovery call to understand your technical requirements, team dynamics, and project goals.",
      "Candidate sourcing and pre-screening from our carefully vetted talent network across LATAM.",
      "Technical assessment tailored to your stack, including live coding and system design challenges.",
      "Culture-fit interview with your team to ensure alignment on communication and work style.",
      "Reference checks and background verification before extending an offer.",
      "Onboarding support with equipment provisioning, tool access, and team introduction facilitation.",
    ],
    faqs: [
      {
        question: "What programming languages do your software engineers specialize in?",
        answer:
          "Our engineers have deep expertise across a wide range of languages including Python, Java, JavaScript, TypeScript, C#, Go, Ruby, and Kotlin. We match candidates to your specific tech stack requirements during the sourcing phase.",
      },
      {
        question: "How quickly can a software engineer start working with my team?",
        answer:
          "Most placements are ready to begin within 2-3 weeks from your initial request. We maintain a pre-vetted talent pool that allows us to present qualified candidates within 5 business days for most technology stacks.",
      },
      {
        question: "Can your engineers work in our existing development workflow?",
        answer:
          "Absolutely. Our engineers are experienced with Agile, Scrum, and Kanban methodologies. They integrate into your existing tools including Jira, GitHub, GitLab, Slack, and any other platforms your team uses on a daily basis.",
      },
      {
        question: "What happens if the engineer is not a good fit?",
        answer:
          "We offer a 30-day satisfaction guarantee. If the engineer does not meet your expectations within the first month, we will provide a replacement at no additional cost. Our goal is a long-term, successful engagement.",
      },
      {
        question: "Do you handle intellectual property agreements?",
        answer:
          "Yes. All engineers sign comprehensive IP assignment and NDA agreements before starting any engagement. Your code, data, and proprietary information remain fully protected under our standard service agreement.",
      },
    ],
  },
  {
    slug: "frontend-developers",
    title: "Hire Frontend Developers",
    shortTitle: "Frontend Developers",
    category: "Engineering",
    description:
      "Craft exceptional user interfaces with skilled frontend developers who bring pixel-perfect designs to life. Our developers specialize in modern frameworks like React, Vue, and Angular, delivering fast, accessible, and responsive web applications.",
    heroDescription:
      "Elevate your digital product with frontend developers from Latin America who combine technical precision with design sensibility. Get responsive, performant interfaces built by experts in your time zone.",
    whyHire: [
      "Ship polished user interfaces faster with developers who specialize in component-driven architecture and modern CSS.",
      "Improve Core Web Vitals and page performance with engineers trained in optimization techniques and lazy loading strategies.",
      "Ensure accessibility compliance (WCAG 2.1) across your web applications with developers experienced in inclusive design patterns.",
      "Reduce frontend development costs by 40-60% without compromising on code quality or user experience standards.",
      "Get developers who bridge the gap between design and engineering, translating Figma mockups into production-ready components.",
    ],
    advantages: [
      "Candidates are assessed on real-world frontend challenges including responsive layouts, state management, and API integration.",
      "Our developers stay current with the latest framework releases, build tools, and web platform features.",
      "SMarDevs provides ongoing professional development resources to keep your frontend talent at the cutting edge.",
      "We source developers with strong design sensibility who can collaborate effectively with UI/UX teams.",
      "Flexible engagement models allow you to hire for a specific project sprint or an ongoing product team.",
      "All administrative burden including payroll, equipment, and compliance is handled by SMarDevs.",
    ],
    levels: [
      {
        name: "Junior",
        experience: "1-2 years",
        skills: [
          "Solid foundation in HTML5, CSS3, and modern JavaScript (ES6+)",
          "Experience with one major framework (React, Vue, or Angular)",
          "Basic understanding of responsive design and mobile-first development",
          "Familiarity with CSS preprocessors (Sass/LESS) or CSS-in-JS solutions",
          "Ability to consume RESTful APIs and manage component state",
        ],
        typicalSalaryUS: 6500,
        typicalSalaryLATAM: 3000,
      },
      {
        name: "Mid-Level",
        experience: "3-5 years",
        skills: [
          "Advanced proficiency with React (hooks, context, Redux/Zustand) or equivalent framework expertise",
          "Experience with TypeScript in production applications and strong typing patterns",
          "Knowledge of build tools (Vite, Webpack), bundling optimization, and tree-shaking techniques",
          "Understanding of web accessibility standards and semantic HTML practices",
          "Experience with frontend testing using Jest, React Testing Library, or Cypress",
        ],
        typicalSalaryUS: 10000,
        typicalSalaryLATAM: 5500,
      },
      {
        name: "Senior",
        experience: "6+ years",
        skills: [
          "Expert in frontend architecture including micro-frontends, design systems, and monorepo management",
          "Deep experience with server-side rendering (Next.js, Nuxt) and performance optimization at scale",
          "Ability to establish coding standards, review processes, and technical documentation for frontend teams",
          "Proficient in complex state management, real-time data handling, and offline-first strategies",
          "Experience leading frontend teams and mentoring developers across multiple projects",
        ],
        typicalSalaryUS: 14000,
        typicalSalaryLATAM: 8500,
      },
    ],
    hiringProcess: [
      "Requirements gathering call to define your frontend stack, design workflow, and team structure.",
      "Curated shortlist of pre-vetted frontend developers matched to your framework and tooling preferences.",
      "Technical challenge involving a practical UI implementation task assessed for code quality and design fidelity.",
      "Live pair-programming session with your team to evaluate real-time problem-solving and communication.",
      "Final interview focused on culture fit, work style, and long-term collaboration potential.",
      "Onboarding coordination including design tool access, component library walkthrough, and team introductions.",
    ],
    faqs: [
      {
        question: "Do your frontend developers have experience with design tools like Figma?",
        answer:
          "Yes, the majority of our frontend developers are proficient in Figma, Sketch, or Adobe XD. They can translate design specifications directly into pixel-perfect components and collaborate effectively with design teams on handoff workflows.",
      },
      {
        question: "Can your developers work with our existing design system?",
        answer:
          "Absolutely. Our developers have experience working with established design systems and component libraries including Material UI, Tailwind CSS, Chakra UI, and custom design tokens. They can contribute to and extend your existing system.",
      },
      {
        question: "How do you assess frontend technical skills?",
        answer:
          "We use a multi-stage process that includes a take-home UI implementation challenge, a live coding session focused on component architecture and state management, and a code review exercise to evaluate their approach to maintainability and performance.",
      },
      {
        question: "Do your frontend developers write tests?",
        answer:
          "Yes. All of our mid-level and senior frontend developers are experienced with unit testing (Jest, Vitest), integration testing (React Testing Library), and end-to-end testing (Cypress, Playwright). Testing is a core expectation in all our placements.",
      },
      {
        question: "Can you provide frontend developers experienced in mobile development?",
        answer:
          "Yes, we have developers skilled in React Native and Flutter for cross-platform mobile development, as well as specialists in progressive web applications. Let us know your mobile requirements and we will match accordingly.",
      },
    ],
  },
  {
    slug: "backend-developers",
    title: "Hire Backend Developers",
    shortTitle: "Backend Developers",
    category: "Engineering",
    description:
      "Power your applications with robust backend systems designed and built by experienced developers. Our backend engineers specialize in building APIs, microservices, and data pipelines that handle millions of requests with reliability and security.",
    heroDescription:
      "Get backend developers from Latin America who architect and build the server-side systems that drive your business. From high-throughput APIs to complex data processing, our engineers deliver scalable infrastructure at competitive rates.",
    whyHire: [
      "Build robust, secure APIs and services that scale with your user base without costly re-architecture projects.",
      "Leverage deep expertise in database design, caching strategies, and message queuing for high-performance systems.",
      "Reduce backend development costs by 40-60% while accessing engineers with experience at enterprise-scale companies.",
      "Accelerate delivery with developers experienced in event-driven architecture, CQRS, and domain-driven design.",
      "Get engineers who understand security best practices including authentication, authorization, and data encryption.",
    ],
    advantages: [
      "Rigorous backend-specific assessments evaluate system design thinking, database expertise, and API architecture skills.",
      "Our talent pool includes engineers experienced with both monolithic and microservices architectures.",
      "SMarDevs matches candidates based on your specific infrastructure stack, whether that is AWS, GCP, or Azure.",
      "We prioritize developers with strong DevOps awareness who can own their services end-to-end.",
      "Dedicated account management ensures your backend team stays aligned with evolving technical requirements.",
      "Seamless scaling allows you to add specialized backend roles like database engineers or platform engineers as needed.",
    ],
    levels: [
      {
        name: "Junior",
        experience: "1-2 years",
        skills: [
          "Proficiency in at least one backend language (Node.js, Python, Java, or Go)",
          "Understanding of RESTful API design principles and HTTP protocol fundamentals",
          "Basic knowledge of relational databases (PostgreSQL, MySQL) and ORM frameworks",
          "Familiarity with authentication mechanisms (JWT, OAuth2) and session management",
          "Experience with version control, basic debugging, and log analysis",
        ],
        typicalSalaryUS: 7000,
        typicalSalaryLATAM: 3200,
      },
      {
        name: "Mid-Level",
        experience: "3-5 years",
        skills: [
          "Strong experience with API design, versioning, and documentation (OpenAPI/Swagger)",
          "Proficiency with both SQL and NoSQL databases and knowledge of when to apply each",
          "Experience with message brokers (RabbitMQ, Kafka) and asynchronous processing patterns",
          "Understanding of containerization with Docker and orchestration fundamentals",
          "Ability to implement caching strategies (Redis, Memcached) and optimize database queries",
        ],
        typicalSalaryUS: 11000,
        typicalSalaryLATAM: 5800,
      },
      {
        name: "Senior",
        experience: "6+ years",
        skills: [
          "Expert-level system design skills including distributed systems, fault tolerance, and horizontal scaling",
          "Deep knowledge of database internals, indexing strategies, and query optimization at scale",
          "Experience architecting microservices ecosystems with service mesh, API gateways, and observability tooling",
          "Proven track record of migrating legacy systems to modern architectures with minimal downtime",
          "Ability to define backend engineering standards, conduct architecture reviews, and mentor development teams",
        ],
        typicalSalaryUS: 15000,
        typicalSalaryLATAM: 8800,
      },
    ],
    hiringProcess: [
      "Technical requirements analysis to map your backend architecture, data stores, and integration landscape.",
      "Targeted candidate search from our pre-vetted pool, filtered by language, framework, and infrastructure expertise.",
      "System design assessment where candidates architect a solution for a real-world scalability challenge.",
      "Live technical interview covering API design, database modeling, and production incident scenarios.",
      "Team compatibility interview to evaluate collaboration skills and communication style.",
      "Onboarding support with infrastructure access, codebase orientation, and architecture documentation review.",
    ],
    faqs: [
      {
        question: "What backend technologies do your developers work with?",
        answer:
          "Our backend developers have production experience with Node.js, Python (Django, FastAPI, Flask), Java (Spring Boot), Go, Ruby on Rails, and .NET. We also have specialists in GraphQL, gRPC, and real-time communication protocols like WebSockets.",
      },
      {
        question: "Can your backend developers handle database architecture?",
        answer:
          "Yes. Our mid-level and senior developers are experienced in relational database design (PostgreSQL, MySQL), NoSQL solutions (MongoDB, DynamoDB, Cassandra), and specialized data stores like Redis, Elasticsearch, and time-series databases.",
      },
      {
        question: "How do you ensure code security for backend systems?",
        answer:
          "All our backend engineers are trained in OWASP security best practices. Senior developers bring experience with security auditing, penetration testing awareness, input validation, encryption at rest and in transit, and secure API gateway configurations.",
      },
      {
        question: "Do your developers have experience with high-traffic systems?",
        answer:
          "Many of our senior backend engineers have built and maintained systems handling millions of daily requests. They bring expertise in load balancing, horizontal scaling, database sharding, and CDN integration for high-throughput environments.",
      },
      {
        question: "Can backend developers also handle DevOps responsibilities?",
        answer:
          "While we have dedicated DevOps engineers available, many of our backend developers have strong DevOps competencies including CI/CD pipeline management, infrastructure as code with Terraform, and container orchestration with Kubernetes.",
      },
    ],
  },
  {
    slug: "fullstack-developers",
    title: "Hire Full Stack Developers",
    shortTitle: "Full Stack Developers",
    category: "Engineering",
    description:
      "Get versatile developers who own features end-to-end, from database schema to polished user interface. Our full stack developers reduce coordination overhead and accelerate delivery by bridging frontend and backend with a unified technical vision.",
    heroDescription:
      "Hire full stack developers from Latin America who deliver complete features across your entire application stack. Reduce team dependencies and ship faster with engineers who think holistically about your product.",
    whyHire: [
      "Reduce coordination overhead by having a single developer own a feature from API design through to frontend implementation.",
      "Accelerate MVP and prototype development with engineers who can build complete, functional applications independently.",
      "Gain flexibility to allocate developer effort across frontend or backend as project priorities shift week to week.",
      "Lower your total team size requirements by hiring versatile engineers who contribute meaningfully across the stack.",
      "Get developers who understand the full request lifecycle, leading to better API contracts and more efficient data flows.",
    ],
    advantages: [
      "Our full stack vetting evaluates both frontend and backend skills with equal rigor, not just surface-level familiarity.",
      "Candidates demonstrate proficiency through a full-feature implementation challenge covering UI, API, and data layers.",
      "SMarDevs sources full stack developers with genuine depth in both areas, not just developers who dabble in each.",
      "We match developers to your specific stack combination, whether that is React plus Node.js, Vue plus Python, or Angular plus Java.",
      "Flexible engagement models support both product team integration and independent feature delivery.",
      "All operational logistics including payroll, equipment, and legal compliance are managed by SMarDevs.",
    ],
    levels: [
      {
        name: "Junior",
        experience: "1-2 years",
        skills: [
          "Working knowledge of a frontend framework (React, Vue, or Angular) and a backend runtime (Node.js, Python, or Java)",
          "Ability to build CRUD applications with database integration and basic authentication",
          "Understanding of HTTP, REST APIs, and client-server communication patterns",
          "Familiarity with Git workflows, basic deployment processes, and development environments",
          "Exposure to relational databases and basic query writing",
        ],
        typicalSalaryUS: 7000,
        typicalSalaryLATAM: 3300,
      },
      {
        name: "Mid-Level",
        experience: "3-5 years",
        skills: [
          "Strong proficiency in a modern frontend framework paired with a backend language in production environments",
          "Experience with database design, ORM frameworks, and query optimization for application performance",
          "Knowledge of authentication systems (OAuth2, JWT), role-based access control, and session management",
          "Ability to set up CI/CD pipelines, write automated tests across the stack, and manage deployments",
          "Understanding of application security, input validation, and secure coding practices",
        ],
        typicalSalaryUS: 11500,
        typicalSalaryLATAM: 6000,
      },
      {
        name: "Senior",
        experience: "6+ years",
        skills: [
          "Ability to architect complete applications from infrastructure through to frontend, making sound trade-off decisions",
          "Deep expertise in at least two full stack combinations with production-scale experience in each",
          "Experience with server-side rendering, static site generation, and hybrid rendering strategies",
          "Proficiency in performance optimization across the full stack including database tuning, API caching, and bundle optimization",
          "Proven ability to lead small teams, define technical standards, and drive architectural decisions across projects",
        ],
        typicalSalaryUS: 15500,
        typicalSalaryLATAM: 9000,
      },
    ],
    hiringProcess: [
      "Intake session to understand your application architecture, tech stack, and the balance of frontend versus backend work.",
      "Curated shortlist of candidates with verified depth in both your frontend and backend technologies.",
      "Full stack implementation challenge requiring candidates to build a working feature with UI, API, and data persistence.",
      "Technical deep-dive interview covering architecture decisions, trade-offs, and real-world problem-solving.",
      "Culture and collaboration interview with your engineering team.",
      "Structured onboarding with codebase walkthroughs, tool provisioning, and sprint integration.",
    ],
    faqs: [
      {
        question: "How do you verify that full stack developers are genuinely strong in both areas?",
        answer:
          "Our assessment requires candidates to build a complete feature spanning frontend, backend, and database layers. We evaluate each layer independently against the same standards we use for specialist roles, ensuring genuine depth rather than surface familiarity.",
      },
      {
        question: "Should I hire full stack developers or separate frontend and backend specialists?",
        answer:
          "Full stack developers are ideal for smaller teams, startups, and projects where reducing coordination overhead matters. For large-scale applications with complex frontend or backend requirements, specialists may be more effective. We can help you determine the right mix during our discovery call.",
      },
      {
        question: "What tech stack combinations are most common among your full stack developers?",
        answer:
          "The most common combinations in our pool are React with Node.js/Express, React with Python/Django, Vue with Node.js, and Angular with Java/Spring Boot. We also have developers experienced with Next.js, Nuxt, and other full stack frameworks.",
      },
      {
        question: "Can full stack developers handle mobile development as well?",
        answer:
          "Some of our full stack developers also have experience with React Native or Flutter. If cross-platform mobile development is a requirement, we can filter specifically for candidates with that additional expertise.",
      },
      {
        question: "How do full stack developers handle context switching between frontend and backend?",
        answer:
          "Our developers are experienced in managing work across the stack within sprint cycles. They typically work on related frontend and backend tasks for the same feature, which actually reduces context switching compared to handoffs between separate specialists.",
      },
    ],
  },
  {
    slug: "qa-engineers",
    title: "Hire QA Engineers",
    shortTitle: "QA Engineers",
    category: "Quality Assurance",
    description:
      "Protect your product quality with meticulous QA engineers who design comprehensive test strategies and catch defects before they reach your users. Our QA professionals bring structured, methodical approaches to manual and exploratory testing.",
    heroDescription:
      "Strengthen your release confidence with QA engineers from Latin America who bring systematic testing expertise and a sharp eye for detail. Catch bugs earlier, reduce regressions, and ship with confidence.",
    whyHire: [
      "Reduce production defects by up to 60% with engineers who design comprehensive test plans covering functional, regression, and edge-case scenarios.",
      "Improve release cadence by having dedicated QA resources who can validate features in parallel with development work.",
      "Get QA engineers who think critically about user workflows, data integrity, and cross-browser compatibility from day one.",
      "Save 40-60% compared to US-based QA hires while getting engineers with experience in enterprise software testing.",
      "Ensure compliance and regulatory adherence with testers experienced in documenting test evidence and audit trails.",
    ],
    advantages: [
      "Our QA candidates are assessed through realistic testing scenarios that evaluate their ability to identify edge cases and write clear bug reports.",
      "SMarDevs sources QA engineers who understand the full software development lifecycle and can contribute during requirements and design phases.",
      "We match QA engineers based on your domain, whether that is fintech, healthcare, e-commerce, or SaaS platforms.",
      "All QA placements come with strong communication skills critical for effective bug reporting and cross-team collaboration.",
      "Flexible engagement allows you to scale QA capacity for major releases and reduce during lighter development periods.",
      "We handle all employment logistics so your QA team can focus entirely on quality assurance.",
    ],
    levels: [
      {
        name: "Junior",
        experience: "1-2 years",
        skills: [
          "Strong understanding of software testing fundamentals including test case design and bug lifecycle management",
          "Experience with manual testing across web and mobile platforms",
          "Ability to write clear, detailed bug reports with reproducible steps and supporting evidence",
          "Familiarity with test management tools (TestRail, Zephyr, or similar)",
          "Basic understanding of SQL for data validation and backend testing",
        ],
        typicalSalaryUS: 6800,
        typicalSalaryLATAM: 2500,
      },
      {
        name: "Mid-Level",
        experience: "3-5 years",
        skills: [
          "Expertise in designing test strategies including risk-based testing prioritization and regression test suite management",
          "Strong exploratory testing skills with the ability to identify non-obvious defects and edge cases",
          "Experience with API testing tools (Postman, Insomnia) and database validation techniques",
          "Knowledge of performance testing concepts and basic load testing with tools like JMeter or k6",
          "Ability to collaborate with product managers and developers to refine acceptance criteria and testability",
        ],
        typicalSalaryUS: 8500,
        typicalSalaryLATAM: 4500,
      },
      {
        name: "Senior",
        experience: "6+ years",
        skills: [
          "Ability to define and implement QA processes, testing frameworks, and quality metrics for engineering organizations",
          "Expertise in test strategy for complex systems including microservices, distributed architectures, and third-party integrations",
          "Strong analytical skills for root cause analysis, defect pattern identification, and process improvement",
          "Experience leading QA teams, conducting test plan reviews, and reporting quality status to stakeholders",
          "Knowledge of compliance testing requirements for regulated industries such as healthcare or financial services",
        ],
        typicalSalaryUS: 12000,
        typicalSalaryLATAM: 7000,
      },
    ],
    hiringProcess: [
      "Requirements discussion to understand your product domain, testing needs, and quality goals.",
      "Candidate selection from our vetted QA talent pool, filtered by domain experience and testing methodology.",
      "Practical testing assessment where candidates identify defects in a sample application and write detailed test reports.",
      "Interview focused on test strategy, communication, and their approach to balancing thoroughness with delivery speed.",
      "Team compatibility session with developers and product managers to evaluate collaboration style.",
      "Onboarding with product walkthroughs, test environment access, and introduction to your release process.",
    ],
    faqs: [
      {
        question: "What is the difference between QA engineers and QA automation engineers?",
        answer:
          "QA engineers focus on manual testing, exploratory testing, and test strategy design. QA automation engineers specialize in writing automated test scripts and building test frameworks. Many teams benefit from having both, and we can help you determine the right balance.",
      },
      {
        question: "Can QA engineers participate in Agile ceremonies?",
        answer:
          "Absolutely. Our QA engineers are experienced with Agile and Scrum methodologies. They actively participate in sprint planning to assess testability, provide effort estimates for QA tasks, and contribute to retrospectives with quality insights.",
      },
      {
        question: "Do your QA engineers have domain-specific experience?",
        answer:
          "Yes, we have QA engineers with deep experience in fintech, healthcare, e-commerce, SaaS, logistics, and education technology. We match candidates based on your industry requirements to reduce ramp-up time.",
      },
      {
        question: "How do QA engineers integrate with development teams?",
        answer:
          "Our QA engineers work embedded within your development team. They review requirements and designs early, write test cases in parallel with development, and validate features as they are completed within each sprint.",
      },
      {
        question: "What testing tools do your QA engineers use?",
        answer:
          "Our engineers are proficient with industry-standard tools including TestRail, Zephyr, qTest for test management; Jira and Linear for defect tracking; Postman for API testing; BrowserStack for cross-browser testing; and Charles Proxy for network analysis.",
      },
    ],
  },
  {
    slug: "qa-automation-engineers",
    title: "Hire QA Automation Engineers",
    shortTitle: "QA Automation Engineers",
    category: "Quality Assurance",
    description:
      "Accelerate your testing pipeline with automation engineers who build reliable, maintainable test suites. Our QA automation specialists design frameworks that catch regressions early, reduce manual testing effort, and enable confident continuous deployment.",
    heroDescription:
      "Scale your testing capacity with QA automation engineers from Latin America who build robust test frameworks and CI-integrated suites. Ship faster with automated regression coverage and reliable release pipelines.",
    whyHire: [
      "Reduce regression testing time by up to 80% by automating repetitive test scenarios across your application.",
      "Enable continuous deployment confidence with automated test suites integrated directly into your CI/CD pipeline.",
      "Free your manual QA team to focus on exploratory testing and complex scenarios while automation handles the regression suite.",
      "Catch defects earlier in the development cycle with shift-left testing strategies and pre-merge automated validation.",
      "Save 40-60% compared to US-based automation engineers while getting experts in modern test frameworks and tools.",
    ],
    advantages: [
      "Automation candidates are assessed through framework design challenges and practical test scripting exercises.",
      "Our engineers have experience building test automation from the ground up as well as extending existing frameworks.",
      "SMarDevs matches automation engineers based on your specific framework needs, whether Selenium, Cypress, Playwright, or Appium.",
      "We source engineers who write maintainable, well-structured test code that follows the same engineering standards as production code.",
      "Flexible engagement models support both dedicated automation roles and hybrid QA positions.",
      "All employment logistics, compliance, and equipment provisioning are handled by SMarDevs.",
    ],
    levels: [
      {
        name: "Junior",
        experience: "1-2 years",
        skills: [
          "Proficiency in at least one programming language (JavaScript, Python, Java) for test scripting",
          "Experience with one automation framework (Selenium, Cypress, or Playwright)",
          "Understanding of page object model and basic test design patterns for maintainable test code",
          "Ability to write and maintain automated tests for web applications including form interactions and navigation flows",
          "Familiarity with Git and basic CI/CD concepts for test execution",
        ],
        typicalSalaryUS: 6500,
        typicalSalaryLATAM: 3000,
      },
      {
        name: "Mid-Level",
        experience: "3-5 years",
        skills: [
          "Strong expertise in multiple automation frameworks with the ability to select the right tool for each testing need",
          "Experience designing test automation architecture including reporting, parallel execution, and data-driven testing",
          "Proficiency in API test automation using tools like RestAssured, Supertest, or custom HTTP clients",
          "Knowledge of CI/CD integration for automated test execution with tools like Jenkins, GitHub Actions, or GitLab CI",
          "Ability to implement visual regression testing and cross-browser test strategies",
        ],
        typicalSalaryUS: 10000,
        typicalSalaryLATAM: 5500,
      },
      {
        name: "Senior",
        experience: "6+ years",
        skills: [
          "Expert in designing and implementing enterprise-grade test automation frameworks from scratch",
          "Deep knowledge of test infrastructure including containerized test environments, test data management, and parallel execution at scale",
          "Experience with performance testing automation using tools like k6, Gatling, or Artillery",
          "Ability to define automation strategy, set coverage targets, and measure ROI of test automation investments",
          "Proven track record of mentoring automation teams and establishing testing best practices across organizations",
        ],
        typicalSalaryUS: 13500,
        typicalSalaryLATAM: 8000,
      },
    ],
    hiringProcess: [
      "Technical discovery to understand your current test coverage, automation stack, and quality engineering goals.",
      "Targeted candidate sourcing filtered by framework expertise, programming language, and domain experience.",
      "Practical automation challenge requiring candidates to design a test framework and write automated tests for a sample application.",
      "Technical interview covering test architecture decisions, CI/CD integration strategies, and maintenance approaches.",
      "Collaboration interview with your QA and development team members.",
      "Onboarding with test infrastructure access, framework documentation review, and existing test suite walkthrough.",
    ],
    faqs: [
      {
        question: "Which test automation frameworks do your engineers specialize in?",
        answer:
          "Our automation engineers have expertise across all major frameworks including Cypress, Playwright, Selenium WebDriver, Appium for mobile, RestAssured for API testing, and k6 or Gatling for performance testing. We match candidates to your existing or preferred toolchain.",
      },
      {
        question: "Can your automation engineers build a test framework from scratch?",
        answer:
          "Yes. Our mid-level and senior automation engineers are experienced in designing test frameworks including project structure, reporting integration, parallel execution configuration, data management utilities, and CI/CD pipeline integration.",
      },
      {
        question: "How do automation engineers handle flaky tests?",
        answer:
          "Our engineers apply proven strategies to minimize test flakiness including proper wait strategies, test isolation, stable selectors, retry mechanisms with logging, and regular maintenance cycles. They also implement test stability monitoring to catch flakiness trends early.",
      },
      {
        question: "Do your automation engineers also do manual testing?",
        answer:
          "Many of our automation engineers have manual testing backgrounds and can perform exploratory testing when needed. However, for dedicated manual testing capacity, we recommend pairing them with a manual QA engineer for optimal coverage.",
      },
      {
        question: "How do you measure the effectiveness of test automation?",
        answer:
          "Our engineers track key metrics including test coverage percentage, defect escape rate, test execution time, test pass rate trends, and automation ROI compared to manual testing effort. They set up dashboards and reporting to give your team visibility into these metrics.",
      },
    ],
  },
  {
    slug: "devops-engineers",
    title: "Hire DevOps Engineers",
    shortTitle: "DevOps Engineers",
    category: "Engineering",
    description:
      "Streamline your development pipeline and infrastructure with DevOps engineers who automate deployments, optimize cloud costs, and ensure system reliability. Our engineers bring deep expertise in CI/CD, container orchestration, and infrastructure as code.",
    heroDescription:
      "Optimize your infrastructure and deployment pipelines with DevOps engineers from Latin America. From CI/CD automation to Kubernetes orchestration, our engineers keep your systems reliable and your teams shipping fast.",
    whyHire: [
      "Reduce deployment time from hours to minutes with automated CI/CD pipelines and infrastructure-as-code practices.",
      "Cut cloud infrastructure costs by 20-40% through right-sizing, reserved capacity planning, and automated resource management.",
      "Improve system reliability with monitoring, alerting, and incident response automation that reduces mean time to recovery.",
      "Enable your development team to ship independently with self-service deployment tools and well-documented runbooks.",
      "Save 40-60% compared to US-based DevOps engineers while accessing professionals experienced with enterprise-scale infrastructure.",
    ],
    advantages: [
      "DevOps candidates are assessed through real-world infrastructure challenges including architecture design and troubleshooting scenarios.",
      "Our engineers hold relevant cloud certifications (AWS, GCP, Azure) and demonstrate hands-on production experience.",
      "SMarDevs matches engineers to your specific cloud provider, toolchain, and infrastructure complexity level.",
      "We source engineers who balance automation with pragmatism, implementing solutions that match your team's maturity level.",
      "Flexible engagement supports both dedicated DevOps roles and fractional infrastructure support for smaller teams.",
      "All employment and operational logistics are fully managed by SMarDevs.",
    ],
    levels: [
      {
        name: "Junior",
        experience: "1-2 years",
        skills: [
          "Familiarity with Linux systems administration and shell scripting (Bash, Python)",
          "Basic experience with one major cloud provider (AWS, GCP, or Azure) and core services",
          "Understanding of CI/CD concepts and experience with at least one pipeline tool (GitHub Actions, Jenkins, GitLab CI)",
          "Knowledge of containerization with Docker including image building and container management",
          "Basic understanding of networking concepts, DNS, and load balancing",
        ],
        typicalSalaryUS: 7500,
        typicalSalaryLATAM: 3500,
      },
      {
        name: "Mid-Level",
        experience: "3-5 years",
        skills: [
          "Strong experience with infrastructure as code using Terraform, CloudFormation, or Pulumi",
          "Proficiency in container orchestration with Kubernetes including deployment strategies and resource management",
          "Experience implementing comprehensive monitoring and observability stacks (Prometheus, Grafana, Datadog, or similar)",
          "Knowledge of secrets management, IAM policies, and cloud security best practices",
          "Ability to design and maintain multi-environment deployment pipelines with proper promotion workflows",
        ],
        typicalSalaryUS: 12000,
        typicalSalaryLATAM: 6500,
      },
      {
        name: "Senior",
        experience: "6+ years",
        skills: [
          "Expert in designing highly available, fault-tolerant cloud architectures across multiple regions and availability zones",
          "Deep experience with platform engineering including internal developer platforms, service catalogs, and golden paths",
          "Advanced Kubernetes expertise including custom operators, service mesh (Istio, Linkerd), and cluster management at scale",
          "Proven ability to lead cloud migration projects, define infrastructure standards, and drive cost optimization initiatives",
          "Experience with site reliability engineering practices including SLO definition, error budgets, and capacity planning",
        ],
        typicalSalaryUS: 16500,
        typicalSalaryLATAM: 9500,
      },
    ],
    hiringProcess: [
      "Infrastructure assessment call to understand your current setup, cloud provider, toolchain, and pain points.",
      "Candidate matching from our vetted pool of DevOps professionals, filtered by cloud expertise and tooling experience.",
      "Technical challenge involving infrastructure design, automation scripting, and troubleshooting a simulated production issue.",
      "Live technical interview covering architecture decisions, security considerations, and cost optimization strategies.",
      "Team interview to evaluate communication, documentation habits, and on-call readiness.",
      "Onboarding with infrastructure access provisioning, runbook review, and monitoring dashboard orientation.",
    ],
    faqs: [
      {
        question: "Which cloud platforms do your DevOps engineers specialize in?",
        answer:
          "We have DevOps engineers with deep expertise in AWS, Google Cloud Platform, and Microsoft Azure. Many of our senior engineers hold professional-level certifications and have experience managing multi-cloud environments.",
      },
      {
        question: "Can your DevOps engineers participate in on-call rotations?",
        answer:
          "Yes. Our DevOps engineers located in Latin America can cover on-call rotations during US business hours and extended coverage windows. We can structure schedules that complement your existing on-call team for broader time zone coverage.",
      },
      {
        question: "Do your engineers have experience with Kubernetes in production?",
        answer:
          "Absolutely. Our mid-level and senior DevOps engineers have hands-on experience managing production Kubernetes clusters, including EKS, GKE, and AKS. They handle deployment strategies, autoscaling, monitoring, and cluster upgrades.",
      },
      {
        question: "Can DevOps engineers help with cloud cost optimization?",
        answer:
          "Yes, cost optimization is a key skill we evaluate. Our engineers analyze cloud spending patterns, implement right-sizing recommendations, configure auto-scaling policies, leverage reserved instances, and set up cost monitoring alerts to keep your infrastructure spend efficient.",
      },
      {
        question: "How do DevOps engineers handle infrastructure documentation?",
        answer:
          "Our engineers maintain infrastructure documentation as part of their standard workflow. This includes architecture diagrams, runbooks for common operations, incident response procedures, and README files for all infrastructure-as-code repositories.",
      },
    ],
  },
  {
    slug: "ui-ux-designers",
    title: "Hire UI/UX Designers",
    shortTitle: "UI/UX Designers",
    category: "Design",
    description:
      "Create intuitive, visually compelling digital products with UI/UX designers who combine user research insights with polished visual design. Our designers deliver experiences that drive user engagement, reduce support burden, and increase conversion rates.",
    heroDescription:
      "Transform your product experience with UI/UX designers from Latin America who blend user-centered research with stunning visual execution. Get designs that delight users and drive measurable business outcomes.",
    whyHire: [
      "Increase user engagement and conversion rates with designs informed by research, usability testing, and data-driven iteration.",
      "Reduce development rework by delivering well-documented, developer-friendly design specifications and interactive prototypes.",
      "Build a consistent brand experience across all touchpoints with designers experienced in creating and maintaining design systems.",
      "Save 40-60% compared to US-based designers while accessing talent trained at top design programs and experienced at leading companies.",
      "Bridge the gap between business goals and user needs with designers who think strategically about product outcomes.",
    ],
    advantages: [
      "Design candidates are evaluated through portfolio review, a practical design challenge, and a live critique session.",
      "Our designers are proficient in industry-standard tools including Figma, Sketch, Adobe Creative Suite, and prototyping tools.",
      "SMarDevs sources designers who understand responsive design, accessibility standards, and cross-platform design patterns.",
      "We match designers based on your product domain to reduce context-building time and leverage relevant design patterns.",
      "Flexible engagement supports embedded product team roles, project-based design sprints, and ongoing design system maintenance.",
      "All employment logistics and equipment provisioning are managed by SMarDevs.",
    ],
    levels: [
      {
        name: "Junior",
        experience: "1-2 years",
        skills: [
          "Proficiency in Figma including component creation, auto-layout, and basic prototyping",
          "Understanding of UI design principles including typography, color theory, spacing, and visual hierarchy",
          "Ability to create wireframes and low-fidelity mockups based on product requirements",
          "Basic knowledge of responsive design patterns for web and mobile applications",
          "Familiarity with design handoff processes and developer collaboration workflows",
        ],
        typicalSalaryUS: 6000,
        typicalSalaryLATAM: 2800,
      },
      {
        name: "Mid-Level",
        experience: "3-5 years",
        skills: [
          "Strong UX design skills including user journey mapping, information architecture, and interaction design",
          "Experience conducting user research including interviews, usability tests, and survey analysis",
          "Ability to create and maintain component libraries and contribute to design system governance",
          "Proficiency in creating interactive prototypes for user testing and stakeholder presentations",
          "Understanding of accessibility standards (WCAG 2.1) and inclusive design principles",
        ],
        typicalSalaryUS: 9500,
        typicalSalaryLATAM: 5000,
      },
      {
        name: "Senior",
        experience: "6+ years",
        skills: [
          "Expert in leading end-to-end product design from discovery research through to design system implementation",
          "Deep experience with design strategy including design thinking workshops, product vision alignment, and roadmap influence",
          "Ability to establish and scale design systems across multiple product teams and platforms",
          "Proven track record of measurably improving key product metrics through design interventions",
          "Experience mentoring design teams and establishing design review processes and quality standards",
        ],
        typicalSalaryUS: 13500,
        typicalSalaryLATAM: 8000,
      },
    ],
    hiringProcess: [
      "Product and design requirements discussion to understand your brand, users, and current design maturity.",
      "Portfolio-matched candidate shortlist based on product domain, design style, and tooling preferences.",
      "Design challenge requiring candidates to solve a realistic product design problem with research and visual deliverables.",
      "Portfolio deep-dive and design critique session with your product and design leadership.",
      "Collaboration interview with product managers and developers to assess communication and handoff practices.",
      "Onboarding with brand guidelines review, design system access, and product discovery sessions.",
    ],
    faqs: [
      {
        question: "Do your designers handle both UI and UX, or should I hire separately?",
        answer:
          "Most of our designers are skilled in both UI and UX. For early-stage products, a combined UI/UX designer is usually sufficient. For mature products with complex user research needs, you may benefit from separate UX researcher and UI designer roles. We can advise based on your situation.",
      },
      {
        question: "What design tools do your designers use?",
        answer:
          "Figma is the primary tool for most of our designers, including design, prototyping, and handoff. Many are also proficient in Sketch, Adobe XD, Framer, Principle, and Adobe Creative Suite for illustration and visual design work.",
      },
      {
        question: "Can your designers work directly with our development team?",
        answer:
          "Absolutely. Our designers are experienced in developer collaboration workflows. They create dev-ready specifications in Figma, use proper naming conventions and auto-layout for clean handoff, and regularly communicate with developers to resolve implementation questions.",
      },
      {
        question: "Do your designers conduct user research?",
        answer:
          "Our mid-level and senior designers are skilled in qualitative and quantitative research methods including user interviews, usability testing, A/B test analysis, heatmap review, and survey design. They can lead research initiatives or collaborate with dedicated researchers on your team.",
      },
      {
        question: "Can designers help establish a design system?",
        answer:
          "Yes. Our senior designers have experience creating design systems from the ground up, including token architecture, component libraries, documentation, and governance processes. They can also extend and improve existing design systems.",
      },
    ],
  },
  {
    slug: "project-managers",
    title: "Hire Project Managers",
    shortTitle: "Project Managers",
    category: "Management",
    description:
      "Keep your projects on track with experienced project managers who bring structure, transparency, and accountability to software delivery. Our PMs coordinate cross-functional teams, manage stakeholder expectations, and ensure consistent on-time delivery.",
    heroDescription:
      "Drive predictable software delivery with project managers from Latin America who bring Agile expertise and strong communication skills. Get the organizational leadership your distributed team needs to deliver on time and on budget.",
    whyHire: [
      "Improve on-time delivery rates by having a dedicated professional managing timelines, dependencies, and risk mitigation across your projects.",
      "Free your engineering leads from coordination overhead so they can focus on technical leadership and code quality.",
      "Gain clear visibility into project status with structured reporting, burn-down tracking, and stakeholder communication cadences.",
      "Reduce scope creep and budget overruns with proactive requirements management and change control processes.",
      "Save 40-60% compared to US-based project managers while accessing PMs experienced with distributed software teams.",
    ],
    advantages: [
      "PM candidates are evaluated through scenario-based assessments covering stakeholder management, risk mitigation, and team coordination.",
      "Our PMs are certified (PMP, CSM, or SAFe) and experienced with Agile, Scrum, and Kanban methodologies in software environments.",
      "SMarDevs sources PMs who understand the technical context of software development, not just general project management.",
      "We match PMs based on your team size, project complexity, and industry domain for faster ramp-up.",
      "Flexible engagement supports both full-time embedded PM roles and fractional PM support for multiple smaller projects.",
      "All employment logistics, compliance, and equipment are handled by SMarDevs.",
    ],
    levels: [
      {
        name: "Junior",
        experience: "1-2 years",
        skills: [
          "Understanding of Agile and Scrum methodologies with experience as a Scrum Master or assistant PM",
          "Proficiency with project management tools (Jira, Asana, Monday.com, or Linear)",
          "Ability to facilitate daily standups, track sprint progress, and maintain project documentation",
          "Basic stakeholder communication skills including status reporting and meeting facilitation",
          "Familiarity with software development lifecycle and common technical terminology",
        ],
        typicalSalaryUS: 6500,
        typicalSalaryLATAM: 3000,
      },
      {
        name: "Mid-Level",
        experience: "3-5 years",
        skills: [
          "Strong experience managing multiple concurrent software projects with cross-functional teams",
          "Expertise in sprint planning, backlog refinement, capacity planning, and velocity tracking",
          "Ability to identify and mitigate project risks before they become blockers",
          "Effective stakeholder management including executive reporting and expectation setting",
          "Experience with resource allocation, budget tracking, and scope management processes",
        ],
        typicalSalaryUS: 10000,
        typicalSalaryLATAM: 5200,
      },
      {
        name: "Senior",
        experience: "6+ years",
        skills: [
          "Proven track record of delivering complex software projects on time and within budget across distributed teams",
          "Expertise in program management including cross-project dependency coordination and portfolio-level reporting",
          "Ability to define and implement project management frameworks, tooling standards, and process improvements",
          "Strong strategic thinking skills for aligning project execution with business objectives and product roadmaps",
          "Experience leading and mentoring PM teams and driving organizational adoption of best practices",
        ],
        typicalSalaryUS: 14000,
        typicalSalaryLATAM: 8000,
      },
    ],
    hiringProcess: [
      "Project landscape discussion to understand your team structure, current processes, and PM role expectations.",
      "Curated candidate shortlist matched by domain experience, methodology expertise, and team size familiarity.",
      "Scenario-based assessment simulating sprint planning, stakeholder escalation, and risk management situations.",
      "Interview with engineering and product leadership to evaluate communication style and collaboration approach.",
      "Reference verification with previous clients or employers in similar project management roles.",
      "Onboarding with project tool access, team introductions, and current project status briefing.",
    ],
    faqs: [
      {
        question: "Do your project managers have technical backgrounds?",
        answer:
          "Many of our PMs have prior experience as developers or QA engineers before transitioning to project management. All of them have significant experience managing software development projects and understand technical concepts, sprint workflows, and engineering trade-offs.",
      },
      {
        question: "What methodologies do your project managers use?",
        answer:
          "Our PMs are experienced with Scrum, Kanban, SAFe, and hybrid Agile approaches. They adapt their methodology to your team's needs rather than imposing a rigid framework. Most hold certifications including CSM, PMP, or SAFe Agilist.",
      },
      {
        question: "Can a project manager handle multiple teams simultaneously?",
        answer:
          "Yes, our mid-level and senior PMs are experienced in managing multiple concurrent projects. For smaller teams or projects, a single PM can effectively coordinate two to three teams. For larger or more complex programs, we recommend a dedicated PM per team.",
      },
      {
        question: "How do project managers work with remote engineering teams?",
        answer:
          "Our PMs are experienced with distributed team management. They establish clear communication cadences, use asynchronous documentation practices, and leverage tools like Slack, Zoom, and Loom to keep everyone aligned across time zones.",
      },
      {
        question: "What reporting and visibility do project managers provide?",
        answer:
          "Our PMs deliver weekly status reports, sprint metrics dashboards, risk registers, and capacity forecasts. They customize reporting to your stakeholders' needs, from high-level executive summaries to detailed sprint-level breakdowns.",
      },
    ],
  },
  {
    slug: "business-analysts",
    title: "Hire Business Analysts",
    shortTitle: "Business Analysts",
    category: "Management",
    description:
      "Translate business objectives into clear, actionable requirements with experienced business analysts. Our BAs bridge the gap between stakeholders and development teams, ensuring that what gets built aligns precisely with what the business needs.",
    heroDescription:
      "Get business analysts from Latin America who transform complex business needs into clear technical requirements. Reduce rework, align stakeholders, and ensure your development team builds the right thing the first time.",
    whyHire: [
      "Reduce development rework by up to 40% with clear, well-documented requirements that leave no room for ambiguity.",
      "Align stakeholder expectations with technical feasibility early in the project lifecycle, preventing costly mid-sprint pivots.",
      "Accelerate discovery and requirements phases with BAs who use proven elicitation techniques and structured documentation.",
      "Save 40-60% compared to US-based business analysts while accessing professionals experienced in enterprise software projects.",
      "Improve product outcomes by having a dedicated professional who understands both the business context and the technical implementation.",
    ],
    advantages: [
      "BA candidates are assessed through requirements elicitation exercises and stakeholder communication simulations.",
      "Our BAs bring domain knowledge across fintech, healthcare, e-commerce, logistics, and enterprise SaaS verticals.",
      "SMarDevs matches analysts based on your industry, project complexity, and whether you need more technical or strategic BA skills.",
      "We source BAs who are proficient with modern documentation and collaboration tools including Confluence, Notion, Miro, and Lucidchart.",
      "Flexible engagement allows you to bring in BA support for discovery phases and scale back during implementation-heavy sprints.",
      "All employment, compliance, and operational logistics are managed by SMarDevs.",
    ],
    levels: [
      {
        name: "Junior",
        experience: "1-2 years",
        skills: [
          "Ability to document business requirements, user stories, and acceptance criteria in clear, structured formats",
          "Familiarity with process modeling tools and basic UML or BPMN diagramming",
          "Understanding of Agile methodologies and backlog management practices",
          "Basic data analysis skills including spreadsheet proficiency and SQL query fundamentals",
          "Strong written and verbal communication skills for stakeholder interviews and documentation",
        ],
        typicalSalaryUS: 6000,
        typicalSalaryLATAM: 2800,
      },
      {
        name: "Mid-Level",
        experience: "3-5 years",
        skills: [
          "Expertise in requirements elicitation techniques including stakeholder interviews, workshops, and process mapping",
          "Experience creating detailed functional specifications, data flow diagrams, and system integration documentation",
          "Strong analytical skills for gap analysis, impact assessment, and feasibility evaluation",
          "Proficiency in creating wireframes and low-fidelity prototypes to communicate requirements visually",
          "Ability to manage requirements traceability and ensure alignment between business needs and delivered features",
        ],
        typicalSalaryUS: 9000,
        typicalSalaryLATAM: 4800,
      },
      {
        name: "Senior",
        experience: "6+ years",
        skills: [
          "Proven ability to lead complex discovery phases for enterprise software projects with multiple stakeholder groups",
          "Expertise in business process reengineering, digital transformation initiatives, and technology strategy alignment",
          "Strong data modeling skills and understanding of system architecture concepts for technical requirements definition",
          "Experience defining KPIs, success metrics, and business cases to justify technology investments",
          "Ability to mentor BA teams and establish requirements management standards across an organization",
        ],
        typicalSalaryUS: 13000,
        typicalSalaryLATAM: 7500,
      },
    ],
    hiringProcess: [
      "Stakeholder needs assessment to understand your project scope, business domain, and BA role expectations.",
      "Candidate selection from our vetted pool, filtered by industry experience and technical depth requirements.",
      "Practical assessment involving a requirements elicitation exercise based on a realistic business scenario.",
      "Interview with product and engineering leadership to evaluate communication clarity and analytical approach.",
      "Stakeholder management role-play to assess how they handle competing priorities and ambiguous requirements.",
      "Onboarding with domain knowledge transfer, stakeholder introductions, and documentation standards orientation.",
    ],
    faqs: [
      {
        question: "What is the difference between a business analyst and a product manager?",
        answer:
          "Business analysts focus on requirements elicitation, documentation, and ensuring development teams have clear specifications. Product managers own the product vision, roadmap, and prioritization. BAs work closely with PMs and are especially valuable when detailed requirements documentation and process analysis are needed.",
      },
      {
        question: "Do your business analysts have technical knowledge?",
        answer:
          "Yes. Our BAs understand software development concepts, APIs, database structures, and system integrations at a level that allows them to write precise technical requirements and communicate effectively with development teams.",
      },
      {
        question: "Can business analysts work remotely with distributed stakeholders?",
        answer:
          "Absolutely. Our BAs are skilled in remote facilitation using tools like Miro, FigJam, and Zoom for virtual workshops. They use Confluence, Notion, and Google Docs for collaborative documentation and maintain clear communication across time zones.",
      },
      {
        question: "What industries do your business analysts have experience in?",
        answer:
          "Our BA pool includes professionals with deep experience in financial services, healthcare and healthtech, e-commerce and retail, logistics and supply chain, insurance, and enterprise SaaS platforms.",
      },
      {
        question: "How do business analysts collaborate with QA teams?",
        answer:
          "Our BAs write detailed acceptance criteria that QA teams use to develop test cases. They participate in requirements reviews with QA, help clarify expected behaviors for edge cases, and ensure that test coverage aligns with the documented business rules.",
      },
    ],
  },
  {
    slug: "data-engineers",
    title: "Hire Data Engineers",
    shortTitle: "Data Engineers",
    category: "Engineering",
    description:
      "Build reliable, scalable data infrastructure with experienced data engineers who design pipelines, data warehouses, and real-time streaming systems. Our engineers enable data-driven decision making by transforming raw data into clean, accessible, and trusted assets.",
    heroDescription:
      "Accelerate your data strategy with data engineers from Latin America who design and maintain robust pipelines, warehouses, and analytics platforms. Get the data foundation your business needs at 40–50% less than US market rates.",
    whyHire: [
      "Eliminate data silos and build a unified data platform with engineers experienced in modern lakehouse architectures and cloud-native data tools.",
      "Reduce time-to-insight by automating data ingestion, transformation, and delivery so your analysts and data scientists always work with fresh, reliable data.",
      "Save 40–50% compared to US-based data engineers while accessing professionals with hands-on experience on high-volume production data systems.",
      "Scale data infrastructure on demand — from early-stage pipelines to petabyte-scale warehouses — without long-term hiring commitments.",
      "Work with engineers in your time zone who collaborate closely with analytics, data science, and product teams to deliver end-to-end data solutions.",
    ],
    advantages: [
      "Data engineering candidates are assessed through a practical pipeline design challenge that evaluates ingestion, transformation logic, and data quality practices.",
      "Our engineers are proficient with leading cloud data platforms including Snowflake, BigQuery, Databricks, and Redshift.",
      "SMarDevs matches data engineers based on your stack, whether that is batch processing, real-time streaming, or a hybrid lakehouse approach.",
      "All engineers communicate fluently in English and are experienced collaborating with business intelligence, data science, and product teams.",
      "We manage all payroll, compliance, and equipment logistics so your engineering leads can focus on architecture and delivery.",
      "Our 30-day satisfaction guarantee ensures every placement meets your technical and collaboration expectations.",
    ],
    levels: [
      {
        name: "Junior",
        experience: "1-2 years",
        skills: [
          "Proficiency in Python or SQL for data extraction, transformation, and loading tasks",
          "Familiarity with ETL concepts and at least one orchestration tool such as Apache Airflow or Prefect",
          "Experience working with cloud storage platforms (S3, GCS, or Azure Blob) and relational databases",
          "Understanding of data modeling fundamentals including normalization and dimensional modeling concepts",
          "Ability to write unit tests for data pipelines and document pipeline logic clearly",
        ],
        typicalSalaryUS: 8000,
        typicalSalaryLATAM: 4000,
      },
      {
        name: "Mid-Level",
        experience: "3-5 years",
        skills: [
          "Strong experience designing and maintaining ELT pipelines using dbt, Spark, or equivalent transformation frameworks",
          "Proficiency with cloud data warehouses (Snowflake, BigQuery, or Redshift) including query optimization and cost management",
          "Experience with real-time streaming technologies such as Apache Kafka, Kinesis, or Pub/Sub",
          "Ability to implement data quality checks, monitoring alerts, and lineage tracking across pipeline stages",
          "Understanding of data governance practices including schema management, access control, and PII handling",
        ],
        typicalSalaryUS: 12500,
        typicalSalaryLATAM: 6500,
      },
      {
        name: "Senior",
        experience: "6+ years",
        skills: [
          "Expert-level ability to design end-to-end data platforms including ingestion, transformation, serving, and orchestration layers",
          "Deep experience architecting lakehouse solutions using Delta Lake, Apache Iceberg, or Hudi on cloud infrastructure",
          "Proven track record of optimizing large-scale data systems for performance, reliability, and cost efficiency",
          "Ability to define data engineering standards, review architecture decisions, and mentor junior engineers",
          "Experience with infrastructure-as-code for data infrastructure (Terraform, Pulumi) and DataOps practices",
        ],
        typicalSalaryUS: 17000,
        typicalSalaryLATAM: 9000,
      },
    ],
    hiringProcess: [
      "Discovery session to understand your data stack, business goals, and current pipeline maturity.",
      "Candidate sourcing from our vetted data engineering pool, filtered by tooling expertise and domain experience.",
      "Technical assessment covering pipeline design, SQL proficiency, and data modeling principles.",
      "Architecture discussion to evaluate how candidates approach scalability, reliability, and data quality trade-offs.",
      "Team integration interview with data science, analytics, and engineering leadership to assess collaboration fit.",
      "Onboarding with environment access, current architecture review, and introduction to your data governance practices.",
    ],
    faqs: [
      {
        question: "What data tools and platforms do your engineers specialize in?",
        answer:
          "Our data engineers cover a broad spectrum including Airflow, dbt, Spark, Kafka, Snowflake, BigQuery, Databricks, Redshift, and Fivetran. During sourcing we match candidates specifically to your existing stack and any tools you plan to adopt.",
      },
      {
        question: "Can your data engineers handle both batch and streaming workloads?",
        answer:
          "Yes. Many of our mid-level and senior engineers have production experience with both paradigms. We can source candidates who specialize in one area or who have worked in hybrid architectures that combine scheduled batch pipelines with real-time event streaming.",
      },
      {
        question: "How quickly can a data engineer ramp up on our existing infrastructure?",
        answer:
          "Most data engineers are productive within the first two weeks after receiving architecture documentation and environment access. We recommend a structured onboarding period where they shadow existing pipelines before making independent changes to production systems.",
      },
      {
        question: "Do your data engineers have experience with data governance and compliance?",
        answer:
          "Yes. Our mid-level and senior engineers understand PII classification, data masking, role-based access control, and audit logging. Several have worked in regulated industries such as fintech and healthcare where compliance requirements are particularly strict.",
      },
      {
        question: "Can a data engineer also support our data science team?",
        answer:
          "Absolutely. Our data engineers are experienced collaborating with data scientists to build feature stores, ML training pipelines, and model serving infrastructure. They can help productionize experiments and ensure reproducibility across environments.",
      },
    ],
  },
  {
    slug: "mobile-developers",
    title: "Hire Mobile Developers",
    shortTitle: "Mobile Developers",
    category: "Engineering",
    description:
      "Deliver polished, high-performance mobile applications with developers who specialize in iOS, Android, and cross-platform development. Our mobile engineers build apps that users love — fast, reliable, and crafted with attention to platform-specific design standards.",
    heroDescription:
      "Launch and scale your mobile product with experienced mobile developers from Latin America. Whether you need native iOS, native Android, or cross-platform expertise with React Native or Flutter, we connect you with rigorously vetted talent at 40–50% below US rates.",
    whyHire: [
      "Accelerate your mobile roadmap with engineers who have shipped production apps to the App Store and Google Play with hundreds of thousands of active users.",
      "Get developers who understand the full mobile development lifecycle from architecture and API integration to App Store submission and post-launch monitoring.",
      "Save 40–50% compared to US-based mobile developers while maintaining the same code quality, delivery pace, and communication standards.",
      "Access specialists in React Native and Flutter who can serve both iOS and Android from a single codebase, reducing your team size and coordination overhead.",
      "Work with engineers in your time zone who participate in sprint ceremonies, design reviews, and live demos alongside your product team.",
    ],
    advantages: [
      "Mobile developer candidates are evaluated through a practical build assessment that tests UI implementation, state management, API integration, and performance awareness.",
      "Our engineers have experience with App Store and Google Play submission processes including review guidelines, provisioning profiles, and release automation.",
      "SMarDevs sources mobile developers based on your platform priority — native iOS (Swift/SwiftUI), native Android (Kotlin), or cross-platform (React Native or Flutter).",
      "All engineers understand mobile performance optimization including rendering efficiency, memory management, battery impact, and offline-first patterns.",
      "We handle all employment, compliance, and equipment logistics so your team can focus entirely on building the product.",
      "Our 30-day satisfaction guarantee ensures every placement meets your technical and collaboration standards.",
    ],
    levels: [
      {
        name: "Junior",
        experience: "1-2 years",
        skills: [
          "Proficiency in Swift/SwiftUI for iOS or Kotlin/Jetpack Compose for Android, or React Native/Flutter for cross-platform development",
          "Ability to consume REST APIs and integrate third-party SDKs including analytics, authentication, and push notification services",
          "Understanding of mobile UI patterns, navigation flows, and platform-specific design guidelines (HIG and Material Design)",
          "Familiarity with version control, Agile workflows, and basic debugging using Xcode or Android Studio",
          "Experience publishing at least one application to the App Store or Google Play",
        ],
        typicalSalaryUS: 7500,
        typicalSalaryLATAM: 3800,
      },
      {
        name: "Mid-Level",
        experience: "3-5 years",
        skills: [
          "Strong command of state management patterns (Redux, BLoC, MVVM, or TCA) and clean architecture principles in a mobile context",
          "Experience with offline-first architecture, local persistence using SQLite, Core Data, Room, or Hive, and sync conflict resolution",
          "Proficiency in performance profiling and optimization using platform tools such as Instruments, Android Profiler, or Dart DevTools",
          "Ability to write unit and integration tests for mobile code including UI testing with XCTest, Espresso, or Flutter integration tests",
          "Experience integrating push notifications, deep linking, in-app purchases, and biometric authentication in production apps",
        ],
        typicalSalaryUS: 12000,
        typicalSalaryLATAM: 6500,
      },
      {
        name: "Senior",
        experience: "6+ years",
        skills: [
          "Expert-level mobile architecture skills including modularization, feature flagging, and multi-team development at scale",
          "Deep experience optimizing app startup time, rendering performance, and memory efficiency for large user bases",
          "Proven ability to lead mobile teams, conduct code reviews, and define engineering standards across iOS and Android platforms",
          "Experience with CI/CD pipelines for mobile using Fastlane, GitHub Actions, Bitrise, or App Center for automated testing and deployment",
          "Track record of shipping major releases with zero-downtime rollout strategies including staged rollouts and feature flags",
        ],
        typicalSalaryUS: 16500,
        typicalSalaryLATAM: 9000,
      },
    ],
    hiringProcess: [
      "Discovery call to understand your target platforms, existing codebase, tech stack, and product roadmap.",
      "Candidate shortlisting from our vetted mobile talent pool, filtered by platform expertise and industry experience.",
      "Technical assessment requiring candidates to build a small but complete mobile feature demonstrating UI, state management, and API integration.",
      "Portfolio and code review session where candidates walk through a past project and explain key architectural decisions.",
      "Team interview with product and engineering leadership to evaluate communication, problem-solving, and collaboration style.",
      "Onboarding with codebase walkthrough, build environment setup, and introduction to your release and QA processes.",
    ],
    faqs: [
      {
        question: "Do you have developers for iOS, Android, and cross-platform?",
        answer:
          "Yes. Our mobile talent pool includes native iOS developers specializing in Swift and SwiftUI, native Android developers specializing in Kotlin and Jetpack Compose, and cross-platform developers with production experience in React Native and Flutter. We match based on your specific platform priorities.",
      },
      {
        question: "How do you assess mobile developer quality?",
        answer:
          "Candidates complete a practical build challenge that covers UI implementation, state management, API consumption, and basic performance considerations. Senior candidates also undergo an architecture discussion where they design a solution for a realistic mobile product scenario.",
      },
      {
        question: "Can your developers handle both frontend UI and backend API integration?",
        answer:
          "Yes. Our mobile engineers are experienced consuming REST and GraphQL APIs, handling authentication flows, managing local caching, and working closely with backend teams on contract definitions. Many have experience with Firebase and other BaaS platforms as well.",
      },
      {
        question: "Do your mobile developers have App Store and Google Play submission experience?",
        answer:
          "All of our mid-level and senior mobile developers have managed the App Store and Play Store submission process. This includes managing signing certificates, provisioning profiles, release notes, phased rollouts, and responding to review rejections.",
      },
      {
        question: "Can a React Native or Flutter developer replace separate iOS and Android engineers?",
        answer:
          "For many products, yes. Cross-platform developers can deliver a high-quality app on both platforms from a single codebase, significantly reducing team size and coordination overhead. We recommend native specialists when your app has highly platform-specific requirements such as complex custom animations, deep OS integrations, or extremely high performance demands.",
      },
    ],
  },
];
