import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { Coupon } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = String(body.code || "").toUpperCase().trim();
    const subtotal = Number(body.subtotal || body.order_amount || 0);
    return validateCouponLogic(code, subtotal);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error validating coupon";
    return NextResponse.json({ valid: false, message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = (searchParams.get("code") || "").toUpperCase().trim();
    const subtotal = Number(searchParams.get("subtotal") || searchParams.get("order_amount") || 0);
    return validateCouponLogic(code, subtotal);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error validating coupon";
    return NextResponse.json({ valid: false, message }, { status: 500 });
  }
}

async function validateCouponLogic(code: string, subtotal: number) {
  if (!code) {
    return NextResponse.json({ valid: false, message: "Coupon code required" }, { status: 400 });
  }

  try {
    await initDb();
    const db = getDb();
    const res = await db.execute({
      sql: `SELECT * FROM coupons WHERE code = ? AND is_active = 1 LIMIT 1`,
      args: [code],
    });

    if (res.rows.length === 0) {
      return NextResponse.json({ valid: false, message: "Invalid or inactive privilege code." });
    }

    const row = res.rows[0];
    const today = new Date().toISOString().split("T")[0];

    if (String(row.valid_until) < today) {
      return NextResponse.json({ valid: false, message: "This privilege code has expired." });
    }

    if (Number(row.usage_count) >= Number(row.usage_limit)) {
      return NextResponse.json({ valid: false, message: "This privilege code has reached its usage limit." });
    }

    const minSpend = Number(row.min_spend);
    if (subtotal < minSpend) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order spend of ₹${minSpend.toLocaleString("en-IN")} required for this code.`,
      });
    }

    const coupon: Coupon = {
      id: String(row.id),
      code: String(row.code),
      discount_type: row.discount_type as "percent" | "fixed",
      discount_value: Number(row.discount_value),
      min_spend: minSpend,
      max_discount: row.max_discount ? Number(row.max_discount) : null,
      usage_limit: Number(row.usage_limit),
      usage_count: Number(row.usage_count),
      valid_from: String(row.valid_from),
      valid_until: String(row.valid_until),
      is_active: Boolean(row.is_active),
    };

    return NextResponse.json({ valid: true, coupon });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error validating coupon";
    return NextResponse.json({ valid: false, message }, { status: 500 });
  }
}
