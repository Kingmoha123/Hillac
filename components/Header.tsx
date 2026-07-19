"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { company, navigation } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { ButtonLink } from "./ButtonLink";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldDark = saved ? saved === "dark" : prefersDark;
    setDark(shouldDark);
    document.documentElement.classList.toggle("dark", shouldDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  if (isAdminRoute) {
    return null;
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.slice(0, 7).map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="icon-button" onClick={toggleTheme} aria-label="Toggle dark mode">
            {dark ? "L" : "D"}
          </button>
          <ButtonLink
            href="/contact"
            variant="secondary"
            analyticsEvent="header_start_project_click"
            analyticsProperties={{ cta_location: "header" }}
          >
            Start Project
          </ButtonLink>
          <a
            className="whatsapp-link desktop-only"
            href={`https://wa.me/${company.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("whatsapp_click", { cta_location: "header_desktop" })}
          >
            WhatsApp
          </a>
          <button
            type="button"
            className="icon-button mobile-menu-button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Open menu"
          >
            <Icon name={open ? "close" : "menu"} className="icon-small" />
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-panel">
          <div className="container mobile-panel-inner">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${company.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("whatsapp_click", { cta_location: "header_mobile" })}
            >
              WhatsApp: {company.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
