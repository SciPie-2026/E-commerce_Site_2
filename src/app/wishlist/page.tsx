"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCard } from "@/components/product/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/lib/types";
import { Heart, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          const allProducts: Product[] = data.products || [];
          setProducts(allProducts.filter((p) => wishlistIds.includes(p.id)));
        }
      } catch (err) {
        console.error("Error loading wishlist products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWishlistProducts();
  }, [wishlistIds]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-1">
            Private Atelier Sanctuary
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#30272B]">
            Your Saved Wishlist ({products.length})
          </h1>
          <p className="text-xs text-[#755B57] mt-2">
            Heirloom silhouettes saved for upcoming galas, celebrations, and festive gatherings.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-[#D99BAA] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-[#755B57] uppercase tracking-wider">Loading Wishlist...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#EFE5DC] p-8 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF0F3] border border-[#D99BAA]/30 flex items-center justify-center mx-auto text-[#D99BAA]">
              <Heart className="w-8 h-8" />
            </div>
            <h4 className="font-serif-luxury text-xl font-medium text-[#30272B]">Your Wishlist is Empty</h4>
            <p className="text-xs text-[#755B57]">
              Explore our boutique collection and tap the heart icon to save silhouettes you adore.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full btn-gold text-xs font-medium">
              <span>Browse Boutique</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
