import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: {
    index: false,
    follow: true
  }
};

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container narrow">
        <span className="eyebrow">404</span>
        <h1>Page not found</h1>
        <p>
          The page you are looking for may have moved, or the link may be incorrect.
          You can return home, explore our portfolio, or contact Hillaac directly.
        </p>
        <div className="not-found-actions">
          <ButtonLink href="/">Go Home</ButtonLink>
          <ButtonLink href="/portfolio" variant="secondary">View Portfolio</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">Contact Us</ButtonLink>
        </div>
      </div>
    </section>
  );
}
