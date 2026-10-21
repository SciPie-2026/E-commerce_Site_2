import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { Category } from "@/lib/types";

export async function GET() {
  try {
    await initDb();
    const db = getDb();
    const res = await db.execute(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_published = 1
      GROUP BY c.id
      ORDER BY c.sort_order ASC
    `);

    const categories: Category[] = res.rows.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      slug: String(row.slug),
      description: String(row.description || ""),
      image_url: String(row.image_url || ""),
      sort_order: Number(row.sort_order),
      product_count: Number(row.product_count || 0),
    }));

    return NextResponse.json({ categories });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching categories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
