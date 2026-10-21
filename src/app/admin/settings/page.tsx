"use client";

import React, { useEffect, useState } from "react";
import { themeConfig, formatPrice } from "@/config/theme";
import { Settings, ShieldCheck, Check, Database } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    async function loadAudit() {
      try {
        const res = await fetch("/api/admin/metrics");
        if (res.ok) {
          const data = await res.json();
          setAuditLogs(data.auditLogs || []);
        }
      } catch (err) {
        console.error("Error loading settings audit", err);
      }
    }
    loadAudit();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <span className="text-[11px] uppercase tracking-widest text-[#D99BAA] font-semibold block">
          Configuration & Audit
        </span>
        <h1 className="font-serif-luxury text-3xl font-light text-[#30272B]">
          Store Settings & Security Audit
        </h1>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Atelier configuration parameters updated successfully.</span>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE5DC] shadow-xs space-y-6">
        <h3 className="font-serif-luxury text-xl font-medium text-[#30272B] pb-3 border-b border-[#EFE5DC] flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#C8A56A]" />
          <span>General Boutique Atelier Parameters</span>
        </h3>

        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#755B57] font-medium mb-1">Boutique Brand Name</label>
            <input
              type="text"
              defaultValue={themeConfig.brand.name}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B]"
            />
          </div>

          <div>
            <label className="block text-[#755B57] font-medium mb-1">Tagline</label>
            <input
              type="text"
              defaultValue={themeConfig.brand.tagline}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B]"
            />
          </div>

          <div>
            <label className="block text-[#755B57] font-medium mb-1">Store Currency</label>
            <input
              type="text"
              defaultValue="INR (₹)"
              readOnly
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-[#755B57] font-medium mb-1">GST Tax Rate</label>
            <input
              type="text"
              defaultValue="5% Applicable on Luxury Apparel"
              readOnly
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-[#755B57] font-medium mb-1">Complimentary Shipping Threshold</label>
            <input
              type="number"
              defaultValue={3999}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B]"
            />
          </div>

          <div>
            <label className="block text-[#755B57] font-medium mb-1">Standard Shipping Fee</label>
            <input
              type="number"
              defaultValue={250}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B]"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full btn-gold text-xs font-semibold"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Security Audit Trail */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE5DC] shadow-xs space-y-4">
        <h3 className="font-serif-luxury text-xl font-medium text-[#30272B] pb-3 border-b border-[#EFE5DC] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#C8A56A]" />
          <span>Administrative Security Audit Log</span>
        </h3>

        <div className="space-y-2 text-xs">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-[#FFF9F4] border border-[#EFE5DC] flex items-center justify-between"
            >
              <div>
                <strong className="text-[#30272B] font-mono">{log.action}</strong>
                <span className="text-[#755B57] text-[11px] block">Entity: {log.entity_type}</span>
              </div>
              <span className="text-[11px] text-[#755B57]">
                {log.created_at ? log.created_at.slice(0, 19).replace("T", " ") : "2026-10-21 12:00"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
