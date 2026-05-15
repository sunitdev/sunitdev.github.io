export interface ExperienceProject {
  title: string;
  bullets: string[];
  metrics?: { label: string; value: string }[];
  href?: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  location: string;
  dateRange: string;
  summary: string;
  projects: ExperienceProject[];
}

export const experience: ExperienceEntry[] = [
  {
    company: 'Reddit',
    role: 'Senior Software Engineer (Contractor)',
    location: 'Ireland',
    dateRange: 'Jan 2025 — present',
    summary:
      'ML-powered content classification and ranking platforms across millions of communities.',
    projects: [
      {
        title: 'LLM-powered content classification platform',
        bullets: [
          'Built a 3-layer classification pipeline: a Fast ML safety filter for clearly-safe cases, a fine-tuned Gemini LLM for ambiguous content, and a Provisional E confidence band for the gray middle.',
          'Applied Platt Scaling to calibrate raw LLM confidence against historical reviewer decisions before any threshold check.',
          'Designed safety guardrails: Provisional E communities blocked from cold-start and high-amplification surfaces until a human-review-confirmed signal arrives.',
          'Whole pipeline runs async over Kafka — community creation is never blocked on classification.',
        ],
        metrics: [
          { label: 'Manual review volume', value: '−70%' },
          { label: 'Classification p50', value: 'days → 8 min' },
          { label: 'Eligible content', value: '+35%' },
        ],
      },
      {
        title: 'Provisional E rating strategy',
        bullets: [
          'Invented a novel ML + data-analysis strategy to surface previously-excluded communities (no rating ⇒ no recommendation under the old rule).',
          'Rolled out surface-by-surface with holdback groups to measure safety incident rate and engagement delta before expanding.',
          'Achieved 20–25% recommendation inventory lift with zero increase in safety escalations.',
        ],
        metrics: [
          { label: 'Recommendation inventory', value: '+20–25%' },
          { label: 'Safety escalations', value: '0 increase' },
        ],
      },
      {
        title: 'Unified ML ranking platform',
        bullets: [
          'Replaced 3 independent ranking services (Home, Explore, Notifications) with one shared serving binary fronted by an API Gateway + central Model Registry.',
          'Built a shared feature store so data shared across models is read and stored once.',
          'Model onboarding dropped from 3–4 weeks (deploy per surface) to under 1 week (registry entry + container).',
        ],
        metrics: [
          { label: 'Serving latency', value: '−15%' },
          { label: 'Model onboarding', value: '3–4 wk → <1 wk' },
        ],
      },
    ],
  },
  {
    company: 'Workday',
    role: 'Software Development Engineer',
    location: 'Ireland',
    dateRange: 'Sept 2022 — Nov 2024',
    summary:
      'Cloud-agnostic observability platform on Grafana Mimir. Alert reliability and SRE tooling.',
    projects: [
      {
        title: 'Cloud-agnostic monitoring platform on Grafana Mimir',
        bullets: [
          'Designed and deployed a cloud-agnostic monitoring platform on Grafana Mimir, picking it for horizontal scalability via consistent hashing across ingester zones.',
          'Built validation wrappers around each Mimir component (Alertmanager, ruler, etc.) so every alert at Workday meets a standard label contract.',
          'Onboarded globally including North America and Asia. Drove SRE org restructure around one shared platform.',
        ],
        metrics: [
          { label: 'Daily ingest', value: '1TB+ metrics' },
          { label: 'Uptime', value: '99.99%' },
        ],
      },
      {
        title: 'Mimir storage + query optimization',
        bullets: [
          'Investigated AI/ML service onboarding that degraded cluster performance: huge metric volume increased network traffic, ingester memory, and object-storage usage.',
          'Enabled gzip inter-component compression and increased CPU per pod.',
          'Tuned compactor: +25% instances, dropped interval from 1h → 30min.',
        ],
        metrics: [
          { label: 'S3 storage', value: '−60%' },
          { label: 'Network bandwidth', value: '−50%' },
        ],
      },
      {
        title: 'BigPanda DSL',
        bullets: [
          'Built a custom YAML+Python DSL so non-technical users can author BigPanda alert config directly in Bitbucket.',
          'Jenkins pipeline merges + deploys changes — full audit trail and rollback to any date.',
        ],
        metrics: [{ label: 'Config change time', value: '2 days → 30 min' }],
      },
      {
        title: 'Alertmanager retry mechanism',
        bullets: [
          "Mimir's ruler retried alerts only 3 times before giving up — critical alerts were lost during Alertmanager upgrades.",
          'Designed a proxy between ruler and Alertmanager: captures every alert into a priority queue, forwards, requeues on non-200 with exponential backoff.',
          'Generated metrics from the proxy to monitor alert behavior during upgrades.',
        ],
        metrics: [{ label: 'Critical delivery', value: '~99%' }],
      },
      {
        title: 'Single-click global maintenance window',
        bullets: [
          'Replaced a 2–3 hour per-DC BigPanda routing process with a single PromQL recording-rule flip.',
          'Recording rule emits 0/1 per data center with region / logical / physical labels. Alertmanager wrapper appends an AND condition so any alert auto-suppresses when its DC is in maintenance.',
        ],
        metrics: [{ label: 'Setup time', value: '2–3 hr → 1 API call' }],
      },
      {
        title: 'Slack template debugger',
        bullets: [
          'Built an in-browser Slack-template renderer using Go-on-WebAssembly so onboarding teams can debug Alertmanager templates without firing dummy alerts.',
          'Became the second most-visited site in the team (after docs).',
        ],
      },
    ],
  },
  {
    company: 'Amazon',
    role: 'Software Development Engineer — I',
    location: 'Luxembourg',
    dateRange: 'Feb 2021 — July 2022',
    summary:
      'Risk management and resilience software for the European transportation network.',
    projects: [
      {
        title: 'Risk management system for European transportation network',
        bullets: [
          'Owned backend architecture and UI/UX for software that lets leadership draw a polygon on a map (e.g. expected snowstorm) and immediately see affected warehouses and delivery paths.',
          'Delivered spec → production in 2 months using AWS serverless. Later incorporated into the North American transportation network.',
        ],
        metrics: [{ label: 'Time to production', value: '2 months' }],
      },
      {
        title: 'Geospatial query optimization',
        bullets: [
          'A polygon-warehouse-containment query worked at EU scale (DynamoDB scan + JS polygon check in Lambda) but degraded to 13 sec on the NA dataset.',
          'Iterated through 4 architectures: DynamoDB+JS → Athena+JSON → Athena+Parquet → Parquet split into EU/NA slices with Step Functions fan-out to parallel Lambdas, results aggregated downstream.',
        ],
        metrics: [{ label: 'Query latency', value: '13 s → ~1 s' }],
      },
      {
        title: 'Calendar rendering optimization',
        bullets: [
          'Reduced a warehouse truck-delivery calendar from 100ms render + 4s total load to a fluid experience.',
          'Defaulted to a single-day view, virtualized the visible-hour range, pre-rendered week and month views off the critical path.',
        ],
        metrics: [{ label: 'Render time', value: '100 ms → 20 ms' }],
      },
      {
        title: 'Multi-region resilience',
        bullets: [
          'Designed a cold-standby in a second AWS region for the warehouse delivery app — no infra cost doubling.',
          'DynamoDB Streams replicate writes cross-region; Route53 entry flips API Gateway target on failover.',
        ],
        metrics: [{ label: 'Failover', value: 'single DNS flip' }],
      },
    ],
  },
  {
    company: 'Craft Vision Limited',
    role: 'Full Stack Engineer (Part-time)',
    location: 'Ireland',
    dateRange: 'Jan 2020 — Aug 2020',
    summary:
      'Cryptocurrency lending platform, security compliance, custodian integrations.',
    projects: [
      {
        title: 'Cryptocurrency lending platform',
        bullets: [
          'Contributed to a robust, security-compliant, real-time crypto lending platform.',
          'Drove client integrations with custodians and cryptocurrency wallets.',
          'Automated the product release cycle, achieving a 30% reduction in deployment time.',
          'Implemented enterprise-wide SSO based on the OAuth 2.0 specification.',
        ],
        metrics: [{ label: 'Deploy time', value: '−30%' }],
      },
    ],
  },
  {
    company: 'StoryMirror Infotech',
    role: 'Full Stack Engineer',
    location: 'India',
    dateRange: 'May 2018 — April 2019',
    summary:
      'Online literature-based e-commerce platform with content delivery automation.',
    projects: [
      {
        title: 'Content delivery automation + image editing',
        bullets: [
          'Key contributor on a team that conceptualized and built an online literature-based e-commerce platform serving 500+ active users per minute.',
          'Saved 20% in time and cost on business expenditure by automating and digitalizing the content delivery pipeline (modelled as a finite state machine).',
          'Built an online image editing tool (crop, scale, etc.) that reduced the graphics team workload by 40%.',
          'Designed, built, and managed an ELK stack (Elasticsearch, Logstash, Kibana) for centralized logging and search.',
        ],
        metrics: [
          { label: 'Business expenditure', value: '−20%' },
          { label: 'Graphics workload', value: '−40%' },
        ],
      },
    ],
  },
  {
    company: 'Zaya Learning Labs',
    role: 'Backend Engineer',
    location: 'India',
    dateRange: 'June 2016 — May 2018',
    summary:
      'Distributed offline-first school management system with multi-device data sync.',
    projects: [
      {
        title: 'Distributed offline-first sync algorithm',
        bullets: [
          'Built a distributed school management system that worked both online and offline, with access control, multi-device data synchronization, and data versioning.',
          'Developed a Dropbox-style sync algorithm to synchronize data between a primary database and multiple secondary device databases via op-logs and vector clocks.',
        ],
      },
      {
        title: 'User behaviour analytics + priority queueing',
        bullets: [
          'Created a User Behaviour Analysis pipeline that visualized customer product usage, saving 15% in business expenditure.',
          'Designed and built a priority-based queuing service as a gateway for all third-party communication channels — saved 3 days of development effort for other engineers per integration.',
          'Refactored an existing ReactJS application using the Atomic Design principle, reducing UI defects.',
        ],
        metrics: [
          { label: 'Business expenditure', value: '−15%' },
        ],
      },
    ],
  },
];

