import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await initDb();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to view orders" }, { status: 401 });
    }

    const db = getDb();
    const res = await db.execute({
      sql: `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      args: [user.id],
    });

    const orders = [];
    for (const row of res.rows) {
      const oId = String(row.id);
      const itemsRes = await db.execute({
        sql: `SELECT * FROM order_items WHERE order_id = ?`,
        args: [oId],
      });

      orders.push({
        id: oId,
        order_number: String(row.order_number),
        status: String(row.status),
        payment_status: String(row.payment_status),
        subtotal: Number(row.subtotal),
        discount: Number(row.discount),
        tax: Number(row.tax),
        shipping_fee: Number(row.shipping_fee),
        total_amount: Number(row.total_amount),
        currency: String(row.currency),
        tracking_carrier: row.tracking_carrier ? String(row.tracking_carrier) : null,
        tracking_number: row.tracking_number ? String(row.tracking_number) : null,
        created_at: String(row.created_at),
        items: itemsRes.rows.map((it) => ({
          id: String(it.id),
          product_name: String(it.product_name),
          size: String(it.size),
          color: String(it.color),
          price_at_purchase: Number(it.price_at_purchase),
          quantity: Number(it.quantity),
          item_total: Number(it.item_total),
        })),
      });
    }

    return NextResponse.json({ orders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
