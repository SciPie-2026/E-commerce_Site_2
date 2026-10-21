import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await initDb();
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT OR IGNORE INTO newsletter_subscribers (id, email, is_active, created_at)
            VALUES (?, ?, 1, ?)`,
      args: [`sub_${Date.now()}`, email.toLowerCase().trim(), now],
    });

    return NextResponse.json({
      success: true,
      message: "Welcome to AIDAH Gazette. Please check your inbox for an invitation to our private salon.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error subscribing to newsletter";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
