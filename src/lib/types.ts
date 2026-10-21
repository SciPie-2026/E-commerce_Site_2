// AIDAH Full-Stack E-Commerce Data Models & Type Definitions

export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id?: string;
  full_name: string;
  phone: string;
  street_line1: string;
  street_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
  product_count?: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  banner_image_url: string;
  is_featured: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string; // "XS", "S", "M", "L", "XL", "Custom"
  color: string; // "Blush Rose", "Ivory Silk", "Champagne Gold"
  color_hex: string;
  sku: string;
  stock_quantity: number;
  price_override?: number | null;
  image_url?: string | null;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_desc: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  collection_id?: string;
  collection_name?: string;
  collection_slug?: string;
  base_price: number;
  sale_price?: number | null;
  fabric: string;
  fit: string;
  care_instructions: string;
  occasion: string;
  is_featured: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  is_published: boolean;
  model_3d_url?: string | null;
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
  primary_image?: string;
  rating_avg?: number;
  review_count?: number;
}

export interface CartItem {
  id: string;
  cart_id: string;
  variant_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  image_url: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  max_stock: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  size: string;
  color: string;
  sku: string;
  price_at_purchase: number;
  quantity: number;
  item_total: number;
  image_url?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  guest_email?: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  discount: number;
  tax: number;
  shipping_fee: number;
  total_amount: number;
  currency: string;
  shipping_address_json: string;
  shipping_address?: Address;
  tracking_carrier?: string | null;
  tracking_number?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_spend: number;
  max_discount?: number | null;
  usage_limit: number;
  usage_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string | null;
  author_name: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface StoreSettings {
  store_name: string;
  brand_tagline: string;
  currency: string;
  currency_symbol: string;
  tax_rate_percent: number;
  free_shipping_threshold: number;
  standard_shipping_rate: number;
  low_stock_threshold: number;
  support_email: string;
  support_phone: string;
  return_window_days: number;
}
