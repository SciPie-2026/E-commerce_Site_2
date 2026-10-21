"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCard } from "@/components/product/ProductCard";
import { Product, Category } from "@/lib/types";
import { themeConfig } from "@/config/theme";
import {
  Sparkles,
  ArrowRight,  Star,
  Play,
} from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeOccasion, setActiveOccasion] = useState<string>("All");
  const [isPlayingReel, setIsPlayingReel] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);
        if (prodRes.ok) {
          const pData = await prodRes.json();
          setProducts(pData.products || []);
        }
        if (catRes.ok) {
          const cData = await catRes.json();
          setCategories(cData.categories || []);
        }
      } catch (err) {
        console.error("Failed to load initial storefront data", err);
      }
    }
    loadData();
  }, []);

  const occasions = ["All", "Evening Gala", "Garden Wedding", "High Tea", "Cocktail", "Festive Soirée"];

  const filteredProducts = activeOccasion === "All"
    ? products
    : products.filter((p) => p.occasion.toLowerCase().includes(activeOccasion.toLowerCase()));

  const newArrivals = products.filter((p) => p.is_new).slice(0, 4);
  const bestSellers = products.filter((p) => p.is_bestseller).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <CartDrawer />

      <main className="flex-1">
        {/* 1. HERO SECTION: Full-Width Editorial Campaign + 3D Blossom */}
        <section className="relative overflow-hidden border-b border-[#EFE5DC] bg-gradient-to-b from-[#FAF0F3] via-[#FFF9F4] to-[#FFF9F4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Typography & CTAs (7 Cols) */}
              <div className="lg:col-span-7 space-y-6 z-10 text-center lg:text-left">
                <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#30272B] tracking-tight leading-[1.08]">
                  Made for Your Most <br className="hidden sm:inline" />
                  <span className="italic font-normal text-[#755B57]">Beautiful Moments.</span>
                </h1>

                <p className="text-sm md:text-base text-[#755B57] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                  Step into AIDAH Atelier. Discover ethereal Mulberry silk evening gowns, romantic hand-painted botanical maxis, and sculpted co-ord silhouettes draped in pure poetry.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/shop"
                    className="w-full sm:w-auto px-8 py-4 rounded-full btn-gold text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Shop the Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/lookbook"
                    className="w-full sm:w-auto px-8 py-4 rounded-full btn-outline-boutique text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
                  >
                    <span>View Lookbook</span>
                  </Link>
                </div>

                {/* Craft badges */}
                <div className="pt-6 border-t border-[#EFE5DC] grid grid-cols-3 gap-4 text-center lg:text-left">
                  <div>
                    <span className="block font-serif-luxury text-lg font-semibold text-[#30272B]">100%</span>
                    <span className="text-[11px] text-[#755B57] uppercase tracking-wider">Pure Silks & Linens</span>
                  </div>
                  <div>
                    <span className="block font-serif-luxury text-lg font-semibold text-[#30272B]">Bespoke</span>
                    <span className="text-[11px] text-[#755B57] uppercase tracking-wider">Custom Tailoring</span>
                  </div>
                  <div>
                    <span className="block font-serif-luxury text-lg font-semibold text-[#30272B]">Small-Batch</span>
                    <span className="text-[11px] text-[#755B57] uppercase tracking-wider">Artisanal Craft</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Campaign Showcase (5 Cols) */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative w-full aspect-4/5 max-w-md rounded-[2.5rem] overflow-hidden border border-[#C8A56A]/20 shadow-2xl shadow-[#D99BAA]/20 bg-[#F7EFE7]">
                  <Image
                    src="/media/catalog/hero-campaign.jpg"
                    alt="Aidah The Label Couture Campaign"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#30272B]/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-[#FFF9F4] z-10">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-[#C8A56A] font-semibold">Atelier Showcase</p>
                      <p className="font-serif-luxury text-xl sm:text-2xl font-normal">The Noor Organza Set</p>
                      <p className="text-xs text-[#FFF9F4]/80">Hand-finished chikankari & lace craft</p>
                    </div>
                    <Link
                      href="/product/noor-hand-embroidered-organza-anarkali-suit"
                      className="rounded-full bg-white/90 px-4 py-2 text-xs font-medium tracking-wide text-[#30272B] backdrop-blur-sm transition-colors hover:bg-white shrink-0"
                    >
                      View Look
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FEATURED CATEGORIES: Soft Editorial Tiles */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-2">
              Curated Wardrobe
            </span>
            <h2 className="font-serif-luxury text-3xl md:text-4xl text-[#30272B] font-light">
              Explore by Silhouette
            </h2>
            <div className="w-12 h-0.5 bg-[#C8A56A] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-3/4 border border-[#EFE5DC] shadow-xs flex flex-col justify-end p-4 md:p-6"
              >
                <Image
                  src={cat.image_url || "/media/catalog/hero-campaign.jpg"}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#30272B]/85 via-[#30272B]/30 to-transparent" />

                <div className="relative z-10 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-[#F4DDE3] font-medium block">
                    {cat.product_count} Creations
                  </span>
                  <h3 className="font-serif-luxury text-lg md:text-xl font-medium mt-1 group-hover:text-[#C8A56A] transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. NEW ARRIVALS: Curated Showcase */}
        <section className="py-16 bg-[#FAF0F3]/60 border-y border-[#EFE5DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-1">
                  Just In From The Atelier
                </span>
                <h2 className="font-serif-luxury text-3xl md:text-4xl text-[#30272B] font-light">
                  New Arrivals
                </h2>
              </div>
              <Link
                href="/collections/new-arrivals"
                className="text-xs uppercase tracking-widest font-semibold text-[#755B57] hover:text-[#30272B] flex items-center gap-1.5 border-b border-[#D99BAA] pb-0.5"
              >
                <span>View All New In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>


        {/* 6. OCCASION SELECTOR: Find Your Style */}
        <section className="py-16 bg-white border-y border-[#EFE5DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-2">
                Curated For Your Calendar
              </span>
              <h2 className="font-serif-luxury text-3xl md:text-4xl text-[#30272B] font-light">
                Find Your Style by Occasion
              </h2>
              <div className="w-12 h-0.5 bg-[#C8A56A] mx-auto mt-4" />
            </div>

            {/* Occasion Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {occasions.map((occ) => (
                <button
                  key={occ}
                  onClick={() => setActiveOccasion(occ)}
                  className={`px-5 py-2 rounded-full text-xs font-medium tracking-wider transition-all ${
                    activeOccasion === occ
                      ? "bg-[#30272B] text-white shadow-xs"
                      : "bg-[#FFF9F4] text-[#755B57] border border-[#D99BAA]/30 hover:border-[#30272B]"
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.slice(0, 4).map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>

        {/* 7. EDITORIAL LOOKBOOK & REAL BOUTIQUE REEL PREVIEW */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Reel Video Player / Preview */}
            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden aspect-9/16 max-h-[600px] shadow-2xl bg-black mx-auto w-full max-w-sm">
              <video
                src="/media/catalog/reel-featured-1.mp4"
                poster="/media/catalog/lookbook-editorial-1.jpg"
                controls={isPlayingReel}
                autoPlay={false}
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                onPlay={() => setIsPlayingReel(true)}
              />
              {!isPlayingReel && (
                <button
                  onClick={(e) => {
                    const video = e.currentTarget.parentElement?.querySelector("video");
                    if (video) {
                      video.play();
                      setIsPlayingReel(true);
                    }
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 hover:bg-black/20 transition-all text-white group"
                >
                  <div className="w-16 h-16 rounded-full bg-white/85 text-[#30272B] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-6 h-6 fill-[#30272B] ml-1" />
                  </div>
                  <span className="text-xs uppercase tracking-widest mt-4 font-semibold">
                    Watch Spring Atelier Runway Reel
                  </span>
                </button>
              )}
            </div>

            {/* Editorial Copy */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block">
                Editorial Lookbook • Vol. IV
              </span>
              <h2 className="font-serif-luxury text-3xl md:text-5xl font-light text-[#30272B] leading-tight">
                Drapes that dance with every whisper of the wind.
              </h2>
              <p className="text-xs md:text-sm text-[#755B57] leading-relaxed font-light">
                Our ateliers honor slow, deliberate couture. Every dress begins with thoughtful sketches inspired by romantic poetry, floral botanicals, and classical architecture. We select solely Mulberry silks, handloom organza, and delicate French laces that age like heirlooms.
              </p>

              <div className="p-5 rounded-2xl bg-[#FAF0F3] border border-[#D99BAA]/30">
                <h4 className="font-serif-luxury text-base font-semibold text-[#30272B] mb-1">
                  Atelier Concierge Fitting
                </h4>
                <p className="text-xs text-[#755B57] leading-relaxed">
                  Have a specific event timeline or need bespoke adjustments to sleeve lengths or necklines? Our master patternmakers offer complimentary consultations for every client.
                </p>
              </div>

              <div>
                <Link
                  href="/lookbook"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#30272B] border-b-2 border-[#C8A56A] pb-1 hover:text-[#C8A56A] transition-colors"
                >
                  <span>Explore The Full Lookbook</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 8. CLIENT LOVE & REVIEWS */}
        <section className="py-16 bg-[#FFF9F4] border-t border-[#EFE5DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-2">
                Voices of the Atelier
              </span>
              <h2 className="font-serif-luxury text-3xl md:text-4xl text-[#30272B] font-light">
                Words from Our Muse
              </h2>
              <div className="w-12 h-0.5 bg-[#C8A56A] mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "The Seraphina Gown exceeded my wildest expectations. The silk has an almost liquid quality, and the hand-ruching hugged my waist like couture made in Paris.",
                  author: "Dr. Ananya Singhania",
                  location: "South Mumbai",
                  item: "The Seraphina Blush Silk Gown",
                },
                {
                  quote: "I wore the Aurora Silk Co-Ord set to an art gallery opening in Jaipur and lost count of how many inquiries I received. The tailoring is flawless.",
                  author: "Meera Oberoi",
                  location: "New Delhi",
                  item: "Aurora Silk Satin Co-Ord Set",
                },
                {
                  quote: "The fabric quality and drape exceeded my expectations! The liquid silk moves with effortless grace. Fast, beautifully boxed delivery.",
                  author: "Pooja Varma",
                  location: "Bengaluru",
                  item: "Mariana Champagne Evening Dress",
                },
              ].map((rev, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-[#EFE5DC] shadow-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-[#C8A56A]">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-[#C8A56A]" />
                      ))}
                    </div>
                    <p className="text-xs text-[#755B57] italic leading-relaxed">
                      &ldquo;{rev.quote}&rdquo;
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#EFE5DC] mt-4">
                    <h5 className="font-serif-luxury text-sm font-semibold text-[#30272B]">{rev.author}</h5>
                    <span className="text-[11px] text-[#755B57]">{rev.location} • Verified Atelier Purchase</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
