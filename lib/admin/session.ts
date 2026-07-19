import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminUser, type AdminRole, type AdminStatus } from "@/models/AdminUser";

export const adminSessionCookieName = "hillaac_admin_session";
const sessionMaxAgeSeconds = 8 * 60 * 60;

export type AdminSession = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastLoginAt?: string | null;
  createdAt?: string;
};

type SessionPayload = {
  adminId: string;
  exp: number;
};

export async function createAdminSessionCookie(response: NextResponse, adminId: string) {
  const token = await signSession({ adminId, exp: Math.floor(Date.now() / 1000) + sessionMaxAgeSeconds });

  response.cookies.set(adminSessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAgeSeconds
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(adminSessionCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}

export async function getCurrentAdmin() {
  const token = cookies().get(adminSessionCookieName)?.value;
  return getAdminFromToken(token);
}

export async function getCurrentAdminFromRequest(request: Request) {
  const token = parseCookieHeader(request.headers.get("cookie")).get(adminSessionCookieName);
  return getAdminFromToken(token);
}

export async function requireAdminSession() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

export async function redirectAuthenticatedAdmin() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }
}

async function getAdminFromToken(token: string | undefined) {
  const payload = await verifySession(token);
  if (!payload) {
    return null;
  }

  await connectToDatabase();
  const admin = await AdminUser.findById(payload.adminId).lean();

  if (!admin || admin.status !== "ACTIVE") {
    return null;
  }

  return {
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
    role: admin.role,
    status: admin.status,
    lastLoginAt: admin.lastLoginAt?.toISOString() || null,
    createdAt: admin.createdAt?.toISOString()
  } satisfies AdminSession;
}

async function signSession(payload: SessionPayload) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = createSignature(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = createSignature(encodedPayload);
  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
    if (!payload.adminId || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be configured with at least 32 characters.");
  }

  return secret;
}

function createSignature(value: string) {
  return crypto.createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function parseCookieHeader(header: string | null) {
  const result = new Map<string, string>();

  if (!header) {
    return result;
  }

  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key) {
      result.set(key, decodeURIComponent(rest.join("=")));
    }
  }

  return result;
}
