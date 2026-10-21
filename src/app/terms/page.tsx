import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-1">
            Atelier Governance
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#30272B]">
            Terms of Service
          </h1>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#EFE5DC] shadow-xs space-y-6 text-xs text-[#755B57] leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#30272B]">1. Boutique Atelier Contract</h3>
            <p>
              By accessing and placing orders through AIDAH Boutique, you agree to these Terms of Service. All orders are subject to acceptance and availability of artisanal fabrics.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#30272B]">2. Pricing & Intellectual Property</h3>
            <p>
              All prices are quoted in Indian Rupees (INR) and include applicable taxes unless explicitly noted. All couture pattern designs, artisanal sketches, and campaign imagery are the proprietary intellectual property of AIDAH Atelier.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#30272B]">3. Governing Law</h3>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India, under the exclusive jurisdiction of the courts of Mumbai.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
