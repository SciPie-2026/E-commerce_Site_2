"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/config/theme";
import {
  Lock,
  ShieldCheck,
  CreditCard,
  Truck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal, discount, tax, shippingFee, total, clearCart, appliedCoupon } = useCart();
  const { user } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street1: "",
    street2: "",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400050",
    country: "India",
    notes: "",
    paymentMethod: "sandbox_card",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg("Your shopping bag is empty.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          couponCode: appliedCoupon?.code,
          notes: formData.notes,
          paymentMethod: formData.paymentMethod,
          shippingAddress: {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            street_line1: formData.street1,
            street_line2: formData.street2,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postalCode,
            country: formData.country,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to place order.");
        setLoading(false);
        return;
      }

      // Luxury celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#D99BAA", "#C8A56A", "#F4DDE3", "#30272B"],
        });
      } catch {
        // ignore if confetti fails
      }

      clearCart();
      window.location.href = `/order-confirmation?orderNumber=${data.orderNumber}`;
    } catch {
      setErrorMsg("A network error occurred while placing your order.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
        <Header />
        <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="font-serif-luxury text-3xl text-[#30272B]">Your Bag is Empty</h2>
          <p className="text-xs text-[#755B57]">
            Please add some pieces from our collections before proceeding to atelier checkout.
          </p>
          <Link href="/shop" className="inline-block px-8 py-3 rounded-full btn-gold text-xs uppercase tracking-widest font-semibold">
            Explore Silhouettes
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Checkout Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-1">
            Atelier Checkout
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#30272B]">
            Finalize Your Couture Order
          </h1>
          <p className="text-xs text-[#755B57] mt-2">
            Secure 256-bit SSL encrypted atelier checkout.
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Form: Client & Shipping Details (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE5DC] shadow-xs space-y-8">
            {/* Step 1: Customer Contact */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#EFE5DC]">
                <span className="w-5 h-5 rounded-full bg-[#30272B] text-white text-[11px] font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-serif-luxury text-lg font-medium text-[#30272B]">
                  Client Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Lady Sophia Sterling"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="sophia@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#755B57] font-medium mb-1">Phone Number (for Courier SMS) *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98200 11223"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#EFE5DC]">
                <span className="w-5 h-5 rounded-full bg-[#30272B] text-white text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-serif-luxury text-lg font-medium text-[#30272B]">
                  Boutique Delivery Address
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Street Address & Landmark *</label>
                  <input
                    type="text"
                    name="street1"
                    value={formData.street1}
                    onChange={handleChange}
                    placeholder="Apartment 14B, Royal Palms Crest, Pali Hill"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Apartment, Suite, Unit (Optional)</label>
                  <input
                    type="text"
                    name="street2"
                    value={formData.street2}
                    onChange={handleChange}
                    placeholder="Floor 4, East Wing"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#755B57] font-medium mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#755B57] font-medium mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#755B57] font-medium mb-1">PIN Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Special Atelier Packaging or Fitting Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g. Scent with signature lavender sachet, hand deliver after 4 PM..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#EFE5DC]">
                <span className="w-5 h-5 rounded-full bg-[#30272B] text-white text-[11px] font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-serif-luxury text-lg font-medium text-[#30272B]">
                  Payment Method (Sandbox Test Mode)
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <label className="p-3.5 rounded-xl border border-[#30272B] bg-[#FAF0F3] flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="sandbox_card"
                      checked={formData.paymentMethod === "sandbox_card"}
                      onChange={handleChange}
                      className="accent-[#30272B]"
                    />
                    <div>
                      <span className="font-semibold text-[#30272B] block">Credit / Debit Card (Sandbox Safe Mode)</span>
                      <span className="text-[11px] text-[#755B57]">Instant simulated transaction • Zero charge</span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#C8A56A]" />
                </label>

                <label className="p-3.5 rounded-xl border border-[#EFE5DC] bg-[#FFF9F4] flex items-center justify-between cursor-pointer hover:border-[#D99BAA]">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="sandbox_upi"
                      checked={formData.paymentMethod === "sandbox_upi"}
                      onChange={handleChange}
                      className="accent-[#30272B]"
                    />
                    <div>
                      <span className="font-semibold text-[#30272B] block">UPI / QR Payment (Sandbox)</span>
                      <span className="text-[11px] text-[#755B57]">Google Pay, PhonePe, Paytm simulation</span>
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-[#755B57]" />
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary: Order Items & Totals (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE5DC] shadow-xs space-y-6">
            <h3 className="font-serif-luxury text-xl font-medium text-[#30272B] pb-3 border-b border-[#EFE5DC]">
              Order Summary ({items.length} items)
            </h3>

            {/* Items list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.variant_id} className="flex gap-3 text-xs items-center">
                  <div className="w-14 h-16 rounded-lg overflow-hidden bg-[#F7EFE7] relative shrink-0">
                    <Image src={item.image_url} alt={item.product_name} fill className="object-cover object-top" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-serif-luxury font-medium text-[#30272B] line-clamp-1">{item.product_name}</h5>
                    <p className="text-[11px] text-[#755B57]">{item.size} • {item.color} • Qty {item.quantity}</p>
                  </div>
                  <span className="font-serif-luxury font-semibold text-[#30272B]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="pt-4 border-t border-[#EFE5DC] space-y-2 text-xs text-[#755B57]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#30272B] font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#D99BAA]">
                  <span>Privilege Code ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span className="text-[#30272B] font-medium">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Couture Shipping</span>
                <span className="text-[#30272B] font-medium">
                  {shippingFee === 0 ? "Complimentary" : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-serif-luxury font-semibold text-[#30272B] pt-3 border-t border-[#EFE5DC]">
                <span>Total Due</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full btn-gold text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
            >
              {loading ? (
                <span>Securing Atelier Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#C8A56A]" />
                  <span>Authorize & Place Order • {formatPrice(total)}</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-[#755B57]/70 text-center space-y-1">
              <p>Sandbox Test Mode: No real payment will be deducted from your account.</p>
              <p>Insured courier dispatch within 3-5 business days.</p>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
