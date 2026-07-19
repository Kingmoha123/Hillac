"use client";

import { useEffect } from "react";
import { AnalyticsEventName, AnalyticsEventProperties, trackEvent } from "@/lib/analytics";

type TrackPageEventProps = {
  eventName: AnalyticsEventName;
  properties?: AnalyticsEventProperties;
};

export function TrackPageEvent({ eventName, properties }: TrackPageEventProps) {
  useEffect(() => {
    trackEvent(eventName, properties);
  }, [eventName, properties]);

  return null;
}
