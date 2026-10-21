import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb, initDb } from "@/lib/db";
import { createToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await initDb();
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const db = getDb();
    const existing = await db.execute({
      sql: `SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1`,
      args: [email.trim()],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [userId, email.trim(), passwordHash, name.trim(), phone?.trim() || null, "customer", now, now],
    });

    // Create customer profile
    await db.execute({
      sql: `INSERT INTO customer_profiles (user_id, preferences_json) VALUES (?, ?)`,
      args: [userId, JSON.stringify({ newsletter: true })],
    });

    const token = createToken({
      userId,
      email: email.trim(),
      role: "customer",
      name: name.trim(),
    });

    const user = {
      id: userId,
      email: email.trim(),
      name: name.trim(),
      phone: phone?.trim(),
      role: "customer",
      created_at: now,
      updated_at: now,
    };

    const response = NextResponse.json({ success: true, user });
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
