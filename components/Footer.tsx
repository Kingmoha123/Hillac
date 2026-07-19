"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { legalPages } from "@/data/legal";
import { company, navigation, services } from "@/data/site";
import { CookieSettingsButton } from "./CookieSettingsButton";
import { Logo } from "./Logo";
import { TrackedLink } from "./TrackedLink";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>
            Premium technology solutions from Mogadishu for ambitious companies,
            NGOs, institutions, and startups across Somalia and East Africa.
          </p>
          <strong>{company.slogan}</strong>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Services</h3>
          <ul>
            {services.slice(0, 6).map((service) => (
              <li key={service.title}>
                <Link href="/services">{service.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <ul>
            <li>{company.location}</li>
            <li>
              <TrackedLink
                href={`mailto:${company.email}`}
                eventName="footer_contact_click"
                eventProperties={{ cta_location: "footer_email", link_type: "email" }}
              >
                {company.email}
              </TrackedLink>
            </li>
            <li>
              <TrackedLink
                href={`https://wa.me/${company.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                eventName="whatsapp_click"
                eventProperties={{ cta_location: "footer", link_type: "whatsapp" }}
              >
                {company.phone}
              </TrackedLink>
            </li>
          </ul>
          <TrackedLink
            className="footer-contact-cta"
            href="/contact"
            eventName="footer_contact_click"
            eventProperties={{ cta_location: "footer_contact_cta", link_type: "contact_cta" }}
          >
            Start a Conversation
          </TrackedLink>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>&copy; {new Date().getFullYear()} {company.name}. All rights reserved.</span>
        <nav className="footer-legal-links" aria-label="Legal links">
          {legalPages.map((page) => (
            <Link key={page.slug} href={`/${page.slug}`}>
              {page.title}
            </Link>
          ))}
          <CookieSettingsButton />
        </nav>
      </div>
    </footer>
  );
}
