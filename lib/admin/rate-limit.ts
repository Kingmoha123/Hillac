type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const loginAttempts = new Map<string, RateLimitEntry>();
const loginWindowMs = 15 * 60 * 1000;
const maxLoginAttempts = 8;

export function checkLoginRateLimit(key: string) {
  const now = Date.now();
  const current = loginAttempts.get(key);

  if (!current || current.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + loginWindowMs });
    return true;
  }

  if (current.count >= maxLoginAttempts) {
    return false;
  }

  current.count += 1;
  return true;
}

export function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}
