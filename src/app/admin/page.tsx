"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/config/theme";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Users,
  Shirt,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Package,
} from "lucide-react";

interface AdminMetricsData {
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    totalCustomers: number;
    totalProducts: number;
    lowStockCount: number;
  };
  lowStockVariants: Array<{
    id: string;
    product_name: string;
    size: string;
    color: string;
    stock_quantity: number;
  }>;
  recentOrders: Array<{
    id: string;
    order_number: string;
    guest_email: string;
    status: string;
    payment_status: string;
    total_amount: number;
    created_at: string;
  }>;
  auditLogs: Array<{
    id: string;
    action: string;
    entity_type: string;
    created_at: string;
  }>;
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminMetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await fetch("/api/admin/metrics");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Error fetching metrics", err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#D99BAA] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#755B57] uppercase tracking-wider">Compiling Business Metrics...</p>
      </div>
    );
  }

  const m = data?.metrics || {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockCount: 0,
  };

  const kpis = [
    { title: "Net Revenue", value: formatPrice(m.totalRevenue), subtitle: "From verified paid transactions", icon: DollarSign, color: "text-emerald-700", bg: "bg-emerald-50" },
    { title: "Total Orders", value: m.totalOrders.toString(), subtitle: "Across all channels", icon: ShoppingBag, color: "text-[#30272B]", bg: "bg-[#FFF9F4]" },
    { title: "Pending Orders", value: m.pendingOrders.toString(), subtitle: "Awaiting dispatch packaging", icon: Clock, color: "text-amber-700", bg: "bg-amber-50" },
    { title: "Registered Patrons", value: m.totalCustomers.toString(), subtitle: "Boutique salon members", icon: Users, color: "text-[#755B57]", bg: "bg-[#FAF0F3]" },
    { title: "Catalog Silhouettes", value: m.totalProducts.toString(), subtitle: "Live in store catalogue", icon: Shirt, color: "text-[#30272B]", bg: "bg-white" },
    { title: "Low Stock Alerts", value: m.lowStockCount.toString(), subtitle: "Variants with ≤ 5 units", icon: AlertTriangle, color: "text-rose-700", bg: "bg-rose-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#D99BAA] font-semibold block">
            Executive Summary
          </span>
          <h1 className="font-serif-luxury text-3xl font-light text-[#30272B]">
            Atelier Director Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 rounded-full btn-gold text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <span>+ Create New Silhouette</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={i}
              className="p-6 bg-white rounded-2xl border border-[#EFE5DC] shadow-xs flex items-start justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#755B57] font-medium block">
                  {kpi.title}
                </span>
                <span className={`font-serif-luxury text-2xl font-bold ${kpi.color}`}>
                  {kpi.value}
                </span>
                <span className="text-[11px] text-[#755B57]/70 block">{kpi.subtitle}</span>
              </div>

              <div className={`w-11 h-11 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders and Low Stock Alerts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE5DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE5DC]">
            <h3 className="font-serif-luxury text-xl font-medium text-[#30272B]">
              Recent Atelier Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-[#D99BAA] hover:underline font-medium flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#EFE5DC]/60 text-xs">
            {data?.recentOrders && data.recentOrders.length > 0 ? (
              data.recentOrders.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between">
                  <div>
                    <strong className="font-serif-luxury text-sm text-[#30272B] block">
                      {ord.order_number}
                    </strong>
                    <span className="text-[#755B57] text-[11px]">
                      {ord.guest_email} • {ord.created_at ? ord.created_at.slice(0, 10) : "2026-10-21"}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-serif-luxury font-semibold text-sm text-[#30272B] block">
                      {formatPrice(ord.total_amount)}
                    </span>
                    <span className={`inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                      ord.status === "delivered" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-[#755B57]">No orders placed yet.</p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts & Telemetry (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Low Stock Warning */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE5DC] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE5DC]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="font-serif-luxury text-base font-semibold text-[#30272B]">
                  Restock Alerts
                </h3>
              </div>
              <Link href="/admin/inventory" className="text-xs text-[#D99BAA] hover:underline">
                Manage Stock
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              {data?.lowStockVariants && data.lowStockVariants.length > 0 ? (
                data.lowStockVariants.map((v) => (
                  <div
                    key={v.id}
                    className="p-2.5 rounded-xl bg-[#FAF0F3] border border-[#D99BAA]/30 flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-[#30272B] block line-clamp-1">{v.product_name}</strong>
                      <span className="text-[11px] text-[#755B57]">
                        Size: {v.size} • Color: {v.color}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                      {v.stock_quantity} Left
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-xs text-emerald-700">All inventory levels healthy.</p>
              )}
            </div>
          </div>

          {/* Security & Audit Feed */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE5DC] shadow-xs space-y-3 text-xs">
            <h4 className="font-serif-luxury text-sm font-semibold text-[#30272B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C8A56A]" />
              <span>Administrative Audit Trail</span>
            </h4>
            <div className="space-y-2 text-[11px] text-[#755B57]">
              {data?.auditLogs && data.auditLogs.map((log) => (
                <div key={log.id} className="p-2 rounded-lg bg-[#FFF9F4] flex items-center justify-between">
                  <span>{log.action} ({log.entity_type})</span>
                  <span className="text-[#755B57]/60">
                    {log.created_at ? log.created_at.slice(11, 16) : "12:00"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
