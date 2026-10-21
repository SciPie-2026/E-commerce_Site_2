import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await initDb();
    await requireAdmin();
    const db = getDb();

    // 1. Total Revenue from paid orders
    const revRes = await db.execute(`
      SELECT COALESCE(SUM(total_amount), 0) as total_revenue
      FROM orders
      WHERE payment_status = 'paid' AND status != 'cancelled';
    `);
    const totalRevenue = Number(revRes.rows[0].total_revenue);

    // 2. Order counts
    const orderCountRes = await db.execute(`SELECT COUNT(*) as count FROM orders;`);
    const totalOrders = Number(orderCountRes.rows[0].count);

    const pendingCountRes = await db.execute(`
      SELECT COUNT(*) as count FROM orders WHERE status IN ('pending', 'confirmed', 'processing');
    `);
    const pendingOrders = Number(pendingCountRes.rows[0].count);

    // 3. Customers count
    const custRes = await db.execute(`SELECT COUNT(*) as count FROM users WHERE role = 'customer';`);
    const totalCustomers = Number(custRes.rows[0].count);

    // 4. Products count
    const prodRes = await db.execute(`SELECT COUNT(*) as count FROM products;`);
    const totalProducts = Number(prodRes.rows[0].count);

    // 5. Low stock variants
    const lowStockRes = await db.execute(`
      SELECT v.*, p.name as product_name
      FROM product_variants v
      JOIN products p ON v.product_id = p.id
      WHERE v.stock_quantity <= 5
      ORDER BY v.stock_quantity ASC
      LIMIT 10;
    `);
    const lowStockVariants = lowStockRes.rows.map((r) => ({
      id: String(r.id),
      product_name: String(r.product_name),
      size: String(r.size),
      color: String(r.color),
      stock_quantity: Number(r.stock_quantity),
    }));

    // 6. Recent Orders
    const recentOrdersRes = await db.execute(`
      SELECT id, order_number, guest_email, status, payment_status, total_amount, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 6;
    `);
    const recentOrders = recentOrdersRes.rows.map((r) => ({
      id: String(r.id),
      order_number: String(r.order_number),
      guest_email: String(r.guest_email || "Customer"),
      status: String(r.status),
      payment_status: String(r.payment_status),
      total_amount: Number(r.total_amount),
      created_at: String(r.created_at),
    }));

    // 7. Recent Audit Logs
    const auditRes = await db.execute(`
      SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 5;
    `);
    const auditLogs = auditRes.rows.map((r) => ({
      id: String(r.id),
      action: String(r.action),
      entity_type: String(r.entity_type),
      created_at: String(r.created_at),
    }));

    return NextResponse.json({
      metrics: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        totalCustomers,
        totalProducts,
        lowStockCount: lowStockVariants.length,
      },
      lowStockVariants,
      recentOrders,
      auditLogs,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching admin metrics";
    const status = message.includes("UNAUTHORIZED") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
