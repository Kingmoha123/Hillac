"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  ANALYTICS_DEBUG,
  GA_MEASUREMENT_ID,
  getAnalyticsConsent,
  isAnalyticsConfigured,
  trackPageView,
  updateGoogleConsent
} from "@/lib/analytics";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    const syncConsent = () => setConsent(getAnalyticsConsent());

    syncConsent();
    window.addEventListener("hillaac:analytics-consent-change", syncConsent);

    return () => window.removeEventListener("hillaac:analytics-consent-change", syncConsent);
  }, []);

  useEffect(() => {
    if (consent === "accepted") {
      updateGoogleConsent("accepted");
    }

    if (consent === "rejected") {
      updateGoogleConsent("rejected");
    }
  }, [consent]);

  useEffect(() => {
    if (!scriptReady || consent !== "accepted" || !isAnalyticsConfigured()) {
      return;
    }

    if (pathname.startsWith("/admin")) {
      return;
    }

    const queryString = window.location.search.replace(/^\?/, "");
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;
    const frame = window.requestAnimationFrame(() => {
      trackPageView(pagePath, document.title);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [consent, pathname, scriptReady]);

  if (pathname.startsWith("/admin") || !isAnalyticsConfigured() || consent !== "accepted") {
    return null;
  }

  return (
    <>
      <Script
        id="ga-data-layer"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', { analytics_storage: 'granted' });
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false,
              debug_mode: ${ANALYTICS_DEBUG ? "true" : "false"}
            });
          `
        }}
      />
      <Script
        id="ga-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onReady={() => setScriptReady(true)}
      />
    </>
  );
}
