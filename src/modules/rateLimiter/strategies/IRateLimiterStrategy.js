class IRateLimiterStrategy{
    isAllowed(userId, store){
        throw new Error('isAllowed() not implemented')
    }
}

module.exports = IRateLimiterStrategy