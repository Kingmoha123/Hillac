"use client";

import { company } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { Icon } from "./Icon";

export function WhatsAppButton() {
  const message = encodeURIComponent("Asc Hillaac ICT Solutions, waxaan rabaa inaan ka hadlo website/app/system project.");

  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/${company.whatsapp}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Hillaac ICT Solutions on WhatsApp"
      onClick={() => trackEvent("whatsapp_click", { cta_location: "floating_button" })}
    >
      <Icon name="whatsapp" className="icon-medium" />
      <span>WhatsApp</span>
    </a>
  );
}
