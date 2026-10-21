"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice } from "@/config/theme";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingBag, Eye, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [quickAdded, setQuickAdded] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const primaryImage = product.primary_image || "/media/catalog/hero-campaign.jpg";
  const hasDiscount = product.sale_price && product.sale_price < product.base_price;
  const currentPrice = product.sale_price || product.base_price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const firstVariant = product.variants?.[0] || {
      id: `var_${product.id}_def`,
      size: "M",
      color: "Rose",
      stock_quantity: 10,
    };

    addItem({
      variant_id: firstVariant.id,
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      image_url: primaryImage,
      size: firstVariant.size,
      color: firstVariant.color,
      price: currentPrice,
      quantity: 1,
      max_stock: firstVariant.stock_quantity,
    });

    setQuickAdded(true);
    setTimeout(() => setQuickAdded(false), 2000);
  };

  return (
    <div className="group relative flex flex-col justify-between boutique-card rounded-2xl overflow-hidden p-3 bg-white/70">
      {/* Image Container with Badges & Wishlist Action */}
      <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden bg-[#F7EFE7] mb-3.5">
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.is_new && (
            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#30272B] text-white">
              New In
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#D99BAA] text-white">
              Privilege Offer
            </span>
          )}
          {product.is_bestseller && (
            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#C8A56A] text-white">
              Atelier Icon
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 backdrop-blur-md shadow-xs ${
            isWishlisted
              ? "bg-[#D99BAA] text-white scale-110"
              : "bg-white/80 text-[#755B57] hover:text-[#D99BAA] hover:bg-white"
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2.5 rounded-full bg-[#30272B]/90 hover:bg-[#30272B] text-white text-xs font-medium backdrop-blur-md transition-all flex items-center justify-center gap-1.5 shadow-md"
          >
            {quickAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>

          <Link
            href={`/product/${product.slug}`}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#30272B] flex items-center justify-center backdrop-blur-md transition-colors shadow-md"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#755B57] font-medium block mb-1">
            {product.category_name || "Couture Silhouettes"}
          </span>

          <Link
            href={`/product/${product.slug}`}
            className="font-serif-luxury text-base font-medium text-[#30272B] hover:text-[#C8A56A] transition-colors line-clamp-1 mb-1.5"
          >
            {product.name}
          </Link>

          {/* Color Swatches if available */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              {Array.from(new Set(product.variants.map((v) => v.color_hex))).slice(0, 4).map((hex, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-2xs"
                  style={{ backgroundColor: hex }}
                />
              ))}
              {new Set(product.variants.map((v) => v.color_hex)).size > 4 && (
                <span className="text-[10px] text-[#755B57]">
                  +{new Set(product.variants.map((v) => v.color_hex)).size - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-[#EFE5DC]/60">
          <span className="font-serif-luxury text-base font-semibold text-[#30272B]">
            {formatPrice(currentPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs line-through text-[#755B57]/60">
              {formatPrice(product.base_price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
