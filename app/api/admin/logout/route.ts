import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/admin/session";

export async function POST() {
  const response = NextResponse.json({ redirectTo: "/admin/login" });
  clearAdminSessionCookie(response);
  return response;
}
