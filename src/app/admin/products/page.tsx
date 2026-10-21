"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/config/theme";
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Download,
  Check,
  X,
  Search,
} from "lucide-react";

interface AdminProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_name: string;
  base_price: number;
  sale_price?: number | null;
  is_published: boolean;
  total_stock: number;
  primary_image: string;
  variants: Array<{
    id: string;
    size: string;
    color: string;
    stock_quantity: number;
  }>;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New product form state
  const [newProd, setNewProd] = useState({
    name: "",
    category_id: "cat_gown",
    base_price: 14999,
    sale_price: 12999,
    fabric: "100% Pure Mulberry Silk",
    fit: "Tailored bodice with draped bias skirt",
    occasion: "Evening Gala, High Tea",
    description: "An exquisite couture silhouette crafted from heirloom natural silk.",
    short_desc: "Ethereal silhouette in pure mulberry silk.",
    initialStock: 10,
    primary_image: "/media/catalog/hero-campaign.jpg",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionNotice, setActionNotice] = useState("");

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const json = await res.json();
        setProducts(json.products || []);
      }
    } catch (err) {
      console.error("Error loading admin products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleTogglePublish = async (pId: string, currentStatus: boolean) => {
    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: pId, is_published: !currentStatus }),
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === pId ? { ...p, is_published: !currentStatus } : p))
      );
    } catch (err) {
      console.error("Error updating product status", err);
    }
  };

  const handleDeleteProduct = async (pId: string, name: string) => {
    if (!confirm(`Are you certain you wish to archive and delete "${name}" from the catalogue?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${pId}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== pId));
        setActionNotice(`Product "${name}" deleted successfully.`);
        setTimeout(() => setActionNotice(""), 3000);
      }
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProd,
          variants: [
            { size: "S", color: "Blush Rose", color_hex: "#D99BAA", stock_quantity: newProd.initialStock },
            { size: "M", color: "Blush Rose", color_hex: "#D99BAA", stock_quantity: newProd.initialStock },
            { size: "L", color: "Blush Rose", color_hex: "#D99BAA", stock_quantity: newProd.initialStock },
          ],
        }),
      });

      if (res.ok) {
        setCreateModalOpen(false);
        setActionNotice("New silhouette created and added to the boutique catalog!");
        setTimeout(() => setActionNotice(""), 3000);
        await loadProducts();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "SKU", "Category", "Base Price", "Sale Price", "Total Stock", "Status"];
    const rows = products.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      p.category_name,
      p.base_price,
      p.sale_price || "",
      p.total_stock,
      p.is_published ? "Published" : "Draft",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aidah_catalog_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#D99BAA] font-semibold block">
            Catalogue Management
          </span>
          <h1 className="font-serif-luxury text-3xl font-light text-[#30272B]">
            Products & Silhouettes ({products.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-full border border-[#D99BAA]/50 text-xs font-medium text-[#755B57] hover:bg-white transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-full btn-gold text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Silhouette</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#755B57] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by name, SKU, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-full border border-[#D99BAA]/40 bg-white text-xs text-[#30272B] focus:outline-none focus:border-[#30272B]"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#EFE5DC] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EFE5DC] bg-[#FFF9F4] text-[#755B57] uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Silhouette</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Base Price</th>
                <th className="py-3 px-4 font-semibold">Sale Price</th>
                <th className="py-3 px-4 font-semibold">Total Stock</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE5DC]/60 text-[#30272B]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#755B57]">
                    Loading catalog products...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#755B57]">
                    No products match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF0F3]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg bg-[#F7EFE7] relative overflow-hidden shrink-0">
                          <Image src={p.primary_image} alt={p.name} fill className="object-cover object-top" />
                        </div>
                        <div>
                          <strong className="font-serif-luxury text-sm font-medium block">{p.name}</strong>
                          <span className="text-[11px] text-[#755B57]">{p.variants.length} Variants</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#755B57]">{p.sku}</td>
                    <td className="py-3.5 px-4">{p.category_name}</td>
                    <td className="py-3.5 px-4 font-medium">{formatPrice(p.base_price)}</td>
                    <td className="py-3.5 px-4 text-[#D99BAA]">
                      {p.sale_price ? formatPrice(p.sale_price) : "—"}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.total_stock <= 5 ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {p.total_stock} Units
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(p.id, p.is_published)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase flex items-center gap-1 ${
                          p.is_published
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        title="Click to toggle status"
                      >
                        {p.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{p.is_published ? "Published" : "Draft"}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Create Product Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#EFE5DC] p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE5DC]">
              <h3 className="font-serif-luxury text-2xl font-light text-[#30272B]">
                Create New Atelier Silhouette
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-[#755B57] hover:text-[#30272B]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#755B57] font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="e.g. The Elysia Organza Gown"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Category *</label>
                  <select
                    value={newProd.category_id}
                    onChange={(e) => setNewProd({ ...newProd, category_id: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                  >
                    <option value="cat_gown">Evening Gowns</option>
                    <option value="cat_casual">Casual Dresses</option>
                    <option value="cat_party">Party & Cocktail</option>
                    <option value="cat_floral">Floral Dresses</option>
                    <option value="cat_ethnic">Ethnic Couture</option>
                    <option value="cat_coord">Co-Ord Sets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Base Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={newProd.base_price}
                    onChange={(e) => setNewProd({ ...newProd, base_price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Sale Price (Optional)</label>
                  <input
                    type="number"
                    value={newProd.sale_price}
                    onChange={(e) => setNewProd({ ...newProd, sale_price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                  />
                </div>

                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Initial Stock per Size *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProd.initialStock}
                    onChange={(e) => setNewProd({ ...newProd, initialStock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#755B57] font-medium mb-1">Fabric Composition</label>
                <input
                  type="text"
                  value={newProd.fabric}
                  onChange={(e) => setNewProd({ ...newProd, fabric: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                />
              </div>

              <div>
                <label className="block text-[#755B57] font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                />
              </div>

              <div className="pt-3 border-t border-[#EFE5DC] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#D99BAA]/50 text-xs text-[#755B57]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full btn-gold text-xs font-semibold"
                >
                  {isSubmitting ? "Saving..." : "Create Silhouette"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
