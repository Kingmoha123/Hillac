"use client";

import { FormEvent, useRef, useState } from "react";
import { company } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { ButtonLink } from "./ButtonLink";
import { Icon } from "./Icon";
import { SectionHeader } from "./SectionHeader";

type ContactFormValues = {
  fullName: string;
  email: string;
  service: string;
  message: string;
  companyName: string;
  startedAt: number;
};

type ContactFormErrors = Partial<Record<keyof Pick<ContactFormValues, "fullName" | "email" | "message">, string>>;

const serviceOptions = [
  "Website Development",
  "Mobile App Development",
  "Custom Software System",
  "Branding & Design",
  "Cloud & IT Consultancy"
];

const initialValues = (): ContactFormValues => ({
  fullName: "",
  email: "",
  service: "Website Development",
  message: "",
  companyName: "",
  startedAt: Date.now()
});

function validateForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (values.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  if (!emailPattern.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (values.message.trim().length < 10) {
    errors.message = "Please share at least 10 characters about your project.";
  }

  return errors;
}

export function ContactSection() {
  const [values, setValues] = useState<ContactFormValues>(() => initialValues());
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);
  const hasTrackedStart = useRef(false);

  const updateField = (field: keyof ContactFormValues, value: string) => {
    if (!hasTrackedStart.current && field !== "companyName") {
      hasTrackedStart.current = true;
      trackEvent("contact_form_start", { cta_location: "contact_form" });
    }

    setValues((current) => ({ ...current, [field]: value }));
    setStatusMessage(null);
    setStatusType(null);

    if (field === "fullName" || field === "email" || field === "message") {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    trackEvent("contact_form_submit", { cta_location: "contact_form" });

    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      trackEvent("contact_form_error", { cta_location: "contact_form", error_type: "validation" });
      setStatusType("error");
      setStatusMessage("Please fix the highlighted fields and try again.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    setStatusType(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Unable to send your message right now.");
      }

      setValues(initialValues());
      setStatusType("success");
      setStatusMessage(result.message || "Thank you. Your message has been sent.");
      hasTrackedStart.current = false;
      trackEvent("contact_form_success", { cta_location: "contact_form" });
    } catch (error) {
      setStatusType("error");
      setStatusMessage(error instanceof Error ? error.message : "Unable to send your message right now.");
      trackEvent("contact_form_error", { cta_location: "contact_form", error_type: "server" });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <ButtonLink
            href={`https://wa.me/${company.whatsapp}`}
            variant="primary"
            analyticsEvent="whatsapp_click"
            analyticsProperties={{ cta_location: "contact_section" }}
          >
            Chat on WhatsApp
          </ButtonLink>
        </div>
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <label>
            Full Name
            <input
              type="text"
              name="fullName"
              placeholder="Your name"
              value={values.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              autoComplete="name"
              required
            />
            {errors.fullName ? <span className="contact-field-error" id="fullName-error">{errors.fullName}</span> : null}
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
              required
            />
            {errors.email ? <span className="contact-field-error" id="email-error">{errors.email}</span> : null}
          </label>
          <label>
            Service Needed
            <select
              name="service"
              value={values.service}
              onChange={(event) => updateField("service", event.target.value)}
            >
              {serviceOptions.map((service) => (
                <option key={service}>{service}</option>
              ))}
            </select>
          </label>
          <label>
            Project Details
            <textarea
              name="message"
              rows={5}
              placeholder="Tell us about your business goal..."
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
              required
            />
            {errors.message ? <span className="contact-field-error" id="message-error">{errors.message}</span> : null}
          </label>
          <label className="contact-honeypot" aria-hidden="true">
            Company
            <input
              type="text"
              name="companyName"
              value={values.companyName}
              onChange={(event) => updateField("companyName", event.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
          {statusMessage ? (
            <p className={`contact-form-status ${statusType === "success" ? "is-success" : "is-error"}`} role="status">
              {statusMessage}
            </p>
          ) : null}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
