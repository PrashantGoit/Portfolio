const WINDOW_MS = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const MAX_REQUESTS = Number(process.env.CONTACT_RATE_LIMIT_MAX) || 3;

const requestStore = new Map();
let lastCleanupAt = 0;

function cleanupExpiredEntries(now) {
  if (now - lastCleanupAt < WINDOW_MS) {
    return;
  }

  for (const [key, entry] of requestStore.entries()) {
    if (entry.resetAt <= now) {
      requestStore.delete(key);
    }
  }

  lastCleanupAt = now;
}

function getClientKey(req) {
  return req.ip || req.socket?.remoteAddress || "unknown";
}

module.exports = function contactRateLimit(req, res, next) {
  const now = Date.now();
  cleanupExpiredEntries(now);

  const clientKey = getClientKey(req);
  const currentEntry = requestStore.get(clientKey);
  const activeEntry =
    currentEntry && currentEntry.resetAt > now
      ? currentEntry
      : { count: 0, resetAt: now + WINDOW_MS };

  activeEntry.count += 1;
  requestStore.set(clientKey, activeEntry);

  const remaining = Math.max(MAX_REQUESTS - activeEntry.count, 0);
  res.set({
    "X-RateLimit-Limit": String(MAX_REQUESTS),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": new Date(activeEntry.resetAt).toISOString(),
  });

  if (activeEntry.count > MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((activeEntry.resetAt - now) / 1000);

    res.set("Retry-After", String(retryAfterSeconds));

    return res.status(429).json({
      error: "Too many messages from this IP. Please wait 15 minutes and try again.",
    });
  }

  next();
};
