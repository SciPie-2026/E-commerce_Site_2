import React from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductDetailClient } from "./ProductDetailClient";
import { getDb, initDb } from "@/lib/db";
import { Product, ProductVariant, ProductImage, Review } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await initDb();
  const { slug } = await params;
  const db = getDb();

  const res = await db.execute({
    sql: `
      SELECT p.*,
             c.name as category_name, c.slug as category_slug,
             col.name as collection_name, col.slug as collection_slug,
             (SELECT AVG(rating) FROM reviews WHERE product_id = p.id AND is_approved = 1) as rating_avg,
             (SELECT COUNT(*) FROM reviews WHERE product_id = p.id AND is_approved = 1) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN collections col ON p.collection_id = col.id
      WHERE p.slug = ? OR p.id = ?
      LIMIT 1
    `,
    args: [slug, slug],
  });

  if (res.rows.length === 0) {
    notFound();
  }

  const row = res.rows[0];
  const pId = String(row.id);

  // Images
  const imgRes = await db.execute({
    sql: `SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC`,
    args: [pId],
  });
  const images: ProductImage[] = imgRes.rows.map((img) => ({
    id: String(img.id),
    product_id: String(img.product_id),
    image_url: String(img.image_url),
    alt_text: String(img.alt_text),
    is_primary: Boolean(img.is_primary),
    sort_order: Number(img.sort_order),
  }));

  // Variants
  const varRes = await db.execute({
    sql: `SELECT * FROM product_variants WHERE product_id = ?`,
    args: [pId],
  });
  const variants: ProductVariant[] = varRes.rows.map((v) => ({
    id: String(v.id),
    product_id: String(v.product_id),
    size: String(v.size),
    color: String(v.color),
    color_hex: String(v.color_hex),
    sku: String(v.sku),
    stock_quantity: Number(v.stock_quantity),
    price_override: v.price_override ? Number(v.price_override) : null,
    image_url: v.image_url ? String(v.image_url) : null,
  }));

  // Reviews
  const revRes = await db.execute({
    sql: `SELECT * FROM reviews WHERE product_id = ? AND is_approved = 1 ORDER BY created_at DESC`,
    args: [pId],
  });
  const reviews: Review[] = revRes.rows.map((r) => ({
    id: String(r.id),
    product_id: String(r.product_id),
    user_id: r.user_id ? String(r.user_id) : null,
    author_name: String(r.author_name),
    rating: Number(r.rating),
    title: String(r.title),
    comment: String(r.comment),
    is_verified_purchase: Boolean(r.is_verified_purchase),
    is_approved: Boolean(r.is_approved),
    created_at: String(r.created_at),
  }));

  // Related products
  const relRes = await db.execute({
    sql: `
      SELECT p.*,
             (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p
      WHERE p.category_id = ? AND p.id != ? AND p.is_published = 1
      LIMIT 4
    `,
    args: [String(row.category_id), pId],
  });
  const relatedProducts: Product[] = relRes.rows.map((r) => ({
    id: String(r.id),
    name: String(r.name),
    slug: String(r.slug),
    sku: String(r.sku),
    description: String(r.description),
    short_desc: String(r.short_desc || ""),
    category_id: String(r.category_id),
    base_price: Number(r.base_price),
    sale_price: r.sale_price ? Number(r.sale_price) : null,
    fabric: String(r.fabric || ""),
    fit: String(r.fit || ""),
    care_instructions: String(r.care_instructions || ""),
    occasion: String(r.occasion || ""),
    is_featured: Boolean(r.is_featured),
    is_new: Boolean(r.is_new),
    is_bestseller: Boolean(r.is_bestseller),
    is_published: Boolean(r.is_published),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
    primary_image: r.primary_image ? String(r.primary_image) : "/media/catalog/hero-campaign.jpg",
  }));

  const product: Product = {
    id: pId,
    name: String(row.name),
    slug: String(row.slug),
    sku: String(row.sku),
    description: String(row.description),
    short_desc: String(row.short_desc || ""),
    category_id: String(row.category_id),
    category_name: row.category_name ? String(row.category_name) : undefined,
    category_slug: row.category_slug ? String(row.category_slug) : undefined,
    collection_id: row.collection_id ? String(row.collection_id) : undefined,
    collection_name: row.collection_name ? String(row.collection_name) : undefined,
    collection_slug: row.collection_slug ? String(row.collection_slug) : undefined,
    base_price: Number(row.base_price),
    sale_price: row.sale_price ? Number(row.sale_price) : null,
    fabric: String(row.fabric || ""),
    fit: String(row.fit || ""),
    care_instructions: String(row.care_instructions || ""),
    occasion: String(row.occasion || ""),
    is_featured: Boolean(row.is_featured),
    is_new: Boolean(row.is_new),
    is_bestseller: Boolean(row.is_bestseller),
    is_published: Boolean(row.is_published),
    model_3d_url: row.model_3d_url ? String(row.model_3d_url) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    primary_image: images[0]?.image_url || "/media/catalog/hero-campaign.jpg",
    rating_avg: row.rating_avg ? Math.round(Number(row.rating_avg) * 10) / 10 : 5,
    review_count: Number(row.review_count || reviews.length),
    variants,
    images,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <CartDrawer />
      <main className="flex-1">
        <ProductDetailClient
          product={product}
          reviews={reviews}
          relatedProducts={relatedProducts}
        />
      </main>
      <Footer />
    </div>
  );
}
