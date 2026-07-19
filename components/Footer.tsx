import Link from "next/link";
import { legalPages } from "@/data/legal";
import { company, navigation, services } from "@/data/site";
import { Logo } from "./Logo";

export function Footer() {
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
            <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
            <li><a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer">{company.phone}</a></li>
          </ul>
          <form className="newsletter">
            <input type="email" placeholder="Email address" aria-label="Email address" />
            <button type="submit">Join</button>
          </form>
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
        </nav>
      </div>
    </footer>
  );
}
