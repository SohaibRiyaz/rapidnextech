import { Brain, Smartphone, Monitor, Cloud, Lock, BarChart3, Globe, Code2, Workflow, ShieldCheck, Zap, Layers, Users, Rocket, Database, Server, CheckCircle2 } from "lucide-react"
import { ServiceData } from "./types"

export const servicesData: Record<string, ServiceData> = {
    // 1. PRODUCT ENGINEERING
    "web-application-development": {
        title: "Web Application Development",
        subtitle: "Scalable SaaS, dashboards, and enterprise portals built for performance.",
        shortDescription: "We build robust, high-performance web applications that scale with your business using modern frameworks like Next.js and React.",
        icon: Monitor,
        contentBlocks: [
            {
                type: "features",
                data: {
                    title: "What We Build",
                    items: [
                        { title: "SaaS Platforms", description: "Multi-tenant architectures with subscription handling." },
                        { title: "Enterprise Dashboards", description: "Real-time data visualization and admin panels." },
                        { title: "Customer Portals", description: "Secure, interactive portals for your users." }
                    ]
                }
            },
            {
                type: "tech-stack",
                data: {
                    title: "Our Core Tech Stack",
                    technologies: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "TailwindCSS", "AWS", "Docker", "Redux", "GraphQL", "Prisma", "Vercel"]
                }
            },
            {
                type: "process",
                data: {
                    title: "Development Process",
                    steps: [
                        { title: "Discovery", description: "Requirement gathering and technical feasibility." },
                        { title: "Architecture", description: "Database schema and system design." },
                        { title: "Development", description: "Agile sprints with bi-weekly updates." },
                        { title: "Launch", description: "CI/CD pipeline and production deployment." }
                    ]
                }
            },
            {
                type: "faq",
                data: {
                    title: "Common Questions",
                    items: [
                        { question: "How long does a typical project take?", answer: "Most MVP projects take 8-12 weeks, while larger enterprise platforms may take 3-6 months depending on complexity." },
                        { question: "Do you provide post-launch support?", answer: "Yes, we offer flexible maintenance packages to ensure your app stays secure, updated, and bug-free." },
                        { question: "Who owns the code?", answer: "You do. We transfer full IP ownership and the source code repository to you upon final payment." }
                    ]
                }
            }
        ]
    },
    "mobile-app-development": {
        title: "Mobile App Development",
        subtitle: "Native and cross-platform apps for iOS and Android.",
        shortDescription: "Reach your users on every device with high-performance mobile applications built with React Native and native technologies.",
        icon: Smartphone,
        contentBlocks: [
            {
                type: "features",
                data: {
                    title: "Mobile Solutions",
                    items: [
                        { title: "Cross-Platform Apps", description: "One codebase for iOS and Android using React Native." },
                        { title: "Native Performance", description: "60fps animations and native module integration." },
                        { title: "Offline First", description: "Robust data syncing for patchy network conditions." }
                    ]
                }
            },
            {
                type: "tech-stack",
                data: {
                    title: "Mobile Technologies",
                    technologies: ["React Native", "Expo", "Swift", "Kotlin", "Firebase"]
                }
            },
            {
                type: "faq",
                data: {
                    title: "Common Questions",
                    items: [
                        { question: "Can you build for both iOS and Android?", answer: "Yes, we use React Native to build cross-platform apps that work seamlessly on both platforms with a single codebase." },
                        { question: "How do you handle app store submissions?", answer: "We take care of the entire submission process for both Apple App Store and Google Play Store, managing metadata and compliance." },
                        { question: "Can the app work offline?", answer: "Absolutely. We implement local caching and background synchronization to ensure a great user experience even without an internet connection." }
                    ]
                }
            }
        ]
    },
    "custom-software-development": {
        title: "Custom Software Development",
        subtitle: "Tailored software solutions to solve unique business challenges.",
        shortDescription: "When off-the-shelf software falls short, we engineer custom solutions designed specifically for your workflows and goals.",
        icon: Code2,
        contentBlocks: [
            {
                type: "features",
                data: {
                    title: "Tailored Engineering",
                    items: [
                        { title: "Legacy Modernization", description: "Refactoring old systems into modern microservices." },
                        { title: "API Development", description: "Robust REST and GraphQL APIs for integrations." },
                        { title: "Internal Tools", description: "Custom CRMs and ERPS to boost productivity." }
                    ]
                }
            },
            {
                type: "benefits",
                data: {
                    title: "Why Custom Software?",
                    items: [
                        { title: "Perfect Fit", description: "Built exactly for your specific workflows." },
                        { title: "Ownership", description: "You own the IP and the code, no vendor lock-in." },
                        { title: "Scalability", description: "Architected to grow with your user base." }
                    ]
                }
            },
            {
                type: "faq",
                data: {
                    title: "Common Questions",
                    items: [
                        { question: "Do you maintain legacy systems?", answer: "Yes, we specialize in modernizing legacy applications and providing ongoing support for existing software." },
                        { question: "Is the software scalable?", answer: "We architect every custom solution with scaling in mind, using cloud-native patterns that handle growth automatically." },
                        { question: "Who owns the intellectual property?", answer: "Upon project completion and payment, 100% of the IP and source code is transferred to you." }
                    ]
                }
            }
        ]
    },

    // 2. AI, AUTOMATION & CLOUD
    "ai-automation-workflow": {
        title: "AI-powered Automations",
        subtitle: "Streamline operations with intelligent agents and workflows.",
        shortDescription: "Reduce manual work by 80% with custom AI agents and automated workflows that handle repetitive tasks 24/7.",
        icon: Workflow,
        contentBlocks: [
            {
                type: "benefits",
                data: {
                    title: "Automation ROI",
                    items: [
                        { title: "Cost Reduction", description: "Cut operational costs by automating manual data entry." },
                        { title: "Speed", description: "Processes that took days now take seconds." },
                        { title: "Accuracy", description: "Eliminate human error in complex calculations." }
                    ]
                }
            },
            {
                type: "process",
                data: {
                    title: "Automation Workflow",
                    steps: [
                        { title: "Audit", description: "Identify bottlenecks in your current processes." },
                        { title: "Design", description: "Map out the automated flow." },
                        { title: "Implement", description: "Deploy n8n/Zapier or custom python scripts." },
                        { title: "Monitor", description: "Dashboard to track savings and efficiency." }
                    ]
                }
            },
            {
                type: "faq",
                data: {
                    title: "Common Questions",
                    items: [
                        { question: "What workflows can be automated?", answer: "Almost any repetitive task: data entry, lead generation, customer support, report generation, and more." },
                        { question: "Do I need to change my current tools?", answer: "No, we build automations that sit on top of your existing stack (Slack, HubSpot, Sheet, etc.) via APIs." },
                        { question: "What is the typical ROI?", answer: "Our clients usually see a 40-70% reduction in manual labor costs within the first three months of implementation." }
                    ]
                }
            }
        ]
    },
    "custom-ai-integrations": {
        title: "Custom AI Integrations",
        subtitle: "Integrate LLMs (OpenAI, Anthropic) into your internal tools.",
        shortDescription: "Empower your software with Generative AI. Chat with your data, generate content, and analyze sentiment automatically.",
        icon: Brain,
        contentBlocks: [
            {
                type: "features",
                data: {
                    title: "AI Capabilities",
                    items: [
                        { title: "RAG Pipelines", description: "Chat with your PDFs and internal knowledge base." },
                        { title: "Smart Assistants", description: "Customer support bots that actually understand context." },
                        { title: "Content Generation", description: "Auto-generate reports, emails, and summaries." }
                    ]
                }
            },
            {
                type: "tech-stack",
                data: {
                    title: "AI Stack",
                    technologies: ["OpenAI", "Anthropic", "LangChain", "Pinecone", "Python", "PyTorch", "HuggingFace", "FastAPI", "TensorFlow", "LlamaIndex"]
                }
            },
            {
                type: "faq",
                data: {
                    title: "Common Questions",
                    items: [
                        { question: "Is my data secure?", answer: "Yes, we use industry-standard encryption and secure API gateways. Your data never leaves your controlled environment." },
                        { question: "Can it work with my internal database?", answer: "Absolutely. We implement RAG (Retrieval Augmented Generation) to let the AI intelligently query your specific data." },
                        { question: "Are your AI solutions ethical?", answer: "We follow strict guidelines to prevent bias and ensure transparency in all our AI and ML implementations." }
                    ]
                }
            }
        ]
    },
    "cloud-infrastructure": {
        title: "Cloud Architecture",
        subtitle: "Secure, scalable infrastructure on AWS, GCP, and Azure.",
        shortDescription: "Build a rock-solid foundation for your applications. We design cloud-native architectures that are secure, cost-effective, and auto-scalable.",
        icon: Cloud,
        contentBlocks: [
            {
                type: "features",
                data: {
                    title: "Cloud Services",
                    items: [
                        { title: "Migration", description: "Move from on-prem to the cloud with zero downtime." },
                        { title: "DevOps", description: "CI/CD pipelines, Docker, and Kubernetes orchestration." },
                        { title: "Cost Optimization", description: "Audit and reduce your monthly cloud bill." }
                    ]
                }
            },
            {
                type: "benefits",
                data: {
                    title: "Cloud Benefits",
                    items: [
                        { title: "High Availability", description: "99.99% uptime with multi-region redundancy." },
                        { title: "Security", description: "Bank-grade encryption and IAM policies." },
                        { title: "Elasticity", description: "Auto-scale resources based on traffic demand." }
                    ]
                }
            },
            {
                type: "faq",
                data: {
                    title: "Common Questions",
                    items: [
                        { question: "Which cloud provider is best?", answer: "It depends on your needs. We provide expert advice comparing AWS, GCP, and Azure based on your specific use case." },
                        { question: "How do you handle security?", answer: "We implement multi-layer security, including VPCs, encrypted data-at-rest, and IAM roles following the principle of least privilege." },
                        { question: "Can you help with cost reduction?", answer: "Yes, our cloud audits typically save clients 20-40% on their monthly infrastructure bills." }
                    ]
                }
            }
        ]
    },

    // 3. STRATEGY, SECURITY & SCALE
    "technical-consulting": {
        title: "Technical Consulting",
        subtitle: "Expert guidance on architecture, tech stack, and roadmap.",
        shortDescription: "Make informed technical decisions. We act as your fractional CTO to guide your technology strategy and prevent costly mistakes.",
        icon: Globe,
        contentBlocks: [
            {
                type: "features",
                data: {
                    title: "Consulting Areas",
                    items: [
                        { title: "Tech Stack Selection", description: "Choosing the right tools for your long-term goals." },
                        { title: "Code Audits", description: "Reviewing legacy code for security and performance." },
                        { title: "Team Augmentation", description: "Helping you hire and structure your engineering team." }
                    ]
                }
            },
            {
                type: "faq",
                data: {
                    title: "Common Questions",
                    items: [
                        { question: "How do you charge?", answer: "We offer both project-based and retainer models." },
                        { question: "Can you review our existing code?", answer: "Yes, we provide comprehensive code audits and refactoring plans." }
                    ]
                }
            }
        ]
    },
    "security-compliance": {
        title: "Security & Compliance",
        subtitle: "Best practices, audits, and compliance readiness (SOC2/GDPR).",
        shortDescription: "Protect your data and reputation. We implement industry-standard security protocols and help you prepare for compliance certifications.",
        icon: ShieldCheck,
        contentBlocks: [
            {
                type: "features",
                data: {
                    title: "Security Services",
                    items: [
                        { title: "Penetration Testing", description: "Identifying vulnerabilities before hackers do." },
                        { title: "Compliance Prep", description: "Getting you ready for SOC2, HIPAA, and GDPR." },
                        { title: "Data Encryption", description: "End-to-end encryption for sensitive user data." }
                    ]
                }
            },
            {
                type: "benefits",
                data: {
                    title: "Peace of Mind",
                    items: [
                        { title: "Risk Mitigation", description: "Prevent costly data breaches." },
                        { title: "Trust", description: "Build confidence with your enterprise clients." },
                        { title: "Legal Safety", description: "Ensure you meet all regulatory requirements." }
                    ]
                }
            },
            {
                type: "faq",
                data: {
                    title: "Common Questions",
                    items: [
                        { question: "What compliance standards do you cover?", answer: "We specialize in SOC2, HIPAA, GDPR, and ISO 27001 readiness and implementation." },
                        { question: "Do you provide 24/7 monitoring?", answer: "Yes, we offer ongoing security operations center (SOC) services to monitor and respond to threats in real-time." },
                        { question: "What happens if a vulnerability is found?", answer: "We provide instant patching and remediation plans for any vulnerabilities identified during our audits." }
                    ]
                }
            }
        ]
    },
    "data-analytics": {
        title: "Data Analytics",
        subtitle: "Transform raw data into actionable decision-making insights.",
        shortDescription: "Stop guessing. We build data pipelines and BI dashboards that give you a 360-degree view of your business performance.",
        icon: BarChart3,
        contentBlocks: [
            {
                type: "features",
                data: {
                    title: "Data Solutions",
                    items: [
                        { title: "Data Warehousing", description: "Centralize data from multiple sources (Snowflake, BigQuery)." },
                        { title: "BI Dashboards", description: "Visual reports in PowerBI, Tableau, or Custom UI." },
                        { title: "Predictive Analytics", description: "Forecast trends using historical data." }
                    ]
                }
            },
            {
                type: "tech-stack",
                data: {
                    title: "Data Tech",
                    technologies: ["Python", "SQL", "Snowflake", "PowerBI", "dbt"]
                }
            },
            {
                type: "faq",
                data: {
                    title: "Common Questions",
                    items: [
                        { question: "What data sources can you integrate?", answer: "We can connect to almost any source: SQL databases, NoSQL, APIs, CRMs, and flat files (CSV/Excel)." },
                        { question: "Do you build custom dashboards?", answer: "Yes, we build bespoke dashboards tailored to your specific KPIs, using tools like React, D3.js, or PowerBI." },
                        { question: "Can you help with predictive modeling?", answer: "Absolutely. We use machine learning to forecast trends and identify growth opportunities from your historical data." }
                    ]
                }
            }
        ]
    },
}

