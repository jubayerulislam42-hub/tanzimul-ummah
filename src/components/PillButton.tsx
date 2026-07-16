import { ReactNode } from "react";

type Variant = "gold" | "outline" | "light";

export default function PillButton({
  children,
  onClick,
  href,
  variant = "gold",
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold";
  const styles: Record<Variant, string> = {
    gold: "bg-accent-gold text-green-black hover:bg-accent-gold-light hover:shadow-gold-glow",
    outline: "border border-accent-gold/60 text-accent-gold hover:bg-accent-gold/10",
    light: "bg-white text-primary hover:bg-cream hover:shadow-card",
  };
  const cls = `${base} ${styles[variant]} ${className}`;
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
