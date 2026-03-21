-- ============================================================
-- SMarDevs ATS - Seed Data
-- ============================================================

-- ============================================================
-- JOB CATEGORIES
-- ============================================================
INSERT INTO public.job_categories (name, slug, description, icon, sort_order) VALUES
('Frontend Development', 'frontend', 'React, Vue, Angular and modern frontend technologies', 'Monitor', 1),
('Backend Development', 'backend', 'Node.js, Python, Java, Go and server-side technologies', 'Server', 2),
('Full Stack Development', 'fullstack', 'End-to-end web application development', 'Layers', 3),
('Software Engineering', 'software-engineering', 'General software engineering and architecture', 'Code2', 4),
('QA Manual', 'qa-manual', 'Manual testing, test planning, and quality assurance', 'ClipboardCheck', 5),
('QA Automation', 'qa-automation', 'Test automation, CI/CD testing, and quality engineering', 'FlaskConical', 6),
('DevOps', 'devops', 'Cloud infrastructure, CI/CD, and platform engineering', 'Cloud', 7),
('UI/UX Design', 'ui-ux', 'User interface design, user research, and prototyping', 'Palette', 8),
('Project Management', 'project-management', 'Agile project management and delivery', 'BarChart3', 9),
('Business Analysis', 'business-analysis', 'Requirements gathering, process analysis, and documentation', 'PieChart', 10);

-- ============================================================
-- QUESTION PACKS PER CATEGORY
-- ============================================================

-- == FRONTEND QUESTIONS ==
INSERT INTO public.questions (category_id, question_text, question_type, options, placeholder, helper_text, is_default, sort_order) VALUES
((SELECT id FROM public.job_categories WHERE slug = 'frontend'), 'Which frontend frameworks have you worked with professionally?', 'textarea', NULL, 'e.g., React (3 years), Vue.js (2 years), Angular (1 year)', 'List each framework and your years of experience', true, 1),
((SELECT id FROM public.job_categories WHERE slug = 'frontend'), 'Describe your experience with state management solutions.', 'textarea', NULL, 'e.g., Redux, Zustand, Context API, Vuex...', NULL, true, 2),
((SELECT id FROM public.job_categories WHERE slug = 'frontend'), 'What is your experience level with TypeScript?', 'select', '["Beginner (< 1 year)", "Intermediate (1-3 years)", "Advanced (3+ years)", "No experience"]', NULL, NULL, true, 3),
((SELECT id FROM public.job_categories WHERE slug = 'frontend'), 'Have you worked with server-side rendering (SSR) or static site generation (SSG)?', 'select', '["Yes, extensively (Next.js, Nuxt, etc.)", "Some experience", "Limited exposure", "No"]', NULL, NULL, true, 4),
((SELECT id FROM public.job_categories WHERE slug = 'frontend'), 'Describe a complex UI challenge you solved and how you approached it.', 'textarea', NULL, 'Focus on the problem, your approach, and the outcome', NULL, true, 5),
((SELECT id FROM public.job_categories WHERE slug = 'frontend'), 'What CSS methodologies or frameworks do you prefer? (e.g., Tailwind, CSS Modules, Styled Components)', 'text', NULL, NULL, NULL, false, 6);

-- == BACKEND QUESTIONS ==
INSERT INTO public.questions (category_id, question_text, question_type, options, placeholder, helper_text, is_default, sort_order) VALUES
((SELECT id FROM public.job_categories WHERE slug = 'backend'), 'Which backend languages and frameworks do you use most frequently?', 'textarea', NULL, 'e.g., Node.js/Express (4 years), Python/Django (2 years)', 'List each technology and your years of experience', true, 1),
((SELECT id FROM public.job_categories WHERE slug = 'backend'), 'Describe your experience with relational and non-relational databases.', 'textarea', NULL, 'e.g., PostgreSQL, MySQL, MongoDB, Redis...', NULL, true, 2),
((SELECT id FROM public.job_categories WHERE slug = 'backend'), 'Have you designed or maintained RESTful APIs or GraphQL services at scale?', 'textarea', NULL, 'Describe the scale, patterns used, and your role', NULL, true, 3),
((SELECT id FROM public.job_categories WHERE slug = 'backend'), 'What is your experience with message queues or event-driven architectures?', 'select', '["Extensive (Kafka, RabbitMQ, SQS, etc.)", "Some experience", "Familiar with concepts", "No experience"]', NULL, NULL, true, 4),
((SELECT id FROM public.job_categories WHERE slug = 'backend'), 'Describe a performance optimization you implemented on a backend system.', 'textarea', NULL, 'Include the bottleneck, your solution, and measurable results', NULL, true, 5),
((SELECT id FROM public.job_categories WHERE slug = 'backend'), 'Do you have experience with microservices architecture?', 'select', '["Yes, designed and built microservices", "Yes, worked within existing microservices", "Some exposure", "No"]', NULL, NULL, false, 6);

