// Decorative Islamic SVG accents: crescent moon, lantern, and an ornate divider.
// Pure inline SVG so no image assets needed; themeable via currentColor.

export function CrescentMoon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M62 8a42 42 0 1 0 24 76A34 34 0 0 1 62 8Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="74" cy="34" r="4" fill="currentColor" opacity="0.5" />
      <circle cx="84" cy="54" r="2.5" fill="currentColor" opacity="0.4" />
      <circle cx="70" cy="66" r="3" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

export function Lantern({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M40 4v14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 18h24l-4 10v70l4 10H28l4-10V28L28 18Z" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2.5" />
      <path d="M34 34h12M34 44h12M34 54h12" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="40" cy="74" r="10" fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="2" />
      <path d="M36 124l4 10 4-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function OrnateDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M100 2l6 8-6 8-6-8 6-8Z" fill="currentColor" opacity="0.8" />
      <path d="M70 10h22M108 10h22" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="64" cy="10" r="2.5" fill="currentColor" opacity="0.6" />
      <circle cx="136" cy="10" r="2.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
