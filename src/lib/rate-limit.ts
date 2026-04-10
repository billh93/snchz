type Entry = { count: number; resetAt: number };

const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

export function createRateLimiter(limit: number, windowMs: number) {
  const map = new Map<string, Entry>();
  let lastCleanup = Date.now();

  function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
    lastCleanup = now;
    for (const [key, entry] of map) {
      if (now > entry.resetAt) map.delete(key);
    }
  }

  return function isRateLimited(ip: string): boolean {
    cleanup();
    const now = Date.now();
    const entry = map.get(ip);

    if (!entry || now > entry.resetAt) {
      map.set(ip, { count: 1, resetAt: now + windowMs });
      return false;
    }

    entry.count++;
    return entry.count > limit;
  };
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
