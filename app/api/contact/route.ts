import net from "node:net";
import tls from "node:tls";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Lead = {
  fullName: string;
  email: string;
  service: string;
  message: string;
};

type EmailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  recipients: string[];
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeDotLines(value: string) {
  return value.replace(/^\./gm, "..");
}

function extractEmailAddress(value: string) {
  const match = value.match(/<([^>]+)>/);
  return (match?.[1] || value).trim();
}

function isValidMailbox(value: string) {
  return isValidEmail(extractEmailAddress(value));
}

function normalizeSmtpPassword(host: string, password: string) {
  if (host.toLowerCase() === "smtp.gmail.com") {
    return password.replace(/\s+/g, "");
  }

  return password;
}

function createPlainTextEmail(lead: Lead) {
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

function createHtmlEmail(lead: Lead) {
  return [
    "<!doctype html>",
    "<html>",
    "<body style=\"margin:0;background:#f7f8fa;font-family:Arial,sans-serif;color:#0d1321;\">",
    "<div style=\"max-width:640px;margin:0 auto;padding:28px;\">",
    "<div style=\"background:#ffffff;border:1px solid #e6e9ef;border-radius:16px;padding:24px;\">",
    "<h1 style=\"margin:0 0 16px;font-size:22px;line-height:1.3;color:#0d1321;\">New website lead</h1>",
    "<p style=\"margin:0 0 20px;line-height:1.6;color:#667085;\">A visitor submitted the Hillaac website contact form.</p>",
    "<table role=\"presentation\" style=\"width:100%;border-collapse:collapse;\">",
    `<tr><td style=\"padding:10px 0;font-weight:700;width:120px;\">Name</td><td style=\"padding:10px 0;\">${escapeHtml(lead.fullName)}</td></tr>`,
    `<tr><td style=\"padding:10px 0;font-weight:700;\">Email</td><td style=\"padding:10px 0;\"><a href=\"mailto:${escapeHtml(lead.email)}\" style=\"color:#0057d9;\">${escapeHtml(lead.email)}</a></td></tr>`,
    `<tr><td style=\"padding:10px 0;font-weight:700;\">Service</td><td style=\"padding:10px 0;\">${escapeHtml(lead.service)}</td></tr>`,
    "</table>",
    "<div style=\"margin-top:20px;padding-top:20px;border-top:1px solid #e6e9ef;\">",
    "<h2 style=\"margin:0 0 10px;font-size:16px;color:#0d1321;\">Project Details</h2>",
    `<p style=\"margin:0;white-space:pre-wrap;line-height:1.7;color:#222222;\">${escapeHtml(lead.message)}</p>`,
    "</div>",
    "</div>",
    "</div>",
    "</body>",
    "</html>"
  ].join("");
}

function createRawEmail(lead: Lead, from: string, recipients: string[]) {
  const subject = `New website lead: ${lead.service}`;
  const boundary = `hillaac-contact-${Date.now().toString(36)}`;
  const plainText = createPlainTextEmail(lead);
  const html = createHtmlEmail(lead);

  return escapeDotLines([
    `From: ${headerSafe(from)}`,
    `To: ${recipients.map(headerSafe).join(", ")}`,
    `Reply-To: ${headerSafe(lead.email)}`,
    `Subject: ${encodeHeader(subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    plainText,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
    "",
    `--${boundary}--`
  ].join("\r\n"));
}

function getEmailConfig(): EmailConfig {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM?.trim();
  const recipients = (process.env.CONTACT_TO_EMAIL || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const port = Number.parseInt(process.env.SMTP_PORT || "", 10);
  const missing = [
    !host ? "SMTP_HOST" : null,
    !Number.isInteger(port) ? "SMTP_PORT" : null,
    !user ? "SMTP_USER" : null,
    !pass ? "SMTP_PASS" : null,
    !from ? "SMTP_FROM" : null,
    recipients.length === 0 ? "CONTACT_TO_EMAIL" : null
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`Missing contact email environment variables: ${missing.join(", ")}`);
  }

  if (!host || !Number.isInteger(port) || !user || !pass || !from || recipients.length === 0) {
    throw new Error("Contact email environment variables are incomplete.");
  }

  if (!isValidMailbox(from) || !recipients.every(isValidMailbox)) {
    throw new Error("Contact email environment variables contain invalid email addresses.");
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    user,
    pass: normalizeSmtpPassword(host, pass),
    from,
    recipients
  };
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

async function readExpectedSmtpResponse(
  socket: net.Socket | tls.TLSSocket,
  expectedCodes: number[],
  label: string
) {
  const response = await readSmtpResponse(socket);
  const statusCode = Number.parseInt(response.slice(0, 3), 10);

  if (!expectedCodes.includes(statusCode)) {
    throw new Error(`SMTP ${label} failed with status ${statusCode}.`);
  }

  return response;
}

async function sendSmtpCommand(
  socket: net.Socket | tls.TLSSocket,
  command: string,
  expectedCodes: number[],
  label: string
) {
  socket.write(`${command}\r\n`);
  return readExpectedSmtpResponse(socket, expectedCodes, label);
}

async function sendSmtpEmail(lead: Lead) {
  const config = getEmailConfig();
  const envelopeFrom = extractEmailAddress(config.from);

  let socket: net.Socket | tls.TLSSocket = config.secure
    ? tls.connect({ host: config.host, port: config.port, servername: config.host })
    : net.connect({ host: config.host, port: config.port });

  try {
    await waitForConnect(socket, config.secure ? "secureConnect" : "connect");
    await readSmtpResponse(socket);
    let ehloResponse = await sendSmtpCommand(socket, "EHLO hillaac.com", [250], "EHLO");

    if (!config.secure && process.env.SMTP_STARTTLS !== "false" && ehloResponse.includes("STARTTLS")) {
      await sendSmtpCommand(socket, "STARTTLS", [220], "STARTTLS");
      socket = tls.connect({ socket, servername: config.host });
      await waitForConnect(socket, "secureConnect");
      ehloResponse = await sendSmtpCommand(socket, "EHLO hillaac.com", [250], "EHLO after STARTTLS");
    }

    await sendSmtpCommand(socket, "AUTH LOGIN", [334], "AUTH LOGIN");
    await sendSmtpCommand(socket, Buffer.from(config.user, "utf8").toString("base64"), [334], "username authentication");
    await sendSmtpCommand(socket, Buffer.from(config.pass, "utf8").toString("base64"), [235], "password authentication");

    await sendSmtpCommand(socket, `MAIL FROM:<${envelopeFrom}>`, [250], "MAIL FROM");

    for (const recipient of config.recipients) {
      await sendSmtpCommand(socket, `RCPT TO:<${extractEmailAddress(recipient)}>`, [250, 251], "RCPT TO");
    }

    await sendSmtpCommand(socket, "DATA", [354], "DATA");
    socket.write(`${createRawEmail(lead, config.from, config.recipients)}\r\n.\r\n`);
    await readExpectedSmtpResponse(socket, [250], "message delivery");
    await sendSmtpCommand(socket, "QUIT", [221], "QUIT");
  } finally {
    socket.destroy();
  }
}

async function sendContactNotification(lead: Lead) {
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
