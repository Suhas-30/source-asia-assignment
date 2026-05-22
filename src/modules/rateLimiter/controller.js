const {sendError, sendSuccess} = require("../../shared/response")
const {validateRequest} = require("./validator")
const logger = require('../../shared/logger')


class RateLimiterController {
  constructor(service) {
    this._service = service;
  }

  handleRequest(req, res, next) {
    try {
      validateRequest(req.body);

      const { user_id, payload } = req.body;
      const result = this._service.handleRequest(user_id);

      if (result.allowed) {
        logger.info(`Request accepted for user_id: ${user_id}`);
        return sendSuccess(res, 201, 'Request accepted', { user_id, payload });
      } else {
        logger.warn(`Rate limit exceeded for user_id: ${user_id}`);
        return sendError(res, 429, 'Too many requests. Rate limit exceeded');
      }
    } catch (err) {
      next(err);
    }
  }

  getStats(req, res, next) {
    try {
      const stats = this._service.getStats();
      logger.info('Stats requested');
      return sendSuccess(res, 200, 'Stats retrieved successfully', stats);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RateLimiterController;