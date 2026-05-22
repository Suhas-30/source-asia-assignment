const express = require('express');
const ProductController = require('./controller');
const ProductService = require('./ProductService');
const InMemoryProductStore = require('./InMemoryProductStore');

const router = express.Router();

const store = new InMemoryProductStore();
const service = new ProductService(store);
const controller = new ProductController(service);

router.post('/', (req, res, next) => controller.createProduct(req, res, next));
router.get('/', (req, res, next) => controller.getProducts(req, res, next));
router.get('/:id', (req, res, next) => controller.getProductById(req, res, next));
router.post('/:id/media', (req, res, next) => controller.addMedia(req, res, next));

module.exports = router;