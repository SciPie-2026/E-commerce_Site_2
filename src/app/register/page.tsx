"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, User, Phone, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const res = await register(name, email, password, phone);
    if (!res.success) {
      setErrorMsg(res.error || "Registration failed");
      setLoading(false);
    } else {
      router.push("/account");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-[#EFE5DC] shadow-sm space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold">
              Atelier Membership
            </span>
            <h1 className="font-serif-luxury text-3xl font-light text-[#30272B]">
              Create Your Account
            </h1>
            <p className="text-xs text-[#755B57]">
              Join the AIDAH salon to enjoy tailored fittings, order tracking, and private collection previews.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#755B57] font-medium mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#755B57] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Lady Sophia Sterling"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#755B57] font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#755B57] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sophia@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#755B57] font-medium mb-1">Mobile Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#755B57] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 11223"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#755B57] font-medium mb-1">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#755B57] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
              <span>{loading ? "Creating Atelier Profile..." : "Register Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-[#755B57]">
            <span>Already have an account? </span>
            <Link href="/login" className="text-[#30272B] underline font-medium hover:text-[#C8A56A]">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
