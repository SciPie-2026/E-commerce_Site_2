"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Play, ArrowRight } from "lucide-react";

export default function LookbookPage() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const lookbookItems = [
    {
      title: "Look 01 • The Seraphina in Twilight",
      desc: "Floor-sweeping Mulberry silk in rose blush paired with antique pearl jewelry.",
      img: "/media/catalog/seraphina-blush-gown.jpg",
      link: "/product/seraphina-blush-silk-gown",
    },
    {
      title: "Look 02 • Aurora Silk Charmeuse Duo",
      desc: "Architectural kimono blazer paired with wide-leg palazzo trousers.",
      img: "/media/catalog/aurora-silk-coord.jpg",
      link: "/product/aurora-silk-satin-coord-set",
    },
    {
      title: "Look 03 • Celeste Botanical Reverie",
      desc: "Tiered georgette maxis drenched in delicate Provencal floral blossoms.",
      img: "/media/catalog/celeste-floral-maxi.jpg",
      link: "/product/celeste-botanical-floral-maxi-dress",
    },
    {
      title: "Look 04 • Mariana Champagne Sculpture",
      desc: "Liquid metallic crepe draping effortlessly for evening soirees.",
      img: "/media/catalog/mariana-champagne-evening.jpg",
      link: "/product/mariana-champagne-draped-evening-dress",
    },
    {
      title: "Look 05 • Noor Handloom Organza",
      desc: "Intricate resham and zardozi threadwork woven on sheer ivory silk.",
      img: "/media/catalog/noor-ethnic-organza-suit.jpg",
      link: "/product/noor-hand-embroidered-organza-anarkali-suit",
    },
    {
      title: "Look 06 • Valeria Boned Corset",
      desc: "Dupioni raw silk corset bodice with dramatic cascading tiered organza skirt.",
      img: "/media/catalog/valeria-rose-corset-dress.jpg",
      link: "/product/valeria-rose-corset-tiered-skirt",
    },
  ];

  const reels = [
    { id: 1, src: "/media/catalog/reel-featured-1.mp4", poster: "/media/catalog/lookbook-editorial-1.jpg", title: "Runway Reverie • Spring Atelier" },
    { id: 2, src: "/media/catalog/reel-featured-2.mp4", poster: "/media/catalog/hero-campaign.jpg", title: "Fluid Silk Motion in Motion" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-1">
            Atelier Gazette
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#30272B]">
            Spring Reverie Lookbook
          </h1>
          <p className="text-xs md:text-sm text-[#755B57] mt-3 font-light leading-relaxed">
            A visual anthology capturing movement, shadow, and ethereal silhouettes in their purest state.
          </p>
        </div>

        {/* Video Reels Gallery */}
        <div className="mb-16">
          <h3 className="font-serif-luxury text-2xl text-[#30272B] font-light text-center mb-6">
            Live Runway & Atelier Reels
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {reels.map((r, i) => (
              <div key={r.id} className="relative rounded-3xl overflow-hidden aspect-9/16 max-h-[500px] bg-black shadow-lg">
                <video
                  src={r.src}
                  poster={r.poster}
                  controls={playingIndex === i}
                  autoPlay={false}
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  onPlay={() => setPlayingIndex(i)}
                />
                {playingIndex !== i && (
                  <button
                    onClick={(e) => {
                      const video = e.currentTarget.parentElement?.querySelector("video");
                      if (video) {
                        video.play();
                        setPlayingIndex(i);
                      }
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 hover:bg-black/25 text-white transition-all"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/90 text-[#30272B] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-[#30272B] ml-0.5" />
                    </div>
                    <span className="text-xs uppercase tracking-wider font-semibold mt-3 text-center px-4">
                      {r.title}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Photo Anthology Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lookbookItems.map((item, idx) => (
            <div key={idx} className="group flex flex-col space-y-3">
              <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-[#F7EFE7] border border-[#EFE5DC] shadow-xs">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-106"
                />
              </div>

              <div>
                <h4 className="font-serif-luxury text-lg font-medium text-[#30272B] group-hover:text-[#C8A56A] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-[#755B57] mt-1 leading-relaxed">
                  {item.desc}
                </p>
                <Link
                  href={item.link}
                  className="inline-flex items-center gap-1.5 text-xs text-[#30272B] font-semibold underline mt-2 hover:text-[#C8A56A]"
                >
                  <span>Shop Silhouette</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
