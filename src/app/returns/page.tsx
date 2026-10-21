import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-1">
            Client Assurance
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#30272B]">
            Returns & Exchanges Policy
          </h1>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#EFE5DC] shadow-xs space-y-6 text-xs text-[#755B57] leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#30272B]">1. 14-Day Boutique Exchange Window</h3>
            <p>
              We want you to be utterly captivated by your silhouette. If the size or fit is not ideal, you may initiate a return or complimentary size exchange within 14 calendar days of delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#30272B]">2. Eligibility & Garment Condition</h3>
            <p>
              To be eligible, garments must be unworn, unwashed, unaltered, and free of perfume, makeup, or deodorant marks, with the original atelier security ribbon and tags intact.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#30272B]">3. Refund Processing</h3>
            <p>
              Upon receiving and inspecting your returned garment at our Mumbai atelier, refunds are credited to the original payment source within 5 to 7 business days.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
