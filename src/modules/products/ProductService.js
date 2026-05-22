const {NotFoundError, ConflictError} = require('../../shared/errors')
const config = require('../../config')

class ProductService{
    constructor(store){
        this._store = store;
    }

    createProduct(data) {
    if (this._store.skuExists(data.sku)) {
      throw new ConflictError(`SKU ${data.sku} already exists`);
    }

    return this._store.create(data);
  }


  getProducts(limit, offset) {
    const validLimit = Math.min(limit || config.PRODUCTS_DEFAULT_LIMIT, config.PRODUCTS_MAX_LIMIT);
    const validOffset = offset || 0;
    const { data, total } = this._store.findAll(validLimit, validOffset);

    return {
      data,
      pagination: {
        total,
        limit: validLimit,
        offset: validOffset,
        hasMore: validOffset + validLimit < total,
      },
    };
  }


  getProductById(id) {
    const product = this._store.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    const media = this._store.getMedia(id);
    return { ...product, ...media };
  }

  addMedia(id, imageUrls, videoUrls) {
    const product = this._store.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    this._store.addMedia(id, imageUrls, videoUrls);
    return this._store.findById(id);
  }
}


module.exports = ProductService;