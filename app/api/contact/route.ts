import net from "node:net";
import tls from "node:tls";
import { NextResponse } from "next/server";
import { company } from "@/data/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Lead = {
  fullName: string;
  email: string;
  service: string;
  message: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const serviceOptions = new Set([
  "Website Development",
  "Mobile App Development",
  "Custom Software System",
  "Branding & Design",
  "Cloud & IT Consultancy"
]);

const rateLimitStore = new Map<string, RateLimitEntry>();
const rateLimitWindowMs = 15 * 60 * 1000;
const maxRequestsPerWindow = 5;

function jsonResponse(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePayload(payload: unknown): { lead?: Lead; spam?: boolean; message?: string } {
  if (!isRecord(payload)) {
    return { message: "Invalid form submission." };
  }

  const companyName = readString(payload, "companyName");
  if (companyName) {
    return { spam: true };
  }

  const startedAt = payload.startedAt;
  if (typeof startedAt === "number" && Number.isFinite(startedAt) && Date.now() - startedAt < 800) {
    return { spam: true };
  }

  const lead: Lead = {
    fullName: readString(payload, "fullName").replace(/\s+/g, " "),
    email: readString(payload, "email").toLowerCase(),
    service: readString(payload, "service"),
    message: readString(payload, "message")
  };

  if (lead.fullName.length < 2 || lead.fullName.length > 80) {
    return { message: "Please enter a valid full name." };
  }

  if (!isValidEmail(lead.email) || lead.email.length > 254) {
    return { message: "Please enter a valid email address." };
  }

  if (!serviceOptions.has(lead.service)) {
    return { message: "Please choose a valid service." };
  }

  if (lead.message.length < 10 || lead.message.length > 2000) {
    return { message: "Please keep project details between 10 and 2000 characters." };
  }

  return { lead };
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const current = rateLimitStore.get(ip);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + rateLimitWindowMs });
    return true;
  }

  if (current.count >= maxRequestsPerWindow) {
    return false;
  }

  current.count += 1;
  return true;
}

