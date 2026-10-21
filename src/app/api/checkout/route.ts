import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await initDb();
    const user = await getCurrentUser();
    const body = await req.json();

    const {
      items,
      shippingAddress,
      couponCode,
      notes,
      paymentMethod,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.full_name || !shippingAddress.street_line1 || !shippingAddress.city || !shippingAddress.postal_code) {
      return NextResponse.json({ error: "Complete shipping address is required." }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();

    // 1. Server-side price and stock validation
    let subtotal = 0;
    const validatedItems: Array<{
      productId: string;
      variantId: string;
      productName: string;
      size: string;
      color: string;
      sku: string;
      price: number;
      quantity: number;
      itemTotal: number;
    }> = [];

    for (const item of items) {
      const varRes = await db.execute({
        sql: `
          SELECT v.*, p.name as product_name, p.base_price, p.sale_price, p.is_published
          FROM product_variants v
          JOIN products p ON v.product_id = p.id
          WHERE v.id = ?
          LIMIT 1
        `,
        args: [item.variant_id],
      });

      if (varRes.rows.length === 0) {
        return NextResponse.json({ error: `Selected item variant ${item.variant_id} is no longer available.` }, { status: 400 });
      }

      const row = varRes.rows[0];
      const stock = Number(row.stock_quantity);
      if (stock < item.quantity) {
        return NextResponse.json({
          error: `Insufficient stock for "${row.product_name}" (${row.size} / ${row.color}). Only ${stock} remaining.`,
        }, { status: 400 });
      }

      const itemPrice = row.price_override ? Number(row.price_override) : (row.sale_price ? Number(row.sale_price) : Number(row.base_price));
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: String(row.product_id),
        variantId: String(row.id),
        productName: String(row.product_name),
        size: String(row.size),
        color: String(row.color),
        sku: String(row.sku),
        price: itemPrice,
        quantity: item.quantity,
        itemTotal,
      });
    }

    // 2. Validate coupon if applied
    let discount = 0;
    let validCouponId: string | null = null;

    if (couponCode) {
      const cpnRes = await db.execute({
        sql: `SELECT * FROM coupons WHERE code = ? AND is_active = 1 LIMIT 1`,
        args: [couponCode.toUpperCase().trim()],
      });

      if (cpnRes.rows.length > 0) {
        const cRow = cpnRes.rows[0];
        const minSpend = Number(cRow.min_spend);
        if (subtotal >= minSpend) {
          if (cRow.discount_type === "percent") {
            discount = (subtotal * Number(cRow.discount_value)) / 100;
            if (cRow.max_discount && discount > Number(cRow.max_discount)) {
              discount = Number(cRow.max_discount);
            }
          } else {
            discount = Number(cRow.discount_value);
          }
          discount = Math.min(discount, subtotal);
          validCouponId = String(cRow.id);
        }
      }
    }

    // 3. Shipping and Tax calculation
    const shippingFee = subtotal >= 3999 ? 0 : 250;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * 0.05); // 5% GST
    const totalAmount = taxableAmount + tax + shippingFee;

    // 4. Create Order ID & Human Readable Order Number
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AIDAH-${new Date().getFullYear()}-${randomDigits}`;

    // 5. Decrement Stock & Record Inventory Movement
    for (const vItem of validatedItems) {
      await db.execute({
        sql: `UPDATE product_variants SET stock_quantity = stock_quantity - ? WHERE id = ?`,
        args: [vItem.quantity, vItem.variantId],
      });

      await db.execute({
        sql: `INSERT INTO inventory_movements (id, variant_id, change_amount, reason, reference_id, created_at)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [`mov_${Date.now()}_${vItem.variantId}`, vItem.variantId, -vItem.quantity, `Order purchase #${orderNumber}`, orderId, now],
      });
    }

    // 6. Record Order
    await db.execute({
      sql: `INSERT INTO orders (
        id, order_number, user_id, guest_email, status, payment_status,
        subtotal, discount, tax, shipping_fee, total_amount, currency,
        shipping_address_json, tracking_carrier, tracking_number, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        orderId,
        orderNumber,
        user ? user.id : null,
        shippingAddress.email || (user ? user.email : "guest@aidah.com"),
        "confirmed",
        "paid", // Sandbox payment simulation
        subtotal,
        discount,
        tax,
        shippingFee,
        totalAmount,
        "INR",
        JSON.stringify(shippingAddress),
        "BlueDart Couture Express",
        `BD${Math.floor(10000000 + Math.random() * 90000000)}IN`,
        notes || "Atelier luxury gift packaging requested.",
        now,
        now,
      ],
    });

    // 7. Record Order Items Snapshot
    for (let i = 0; i < validatedItems.length; i++) {
      const v = validatedItems[i];
      await db.execute({
        sql: `INSERT INTO order_items (id, order_id, product_id, variant_id, product_name, size, color, sku, price_at_purchase, quantity, item_total)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          `item_${orderId}_${i + 1}`,
          orderId,
          v.productId,
          v.variantId,
          v.productName,
          v.size,
          v.color,
          v.sku,
          v.price,
          v.quantity,
          v.itemTotal,
        ],
      });
    }

    // 8. Record Payment in Sandbox Mode
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await db.execute({
      sql: `INSERT INTO payments (id, order_id, provider, transaction_id, status, amount, currency, raw_response_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        paymentId,
        orderId,
        paymentMethod || "sandbox_card",
        `TXN_SB_${Date.now()}`,
        "SUCCESS",
        totalAmount,
        "INR",
        JSON.stringify({ simulated: true, mode: "sandbox", provider: paymentMethod || "sandbox_card", timestamp: now }),
        now,
      ],
    });

    // 9. Increment coupon usage count if used
    if (validCouponId) {
      await db.execute({
        sql: `UPDATE coupons SET usage_count = usage_count + 1 WHERE id = ?`,
        args: [validCouponId],
      });
    }

    // 10. Audit Log
    await db.execute({
      sql: `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [`log_${Date.now()}`, user ? user.id : "GUEST", "ORDER_CREATED", "ORDER", orderId, JSON.stringify({ orderNumber, totalAmount }), now],
    });

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      totalAmount,
      shippingFee,
      tax,
      discount,
      subtotal,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error processing checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
