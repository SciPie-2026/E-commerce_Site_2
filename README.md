# AIDAH — Dreamy Fashion Boutique Atelier & Admin Platform

AIDAH is an editorial, full-stack women's fashion boutique e-commerce web application featuring a dreamy aesthetic, handcrafted designer collections, and an integrated administrative suite.

## Brand Identity & Aesthetic
- **Brand**: AIDAH
- **Tagline**: Handcrafted Designer Wear
- **Theme Palette**: Soft blush rose (`#F4DDE3`), vintage dusty rose (`#D99BAA`), warm ivory champagne (`#FFF9F4`), muted bronze gold (`#C8A56A`), and deep espresso typography (`#30272B`).
- **Typography**: Cormorant Garamond (editorial luxury serif) and Plus Jakarta Sans (clean modern sans-serif).

## Features
- **Storefront**:
  - Filterable Catalog (Evening Gowns, Casual Chic, Co-ord Sets, Floral Sundresses, Handcrafted Ethnic Couture).
  - Product Details with multi-angle high-resolution gallery, size guides, fabric details, stock counters, and reviews.
  - Interactive Wishlist & Cart drawer with coupon engine (`AIDAH15` for 15% off).
  - Secure Guest & Customer Checkout with Razorpay / Stripe mock gateways, order tracking, and confirmation.
  - Dedicated Customer Account portal with addresses, active orders, and wishlist.
- **Admin Dashboard** (`/admin`):
  - Real-time Revenue & Orders KPI overview.
  - Product Catalog management with dynamic stock updates, variant editing, and CSV export.
  - Order Fulfillment workflow (Pending, Processing, Shipped, Delivered) with tracking numbers.
  - Customer Registry and Coupon management.

## Getting Started

### 1. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or specified port) with your browser.

### 3. Demo Credentials
- **Admin Portal** (`/login`):
  - Email: `admin@aidah.com`
  - Password: `Admin@Aidah2026`
- **Customer Account**:
  - Email: `sophia@aidah.com`
  - Password: `Customer@123`
