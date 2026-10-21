"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Order } from "@/lib/types";
import { formatPrice } from "@/config/theme";
import { CheckCircle2, Package, Truck, ArrowRight, Printer } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }

    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order || null);
        }
      } catch (err) {
        console.error("Error loading order confirmation", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#D99BAA] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#755B57] uppercase tracking-wider">Retrieving Atelier Order Details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      {/* Thank you card */}
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-[#EFE5DC] shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FAF0F3] border border-[#D99BAA]/40 flex items-center justify-center mx-auto text-[#D99BAA]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-1">
            Order Confirmed & Secured
          </span>
          <h1 className="font-serif-luxury text-3xl md:text-4xl text-[#30272B] font-light">
            Thank You for Celebrating with AIDAH
          </h1>
          <p className="text-xs md:text-sm text-[#755B57] max-w-md mx-auto mt-2 leading-relaxed">
            Your couture garment has been allocated in our atelier. We are preparing it with our archival box, satin ribbons, and signature sachet.
          </p>
        </div>

        {/* Order Details Banner */}
        <div className="p-4 rounded-2xl bg-[#FFF9F4] border border-[#EFE5DC] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left text-xs">
          <div>
            <span className="text-[#755B57] block text-[10px] uppercase tracking-wider">Order Reference</span>
            <strong className="text-[#30272B] font-serif-luxury text-sm">{order?.order_number || orderNumber}</strong>
          </div>
          <div>
            <span className="text-[#755B57] block text-[10px] uppercase tracking-wider">Order Status</span>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-800">
              {order?.status || "Confirmed"}
            </span>
          </div>
          <div>
            <span className="text-[#755B57] block text-[10px] uppercase tracking-wider">Courier Carrier</span>
            <strong className="text-[#30272B]">{order?.tracking_carrier || "BlueDart Couture"}</strong>
          </div>
          <div>
            <span className="text-[#755B57] block text-[10px] uppercase tracking-wider">Tracking AWN</span>
            <strong className="text-[#C8A56A] font-mono">{order?.tracking_number || "BD9824012IN"}</strong>
          </div>
        </div>

        {/* Order Items Breakdown */}
        {order?.items && order.items.length > 0 && (
          <div className="text-left pt-4 border-t border-[#EFE5DC] space-y-3">
            <h4 className="font-serif-luxury text-base font-semibold text-[#30272B]">
              Atelier Garments in this Order
            </h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-[#FFF9F4] border border-[#EFE5DC] flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-serif-luxury font-medium text-sm text-[#30272B]">{item.product_name}</h5>
                    <span className="text-[#755B57] text-[11px]">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</span>
                  </div>
                  <span className="font-serif-luxury font-semibold text-[#30272B]">
                    {formatPrice(item.item_total)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#EFE5DC] flex justify-between text-sm font-serif-luxury font-semibold text-[#30272B]">
              <span>Total Paid (Sandbox)</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#EFE5DC]">
          <Link
            href={`/track-order?number=${order?.order_number || orderNumber}`}
            className="w-full sm:w-auto px-6 py-3 rounded-full btn-gold text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4 text-[#C8A56A]" />
            <span>Track Delivery</span>
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3 rounded-full btn-outline-boutique text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
          >
            <span>Continue Browsing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="py-20 text-center text-xs">Loading order confirmation...</div>}>
          <ConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
