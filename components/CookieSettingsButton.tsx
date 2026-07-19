"use client";

import { isAnalyticsConfigured } from "@/lib/analytics";

export function CookieSettingsButton() {
  if (!isAnalyticsConfigured()) {
    return null;
  }

  return (
    <button
      type="button"
      className="footer-legal-button"
      onClick={() => window.dispatchEvent(new CustomEvent("hillaac:open-cookie-settings"))}
    >
      Cookie Settings
    </button>
  );
}
