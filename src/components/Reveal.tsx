"use client";

import { ReactNode } from "react";

// Temporary passthrough to isolate a client-side exception on the home page.
// Renders children directly with no hooks/observers so we can confirm whether
// the Reveal animation wrapper was the cause.
export default function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