-- == FULLSTACK QUESTIONS ==
INSERT INTO public.questions (category_id, question_text, question_type, options, placeholder, helper_text, is_default, sort_order) VALUES
((SELECT id FROM public.job_categories WHERE slug = 'fullstack'), 'Describe your preferred full stack technology combination and why.', 'textarea', NULL, 'e.g., Next.js + Node.js + PostgreSQL because...', NULL, true, 1),
((SELECT id FROM public.job_categories WHERE slug = 'fullstack'), 'How do you approach splitting work between frontend and backend in a feature?', 'textarea', NULL, 'Describe your workflow for an end-to-end feature', NULL, true, 2),
((SELECT id FROM public.job_categories WHERE slug = 'fullstack'), 'What is your experience with cloud deployment and DevOps practices?', 'select', '["Strong (manage own deployments, CI/CD)", "Moderate (familiar with pipelines, basic cloud)", "Basic (some exposure)", "Minimal"]', NULL, NULL, true, 3),
((SELECT id FROM public.job_categories WHERE slug = 'fullstack'), 'Have you worked with real-time features such as WebSockets or server-sent events?', 'select', '["Yes, in production", "Yes, in personal projects", "Familiar with concepts", "No"]', NULL, NULL, true, 4),
((SELECT id FROM public.job_categories WHERE slug = 'fullstack'), 'Describe a full stack project you owned end-to-end, including your architecture decisions.', 'textarea', NULL, 'Focus on scope, technical decisions, and outcome', NULL, true, 5);

-- == SOFTWARE ENGINEERING QUESTIONS ==
INSERT INTO public.questions (category_id, question_text, question_type, options, placeholder, helper_text, is_default, sort_order) VALUES
((SELECT id FROM public.job_categories WHERE slug = 'software-engineering'), 'Describe your experience with software design patterns and architectural principles.', 'textarea', NULL, 'e.g., SOLID, DDD, Clean Architecture, event sourcing...', NULL, true, 1),
((SELECT id FROM public.job_categories WHERE slug = 'software-engineering'), 'Which programming languages are you proficient in?', 'textarea', NULL, 'List each language and approximate years of experience', NULL, true, 2),
((SELECT id FROM public.job_categories WHERE slug = 'software-engineering'), 'How do you approach code review? What do you look for?', 'textarea', NULL, NULL, NULL, true, 3),
((SELECT id FROM public.job_categories WHERE slug = 'software-engineering'), 'Describe a system you designed that needed to handle significant scale or complexity.', 'textarea', NULL, 'Include constraints, trade-offs, and outcomes', NULL, true, 4),
((SELECT id FROM public.job_categories WHERE slug = 'software-engineering'), 'What is your approach to testing? Which testing strategies do you use?', 'textarea', NULL, 'e.g., unit, integration, e2e, TDD...', NULL, true, 5);

-- == QA MANUAL QUESTIONS ==
INSERT INTO public.questions (category_id, question_text, question_type, options, placeholder, helper_text, is_default, sort_order) VALUES
((SELECT id FROM public.job_categories WHERE slug = 'qa-manual'), 'Describe your experience creating test plans and test cases from requirements.', 'textarea', NULL, 'How do you structure a test plan for a new feature?', NULL, true, 1),
((SELECT id FROM public.job_categories WHERE slug = 'qa-manual'), 'Which bug tracking and test management tools have you used?', 'textarea', NULL, 'e.g., Jira, TestRail, Zephyr, qTest...', NULL, true, 2),
((SELECT id FROM public.job_categories WHERE slug = 'qa-manual'), 'What types of testing are you most experienced with?', 'select', '["Functional & regression", "Smoke & sanity", "Exploratory", "UAT", "All of the above"]', NULL, NULL, true, 3),
((SELECT id FROM public.job_categories WHERE slug = 'qa-manual'), 'How do you prioritize which bugs to escalate versus which to document?', 'textarea', NULL, NULL, NULL, true, 4),
((SELECT id FROM public.job_categories WHERE slug = 'qa-manual'), 'Describe a critical bug you found that others missed and how you identified it.', 'textarea', NULL, 'Focus on your approach and methodology', NULL, true, 5),
((SELECT id FROM public.job_categories WHERE slug = 'qa-manual'), 'Do you have experience with API testing tools like Postman or SoapUI?', 'select', '["Yes, daily use", "Yes, occasional use", "Basic familiarity", "No"]', NULL, NULL, false, 6);

