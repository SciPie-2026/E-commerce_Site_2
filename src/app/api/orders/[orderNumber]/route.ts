import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    await initDb();
    const { orderNumber } = await params;
    const user = await getCurrentUser();
    const db = getDb();

    const res = await db.execute({
      sql: `SELECT * FROM orders WHERE order_number = ? OR id = ? LIMIT 1`,
      args: [orderNumber, orderNumber],
    });

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const row = res.rows[0];

    // Authorization check: User can view if admin, or if owner, or if public tracking (guest)
    if (user && user.role !== "admin" && row.user_id && row.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized access to this order." }, { status: 403 });
    }

    const oId = String(row.id);
    const itemsRes = await db.execute({
      sql: `SELECT * FROM order_items WHERE order_id = ?`,
      args: [oId],
    });

    const items = itemsRes.rows.map((it) => ({
      id: String(it.id),
      product_id: String(it.product_id),
      variant_id: String(it.variant_id),
      product_name: String(it.product_name),
      size: String(it.size),
      color: String(it.color),
      sku: String(it.sku),
      price_at_purchase: Number(it.price_at_purchase),
      quantity: Number(it.quantity),
      item_total: Number(it.item_total),
    }));

    let shippingAddress = null;
    try {
      shippingAddress = JSON.parse(String(row.shipping_address_json));
    } catch {
      // ignore
    }

    const order = {
      id: oId,
      order_number: String(row.order_number),
      user_id: row.user_id ? String(row.user_id) : null,
      guest_email: row.guest_email ? String(row.guest_email) : null,
      status: String(row.status),
      payment_status: String(row.payment_status),
      subtotal: Number(row.subtotal),
      discount: Number(row.discount),
      tax: Number(row.tax),
      shipping_fee: Number(row.shipping_fee),
      total_amount: Number(row.total_amount),
      currency: String(row.currency),
      shipping_address: shippingAddress,
      tracking_carrier: row.tracking_carrier ? String(row.tracking_carrier) : null,
      tracking_number: row.tracking_number ? String(row.tracking_number) : null,
      notes: row.notes ? String(row.notes) : null,
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
      items,
    };

    return NextResponse.json({ order });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
