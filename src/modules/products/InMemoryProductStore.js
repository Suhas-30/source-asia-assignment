const IProductStore = require('./IProductStore')
const { v4: uuidv4 } = require('uuid');

class InMemoryProductStore extends IProductStore{
    constructor(){
        super();
    this._products = new Map();
    this._media = new Map();
    this._skus = new Set();
    }

    create(product) {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newProduct = {
      id,
      name: product.name,
      sku: product.sku,
      image_count: product.image_urls ? product.image_urls.length : 0,
      video_count: product.video_urls ? product.video_urls.length : 0,
      created_at: now,
    };

    this._products.set(id, newProduct);
    this._media.set(id, {
      image_urls: product.image_urls || [],
      video_urls: product.video_urls || [],
    });
    this._skus.add(product.sku);

    return newProduct;
  }
  findById(id) {
    return this._products.get(id) || null;
  }

  findAll(limit, offset) {
    const products = Array.from(this._products.values());
    const total = products.length;
    const data = products.slice(offset, offset + limit);
    return { data, total };
  } 

  addMedia(id, imageUrls, videoUrls) {
    const media = this._media.get(id);
    media.image_urls.push(...imageUrls);
    media.video_urls.push(...videoUrls);

    const product = this._products.get(id);
    product.image_count = media.image_urls.length;
    product.video_count = media.video_urls.length;

    this._products.set(id, product);
    this._media.set(id, media);
  }

  getMedia(id) {
    return this._media.get(id) || null;
  }

  skuExists(sku) {
    return this._skus.has(sku);
  }
}

module.exports = InMemoryProductStore;