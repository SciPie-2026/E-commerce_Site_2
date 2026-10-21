"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCard } from "@/components/product/ProductCard";
import { Product, Category } from "@/lib/types";
import { formatPrice } from "@/config/theme";
import { Filter, X, Search, SlidersHorizontal } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(30000);
  const [sort, setSort] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync from URL search params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) setSearch(params.get("q") || "");
    if (params.get("category")) setSelectedCategory(params.get("category") || "");
    if (params.get("occasion")) setSelectedOccasion(params.get("occasion") || "");
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set("q", search);
        if (selectedCategory) queryParams.set("category", selectedCategory);
        if (selectedOccasion) queryParams.set("occasion", selectedOccasion);
        if (priceRange < 30000) queryParams.set("maxPrice", priceRange.toString());
        if (sort) queryParams.set("sort", sort);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Error fetching shop products:", err);
      } finally {
        setLoading(false);
      }
    }

    startTransition(() => {
      fetchProducts();
    });
  }, [search, selectedCategory, selectedOccasion, priceRange, sort]);

  // Load categories list
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    loadCategories();
  }, []);

  const occasions = ["Evening Gala", "Garden Wedding", "High Tea", "Cocktail", "Festive Soirée", "Resort"];

  const handleClearAll = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedOccasion("");
    setPriceRange(30000);
    setSort("featured");
  };

  const hasActiveFilters = Boolean(search || selectedCategory || selectedOccasion || priceRange < 30000);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Banner / Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-2">
            The Atelier Catalogue
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#30272B]">
            All Silhouettes & Collections
          </h1>
          <p className="text-xs md:text-sm text-[#755B57] mt-3 font-light leading-relaxed">
            Every garment in our catalog is sculpted with delicate intent, artisanal stitching, and natural fabrics that drape like second nature.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-white border border-[#EFE5DC] mb-8 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-[#755B57] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by silhouette, fabric, or style..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[#FFF9F4] border border-[#D99BAA]/40 text-xs text-[#30272B] focus:outline-none focus:border-[#30272B]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#755B57]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-2 rounded-full border border-[#D99BAA]/50 text-xs font-medium text-[#755B57] flex items-center gap-1.5 hover:bg-[#F4DDE3]"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters {hasActiveFilters && "•"}</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs text-[#755B57]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8A56A]" />
              <label htmlFor="sort-select" className="hidden sm:inline">Sort by:</label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-[#FFF9F4] border border-[#D99BAA]/40 rounded-full px-3 py-1.5 text-xs text-[#30272B] focus:outline-none focus:border-[#30272B]"
              >
                <option value="featured">Featured Curations</option>
                <option value="newest">New Arrivals</option>
                <option value="bestseller">Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-[#755B57]">Active Filters:</span>
            {search && (
              <span className="px-3 py-1 rounded-full bg-[#F4DDE3] text-[#755B57] flex items-center gap-1.5 font-medium">
                &ldquo;{search}&rdquo;
                <button onClick={() => setSearch("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedCategory && (
              <span className="px-3 py-1 rounded-full bg-[#F4DDE3] text-[#755B57] flex items-center gap-1.5 font-medium">
                Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                <button onClick={() => setSelectedCategory("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedOccasion && (
              <span className="px-3 py-1 rounded-full bg-[#F4DDE3] text-[#755B57] flex items-center gap-1.5 font-medium">
                Occasion: {selectedOccasion}
                <button onClick={() => setSelectedOccasion("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {priceRange < 30000 && (
              <span className="px-3 py-1 rounded-full bg-[#F4DDE3] text-[#755B57] flex items-center gap-1.5 font-medium">
                Under {formatPrice(priceRange)}
                <button onClick={() => setPriceRange(30000)}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={handleClearAll}
              className="text-[#D99BAA] underline text-xs font-medium ml-2 hover:text-[#C8A56A]"
            >
              Clear All Filters
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (3 Cols) */}
          <aside className={`lg:col-span-3 ${mobileFilterOpen ? "block" : "hidden lg:block"} bg-white p-6 rounded-2xl border border-[#EFE5DC] space-y-6 shadow-xs`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE5DC]">
              <h3 className="font-serif-luxury text-base font-medium text-[#30272B]">Filter Atelier</h3>
              {hasActiveFilters && (
                <button
                  onClick={handleClearAll}
                  className="text-[11px] text-[#D99BAA] hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#755B57] font-semibold mb-3">
                Categories
              </h4>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`block w-full text-left py-1 px-2 rounded-lg transition-colors ${
                    !selectedCategory ? "bg-[#FAF0F3] font-semibold text-[#30272B]" : "text-[#755B57] hover:bg-[#FFF9F4]"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(selectedCategory === c.slug ? "" : c.slug)}
                    className={`block w-full text-left py-1 px-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === c.slug ? "bg-[#FAF0F3] font-semibold text-[#30272B]" : "text-[#755B57] hover:bg-[#FFF9F4]"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-[#755B57]/70">{c.product_count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion Filter */}
            <div className="pt-4 border-t border-[#EFE5DC]">
              <h4 className="text-xs uppercase tracking-widest text-[#755B57] font-semibold mb-3">
                Occasion
              </h4>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => setSelectedOccasion("")}
                  className={`block w-full text-left py-1 px-2 rounded-lg transition-colors ${
                    !selectedOccasion ? "bg-[#FAF0F3] font-semibold text-[#30272B]" : "text-[#755B57] hover:bg-[#FFF9F4]"
                  }`}
                >
                  All Occasions
                </button>
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(selectedOccasion === occ ? "" : occ)}
                    className={`block w-full text-left py-1 px-2 rounded-lg transition-colors ${
                      selectedOccasion === occ ? "bg-[#FAF0F3] font-semibold text-[#30272B]" : "text-[#755B57] hover:bg-[#FFF9F4]"
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="pt-4 border-t border-[#EFE5DC]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs uppercase tracking-widest text-[#755B57] font-semibold">
                  Max Budget
                </h4>
                <span className="text-xs font-semibold text-[#30272B]">{formatPrice(priceRange)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="30000"
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#30272B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#755B57] mt-1">
                <span>₹5,000</span>
                <span>₹30,000+</span>
              </div>
            </div>
          </aside>

          {/* Product Grid (9 Cols) */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-8 h-8 border-2 border-[#D99BAA] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-[#755B57] uppercase tracking-wider">Curating Atelier Creations...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-[#EFE5DC] p-8 space-y-4">
                <p className="font-serif-luxury text-2xl text-[#30272B]">No Silhouettes Match Your Criteria</p>
                <p className="text-xs text-[#755B57] max-w-sm mx-auto">
                  Try adjusting your budget or clearing filters to view our full collection of evening gowns, co-ords, and dresses.
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-6 py-2.5 rounded-full btn-gold text-xs font-medium"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-[#755B57] mb-4">
                  Showing <strong>{products.length}</strong> bespoke atelier pieces
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
