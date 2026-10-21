import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  LayoutDashboard,
  Shirt,
  Boxes,
  ShoppingBag,
  Tag,
  Settings,
  ExternalLink,
  ShieldCheck,
  LogOut,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Strict server-side RBAC check
  if (!user || user.role !== "admin") {
    redirect("/login?error=admin_required");
  }

  const navItems = [
    { label: "Executive Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Products & Catalog", href: "/admin/products", icon: Shirt },
    { label: "Inventory & Stock", href: "/admin/inventory", icon: Boxes },
    { label: "Orders & Fulfillment", href: "/admin/orders", icon: ShoppingBag },
    { label: "Privilege Codes", href: "/admin/coupons", icon: Tag },
    { label: "Settings & Audit", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#FAF0F3]/40 text-[#30272B]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#30272B] text-white flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div className="space-y-8">
          {/* Admin Brand Badge */}
          <div className="pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-[#C8A56A]" />
              <span className="font-serif-luxury text-xl tracking-tight text-white">
                AIDAH
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#C8A56A] block font-semibold">
              Director Dashboard
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors font-medium"
                >
                  <Icon className="w-4 h-4 text-[#C8A56A]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Storefront Link */}
        <div className="pt-6 border-t border-white/10 space-y-3 text-xs">
          <Link
            href="/"
            className="flex items-center justify-between text-white/70 hover:text-[#C8A56A] transition-colors py-1"
          >
            <span>Visit Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
            <div className="truncate">
              <strong className="block text-white truncate">{user.name}</strong>
              <span className="text-[10px] text-white/60">Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for mobile */}
        <header className="h-16 bg-white border-b border-[#EFE5DC] px-6 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C8A56A]" />
            <span className="font-serif-luxury text-lg font-semibold text-[#30272B]">
              AIDAH Admin
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Link href="/" className="text-[#755B57] underline">Storefront</Link>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