-- == QA AUTOMATION QUESTIONS ==
INSERT INTO public.questions (category_id, question_text, question_type, options, placeholder, helper_text, is_default, sort_order) VALUES
((SELECT id FROM public.job_categories WHERE slug = 'qa-automation'), 'Which test automation frameworks have you worked with?', 'textarea', NULL, 'e.g., Cypress (3 years), Selenium (2 years), Playwright (1 year)', 'Include years of experience per framework', true, 1),
((SELECT id FROM public.job_categories WHERE slug = 'qa-automation'), 'Describe your experience integrating automated tests into CI/CD pipelines.', 'textarea', NULL, 'Which CI/CD tools? How did you structure the test stages?', NULL, true, 2),
((SELECT id FROM public.job_categories WHERE slug = 'qa-automation'), 'What is your primary programming language for writing test scripts?', 'select', '["JavaScript/TypeScript", "Python", "Java", "C#", "Ruby", "Other"]', NULL, NULL, true, 3),
((SELECT id FROM public.job_categories WHERE slug = 'qa-automation'), 'How do you decide which tests to automate versus leave as manual?', 'textarea', NULL, NULL, NULL, true, 4),
((SELECT id FROM public.job_categories WHERE slug = 'qa-automation'), 'Describe your approach to handling flaky tests in a test suite.', 'textarea', NULL, 'How do you identify, diagnose, and fix them?', NULL, true, 5),
((SELECT id FROM public.job_categories WHERE slug = 'qa-automation'), 'Do you have experience with performance or load testing?', 'select', '["Yes, regularly (JMeter, k6, Locust, etc.)", "Some experience", "Familiar with concepts", "No"]', NULL, NULL, false, 6);

-- == DEVOPS QUESTIONS ==
INSERT INTO public.questions (category_id, question_text, question_type, options, placeholder, helper_text, is_default, sort_order) VALUES
((SELECT id FROM public.job_categories WHERE slug = 'devops'), 'Which cloud platforms do you have production experience with?', 'select', '["AWS", "GCP", "Azure", "Multiple platforms", "Other"]', NULL, NULL, true, 1),
((SELECT id FROM public.job_categories WHERE slug = 'devops'), 'Describe your experience with Infrastructure as Code tools.', 'textarea', NULL, 'e.g., Terraform, Pulumi, CloudFormation, Ansible...', NULL, true, 2),
((SELECT id FROM public.job_categories WHERE slug = 'devops'), 'How have you implemented CI/CD pipelines in previous roles?', 'textarea', NULL, 'Describe tools, stages, and deployment strategies used', NULL, true, 3),
((SELECT id FROM public.job_categories WHERE slug = 'devops'), 'What container orchestration tools have you used?', 'select', '["Kubernetes (EKS/GKE/AKS)", "Docker Swarm", "ECS/Fargate", "Nomad", "Multiple", "None"]', NULL, NULL, true, 4),
((SELECT id FROM public.job_categories WHERE slug = 'devops'), 'Describe an incident you helped resolve and what you changed to prevent recurrence.', 'textarea', NULL, 'Focus on root cause analysis and prevention measures', NULL, true, 5);

-- == UI/UX QUESTIONS ==
INSERT INTO public.questions (category_id, question_text, question_type, options, placeholder, helper_text, is_default, sort_order) VALUES
((SELECT id FROM public.job_categories WHERE slug = 'ui-ux'), 'Which design tools are you proficient in?', 'textarea', NULL, 'e.g., Figma (4 years), Sketch (2 years), Adobe XD...', 'Include years of experience', true, 1),
((SELECT id FROM public.job_categories WHERE slug = 'ui-ux'), 'Describe your user research process for a recent project.', 'textarea', NULL, 'What methods did you use? How did findings influence the design?', NULL, true, 2),
((SELECT id FROM public.job_categories WHERE slug = 'ui-ux'), 'Do you have experience with design systems?', 'select', '["Yes, built and maintained one", "Yes, contributed to one", "Used existing design systems", "No"]', NULL, NULL, true, 3),
((SELECT id FROM public.job_categories WHERE slug = 'ui-ux'), 'How do you handle design handoff to development teams?', 'textarea', NULL, 'What tools and processes do you use?', NULL, true, 4),
((SELECT id FROM public.job_categories WHERE slug = 'ui-ux'), 'Share a link to your portfolio or case studies.', 'url', NULL, 'https://...', 'We review all portfolios submitted', true, 5);

