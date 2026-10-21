import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await initDb();
    await requireAdmin();
    const db = getDb();

    const res = await db.execute(`
      SELECT p.*,
             c.name as category_name,
             (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image,
             (SELECT SUM(stock_quantity) FROM product_variants WHERE product_id = p.id) as total_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);

    const products = [];
    for (const row of res.rows) {
      const pId = String(row.id);
      const varRes = await db.execute({
        sql: `SELECT * FROM product_variants WHERE product_id = ?`,
        args: [pId],
      });

      products.push({
        id: pId,
        name: String(row.name),
        slug: String(row.slug),
        sku: String(row.sku),
        category_name: row.category_name ? String(row.category_name) : "Couture",
        base_price: Number(row.base_price),
        sale_price: row.sale_price ? Number(row.sale_price) : null,
        is_published: Boolean(row.is_published),
        is_featured: Boolean(row.is_featured),
        is_bestseller: Boolean(row.is_bestseller),
        total_stock: Number(row.total_stock || 0),
        primary_image: row.primary_image ? String(row.primary_image) : "/media/catalog/hero-campaign.jpg",
        variants: varRes.rows.map((v) => ({
          id: String(v.id),
          size: String(v.size),
          color: String(v.color),
          stock_quantity: Number(v.stock_quantity),
          sku: String(v.sku),
        })),
      });
    }

    return NextResponse.json({ products });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching admin products";
    const status = message.includes("UNAUTHORIZED") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(req: Request) {
  try {
    await initDb();
    const admin = await requireAdmin();
    const db = getDb();
    const { productId, variantId, stock_quantity, base_price, sale_price, is_published } = await req.json();

    const now = new Date().toISOString();

    if (variantId && stock_quantity !== undefined) {
      // Update variant stock directly
      await db.execute({
        sql: `UPDATE product_variants SET stock_quantity = ? WHERE id = ?`,
        args: [Number(stock_quantity), variantId],
      });

      await db.execute({
        sql: `INSERT INTO inventory_movements (id, variant_id, change_amount, reason, reference_id, created_at)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [`mov_adm_${Date.now()}`, variantId, Number(stock_quantity), "Manual Admin Stock Adjustment", admin.id, now],
      });
    }

    if (productId) {
      await db.execute({
        sql: `
          UPDATE products
          SET base_price = COALESCE(?, base_price),
              sale_price = ?,
              is_published = COALESCE(?, is_published),
              updated_at = ?
          WHERE id = ?
        `,
        args: [
          base_price ? Number(base_price) : null,
          sale_price !== undefined ? (sale_price ? Number(sale_price) : null) : null,
          is_published !== undefined ? (is_published ? 1 : 0) : null,
          now,
          productId,
        ],
      });
    }

    return NextResponse.json({ success: true, message: "Inventory & product updated" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating product";
    const status = message.includes("UNAUTHORIZED") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
