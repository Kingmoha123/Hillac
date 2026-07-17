import { company } from "@/data/site";
import { ButtonLink } from "./ButtonLink";
import { Icon } from "./Icon";
import { SectionHeader } from "./SectionHeader";

export function ContactSection() {
  return (
    <section className="section contact-section">
      <div className="container contact-grid">
        <div>
          <SectionHeader
            eyebrow="Contact"
            title="Ready to build something premium?"
            text="Tell us what you want to launch. We will help shape the idea, estimate the work, and guide the next step."
          />
          <div className="contact-list">
            <p><Icon name="phone" className="icon-small" /> {company.phone}</p>
            <p><Icon name="globe" className="icon-small" /> {company.location}</p>
            <p><Icon name="spark" className="icon-small" /> {company.slogan}</p>
          </div>
          <ButtonLink href={`https://wa.me/${company.whatsapp}`} variant="primary">Chat on WhatsApp</ButtonLink>
        </div>
        <form className="contact-form">
          <label>
            Full Name
            <input type="text" placeholder="Your name" required />
          </label>
          <label>
            Email
            <input type="email" placeholder="you@company.com" required />
          </label>
          <label>
            Service Needed
            <select defaultValue="Website Development">
              <option>Website Development</option>
              <option>Mobile App Development</option>
              <option>Custom Software System</option>
              <option>Branding & Design</option>
              <option>Cloud & IT Consultancy</option>
            </select>
          </label>
          <label>
            Project Details
            <textarea rows={5} placeholder="Tell us about your business goal..." required />
          </label>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}
