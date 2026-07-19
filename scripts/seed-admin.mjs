import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

loadEnvFile(".env.local");

const name = process.env.ADMIN_SEED_NAME?.trim();
const email = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_SEED_PASSWORD || "";
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  fail("MONGODB_URI is required.");
}

if (!name || name.length < 2 || name.length > 80) {
  fail("ADMIN_SEED_NAME must be between 2 and 80 characters.");
}

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  fail("ADMIN_SEED_EMAIL must be a valid email address.");
}

if (password.length < 12 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
  fail("ADMIN_SEED_PASSWORD must be at least 12 characters and include uppercase, lowercase, and number characters.");
}

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["SUPER_ADMIN", "ADMIN", "EDITOR"], required: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], required: true },
    lastLoginAt: { type: Date, default: null }
  },
  { collection: "admin_users", timestamps: true }
);

const AdminUser = mongoose.models.AdminUser || mongoose.model("AdminUser", adminUserSchema);

try {
  await mongoose.connect(mongoUri, { bufferCommands: false });

  const existingAdmin = await AdminUser.findOne({ email }).lean();
  if (existingAdmin) {
    console.log("Admin user already exists. No duplicate user was created.");
    process.exitCode = 0;
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    await AdminUser.create({
      name,
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE"
    });
    console.log("Initial SUPER_ADMIN user created.");
  }
} catch (error) {
  console.error("Failed to seed admin user:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}

function loadEnvFile(fileName) {
  const envPath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...rest] = trimmed.split("=");
    const value = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
