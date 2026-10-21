"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const res = await login(email, password);
    if (!res.success) {
      setErrorMsg(res.error || "Login failed");
      setLoading(false);
    } else {
      if (email.toLowerCase().includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    }
  };

  const handleFillDemo = (demoType: "admin" | "customer") => {
    if (demoType === "admin") {
      setEmail("admin@aidah.com");
      setPassword("Admin@Aidah2026");
    } else {
      setEmail("sophia@aidah.com");
      setPassword("Customer@123");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-[#EFE5DC] shadow-sm space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold">
              Atelier Client Portal
            </span>
            <h1 className="font-serif-luxury text-3xl font-light text-[#30272B]">
              Welcome Back
            </h1>
            <p className="text-xs text-[#755B57]">
              Sign in to manage your couture orders, measurements, and private wishlist.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#755B57] font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#755B57] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sophia@aidah.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#755B57] font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#755B57] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full btn-gold text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{loading ? "Verifying Credentials..." : "Sign In to Atelier"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Bar */}
          <div className="pt-4 border-t border-[#EFE5DC] text-center space-y-2">
            <span className="text-[11px] text-[#755B57] block">One-Click Demonstration Logins:</span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo("customer")}
                className="px-3 py-1.5 rounded-full bg-[#FAF0F3] border border-[#D99BAA]/40 text-[#755B57] text-[11px] hover:bg-[#F4DDE3] transition-colors"
              >
                Lady Sophia (Customer)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("admin")}
                className="px-3 py-1.5 rounded-full bg-[#30272B] text-white text-[11px] hover:bg-[#C8A56A] transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3 text-[#C8A56A]" />
                Store Director (Admin)
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-[#755B57]">
            <span>Don&apos;t have an atelier account yet? </span>
            <Link href="/register" className="text-[#30272B] underline font-medium hover:text-[#C8A56A]">
              Create Account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
