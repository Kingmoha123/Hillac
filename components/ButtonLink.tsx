"use client";

import Link from "next/link";
import { AnalyticsEventName, AnalyticsEventProperties, trackEvent } from "@/lib/analytics";
import { Icon } from "./Icon";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  analyticsEvent?: AnalyticsEventName;
  analyticsProperties?: AnalyticsEventProperties;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  analyticsEvent,
  analyticsProperties
}: ButtonLinkProps) {
  return (
    <Link
      className={`button ${variant}`}
      href={href}
      onClick={() => {
        if (analyticsEvent) {
          trackEvent(analyticsEvent, analyticsProperties);
        }
      }}
    >
      <span>{children}</span>
      {variant !== "ghost" && <Icon name="arrow" className="button-icon" />}
    </Link>
  );
}
