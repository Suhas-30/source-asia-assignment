class IProductStore{
    create(product) {
    throw new Error('create() not implemented');
  }

  findById(id) {
    throw new Error('findById() not implemented');
  }

  findAll(limit, offset) {
    throw new Error('findAll() not implemented');
  }

  addMedia(id, imageUrls, videoUrls) {
    throw new Error('addMedia() not implemented');
  }

  getMedia(id) {
    throw new Error('getMedia() not implemented');
  }

  skuExists(sku) {
    throw new Error('skuExists() not implemented');
  }

}

module.exports = IProductStore