import { company } from "./site";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalPage = {
  title: string;
  slug: string;
  description: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: LegalSection[];
};

const contactEmail = "hillacict@gmail.com";

export const legalPages: LegalPage[] = [
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    description: "How Hillaac ICT Solutions collects, uses, protects, and manages information submitted through this website.",
    effectiveDate: "July 19, 2026",
    lastUpdated: "July 19, 2026",
    sections: [
      {
        heading: "Information We Collect",
        paragraphs: [
          `When you use the contact form or contact ${company.name}, we may collect information you choose to provide, including your name, email address, phone number, company name, service interest, and project details.`,
          "We may also receive basic technical information from normal website operation, such as browser type, device information, pages visited, timestamps, and security logs. This information helps us keep the website reliable and secure."
        ]
      },
      {
        heading: "How We Use Information",
        paragraphs: [
          "We use submitted information to respond to inquiries, understand project needs, prepare follow-up questions, discuss possible services, and improve the clarity of our website and communication.",
          "Submitting a form does not create a contract, but it allows us to contact you about your request and related service information."
        ]
      },
      {
        heading: "Email Communication",
        paragraphs: [
          "If you submit your email address, we may use it to reply to your inquiry, send project-related communication, or follow up on a request you started.",
          "We do not use the current website for advertising cookies or analytics-based marketing. If marketing tools are added later, this policy should be updated before relying on them."
        ]
      },
      {
        heading: "Security Monitoring and Technical Logs",
        paragraphs: [
          "The website and hosting environment may create technical logs for security, troubleshooting, abuse prevention, and reliability monitoring.",
          "These logs are used for practical website operation and are not intended to identify visitors beyond what is necessary for security and support."
        ]
      },
      {
        heading: "Data Retention",
        paragraphs: [
          "We keep inquiry information only for as long as reasonably needed to respond, manage project communication, maintain business records, or resolve security and operational issues.",
          "If a project does not proceed, we may still retain limited communication history for reference unless deletion is requested and no legitimate need requires retention."
        ]
      },
      {
        heading: "Data Protection Practices",
        paragraphs: [
          "We use practical safeguards such as access control, careful handling of submitted information, secure hosting practices, and limiting access to people who need the information to respond or provide services.",
          "No website can guarantee absolute security, but we aim to handle submitted information responsibly and reduce avoidable risk."
        ]
      },
      {
        heading: "When Information May Be Shared",
        paragraphs: [
          "We may share information with trusted service providers when needed to operate the website, deliver email, host the site, support project communication, or comply with a valid legal obligation.",
          "We do not sell contact form submissions."
        ]
      },
      {
        heading: "Your Rights and Choices",
        paragraphs: [
          "You may request correction, deletion, or a copy of information you provided through the website, subject to reasonable identity verification and any legitimate business or legal need to retain certain records.",
          `To request correction or deletion, contact us at ${contactEmail}.`
        ]
      }
    ]
  },
  {
    title: "Terms of Service",
    slug: "terms-of-service",
    description: "Terms for using the public Hillaac ICT Solutions website and understanding service information.",
    effectiveDate: "July 19, 2026",
    lastUpdated: "July 19, 2026",
    sections: [
      {
        heading: "Use of This Website",
        paragraphs: [
          `This website provides general information about ${company.name}, our services, portfolio entries, articles, and ways to contact us.`,
          "You may use the public website for lawful, personal, informational, and business inquiry purposes."
        ]
      },
      {
        heading: "Intellectual Property",
        paragraphs: [
          "The website design, text, graphics, branding, layout, and other content are owned by Hillaac ICT Solutions or used with permission unless otherwise stated.",
          "You may not copy, republish, or reuse website materials in a way that suggests ownership, endorsement, or partnership without written permission."
        ]
      },
      {
        heading: "Acceptable Use",
        paragraphs: [
          "You must not misuse the website, attempt unauthorized access, submit harmful content, interfere with website operation, or use the site for unlawful activity.",
          "We may restrict access or take appropriate action if website misuse is detected."
        ]
      },
      {
        heading: "Service Information and Quotations",
        paragraphs: [
          "Service descriptions, portfolio examples, blog content, and website information are provided for general understanding. They are not a guaranteed quotation, fixed scope, timeline, or promise of specific results.",
          "Formal project scope, pricing, timelines, deliverables, and responsibilities should be confirmed in a written proposal, agreement, or statement of work."
        ]
      },
      {
        heading: "No Automatic Contract",
        paragraphs: [
          "Submitting a contact form, sending an email, or contacting Hillaac ICT Solutions does not automatically create a contract or require us to accept a project.",
          "A contract exists only when both sides agree to clear terms through an appropriate written agreement or confirmed commercial arrangement."
        ]
      },
      {
        heading: "External Links",
        paragraphs: [
          "This website may include links to external websites or platforms. We do not control external websites and are not responsible for their content, security, or policies.",
          "You should review the terms and privacy policies of any external website you choose to visit."
        ]
      },
      {
        heading: "Limitation of Liability",
        paragraphs: [
          "We aim to keep the website accurate and available, but we do not guarantee that it will always be error-free, uninterrupted, or fully current.",
          "To the extent allowed by applicable law, Hillaac ICT Solutions is not responsible for indirect losses arising from use of the public website or reliance on general website content."
        ]
      },
      {
        heading: "Changes and Contact",
        paragraphs: [
          "We may update these terms when the website, services, or business practices change. The last updated date will show when this page was most recently revised.",
          `Questions about these terms can be sent to ${contactEmail}.`
        ]
      }
    ]
  },
  {
    title: "Cookie Policy",
    slug: "cookie-policy",
    description: "How this website uses browser storage and what may change if analytics are added later.",
    effectiveDate: "July 19, 2026",
    lastUpdated: "July 19, 2026",
    sections: [
      {
        heading: "Current Browser Storage Use",
        paragraphs: [
          "The current website uses browser localStorage to remember your light or dark mode preference. This helps the site keep the selected theme when you return or navigate between pages.",
          "The theme preference is stored in your browser under a local value such as theme. It is not used for advertising, tracking, analytics, or profiling."
        ]
      },
      {
        heading: "Contact Form and Cookies",
        paragraphs: [
          "The contact form does not require advertising cookies or analytics cookies to submit a message.",
          "Normal hosting and security systems may still process technical request information as part of delivering and protecting the website."
        ]
      },
      {
        heading: "No Analytics or Advertising Cookies Yet",
        paragraphs: [
          "This website does not currently add analytics, retargeting, or advertising cookies.",
          "If analytics, marketing pixels, or similar tools are added in a future task, this Cookie Policy should be updated and a cookie consent approach should be reviewed where appropriate."
        ]
      },
      {
        heading: "Managing Local Storage",
        paragraphs: [
          "You can clear localStorage through your browser settings. If you clear it, the website may return to the default or system theme preference.",
          `Questions about browser storage can be sent to ${contactEmail}.`
        ]
      }
    ]
  },
  {
    title: "Disclaimer",
    slug: "disclaimer",
    description: "Important notes about general website information, service descriptions, external links, and project expectations.",
    effectiveDate: "July 19, 2026",
    lastUpdated: "July 19, 2026",
    sections: [
      {
        heading: "General Information Only",
        paragraphs: [
          "The content on this website is provided for general information about Hillaac ICT Solutions, digital services, portfolio structures, and business technology topics.",
          "It should not be treated as legal, financial, compliance, procurement, or professional advice for a specific situation."
        ]
      },
      {
        heading: "Service Descriptions Are Not Quotations",
        paragraphs: [
          "Descriptions of services, technologies, processes, and project examples are intended to explain how we work. They are not guaranteed quotations, timelines, prices, or final deliverables.",
          "Every project depends on confirmed requirements, scope, content, approvals, integrations, timeline, and agreement between the parties."
        ]
      },
      {
        heading: "Project Results May Vary",
        paragraphs: [
          "Digital project outcomes depend on many factors, including business model, market conditions, implementation, content quality, training, maintenance, and ongoing operations.",
          "We do not promise identical results for every client or project."
        ]
      },
      {
        heading: "Technology Information May Change",
        paragraphs: [
          "Technology tools, platforms, libraries, hosting practices, and security recommendations can change over time.",
          "We aim to keep website information useful, but older content may not always reflect the latest technical options or best practices."
        ]
      },
      {
        heading: "External Links",
        paragraphs: [
          "External links are provided for convenience or communication. Hillaac ICT Solutions does not control external websites and is not responsible for their content, policies, availability, or security.",
          `For questions about this disclaimer, contact ${contactEmail}.`
        ]
      }
    ]
  }
];

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}
