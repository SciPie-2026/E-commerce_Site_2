import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getDb, initDb } from "@/lib/db";
import { User } from "@/lib/types";

const JWT_SECRET = process.env.JWT_SECRET || "aidah_super_secret_jwt_key_2026_boutique_secure";
const COOKIE_NAME = "aidah_session_token";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "admin" | "customer";
  name: string;
}

export function createToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  await initDb();
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const db = getDb();
  const res = await db.execute({
    sql: `SELECT id, email, name, phone, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1`,
    args: [payload.userId],
  });

  if (res.rows.length === 0) return null;
  const row = res.rows[0];

  return {
    id: String(row.id),
    email: String(row.email),
    name: String(row.name),
    phone: row.phone ? String(row.phone) : undefined,
    role: row.role as "admin" | "customer",
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("UNAUTHORIZED_ADMIN_ACCESS");
  }
  return user;
}

export { COOKIE_NAME };
