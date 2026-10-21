import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await initDb();
    await requireAdmin();
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let sql = `SELECT * FROM orders`;
    const args: string[] = [];

    if (status && status !== "all") {
      sql += ` WHERE status = ?`;
      args.push(status);
    }

    sql += ` ORDER BY created_at DESC LIMIT 50`;

    const res = await db.execute({ sql, args });

    const orders = [];
    for (const row of res.rows) {
      const oId = String(row.id);
      const itemsRes = await db.execute({
        sql: `SELECT * FROM order_items WHERE order_id = ?`,
        args: [oId],
      });

      let address = null;
      try {
        address = JSON.parse(String(row.shipping_address_json));
      } catch {
        // ignore
      }

      orders.push({
        id: oId,
        order_number: String(row.order_number),
        guest_email: String(row.guest_email || ""),
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
        notes: row.notes ? String(row.notes) : null,
        created_at: String(row.created_at),
        shipping_address: address,
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
    const message = err instanceof Error ? err.message : "Error fetching admin orders";
    const status = message.includes("UNAUTHORIZED") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(req: Request) {
  try {
    await initDb();
    const admin = await requireAdmin();
    const db = getDb();
    const { orderId, status, tracking_carrier, tracking_number, notes } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const now = new Date().toISOString();

    await db.execute({
      sql: `
        UPDATE orders
        SET status = COALESCE(?, status),
            tracking_carrier = COALESCE(?, tracking_carrier),
            tracking_number = COALESCE(?, tracking_number),
            notes = COALESCE(?, notes),
            updated_at = ?
        WHERE id = ?
      `,
      args: [status || null, tracking_carrier || null, tracking_number || null, notes || null, now, orderId],
    });

    // Record audit log
    await db.execute({
      sql: `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [`log_${Date.now()}`, admin.id, "ORDER_STATUS_UPDATE", "ORDER", orderId, JSON.stringify({ status, tracking_number }), now],
    });

    return NextResponse.json({ success: true, message: "Order updated successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating order";
    const status = message.includes("UNAUTHORIZED") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
