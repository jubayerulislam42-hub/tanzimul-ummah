import { ReactNode } from "react";

export default function Section({
  children,
  className = "",
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section
      className={`${
        dark ? "bg-green-black text-cream" : "bg-off-white text-charcoal"
      } py-12 md:py-16 px-4 md:px-6 ${className}`}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
