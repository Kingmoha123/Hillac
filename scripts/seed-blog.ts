import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { BlogPost } from "../models/BlogPost";
import { connectToDatabase } from "../lib/db";
import { mapLocalBlogPostToInput } from "../lib/blog/repository";
import { blogPosts } from "../data/blog";

loadLocalEnv();

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required to seed blog articles.");
  }

  await connectToDatabase();

  let created = 0;
  let skipped = 0;

  for (const localPost of blogPosts) {
    const existing = await BlogPost.findOne({ slug: localPost.slug }).lean();
    if (existing) {
      skipped += 1;
      continue;
    }

    const input = mapLocalBlogPostToInput(localPost);
    await BlogPost.create({
      ...input,
      createdBy: "seed",
      updatedBy: "seed",
      updatedContentAt: new Date()
    });
    created += 1;
  }

  console.log(`Blog seed complete. Created ${created}; skipped ${skipped}.`);
}

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

withTimeout(main(), 30000)
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => undefined);
  });

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return Promise.race([
    promise,
    new Promise<T>((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Blog seed timed out while connecting to MongoDB. Check MONGODB_URI, DNS, and Atlas Network Access."));
      }, timeoutMs);
    })
  ]);
}
