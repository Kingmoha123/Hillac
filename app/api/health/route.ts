import { NextResponse } from "next/server";
import { company } from "@/data/site";

export const dynamic = "force-dynamic";

export function GET() {
  const appEnvironment = process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown";

  return NextResponse.json({
    status: "ok",
    service: company.name,
    timestamp: new Date().toISOString(),
    environment: appEnvironment
  });
}
