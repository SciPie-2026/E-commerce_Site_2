import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AIDAH | A Dreamy Fashion Boutique Atelier",
  description:
    "Discover poetry in every silhouette. Explore ethereal evening gowns, floral dresses, luxury co-ords, and handcrafted ethnic couture.",
  keywords: [
    "fashion boutique",
    "women fashion",
    "evening gowns",
    "floral dresses",
    "co-ord sets",
    "ethnic wear",
    "couture",
    "Aidah",
    "AIDAH Boutique",
  ],
  authors: [{ name: "AIDAH Atelier" }],
  openGraph: {
    title: "AIDAH • Dreamy Fashion Boutique Atelier",
    description: "Couture silhouettes, dreamy floral dresses, and artisanal luxury fashion.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B] antialiased selection:bg-[#F4DDE3] selection:text-[#30272B]">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
