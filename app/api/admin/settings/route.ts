import { NextResponse } from "next/server";
import { getCurrentAdminFromRequest } from "@/lib/admin/session";
import { validateName } from "@/lib/admin/validation";
import { connectToDatabase } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";

export async function PATCH(request: Request) {
  const admin = await getCurrentAdminFromRequest(request);

  if (!admin) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid settings update." }, { status: 400 });
  }

  if (!isSettingsPayload(payload)) {
    return NextResponse.json({ message: "Invalid settings update." }, { status: 400 });
  }

  const nameValidation = validateName(payload.name);
  if (nameValidation.error || !nameValidation.value) {
    return NextResponse.json({ message: nameValidation.error }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const updatedAdmin = await AdminUser.findByIdAndUpdate(
      admin.id,
      { $set: { name: nameValidation.value } },
      { new: true }
    ).lean();

    if (!updatedAdmin || updatedAdmin.status !== "ACTIVE") {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    return NextResponse.json({
      admin: {
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        status: updatedAdmin.status
      }
    });
  } catch (error) {
    console.error("Admin settings update failed:", error);
    return NextResponse.json({ message: "Unable to update settings right now." }, { status: 500 });
  }
}

function isSettingsPayload(value: unknown): value is { name: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    typeof (value as { name?: unknown }).name === "string"
  );
}
