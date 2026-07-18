"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { company, navigation } from "@/data/site";
import { ButtonLink } from "./ButtonLink";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

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
            {dark ? "☀" : "◐"}
          </button>
          <ButtonLink href="/contact" variant="secondary">Start Project</ButtonLink>
          <a className="whatsapp-link desktop-only" href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <button type="button" className="icon-button mobile-menu-button" onClick={() => setOpen((value) => !value)} aria-label="Open menu">
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
            <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer">
              WhatsApp: {company.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
