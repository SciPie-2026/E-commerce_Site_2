"use client";

import React, { useEffect, useState } from "react";
import { Order } from "@/lib/types";
import { formatPrice } from "@/config/theme";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  Edit,
  Eye,
  Filter,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  // Status update form state
  const [newStatus, setNewStatus] = useState("confirmed");
  const [carrier, setCarrier] = useState("BlueDart Couture Express");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const loadOrders = async () => {
    try {
      const res = await fetch(`/api/admin/orders?status=${statusFilter}`);
      if (res.ok) {
        const json = await res.json();
        setOrders(json.orders || []);
      }
    } catch (err) {
      console.error("Error loading admin orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleOpenUpdateModal = (ord: Order) => {
    setSelectedOrder(ord);
    setNewStatus(ord.status);
    setCarrier(ord.tracking_carrier || "BlueDart Couture Express");
    setTrackingNumber(ord.tracking_number || "");
    setNotes(ord.notes || "");
    setUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: newStatus,
          tracking_carrier: carrier,
          tracking_number: trackingNumber,
          notes,
        }),
      });

      if (res.ok) {
        setUpdateModalOpen(false);
        await loadOrders();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#D99BAA] font-semibold block">
            Fulfillment & Logistics
          </span>
          <h1 className="font-serif-luxury text-3xl font-light text-[#30272B]">
            Order Management ({orders.length})
          </h1>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-[#755B57]" />
          <span className="text-[#755B57]">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-full border border-[#D99BAA]/50 bg-white text-xs text-[#30272B] focus:outline-none focus:border-[#30272B]"
          >
            <option value="all">All Orders</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#EFE5DC] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EFE5DC] bg-[#FFF9F4] text-[#755B57] uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Order #</th>
                <th className="py-3 px-4 font-semibold">Client</th>
                <th className="py-3 px-4 font-semibold">Items</th>
                <th className="py-3 px-4 font-semibold">Total</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Carrier Tracking</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE5DC]/60 text-[#30272B]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#755B57]">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#755B57]">
                    No orders match this status filter.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF0F3]/40 transition-colors">
                    <td className="py-3.5 px-4 font-serif-luxury font-semibold text-sm">
                      {ord.order_number}
                    </td>

                    <td className="py-3.5 px-4">
                      <strong className="block text-[#30272B]">{ord.guest_email}</strong>
                      <span className="text-[11px] text-[#755B57]">
                        {ord.shipping_address ? `${ord.shipping_address.city}, ${ord.shipping_address.state}` : "Atelier Client"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#30272B]">{ord.items?.length || 1} Item(s)</span>
                      <span className="text-[11px] text-[#755B57] block truncate max-w-[160px]">
                        {ord.items?.[0]?.product_name}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-serif-luxury font-semibold">
                      {formatPrice(ord.total_amount)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        ord.status === "delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : ord.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : ord.status === "cancelled"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {ord.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {ord.tracking_number ? (
                        <span className="text-[#C8A56A]">{ord.tracking_number}</span>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[#755B57]">
                      {ord.created_at ? ord.created_at.slice(0, 10) : "2026-10-21"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenUpdateModal(ord)}
                        className="p-1.5 text-[#30272B] hover:text-[#C8A56A] hover:bg-[#FFF9F4] rounded-lg transition-colors"
                        title="Update Status / Tracking"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Order Modal */}
      {updateModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#EFE5DC] p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE5DC]">
              <h3 className="font-serif-luxury text-xl font-light text-[#30272B]">
                Manage Order #{selectedOrder.order_number}
              </h3>
              <button onClick={() => setUpdateModalOpen(false)} className="text-[#755B57]">✕</button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#755B57] font-medium mb-1">Fulfillment Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B]"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing in Atelier</option>
                  <option value="shipped">Shipped with Courier</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled & Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-[#755B57] font-medium mb-1">Courier Carrier</label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B]"
                />
              </div>

              <div>
                <label className="block text-[#755B57] font-medium mb-1">Airway Bill / Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BD984012IN"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B]"
                />
              </div>

              <div>
                <label className="block text-[#755B57] font-medium mb-1">Fulfillment Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B]"
                />
              </div>

              <div className="pt-3 border-t border-[#EFE5DC] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUpdateModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#D99BAA]/50 text-xs text-[#755B57]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 rounded-full btn-gold text-xs font-semibold"
                >
                  {isUpdating ? "Updating..." : "Save Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
