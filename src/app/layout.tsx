import type { Metadata } from "next";
import { Inter, Cormorant, Hind_Siliguri, Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cormorant = Cormorant({ subsets: ["latin"], variable: "--font-cormorant", display: "swap" });
const hindSiliguri = Hind_Siliguri({ subsets: ["bengali"], variable: "--font-hind-siliguri", weight: ["400", "500", "600", "700"], display: "swap" });
const notoSerifBengali = Noto_Serif_Bengali({ subsets: ["bengali"], variable: "--font-noto-serif-bengali", weight: ["400", "500", "600", "700"], display: "swap" });

export const metadata: Metadata = {
  title: "তানযীমুল উম্মাহ হিফয মাদরাসা",
  description: "ইলমের আলো ছড়াক প্রতিটি হৃদয়ে — তানযীমুল উম্মাহ হিফয মাদরাসার অফিসিয়াল ওয়েবসাইট।",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" className={`${inter.variable} ${cormorant.variable} ${hindSiliguri.variable} ${notoSerifBengali.variable}`}>
      <body className="font-body bg-off-white text-charcoal antialiased">{children}</body>
    </html>
  );
}
