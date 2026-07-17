import Link from "next/link";

type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <Link href="/" className="logo" aria-label="Hillaac ICT Solutions home">
      <svg className="logo-mark" viewBox="0 0 96 96" fill="none" aria-hidden="true">
        <path d="M12 78L28 14h24L39 78H12z" fill="url(#blueA)" />
        <path d="M56 78L72 14h18L75 78H56z" fill="url(#blueB)" />
        <path d="M62 5L26 54h22L35 91l40-52H53L62 5z" fill="#FFC107" />
        <defs>
          <linearGradient id="blueA" x1="12" x2="58" y1="14" y2="78" gradientUnits="userSpaceOnUse">
            <stop stopColor="#27B8FF" />
            <stop offset="1" stopColor="#0057D9" />
          </linearGradient>
          <linearGradient id="blueB" x1="54" x2="96" y1="12" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0D8DFF" />
            <stop offset="1" stopColor="#062E85" />
          </linearGradient>
        </defs>
      </svg>
      {!compact && (
        <span className="logo-text">
          <strong>Hillaac</strong>
          <small>ICT Solutions</small>
        </span>
      )}
    </Link>
  );
}
