import { Building2 } from "lucide-react";

export default function ImageWithFallback({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  fallbackText,
  iconLabel,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackText?: string;
  iconLabel?: string;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-primary-dark via-green-black to-primary text-accent-gold ${className} ${fallbackClassName}`}
        aria-label={alt}
      >
        <div className="flex flex-col items-center gap-2 opacity-90">
          <Building2 className="h-10 w-10" strokeWidth={1.5} />
          {fallbackText && (
            <span className="font-bengali text-2xl font-bold text-cream/80">{fallbackText}</span>
          )}
          {iconLabel && (
            <span className="font-bengali text-sm text-cream/80">{iconLabel}</span>
          )}
        </div>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} />;
}
