import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb, initDb } from "@/lib/db";
import { createToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await initDb();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const db = getDb();
    const res = await db.execute({
      sql: `SELECT id, email, password_hash, name, phone, role, created_at, updated_at FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1`,
      args: [email.trim()],
    });

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const userRow = res.rows[0];
    const passwordMatch = await bcrypt.compare(password, String(userRow.password_hash));
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = createToken({
      userId: String(userRow.id),
      email: String(userRow.email),
      role: userRow.role as "admin" | "customer",
      name: String(userRow.name),
    });

    const user = {
      id: String(userRow.id),
      email: String(userRow.email),
      name: String(userRow.name),
      phone: userRow.phone ? String(userRow.phone) : undefined,
      role: userRow.role,
      created_at: String(userRow.created_at),
      updated_at: String(userRow.updated_at),
    };

    const response = NextResponse.json({ success: true, user });

    // Set HTTP-only cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