export const serviceCategories = [
    {
        title: "Product Engineering",
        description: "We design and build scalable, production-ready software products.",
        services: ["web-application-development", "mobile-app-development", "custom-software-development"],
    },
    {
        title: "AI, Automation & Cloud",
        description: "We enhance products with intelligent automation and reliable foundations.",
        services: ["ai-automation-workflow", "custom-ai-integrations", "cloud-infrastructure"],
    },
    {
        title: "Strategy, Security & Scale",
        description: "We help teams make the right technical decisions — and scale safely.",
        services: ["technical-consulting", "security-compliance", "data-analytics"],
    },
]

export const industrySolutions = [
    {
        title: "Aesthetic Clinics",
        href: "/solutions/aesthetic-clinics",
        description: "AI-powered appointment conversion & automation for aesthetic clinics.",
    },
    {
        title: "Real Estate Agencies",
        href: "/solutions/real-estate",
        description: "Automated property inquiry qualification and viewing bookings.",
    },
    {
        title: "Diet & Nutrition",
        href: "/solutions/diet-nutrition",
        description: "Automate diet inquiries, consultations, and plan signups.",
    },
    {
        title: "AI Voice Receptionist (Med Spas)",
        href: "/solutions/never-miss-a-medspa-call",
        description: "24/7 call answering and consultation booking for US med spas.",
    },
    {
        title: "AI Call Answering (HVAC & Plumbing)",
        href: "/solutions/never-miss-a-call",
        description: "24/7 AI dispatcher for HVAC, plumbing, and electrical contractors.",
    },
]
