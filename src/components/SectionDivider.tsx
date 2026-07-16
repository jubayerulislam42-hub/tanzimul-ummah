export default function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-2 ${className}`}>
      <span className="h-px w-16 bg-accent-gold/40" />
      <span className="h-2 w-2 rotate-45 bg-accent-gold/60" />
      <span className="h-px w-16 bg-accent-gold/40" />
    </div>
  );
}
