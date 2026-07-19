"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AnalyticsConsent,
  getAnalyticsConsent,
  isAnalyticsConfigured,
  setAnalyticsConsent,
  updateGoogleConsent
} from "@/lib/analytics";

export function CookieConsentBanner() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      setConsent(getAnalyticsConsent());
      setSettingsOpen(false);
    };
    const openSettings = () => setSettingsOpen(true);

    setHydrated(true);
    syncConsent();
    window.addEventListener("hillaac:analytics-consent-change", syncConsent);
    window.addEventListener("hillaac:open-cookie-settings", openSettings);

    return () => {
      window.removeEventListener("hillaac:analytics-consent-change", syncConsent);
      window.removeEventListener("hillaac:open-cookie-settings", openSettings);
    };
  }, []);

  if (pathname.startsWith("/admin") || !hydrated || !isAnalyticsConfigured() || (consent && !settingsOpen)) {
    return null;
  }

  const saveConsent = (value: AnalyticsConsent) => {
    setAnalyticsConsent(value);
    updateGoogleConsent(value);
  };

  return (
    <section className="cookie-consent" aria-labelledby="cookie-consent-heading" role="region">
      <div>
        <h2 id="cookie-consent-heading">Analytics Preferences</h2>
        <p>
          Hillaac uses Google Analytics only with your permission to understand aggregate traffic and improve the
          website. Contact form details are not sent to analytics.
        </p>
      </div>
      <div className="cookie-consent-actions">
        <button type="button" className="button secondary" onClick={() => saveConsent("rejected")}>
          Reject analytics
        </button>
        <button type="button" className="button primary" onClick={() => saveConsent("accepted")}>
          Accept analytics
        </button>
      </div>
    </section>
  );
}
