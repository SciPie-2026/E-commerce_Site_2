import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { Collection } from "@/lib/types";

export async function GET() {
  try {
    await initDb();
    const db = getDb();
    const res = await db.execute(`
      SELECT * FROM collections ORDER BY sort_order ASC
    `);

    const collections: Collection[] = res.rows.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      slug: String(row.slug),
      description: String(row.description || ""),
      banner_image_url: String(row.banner_image_url || ""),
      is_featured: Boolean(row.is_featured),
      sort_order: Number(row.sort_order),
    }));

    return NextResponse.json({ collections });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching collections";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
