import Link from "next/link";
import MosqueSilhouette from "./MosqueSilhouette";
import Logo from "./Logo";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-20 bg-primary text-cream">
      <MosqueSilhouette className="h-16 w-full text-primary-light md:h-24" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-6 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <Logo size={44} />
            <h3 className="font-serif-bn text-lg font-bold">তানযীমুল উম্মাহ হিফয মাদরাসা</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            কুরআনের আলোয় আলোকিত প্রজন্ম গড়ার প্রত্যয়ে দেশব্যাপী ১২৫+ শাখায় দ্বীনি ও আধুনিক শিক্ষার সমন্বিত প্রতিষ্ঠান।
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-accent-gold">দ্রুত লিংক</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link href="/branches" className="hover:text-accent-gold">শাখাসমূহ</Link></li>
            <li><Link href="/about" className="hover:text-accent-gold">আমাদের সম্পর্কে</Link></li>
            <li><Link href="/notices" className="hover:text-accent-gold">নোটিশ বোর্ড</Link></li>
            <li><Link href="/login" className="hover:text-accent-gold">লগইন</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-accent-gold">যোগাযোগ</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li className="flex items-center gap-2"><MapPin size={15} className="text-accent-gold" /> উত্তরা, ঢাকা, বাংলাদেশ</li>
            <li className="flex items-center gap-2"><Phone size={15} className="text-accent-gold" /> +৮৮০ ১৭xx-xxxxxx</li>
            <li className="flex items-center gap-2"><Mail size={15} className="text-accent-gold" /> info@tanzimulummah.org</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-accent-gold/15 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} তানযীমুল উম্মাহ হিফয মাদরাসা। সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}
