import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-1">
            Data Dignity
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#30272B]">
            Privacy Policy
          </h1>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#EFE5DC] shadow-xs space-y-6 text-xs text-[#755B57] leading-relaxed">
          <p>
            AIDAH Atelier values your discretion and privacy above all. This Privacy Policy details how your personal data is collected, handled, and safeguarded when visiting our boutique and utilizing our services.
          </p>

          <section className="space-y-2">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#30272B]">1. Information We Collect</h3>
            <p>
              We collect details you provide voluntarily: your name, shipping address, telephone number, email, and bespoke fitting measurements. We do not store raw credit card numbers or CVV codes; all payment tokens are processed via certified PCI-DSS compliant gateways.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#30272B]">2. Usage of Your Information</h3>
            <p>
              We utilize collected data strictly to tailor and deliver your orders, communicate tracking updates, process returns, and send occasional invitations to our private collections if you opted in to our Gazette.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#30272B]">3. Your Rights & Data Deletion</h3>
            <p>
              You may request access to, correction of, or permanent deletion of your customer account records at any time by contacting <a href="mailto:concierge@aidah.com" className="text-[#30272B] underline">concierge@aidah.com</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
