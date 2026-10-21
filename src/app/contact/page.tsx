"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { themeConfig } from "@/config/theme";
import { Mail, Phone, MapPin, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "Bespoke Bridal Inquiry", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-1">
            Atelier Concierge
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#30272B]">
            Get in Touch
          </h1>
          <p className="text-xs md:text-sm text-[#755B57] mt-3 font-light leading-relaxed">
            Whether inquiring about custom fitting measurements, bridal trousseaus, or booking an atelier visit, our concierge is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Details (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-[#EFE5DC] shadow-xs space-y-6">
            <h3 className="font-serif-luxury text-2xl font-light text-[#30272B]">
              Atelier Salon House
            </h3>

            <div className="space-y-4 text-xs text-[#755B57]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C8A56A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#30272B] block">Atelier Location</strong>
                  <span>{themeConfig.contact.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#C8A56A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#30272B] block">Phone & WhatsApp</strong>
                  <span>{themeConfig.contact.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#C8A56A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#30272B] block">Direct Concierge Email</strong>
                  <span>{themeConfig.contact.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#C8A56A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#30272B] block">Visiting Hours</strong>
                  <span>{themeConfig.contact.hours}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EFE5DC]">
              <span className="text-xs uppercase tracking-wider text-[#30272B] font-semibold block mb-1">
                Private Fitting Appointments
              </span>
              <p className="text-xs text-[#755B57] leading-relaxed">
                We accept private fitting appointments for evening gowns and bridal trousseaus. Please allow 48-hour notice for our senior patternmakers.
              </p>
            </div>
          </div>

          {/* Right Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#EFE5DC] shadow-xs">
            {submitted ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#FAF0F3] border border-[#D99BAA]/40 flex items-center justify-center mx-auto text-[#D99BAA]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif-luxury text-2xl text-[#30272B]">Inquiry Received with Pleasure</h4>
                <p className="text-xs text-[#755B57] max-w-sm mx-auto">
                  Our atelier concierge will respond to your inquiry via email within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-serif-luxury text-2xl font-light text-[#30272B] mb-2">
                  Send a Message to the Concierge
                </h3>

                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Lady Sophia Sterling"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                  />
                </div>

                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="sophia@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                  />
                </div>

                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Nature of Inquiry</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                  >
                    <option>Bespoke Bridal Inquiry</option>
                    <option>Size & Custom Fitting Question</option>
                    <option>Order Delivery Concierge</option>
                    <option>Press & Styling Collaboration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#755B57] font-medium mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Share event dates, custom requirements, or queries..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D99BAA]/40 bg-[#FFF9F4] text-[#30272B] focus:outline-none focus:border-[#30272B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full btn-gold text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
                >
                  <span>Dispatch Message</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
