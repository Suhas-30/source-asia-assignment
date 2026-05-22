
class IRateLimiterStore {
  getUser(userId) {
    throw new Error('getUser() not implemented');
  }

  setUser(userId, data) {
    throw new Error('setUser() not implemented');
  }

  getAllUsers() {
    throw new Error('getAllUsers() not implemented');
  }
}

module.exports = IRateLimiterStore;