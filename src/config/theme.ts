// AIDAH Design System & Centralized Boutique Configuration
export interface ThemeConfig {
  brand: {
    name: string;
    subName: string;
    tagline: string;
    description: string;
    announcement: string;
    announcementLink: string;
    foundingYear: number;
    headquarters: string;
  };
  palette: {
    blush: string;       // #F4DDE3
    rose: string;        // #D99BAA
    ivory: string;       // #FFF9F4
    cream: string;       // #F7EFE7
    gold: string;        // #C8A56A
    cocoa: string;       // #755B57
    charcoal: string;    // #30272B
    white: string;       // #FFFFFF
    roseLight: string;   // #F9EEF1
    goldLight: string;   // #F4EDE0
    borderLight: string; // #EFE3D8
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  currency: {
    code: string;
    symbol: string;
    rateToINR: number;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    hours: string;
    instagram: string;
    pinterest: string;
  };
  nav: Array<{
    label: string;
    href: string;
    badge?: string;
  }>;
}

export const themeConfig: ThemeConfig = {
  brand: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "AIDAH",
    subName: "The Label • Handcrafted Designer Wear",
    tagline: "Made for Your Most Beautiful Moments",
    description:
      "A dreamy couture atelier dedicated to celebrating timeless feminine grace, intricate craftsmanship, and modern poetic silhouettes.",
    announcement: "Complimentary Couture Shipping on Orders Above ₹3,999 • Use Code AIDAH15 for 15% Off",
    announcementLink: "/shop",
    foundingYear: 2024,
    headquarters: "Boutique Atelier: Baani City Centre, Sector 63, Gurugram, India",
  },
  palette: {
    blush: "#F4DDE3",
    rose: "#D99BAA",
    ivory: "#FFF9F4",
    cream: "#F7EFE7",
    gold: "#C8A56A",
    cocoa: "#755B57",
    charcoal: "#30272B",
    white: "#FFFFFF",
    roseLight: "#FAF0F3",
    goldLight: "#F8F3EA",
    borderLight: "#EFE5DC",
  },
  typography: {
    headingFont: "var(--font-serif)",
    bodyFont: "var(--font-sans)",
  },
  currency: {
    code: process.env.NEXT_PUBLIC_STORE_CURRENCY || "INR",
    symbol: process.env.NEXT_PUBLIC_STORE_CURRENCY_SYMBOL || "₹",
    rateToINR: 1.0,
  },
  contact: {
    email: "concierge@aidah.com",
    phone: "+91 98765 43210",
    address: "Baani City Centre, Sector 63, Gurugram, Haryana 122011",
    hours: "Mon – Sat: 10:30 AM – 7:30 PM IST",
    instagram: "https://instagram.com/aidah_thelabel",
    pinterest: "https://pinterest.com/aidah_thelabel",
  },
  nav: [
    { label: "New In", href: "/collections/new-arrivals", badge: "New" },
    { label: "Shop All", href: "/shop" },
    { label: "Dresses", href: "/category/casual-dresses" },
    { label: "Evening & Party", href: "/category/party-wear" },
    { label: "Ethnic Wear", href: "/category/ethnic-wear" },
    { label: "Co-Ord Sets", href: "/category/co-ord-sets" },
    { label: "Lookbook", href: "/lookbook" },
    { label: "Story", href: "/about" },
  ],
};

export function formatPrice(amount: number): string {
  return `${themeConfig.currency.symbol}${amount.toLocaleString("en-IN")}`;
}
