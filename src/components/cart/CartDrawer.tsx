"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/config/theme";
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    itemCount,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponFeedback(null);
    const res = await applyCoupon(couponInput.trim());
    setCouponFeedback(res);
    setIsApplying(false);
    if (res.success) {
      setCouponInput("");
    }
  };

  const freeShippingThreshold = 3999;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#30272B]/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF9F4] shadow-2xl flex flex-col justify-between border-l border-[#EFE5DC] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#EFE5DC] flex items-center justify-between bg-white/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#30272B]" />
              <h3 className="font-serif-luxury text-xl font-medium text-[#30272B]">
                Atelier Shopping Bag
              </h3>
              <span className="text-xs text-[#755B57] bg-[#F4DDE3] px-2 py-0.5 rounded-full font-semibold">
                {itemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#755B57] hover:text-[#30272B] rounded-full hover:bg-[#F4DDE3] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#FAF0F3] border-b border-[#EFE5DC]/60 text-xs text-[#755B57]">
            {amountNeededForFreeShipping > 0 ? (
              <p className="mb-1.5">
                Add <span className="font-semibold text-[#30272B]">₹{amountNeededForFreeShipping.toLocaleString("en-IN")}</span> more for Complimentary Couture Shipping!
              </p>
            ) : (
              <p className="mb-1.5 font-medium text-emerald-800">
                ✨ Complimentary Couture Shipping Unlocked!
              </p>
            )}
            <div className="w-full bg-[#EFE5DC] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#D99BAA] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F4DDE3] flex items-center justify-center text-[#D99BAA]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-xl text-[#30272B] font-medium">Your Bag is Empty</h4>
                  <p className="text-xs text-[#755B57] mt-1 max-w-xs">
                    Explore our dreamy silhouettes, silk gowns, and seasonal floral collections.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full btn-gold text-xs font-medium"
                >
                  <Link href="/shop">Discover Collection</Link>
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variant_id}
                  className="p-3 bg-white rounded-xl border border-[#EFE5DC] flex gap-3 shadow-xs"
                >
                  <div className="w-20 h-24 relative rounded-lg overflow-hidden bg-[#F7EFE7] shrink-0">
                    <Image
                      src={item.image_url}
                      alt={item.product_name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.product_slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif-luxury text-sm font-medium text-[#30272B] hover:text-[#C8A56A] line-clamp-1"
                        >
                          {item.product_name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.variant_id)}
                          className="text-[#755B57]/60 hover:text-red-500 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#755B57] mt-1">
                        <span>Size: <strong className="text-[#30272B]">{item.size}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-[#30272B]">{item.color}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#D99BAA]/50 rounded-full overflow-hidden bg-[#FFF9F4]">
                        <button
                          onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-[#F4DDE3] text-[#755B57] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#30272B]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-[#F4DDE3] text-[#755B57] transition-colors"
                          disabled={item.quantity >= item.max_stock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif-luxury text-sm font-semibold text-[#30272B]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#EFE5DC] bg-white/80 space-y-4">
              {/* Coupon Code Section */}
              <div>
                {appliedCoupon ? (
                  <div className="p-2.5 rounded-lg bg-[#FAF0F3] border border-[#D99BAA]/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#D99BAA]" />
                      <span>Privilege Code: <strong>{appliedCoupon.code}</strong> (-{formatPrice(discount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] text-red-600 hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Privilege Code (e.g. AIDAH15)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#D99BAA]/50 uppercase placeholder:normal-case focus:outline-none focus:border-[#30272B]"
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="px-3 py-1.5 rounded-lg bg-[#30272B] text-white text-xs font-medium hover:bg-[#C8A56A] transition-colors"
                    >
                      {isApplying ? "..." : "Apply"}
                    </button>
                  </form>
                )}
                {couponFeedback && (
                  <p className={`text-[11px] mt-1 ${couponFeedback.success ? "text-emerald-700" : "text-rose-600"}`}>
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Price Calculation breakdown */}
              <div className="space-y-1.5 text-xs text-[#755B57] pt-2 border-t border-[#EFE5DC]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#30272B] font-medium">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#D99BAA]">
                    <span>Privilege Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax (5% GST)</span>
                  <span className="text-[#30272B] font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Couture Shipping</span>
                  <span className="text-[#30272B] font-medium">
                    {shippingFee === 0 ? "Complimentary" : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-serif-luxury font-semibold text-[#30272B] pt-2 border-t border-[#EFE5DC]">
                  <span>Total Amount</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 rounded-full btn-gold text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 text-center"
              >
                <span>Proceed to Atelier Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
