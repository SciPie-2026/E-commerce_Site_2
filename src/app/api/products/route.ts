import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Product, ProductVariant } from "@/lib/types";

export async function GET(req: Request) {
  try {
    await initDb();
    const db = getDb();
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.toLowerCase();
    const category = searchParams.get("category");
    const collection = searchParams.get("collection");
    const occasion = searchParams.get("occasion");
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
    const sort = searchParams.get("sort") || "featured";
    const featuredOnly = searchParams.get("featured") === "true";
    const newOnly = searchParams.get("new") === "true";
    const bestsellerOnly = searchParams.get("bestseller") === "true";

    let sql = `
      SELECT p.*,
             c.name as category_name, c.slug as category_slug,
             col.name as collection_name, col.slug as collection_slug,
             (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image,
             (SELECT AVG(rating) FROM reviews WHERE product_id = p.id AND is_approved = 1) as rating_avg,
             (SELECT COUNT(*) FROM reviews WHERE product_id = p.id AND is_approved = 1) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN collections col ON p.collection_id = col.id
      WHERE p.is_published = 1
    `;

    const args: (string | number)[] = [];

    if (q) {
      sql += ` AND (LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ? OR LOWER(p.fabric) LIKE ?)`;
      args.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (category) {
      sql += ` AND (c.slug = ? OR p.category_id = ?)`;
      args.push(category, category);
    }

    if (collection) {
      sql += ` AND (col.slug = ? OR p.collection_id = ?)`;
      args.push(collection, collection);
    }

    if (occasion) {
      sql += ` AND LOWER(p.occasion) LIKE ?`;
      args.push(`%${occasion.toLowerCase()}%`);
    }

    if (minPrice !== null && !isNaN(minPrice)) {
      sql += ` AND (COALESCE(p.sale_price, p.base_price) >= ?)`;
      args.push(minPrice);
    }

    if (maxPrice !== null && !isNaN(maxPrice)) {
      sql += ` AND (COALESCE(p.sale_price, p.base_price) <= ?)`;
      args.push(maxPrice);
    }

    if (featuredOnly) {
      sql += ` AND p.is_featured = 1`;
    }

    if (newOnly) {
      sql += ` AND p.is_new = 1`;
    }

    if (bestsellerOnly) {
      sql += ` AND p.is_bestseller = 1`;
    }

    // Sorting
    switch (sort) {
      case "price-low":
        sql += ` ORDER BY COALESCE(p.sale_price, p.base_price) ASC`;
        break;
      case "price-high":
        sql += ` ORDER BY COALESCE(p.sale_price, p.base_price) DESC`;
        break;
      case "newest":
        sql += ` ORDER BY p.created_at DESC`;
        break;
      case "bestseller":
        sql += ` ORDER BY p.is_bestseller DESC, p.created_at DESC`;
        break;
      default:
        sql += ` ORDER BY p.is_featured DESC, p.created_at DESC`;
        break;
    }

    const res = await db.execute({ sql, args });

    // Fetch variants for all products found
    const products: Product[] = [];
    for (const row of res.rows) {
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
        id: String(row.id),
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
        primary_image: row.primary_image ? String(row.primary_image) : "/media/catalog/hero-campaign.jpg",
        rating_avg: row.rating_avg ? Math.round(Number(row.rating_avg) * 10) / 10 : 5,
        review_count: Number(row.review_count || 1),
        variants,
      });
    }

    return NextResponse.json({ products, total: products.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error querying products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      sku,
      description,
      short_desc,
      category_id,
      collection_id,
      base_price,
      sale_price,
      fabric,
      fit,
      care_instructions,
      occasion,
      is_featured,
      is_new,
      is_bestseller,
      model_3d_url,
      primary_image,
      variants,
    } = body;

    if (!name || !base_price || !category_id) {
      return NextResponse.json({ error: "Name, category, and base price are required." }, { status: 400 });
    }

    const db = getDb();
    const prodId = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const finalSku = sku || `AIDAH-${finalSlug.substring(0, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO products (
        id, name, slug, sku, description, short_desc, category_id, collection_id,
        base_price, sale_price, fabric, fit, care_instructions, occasion,
        is_featured, is_new, is_bestseller, is_published, model_3d_url, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        prodId, name, finalSlug, finalSku, description || "", short_desc || "", category_id, collection_id || null,
        Number(base_price), sale_price ? Number(sale_price) : null, fabric || "", fit || "", care_instructions || "", occasion || "",
        is_featured ? 1 : 0, is_new ? 1 : 0, is_bestseller ? 1 : 0, 1, model_3d_url || null, now, now,
      ],
    });

    // Primary image
    const imgUrl = primary_image || "/media/catalog/hero-campaign.jpg";
    await db.execute({
      sql: `INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [`img_${prodId}_1`, prodId, imgUrl, name, 1, 1],
    });

    // Variants
    if (variants && Array.isArray(variants)) {
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        const varId = `var_${prodId}_${i + 1}`;
        const varSku = `${finalSku}-${v.size}-${(v.color || "DEF").toUpperCase()}`;
        await db.execute({
          sql: `INSERT INTO product_variants (id, product_id, size, color, color_hex, sku, stock_quantity, price_override, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [varId, prodId, v.size || "M", v.color || "Rose", v.color_hex || "#D99BAA", varSku, Number(v.stock_quantity || 10), null, imgUrl],
        });
      }
    }

    // Log admin audit
    await db.execute({
      sql: `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [`log_${Date.now()}`, user.id, "PRODUCT_CREATE", "PRODUCT", prodId, JSON.stringify({ name, sku: finalSku }), now],
    });

    return NextResponse.json({ success: true, productId: prodId, slug: finalSlug });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
