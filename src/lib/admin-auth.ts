import { jwtVerify } from "jose";
import { db } from "@/lib/db";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "alifbaa-dev-secret-change-in-production"
);

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Verify admin session from cookie (alifbaa_admin_token)
 * Returns null if not authenticated.
 */
export async function verifyAdmin(req: Request): Promise<AdminSession | null> {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/alifbaa_admin_token=([^;]+)/);
    if (!match) return null;

    const token = match[1];
    const { payload } = await jwtVerify(token, SECRET);
    const admin = await db.adminUser.findUnique({
      where: { id: payload.id as string },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
    if (!admin || !admin.isActive) return null;
    return admin;
  } catch {
    return null;
  }
}
