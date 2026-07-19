export const company = {
  name: "Hillaac ICT Solutions",
  shortName: "Hillaac",
  slogan: "Xawaare. Hal-abuur. Xal.",
  location: "Maka Al Mukarama Street, Mogadishu, Somalia",
  email: "hillacict@gmail.com",
  phone: "+252 61 728 6400",
  whatsapp: "252617286400",
  website: "hillac-ict-solutions.vercel.app"
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Industries", href: "/industries" },
  { label: "Technologies", href: "/technologies" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" }
];

export const services = [
  {
    title: "Branding & Graphic Design",
    icon: "pen",
    summary: "Memorable identities, brand systems, pitch decks, profiles, and marketing assets.",
    details: "We create premium visual systems that help Somali companies look trusted, modern, and ready for enterprise clients."
  },
  {
    title: "Website Development",
    icon: "globe",
    summary: "Fast corporate websites, portals, landing pages, and SEO-ready digital platforms.",
    details: "Next.js websites with strong content hierarchy, responsive layouts, analytics, accessibility, and conversion-focused journeys."
  },
  {
    title: "Mobile App Development",
    icon: "phone",
    summary: "Cross-platform apps for Android and iOS with elegant, reliable experiences.",
    details: "We design and build mobile products with clean onboarding, offline-ready flows, notifications, and secure API connections."
  },
  {
    title: "Custom Software Systems",
    icon: "code",
    summary: "ERP, POS, inventory, school, hospital, finance, and operations systems.",
    details: "Tailored systems that automate daily workflows, reduce paperwork, and give teams live dashboards for better decisions."
  },
  {
    title: "Cloud & IT Solutions",
    icon: "cloud",
    summary: "Secure hosting, backups, deployments, email setup, domains, and IT consultancy.",
    details: "Reliable cloud foundations using AWS, Docker, secure access controls, monitoring, and structured support."
  },
  {
    title: "UI/UX Design",
    icon: "spark",
    summary: "Research, wireframes, product design, design systems, and clickable prototypes.",
    details: "Interfaces designed for speed, clarity, trust, and smooth adoption by real business users."
  },
  {
    title: "Digital Marketing & SEO",
    icon: "trend",
    summary: "Campaigns, search optimization, social content, and growth strategy.",
    details: "We help brands become discoverable and credible with SEO, content planning, paid campaigns, and reporting."
  },
  {
    title: "Video & Motion Graphics",
    icon: "video",
    summary: "Promotional videos, explainers, social media motion, and launch content.",
    details: "Sharp visual storytelling for campaigns, company profiles, product launches, and investor presentations."
  }
];

export const stats = [
  { value: "Custom-Built", label: "Solutions" },
  { value: "Responsive", label: "Support" },
  { value: "Secure", label: "Development" },
  { value: "End-to-End", label: "Delivery" }
];

export const whyChooseUs = [
  { title: "Speed", text: "Lean delivery, fast iteration, and performance-first builds." },
  { title: "Innovation", text: "Modern tools, smart automation, and future-ready architecture." },
  { title: "Quality", text: "Polished interfaces, clean code, and careful launch checks." },
  { title: "Security", text: "Secure-by-default hosting, permissions, backups, and data practices." },
  { title: "Support", text: "Clear communication before, during, and after launch." },
  { title: "Professional Team", text: "Designers, developers, and consultants focused on business outcomes." }
];

export type PortfolioCategory = "Websites" | "Mobile Apps" | "Business Systems" | "Branding" | "UI/UX";

export type ProjectImage = {
  src: string | null;
  alt: string;
  label: string;
};

export type Project = {
  title: string;
  slug: string;
  category: PortfolioCategory;
  shortDescription: string;
  overview: string;
  client: string;
  services: string[];
  technologies: string[];
  challenges: string[];
  solution: string;
  keyFeatures: string[];
  results: string[];
  coverImage: ProjectImage;
  galleryImages: ProjectImage[];
  liveProjectUrl: string | null;
  githubUrl: string | null;
  status: string;
  completionYear: string;
  featured: boolean;
};

export const portfolioCategories = [
  "All",
  "Websites",
  "Mobile Apps",
  "Business Systems",
  "Branding",
  "UI/UX"
] as const;

export const projects: Project[] = [
  {
    title: "DeynRaac Business Management",
    slug: "deynraac-business-management",
    category: "Business Systems",
    shortDescription: "Placeholder case study for a business management system. Verified scope and screenshots are pending.",
    overview: "DeynRaac is included as a structured portfolio entry so Hillaac can document verified business goals, workflow details, screens, and launch outcomes when available.",
    client: "Internal Project",
    services: ["Business system planning", "Dashboard UX", "Workflow design"],
    technologies: ["Technology stack pending confirmation"],
    challenges: [
      "Project requirements and production scope still need confirmation.",
      "Real screenshots and measurable results have not been added yet."
    ],
    solution: "The case study is prepared with sections for workflow design, role-based dashboards, reporting, and future implementation notes once verified project details are available.",
    keyFeatures: ["Business workflow structure", "Management dashboard placeholder", "Reporting area placeholder"],
    results: ["Case study ready for verified project details and assets."],
    coverImage: {
      src: null,
      alt: "Placeholder visual for DeynRaac business management case study",
      label: "Business Management"
    },
    galleryImages: [
      { src: null, alt: "DeynRaac dashboard screenshot placeholder", label: "Dashboard" },
      { src: null, alt: "DeynRaac workflow screenshot placeholder", label: "Workflow" }
    ],
    liveProjectUrl: null,
    githubUrl: null,
    status: "Information Needed",
    completionYear: "Pending",
    featured: true
  },
  {
    title: "Cooperative Investment Platform",
    slug: "cooperative-investment-platform",
    category: "Business Systems",
    shortDescription: "Placeholder case study for a cooperative investment platform. Verified product details are pending.",
    overview: "This entry gives Hillaac a professional case study structure for documenting investment workflows, member journeys, approvals, and reporting once the information is verified.",
    client: "Internal Project",
    services: ["Product planning", "Business systems design", "UI/UX structure"],
    technologies: ["Technology stack pending confirmation"],
    challenges: [
      "Member, contribution, approval, and reporting requirements still need verification.",
      "No public launch link or screenshots are currently available in the repository."
    ],
    solution: "The case study framework is ready to capture platform modules, service scope, technology decisions, and delivery outcomes without publishing unverified claims.",
    keyFeatures: ["Member journey placeholder", "Investment workflow placeholder", "Admin reporting placeholder"],
    results: ["Prepared for verified screenshots, links, and implementation details."],
    coverImage: {
      src: null,
      alt: "Placeholder visual for cooperative investment platform case study",
      label: "Investment Platform"
    },
    galleryImages: [
      { src: null, alt: "Cooperative platform member portal screenshot placeholder", label: "Member Portal" },
      { src: null, alt: "Cooperative platform reporting screenshot placeholder", label: "Reports" }
    ],
    liveProjectUrl: null,
    githubUrl: null,
    status: "Information Needed",
    completionYear: "Pending",
    featured: false
  },
  {
    title: "School Management System",
    slug: "school-management-system",
    category: "Business Systems",
    shortDescription: "Placeholder case study for a school operations platform. Verified school and feature details are pending.",
    overview: "This portfolio entry is structured to document admissions, classes, payments, attendance, communication, and reporting after verified project information is available.",
    client: "Internal Project",
    services: ["System architecture", "Admin dashboard design", "Education workflow planning"],
    technologies: ["Technology stack pending confirmation"],
    challenges: [
      "The exact school workflow, user roles, and launch status need confirmation.",
      "Repository content does not include real screenshots or client-approved outcomes."
    ],
    solution: "The case study template supports a full education platform narrative while keeping current claims limited to confirmed placeholder information.",
    keyFeatures: ["Student records placeholder", "Attendance workflow placeholder", "Payments module placeholder"],
    results: ["Ready for verified launch information and education-sector screenshots."],
    coverImage: {
      src: null,
      alt: "Placeholder visual for school management system case study",
      label: "School System"
    },
    galleryImages: [
      { src: null, alt: "School management student records screenshot placeholder", label: "Student Records" },
      { src: null, alt: "School management reporting screenshot placeholder", label: "Reports" }
    ],
    liveProjectUrl: null,
    githubUrl: null,
    status: "Information Needed",
    completionYear: "Pending",
    featured: true
  },
  {
    title: "Quran Connect",
    slug: "quran-connect",
    category: "Mobile Apps",
    shortDescription: "Placeholder case study for Quran Connect. Verified platform, features, and assets are pending.",
    overview: "Quran Connect is included as a placeholder portfolio entry so Hillaac can later document the approved product scope, app screens, user flows, and outcomes.",
    client: "Internal Project",
    services: ["Mobile experience planning", "UI/UX structure", "Product documentation"],
    technologies: ["Technology stack pending confirmation"],
    challenges: [
      "The repository does not contain verified app requirements or screenshots.",
      "Public app store links and launch status still need confirmation."
    ],
    solution: "The case study is ready to present mobile screens, feature modules, and product decisions once verified information is provided.",
    keyFeatures: ["Mobile app structure placeholder", "Learning flow placeholder", "Content experience placeholder"],
    results: ["Awaiting verified app assets, links, and delivery details."],
    coverImage: {
      src: null,
      alt: "Placeholder visual for Quran Connect case study",
      label: "Mobile Experience"
    },
    galleryImages: [
      { src: null, alt: "Quran Connect home screen screenshot placeholder", label: "Home Screen" },
      { src: null, alt: "Quran Connect learning flow screenshot placeholder", label: "Learning Flow" }
    ],
    liveProjectUrl: null,
    githubUrl: null,
    status: "Information Needed",
    completionYear: "Pending",
    featured: true
  },
  {
    title: "Notary Agreement System",
    slug: "notary-agreement-system",
    category: "Business Systems",
    shortDescription: "Placeholder case study for a notary agreement workflow system. Verified legal workflow details are pending.",
    overview: "This entry provides a professional structure for documenting agreement preparation, approval flows, secure records, and operational outcomes after details are verified.",
    client: "Internal Project",
    services: ["Workflow mapping", "Business system UX", "Secure process planning"],
    technologies: ["Technology stack pending confirmation"],
    challenges: [
      "Legal workflow requirements and public project status require confirmation.",
      "No client-approved assets or links are currently available in the repository."
    ],
    solution: "The case study keeps sensitive details out while preparing sections for verified workflows, features, technology, and delivery notes.",
    keyFeatures: ["Agreement workflow placeholder", "Document record placeholder", "Approval process placeholder"],
    results: ["Prepared for verified information, screenshots, and approved public details."],
    coverImage: {
      src: null,
      alt: "Placeholder visual for notary agreement system case study",
      label: "Agreement System"
    },
    galleryImages: [
      { src: null, alt: "Notary agreement workflow screenshot placeholder", label: "Workflow" },
      { src: null, alt: "Notary agreement records screenshot placeholder", label: "Records" }
    ],
    liveProjectUrl: null,
    githubUrl: null,
    status: "Information Needed",
    completionYear: "Pending",
    featured: false
  }
];

export const industries = [
  "Finance & Mobile Money",
  "Healthcare",
  "Education",
  "Government",
  "NGOs",
  "Retail & Wholesale",
  "Real Estate",
  "Logistics",
  "Hospitality",
  "Startups"
];

export const technologies = [
  "React",
  "Next.js",
  "Flutter",
  "Node.js",
  "Python",
  "Laravel",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "Firebase",
  "AWS",
  "Docker",
  "GitHub",
  "Figma"
];

export const process = [
  { step: "01", title: "Discover", text: "We listen, audit your current workflow, and define the business goal." },
  { step: "02", title: "Plan", text: "We map features, timeline, content, user journeys, and technical architecture." },
  { step: "03", title: "Design", text: "We create elegant interfaces and prototypes aligned with your brand." },
  { step: "04", title: "Develop", text: "We build responsive, secure, scalable software with clean code." },
  { step: "05", title: "Test", text: "We test performance, responsiveness, forms, content, and launch readiness." },
  { step: "06", title: "Launch & Support", text: "We deploy, monitor, train your team, and continue improving." }
];

export const testimonials = [
  {
    quote: "Discovery starts with business goals, audience, workflow, content, and launch expectations before design or development begins.",
    name: "Clear Discovery",
    role: "Delivery Commitment"
  },
  {
    quote: "Every build is reviewed for responsiveness, accessibility, contact flow, metadata, and production readiness before launch.",
    name: "Launch QA",
    role: "Quality Commitment"
  },
  {
    quote: "Public case studies stay clearly marked until screenshots, project scope, links, and outcomes are approved for publication.",
    name: "Verified Portfolio",
    role: "Trust Commitment"
  }
];

export const jobs = [
  {
    title: "Frontend Developer",
    location: "Somalia / Remote",
    type: "Talent Pool",
    description: "Future collaboration area for refined React and Next.js interfaces across websites, dashboards, and portals."
  },
  {
    title: "UI/UX Designer",
    location: "Somalia / Remote",
    type: "Talent Pool",
    description: "Future collaboration area for brand systems, web experiences, mobile apps, and clickable prototypes."
  },
  {
    title: "Digital Marketing Specialist",
    location: "Remote",
    type: "Talent Pool",
    description: "Future collaboration area for campaigns, SEO, content planning, and performance reporting."
  }
];
