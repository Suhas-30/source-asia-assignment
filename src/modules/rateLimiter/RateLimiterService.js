const config = require("../../config");

class RateLimiterService {
  constructor(store, strategy) {
    this._store = store;
    this._strategy = strategy;
  }

  handleRequest(userId) {
    return this._strategy.isAllowed(userId, this._store);
  }

  getStats() {
    return this._store.getAllUsers();
  }
}

module.exports = RateLimiterService;
