import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import { MapPin, Phone, Mail } from "lucide-react";

export const metadata = { title: "যোগাযোগ — তানযীমুল উম্মাহ হিফয মাদরাসা" };

export default function ContactPage() {
  const items = [
    { icon: MapPin, label: "ঠিকানা", value: "উত্তরা, ঢাকা, বাংলাদেশ" },
    { icon: Phone, label: "ফোন", value: "+৮৮০ ১৭xx-xxxxxx" },
    { icon: Mail, label: "ইমেইল", value: "info@tanzimulummah.org" },
  ];

  return (
    <>
      <Navbar />

      <section className="bg-primary islamic-pattern">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <h1 className="font-serif-bn text-3xl font-bold text-cream md:text-4xl">
            যোগাযোগ
          </h1>
          <SectionDivider className="my-4" />
          <p className="mx-auto max-w-xl text-sm text-cream/75">
            যেকোনো তথ্য বা সহযোগিতার জন্য আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>
      </section>

      <section className="bg-off-white py-12">
        <div className="mx-auto max-w-2xl px-4">
          <div className="grid gap-4">
            {items.map((i) => (
              <div
                key={i.label}
                className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-gold/15 text-accent-gold">
                  <i.icon size={22} />
                </div>
                <div>
                  <div className="text-xs text-charcoal/50">{i.label}</div>
                  <div className="font-medium text-charcoal">{i.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