export interface Skill {
  category: string;
  items: string[];
  context?: string;
}

export const skills: Skill[] = [
  {
    category: 'Backend',
    items: ['Serverless', 'NodeJS', 'Django', 'Flask', 'Spring Framework'],
  },
  {
    category: 'Frontend',
    items: ['ReactJS', 'VueJS', 'jQuery', 'HTML', 'CSS'],
  },
  {
    category: 'Storage',
    items: ['DynamoDB', 'PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    category: 'DevOps',
    items: [
      'AWS',
      'Azure',
      'Docker',
      'Jenkins',
      'Ansible',
      'GitHub Actions',
      'RabbitMQ',
      'Celery',
      'Logstash',
      'ElasticSearch',
      'Kibana',
    ],
  },
  {
    category: 'Monitoring',
    items: ['Prometheus', 'Grafana Mimir', 'Grafana', 'BigPanda', 'Alertmanager'],
    context: "Built Workday's cloud-agnostic platform on Mimir, processing 1TB+/day.",
  },
  {
    category: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'Kotlin', 'Java', 'GoLang'],
  },
];

export interface SideProject {
  name: string;
  href: string;
  description: string;
}

export const sideProjects: SideProject[] = [
  {
    name: 'newstards',
    href: 'https://github.com/sunitdev/newstards',
    description:
      'Android app aggregating news from Medium, Reddit, Dev.to, and Hacker News.',
  },
  {
    name: 'notes',
    href: 'https://github.com/sunitdev/notes',
    description:
      'Static site generator using Jupyter Notebook to host a personal repository of notes.',
  },
  {
    name: 'dev-geo',
    href: 'https://github.com/sunitdev/dev-geo',
    description:
      'Web-based demographic visualization of contributors working on open-source projects.',
  },
];

export interface Education {
  degree: string;
  institution: string;
  location: string;
  dateRange: string;
  coursework: string[];
}

export const education: Education[] = [
  {
    degree: 'MSc Computer Science — Data Science',
    institution: 'Trinity College, Dublin',
    location: 'Ireland',
    dateRange: '2019 — 2020',
    coursework: [
      'Scalable Computing',
      'Security and Privacy',
      'Machine Learning',
      'Data Analytics',
      'Data Visualization',
    ],
  },
  {
    degree: 'BE Computer Science',
    institution: 'University of Mumbai',
    location: 'India',
    dateRange: '2013 — 2016',
    coursework: [
      'Artificial Intelligence',
      'Discrete Structure',
      'Image Processing',
      'Data Warehousing and Mining',
    ],
  },
];
