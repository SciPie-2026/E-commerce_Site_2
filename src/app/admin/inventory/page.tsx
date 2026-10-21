"use client";

import React, { useEffect, useState } from "react";
import { formatPrice } from "@/config/theme";
import { Plus, Minus, AlertTriangle, Check, Search } from "lucide-react";

interface VariantItem {
  id: string;
  product_name: string;
  size: string;
  color: string;
  sku: string;
  stock_quantity: number;
}

export default function AdminInventoryPage() {
  const [variants, setVariants] = useState<VariantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const loadVariants = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const json = await res.json();
        const allVars: VariantItem[] = [];
        for (const p of json.products || []) {
          for (const v of p.variants || []) {
            allVars.push({
              id: v.id,
              product_name: p.name,
              size: v.size,
              color: v.color,
              sku: v.sku,
              stock_quantity: v.stock_quantity,
            });
          }
        }
        setVariants(allVars);
      }
    } catch (err) {
      console.error("Error loading inventory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVariants();
  }, []);

  const handleAdjustStock = async (vId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: vId, stock_quantity: newStock }),
      });

      if (res.ok) {
        setVariants((prev) =>
          prev.map((v) => (v.id === vId ? { ...v, stock_quantity: newStock } : v))
        );
        setNotice("Stock level updated in atelier database.");
        setTimeout(() => setNotice(""), 2000);
      }
    } catch (err) {
      console.error("Error updating stock", err);
    }
  };

  const filtered = variants.filter(
    (v) =>
      v.product_name.toLowerCase().includes(search.toLowerCase()) ||
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      v.color.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#D99BAA] font-semibold block">
            Atelier Stock Control
          </span>
          <h1 className="font-serif-luxury text-3xl font-light text-[#30272B]">
            Variant Inventory Management ({variants.length})
          </h1>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#755B57] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter variants by silhouette, color, or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-full border border-[#D99BAA]/40 bg-white text-xs text-[#30272B] focus:outline-none focus:border-[#30272B]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#EFE5DC] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EFE5DC] bg-[#FFF9F4] text-[#755B57] uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Silhouette</th>
                <th className="py-3 px-4 font-semibold">Size</th>
                <th className="py-3 px-4 font-semibold">Color Shade</th>
                <th className="py-3 px-4 font-semibold">Variant SKU</th>
                <th className="py-3 px-4 font-semibold">Stock In Hand</th>
                <th className="py-3 px-4 font-semibold text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE5DC]/60 text-[#30272B]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#755B57]">
                    Loading atelier variants...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#755B57]">
                    No variants match your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-[#FAF0F3]/40 transition-colors">
                    <td className="py-3.5 px-4 font-serif-luxury font-medium text-sm">
                      {v.product_name}
                    </td>
                    <td className="py-3.5 px-4 font-semibold">{v.size}</td>
                    <td className="py-3.5 px-4">{v.color}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#755B57]">{v.sku}</td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        v.stock_quantity <= 3
                          ? "bg-rose-100 text-rose-800"
                          : v.stock_quantity <= 6
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {v.stock_quantity} Units
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleAdjustStock(v.id, v.stock_quantity, -1)}
                          className="w-7 h-7 rounded-lg border border-[#D99BAA]/40 text-[#755B57] hover:bg-[#FAF0F3] flex items-center justify-center transition-colors"
                          title="Deduct 1 unit"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(v.id, v.stock_quantity, 1)}
                          className="w-7 h-7 rounded-lg border border-[#D99BAA]/40 text-[#755B57] hover:bg-[#FAF0F3] flex items-center justify-center transition-colors"
                          title="Add 1 unit"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(v.id, v.stock_quantity, 5)}
                          className="px-2 py-1 rounded-lg bg-[#30272B] text-white text-[10px] font-medium hover:bg-[#C8A56A] transition-colors"
                          title="Restock +5 units"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
