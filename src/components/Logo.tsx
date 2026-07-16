import Image from "next/image";

export default function Logo({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/logo.png"
      alt="তানযীমুল উম্মাহ হিফয মাদরাসা"
      width={size}
      height={size}
      priority
      className={`rounded-full object-contain ${className}`}
    />
  );
}
