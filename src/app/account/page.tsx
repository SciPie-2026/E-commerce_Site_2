"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/lib/types";
import { formatPrice } from "@/config/theme";
import {
  Package,
  MapPin,
  User as UserIcon,
  LogOut,
  Truck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Error loading account orders", err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#D99BAA] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 w-full">
        {/* User Welcome Banner */}
        <div className="p-8 rounded-3xl bg-white border border-[#EFE5DC] shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#FAF0F3] border border-[#D99BAA]/40 flex items-center justify-center text-[#D99BAA] font-serif-luxury text-xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#D99BAA] font-semibold">
                Salon Client Sanctuary
              </span>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#30272B]">
                {user.name}
              </h1>
              <p className="text-xs text-[#755B57]">{user.email} • Client since {user.created_at ? user.created_at.slice(0, 4) : "2026"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="px-5 py-2.5 rounded-full bg-[#30272B] text-white text-xs font-medium hover:bg-[#C8A56A] transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8A56A]" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-full border border-[#D99BAA]/50 text-xs font-medium text-[#755B57] hover:bg-[#FAF0F3] transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#EFE5DC] text-xs">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-4 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "orders"
                ? "border-[#30272B] text-[#30272B]"
                : "border-transparent text-[#755B57] hover:text-[#30272B]"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`pb-3 px-4 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "addresses"
                ? "border-[#30272B] text-[#30272B]"
                : "border-transparent text-[#755B57] hover:text-[#30272B]"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-4 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "profile"
                ? "border-[#30272B] text-[#30272B]"
                : "border-transparent text-[#755B57] hover:text-[#30272B]"
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Account Details</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="py-12 text-center text-xs text-[#755B57]">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#EFE5DC] space-y-4">
                <Package className="w-10 h-10 text-[#D99BAA] mx-auto" />
                <h4 className="font-serif-luxury text-xl font-medium text-[#30272B]">No Orders Placed Yet</h4>
                <p className="text-xs text-[#755B57] max-w-sm mx-auto">
                  Your atelier shopping history will appear here once you acquire your first couture silhouette.
                </p>
                <Link href="/shop" className="inline-block px-6 py-2.5 rounded-full btn-gold text-xs font-medium">
                  Browse Boutique
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-6 bg-white rounded-2xl border border-[#EFE5DC] shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EFE5DC] gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#755B57] uppercase tracking-wider block">Order Number</span>
                      <strong className="font-serif-luxury text-base text-[#30272B]">{ord.order_number}</strong>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[10px] text-[#755B57] uppercase tracking-wider block">Date</span>
                        <span>{ord.created_at ? ord.created_at.slice(0, 10) : "2026-10-21"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#755B57] uppercase tracking-wider block">Status</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-800">
                          {ord.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#755B57] uppercase tracking-wider block">Total</span>
                        <strong className="font-serif-luxury text-sm text-[#30272B]">{formatPrice(ord.total_amount)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {ord.items?.map((it) => (
                      <div key={it.id} className="flex items-center justify-between text-xs py-1">
                        <div>
                          <span className="font-medium text-[#30272B]">{it.product_name}</span>
                          <span className="text-[#755B57] text-[11px] block">Size: {it.size} • Color: {it.color} • Qty: {it.quantity}</span>
                        </div>
                        <span className="font-serif-luxury font-medium text-[#30272B]">
                          {formatPrice(it.item_total)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#EFE5DC] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#755B57]">
                      <Truck className="w-4 h-4 text-[#C8A56A]" />
                      <span>{ord.tracking_carrier || "BlueDart Express"}: <strong className="font-mono text-[#30272B]">{ord.tracking_number || "BD982410IN"}</strong></span>
                    </div>

                    <Link
                      href={`/track-order?number=${ord.order_number}`}
                      className="text-xs text-[#30272B] font-semibold underline hover:text-[#C8A56A] flex items-center gap-1"
                    >
                      <span>Track Shipment</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === "addresses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#EFE5DC] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF0F3] text-[#755B57] uppercase">
                  Primary Atelier Destination
                </span>
                <span className="text-xs text-emerald-700 font-medium">Default</span>
              </div>
              <h4 className="font-serif-luxury text-lg text-[#30272B]">{user.name}</h4>
              <p className="text-xs text-[#755B57] leading-relaxed">
                Apartment 14B, Royal Palms Crest, Pali Hill<br />
                Bandra West, Mumbai, Maharashtra 400050<br />
                India
              </p>
              <p className="text-xs text-[#755B57]">Contact: {user.phone || "+91 98200 11223"}</p>
            </div>
          </div>
        )}

        {/* Tab 3: Profile */}
        {activeTab === "profile" && (
          <div className="max-w-xl bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE5DC] shadow-xs space-y-4 text-xs">
            <h3 className="font-serif-luxury text-xl font-medium text-[#30272B] pb-2 border-b border-[#EFE5DC]">
              Atelier Profile Settings
            </h3>
            <div>
              <span className="text-[#755B57] block mb-1">Full Name</span>
              <div className="p-3 bg-[#FFF9F4] rounded-xl border border-[#EFE5DC] text-[#30272B] font-medium">{user.name}</div>
            </div>
            <div>
              <span className="text-[#755B57] block mb-1">Email Address</span>
              <div className="p-3 bg-[#FFF9F4] rounded-xl border border-[#EFE5DC] text-[#30272B] font-medium">{user.email}</div>
            </div>
            <div>
              <span className="text-[#755B57] block mb-1">Membership Status</span>
              <div className="p-3 bg-[#FAF0F3] rounded-xl border border-[#D99BAA]/30 text-[#755B57] font-semibold">
                Privileged Atelier Patron • 15% Privilege Code Available
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
