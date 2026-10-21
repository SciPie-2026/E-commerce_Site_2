import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-1">
            Atelier Logistics
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#30272B]">
            Shipping & White-Glove Delivery
          </h1>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#EFE5DC] shadow-xs space-y-6 text-xs text-[#755B57] leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#30272B]">1. Domestic Dispatch & Timelines</h3>
            <p>
              Standard atelier creations in our ready-to-wear catalog are dispatched within 2 to 4 business days. Made-to-measure and custom bridal silhouettes require 7 to 10 business days for artisanal tailoring and inspection.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#30272B]">2. Complimentary Couture Shipping</h3>
            <p>
              We provide complimentary insured express delivery via BlueDart or equivalent premium couriers across all Indian PIN codes on all orders of ₹3,999 and above. For orders beneath this privilege threshold, a flat delivery fee of ₹250 applies.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#30272B]">3. Signature Archival Packaging</h3>
            <p>
              Every AIDAH creation is packaged in our custom ivory rigid gift box, protected by acid-free tissue paper, wrapped in blush silk ribbon, and infused with our signature lavender botanical sachet.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#30272B]">4. Real-Time Tracking & Verification</h3>
            <p>
              Upon dispatch, a unique airway bill tracking number is assigned and communicated via SMS and email. You can monitor your shipment directly on our <a href="/track-order" className="text-[#30272B] underline">Track Order Concierge</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
