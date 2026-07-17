import Link from "next/link";
import { Icon } from "./Icon";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function ButtonLink({ href, children, variant = "primary" }: ButtonLinkProps) {
  return (
    <Link className={`button ${variant}`} href={href}>
      <span>{children}</span>
      {variant !== "ghost" && <Icon name="arrow" className="button-icon" />}
    </Link>
  );
}
