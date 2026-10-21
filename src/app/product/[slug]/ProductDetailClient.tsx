"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, ProductVariant, Review } from "@/lib/types";
import { formatPrice } from "@/config/theme";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/product/ProductCard";
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Check,
  Share2,
  Scissors,
  CheckCircle2,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  reviews: Review[];
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  reviews,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Selected variant state
  const variants = product.variants || [];
  const [selectedSize, setSelectedSize] = useState<string>(variants[0]?.size || "M");
  const [selectedColor, setSelectedColor] = useState<string>(variants[0]?.color || "Rose");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"fabric" | "fit" | "shipping">("fabric");
  const [selectedImage, setSelectedImage] = useState<string>(product.primary_image || "/media/catalog/hero-campaign.jpg");
  const [addedNotice, setAddedNotice] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Matched variant
  const currentVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  ) || variants[0];

  const availableStock = currentVariant?.stock_quantity || 0;
  const isOutOfStock = availableStock <= 0;
  const currentPrice = currentVariant?.price_override || product.sale_price || product.base_price;
  const hasDiscount = product.sale_price && product.sale_price < product.base_price;
  const isWishlisted = isInWishlist(product.id);

  // Unique colors and sizes
  const uniqueColors = Array.from(
    new Map(variants.map((v) => [v.color, v])).values()
  );
  const uniqueSizes = Array.from(new Set(variants.map((v) => v.size)));

  const handleAddToCart = () => {
    if (isOutOfStock || !currentVariant) return;

    addItem({
      variant_id: currentVariant.id,
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      image_url: selectedImage,
      size: currentVariant.size,
      color: currentVariant.color,
      price: currentPrice,
      quantity,
      max_stock: availableStock,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.short_desc,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-[#755B57] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#30272B]">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#30272B]">Shop</Link>
        <span>/</span>
        {product.category_slug && (
          <>
            <Link href={`/category/${product.category_slug}`} className="hover:text-[#30272B]">
              {product.category_name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[#30272B] font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Large Main Showcase Image */}
          <div className="relative w-full aspect-3/4 max-h-[700px] rounded-3xl overflow-hidden bg-[#F7EFE7] border border-[#EFE5DC] shadow-sm">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-top"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_new && (
                <span className="px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#30272B] text-white">
                  New Arrival
                </span>
              )}
              {hasDiscount && (
                <span className="px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#D99BAA] text-white">
                  Special Privilege Offer
                </span>
              )}
            </div>

            {/* Wishlist Floating Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-md ${
                isWishlisted
                  ? "bg-[#D99BAA] text-white"
                  : "bg-white/80 text-[#755B57] hover:bg-white hover:text-[#D99BAA]"
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-white" : ""}`} />
            </button>
          </div>

          {/* Thumbnails Gallery Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`w-20 h-24 relative rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img.image_url
                      ? "border-[#30272B] scale-102"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt={img.alt_text || product.name}
                    fill
                    className="object-cover object-top"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Purchase Actions (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE5DC] shadow-xs space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold">
                {product.category_name || "Couture Silhouettes"}
              </span>
              <span className="text-[11px] text-[#755B57]/70">SKU: {currentVariant?.sku || product.sku}</span>
            </div>

            <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-[#30272B] leading-snug">
              {product.name}
            </h1>

            {/* Reviews count */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EFE5DC]/60">
              <div className="flex items-center gap-1.5 text-xs text-[#755B57]">
                <div className="flex items-center text-[#C8A56A]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C8A56A]" />
                  ))}
                </div>
                <span>5.0 ({reviews.length} Verified Reviews)</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-[#EFE5DC]">
            <span className="font-serif-luxury text-3xl font-semibold text-[#30272B]">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm line-through text-[#755B57]/60">
                {formatPrice(product.base_price)}
              </span>
            )}
            <span className="text-xs text-[#755B57]">Inclusive of all taxes</span>
          </div>

          {/* Color Swatches */}
          {uniqueColors.length > 0 && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#755B57] font-semibold mb-2">
                Color Shade: <strong className="text-[#30272B]">{selectedColor}</strong>
              </label>
              <div className="flex items-center gap-2.5">
                {uniqueColors.map((col) => (
                  <button
                    key={col.color}
                    onClick={() => {
                      setSelectedColor(col.color);
                      if (col.image_url) setSelectedImage(col.image_url);
                    }}
                    className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor === col.color
                        ? "border-[#30272B] scale-110 shadow-sm"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: col.color_hex }}
                    title={col.color}
                  >
                    {selectedColor === col.color && (
                      <Check className="w-3.5 h-3.5 text-white filter drop-shadow-xs" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-widest text-[#755B57] font-semibold">
                Select Size: <strong className="text-[#30272B]">{selectedSize}</strong>
              </label>
              <Link href="/size-guide" className="text-xs text-[#D99BAA] underline hover:text-[#C8A56A]">
                Atelier Size Guide
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {uniqueSizes.map((sz) => {
                const varForSize = variants.find(
                  (v) => v.size === sz && v.color === selectedColor
                );
                const hasStock = varForSize && varForSize.stock_quantity > 0;

                return (
                  <button
                    key={sz}
                    disabled={!hasStock}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2.5 rounded-xl text-xs font-medium border transition-all ${
                      selectedSize === sz
                        ? "bg-[#30272B] text-white border-[#30272B] shadow-xs"
                        : hasStock
                        ? "bg-[#FFF9F4] text-[#755B57] border-[#D99BAA]/40 hover:border-[#30272B]"
                        : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Stock Indicator */}
          <div className="text-xs">
            {availableStock > 0 ? (
              <span className={`inline-flex items-center gap-1.5 ${availableStock <= 4 ? "text-amber-700 font-medium" : "text-emerald-700"}`}>
                <span className={`w-2 h-2 rounded-full ${availableStock <= 4 ? "bg-amber-600" : "bg-emerald-600"}`} />
                {availableStock <= 4
                  ? `Only ${availableStock} pieces remaining in atelier inventory`
                  : "In Stock • Ready for Atelier Dispatch"}
              </span>
            ) : (
              <span className="text-rose-600 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                Sold Out in this combination
              </span>
            )}
          </div>

          {/* Quantity Selector & Add to Bag Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#D99BAA]/50 rounded-full bg-[#FFF9F4] px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-1 text-xs text-[#755B57] hover:text-[#30272B]"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-3 text-xs font-semibold text-[#30272B]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  className="px-2 py-1 text-xs text-[#755B57] hover:text-[#30272B]"
                  disabled={quantity >= availableStock}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 rounded-full btn-gold text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? "Out of Stock" : "Add to Bag"}</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-3.5 rounded-full btn-outline-boutique text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>Instant Checkout • {formatPrice(currentPrice * quantity)}</span>
            </button>
          </div>

          {/* Share Button */}
          <div className="pt-2 flex items-center justify-between text-xs text-[#755B57]">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 hover:text-[#30272B] transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C8A56A]" />
              <span>{copiedLink ? "Link Copied to Clipboard!" : "Share Silhouette"}</span>
            </button>
            <span className="text-[11px] text-emerald-700 font-medium">
              Free Couture Shipping Above ₹3,999
            </span>
          </div>

          {/* Product Details Tabs */}
          <div className="pt-4 border-t border-[#EFE5DC] space-y-3">
            <div className="flex border-b border-[#EFE5DC] text-xs">
              <button
                onClick={() => setActiveTab("fabric")}
                className={`py-2 px-3 font-semibold transition-colors border-b-2 ${
                  activeTab === "fabric"
                    ? "border-[#30272B] text-[#30272B]"
                    : "border-transparent text-[#755B57]"
                }`}
              >
                Fabric & Care
              </button>
              <button
                onClick={() => setActiveTab("fit")}
                className={`py-2 px-3 font-semibold transition-colors border-b-2 ${
                  activeTab === "fit"
                    ? "border-[#30272B] text-[#30272B]"
                    : "border-transparent text-[#755B57]"
                }`}
              >
                Silhouette & Fit
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`py-2 px-3 font-semibold transition-colors border-b-2 ${
                  activeTab === "shipping"
                    ? "border-[#30272B] text-[#30272B]"
                    : "border-transparent text-[#755B57]"
                }`}
              >
                Shipping & Returns
              </button>
            </div>

            <div className="text-xs text-[#755B57] leading-relaxed pt-1">
              {activeTab === "fabric" && (
                <div className="space-y-2">
                  <p><strong>Fabric:</strong> {product.fabric || "Pure Mulberry Silk & French Organza"}</p>
                  <p><strong>Care:</strong> {product.care_instructions || "Dry clean only. Store in archival cotton bag away from direct sunlight."}</p>
                </div>
              )}
              {activeTab === "fit" && (
                <div className="space-y-2">
                  <p><strong>Fit Type:</strong> {product.fit || "Tailored bodice with flowing bias drape"}</p>
                  <p><strong>Occasion:</strong> {product.occasion || "Evening Gala, High Tea, Reception"}</p>
                </div>
              )}
              {activeTab === "shipping" && (
                <div className="space-y-2">
                  <p><strong>Delivery:</strong> Dispatches within 3-5 business days via BlueDart insured courier.</p>
                  <p><strong>Returns:</strong> 14-day return and exchange guarantee for unworn items with security seal intact.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-16 pt-12 border-t border-[#EFE5DC]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-1">
              Client Appraisals
            </span>
            <h3 className="font-serif-luxury text-3xl font-light text-[#30272B]">
              Verified Client Reviews ({reviews.length})
            </h3>
          </div>

          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="p-5 rounded-2xl bg-white border border-[#EFE5DC] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif-luxury text-base font-medium text-[#30272B]">{r.author_name}</span>
                    {r.is_verified_purchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-[#C8A56A]">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C8A56A]" />
                    ))}
                  </div>
                </div>

                <h5 className="text-xs font-semibold text-[#30272B] mb-1">{r.title}</h5>
                <p className="text-xs text-[#755B57] leading-relaxed">{r.comment}</p>
                <span className="text-[10px] text-[#755B57]/60 block mt-2">
                  {r.created_at ? r.created_at.slice(0, 10) : "2026-10-21"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Silhouettes Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#EFE5DC]">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-1">
              Complete the Aesthetic
            </span>
            <h3 className="font-serif-luxury text-3xl font-light text-[#30272B]">
              You May Also Adore
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