-- == PROJECT MANAGEMENT QUESTIONS ==
INSERT INTO public.questions (category_id, question_text, question_type, options, placeholder, helper_text, is_default, sort_order) VALUES
((SELECT id FROM public.job_categories WHERE slug = 'project-management'), 'Which project management methodologies do you use?', 'select', '["Scrum", "Kanban", "SAFe", "Waterfall", "Hybrid", "Multiple"]', NULL, NULL, true, 1),
((SELECT id FROM public.job_categories WHERE slug = 'project-management'), 'What is the largest team size you have managed?', 'select', '["1-5", "6-10", "11-20", "20+"]', NULL, NULL, true, 2),
((SELECT id FROM public.job_categories WHERE slug = 'project-management'), 'Which PM tools do you use regularly?', 'textarea', NULL, 'e.g., Jira, Asana, Monday, Linear, Shortcut...', NULL, true, 3),
((SELECT id FROM public.job_categories WHERE slug = 'project-management'), 'Describe how you handle scope creep on an active project.', 'textarea', NULL, 'Give a real example if possible', NULL, true, 4),
((SELECT id FROM public.job_categories WHERE slug = 'project-management'), 'How do you communicate project status and risks to stakeholders?', 'textarea', NULL, NULL, NULL, true, 5);

-- == BUSINESS ANALYSIS QUESTIONS ==
INSERT INTO public.questions (category_id, question_text, question_type, options, placeholder, helper_text, is_default, sort_order) VALUES
((SELECT id FROM public.job_categories WHERE slug = 'business-analysis'), 'Describe your experience gathering and documenting business requirements.', 'textarea', NULL, 'What techniques and formats do you use?', NULL, true, 1),
((SELECT id FROM public.job_categories WHERE slug = 'business-analysis'), 'Which diagramming or documentation tools do you use?', 'textarea', NULL, 'e.g., Lucidchart, Confluence, Miro, Notion...', NULL, true, 2),
((SELECT id FROM public.job_categories WHERE slug = 'business-analysis'), 'Have you written user stories with acceptance criteria?', 'select', '["Yes, this is a core part of my workflow", "Yes, occasionally", "Familiar but limited experience", "No"]', NULL, NULL, true, 3),
((SELECT id FROM public.job_categories WHERE slug = 'business-analysis'), 'Describe a situation where stakeholders had conflicting requirements and how you resolved it.', 'textarea', NULL, NULL, NULL, true, 4),
((SELECT id FROM public.job_categories WHERE slug = 'business-analysis'), 'What is your experience with data analysis or SQL?', 'select', '["Advanced (complex queries, data modeling)", "Intermediate (joins, aggregations, subqueries)", "Basic (simple queries)", "No experience"]', NULL, NULL, true, 5);

-- ============================================================
-- SAMPLE JOBS
-- ============================================================

