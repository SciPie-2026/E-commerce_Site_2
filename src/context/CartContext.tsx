"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { CartItem, Coupon } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "cart_id">) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("aidah_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
    const savedCoupon = localStorage.getItem("aidah_coupon");
    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch {
        // ignore
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("aidah_cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("aidah_coupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("aidah_coupon");
    }
  }, [appliedCoupon]);

  const addItem = (newItem: Omit<CartItem, "id" | "cart_id">) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.variant_id === newItem.variant_id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(
          updated[existingIndex].quantity + newItem.quantity,
          newItem.max_stock
        );
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        const itemWithId: CartItem = {
          ...newItem,
          id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          cart_id: "local_cart",
        };
        return [...prev, itemWithId];
      }
    });
    setIsCartOpen(true);
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variant_id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.variant_id === variantId) {
          const validQty = Math.min(quantity, i.max_stock);
          return { ...i, quantity: validQty };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!appliedCoupon || subtotal === 0) return 0;
    if (subtotal < appliedCoupon.min_spend) return 0;

    let d = 0;
    if (appliedCoupon.discount_type === "percent") {
      d = (subtotal * appliedCoupon.discount_value) / 100;
      if (appliedCoupon.max_discount && d > appliedCoupon.max_discount) {
        d = appliedCoupon.max_discount;
      }
    } else {
      d = appliedCoupon.discount_value;
    }
    return Math.min(d, subtotal);
  }, [appliedCoupon, subtotal]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= 3999 ? 0 : 250;
  }, [subtotal]);

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = useMemo(() => Math.round(taxableAmount * 0.05), [taxableAmount]); // 5% GST
  const total = useMemo(() => Math.max(0, taxableAmount + tax + shippingFee), [taxableAmount, tax, shippingFee]);
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`);
      const data = await res.json();
      if (!res.ok || !data.valid) {
        return { success: false, message: data.message || "Invalid coupon code" };
      }
      setAppliedCoupon(data.coupon);
      return { success: true, message: `Privilege code applied: ${data.coupon.discount_value}${data.coupon.discount_type === "percent" ? "%" : "₹"} off!` };
    } catch {
      return { success: false, message: "Error validating coupon code" };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
