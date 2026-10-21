import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { StudioViewer } from "@/components/3d/StudioViewer";
import { Sparkles, Eye, Palette, Scissors } from "lucide-react";

export default function StudioPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 w-full">
        {/* Studio Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4DDE3] border border-[#D99BAA]/40 text-[#755B57] text-xs uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A56A]" />
            <span>Virtual Fitting Salon</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#30272B]">
            Interactive 3D Couture Studio
          </h1>

          <p className="text-xs md:text-sm text-[#755B57] mt-3 font-light leading-relaxed">
            Rotate in 360°, inspect artisanal ruched seamlines, and preview signature atelier hues in real-time WebGL before our patternmakers begin tailoring your garment.
          </p>
        </div>

        {/* 3D Interactive Studio Component */}
        <StudioViewer />

        {/* Studio Features & Guarantee Grid */}
        <div className="mt-16 pt-12 border-t border-[#EFE5DC] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#EFE5DC] space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#FAF0F3] flex items-center justify-center text-[#D99BAA]">
              <Eye className="w-5 h-5" />
            </div>
            <h4 className="font-serif-luxury text-base font-semibold text-[#30272B]">
              True-to-Scale 360° Inspection
            </h4>
            <p className="text-xs text-[#755B57] leading-relaxed">
              Examine the subtle cascade of our bias-cut skirts, neckline depths, and hand-tucked bodice folds from every perspective.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EFE5DC] space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#FAF0F3] flex items-center justify-center text-[#C8A56A]">
              <Palette className="w-5 h-5" />
            </div>
            <h4 className="font-serif-luxury text-base font-semibold text-[#30272B]">
              Atelier Dye House Hues
            </h4>
            <p className="text-xs text-[#755B57] leading-relaxed">
              Switch seamlessly between Blush Rose, Warm Ivory, Champagne Gold, and Cocoa Charmeuse to choose your ideal event palette.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EFE5DC] space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#FAF0F3] flex items-center justify-center text-[#755B57]">
              <Scissors className="w-5 h-5" />
            </div>
            <h4 className="font-serif-luxury text-base font-semibold text-[#30272B]">
              Bespoke Fitting Guarantee
            </h4>
            <p className="text-xs text-[#755B57] leading-relaxed">
              Every studio order includes complimentary pattern adjustments by our senior patternmakers to ensure flawless comfort and fit.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
