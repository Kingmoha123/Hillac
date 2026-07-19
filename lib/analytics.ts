export const GA_MEASUREMENT_ID = normalizeGaMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
export const ANALYTICS_DEBUG = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true";
export const ANALYTICS_CONSENT_KEY = "hillaac_analytics_consent";

export type AnalyticsConsent = "accepted" | "rejected";

export type AnalyticsEventName =
  | "hero_primary_cta_click"
  | "hero_portfolio_click"
  | "header_start_project_click"
  | "whatsapp_click"
  | "contact_form_start"
  | "contact_form_submit"
  | "contact_form_success"
  | "contact_form_error"
  | "portfolio_case_study_view"
  | "portfolio_project_click"
  | "blog_article_view"
  | "blog_article_click"
  | "service_interest_click"
  | "footer_contact_click";

export type AnalyticsEventProperties = {
  page_path?: string;
  page_title?: string;
  cta_location?: string;
  service_name?: string;
  project_slug?: string;
  project_title?: string;
  blog_slug?: string;
  blog_category?: string;
  link_type?: "case_study" | "live_project" | "github" | "email" | "whatsapp" | "contact_cta";
  error_type?: "validation" | "server" | "network";
};

type GtagCommand = "config" | "consent" | "event" | "js";
type GtagParams = Record<string, string | number | boolean | Date | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: GtagCommand, target: string | Date, params?: GtagParams) => void;
  }
}

export function isAnalyticsConfigured() {
  return Boolean(GA_MEASUREMENT_ID);
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setAnalyticsConsent(value: AnalyticsConsent) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("hillaac:analytics-consent-change", { detail: value }));
}

export function hasAnalyticsConsent() {
  return getAnalyticsConsent() === "accepted";
}

export function updateGoogleConsent(value: AnalyticsConsent) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("consent", "update", {
    analytics_storage: value === "accepted" ? "granted" : "denied"
  });
}

export function trackPageView(pagePath: string, pageTitle?: string) {
  if (!canTrack()) {
    return;
  }

  const params = {
    page_path: pagePath,
    page_title: pageTitle
  };

  window.gtag?.("event", "page_view", params);
  debugAnalytics("page_view", params);
}

export function trackEvent(eventName: AnalyticsEventName, properties: AnalyticsEventProperties = {}) {
  if (!canTrack()) {
    return;
  }

  const params = {
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    ...properties
  };

  window.gtag?.("event", eventName, params);
  debugAnalytics(eventName, params);
}

function canTrack() {
  return (
    typeof window !== "undefined" &&
    isAnalyticsConfigured() &&
    hasAnalyticsConsent() &&
    typeof window.gtag === "function"
  );
}

function debugAnalytics(eventName: string, properties: AnalyticsEventProperties) {
  if (!ANALYTICS_DEBUG) {
    return;
  }

  console.info("[analytics]", eventName, properties);
}

function normalizeGaMeasurementId(value: string | undefined) {
  const trimmed = value?.trim() || "";
  return /^G-[A-Z0-9]+$/i.test(trimmed) ? trimmed : "";
}
