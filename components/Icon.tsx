type IconProps = {
  name: string;
  className?: string;
};

const paths: Record<string, string> = {
  pen: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.5 3.3 5.5 3.3 9s-1.1 6.5-3.3 9c-2.2-2.5-3.3-5.5-3.3-9S9.8 5.5 12 3z",
  phone: "M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM10 18h4",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6M14 4l-4 16",
  cloud: "M17.5 19H7a5 5 0 0 1-.7-10A6.5 6.5 0 0 1 19 10.5 4.3 4.3 0 0 1 17.5 19z",
  spark: "M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z",
  trend: "M3 17l6-6 4 4 8-8M15 7h6v6",
  video: "M4 6h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM17 10l5-3v10l-5-3",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  bolt: "M13 2L4 14h7l-1 8 10-13h-7l0-7z",
  arrow: "M5 12h14M13 5l7 7-7 7",
  check: "M20 6L9 17l-5-5",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M18 6L6 18M6 6l12 12",
  whatsapp: "M16.7 14.4c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.7-1.6c-.2-.4-.4-.4-.6-.4H9c-.2 0-.5.1-.7.3-.2.2-.9.8-.9 2s.9 2.3 1 2.5c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.2-.1-.4-.2-.9-.4zM12 2a10 10 0 0 0-8.5 15.2L2 22l5-1.4A10 10 0 1 0 12 2z"
};

export function Icon({ name, className = "" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[name] ?? paths.bolt} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
