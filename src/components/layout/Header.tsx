"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { themeConfig } from "@/config/theme";
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export function Header() {
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistIds } = useWishlist();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F4]/90 backdrop-blur-md border-b border-[#EFE5DC] transition-all">
      {/* 1. Slim Announcement Bar */}
      <div className="bg-[#30272B] text-[#FFF9F4] text-[11px] py-1.5 px-4 text-center tracking-widest uppercase flex items-center justify-center gap-2">
        <span>{themeConfig.brand.announcement}</span>
        <Link href={themeConfig.brand.announcementLink} className="underline text-[#D99BAA] hover:text-[#C8A56A] font-medium">
          Shop Now
        </Link>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Mobile Menu Trigger & Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#30272B] hover:text-[#D99BAA]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-[#30272B] hover:text-[#D99BAA] flex items-center gap-2 text-xs tracking-wider"
            aria-label="Search catalog"
          >
            <Search className="w-4 h-4 text-[#755B57]" />
            <span className="hidden md:inline text-xs text-[#755B57]">Search</span>
          </button>
        </div>

        {/* Center: Brand Editorial Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block group">
            <span className="font-serif-luxury text-2xl md:text-3xl lg:text-4xl tracking-tight text-[#30272B] group-hover:text-[#C8A56A] transition-colors">
              {themeConfig.brand.name}
            </span>
            <span className="block text-[9px] tracking-[0.3em] uppercase text-[#755B57] -mt-1 font-medium">
              Atelier
            </span>
          </Link>
        </div>

        {/* Right: User Account, Wishlist, Cart Drawer */}
        <div className="flex items-center gap-3 md:gap-5">
          <Link
            href={user ? (user.role === "admin" ? "/admin" : "/account") : "/login"}
            className="p-2 text-[#30272B] hover:text-[#D99BAA] transition-colors flex items-center gap-1.5"
            title={user ? `Signed in as ${user.name}` : "Sign In"}
          >
            <UserIcon className="w-4 h-4 text-[#755B57]" />
            <span className="hidden sm:inline text-xs font-medium text-[#755B57]">
              {user ? (user.role === "admin" ? "Admin" : user.name.split(" ")[0]) : "Sign In"}
            </span>
          </Link>

          <Link
            href="/wishlist"
            className="p-2 text-[#30272B] hover:text-[#D99BAA] transition-colors relative"
            title="Wishlist"
          >
            <Heart className="w-4 h-4 text-[#755B57]" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D99BAA] text-white text-[9px] font-bold flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-[#30272B] hover:text-[#C8A56A] transition-colors relative flex items-center gap-1.5"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#30272B]" />
            <span className="hidden sm:inline text-xs font-semibold text-[#30272B]">Cart</span>
            {itemCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#30272B] text-[#FFF9F4] text-[9px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Category Navigation */}
      <nav className="hidden lg:flex items-center justify-center border-t border-[#EFE5DC]/60 py-2.5 px-4">
        <ul className="flex items-center gap-8 text-xs font-medium uppercase tracking-wider text-[#755B57]">
          {themeConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="hover:text-[#30272B] hover:border-b-2 hover:border-[#D99BAA] pb-1 transition-all flex items-center gap-1.5"
              >
                {item.label}
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#F4DDE3] text-[#755B57] font-semibold flex items-center gap-0.5">
                    {item.badge === "Interactive" && <Sparkles className="w-2.5 h-2.5 text-[#C8A56A]" />}
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Expandable Search Input Bar */}
      {searchOpen && (
        <div className="border-t border-[#EFE5DC] bg-[#FFF9F4] p-4 shadow-inner animate-in fade-in duration-200">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-3">
            <Search className="w-4 h-4 text-[#755B57]" />
            <input
              type="text"
              placeholder="Search silk gowns, floral maxis, co-ords, or fabrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-[#D99BAA] text-sm text-[#30272B] pb-1 focus:outline-none focus:border-[#30272B] placeholder:text-[#755B57]/60"
              autoFocus
            />
            <button type="submit" className="px-4 py-1.5 rounded-full bg-[#30272B] text-white text-xs font-medium hover:bg-[#C8A56A] transition-colors">
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-xs text-[#755B57] hover:text-[#30272B]"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu Slide-Over */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EFE5DC] bg-[#FFF9F4] px-6 py-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-300">
          <ul className="space-y-3 text-sm font-medium uppercase tracking-wider text-[#755B57]">
            {themeConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#30272B] flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#F4DDE3] text-[#755B57]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-[#EFE5DC] flex flex-col gap-2">
            <Link
              href={user ? "/account" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-center rounded-full btn-outline-boutique text-xs font-medium"
            >
              {user ? "Atelier Account" : "Sign In / Register"}
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-full bg-[#30272B] text-white text-xs font-medium"
              >
                Administrator Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
