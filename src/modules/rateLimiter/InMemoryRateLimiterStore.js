const IRateLimiterStore = require('./IRateLimiterStore')

class InMemoryRateLimitStore extends IRateLimiterStore{
    constructor(){
        super();
        this._store = new Map();
    }

    getUser(userId){
        return this._store.get(userId) || null;
    }

    setUser(userId, data){
        this._store.set(userId, data)
    }

    getAllUsers(){
        return Object.fromEntries(this._store)
    }
}

module.exports = InMemoryRateLimitStore
