const {BadRequestError} = require('../../shared/errors')
const config = require('../../config');


const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  if (url.length > config.MAX_URL_LENGTH) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};


const validateUrls = (urls, fieldName) => {
  if (!Array.isArray(urls)) {
    throw new BadRequestError(`${fieldName} must be an array`);
  }
  if (urls.length > config.MAX_IMAGE_URLS) {
    throw new BadRequestError(`${fieldName} must not exceed ${config.MAX_IMAGE_URLS} URLs`);
  }
  urls.forEach((url) => {
    if (!isValidUrl(url)) {
      throw new BadRequestError(`Invalid URL in ${fieldName}: ${url}`);
    }
  });
};


const validateCreateProduct = (body) => {
  const { name, sku, image_urls, video_urls } = body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new BadRequestError('name is required and must be a non-empty string');
  }

  if (!sku || typeof sku !== 'string' || sku.trim() === '') {
    throw new BadRequestError('sku is required and must be a non-empty string');
  }

  if (image_urls) validateUrls(image_urls, 'image_urls');
  if (video_urls) validateUrls(video_urls, 'video_urls');
};


const validateAddMedia = (body) => {
  const { image_urls, video_urls } = body;

  if (!image_urls && !video_urls) {
    throw new BadRequestError('At least one of image_urls or video_urls is required');
  }

  if (image_urls) validateUrls(image_urls, 'image_urls');
  if (video_urls) validateUrls(video_urls, 'video_urls');
};


module.exports = { validateCreateProduct, validateAddMedia };