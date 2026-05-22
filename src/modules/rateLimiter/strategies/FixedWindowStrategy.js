const IRateLimiterStrategy = require("./IRateLimiterStrategy");
const config = require("../../../config");

class FixedWindowStrategy extends IRateLimiterStrategy {
  isAllowed(userId, store) {
    const now = Date.now();
    let user = store.getUser(userId);

    if (!user || now - user.windowStart >= config.RATE_LIMIT_WINDOW_MS) {
      user = { accepted: 0, rejected: 0, windowStart: now };
    }

    if (user.accepted < config.RATE_LIMIT_MAX_REQUESTS) {
      user.accepted += 1;
      store.setUser(userId, user);
      return { allowed: true };
    } else {
      user.rejected += 1;
      store.setUser(userId, user);
      return { allowed: false };
    }
  }
}

module.exports = FixedWindowStrategy;