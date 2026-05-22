module.exports = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_PREFIX:'/api',

    RATE_LIMIT_WINDOW_MS: 60*1000,
    RATE_LIMIT_MAX_REQUESTS: 5,

    MAX_IMAGE_URLS: 20,
    MAX_VIDEO_URLS: 20,
    MAX_URL_LENGTH: 2048,
    PRODUCTS_DEFAULT_LIMIT: 10,
    PRODUCTS_MAX_LIMIT: 100,
}