function headerSafe(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function encodeHeader(value: string) {
  return `=?UTF-8?B?${Buffer.from(headerSafe(value), "utf8").toString("base64")}?=`;
}

function escapeDotLines(value: string) {
  return value.replace(/^\./gm, "..");
}

function extractEmailAddress(value: string) {
  const match = value.match(/<([^>]+)>/);
  return (match?.[1] || value).trim();
}

function createEmailBody(lead: Lead) {
  return [
    "New lead from the Hillaac website contact form.",
    "",
    `Name: ${lead.fullName}`,
    `Email: ${lead.email}`,
    `Service: ${lead.service}`,
    "",
    "Project Details:",
    lead.message
  ].join("\n");
}

function createRawEmail(lead: Lead, from: string, recipients: string[]) {
  const subject = `New website lead: ${lead.service}`;
  const body = createEmailBody(lead);

  return escapeDotLines([
    `From: ${headerSafe(from)}`,
    `To: ${recipients.map(headerSafe).join(", ")}`,
    `Reply-To: ${headerSafe(lead.email)}`,
    `Subject: ${encodeHeader(subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    body
  ].join("\r\n"));
}

function readSmtpResponse(socket: net.Socket | tls.TLSSocket) {
  return new Promise<string>((resolve, reject) => {
    let response = "";

    const cleanup = () => {
      socket.off("data", handleData);
      socket.off("error", handleError);
      socket.off("end", handleEnd);
    };

    const handleData = (data: Buffer) => {
      response += data.toString("utf8");
      const lines = response.split(/\r?\n/).filter(Boolean);
      const lastLine = lines[lines.length - 1];

      if (lastLine && /^\d{3} /.test(lastLine)) {
        cleanup();
        resolve(response);
      }
    };

    const handleError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const handleEnd = () => {
      cleanup();
      reject(new Error("SMTP connection closed unexpectedly."));
    };

    socket.on("data", handleData);
    socket.once("error", handleError);
    socket.once("end", handleEnd);
  });
}

async function waitForConnect(socket: net.Socket | tls.TLSSocket, eventName: "connect" | "secureConnect") {
  await new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      socket.off(eventName, handleConnect);
      socket.off("error", handleError);
    };

    const handleConnect = () => {
      cleanup();
      resolve();
    };

    const handleError = (error: Error) => {
      cleanup();
      reject(error);
    };

    socket.once(eventName, handleConnect);
    socket.once("error", handleError);
  });
}

async function sendSmtpCommand(socket: net.Socket | tls.TLSSocket, command: string, expectedCodes: number[]) {
  socket.write(`${command}\r\n`);
  const response = await readSmtpResponse(socket);
  const statusCode = Number.parseInt(response.slice(0, 3), 10);

  if (!expectedCodes.includes(statusCode)) {
    throw new Error("The email server rejected the contact notification.");
  }

  return response;
}

async function sendSmtpEmail(lead: Lead) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host) {
    throw new Error("Email service is not configured.");
  }

  const port = Number.parseInt(process.env.SMTP_PORT || "587", 10);
  const useSecureConnection = process.env.SMTP_SECURE === "true" || port === 465;
  const recipients = (process.env.CONTACT_TO_EMAIL || company.email)
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const fallbackFromEmail = user || recipients[0];
  const from = process.env.SMTP_FROM || `Hillaac Website <${fallbackFromEmail}>`;
  const envelopeFrom = extractEmailAddress(from);

  if (recipients.length === 0 || !fallbackFromEmail) {
    throw new Error("Contact notification recipient is not configured.");
  }

  let socket: net.Socket | tls.TLSSocket = useSecureConnection
    ? tls.connect({ host, port, servername: host })
    : net.connect({ host, port });

  try {
    await waitForConnect(socket, useSecureConnection ? "secureConnect" : "connect");
    await readSmtpResponse(socket);
    let ehloResponse = await sendSmtpCommand(socket, "EHLO hillaac.com", [250]);

    if (!useSecureConnection && process.env.SMTP_STARTTLS !== "false" && ehloResponse.includes("STARTTLS")) {
      await sendSmtpCommand(socket, "STARTTLS", [220]);
      socket = tls.connect({ socket, servername: host });
      await waitForConnect(socket, "secureConnect");
      ehloResponse = await sendSmtpCommand(socket, "EHLO hillaac.com", [250]);
    }

    if (user && pass) {
      await sendSmtpCommand(socket, "AUTH LOGIN", [334]);
      await sendSmtpCommand(socket, Buffer.from(user, "utf8").toString("base64"), [334]);
      await sendSmtpCommand(socket, Buffer.from(pass, "utf8").toString("base64"), [235]);
    }

    await sendSmtpCommand(socket, `MAIL FROM:<${envelopeFrom}>`, [250]);

    for (const recipient of recipients) {
      await sendSmtpCommand(socket, `RCPT TO:<${extractEmailAddress(recipient)}>`, [250, 251]);
    }

    await sendSmtpCommand(socket, "DATA", [354]);
    socket.write(`${createRawEmail(lead, from, recipients)}\r\n.\r\n`);
    await readSmtpResponse(socket);
    await sendSmtpCommand(socket, "QUIT", [221]);
  } finally {
    socket.destroy();
  }
}

async function sendContactNotification(lead: Lead) {
  if (!process.env.SMTP_HOST && process.env.NODE_ENV !== "production") {
    console.info("Contact form lead received:", lead);
    return;
  }

  await sendSmtpEmail(lead);
}

export async function POST(request: Request) {
  const contentLength = Number.parseInt(request.headers.get("content-length") || "0", 10);
  if (contentLength > 12_000) {
    return jsonResponse("Form submission is too large.", 413);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse("Invalid form submission.", 415);
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return jsonResponse("Too many submissions. Please try again later.", 429);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse("Invalid form submission.", 400);
  }

  const validation = validatePayload(payload);
  if (validation.spam) {
    return jsonResponse("Thank you. Your message has been sent.", 200);
  }

  if (!validation.lead) {
    return jsonResponse(validation.message || "Please check the form and try again.", 400);
  }

  try {
    await sendContactNotification(validation.lead);
    return jsonResponse("Thank you. Your message has been sent.", 200);
  } catch (error) {
    console.error("Contact form notification failed:", error);
    return jsonResponse("We could not send your message right now. Please try WhatsApp or call us directly.", 500);
  }
}