-- 1. Senior Frontend Developer
INSERT INTO public.jobs (title, slug, category_id, department, status, modality, location, seniority, contract_type, summary, responsibilities, requirements, preferred_qualifications, tech_stack, benefits, salary_min, salary_max, show_salary, published_at) VALUES
('Senior Frontend Developer', 'senior-frontend-developer', (SELECT id FROM public.job_categories WHERE slug = 'frontend'), 'Engineering', 'published', 'remote', 'Remote - LATAM', 'senior', 'full_time_contractor',
'We are looking for a Senior Frontend Developer to lead the UI layer of a fast-growing fintech platform. You will build pixel-perfect, accessible, and highly performant interfaces used by thousands of financial professionals daily.',
ARRAY['Architect and implement complex UI features using React and TypeScript', 'Collaborate closely with product designers to translate Figma prototypes into production-ready components', 'Establish frontend coding standards and conduct thorough code reviews', 'Optimize application performance including bundle size, rendering, and Core Web Vitals', 'Mentor mid-level developers and contribute to technical decision-making', 'Participate in sprint planning and help refine user stories from a technical perspective'],
ARRAY['5+ years of professional frontend development experience', 'Deep expertise in React, TypeScript, and modern CSS (Tailwind preferred)', 'Strong understanding of responsive design and cross-browser compatibility', 'Experience with state management (Redux, Zustand, or React Query)', 'Familiarity with testing libraries (Jest, React Testing Library, Cypress)', 'Excellent written and verbal communication in English (B2+ level)'],
ARRAY['Experience with Next.js and server-side rendering', 'Knowledge of accessibility standards (WCAG 2.1)', 'Background in fintech or regulated industries', 'Contributions to open-source projects'],
ARRAY['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'React Query', 'Jest', 'Cypress', 'Storybook', 'Figma'],
ARRAY['Competitive USD compensation paid monthly', 'Fully remote work from anywhere in LATAM', 'Flexible working hours aligned with US time zones', 'Annual learning budget for courses and conferences', 'Paid time off and local holidays observed', 'Direct collaboration with US-based product teams', 'Career growth path with quarterly performance reviews', 'Hardware stipend for your home office setup'],
4000, 6500, true, NOW());

-- 2. Senior Backend Developer
INSERT INTO public.jobs (title, slug, category_id, department, status, modality, location, seniority, contract_type, summary, responsibilities, requirements, preferred_qualifications, tech_stack, benefits, salary_min, salary_max, show_salary, published_at) VALUES
('Senior Backend Developer', 'senior-backend-developer', (SELECT id FROM public.job_categories WHERE slug = 'backend'), 'Engineering', 'published', 'remote', 'Remote - LATAM', 'senior', 'full_time_contractor',
'Join our team as a Senior Backend Developer building scalable APIs and microservices for a healthtech platform that processes millions of transactions monthly. You will design resilient systems that directly impact patient care.',
ARRAY['Design, build, and maintain RESTful APIs and microservices handling high throughput', 'Architect database schemas and optimize query performance for PostgreSQL and Redis', 'Implement authentication, authorization, and data encryption to meet HIPAA guidelines', 'Build and maintain CI/CD pipelines for automated testing and deployment', 'Collaborate with frontend engineers to define clean API contracts', 'Participate in on-call rotation and incident response for production systems'],
ARRAY['5+ years of backend development experience with Node.js, Python, or Java', 'Strong experience with PostgreSQL and at least one NoSQL database', 'Proficiency with Docker, Kubernetes, and cloud services (AWS preferred)', 'Understanding of event-driven architecture and message queues (Kafka, SQS, RabbitMQ)', 'Experience with monitoring and observability tools (Datadog, Grafana, or similar)', 'Strong English communication skills (B2+ level)'],
ARRAY['Experience in healthtech or regulated industries', 'Knowledge of HIPAA or SOC 2 compliance requirements', 'Familiarity with GraphQL', 'Experience with Terraform or similar IaC tools'],
ARRAY['Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Kafka', 'Terraform'],
ARRAY['Competitive USD compensation paid monthly', 'Fully remote work from anywhere in LATAM', 'Flexible schedule aligned with US Eastern time zone', 'Annual learning and certification budget', 'Paid time off and local holidays observed', 'Direct access to engineering leadership', 'Meaningful work impacting healthcare delivery', 'Home office equipment allowance'],
4500, 7000, true, NOW());

-- 3. Mid Full Stack Developer
INSERT INTO public.jobs (title, slug, category_id, department, status, modality, location, seniority, contract_type, summary, responsibilities, requirements, preferred_qualifications, tech_stack, benefits, salary_min, salary_max, show_salary, published_at) VALUES
('Mid Full Stack Developer', 'mid-fullstack-developer', (SELECT id FROM public.job_categories WHERE slug = 'fullstack'), 'Engineering', 'published', 'remote', 'Remote - LATAM', 'mid', 'full_time_contractor',
'We are seeking a Mid Full Stack Developer to join a growing SaaS product team. You will work across the entire stack, building features end-to-end for a platform used by thousands of small businesses.',
ARRAY['Develop full stack features using Next.js on the frontend and Node.js on the backend', 'Write clean, maintainable, and well-tested code with good documentation', 'Collaborate with product managers and designers to deliver user-facing features', 'Maintain and improve existing APIs and database models', 'Participate in code reviews and knowledge sharing sessions', 'Help triage and fix bugs reported by the support team'],
ARRAY['3+ years of professional full stack development experience', 'Solid knowledge of React, Node.js, and TypeScript', 'Experience with relational databases such as PostgreSQL or MySQL', 'Familiarity with Git workflows and CI/CD basics', 'Understanding of REST API design principles', 'Good written and spoken English (B2 level)'],
ARRAY['Experience with Next.js or similar SSR framework', 'Familiarity with cloud platforms (AWS, GCP, or Vercel)', 'Experience with Tailwind CSS or utility-first CSS frameworks', 'Knowledge of Agile/Scrum workflows'],
ARRAY['Next.js', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Git', 'Vercel'],
ARRAY['Competitive USD compensation paid monthly', 'Fully remote from anywhere in LATAM', 'Flexible hours with US timezone overlap', 'Learning budget for courses and books', 'Paid time off', 'Small team with high autonomy', 'Clear path to senior engineering roles'],
2800, 4500, true, NOW());

-- 4. QA Manual Engineer
INSERT INTO public.jobs (title, slug, category_id, department, status, modality, location, seniority, contract_type, summary, responsibilities, requirements, preferred_qualifications, tech_stack, benefits, salary_min, salary_max, show_salary, published_at) VALUES
('QA Manual Engineer', 'qa-manual-engineer', (SELECT id FROM public.job_categories WHERE slug = 'qa-manual'), 'Quality Assurance', 'published', 'remote', 'Remote - LATAM', 'mid', 'full_time_contractor',
'We need a meticulous QA Manual Engineer to ensure product quality for a B2B e-commerce platform. You will design test strategies, execute test plans, and serve as the last line of defense before features reach production.',
ARRAY['Create and maintain comprehensive test plans and test cases for new features and regressions', 'Execute manual functional, regression, smoke, and exploratory testing', 'Report and track bugs with clear reproduction steps using Jira', 'Collaborate with developers to understand feature requirements and edge cases', 'Participate in sprint ceremonies and provide QA estimates for planned work', 'Validate bug fixes and verify production deployments'],
ARRAY['3+ years of experience in manual QA for web applications', 'Strong ability to write clear, structured test cases', 'Experience with Jira or similar issue tracking tools', 'Familiarity with API testing using Postman or similar tools', 'Understanding of the software development lifecycle and Agile methodologies', 'Detail-oriented with strong analytical skills', 'English communication at B2+ level'],
ARRAY['ISTQB or equivalent QA certification', 'Experience with test management tools like TestRail or Zephyr', 'Basic SQL knowledge for data validation', 'Exposure to mobile application testing'],
ARRAY['Jira', 'TestRail', 'Postman', 'Chrome DevTools', 'SQL', 'Confluence'],
ARRAY['Competitive USD compensation', 'Fully remote position', 'Flexible working hours', 'Paid time off and local holidays', 'Learning budget', 'Collaborative international team'],
2000, 3500, true, NOW());

-- 5. Senior QA Automation Engineer
INSERT INTO public.jobs (title, slug, category_id, department, status, modality, location, seniority, contract_type, summary, responsibilities, requirements, preferred_qualifications, tech_stack, benefits, salary_min, salary_max, show_salary, published_at) VALUES
('Senior QA Automation Engineer', 'senior-qa-automation-engineer', (SELECT id FROM public.job_categories WHERE slug = 'qa-automation'), 'Quality Assurance', 'published', 'remote', 'Remote - LATAM', 'senior', 'full_time_contractor',
'We are hiring a Senior QA Automation Engineer to build and maintain a robust test automation framework for a high-traffic SaaS platform. You will reduce manual testing effort, increase release confidence, and integrate quality into every stage of the pipeline.',
ARRAY['Design and build a scalable test automation framework from scratch or extend existing ones', 'Write and maintain end-to-end, integration, and API automated tests', 'Integrate automated test suites into CI/CD pipelines (GitHub Actions, Jenkins)', 'Analyze test results, identify flaky tests, and improve test reliability', 'Collaborate with developers to shift testing left in the development process', 'Define test automation standards and mentor junior QA team members'],
ARRAY['5+ years in QA with at least 3 years focused on automation', 'Expert-level proficiency with Cypress, Playwright, or Selenium', 'Strong programming skills in JavaScript or TypeScript', 'Experience integrating tests into CI/CD pipelines', 'Knowledge of API testing and contract testing patterns', 'English at B2+ level with clear written communication'],
ARRAY['Experience with performance testing tools (k6, JMeter, Locust)', 'Knowledge of Docker for test environment management', 'ISTQB Advanced certification', 'Experience with visual regression testing'],
ARRAY['Cypress', 'Playwright', 'TypeScript', 'JavaScript', 'GitHub Actions', 'Jenkins', 'Postman', 'k6', 'Docker', 'REST APIs'],
ARRAY['Competitive USD compensation paid monthly', 'Fully remote work', 'Flexible schedule', 'Annual learning budget', 'Paid time off', 'Work with cutting-edge testing tools', 'Leadership growth opportunities'],
3500, 5500, true, NOW());

-- 6. DevOps Engineer
INSERT INTO public.jobs (title, slug, category_id, department, status, modality, location, seniority, contract_type, summary, responsibilities, requirements, preferred_qualifications, tech_stack, benefits, salary_min, salary_max, show_salary, published_at) VALUES
('DevOps Engineer', 'devops-engineer', (SELECT id FROM public.job_categories WHERE slug = 'devops'), 'Infrastructure', 'published', 'remote', 'Remote - LATAM', 'senior', 'full_time_contractor',
'We are looking for a DevOps Engineer to manage and improve the cloud infrastructure of a multi-tenant enterprise platform. You will ensure reliability, scalability, and security across production environments handling sensitive data.',
ARRAY['Manage and optimize AWS infrastructure including ECS, RDS, S3, CloudFront, and Lambda', 'Build and maintain CI/CD pipelines using GitHub Actions and ArgoCD', 'Implement Infrastructure as Code using Terraform with proper state management', 'Configure monitoring, alerting, and logging using Datadog and CloudWatch', 'Implement security best practices including secret management, IAM policies, and network segmentation', 'Participate in incident response and conduct post-mortems'],
ARRAY['4+ years of DevOps or SRE experience', 'Strong experience with AWS (certified preferred)', 'Proficiency with Terraform or CloudFormation', 'Solid experience with Docker and container orchestration (ECS or Kubernetes)', 'Experience building CI/CD pipelines from scratch', 'Understanding of networking, DNS, and load balancing fundamentals', 'English at B2+ level'],
ARRAY['AWS Solutions Architect or DevOps Engineer certification', 'Experience with Kubernetes (EKS)', 'Knowledge of compliance frameworks (SOC 2, HIPAA)', 'Experience with cost optimization strategies'],
ARRAY['AWS', 'Terraform', 'Docker', 'Kubernetes', 'GitHub Actions', 'ArgoCD', 'Datadog', 'CloudWatch', 'Linux', 'Bash', 'Python'],
ARRAY['Competitive USD compensation', 'Fully remote from LATAM', 'Flexible hours', 'Certification reimbursement', 'Paid time off', 'High-impact infrastructure work', 'Direct access to CTO'],
4000, 6500, true, NOW());

-- 7. UI/UX Designer
INSERT INTO public.jobs (title, slug, category_id, department, status, modality, location, seniority, contract_type, summary, responsibilities, requirements, preferred_qualifications, tech_stack, benefits, salary_min, salary_max, show_salary, published_at) VALUES
('UI/UX Designer', 'ui-ux-designer', (SELECT id FROM public.job_categories WHERE slug = 'ui-ux'), 'Design', 'published', 'remote', 'Remote - LATAM', 'mid', 'full_time_contractor',
'Join us as a UI/UX Designer to shape the user experience of an edtech platform reaching thousands of learners. You will own the design process from research through high-fidelity prototypes and work closely with engineering to bring designs to life.',
ARRAY['Conduct user research including interviews, surveys, and usability testing', 'Create wireframes, user flows, and high-fidelity mockups in Figma', 'Build and maintain a design system with reusable components and tokens', 'Collaborate with product managers to define feature requirements and acceptance criteria', 'Work with frontend developers to ensure pixel-perfect implementation', 'Present design decisions to stakeholders and iterate based on feedback'],
ARRAY['3+ years of UI/UX design experience for web applications', 'Expert proficiency in Figma', 'Strong portfolio demonstrating end-to-end design process', 'Understanding of responsive design principles and accessibility (WCAG)', 'Experience with user research methodologies', 'English at B2+ level'],
ARRAY['Experience in edtech, SaaS, or B2B products', 'Knowledge of front-end development (HTML, CSS, basic React)', 'Experience with motion design or micro-interactions', 'Familiarity with analytics tools for measuring design impact'],
ARRAY['Figma', 'FigJam', 'Maze', 'Hotjar', 'Notion', 'Loom'],
ARRAY['Competitive USD compensation', 'Fully remote', 'Flexible hours', 'Design tool licenses provided', 'Learning budget', 'Paid time off', 'Creative autonomy within product vision'],
2500, 4000, true, NOW());

-- 8. Project Manager
INSERT INTO public.jobs (title, slug, category_id, department, status, modality, location, seniority, contract_type, summary, responsibilities, requirements, preferred_qualifications, tech_stack, benefits, salary_min, salary_max, show_salary, published_at) VALUES
('Project Manager', 'project-manager', (SELECT id FROM public.job_categories WHERE slug = 'project-management'), 'Operations', 'published', 'remote', 'Remote - LATAM', 'senior', 'full_time_contractor',
'We need an experienced Project Manager to drive delivery for a distributed engineering team building enterprise software. You will own the delivery process, facilitate Agile ceremonies, and ensure alignment between technical execution and business goals.',
ARRAY['Lead Agile ceremonies including sprint planning, daily standups, retrospectives, and demos', 'Manage project timelines, scope, risks, and dependencies across multiple workstreams', 'Serve as the primary point of contact between the development team and US-based stakeholders', 'Track team velocity and use data to improve estimation and planning accuracy', 'Identify and escalate blockers, risks, and resource constraints proactively', 'Maintain project documentation in Confluence and manage backlogs in Jira'],
ARRAY['5+ years of project management experience in software development', 'Strong understanding of Agile/Scrum methodologies', 'Experience managing remote or distributed teams', 'Proficiency with Jira, Confluence, or similar tools', 'Excellent English communication skills (C1 level preferred)', 'Strong organizational and stakeholder management skills'],
ARRAY['PMP, CSM, or PSM certification', 'Experience in enterprise or B2B SaaS environments', 'Technical background or strong technical literacy', 'Experience with SAFe for larger organizations'],
ARRAY['Jira', 'Confluence', 'Slack', 'Zoom', 'Miro', 'Google Workspace', 'Linear'],
ARRAY['Competitive USD compensation', 'Fully remote', 'Flexible schedule', 'PMP/certification reimbursement', 'Paid time off', 'Leadership role with high visibility', 'Work directly with C-level stakeholders'],
3500, 5500, true, NOW());

-- 9. Business Analyst
INSERT INTO public.jobs (title, slug, category_id, department, status, modality, location, seniority, contract_type, summary, responsibilities, requirements, preferred_qualifications, tech_stack, benefits, salary_min, salary_max, show_salary, published_at) VALUES
('Business Analyst', 'business-analyst', (SELECT id FROM public.job_categories WHERE slug = 'business-analysis'), 'Operations', 'published', 'remote', 'Remote - LATAM', 'mid', 'full_time_contractor',
'We are seeking a Business Analyst to bridge the gap between business stakeholders and engineering for a logistics technology company. You will translate complex business processes into clear requirements that development teams can execute.',
ARRAY['Gather, analyze, and document business requirements through stakeholder interviews and workshops', 'Create detailed user stories with acceptance criteria in collaboration with product owners', 'Map current and future-state business processes using flowcharts and diagrams', 'Facilitate requirements review sessions with development teams and stakeholders', 'Validate delivered features against requirements and acceptance criteria', 'Maintain a living requirements repository and ensure traceability'],
ARRAY['3+ years of business analysis experience in technology projects', 'Strong experience writing user stories and acceptance criteria', 'Proficiency with diagramming tools (Lucidchart, Miro, Visio)', 'Experience with Jira and Confluence or similar documentation platforms', 'Understanding of SQL for data analysis and validation', 'Excellent English communication (B2+ level)'],
ARRAY['CBAP or similar BA certification', 'Experience in logistics, supply chain, or B2B SaaS', 'Familiarity with API documentation (Swagger/OpenAPI)', 'Basic understanding of database modeling'],
ARRAY['Jira', 'Confluence', 'Lucidchart', 'Miro', 'SQL', 'Notion', 'Google Workspace'],
ARRAY['Competitive USD compensation', 'Fully remote', 'Flexible hours', 'Learning budget', 'Paid time off', 'High-impact analytical role', 'Work across multiple product teams'],
2500, 4000, true, NOW());

-- ============================================================
-- AUTO-ASSIGN QUESTION PACKS TO EXISTING JOBS
-- ============================================================
-- This assigns all default questions from the matching category to each job

INSERT INTO public.job_questions (job_id, question_id, is_required, is_active, sort_order)
SELECT j.id, q.id, true, true, q.sort_order
FROM public.jobs j
JOIN public.questions q ON q.category_id = j.category_id AND q.is_default = true
ON CONFLICT (job_id, question_id) DO NOTHING;

-- ============================================================
-- FUNCTION: Auto-assign question pack when creating a job
-- ============================================================
CREATE OR REPLACE FUNCTION public.auto_assign_questions()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.job_questions (job_id, question_id, is_required, is_active, sort_order)
  SELECT NEW.id, q.id, true, true, q.sort_order
  FROM public.questions q
  WHERE q.category_id = NEW.category_id AND q.is_default = true
  ON CONFLICT (job_id, question_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_job_created
  AFTER INSERT ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_questions();
