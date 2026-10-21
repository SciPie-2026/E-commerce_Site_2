import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCard } from "@/components/product/ProductCard";
import { getDb, initDb } from "@/lib/db";
import { Product, ProductVariant } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await initDb();
  const { slug } = await params;
  const db = getDb();

  const colRes = await db.execute({
    sql: `SELECT * FROM collections WHERE slug = ? LIMIT 1`,
    args: [slug],
  });

  if (colRes.rows.length === 0) {
    notFound();
  }

  const collection = colRes.rows[0];

  let sql = `
    SELECT p.*,
           c.name as category_name, c.slug as category_slug,
           (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image,
           (SELECT AVG(rating) FROM reviews WHERE product_id = p.id AND is_approved = 1) as rating_avg,
           (SELECT COUNT(*) FROM reviews WHERE product_id = p.id AND is_approved = 1) as review_count
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_published = 1
  `;
  const args: string[] = [];

  if (slug === "new-arrivals") {
    sql += ` AND p.is_new = 1 ORDER BY p.created_at DESC`;
  } else if (slug === "best-sellers") {
    sql += ` AND p.is_bestseller = 1 ORDER BY p.created_at DESC`;
  } else if (slug === "sale") {
    sql += ` AND p.sale_price IS NOT NULL AND p.sale_price < p.base_price ORDER BY p.created_at DESC`;
  } else {
    sql += ` AND p.collection_id = ? ORDER BY p.created_at DESC`;
    args.push(String(collection.id));
  }

  const prodRes = await db.execute({ sql, args });

  const products: Product[] = [];
  for (const row of prodRes.rows) {
    const pId = String(row.id);
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

    products.push({
      id: pId,
      name: String(row.name),
      slug: String(row.slug),
      sku: String(row.sku),
      description: String(row.description),
      short_desc: String(row.short_desc || ""),
      category_id: String(row.category_id),
      category_name: row.category_name ? String(row.category_name) : "Couture",
      category_slug: row.category_slug ? String(row.category_slug) : "shop",
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
      primary_image: row.primary_image ? String(row.primary_image) : "/media/catalog/hero-campaign.jpg",
      rating_avg: row.rating_avg ? Math.round(Number(row.rating_avg) * 10) / 10 : 5,
      review_count: Number(row.review_count || 1),
      variants,
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#30272B]">
      <Header />
      <CartDrawer />

      <main className="flex-1">
        <div className="relative py-16 md:py-24 bg-[#FAF0F3] border-b border-[#EFE5DC] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="text-xs uppercase tracking-widest text-[#D99BAA] font-semibold block mb-2">
              Boutique Editorial Collection
            </span>
            <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-[#30272B]">
              {String(collection.name)}
            </h1>
            <p className="text-xs md:text-sm text-[#755B57] max-w-xl mx-auto mt-3 font-light leading-relaxed">
              {String(collection.description)}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#EFE5DC] p-8">
              <p className="font-serif-luxury text-2xl text-[#30272B]">Collection in Progress</p>
              <Link href="/shop" className="inline-block mt-4 px-6 py-2.5 rounded-full btn-gold text-xs font-medium">
                Browse Full Boutique
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6 text-xs text-[#755B57]">
                <span>Showing <strong>{products.length}</strong> creations</span>
                <Link href="/shop" className="underline hover:text-[#30272B]">View All Silhouettes</Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {products.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
