"use client";

import React, { useEffect, useState } from "react";
import { Coupon } from "@/lib/types";
import { formatPrice } from "@/config/theme";
import { Tag, Plus, Check, Trash2, Calendar, AlertCircle } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState("");

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_type: "percent",
    discount_value: 15,
    min_spend: 2000,
    max_discount: 1500,
    usage_limit: 200,
    valid_until: "2026-12-31",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const json = await res.json();
        setCoupons(json.coupons || []);
      }
    } catch (err) {
      console.error("Error loading coupons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });

      if (res.ok) {
        setCreateModalOpen(false);
        setActionNotice(`Privilege code ${newCoupon.code.toUpperCase()} created successfully.`);
        setTimeout(() => setActionNotice(""), 3000);
        await loadCoupons();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#D99BAA] font-semibold block">
            Promotions & Privileges
          </span>
          <h1 className="font-serif-luxury text-3xl font-light text-[#30272B]">
            Privilege Codes & Discounts ({coupons.length})
          </h1>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-full btn-gold text-xs font-semibold flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Privilege Code</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-3 text-center py-12 text-xs text-[#755B57]">Loading coupons...</p>
        ) : (
          coupons.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-3xl bg-white border border-[#EFE5DC] shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#C8A56A]" />
                  <strong className="font-serif-luxury text-lg tracking-wider text-[#30272B]">
                    {c.code}
                  </strong>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#755B57]">
                <div className="flex justify-between">
                  <span>Benefit:</span>
                  <strong className="text-[#30272B]">
                    {c.discount_value}{c.discount_type === "percent" ? "% Off" : "₹ Flat Off"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Min Order Spend:</span>
                  <span>{formatPrice(c.min_spend)}</span>
                </div>
                {c.max_discount && (
                  <div className="flex justify-between">
                    <span>Max Cap:</span>
                    <span>{formatPrice(c.max_discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Usage Count:</span>
                  <span>{c.usage_count} / {c.usage_limit}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#EFE5DC]/60">
                  <span>Valid Until:</span>
                  <span>{c.valid_until}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#EFE5DC] p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE5DC]">
              <h3 className="font-serif-luxury text-xl font-light text-[#30272B]">
                Issue Privilege Code
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-[#755B57]">✕</button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#755B57] font-medium mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Discount Type</label>
                  <select
                    value={newCoupon.discount_type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B]"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discount_value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Min Spend (INR)</label>
                  <input
                    type="number"
                    value={newCoupon.min_spend}
                    onChange={(e) => setNewCoupon({ ...newCoupon, min_spend: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B]"
                  />
                </div>

                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={newCoupon.usage_limit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usage_limit: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#755B57] font-medium mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={newCoupon.valid_until}
                  onChange={(e) => setNewCoupon({ ...newCoupon, valid_until: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B]"
                />
              </div>

              <div className="pt-3 border-t border-[#EFE5DC] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#D99BAA]/50 text-xs text-[#755B57]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-full btn-gold text-xs font-semibold"
                >
                  {isSubmitting ? "Issuing..." : "Activate Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
