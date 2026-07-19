"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { AnalyticsEventName, AnalyticsEventProperties, trackEvent } from "@/lib/analytics";

type TrackedLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  eventName?: AnalyticsEventName;
  eventProperties?: AnalyticsEventProperties;
};

export function TrackedLink({
  href,
  children,
  eventName,
  eventProperties,
  onClick,
  ...props
}: TrackedLinkProps) {
  const handleClick: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"] = (event) => {
    if (eventName) {
      trackEvent(eventName, eventProperties);
    }

    onClick?.(event);
  };

  if (isInternalLink(href)) {
    return (
      <Link href={href} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

function isInternalLink(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}
