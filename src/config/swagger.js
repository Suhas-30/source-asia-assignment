// src/config/swagger.js
const userDocs = require('../modules/user/swagger');
const rateLimiterDocs = require("../modules/rateLimiter/swagger")
const productDocs = require("../modules/products/swagger")
module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'RateLimiter API',
    version: '1.0.0',
    description: 'Rate Limiter and Product Catalog API',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
  paths: {
    ...userDocs,
    ...rateLimiterDocs,
    ...productDocs
  },
};