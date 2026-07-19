import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { checkLoginRateLimit, getRequestIp } from "@/lib/admin/rate-limit";
import { createAdminSessionCookie } from "@/lib/admin/session";
import { isValidEmail, normalizeEmail } from "@/lib/admin/validation";
import { connectToDatabase } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";

const invalidCredentialsMessage = "Invalid email or password.";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ message: invalidCredentialsMessage }, { status: 400 });
  }

  const ip = getRequestIp(request);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: invalidCredentialsMessage }, { status: 400 });
  }

  if (!isLoginPayload(payload)) {
    return NextResponse.json({ message: invalidCredentialsMessage }, { status: 400 });
  }

  const email = normalizeEmail(payload.email);
  const rateLimitKey = `${ip}:${email || "unknown"}`;

  if (!checkLoginRateLimit(rateLimitKey)) {
    return NextResponse.json({ message: "Too many login attempts. Please try again later." }, { status: 429 });
  }

  if (!isValidEmail(email) || payload.password.length > 256) {
    return NextResponse.json({ message: invalidCredentialsMessage }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const admin = await AdminUser.findOne({ email }).select("+passwordHash");

    if (!admin || admin.status !== "ACTIVE") {
      return NextResponse.json({ message: invalidCredentialsMessage }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(payload.password, admin.passwordHash);
    if (!passwordMatches) {
      return NextResponse.json({ message: invalidCredentialsMessage }, { status: 401 });
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const response = NextResponse.json({ redirectTo: "/admin" });
    await createAdminSessionCookie(response, admin._id.toString());
    return response;
  } catch (error) {
    console.error("Admin login failed:", error);
    return NextResponse.json({ message: "Unable to sign in right now." }, { status: 500 });
  }
}

function isLoginPayload(value: unknown): value is { email: string; password: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    typeof (value as { email?: unknown }).email === "string" &&
    typeof (value as { password?: unknown }).password === "string"
  );
}
