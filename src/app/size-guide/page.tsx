import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Scissors, Ruler, Sparkles } from "lucide-react";

export default function SizeGuidePage() {
  const chartData = [
    { size: "XS", bustIn: "32", bustCm: "81", waistIn: "24 - 25", waistCm: "61 - 64", hipsIn: "34 - 35", hipsCm: "86 - 89" },
    { size: "S", bustIn: "34", bustCm: "86", waistIn: "26 - 27", waistCm: "66 - 69", hipsIn: "36 - 37", hipsCm: "91 - 94" },
    { size: "M", bustIn: "36", bustCm: "91", waistIn: "28 - 29", waistCm: "71 - 74", hipsIn: "38 - 39", hipsCm: "96 - 99" },
    { size: "L", bustIn: "38", bustCm: "96", waistIn: "30 - 31", waistCm: "76 - 79", hipsIn: "40 - 41", hipsCm: "101 - 104" },
    { size: "XL", bustIn: "40", bustCm: "101", waistIn: "32 - 33", waistCm: "81 - 84", hipsIn: "42 - 43", hipsCm: "106 - 109" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-1">
            Bespoke Fitting
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#30272B]">
            Atelier Size Guide
          </h1>
          <p className="text-xs md:text-sm text-[#755B57] mt-3 font-light leading-relaxed">
            Our silhouettes are engineered with meticulous architectural ease. Use this chart to determine your standard boutique size.
          </p>
        </div>

        {/* Size Chart Table */}
        <div className="bg-white rounded-3xl border border-[#EFE5DC] p-6 sm:p-8 shadow-xs mb-10 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EFE5DC] text-[#755B57] uppercase tracking-wider text-[11px]">
                <th className="pb-3 font-semibold">Size</th>
                <th className="pb-3 font-semibold">Bust (In / Cm)</th>
                <th className="pb-3 font-semibold">Natural Waist (In / Cm)</th>
                <th className="pb-3 font-semibold">Low Hip (In / Cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE5DC]/60 text-[#30272B]">
              {chartData.map((row) => (
                <tr key={row.size} className="hover:bg-[#FAF0F3]/40 transition-colors">
                  <td className="py-3.5 font-bold font-serif-luxury text-sm">{row.size}</td>
                  <td className="py-3.5">{row.bustIn}&quot; / {row.bustCm} cm</td>
                  <td className="py-3.5">{row.waistIn}&quot; / {row.waistCm} cm</td>
                  <td className="py-3.5">{row.hipsIn}&quot; / {row.hipsCm} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to Measure Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#755B57]">
          <div className="p-6 rounded-2xl bg-white border border-[#EFE5DC] space-y-2">
            <Ruler className="w-5 h-5 text-[#C8A56A]" />
            <h4 className="font-serif-luxury text-base font-semibold text-[#30272B]">1. Measuring the Bust</h4>
            <p className="leading-relaxed">
              Wrap the measuring tape comfortably around the fullest part of your bust while breathing normally, keeping the tape parallel to the floor.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EFE5DC] space-y-2">
            <Scissors className="w-5 h-5 text-[#C8A56A]" />
            <h4 className="font-serif-luxury text-base font-semibold text-[#30272B]">2. Natural Waist</h4>
            <p className="leading-relaxed">
              Find the narrowest curve of your waist, typically 1 to 2 inches above your navel, and wrap the tape without pulling tight.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EFE5DC] space-y-2">
            <Sparkles className="w-5 h-5 text-[#C8A56A]" />
            <h4 className="font-serif-luxury text-base font-semibold text-[#30272B]">3. Fullest Hips</h4>
            <p className="leading-relaxed">
              Stand with heels together and measure around the fullest curve of your hips and seat, ensuring the tape remains smooth.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
