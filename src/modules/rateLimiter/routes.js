const express = require('express');
const RateLimiterController = require('./controller');
const RateLimiterService = require('./RateLimiterService');
const InMemoryRateLimiterStore = require('./InMemoryRateLimiterStore');
const FixedWindowStrategy = require('./strategies/FixedWindowStrategy');

const router = express.Router();

const store = new InMemoryRateLimiterStore();
const strategy = new FixedWindowStrategy();
const service = new RateLimiterService(store, strategy);
const controller = new RateLimiterController(service);

router.post('/request', (req, res, next) => controller.handleRequest(req, res, next));
router.get('/stats', (req, res, next) => controller.getStats(req, res, next));

module.exports = router;