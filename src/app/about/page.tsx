import React from "react";
import Image from "next/image";
import Link from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { themeConfig } from "@/config/theme";
import { Sparkles, Scissors, Feather, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <CartDrawer />

      <main className="flex-1">
        {/* Banner */}
        <section className="py-20 md:py-28 bg-[#FAF0F3] border-b border-[#EFE5DC] text-center px-4">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold">
              The Heritage Atelier
            </span>
            <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl font-light text-[#30272B]">
              The Poetry of Slow Fashion
            </h1>
            <p className="text-xs md:text-sm text-[#755B57] max-w-xl mx-auto font-light leading-relaxed">
              Founded in {themeConfig.brand.foundingYear}, {themeConfig.brand.name} was born out of an unwavering reverence for timeless feminine grace, heirloom natural textiles, and architectural tailoring.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden aspect-4/5 shadow-xl bg-[#F7EFE7]">
              <Image
                src="/media/catalog/brand-story-portrait.jpg"
                alt="AIDAH Atelier Creative Director"
                fill
                className="object-cover object-top"
              />
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold">
                Our Philosophy
              </span>
              <h2 className="font-serif-luxury text-3xl md:text-4xl text-[#30272B] font-light">
                Drapes Crafted for Heirlooms, Not Trends.
              </h2>
              <p className="text-xs md:text-sm text-[#755B57] leading-relaxed font-light">
                In an era dominated by transient fast fashion, our atelier chooses deliberate contemplation. We work with master silk weavers in Varanasi and Bangalore, lace artisans in Lyon, and hand-embroidery karigars in Rajasthan who carry centuries of generational skill.
              </p>
              <p className="text-xs md:text-sm text-[#755B57] leading-relaxed font-light">
                Every silhouette—from the fluid bias-cut drape of our Seraphina gown to the structured elegance of our tailored silk sets—is engineered to honor and flatter the female form in movement.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EFE5DC]">
                <div className="space-y-1">
                  <Feather className="w-5 h-5 text-[#C8A56A]" />
                  <h4 className="font-serif-luxury text-sm font-semibold text-[#30272B]">Pure Natural Fibers</h4>
                  <p className="text-[11px] text-[#755B57]">Mulberry silk, Chanderi, Bemberg georgette, and linen.</p>
                </div>
                <div className="space-y-1">
                  <Scissors className="w-5 h-5 text-[#C8A56A]" />
                  <h4 className="font-serif-luxury text-sm font-semibold text-[#30272B]">Bespoke Contouring</h4>
                  <p className="text-[11px] text-[#755B57]">Custom-made to your unique measurements on request.</p>
                </div>
                <div className="space-y-1">
                  <Heart className="w-5 h-5 text-[#C8A56A]" />
                  <h4 className="font-serif-luxury text-sm font-semibold text-[#30272B]">Artisanal Finishing</h4>
                  <p className="text-[11px] text-[#755B57]">Hand-finished chikankari, zardozi, and hand-rolled French hems.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
