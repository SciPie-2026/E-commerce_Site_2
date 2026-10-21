"use client";

import React, { useState } from "react";
import Link from "next/link";
import { themeConfig } from "@/config/theme";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubscribing(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
      }
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#FFF9F4] border-t border-[#EFE5DC] pt-16 pb-12 text-[#30272B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#EFE5DC]">
          {/* Col 1 & 2: Brand Identity & Gazette */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif-luxury text-3xl tracking-tight text-[#30272B]">
                {themeConfig.brand.name}
              </span>
              <span className="block text-[9px] tracking-[0.3em] uppercase text-[#755B57] font-medium -mt-1">
                Atelier • Est. {themeConfig.brand.foundingYear}
              </span>
            </Link>

            <p className="text-xs text-[#755B57] leading-relaxed max-w-sm">
              {themeConfig.brand.description} Crafted with artisanal devotion using heirloom fabrics, liquid silks, and hand-embroidery.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="block text-xs uppercase tracking-wider text-[#30272B] font-semibold mb-2">
                Join the AIDAH Salon Gazette
              </span>
              {subscribed ? (
                <div className="p-3 rounded-lg bg-[#FAF0F3] border border-[#D99BAA]/40 flex items-center gap-2 text-xs text-[#755B57]">
                  <CheckCircle2 className="w-4 h-4 text-[#D99BAA]" />
                  <span>Your invitation has been dispatched. Welcome to our salon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-md">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-[#755B57] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="Your preferred email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-full border border-[#D99BAA]/50 text-xs text-[#30272B] focus:outline-none focus:border-[#30272B]"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="px-4 py-2 rounded-full bg-[#30272B] text-white text-xs font-medium hover:bg-[#C8A56A] transition-colors flex items-center gap-1"
                  >
                    <span>{subscribing ? "Subscribing..." : "Subscribe"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 3: Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#30272B] font-semibold mb-4">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#755B57]">
              <li><Link href="/collections/new-arrivals" className="hover:text-[#30272B]">New In: Spring Reverie</Link></li>
              <li><Link href="/category/evening-gowns" className="hover:text-[#30272B]">Evening Gowns</Link></li>
              <li><Link href="/category/floral-dresses" className="hover:text-[#30272B]">Botanical Floral Maxis</Link></li>
              <li><Link href="/category/co-ord-sets" className="hover:text-[#30272B]">Silk Charmeuse Co-Ords</Link></li>
              <li><Link href="/category/ethnic-wear" className="hover:text-[#30272B]">Organza Ethnic Suits</Link></li>
              <li><Link href="/lookbook" className="hover:text-[#30272B]">Runway Lookbook</Link></li>
            </ul>
          </div>

          {/* Col 4: Concierge & Orders */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#30272B] font-semibold mb-4">
              Atelier Concierge
            </h4>
            <ul className="space-y-2 text-xs text-[#755B57]">
              <li><Link href="/track-order" className="hover:text-[#30272B]">Track Your Order</Link></li>
              <li><Link href="/size-guide" className="hover:text-[#30272B]">Bespoke Size Guide</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[#30272B]">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-[#30272B]">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="hover:text-[#30272B]">Frequently Asked Questions</Link></li>
              <li><Link href="/contact" className="hover:text-[#30272B]">Contact Atelier</Link></li>
            </ul>
          </div>

          {/* Col 5: Legal & Boutique Atelier */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#30272B] font-semibold mb-4">
              Atelier House
            </h4>
            <p className="text-xs text-[#755B57] leading-relaxed mb-3">
              {themeConfig.contact.address}
            </p>
            <p className="text-xs text-[#755B57] mb-4">
              Concierge: {themeConfig.contact.phone}
            </p>
            <ul className="space-y-1.5 text-xs text-[#755B57]">
              <li><Link href="/about" className="hover:text-[#30272B]">Atelier Story</Link></li>
              <li><Link href="/privacy" className="hover:text-[#30272B]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#30272B]">Terms of Service</Link></li>
              <li><Link href="/admin" className="hover:text-[#C8A56A] text-[11px] underline">Admin Gateway</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#755B57]/70 gap-4">
          <p>© 2026 {themeConfig.brand.name} Atelier Boutique. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px]">Curated in Mumbai & Paris</span>
            <span>•</span>
            <span className="text-[11px]">100% Genuine Handcrafted Silks</span>
            <span>•</span>
            <span className="text-[11px]">Secure SSL & PCI-DSS Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
