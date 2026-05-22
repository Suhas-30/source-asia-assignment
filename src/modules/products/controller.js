const {sendError, sendSuccess } = require("../../shared/response")
const { validateCreateProduct, validateAddMedia } = require('./validator');
const logger = require('../../shared/logger');


class ProductController {
  constructor(service) {
    this._service = service;
  }

  createProduct(req, res, next) {
    try {
      validateCreateProduct(req.body);
      const product = this._service.createProduct(req.body);
      logger.info(`Product created: ${product.id}`);
      return sendSuccess(res, 201, 'Product created successfully', product);
    } catch (err) {
      next(err);
    }
  }

  getProducts(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || null;
      const offset = parseInt(req.query.offset) || 0;
      const result = this._service.getProducts(limit, offset);
      logger.info('Products listed');
      return sendSuccess(res, 200, 'Products retrieved successfully', result);
    } catch (err) {
      next(err);
    }
  }

  getProductById(req, res, next) {
    try {
      const product = this._service.getProductById(req.params.id);
      logger.info(`Product retrieved: ${req.params.id}`);
      return sendSuccess(res, 200, 'Product retrieved successfully', product);
    } catch (err) {
      next(err);
    }
  }

  addMedia(req, res, next) {
    try {
      validateAddMedia(req.body);
      const { image_urls = [], video_urls = [] } = req.body;
      const product = this._service.addMedia(req.params.id, image_urls, video_urls);
      logger.info(`Media added to product: ${req.params.id}`);
      return sendSuccess(res, 200, 'Media added successfully', product);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProductController;