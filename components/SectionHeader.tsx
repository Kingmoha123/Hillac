type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  text?: string;
};

export function SectionHeader({ eyebrow, title, text }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
