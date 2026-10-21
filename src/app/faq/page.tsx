import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function FAQPage() {
  const faqs = [
    {
      q: "Where are AIDAH garments designed and crafted?",
      a: "All our silhouettes are conceptualized in our boutique atelier at Baani City Centre, Sector 63, Gurugram, in collaboration with heritage master silk weavers, lace makers, and generational embroidery karigars.",
    },
    {
      q: "Can I book a private atelier styling consultation?",
      a: "Yes. Our senior stylists offer complimentary one-on-one virtual styling sessions and in-person appointments at our salon to help you curate your wardrobe for upcoming occasions.",
    },
    {
      q: "What is your complimentary shipping policy?",
      a: "We offer complimentary express shipping across all pin codes in India on orders exceeding ₹3,999. For international deliveries, shipping is calculated at checkout with duty prepaid.",
    },
    {
      q: "Can I request custom alterations or custom sizing?",
      a: "Yes. Our atelier offers bespoke made-to-measure services. Simply select 'Custom' or contact our concierge after placing your order with your specific measurements.",
    },
    {
      q: "What is your return and exchange policy?",
      a: "We accept returns and size exchanges within 14 days of delivery for unworn garments with all tags and security seals intact in their original archival packaging.",
    },
    {
      q: "How should I care for my silk and organza garments?",
      a: "Due to the natural, artisanal nature of Mulberry silks and handloom organza, we strictly recommend dry cleaning by luxury fabric specialists and storage in breathable archival garment bags.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-1">
            Atelier Help Desk
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#30272B]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs md:text-sm text-[#755B57] mt-3 font-light leading-relaxed">
            Essential inquiries regarding atelier craftsmanship, delivery timelines, custom fittings, and care.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-[#EFE5DC] shadow-xs space-y-2">
              <h4 className="font-serif-luxury text-base font-semibold text-[#30272B]">{faq.q}</h4>
              <p className="text-xs text-[#755B57] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
