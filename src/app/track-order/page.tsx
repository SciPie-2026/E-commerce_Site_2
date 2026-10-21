"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Order } from "@/lib/types";
import { formatPrice } from "@/config/theme";
import { Search, Truck, CheckCircle2, Clock, PackageCheck, Scissors, MapPin } from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialNumber = searchParams.get("number") || "";
  const [orderNumberInput, setOrderNumberInput] = useState(initialNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchTracking = async (num: string) => {
    if (!num.trim()) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(num.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.order) {
        setErrorMsg(data.error || "No order found matching this reference number.");
        setOrder(null);
      } else {
        setOrder(data.order);
      }
    } catch {
      setErrorMsg("Error communicating with tracking servers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialNumber) {
      fetchTracking(initialNumber);
    }
  }, [initialNumber]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderNumberInput);
  };

  // Tracking steps
  const steps = [
    { title: "Order Confirmed", desc: "Payment authorized & silk allocated", icon: CheckCircle2, done: true },
    { title: "Atelier Pattern Cutting", desc: "Hand-measured to specifications", icon: Scissors, done: true },
    { title: "Finished & Sachet Packed", desc: "Archival gift box & ribbon wrap", icon: PackageCheck, done: order?.status !== "pending" },
    { title: "Dispatched with Courier", desc: "BlueDart express air transit", icon: Truck, done: ["shipped", "delivered"].includes(order?.status || "") },
    { title: "Delivered", desc: "Safely received at address", icon: MapPin, done: order?.status === "delivered" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-1">
          Courier Concierge
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#30272B]">
          Track Your Atelier Order
        </h1>
        <p className="text-xs text-[#755B57] mt-2">
          Enter your order reference (e.g. AIDAH-2026-00101) or airway bill number.
        </p>
      </div>

      {/* Input Search Form */}
      <form onSubmit={handleTrackSubmit} className="max-w-lg mx-auto flex gap-2 mb-10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#755B57] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="e.g. AIDAH-2026-00101"
            value={orderNumberInput}
            onChange={(e) => setOrderNumberInput(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full border border-[#D99BAA]/50 bg-white text-xs text-[#30272B] focus:outline-none focus:border-[#30272B] shadow-xs"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-full btn-gold text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
        >
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      {errorMsg && (
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center mb-8">
          {errorMsg}
        </div>
      )}

      {/* Tracking Details Result */}
      {order && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EFE5DC] shadow-sm space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EFE5DC] gap-4">
            <div>
              <span className="text-[10px] text-[#755B57] uppercase tracking-wider block">Order Reference</span>
              <h3 className="font-serif-luxury text-2xl font-medium text-[#30272B]">{order.order_number}</h3>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FFF9F4] border border-[#EFE5DC]">
                <span className="text-[10px] text-[#755B57] block">Carrier Tracking</span>
                <strong className="font-mono text-[#C8A56A]">{order.tracking_number || "BD9824012IN"}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF0F3] border border-[#D99BAA]/30">
                <span className="text-[10px] text-[#755B57] block">Delivery Status</span>
                <strong className="uppercase text-emerald-800 font-semibold">{order.status}</strong>
              </div>
            </div>
          </div>

          {/* Milestone Step Indicator */}
          <div className="relative pl-6 border-l-2 border-[#D99BAA]/40 space-y-8 my-6">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="relative group">
                  <div
                    className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-white ${
                      st.done ? "bg-[#30272B]" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className={`font-serif-luxury text-base font-medium ${st.done ? "text-[#30272B]" : "text-gray-400"}`}>
                      {st.title}
                    </h5>
                    <p className="text-xs text-[#755B57]">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Garments in this delivery */}
          {order.items && (
            <div className="pt-6 border-t border-[#EFE5DC] space-y-3">
              <h4 className="font-serif-luxury text-base font-semibold text-[#30272B]">
                Enclosed Garments
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {order.items.map((it) => (
                  <div key={it.id} className="p-3 rounded-xl bg-[#FFF9F4] border border-[#EFE5DC]">
                    <strong className="text-[#30272B] block">{it.product_name}</strong>
                    <span className="text-[11px] text-[#755B57]">Size: {it.size} • Color: {it.color} • Qty {it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="py-20 text-center text-xs">Loading tracking system...</div>}>
          <TrackOrderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
