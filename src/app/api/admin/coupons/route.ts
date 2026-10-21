import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await initDb();
    await requireAdmin();
    const db = getDb();
    const res = await db.execute(`SELECT * FROM coupons ORDER BY valid_until DESC`);
    return NextResponse.json({ coupons: res.rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching coupons";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDb();
    const admin = await requireAdmin();
    const db = getDb();
    const { code, discount_type, discount_value, min_spend, max_discount, usage_limit, valid_until } = await req.json();

    if (!code || !discount_value) {
      return NextResponse.json({ error: "Code and discount value required" }, { status: 400 });
    }

    const cId = `cpn_${Date.now()}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO coupons (id, code, discount_type, discount_value, min_spend, max_discount, usage_limit, usage_count, valid_from, valid_until, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, 1)`,
      args: [
        cId,
        code.toUpperCase().trim(),
        discount_type || "percent",
        Number(discount_value),
        Number(min_spend || 0),
        max_discount ? Number(max_discount) : null,
        Number(usage_limit || 100),
        now.split("T")[0],
        valid_until || "2026-12-31",
      ],
    });

    await db.execute({
      sql: `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [`log_${Date.now()}`, admin.id, "COUPON_CREATE", "COUPON", cId, JSON.stringify({ code }), now],
    });

    return NextResponse.json({ success: true, message: "Privilege code created" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating coupon";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
