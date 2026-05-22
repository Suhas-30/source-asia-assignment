module.exports = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_PREFIX:'/api',

    RATE_LIMIT_WINDOW_MS: 60*1000,
    RATE_LIMIT_MAX_REQUESTS: 5,
}